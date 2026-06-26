@echo off
cd /d "C:\Users\thiag\Desktop\TM-MEUS-APPS"
echo Iniciando git add das pastas 01 e 03...
del ".git\index.lock" 2>nul
timeout /t 2 /nobreak
git add 01_Golden_Apps_meu_uso 03_Arquivo_Morto_Legado
echo.
echo Status apos add:
git status --short
pause
