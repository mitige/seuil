<div align="center">

# Seuil

**A private, offline-capable harm-reduction journal.**
Log your sessions, read educational substance cards, check risky combinations,
and keep your data under your own control — encrypted end-to-end.

[**Live app → seuil.pro**](https://seuil.pro) · [**Français**](README.fr.md)

![PWA](https://img.shields.io/badge/PWA-offline--ready-2563eb)
![Encryption](https://img.shields.io/badge/encryption-zero--knowledge-10b981)
![No tracking](https://img.shields.io/badge/tracking-none-64748b)
![Stack](https://img.shields.io/badge/stack-vanilla%20JS%20%2B%20Flask-7c3aed)

</div>

> [!IMPORTANT]
> **Seuil is an information, self-tracking and harm-reduction tool.** It does **not**
> encourage the use of psychoactive substances and never guarantees the safety of a
> dose, a product or a combination. Its content replaces neither medical advice, nor
> drug checking, nor the support of a specialised service. An "indicative threshold"
> or a "low-risk" interaction never means *safe*.

---

## ⭐ Found this useful?

If Seuil helps you, or if you appreciate a privacy-first take on harm reduction,
a **star on the repository** genuinely helps — it makes the project easier for
others to find, and easier to keep maintained. No newsletter, no ask, just a star.

---

## Table of contents

- [What is Seuil?](#what-is-seuil)
- [Features](#features)
- [Privacy & security model](#privacy--security-model)
- [Getting started (local)](#getting-started-local)
- [Self-hosting](#self-hosting)
- [Testing](#testing)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Internationalization](#internationalization)
- [Emergency & help resources](#emergency--help-resources)
- [Status & roadmap](#status--roadmap)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)
- [Disclaimer](#disclaimer)

---

## What is Seuil?

**Seuil** ("threshold" in French) is a harm-reduction (*réduction des risques*) web
application aimed at people who want to **slow down decisions, document what they
take, and understand the risks** — privately.

It works as an installable **Progressive Web App**: the interface runs entirely in
the browser and stays usable offline. An **optional Python server** adds real
multi-user accounts with **zero-knowledge encryption** — the server stores your
data, but can never read it.

The app is primarily in **French** with built-in **English** translations.

---

## Features

**Journal, live tracking and history**
- Record sessions with date/time, substance, route, dose, unit, set/setting and
  contextual notes.
- Use exact units (`mg`, `g`, `ug`, `ml`) or configurable qualitative units such
  as line, joint, glass, tablet, drop, puff or dose when precision is unavailable.
- Follow an active session with an estimated effect curve, draggable curve probe,
  elapsed time, cumulative dose, live notes, and per-substance redosing.
- Track more than one substance in the same session and keep a structured
  timeline for later debriefing.
- Search and review closed sessions, with editable/deletable dose entries.

**Substance knowledge base**
- Browse **120+ educational substance cards** with forms, routes, indicative
  dosage ranges, route-specific timelines, estimated bioavailability, metabolism
  notes where available, warning signs, aftercare and harm-reduction rules.
- Route display is intentionally conservative: low-value or misleading routes are
  hidden when a substance is realistically oral-only, inhaled-only or otherwise
  route-limited.
- Compare 2 to 5 theoretical effect curves side by side.
- Check combinations in the interaction analyzer, which classifies documented
  risks and explains unknown combinations as uncertain rather than safe.
- Create personal substance cards for private notes, with clear warnings that
  user-entered data is not externally verified.

**Personal tools**
- Maintain an encrypted inventory with quantity tracking and low-stock signals.
- Read statistics on frequency, spacing, repeated use and risky proximity between
  sessions.
- Configure interface language, qualitative dose units, backups and account
  controls from Settings.
- Support the project through the Donations page without connecting donation data
  to the encrypted Seuil vault.

**Optional AI assistance**
- A discreet AI assistant can answer harm-reduction questions through the server
  endpoint backed by OpenRouter, when configured by the host.
- Contextual AI buttons can review a planned session, active session, selected
  curve comparison, selected combination, recent trends or last closed session.
- The frontend never contains the OpenRouter API key; requests go through
  `/api/ai/analyze` with CSRF protection, authentication and rate limiting.
- AI output is treated as an educational aid only. It can be wrong and never
  replaces medical care, emergency services or drug checking.

**Privacy by design**
- Per-account **encrypted vault**: data is encrypted in your browser *before*
  it ever leaves the device.
- No analytics, no third-party fonts, no advertising cookies.
- Full **offline** support, installable PWA behavior, self-hosted fonts, CSP
  headers and mobile-friendly navigation.

**Administration** (server mode)
- Admin panel for server health, storage usage, account creation, roles,
  deactivation, password reset, session revocation and registration policy.
- Active user status is based on recent page presence, not merely an old open
  server session.
- Filterable audit log for logins, failures, account changes, vault writes and
  administrative actions.

---

## Privacy & security model

Seuil uses a **zero-knowledge** design: the server never sees your password and
cannot read your data.

- **Password never transmitted.** The browser sends only an `authHash`
  (PBKDF2-SHA256, 600 000 iterations). The server re-hashes it with its own salt
  before storage, so a database leak exposes neither the password nor a replayable
  hash.
- **Wrapped vault key.** Your data is encrypted client-side with AES-GCM. The data
  key is stored *wrapped* — encrypted by a key derived from your password
  (`KEK = PBKDF2(password, kekSalt)`). The server cannot unwrap it.
- **Recovery code.** Shown once at registration; it restores both access *and* data
  if you forget your password. Keep it offline — without it, a forgotten password
  makes the vault permanently unreadable, **even for an administrator**.
- **Sessions.** `HttpOnly` + `SameSite=Strict` cookies, optional idle expiry and a
  maximum lifetime, individually revocable.
- **Hardening.** Account lockout after repeated failures, per-IP rate limiting, a
  mandatory anti-CSRF header on every mutating request, a complete audit log, and
  a strict Content-Security-Policy.

> The unwrapped vault key only lives in the current tab (`sessionStorage`); a new
> tab asks for the password again. This does not cover every risk: a compromised
> device, a shared browser, a plaintext JSON export or a screenshot can still
> expose your history.

You can verify the whole flow end-to-end yourself — see [Testing](#testing).

---

## Getting started (local)

The frontend is static, so the quickest way to try Seuil is to serve the folder.

**Windows** — double-click:

```text
Lancer_Journal_RDR.bat
```

**Linux / macOS:**

```bash
./run.sh
```

This starts a small local server and opens the app. Using a real server (rather
than `file://`) is recommended so storage, the PWA manifest and the service worker
behave correctly.

**Full server (accounts + encrypted vault):**

```bash
python -m pip install -r requirements.txt
python serve.py 12345        # http://127.0.0.1:12345
```

`serve.py` is configured entirely via environment variables (port, rate limits,
session lifetimes, public origins…) — no secrets are hardcoded.

Useful server environment variables:

| Variable | Default | Purpose |
| --- | ---: | --- |
| `SEUIL_MAX_STATE_DB_BYTES` | `5 GiB` | Total SQLite storage quota for server state and encrypted vaults. |
| `SEUIL_MAX_STATE_VAULTS` | `200` | Maximum number of stored vault rows. |
| `OPENROUTER_API_KEY` | unset | Enables the optional AI assistant when configured server-side. |
| `SEUIL_OPENCODE_CMD` | auto | Optional fallback CLI command used when OpenRouter is unavailable or exhausted; auto-detects `opencode` in `PATH`, then `~/.opencode/bin/opencode`. |
| `SEUIL_OPENCODE_MODEL` | `opencode/gpt-5.1-codex` | OpenCode model used by the fallback provider. |
| `SEUIL_OPENCODE_ASSUME_CONFIGURED` | unset | Set to `1` only when OpenCode credentials are provided by environment or another mechanism outside `~/.local/share/opencode/auth.json`. |
| `SEUIL_AI_MAX_PROMPT_CHARS` | `3000` | Maximum prompt size accepted by `/api/ai/analyze`. |
| `SEUIL_AI_MAX_OUTPUT_TOKENS` | `1200` | Maximum AI response size requested from OpenRouter. |

---

## Self-hosting

Seuil is meant to be self-hosted on a small machine. Two documented paths:

**Cloudflare Tunnel (production, systemd)** — `deploy_seuil_debian.sh`:

```bash
sudo bash deploy_seuil_debian.sh                 # interactive
sudo bash deploy_seuil_debian.sh --token <TOKEN> # dashboard-managed tunnel
```

Installs Flask/Waitress as a `systemd` service and exposes it through a Cloudflare
Tunnel. Idempotent — re-run it after each update.

**Tailscale Funnel (quick public HTTPS)** — `start_public.sh` / `start_public.bat`,
documented in [`PUBLIC_TAILSCALE.md`](PUBLIC_TAILSCALE.md):

```bash
sudo tailscale up --timeout=2m --qr
./start_public.sh
```

Waitress stays bound to `127.0.0.1`; only the public service is exposed.

---

## Testing

```bash
python -m pytest tests/          # server, auth API, vault, data integrity
node tools/seuil_client.mjs verify <url>
```

The Python suite covers the public server, the auth API, the server vault and
substance-data integrity. The Node client runs a complete journey against a live
instance: registration, login, encrypted vault round-trip, recovery, admin and
CSRF.

---

## Project structure

```
index.html              App shell (tabs: journal, substances, inventory, stats, info, settings, admin)
app.js                  Core application logic
auth.js                 Client-side zero-knowledge crypto + admin panel
ui.js, boot.js          UI helpers and early-boot recovery
ai.js                   Optional server-backed OpenRouter assistant UI
route-model.js          Route, timeline and bioavailability modelling helpers
db.js                   Substance & interaction content database
substances-*.js         Substance directory data and detail views
i18n.js, i18n-detail.js Translations (FR/EN)
styles.css, fonts/      Self-hosted "Refined Night · Indigo" design system
serve.py                Flask/Waitress server: static files, auth, vault, admin API
sw.js, manifest.*       PWA service worker and manifest
tests/                  pytest suite
tools/                  seuil_client.mjs (verifier), make_icons.py
*.html                  Public legal pages (legal notice, privacy, terms, accessibility)
deploy_*.sh, run.*      Self-hosting and launch scripts
```

---

## Tech stack

- **Frontend:** vanilla JavaScript, HTML, CSS — no framework, no build step.
- **Crypto:** WebCrypto (PBKDF2, AES-GCM).
- **Server:** Python, Flask, Waitress, SQLite.
- **PWA:** service worker (network-first for HTML/JS/CSS, cache-first for assets).
- **Type:** Space Grotesk + JetBrains Mono, self-hosted.

---

## Internationalization

The UI ships with a built-in translation layer (`i18n.js`, `i18n-detail.js`)
covering French (default) and English, including the substance cards.

---

## Emergency & help resources

If you or someone else is in danger — loss of consciousness, slow or irregular
breathing, chest pain, hyperthermia, seizures, severe confusion or a suspected
overdose — **call emergency services immediately.**

| Region | Emergency | Drug help line |
| --- | --- | --- |
| 🇫🇷 France | **15** / **112** (SMS **114**) | Drogues Info Service — **0 800 23 13 13** |
| 🇬🇧 UK | **999** / **112** | FRANK — **0300 123 6600**, SMS **82111** |
| 🇺🇸 USA | **911** | SAMHSA — **1-800-662-HELP (4357)**, crisis **988** |

---

## Status & roadmap

- ✅ Zero-knowledge server accounts and encrypted vault.
- ✅ Substance directory, interaction checker, live session companion.
- ✅ Offline PWA, public legal pages, security headers.
- ✅ Optional server-backed **AI assistant** for sober contextual reviews.
- ✅ Partner-ready information, donation page, English/French interface and mobile
  navigation polish.

---

## Contributing

Issues and pull requests are welcome — bug reports, outdated sources, risky
wording, accessibility findings and translation fixes especially. For anything
touching substance data, please cite your sources (see `SOURCES.md`).

---

## Author

Built by **mitige** (Evan).

---

## License

No open-source license is attached: the code is **public and auditable**, but all
rights are reserved. Content, interface and database are the author's property;
reuse is subject to permission. Feel free to open an issue if you'd like to use
part of it.

---

## Disclaimer

Seuil is provided "as is", for information and harm-reduction purposes only. It is
not medical advice and does not validate any dose, product, combination or
practice. Substances, practices, health alerts and legal frameworks change — review
the cards regularly. You remain solely responsible for the data you enter and for
any decision you make. Never publish JSON exports containing personal data.
