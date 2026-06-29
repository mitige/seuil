/**
 * Seuil - auth.js
 * Client d'authentification serveur, chiffrement zéro-connaissance et
 * panneau d'administration.
 *
 * Modèle cryptographique (le serveur ne voit jamais le mot de passe) :
 *  - authHash  = PBKDF2-SHA256(motDePasse, authSalt, 600 000) → envoyé au
 *    serveur, qui le re-hache avec son propre sel avant stockage.
 *  - dataKey   = 32 octets aléatoires (clé de chiffrement du coffre, format
 *    compatible avec les coffres historiques).
 *  - wrappedKey = AES-GCM(KEK, dataKey) où KEK = PBKDF2(motDePasse, kekSalt,
 *    600 000). Stockée côté serveur, indéchiffrable sans le mot de passe.
 *  - Kit de récupération : un code aléatoire (120 bits) enveloppe aussi la
 *    dataKey ; il permet de réinitialiser le mot de passe sans perdre le
 *    coffre. Les sels de récupération sont dérivés du nom d'utilisateur
 *    (déterministes) - la sécurité repose sur l'entropie du code lui-même.
 *
 * La dataKey déballée n'est conservée qu'en sessionStorage (onglet courant).
 * Un onglet neuf avec une session serveur valide passe par l'écran de
 * déverrouillage (mot de passe → KEK → dataKey), sans aller-retour réseau.
 */

(function () {
    "use strict";

    // ============================================================
    // Constantes
    // ============================================================
    const AUTH_ITERATIONS = 600000;
    const KEK_ITERATIONS = 600000;
    const RECOVERY_ITERATIONS = 100000;
    const LEGACY_PBKDF2_ITERATIONS = 200000;
    const DATA_KEY_SESSION_KEY = "seuil_dk_v2";
    const LEGACY_ACCOUNTS_KEY = "seuil_accounts_v1";
    const LEGACY_VAULT_KEY = "seuil_server_vault";
    const RECOVERY_ALPHABET = "ABCDEFGHJKMNPQRSTVWXYZ0123456789"; // 32 symboles sans ambiguïté
    const API_TIMEOUT_MS = 12000;
    const AUTH_ACTION_TIMEOUT_MS = 20000;
    const PRESENCE_HEARTBEAT_MS = 45000;
    const ADMIN_SESSIONS_PAGE_SIZE = 30;
    let presenceHeartbeatTimer = null;
    let presenceHeartbeatInFlight = false;

    function tx(key, vars) {
        const translator = (typeof window !== "undefined" && typeof window.t === "function") ? window.t : null;
        if (translator) return translator(key, vars);
        let text = String(key || "");
        if (vars && typeof vars === "object") {
            Object.keys(vars).forEach((name) => {
                text = text.replace(new RegExp(`\\{${name}\\}`, "g"), String(vars[name]));
            });
        }
        return text;
    }

    function translatedError(err, fallback) {
        return tx((err && err.message) || fallback || "Erreur inconnue.");
    }

    let currentUser = null;       // utilisateur public renvoyé par le serveur
    let currentCrypto = null;     // { kekSalt, wrappedKey } du compte courant
    let serverSettings = { openSignup: true };
    let dataKey = null;           // clé de coffre déballée (chaîne base64url)
    let pendingPassword = null;   // mot de passe gardé le temps du flux « changement forcé »
    let authUiBound = false;

    // ============================================================
    // Aides binaires / base64
    // ============================================================
    function randomBytes(n) {
        return crypto.getRandomValues(new Uint8Array(n));
    }

    function toBase64(bytes) {
        const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
        let bin = "";
        for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
        return btoa(bin);
    }

    function fromBase64(str) {
        const normalized = String(str || "").replace(/-/g, "+").replace(/_/g, "/");
        const bin = atob(normalized);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        return arr;
    }

    function toBase64Url(bytes) {
        return toBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    }

    function constantTimeEqual(a, b) {
        if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
        let diff = 0;
        for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
        return diff === 0;
    }

    // ============================================================
    // Primitives cryptographiques
    // ============================================================
    async function pbkdf2Bits(secret, saltBytes, iterations) {
        const km = await crypto.subtle.importKey(
            "raw", new TextEncoder().encode(secret), { name: "PBKDF2" }, false, ["deriveBits"]
        );
        const bits = await crypto.subtle.deriveBits(
            { name: "PBKDF2", salt: saltBytes, iterations, hash: "SHA-256" }, km, 256
        );
        return new Uint8Array(bits);
    }

    async function deriveAuthHash(password, saltB64, iterations) {
        return toBase64(await pbkdf2Bits(password, fromBase64(saltB64), iterations || AUTH_ITERATIONS));
    }

    async function deriveKek(secret, saltB64, iterations) {
        const bits = await pbkdf2Bits(secret, fromBase64(saltB64), iterations || KEK_ITERATIONS);
        return crypto.subtle.importKey("raw", bits, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
    }

    async function wrapDataKey(dataKeyString, kek) {
        const iv = randomBytes(12);
        const ct = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv }, kek, new TextEncoder().encode(dataKeyString)
        );
        return `v1:${toBase64(iv)}:${toBase64(new Uint8Array(ct))}`;
    }

    async function unwrapDataKey(wrapped, kek) {
        const parts = String(wrapped || "").split(":");
        if (parts.length !== 3 || parts[0] !== "v1") throw new Error("Format de clé invalide.");
        const iv = fromBase64(parts[1]);
        const ct = fromBase64(parts[2]);
        const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, kek, ct);
        return new TextDecoder().decode(plain);
    }

    function generateDataKey() {
        return toBase64Url(randomBytes(32));
    }

    function generateRecoveryCode() {
        const bytes = randomBytes(24);
        let out = "";
        for (let i = 0; i < 24; i++) out += RECOVERY_ALPHABET[bytes[i] % 32];
        return out.match(/.{1,4}/g).join("-"); // XXXX-XXXX-XXXX-XXXX-XXXX-XXXX
    }

    function normalizeRecoveryCode(input) {
        return String(input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    }

    async function deterministicSalt(label, username) {
        const data = new TextEncoder().encode(`seuil:${label}:${username}`);
        const digest = await crypto.subtle.digest("SHA-256", data);
        return toBase64(new Uint8Array(digest).slice(0, 16));
    }

    /** Construit le matériel d'authentification complet pour un mot de passe. */
    async function buildPasswordMaterial(password, dataKeyString) {
        const authSalt = toBase64(randomBytes(16));
        const kekSalt = toBase64(randomBytes(16));
        const authHash = await deriveAuthHash(password, authSalt);
        const kek = await deriveKek(password, kekSalt);
        const wrappedKey = await wrapDataKey(dataKeyString, kek);
        return { authSalt, authHash, kekSalt, wrappedKey };
    }

    /** Construit le kit de récupération (code → matériel) pour un utilisateur. */
    async function buildRecoveryMaterial(username, dataKeyString) {
        const code = generateRecoveryCode();
        const normalized = normalizeRecoveryCode(code);
        const authSalt = await deterministicSalt("recovery-auth", username);
        const kekSalt = await deterministicSalt("recovery-kek", username);
        const authHash = toBase64(await pbkdf2Bits(normalized, fromBase64(authSalt), RECOVERY_ITERATIONS));
        const kek = await deriveKek(normalized, kekSalt, RECOVERY_ITERATIONS);
        const wrappedKey = await wrapDataKey(dataKeyString, kek);
        return { code, material: { authSalt, authHash, kekSalt, wrappedKey } };
    }

    // ============================================================
    // Client API
    // ============================================================
    function apiTimeoutError() {
        const err = new Error("Le serveur met trop de temps à répondre. Rechargez la page.");
        err.code = "timeout";
        return err;
    }

    function normalizeApiNetworkError(err) {
        const message = String((err && err.message) || "");
        if (/NetworkError|Failed to fetch|Load failed|Network request failed/i.test(message)) {
            const normalized = new Error("Connexion au serveur impossible. Réessayez dans quelques secondes.");
            normalized.code = "network";
            return normalized;
        }
        return err;
    }

    function authActionTimeoutError(message) {
        const err = new Error(message);
        err.code = "timeout";
        return err;
    }

    function withAuthTimeout(promise, message) {
        let timer = null;
        const timeout = new Promise((_, reject) => {
            timer = setTimeout(() => {
                reject(authActionTimeoutError(message));
            }, AUTH_ACTION_TIMEOUT_MS);
        });
        return Promise.race([promise, timeout]).finally(() => {
            if (timer) clearTimeout(timer);
        });
    }

    async function api(path, options) {
        const opts = options || {};
        const method = opts.method || (opts.body !== undefined ? "POST" : "GET");
        const headers = { "Accept": "application/json" };
        if (method !== "GET") headers["X-Seuil-Csrf"] = "1";
        if (opts.body !== undefined) headers["Content-Type"] = "application/json";
        const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
        const fetchOptions = {
            method,
            headers,
            credentials: "same-origin",
            cache: "no-store",
            body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
        };
        if (controller) fetchOptions.signal = controller.signal;

        let timer = null;
        const timeout = new Promise((_, reject) => {
            timer = setTimeout(() => {
                if (controller) controller.abort();
                reject(apiTimeoutError());
            }, API_TIMEOUT_MS);
        });

        let res;
        try {
            res = await Promise.race([fetch(path, fetchOptions), timeout]);
        } catch (err) {
            if (err && err.name === "AbortError") throw apiTimeoutError();
            throw normalizeApiNetworkError(err);
        } finally {
            if (timer) clearTimeout(timer);
        }
        let data = null;
        try { data = await res.json(); } catch (_) { data = null; }
        if (!res.ok) {
            const err = new Error((data && data.error) || `Erreur serveur (${res.status}).`);
            err.status = res.status;
            err.code = data && data.code;
            err.data = data;
            throw err;
        }
        return data || {};
    }

    function stopPresenceHeartbeat() {
        if (presenceHeartbeatTimer) clearInterval(presenceHeartbeatTimer);
        presenceHeartbeatTimer = null;
    }

    async function sendPresenceHeartbeat() {
        if (!currentUser || presenceHeartbeatInFlight) return;
        if (typeof document !== "undefined" && document.hidden) return;
        presenceHeartbeatInFlight = true;
        try {
            await api("/api/auth/presence", { body: {} });
        } catch (err) {
            if (err && err.status === 401) handleSessionExpired();
        } finally {
            presenceHeartbeatInFlight = false;
        }
    }

    function startPresenceHeartbeat() {
        stopPresenceHeartbeat();
        if (!currentUser) return;
        if (typeof document !== "undefined" && document.hidden) return;
        sendPresenceHeartbeat();
        presenceHeartbeatTimer = setInterval(sendPresenceHeartbeat, PRESENCE_HEARTBEAT_MS);
    }

    if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) stopPresenceHeartbeat();
            else startPresenceHeartbeat();
        });
    }

    // ============================================================
    // Clé de coffre (sessionStorage, onglet courant uniquement)
    // ============================================================
    function setDataKey(value) {
        dataKey = value || null;
        try {
            if (value) sessionStorage.setItem(DATA_KEY_SESSION_KEY, value);
            else sessionStorage.removeItem(DATA_KEY_SESSION_KEY);
        } catch (_) { /* stockage indisponible : clé en mémoire seulement */ }
    }

    function loadStoredDataKey() {
        try { return sessionStorage.getItem(DATA_KEY_SESSION_KEY) || null; } catch (_) { return null; }
    }

    function getDataKey() {
        return dataKey;
    }

    // ============================================================
    // Cycle de vie : boot / login / logout
    // ============================================================
    async function boot() {
        let me = null;
        try {
            me = await api("/api/auth/me");
        } catch (err) {
            if (err.data && err.data.settings) serverSettings = err.data.settings;
            if (err.status === 401) return { authenticated: false };
            throw err;
        }
        currentUser = me.user;
        currentCrypto = me.crypto;
        serverSettings = me.settings || serverSettings;
        startPresenceHeartbeat();
        const stored = loadStoredDataKey();
        if (stored) {
            dataKey = stored;
            return { authenticated: true };
        }
        return { authenticated: true, locked: true };
    }

    async function login(username, password) {
        const uname = String(username || "").trim().toLowerCase();
        const pre = await api("/api/auth/prelogin", { body: { username: uname } });
        const authHash = await deriveAuthHash(password, pre.authSalt);
        let res;
        try {
            res = await api("/api/auth/login", { body: { username: uname, authHash } });
        } catch (err) {
            if (err.status === 401) {
                const migrated = await tryLegacyMigration(uname, password);
                if (migrated) return migrated;
            }
            throw err;
        }
        return finishLogin(res, uname, password);
    }

    async function finishLogin(res, username, password) {
        currentUser = res.user;
        currentCrypto = res.crypto;
        startPresenceHeartbeat();
        let unwrapFailed = false;
        try {
            const kek = await deriveKek(password, res.crypto.kekSalt);
            setDataKey(await unwrapDataKey(res.crypto.wrappedKey, kek));
        } catch (_) {
            unwrapFailed = true;
            setDataKey(null);
        }
        pendingPassword = password;
        return {
            user: res.user,
            unwrapFailed,
            needsPasswordGate: !!(res.user.mustChangePassword || unwrapFailed)
        };
    }

    async function register(username, displayName, password) {
        const uname = String(username || "").trim().toLowerCase();
        const freshKey = generateDataKey();
        const material = await buildPasswordMaterial(password, freshKey);
        const recovery = await buildRecoveryMaterial(uname, freshKey);
        const res = await api("/api/auth/register", {
            body: Object.assign({}, material, {
                username: uname,
                displayName: displayName || uname,
                recovery: recovery.material
            })
        });
        currentUser = res.user;
        currentCrypto = res.crypto;
        setDataKey(freshKey);
        startPresenceHeartbeat();
        pendingPassword = null;
        return { user: res.user, recoveryCode: recovery.code };
    }

    async function unlock(password) {
        if (!currentCrypto) throw new Error("Session introuvable. Rechargez la page.");
        const kek = await deriveKek(password, currentCrypto.kekSalt);
        const key = await unwrapDataKey(currentCrypto.wrappedKey, kek); // GCM échoue si mot de passe faux
        setDataKey(key);
        return true;
    }

    async function logout() {
        try { await api("/api/auth/logout", { body: {} }); } catch (_) { /* meilleure tentative */ }
        stopPresenceHeartbeat();
        setDataKey(null);
        currentUser = null;
        currentCrypto = null;
        window.location.reload();
    }

    async function deleteCurrentAccount() {
        await api("/api/auth/account", { method: "DELETE", body: {} });
        stopPresenceHeartbeat();
        setDataKey(null);
        currentUser = null;
        currentCrypto = null;
    }

    /** Appelé par app.js quand le serveur répond 401 en cours d'usage. */
    function handleSessionExpired() {
        stopPresenceHeartbeat();
        setDataKey(null);
        if (window.SeuilUI) SeuilUI.toast(tx("Session expirée. Reconnectez-vous."), { type: "info" });
        setTimeout(() => window.location.reload(), 900);
    }

    // ============================================================
    // Changement de mot de passe / récupération
    // ============================================================
    async function changePassword(currentPassword, newPassword, options) {
        const opts = options || {};
        if (!currentUser) throw new Error("Non connecté.");
        const pre = await api("/api/auth/prelogin", { body: { username: currentUser.username } });
        const currentAuthHash = await deriveAuthHash(currentPassword, pre.authSalt);
        const keyForWrap = opts.dataKeyOverride || dataKey;
        if (!keyForWrap) throw new Error("Clé de coffre indisponible.");
        const material = await buildPasswordMaterial(newPassword, keyForWrap);
        const body = {
            currentAuthHash,
            newAuthSalt: material.authSalt,
            newAuthHash: material.authHash,
            newKekSalt: material.kekSalt,
            newWrappedKey: material.wrappedKey
        };
        let recoveryCode = null;
        if (opts.rotateRecovery) {
            const recovery = await buildRecoveryMaterial(currentUser.username, keyForWrap);
            body.recovery = recovery.material;
            recoveryCode = recovery.code;
        }
        if (opts.resetVault) body.resetVault = true;
        const res = await api("/api/auth/change-password", { body });
        currentUser = res.user;
        currentCrypto = { kekSalt: material.kekSalt, wrappedKey: material.wrappedKey };
        setDataKey(keyForWrap);
        pendingPassword = null;
        return { user: res.user, recoveryCode };
    }

    /** Déballe la dataKey à partir d'un code de récupération (compte courant ou nommé). */
    async function recoverDataKeyWithCode(username, code) {
        const normalized = normalizeRecoveryCode(code);
        if (normalized.length < 16) throw new Error("Code de récupération incomplet.");
        const authSalt = await deterministicSalt("recovery-auth", username);
        const recoveryAuthHash = toBase64(await pbkdf2Bits(normalized, fromBase64(authSalt), RECOVERY_ITERATIONS));
        const init = await api("/api/auth/recovery/init", { body: { username, recoveryAuthHash } });
        const kekSalt = await deterministicSalt("recovery-kek", username);
        const kek = await deriveKek(normalized, kekSalt, RECOVERY_ITERATIONS);
        const recovered = await unwrapDataKey(init.recoveryWrappedKey, kek);
        return { dataKey: recovered, recoveryToken: init.recoveryToken };
    }

    /** Récupération complète « mot de passe oublié » : code + nouveau mot de passe. */
    async function recoverAccount(username, code, newPassword) {
        const uname = String(username || "").trim().toLowerCase();
        const { dataKey: recovered, recoveryToken } = await recoverDataKeyWithCode(uname, code);
        const material = await buildPasswordMaterial(newPassword, recovered);
        const newRecovery = await buildRecoveryMaterial(uname, recovered);
        const res = await api("/api/auth/recovery/complete", {
            body: Object.assign({}, material, {
                recoveryToken,
                recovery: newRecovery.material
            })
        });
        currentUser = res.user;
        currentCrypto = res.crypto;
        setDataKey(recovered);
        startPresenceHeartbeat();
        pendingPassword = null;
        return { user: res.user, recoveryCode: newRecovery.code };
    }

    async function rotateRecoveryKit(currentPassword) {
        if (!currentUser || !dataKey) throw new Error("Session ou clé indisponible.");
        const pre = await api("/api/auth/prelogin", { body: { username: currentUser.username } });
        const currentAuthHash = await deriveAuthHash(currentPassword, pre.authSalt);
        const recovery = await buildRecoveryMaterial(currentUser.username, dataKey);
        await api("/api/auth/recovery/rotate", {
            body: { currentAuthHash, recovery: recovery.material }
        });
        currentUser.hasRecovery = true;
        return recovery.code;
    }

    // ============================================================
    // Migration des comptes historiques (localStorage → serveur)
    // ============================================================
    function loadLegacyDirectory() {
        try {
            const raw = localStorage.getItem(LEGACY_ACCOUNTS_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.users) || !parsed.users.length) return null;
            return parsed;
        } catch (_) {
            return null;
        }
    }

    function hasLegacyAccounts() {
        return !!loadLegacyDirectory();
    }

    async function verifyLegacyPassword(legacyUser, password) {
        try {
            const hash = toBase64(await pbkdf2Bits(
                password, fromBase64(legacyUser.passwordSalt), LEGACY_PBKDF2_ITERATIONS
            ));
            return constantTimeEqual(hash, legacyUser.passwordHash);
        } catch (_) {
            return false;
        }
    }

    /**
     * Si la connexion serveur échoue mais que le compte existe dans l'ancien
     * annuaire localStorage avec ce mot de passe, on migre automatiquement :
     * création du compte serveur (même identifiant / mot de passe), reprise de
     * la clé de coffre historique puis import du blob chiffré existant.
     */
    async function tryLegacyMigration(username, password) {
        const dir = loadLegacyDirectory();
        if (!dir) return null;
        const legacy = dir.users.find(u => u.username === username);
        if (!legacy) return null;
        if (!(await verifyLegacyPassword(legacy, password))) return null;

        const legacyKey = legacy.vault && legacy.vault.secret ? legacy.vault.secret : generateDataKey();
        const material = await buildPasswordMaterial(password, legacyKey);
        const recovery = await buildRecoveryMaterial(username, legacyKey);
        let res;
        try {
            res = await api("/api/auth/register", {
                body: Object.assign({}, material, {
                    username,
                    displayName: legacy.displayName || username,
                    recovery: recovery.material
                })
            });
        } catch (err) {
            if (err.code === "signup_closed") {
                throw new Error("Compte historique détecté, mais l'inscription est fermée. Demandez à un administrateur d'ouvrir temporairement les inscriptions pour migrer.");
            }
            if (err.status === 409) {
                throw new Error("Ce compte existe déjà sur le serveur : connectez-vous avec son mot de passe actuel (l'ancien mot de passe local ne s'applique plus).");
            }
            throw err;
        }
        currentUser = res.user;
        currentCrypto = res.crypto;
        setDataKey(legacyKey);
        pendingPassword = null;

        if (legacy.vault && legacy.vault.id && legacy.vault.serverKey) {
            try {
                await api("/api/vault/import-legacy", {
                    body: { vaultId: legacy.vault.id, serverKey: legacy.vault.serverKey }
                });
            } catch (err) {
                if (window.SeuilUI) SeuilUI.toast(tx("Compte migré, mais l'ancien coffre n'a pas pu être importé : {message}", { message: err.message }), { type: "error", duration: 8000 });
            }
        }

        // Purge de l'entrée migrée (l'annuaire local devient inutile).
        try {
            dir.users = dir.users.filter(u => u.id !== legacy.id);
            if (dir.users.length) localStorage.setItem(LEGACY_ACCOUNTS_KEY, JSON.stringify(dir));
            else localStorage.removeItem(LEGACY_ACCOUNTS_KEY);
            localStorage.removeItem(LEGACY_VAULT_KEY);
        } catch (_) { /* non bloquant */ }

        return {
            user: res.user,
            migrated: true,
            recoveryCode: recovery.code,
            needsPasswordGate: false,
            unwrapFailed: false
        };
    }

    // ============================================================
    // Accesseurs
    // ============================================================
    function isAdmin() {
        return !!(currentUser && currentUser.role === "admin");
    }

    function getCurrentUser() {
        return currentUser ? Object.assign({}, currentUser) : null;
    }

    function getSettings() {
        return Object.assign({}, serverSettings);
    }

    // ============================================================
    // UI - écran d'authentification
    // ============================================================
    function applyRoleClasses() {
        document.body.classList.remove("auth-booting");
        document.body.classList.toggle("is-authenticated", !!currentUser);
        document.body.classList.toggle("is-admin", isAdmin());
        if (currentUser && dataKey) {
            document.body.classList.remove("auth-locked");
            const authEl = document.getElementById("auth-screen");
            if (authEl) authEl.classList.add("hidden");
        }
    }

    function showAuthScreen(mode) {
        const el = document.getElementById("auth-screen");
        if (el) el.classList.remove("hidden");
        document.body.classList.remove("auth-booting");
        document.body.classList.add("auth-locked");
        const lockedUserEl = document.getElementById("locked-user");
        if (lockedUserEl && currentUser) lockedUserEl.textContent = currentUser.displayName || currentUser.username;
        switchAuthTab(mode || "login");
        const focusTarget = mode === "locked"
            ? document.getElementById("locked-password")
            : document.getElementById("login-username");
        if (focusTarget) setTimeout(() => focusTarget.focus(), 80);
    }

    function hideAuthScreen() {
        const el = document.getElementById("auth-screen");
        if (el) el.classList.add("hidden");
        document.body.classList.remove("auth-booting");
        document.body.classList.remove("auth-locked");
    }

    function setAuthError(scope, message) {
        const el = document.getElementById(`${scope}-error`);
        if (!el) return;
        el.textContent = message || "";
        el.classList.toggle("visible", !!message);
    }

    function switchAuthTab(target) {
        const tabsRow = document.querySelector(".auth-tabs");
        const isTabbed = target === "login" || target === "signup";
        if (tabsRow) tabsRow.style.display = isTabbed ? "" : "none";
        document.querySelectorAll(".auth-tab-btn").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.target === target);
            btn.setAttribute("aria-selected", btn.dataset.target === target ? "true" : "false");
        });
        document.querySelectorAll(".auth-panel").forEach((p) => {
            p.classList.toggle("active", p.dataset.panel === target);
        });
        ["login", "signup", "recovery", "locked"].forEach((scope) => setAuthError(scope, ""));
        const head = document.querySelector(".auth-card-head");
        if (head) {
            const title = document.getElementById("auth-title");
            const subtitle = document.querySelector(".auth-subtitle");
            const copy = {
                login: ["Bon retour parmi nous", "Connectez-vous pour reprendre votre journal en toute confidentialité."],
                signup: ["Créer votre espace", "Un coffre chiffré personnel, accessible uniquement avec votre mot de passe."],
                recovery: ["Récupérer l'accès", "Utilisez votre code de récupération pour définir un nouveau mot de passe sans perdre vos données."],
                locked: ["Session verrouillée", "Saisissez votre mot de passe pour déverrouiller votre coffre chiffré dans cet onglet."]
            };
            if (title && copy[target]) title.textContent = tx(copy[target][0]);
            if (subtitle && copy[target]) subtitle.textContent = tx(copy[target][1]);
        }
    }

    function setSubmitting(buttonId, busy) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;
        btn.disabled = !!busy;
        btn.classList.toggle("is-loading", !!busy);
    }

    function bindPasswordToggles(root) {
        (root || document).querySelectorAll(".auth-pwd-toggle").forEach((btn) => {
            if (btn.__seuilBound) return;
            btn.__seuilBound = true;
            btn.addEventListener("click", () => {
                const input = document.getElementById(btn.dataset.target);
                if (!input) return;
                const reveal = input.type === "password";
                input.type = reveal ? "text" : "password";
                btn.setAttribute("aria-pressed", reveal ? "true" : "false");
                const on = btn.querySelector(".eye-on");
                const off = btn.querySelector(".eye-off");
                if (on) on.style.display = reveal ? "none" : "";
                if (off) off.style.display = reveal ? "" : "none";
            });
        });
    }

    function refreshAuthShellState() {
        const signupTabBtn = document.querySelector('.auth-tab-btn[data-target="signup"]');
        const signupHint = document.getElementById("signup-disabled-hint");
        if (signupTabBtn) signupTabBtn.style.display = serverSettings.openSignup ? "" : "none";
        if (signupHint) signupHint.style.display = serverSettings.openSignup ? "none" : "";

        const migrationHint = document.getElementById("auth-migration-hint");
        if (migrationHint) migrationHint.style.display = hasLegacyAccounts() ? "" : "none";

        const lockedUserEl = document.getElementById("locked-user");
        if (lockedUserEl && currentUser) lockedUserEl.textContent = currentUser.displayName || currentUser.username;
    }

    // ----- Kit de récupération (affiché une seule fois) -----
    function translateRecoveryKitModal(context) {
        const titleEl = document.getElementById("kit-title");
        const codeEl = document.getElementById("kit-code");
        const subEl = document.getElementById("kit-subtitle");
        const copyBtn = document.getElementById("kit-copy");
        const downloadBtn = document.getElementById("kit-download");
        const confirmText = document.querySelector(".kit-confirm-row span");
        const doneBtn = document.getElementById("kit-done");

        if (titleEl) titleEl.textContent = tx("Votre code de récupération");
        if (codeEl) codeEl.setAttribute("aria-label", tx("Code de récupération"));
        if (subEl && context === "rotated") {
            subEl.textContent = tx("Votre ancien code ne fonctionne plus. Conservez ce nouveau code dans un endroit sûr : il ne sera plus jamais affiché.");
        } else if (subEl) {
            subEl.textContent = tx("Ce code permet de récupérer votre compte et vos données si vous oubliez votre mot de passe. Il ne sera plus jamais affiché.");
        }
        if (copyBtn) copyBtn.textContent = tx("Copier");
        if (downloadBtn) downloadBtn.textContent = tx("Télécharger (.txt)");
        if (confirmText) confirmText.textContent = tx("J'ai enregistré ce code dans un endroit sûr, hors de ce navigateur.");
        if (doneBtn) doneBtn.textContent = tx("Continuer");
    }

    function showRecoveryKitModal(code, context) {
        return new Promise((resolve) => {
            const modal = document.getElementById("recovery-kit-modal");
            if (!modal) { resolve(); return; }
            const codeEl = document.getElementById("kit-code");
            const confirmChk = document.getElementById("kit-confirm");
            const doneBtn = document.getElementById("kit-done");
            codeEl.textContent = code;
            confirmChk.checked = false;
            doneBtn.disabled = true;

            const copyBtn = document.getElementById("kit-copy");
            const downloadBtn = document.getElementById("kit-download");
            translateRecoveryKitModal(context);
            const onCopy = async () => {
                try {
                    await navigator.clipboard.writeText(code);
                    copyBtn.textContent = tx("Copié ✓");
                    setTimeout(() => { copyBtn.textContent = tx("Copier"); }, 1600);
                } catch (_) {}
            };
            const onDownload = () => {
                const username = currentUser ? currentUser.username : tx("compte");
                const content = [
                    tx("Seuil - Kit de récupération"),
                    "================================",
                    "",
                    tx("Compte : {username}", { username }),
                    tx("Code de récupération : {code}", { code }),
                    "",
                    tx("Conservez ce fichier hors ligne, dans un endroit sûr."),
                    tx("Ce code permet de réinitialiser votre mot de passe SANS perdre vos données chiffrées."),
                    tx("Toute personne possédant ce code peut accéder à votre compte : ne le partagez jamais.")
                ].join("\n");
                const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `seuil-recuperation-${username}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 2000);
            };
            const onConfirm = () => { doneBtn.disabled = !confirmChk.checked; };
            const onDone = () => {
                modal.classList.remove("open");
                copyBtn.removeEventListener("click", onCopy);
                downloadBtn.removeEventListener("click", onDownload);
                confirmChk.removeEventListener("change", onConfirm);
                doneBtn.removeEventListener("click", onDone);
                resolve();
            };
            copyBtn.addEventListener("click", onCopy);
            downloadBtn.addEventListener("click", onDownload);
            confirmChk.addEventListener("change", onConfirm);
            doneBtn.addEventListener("click", onDone);
            modal.classList.add("open");
        });
    }

    // ----- Changement de mot de passe forcé (et restauration de coffre) -----
    function openPasswordGate(state) {
        return new Promise((resolve) => {
            const modal = document.getElementById("pwgate-modal");
            if (!modal) { resolve(false); return; }
            const form = document.getElementById("pwgate-form");
            const vaultBox = document.getElementById("pwgate-vault");
            const statusEl = document.getElementById("pwgate-error");
            const newInput = document.getElementById("pwgate-new");
            const confirmInput = document.getElementById("pwgate-confirm");
            const codeInput = document.getElementById("pwgate-code");
            const codeGroup = document.getElementById("pwgate-code-group");
            const introEl = document.getElementById("pwgate-intro");

            statusEl.textContent = "";
            newInput.value = "";
            confirmInput.value = "";
            if (codeInput) codeInput.value = "";
            vaultBox.style.display = state.unwrapFailed ? "" : "none";
            if (introEl) {
                introEl.textContent = state.unwrapFailed
                    ? tx("Votre mot de passe a été réinitialisé par un administrateur. Définissez un nouveau mot de passe ; pour retrouver vos données chiffrées, utilisez votre code de récupération.")
                    : tx("Pour des raisons de sécurité, vous devez définir un nouveau mot de passe avant de continuer.");
            }
            const radios = modal.querySelectorAll('input[name="pwgate-mode"]');
            radios.forEach((r) => { r.checked = r.value === (state.unwrapFailed ? "restore" : "keep"); });
            const refreshCodeVisibility = () => {
                const mode = modal.querySelector('input[name="pwgate-mode"]:checked');
                if (codeGroup) codeGroup.style.display = (mode && mode.value === "restore") ? "" : "none";
            };
            radios.forEach((r) => r.addEventListener("change", refreshCodeVisibility));
            refreshCodeVisibility();

            const onSubmit = async (e) => {
                e.preventDefault();
                statusEl.textContent = "";
                const newPwd = newInput.value;
                if (newPwd.length < 8) { statusEl.textContent = tx("8 caractères minimum."); return; }
                if (newPwd !== confirmInput.value) { statusEl.textContent = tx("Les mots de passe ne correspondent pas."); return; }
                const submitBtn = document.getElementById("pwgate-submit");
                submitBtn.disabled = true;
                submitBtn.classList.add("is-loading");
                try {
                    let options = { rotateRecovery: false };
                    if (state.unwrapFailed) {
                        const mode = modal.querySelector('input[name="pwgate-mode"]:checked');
                        if (mode && mode.value === "restore") {
                            const { dataKey: recovered } = await recoverDataKeyWithCode(currentUser.username, codeInput.value);
                            options.dataKeyOverride = recovered;
                            options.rotateRecovery = true;
                        } else {
                            options.dataKeyOverride = generateDataKey();
                            options.resetVault = true;
                            options.rotateRecovery = true;
                        }
                    }
                    const result = await changePassword(pendingPassword, newPwd, options);
                    modal.classList.remove("open");
                    form.removeEventListener("submit", onSubmit);
                    if (result.recoveryCode) await showRecoveryKitModal(result.recoveryCode, "rotated");
                    resolve(true);
                } catch (err) {
                    statusEl.textContent = tx(err.message || "Changement impossible.");
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove("is-loading");
                }
            };
            form.addEventListener("submit", onSubmit);
            modal.classList.add("open");
            setTimeout(() => newInput.focus(), 80);
        });
    }

    async function completeAuthSuccess() {
        renderSidebarUser();
        if (typeof window.onAuthSuccess === "function") {
            await window.onAuthSuccess();
        }
        applyRoleClasses();
        hideAuthScreen();
        if (typeof window.applySeuilI18n === "function") {
            window.applySeuilI18n();
        }
    }

    async function unlockCurrentSession(password) {
        try {
            await withAuthTimeout(
                unlock(password),
                "Déverrouillage trop long. Rechargez la page puis réessayez."
            );
        } catch (err) {
            console.error("[Seuil] unlock failed:", err);
            throw new Error("Mot de passe incorrect ou coffre impossible à déverrouiller.");
        }

        try {
            await withAuthTimeout(
                completeAuthSuccess(),
                "Coffre déverrouillé, mais le chargement de l'application prend trop longtemps. Rechargez la page."
            );
        } catch (err) {
            console.error("[Seuil] post-unlock app load failed:", err);
            throw err;
        }
    }

    function bindAuthUI() {
        refreshAuthShellState();
        if (authUiBound) return;
        authUiBound = true;

        document.querySelectorAll(".auth-tab-btn").forEach((btn) => {
            btn.addEventListener("click", () => switchAuthTab(btn.dataset.target));
        });
        document.querySelectorAll("[data-auth-nav]").forEach((el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                switchAuthTab(el.dataset.authNav);
                const focusId = { recovery: "recovery-username", login: "login-username" }[el.dataset.authNav];
                const target = focusId && document.getElementById(focusId);
                if (target) setTimeout(() => target.focus(), 60);
            });
        });

        bindPasswordToggles(document);

        // ----- Connexion -----
        const loginForm = document.getElementById("login-form");
        loginForm.__seuilBound = true;
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            setAuthError("login", "");
            setSubmitting("login-submit", true);
            try {
                const username = document.getElementById("login-username").value;
                const password = document.getElementById("login-password").value;
                const result = await login(username, password);
                if (result.migrated && result.recoveryCode) {
                    SeuilUI.toast(tx("Compte migré vers le serveur sécurisé."), { type: "success" });
                    await showRecoveryKitModal(result.recoveryCode);
                }
                if (result.needsPasswordGate) {
                    const ok = await openPasswordGate({ unwrapFailed: result.unwrapFailed });
                    if (!ok) throw new Error("Changement de mot de passe requis.");
                }
                await completeAuthSuccess();
            } catch (err) {
                setAuthError("login", err.message || "Connexion impossible.");
            } finally {
                setSubmitting("login-submit", false);
            }
        });

        // ----- Inscription -----
        const signupForm = document.getElementById("signup-form");
        if (signupForm) signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            setAuthError("signup", "");
            setSubmitting("signup-submit", true);
            try {
                if (!serverSettings.openSignup) throw new Error("L'inscription publique est fermée.");
                const username = document.getElementById("signup-username").value;
                const displayName = document.getElementById("signup-display").value;
                const password = document.getElementById("signup-password").value;
                const confirm = document.getElementById("signup-confirm").value;
                if (password.length < 8) throw new Error("Le mot de passe doit comporter au moins 8 caractères.");
                if (password !== confirm) throw new Error("Les mots de passe ne correspondent pas.");
                const result = await register(username, displayName, password);
                setSubmitting("signup-submit", false);
                await showRecoveryKitModal(result.recoveryCode);
                await completeAuthSuccess();
            } catch (err) {
                setAuthError("signup", err.message || "Inscription impossible.");
            } finally {
                setSubmitting("signup-submit", false);
            }
        });

        // ----- Récupération (mot de passe oublié) -----
        const recoveryForm = document.getElementById("recovery-form");
        if (recoveryForm) recoveryForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            setAuthError("recovery", "");
            setSubmitting("recovery-submit", true);
            try {
                const username = document.getElementById("recovery-username").value;
                const code = document.getElementById("recovery-code").value;
                const password = document.getElementById("recovery-password").value;
                const confirm = document.getElementById("recovery-confirm").value;
                if (password.length < 8) throw new Error("Le mot de passe doit comporter au moins 8 caractères.");
                if (password !== confirm) throw new Error("Les mots de passe ne correspondent pas.");
                const result = await recoverAccount(username, code, password);
                SeuilUI.toast(tx("Accès récupéré. Vos données sont intactes."), { type: "success" });
                await showRecoveryKitModal(result.recoveryCode, "rotated");
                await completeAuthSuccess();
            } catch (err) {
                setAuthError("recovery", err.message || "Récupération impossible.");
            } finally {
                setSubmitting("recovery-submit", false);
            }
        });

        // ----- Déverrouillage (session active, clé absente dans cet onglet) -----
        const lockedForm = document.getElementById("locked-form");
        if (lockedForm) lockedForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            setAuthError("locked", "");
            setSubmitting("locked-submit", true);
            try {
                await unlockCurrentSession(document.getElementById("locked-password").value);
            } catch (err) {
                setAuthError("locked", err.message || "Déverrouillage impossible.");
            } finally {
                setSubmitting("locked-submit", false);
            }
        });
        const lockedSignout = document.getElementById("locked-signout");
        if (lockedSignout) lockedSignout.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
        const lockedUserEl = document.getElementById("locked-user");
        if (lockedUserEl && currentUser) lockedUserEl.textContent = currentUser.displayName || currentUser.username;

        // ----- Sidebar -----
        renderSidebarUser();
        const signOut = document.getElementById("btn-sign-out");
        if (signOut) signOut.addEventListener("click", async () => {
            const ok = await SeuilUI.confirm({
                title: "Se déconnecter",
                message: "Votre session sera fermée sur cet appareil.",
                confirmLabel: "Se déconnecter"
            });
            if (ok) logout();
        });
    }

    function renderSidebarUser() {
        const wrap = document.getElementById("sidebar-user");
        if (!wrap) return;
        if (!currentUser) {
            wrap.style.display = "none";
            return;
        }
        wrap.style.display = "";
        const name = currentUser.displayName || currentUser.username;
        const initials = name.split(/\s+/).map(s => s[0] || "").join("").slice(0, 2).toUpperCase()
            || currentUser.username.slice(0, 2).toUpperCase();
        document.getElementById("sidebar-user-avatar").textContent = initials;
        document.getElementById("sidebar-user-name").textContent = name;
    }

    // ============================================================
    // UI - Compte (onglet Paramètres, tous les utilisateurs)
    // ============================================================
    function bindAccountUI() {
        const card = document.getElementById("account-card");
        if (!card || card.__seuilBound) return;
        card.__seuilBound = true;

        const nameEl = document.getElementById("account-identity");
        if (nameEl && currentUser) {
            nameEl.textContent = `${currentUser.displayName} - @${currentUser.username}`;
        }

        // Changement de mot de passe
        const form = document.getElementById("account-pwd-form");
        if (form) form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const status = document.getElementById("account-pwd-status");
            status.textContent = "";
            status.className = "admin-form-status";
            try {
                const current = document.getElementById("account-pwd-current").value;
                const next = document.getElementById("account-pwd-new").value;
                const confirm = document.getElementById("account-pwd-confirm").value;
                if (next.length < 8) throw new Error("8 caractères minimum.");
                if (next !== confirm) throw new Error("Les nouveaux mots de passe ne correspondent pas.");
                await changePassword(current, next, {});
                form.reset();
                status.textContent = tx("Mot de passe mis à jour. Les autres appareils ont été déconnectés.");
                status.classList.add("ok");
                SeuilUI.toast(tx("Mot de passe mis à jour."), { type: "success" });
            } catch (err) {
                status.textContent = translatedError(err, "Changement impossible.");
                status.classList.add("err");
            }
        });

        // Kit de récupération
        const recoveryStatus = document.getElementById("account-recovery-status");
        if (recoveryStatus && currentUser) {
            recoveryStatus.textContent = currentUser.hasRecovery
                ? tx("Un code de récupération est configuré pour ce compte.")
                : tx("Aucun code de récupération : en cas d'oubli du mot de passe, vos données chiffrées seraient perdues.");
        }
        const rotateBtn = document.getElementById("account-recovery-rotate");
        if (rotateBtn) rotateBtn.addEventListener("click", async () => {
            const password = await SeuilUI.prompt({
                title: "Confirmer votre mot de passe",
                message: "La génération d'un nouveau code de récupération invalide l'ancien.",
                label: "Mot de passe actuel",
                required: true
            });
            if (password === null) return;
            try {
                const code = await rotateRecoveryKit(password);
                if (recoveryStatus) recoveryStatus.textContent = tx("Un code de récupération est configuré pour ce compte.");
                await showRecoveryKitModal(code, "rotated");
            } catch (err) {
                SeuilUI.toast(translatedError(err, "Génération impossible."), { type: "error" });
            }
        });

        // Sessions actives
        refreshAccountSessions();
        const revokeOthers = document.getElementById("account-revoke-others");
        if (revokeOthers) revokeOthers.addEventListener("click", async () => {
            const ok = await SeuilUI.confirm({
                title: "Déconnecter les autres appareils",
                message: "Toutes les sessions sauf celle-ci seront fermées immédiatement.",
                confirmLabel: "Déconnecter"
            });
            if (!ok) return;
            try {
                const res = await api("/api/auth/sessions/revoke-others", { body: {} });
                SeuilUI.toast(tx("{count} session(s) fermée(s).", { count: res.deleted }), { type: "success" });
                refreshAccountSessions();
            } catch (err) {
                SeuilUI.toast(translatedError(err, "Sessions indisponibles."), { type: "error" });
            }
        });
    }

    async function refreshAccountSessions() {
        const list = document.getElementById("account-sessions-list");
        if (!list) return;
        try {
            const res = await api("/api/auth/sessions");
            list.innerHTML = "";
            res.sessions.forEach((s) => {
                const row = document.createElement("div");
                row.className = "session-row";
                const meta = document.createElement("div");
                meta.className = "session-meta";
                const title = document.createElement("strong");
                title.textContent = describeUserAgent(s.userAgent) + (s.current ? ` · ${tx("cet onglet")}` : "");
                const sub = document.createElement("span");
                sub.textContent = `${s.ip || tx("IP inconnue")} · ${tx("active")} ${SeuilUI.timeAgo(s.lastSeen)}`;
                meta.appendChild(title);
                meta.appendChild(sub);
                row.appendChild(meta);
                if (!s.current) {
                    const btn = document.createElement("button");
                    btn.className = "btn btn-secondary btn-sm";
                    btn.textContent = tx("Révoquer");
                    btn.addEventListener("click", async () => {
                        try {
                            await api(`/api/auth/sessions/${encodeURIComponent(s.id)}`, { method: "DELETE", body: {} });
                            refreshAccountSessions();
                        } catch (err) {
                            SeuilUI.toast(err.message, { type: "error" });
                        }
                    });
                    row.appendChild(btn);
                } else {
                    const pill = document.createElement("span");
                    pill.className = "admin-self-pill";
                    pill.textContent = tx("actuelle");
                    row.appendChild(pill);
                }
                list.appendChild(row);
            });
        } catch (_) {
            list.textContent = tx("Sessions indisponibles.");
        }
    }

    function describeUserAgent(ua) {
        const s = String(ua || "");
        let browser = "Navigateur";
        if (/edg\//i.test(s)) browser = "Edge";
        else if (/chrome\//i.test(s)) browser = "Chrome";
        else if (/firefox\//i.test(s)) browser = "Firefox";
        else if (/safari\//i.test(s)) browser = "Safari";
        let os = "";
        if (/windows/i.test(s)) os = "Windows";
        else if (/android/i.test(s)) os = "Android";
        else if (/iphone|ipad|ios/i.test(s)) os = "iOS";
        else if (/mac os/i.test(s)) os = "macOS";
        else if (/linux/i.test(s)) os = "Linux";
        return os ? `${browser} · ${os}` : browser;
    }

    // ============================================================
    // UI - Panneau d'administration
    // ============================================================
    let adminUsersCache = [];
    let adminAuditBeforeId = null;
    let adminSessionsBefore = null;

    function generateStrongPassword(len = 16) {
        const alpha = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*?";
        const bytes = randomBytes(len);
        let out = "";
        for (let i = 0; i < len; i++) out += alpha[bytes[i] % alpha.length];
        return out;
    }

    /** Matériel d'authentification minimal (sans coffre) pour reset/création admin. */
    async function buildAuthOnlyMaterial(password) {
        const authSalt = toBase64(randomBytes(16));
        const authHash = await deriveAuthHash(password, authSalt);
        return { authSalt, authHash };
    }

    async function renderAdminPanel() {
        if (!isAdmin()) return;
        try {
            const [overview, usersRes] = await Promise.all([
                api("/api/admin/overview"),
                api("/api/admin/users")
            ]);
            adminUsersCache = usersRes.users;
            renderAdminOverview(overview);
            renderAdminUsersTable();
            renderAdminAudit(true);
            renderAdminSessions();
        } catch (err) {
            if (err.status === 401) { handleSessionExpired(); return; }
            SeuilUI.toast(tx("Chargement du panneau impossible : {message}", { message: err.message }), { type: "error" });
        }
    }

    function renderAdminOverview(overview) {
        const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        setText("admin-stat-users", overview.stats.users);
        setText("admin-stat-admins", overview.stats.admins);
        setText("admin-stat-active", overview.stats.active7d);
        setText("admin-stat-sessions", overview.stats.sessions);
        setText("admin-stat-inactive", overview.stats.disabled + overview.stats.locked);

        const health = document.getElementById("admin-server-health");
        if (health) {
            health.innerHTML = "";
            const rows = [
                ["Version", overview.server.version],
                ["Disponibilité", SeuilUI.formatDuration(overview.server.uptimeSeconds)],
                ["Base de données", SeuilUI.formatBytes(overview.server.dbBytes) +
                    (overview.server.maxDbBytes > 0 ? ` / ${SeuilUI.formatBytes(overview.server.maxDbBytes)}` : "")],
                ["Coffres chiffrés", SeuilUI.formatBytes(overview.server.vaultBytes)],
                ["Journal d'audit", tx("{count} entrées", { count: overview.server.auditEntries })]
            ];
            rows.forEach(([label, value]) => {
                const div = document.createElement("div");
                div.className = "health-row";
                const dt = document.createElement("span");
                dt.textContent = tx(label);
                const dd = document.createElement("strong");
                dd.className = "mono";
                dd.textContent = value;
                div.appendChild(dt);
                div.appendChild(dd);
                health.appendChild(div);
            });
        }

        const openSignupChk = document.getElementById("admin-open-signup");
        if (openSignupChk) openSignupChk.checked = !!overview.settings.openSignup;
        serverSettings.openSignup = !!overview.settings.openSignup;
    }

    function renderAdminUsersTable() {
        const tbody = document.getElementById("admin-users-tbody");
        if (!tbody) return;
        const searchEl = document.getElementById("admin-users-search");
        const query = searchEl ? searchEl.value.trim().toLowerCase() : "";
        const users = adminUsersCache.filter((u) =>
            !query || u.username.includes(query) || (u.displayName || "").toLowerCase().includes(query)
        );
        tbody.innerHTML = "";
        if (!users.length) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 7;
            td.className = "admin-empty";
            td.textContent = query ? tx("Aucun utilisateur ne correspond à la recherche.") : tx("Aucun utilisateur.");
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }
        const sorted = users.slice().sort((a, b) => {
            if (a.role !== b.role) return a.role === "admin" ? -1 : 1;
            return (b.createdAt || 0) - (a.createdAt || 0);
        });
        const now = Date.now() / 1000;
        sorted.forEach((u) => {
            const tr = document.createElement("tr");
            tr.dataset.uid = u.id;

            // Compte
            const tdUser = document.createElement("td");
            const cell = document.createElement("div");
            cell.className = "admin-user-cell";
            const avatar = document.createElement("div");
            avatar.className = "admin-avatar";
            avatar.textContent = ((u.displayName || u.username).split(/\s+/).map(s => s[0] || "").join("").slice(0, 2) || "·").toUpperCase();
            const nameWrap = document.createElement("div");
            const nameEl = document.createElement("div");
            nameEl.className = "admin-user-name";
            nameEl.textContent = u.displayName || u.username;
            if (currentUser && currentUser.id === u.id) {
                const pill = document.createElement("span");
                pill.className = "admin-self-pill";
                pill.textContent = tx("vous");
                nameEl.appendChild(pill);
            }
            const handle = document.createElement("div");
            handle.className = "admin-user-handle";
            handle.textContent = "@" + u.username;
            nameWrap.appendChild(nameEl);
            nameWrap.appendChild(handle);
            cell.appendChild(avatar);
            cell.appendChild(nameWrap);
            tdUser.appendChild(cell);

            // Rôle
            const tdRole = document.createElement("td");
            const roleBadge = document.createElement("span");
            roleBadge.className = "role-badge " + (u.role === "admin" ? "role-admin" : "role-user");
            roleBadge.textContent = u.role === "admin" ? tx("Administrateur") : tx("Utilisateur");
            tdRole.appendChild(roleBadge);

            // État
            const tdStatus = document.createElement("td");
            const status = document.createElement("span");
            if (!u.active) {
                status.className = "admin-status off";
                status.textContent = tx("Désactivé");
            } else if (u.lockedUntil && u.lockedUntil > now) {
                status.className = "admin-status locked";
                status.textContent = tx("Verrouillé");
            } else if (u.mustChangePassword) {
                status.className = "admin-status locked";
                status.textContent = tx("Mot de passe à définir");
            } else if ((u.onlineSessionCount || 0) > 0) {
                status.className = "admin-status ok";
                status.textContent = tx("Connecté");
            } else {
                status.className = "admin-status off";
                status.textContent = tx("Hors ligne");
            }
            tdStatus.appendChild(status);

            // Activité / stockage
            const tdSeen = document.createElement("td");
            tdSeen.className = "mono";
            tdSeen.textContent = SeuilUI.timeAgo(u.lastLogin);
            const tdData = document.createElement("td");
            tdData.className = "mono";
            tdData.textContent = SeuilUI.formatBytes(u.vaultBytes || 0);
            const tdSessions = document.createElement("td");
            tdSessions.className = "mono";
            tdSessions.textContent = String(u.sessionCount || 0);

            // Actions
            const tdActions = document.createElement("td");
            tdActions.className = "admin-actions";
            const actions = [
                { act: "reset", label: tx("Réinit. mdp"), title: tx("Réinitialiser le mot de passe") },
                { act: "role", label: u.role === "admin" ? tx("Rétrograder") : tx("Promouvoir"), title: tx("Changer le rôle") },
                { act: "toggle", label: u.active ? tx("Désactiver") : tx("Activer"), title: tx("Activer / désactiver") },
                { act: "revoke", label: tx("Sessions"), title: tx("Révoquer toutes les sessions") },
                { act: "delete", label: tx("Suppr."), title: tx("Supprimer le compte"), danger: true }
            ];
            actions.forEach((a) => {
                const btn = document.createElement("button");
                btn.className = "btn btn-sm " + (a.danger ? "btn-danger" : "btn-secondary");
                btn.dataset.act = a.act;
                btn.title = a.title;
                btn.textContent = a.label;
                tdActions.appendChild(btn);
            });

            tr.appendChild(tdUser);
            tr.appendChild(tdRole);
            tr.appendChild(tdStatus);
            tr.appendChild(tdSeen);
            tr.appendChild(tdData);
            tr.appendChild(tdSessions);
            tr.appendChild(tdActions);
            tbody.appendChild(tr);
        });
    }

    function formatAuditAction(action) {
        const labels = {
            "user.register": "Inscription utilisateur",
            "login.failed": "Échec de connexion",
            "login.locked": "Compte verrouillé",
            "login.success": "Connexion réussie",
            "logout": "Déconnexion",
            "password.change_failed": "Échec changement mot de passe",
            "password.changed": "Mot de passe modifié",
            "password.reset_by_admin": "Réinitialisation admin du mot de passe",
            "recovery.failed": "Échec récupération",
            "recovery.initiated": "Récupération initiée",
            "recovery.completed": "Récupération terminée",
            "recovery.rotated": "Code de récupération régénéré",
            "session.revoked": "Session révoquée",
            "session.revoked_others": "Autres sessions révoquées",
            "session.revoked_by_admin": "Sessions révoquées par admin",
            "vault.reset": "Coffre réinitialisé",
            "vault.import_denied": "Import coffre refusé",
            "vault.imported": "Coffre importé",
            "user.created": "Compte créé",
            "user.updated": "Compte modifié",
            "user.deleted": "Compte supprimé",
            "settings.updated": "Réglage modifié"
        };
        return tx(labels[action] || action || "-");
    }

    function formatAuditDetail(detail) {
        const text = String(detail || "").trim();
        if (!text) return "";
        const sessionMatch = text.match(/^(\d+) session\(s\)$/);
        if (sessionMatch) return tx("{count} session(s)", { count: sessionMatch[1] });
        const roleMatch = text.match(/^rôle (.+)$/);
        if (roleMatch) return tx("rôle {role}", { role: tx(roleMatch[1]) });
        const oldVaultMatch = text.match(/^ancien coffre (.+)$/);
        if (oldVaultMatch) return tx("ancien coffre {id}", { id: oldVaultMatch[1] });
        const signupMatch = text.match(/^openSignup=(True|False|true|false)$/);
        if (signupMatch) return tx(signupMatch[1].toLowerCase() === "true" ? "inscriptions ouvertes" : "inscriptions fermées");
        return text.split(",").map((part) => tx(part.trim())).filter(Boolean).join(", ");
    }

    async function renderAdminAudit(reset) {
        const tbody = document.getElementById("admin-audit-tbody");
        if (!tbody) return;
        if (reset) {
            adminAuditBeforeId = null;
            tbody.innerHTML = "";
        }
        const actionEl = document.getElementById("admin-audit-filter");
        const searchEl = document.getElementById("admin-audit-search");
        const params = new URLSearchParams();
        params.set("limit", "30");
        if (adminAuditBeforeId) params.set("before", String(adminAuditBeforeId));
        if (actionEl && actionEl.value) params.set("action", actionEl.value);
        if (searchEl && searchEl.value.trim()) params.set("q", searchEl.value.trim());
        try {
            const res = await api("/api/admin/audit?" + params.toString());
            const entries = res.entries;
            const moreBtn = document.getElementById("admin-audit-more");
            if (moreBtn) moreBtn.style.display = entries.length === 30 ? "" : "none";
            if (!entries.length && !tbody.children.length) {
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 5;
                td.className = "admin-empty";
                td.textContent = tx("Aucune entrée d'audit.");
                tr.appendChild(td);
                tbody.appendChild(tr);
                return;
            }
            entries.forEach((entry) => {
                adminAuditBeforeId = entry.id;
                const tr = document.createElement("tr");
                const tdTs = document.createElement("td");
                tdTs.className = "mono";
                tdTs.textContent = SeuilUI.formatDateTime(entry.ts);
                const tdActor = document.createElement("td");
                tdActor.textContent = entry.actor || "-";
                const tdAction = document.createElement("td");
                const badge = document.createElement("span");
                badge.className = "audit-action " + auditActionClass(entry.action);
                badge.textContent = formatAuditAction(entry.action);
                tdAction.appendChild(badge);
                const tdTarget = document.createElement("td");
                tdTarget.textContent = entry.target || "-";
                const tdDetail = document.createElement("td");
                tdDetail.className = "audit-detail";
                tdDetail.textContent = [formatAuditDetail(entry.detail), entry.ip].filter(Boolean).join(" · ");
                tr.appendChild(tdTs);
                tr.appendChild(tdActor);
                tr.appendChild(tdAction);
                tr.appendChild(tdTarget);
                tr.appendChild(tdDetail);
                tbody.appendChild(tr);
            });
        } catch (err) {
            SeuilUI.toast(tx("Journal d'audit indisponible : {message}", { message: err.message }), { type: "error" });
        }
    }

    function auditActionClass(action) {
        if (/failed|denied|locked/.test(action)) return "audit-warn";
        if (/deleted|reset/.test(action)) return "audit-danger";
        if (/success|created|register|completed/.test(action)) return "audit-ok";
        return "audit-neutral";
    }

    function adminSessionCursor(session) {
        return `${session.lastSeen || 0}:${session.id || ""}`;
    }

    async function renderAdminSessions(reset) {
        const tbody = document.getElementById("admin-sessions-tbody");
        if (!tbody) return;
        if (reset !== false) {
            adminSessionsBefore = null;
            tbody.innerHTML = "";
        }
        const params = new URLSearchParams();
        params.set("limit", String(ADMIN_SESSIONS_PAGE_SIZE));
        if (adminSessionsBefore) params.set("before", adminSessionsBefore);
        try {
            const res = await api("/api/admin/sessions?" + params.toString());
            const sessions = res.sessions || [];
            const moreBtn = document.getElementById("admin-sessions-more");
            if (moreBtn) moreBtn.style.display = sessions.length === ADMIN_SESSIONS_PAGE_SIZE ? "" : "none";
            if (!sessions.length && !tbody.children.length) {
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 4;
                td.className = "admin-empty";
                td.textContent = tx("Aucune session active.");
                tr.appendChild(td);
                tbody.appendChild(tr);
                return;
            }
            sessions.forEach((s) => {
                adminSessionsBefore = adminSessionCursor(s);
                const tr = document.createElement("tr");
                const tdUser = document.createElement("td");
                tdUser.textContent = `${s.displayName} (@${s.username})`;
                const tdDevice = document.createElement("td");
                tdDevice.textContent = describeUserAgent(s.userAgent);
                const tdSeen = document.createElement("td");
                tdSeen.className = "mono";
                tdSeen.textContent = `${SeuilUI.timeAgo(s.lastSeen)} · ${s.ip || "?"}`;
                const tdAct = document.createElement("td");
                tdAct.className = "admin-actions";
                const btn = document.createElement("button");
                btn.className = "btn btn-sm btn-secondary";
                btn.textContent = tx("Révoquer");
                btn.addEventListener("click", async () => {
                    try {
                        await api(`/api/auth/sessions/${encodeURIComponent(s.id)}`, { method: "DELETE", body: {} });
                        renderAdminSessions(true);
                    } catch (err) {
                        SeuilUI.toast(err.message, { type: "error" });
                    }
                });
                tdAct.appendChild(btn);
                tr.appendChild(tdUser);
                tr.appendChild(tdDevice);
                tr.appendChild(tdSeen);
                tr.appendChild(tdAct);
                tbody.appendChild(tr);
            });
        } catch (_) { /* silencieux */ }
    }

    function bindAdminUI() {
        const createBtn = document.getElementById("admin-create-user");
        if (createBtn) createBtn.addEventListener("click", () => {
            const modal = document.getElementById("admin-create-modal");
            if (!modal) return;
            const pwd = document.getElementById("admin-new-password");
            if (pwd) pwd.value = generateStrongPassword();
            modal.classList.add("open");
            const first = document.getElementById("admin-new-username");
            if (first) setTimeout(() => first.focus(), 80);
        });

        document.querySelectorAll("[data-act='gen-pwd']").forEach((b) => {
            b.addEventListener("click", () => {
                const target = document.getElementById(b.dataset.target);
                if (target) target.value = generateStrongPassword();
            });
        });

        const closeBtn = document.getElementById("admin-create-close");
        if (closeBtn) closeBtn.addEventListener("click", closeCreateUserModal);

        const createForm = document.getElementById("admin-create-form");
        if (createForm) createForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const status = document.getElementById("admin-create-status");
            status.textContent = "";
            status.className = "admin-form-status";
            const submitBtn = createForm.querySelector("button[type='submit']");
            submitBtn.disabled = true;
            try {
                const username = document.getElementById("admin-new-username").value.trim().toLowerCase();
                const displayName = document.getElementById("admin-new-display").value;
                const role = document.getElementById("admin-new-role").value;
                const password = document.getElementById("admin-new-password").value;
                if (password.length < 8) throw new Error("Mot de passe initial : 8 caractères minimum.");
                // La clé de coffre est générée puis enveloppée avec le mot de passe initial.
                const tempKey = generateDataKey();
                const material = await buildPasswordMaterial(password, tempKey);
                await api("/api/admin/users", {
                    body: Object.assign({}, material, { username, displayName, role })
                });
                closeCreateUserModal();
                await SeuilUI.alert({
                    title: "Compte créé",
                    message: tx("Transmettez ce mot de passe initial à {username} par un canal sûr. Il devra le changer à sa première connexion.", { username }),
                    detail: password
                });
                renderAdminPanel();
            } catch (err) {
                status.textContent = translatedError(err, "Création impossible.");
                status.classList.add("err");
            } finally {
                submitBtn.disabled = false;
            }
        });

        const openSignupChk = document.getElementById("admin-open-signup");
        if (openSignupChk) openSignupChk.addEventListener("change", async (e) => {
            try {
                const res = await api("/api/admin/settings", { method: "PUT", body: { openSignup: e.target.checked } });
                serverSettings.openSignup = res.settings.openSignup;
                SeuilUI.toast(tx(res.settings.openSignup ? "Inscription publique activée." : "Inscription publique fermée."), { type: "success" });
            } catch (err) {
                e.target.checked = !e.target.checked;
                SeuilUI.toast(translatedError(err, "Action impossible."), { type: "error" });
            }
        });

        const usersSearch = document.getElementById("admin-users-search");
        if (usersSearch) usersSearch.addEventListener("input", renderAdminUsersTable);

        const auditFilter = document.getElementById("admin-audit-filter");
        if (auditFilter) auditFilter.addEventListener("change", () => renderAdminAudit(true));
        const auditSearch = document.getElementById("admin-audit-search");
        if (auditSearch) {
            let timer = null;
            auditSearch.addEventListener("input", () => {
                clearTimeout(timer);
                timer = setTimeout(() => renderAdminAudit(true), 350);
            });
        }
        const auditMore = document.getElementById("admin-audit-more");
        if (auditMore) auditMore.addEventListener("click", () => renderAdminAudit(false));
        const sessionsMore = document.getElementById("admin-sessions-more");
        if (sessionsMore) sessionsMore.addEventListener("click", () => renderAdminSessions(false));
        const auditRefresh = document.getElementById("admin-audit-refresh");
        if (auditRefresh) auditRefresh.addEventListener("click", () => renderAdminAudit(true));

        // Délégation des actions sur la table utilisateurs
        const tbody = document.getElementById("admin-users-tbody");
        if (tbody) tbody.addEventListener("click", async (e) => {
            const btn = e.target.closest("button[data-act]");
            if (!btn) return;
            const row = btn.closest("tr[data-uid]");
            if (!row) return;
            const uid = row.dataset.uid;
            const user = adminUsersCache.find(u => u.id === uid);
            if (!user) return;
            try {
                if (btn.dataset.act === "reset") {
                    await adminResetPasswordFlow(user);
                } else if (btn.dataset.act === "role") {
                    const newRole = user.role === "admin" ? "user" : "admin";
                    const ok = await SeuilUI.confirm({
                        title: tx(newRole === "admin" ? "Promouvoir administrateur" : "Rétrograder en utilisateur"),
                        message: tx(newRole === "admin"
                            ? "{username} pourra gérer les comptes et consulter le journal d'audit."
                            : "{username} perdra l'accès au panneau d'administration.", { username: user.username }),
                        confirmLabel: tx("Confirmer")
                    });
                    if (!ok) return;
                    await api(`/api/admin/users/${encodeURIComponent(uid)}`, { method: "PATCH", body: { role: newRole } });
                    SeuilUI.toast(tx("Rôle de {username} mis à jour.", { username: user.username }), { type: "success" });
                } else if (btn.dataset.act === "toggle") {
                    const next = !user.active;
                    const ok = await SeuilUI.confirm({
                        title: tx(next ? "Réactiver le compte" : "Désactiver le compte"),
                        message: next
                            ? tx("{username} pourra à nouveau se connecter.", { username: user.username })
                            : tx("{username} sera déconnecté immédiatement et ne pourra plus se connecter. Ses données chiffrées sont conservées.", { username: user.username }),
                        confirmLabel: tx(next ? "Réactiver" : "Désactiver"),
                        danger: !next
                    });
                    if (!ok) return;
                    await api(`/api/admin/users/${encodeURIComponent(uid)}`, { method: "PATCH", body: { active: next } });
                    SeuilUI.toast(tx("Compte {username} {status}.", { username: user.username, status: tx(next ? "réactivé" : "désactivé") }), { type: "success" });
                } else if (btn.dataset.act === "revoke") {
                    const res = await api(`/api/admin/users/${encodeURIComponent(uid)}/revoke-sessions`, { body: {} });
                    SeuilUI.toast(tx("{count} session(s) de {username} révoquée(s).", { count: res.deleted, username: user.username }), { type: "success" });
                } else if (btn.dataset.act === "delete") {
                    const ok = await SeuilUI.confirm({
                        title: tx("Supprimer définitivement"),
                        message: tx("Le compte {username} et son coffre chiffré seront effacés. Cette action est irréversible.", { username: user.username }),
                        confirmLabel: tx("Supprimer"),
                        danger: true
                    });
                    if (!ok) return;
                    const sure = await SeuilUI.confirm({
                        title: tx("Confirmation finale"),
                        message: tx("Dernière vérification : supprimer {username} et toutes ses données ?", { username: user.username }),
                        confirmLabel: tx("Oui, supprimer tout"),
                        danger: true
                    });
                    if (!sure) return;
                    await api(`/api/admin/users/${encodeURIComponent(uid)}`, { method: "DELETE", body: {} });
                    SeuilUI.toast(tx("Compte {username} supprimé.", { username: user.username }), { type: "success" });
                }
                renderAdminPanel();
            } catch (err) {
                SeuilUI.toast(translatedError(err, "Action impossible."), { type: "error" });
            }
        });
    }

    async function adminResetPasswordFlow(user) {
        const recoveryNote = user.hasRecovery
            ? tx("Ses données chiffrées restent récupérables avec son code de récupération.")
            : tx("Attention : sans code de récupération ni export JSON, ses données chiffrées seront irrécupérables.");
        const ok = await SeuilUI.confirm({
            title: "Réinitialiser le mot de passe",
            message: tx("Un mot de passe temporaire sera généré pour {username}. Ses sessions seront fermées et il devra définir un nouveau mot de passe. {recoveryNote}",
                { username: user.username, recoveryNote }),
            confirmLabel: "Générer un mot de passe",
            danger: !user.hasRecovery
        });
        if (!ok) return;
        const tempPassword = generateStrongPassword();
        const material = await buildAuthOnlyMaterial(tempPassword);
        await api(`/api/admin/users/${encodeURIComponent(user.id)}/reset-password`, { body: material });
        await SeuilUI.alert({
            title: "Mot de passe réinitialisé",
            message: tx("Transmettez ce mot de passe temporaire à {username} par un canal sûr.", { username: user.username }),
            detail: tempPassword
        });
    }

    function closeCreateUserModal() {
        const m = document.getElementById("admin-create-modal");
        if (m) m.classList.remove("open");
        const status = document.getElementById("admin-create-status");
        if (status) { status.textContent = ""; status.className = "admin-form-status"; }
        const form = document.getElementById("admin-create-form");
        if (form) form.reset();
    }

    // ============================================================
    // Export public
    // ============================================================
    window.SeuilAuth = {
        boot,
        login,
        logout,
        deleteCurrentAccount,
        register,
        unlock,
        changePassword,
        getCurrentUser,
        getDataKey,
        getSettings,
        isAdmin,
        handleSessionExpired,
        // UI
        showAuthScreen,
        hideAuthScreen,
        bindAuthUI,
        bindAccountUI,
        bindAdminUI,
        renderAdminPanel,
        renderSidebarUser,
        applyRoleClasses,
        generateStrongPassword
    };
})();
