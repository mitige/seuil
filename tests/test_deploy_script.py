import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "deploy_seuil_debian.sh"


def test_deploy_uses_venv_python_for_pip():
    script = SCRIPT.read_text(encoding="utf-8")

    assert '"$APP_DIR/.venv/bin/python" -m pip install' in script
    assert '"$APP_DIR/.venv/bin/pip" install' not in script


def test_deploy_rebuilds_moved_virtualenv():
    script = SCRIPT.read_text(encoding="utf-8")

    assert "VENV_RECREATE=0" in script
    assert 'rm -rf "$APP_DIR/.venv"' in script
    assert "Environnement Python déplacé ou incomplet" in script


def test_deploy_exports_public_origins_to_systemd_service():
    script = SCRIPT.read_text(encoding="utf-8")

    assert "Environment=SEUIL_PUBLIC_ORIGINS=https://$DOMAIN,https://www.$DOMAIN" in script


def test_cloudflared_tunnel_list_parser_accepts_null_json():
    script = SCRIPT.read_text(encoding="utf-8")
    parsers = re.findall(r"python3 -c '([^']+)'\s+\"\$TUNNEL_NAME\"", script)

    assert len(parsers) == 2
    for parser in parsers:
        result = subprocess.run(
            ["python3", "-c", parser, "seuil"],
            input="null",
            text=True,
            capture_output=True,
            check=False,
        )

        assert result.returncode == 0
        assert result.stdout == "\n"
