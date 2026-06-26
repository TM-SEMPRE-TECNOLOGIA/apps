@echo off
setlocal enabledelayedexpansion

:: ═══════════════════════════════════════════════════════════════
:: TM SEMPRE TECNOLOGIA — AUTO-RELATÓRIO V4.1
:: Launcher Automatizado (Double-Click & Go)
:: ═══════════════════════════════════════════════════════════════

title AutoRelatorio V4.1 — Launcher

echo.
echo  [TM] Iniciando ecossistema AutoRelatorio V4.1...
echo  --------------------------------------------------

:: 1. Limpeza de Ambiente
echo  [*] Verificando portas 5000 (Backend) e 3000 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
echo  [OK] Ambiente limpo.

:: 2. Iniciar o Launcher Python (que gerencia os logs e health-check)
echo  [*] Iniciando Motor de Processamento (Python)...
if exist run.py (
    start "AutoRelatorio V4.1 - Motor" python run.py
) else (
    echo  [ERRO] Arquivo run.py nao encontrado na raiz!
    pause
    exit /b
)

echo.
echo  [SUCESSO] Launcher iniciado em nova janela.
echo  O Frontend estara disponivel em: http://localhost:3000
echo  --------------------------------------------------
echo  Pressione qualquer tecla para encerrar este script (o sistema continuara rodando).
pause > nul
