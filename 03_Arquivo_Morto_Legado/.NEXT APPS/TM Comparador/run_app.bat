@echo off
setlocal

REM ═══════════════════════════════════════════════════════════════
REM   TM Comparador – Launcher (Backend + Frontend)
REM   Starts FastAPI backend and Next.js frontend simultaneously.
REM ═══════════════════════════════════════════════════════════════

cd /d %~dp0

REM ── Python virtual environment ──────────────────────────────────
if not exist .venv (
  echo [setup] Criando ambiente virtual Python...
  python -m venv .venv
)

echo [setup] Instalando dependencias Python...
.venv\Scripts\python -m pip install --upgrade pip >nul 2>&1
.venv\Scripts\python -m pip install -r requirements.txt >nul 2>&1

REM ── Node.js dependencies ────────────────────────────────────────
if not exist frontend\node_modules (
  echo [setup] Instalando dependencias do frontend...
  cd frontend
  call npm install
  cd ..
)

REM ── Start backend ───────────────────────────────────────────────
echo.
echo [run] Iniciando backend (FastAPI porta 5000)...
start "TM Comparador - Backend" /min .venv\Scripts\python server.py

REM ── Start frontend ──────────────────────────────────────────────
echo [run] Iniciando frontend (Next.js porta 3000)...
cd frontend
start "TM Comparador - Frontend" cmd /c "npm run dev"
cd ..

REM ── Wait a moment and open browser ─────────────────────────────
timeout /t 4 /nobreak >nul
echo [run] Abrindo navegador...
start http://localhost:3000

echo.
echo ═══════════════════════════════════════════════════════════════
echo   TM Comparador esta rodando!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo   Feche esta janela para encerrar.
echo ═══════════════════════════════════════════════════════════════
echo.
pause

endlocal
