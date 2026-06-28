@echo off
setlocal
cd /d "%~dp0"

set "PORT=12345"
if not "%~1"=="" set "PORT=%~1"
set "TARGET=http://127.0.0.1:%PORT%"

set "PY="
where python >nul 2>&1 && set "PY=python"
if not defined PY where py >nul 2>&1 && set "PY=py"
if not defined PY where python3 >nul 2>&1 && set "PY=python3"
if not defined PY (
    echo [ERREUR] Python 3 est introuvable.
    exit /b 1
)

%PY% -c "import flask, waitress" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installation des dependances Flask/Waitress...
    %PY% -m pip install -r requirements.txt
    if errorlevel 1 exit /b 1
)

where tailscale >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Tailscale CLI est introuvable. Installez Tailscale puis relancez ce script.
    exit /b 1
)

tailscale status >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Tailscale n'est pas connecte. Lancez d'abord Tailscale puis connectez cette machine au tailnet.
    exit /b 1
)

%PY% -c "import socket,sys; s=socket.socket(); s.settimeout(0.3); sys.exit(0 if s.connect_ex(('127.0.0.1', int('%PORT%')))==0 else 1)" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Demarrage Flask + Waitress sur %TARGET%...
    start "Seuil RDR Waitress" /min %PY% serve.py %PORT%
) else (
    echo [INFO] Serveur local deja actif sur %TARGET%.
)

echo [INFO] Publication HTTPS publique avec Tailscale Funnel...
tailscale funnel --bg --https=443 %TARGET%
if errorlevel 1 exit /b 1

echo.
echo [OK] Site public active. URL et etat:
tailscale funnel status
echo.
echo Serveur local: %TARGET%
echo Arreter la publication publique: tailscale funnel --https=443 %TARGET% off
endlocal
