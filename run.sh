#!/usr/bin/env bash
# ==========================================================
#            JOURNAL RDR - Réduction des Risques
#   Lanceur local pour Linux / macOS (équivalent de run.bat)
#   Outil 100% local et confidentiel : vos données restent
#   sur cette machine.
# ==========================================================
set -u

# Se placer dans le dossier du script (serve.py et index.html y vivent)
cd "$(dirname "$0")" || exit 1

echo "=========================================================="
echo "           JOURNAL RDR - Réduction des Risques"
echo "=========================================================="
echo
echo "Outil 100% local et confidentiel."
echo "Vos données restent sur cette machine."
echo

# - Détection de Python (python3 / python) -
PY=""
if command -v python3 >/dev/null 2>&1; then
    PY="python3"
elif command -v python >/dev/null 2>&1; then
    PY="python"
fi
if [ -z "$PY" ]; then
    echo "[ERREUR] Python est introuvable."
    echo "Installez Python 3 (https://www.python.org/downloads/ ou votre"
    echo "gestionnaire de paquets), puis relancez ce script."
    exit 1
fi

if ! "$PY" -c "import flask, waitress" >/dev/null 2>&1; then
    echo "[INFO] Installation des dépendances Flask/Waitress..."
    "$PY" -m pip install -r requirements.txt || exit 1
fi

PORT="${1:-12345}"
URL="http://127.0.0.1:${PORT}"

# - Le serveur tourne-t-il déjà sur ce port ? (test via Python, sans dépendance) -
if "$PY" -c "import socket,sys; s=socket.socket(); s.settimeout(0.3); sys.exit(0 if s.connect_ex(('127.0.0.1',${PORT}))==0 else 1)" 2>/dev/null; then
    echo "[INFO] Serveur local déjà actif sur ${URL}."
else
    echo "[INFO] Démarrage du serveur local sur ${URL} ..."
    nohup "$PY" serve.py "$PORT" >/tmp/journal-rdr-serve.log 2>&1 &
    sleep 1   # laisser le serveur s'initialiser
fi

# - Ouverture du navigateur (mode application si possible) -
echo "[INFO] Ouverture de l'application..."
opened=0

if [ "$(uname -s)" = "Darwin" ]; then
    # macOS : un navigateur Chromium-like en mode application, sinon défaut
    for app in "Google Chrome" "Chromium" "Brave Browser" "Microsoft Edge"; do
        if open -na "$app" --args --app="$URL" >/dev/null 2>&1; then opened=1; break; fi
    done
    if [ "$opened" -eq 0 ]; then open "$URL" >/dev/null 2>&1 && opened=1; fi
else
    # Linux : un navigateur Chromium-like en mode application
    for b in google-chrome google-chrome-stable chromium chromium-browser brave brave-browser microsoft-edge microsoft-edge-stable; do
        if command -v "$b" >/dev/null 2>&1; then
            "$b" --app="$URL" >/dev/null 2>&1 &
            opened=1
            break
        fi
    done
    # Sinon, navigateur par défaut
    if [ "$opened" -eq 0 ] && command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$URL" >/dev/null 2>&1 &
        opened=1
    fi
fi

echo
if [ "$opened" -eq 1 ]; then
    echo "[OK] Application ouverte : ${URL}"
else
    echo "[OK] Serveur prêt. Ouvrez votre navigateur sur : ${URL}"
fi
echo "Le serveur reste actif en arrière-plan (journal : /tmp/journal-rdr-serve.log)."
echo "Pour l'arrêter : pkill -f 'serve.py ${PORT}'"
echo
