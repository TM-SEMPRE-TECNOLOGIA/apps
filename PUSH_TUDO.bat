@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

cd /d "C:\Users\thiag\Desktop\TM-MEUS-APPS"

echo.
echo ========================================
echo  GIT PUSH COMPLETO - TM-MEUS-APPS
echo ========================================
echo.

REM Limpar lock
if exist ".git\index.lock" (
  echo [1/5] Removendo lock file...
  del ".git\index.lock" 2>nul
  timeout /t 2 /nobreak
)

echo [2/5] Adicionando todos os arquivos...
git add -A
if errorlevel 1 (
  echo ERRO: Falha ao adicionar arquivos
  pause
  exit /b 1
)

echo [3/5] Verificando status...
git status --short | findstr /C:"??" >nul
if errorlevel 1 (
  echo Nenhum arquivo untracked encontrado
) else (
  echo Ainda existem arquivos untracked
)

echo [4/5] Commitando alterações...
git commit -m "chore: adicionar conteúdo completo das pastas 01 e 03 + relatorios de resolucao"
if errorlevel 1 (
  echo ERRO: Falha ao fazer commit
  pause
  exit /b 1
)

echo [5/5] Fazendo push para GitHub...
git push origin test -v
if errorlevel 1 (
  echo ERRO: Falha ao fazer push
  pause
  exit /b 1
)

echo.
echo ========================================
echo  ✓ PUSH CONCLUÍDO COM SUCESSO!
echo ========================================
echo.
echo Verifique seu GitHub em:
echo https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS
echo.
pause
