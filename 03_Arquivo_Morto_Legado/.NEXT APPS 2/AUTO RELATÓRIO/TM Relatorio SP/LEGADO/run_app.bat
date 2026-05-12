@echo off
setlocal
cd /d %~dp0

:: Configurar ambiente virtual Python e instalar dependências
if not exist .venv (
  echo Inicializando ambiente virtual Python...
  python -m venv .venv
)

call .venv\Scripts\activate
python -m pip install --upgrade pip >nul 2>&1
echo Instalando dependencias Python...
pip install -r requirements.txt >nul 2>&1

:: Iniciar Backend Python (Flask) em segundo plano (sem nova janela)
echo Iniciando servidor backend Flask na porta 5000...
start /B cmd /c "call .venv\Scripts\activate && python server.py >nul 2>&1"

:: Instalar dependências do Frontend e rodar o Vite
cd frontend
if not exist node_modules (
  echo Instalando dependencias do Frontend, isso pode levar alguns instantes...
  call npm install
)

echo ================================================================
echo SERVIDORES INICIADOS COM SUCESSO!
echo.
echo [Flask] Backend rodando em segundo plano (porta 5000).
echo [React] Frontend iniciando na porta 5173.
echo.
echo O navegador devera abrir automaticamente. Caso contrario,
echo acesse o aplicativo clicando ou copiando o link abaixo:
echo.
echo         http://localhost:5173/
echo.
echo ================================================================
echo.
echo Iniciando servidor frontend Vite...
call npm run dev -- --open

echo.
echo Pressione qualquer tecla para encerrar...
pause >nul
endlocal
