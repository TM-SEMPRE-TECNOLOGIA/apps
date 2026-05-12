@echo off
setlocal
REM ==============================
REM TM Extrator - Inicializador
REM ==============================

title TM Extrator - Dev Server

REM Garante que rode na pasta correta
cd /d "%~dp0"

echo [TM] Iniciando servidor de desenvolvimento...
echo.

REM Entra na pasta do app
cd app

REM Verifica se node_modules existe, se não, instala (Opcional, mas seguro)
if not exist node_modules (
    echo [TM] node_modules no encontrado. Instalando dependncias...
    call npm install
)

REM Executa o Vite
call npm run dev

REM Mantém a janela aberta se houver erro
if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao iniciar o aplicativo.
    pause
)
