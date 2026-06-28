/**
 * Seuil - client Node de test/administration.
 * Réplique EXACTEMENT la cryptographie du client navigateur (auth.js) :
 *  - authHash = PBKDF2-SHA256(motDePasse, authSalt, 600 000)
 *  - KEK      = PBKDF2-SHA256(motDePasse, kekSalt, 600 000) - AES-GCM
 *  - wrappedKey = "v1:<iv b64>:<ct b64>" (AES-GCM de la dataKey)
 *  - Kit de récupération : code 24 symboles (alphabet sans ambiguïté),
 *    sels déterministes SHA-256("seuil:recovery:<user>") tronqués à 16 o.
 *
 * Usage :
 *   node tools/seuil_client.mjs verify  <baseUrl>                  - parcours complet de test
 *   node tools/seuil_client.mjs bootstrap <baseUrl> <user> [pwd]   - crée un compte (1er = admin)
 */

const subtle = globalThis.crypto.subtle;

const AUTH_ITER = 600000;
const KEK_ITER = 600000;
const RECOVERY_ITER = 100000;
const RECOVERY_ALPHABET = "ABCDEFGHJKMNPQRSTVWXYZ0123456789";

const b64 = (buf) => Buffer.from(buf).toString("base64");
const fromB64 = (s) => Buffer.from(String(s).replace(/-/g, "+").replace(/_/g, "/"), "base64");
const b64url = (buf) => Buffer.from(buf).toString("base64url");

async function pbkdf2Bits(secret, saltBytes, iterations) {
  const km = await subtle.importKey("raw", new TextEncoder().encode(secret), { name: "PBKDF2" }, false, ["deriveBits"]);
  const bits = await subtle.deriveBits({ name: "PBKDF2", salt: saltBytes, iterations, hash: "SHA-256" }, km, 256);
  return new Uint8Array(bits);
}

async function deriveKek(secret, saltB64, iterations = KEK_ITER) {
  const bits = await pbkdf2Bits(secret, fromB64(saltB64), iterations);
  return subtle.importKey("raw", bits, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

async function wrapDataKey(dataKey, kek) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await subtle.encrypt({ name: "AES-GCM", iv }, kek, new TextEncoder().encode(dataKey));
  return `v1:${b64(iv)}:${b64(new Uint8Array(ct))}`;
}

async function unwrapDataKey(wrapped, kek) {
  const [v, ivB64, ctB64] = String(wrapped).split(":");
  if (v !== "v1") throw new Error("format");
  const plain = await subtle.decrypt({ name: "AES-GCM", iv: fromB64(ivB64) }, kek, fromB64(ctB64));
  return new TextDecoder().decode(plain);
}

function generateRecoveryCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  let out = "";
  for (let i = 0; i < 24; i++) out += RECOVERY_ALPHABET[bytes[i] % 32];
  return out.match(/.{1,4}/g).join("-");
}

async function deterministicSalt(label, username) {
  const digest = await subtle.digest("SHA-256", new TextEncoder().encode(`seuil:${label}:${username}`));
  return b64(new Uint8Array(digest).slice(0, 16));
}

async function buildPasswordMaterial(password, dataKey) {
  const authSalt = b64(crypto.getRandomValues(new Uint8Array(16)));
  const kekSalt = b64(crypto.getRandomValues(new Uint8Array(16)));
  const authHash = b64(await pbkdf2Bits(password, fromB64(authSalt), AUTH_ITER));
  const wrappedKey = await wrapDataKey(dataKey, await deriveKek(password, kekSalt));
  return { authSalt, authHash, kekSalt, wrappedKey };
}

async function buildRecoveryMaterial(username, dataKey) {
  const code = generateRecoveryCode();
  const normalized = code.replace(/[^A-Z0-9]/g, "");
  const authSalt = await deterministicSalt("recovery-auth", username);
  const kekSalt = await deterministicSalt("recovery-kek", username);
  const authHash = b64(await pbkdf2Bits(normalized, fromB64(authSalt), RECOVERY_ITER));
  const wrappedKey = await wrapDataKey(dataKey, await deriveKek(normalized, kekSalt, RECOVERY_ITER));
  return { code, material: { authSalt, authHash, kekSalt, wrappedKey } };
}

/* - Chiffrement du coffre (identique à app.js : PBKDF2 100k + AES-GCM, format hex) - */
const hex = (buf) => Buffer.from(buf).toString("hex");
const fromHex = (s) => Buffer.from(s, "hex");

async function encryptText(text, secret) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const km = await subtle.importKey("raw", new TextEncoder().encode(secret), { name: "PBKDF2" }, false, ["deriveKey"]);
  const key = await subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, km, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const ct = await subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text));
  return "ENCRYPTED:" + hex(salt) + ":" + hex(iv) + ":" + hex(new Uint8Array(ct));
}

async function decryptText(blob, secret) {
  const [salt, iv, ct] = blob.replace("ENCRYPTED:", "").split(":").map(fromHex);
  const km = await subtle.importKey("raw", new TextEncoder().encode(secret), { name: "PBKDF2" }, false, ["deriveKey"]);
  const key = await subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, km, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const plain = await subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return new TextDecoder().decode(plain);
}

/* - Client HTTP avec cookies - */
function makeApi(base) {
  let cookie = "";
  return async function api(path, { method = "GET", body } = {}) {
    const headers = { Accept: "application/json" };
    if (method !== "GET") headers["X-Seuil-Csrf"] = "1";
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (cookie) headers["Cookie"] = cookie;
    const res = await fetch(base + path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie && setCookie.includes("seuil_session=")) {
      cookie = setCookie.split(";")[0];
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || `HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return data;
  };
}

function strongPassword(len = 18) {
  const alpha = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*?";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let out = "";
  for (let i = 0; i < len; i++) out += alpha[bytes[i] % alpha.length];
  return out;
}

async function register(api, username, password, displayName) {
  const dataKey = b64url(crypto.getRandomValues(new Uint8Array(32)));
  const material = await buildPasswordMaterial(password, dataKey);
  const recovery = await buildRecoveryMaterial(username, dataKey);
  const res = await api("/api/auth/register", {
    method: "POST",
    body: { ...material, username, displayName: displayName || username, recovery: recovery.material },
  });
  return { res, dataKey, recoveryCode: recovery.code };
}

async function login(api, username, password) {
  const pre = await api("/api/auth/prelogin", { method: "POST", body: { username } });
  const authHash = b64(await pbkdf2Bits(password, fromB64(pre.authSalt), AUTH_ITER));
  const res = await api("/api/auth/login", { method: "POST", body: { username, authHash } });
  const kek = await deriveKek(password, res.crypto.kekSalt);
  const dataKey = await unwrapDataKey(res.crypto.wrappedKey, kek);
  return { res, dataKey };
}

/* ============================ Commandes ============================ */

async function cmdVerify(base) {
  const checks = [];
  const ok = (name, cond) => { checks.push([name, !!cond]); if (!cond) process.exitCode = 1; };

  // 1. inscription (bootstrap admin) + déballage de clé
  const api1 = makeApi(base);
  const user = "verif-" + Math.random().toString(36).slice(2, 8);
  const pwd = strongPassword();
  const reg = await register(api1, user, pwd);
  ok("inscription - admin (bootstrap ou user)", ["admin", "user"].includes(reg.res.user.role));

  // 2. login depuis un « autre appareil » + unwrap de la clé
  const api2 = makeApi(base);
  const log = await login(api2, user, pwd);
  ok("login + déballage wrappedKey identique", log.dataKey === reg.dataKey);

  // 3. coffre chiffré aller-retour
  const blob = await encryptText(JSON.stringify({ marker: "node-e2e", sessions: [] }), log.dataKey);
  await api2("/api/vault", { method: "PUT", body: { blob } });
  const got = await api2("/api/vault");
  const dec = JSON.parse(await decryptText(got.blob, log.dataKey));
  ok("coffre chiffré aller-retour", dec.marker === "node-e2e");

  // 4. mauvais mot de passe - unwrap impossible (GCM)
  let gcmFailed = false;
  try {
    const kekBad = await deriveKek("mauvais-mot-de-passe", log.res.crypto.kekSalt);
    await unwrapDataKey(log.res.crypto.wrappedKey, kekBad);
  } catch { gcmFailed = true; }
  ok("mauvais mot de passe - clé indéballable", gcmFailed);

  // 5. récupération par code
  const api3 = makeApi(base);
  const normalized = reg.recoveryCode.replace(/[^A-Z0-9]/g, "");
  const rAuthSalt = await deterministicSalt("recovery-auth", user);
  const recoveryAuthHash = b64(await pbkdf2Bits(normalized, fromB64(rAuthSalt), RECOVERY_ITER));
  const init = await api3("/api/auth/recovery/init", { method: "POST", body: { username: user, recoveryAuthHash } });
  const rKekSalt = await deterministicSalt("recovery-kek", user);
  const recovered = await unwrapDataKey(init.recoveryWrappedKey, await deriveKek(normalized, rKekSalt, RECOVERY_ITER));
  ok("code de récupération - même dataKey", recovered === reg.dataKey);

  // 6. endpoints admin si admin
  if (reg.res.user.role === "admin") {
    const ov = await api1("/api/admin/overview");
    ok("admin/overview", ov.ok && typeof ov.stats.users === "number");
    const audit = await api1("/api/admin/audit?limit=10");
    ok("audit contient user.register", audit.entries.some((e) => e.action === "user.register"));
  }

  // 7. CSRF requis
  let csrfBlocked = false;
  try {
    await fetch(base + "/api/vault", { method: "PUT", headers: { "Content-Type": "application/json" }, body: "{}" })
      .then((r) => { csrfBlocked = r.status === 403 || r.status === 401; });
  } catch { /* réseau */ }
  ok("mutation sans en-tête CSRF refusée", csrfBlocked);

  for (const [name, passed] of checks) console.log((passed ? "PASS " : "FAIL ") + name);
  console.log(checks.every(([, p]) => p) ? "\nTOUT EST OK" : "\nDES ÉCHECS");
}

async function cmdBootstrap(base, username, password) {
  const api = makeApi(base);
  const pwd = password || strongPassword();
  const { res, recoveryCode } = await register(api, username, pwd);
  console.log(JSON.stringify({
    username: res.user.username,
    role: res.user.role,
    password: pwd,
    recoveryCode,
  }, null, 2));
}

const [, , cmd, base, ...rest] = process.argv;
if (cmd === "verify") await cmdVerify(base || "http://127.0.0.1:8742");
else if (cmd === "bootstrap") await cmdBootstrap(base, rest[0], rest[1]);
else console.log("Usage: node tools/seuil_client.mjs verify <baseUrl> | bootstrap <baseUrl> <user> [pwd]");
