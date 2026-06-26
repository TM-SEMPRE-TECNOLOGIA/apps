# 📋 Planejamento: AutoRelatorio v3.2 — Sistema de Placeholders Dinâmicos

**Versão:** 3.2  
**Data:** 2026-05-01  
**Objetivo:** Implementar sistema completo de placeholders `{{campo}}` em todos os templates e integrar automaticamente com formulário frontend.

---

## 📊 Visão Geral da Atualização

### O que muda
- ✅ Todos os templates `.docx` recebem **7 placeholders dinâmicos** (padrão: `{{campo}}`)
- ✅ **6 campos fixos** no template (não precisam de input no formulário)
- ✅ **5 campos variáveis** que vêm do formulário/portal
- ✅ **1 campo automático** (Data de Elaboração = hoje)
- ✅ Backend detecta placeholders automaticamente
- ✅ Frontend apresenta formulário **apenas com 5 campos obrigatórios**

### Escopo
- **Documentos afetados:** 9 templates + novos contratos que forem adicionados
- **Componentes:** Backend (Python/FastAPI) + Frontend (Next.js) + Templates Word
- **Sem breaking changes:** Código anterior mantém compatibilidade

---

## 🎯 Arquitetura de Placeholders

### 1️⃣ Placeholders Dinâmicos (Input do Formulário)

Estes 5 campos variam por Ordem de Serviço e **DEVEM** estar em cada template:

| Placeholder | Origem | Tipo | Exemplo |
|---|---|---|---|
| `{{nr_os}}` | Titulo da OS no portal | string | `1753` |
| `{{data_elaboracao}}` | Auto-gerado (data de hoje) | date | `2026-05-01` |
| `{{data_atendimento}}` | Entrada mais antiga de "Fornecedor Acionado" | date | `2026-04-28` |
| `{{agencia_codigo}}` | Campo "Prefixo/SB" do portal | string | `3575` |
| `{{agencia_nome}}` | Campo "Dependência" (até o hífen) | string | `TANGARA DA SERRA` |
| `{{endereco}}` | Campo "Endereço da Dependência" (cópia exata) | string | `Av. Principal, 123, TANGARA...` |
| `{{responsavel_dependencia}}` | Matrícula + Responsável concatenados | string | `2024 - JOÃO SILVA` |

**Nota:** `{{data_elaboracao}}` é gerada automaticamente (sempre = data de hoje). Os outros 6 vêm do formulário.

---

### 2️⃣ Campos Fixos (No Template, Sem Input)

Estes 6 campos **já estão preenchidos** no documento Word e **NÃO precisam** de input no formulário:

| Campo | Valor | Onde fica | Observação |
|---|---|---|---|
| Contrato | `2025.7421.3575` | Capa/cabeçalho | Fixo, não muda por OS |
| Elaboração | `Ygor Augusto Fernandes` | Rodapé/capa | Nome fixo do elaborador |
| UF | `MT` | Cabeçalho | Todos os relatórios deste lote são MT |
| Tipo de Relatório | `Preventivo` | Título/capa | Constante para este contrato |
| Responsável Técnico | `Alexandre Marcos` | Assinatura/capa | Fixo |
| Responsável Técnico/Empresa | `Ygor Augusto Fernandes Ferrugem – CREA: 1017279403/D-GO` | Documentação | Fixo |

**Estes não usam placeholders** — são apenas valores literais já "baked" nos templates.

---

## 🛠️ Estrutura Técnica

### 📁 Backend (Python/FastAPI)

#### Arquivo: `server.py`
```python
class GenerateRequest(BaseModel):
    # Existing
    pasta_raiz: str
    modelo: str
    pasta_saida: str
    conteudo: list
    tipo_relatorio: str = "tradicional"
    
    # 🆕 Adição: Metadados para substituição de placeholders
    meta_fields: Dict[str, str] = {
        "nr_os": "1753",
        "data_elaboracao": "2026-05-01",
        "data_atendimento": "2026-04-28",
        "agencia_codigo": "3575",
        "agencia_nome": "TANGARA DA SERRA",
        "endereco": "Av. Principal, 123...",
        "responsavel_dependencia": "2024 - JOÃO SILVA"
    }
```

#### Novo Endpoint: `GET /api/template-placeholders`
- **Objetivo:** Ler um template e retornar todos os placeholders dinâmicos encontrados
- **Entrada:** `template=MODELO%20-%203575%20-%20TANGARA...docx`
- **Saída:** Lista de placeholders encontrados + seus tipos esperados
- **Uso:** Frontend sabe quais campos solicitar ao usuário

**Lógica:**
1. Ler `.docx` usando `python-docx`
2. Extrair todos os `{{campo}}` usando regex: `\{\{([a-z_]+)\}\}`
3. Filtrar campos conhecidos (nr_os, data_*, agencia_*, endereco, responsavel_*)
4. Retornar como JSON com metadados (obrigatório sim/não, tipo, placeholder original)

#### Novo Endpoint: `POST /api/generate-report-with-fields`
- **Objetivo:** Gerar relatório com substituição automática de placeholders
- **Entrada:** `GenerateRequest` com `meta_fields`
- **Saída:** Arquivo `.docx` gerado com placeholders substituídos

**Fluxo interno:**
1. Chamar `generator.py` para gerar `.docx` base
2. Abrir `.docx` gerado com `python-docx`
3. Iterar por todos os parágrafos e tabelas
4. Substituir `{{campo}}` pelos valores em `meta_fields`
5. Salvar e retornar

---

### 🎨 Frontend (Next.js)

#### Novo Componente: `FormularioDinamico.tsx`
- **Props:** 
  - `template: string` — Nome do template selecionado
  - `onSubmit: (fields: Record<string, string>) => void`
  
- **Comportamento:**
  1. Ao montar, chama `GET /api/template-placeholders?template=...`
  2. Recebe lista de placeholders necessários
  3. Renderiza formulário com apenas os **5 campos variáveis**
  4. `data_elaboracao` é preenchida automaticamente (hoje)
  5. Valida campos obrigatórios antes de enviar
  6. Ao clicar "Gerar", chama `POST /api/generate-report-with-fields` com todos os 7 campos

**Exemplo de render:**
```
[Formulário Dinâmico]
┌─────────────────────────────────────────┐
│ Ordem de Serviço (OS)                   │
│ [____1753____________________]           │
│                                         │
│ Agência (Código)                        │
│ [____3575____________________]           │
│                                         │
│ Agência (Nome)                          │
│ [____TANGARA DA SERRA________]           │
│                                         │
│ Data de Atendimento                     │
│ [____2026-04-28______________]           │
│                                         │
│ Endereço da Dependência                 │
│ [____Av. Principal, 123______]           │
│                                         │
│ Responsável da Dependência              │
│ [____2024 - JOÃO SILVA_______]           │
│                                         │
│ [GERAR RELATÓRIO]                       │
└─────────────────────────────────────────┘

⚙️ Auto-preenchido (não aparece no form):
- Data de Elaboração: 2026-05-01 (hoje)
```

---

## 📋 Templates: Mudanças Necessárias

### Localização
`APP/backend/templates/MODELO - XXXX - NOME.docx`

### Para cada template, adicionar placeholders:

**Capa/Cabeçalho:**
```
Contrato: 2025.7421.3575 (fixo — não é placeholder)
Elaboração: Ygor Augusto Fernandes (fixo)
UF: MT (fixo)
Agência: {{agencia_codigo}} — {{agencia_nome}} (dinâmico)
Endereço: {{endereco}} (dinâmico)
```

**Primeira página (Cabeçalho institucional):**
```
Data de Elaboração: {{data_elaboracao}}
Data de Atendimento: {{data_atendimento}}
Ordem de Serviço: {{nr_os}}
Responsável: {{responsavel_dependencia}}
```

### Templates Afetados (9 arquivos)
1. ✏️ `MODELO - 0908 - SÃO PAULO.docx`
2. ✏️ `MODELO - 1507 - CUIABÁ.docx`
3. ✏️ `MODELO - 1565 - SAO JOSE DO RIO PRETO.docx`
4. ✏️ `MODELO - 2056 - DIVINÓPOLIS.docx`
5. ✏️ `MODELO - 2057 - VARGINHA.docx`
6. ✏️ `MODELO - 2626 - SALINAS.docx`
7. ✏️ `MODELO - 2627 - VALADARES.docx`
8. ✏️ `MODELO - 3575 - TANGARA DA SERRA.docx` ← Principal para testes
9. ✏️ `MODELO - 6122 - MATO GROSSO DO SUL.docx`

**Critério de modificação:** Inserir placeholders respeitando o design/layout de cada template.

---

## 🔄 Fluxo de Dados (End-to-End)

```
┌─────────────────────────────────────────────────────────────────┐
│                     USUÁRIO NO FRONTEND                         │
└─────────────────────────────────────────────────────────────────┘
                             ⬇
┌─────────────────────────────────────────────────────────────────┐
│ 1. Seleciona Template (ex: 3575)                                │
│ 2. Sistema carrega FormularioDinamico.tsx                       │
└─────────────────────────────────────────────────────────────────┘
                             ⬇
    ┌──────────────────────────────────────────────┐
    │ GET /api/template-placeholders               │
    │   ?template=MODELO%20-%203575...docx         │
    └──────────────────────────────────────────────┘
                        ⬇
            ┌──────────────────────────┐
            │ Backend (Python/FastAPI) │
            │ ─────────────────────── │
            │ 1. Abre template.docx    │
            │ 2. Extrai {{campos}}     │
            │ 3. Retorna JSON          │
            └──────────────────────────┘
                        ⬇
    ┌──────────────────────────────────────────────┐
    │ {                                            │
    │   "placeholders": [                          │
    │     { "key": "nr_os", "type": "string" },   │
    │     { "key": "agencia_codigo", ... },       │
    │     ...                                      │
    │   ]                                          │
    │ }                                            │
    └──────────────────────────────────────────────┘
                             ⬇
┌─────────────────────────────────────────────────────────────────┐
│ 3. Frontend renderiza FormularioDinamico                        │
│    com 5 campos: OS, Código Agência, Nome Agência,             │
│    Data Atendimento, Endereço, Responsável                     │
│    + auto-preenchimento de Data Elaboração (hoje)              │
└─────────────────────────────────────────────────────────────────┘
                             ⬇
┌─────────────────────────────────────────────────────────────────┐
│ 4. Usuário preenche formulário e clica "GERAR"                 │
└─────────────────────────────────────────────────────────────────┘
                             ⬇
    ┌──────────────────────────────────────────────┐
    │ POST /api/generate-report-with-fields        │
    │ {                                            │
    │   "pasta_raiz": "...",                       │
    │   "modelo": "MODELO - 3575...",              │
    │   "meta_fields": {                           │
    │     "nr_os": "1753",                         │
    │     "data_elaboracao": "2026-05-01",         │
    │     "agencia_codigo": "3575",                │
    │     ...                                      │
    │   }                                          │
    │ }                                            │
    └──────────────────────────────────────────────┘
                        ⬇
            ┌──────────────────────────┐
            │ Backend (Python/FastAPI) │
            │ ─────────────────────── │
            │ 1. Chama generator.py    │
            │ 2. Abre .docx gerado    │
            │ 3. Substitui {{campos}}  │
            │    por meta_fields       │
            │ 4. Salva resultado       │
            │ 5. Retorna arquivo       │
            └──────────────────────────┘
                        ⬇
    ┌──────────────────────────────────────────────┐
    │ ✅ Arquivo .docx completo + preenchido      │
    │    pronto para download                      │
    └──────────────────────────────────────────────┘
                             ⬇
┌─────────────────────────────────────────────────────────────────┐
│ 5. Usuário faz download ou visualiza relatório                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Dependências (Sem Mudanças)

### Backend
- `fastapi` ✅ Existente
- `python-docx` ✅ Existente
- `uvicorn` ✅ Existente
- `PIL` ✅ Existente

### Frontend
- `next.js` ✅ Existente
- `tailwind` ✅ Existente
- `react` ✅ Existente

**Nenhuma nova dependência necessária.**

---

## 📝 Checklist de Implementação

### Fase 1: Backend (Python)
- [ ] **1.1** Criar função `extract_placeholders(docx_path) → List[str]`
  - Ler `.docx` com `python-docx`
  - Usar regex `\{\{([a-z_]+)\}\}` para extrair
  - Retornar lista única de placeholders
  
- [ ] **1.2** Criar função `substitute_placeholders(docx_path, meta_fields: Dict) → bytes`
  - Abrir `.docx`
  - Iterar parágrafos e tabelas
  - Substituir cada `{{campo}}` por `meta_fields[campo]`
  - Retornar `.docx` em bytes
  
- [ ] **1.3** Novo endpoint: `GET /api/template-placeholders`
  - Query param: `template`
  - Retorna JSON com placeholders encontrados
  - Integra função 1.1
  
- [ ] **1.4** Novo endpoint: `POST /api/generate-report-with-fields`
  - Body: `GenerateRequest` com `meta_fields`
  - Chama gerador existente
  - Integra função 1.2 para substituir placeholders
  - Retorna arquivo `.docx`

### Fase 2: Frontend (Next.js)
- [ ] **2.1** Novo componente: `FormularioDinamico.tsx`
  - Props: `template`, `onSubmit`
  - Chamar endpoint 1.3 ao montar
  - Renderizar 5 campos dinâmicos + 1 auto (data)
  - Validação básica (obrigatórios)
  - Submit integrado com endpoint 1.4
  
- [ ] **2.2** Integrar `FormularioDinamico` na página principal
  - Aparecer após seleção de template
  - Substituir ou complementar formulário existente
  
- [ ] **2.3** Adicionar feedback visual
  - Loading durante requisições
  - Toast de sucesso/erro
  - Link de download do arquivo gerado

### Fase 3: Templates (Word)
- [ ] **3.1** Editar cada um dos 9 templates
  - Localizar seções de cabeçalho (Agência, Data, etc.)
  - Inserir placeholders `{{campo}}` no local correto
  - Preservar formatação/design existente
  
- [ ] **3.2** Teste manual em 1 template
  - Executar pipeline completo
  - Verificar se substituição funciona
  - Validar formatação do resultado
  
- [ ] **3.3** Replicar para outros 8 templates

### Fase 4: Testes e Validação
- [ ] **4.1** Teste unitário: `extract_placeholders()`
  - Mock `.docx` com vários placeholders
  - Verificar extração correta
  
- [ ] **4.2** Teste unitário: `substitute_placeholders()`
  - Mock `.docx`
  - Substituir `{{teste}}` → "valor"
  - Verificar resultado
  
- [ ] **4.3** Teste E2E: formulário → relatório
  - Selecionar template
  - Preencher formulário
  - Gerar relatório
  - Validar resultado no Word
  
- [ ] **4.4** Teste de regressão
  - Modo tradicional (sem meta_fields) continua funcionando
  - Outros tipos de relatório não afetados

---

## 🎓 Conceitos-Chave

### Por que `{{campo}}` ao invés de `{campo}`?
- Duplas chaves evitam conflito com variáveis do Word/Python
- Padrão comum em templates (handlebars, mustache, jinja2)
- Fácil de detectar com regex

### Por que separar campos "fixos" de "dinâmicos"?
- **Fixos:** Já estão no template, não mudam — economia de processamento
- **Dinâmicos:** Variam por OS — precisam de input

### Sobre a `data_elaboracao` ser automática:
- Sempre = data de hoje (não vem do portal)
- Simplifica UX (menos 1 campo a preencher)
- Backend gera no momento do processamento

---

## 📚 Arquivos de Referência

### Já Existentes (Não modificar lógica principal)
- `APP/backend/generator.py` — Geração base do relatório
- `APP/backend/word_utils.py` — Inserção de conteúdo no Word
- `APP/backend/server.py` — Endpoints FastAPI
- `APP/frontend/components/` — Componentes React

### Novos/Modificados
- ✏️ `server.py` — Adicionar endpoints 1.3 e 1.4
- ✏️ `word_utils.py` — Adicionar funções 1.1 e 1.2
- 🆕 `FormularioDinamico.tsx` — Novo componente
- 🆕 9 templates com placeholders

---

## 🚀 Próximos Passos

1. **Revisão deste planejamento** — Validar escopo e arquitetura
2. **Implementar Fase 1** — Backend (funções + endpoints)
3. **Implementar Fase 2** — Frontend (componente + integração)
4. **Implementar Fase 3** — Atualizar templates
5. **Executar Fase 4** — Testes e validações
6. **Deploy** — Atualizar v3.2 em produção

---

## 📌 Notas Importantes

- **Compatibilidade:** Modo tradicional continua disponível para relatórios sem placeholders
- **Performance:** Extração de placeholders é leve (uma leitura de `.docx`)
- **Segurança:** Validar entrada `meta_fields` no backend (evitar injeção)
- **UX:** Formulário dinâmico desaparece automaticamente se template não tiver placeholders
- **Escalabilidade:** Fácil adicionar novos placeholders — apenas editar templates

---

**Versão:** 3.2 | **Status:** Planejamento Concluído ✅ | **Próximo:** Implementação Fase 1
