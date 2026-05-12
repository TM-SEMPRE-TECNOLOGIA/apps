@echo off
title NX Relatorios SP UP - Cloud Engine
echo ======================================================
echo    INICIANDO NX RELATORIOS SP UP (CLOUD EDITION)
echo ======================================================
echo.
echo [1/2] Entrando na pasta do frontend...
cd /d "%~dp0APP\frontend"

echo [2/2] Iniciando Ambiente Cloud (Next.js + Python)...
echo.
npx vercel dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Nao foi possivel iniciar o npx vercel dev.
    echo Verifique se o Node.js esta instalado e se voce ja rodou:
    echo npm install -g vercel
    pause
)
