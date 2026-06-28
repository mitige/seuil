#!/usr/bin/env bash
# ==========================================================
#        SEUIL - déploiement production sur Debian 12/13
#   Flask/Waitress (service systemd) + Cloudflare Tunnel
#                  - https://seuil.pro
#
#   - lancer SUR LE SERVEUR (ThinkCentre M70q), depuis le
#   dossier du site (recommandé : /opt/seuil) :
#
#       sudo bash deploy_seuil_debian.sh
#
#   Variante "tunnel géré depuis le dashboard Cloudflare"
#   (Zero Trust - Networks - Tunnels - Create - copier le token) :
#
#       sudo bash deploy_seuil_debian.sh --token <TOKEN>
#
#   Prérequis (une seule fois, avant le premier lancement) :
#     1. Compte Cloudflare (plan Free) avec le site seuil.pro ajouté.
#     2. Chez OVH : serveurs DNS du domaine remplacés par ceux
#        fournis par Cloudflare (Manager - seuil.pro - Serveurs DNS).
#
#   Variables surchargeables :
#     SEUIL_DOMAIN=seuil.pro   SEUIL_PORT=12345   SEUIL_TUNNEL_NAME=seuil
#
#   Le script est idempotent : relancez-le après une mise à jour
#   du code, il réinstalle/redémarre proprement.
# ==========================================================
set -euo pipefail

DOMAIN="${SEUIL_DOMAIN:-seuil.pro}"
PORT="${SEUIL_PORT:-12345}"
TUNNEL_NAME="${SEUIL_TUNNEL_NAME:-seuil}"
SERVICE_USER="node"
APP_SERVICE="seuil.service"
TOKEN="${CF_TUNNEL_TOKEN:-}"

info() { echo "[INFO] $*"; }
ok()   { echo "[OK] $*"; }
warn() { echo "[ATTENTION] $*"; }
die()  { echo "[ERREUR] $*" >&2; exit 1; }

# - Arguments -
while [ $# -gt 0 ]; do
    case "$1" in
        --token)   TOKEN="${2:?--token requiert une valeur}"; shift 2 ;;
        --token=*) TOKEN="${1#--token=}"; shift ;;
        -h|--help) sed -n '2,28p' "$0"; exit 0 ;;
        *) die "Option inconnue : $1 (voir --help)" ;;
    esac
done

[ "$(id -u)" -eq 0 ] || die "Lancez ce script avec sudo : sudo bash $0"

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"
[ -f serve.py ] || die "serve.py introuvable dans $APP_DIR - placez ce script dans le dossier du site."

case "$APP_DIR" in
    /root/*) die "Le site est sous /root : l'utilisateur de service ne pourra pas le lire. Déplacez le dossier vers /opt/seuil puis relancez." ;;
esac

echo "=========================================================="
echo "   SEUIL - déploiement : $DOMAIN  -  127.0.0.1:$PORT"
echo "   Dossier de l'application : $APP_DIR"
echo "=========================================================="

# ------------------
# 1. Paquets système
# ------------------
info "Installation des paquets système (python3, venv, curl)..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq python3 python3-venv curl ca-certificates >/dev/null
ok "Paquets système présents."

# ------------------
# 2. Utilisateur de service dédié (sans shell)
# ------------------
if ! id -u "$SERVICE_USER" >/dev/null 2>&1; then
    info "Création de l'utilisateur système '$SERVICE_USER'..."
    useradd --system --home-dir "$APP_DIR" --shell /usr/sbin/nologin "$SERVICE_USER"
fi
ok "Utilisateur de service : $SERVICE_USER"

# ------------------
# 3. Environnement Python (venv) + dépendances
# ------------------
VENV_RECREATE=0
if [ -d "$APP_DIR/.venv" ]; then
    if [ ! -x "$APP_DIR/.venv/bin/python" ]; then
        VENV_RECREATE=1
    elif ! "$APP_DIR/.venv/bin/python" -m pip --version >/dev/null 2>&1; then
        VENV_RECREATE=1
    elif [ -x "$APP_DIR/.venv/bin/pip" ] && ! "$APP_DIR/.venv/bin/pip" --version >/dev/null 2>&1; then
        VENV_RECREATE=1
    fi
fi
if [ "$VENV_RECREATE" -eq 1 ]; then
    warn "Environnement Python déplacé ou incomplet - reconstruction de $APP_DIR/.venv ..."
    rm -rf "$APP_DIR/.venv"
fi
if [ ! -x "$APP_DIR/.venv/bin/python" ]; then
    info "Création du venv dans $APP_DIR/.venv ..."
    python3 -m venv "$APP_DIR/.venv"
fi
info "Installation des dépendances (Flask, Waitress)..."
"$APP_DIR/.venv/bin/python" -m pip install -q -r requirements.txt
ok "Dépendances Python installées."

# ------------------
# 4. Données : instance/ doit appartenir à l'utilisateur de service
#    (SQLite a besoin d'écrire le .sqlite3 ET ses fichiers -wal/-shm)
# ------------------
install -d "$APP_DIR/instance"
chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR/instance"
chmod 750 "$APP_DIR/instance"
ok "Dossier de données : $APP_DIR/instance (sauvegardez instance/seuil_state.sqlite3 !)"

# L'utilisateur de service doit pouvoir lire le code et traverser les dossiers parents
if ! runuser -u "$SERVICE_USER" - test -r "$APP_DIR/serve.py"; then
    warn "L'utilisateur '$SERVICE_USER' ne peut pas lire $APP_DIR/serve.py."
    warn "Cause probable : un dossier parent est en mode 700 (ex. un /home)."
    warn "Solution recommandée : déplacez le site vers /opt/seuil :"
    warn "    sudo mv \"$APP_DIR\" /opt/seuil && sudo bash /opt/seuil/deploy_seuil_debian.sh"
    die "Accès refusé pour l'utilisateur de service."
fi

# ------------------
# 5. Service systemd de l'application
# ------------------
info "Écriture de /etc/systemd/system/$APP_SERVICE ..."
cat > "/etc/systemd/system/$APP_SERVICE" <<EOF
[Unit]
Description=Seuil - backend Flask/Waitress ($DOMAIN)
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$APP_DIR
Environment=PORT=$PORT
Environment=SEUIL_PUBLIC_ORIGINS=https://$DOMAIN,https://www.$DOMAIN
ExecStart=$APP_DIR/.venv/bin/python $APP_DIR/serve.py
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now "$APP_SERVICE"
systemctl restart "$APP_SERVICE"

info "Vérification que l'application répond en local..."
app_ok=0
for _ in 1 2 3 4 5 6 7 8 9 10; do
    if curl -fsS -m 3 "http://127.0.0.1:$PORT/" >/dev/null 2>&1; then app_ok=1; break; fi
    sleep 1
done
if [ "$app_ok" -eq 1 ]; then
    ok "Application active sur http://127.0.0.1:$PORT"
else
    systemctl --no-pager -l status "$APP_SERVICE" || true
    die "L'application ne répond pas. Consultez : journalctl -u $APP_SERVICE -e"
fi

# ------------------
# 6. Installation de cloudflared (dépôt officiel Cloudflare)
# ------------------
if ! command -v cloudflared >/dev/null 2>&1; then
    info "Installation de cloudflared..."
    mkdir -p --mode=0755 /usr/share/keyrings
    curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg \
        | tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
    echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" \
        > /etc/apt/sources.list.d/cloudflared.list
    apt-get update -qq
    apt-get install -y -qq cloudflared >/dev/null
fi
ok "cloudflared : $(cloudflared --version 2>/dev/null | head -1)"

# ------------------
# 7. Tunnel Cloudflare
# ------------------
if [ -n "$TOKEN" ]; then
    # - Mode dashboard : tunnel géré depuis Cloudflare Zero Trust -
    info "Installation du tunnel avec le token fourni (mode dashboard)..."
    if [ -f /etc/systemd/system/cloudflared.service ]; then
        warn "Le service cloudflared existe déjà - redémarrage simple."
        systemctl restart cloudflared
    else
        cloudflared service install "$TOKEN"
    fi
    echo
    warn "Mode dashboard : pensez à déclarer le 'Public Hostname' dans"
    warn "Zero Trust - Networks - Tunnels - votre tunnel - Public Hostnames :"
    warn "    $DOMAIN  -  HTTP  -  localhost:$PORT"
    warn "    www.$DOMAIN  -  HTTP  -  localhost:$PORT (optionnel)"
else
    # - Mode CLI : tunnel géré localement par ce script -
    if [ ! -f /root/.cloudflared/cert.pem ]; then
        echo
        info "Autorisation du tunnel : une URL va s'afficher."
        info "Ouvrez-la dans un navigateur (depuis n'importe quel appareil),"
        info "connectez-vous à Cloudflare et choisissez la zone $DOMAIN."
        echo
        cloudflared tunnel login
    fi

    TUNNEL_ID="$(cloudflared tunnel list --output json 2>/dev/null \
        | python3 -c 'import json,sys; ts=json.load(sys.stdin) or []; print(next((t.get("id", "") for t in ts if isinstance(t, dict) and t.get("name")==sys.argv[1]), ""))' "$TUNNEL_NAME")"

    if [ -z "$TUNNEL_ID" ]; then
        info "Création du tunnel '$TUNNEL_NAME'..."
        cloudflared tunnel create "$TUNNEL_NAME"
        TUNNEL_ID="$(cloudflared tunnel list --output json \
            | python3 -c 'import json,sys; ts=json.load(sys.stdin) or []; print(next((t.get("id", "") for t in ts if isinstance(t, dict) and t.get("name")==sys.argv[1]), ""))' "$TUNNEL_NAME")"
    fi
    [ -n "$TUNNEL_ID" ] || die "Impossible de déterminer l'identifiant du tunnel '$TUNNEL_NAME'."
    ok "Tunnel '$TUNNEL_NAME' : $TUNNEL_ID"

    # Fichier d'identifiants du tunnel - /etc/cloudflared/
    install -d -m 755 /etc/cloudflared
    if [ ! -f "/etc/cloudflared/$TUNNEL_ID.json" ]; then
        if [ -f "/root/.cloudflared/$TUNNEL_ID.json" ]; then
            install -m 600 "/root/.cloudflared/$TUNNEL_ID.json" "/etc/cloudflared/$TUNNEL_ID.json"
        else
            warn "Identifiants du tunnel introuvables (/root/.cloudflared/$TUNNEL_ID.json)."
            warn "Le tunnel a sans doute été créé sur une autre machine. Pour repartir à zéro :"
            warn "    cloudflared tunnel delete $TUNNEL_NAME   # puis relancez ce script"
            die "Fichier d'identifiants manquant."
        fi
    fi

    info "Écriture de /etc/cloudflared/config.yml ..."
    cat > /etc/cloudflared/config.yml <<EOF
tunnel: $TUNNEL_ID
credentials-file: /etc/cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: $DOMAIN
    service: http://localhost:$PORT
  - hostname: www.$DOMAIN
    service: http://localhost:$PORT
  - service: http_status:404
EOF

    # Enregistrements DNS - tunnel (CNAME vers <id>.cfargotunnel.com)
    for host in "$DOMAIN" "www.$DOMAIN"; do
        if cloudflared tunnel route dns "$TUNNEL_NAME" "$host" >/tmp/seuil-route-dns.log 2>&1; then
            ok "DNS : $host - tunnel"
        else
            if grep -qi "already" /tmp/seuil-route-dns.log; then
                ok "DNS : $host déjà routé."
            else
                warn "Échec du routage DNS pour $host :"
                sed 's/^/    /' /tmp/seuil-route-dns.log
                warn "S'il existe déjà un enregistrement A/AAAA/CNAME pour '$host'"
                warn "dans Cloudflare - DNS - Records, supprimez-le puis relancez ce script."
            fi
        fi
    done

    # Service systemd cloudflared
    if [ -f /etc/systemd/system/cloudflared.service ]; then
        systemctl restart cloudflared
    else
        cloudflared service install
        systemctl enable --now cloudflared
    fi
fi
ok "Service cloudflared actif."

# ------------------
# 8. Récapitulatif
# ------------------
echo
echo "=========================================================="
echo "                    DÉPLOIEMENT TERMINÉ"
echo "=========================================================="
echo
echo "  Site            : https://$DOMAIN  (et https://www.$DOMAIN)"
echo "  Application     : http://127.0.0.1:$PORT (Waitress, local uniquement)"
echo "  Données         : $APP_DIR/instance/seuil_state.sqlite3  - - SAUVEGARDER"
echo
echo "  Commandes utiles :"
echo "    journalctl -u $APP_SERVICE -f          # logs de l'application"
echo "    journalctl -u cloudflared -f           # logs du tunnel"
echo "    systemctl restart $APP_SERVICE         # après mise à jour du code"
echo
echo "  Aucune ouverture de port n'est nécessaire sur la box."
echo
echo "  Si le site ne répond pas encore : vérifiez que les serveurs DNS"
echo "  de $DOMAIN chez OVH pointent bien vers Cloudflare (propagation"
echo "  possible jusqu'à quelques heures), et l'état du tunnel dans"
echo "  Zero Trust - Networks - Tunnels."
echo "=========================================================="
