@echo off
SETLOCAL EnableDelayedExpansion
TITLE TM Pastas - Startup Control
CLS

echo ============================================================
echo           SISTEMA: TM PASTAS
echo           EMPRESA: SEMPRE TECNOLOGIA
echo           DESENVOLVEDOR: THIAGO NASCIMENTO BARBOSA
echo ============================================================
echo.

echo [0/3] Limpando processos e arquivos de trava...

:: 1. Limpar portas ocupadas
set PORTAS=5000 3000 3001 3002
for %%P in (%PORTAS%) do (
    for /f "tokens=5" %%A in ('netstat -aon ^| findstr :%%P ^| findstr LISTENING') do (
        echo Terminando processo %%A na porta %%P...
        taskkill /F /PID %%A >nul 2>&1
    )
)

:: 2. Limpar a pasta de cache (.next) para evitar erro de 'Acesso Negado' em diferentes computadores
if exist "%~dp0tm-pastas-next\.next" (
    echo Limpando cache do Next.js...
    rmdir /s /q "%~dp0tm-pastas-next\.next" >nul 2>&1
)

:: Pequena pausa para garantir que o Windows liberou os recursos
timeout /t 2 /nobreak >nul

echo.
echo [1/3] Iniciando Backend FastAPI...
start "TM Pastas - Backend" cmd /k "cd /d %~dp0backend && python api.py"

echo [2/3] Iniciando Frontend Next.js...
start "TM Pastas - Frontend" cmd /k "cd /d %~dp0tm-pastas-next && npm run dev"

echo.
echo [3/3] Abrindo o navegador...
:: Aguarda o Next.js subir um pouco antes de abrir o link
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo ============================================================
echo           SISTEMA EM PROCESSO DE CARREGAMENTO!
echo           Aguarde o navegador abrir a pagina.
echo ============================================================
echo.
pause
