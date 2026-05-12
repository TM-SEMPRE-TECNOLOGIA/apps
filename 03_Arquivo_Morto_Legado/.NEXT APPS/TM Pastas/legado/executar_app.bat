@echo off
title TM Pastas - React App
color 0A

echo ==========================================
echo   TM Pastas - Gerador de Estrutura
echo   TM - Sempre Tecnologia
echo   v2.1.0 (React + FastAPI)
echo ==========================================
echo.

:: Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Baixe em https://nodejs.org/
    echo.
    pause
    exit /b
)

echo [OK] Node.js encontrado
echo.

:: Instalar dependências Python do Backend
echo [INFO] Verificando dependências Python...
pip install -r requirements.txt >nul 2>nul
echo [OK] Dependências do Backend verificadas.
echo.

:: Iniciar Backend API em segundo plano (FastAPI + Uvicorn)
echo [INFO] Iniciando Servidor Backend (FastAPI)...
start /b uvicorn backend.api:app --host 0.0.0.0 --port 5000
timeout /t 2 >nul
echo [OK] API rodando em localhost:5000 (docs: http://localhost:5000/docs).
echo.

:: Entrar na pasta do projeto React
cd /d "%~dp0tm-pastas-react"

:: Instalar dependencias do Front se necessario
if not exist "node_modules" (
    echo [INFO] Instalando dependencias do Frontend...
    npm install
    echo.
)

echo [INFO] Iniciando servidor Frontend...
echo [INFO] Acesse: http://localhost:5173
echo.

:: Abrir no navegador automaticamente
start http://localhost:5173

:: Iniciar servidor
npm run dev
