# 🚀 GUIA — Rodar AutoRelatório V4 Localmente

**Status:** ✅ **PRONTO PARA RODAR**

---

## ✅ O que Já Está Pronto

- ✓ **9 templates** com 7 placeholders inseridos
- ✓ **3 fixtures** com dados reais (Tradicional, SP, SP2)
- ✓ **Backend FastAPI** estruturado e pronto
- ✓ **Frontend Next.js** pronto
- ✓ **Testes** codificados e esperando rodar

---

## 📋 Pré-requisitos

Antes de começar, verifique se tem instalado:

```bash
# Python 3.9+
python --version

# pip
pip --version

# Node.js + npm
node --version
npm --version
```

Se faltar algo, instale do site oficial:
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/

---

## 🔧 PASSO 1: Configurar Backend (Python/FastAPI)

### 1.1. Abrir terminal na pasta do backend

```bash
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend
```

### 1.2. Criar ambiente virtual Python (uma única vez)

```bash
# Windows
python -m venv venv

# Ativar
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 1.3. Instalar dependências

```bash
pip install -r requirements.txt
```

Se `requirements.txt` estiver vazio ou incompleto, instale manualmente:

```bash
pip install fastapi uvicorn python-docx pillow pydantic python-multipart pytest
```

### 1.4. Verificar que tudo está OK

```bash
python -c "import fastapi; import uvicorn; import docx; print('✅ Tudo instalado!')"
```

---

## ✅ PASSO 2: Executar Testes (Validar que Tudo Funciona)

**Recomendado rodar antes de subir o servidor!**

### 2.1. Rodar testes unitários

```bash
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend

pytest test_word_utils.py -v
```

**Esperado:** ✅ Todos os testes PASSAM (verde)

### 2.2. Rodar testes de rota

```bash
pytest test_routes.py -v
```

**Esperado:** ✅ Todos os testes PASSAM (verde)

### 2.3. Rodar tudo junto com cobertura

```bash
pytest test_word_utils.py test_routes.py -v --tb=short
```

Se tudo passar, você tem 🟢 **GREEN lights** para rodar o app.

---

## 🚀 PASSO 3: Iniciar Backend (FastAPI)

### 3.1. Subir servidor FastAPI

```bash
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend

python server.py
```

Ou use uvicorn diretamente:

```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Esperado na tela:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

**Se ver erro:** Deixa o terminal aberto e vem falar comigo.

### 3.2. Testar Backend (no navegador ou Postman)

Enquanto o servidor está rodando, abra outro terminal e teste:

```bash
# Testar health check
curl http://localhost:8000/docs

# Se funcionar, deve abrir Swagger UI no navegador
```

ou vá para: **http://localhost:8000/docs** (Swagger/OpenAPI)

---

## 🎨 PASSO 4: Iniciar Frontend (Next.js)

### 4.1. Abrir NOVO terminal na pasta frontend

```bash
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\frontend
```

### 4.2. Instalar dependências do frontend

```bash
npm install
```

### 4.3. Rodar servidor de desenvolvimento

```bash
npm run dev
```

**Esperado na tela:**
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 4.4. Abrir no navegador

Vá para: **http://localhost:3000**

---

## ✅ Checklist de Funcionamento

Quando os dois servidores estão rodando (Backend + Frontend), teste:

### Backend (Terminal 1):
- [ ] `http://localhost:8000/docs` — Swagger UI carrega
- [ ] `GET /health` — retorna 200 OK
- [ ] `POST /scan` — endpoint funciona
- [ ] `POST /generate` — gera relatório

### Frontend (Terminal 2):
- [ ] `http://localhost:3000` — página carrega
- [ ] Botão "Selecionar Pasta" funciona
- [ ] Seleciona pasta com fotos
- [ ] Clica "Gerar Relatório"
- [ ] Recebe resposta do backend
- [ ] Relatório .docx baixa

### Entre Backend e Frontend:
- [ ] CORS habilitado (requisições cross-origin funcionam)
- [ ] Sem erros de conexão
- [ ] Sem erros 404 ou 500

---

## 📊 Testar os 3 Tipos de Relatório

A aplicação suporta 3 modos:

### 1. Tradicional
```bash
# Selecione uma pasta com estrutura:
# - Pasta_Raiz/
#   ├── - Área externa/
#   │   ├── foto1.jpg
#   │   └── foto2.jpg
#   └── - Área interna/
#       └── foto3.jpg

# Use fixture: C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend\tests\fixtures\fixture_tradicional
```

### 2. SP (São Paulo)
```bash
# Use fixture: C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend\tests\fixtures\fixture_sp
```

### 3. SP2 (São José do Rio Preto)
```bash
# Use fixture: C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend\tests\fixtures\fixture_sp2
```

---

## 🔴 Troubleshooting

### Erro: "Module not found"
```bash
# Reinstale dependências
pip install --upgrade -r requirements.txt
```

### Erro: "Port 8000 already in use"
```bash
# Mude a porta
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Erro: "CORS error"
```bash
# O backend já tem CORS habilitado em server.py
# Se continuar, reinicie ambos os servidores
```

### Erro: "Template not found"
```bash
# Verifique que templates estão em:
# C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend\templates\
```

### Testes falhando
```bash
# Verifique que fixtures existem:
# C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend\tests\fixtures\

# Se tudo está lá, rode:
pytest test_word_utils.py -v --tb=long
```

---

## 📞 Estrutura de Pastas Final

```
AutoRelatorio_V4/APP/
├── backend/
│   ├── server.py                 ← ENTRY POINT (rodá python server.py)
│   ├── routes.py                 ← Endpoints FastAPI
│   ├── generator.py              ← Gerador Tradicional
│   ├── generator_sp.py           ← Gerador SP
│   ├── generator_sp2.py          ← Gerador SP2
│   ├── templates/
│   │   ├── MODELO - 0908 - ... - ATUALIZADO.docx  ✓
│   │   ├── MODELO - 1507 - ... - ATUALIZADO.docx  ✓
│   │   ├── MODELO - 1565 - ... - ATUALIZADO.docx  ✓
│   │   ├── ... (9 total)
│   ├── tests/
│   │   ├── fixtures/
│   │   │   ├── fixture_tradicional/     ✓
│   │   │   ├── fixture_sp/              ✓
│   │   │   └── fixture_sp2/             ✓
│   │   ├── test_word_utils.py
│   │   └── test_routes.py
│   ├── requirements.txt           ← pip install -r requirements.txt
│   └── venv/                      ← Ambiente virtual (criar com: python -m venv venv)
│
└── frontend/
    ├── package.json               ← npm install
    ├── next.config.js
    ├── app/
    │   ├── page.tsx              ← Página principal
    │   └── ...
    ├── public/
    └── node_modules/             ← npm install cria automaticamente
```

---

## 🎯 Workflow Final (Dia a Dia)

Quando quiser testar:

### Terminal 1 (Backend):
```bash
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend
source venv/Scripts/activate  # ou venv\Scripts\activate no Windows
python server.py
```

### Terminal 2 (Frontend):
```bash
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\frontend
npm run dev
```

### Terminal 3 (Testes — opcional):
```bash
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend
pytest test_word_utils.py test_routes.py -v --tb=short
```

---

## ✅ Pronto!

Quando tudo estiver rodando:
- Backend: http://localhost:8000/docs (Swagger)
- Frontend: http://localhost:3000

**Bom teste!** 🎉

Qualquer erro, me avisa o output exato do terminal.
