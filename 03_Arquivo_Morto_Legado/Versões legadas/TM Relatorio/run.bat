@echo off
title TM Relatorio - Sistema Unificado
color 0b

echo ======================================================
echo    TM - SEMPRE TECNOLOGIA - GERADOR DE RELATORIO
echo ======================================================
echo.

echo [1/3] Iniciando Backend FastAPI (Porta 5000)...
start /min "TM Backend" python server.py

echo [2/3] Aguardando inicializacao do backend...
timeout /t 3 /nobreak > nul

echo [3/3] Iniciando Frontend Next.js...
cd nextjs-frontend
start "TM Frontend" npm run dev

echo.
echo ======================================================
echo    TUDO PRONTO! 
echo    Acesso o navegador em: http://localhost:3000
echo    Para fechar, encerre as janelas de comando abertas.
echo ======================================================
pause
