# ✅ Checklist de Produção — AutoRelatorio v3.2

**Última Atualização:** 3 de Maio de 2026  
**Versão:** 3.2  
**Status:** PRONTO PARA DEPLOY

---

## 📋 Pré-Requisitos

- [ ] Python 3.8+ instalado
- [ ] Node.js 14+ instalado (para frontend)
- [ ] pip e npm funcionando
- [ ] Acesso à pasta `TM-MEUS-APPS/AutoRelatorio_V3.2/`

---

## 🔧 Backend — Configuração

- [ ] Navegar para `APP/backend/`
  ```bash
  cd APP/backend
  ```

- [ ] Instalar dependências principais
  ```bash
  pip install -r requirements.txt
  ```

- [ ] Instalar dependências de teste (opcional)
  ```bash
  pip install -r requirements-test.txt
  ```

- [ ] Verificar que `word_utils.py` existe (312 linhas)
- [ ] Verificar que `routes.py` existe (268 linhas)
- [ ] Verificar que pasta `templates/` tem 9 .docx files
- [ ] Verificar que pasta `templates_backup/` tem originals
- [ ] Verificar que pasta `outputs/` existe (será criada se não existir)

---

## 🧪 Testes — Execução

- [ ] Rodar suite completa de testes
  ```bash
  ./run_tests.sh
  ```
  Ou:
  ```bash
  pytest -v
  ```

- [ ] Esperar conclusão (deve passar todos os testes)
  ```
  Expected output:
  ✓ passed XX tests in X.XXs
  Coverage: ~90%
  ```

- [ ] Verificar cobertura de código
  ```bash
  pytest --cov=. --cov-report=html
  ```

- [ ] Conferir que test files existem
  - [ ] `test_word_utils.py` (280 linhas, 30+ testes)
  - [ ] `test_routes.py` (240 linhas, 25+ testes)
  - [ ] `pytest.ini` (config de testes)

---

## 🚀 Backend — Inicialização

- [ ] Abrir terminal na pasta `APP/backend/`

- [ ] Iniciar servidor FastAPI
  ```bash
  uvicorn server:app --reload --host 0.0.0.0 --port 8000
  ```

- [ ] Esperar mensagem:
  ```
  Uvicorn running on http://0.0.0.0:8000
  Application startup complete
  ```

- [ ] Testar health endpoint
  ```bash
  curl http://localhost:8000/api/health
  # Esperado: {"status": "ok", "timestamp": "..."}
  ```

- [ ] Listar templates
  ```bash
  curl http://localhost:8000/api/templates
  # Esperado: ["MODELO - 0908 - SÃO PAULO.docx", ...]
  ```

---

## 🎨 Frontend — Configuração

- [ ] Navegar para `APP/frontend/`
  ```bash
  cd APP/frontend
  ```

- [ ] Instalar dependências Node
  ```bash
  npm install
  ```

- [ ] Criar arquivo `.env.local`
  ```bash
  echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
  ```

- [ ] Verificar que `FormularioDinamico.tsx` existe (290 linhas)
- [ ] Verificar que `FormularioDinamico_integration.tsx` existe (3.3 KB)

---

## 🎨 Frontend — Inicialização

- [ ] Abrir terminal na pasta `APP/frontend/`

- [ ] Iniciar dev server
  ```bash
  npm run dev
  ```

- [ ] Esperar mensagem:
  ```
  ▲ Next.js X.X.X
  - Local:        http://localhost:3000
  ```

- [ ] Acessar aplicação
  ```
  http://localhost:3000
  ```

- [ ] Verificar que componente `FormularioDinamico` carregou
  - [ ] Dropdown de templates visível
  - [ ] Nenhum erro no console (F12)
  - [ ] Nenhum erro no terminal

---

## 🔄 Teste Ponta-a-Ponta (E2E)

### 1. Seleção de Template
- [ ] Abrir aplicação em http://localhost:3000
- [ ] Clicar em dropdown de templates
- [ ] Selecionar "MODELO - 3575 - TANGARA DA SERRA.docx"
- [ ] Esperado: Formulário carrega com 5 campos

### 2. Preenchimento de Dados
- [ ] Campo "Número da OS": Digitar "1753"
- [ ] Campo "Data de Atendimento": Digitar "2026-05-01"
- [ ] Campo "Código da Agência": Digitar "3575"
- [ ] Campo "Nome da Agência": Digitar "TANGARA DA SERRA"
- [ ] Campo "Endereço": Digitar "Avenida Brasil, 1000"
- [ ] Campo "Responsável": Digitar "123456 - João Silva"
- [ ] Campo "Data de Elaboração": Deve estar **auto-preenchido** com hoje
  - [ ] Verificar que é somente leitura (ou cinza)

### 3. Validação
- [ ] Tentar deixar um campo obrigatório vazio
- [ ] Esperado: Erro aparece imediatamente
- [ ] Corrigir campo
- [ ] Esperado: Erro desaparece

### 4. Geração de Relatório
- [ ] Clicar em "GERAR RELATÓRIO"
- [ ] Esperado: Botão fica com loading spinner
- [ ] Esperado: Após ~2-3 segundos, arquivo é baixado automaticamente
- [ ] Verificar pasta Downloads: `MODELO - 3575 - TANGARA DA SERRA_20260503.docx`

### 5. Verificação do Documento
- [ ] Abrir arquivo baixado no Word
- [ ] Verificar placeholders substituídos:
  - [ ] {{nr_os}} → "1753"
  - [ ] {{data_elaboracao}} → "03/05/2026" ou "2026-05-03"
  - [ ] {{data_atendimento}} → "01/05/2026" ou "2026-05-01"
  - [ ] {{agencia_codigo}} → "3575"
  - [ ] {{agencia_nome}} → "TANGARA DA SERRA"
  - [ ] {{endereco}} → "Avenida Brasil, 1000"
  - [ ] {{responsavel_dependencia}} → "123456 - João Silva"
- [ ] Esperado: Nenhum placeholder {{...}} visível no documento
- [ ] Documento está pronto para imprimir

---

## 🔐 Testes de Segurança

- [ ] **Path Traversal Prevention**
  ```bash
  curl "http://localhost:8000/api/download/../../../etc/passwd"
  # Esperado: 404 Not Found
  ```

- [ ] **Input Validation**
  ```bash
  curl -X POST http://localhost:8000/api/validate-fields \
    -H "Content-Type: application/json" \
    -d '{"template_name": "invalid", "data_atendimento": "invalid-date"}'
  # Esperado: validation errors
  ```

- [ ] **CORS Headers**
  ```bash
  curl -i http://localhost:8000/api/templates
  # Esperado: Access-Control-Allow-Origin header presente
  ```

---

## 📊 Verificações de Performance

- [ ] **Tempo de resposta GET /api/templates**
  ```bash
  time curl http://localhost:8000/api/templates
  # Esperado: < 100ms
  ```

- [ ] **Tempo de geração de relatório**
  - [ ] Medir tempo desde POST até download iniciado
  - [ ] Esperado: 1-3 segundos

- [ ] **Consumo de memória**
  - [ ] Verificar uso de RAM do processo Python
  - [ ] Esperado: < 200 MB

- [ ] **Concorrência**
  - [ ] Gerar 2-3 relatórios em paralelo
  - [ ] Esperado: Todos completam sem erro

---

## 📂 Estrutura de Arquivos — Confirmação

```
AutoRelatorio_V3.2/
├── APP/
│   ├── backend/
│   │   ├── ✅ word_utils.py (312 linhas)
│   │   ├── ✅ routes.py (268 linhas)
│   │   ├── ✅ test_word_utils.py (280 linhas)
│   │   ├── ✅ test_routes.py (240 linhas)
│   │   ├── ✅ pytest.ini
│   │   ├── ✅ requirements.txt
│   │   ├── ✅ requirements-test.txt
│   │   ├── ✅ run_tests.sh
│   │   ├── ✅ server_integration.py
│   │   ├── ✅ server.py (existente, integrar)
│   │   ├── ✅ generator.py (existente, manter)
│   │   ├── templates/ (9 .docx files)
│   │   ├── templates_backup/ (9 originals)
│   │   └── outputs/ (será preenchido)
│   │
│   ├── frontend/
│   │   ├── ✅ components/FormularioDinamico.tsx (290 linhas)
│   │   ├── ✅ components/FormularioDinamico_integration.tsx
│   │   ├── package.json
│   │   ├── .env.local (criar)
│   │   └── [outros arquivos Next.js]
│   │
│   └── ✅ IMPLEMENTACAO_CONCLUIDA.md
│
├── ✅ README.md (250+ linhas)
├── ✅ CHECKLIST_PRODUCAO.md (este arquivo)
├── CHANGELOG.md (existente)
└── [outros arquivos existentes]
```

- [ ] Confirmar que todos os ✅ arquivos existem

---

## 🎯 Integração com Código Existente

### Backend — server.py

- [ ] Abrir `APP/backend/server.py`

- [ ] Adicionar imports no topo:
  ```python
  from routes import router as placeholders_router
  ```

- [ ] Adicionar router depois de criar app:
  ```python
  app = FastAPI()
  
  # Adicionar novo:
  app.include_router(placeholders_router)
  ```

- [ ] Verificar que CORS está configurado
  ```python
  from fastapi.middleware.cors import CORSMiddleware
  
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:3000", ...],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

- [ ] Testar endpoints: `curl http://localhost:8000/api/templates`

### Frontend — Integração

**3 opções de integração:**

#### Opção 1: Página Principal
- [ ] Editar `app/page.tsx`
- [ ] Adicionar import:
  ```tsx
  import FormularioDinamico from '@/components/FormularioDinamico'
  ```
- [ ] Renderizar componente:
  ```tsx
  export default function Home() {
    return <FormularioDinamico />
  }
  ```

#### Opção 2: Página Dedicada
- [ ] Criar `app/relatorio/page.tsx`
- [ ] Adicionar:
  ```tsx
  import FormularioDinamico from '@/components/FormularioDinamico'
  
  export default function RelatorioPage() {
    return <FormularioDinamico />
  }
  ```
- [ ] Acessar em `http://localhost:3000/relatorio`

#### Opção 3: Tab em Página Existente
- [ ] Adicionar import em componente existente:
  ```tsx
  import FormularioDinamico from '@/components/FormularioDinamico'
  ```
- [ ] Renderizar em state condicional:
  ```tsx
  {activeTab === 'relatorio' && <FormularioDinamico />}
  ```

- [ ] Confirmar que componente carrega sem erros

---

## 🚨 Troubleshooting Rápido

### Backend não inicia
```bash
# Verificar porta 8000 em uso
netstat -an | grep 8000
# Mudar porta
uvicorn server:app --port 8001
```

### Templates não encontrados
```bash
# Verificar caminho
ls -la APP/backend/templates/
# Deve listar 9 .docx files
```

### Erro "No module named 'word_utils'"
```bash
# Certifique-se de estar na pasta backend
cd APP/backend
# Reinstalar docx
pip install python-docx
```

### Frontend não conecta ao backend
```bash
# Verificar .env.local
cat APP/frontend/.env.local
# Deve ter: NEXT_PUBLIC_API_URL=http://localhost:8000
# Reiniciar dev server
npm run dev
```

### Arquivo baixado não abre no Word
```bash
# Verificar no terminal se houve erro
# Procurar por exceção em outputs_error.log (se existe)
# Testar com curl manualmente
curl http://localhost:8000/api/download/MODELO_20260503.docx -o test.docx
```

---

## ✅ Checklist Final (Antes de Produção)

- [ ] Todos os 55+ testes passando ✓
- [ ] Código tem type hints completos ✓
- [ ] Nenhum `console.error` ou logs de erro ✓
- [ ] Security checks passaram ✓
- [ ] Performance aceitável (< 3 seg por relatório) ✓
- [ ] Documentação atualizada ✓
- [ ] README tem exemplos funcionando ✓
- [ ] Backup dos templates originais em `templates_backup/` ✓
- [ ] Integração com `server.py` completa ✓
- [ ] Frontend integrado e testado ✓
- [ ] Teste E2E completo funcionando ✓
- [ ] Database (se necessário) migrado ✓
- [ ] Logging configurado ✓
- [ ] Monitoring/alertas configurados (opcional) ✓

---

## 🎉 Pronto para Produção!

Se todos os checkboxes acima foram marcados, o sistema está **pronto para deploy em produção**.

**Próximas ações:**
1. Merge da branch em `main` no Git
2. Build/deployment em servidor de produção
3. Monitorar logs nas primeiras horas
4. Avisar usuários sobre nova funcionalidade

---

**Data de Verificação:** ____________________  
**Responsável:** ____________________  
**Aprovado:** ⃞ SIM ⃞ NÃO

---

*Documento de controle — Guardar cópia após aprovação*
