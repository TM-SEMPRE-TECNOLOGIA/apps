@echo off
setlocal

REM ===================================================================
REM   TM Ordens Launcher - Starts Backend & Frontend
REM ===================================================================

cd /d %~dp0

REM --- Setup Python Virtual Env ---
if not exist .venv (
  echo [setup] Criando ambiente virtual Python...
  python -m venv .venv
)

echo [setup] Instalando dependencias Python...
.venv\Scripts\python -m pip install --upgrade pip >nul 2>&1
.venv\Scripts\python -m pip install -r requirements.txt >nul 2>&1

REM --- Start Backend ---
echo.
echo [run] Iniciando backend...
start "TM Ordens - Backend" /min .venv\Scripts\python server.py

REM --- Setup & Start Frontend ---
if not exist frontend\node_modules (
  echo [setup] Instalando dependencias via npm...
  cd frontend
  call npm install
  cd ..
)

echo [run] Iniciando frontend...
cd frontend

REM We need to ensure we run Next.js on port 3002
REM Usually package.json dev script is "next dev"
start "TM Ordens - Frontend" cmd /c "npm run dev -- -p 3002"

cd ..
echo [run] Aguardando servidores...
timeout /t 5 /nobreak >nul

start http://localhost:3002

echo.
echo ===================================================================
echo   Acesso Local:
echo   - App: http://localhost:3002
echo   - API: http://localhost:5002/api/health
echo   Feche esta janela para encerrar.
echo ===================================================================
echo.
pause

endlocal
