@echo off
setlocal enabledelayedexpansion

cd /d %~dp0

echo ================================================
echo TM - Gerador de Relatorio Fotográfico (Tkinter)
echo ================================================
echo.

REM 1) cria venv
if not exist .venv (
  echo [1/3] Criando ambiente virtual...
  py -m venv .venv
  if errorlevel 1 (
    echo.
    echo ERRO: falha ao criar o ambiente virtual.
    echo Verifique se o Python está instalado e disponível como 'py'.
    pause
    exit /b 1
  )
) else (
  echo [1/3] Ambiente virtual já existe.
)

REM 2) instala deps
echo.
echo [2/3] Instalando dependências...
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul
python -m pip install -r requirements.txt
if errorlevel 1 (
  echo.
  echo ERRO: falha ao instalar dependências.
  pause
  exit /b 1
)

REM 3) executa
echo.
echo [3/3] Abrindo aplicativo...
python app.py

echo.
echo Finalizado.
pause
