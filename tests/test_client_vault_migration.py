"""Vérifications statiques du client : architecture zéro-connaissance et migration."""

from pathlib import Path
import json
import re
import subprocess


ROOT = Path(__file__).resolve().parents[1]


def read(name):
    return (ROOT / name).read_text(encoding="utf-8")


def js_double_quoted_strings(block):
    return re.findall(r'"((?:[^"\\\\]|\\\\.)*)"', block)


def visible_i18n_candidate(phrase):
    if not phrase or len(phrase.strip()) < 4:
        return False
    technical = {
        "mg",
        "µg",
        "g",
        "ml",
        "graines",
        "comprimé",
        "poudre",
        "huile",
        "vape",
        "sirop",
        "gélule",
        "cigarette",
        "e-liquide",
    }
    if phrase in technical:
        return False
    if re.match(r"^[0-9.,<>+/ µa-zA-Z()-]+$", phrase) and re.search(r"\d", phrase):
        return False
    return True


def rich_family_block(source, title, next_title):
    start = source.index(title)
    end = source.index(next_title, start)
    return source[start:end]


def index_substance_entries(source):
    pattern = re.compile(
        r'\{ id: "([^"]+)".*?category: "((?:[^"\\\\]|\\\\.)*)".*?description: "((?:[^"\\\\]|\\\\.)*)"',
        re.S,
    )
    return pattern.findall(source)


def substance_detail_narrative_strings(source):
    ignored = {"effects", "risk_factors", "avoid_if", "aftercare", "rdr_rules"}
    phrases = []
    for phrase in js_double_quoted_strings(source):
        if phrase in ignored:
            continue
        if re.fullmatch(r"[a-z0-9_]+", phrase):
            continue
        if visible_i18n_candidate(phrase):
            phrases.append(phrase)
    return list(dict.fromkeys(phrases))


def test_auth_client_uses_server_api_and_wrapped_keys():
    auth_js = read("auth.js")

    # Le mot de passe ne part jamais en clair : authHash dérivé côté client.
    assert "deriveAuthHash" in auth_js
    assert "/api/auth/prelogin" in auth_js
    assert "/api/auth/login" in auth_js
    # Clé de coffre enveloppée (wrapped key) déchiffrée localement.
    assert "unwrapDataKey" in auth_js
    assert "wrapDataKey" in auth_js
    # Kit de récupération.
    assert "buildRecoveryMaterial" in auth_js
    assert "/api/auth/recovery/init" in auth_js


def test_auth_client_migrates_legacy_localstorage_accounts():
    auth_js = read("auth.js")

    assert "tryLegacyMigration" in auth_js
    assert "seuil_accounts_v1" in auth_js
    assert "/api/vault/import-legacy" in auth_js


def test_app_uses_session_vault_api_with_csrf_header():
    app_js = read("app.js")

    assert '"/api/vault"' in app_js
    assert "X-Seuil-Csrf" in app_js
    assert "credentials" in app_js
    assert "handleSessionExpired" in app_js
    # L'ancien modèle (clé de coffre dans localStorage) a disparu.
    assert "seuil_server_vault" not in app_js
    assert "X-Seuil-Vault-Key" not in app_js


def test_index_loads_ui_layer_before_auth():
    index_html = read("index.html")

    ui_pos = index_html.find('src="ui.js')
    auth_pos = index_html.find('src="auth.js')
    assert ui_pos != -1 and auth_pos != -1 and ui_pos < auth_pos
    # Modales du nouveau flux de sécurité.
    assert 'id="recovery-kit-modal"' in index_html
    assert 'id="pwgate-modal"' in index_html
    assert 'data-panel="locked"' in index_html
    assert 'data-panel="recovery"' in index_html


def test_i18n_module_loads_early_and_is_publicly_served():
    index_html = read("index.html")
    serve_py = read("serve.py")
    sw_js = read("sw.js")

    i18n_pos = index_html.find('src="i18n.js')
    boot_pos = index_html.find('src="boot.js')
    app_pos = index_html.find('src="app.js')

    assert i18n_pos != -1
    assert boot_pos != -1
    assert app_pos != -1
    assert i18n_pos < boot_pos < app_pos
    assert '"i18n.js"' in serve_py
    assert "i18n.js" in sw_js


def test_i18n_auto_detects_browser_language_and_core_english_strings():
    i18n_js = read("i18n.js")

    assert "navigator.languages" in i18n_js
    assert "navigator.language" in i18n_js
    assert "document.documentElement.lang" in i18n_js
    assert "MutationObserver" in i18n_js
    assert "window.SeuilI18n" in i18n_js
    assert '"Bon retour parmi nous": "Welcome back"' in i18n_js
    assert '"Se connecter": "Sign in"' in i18n_js
    assert '"Créer un compte": "Create account"' in i18n_js
    assert '"Bio-disponibilité estimée": "Estimated bioavailability"' in i18n_js
    assert '"Application privée pour documenter ses sessions, consulter des fiches pédagogiques, vérifier les mélanges à risque et protéger ses données.":' in i18n_js
    assert '"Application privée et pédagogique pour documenter ses sessions, consulter des fiches pédagogiques et mieux comprendre les mélanges à risque.":' in i18n_js


def test_social_link_preview_metadata_is_english_for_crawlers():
    index_html = read("index.html")
    head = index_html[:index_html.index("</head>")]
    description = "Private harm-reduction PWA for encrypted session tracking, substance cards, combination checks, effect curves, inventory, statistics, and optional AI review."

    assert f'<meta name="description" content="{description}">' in head
    assert '<meta property="og:title" content="Seuil">' in head
    assert f'<meta property="og:description" content="{description}">' in head
    assert '<meta property="og:locale" content="en_US">' in head
    assert '<meta name="twitter:title" content="Seuil">' in head
    assert f'<meta name="twitter:description" content="{description}">' in head

    for french_phrase in [
        "Seuil - suivi personnel et formations de réduction des risques",
        "Seuil - personal tracking and harm reduction education",
        "Application privée et pédagogique pour documenter ses sessions, consulter des fiches pédagogiques et mieux comprendre les mélanges à risque.",
        "Application privée pour documenter ses sessions, consulter des fiches pédagogiques, vérifier les mélanges à risque et protéger ses données.",
    ]:
        assert french_phrase not in head


def test_i18n_limits_auth_boot_translation_scope_for_responsive_inputs():
    i18n_js = read("i18n.js")
    app_js = read("app.js")

    assert "function getDefaultApplyScopes" in i18n_js
    assert 'body.classList.contains("auth-booting")' in i18n_js
    assert 'body.classList.contains("auth-locked")' in i18n_js
    assert 'getElementById("boot-screen")' in i18n_js
    assert 'getElementById("auth-screen")' in i18n_js
    assert 'getElementById("lock-screen")' in i18n_js
    assert 'SeuilI18n.apply(document.querySelector(".app-container"))' in app_js
    assert 'SeuilI18n.apply(document.getElementById("substance-modal"))' in app_js


def test_i18n_observer_does_not_rewrite_unchanged_text_nodes():
    i18n_js = read("i18n.js")

    assert "const nextValue = currentLang === \"fr\" ? original : `${leading}${translated}${trailing}`;" in i18n_js
    assert "if (node.nodeValue === nextValue) return;" in i18n_js
    assert "node.nodeValue = nextValue;" in i18n_js


def test_i18n_covers_main_app_static_interface_strings():
    i18n_js = read("i18n.js")
    required_phrases = [
        "Navigation principale",
        "Journal",
        "Substances",
        "Statistiques",
        "Infos",
        "Documentez vos prises et gardez une trace claire de vos décisions.",
        "Ralentir, vérifier, consigner",
        "Nouvelle session",
        "Dose initiale",
        "État mental & environnement",
        "Démarrer le suivi",
        "Sécurité en direct",
        "Chronologie",
        "Historique des sessions",
        "Ajouter une entrée",
        "Forme physique",
        "Enregistrer dans l’inventaire",
        "État de l'inventaire",
        "Comparateur de courbes",
        "Fiches substances",
        "Analyseur de mélanges",
        "Fiche personnalisée",
        "Tendances, espacements et signaux qui méritent une pause.",
        "Espacements & alertes",
        "Infos & conformité",
        "Avertissement médical, légal et éthique",
        "Mon compte",
        "Changer de mot de passe ré-enveloppe votre clé de chiffrement et déconnecte vos autres appareils.",
        "Compte, sauvegardes et contrôle de vos données.",
        "Mot de passe actuel",
        "Mettre à jour",
        "Générer un nouveau code",
        "Appareils connectés",
        "Déconnecter les autres appareils",
        "Vos données vivent dans un coffre serveur chiffré. Exportez régulièrement une copie JSON.",
        "Exporter mes données (JSON)",
        "Importer une sauvegarde JSON",
        "Effacer mon coffre",
        "Console administrateur",
        "Comptes, sessions, audit. Les coffres restent chiffrés : aucune donnée utilisateur n'est visible.",
        "Sessions",
        "Utilisateurs",
        "Politique d'inscription",
        "Modèle zéro-connaissance",
        "Journal d'audit",
        "Description...",
        "* Repères indicatifs : la tolérance, la pureté, la voie et le contexte peuvent tout changer.",
    ]

    for phrase in required_phrases:
        assert '"' + phrase + '":' in i18n_js


def test_sober_contextual_ai_controls_are_rendered_without_legacy_bridge_ui():
    index_html = read("index.html")
    sw_js = read("sw.js")
    ai_js = read("ai.js")
    app_js = read("app.js")
    serve_py = read("serve.py")

    visible_fragments = [
        'id="btn-ai-presession"',
        'id="btn-ai-session"',
        'id="btn-ai-comparison"',
        'id="btn-ai-interaction"',
        'id="btn-ai-trends"',
        'id="btn-ai-debrief"',
        'id="ai-context-panel"',
        'id="ai-context-result"',
        'class="ai-context-actions',
        "Avant de démarrer",
        "Analyser la session",
        "Lire les courbes",
        "Lire le mélange",
        "Lire les tendances",
        "Débrief dernière session",
        "La réponse peut prendre jusqu’à 2 minutes.",
    ]
    for fragment in visible_fragments:
        assert fragment in index_html

    hidden_fragments = [
        'id="btn-ai-assistant"',
        'id="ai-enable"',
        'id="ai-settings-detail"',
        'id="ai-modal"',
        "Contrôle de risque IA",
        "Analyser cette session avec l'IA",
        "Commenter cette comparaison avec l'IA",
        "Décrypter ce mélange avec l'IA",
        "Analyse IA",
        "Voir / copier le prompt envoyé",
    ]
    for fragment in hidden_fragments:
        assert fragment not in index_html
    assert 'id="ai-assistant-card"' in index_html
    assert 'src="ai.js?v=10"' in index_html
    assert "./ai.js?v=10" in sw_js
    assert 'src="app.js?v=107"' in index_html
    assert "./app.js?v=107" in sw_js
    assert "/api/ai/analyze" in ai_js
    assert "X-Seuil-Csrf" in ai_js
    assert "function callAi(prompt)" in ai_js
    assert "function promptSessionAnalysis()" in ai_js
    assert "function promptPreSession()" in ai_js
    assert "function promptComparison()" in ai_js
    assert "function promptInteraction()" in ai_js
    assert "function promptTrends()" in ai_js
    assert "function promptDebrief()" in ai_js
    assert '"La réponse peut prendre jusqu’à 2 minutes.": "The response can take up to 2 minutes."' in read("i18n.js")
    assert "window.getSeuilAiSnapshot" in app_js
    assert "OPENROUTER_API_KEY" in serve_py
    assert "nvidia/nemotron-3-ultra-550b-a55b:free" in serve_py
    assert "sk-or-v1" not in index_html + sw_js + ai_js + serve_py


def test_contextual_ai_prompts_request_detailed_balanced_answers():
    ai_js = read("ai.js")
    serve_py = read("serve.py")

    assert "const RESPONSE_STYLE_GUIDE" in ai_js
    assert "5 to 8 short paragraphs or bullet groups" in ai_js
    assert "Do not add a separate alarm-focused section." in ai_js
    for forbidden_fragment in [
        "one measured vigilance section",
        "Do not let emergency or danger language dominate the answer",
        "risk factors:",
        "risk level",
        "vigilance/help section",
        "danger signs",
        "warning signs",
    ]:
        assert forbidden_fragment not in ai_js
    assert "function contextualReturnInstruction(kind)" in ai_js
    for kind in ["active-session", "pre-session", "comparison", "interaction", "trends", "debrief"]:
        assert f'contextualReturnInstruction("{kind}")' in ai_js
    assert 'AI_MAX_OUTPUT_TOKENS = int(os.environ.get("SEUIL_AI_MAX_OUTPUT_TOKENS", "2400"))' in serve_py
    assert 'AI_MAX_CONTINUATION_ROUNDS = int(os.environ.get("SEUIL_AI_MAX_CONTINUATION_ROUNDS", "2"))' in serve_py


def test_contextual_ai_panel_does_not_clip_long_answers():
    styles_css = read("styles.css")

    assert ".ai-context-panel .ai-assistant-result {\n    max-height: none;\n    overflow: visible;\n}" in styles_css
    assert "max-height: calc(100dvh - var(--mobile-nav-height) - env(safe-area-inset-bottom) - 22px);" in styles_css


def test_mobile_navigation_keeps_all_primary_icons_visible():
    index_html = read("index.html")
    styles_css = read("styles.css")

    for label in ["Journal", "Inventaire", "Substances", "Statistiques", "Infos", "Donations", "Paramètres"]:
        assert f'<span class="nav-label">{label}</span>' in index_html

    assert "--mobile-nav-height: 84px;" in styles_css
    assert "grid-template-columns: repeat(7, minmax(0, 1fr));" in styles_css
    assert "body.is-admin .nav-links { grid-template-columns: repeat(8, minmax(54px, 1fr)); }" in styles_css
    assert ".nav-links::-webkit-scrollbar { display: none; }" in styles_css
    assert ".nav-item button svg { width: 20px; height: 20px; flex-shrink: 0; }" in styles_css
    assert ".nav-label" in styles_css
    assert "padding-bottom: calc(var(--mobile-nav-height) + env(safe-area-inset-bottom));" in styles_css


def test_donations_page_uses_app_navigation_and_i18n():
    index_html = read("index.html")
    i18n_js = read("i18n.js")
    styles_css = read("styles.css")

    assert 'data-tab="tab-donations"' in index_html
    assert 'id="tab-donations"' in index_html
    assert "Donations" in index_html
    assert "Soutenir Seuil" in index_html
    assert "paypal.me" not in index_html.lower()
    assert "eusdeu21@gmail.com" in index_html
    assert 'href="mailto:eusdeu21@gmail.com"' in index_html
    assert "Ouvrir un email" not in index_html
    assert "Ouvrir un email" not in i18n_js
    assert "PayPal Friends and Family" in index_html
    assert '<div class="info-row"><span>Nom affiché sur PayPal</span><strong>Elise Dune</strong></div>' in index_html
    assert "paypal-name-box" not in index_html
    assert "Elise Dune" in index_html
    assert "Un soutien volontaire aide à maintenir l’hébergement, les audits, les sources et les mises à jour éditoriales." in index_html

    for phrase in [
        "Donations",
        "Soutenir Seuil",
        "Un soutien volontaire aide à maintenir l’hébergement, les audits, les sources et les mises à jour éditoriales.",
        "PayPal Friends and Family",
        "Adresse PayPal",
        "Nom affiché sur PayPal",
        "Elise Dune",
        "Aucune donnée de santé, de session ou de compte n’est demandée pour donner.",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js

    assert (
        "#tab-donations .quality-intro-card > .prose + .info-list {\n"
        "    margin-top: 20px;\n"
        "}"
    ) in styles_css
    assert ".paypal-name-box" not in styles_css


def test_i18n_covers_public_static_pages():
    i18n_js = read("i18n.js")
    public_pages = [
        ("mentions-legales.html", "Mentions légales - Seuil", "Legal notice - Seuil"),
        ("confidentialite.html", "Confidentialité - Seuil", "Privacy - Seuil"),
        ("conditions-utilisation.html", "Conditions d'utilisation - Seuil", "Terms of use - Seuil"),
        ("accessibilite.html", "Accessibilité - Seuil", "Accessibility - Seuil"),
    ]
    required_phrases = [
        "← Retour à l'application",
        "Informations relatives à l'éditeur et à l'hébergement du site Seuil.",
        "Politique de confidentialité",
        "Données traitées",
        "Stockage et transmission",
        "Cadre d'usage responsable de l'application.",
        "Usages interdits",
        "Seuil intègre les principaux repères d’accessibilité attendus pour un usage partenarial et une mise en production encadrée.",
        "Mesures déjà intégrées",
        "Contact accessibilité",
    ]

    assert "data-seuil-i18n-original-title" in i18n_js
    for filename, fr_title, en_title in public_pages:
        html = read(filename)
        assert 'src="i18n.js' in html
        assert '"' + fr_title + '": "' + en_title + '"' in i18n_js
    for phrase in required_phrases:
        assert '"' + phrase + '":' in i18n_js


def test_accessibility_copy_matches_partner_ready_positioning():
    index_html = read("index.html")
    accessibility_html = read("accessibilite.html")
    i18n_js = read("i18n.js")
    combined = "\n".join([index_html, accessibility_html, i18n_js])

    expected_phrases = [
        "Accessibilité & déploiement partenaire",
        "Seuil intègre les principaux repères d’accessibilité attendus pour un usage partenarial et une mise en production encadrée.",
        "L’accessibilité est suivie comme une exigence produit continue : langue de page, labels visibles, lien d’évitement, contrastes élevés, focus clavier, respect de `prefers-reduced-motion`, navigation par boutons et contenus structurés.",
        "Pour un déploiement institutionnel ou un partenariat formalisé, un audit RGAA/WCAG et une déclaration d’accessibilité peuvent être produits dans le cadre de gouvernance du partenaire, afin de documenter officiellement le niveau de conformité et les corrections prioritaires éventuelles.",
    ]
    for phrase in expected_phrases:
        assert phrase in combined
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js

    for outdated in [
        "Accessibilité & limites de conformité",
        "Cette version reste une",
        "elle n’est pas déclarée conforme RGAA sans audit manuel complet",
        "Before institutional or commercial publication, perform an accessibility audit",
        "Preparatory statement",
    ]:
        assert outdated not in combined


def test_i18n_covers_dynamic_session_journal_strings():
    app_js = read("app.js")
    i18n_js = read("i18n.js")
    required_phrases = [
        "Redose déconseillée",
        "la montée n'est pas terminée.",
        "Montée stabilisée",
        "Phase : non renseignée",
        "Statut : montée en cours",
        "Statut : descente progressive",
        "En cours",
        "Dose cumulée :",
        "Durée :",
        "Voie d'administration :",
        "État mental / environnement :",
        "Supprimer cette session",
        "Clore la session",
        "Bilan de fin de session",
        "Aucun commentaire ajouté.",
        "Clôture automatique : fin estimée des effets atteinte.",
        "Modifier la dose",
        "Nouvelle quantité ({unit})",
        "Dose initiale",
        "Dose supplémentaire",
        "Session clôturée",
        "Session clôturée. Bilan : {notes}",
        "Aucun commentaire ajouté.",
        "Modifier",
        "Retirer",
        "Supprimer la dose",
        "Cette dose sera retirée de la chronologie et des courbes.",
        "Retirer du suivi",
        "Cette substance et ses doses seront retirées du suivi en cours.",
        "Retirer la substance principale",
        "La substance principale sera retirée. La prochaine substance suivie deviendra principale.",
        "Retirer la dernière substance ?",
        "Cette action annulera le suivi en cours sans l'ajouter à l'historique.",
    ]

    assert "function tx(" in app_js
    assert "tx(\"Redose déconseillée\")" in app_js
    assert "tx(\"Dose cumulée :\")" in app_js
    assert "tx(\"Nouvelle quantité ({unit})\"" in app_js
    assert "formatLogDisplayText" in app_js
    assert "function formatEndLogNote" in app_js
    assert 'if (log.type === "end") return formatEndLogNote(log.note);' in app_js
    for phrase in required_phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_extended_substance_family_templates():
    i18n_js = read("i18n.js")
    index_substances = read("index-substances.js")
    required_phrases = [
        "Fiche de référence sans posologie : Seuil n'intègre volontairement aucun palier de dose, voie ni rythme pour cette entrée. Ne pas s'en servir pour choisir une quantité.",
        "Forme et pureté réelles à vérifier avant toute interprétation.",
        "Statut juridique variable selon la molécule, le pays et l'évolution des classements. Cette fiche n'est pas un avis juridique.",
        "Fiche condensée",
        "Modification des perceptions visuelles et auditives, de la pensée et du sens du temps.",
        "Quantité mal évaluée (surtout sur buvard ou poudre non testée) et confusion possible avec une molécule beaucoup plus puissante.",
        "Sensation de détachement du corps et de l'environnement, distorsions de l'espace et du temps.",
        "Usage répété rapproché : tolérance rapide et atteintes possibles de la vessie avec certains produits.",
        "Énergie, éveil, confiance et désinhibition ; baisse de l'appétit et du sommeil.",
        "Usage en rafales et redoses rapprochées : épuisement, hausse de la tension et de la température.",
        "Détente, somnolence, ralentissement de la respiration et des réflexes.",
        "Dépression respiratoire, surtout en cas d'association entre dépresseurs (opioïdes + benzodiazépines + alcool).",
        "Ouverture émotionnelle, empathie, énergie et stimulation sensorielle.",
        "Surchauffe et déshydratation en milieu chaud et dansant ; à l'inverse, excès d'eau sans apport en sels.",
        "Modification de l'humeur, de la perception du temps et de l'appétit ; détente ou au contraire anxiété selon le produit et le contexte.",
        "Produits semi-synthétiques mal caractérisés, dosés de façon inégale et de pureté variable.",
        "Profil atypique et souvent imprévisible selon la substance (sédation, délire, distorsions, état onirique).",
        "Marge de sécurité étroite et effets retardés propices au surdosage.",
    ]

    for phrase in required_phrases:
        assert '"' + phrase + '":' in i18n_js

    start = index_substances.index("var FAMILY =")
    end = index_substances.index("var ENTRIES =", start)
    family_block = index_substances[start:end]
    ignored = {"unit", "threshold", "light", "common", "strong", "heavy"}
    for phrase in js_double_quoted_strings(family_block):
        if phrase in ignored or len(phrase) < 4:
            continue
        assert '"' + phrase + '":' in i18n_js


def test_substance_detail_renderer_translates_database_text_fields():
    app_js = read("app.js")

    assert 'document.getElementById("modal-sub-description").textContent = tx(sub.description);' in app_js
    assert "profileEl.textContent = tx(sub.profile);" in app_js
    assert "escapeHtml(tx(title))" in app_js
    assert "items.map(item => `<li>${escapeHtml(tx(item))}</li>`)" in app_js
    assert 'li.textContent = tx(rule);' in app_js
    assert "escapeHtml(tx(row.label))" in app_js
    assert "escapeHtml(tx(row.value))" in app_js
    assert "renderCompactList" in app_js and "escapeHtml(tx(item))" in app_js


def test_i18n_covers_substance_detail_narrative_strings():
    detail_i18n_path = ROOT / "i18n-detail.js"
    assert detail_i18n_path.exists()

    index_html = read("index.html")
    app_js = read("app.js")
    serve_py = read("serve.py")
    detail_i18n_js = detail_i18n_path.read_text(encoding="utf-8")
    phrases = substance_detail_narrative_strings(read("substances-detail.js"))

    assert len(phrases) >= 2100
    assert 'src="i18n-detail.js' not in index_html
    assert '"i18n-detail.js?v=5"' in app_js
    assert "loadSubstanceDetailAssets" in app_js
    assert '"i18n-detail.js"' in serve_py
    assert "Object.assign(global.SeuilI18n.phrases.en" in detail_i18n_js
    for phrase in phrases:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in detail_i18n_js


def test_i18n_covers_legacy_db_strings_visible_in_substance_cards():
    db_js = read("db.js")
    i18n_js = read("i18n.js")
    required_phrases = [
        "Synergie & Intensification",
        "Les effets peuvent se renforcer dans plusieurs dimensions à la fois. L’intensité devient plus difficile à prévoir, même avec des doses habituellement tolérées.",
        "Comme le LSD, l'expérience dépend fortement du dosage du buvard (souvent incertain) et du contexte émotionnel.",
        "Modification des perceptions, du sens du temps et de l'émotion.",
        "Dosage réel du buvard incertain.",
        "Vérifier au mieux l'origine du buvard.",
    ]

    for phrase in required_phrases:
        assert phrase in db_js
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_auth_dynamic_surfaces_use_i18n_for_locked_recovery_and_devices():
    auth_js = read("auth.js")
    app_js = read("app.js")
    ui_js = read("ui.js")
    i18n_js = read("i18n.js")

    assert "function tx(key, vars)" in auth_js
    assert "h.textContent = uiText(title);" in ui_js
    assert "p.textContent = uiText(message);" in ui_js
    assert "label.textContent = uiText(opts.label);" in ui_js
    assert "input.placeholder = uiText(opts.placeholder);" in ui_js
    assert "title.textContent = tx(copy[target][0]);" in auth_js
    assert "subtitle.textContent = tx(copy[target][1]);" in auth_js
    assert 'locked: ["Session verrouillée", "Saisissez votre mot de passe pour déverrouiller votre coffre chiffré dans cet onglet."]' in auth_js
    assert 'subEl.textContent = tx("Votre ancien code ne fonctionne plus. Conservez ce nouveau code dans un endroit sûr : il ne sera plus jamais affiché.");' in auth_js
    assert 'subEl.textContent = tx("Ce code permet de récupérer votre compte et vos données si vous oubliez votre mot de passe. Il ne sera plus jamais affiché.");' in auth_js
    assert 'titleEl.textContent = tx("Votre code de récupération");' in auth_js
    assert 'codeEl.setAttribute("aria-label", tx("Code de récupération"));' in auth_js
    assert 'copyBtn.textContent = tx("Copier");' in auth_js
    assert 'downloadBtn.textContent = tx("Télécharger (.txt)");' in auth_js
    assert 'confirmText.textContent = tx("J\'ai enregistré ce code dans un endroit sûr, hors de ce navigateur.");' in auth_js
    assert 'doneBtn.textContent = tx("Continuer");' in auth_js
    assert 'copyBtn.textContent = tx("Copié ✓");' in auth_js
    assert 'copyBtn.textContent = tx("Copier");' in auth_js
    assert 'tx("cet onglet")' in auth_js
    assert 'tx("IP inconnue")' in auth_js
    assert 'tx("actuelle")' in auth_js
    assert 'btn.textContent = tx("Révoquer");' in auth_js
    assert 'title: "Déconnecter les autres appareils"' in auth_js
    assert 'message: "Toutes les sessions sauf celle-ci seront fermées immédiatement."' in auth_js
    assert 'confirmLabel: "Déconnecter"' in auth_js
    assert 'title: "Confirmer votre mot de passe"' in auth_js
    assert 'message: "La génération d\'un nouveau code de récupération invalide l\'ancien."' in auth_js
    assert 'label: "Mot de passe actuel"' in auth_js
    assert 'title: "Supprimer le compte"' in app_js
    assert 'message: "Le compte, le coffre chiffré, l\'historique, l\'inventaire et les sessions ouvertes seront définitivement supprimés. Exportez une sauvegarde avant si nécessaire."' in app_js
    assert 'confirmLabel: "Supprimer mon compte"' in app_js

    required_phrases = [
        "Annuler",
        "Déconnecter",
        "Supprimer mon compte",
        "Supprimer le compte",
        "Le compte, le coffre chiffré, l'historique, l'inventaire et les sessions ouvertes seront définitivement supprimés. Exportez une sauvegarde avant si nécessaire.",
        "Dernière vérification : supprimer définitivement votre compte et votre coffre chiffré ?",
        "Oui, supprimer tout",
        "Confirmer votre mot de passe",
        "La génération d'un nouveau code de récupération invalide l'ancien.",
        "Mot de passe actuel",
        "Un code de récupération est configuré pour ce compte.",
        "Aucun code de récupération : en cas d'oubli du mot de passe, vos données chiffrées seraient perdues.",
        "Déconnecter les autres appareils",
        "Toutes les sessions sauf celle-ci seront fermées immédiatement.",
        "Révoquer",
        "Session verrouillée",
        "Saisissez votre mot de passe pour déverrouiller votre coffre chiffré dans cet onglet.",
        "Votre ancien code ne fonctionne plus. Conservez ce nouveau code dans un endroit sûr : il ne sera plus jamais affiché.",
        "Ce code permet de récupérer votre compte et vos données si vous oubliez votre mot de passe. Il ne sera plus jamais affiché.",
        "Votre code de récupération",
        "Code de récupération",
        "Copier",
        "Télécharger (.txt)",
        "J'ai enregistré ce code dans un endroit sûr, hors de ce navigateur.",
        "Continuer",
        "Copié ✓",
        "cet onglet",
        "IP inconnue",
        "actuelle",
        "Sessions indisponibles.",
    ]
    for phrase in required_phrases:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_account_danger_zone_deletes_account_and_logs_out():
    index_html = read("index.html")
    auth_js = read("auth.js")
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    assert "Supprimer mon compte et mon coffre" in index_html
    assert "async function deleteCurrentAccount()" in auth_js
    assert 'api("/api/auth/account", { method: "DELETE", body: {} })' in auth_js
    assert "deleteCurrentAccount," in auth_js
    assert "SeuilAuth.deleteCurrentAccount()" in app_js
    assert "await deleteServerState();" not in app_js[app_js.index('document.getElementById("btn-factory-reset")'):]

    for phrase in [
        "Supprimer mon compte",
        "Supprimer mon compte et mon coffre",
        "Supprimer le compte",
        "Le compte, le coffre chiffré, l'historique, l'inventaire et les sessions ouvertes seront définitivement supprimés. Exportez une sauvegarde avant si nécessaire.",
        "Dernière vérification : supprimer définitivement votre compte et votre coffre chiffré ?",
        "Oui, supprimer tout",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_admin_dynamic_tables_and_server_status_use_i18n():
    auth_js = read("auth.js")
    i18n_js = read("i18n.js")

    assert '["Version", overview.server.version]' in auth_js
    assert '["Disponibilité", SeuilUI.formatDuration(overview.server.uptimeSeconds)]' in auth_js
    assert 'dt.textContent = tx(label);' in auth_js
    assert 'roleBadge.textContent = u.role === "admin" ? tx("Administrateur") : tx("Utilisateur");' in auth_js
    assert 'status.textContent = tx("Désactivé");' in auth_js
    assert 'status.textContent = tx("Verrouillé");' in auth_js
    assert 'status.textContent = tx("Mot de passe à définir");' in auth_js
    assert 'else if ((u.onlineSessionCount || 0) > 0)' in auth_js
    assert 'status.textContent = tx("Connecté");' in auth_js
    assert 'status.textContent = tx("Hors ligne");' in auth_js
    assert 'api("/api/auth/presence", { body: {} })' in auth_js
    assert "startPresenceHeartbeat();" in auth_js
    assert 'document.addEventListener("visibilitychange"' in auth_js
    assert 'label: tx("Réinit. mdp")' in auth_js
    assert 'label: u.role === "admin" ? tx("Rétrograder") : tx("Promouvoir")' in auth_js
    assert 'label: u.active ? tx("Désactiver") : tx("Activer")' in auth_js
    assert 'title: tx("Réinitialiser le mot de passe")' in auth_js
    assert 'td.textContent = tx("Aucune session active.");' in auth_js
    index_html = read("index.html")
    active_sessions_block = index_html.split("<!-- Sessions actives -->", 1)[1].split("<!-- Journal d'audit -->", 1)[0]
    users_block = index_html.split('style="margin-bottom:4px;">Utilisateurs</h2>', 1)[1].split("<!-- Sessions actives -->", 1)[0]
    assert 'id="admin-sessions-more"' in active_sessions_block
    assert 'id="admin-sessions-more"' not in users_block
    assert "const ADMIN_SESSIONS_PAGE_SIZE = 30;" in auth_js
    assert 'params.set("limit", String(ADMIN_SESSIONS_PAGE_SIZE));' in auth_js
    assert 'params.set("before", adminSessionsBefore);' in auth_js
    assert 'const moreBtn = document.getElementById("admin-sessions-more");' in auth_js
    assert 'if (sessionsMore) sessionsMore.addEventListener("click", () => renderAdminSessions(false));' in auth_js

    for phrase in [
        "Disponibilité",
        "Base de données",
        "Coffres chiffrés",
        "Journal d'audit",
        "entrées",
        "Désactivé",
        "Verrouillé",
        "Mot de passe à définir",
        "Connecté",
        "Hors ligne",
        "Réinit. mdp",
        "Rétrograder",
        "Promouvoir",
        "Suppr.",
        "Aucune session active.",
        "Charger plus de sessions",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_admin_audit_log_rows_are_translated_in_english_mode():
    auth_js = read("auth.js")
    i18n_js = read("i18n.js")

    assert "function formatAuditAction(action)" in auth_js
    assert "function formatAuditDetail(detail)" in auth_js
    assert "badge.textContent = formatAuditAction(entry.action);" in auth_js
    assert "formatAuditDetail(entry.detail)" in auth_js

    for phrase in [
        "Connexion réussie",
        "Échec de connexion",
        "Compte verrouillé",
        "Déconnexion",
        "Compte créé",
        "Compte modifié",
        "Compte supprimé",
        "Mot de passe modifié",
        "Réinitialisation admin du mot de passe",
        "Récupération terminée",
        "Code de récupération régénéré",
        "Session révoquée",
        "Autres sessions révoquées",
        "Coffre réinitialisé",
        "Import coffre refusé",
        "Coffre importé",
        "Réglage modifié",
        "mot de passe incorrect",
        "compte inconnu",
        "compte désactivé",
        "coffre réinitialisé",
        "bootstrap admin",
        "{count} session(s)",
        "rôle {role}",
        "inscriptions ouvertes",
        "inscriptions fermées",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_statistics_dynamic_spacing_and_alert_text_uses_i18n():
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    assert 'setText("stat-days-since", daysSince <= 0 ? tx("auj.") : tx("{days} j", { days: daysSince }));' in app_js
    assert 'addRuleBadge(rulesList, tx("Espacement MDMA"), mdmaRuleText, mdmaRuleOk);' in app_js
    assert 'addRuleBadge(rulesList, tx("Tolérance Psychédélique (14j)"), psychRuleText, psychRuleOk);' in app_js
    assert 'addRuleBadge(rulesList, tx("Usage Stimulants (7 derniers jours)"), stimRuleText, stimRuleOk);' in app_js
    assert 'addRuleBadge(rulesList, tx("Mélanges rapprochés dans l’historique"), mixRuleText, mixRuleOk);' in app_js
    assert 'tx("Dernière prise il y a seulement {days} jours. Espacement très court : la récupération émotionnelle et physique peut être incomplète. Pause fortement recommandée.", { days: daysSince })' in app_js
    assert 'tx("Stimulants enregistrés {count} fois en 7 jours. Fréquence élevée : risque d’accoutumance, dette de sommeil, anxiété et surcharge cardiovasculaire.", { count: stimsLastWeek.length })' in app_js

    for phrase in [
        "auj.",
        "{days} j",
        "Espacement MDMA",
        "Tolérance Psychédélique (14j)",
        "Usage Stimulants (7 derniers jours)",
        "Mélanges rapprochés dans l’historique",
        "Dernière prise il y a seulement {days} jours. Espacement très court : la récupération émotionnelle et physique peut être incomplète. Pause fortement recommandée.",
        "Stimulants enregistrés {count} fois en 7 jours. Fréquence élevée : risque d’accoutumance, dette de sommeil, anxiété et surcharge cardiovasculaire.",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_emergency_resources_include_france_uk_and_united_states():
    index_html = read("index.html")
    i18n_js = read("i18n.js")

    assert "Urgences & aides - France, Royaume-Uni, États-Unis" in index_html
    assert "Aide au Royaume-Uni" in index_html
    assert "Aide aux États-Unis" in index_html
    assert "FRANK - 0300 123 6600" in index_html
    assert "SAMHSA - 1-800-662-HELP (4357)" in index_html
    assert "Royaume-Uni" in index_html
    assert "États-Unis" in index_html
    assert ">999 / 112<" in index_html
    assert ">911<" in index_html
    assert ">1-800-222-1222<" in index_html
    assert "Poison Help" in index_html
    assert "0300 123 6600 / SMS 82111" in index_html
    assert "988 Lifeline" in index_html
    assert ">988<" in index_html

    for phrase in [
        "Urgences & aides - France, Royaume-Uni, États-Unis",
        "Aide au Royaume-Uni :",
        "FRANK - 0300 123 6600, SMS 82111, confidentiel. Urgence vitale : 999 ou 112.",
        "Aide aux États-Unis :",
        "SAMHSA - 1-800-662-HELP (4357), 24h/24 ; crise suicidaire ou émotionnelle : 988. Urgence vitale : 911.",
        "Royaume-Uni",
        "urgence médicale ou danger immédiat : ambulance, police, pompiers",
        "États-Unis",
        "urgence vitale ou danger immédiat",
        "Poison Help",
        "centre antipoison national, 24h/24 et 7j/7",
        "FRANK",
        "0300 123 6600 / SMS 82111",
        "information drogues confidentielle au Royaume-Uni",
        "SAMHSA",
        "1-800-662-HELP (4357)",
        "aide traitement et orientation, 24h/24 aux États-Unis",
        "988 Lifeline",
        "988",
        "crise suicidaire ou détresse émotionnelle, 24h/24 aux États-Unis",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_dynamic_feedback_messages_use_i18n():
    auth_js = read("auth.js")
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    assert 'SeuilUI.toast("' not in auth_js
    assert 'SeuilUI.toast("' not in app_js

    required_auth_snippets = [
        'SeuilUI.toast(tx("Session expirée. Reconnectez-vous."), { type: "info" });',
        'SeuilUI.toast(tx("Compte migré vers le serveur sécurisé."), { type: "success" });',
        'SeuilUI.toast(tx("Accès récupéré. Vos données sont intactes."), { type: "success" });',
        'status.textContent = tx("Mot de passe mis à jour. Les autres appareils ont été déconnectés.");',
        'SeuilUI.toast(tx("Mot de passe mis à jour."), { type: "success" });',
        'status.textContent = translatedError(err, "Changement impossible.");',
        'SeuilUI.toast(translatedError(err, "Génération impossible."), { type: "error" });',
        'SeuilUI.toast(tx("Chargement du panneau impossible : {message}", { message: err.message }), { type: "error" });',
        'message: tx("Transmettez ce mot de passe initial à {username} par un canal sûr. Il devra le changer à sa première connexion.", { username }),',
        'SeuilUI.toast(tx(res.settings.openSignup ? "Inscription publique activée." : "Inscription publique fermée."), { type: "success" });',
        'title: tx(newRole === "admin" ? "Promouvoir administrateur" : "Rétrograder en utilisateur"),',
        'SeuilUI.toast(tx("Rôle de {username} mis à jour.", { username: user.username }), { type: "success" });',
        'SeuilUI.toast(tx("Compte {username} {status}.", { username: user.username, status: tx(next ? "réactivé" : "désactivé") }), { type: "success" });',
        'SeuilUI.toast(tx("{count} session(s) de {username} révoquée(s).", { count: res.deleted, username: user.username }), { type: "success" });',
        'SeuilUI.toast(tx("Compte {username} supprimé.", { username: user.username }), { type: "success" });',
        'message: tx("Un mot de passe temporaire sera généré pour {username}. Ses sessions seront fermées et il devra définir un nouveau mot de passe. {recoveryNote}",',
        'message: tx("Transmettez ce mot de passe temporaire à {username} par un canal sûr.", { username: user.username }),',
    ]
    for snippet in required_auth_snippets:
        assert snippet in auth_js

    required_app_snippets = [
        'SeuilUI.toast(tx("Le coffre serveur est indisponible : les modifications ne seront pas sauvegardées."), { type: "error", duration: 8000 });',
        'SeuilUI.toast(tx("Sauvegarde impossible : {message}", { message: tx(err.message || "serveur injoignable.") }), { type: "error", duration: 6000 });',
        'SeuilUI.toast(tx("Fiche détaillée partielle : contenus longs indisponibles."), { type: "info" });',
        'SeuilUI.toast(tx("Sauvegarde JSON exportée. Conservez-la en lieu sûr : elle n\'est pas chiffrée."), { type: "info", duration: 6000 });',
        'title: tx("Importer la sauvegarde"),',
        'message: tx("Le contenu actuel de votre coffre sera remplacé par cette sauvegarde."),',
        'importStatus.textContent = tx("Sauvegarde importée avec succès.");',
        'SeuilUI.toast(tx("Sauvegarde importée."), { type: "success" });',
        'statusEl.textContent = tx("Complétez tous les champs avec des valeurs positives avant d’enregistrer la fiche locale.");',
        'statusEl.textContent = tx("Les paliers doivent rester cohérents : seuil ≤ léger ≤ commun ≤ fort ≤ intense.");',
        'statusEl.textContent = tx("La fiche locale « {name} » a été enregistrée.", { name });',
    ]
    for snippet in required_app_snippets:
        assert snippet in app_js

    assert "function normalizeApiNetworkError" in auth_js
    assert "NetworkError" in auth_js
    assert "Failed to fetch" in auth_js
    assert "throw normalizeApiNetworkError(err);" in auth_js
    assert "function normalizeVaultNetworkError" in app_js
    assert "NetworkError" in app_js
    assert "Failed to fetch" in app_js
    assert "throw normalizeVaultNetworkError(err);" in app_js

    required_phrases = [
        "Session expirée. Reconnectez-vous.",
        "Compte migré, mais l'ancien coffre n'a pas pu être importé : {message}",
        "Compte migré vers le serveur sécurisé.",
        "Accès récupéré. Vos données sont intactes.",
        "Mot de passe mis à jour. Les autres appareils ont été déconnectés.",
        "Mot de passe mis à jour.",
        "Génération impossible.",
        "Chargement du panneau impossible : {message}",
        "Transmettez ce mot de passe initial à {username} par un canal sûr. Il devra le changer à sa première connexion.",
        "Inscription publique activée.",
        "Inscription publique fermée.",
        "Promouvoir administrateur",
        "Rétrograder en utilisateur",
        "{username} pourra gérer les comptes et consulter le journal d'audit.",
        "{username} perdra l'accès au panneau d'administration.",
        "Rôle de {username} mis à jour.",
        "Compte {username} {status}.",
        "{count} session(s) de {username} révoquée(s).",
        "Compte {username} supprimé.",
        "Un mot de passe temporaire sera généré pour {username}. Ses sessions seront fermées et il devra définir un nouveau mot de passe. {recoveryNote}",
        "Ses données chiffrées restent récupérables avec son code de récupération.",
        "Attention : sans code de récupération ni export JSON, ses données chiffrées seront irrécupérables.",
        "Transmettez ce mot de passe temporaire à {username} par un canal sûr.",
        "Le coffre serveur est indisponible : les modifications ne seront pas sauvegardées.",
        "Sauvegarde impossible : {message}",
        "serveur injoignable.",
        "Connexion au serveur impossible. Réessayez dans quelques secondes.",
        "Fiche détaillée partielle : contenus longs indisponibles.",
        "Importer la sauvegarde",
        "Le contenu actuel de votre coffre sera remplacé par cette sauvegarde.",
        "Sauvegarde importée avec succès.",
        "Complétez tous les champs avec des valeurs positives avant d’enregistrer la fiche locale.",
        "Les paliers doivent rester cohérents : seuil ≤ léger ≤ commun ≤ fort ≤ intense.",
        "La fiche locale « {name} » a été enregistrée.",
    ]
    for phrase in required_phrases:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_dose_level_badges_are_translated_in_new_session_and_redose():
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    assert "badge.textContent = `(${tx(level.text)})`;" in app_js
    assert "updateDosageBadge" in app_js
    assert "updateRedoseBadge" in app_js

    for phrase in [
        "Palier non défini",
        "Sous-seuil / seuil",
        "Seuil léger",
        "Dose légère",
        "Dose usuelle",
        "Dose élevée",
        "Dose très élevée",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_session_dose_unit_selectors_convert_to_reference_units():
    index_html = read("index.html")
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    for element_id in [
        'id="unit-select"',
        'id="add-sub-unit"',
        'id="input-redose-unit"',
    ]:
        assert element_id in index_html

    assert "function getCompatibleDoseUnits(referenceUnit)" in app_js
    assert "function convertDoseToReferenceUnit(amount, fromUnit, referenceUnit)" in app_js
    assert "function populateDoseUnitSelect(select, referenceUnit, preferredUnit)" in app_js
    assert 'populateDoseUnitSelect(document.getElementById("unit-select"), unit);' in app_js
    assert 'populateDoseUnitSelect(document.getElementById("add-sub-unit"), getReferenceUnitForSubstanceKey(subSelect.value));' in app_js
    assert 'populateDoseUnitSelect(document.getElementById("input-redose-unit"), getReferenceUnitForSubstanceKey(targetSelect.value));' in app_js
    assert "const dosage = convertDoseToReferenceUnit(inputDosage, doseUnit, unit);" in app_js
    assert "const amount = convertDoseToReferenceUnit(inputAmount, amountUnit, targetUnit);" in app_js
    assert "const dose = convertDoseToReferenceUnit(inputDose, doseUnit, db[key].dosages.unit);" in app_js
    assert "getDosageLevel(subKey, dose, route)" in app_js
    assert "getDosageLevel(subKey, amount, route)" in app_js

    for phrase in [
        "Unité de saisie",
        "µg",
        "mg",
        "g",
        "ml",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_vague_dose_units_are_stored_and_displayed_without_fake_mg_values():
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    assert 'const QUALITATIVE_DOSE_UNITS = ["ligne", "joint", "verre", "comprimé", "goutte", "bouffée", "prise"];' in app_js
    assert "function isQualitativeDoseUnit(unit)" in app_js
    assert "function formatInputDoseLabel(amount, unit)" in app_js
    assert "function getCurveDoseValue(log)" in app_js
    assert "function formatDoseQuantity(log, unit)" in app_js
    assert "function formatCumulativeDoseDisplay(logs, unit)" in app_js
    assert "const qualitativeParts = collectQualitativeDoseParts(logs);" in app_js
    assert "return isQualitativeDoseUnit(source) ? null : value;" in app_js
    assert "...QUALITATIVE_DOSE_UNITS" in app_js
    assert "doseLabel: inputDoseLabel" in app_js
    assert "const curveDose = dosage === null ? inputDosage : dosage;" in app_js
    assert "curveDose," in app_js
    assert "inputAmount: inputDosage" in app_js
    assert "inputUnit: doseUnit" in app_js
    assert "doseLabel: amountLabel" in app_js
    assert "const curveDose = amount === null ? inputAmount : amount;" in app_js
    assert "inputAmount: inputAmount" in app_js
    assert "inputUnit: amountUnit" in app_js
    assert "doseLabel: doseLabel" in app_js
    assert "const curveDose = dose === null ? inputDose : dose;" in app_js
    assert "inputAmount: inputDose" in app_js
    assert "inputUnit: doseUnit" in app_js
    assert "getDoseCurveValue(getCurveDoseValue(log), log.route || session.route, elapsedSeconds, subInfo)" in app_js
    assert "formatCumulativeDoseDisplay(session.logs, session.unit)" in app_js
    assert "formatCumulativeDoseDisplay(s.logs, s.unit)" in app_js
    assert "const numeric = getNumericDoseValue(log)" in app_js
    assert "sumDoseLogs(logs)" in app_js
    assert "if (deductStash && subKey !== \"custom\" && dosage !== null)" in app_js
    assert "if (deductStash && targetKey !== \"custom\" && amount !== null)" in app_js
    assert "if (convertedDose !== null) log.dose = convertedDose;" in app_js

    for phrase in [
        "ligne",
        "joint",
        "verre",
        "comprimé",
        "goutte",
        "bouffée",
        "prise",
        "Non quantifié",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_qualitative_input_units_can_be_configured_from_settings():
    index_html = read("index.html")
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    for element_id in [
        'id="dose-unit-settings-form"',
        'id="dose-unit-list-input"',
        'id="dose-unit-reset"',
        'id="dose-unit-settings-status"',
    ]:
        assert element_id in index_html

    settings_start = index_html.find('id="dose-unit-settings-form"')
    settings_block = index_html[index_html.rfind('<div class="card"', 0, settings_start):settings_start]
    assert "<details" not in settings_block
    assert "<summary" not in settings_block
    assert '<h2 class="card-title">Unités de saisie</h2>' in settings_block

    assert "doseUnitSettings: {" in app_js
    assert "qualitativeUnits: [...QUALITATIVE_DOSE_UNITS]" in app_js
    assert "function sanitizeQualitativeDoseUnits(units)" in app_js
    assert "function getQualitativeDoseUnits()" in app_js
    assert "function renderDoseUnitSettings()" in app_js
    assert "function saveDoseUnitSettings(event)" in app_js
    assert "function resetDoseUnitSettings()" in app_js
    assert "function refreshDoseUnitSelects()" in app_js
    assert "getQualitativeDoseUnits().includes(normalizeDoseUnit(unit))" in app_js
    assert "...getQualitativeDoseUnits()" in app_js
    assert 'document.getElementById("dose-unit-settings-form").addEventListener("submit", saveDoseUnitSettings);' in app_js
    assert 'document.getElementById("dose-unit-reset").addEventListener("click", resetDoseUnitSettings);' in app_js
    assert "refreshDoseUnitSelects();" in app_js

    for phrase in [
        "Unités de saisie",
        "Personnalisez les unités qualitatives proposées dans le journal. Les unités exactes restent toujours disponibles.",
        "Unités personnalisées",
        "Ex. ligne, joint, verre, comprimé",
        "Enregistrer les unités",
        "Réinitialiser",
        "Unités de saisie mises à jour.",
        "Unités de saisie réinitialisées.",
        "Ajoutez au moins une unité qualitative.",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_default_qualitative_units_are_localized_in_settings_editor():
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    assert "const QUALITATIVE_DOSE_UNIT_ALIASES = {" in app_js
    for english, canonical in [
        ("line", "ligne"),
        ("glass", "verre"),
        ("pill", "comprimé"),
        ("drop", "goutte"),
        ("puff", "bouffée"),
        ("dose", "prise"),
    ]:
        assert f'"{english}": "{canonical}"' in app_js

    assert "function canonicalizeQualitativeDoseUnit(unit)" in app_js
    assert "function formatQualitativeDoseUnitForSettings(unit)" in app_js
    assert "QUALITATIVE_DOSE_UNIT_ALIASES[key] || normalized" in app_js
    assert ".map(formatQualitativeDoseUnitForSettings)" in app_js

    for phrase, translated in [
        ("ligne", "line"),
        ("joint", "joint"),
        ("verre", "glass"),
        ("comprimé", "pill"),
        ("goutte", "drop"),
        ("bouffée", "puff"),
        ("prise", "dose"),
    ]:
        assert f'{json.dumps(phrase, ensure_ascii=False)}: {json.dumps(translated, ensure_ascii=False)}' in i18n_js


def test_tracker_emergency_notice_includes_uk_and_us_numbers_in_english():
    index_html = read("index.html")
    i18n_js = read("i18n.js")

    french_notice = (
        "perte de connaissance, respiration lente, douleur thoracique, convulsions - "
        "appelez le 15 ou 112 (France), le 999 ou 112 (Royaume-Uni) ou le 911 (États-Unis). "
        "Cet outil ne remplace pas un avis médical."
    )
    english_notice = (
        "loss of consciousness, slow breathing, chest pain, seizures - "
        "call 15 or 112 (France), 999 or 112 (United Kingdom), or 911 (United States). "
        "This tool does not replace medical advice."
    )

    assert french_notice in index_html
    assert json.dumps(french_notice, ensure_ascii=False) + ":" in i18n_js
    assert json.dumps(english_notice, ensure_ascii=False) in i18n_js
    assert "call 15 or 112. This tool does not replace medical advice." not in i18n_js


def test_substance_names_are_translated_when_rendered():
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    assert "function displaySubstanceName(name)" in app_js
    assert "displaySubstanceName(sub.name)" in app_js
    assert "displaySubstanceName(session.substanceName)" in app_js
    assert "displaySubstanceName(s.name)" in app_js

    for phrase in [
        "Kétamine",
        "Héroïne",
        "Amanite tue-mouches",
        "Noix de muscade",
        "Méthylphénidate",
        "Éphédrine",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_substance_aliases_and_inventory_rows_are_translated_when_rendered():
    app_js = read("app.js")

    assert 'sub.aliases.slice(0, 4).map(item => tx(item)).join(" · ")' in app_js
    assert '<strong style="font-size: 16px;">${escapeHtml(displaySubstanceName(subInfo.name))}</strong>' in app_js
    assert '<span class="substance-badge badge-${safeCssClass(subInfo.class)}">${escapeHtml(tx(subInfo.category))}</span>' in app_js
    assert '${escapeHtml(tx("Forme :"))}' in app_js
    assert 'class="stash-status stash-status-low"' in app_js
    assert 'class="stash-status stash-status-ok"' in app_js


def test_inventory_rows_can_be_deleted_with_confirmation():
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    assert 'data-delete-stash data-stash-key="${escapeHtml(key)}"' in app_js
    assert 'aria-label="${escapeHtml(tx("Supprimer {name} de l\'inventaire"' in app_js
    assert "async function deleteStashEntry(key)" in app_js
    assert 'title: tx("Supprimer de l\'inventaire")' in app_js
    assert 'message: tx("Cette entrée ({name}) sera retirée de votre inventaire chiffré.", { name })' in app_js
    assert "delete appState.stash[key];" in app_js
    assert "await saveLocalData();" in app_js
    assert "renderStash();" in app_js
    assert 'e.target.closest("[data-delete-stash]")' in app_js

    for phrase in [
        "Supprimer {name} de l'inventaire",
        "Supprimer de l'inventaire",
        "Cette entrée ({name}) sera retirée de votre inventaire chiffré.",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_active_journal_doses_and_substances_can_be_edited_or_removed():
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    assert "function editFirstDoseForSubstance(sub)" in app_js
    assert "async function deleteDoseLog(sub, logIndex)" in app_js
    assert "async function removeActiveSubstance(sub)" in app_js
    assert 'deleteBtn.textContent = tx("Supprimer la dose")' in app_js
    assert 'removeBtn.textContent = tx("Retirer")' in app_js
    assert "getDoseLogs(sub.logs).length <= 1" in app_js
    assert "session.extraSubstances = extras;" in app_js
    assert "session.substanceKey = next.key;" in app_js
    assert "appState.activeSession = null;" in app_js
    assert "recalculateActiveSessionDoseFields();" in app_js
    assert "renderAfterActiveSessionMutation();" in app_js

    for phrase in [
        "Modifier",
        "Retirer",
        "Supprimer la dose",
        "Cette dose sera retirée de la chronologie et des courbes.",
        "Retirer du suivi",
        "Retirer la substance principale",
        "Retirer la dernière substance ?",
    ]:
        assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_live_timeline_is_cleared_when_active_session_disappears():
    app_js = read("app.js")

    dashboard_start = app_js.find("function renderDashboard()")
    dashboard_end = app_js.find("// Gère le changement d'unité", dashboard_start)
    assert dashboard_start != -1 and dashboard_end != -1
    dashboard_block = app_js[dashboard_start:dashboard_end]
    assert 'activeDiv.style.display = "none";' in dashboard_block
    assert dashboard_block.find('activeDiv.style.display = "none";') < dashboard_block.find("renderLiveLogFeed();", dashboard_block.find('activeDiv.style.display = "none";'))
    assert dashboard_block.find('activeDiv.style.display = "none";') < dashboard_block.find("renderActiveSubstances();", dashboard_block.find('activeDiv.style.display = "none";'))

    render_start = app_js.find("function renderLiveLogFeed()")
    render_end = app_js.find("// Modifier la quantité", render_start)
    assert render_start != -1 and render_end != -1
    render_block = app_js[render_start:render_end]
    assert 'if (!feed || !emptyMsg) return;' in render_block
    assert 'if (!session || !entries.length) {' in render_block
    assert 'feed.innerHTML = "";' in render_block

    substances_start = app_js.find("function renderActiveSubstances()")
    substances_end = app_js.find("function renderLiveLogFeed()", substances_start)
    assert substances_start != -1 and substances_end != -1
    substances_block = app_js[substances_start:substances_end]
    assert 'if (!appState.activeSession) {' in substances_block
    assert 'if (el) el.innerHTML = "";' in substances_block
    assert 'if (rt) rt.innerHTML = "";' in substances_block
    assert "lastRedoseTargetKey = null;" in substances_block


def test_shared_ui_formatters_follow_active_language():
    ui_js = read("ui.js")

    assert "function uiLang()" in ui_js
    assert 'return lang === "en" ? `${n} B` : `${n} o`;' in ui_js
    assert 'return lang === "en" ? "just now" : "à l\'instant";' in ui_js
    assert 'return lang === "en" ? `${min} min ago` : `il y a ${min} min`;' in ui_js
    assert 'return d.toLocaleDateString(uiLocale()' in ui_js


def test_auth_page_does_not_eager_load_heavy_substance_detail_assets():
    index_html = read("index.html")
    app_js = read("app.js")
    sw_js = read("sw.js")
    core_assets = sw_js.split("const CORE_ASSETS = [", 1)[1].split("];", 1)[0]

    assert 'src="substances-detail.js' not in index_html
    assert 'src="i18n-detail.js' not in index_html
    assert '"substances-detail.js?v=3"' in app_js
    assert '"i18n-detail.js?v=5"' in app_js
    assert "await loadSubstanceDetailAssets();" in app_js
    assert "substances-detail.js" not in core_assets
    assert "i18n-detail.js" not in core_assets


def test_i18n_detail_does_not_retranslate_entire_auth_dom_on_load():
    detail_i18n_js = read("i18n-detail.js")

    assert "Object.assign(global.SeuilI18n.phrases.en, EN_DETAIL);" in detail_i18n_js
    assert "SeuilI18n.apply(global.document)" not in detail_i18n_js


def test_i18n_covers_all_extended_substance_entry_descriptions():
    i18n_js = read("i18n.js")
    entries = index_substance_entries(read("index-substances.js"))

    assert len(entries) >= 100
    for entry_id, category, description in entries:
        assert '"' + category + '":' in i18n_js
        assert '"' + description + '":' in i18n_js, entry_id


def test_i18n_covers_rich_lysergamide_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "PSYCHÉDÉLIQUES - Lysergamides",
        "PSYCHÉDÉLIQUES - Phénéthylamines 2C",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 40
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_rich_2c_phenethylamine_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "PSYCHÉDÉLIQUES - Phénéthylamines 2C",
        "PSYCHÉDÉLIQUES - Tryptamines",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 20
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_rich_tryptamine_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "PSYCHÉDÉLIQUES - Tryptamines",
        "PSYCHÉDÉLIQUES - NBOMe",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 35
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_rich_nbome_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "PSYCHÉDÉLIQUES - NBOMe",
        "DISSOCIATIFS",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 20
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_rich_dissociative_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "DISSOCIATIFS",
        "STIMULANTS - Cathinones de synthèse",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 55
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_rich_synthetic_cathinone_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "STIMULANTS - Cathinones de synthèse",
        "STIMULANTS - Amphétamines fluorées, eugéroïques, plantes",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 60
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_rich_fluorinated_amphetamine_eugeroic_plant_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "STIMULANTS - Amphétamines fluorées, eugéroïques, plantes",
        "EMPATHOGÈNES",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 55
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_rich_empathogen_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "EMPATHOGÈNES",
        "DÉPRESSEURS - Précurseurs du GHB",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 35
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_rich_ghb_precursor_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "DÉPRESSEURS - Précurseurs du GHB",
        "DÉPRESSEURS - Hypnotiques",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 20
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_rich_z_hypnotic_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "DÉPRESSEURS - Hypnotiques",
        "DÉPRESSEURS - Benzodiazépines",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 15
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_rich_benzodiazepine_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "DÉPRESSEURS - Benzodiazépines",
        "DÉPRESSEURS - Gabapentinoïdes",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 50
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_rich_gabapentinoid_muscle_relaxant_plant_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "DÉPRESSEURS - Gabapentinoïdes",
        "OPIOÏDES",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 65
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_rich_opioid_text_fields():
    i18n_js = read("i18n.js")
    data_js = read("substances-data.js")
    block = rich_family_block(
        data_js,
        "OPIOÏDES",
        "CANNABINOÏDES",
    )
    field_block = "\n".join(
        line for line in block.splitlines()
        if any(key in line for key in ("profile:", "forms:", "risk_factors:", "warning_signs:", "aftercare:", "rdr_rules:", "dosage_warning:"))
    )
    phrases = [phrase for phrase in js_double_quoted_strings(field_block) if visible_i18n_candidate(phrase)]

    assert len(phrases) >= 90
    for phrase in phrases:
        assert '"' + phrase + '":' in i18n_js


def test_i18n_covers_guide_search_and_interaction_result_strings():
    app_js = read("app.js")
    i18n_js = read("i18n.js")
    required_phrases = [
        "{shown} résultat(s) sur {total} fiches.",
        "Aucun résultat.",
        "{total} fiches. Les paliers sont des repères de réduction des risques, jamais des recommandations.",
        "Fiche pédagogique",
        "Même substance",
        "Vous avez sélectionné deux fois le même produit. Il ne s’agit pas d’un mélange, mais la dose cumulée augmente bien l’intensité, les effets indésirables et le risque de surdosage.",
        "Aucune interaction suffisamment documentée dans cette base. En réduction des risques, l’absence de donnée ne veut pas dire absence de danger : évitez le mélange ou considérez-le comme potentiellement risqué.",
        "Détails :",
    ]

    assert 'tx("{shown} résultat(s) sur {total} fiches."' in app_js
    assert 'tx("{total} fiches. Les paliers sont des repères de réduction des risques, jamais des recommandations."' in app_js
    assert 'titleEl.textContent = tx("Même substance");' in app_js
    assert "tx(interData.note)" in app_js
    assert "tx(cat.description)" in app_js
    assert 'tx("Fiche pédagogique")' in app_js
    for phrase in required_phrases:
        assert '"' + phrase + '":' in i18n_js


def test_signup_spinner_stops_before_recovery_modal_confirmation():
    auth_js = read("auth.js")

    register_pos = auth_js.find("const result = await register(username, displayName, password);")
    stop_pos = auth_js.find('setSubmitting("signup-submit", false);', register_pos)
    modal_pos = auth_js.find("await showRecoveryKitModal(result.recoveryCode);", register_pos)

    assert register_pos != -1
    assert stop_pos != -1
    assert modal_pos != -1
    assert register_pos < stop_pos < modal_pos


def test_auth_recovery_modal_is_above_auth_screen():
    styles_css = read("styles.css")

    modal = re.search(r"\.modal\s*\{[^}]*z-index:\s*(\d+)", styles_css, re.S)
    auth = re.search(r"#auth-screen\s*\{[^}]*z-index:\s*(\d+)", styles_css, re.S)

    assert modal is not None
    assert auth is not None
    assert int(modal.group(1)) > int(auth.group(1))


def test_service_worker_caches_new_assets():
    sw_js = read("sw.js")

    assert "ui.js" in sw_js
    assert "route-model.js" in sw_js
    assert "psychonaut-data.js" in sw_js
    assert "icon-180.png" in sw_js


def test_service_worker_network_first_has_timeout_and_no_forced_client_navigation():
    sw_js = read("sw.js")

    assert "NETWORK_TIMEOUT_MS" in sw_js
    assert "fetchWithTimeout" in sw_js
    assert "AbortController" in sw_js
    assert "Promise.race" in sw_js
    assert "client.navigate" not in sw_js


def test_service_worker_registration_version_matches_cache_release():
    sw_js = read("sw.js")
    app_js = read("app.js")

    cache_match = re.search(r'CACHE_NAME\s*=\s*"seuil-v([0-9.]+)"', sw_js)
    registration_match = re.search(r'navigator\.serviceWorker\.register\("\./sw\.js\?v=([0-9.]+)"\)', app_js)

    assert cache_match is not None
    assert registration_match is not None
    assert registration_match.group(1) == cache_match.group(1)


def test_server_storage_quota_defaults_to_five_gib():
    serve_py = read("serve.py")

    assert 'SEUIL_MAX_STATE_DB_BYTES", str(5 * 1024 * 1024 * 1024)' in serve_py
    assert '"maxDbBytes": app.config["MAX_STATE_DB_BYTES"]' in serve_py


def test_auth_api_fetch_has_timeout():
    auth_js = read("auth.js")

    assert "API_TIMEOUT_MS" in auth_js
    assert "AbortController" in auth_js
    assert "setTimeout" in auth_js


def test_vault_api_fetch_has_timeout():
    app_js = read("app.js")
    start = app_js.find("async function vaultRequest")
    end = app_js.find("async function fetchServerState", start)
    assert start != -1 and end != -1
    vault_request = app_js[start:end]

    assert "VAULT_TIMEOUT_MS" in app_js
    assert "vaultTimeoutError" in app_js
    assert "AbortController" in vault_request
    assert "Promise.race" in vault_request
    assert "fetch(\"/api/vault\"" in vault_request


def test_init_app_renders_dashboard_when_resuming_active_session():
    app_js = read("app.js")
    start = app_js.find("// 6. Si une session active existait, relancer le timer")
    end = app_js.find("// 7. Rendre les stash et statistiques", start)
    assert start != -1 and end != -1
    resume_block = app_js[start:end]

    assert "resumeActiveSession();" in resume_block
    assert "renderDashboard();" in resume_block
    assert "else {\n        renderDashboard();" not in resume_block


def test_authenticated_refresh_does_not_flash_login_or_default_tab():
    index_html = read("index.html")
    styles_css = read("styles.css")
    auth_js = read("auth.js")
    app_js = read("app.js")

    assert '<body class="auth-locked auth-booting">' in index_html
    assert "body.auth-booting #auth-screen" not in styles_css
    assert "body.auth-booting .app-container" in styles_css
    assert "body.auth-booting #boot-screen" in styles_css

    boot_start = auth_js.find("async function boot()")
    boot_end = auth_js.find("async function login", boot_start)
    assert boot_start != -1 and boot_end != -1
    boot_block = auth_js[boot_start:boot_end]
    assert "applyRoleClasses();" not in boot_block

    auth_branch_start = app_js.find("if (result.authenticated && !result.locked)")
    auth_branch_end = app_js.find("} else if (result.authenticated && result.locked)", auth_branch_start)
    assert auth_branch_start != -1 and auth_branch_end != -1
    auth_branch = app_js[auth_branch_start:auth_branch_end]
    assert auth_branch.find("await initApp();") < auth_branch.find("SeuilAuth.applyRoleClasses();")

    assert "ACTIVE_TAB_STORAGE_KEY" in app_js
    assert "restoreActiveTab" in app_js
    assert "sessionStorage.setItem(ACTIVE_TAB_STORAGE_KEY" in app_js


def test_boot_state_has_visible_loading_surface_before_scripts():
    index_html = read("index.html")
    styles_css = read("styles.css")
    boot_js = read("boot.js")
    i18n_js = read("i18n.js")

    assert 'id="boot-screen"' in index_html
    assert index_html.find('id="boot-screen"') < index_html.find('src="i18n.js')
    assert 'body.auth-booting #boot-screen' in styles_css
    assert 'body:not(.auth-booting) #boot-screen' in styles_css
    assert "bootOverlayAutoHide" in styles_css
    assert "pointer-events: none;" in styles_css
    assert "translateBootScreen" in boot_js
    assert '"Chargement sécurisé...": "Secure loading..."' in i18n_js
    assert 'role="status"' in index_html


def test_brand_name_is_not_translated_to_threshold():
    index_html = read("index.html")
    i18n_js = read("i18n.js")
    app_js = read("app.js")

    assert '<html lang="fr" translate="no">' in index_html
    assert '<meta name="google" content="notranslate">' in index_html
    assert 'class="boot-brand notranslate"' in index_html
    assert '"Seuil": "Threshold"' not in i18n_js
    assert '"Seuil de dose": "Threshold"' in i18n_js
    assert 'tx("Seuil de dose")' in app_js


def test_auth_ui_is_bound_before_session_boot_to_avoid_black_screen():
    app_js = read("app.js")

    dom_start = app_js.find('document.addEventListener("DOMContentLoaded"')
    bind_pos = app_js.find("SeuilAuth.bindAuthUI();", dom_start)
    boot_pos = app_js.find("result = await SeuilAuth.boot();", dom_start)
    assert dom_start != -1 and bind_pos != -1 and boot_pos != -1
    assert bind_pos < boot_pos

    auth_js = read("auth.js")
    assert "let authUiBound = false;" in auth_js
    assert "if (authUiBound) return;" in auth_js
    assert 'document.getElementById("locked-user")' in auth_js


def test_locked_unlock_flow_times_out_and_reports_post_unlock_failures():
    auth_js = read("auth.js")
    i18n_js = read("i18n.js")

    assert "AUTH_ACTION_TIMEOUT_MS" in auth_js
    assert "function withAuthTimeout" in auth_js
    assert "async function unlockCurrentSession" in auth_js
    unlock_start = auth_js.find("async function unlockCurrentSession")
    unlock_end = auth_js.find("function bindAuthUI", unlock_start)
    assert unlock_start != -1 and unlock_end != -1
    unlock_flow = auth_js[unlock_start:unlock_end]
    assert "withAuthTimeout(" in unlock_flow
    assert "unlock(password)" in unlock_flow
    assert "completeAuthSuccess()" in unlock_flow

    start = auth_js.find('const lockedForm = document.getElementById("locked-form")')
    end = auth_js.find('const lockedSignout = document.getElementById("locked-signout")', start)
    assert start != -1 and end != -1
    locked_block = auth_js[start:end]
    assert "await unlockCurrentSession(" in locked_block
    assert 'setAuthError("locked", err.message || "Déverrouillage impossible.")' in locked_block
    assert 'setAuthError("locked", "Mot de passe incorrect.")' not in locked_block

    required_phrases = [
        "Déverrouillage trop long. Rechargez la page puis réessayez.",
        "Mot de passe incorrect ou coffre impossible à déverrouiller.",
        "Coffre déverrouillé, mais le chargement de l'application prend trop longtemps. Rechargez la page.",
        "Déverrouillage impossible.",
    ]
    for phrase in required_phrases:
        assert '"' + phrase + '":' in i18n_js


def test_boot_guard_reveals_auth_screen_instead_of_black_screen():
    boot_js = read("boot.js")

    assert "function revealAuthFallback()" in boot_js
    assert "function shouldAttemptCacheRecovery()" in boot_js
    assert "document.body.classList.remove(\"auth-booting\")" in boot_js
    assert "document.body.classList.add(\"auth-locked\")" in boot_js
    assert "auth.classList.remove(\"hidden\")" in boot_js
    assert "window.addEventListener(\"error\"" in boot_js
    assert "window.addEventListener(\"unhandledrejection\"" in boot_js
    assert "if (stillBooting) revealAuthFallback();" in boot_js
    assert "document.readyState !== 'complete'" in boot_js
    assert "setTimeout(runCacheRecoveryIfNeeded, 12000)" in boot_js
    assert boot_js.find("if (stillBooting) revealAuthFallback();") < boot_js.find("setTimeout(runCacheRecoveryIfNeeded, 12000)")
    assert boot_js.find("shouldAttemptCacheRecovery()") < boot_js.find("navigator.serviceWorker.getRegistrations")


def test_boot_supports_manual_cache_reset_query_without_clearing_storage():
    boot_js = read("boot.js")

    assert "function shouldForceCacheRecovery()" in boot_js
    assert "_seuil_reset_cache" in boot_js
    assert "runCacheRecovery(true)" in boot_js
    assert "searchParams.delete('_seuil_reset_cache')" in boot_js
    assert "localStorage.clear" not in boot_js
    assert "sessionStorage.clear" not in boot_js


def test_service_worker_update_does_not_reload_auth_screen():
    app_js = read("app.js")
    start = app_js.find("function registerServiceWorker()")
    assert start != -1
    end = app_js.find("// --- CHIFFREMENT", start)
    assert end != -1
    sw_block = app_js[start:end]

    assert "controllerchange" in sw_block
    assert "isAuthSurfaceVisible" in sw_block
    assert "document.body.classList.contains(\"auth-locked\")" in sw_block
    assert "document.body.classList.contains(\"auth-booting\")" in sw_block
    assert sw_block.find("if (isAuthSurfaceVisible()) return;") < sw_block.find("window.location.reload();")


def test_init_app_does_not_block_auth_success_on_detail_assets():
    app_js = read("app.js")
    start = app_js.find("async function initApp()")
    end = app_js.find("function applyI18nToAppSurfaces()", start)
    assert start != -1 and end != -1
    init_block = app_js[start:end]

    assert "await loadLocalData();" in init_block
    assert "await loadSubstanceDetailAssets();" not in init_block
    assert "scheduleSubstanceDetailWarmup();" in init_block

    open_start = app_js.find("async function openSubstanceModal")
    assert open_start != -1
    open_block = app_js[open_start:app_js.find("// Fermer la modal", open_start)]
    assert "await loadSubstanceDetailAssets();" in open_block
    assert "applyI18nToAppSurfaces();" in open_block


def test_language_setting_supports_auto_detect_and_manual_override():
    index_html = read("index.html")
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    assert 'id="language-select"' in index_html
    assert '<option value="auto">Automatique (navigateur)</option>' in index_html
    assert '<option value="fr">Français</option>' in index_html
    assert '<option value="en">English</option>' in index_html
    assert 'id="language-status"' in index_html

    assert "function bindLanguageSettings()" in app_js
    assert "SeuilI18n.getLanguagePreference" in app_js
    assert "SeuilI18n.setLanguagePreference" in app_js
    assert 'document.getElementById("language-select")' in app_js
    assert 'select.addEventListener("change"' in app_js

    assert 'const STORAGE_KEY = "seuil_lang";' in i18n_js
    assert "function getLanguagePreference()" in i18n_js
    assert "function setLanguagePreference" in i18n_js
    assert "normalizePreference" in i18n_js
    assert '"Langue": "Language"' in i18n_js
    assert '"Automatique (navigateur)": "Automatic (browser)"' in i18n_js


def test_dynamic_views_refresh_when_page_returns_to_foreground():
    app_js = read("app.js")
    start = app_js.find("function refreshDynamicViewsOnReturn()")
    end = app_js.find("window.addEventListener(\"pageshow\"", start)
    assert start != -1 and end != -1
    refresh_block = app_js[start:end]

    assert "if (!appInitialized) return;" in refresh_block
    assert "renderDashboard();" in refresh_block
    assert "renderStats();" in refresh_block
    assert "resumeActiveSession();" in refresh_block
    assert "window.addEventListener(\"pageshow\", refreshDynamicViewsOnReturn);" in app_js
    assert "window.addEventListener(\"focus\", refreshDynamicViewsOnReturn);" in app_js
    assert "document.addEventListener(\"visibilitychange\"" in app_js
    assert "document.visibilityState === \"visible\"" in app_js


def test_redose_route_does_not_default_to_insufflated():
    index_html = read("index.html")
    app_js = read("app.js")

    redose_select = index_html[
        index_html.find('id="input-redose-route"'):index_html.find('id="input-redose-time-type"')
    ]
    assert '<option value="Insufflé" selected>' not in redose_select
    assert 'session.route || "Insufflé"' not in app_js
    assert "syncRedoseRouteToTarget" in app_js


def test_secondary_substance_addition_preserves_selected_route():
    index_html = read("index.html")
    app_js = read("app.js")

    add_sub_form = index_html[
        index_html.find('id="form-add-substance"'):index_html.find('id="form-redose"')
    ]
    assert 'id="add-sub-route"' in add_sub_form
    assert 'route: "Oral"' not in app_js
    assert "addSubRoute" in app_js


def test_secondary_substance_addition_can_use_a_precise_time():
    index_html = read("index.html")
    app_js = read("app.js")

    add_sub_form = index_html[
        index_html.find('id="form-add-substance"'):index_html.find('id="form-redose"')
    ]
    assert 'id="add-sub-time-type"' in add_sub_form
    assert 'id="group-add-sub-time"' in add_sub_form
    assert 'id="add-sub-time"' in add_sub_form
    assert 'const addSubTimeType = document.getElementById("add-sub-time-type");' in app_js
    assert 'const addSubTimeValue = document.getElementById("add-sub-time").value;' in app_js
    assert "Math.min(Math.max(parsedTime.getTime(), appState.activeSession.startTime), Date.now())" in app_js
    assert 'logs: [{ time: doseTime, type: "dose", dose, curveDose, inputAmount: inputDose, inputUnit: doseUnit, doseLabel: doseLabel, route' in app_js
    assert 'addSubTimeType.addEventListener("change"' in app_js
    assert 'inp.min = toLocalDatetimeLocal(new Date(appState.activeSession.startTime));' in app_js


def test_dosage_units_do_not_encode_route_labels():
    db_js = read("db.js")

    assert '"unit": "mg (insufflé)"' not in db_js
    assert '"unit": "mg (oral)"' not in db_js
    assert '"unit": "mg (vaporisé)"' not in db_js


def test_timeline_end_uses_full_curve_duration_for_every_route():
    app_js = read("app.js")

    assert "getDurationCurveEndSeconds" in app_js
    assert "durations.total * 1000" not in app_js


def test_active_session_auto_closes_after_all_known_effects_end():
    app_js = read("app.js")

    assert "let autoCloseInProgress = false" in app_js
    assert "function getSessionEffectEndInfo(session)" in app_js
    assert "getSessionSubstancesForEffects(session).forEach" in app_js
    assert "getDoseLogs(sub.logs).forEach" in app_js
    assert "durationSeconds * 1000" in app_js
    assert "async function closeActiveSession" in app_js
    assert "async function autoCloseSessionIfEffectsEnded" in app_js
    assert "await autoCloseSessionIfEffectsEnded()" in app_js
    assert "await closeActiveSession(notes)" in app_js
    assert "Clôture automatique : fin estimée des effets atteinte." in app_js


def test_route_specific_dosage_data_is_used_when_available():
    app_js = read("app.js")
    db_js = read("db.js")

    assert "dosages_by_route" in db_js
    assert "getDosageForRoute" in app_js
    assert "getDosageLevel(subKey, dose, route)" in app_js
    assert "input-redose-route" in app_js


def test_substance_selectors_are_sorted_by_display_name():
    app_js = read("app.js")
    guide_start = app_js.find("function initGuideAndInteractions()")
    guide_end = app_js.find("function renderCompactList", guide_start)
    assert guide_start != -1 and guide_end != -1
    guide_block = app_js[guide_start:guide_end]

    assert "function getSortedSubstanceKeys(db)" in app_js
    assert "displaySubstanceName((db[a] || {}).name)" in app_js
    assert 'localeCompare(displaySubstanceName((db[b] || {}).name), undefined, { sensitivity: "base" })' in app_js
    assert "getSortedSubstanceKeys(mergedDb).forEach" in app_js
    assert "getSortedSubstanceKeys(db).filter(k => db[k].durations_seconds && !used.has(k))" in app_js
    assert "const keys = getSortedSubstanceKeys(db).filter" in app_js
    assert "for (const key in mergedDb)" not in guide_block
    assert "for (const key of getSortedSubstanceKeys(mergedDb))" in guide_block


def test_route_model_loads_before_app_and_drives_all_route_selects():
    index_html = read("index.html")
    app_js = read("app.js")
    i18n_js = read("i18n.js")
    serve_py = read("serve.py")

    route_model_pos = index_html.find('src="route-model.js')
    app_pos = index_html.find('src="app.js')
    assert route_model_pos != -1 and app_pos != -1 and route_model_pos < app_pos
    assert '"route-model.js"' in serve_py
    assert "SEUIL_ROA_MODEL" in app_js
    assert "populateRouteSelect" in app_js
    assert "tx(ROUTE_LABELS[route])" in app_js
    assert "getAvailableRoutesForSubstanceKey" in app_js
    assert "getRoutesForSubstance" in app_js
    assert "syncStartSessionRouteToSelected" in app_js
    assert "syncStartSessionRouteToSelected();" in app_js
    assert 'route !== "default"' not in app_js
    for select_id in ["route-select", "add-sub-route", "input-redose-route"]:
        select_match = re.search(rf'<select id="{select_id}"[^>]*>(.*?)</select>', index_html, re.S)
        assert select_match is not None
        assert 'value="Insufflé"' not in select_match.group(1)
        assert 'value="Intraveineux"' not in select_match.group(1)
        assert 'value="Intramusculaire"' not in select_match.group(1)
        assert 'value="Rectal"' not in select_match.group(1)
    for phrase in ["Inhalée / fumée / vaporisée", "Rectale (plug)", "Autre / non précisée"]:
        assert '"' + phrase + '":' in i18n_js


def test_start_session_route_select_is_filtered_after_substance_selection():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync("index.html", "utf8");
const dom = new JSDOM(html, { url: "https://seuil.test/", runScripts: "outside-only" });
const ctx = dom.getInternalVMContext();
ctx.console = console;
ctx.window = ctx;
ctx.globalThis = ctx;
ctx.fetch = async () => ({ ok: true, json: async () => ({ authenticated: false }) });
ctx.localStorage = dom.window.localStorage;
ctx.sessionStorage = dom.window.sessionStorage;
ctx.navigator.serviceWorker = undefined;
ctx.navigator.clipboard = { writeText: async () => {} };
ctx.crypto = { getRandomValues: (arr) => arr.fill(1), subtle: {} };
ctx.Blob = function Blob() {};
ctx.URL.createObjectURL = () => "blob:test";
ctx.URL.revokeObjectURL = () => {};

for (const file of [
  "db.js",
  "substances-data.js",
  "psychonaut-data.js",
  "index-substances.js",
  "route-model.js",
  "ui.js",
  "auth.js",
  "app.js"
]) {
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file });
}

function optionValues(selectId) {
  return Array.from(ctx.document.getElementById(selectId).options).map((option) => option.value);
}

const problems = [];
ctx.populateSubstanceSelects();
const substanceSelect = ctx.document.getElementById("substance-select");
for (const key of ["lsd", "gbl", "bdo", "salvia", "champignons"]) {
  substanceSelect.value = key;
  substanceSelect.dispatchEvent(new ctx.Event("change", { bubbles: true }));
  const values = optionValues("route-select");
  for (const route of ["Insufflé", "Rectal", "Intraveineux", "Intramusculaire"]) {
    if (values.includes(route)) problems.push(`${key}: route-select still contains ${route}: ${values.join(",")}`);
  }
}

process.stdout.write(JSON.stringify({ problems }));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    assert json.loads(result.stdout)["problems"] == []


def test_dynamic_select_placeholders_are_translated():
    app_js = read("app.js")
    i18n_js = read("i18n.js")

    assert '<option value="">Sélectionnez...</option>' not in app_js
    assert '<option value="">Sélectionnez…</option>' not in app_js
    assert "function translatedEmptyOption(label)" in app_js
    assert "escapeHtml(tx(label))" in app_js
    assert 'translatedEmptyOption("Sélectionnez...")' in app_js
    assert 'translatedEmptyOption("Sélectionnez…")' in app_js
    assert 'setRouteSelectPlaceholder(routeSelect, "Sélectionnez une substance")' in app_js
    assert json.dumps("Sélectionnez une substance", ensure_ascii=False) + ":" in i18n_js


def test_stats_empty_trend_message_is_translated():
    app_js = read("app.js")
    i18n_js = read("i18n.js")
    phrase = "Pas encore assez de sessions clôturées pour afficher cette tendance."

    assert f"tx(\"{phrase}\")" in app_js
    assert json.dumps(phrase, ensure_ascii=False) + ":" in i18n_js


def test_curve_uses_route_model_duration_estimates_for_every_roa():
    app_js = read("app.js")

    assert "getDurationsForRoute" in app_js
    assert "subInfo.durations_seconds[route] || subInfo.durations_seconds.default" not in app_js


def test_active_effect_curve_has_draggable_probe_readout():
    app_js = read("app.js")
    styles_css = read("styles.css")

    assert "effectCurveProbe" in app_js
    assert "function bindEffectCurveProbe" in app_js
    assert "container.onpointerdown" in app_js
    assert "container.onpointermove" in app_js
    assert "container.onkeydown" in app_js
    assert "effect-curve-probe" in app_js
    assert "effect-curve-readout" in app_js
    assert "const probeHasReadout = effectCurveProbe.pct !== null;" in app_js
    assert "const probeReadoutHtml = probeHasReadout" in app_js
    assert "${probeReadoutHtml}" in app_js
    assert "aria-valuetext" in app_js
    assert "Intensité estimée" in app_js
    assert ".effect-curve-stage" in styles_css
    assert ".effect-curve-readout" in styles_css
    assert "touch-action: none" in styles_css


def test_active_effect_curve_hides_probe_readout_when_drag_ends():
    app_js = read("app.js")
    stop_drag_match = re.search(r"const stopDrag = \(event\) => \{(?P<body>.*?)\n    \};", app_js, re.S)

    assert stop_drag_match
    stop_drag_body = stop_drag_match.group("body")
    assert "effectCurveProbe.active = false;" in stop_drag_body
    assert "effectCurveProbe.pct = null;" in stop_drag_body
    assert "updateTimelinePhases();" in stop_drag_body


def test_active_effect_curve_removes_meta_row_to_prioritize_curve_space():
    index_html = read("index.html")
    app_js = read("app.js")
    tracker_block = index_html[
        index_html.index('id="active-session"'):
        index_html.index("COMPAGNON DE SÉCURITÉ EN DIRECT")
    ]

    assert 'id="active-start-time"' not in tracker_block
    assert 'id="active-phase-name"' not in tracker_block
    assert 'id="active-end-time"' not in tracker_block
    assert "if (startTimeEl) startTimeEl.textContent" in app_js
    assert "if (phaseNameText) phaseNameText.textContent" in app_js
    assert "if (endTimeText) endTimeText.textContent" in app_js


def test_active_effect_curve_axis_times_match_curve_label_size():
    app_js = read("app.js")
    styles_css = read("styles.css")

    assert ".form-label { display: block; font-size: 12px;" in styles_css
    assert "const effectCurveAxisLabelFontSize = 12;" in app_js
    assert 'font-size="${effectCurveAxisLabelFontSize}"' in app_js
    assert 'font-size="9"' not in app_js


def test_dose_log_display_is_rebuilt_from_structured_route_fields():
    app_js = read("app.js")

    assert "formatDoseLogNote" in app_js
    assert "formatLogDisplayText" in app_js
    assert "body.textContent = formatLogDisplayText" in app_js
    assert "formatLogDisplayText(l, historyPrimarySub" in app_js


def test_substance_modal_displays_bioavailability_by_route():
    index_html = read("index.html")
    app_js = read("app.js")

    assert "Bio-disponibilité estimée" in index_html
    assert 'id="modal-sub-bioavailability-table"' in index_html
    assert "renderBioavailabilityRows" in app_js
    assert "getBioavailabilityForRoute" in app_js
    assert "modal-sub-bioavailability-table" in app_js


def test_substance_modal_displays_duration_rows_for_all_routes():
    app_js = read("app.js")

    assert "renderDurationRows" in app_js
    assert "formatDurationSeconds" in app_js
    assert "getDurationsForRoute(sub, route)" in app_js
    assert 'durationsTable.innerHTML = hideQuantitativeTables ? "" : renderDurationRows(sub)' in app_js


def test_substance_category_cards_hide_quantitative_tables():
    index_html = read("index.html")
    app_js = read("app.js")
    psychonaut_js = read("psychonaut-data.js")

    assert 'id="modal-sub-quantitative-grid"' in index_html
    assert 'id="modal-sub-bioavailability-section"' in index_html
    assert "omit_quantitative_tables" in psychonaut_js
    assert "opioides" in psychonaut_js
    assert "cannabis_synthese" in psychonaut_js
    assert "hideQuantitativeTables" in app_js
    assert 'quantitativeGrid.style.display = hideQuantitativeTables ? "none" : ""' in app_js
    assert 'bioavailabilitySection.style.display = hideQuantitativeTables ? "none" : ""' in app_js


def test_substance_modal_hides_removed_or_unknown_routes():
    app_js = read("app.js")
    route_model_js = read("route-model.js")

    assert 'route !== "Autre"' in app_js
    assert "renderDosageRows" in app_js
    assert "getRenderableSubstanceRouteKeys(sub).map" in app_js
    assert "explicitRoutes.filter((route) => allowedRoutes.includes(route))" in route_model_js


def test_substance_modal_generated_tables_translate_composed_labels():
    app_js = read("app.js")

    assert 'tx("Voie :")' in app_js
    assert 'tx(route)' in app_js
    assert 'tx("estimation")' in app_js
    assert 'tx("Seuil de dose")' in app_js
    assert 'tx("Début")' in app_js
    assert 'tx(formatBioavailabilityValue(valueObj))' in app_js


def test_bioavailability_special_values_translate_to_english():
    script = r"""
const fs = require("fs");
const vm = require("vm");
const ctx = {
  window: {},
  document: null,
  localStorage: { getItem: () => "en", setItem: () => {} },
  navigator: { language: "en-US" }
};
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("i18n.js", "utf8"), ctx);
const i18n = ctx.window.SeuilI18n || ctx.SeuilI18n;
i18n.setLanguage("en");
const keys = [
  "0 % (non applicable)",
  "0 % (non applicable / dangereux)",
  "0 - 100 % (voie non précisée)",
  "100 % (voie médicale uniquement)",
  "Non dosable - teneur imprévisible",
  "Non dosable",
  "non dosable",
  "Risque vital"
];
const translate = ctx.window.t || ctx.t;
const translated = Object.fromEntries(keys.map((key) => [key, translate(key)]));
process.stdout.write(JSON.stringify(translated));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    translated = json.loads(result.stdout)

    assert translated["0 % (non applicable)"] == "0 % (not applicable)"
    assert translated["0 % (non applicable / dangereux)"] == "0 % (not applicable / dangerous)"
    assert translated["0 - 100 % (voie non précisée)"] == "0 - 100 % (unspecified route)"
    assert translated["100 % (voie médicale uniquement)"] == "100 % (medical route only)"
    assert translated["Non dosable - teneur imprévisible"] == "Not quantifiable - unpredictable content"
    assert translated["Non dosable"] == "Not quantifiable"
    assert translated["non dosable"] == "not quantifiable"
    assert translated["Risque vital"] == "Life-threatening risk"


def test_public_runtime_files_do_not_use_long_dashes_in_visible_copy():
    public_files = [
        "app.js",
        "auth.js",
        "boot.js",
        "db.js",
        "i18n.js",
        "i18n-detail.js",
        "index.html",
        "index-substances.js",
        "route-model.js",
        "serve.py",
        "styles.css",
        "psychonaut-data.js",
        "substances-data.js",
        "substances-detail.js",
        "ui.js",
        "ai.js",
        "accessibilite.html",
        "conditions-utilisation.html",
        "confidentialite.html",
        "mentions-legales.html",
        "manifest.webmanifest",
        "sw.js",
        "_headers",
        ".htaccess",
        "robots.txt",
    ]

    for filename in public_files:
        source = read(filename)
        assert "—" not in source
        assert "–" not in source


def test_i18n_covers_recent_english_polish_strings():
    i18n_js = read("i18n.js")
    ai_js = read("ai.js")
    app_js = read("app.js")
    auth_js = read("auth.js")

    for phrase in [
        '"Vos sessions, vos repères, vos données - sous votre seul contrôle.": "Your sessions, your reference points, your data - under your sole control."',
        '"Assistant IA": "AI assistant"',
        '"Décrire une situation, un mélange ou un doute sans données directement identifiantes.": "Describe a situation, a combination, or a concern without directly identifying data."',
        '"Demander à l’assistant": "Ask the assistant"',
        '"Avant de démarrer": "Before starting"',
        '"Analyser la session": "Analyze session"',
        '"Lire les courbes": "Read curves"',
        '"Lire le mélange": "Read combination"',
        '"Lire les tendances": "Read trends"',
        '"Débrief dernière session": "Debrief last session"',
        '"Résultat IA": "AI result"',
        '"Pas encore assez de sessions clôturées à analyser.": "Not enough closed sessions to analyze yet."',
        '"Alcool": "Alcohol"',
        '"Champignons (psilocybine)": "Mushrooms (psilocybin)"',
        '"Protoxyde d’azote": "Nitrous oxide"',
        '"Poppers (nitrites d’alkyle)": "Poppers (alkyl nitrites)"',
    ]:
        assert phrase in i18n_js
    assert "window.applySeuilI18n = applyI18nToAppSurfaces;" in app_js
    assert "window.applySeuilI18n();" in auth_js
    assert "function aiText(key, vars)" in ai_js
