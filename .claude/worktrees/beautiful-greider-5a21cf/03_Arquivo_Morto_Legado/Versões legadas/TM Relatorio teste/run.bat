@echo off
title TM Relatorio Teste - Sistema Unificado
color 0b
cd /d "%~dp0"

echo ======================================================
echo    TM - SEMPRE TECNOLOGIA - GERADOR DE RELATORIO
echo    (Ambiente de Teste)
echo ======================================================
echo.

echo [1/4] Verificando dependencias do frontend...
cd APP\frontend
if not exist "node_modules" (
    echo       Instalando dependencias npm install ...
    call npm install
)
cd ..\..

echo [2/4] Iniciando Backend FastAPI (Porta 5000)...
cd APP\backend
start /min "TM Backend" cmd /c ".venv\Scripts\python.exe server.py"
cd ..\..

echo [3/4] Aguardando inicializacao do backend...
timeout /t 3 /nobreak > nul

echo [4/4] Iniciando Frontend Next.js...
cd APP\frontend
start "TM Frontend" cmd /k "set RAYON_NUM_THREADS=4 && npm run dev"
cd ..\..

echo.
echo ======================================================
echo    TUDO PRONTO! 
echo    Acesse o navegador em: http://localhost:3000
echo    O navegador abrira automaticamente.
echo    Para fechar, encerre as janelas de comando abertas.
echo ======================================================
start http://localhost:3000
pause
