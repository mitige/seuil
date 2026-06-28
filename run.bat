@echo off
title Journal RDR - Lancement
color 0b

echo ==========================================================
echo            JOURNAL RDR - Reduction des Risques
echo ==========================================================
echo.
echo Outil 100%% local et confidentiel.
echo Vos donnees restent sur cette machine.
echo.

REM --- Detection de Python (python / py / python3) ---
set "PY="
where python  >nul 2>&1 && set "PY=python"
if not defined PY ( where py      >nul 2>&1 && set "PY=py" )
if not defined PY ( where python3 >nul 2>&1 && set "PY=python3" )
if not defined PY (
    echo [ERREUR] Python est introuvable sur ce PC.
    echo Installez-le depuis https://www.python.org/downloads/
    echo en cochant "Add Python to PATH", puis relancez ce fichier.
    echo.
    pause
    exit /b 1
)

%PY% -c "import flask, waitress" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installation des dependances Flask/Waitress...
    %PY% -m pip install -r requirements.txt
    if errorlevel 1 exit /b 1
)

set "PORT=12345"
set "URL=http://127.0.0.1:%PORT%"

REM --- Le serveur tourne-t-il deja sur ce port ? ---
netstat -ano | findstr ":%PORT%" >nul
if %errorlevel% equ 0 (
    echo [INFO] Serveur local deja actif.
    goto launch
)

echo [INFO] Demarrage du serveur local sur %URL% ...
start "Serveur Journal RDR" /b %PY% serve.py %PORT% >nul 2>&1
REM Laisser le serveur s'initialiser
ping 127.0.0.1 -n 2 >nul

:launch
echo [INFO] Ouverture de l'application...

REM Edge en mode application (fenetre epuree, sans barre d'adresse)
where msedge >nul 2>&1
if %errorlevel% equ 0 ( start "" msedge --app=%URL% & goto done )

REM Chrome en mode application
where chrome >nul 2>&1
if %errorlevel% equ 0 ( start "" chrome --app=%URL% & goto done )

REM Sinon, navigateur par defaut
start "" %URL%

:done
echo.
echo [OK] Application ouverte : %URL%
echo Gardez cette fenetre ouverte ou fermez-la, le serveur reste actif.
echo.
timeout /t 3 >nul
exit /b 0
