"""Tests du coffre chiffré lié au compte (nouvelle API session)."""

import base64
import importlib
import secrets
import sqlite3
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest import mock


with mock.patch.object(sys, "argv", ["serve.py"]):
    serve = importlib.import_module("serve")


CSRF = {"X-Seuil-Csrf": "1"}


def make_material():
    return {
        "authSalt": base64.b64encode(secrets.token_bytes(16)).decode(),
        "authHash": base64.b64encode(secrets.token_bytes(32)).decode(),
        "kekSalt": base64.b64encode(secrets.token_bytes(16)).decode(),
        "wrappedKey": "v1:{}:{}".format(
            base64.b64encode(secrets.token_bytes(12)).decode(),
            base64.b64encode(secrets.token_bytes(48)).decode(),
        ),
    }


class VaultApiTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db_path = Path(self.tmp.name) / "state.sqlite3"
        self.app = serve.create_app(state_db_path=self.db_path)
        self.client = self.app.test_client()

    def tearDown(self):
        self.tmp.cleanup()

    def register(self, client, username, material=None):
        material = material or make_material()
        response = client.post(
            "/api/auth/register",
            json=dict(material, username=username, displayName=username.title()),
            headers=CSRF,
        )
        self.assertEqual(response.status_code, 201, response.get_json())
        return material, response.get_json()

    def test_vault_round_trip_and_reset(self):
        self.register(self.client, "alice")
        blob = "ENCRYPTED:abc:def:0123456789"

        put = self.client.put("/api/vault", json={"blob": blob}, headers=CSRF)
        self.assertEqual(put.status_code, 200)

        get = self.client.get("/api/vault")
        self.assertEqual(get.status_code, 200)
        self.assertEqual(get.headers["Cache-Control"], "no-store")
        self.assertEqual(get.get_json()["blob"], blob)

        delete = self.client.delete("/api/vault", headers=CSRF)
        self.assertEqual(delete.status_code, 200)
        self.assertIsNone(self.client.get("/api/vault").get_json()["blob"])

    def test_vault_requires_session(self):
        self.assertEqual(self.client.get("/api/vault").status_code, 401)
        self.assertEqual(
            self.client.put("/api/vault", json={"blob": "ENCRYPTED:a:b:1"}, headers=CSRF).status_code,
            401,
        )

    def test_vaults_are_isolated_between_users(self):
        first = self.app.test_client()
        second = self.app.test_client()
        self.register(first, "alice")
        self.register(second, "bob")

        first.put("/api/vault", json={"blob": "ENCRYPTED:a:b:111"}, headers=CSRF)
        second.put("/api/vault", json={"blob": "ENCRYPTED:a:b:222"}, headers=CSRF)

        self.assertEqual(first.get("/api/vault").get_json()["blob"], "ENCRYPTED:a:b:111")
        self.assertEqual(second.get("/api/vault").get_json()["blob"], "ENCRYPTED:a:b:222")

    def test_rejects_plaintext_and_oversized_blobs(self):
        self.register(self.client, "alice")

        plain = self.client.put("/api/vault", json={"blob": "{\"sessions\":[]}"}, headers=CSRF)
        self.assertEqual(plain.status_code, 400)

        large = "ENCRYPTED:" + ("x" * (serve.MAX_STATE_BLOB + 1))
        # MAX_CONTENT_LENGTH peut intercepter avant notre propre contrôle (413 dans les deux cas)
        response = self.client.put("/api/vault", json={"blob": large}, headers=CSRF)
        self.assertEqual(response.status_code, 413)

    def test_mutating_requests_require_csrf_header(self):
        self.register(self.client, "alice")
        response = self.client.put("/api/vault", json={"blob": "ENCRYPTED:a:b:1"})
        self.assertEqual(response.status_code, 403)

    def test_legacy_vault_import(self):
        self.register(self.client, "alice")
        legacy_id = secrets.token_urlsafe(32)
        legacy_key = secrets.token_urlsafe(48)
        now = int(time.time())
        db = sqlite3.connect(self.db_path)
        db.execute(
            "INSERT INTO vaults (vault_id, vault_key_hash, blob, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            (legacy_id, serve.hash_vault_key(legacy_key), "ENCRYPTED:legacy:data:123", now, now),
        )
        db.commit()
        db.close()

        bad = self.client.post(
            "/api/vault/import-legacy",
            json={"vaultId": legacy_id, "serverKey": secrets.token_urlsafe(48)},
            headers=CSRF,
        )
        self.assertEqual(bad.status_code, 403)

        good = self.client.post(
            "/api/vault/import-legacy",
            json={"vaultId": legacy_id, "serverKey": legacy_key},
            headers=CSRF,
        )
        self.assertEqual(good.status_code, 200, good.get_json())
        self.assertEqual(self.client.get("/api/vault").get_json()["blob"], "ENCRYPTED:legacy:data:123")

        # L'ancien coffre est consommé : un second import échoue.
        again = self.client.post(
            "/api/vault/import-legacy",
            json={"vaultId": legacy_id, "serverKey": legacy_key},
            headers=CSRF,
        )
        self.assertEqual(again.status_code, 404)


if __name__ == "__main__":
    unittest.main()
