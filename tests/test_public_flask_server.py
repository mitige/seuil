import importlib
import sys
import unittest
from unittest import mock


with mock.patch.object(sys, "argv", ["serve.py"]):
    serve = importlib.import_module("serve")


class PublicFlaskServerTests(unittest.TestCase):
    def setUp(self):
        self.app = serve.create_app()
        self.client = self.app.test_client()

    def test_index_is_served_with_security_headers(self):
        response = self.client.get("/", buffered=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Seuil", response.data)
        self.assertEqual(response.headers["X-Content-Type-Options"], "nosniff")
        self.assertEqual(response.headers["X-Frame-Options"], "DENY")
        self.assertEqual(response.headers["Referrer-Policy"], "no-referrer")
        self.assertIn("default-src 'self'", response.headers["Content-Security-Policy"])
        self.assertIn("frame-ancestors 'none'", response.headers["Content-Security-Policy"])

    def test_only_allowlisted_public_files_are_served(self):
        for path in ("/serve.py", "/README.md", "/docs/superpowers/plans/2026-05-24-ia-phase2a-fonctions.md", "/.git/config"):
            with self.subTest(path=path):
                response = self.client.get(path, buffered=True)
                self.assertEqual(response.status_code, 404)

        self.assertEqual(self.client.get("/styles.css", buffered=True).status_code, 200)
        self.assertEqual(self.client.get("/fonts/space-grotesk-latin.woff2", buffered=True).status_code, 200)
        self.assertEqual(self.client.get("/psychonaut-data.js", buffered=True).status_code, 200)

    def test_ai_endpoints_do_not_leak_secret_and_analyze_requires_csrf(self):
        status_response = self.client.get("/api/ai/status")
        self.assertEqual(status_response.status_code, 200)
        payload = status_response.get_json()
        self.assertEqual(payload["provider"], "openrouter")
        self.assertIn("configured", payload)
        self.assertNotIn("token", payload)
        self.assertNotIn("apiKey", payload)

        analyze_response = self.client.post(
            "/api/ai/analyze",
            json={"prompt": "test"},
        )
        self.assertEqual(analyze_response.status_code, 403)


if __name__ == "__main__":
    unittest.main()
