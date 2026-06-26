@echo off
cd /d "C:\Users\thiag\Desktop\TM-MEUS-APPS"

echo.
echo Removendo lock file...
del ".git\index.lock" 2>nul

echo Adicionando arquivos...
git add -A

echo Commitando...
git commit -m "chore: adicionar conteudo completo das pastas 01 e 03"

echo Fazendo push...
git push origin test

echo.
echo Concluido!
echo.
pause
