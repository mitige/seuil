import importlib
import json
import sys
import unittest
from unittest import mock


with mock.patch.object(sys, "argv", ["serve.py"]):
    serve = importlib.import_module("serve")


class AiMaintenanceTests(unittest.TestCase):
    def setUp(self):
        self.client = serve.create_app().test_client()

    def test_status_endpoint_is_in_maintenance_and_does_not_leak_token(self):
        response = self.client.get("/api/ai/status")

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.headers.get("Cache-Control"), "no-store")
        payload = response.get_json()
        self.assertFalse(payload["bridge"])
        self.assertTrue(payload["maintenance"])
        self.assertNotIn("token", payload)

    def test_analyze_endpoint_refuses_requests(self):
        response = self.client.post(
            "/api/ai/analyze",
            data=json.dumps({"provider": "codex", "prompt": "test"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 503)
        payload = response.get_json()
        self.assertFalse(payload["ok"])
        self.assertTrue(payload["maintenance"])


if __name__ == "__main__":
    unittest.main()
