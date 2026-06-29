"""Tests de l'authentification serveur et de l'API d'administration."""

import base64
import importlib
import secrets
import sys
import tempfile
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


class AuthApiTestCase(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db_path = Path(self.tmp.name) / "state.sqlite3"
        self.app = serve.create_app(state_db_path=self.db_path)
        self.client = self.app.test_client()

    def tearDown(self):
        self.tmp.cleanup()

    def register(self, client, username, material=None, recovery=None, expect=201):
        material = material or make_material()
        payload = dict(material, username=username, displayName=username.title())
        if recovery:
            payload["recovery"] = recovery
        response = client.post("/api/auth/register", json=payload, headers=CSRF)
        self.assertEqual(response.status_code, expect, response.get_json())
        return material, response

    def login(self, client, username, auth_hash, expect=200):
        response = client.post(
            "/api/auth/login",
            json={"username": username, "authHash": auth_hash},
            headers=CSRF,
        )
        self.assertEqual(response.status_code, expect, response.get_json())
        return response


class RegistrationAndLoginTests(AuthApiTestCase):
    def test_first_account_becomes_admin_and_gets_session(self):
        material, response = self.register(self.client, "op")
        data = response.get_json()
        self.assertEqual(data["user"]["role"], "admin")
        self.assertEqual(data["crypto"]["wrappedKey"], material["wrappedKey"])
        self.assertIn("seuil_session=", response.headers.get("Set-Cookie", ""))
        self.assertIn("HttpOnly", response.headers.get("Set-Cookie", ""))

        me = self.client.get("/api/auth/me")
        self.assertEqual(me.status_code, 200)
        self.assertEqual(me.get_json()["user"]["username"], "op")

    def test_second_account_is_regular_user(self):
        self.register(self.client, "op")
        other = self.app.test_client()
        _, response = self.register(other, "alpha")
        self.assertEqual(response.get_json()["user"]["role"], "user")

    def test_register_requires_csrf_header(self):
        material = make_material()
        response = self.client.post(
            "/api/auth/register",
            json=dict(material, username="op"),
        )
        self.assertEqual(response.status_code, 403)

    def test_csrf_origin_allows_public_host_behind_tunnel(self):
        material = make_material()
        response = self.client.post(
            "/api/auth/register",
            json=dict(material, username="op"),
            headers={
                "X-Seuil-Csrf": "1",
                "Origin": "https://seuil.pro",
                "Host": "127.0.0.1:12345",
                "X-Forwarded-Proto": "https",
                "X-Forwarded-Host": "seuil.pro",
            },
        )
        self.assertEqual(response.status_code, 201, response.get_json())

    def test_csrf_origin_allows_forwarded_proto_with_public_host(self):
        material = make_material()
        response = self.client.post(
            "/api/auth/register",
            json=dict(material, username="op"),
            headers={
                "X-Seuil-Csrf": "1",
                "Origin": "https://seuil.pro",
                "Host": "seuil.pro",
                "X-Forwarded-Proto": "https",
            },
        )
        self.assertEqual(response.status_code, 201, response.get_json())

    def test_csrf_origin_allows_configured_public_origin_without_proxy_headers(self):
        material = make_material()
        response = self.client.post(
            "/api/auth/register",
            json=dict(material, username="op"),
            headers={
                "X-Seuil-Csrf": "1",
                "Origin": "https://seuil.pro",
                "Host": "127.0.0.1:12345",
            },
        )
        self.assertEqual(response.status_code, 201, response.get_json())

    def test_csrf_origin_allows_configured_www_public_origin_without_proxy_headers(self):
        material = make_material()
        response = self.client.post(
            "/api/auth/register",
            json=dict(material, username="op"),
            headers={
                "X-Seuil-Csrf": "1",
                "Origin": "https://www.seuil.pro",
                "Host": "127.0.0.1:12345",
            },
        )
        self.assertEqual(response.status_code, 201, response.get_json())

    def test_register_closed_signup(self):
        self.register(self.client, "op")  # bootstrap admin
        self.client.put("/api/admin/settings", json={"openSignup": False}, headers=CSRF)

        other = self.app.test_client()
        material = make_material()
        response = other.post(
            "/api/auth/register",
            json=dict(material, username="newuser"),
            headers=CSRF,
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.get_json()["code"], "signup_closed")

    def test_duplicate_username_rejected(self):
        self.register(self.client, "op")
        other = self.app.test_client()
        material = make_material()
        response = other.post(
            "/api/auth/register",
            json=dict(material, username="op"),
            headers=CSRF,
        )
        self.assertEqual(response.status_code, 409)

    def test_prelogin_returns_real_salt_for_known_user_and_fake_for_unknown(self):
        material, _ = self.register(self.client, "op")
        known = self.client.post("/api/auth/prelogin", json={"username": "op"}, headers=CSRF)
        self.assertEqual(known.get_json()["authSalt"], material["authSalt"])

        unknown1 = self.client.post("/api/auth/prelogin", json={"username": "ghost"}, headers=CSRF)
        unknown2 = self.client.post("/api/auth/prelogin", json={"username": "ghost"}, headers=CSRF)
        self.assertEqual(unknown1.status_code, 200)
        # Déterministe : pas d'oracle d'existence par variation du sel.
        self.assertEqual(unknown1.get_json()["authSalt"], unknown2.get_json()["authSalt"])

    def test_login_logout_cycle(self):
        material, _ = self.register(self.client, "op")
        fresh = self.app.test_client()
        response = self.login(fresh, "op", material["authHash"])
        self.assertEqual(response.get_json()["user"]["username"], "op")

        logout = fresh.post("/api/auth/logout", headers=CSRF)
        self.assertEqual(logout.status_code, 200)
        self.assertEqual(fresh.get("/api/auth/me").status_code, 401)

    def test_delete_own_account_removes_vault_sessions_and_logs_out(self):
        self.register(self.client, "op")
        member = self.app.test_client()
        material, register_response = self.register(member, "alpha")
        user = register_response.get_json()["user"]
        db = serve.db_connect(self.db_path)
        try:
            vault_id = db.execute("SELECT vault_id FROM users WHERE id = ?", (user["id"],)).fetchone()["vault_id"]
        finally:
            db.close()
        member.put("/api/vault", json={"blob": "ENCRYPTED:a:b:1"}, headers=CSRF)

        response = member.delete("/api/auth/account", headers=CSRF)
        self.assertEqual(response.status_code, 200, response.get_json())
        self.assertIn("seuil_session=;", response.headers.get("Set-Cookie", ""))
        self.assertEqual(member.get("/api/auth/me").status_code, 401)
        self.login(self.app.test_client(), "alpha", material["authHash"], expect=401)

        db = serve.db_connect(self.db_path)
        try:
            self.assertIsNone(db.execute("SELECT id FROM users WHERE id = ?", (user["id"],)).fetchone())
            self.assertIsNone(db.execute("SELECT vault_id FROM vaults WHERE vault_id = ?", (vault_id,)).fetchone())
            self.assertEqual(
                db.execute("SELECT COUNT(*) FROM sessions WHERE user_id = ?", (user["id"],)).fetchone()[0],
                0,
            )
        finally:
            db.close()

    def test_last_admin_cannot_delete_own_account(self):
        self.register(self.client, "op")

        response = self.client.delete("/api/auth/account", headers=CSRF)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(self.client.get("/api/auth/me").status_code, 200)

    def test_session_survives_idle_gap_until_explicit_logout(self):
        self.register(self.client, "op")
        now = int(serve.time.time())
        db = serve.db_connect(self.db_path)
        try:
            db.execute("UPDATE sessions SET last_seen = ?", (now - 2 * 3600,))
            db.commit()
        finally:
            db.close()

        me = self.client.get("/api/auth/me")
        self.assertEqual(me.status_code, 200, me.get_json())
        self.assertEqual(me.get_json()["user"]["username"], "op")

    def test_authenticated_request_refreshes_session_cookie_and_expiry(self):
        self.register(self.client, "op")
        now = int(serve.time.time())
        db = serve.db_connect(self.db_path)
        try:
            db.execute(
                "UPDATE sessions SET last_seen = ?, expires_at = ?",
                (now - 2 * 3600, now + 60),
            )
            db.commit()
        finally:
            db.close()

        me = self.client.get("/api/auth/me")
        self.assertEqual(me.status_code, 200, me.get_json())
        cookie = me.headers.get("Set-Cookie", "")
        self.assertIn("{}=".format(serve.SESSION_COOKIE), cookie)
        self.assertIn("Max-Age={}".format(self.app.config["SESSION_ABSOLUTE_SECONDS"]), cookie)

        db = serve.db_connect(self.db_path)
        try:
            refreshed = db.execute("SELECT expires_at FROM sessions").fetchone()["expires_at"]
        finally:
            db.close()
        self.assertGreaterEqual(refreshed, now + self.app.config["SESSION_ABSOLUTE_SECONDS"] - 5)

    def test_wrong_password_locks_account_after_five_attempts(self):
        material, _ = self.register(self.client, "op")
        fresh = self.app.test_client()
        bad_hash = base64.b64encode(secrets.token_bytes(32)).decode()
        for _ in range(4):
            self.login(fresh, "op", bad_hash, expect=401)
        self.login(fresh, "op", bad_hash, expect=401)  # 5e échec → verrouillage
        self.login(fresh, "op", material["authHash"], expect=423)

    def test_disabled_account_cannot_login(self):
        material, response = self.register(self.client, "op")
        other_material, other_resp = self.register(self.app.test_client(), "alpha")
        user_id = other_resp.get_json()["user"]["id"]
        self.client.patch(
            "/api/admin/users/{}".format(user_id), json={"active": False}, headers=CSRF
        )
        self.login(self.app.test_client(), "alpha", other_material["authHash"], expect=403)


class PasswordChangeTests(AuthApiTestCase):
    def test_change_password_revokes_other_sessions(self):
        material, _ = self.register(self.client, "op")
        other = self.app.test_client()
        self.login(other, "op", material["authHash"])

        new_material = make_material()
        response = self.client.post(
            "/api/auth/change-password",
            json={
                "currentAuthHash": material["authHash"],
                "newAuthSalt": new_material["authSalt"],
                "newAuthHash": new_material["authHash"],
                "newKekSalt": new_material["kekSalt"],
                "newWrappedKey": new_material["wrappedKey"],
            },
            headers=CSRF,
        )
        self.assertEqual(response.status_code, 200, response.get_json())

        # La session de l'autre onglet est révoquée, la session courante survit.
        self.assertEqual(other.get("/api/auth/me").status_code, 401)
        self.assertEqual(self.client.get("/api/auth/me").status_code, 200)

        # L'ancien mot de passe ne fonctionne plus, le nouveau oui.
        self.login(self.app.test_client(), "op", material["authHash"], expect=401)
        self.login(self.app.test_client(), "op", new_material["authHash"], expect=200)

    def test_change_password_requires_correct_current(self):
        material, _ = self.register(self.client, "op")
        new_material = make_material()
        response = self.client.post(
            "/api/auth/change-password",
            json={
                "currentAuthHash": base64.b64encode(secrets.token_bytes(32)).decode(),
                "newAuthSalt": new_material["authSalt"],
                "newAuthHash": new_material["authHash"],
                "newKekSalt": new_material["kekSalt"],
                "newWrappedKey": new_material["wrappedKey"],
            },
            headers=CSRF,
        )
        self.assertEqual(response.status_code, 403)


class RecoveryTests(AuthApiTestCase):
    def test_recovery_flow_resets_password_and_is_single_use(self):
        recovery = make_material()
        material, _ = self.register(self.client, "op", recovery=recovery)

        fresh = self.app.test_client()
        bad = fresh.post(
            "/api/auth/recovery/init",
            json={"username": "op", "recoveryAuthHash": base64.b64encode(secrets.token_bytes(32)).decode()},
            headers=CSRF,
        )
        self.assertEqual(bad.status_code, 401)

        init = fresh.post(
            "/api/auth/recovery/init",
            json={"username": "op", "recoveryAuthHash": recovery["authHash"]},
            headers=CSRF,
        )
        self.assertEqual(init.status_code, 200, init.get_json())
        payload = init.get_json()
        self.assertEqual(payload["recoveryWrappedKey"], recovery["wrappedKey"])
        token = payload["recoveryToken"]

        new_material = make_material()
        new_recovery = make_material()
        complete = fresh.post(
            "/api/auth/recovery/complete",
            json=dict(new_material, recoveryToken=token, recovery=new_recovery),
            headers=CSRF,
        )
        self.assertEqual(complete.status_code, 200, complete.get_json())

        # Jeton à usage unique.
        replay = fresh.post(
            "/api/auth/recovery/complete",
            json=dict(make_material(), recoveryToken=token),
            headers=CSRF,
        )
        self.assertEqual(replay.status_code, 401)

        # L'ancienne session (pré-récupération) est révoquée.
        self.assertEqual(self.client.get("/api/auth/me").status_code, 401)
        # Le nouveau mot de passe fonctionne.
        self.login(self.app.test_client(), "op", new_material["authHash"], expect=200)


class SessionManagementTests(AuthApiTestCase):
    def test_list_and_revoke_own_sessions(self):
        material, _ = self.register(self.client, "op")
        other = self.app.test_client()
        self.login(other, "op", material["authHash"])

        listing = self.client.get("/api/auth/sessions")
        sessions = listing.get_json()["sessions"]
        self.assertEqual(len(sessions), 2)
        current = [s for s in sessions if s["current"]]
        self.assertEqual(len(current), 1)

        revoke = self.client.post("/api/auth/sessions/revoke-others", headers=CSRF)
        self.assertEqual(revoke.get_json()["deleted"], 1)
        self.assertEqual(other.get("/api/auth/me").status_code, 401)


class AdminApiTests(AuthApiTestCase):
    def setUp(self):
        super().setUp()
        self.admin_material, response = self.register(self.client, "op")
        self.admin_id = response.get_json()["user"]["id"]

    def create_member(self, username="alpha"):
        material = make_material()
        response = self.client.post(
            "/api/admin/users",
            json=dict(material, username=username, displayName=username.title(), role="user"),
            headers=CSRF,
        )
        self.assertEqual(response.status_code, 201, response.get_json())
        return material, response.get_json()["user"]

    def test_non_admin_cannot_access_admin_endpoints(self):
        member_material, member = self.create_member()
        member_client = self.app.test_client()
        self.login(member_client, "alpha", member_material["authHash"])

        self.assertEqual(member_client.get("/api/admin/users").status_code, 403)
        self.assertEqual(member_client.get("/api/admin/overview").status_code, 403)
        self.assertEqual(member_client.get("/api/admin/audit").status_code, 403)

    def test_admin_created_user_must_change_password(self):
        material, user = self.create_member()
        self.assertTrue(user["mustChangePassword"])
        login = self.login(self.app.test_client(), "alpha", material["authHash"])
        self.assertTrue(login.get_json()["user"]["mustChangePassword"])

    def test_role_and_active_guards(self):
        _, user = self.create_member()
        # Auto-rétrogradation interdite
        self.assertEqual(
            self.client.patch(
                "/api/admin/users/{}".format(self.admin_id), json={"role": "user"}, headers=CSRF
            ).status_code,
            400,
        )
        # Auto-désactivation interdite
        self.assertEqual(
            self.client.patch(
                "/api/admin/users/{}".format(self.admin_id), json={"active": False}, headers=CSRF
            ).status_code,
            400,
        )
        # Promotion puis rétrogradation d'un autre compte
        self.assertEqual(
            self.client.patch(
                "/api/admin/users/{}".format(user["id"]), json={"role": "admin"}, headers=CSRF
            ).status_code,
            200,
        )
        self.assertEqual(
            self.client.patch(
                "/api/admin/users/{}".format(user["id"]), json={"role": "user"}, headers=CSRF
            ).status_code,
            200,
        )

    def test_deactivating_user_revokes_their_sessions(self):
        material, user = self.create_member()
        member_client = self.app.test_client()
        self.login(member_client, "alpha", material["authHash"])
        self.client.patch(
            "/api/admin/users/{}".format(user["id"]), json={"active": False}, headers=CSRF
        )
        self.assertEqual(member_client.get("/api/auth/me").status_code, 401)

    def test_admin_reset_password_sets_must_change_and_revokes_sessions(self):
        material, user = self.create_member()
        member_client = self.app.test_client()
        self.login(member_client, "alpha", material["authHash"])

        new_auth = {
            "authSalt": base64.b64encode(secrets.token_bytes(16)).decode(),
            "authHash": base64.b64encode(secrets.token_bytes(32)).decode(),
        }
        response = self.client.post(
            "/api/admin/users/{}/reset-password".format(user["id"]),
            json=new_auth,
            headers=CSRF,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(member_client.get("/api/auth/me").status_code, 401)

        login = self.login(self.app.test_client(), "alpha", new_auth["authHash"])
        self.assertTrue(login.get_json()["user"]["mustChangePassword"])

    def test_delete_user_removes_vault_and_sessions(self):
        material, user = self.create_member()
        member_client = self.app.test_client()
        self.login(member_client, "alpha", material["authHash"])
        member_client.put("/api/vault", json={"blob": "ENCRYPTED:a:b:1"}, headers=CSRF)

        response = self.client.delete("/api/admin/users/{}".format(user["id"]), headers=CSRF)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(member_client.get("/api/auth/me").status_code, 401)

        users = self.client.get("/api/admin/users").get_json()["users"]
        self.assertEqual(len(users), 1)

    def test_cannot_delete_self_or_last_admin(self):
        self.assertEqual(
            self.client.delete("/api/admin/users/{}".format(self.admin_id), headers=CSRF).status_code,
            400,
        )

    def test_overview_audit_and_sessions(self):
        self.create_member()
        overview = self.client.get("/api/admin/overview")
        self.assertEqual(overview.status_code, 200)
        stats = overview.get_json()["stats"]
        self.assertEqual(stats["users"], 2)
        self.assertEqual(stats["admins"], 1)
        self.assertGreaterEqual(stats["sessions"], 1)
        self.assertEqual(overview.get_json()["server"]["version"], serve.VERSION)

        audit = self.client.get("/api/admin/audit?limit=50")
        actions = [entry["action"] for entry in audit.get_json()["entries"]]
        self.assertIn("user.register", actions)
        self.assertIn("user.created", actions)

        filtered = self.client.get("/api/admin/audit?action=user.created")
        self.assertTrue(all(e["action"].startswith("user.created")
                            for e in filtered.get_json()["entries"]))

        sessions = self.client.get("/api/admin/sessions")
        self.assertEqual(sessions.status_code, 200)
        self.assertGreaterEqual(len(sessions.get_json()["sessions"]), 1)

    def test_admin_sessions_are_paginated_like_audit_log(self):
        now = int(serve.time.time())
        db = serve.db_connect(self.db_path)
        try:
            for idx in range(35):
                db.execute(
                    "INSERT INTO sessions "
                    "(id, user_id, token_hash, created_at, last_seen, expires_at, ip, user_agent) "
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    (
                        "session-{:02d}".format(idx),
                        self.admin_id,
                        "hash-{:02d}".format(idx),
                        now - 100 - idx,
                        now + 1000 - idx,
                        now + 5000,
                        "127.0.0.1",
                        "pytest",
                    ),
                )
            db.commit()
        finally:
            db.close()

        first = self.client.get("/api/admin/sessions")
        self.assertEqual(first.status_code, 200)
        first_sessions = first.get_json()["sessions"]
        self.assertEqual(len(first_sessions), 30)
        self.assertEqual(first_sessions[0]["id"], "session-00")
        self.assertEqual(first_sessions[-1]["id"], "session-29")

        last = first_sessions[-1]
        second = self.client.get(
            "/api/admin/sessions?limit=30&before={}:{}".format(last["lastSeen"], last["id"])
        )
        self.assertEqual(second.status_code, 200)
        second_sessions = second.get_json()["sessions"]
        self.assertGreaterEqual(len(second_sessions), 5)
        self.assertEqual(second_sessions[0]["id"], "session-30")
        self.assertFalse({s["id"] for s in first_sessions} & {s["id"] for s in second_sessions})

        small = self.client.get("/api/admin/sessions?limit=5")
        self.assertEqual(len(small.get_json()["sessions"]), 5)

    def test_admin_user_presence_uses_recent_page_activity_not_open_session(self):
        material, user = self.create_member()
        member_client = self.app.test_client()
        self.login(member_client, "alpha", material["authHash"])
        now = int(serve.time.time())
        db = serve.db_connect(self.db_path)
        try:
            db.execute(
                "UPDATE sessions SET last_seen = ?, expires_at = ? WHERE user_id = ?",
                (
                    now - self.app.config["ONLINE_PRESENCE_SECONDS"] - 30,
                    now + self.app.config["SESSION_ABSOLUTE_SECONDS"],
                    user["id"],
                ),
            )
            db.commit()
        finally:
            db.close()

        users = self.client.get("/api/admin/users").get_json()["users"]
        member = next(item for item in users if item["username"] == "alpha")
        self.assertEqual(member["sessionCount"], 1)
        self.assertEqual(member["onlineSessionCount"], 0)

        heartbeat = member_client.post("/api/auth/presence", json={}, headers=CSRF)
        self.assertEqual(heartbeat.status_code, 200, heartbeat.get_json())
        users = self.client.get("/api/admin/users").get_json()["users"]
        member = next(item for item in users if item["username"] == "alpha")
        self.assertEqual(member["sessionCount"], 1)
        self.assertEqual(member["onlineSessionCount"], 1)

    def test_settings_round_trip(self):
        get = self.client.get("/api/admin/settings")
        self.assertTrue(get.get_json()["settings"]["openSignup"])
        put = self.client.put("/api/admin/settings", json={"openSignup": False}, headers=CSRF)
        self.assertFalse(put.get_json()["settings"]["openSignup"])
        # /api/auth/me reflète le réglage même déconnecté.
        anon = self.app.test_client()
        me = anon.get("/api/auth/me")
        self.assertEqual(me.status_code, 401)
        self.assertFalse(me.get_json()["settings"]["openSignup"])


if __name__ == "__main__":
    unittest.main()
