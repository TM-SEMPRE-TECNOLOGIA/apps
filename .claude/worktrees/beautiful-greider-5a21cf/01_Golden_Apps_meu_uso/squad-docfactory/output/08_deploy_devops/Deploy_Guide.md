# Guia de Implantação (Deployment) — Auto Relatório

Atualmente o sistema não roda na nuvem. Ele é um monólito fracionado (Local System). 

## 1. Instalação Local (Developer/Técnico Base)
Para um novato que acabou de clonar o `AutoRelatorioV1_Dev` na máquina:

### 1. Requisitos:
- Instalar Node.js LTS (Para o NPM Next.js)
- Instalar Python 3.10+ (Marcar checkbox `Add to PATH` durante instalação)

### 2. Ambiente Backend Virtual (Python)
Abra a pasta raiz e instale as libs Core:
```powershell
// Criar Ambiente
python -m venv venv
// Ativar
.\venv\Scripts\Activate.ps1
// Instalar Módulos
pip install fastapi uvicorn python-docx pillow rich
```

### 3. Ambiente Frontend (React)
Entre na pasta `APP/frontend/`
```powershell
cd APP/frontend
npm install
```

## 2. Inicialização Master (Rodando a Ferramenta)
Volte para a pasta Raiz do Repositório Windows Explorer.
1. Crie um atalho do Windows na Área de Trabalho ou execute via PowerShell:
```powershell
python run.py
```
2. Um banner Azul/Laranja da TM Sempre Tecnologia vai ser impresso.
3. Se o porto `:3000` estiver engasgado do dia anterior, ele usará Taskkill nativo.
4. O browser abrirá Sozinho e a página carregará via Next.js Dev Server.

## 3. RoadMap de Vercel/SaaS (V3)
Para caso esse app saia do PC do técnico da rua, a arquitetura SaaS (Deploy via Vercel) seria:
- Deploy Frontend (Vercel) usando "Next.js Build" padrão HMR com Supabase na Edge Network.
- O endpoint Backend precisaria ser portado pra Server Actions NextJS, usando Buffer RAM na Edge *A não ser que processamento requeira CloudRun AWS por causa de limits do servidor serverless.*
