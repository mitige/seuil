<div align="center">

# Seuil

**Un journal de réduction des risques, privé et utilisable hors-ligne.**
Consignez vos sessions, lisez des fiches pédagogiques de substances, vérifiez
les associations à risque, et gardez vos données sous votre seul contrôle —
chiffrées de bout en bout.

[**Application en ligne → seuil.pro**](https://seuil.pro) · [**English**](README.md)

![PWA](https://img.shields.io/badge/PWA-hors--ligne-2563eb)
![Chiffrement](https://img.shields.io/badge/chiffrement-z%C3%A9ro--connaissance-10b981)
![Sans pistage](https://img.shields.io/badge/pistage-aucun-64748b)
![Stack](https://img.shields.io/badge/stack-JS%20vanilla%20%2B%20Flask-7c3aed)

</div>

> [!IMPORTANT]
> **Seuil est un outil d'information, d'auto-suivi et de réduction des risques.** Il
> **n'encourage pas** la consommation de substances psychoactives et ne garantit
> jamais la sécurité d'une dose, d'un produit ou d'un mélange. Ses contenus ne
> remplacent ni un avis médical, ni une analyse de produit, ni l'accompagnement
> d'une structure spécialisée. Un « palier indicatif » ou une interaction « à
> faible risque » ne signifie jamais *sans danger*.

---

## ⭐ Ce projet vous est utile ?

Si Seuil vous aide, ou si vous appréciez une approche de la réduction des risques
qui respecte la vie privée, une **étoile sur le dépôt** fait vraiment la
différence : elle aide d'autres personnes à le trouver, et le projet à rester
maintenu. Pas de newsletter, pas de sollicitation, juste une étoile.

---

## Sommaire

- [Qu'est-ce que Seuil ?](#quest-ce-que-seuil-)
- [Fonctionnalités](#fonctionnalités)
- [Confidentialité & modèle de sécurité](#confidentialité--modèle-de-sécurité)
- [Démarrage local](#démarrage-local)
- [Auto-hébergement](#auto-hébergement)
- [Tests](#tests)
- [Structure du projet](#structure-du-projet)
- [Pile technique](#pile-technique)
- [Internationalisation](#internationalisation)
- [Urgences & ressources d'aide](#urgences--ressources-daide)
- [État & feuille de route](#état--feuille-de-route)
- [Contribuer](#contribuer)
- [Auteur](#auteur)
- [Licence](#licence)
- [Avertissement](#avertissement)

---

## Qu'est-ce que Seuil ?

**Seuil** est une application web de **réduction des risques** destinée à celles et
ceux qui veulent **ralentir leurs décisions, documenter ce qu'ils prennent et
comprendre les risques** — en toute confidentialité.

Elle fonctionne comme une **Progressive Web App** installable : l'interface tourne
entièrement dans le navigateur et reste utilisable hors-ligne. Un **serveur Python
optionnel** ajoute de vrais comptes multi-utilisateurs avec un **chiffrement
zéro-connaissance** — le serveur stocke vos données mais ne peut jamais les lire.

L'application est principalement en **français**, avec des traductions **anglaises**
intégrées.

---

## Fonctionnalités

**Journal, suivi en direct et historique**
- Consignez chaque session avec date/heure, substance, voie, dose, unité,
  état mental/environnement et notes de contexte.
- Utilisez des unités exactes (`mg`, `g`, `ug`, `ml`) ou des unités qualitatives
  configurables comme ligne, joint, verre, comprimé, goutte, bouffée ou prise
  quand la précision n'est pas disponible.
- Suivez une session active avec une courbe d'effet estimative, un point de lecture
  déplaçable, le temps écoulé, la dose cumulée, les notes en direct et le redose
  par substance.
- Suivez plusieurs substances dans la même session et conservez une chronologie
  structurée pour le débrief.
- Recherchez les sessions clôturées et modifiez ou supprimez les entrées de dose.

**Base de connaissances des substances**
- Parcourez **120+ fiches pédagogiques** avec formes, voies, paliers indicatifs,
  timelines par voie, bioavailability estimée, métabolisme quand disponible,
  signaux d'alerte, récupération et règles de réduction des risques.
- L'affichage des voies est volontairement conservateur : les voies peu utiles ou
  trompeuses sont masquées quand une substance est oral-only, inhaled-only ou
  limitée à certaines voies.
- Comparez 2 à 5 courbes d'effet théoriques.
- Vérifiez les associations dans l'analyseur de mélanges, qui classe les risques
  documentés et traite les combinaisons inconnues comme incertaines, jamais comme
  sûres.
- Créez des fiches personnelles privées, avec rappel clair que les données saisies
  par l'utilisateur ne sont pas vérifiées par une source externe.

**Outils personnels**
- Gérez un inventaire chiffré avec suivi de quantité et signaux de stock bas.
- Lisez des statistiques sur la fréquence, l'espacement, la répétition d'usage et
  les proximités risquées entre sessions.
- Configurez la langue, les unités qualitatives, les sauvegardes et le compte dans
  Paramètres.
- Soutenez le projet via la page Donations sans relier les données de don au coffre
  chiffré Seuil.

**Assistance IA optionnelle**
- Un assistant IA discret peut répondre à des questions de réduction des risques
  via l'endpoint serveur OpenRouter, si l'hébergeur le configure.
- Des boutons IA contextuels peuvent relire une session prévue, une session active,
  une comparaison de courbes, un mélange sélectionné, les tendances récentes ou la
  dernière session clôturée.
- La clé API OpenRouter n'est jamais présente dans le frontend ; les requêtes
  passent par `/api/ai/analyze` avec authentification, CSRF et rate limiting.
- La réponse IA reste une aide pédagogique : elle peut se tromper et ne remplace
  jamais un avis médical, une urgence ou une analyse de produit.

**Confidentialité dès la conception**
- **Coffre chiffré** par compte : les données sont chiffrées dans votre navigateur
  *avant* de quitter l'appareil.
- Aucun analytics, aucune police tierce, aucun cookie publicitaire.
- Support **hors-ligne** complet, PWA installable, polices auto-hébergées,
  en-têtes CSP et navigation mobile adaptée.

**Administration** (mode serveur)
- Panneau d'administration pour santé serveur, usage stockage, création de comptes,
  rôles, désactivation, réinitialisation de mot de passe, révocation de sessions
  et politique d'inscription.
- L'état utilisateur actif repose sur une présence récente sur la page, pas sur une
  ancienne session serveur ouverte.
- Journal d'audit filtrable pour connexions, échecs, comptes, écritures de coffre
  et actions administrateur.

---

## Confidentialité & modèle de sécurité

Seuil repose sur une conception **zéro-connaissance** : le serveur ne voit jamais
votre mot de passe et ne peut pas lire vos données.

- **Mot de passe jamais transmis.** Le navigateur n'envoie qu'un `authHash`
  (PBKDF2-SHA256, 600 000 itérations). Le serveur le re-hache avec son propre sel
  avant stockage : une fuite de la base n'expose ni le mot de passe, ni un hash
  rejouable.
- **Clé de coffre enveloppée.** Vos données sont chiffrées côté client en AES-GCM.
  La clé de données est stockée *enveloppée* — chiffrée par une clé dérivée du mot
  de passe (`KEK = PBKDF2(motDePasse, kekSalt)`). Le serveur ne peut pas la
  déballer.
- **Code de récupération.** Affiché une seule fois à l'inscription ; il restaure
  l'accès *et* les données en cas d'oubli du mot de passe. Conservez-le hors ligne :
  sans lui, un mot de passe oublié rend le coffre définitivement illisible,
  **y compris pour un administrateur**.
- **Sessions.** Cookies `HttpOnly` + `SameSite=Strict`, expiration d'inactivité
  optionnelle et durée de vie maximale, révocables individuellement.
- **Durcissement.** Verrouillage du compte après échecs répétés, limitation de
  débit par IP, en-tête anti-CSRF obligatoire sur toute requête mutante, journal
  d'audit complet et Content-Security-Policy stricte.

> La clé de coffre déballée ne vit que dans l'onglet courant (`sessionStorage`) ;
> un nouvel onglet redemande le mot de passe. Cela ne couvre pas tous les risques :
> appareil compromis, navigateur partagé, export JSON laissé en clair ou capture
> d'écran peuvent encore exposer votre historique.

Vous pouvez vérifier tout le flux de bout en bout vous-même — voir [Tests](#tests).

---

## Démarrage local

Le frontend est statique : le plus simple pour essayer Seuil est de servir le
dossier.

**Windows** — double-cliquez sur :

```text
Lancer_Journal_RDR.bat
```

**Linux / macOS :**

```bash
./run.sh
```

Cela démarre un petit serveur local et ouvre l'application. Utiliser un vrai
serveur (plutôt que `file://`) est recommandé pour que le stockage, le manifeste
PWA et le service worker se comportent correctement.

**Serveur complet (comptes + coffre chiffré) :**

```bash
python -m pip install -r requirements.txt
python serve.py 12345        # http://127.0.0.1:12345
```

`serve.py` se configure entièrement par variables d'environnement (port, limites de
débit, durées de session, origines publiques…) — aucun secret n'est codé en dur.

Variables serveur utiles :

| Variable | Défaut | Rôle |
| --- | ---: | --- |
| `SEUIL_MAX_STATE_DB_BYTES` | `5 Gio` | Quota total du stockage SQLite pour l'état serveur et les coffres chiffrés. |
| `SEUIL_MAX_STATE_VAULTS` | `200` | Nombre maximal de coffres stockés. |
| `OPENROUTER_API_KEY` | non défini | Active l'assistant IA optionnel côté serveur. |
| `SEUIL_OPENCODE_CMD` | auto | Commande CLI optionnelle utilisée en secours si OpenRouter est indisponible ou épuisé ; détecte `opencode` dans le `PATH`, puis `~/.opencode/bin/opencode`. |
| `SEUIL_OPENCODE_MODEL` | `opencode/gpt-5.1-codex` | Modèle OpenCode utilisé par le fournisseur de secours. |
| `SEUIL_OPENCODE_ASSUME_CONFIGURED` | non défini | À mettre à `1` uniquement si les identifiants OpenCode sont fournis par l'environnement ou un mécanisme hors `~/.local/share/opencode/auth.json`. |
| `SEUIL_AI_MAX_PROMPT_CHARS` | `3000` | Taille maximale du prompt accepté par `/api/ai/analyze`. |
| `SEUIL_AI_MAX_OUTPUT_TOKENS` | `1200` | Taille maximale de réponse demandée à OpenRouter. |

---

## Auto-hébergement

Seuil est pensé pour être auto-hébergé sur une petite machine. Deux chemins
documentés :

**Cloudflare Tunnel (production, systemd)** — `deploy_seuil_debian.sh` :

```bash
sudo bash deploy_seuil_debian.sh                 # interactif
sudo bash deploy_seuil_debian.sh --token <TOKEN> # tunnel géré par le dashboard
```

Installe Flask/Waitress en service `systemd` et l'expose via un Cloudflare Tunnel.
Idempotent — relancez-le après chaque mise à jour.

**Tailscale Funnel (HTTPS public rapide)** — `start_public.sh` / `start_public.bat`,
documenté dans [`PUBLIC_TAILSCALE.md`](PUBLIC_TAILSCALE.md) :

```bash
sudo tailscale up --timeout=2m --qr
./start_public.sh
```

Waitress reste lié à `127.0.0.1` ; seul le service public est exposé.

---

## Tests

```bash
python -m pytest tests/          # serveur, API d'auth, coffre, intégrité des données
node tools/seuil_client.mjs verify <url>
```

La suite Python couvre le serveur public, l'API d'authentification, le coffre
serveur et l'intégrité des données de substances. Le client Node exécute un
parcours complet contre une instance en marche : inscription, login, aller-retour
du coffre chiffré, récupération, admin et CSRF.

---

## Structure du projet

```
index.html              Coquille de l'app (onglets : journal, substances, inventaire, stats, infos, paramètres, admin)
app.js                  Logique applicative principale
auth.js                 Crypto zéro-connaissance côté client + panneau d'administration
ui.js, boot.js          Helpers UI et récupération au démarrage
ai.js                   Interface de l'assistant OpenRouter côté serveur
route-model.js          Modélisation des voies, durées et biodisponibilités
db.js                   Base de contenu des substances et interactions
substances-*.js         Données du répertoire de substances et vues détaillées
i18n.js, i18n-detail.js Traductions (FR/EN)
styles.css, fonts/      Design system « Nuit Raffinée · Indigo » auto-hébergé
serve.py                Serveur Flask/Waitress : fichiers statiques, auth, coffre, API admin
sw.js, manifest.*       Service worker et manifeste PWA
tests/                  Suite pytest
tools/                  seuil_client.mjs (vérificateur), make_icons.py
*.html                  Pages légales publiques (mentions, confidentialité, conditions, accessibilité)
deploy_*.sh, run.*      Scripts d'auto-hébergement et de lancement
```

---

## Pile technique

- **Frontend :** JavaScript vanilla, HTML, CSS — sans framework, sans étape de build.
- **Crypto :** WebCrypto (PBKDF2, AES-GCM).
- **Serveur :** Python, Flask, Waitress, SQLite.
- **PWA :** service worker (network-first pour HTML/JS/CSS, cache-first pour les
  ressources).
- **Typographie :** Space Grotesk + JetBrains Mono, auto-hébergées.

---

## Internationalisation

L'interface embarque une couche de traduction (`i18n.js`, `i18n-detail.js`)
couvrant le français (par défaut) et l'anglais, y compris les fiches de substances.

---

## Urgences & ressources d'aide

Si vous ou quelqu'un d'autre êtes en danger — perte de connaissance, respiration
lente ou irrégulière, douleur thoracique, hyperthermie, convulsions, confusion
sévère ou suspicion de surdose — **appelez immédiatement les secours.**

| Région | Urgence | Ligne d'aide drogues |
| --- | --- | --- |
| 🇫🇷 France | **15** / **112** (SMS **114**) | Drogues Info Service — **0 800 23 13 13** |
| 🇬🇧 R.-U. | **999** / **112** | FRANK — **0300 123 6600**, SMS **82111** |
| 🇺🇸 USA | **911** | SAMHSA — **1-800-662-HELP (4357)**, crise **988** |

---

## État & feuille de route

- ✅ Comptes serveur zéro-connaissance et coffre chiffré.
- ✅ Répertoire de substances, vérificateur d'interactions, compagnon de session.
- ✅ PWA hors-ligne, pages légales publiques, en-têtes de sécurité.
- ✅ **Assistant IA** optionnel côté serveur pour des lectures contextuelles sobres.
- ✅ Interface français/anglais, page donations, information partenariale et
  navigation mobile améliorée.

---

## Contribuer

Les *issues* et *pull requests* sont les bienvenues — signalements de bugs, sources
obsolètes, formulations à risque, retours d'accessibilité et corrections de
traduction en particulier. Pour tout ce qui touche aux données de substances,
merci de citer vos sources (voir `SOURCES.md`).

---

## Auteur

Réalisé par **mitige** (Evan).

---

## Licence

Aucune licence open-source n'est attachée : le code est **public et auditable**,
mais tous droits réservés. Contenus, interface et base de données sont la propriété
de l'auteur ; toute réutilisation est soumise à autorisation. Ouvrez une *issue* si
vous souhaitez en réutiliser une partie.

---

## Avertissement

Seuil est fourni « tel quel », à des fins d'information et de réduction des risques
uniquement. Ce n'est pas un avis médical et il ne valide aucune dose, aucun
produit, aucun mélange ni aucune pratique. Les substances, pratiques, alertes
sanitaires et cadres légaux évoluent — relisez les fiches régulièrement. Vous restez
seul responsable des données que vous saisissez et de toute décision que vous
prenez. Ne publiez jamais d'exports JSON contenant des données personnelles.
