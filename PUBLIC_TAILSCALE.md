# Publication publique avec Tailscale Funnel

Cette configuration publie le site Seuil en HTTPS public via Tailscale Funnel, tout en gardant Waitress lié à `127.0.0.1`.

## Lancement rapide

Linux/macOS :

```bash
sudo tailscale up --timeout=2m --qr
./start_public.sh
```

Si `tailscale up` semble attendre indéfiniment, arrêter avec `Ctrl+C`, puis relancer avec le timeout ci-dessus. Le timeout par défaut de `tailscale up` peut attendre sans limite que le client passe à l'état connecté.

Windows :

```bat
start_public.bat
```

Le script démarre `serve.py` avec Waitress sur `http://127.0.0.1:12345`, puis publie ce service avec :

```bash
tailscale funnel --bg --https=443 http://127.0.0.1:12345
```

L'URL publique est affichée par :

```bash
tailscale funnel status
```

## Arrêt

```bash
tailscale funnel --https=443 http://127.0.0.1:12345 off
```

Puis arrêter le serveur local si besoin :

```bash
pkill -f "serve.py 12345"
```

## Garde-fous appliqués

- Waitress écoute seulement sur `127.0.0.1`, pas sur `0.0.0.0`.
- Seuls les fichiers publics nécessaires au site sont servis.
- Les fichiers internes (`.git`, Python, tests, docs, scripts, markdown) renvoient `404`.
- L'assistant IA reste en maintenance : aucun token et aucun lancement de CLI local.
- Les en-têtes de sécurité sont envoyés par Flask.

## Prérequis Tailscale

Funnel doit être activé dans le tailnet, MagicDNS et HTTPS doivent être disponibles, et le compte ou l'appareil doit avoir le droit d'utiliser Funnel. Tailscale Funnel n'accepte que certains ports publics, dont `443`.
