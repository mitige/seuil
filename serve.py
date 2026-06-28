#!/usr/bin/env python3
"""Seuil - serveur Flask/Waitress : fichiers statiques, authentification serveur,
coffres chiffrés zéro-connaissance et API d'administration.

Modèle de sécurité
  - Le navigateur ne transmet JAMAIS le mot de passe : il envoie un « authHash »
    (PBKDF2-SHA256 côté client), que le serveur re-hache avec son propre sel
    avant stockage. Une fuite de la base ne permet ni de retrouver le mot de
    passe, ni de rejouer l'authHash.
  - Les données du coffre arrivent déjà chiffrées (AES-GCM côté client). La clé
    de données est stockée « enveloppée » (wrappedKey) : chiffrée côté client
    par une clé dérivée du mot de passe. Le serveur ne peut pas la lire.
  - Sessions par cookie HttpOnly + SameSite=Strict, expiration d'inactivité
    optionnelle, durée de vie longue et révocation individuelle.
  - Verrouillage de compte après échecs répétés, limitation de débit par IP,
    en-tête anti-CSRF obligatoire sur toute requête mutante, journal d'audit.
"""

import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import sys
import time
import uuid
from pathlib import Path
from urllib.parse import urlsplit

from flask import Flask, abort, g, jsonify, redirect, request, send_from_directory


VERSION = "2.0.0"
ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = int(os.environ.get("PORT") or (sys.argv[1] if len(sys.argv) > 1 else 12345))

AI_MAINTENANCE = True
AI_MAINTENANCE_MESSAGE = "Assistant IA en maintenance temporaire."

STATE_DB_PATH = ROOT / "instance" / "seuil_state.sqlite3"
MAX_STATE_BLOB = 512 * 1024
MAX_STATE_VAULTS = int(os.environ.get("SEUIL_MAX_STATE_VAULTS", "200"))
MAX_STATE_DB_BYTES = int(os.environ.get("SEUIL_MAX_STATE_DB_BYTES", str(50 * 1024 * 1024)))
STATE_WRITE_RATE_LIMIT = int(os.environ.get("SEUIL_STATE_WRITE_RATE_LIMIT", "240"))
STATE_RATE_WINDOW_SECONDS = int(os.environ.get("SEUIL_STATE_RATE_WINDOW_SECONDS", "3600"))

# --- Authentification ---
SESSION_COOKIE = "seuil_session"
# Par défaut, une session ne meurt pas à cause d'une simple période d'inactivité.
# Elle reste révocable par déconnexion, changement de mot de passe, action admin
# ou expiration longue du cookie.
SESSION_IDLE_SECONDS = int(os.environ.get("SEUIL_SESSION_IDLE_SECONDS", "0"))
SESSION_ABSOLUTE_SECONDS = int(os.environ.get("SEUIL_SESSION_ABSOLUTE_SECONDS", str(365 * 86400)))
ONLINE_PRESENCE_SECONDS = int(os.environ.get("SEUIL_ONLINE_PRESENCE_SECONDS", "120"))
LOCK_THRESHOLD = 5
LOCK_SECONDS = 5 * 60
SERVER_HASH_ITERATIONS = 100_000
RECOVERY_TOKEN_TTL = 10 * 60
CSRF_HEADER = "X-Seuil-Csrf"
PUBLIC_ORIGINS = os.environ.get("SEUIL_PUBLIC_ORIGINS", "https://seuil.pro,https://www.seuil.pro")

USERNAME_RE = re.compile(r"^[a-z0-9_-]{2,32}$")
B64_RE = re.compile(r"^[A-Za-z0-9+/=_-]{8,512}$")
WRAPPED_KEY_RE = re.compile(r"^v1:[A-Za-z0-9+/=_-]{8,64}:[A-Za-z0-9+/=_-]{8,512}$")
VAULT_ID_RE = re.compile(r"^[A-Za-z0-9_-]{32,80}$")
VAULT_KEY_RE = re.compile(r"^[A-Za-z0-9_-]{32,160}$")

# Limites de débit par IP : { bucket: (max, fenêtre en secondes) }
RATE_RULES = {
    "prelogin": (60, 3600),
    "login": (30, 900),
    "register": (10, 3600),
    "recovery": (10, 3600),
    "change-password": (20, 3600),
    "state-write": (STATE_WRITE_RATE_LIMIT, STATE_RATE_WINDOW_SECONDS),
    "admin-write": (120, 3600),
}

PUBLIC_FILES = {
    "index.html",
    "mentions-legales.html",
    "confidentialite.html",
    "conditions-utilisation.html",
    "accessibilite.html",
    "styles.css",
    "app.js",
    "ai.js",
    "auth.js",
    "ui.js",
    "i18n.js",
    "i18n-detail.js",
    "boot.js",
    "route-model.js",
    "db.js",
    "index-substances.js",
    "substances-data.js",
    "psychonaut-data.js",
    "substances-detail.js",
    "sw.js",
    "favicon.svg",
    "manifest.webmanifest",
    "robots.txt",
    "icon-192.png",
    "icon-512.png",
    "icon-180.png",
    "fonts/space-grotesk-latin.woff2",
    "fonts/space-grotesk-latin-ext.woff2",
    "fonts/jetbrains-mono-latin.woff2",
    "fonts/jetbrains-mono-latin-ext.woff2",
}

SECURITY_HEADERS = {
    "Content-Security-Policy": (
        "default-src 'self'; "
        "script-src 'self'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data:; "
        "font-src 'self' data:; "
        "connect-src 'self'; "
        "worker-src 'self'; "
        "object-src 'none'; "
        "base-uri 'self'; "
        "form-action 'self'; "
        "frame-ancestors 'none'; "
        "manifest-src 'self'; "
        "upgrade-insecure-requests"
    ),
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-Frame-Options": "DENY",
    "Strict-Transport-Security": "max-age=31536000",
}

START_TIME = time.time()


# ============================================================
# Base de données
# ============================================================

def db_connect(path):
    db = sqlite3.connect(path, timeout=10)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA busy_timeout=5000")
    db.execute("PRAGMA foreign_keys=ON")
    return db


def init_state_db(path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    db = db_connect(path)
    try:
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS vaults (
                vault_id TEXT PRIMARY KEY,
                vault_key_hash TEXT,
                blob TEXT,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                display_name TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user',
                active INTEGER NOT NULL DEFAULT 1,
                auth_salt TEXT NOT NULL,
                server_hash TEXT NOT NULL,
                kek_salt TEXT NOT NULL,
                wrapped_key TEXT NOT NULL,
                recovery_auth_salt TEXT,
                recovery_server_hash TEXT,
                recovery_kek_salt TEXT,
                recovery_wrapped_key TEXT,
                must_change_password INTEGER NOT NULL DEFAULT 0,
                failed_attempts INTEGER NOT NULL DEFAULT 0,
                locked_until INTEGER,
                vault_id TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                last_login INTEGER
            );
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                token_hash TEXT NOT NULL UNIQUE,
                created_at INTEGER NOT NULL,
                last_seen INTEGER NOT NULL,
                expires_at INTEGER NOT NULL,
                ip TEXT,
                user_agent TEXT
            );
            CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ts INTEGER NOT NULL,
                actor_id TEXT,
                actor_name TEXT,
                action TEXT NOT NULL,
                target TEXT,
                detail TEXT,
                ip TEXT
            );
            CREATE INDEX IF NOT EXISTS idx_audit_ts ON audit_log(ts);
            CREATE TABLE IF NOT EXISTS app_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            """
        )
        db.commit()
    finally:
        db.close()


def get_setting(path, key, default=None):
    db = db_connect(path)
    try:
        row = db.execute("SELECT value FROM app_settings WHERE key = ?", (key,)).fetchone()
        return row["value"] if row else default
    finally:
        db.close()


def set_setting(path, key, value):
    db = db_connect(path)
    try:
        db.execute(
            "INSERT INTO app_settings (key, value) VALUES (?, ?) "
            "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            (key, str(value)),
        )
        db.commit()
    finally:
        db.close()


def instance_secret(path):
    secret = get_setting(path, "instance_secret")
    if not secret:
        secret = secrets.token_hex(32)
        set_setting(path, "instance_secret", secret)
    return secret


def open_signup_enabled(path):
    return get_setting(path, "open_signup", "1") == "1"


# ============================================================
# Hachage côté serveur (de l'authHash client)
# ============================================================

def make_server_hash(auth_hash, iterations=SERVER_HASH_ITERATIONS, salt=None):
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", auth_hash.encode("utf-8"), salt, iterations)
    return "pbkdf2_sha256${}${}${}".format(iterations, salt.hex(), digest.hex())


def verify_server_hash(auth_hash, stored):
    try:
        algo, iterations, salt_hex, digest_hex = stored.split("$")
        if algo != "pbkdf2_sha256":
            return False
        candidate = hashlib.pbkdf2_hmac(
            "sha256", auth_hash.encode("utf-8"), bytes.fromhex(salt_hex), int(iterations)
        )
        return hmac.compare_digest(candidate.hex(), digest_hex)
    except (ValueError, AttributeError):
        return False


def hash_session_token(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def hash_vault_key(vault_key):
    return hashlib.sha256(vault_key.encode("utf-8")).hexdigest()


# ============================================================
# Application
# ============================================================

def create_app(state_db_path=None):
    app = Flask(__name__, static_folder=None)
    db_path = Path(state_db_path or STATE_DB_PATH)
    app.config.update(
        MAX_CONTENT_LENGTH=MAX_STATE_BLOB + 8192,
        SEND_FILE_MAX_AGE_DEFAULT=3600,
        STATE_DB_PATH=db_path,
        MAX_STATE_VAULTS=MAX_STATE_VAULTS,
        MAX_STATE_DB_BYTES=MAX_STATE_DB_BYTES,
        STATE_RATE_BUCKETS={},
        RECOVERY_TOKENS={},
        SESSION_IDLE_SECONDS=SESSION_IDLE_SECONDS,
        SESSION_ABSOLUTE_SECONDS=SESSION_ABSOLUTE_SECONDS,
        ONLINE_PRESENCE_SECONDS=ONLINE_PRESENCE_SECONDS,
    )
    init_state_db(db_path)
    instance_secret(db_path)

    # --------------------------------------------------------
    # Aides internes liées à la requête
    # --------------------------------------------------------

    def dbp():
        return app.config["STATE_DB_PATH"]

    def client_ip():
        remote = request.remote_addr or "unknown"
        forwarded = request.headers.get("X-Forwarded-For", "").split(",", 1)[0].strip()
        return (forwarded or remote)[:64]

    def rate_limited(bucket):
        rule = RATE_RULES.get(bucket)
        if not rule:
            return False
        limit, window = rule
        if limit <= 0:
            return False
        now = time.time()
        key = (bucket, client_ip())
        buckets = app.config["STATE_RATE_BUCKETS"]
        hits = [ts for ts in buckets.get(key, []) if now - ts < window]
        if len(hits) >= limit:
            buckets[key] = hits
            return True
        hits.append(now)
        buckets[key] = hits
        return False

    def json_error(message, status=400, **extra):
        payload = {"ok": False, "error": message}
        payload.update(extra)
        response = jsonify(payload)
        response.status_code = status
        response.headers["Cache-Control"] = "no-store"
        return response

    def json_ok(payload=None, status=200):
        body = {"ok": True}
        if payload:
            body.update(payload)
        response = jsonify(body)
        response.status_code = status
        response.headers["Cache-Control"] = "no-store"
        return response

    def normalized_origin(value):
        parsed = urlsplit(str(value or "").strip().rstrip("/"))
        if parsed.scheme not in ("http", "https") or not parsed.netloc:
            return None
        return "{}://{}".format(parsed.scheme, parsed.netloc.lower())

    def configured_public_origins():
        origins = set()
        for value in PUBLIC_ORIGINS.split(","):
            origin = normalized_origin(value)
            if origin:
                origins.add(origin)
        return origins

    def forwarded_origin():
        host = (request.headers.get("X-Forwarded-Host") or "").split(",", 1)[0].strip()
        if not host:
            return None
        proto = (request.headers.get("X-Forwarded-Proto") or "").split(",", 1)[0].strip() or request.scheme
        return normalized_origin("{}://{}".format(proto, host))

    def forwarded_proto_host_origin():
        proto = (request.headers.get("X-Forwarded-Proto") or "").split(",", 1)[0].strip()
        if not proto:
            return None
        return normalized_origin("{}://{}".format(proto, request.host))

    def require_csrf():
        """Toute requête mutante doit porter l'en-tête anti-CSRF et, si le
        navigateur fournit Origin, celui-ci doit correspondre à l'hôte."""
        if request.headers.get(CSRF_HEADER) != "1":
            abort(json_error("Requête refusée (en-tête de sécurité manquant).", 403))
        origin = request.headers.get("Origin")
        if origin:
            allowed = configured_public_origins() | {
                candidate
                for candidate in (
                    normalized_origin(request.host_url),
                    forwarded_origin(),
                    forwarded_proto_host_origin(),
                )
                if candidate
            }
            if normalized_origin(origin) not in allowed:
                abort(json_error("Origine non autorisée.", 403))

    def audit(action, target=None, detail=None, actor=None):
        actor = actor if actor is not None else getattr(g, "current_user", None)
        db = db_connect(dbp())
        try:
            db.execute(
                "INSERT INTO audit_log (ts, actor_id, actor_name, action, target, detail, ip) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    int(time.time()),
                    actor["id"] if actor else None,
                    actor["username"] if actor else None,
                    action,
                    target,
                    detail,
                    client_ip(),
                ),
            )
            db.commit()
        finally:
            db.close()

    def public_user(row, include_admin_fields=False):
        data = {
            "id": row["id"],
            "username": row["username"],
            "displayName": row["display_name"],
            "role": row["role"],
            "active": bool(row["active"]),
            "createdAt": row["created_at"],
            "lastLogin": row["last_login"],
            "mustChangePassword": bool(row["must_change_password"]),
            "hasRecovery": bool(row["recovery_server_hash"]),
        }
        if include_admin_fields:
            data.update(
                {
                    "failedAttempts": row["failed_attempts"],
                    "lockedUntil": row["locked_until"],
                }
            )
        return data

    def crypto_payload(row):
        return {"kekSalt": row["kek_salt"], "wrappedKey": row["wrapped_key"]}

    # --------------------------------------------------------
    # Sessions
    # --------------------------------------------------------

    def idle_session_expiry_enabled():
        return app.config["SESSION_IDLE_SECONDS"] > 0

    def session_is_expired(session, now):
        if session["expires_at"] < now:
            return True
        return (
            idle_session_expiry_enabled()
            and session["last_seen"] < now - app.config["SESSION_IDLE_SECONDS"]
        )

    def delete_expired_sessions(db, now):
        if idle_session_expiry_enabled():
            db.execute(
                "DELETE FROM sessions WHERE expires_at < ? OR last_seen < ?",
                (now, now - app.config["SESSION_IDLE_SECONDS"]),
            )
        else:
            db.execute("DELETE FROM sessions WHERE expires_at < ?", (now,))

    def active_session_condition(now, alias=""):
        prefix = "{}.".format(alias) if alias else ""
        if idle_session_expiry_enabled():
            return (
                "{}expires_at > ? AND {}last_seen > ?".format(prefix, prefix),
                (now, now - app.config["SESSION_IDLE_SECONDS"]),
            )
        return "{}expires_at > ?".format(prefix), (now,)

    def online_session_condition(now, alias=""):
        prefix = "{}.".format(alias) if alias else ""
        return (
            "{}expires_at > ? AND {}last_seen > ?".format(prefix, prefix),
            (now, now - app.config["ONLINE_PRESENCE_SECONDS"]),
        )

    def session_cookie_secure():
        host = (request.host or "").split(":")[0]
        return host not in ("127.0.0.1", "localhost")

    def start_session(user_row):
        token = secrets.token_urlsafe(32)
        now = int(time.time())
        db = db_connect(dbp())
        try:
            db.execute(
                "INSERT INTO sessions (id, user_id, token_hash, created_at, last_seen, expires_at, ip, user_agent) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    str(uuid.uuid4()),
                    user_row["id"],
                    hash_session_token(token),
                    now,
                    now,
                    now + app.config["SESSION_ABSOLUTE_SECONDS"],
                    client_ip(),
                    (request.headers.get("User-Agent") or "")[:200],
                ),
            )
            # Nettoyage opportuniste des sessions expirées
            delete_expired_sessions(db, now)
            db.commit()
        finally:
            db.close()
        return token

    def set_session_cookie(response, token):
        response.set_cookie(
            SESSION_COOKIE,
            token,
            max_age=app.config["SESSION_ABSOLUTE_SECONDS"],
            httponly=True,
            secure=session_cookie_secure(),
            samesite="Strict",
            path="/",
        )
        return response

    def clear_session_cookie(response):
        g.skip_session_cookie_refresh = True
        response.delete_cookie(SESSION_COOKIE, path="/")
        return response

    def load_session():
        """Retourne (session_row, user_row) ou (None, None)."""
        token = request.cookies.get(SESSION_COOKIE, "")
        if not token or len(token) > 128:
            return None, None
        now = int(time.time())
        db = db_connect(dbp())
        try:
            session = db.execute(
                "SELECT * FROM sessions WHERE token_hash = ?",
                (hash_session_token(token),),
            ).fetchone()
            if session is None:
                return None, None
            if session_is_expired(session, now):
                db.execute("DELETE FROM sessions WHERE id = ?", (session["id"],))
                db.commit()
                return None, None
            user = db.execute("SELECT * FROM users WHERE id = ?", (session["user_id"],)).fetchone()
            if user is None or not user["active"]:
                db.execute("DELETE FROM sessions WHERE id = ?", (session["id"],))
                db.commit()
                return None, None
            g.current_session_token = token
            refreshed_expires_at = now + app.config["SESSION_ABSOLUTE_SECONDS"]
            should_refresh_last_seen = now - session["last_seen"] > 60
            should_refresh_expiry = refreshed_expires_at > session["expires_at"]
            if should_refresh_last_seen or should_refresh_expiry:
                db.execute(
                    "UPDATE sessions SET last_seen = ?, expires_at = ? WHERE id = ?",
                    (
                        now if should_refresh_last_seen else session["last_seen"],
                        refreshed_expires_at if should_refresh_expiry else session["expires_at"],
                        session["id"],
                    ),
                )
                db.commit()
            return session, user
        finally:
            db.close()

    def require_user():
        session, user = load_session()
        if user is None:
            abort(json_error("Session expirée ou absente. Reconnectez-vous.", 401, code="unauthenticated"))
        g.current_session = dict(session)
        g.current_user = dict(user)
        return g.current_user

    def require_admin():
        user = require_user()
        if user["role"] != "admin":
            abort(json_error("Action réservée aux administrateurs.", 403, code="forbidden"))
        return user

    def revoke_user_sessions(user_id, except_session_id=None):
        db = db_connect(dbp())
        try:
            if except_session_id:
                cur = db.execute(
                    "DELETE FROM sessions WHERE user_id = ? AND id != ?",
                    (user_id, except_session_id),
                )
            else:
                cur = db.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
            db.commit()
            return cur.rowcount
        finally:
            db.close()

    # --------------------------------------------------------
    # Utilisateurs
    # --------------------------------------------------------

    def get_user_by_username(username):
        db = db_connect(dbp())
        try:
            return db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        finally:
            db.close()

    def get_user_by_id(user_id):
        db = db_connect(dbp())
        try:
            return db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        finally:
            db.close()

    def count_users(role=None):
        db = db_connect(dbp())
        try:
            if role:
                return db.execute("SELECT COUNT(*) FROM users WHERE role = ?", (role,)).fetchone()[0]
            return db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        finally:
            db.close()

    def validate_credential_material(data, prefix=""):
        """Valide le matériel cryptographique fourni par le client."""
        fields = {
            "authSalt": B64_RE,
            "authHash": B64_RE,
            "kekSalt": B64_RE,
            "wrappedKey": WRAPPED_KEY_RE,
        }
        out = {}
        for field, pattern in fields.items():
            value = data.get(prefix + field[0].upper() + field[1:] if prefix else field)
            if not isinstance(value, str) or not pattern.fullmatch(value):
                abort(json_error("Matériel d'authentification invalide ({}).".format(field), 400))
            out[field] = value
        return out

    def create_user_record(username, display_name, role, material, recovery=None, must_change=False):
        now = int(time.time())
        vault_id = secrets.token_urlsafe(32)
        user_id = str(uuid.uuid4())
        db = db_connect(dbp())
        try:
            db.execute(
                "INSERT INTO vaults (vault_id, vault_key_hash, blob, created_at, updated_at) VALUES (?, NULL, NULL, ?, ?)",
                (vault_id, now, now),
            )
            db.execute(
                "INSERT INTO users (id, username, display_name, role, active, auth_salt, server_hash, "
                "kek_salt, wrapped_key, recovery_auth_salt, recovery_server_hash, recovery_kek_salt, "
                "recovery_wrapped_key, must_change_password, vault_id, created_at) "
                "VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    user_id,
                    username,
                    display_name,
                    role,
                    material["authSalt"],
                    make_server_hash(material["authHash"]),
                    material["kekSalt"],
                    material["wrappedKey"],
                    recovery["authSalt"] if recovery else None,
                    make_server_hash(recovery["authHash"]) if recovery else None,
                    recovery["kekSalt"] if recovery else None,
                    recovery["wrappedKey"] if recovery else None,
                    1 if must_change else 0,
                    vault_id,
                    now,
                ),
            )
            db.commit()
        except sqlite3.IntegrityError:
            db.rollback()
            abort(json_error("Cet identifiant est déjà utilisé.", 409))
        finally:
            db.close()
        return get_user_by_id(user_id)

    # --------------------------------------------------------
    # En-têtes de sécurité
    # --------------------------------------------------------

    @app.after_request
    def add_security_headers(response):
        for name, value in SECURITY_HEADERS.items():
            response.headers[name] = value
        if response.mimetype == "text/html" or request.path.endswith(("sw.js", "manifest.webmanifest")):
            response.headers["Cache-Control"] = "no-cache"
        if request.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store"
        token = getattr(g, "current_session_token", None)
        if token and not getattr(g, "skip_session_cookie_refresh", False):
            set_session_cookie(response, token)
        return response

    # --------------------------------------------------------
    # Statique
    # --------------------------------------------------------

    @app.get("/")
    def index():
        return send_public_file("index.html")

    @app.route("/index.html/")
    def index_slash():
        return redirect("/", code=308)

    # --------------------------------------------------------
    # Pont IA (maintenance)
    # --------------------------------------------------------

    @app.get("/api/ai/status")
    def ai_status():
        response = jsonify({
            "bridge": False,
            "clis": {"claude": False, "codex": False},
            "maintenance": True,
            "message": AI_MAINTENANCE_MESSAGE,
        })
        response.status_code = 503
        return response

    @app.post("/api/ai/analyze")
    def ai_analyze():
        response = jsonify({"ok": False, "maintenance": True, "error": AI_MAINTENANCE_MESSAGE})
        response.status_code = 503
        return response

    # --------------------------------------------------------
    # Authentification
    # --------------------------------------------------------

    @app.post("/api/auth/prelogin")
    def auth_prelogin():
        require_csrf()
        if rate_limited("prelogin"):
            return json_error("Trop de requêtes. Réessayez plus tard.", 429)
        data = request.get_json(silent=True) or {}
        username = str(data.get("username") or "").strip().lower()
        if not USERNAME_RE.fullmatch(username):
            return json_error("Identifiant invalide.", 400)
        user = get_user_by_username(username)
        if user is not None:
            return json_ok({"authSalt": user["auth_salt"]})
        # Sel factice mais déterministe : empêche l'énumération de comptes.
        fake = hmac.new(
            instance_secret(dbp()).encode("utf-8"),
            ("prelogin:" + username).encode("utf-8"),
            hashlib.sha256,
        ).digest()[:16]
        import base64
        return json_ok({"authSalt": base64.b64encode(fake).decode("ascii")})

    @app.post("/api/auth/register")
    def auth_register():
        require_csrf()
        if rate_limited("register"):
            return json_error("Trop de requêtes. Réessayez plus tard.", 429)
        data = request.get_json(silent=True) or {}
        username = str(data.get("username") or "").strip().lower()
        display_name = str(data.get("displayName") or username).strip()[:64] or username
        if not USERNAME_RE.fullmatch(username):
            return json_error("L'identifiant doit comporter 2 à 32 caractères (a-z, 0-9, _ ou -).", 400)
        bootstrap = count_users() == 0
        if not bootstrap and not open_signup_enabled(dbp()):
            return json_error("L'inscription publique est fermée. Demandez à un administrateur.", 403, code="signup_closed")
        material = validate_credential_material(data)
        recovery = None
        if isinstance(data.get("recovery"), dict):
            recovery = validate_credential_material(data["recovery"])
        role = "admin" if bootstrap else "user"
        user = create_user_record(username, display_name, role, material, recovery=recovery)
        token = start_session(user)
        now = int(time.time())
        db = db_connect(dbp())
        try:
            db.execute("UPDATE users SET last_login = ? WHERE id = ?", (now, user["id"]))
            db.commit()
        finally:
            db.close()
        audit("user.register", target=username, detail="bootstrap admin" if bootstrap else None,
              actor={"id": user["id"], "username": username})
        response = json_ok({
            "user": public_user(get_user_by_id(user["id"])),
            "crypto": crypto_payload(user),
        }, status=201)
        return set_session_cookie(response, token)

    @app.post("/api/auth/login")
    def auth_login():
        require_csrf()
        if rate_limited("login"):
            return json_error("Trop de tentatives. Réessayez plus tard.", 429)
        data = request.get_json(silent=True) or {}
        username = str(data.get("username") or "").strip().lower()
        auth_hash = data.get("authHash")
        if not USERNAME_RE.fullmatch(username) or not isinstance(auth_hash, str) or not B64_RE.fullmatch(auth_hash):
            return json_error("Identifiants invalides.", 401)
        user = get_user_by_username(username)
        if user is None:
            # Coût constant pour ne pas révéler l'existence du compte.
            make_server_hash(auth_hash)
            audit("login.failed", target=username, detail="compte inconnu")
            return json_error("Identifiants invalides.", 401)
        now = int(time.time())
        if user["locked_until"] and user["locked_until"] > now:
            minutes = max(1, (user["locked_until"] - now + 59) // 60)
            audit("login.locked", target=username)
            return json_error("Compte temporairement verrouillé. Réessayez dans {} min.".format(minutes), 423, code="locked")
        if not user["active"]:
            audit("login.failed", target=username, detail="compte désactivé")
            return json_error("Ce compte est désactivé. Contactez un administrateur.", 403, code="disabled")
        if not verify_server_hash(auth_hash, user["server_hash"]):
            db = db_connect(dbp())
            try:
                failed = user["failed_attempts"] + 1
                locked_until = None
                if failed >= LOCK_THRESHOLD:
                    locked_until = now + LOCK_SECONDS
                    failed = 0
                db.execute(
                    "UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?",
                    (failed, locked_until, user["id"]),
                )
                db.commit()
            finally:
                db.close()
            audit("login.failed", target=username, detail="mot de passe incorrect")
            return json_error("Identifiants invalides.", 401)
        db = db_connect(dbp())
        try:
            db.execute(
                "UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login = ? WHERE id = ?",
                (now, user["id"]),
            )
            db.commit()
        finally:
            db.close()
        token = start_session(user)
        audit("login.success", target=username, actor={"id": user["id"], "username": username})
        response = json_ok({
            "user": public_user(get_user_by_id(user["id"])),
            "crypto": crypto_payload(user),
        })
        return set_session_cookie(response, token)

    @app.post("/api/auth/logout")
    def auth_logout():
        require_csrf()
        session, user = load_session()
        if session is not None:
            db = db_connect(dbp())
            try:
                db.execute("DELETE FROM sessions WHERE id = ?", (session["id"],))
                db.commit()
            finally:
                db.close()
            audit("logout", actor={"id": user["id"], "username": user["username"]})
        return clear_session_cookie(json_ok())

    @app.get("/api/auth/me")
    def auth_me():
        session, user = load_session()
        if user is None:
            return json_error("Non connecté.", 401, code="unauthenticated",
                              settings={"openSignup": open_signup_enabled(dbp())})
        return json_ok({
            "user": public_user(user),
            "crypto": crypto_payload(user),
            "settings": {"openSignup": open_signup_enabled(dbp())},
        })

    @app.post("/api/auth/presence")
    def auth_presence():
        require_csrf()
        user = require_user()
        now = int(time.time())
        db = db_connect(dbp())
        try:
            db.execute(
                "UPDATE sessions SET last_seen = ?, expires_at = ? WHERE id = ?",
                (
                    now,
                    now + app.config["SESSION_ABSOLUTE_SECONDS"],
                    g.current_session["id"],
                ),
            )
            db.commit()
        finally:
            db.close()
        return json_ok({
            "userId": user["id"],
            "onlinePresenceSeconds": app.config["ONLINE_PRESENCE_SECONDS"],
        })

    @app.delete("/api/auth/account")
    def auth_delete_account():
        require_csrf()
        user = require_user()
        if user["role"] == "admin" and count_active_admins(dbp(), excluding=user["id"]) == 0:
            return json_error("Impossible de supprimer le dernier administrateur actif.", 400)

        username = user["username"]
        vault_id = user["vault_id"]
        user_id = user["id"]
        db = db_connect(dbp())
        try:
            db.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
            db.execute("DELETE FROM vaults WHERE vault_id = ?", (vault_id,))
            db.execute("DELETE FROM users WHERE id = ?", (user_id,))
            db.commit()
        finally:
            db.close()
        audit("user.self_deleted", target=username, actor={"id": user_id, "username": username})
        return clear_session_cookie(json_ok())

    @app.post("/api/auth/change-password")
    def auth_change_password():
        require_csrf()
        if rate_limited("change-password"):
            return json_error("Trop de requêtes. Réessayez plus tard.", 429)
        user = require_user()
        data = request.get_json(silent=True) or {}
        current = data.get("currentAuthHash")
        if not isinstance(current, str) or not B64_RE.fullmatch(current):
            return json_error("Mot de passe actuel invalide.", 400)
        row = get_user_by_id(user["id"])
        if not verify_server_hash(current, row["server_hash"]):
            audit("password.change_failed", target=user["username"])
            return json_error("Mot de passe actuel incorrect.", 403)
        material = {
            "authSalt": data.get("newAuthSalt"),
            "authHash": data.get("newAuthHash"),
            "kekSalt": data.get("newKekSalt"),
            "wrappedKey": data.get("newWrappedKey"),
        }
        for field, pattern in (("authSalt", B64_RE), ("authHash", B64_RE), ("kekSalt", B64_RE), ("wrappedKey", WRAPPED_KEY_RE)):
            if not isinstance(material[field], str) or not pattern.fullmatch(material[field]):
                return json_error("Matériel d'authentification invalide ({}).".format(field), 400)
        recovery = None
        if isinstance(data.get("recovery"), dict):
            recovery = validate_credential_material(data["recovery"])
        reset_vault = bool(data.get("resetVault"))
        db = db_connect(dbp())
        try:
            db.execute(
                "UPDATE users SET auth_salt = ?, server_hash = ?, kek_salt = ?, wrapped_key = ?, "
                "must_change_password = 0, failed_attempts = 0, locked_until = NULL "
                + (", recovery_auth_salt = ?, recovery_server_hash = ?, recovery_kek_salt = ?, recovery_wrapped_key = ? " if recovery else "")
                + "WHERE id = ?",
                (
                    material["authSalt"],
                    make_server_hash(material["authHash"]),
                    material["kekSalt"],
                    material["wrappedKey"],
                )
                + ((recovery["authSalt"], make_server_hash(recovery["authHash"]), recovery["kekSalt"], recovery["wrappedKey"]) if recovery else ())
                + (user["id"],),
            )
            if reset_vault:
                db.execute(
                    "UPDATE vaults SET blob = NULL, updated_at = ? WHERE vault_id = ?",
                    (int(time.time()), row["vault_id"]),
                )
            db.commit()
        finally:
            db.close()
        revoke_user_sessions(user["id"], except_session_id=g.current_session["id"])
        audit("password.changed", target=user["username"],
              detail="coffre réinitialisé" if reset_vault else None)
        return json_ok({"user": public_user(get_user_by_id(user["id"]))})

    @app.post("/api/auth/recovery/init")
    def auth_recovery_init():
        require_csrf()
        if rate_limited("recovery"):
            return json_error("Trop de requêtes. Réessayez plus tard.", 429)
        data = request.get_json(silent=True) or {}
        username = str(data.get("username") or "").strip().lower()
        recovery_hash = data.get("recoveryAuthHash")
        generic = "Identifiant ou code de récupération invalide."
        if not USERNAME_RE.fullmatch(username) or not isinstance(recovery_hash, str) or not B64_RE.fullmatch(recovery_hash):
            return json_error(generic, 401)
        user = get_user_by_username(username)
        if user is None or not user["recovery_server_hash"]:
            make_server_hash(recovery_hash)
            audit("recovery.failed", target=username)
            return json_error(generic, 401)
        if not verify_server_hash(recovery_hash, user["recovery_server_hash"]):
            audit("recovery.failed", target=username)
            return json_error(generic, 401)
        token = secrets.token_urlsafe(32)
        tokens = app.config["RECOVERY_TOKENS"]
        now = time.time()
        # Purge des jetons expirés
        for key in [k for k, v in tokens.items() if v["expires"] < now]:
            tokens.pop(key, None)
        tokens[token] = {"user_id": user["id"], "expires": now + RECOVERY_TOKEN_TTL}
        audit("recovery.initiated", target=username)
        return json_ok({
            "recoveryToken": token,
            "recoveryKekSalt": user["recovery_kek_salt"],
            "recoveryWrappedKey": user["recovery_wrapped_key"],
        })

    @app.post("/api/auth/recovery/complete")
    def auth_recovery_complete():
        require_csrf()
        if rate_limited("recovery"):
            return json_error("Trop de requêtes. Réessayez plus tard.", 429)
        data = request.get_json(silent=True) or {}
        token = data.get("recoveryToken")
        tokens = app.config["RECOVERY_TOKENS"]
        entry = tokens.get(token) if isinstance(token, str) else None
        if entry is None or entry["expires"] < time.time():
            return json_error("Jeton de récupération expiré. Recommencez.", 401)
        user = get_user_by_id(entry["user_id"])
        if user is None or not user["active"]:
            return json_error("Compte indisponible.", 403)
        material = validate_credential_material(data)
        recovery = None
        if isinstance(data.get("recovery"), dict):
            recovery = validate_credential_material(data["recovery"])
        tokens.pop(token, None)
        db = db_connect(dbp())
        try:
            db.execute(
                "UPDATE users SET auth_salt = ?, server_hash = ?, kek_salt = ?, wrapped_key = ?, "
                "must_change_password = 0, failed_attempts = 0, locked_until = NULL, "
                "recovery_auth_salt = ?, recovery_server_hash = ?, recovery_kek_salt = ?, recovery_wrapped_key = ? "
                "WHERE id = ?",
                (
                    material["authSalt"],
                    make_server_hash(material["authHash"]),
                    material["kekSalt"],
                    material["wrappedKey"],
                    recovery["authSalt"] if recovery else None,
                    make_server_hash(recovery["authHash"]) if recovery else None,
                    recovery["kekSalt"] if recovery else None,
                    recovery["wrappedKey"] if recovery else None,
                    user["id"],
                ),
            )
            db.commit()
        finally:
            db.close()
        revoke_user_sessions(user["id"])
        session_token = start_session(user)
        audit("recovery.completed", target=user["username"],
              actor={"id": user["id"], "username": user["username"]})
        response = json_ok({
            "user": public_user(get_user_by_id(user["id"])),
            "crypto": crypto_payload(get_user_by_id(user["id"])),
        })
        return set_session_cookie(response, session_token)

    @app.post("/api/auth/recovery/rotate")
    def auth_recovery_rotate():
        """Régénère le kit de récupération (utilisateur connecté, mot de passe confirmé)."""
        require_csrf()
        user = require_user()
        data = request.get_json(silent=True) or {}
        current = data.get("currentAuthHash")
        row = get_user_by_id(user["id"])
        if not isinstance(current, str) or not B64_RE.fullmatch(current) or not verify_server_hash(current, row["server_hash"]):
            return json_error("Mot de passe actuel incorrect.", 403)
        recovery = validate_credential_material(data.get("recovery") or {})
        db = db_connect(dbp())
        try:
            db.execute(
                "UPDATE users SET recovery_auth_salt = ?, recovery_server_hash = ?, "
                "recovery_kek_salt = ?, recovery_wrapped_key = ? WHERE id = ?",
                (
                    recovery["authSalt"],
                    make_server_hash(recovery["authHash"]),
                    recovery["kekSalt"],
                    recovery["wrappedKey"],
                    user["id"],
                ),
            )
            db.commit()
        finally:
            db.close()
        audit("recovery.rotated", target=user["username"])
        return json_ok()

    # --------------------------------------------------------
    # Sessions de l'utilisateur courant
    # --------------------------------------------------------

    @app.get("/api/auth/sessions")
    def auth_sessions():
        user = require_user()
        db = db_connect(dbp())
        try:
            rows = db.execute(
                "SELECT id, created_at, last_seen, ip, user_agent FROM sessions WHERE user_id = ? ORDER BY last_seen DESC",
                (user["id"],),
            ).fetchall()
        finally:
            db.close()
        current_id = g.current_session["id"]
        return json_ok({
            "sessions": [
                {
                    "id": row["id"],
                    "createdAt": row["created_at"],
                    "lastSeen": row["last_seen"],
                    "ip": row["ip"],
                    "userAgent": row["user_agent"],
                    "current": row["id"] == current_id,
                }
                for row in rows
            ]
        })

    @app.delete("/api/auth/sessions/<session_id>")
    def auth_revoke_session(session_id):
        require_csrf()
        user = require_user()
        db = db_connect(dbp())
        try:
            cur = db.execute(
                "DELETE FROM sessions WHERE id = ? AND user_id = ?",
                (session_id, user["id"]),
            )
            db.commit()
            deleted = cur.rowcount
        finally:
            db.close()
        if deleted:
            audit("session.revoked", target=session_id)
        return json_ok({"deleted": deleted})

    @app.post("/api/auth/sessions/revoke-others")
    def auth_revoke_other_sessions():
        require_csrf()
        user = require_user()
        deleted = revoke_user_sessions(user["id"], except_session_id=g.current_session["id"])
        audit("session.revoked_others", detail="{} session(s)".format(deleted))
        return json_ok({"deleted": deleted})

    # --------------------------------------------------------
    # Coffre chiffré de l'utilisateur courant
    # --------------------------------------------------------

    def get_vault_row(vault_id):
        db = db_connect(dbp())
        try:
            return db.execute("SELECT * FROM vaults WHERE vault_id = ?", (vault_id,)).fetchone()
        finally:
            db.close()

    @app.get("/api/vault")
    def vault_get():
        user = require_user()
        row = get_vault_row(user["vault_id"])
        if row is None:
            return json_error("Coffre introuvable.", 404)
        return json_ok({"blob": row["blob"], "updatedAt": row["updated_at"]})

    @app.put("/api/vault")
    def vault_put():
        require_csrf()
        if rate_limited("state-write"):
            return json_error("Trop d'écritures. Réessayez plus tard.", 429)
        user = require_user()
        data = request.get_json(silent=True) or {}
        blob = data.get("blob")
        if not isinstance(blob, str) or not blob.startswith("ENCRYPTED:"):
            return json_error("Format de coffre invalide.", 400)
        encoded = blob.encode("utf-8")
        if len(encoded) > MAX_STATE_BLOB:
            return json_error("Coffre trop volumineux.", 413)
        max_db_bytes = app.config["MAX_STATE_DB_BYTES"]
        if max_db_bytes > 0:
            db_file = Path(dbp())
            current = db_file.stat().st_size if db_file.exists() else 0
            if current + len(encoded) > max_db_bytes:
                return json_error("Quota de stockage du serveur atteint.", 429)
        db = db_connect(dbp())
        try:
            db.execute(
                "UPDATE vaults SET blob = ?, updated_at = ? WHERE vault_id = ?",
                (blob, int(time.time()), user["vault_id"]),
            )
            db.commit()
        finally:
            db.close()
        return json_ok()

    @app.delete("/api/vault")
    def vault_delete():
        require_csrf()
        user = require_user()
        db = db_connect(dbp())
        try:
            db.execute(
                "UPDATE vaults SET blob = NULL, updated_at = ? WHERE vault_id = ?",
                (int(time.time()), user["vault_id"]),
            )
            db.commit()
        finally:
            db.close()
        audit("vault.reset", target=user["username"])
        return json_ok()

    @app.post("/api/vault/import-legacy")
    def vault_import_legacy():
        """Migration depuis l'ancien modèle : rattache un ancien coffre
        (vault_id + serverKey conservés dans le navigateur) au compte courant."""
        require_csrf()
        user = require_user()
        data = request.get_json(silent=True) or {}
        vault_id = data.get("vaultId")
        server_key = data.get("serverKey")
        if (not isinstance(vault_id, str) or not VAULT_ID_RE.fullmatch(vault_id)
                or not isinstance(server_key, str) or not VAULT_KEY_RE.fullmatch(server_key)):
            return json_error("Référence de coffre invalide.", 400)
        if vault_id == user["vault_id"]:
            return json_error("Ce coffre est déjà associé à votre compte.", 400)
        row = get_vault_row(vault_id)
        if row is None:
            return json_error("Ancien coffre introuvable.", 404)
        stored_hash = row["vault_key_hash"]
        if not stored_hash or not hmac.compare_digest(stored_hash, hash_vault_key(server_key)):
            audit("vault.import_denied", target=vault_id)
            return json_error("Clé d'accès au coffre refusée.", 403)
        db = db_connect(dbp())
        try:
            db.execute(
                "UPDATE vaults SET blob = ?, updated_at = ? WHERE vault_id = ?",
                (row["blob"], int(time.time()), user["vault_id"]),
            )
            db.execute("DELETE FROM vaults WHERE vault_id = ?", (vault_id,))
            db.commit()
        finally:
            db.close()
        audit("vault.imported", target=user["username"], detail="ancien coffre {}…".format(vault_id[:8]))
        return json_ok()

    # --------------------------------------------------------
    # Administration
    # --------------------------------------------------------

    @app.get("/api/admin/overview")
    def admin_overview():
        require_admin()
        now = int(time.time())
        db = db_connect(dbp())
        try:
            users = db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
            admins = db.execute("SELECT COUNT(*) FROM users WHERE role = 'admin'").fetchone()[0]
            disabled = db.execute("SELECT COUNT(*) FROM users WHERE active = 0").fetchone()[0]
            locked = db.execute(
                "SELECT COUNT(*) FROM users WHERE locked_until IS NOT NULL AND locked_until > ?", (now,)
            ).fetchone()[0]
            active7d = db.execute(
                "SELECT COUNT(*) FROM users WHERE last_login IS NOT NULL AND last_login > ?",
                (now - 7 * 86400,),
            ).fetchone()[0]
            session_where, session_params = active_session_condition(now)
            sessions = db.execute(
                "SELECT COUNT(*) FROM sessions WHERE " + session_where,
                session_params,
            ).fetchone()[0]
            vault_bytes = db.execute(
                "SELECT COALESCE(SUM(LENGTH(blob)), 0) FROM vaults"
            ).fetchone()[0]
            audit_count = db.execute("SELECT COUNT(*) FROM audit_log").fetchone()[0]
        finally:
            db.close()
        db_file = Path(dbp())
        return json_ok({
            "stats": {
                "users": users,
                "admins": admins,
                "disabled": disabled,
                "locked": locked,
                "active7d": active7d,
                "sessions": sessions,
            },
            "server": {
                "version": VERSION,
                "uptimeSeconds": int(time.time() - START_TIME),
                "dbBytes": db_file.stat().st_size if db_file.exists() else 0,
                "vaultBytes": vault_bytes,
                "maxDbBytes": app.config["MAX_STATE_DB_BYTES"],
                "auditEntries": audit_count,
            },
            "settings": {"openSignup": open_signup_enabled(dbp())},
        })

    @app.get("/api/admin/users")
    def admin_list_users():
        require_admin()
        now = int(time.time())
        session_where, session_params = active_session_condition(now, "s")
        online_where, online_params = online_session_condition(now, "os")
        db = db_connect(dbp())
        try:
            rows = db.execute(
                "SELECT u.*, LENGTH(v.blob) AS vault_bytes, "
                "(SELECT COUNT(*) FROM sessions s WHERE s.user_id = u.id AND " + session_where + ") AS session_count, "
                "(SELECT COUNT(*) FROM sessions os WHERE os.user_id = u.id AND " + online_where + ") AS online_session_count "
                "FROM users u LEFT JOIN vaults v ON v.vault_id = u.vault_id "
                "ORDER BY u.created_at ASC",
                session_params + online_params,
            ).fetchall()
        finally:
            db.close()
        users = []
        for row in rows:
            data = public_user(row, include_admin_fields=True)
            data["vaultBytes"] = row["vault_bytes"] or 0
            data["sessionCount"] = row["session_count"]
            data["onlineSessionCount"] = row["online_session_count"] or 0
            users.append(data)
        return json_ok({"users": users})

    @app.post("/api/admin/users")
    def admin_create_user():
        require_csrf()
        admin = require_admin()
        if rate_limited("admin-write"):
            return json_error("Trop de requêtes. Réessayez plus tard.", 429)
        data = request.get_json(silent=True) or {}
        username = str(data.get("username") or "").strip().lower()
        display_name = str(data.get("displayName") or username).strip()[:64] or username
        role = data.get("role") if data.get("role") in ("admin", "user") else "user"
        if not USERNAME_RE.fullmatch(username):
            return json_error("L'identifiant doit comporter 2 à 32 caractères (a-z, 0-9, _ ou -).", 400)
        material = validate_credential_material(data)
        user = create_user_record(username, display_name, role, material, must_change=True)
        audit("user.created", target=username, detail="rôle {}".format(role), actor=admin)
        return json_ok({"user": public_user(user, include_admin_fields=True)}, status=201)

    @app.patch("/api/admin/users/<user_id>")
    def admin_update_user(user_id):
        require_csrf()
        admin = require_admin()
        target = get_user_by_id(user_id)
        if target is None:
            return json_error("Utilisateur introuvable.", 404)
        data = request.get_json(silent=True) or {}
        changes = []
        updates = {}
        if "displayName" in data:
            updates["display_name"] = str(data["displayName"]).strip()[:64] or target["username"]
            changes.append("nom affiché")
        if "role" in data:
            role = data["role"]
            if role not in ("admin", "user"):
                return json_error("Rôle invalide.", 400)
            if target["id"] == admin["id"] and role != "admin":
                return json_error("Impossible de retirer votre propre rôle d'administrateur.", 400)
            updates["role"] = role
            changes.append("rôle → {}".format(role))
        if "active" in data:
            active = bool(data["active"])
            if target["id"] == admin["id"] and not active:
                return json_error("Impossible de désactiver votre propre compte.", 400)
            if not active and target["role"] == "admin":
                others = count_active_admins(dbp(), excluding=target["id"])
                if others == 0:
                    return json_error("Au moins un administrateur actif doit rester.", 400)
            updates["active"] = 1 if active else 0
            changes.append("activé" if active else "désactivé")
        if not updates:
            return json_error("Aucune modification fournie.", 400)
        db = db_connect(dbp())
        try:
            sets = ", ".join("{} = ?".format(col) for col in updates)
            extra = ""
            params = list(updates.values())
            if updates.get("active") == 1:
                extra = ", failed_attempts = 0, locked_until = NULL"
            db.execute("UPDATE users SET " + sets + extra + " WHERE id = ?", params + [user_id])
            if updates.get("active") == 0:
                db.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
            db.commit()
        finally:
            db.close()
        audit("user.updated", target=target["username"], detail=", ".join(changes), actor=admin)
        return json_ok({"user": public_user(get_user_by_id(user_id), include_admin_fields=True)})

    @app.post("/api/admin/users/<user_id>/reset-password")
    def admin_reset_password(user_id):
        require_csrf()
        admin = require_admin()
        if rate_limited("admin-write"):
            return json_error("Trop de requêtes. Réessayez plus tard.", 429)
        target = get_user_by_id(user_id)
        if target is None:
            return json_error("Utilisateur introuvable.", 404)
        data = request.get_json(silent=True) or {}
        auth_salt = data.get("authSalt")
        auth_hash = data.get("authHash")
        if (not isinstance(auth_salt, str) or not B64_RE.fullmatch(auth_salt)
                or not isinstance(auth_hash, str) or not B64_RE.fullmatch(auth_hash)):
            return json_error("Matériel d'authentification invalide.", 400)
        db = db_connect(dbp())
        try:
            db.execute(
                "UPDATE users SET auth_salt = ?, server_hash = ?, must_change_password = 1, "
                "failed_attempts = 0, locked_until = NULL WHERE id = ?",
                (auth_salt, make_server_hash(auth_hash), user_id),
            )
            db.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
            db.commit()
        finally:
            db.close()
        audit("password.reset_by_admin", target=target["username"], actor=admin)
        return json_ok({"user": public_user(get_user_by_id(user_id), include_admin_fields=True)})

    @app.post("/api/admin/users/<user_id>/revoke-sessions")
    def admin_revoke_sessions(user_id):
        require_csrf()
        admin = require_admin()
        target = get_user_by_id(user_id)
        if target is None:
            return json_error("Utilisateur introuvable.", 404)
        deleted = revoke_user_sessions(user_id)
        audit("session.revoked_by_admin", target=target["username"],
              detail="{} session(s)".format(deleted), actor=admin)
        return json_ok({"deleted": deleted})

    @app.delete("/api/admin/users/<user_id>")
    def admin_delete_user(user_id):
        require_csrf()
        admin = require_admin()
        target = get_user_by_id(user_id)
        if target is None:
            return json_error("Utilisateur introuvable.", 404)
        if target["id"] == admin["id"]:
            return json_error("Impossible de supprimer votre propre compte.", 400)
        if target["role"] == "admin" and count_active_admins(dbp(), excluding=target["id"]) == 0:
            return json_error("Au moins un administrateur actif doit rester.", 400)
        db = db_connect(dbp())
        try:
            db.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
            db.execute("DELETE FROM vaults WHERE vault_id = ?", (target["vault_id"],))
            db.execute("DELETE FROM users WHERE id = ?", (user_id,))
            db.commit()
        finally:
            db.close()
        audit("user.deleted", target=target["username"], actor=admin)
        return json_ok()

    @app.get("/api/admin/sessions")
    def admin_list_sessions():
        require_admin()
        now = int(time.time())
        session_where, session_params = active_session_condition(now, "s")
        db = db_connect(dbp())
        try:
            rows = db.execute(
                "SELECT s.id, s.created_at, s.last_seen, s.ip, s.user_agent, u.username, u.display_name "
                "FROM sessions s JOIN users u ON u.id = s.user_id "
                "WHERE " + session_where + " ORDER BY s.last_seen DESC",
                session_params,
            ).fetchall()
        finally:
            db.close()
        return json_ok({
            "sessions": [
                {
                    "id": row["id"],
                    "username": row["username"],
                    "displayName": row["display_name"],
                    "createdAt": row["created_at"],
                    "lastSeen": row["last_seen"],
                    "ip": row["ip"],
                    "userAgent": row["user_agent"],
                }
                for row in rows
            ]
        })

    @app.get("/api/admin/audit")
    def admin_audit():
        require_admin()
        try:
            limit = min(max(int(request.args.get("limit", 50)), 1), 200)
        except ValueError:
            limit = 50
        before = request.args.get("before")
        action = (request.args.get("action") or "").strip()[:64]
        query = (request.args.get("q") or "").strip()[:64]
        sql = "SELECT * FROM audit_log WHERE 1=1"
        params = []
        if before and before.isdigit():
            sql += " AND id < ?"
            params.append(int(before))
        if action:
            sql += " AND action LIKE ?"
            params.append(action + "%")
        if query:
            sql += " AND (actor_name LIKE ? OR target LIKE ? OR detail LIKE ?)"
            like = "%" + query + "%"
            params.extend([like, like, like])
        sql += " ORDER BY id DESC LIMIT ?"
        params.append(limit)
        db = db_connect(dbp())
        try:
            rows = db.execute(sql, params).fetchall()
        finally:
            db.close()
        return json_ok({
            "entries": [
                {
                    "id": row["id"],
                    "ts": row["ts"],
                    "actor": row["actor_name"],
                    "action": row["action"],
                    "target": row["target"],
                    "detail": row["detail"],
                    "ip": row["ip"],
                }
                for row in rows
            ]
        })

    @app.get("/api/admin/settings")
    def admin_get_settings():
        require_admin()
        return json_ok({"settings": {"openSignup": open_signup_enabled(dbp())}})

    @app.put("/api/admin/settings")
    def admin_put_settings():
        require_csrf()
        admin = require_admin()
        data = request.get_json(silent=True) or {}
        if "openSignup" in data:
            set_setting(dbp(), "open_signup", "1" if data["openSignup"] else "0")
            audit("settings.updated", detail="openSignup={}".format(bool(data["openSignup"])), actor=admin)
        return json_ok({"settings": {"openSignup": open_signup_enabled(dbp())}})

    # --------------------------------------------------------
    # Fichiers publics (allowlist)
    # --------------------------------------------------------

    @app.get("/<path:filename>")
    def public_file(filename):
        return send_public_file(filename)

    return app


def count_active_admins(path, excluding=None):
    db = db_connect(path)
    try:
        if excluding:
            return db.execute(
                "SELECT COUNT(*) FROM users WHERE role = 'admin' AND active = 1 AND id != ?",
                (excluding,),
            ).fetchone()[0]
        return db.execute("SELECT COUNT(*) FROM users WHERE role = 'admin' AND active = 1").fetchone()[0]
    finally:
        db.close()


def send_public_file(filename):
    normalized = filename.replace("\\", "/").lstrip("/")
    parts = normalized.split("/")
    if ".." in parts or any(part.startswith(".") for part in parts):
        abort(404)
    if normalized not in PUBLIC_FILES:
        abort(404)
    return send_from_directory(ROOT, normalized)


app = create_app()


def main():
    try:
        from waitress import serve
    except ImportError:
        print("Waitress est introuvable. Installez les dépendances avec: python3 -m pip install -r requirements.txt", file=sys.stderr)
        raise SystemExit(1)

    print("Seuil v{} - http://{}:{}/  (Flask + Waitress)".format(VERSION, HOST, PORT))
    serve(app, host=HOST, port=PORT, threads=4, channel_timeout=30)


if __name__ == "__main__":
    main()
