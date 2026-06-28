#!/usr/bin/env bash
# Publie Seuil avec Waitress en local et Tailscale Funnel en HTTPS public.
set -euo pipefail

cd "$(dirname "$0")"

PORT="${1:-12345}"
TARGET="http://127.0.0.1:${PORT}"
LOG_FILE="/tmp/seuil-rdr-waitress.log"

PY=""
if command -v python3 >/dev/null 2>&1; then
    PY="python3"
elif command -v python >/dev/null 2>&1; then
    PY="python"
fi

if [ -z "$PY" ]; then
    echo "[ERREUR] Python 3 est introuvable."
    exit 1
fi

if ! "$PY" -c "import flask, waitress" >/dev/null 2>&1; then
    echo "[INFO] Installation des dépendances Flask/Waitress..."
    "$PY" -m pip install -r requirements.txt
fi

if ! command -v tailscale >/dev/null 2>&1; then
    echo "[ERREUR] Tailscale CLI est introuvable. Installez Tailscale puis relancez ce script."
    exit 1
fi

if ! tailscale status >/dev/null 2>&1; then
    echo "[ERREUR] Tailscale n'est pas connecté."
    echo "Lancez d'abord: sudo tailscale up --timeout=2m --qr"
    exit 1
fi

if "$PY" -c "import socket,sys; s=socket.socket(); s.settimeout(0.3); sys.exit(0 if s.connect_ex(('127.0.0.1', int('${PORT}')))==0 else 1)" >/dev/null 2>&1; then
    echo "[INFO] Serveur local déjà actif sur ${TARGET}."
else
    echo "[INFO] Démarrage Flask + Waitress sur ${TARGET}..."
    nohup "$PY" serve.py "$PORT" >"${LOG_FILE}" 2>&1 &
    sleep 1
fi

echo "[INFO] Publication HTTPS publique avec Tailscale Funnel..."
tailscale funnel --bg --https=443 "${TARGET}"

echo
echo "[OK] Site public activé. URL et état:"
tailscale funnel status
echo
echo "Serveur local: ${TARGET}"
echo "Log Waitress: ${LOG_FILE}"
echo "Arrêter la publication publique: tailscale funnel --https=443 ${TARGET} off"
