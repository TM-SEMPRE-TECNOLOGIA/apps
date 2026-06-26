# 📐 Diagramas Visuais: AutoRelatorio v3.2

**Representação visual da arquitetura, fluxos e componentes**

---

## 1. Arquitetura Geral (Visão de 30.000 pés)

```
┌────────────────────────────────────────────────────────────────────┐
│                         USUÁRIO FINAL                              │
└────────────────────────────────────────────────────────────────────┘
                              ⬇ [Browser]
┌────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js + React)                      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │ 1. Seletor de Template                                  │     │
│  │    [Dropdown: MODELO - 3575 - TANGARA...]               │     │
│  └──────────────────────────────────────────────────────────┘     │
│                              ⬇                                     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │ 2. Formulário Dinâmico (FormularioDinamico.tsx)         │     │
│  │    • Nr. OS                                             │     │
│  │    • Agência (Código)                                   │     │
│  │    • Agência (Nome)                                     │     │
│  │    • Data de Atendimento                                │     │
│  │    • Endereço                                           │     │
│  │    • Responsável                                        │     │
│  │    • Data Elaboração: AUTO (hoje)                       │     │
│  │    [GERAR RELATÓRIO]                                    │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                    ⬇ [HTTP REST API]
┌────────────────────────────────────────────────────────────────────┐
│                  BACKEND (FastAPI + Python)                        │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐       │
│  │ Endpoint: GET /api/template-placeholders              │       │
│  │                                                        │       │
│  │ Input:  template="MODELO - 3575..."                   │       │
│  │ Output: {placeholders: [...], meta: {...}}            │       │
│  │                                                        │       │
│  │ Função: extract_placeholders()                        │       │
│  │         → Retorna {{campos}} do template              │       │
│  └────────────────────────────────────────────────────────┘       │
│                           ⬇                                       │
│  ┌────────────────────────────────────────────────────────┐       │
│  │ Endpoint: POST /api/generate-report-with-fields       │       │
│  │                                                        │       │
│  │ Input:  {                                              │       │
│  │           pasta_raiz: "...",                          │       │
│  │           meta_fields: {...}                          │       │
│  │         }                                              │       │
│  │ Output: .docx file (binary)                           │       │
│  │                                                        │       │
│  │ Pipeline:                                              │       │
│  │   1. generator.py (fotos + estrutura)                 │       │
│  │   2. word_utils.py                                     │       │
│  │      → substitute_placeholders()                       │       │
│  │      → Replace {{campo}} = meta_fields[campo]         │       │
│  │   3. Return modified .docx                            │       │
│  └────────────────────────────────────────────────────────┘       │
│                           ⬇                                       │
│  ┌────────────────────────────────────────────────────────┐       │
│  │ Arquivo: MODELO - 3575 - TANGARA DA SERRA.docx       │       │
│  │                                                        │       │
│  │ ┌──────────────────────────────────────────┐          │       │
│  │ │ Agência: {{agencia_codigo}}              │          │       │
│  │ │ Nome: {{agencia_nome}}                   │          │       │
│  │ │ Data: {{data_elaboracao}}                │          │       │
│  │ │ ...                                      │          │       │
│  │ └──────────────────────────────────────────┘          │       │
│  │                    ⬇ (substituição)                   │       │
│  │ ┌──────────────────────────────────────────┐          │       │
│  │ │ Agência: 3575                            │          │       │
│  │ │ Nome: TANGARA DA SERRA                   │          │       │
│  │ │ Data: 2026-05-01                         │          │       │
│  │ │ ...                                      │          │       │
│  │ └──────────────────────────────────────────┘          │       │
│  └────────────────────────────────────────────────────────┘       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                    ⬇ [Download]
┌────────────────────────────────────────────────────────────────────┐
│                    RESULTADO FINAL                                 │
│                                                                    │
│    📄 RELATÓRIO - 1753 - TANGARA DA SERRA - 2026-05-01.docx      │
│       ✅ Fotos inseridas                                          │
│       ✅ Placeholders preenchidos                                 │
│       ✅ Pronto para impressão                                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. Fluxo de Dados (Sequencial)

```
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 1: Usuário Seleciona Template                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Frontend: Dropdown com templates                                   │
│ Usuário escolhe: "MODELO - 3575 - TANGARA DA SERRA.docx"         │
│ Ação: onChange → trigger fetch                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ⬇
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 2: Frontend Carrega Placeholders                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Frontend: useEffect(() => {                                        │
│   fetch("/api/template-placeholders?template=MODELO-3575...")     │
│   .then(data => setPlaceholders(data.placeholders))               │
│ })                                                                  │
│                                                                     │
│ Requisição HTTP:                                                   │
│ GET /api/template-placeholders?template=MODELO%20-%203575...      │
│                                                                     │
│ Resposta:                                                          │
│ {                                                                  │
│   "placeholders": [                                                │
│     {"key": "nr_os", "required": true, ...},                      │
│     {"key": "agencia_codigo", "required": true, ...},             │
│     ...                                                            │
│   ]                                                                │
│ }                                                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ⬇
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 3: Frontend Renderiza Formulário                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌────────────────────────────────────────────────────────────┐    │
│ │ ┌─ Formulário Dinâmico ────────────────────────────────┐  │    │
│ │ │                                                      │  │    │
│ │ │ [Número da OS]       [__1753__________]              │  │    │
│ │ │ [Código Agência]     [__3575__________]              │  │    │
│ │ │ [Nome Agência]       [__TANGARA DA SERRA__]         │  │    │
│ │ │ [Data Atendimento]   [__2026-04-28__________]       │  │    │
│ │ │ [Endereço]           [__Avenida Principal...__]     │  │    │
│ │ │ [Responsável]        [__2024 - JOÃO SILVA___]       │  │    │
│ │ │                                                      │  │    │
│ │ │ Auto (não visível):                                 │  │    │
│ │ │ • data_elaboracao: 2026-05-01 (hoje)              │  │    │
│ │ │                                                      │  │    │
│ │ │              [🚀 GERAR RELATÓRIO]                  │  │    │
│ │ │                                                      │  │    │
│ │ └──────────────────────────────────────────────────────┘  │    │
│ └────────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ⬇
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 4: Usuário Preenche Formulário                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Usuário digita/seleciona cada campo:                               │
│ • nr_os: "1753"                                                    │
│ • agencia_codigo: "3575"                                           │
│ • agencia_nome: "TANGARA DA SERRA"                                │
│ • data_atendimento: "2026-04-28"                                   │
│ • endereco: "Avenida Principal, 456, ..."                         │
│ • responsavel_dependencia: "2024 - JOÃO SILVA"                    │
│                                                                     │
│ Frontend valida:                                                   │
│ ✅ Todos campos obrigatórios preenchidos                           │
│ ✅ Formato de data válido                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ⬇
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 5: Usuário Clica "GERAR RELATÓRIO"                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Ação: onSubmit() handler                                           │
│ Envia POST request com todos os 7 campos (5 preenchidos + 1 auto) │
│                                                                     │
│ POST /api/generate-report-with-fields                             │
│ {                                                                  │
│   "pasta_raiz": "/fotos/OS_1753",                                │
│   "modelo": "MODELO - 3575 - TANGARA DA SERRA.docx",            │
│   "pasta_saida": "/output",                                      │
│   "conteudo": [...],                                              │
│   "meta_fields": {                                                │
│     "nr_os": "1753",                                              │
│     "data_elaboracao": "2026-05-01",                              │
│     "data_atendimento": "2026-04-28",                             │
│     "agencia_codigo": "3575",                                     │
│     "agencia_nome": "TANGARA DA SERRA",                          │
│     "endereco": "Avenida Principal, 456, ...",                   │
│     "responsavel_dependencia": "2024 - JOÃO SILVA"               │
│   }                                                                │
│ }                                                                  │
│                                                                     │
│ Frontend: Mostra loading... ⏳                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ⬇
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 6: Backend Processa Requisição                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Fase 1: Validação                                                  │
│   ✅ meta_fields contém só chaves conhecidas                       │
│   ✅ Nenhum valor > 500 caracteres                                │
│   ✅ Template existe                                               │
│                                                                     │
│ Fase 2: Geração Base                                               │
│   → generator.py                                                   │
│   → Ler fotos de /fotos/OS_1753                                   │
│   → Montar estrutura (pastas, imagens)                            │
│   → Gerar RELATÓRIO...docx na pasta output                        │
│   ✅ Resultado: arquivo .docx com fotos mas sem placeholders      │
│                                                                     │
│ Fase 3: Substituição de Placeholders                              │
│   → word_utils.substitute_placeholders()                          │
│   → Abrir .docx gerado                                            │
│   → Iterar parágrafos                                             │
│      Encontrou "{{agencia_codigo}}" → substituir por "3575"       │
│      Encontrou "{{agencia_nome}}" → substituir por "TANGARA..."   │
│      ... (repetir para todos 7)                                    │
│   → Iterar tabelas (idem)                                         │
│   ✅ Resultado: arquivo .docx com tudo preenchido                 │
│                                                                     │
│ Fase 4: Salvar                                                     │
│   → Sobrescrever ou salvar em novo path                           │
│   ✅ Resultado: arquivo pronto                                     │
│                                                                     │
│ Fase 5: Resposta                                                   │
│   {                                                                │
│     "success": true,                                              │
│     "output_docx": "RELATÓRIO - 1753 - TANGARA...docx",         │
│     "url": "/download/RELATÓRIO - 1753 - TANGARA...docx",       │
│     "meta_applied": {...}                                         │
│   }                                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ⬇
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 7: Frontend Recebe Resposta                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Status 200 OK:                                                     │
│ ✅ Toast: "Relatório gerado com sucesso!"                         │
│ ✅ Link: [📥 Fazer Download]                                      │
│ ✅ Exibir dados preenchidos para confirmação                      │
│ ✅ Opção: [Voltar ao Formulário] para próxima OS                │
│                                                                     │
│ Status 400/500:                                                    │
│ ❌ Toast: "Erro: [mensagem de erro]"                              │
│ ❌ Manter formulário preenchido para correção                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ⬇
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 8: Usuário Faz Download                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Clica link: [📥 Fazer Download]                                   │
│                                                                     │
│ ↓ GET /download/RELATÓRIO - 1753 - TANGARA DA SERRA...docx      │
│                                                                     │
│ ↓ Browser salva arquivo                                            │
│                                                                     │
│ ✅ Arquivo na máquina do usuário:                                 │
│    "RELATÓRIO - 1753 - TANGARA DA SERRA - 2026-05-01.docx"      │
│                                                                     │
│ ✅ Pronto para:                                                    │
│    • Visualizar no Word                                            │
│    • Enviar por email                                              │
│    • Imprimir                                                      │
│    • Arquivar                                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Estrutura de Dados: Meta Fields

```
┌─────────────────────────────────────────────────────────────┐
│          META_FIELDS Dictionary (7 campos)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  key                    value           origem             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  nr_os              =  "1753"           ← Portal           │
│  agencia_codigo     =  "3575"           ← Portal           │
│  agencia_nome       =  "TANGARA..."     ← Portal           │
│  data_atendimento   =  "2026-04-28"     ← Portal           │
│  endereco           =  "Av. Principal..." ← Portal         │
│  responsavel_dep    =  "2024 - J.SILVA" ← Portal           │
│  data_elaboracao    =  "2026-05-01"     ← Auto (hoje)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
        ⬇ Utilisé pour substitution dans template
┌─────────────────────────────────────────────────────────────┐
│           TEMPLATE com Placeholders                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  "Agência: {{agencia_codigo}} — {{agencia_nome}}"          │
│            ▲                     ▲                          │
│            └─────────────────────┘                          │
│               Buscam "agencia_codigo" e "agencia_nome"      │
│               em meta_fields                                │
│                                                             │
│  Resultado: "Agência: 3575 — TANGARA DA SERRA"            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Campos Fixos vs Dinâmicos

```
TEMPLATE Word

┌─────────────────────────────────────────────────────────────┐
│                      CABEÇALHO                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Contrato: 2025.7421.3575             ← FIXO (hardcoded)  │
│  Elaboração: Ygor Augusto Fernandes   ← FIXO (hardcoded)  │
│  UF: MT                                ← FIXO (hardcoded)  │
│  Tipo: Preventivo                      ← FIXO (hardcoded)  │
│                                                             │
│  ───────────────────────────────────────────────────────── │
│                                                             │
│  Agência: {{agencia_codigo}}           ← DINÂMICO          │
│  Nome: {{agencia_nome}}                ← DINÂMICO          │
│  Endereço: {{endereco}}                ← DINÂMICO          │
│                                                             │
│  ───────────────────────────────────────────────────────── │
│                                                             │
│  Data Elaboração: {{data_elaboracao}}  ← DINÂMICO (auto)  │
│  Data Atendimento: {{data_atendimento}}← DINÂMICO          │
│  OS: {{nr_os}}                         ← DINÂMICO          │
│  Responsável: {{responsavel_dep}}      ← DINÂMICO          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Resumo:
  FIXOS = 4 campos (baked no Word, sem formulário)
  DINÂMICOS = 7 campos (placeholders, via formulário)
  TOTAL = 11 campos preenchidos automaticamente
```

---

## 5. Componentes Frontend

```
┌─────────────────────────────────────────────────────────────┐
│            PÁGINA PRINCIPAL (app/page.tsx)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────┐                      │
│  │ Template Selector                │                      │
│  │ [Dropdown ▼] MODELO - 3575...    │                      │
│  └──────────────────────────────────┘                      │
│              ⬇ onChange                                     │
│  ┌──────────────────────────────────┐                      │
│  │ Scanning Result                  │                      │
│  │ ✅ Fotos lidas: 15 imagens       │                      │
│  └──────────────────────────────────┘                      │
│              ⬇ Se template selecionado                     │
│  ┌──────────────────────────────────┐                      │
│  │ FormularioDinamico (Novo!)       │                      │
│  │ ┌────────────────────────────┐   │                      │
│  │ │ Input 1: Nr. OS            │   │                      │
│  │ │ Input 2: Código Agência    │   │                      │
│  │ │ Input 3: Nome Agência      │   │                      │
│  │ │ Input 4: Data Atendimento  │   │                      │
│  │ │ Input 5: Endereço          │   │                      │
│  │ │ Input 6: Responsável       │   │                      │
│  │ │ (Data Elaboração: auto)    │   │                      │
│  │ │                            │   │                      │
│  │ │ [GERAR RELATÓRIO]          │   │                      │
│  │ └────────────────────────────┘   │                      │
│  └──────────────────────────────────┘                      │
│              ⬇ Após sucesso                                │
│  ┌──────────────────────────────────┐                      │
│  │ Success Message                  │                      │
│  │ ✅ Relatório gerado!             │                      │
│  │ [📥 Download] [📂 Abrir]         │                      │
│  └──────────────────────────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Estrutura do Componente FormularioDinamico:

┌─ FormularioDinamico.tsx
├─ Props:
│  ├─ template: string
│  └─ onSubmit: (fields) => Promise<void>
├─ State:
│  ├─ placeholders: PlaceholderInfo[]
│  ├─ formData: Record<string, string>
│  ├─ loading: boolean
│  └─ error: string | null
├─ Effects:
│  └─ useEffect(() => {
│       fetch("/api/template-placeholders")
│     }, [template])
└─ Render:
   ├─ Se loading: "Carregando..."
   ├─ Se sem placeholders: "Nenhum placeholder"
   └─ Senão: Formulário com 5-6 campos visíveis
```

---

## 6. Fluxo de Funções Backend

```
POST /api/generate-report-with-fields
│
├─ ① Validar meta_fields
│  ├─ Chaves conhecidas? ✅
│  ├─ Tamanho < 500? ✅
│  └─ Template existe? ✅
│
├─ ② Chamar generator.py
│  ├─ Ler pasta de fotos
│  ├─ Montar estrutura (títulos, imagens)
│  └─ Gerar .docx base ✅
│
├─ ③ Abrir .docx gerado
│  └─ doc = Document(output_path) ✅
│
├─ ④ Iterar parágrafos
│  ├─ Para cada parágrafo:
│  │  └─ Para cada run:
│  │     └─ Para cada campo em meta_fields:
│  │        └─ Se {{campo}} em run.text:
│  │           ├─ run.clear()
│  │           └─ run.add_text(run.text.replace(...))
│  └─ ✅ Parágrafos atualizados
│
├─ ⑤ Iterar tabelas
│  ├─ Para cada tabela:
│  │  └─ Para cada célula:
│  │     └─ Repetir lógica de parágrafo
│  └─ ✅ Tabelas atualizadas
│
├─ ⑥ Salvar documento
│  ├─ output = BytesIO()
│  ├─ doc.save(output)
│  └─ return output.getvalue() ✅
│
└─ ⑦ Responder cliente
   ├─ Status 200
   ├─ Body: {"success": true, "url": "...", ...}
   └─ ✅ Download disponível
```

---

## 7. Matriz de Testes

```
┌──────────────────────────────────────────────────────────────┐
│                   TESTE MATRIX                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Backend Funções:                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ extract_placeholders()                                 │ │
│  │ ├─ Caso: documento com placeholders                   │ │
│  │ │  Expected: ['agencia_codigo', 'nr_os', ...]        │ │
│  │ ├─ Caso: documento vazio                              │ │
│  │ │  Expected: []                                        │ │
│  │ └─ Caso: placeholders duplicados                      │ │
│  │    Expected: lista única                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ substitute_placeholders()                              │ │
│  │ ├─ Caso: 7 placeholders válidos                       │ │
│  │ │  Expected: .docx com valores substituídos           │ │
│  │ ├─ Caso: placeholder faltando no meta_fields          │ │
│  │ │  Expected: placeholder fica como está               │ │
│  │ └─ Caso: valor com caracteres especiais               │ │
│  │    Expected: substituído corretamente                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Endpoints:                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ GET /api/template-placeholders                         │ │
│  │ ├─ Caso: template válido                              │ │
│  │ │  Expected: JSON com placeholders                    │ │
│  │ ├─ Caso: template não existe                          │ │
│  │ │  Expected: 404                                       │ │
│  │ └─ Caso: sem template query param                     │ │
│  │    Expected: 400                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ POST /api/generate-report-with-fields                  │ │
│  │ ├─ Caso: dados válidos                                │ │
│  │ │  Expected: 200 + arquivo .docx                      │ │
│  │ ├─ Caso: meta_fields inválido                         │ │
│  │ │  Expected: 400                                       │ │
│  │ └─ Caso: template não existe                          │ │
│  │    Expected: 404                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Frontend:                                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ FormularioDinamico                                     │ │
│  │ ├─ Renderização: 5 campos + 1 auto                    │ │
│  │ ├─ Validação: não deixa submeter sem campos obrig.    │ │
│  │ ├─ Loading: mostra spinner durante geração           │ │
│  │ ├─ Sucesso: mostra toast + link download              │ │
│  │ └─ Erro: mostra toast de erro                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  E2E:                                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Fluxo completo                                         │ │
│  │ 1. Selecionar template                                │ │
│  │ 2. Formulário carrega (GET placeholders)              │ │
│  │ 3. Preencher 5 campos                                 │ │
│  │ 4. Clicar "GERAR"                                     │ │
│  │ 5. Backend processa (POST generate)                   │ │
│  │ 6. Receber .docx                                      │ │
│  │ 7. Verificar arquivo tem dados preenchidos            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. Timeline Visual

```
Semana 1
│
├─ Seg   [1h] Fase 1: extract_placeholders()
│  │     ✅ Função escrita + testada
│  │
├─ Ter   [1h] Fase 1: substitute_placeholders()
│  │     ✅ Função escrita + testada
│  │
├─ Qua   [2h] Fase 2: Endpoints FastAPI
│  │     ├─ GET /api/template-placeholders
│  │     ├─ POST /api/generate-report-with-fields
│  │     └─ ✅ Ambos testados
│  │
├─ Qui   [3h] Fase 4: Atualizar templates (paralelo)
│  │     ├─ Template 3575 (teste completo)
│  │     ├─ Template 1507 (validação)
│  │     └─ ✅ Estrutura confirmada
│  │
├─ Sex   [2h] Fase 3: React Component
│  │     ├─ FormularioDinamico.tsx
│  │     ├─ Integração com page.tsx
│  │     └─ ✅ Funcionando localmente
│  │
├─ Sáb-Dom: (Descanso)
│
Semana 2
│
├─ Seg   [1h] Fase 4: Replicar para 6 templates restantes
│  │     └─ ✅ Todos 9 templates atualizados
│  │
├─ Ter   [2h] Fase 5: Testes Unitários
│  │     ├─ test_extract_placeholders()
│  │     ├─ test_substitute_placeholders()
│  │     └─ ✅ 100% passando
│  │
├─ Qua   [2h] Fase 5: Testes E2E
│  │     ├─ GET /api/template-placeholders
│  │     ├─ POST /api/generate-report-with-fields
│  │     ├─ Fluxo completo no Frontend
│  │     └─ ✅ 100% passando
│  │
├─ Qui   [1h] Fase 6: Documentação
│  │     ├─ Atualizar docstrings
│  │     ├─ Adicionar comentários
│  │     └─ ✅ Pronto para maintence
│  │
└─ Sex   [1h] Revisão Final + Deploy
       └─ ✅ v3.2 em Produção

TOTAL: 12 horas (1.5 dias de desenvolvimento)
```

---

## 9. Hierarquia de Placeholders

```
TEMPLATE.docx
│
├─ Parágrafo 1
│  ├─ Run 1: "Agência: "
│  └─ Run 2: "{{agencia_codigo}}"  ← Encontra aqui
│
├─ Parágrafo 2
│  ├─ Run 1: "Nome: "
│  └─ Run 2: "{{agencia_nome}}"    ← Encontra aqui
│
├─ Tabela 1
│  ├─ Row 1
│  │  ├─ Cell 1: "Data: {{data_elaboracao}}"  ← Encontra aqui
│  │  └─ Cell 2: "Atendimento: {{data_atendimento}}"  ← Encontra aqui
│  │
│  └─ Row 2
│     ├─ Cell 1: "OS: {{nr_os}}"  ← Encontra aqui
│     └─ Cell 2: "Responsável: {{responsavel_dependencia}}"  ← Encontra aqui
│
├─ Parágrafo 3
│  └─ Run 1: "Endereço: {{endereco}}"  ← Encontra aqui
│
└─ Total: 7 placeholders encontrados
```

---

## 10. Estados do Formulário

```
┌──────────────┐
│   INICIAL    │  (Template não selecionado)
└──────┬───────┘
       │ Seleciona template
       ▼
┌──────────────┐
│   LOADING    │  (Carregando placeholders)
│   ⏳         │
└──────┬───────┘
       │ Recebe resposta
       ▼
┌──────────────┐
│   PRONTO     │  (Formulário renderizado)
│   [Form]     │
└──────┬───────┘
       │ Preenche campo
       │ (validação em tempo real)
       ▼
┌──────────────┐
│   VALIDANDO  │  (Verifica campos obrigatórios)
└──────┬───────┘
       │ Clica "GERAR"
       ▼
┌──────────────┐
│   PROCESSANDO│  (Enviando POST + aguardando)
│   ⏳ 🔄 ...  │
└──────┬───────┘
       │ Resposta 200
       │ (outro path: erro)
       ▼
┌──────────────┐
│   SUCESSO    │  (Arquivo gerado)
│   ✅ URL OK  │
└──────┬───────┘
       │ [Voltar ao Formulário]
       │ ou
       │ [Fazer Download]
       ▼
  (volta ao PRONTO ou nova OS)
```

---

**Versão:** 3.2 | **Data:** 2026-05-01 | **Status:** Diagramas Completos ✅
