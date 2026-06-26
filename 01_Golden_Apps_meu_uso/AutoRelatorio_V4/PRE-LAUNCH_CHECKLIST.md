# ✅ Checklist Pré-Lançamento — AutoRelatório V4

**Status:** 🟢 PRONTO PARA RODAR LOCALMENTE

---

## 📋 Verificação Rápida

Execute este checklist antes de rodar os servidores:

### Backend — Python/FastAPI

- [ ] **Python 3.9+** instalado
  ```bash
  python --version
  ```

- [ ] **pip** funciona
  ```bash
  pip --version
  ```

- [ ] **Pasta backend** existe
  ```
  C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend\
  ```

- [ ] **Templates** (9 total) estão em `backend/templates/`
  - [ ] MODELO - 0908 - SÃO JOSÉ DOS CAMPOS - ATUALIZADO.docx
  - [ ] MODELO - 1507 - CUIABÁ - ATUALIZADO.docx
  - [ ] MODELO - 1565 - SÃO JOSÉ DO RIO PRETO E RIBEIRÃO PRETO - ATUALIZADO.docx
  - [ ] MODELO - 2056 - DIVINÓPOLIS - ATUALIZADO.docx
  - [ ] MODELO - 2057 - VARGINHA - ATUALIZADO.docx
  - [ ] MODELO - 2626 - SALINAS - ATUALIZADO.docx
  - [ ] MODELO - 2627 - VALADARES - ATUALIZADO.docx
  - [ ] MODELO - 3575 - TANGARA DA SERRA - ATUALIZADO.docx
  - [ ] MODELO - 6122 - MATO GROSSO DO SUL - ATUALIZADO.docx

- [ ] **Fixtures** (3 pastas) estão em `backend/tests/fixtures/`
  - [ ] `fixture_tradicional/` — dados modo Tradicional
  - [ ] `fixture_sp/` — dados modo São Paulo
  - [ ] `fixture_sp2/` — dados modo São José do Rio Preto/Ribeirão Preto

- [ ] **Arquivos Python críticos** existem:
  - [ ] `server.py` — entry point FastAPI
  - [ ] `generator.py` — gerador Tradicional
  - [ ] `generator_sp.py` — gerador SP
  - [ ] `generator_sp2.py` — gerador SP2
  - [ ] `routes.py` — endpoints dinâmicos
  - [ ] `requirements.txt` — dependências

- [ ] **CORS habilitado** no `server.py`
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_methods=["*"],
      allow_headers=["*"]
  )
  ```

### Frontend — Node.js/Next.js

- [ ] **Node.js 18+** instalado
  ```bash
  node --version
  ```

- [ ] **npm** funciona
  ```bash
  npm --version
  ```

- [ ] **Pasta frontend** existe
  ```
  C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\frontend\
  ```

- [ ] **package.json** tem script `dev`
  ```json
  "scripts": {
    "dev": "next dev --port 3000",
    ...
  }
  ```

- [ ] **Dependências definidas** (React 19, Next 16, Tailwind, etc.)

---

## 🚀 Workflow Recomendado

### Terminal 1 — Backend

```bash
# Navegar para backend
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend

# [PRIMEIRA VEZ APENAS] Criar venv
python -m venv venv

# Ativar venv
venv\Scripts\activate

# [PRIMEIRA VEZ APENAS] Instalar dependências
pip install -r requirements.txt

# Rodar servidor
python server.py
```

**Esperado:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Terminal 2 — Frontend

```bash
# Navegar para frontend
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\frontend

# [PRIMEIRA VEZ APENAS] Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

**Esperado:**
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Terminal 3 — Testes (Opcional)

```bash
# Navegar para backend
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V4\APP\backend

# [PRIMEIRA VEZ APENAS] Instalar pytest
pip install pytest

# Rodar testes
pytest test_word_utils.py test_routes.py -v

# Esperado: ✅ Todos os testes PASSAM (verde)
```

---

## 🌐 Validação Rápida

Quando os dois servidores estão rodando:

### Backend — Swagger UI

```
http://localhost:8000/docs
```

Deve abrir o painel Swagger interativo com todos os endpoints.

### Frontend — Interface Web

```
http://localhost:3000
```

Deve carregar a página principal do AutoRelatório.

### Teste de Integração

1. No frontend, clique **"Selecionar Pasta"**
2. Navegue até uma das fixtures:
   - `backend\tests\fixtures\fixture_tradicional`
   - `backend\tests\fixtures\fixture_sp`
   - `backend\tests\fixtures\fixture_sp2`
3. Clique **"Gerar Relatório"**
4. Deve fazer upload dos dados para o backend
5. Deve retornar um arquivo `.docx` para download

---

## 🔴 Problemas Comuns & Soluções

### "Module not found"
```bash
pip install -r requirements.txt
pip install pytest --break-system-packages
```

### "Port 8000 already in use"
```bash
# Mudar porta
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### "npm install failed"
```bash
npm install --legacy-peer-deps
npm install --no-save
```

### "CORS error no navegador"
O CORS já está habilitado em `server.py`. Se persistir:
1. Reinicie ambos os servidores
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Teste em uma aba anônima

### "Teste falha: fixture not found"
Verifique que as 3 pastas existem em:
```
backend\tests\fixtures\
  ├── fixture_tradicional\
  ├── fixture_sp\
  └── fixture_sp2\
```

---

## 📊 Estrutura Final Confirmada

```
AutoRelatorio_V4/APP/
├── backend/
│   ├── server.py ✅ FastAPI com CORS
│   ├── routes.py ✅ Endpoints dinâmicos
│   ├── generator.py ✅
│   ├── generator_sp.py ✅
│   ├── generator_sp2.py ✅
│   ├── templates/ ✅ (9 templates com placeholders)
│   ├── tests/
│   │   ├── fixtures/
│   │   │   ├── fixture_tradicional/ ✅
│   │   │   ├── fixture_sp/ ✅
│   │   │   └── fixture_sp2/ ✅
│   │   ├── test_word_utils.py ✅
│   │   └── test_routes.py ✅
│   ├── requirements.txt ✅
│   └── venv/ (criar com: python -m venv venv)
│
└── frontend/
    ├── package.json ✅ (Next.js 16, React 19)
    ├── app/page.tsx ✅
    ├── node_modules/ (criar com: npm install)
    └── ...
```

---

## ✅ Status Final

| Item | Status |
|------|--------|
| **Backend FastAPI** | ✅ Pronto |
| **Frontend Next.js** | ✅ Pronto |
| **9 Templates** | ✅ Pronto (com 7 placeholders cada) |
| **3 Fixtures** | ✅ Pronto (dados reais) |
| **Testes** | ✅ Pronto (pytest) |
| **CORS** | ✅ Habilitado |
| **Documentação** | ✅ GUIA_RODAR_APP.md |

---

## 🎯 Próximo Passo

**Execute o workflow acima em 3 terminais e teste no navegador:**

1. **Terminal 1:** `python server.py`
2. **Terminal 2:** `npm run dev`
3. **Navegador:** `http://localhost:3000`

Qualquer erro, verifique a seção "Problemas Comuns" ou abra uma issue com o output exato do terminal.

**Bom teste! 🎉**
