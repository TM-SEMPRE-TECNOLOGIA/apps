@echo off
chcp 65001 > nul
REM ======================================
REM  TM Extrator 2.0 - Menu Principal
REM ======================================
cd /d "%~dp0"

:menu
cls
echo =========================================
echo   TM EXTRATOR 2.0
echo =========================================
echo.
echo   [1] Abrir Extrator Web (Vite)
echo   [2] Abrir Extrator Rapido (Python)
echo   [0] Sair
echo.
set /p opcao="Escolha uma opcao: "

if "%opcao%"=="1" goto vite
if "%opcao%"=="2" goto python
if "%opcao%"=="0" goto fim
goto menu

:vite
cd /d "%~dp0APP"
start cmd /k "npm run dev"
goto menu

:python
cd /d "%~dp0APP"
python extrair_itens_docx.py
if errorlevel 1 pause
goto menu

:fim
exit
