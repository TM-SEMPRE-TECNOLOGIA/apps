# 🚀 Como Iniciar AutoRelatorio v3.2

**Versão:** 3.2  
**Última Atualização:** 3 de Maio de 2026  
**Status:** ✅ Pronto para iniciar

---

## 📋 Pré-Requisitos

Verificar que você tem:
- ✅ Python 3.8+ instalado (`python --version`)
- ✅ Node.js 14+ instalado (`node --version`)
- ✅ npm funcionando (`npm --version`)
- ✅ Pasta `APP/backend` com templates
- ✅ Pasta `APP/frontend` com Next.js

---

## 🧪 Passo 1: Verificar Instalação

Abrir terminal **na pasta `APP/backend`:**

```bash
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V3.2\APP\backend
```

Testar imports:
```bash
python test_import.py
```

**Esperado:**
```
[SUCCESS] Todos os imports funcionando corretamente!
[INFO] O servidor pode ser iniciado com: uvicorn server:app --reload
```

---

## 🚀 Passo 2: Instalar Dependências (se necessário)

Backend:
```bash
pip install -r requirements.txt
```

Frontend:
```bash
cd ..\frontend
npm install
cd ..\backend
```

---

## 🎯 Passo 3: Iniciar Backend

Terminal 1 — **Backend FastAPI**

```bash
cd APP\backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Esperado:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

---

## 🎨 Passo 4: Iniciar Frontend

Terminal 2 — **Frontend Next.js**

```bash
cd APP\frontend
npm run dev
```

Esperado:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

---

## ✅ Passo 5: Testar

### 5a. Verificar Backend

Terminal 3 — Testar health endpoint:

```bash
curl http://localhost:8000/api/health
```

Esperado:
```json
{"status": "ok", "timestamp": "2026-05-03T02:20:00..."}
```

### 5b. Listar Templates

```bash
curl http://localhost:8000/api/templates
```

Esperado:
```json
[
  "MODELO - 0908 - SÃO PAULO.docx",
  "MODELO - 1507 - CUIABÁ.docx",
  ...
]
```

### 5c. Abrir Aplicação

Abrir navegador:
```
http://localhost:3000
```

Você deve ver:
- ✅ Dropdown de templates
- ✅ Formulário com campos
- ✅ Botão "GERAR RELATÓRIO"

---

## 🎬 Passo 6: Teste Prático (E2E)

1. **Selecionar template:**
   - Clicar dropdown
   - Escolher "MODELO - 3575 - TANGARA DA SERRA.docx"
   - Formulário carrega com 5 campos + 1 auto-preenchido

2. **Preencher dados:**
   - Número da OS: `1753`
   - Data do Atendimento: `2026-05-01`
   - Código da Agência: `3575`
   - Nome da Agência: `TANGARA DA SERRA`
   - Endereço: `Avenida Brasil, 1000`
   - Responsável: `123456 - João Silva`
   - Data de Elaboração: *Auto-preenchida com hoje*

3. **Gerar relatório:**
   - Clicar "GERAR RELATÓRIO"
   - Esperado: Spinner de loading
   - Esperado: Arquivo baixa automaticamente

4. **Verificar documento:**
   - Procurar o arquivo em `Downloads/`
   - Abrir no Word
   - Verificar que placeholders foram substituídos:
     * `{{nr_os}}` → `1753`
     * `{{data_elaboracao}}` → Data de hoje
     * `{{data_atendimento}}` → `2026-05-01`
     * etc.

---

## 🛑 Parar Servidores

Para parar os servidores:

**Backend:** Pressionar `Ctrl+C` no Terminal 1
**Frontend:** Pressionar `Ctrl+C` no Terminal 2

---

## 🔍 Troubleshooting

### Erro: "Port 8000 already in use"

```bash
# Mudar porta
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Erro: "ModuleNotFoundError: No module named 'uvicorn'"

```bash
pip install uvicorn
```

### Erro: "Cannot find templates"

Verificar estrutura:
```bash
ls APP\backend\templates\
# Deve listar 9 arquivos .docx
```

### Frontend não conecta ao backend

Verificar `.env.local`:
```bash
cat APP\frontend\.env.local
# Deve ter: NEXT_PUBLIC_API_URL=http://localhost:8000
```

Se não existir, criar:
```bash
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > APP\frontend\.env.local
```

### Arquivo gerado não abre no Word

Verificar logs no terminal do backend. Procurar por erros como:
- `[ERRO] Falha ao inserir...`
- `ImportError`
- `FileNotFoundError`

---

## 📊 Verificar Status

Estrutura esperada:

```
AutoRelatorio_V3.2/
├── APP/
│   ├── backend/
│   │   ├── server.py ..................... ✅ Executando na porta 8000
│   │   ├── word_utils.py ................ ✅ Importado
│   │   ├── routes.py .................... ✅ Endpoints disponíveis
│   │   ├── templates/ ................... ✅ 9 .docx files
│   │   ├── outputs/ ..................... (será criada automaticamente)
│   │   └── test_import.py ............... ✅ Passou
│   │
│   └── frontend/
│       ├── app/page.tsx ................. ✅ Renderizando
│       ├── components/FormularioDinamico.tsx ... ✅ Carregado
│       └── .env.local ................... ✅ NEXT_PUBLIC_API_URL definida
```

---

## 🎯 Checklist de Sucesso

- [ ] Backend iniciou sem erros
- [ ] Frontend iniciou sem erros
- [ ] API health endpoint respondendo
- [ ] Templates listados via API
- [ ] Formulário aparece no navegador
- [ ] Dados preenchidos e formulário submete
- [ ] Arquivo baixa automaticamente
- [ ] Arquivo abre no Word
- [ ] Placeholders foram substituídos
- [ ] Documento pronto para usar

---

## 📞 Próximas Ações

Após confirmar que tudo está funcionando:

1. **Testar com dados reais** de seus relatórios
2. **Integrar em produção** conforme CHECKLIST_PRODUCAO.md
3. **Configurar logging** para monitorar
4. **Backup dos templates** importantes
5. **Documentar processos** para sua equipe

---

**Você está pronto! Bom trabalho! 🎉**

Qualquer dúvida, consulte:
- `README.md` — Documentação completa
- `CHECKLIST_PRODUCAO.md` — Para deployment
- `CORRECAO_COMPATIBILIDADE.md` — Detalhes técnicos
