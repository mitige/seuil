import json
import importlib
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


with mock.patch.object(sys, "argv", ["serve.py"]):
    serve = importlib.import_module("serve")


CSRF = {"X-Seuil-Csrf": "1"}


class AiOpenRouterTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db_path = Path(self.tmp.name) / "state.sqlite3"
        self.app = serve.create_app(state_db_path=self.db_path)
        self.client = self.app.test_client()

    def tearDown(self):
        self.tmp.cleanup()

    def register(self, username="op"):
        from tests.test_auth_api import make_material

        material = make_material()
        payload = dict(material, username=username, displayName=username.title())
        response = self.client.post("/api/auth/register", json=payload, headers=CSRF)
        self.assertEqual(response.status_code, 201, response.get_json())
        return material

    @mock.patch.object(serve, "read_openrouter_api_key", return_value="test-secret")
    def test_status_endpoint_reports_openrouter_without_leaking_token(self, _key):
        response = self.client.get("/api/ai/status")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers.get("Cache-Control"), "no-store")
        payload = response.get_json()
        self.assertTrue(payload["bridge"])
        self.assertTrue(payload["configured"])
        self.assertEqual(payload["provider"], "openrouter")
        self.assertEqual(payload["model"], "nvidia/nemotron-3-ultra-550b-a55b:free")
        self.assertNotIn("token", payload)
        self.assertNotIn("apiKey", payload)

    def test_analyze_requires_csrf_then_authenticated_user(self):
        response = self.client.post(
            "/api/ai/analyze",
            json={"prompt": "test"},
        )
        self.assertEqual(response.status_code, 403)

        response = self.client.post("/api/ai/analyze", json={"prompt": "test"}, headers=CSRF)
        self.assertEqual(response.status_code, 401)

    @mock.patch.object(serve, "call_openrouter_chat", return_value="Réponse prudente.")
    def test_analyze_uses_server_side_openrouter_for_logged_in_user(self, openrouter):
        self.register()
        response = self.client.post(
            "/api/ai/analyze",
            json={"prompt": "Que vérifier avant un mélange ?"},
            headers=CSRF,
        )

        self.assertEqual(response.status_code, 200, response.get_json())
        payload = response.get_json()
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["output"], "Réponse prudente.")
        self.assertEqual(payload["model"], "nvidia/nemotron-3-ultra-550b-a55b:free")
        openrouter.assert_called_once_with("Que vérifier avant un mélange ?")

    @mock.patch.object(serve, "opencode_zen_available", return_value=True)
    @mock.patch.object(serve, "call_opencode_zen_chat", return_value="Réponse zen.")
    @mock.patch.object(serve, "call_openrouter_chat", side_effect=RuntimeError("OpenRouter quota atteint."))
    def test_analyze_falls_back_to_opencode_zen_when_openrouter_is_exhausted(self, openrouter, opencode, _available):
        self.register()
        response = self.client.post(
            "/api/ai/analyze",
            json={"prompt": "Analyse mes tendances sans section danger."},
            headers=CSRF,
        )

        self.assertEqual(response.status_code, 200, response.get_json())
        payload = response.get_json()
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["output"], "Réponse zen.")
        self.assertEqual(payload["provider"], "opencode")
        self.assertEqual(payload["model"], serve.OPENCODE_DISPLAY_MODEL)
        openrouter.assert_called_once_with("Analyse mes tendances sans section danger.")
        opencode.assert_called_once_with("Analyse mes tendances sans section danger.")

    @mock.patch.object(serve, "resolve_opencode_cmd", return_value="/usr/bin/opencode")
    def test_opencode_fallback_requires_matching_provider_credentials(self, _cmd):
        auth_path = Path(self.tmp.name) / "auth.json"

        auth_path.write_text(json.dumps({"openrouter": {"type": "api", "key": "redacted"}}), encoding="utf-8")
        with mock.patch.object(serve, "OPENCODE_AUTH_PATH", str(auth_path)), mock.patch.object(
            serve, "OPENCODE_MODEL", "opencode/gpt-5.1-codex"
        ):
            self.assertFalse(serve.opencode_zen_available())

        auth_path.write_text(json.dumps({"opencode": {"type": "api", "key": "redacted"}}), encoding="utf-8")
        with mock.patch.object(serve, "OPENCODE_AUTH_PATH", str(auth_path)), mock.patch.object(
            serve, "OPENCODE_MODEL", "opencode/gpt-5.1-codex"
        ):
            self.assertTrue(serve.opencode_zen_available())


if __name__ == "__main__":
    unittest.main()
