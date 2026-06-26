# 📊 Exemplos Práticos: AutoRelatorio v3.2

**Guia de uso real com dados de exemplo**

---

## 🎯 Cenário 1: Fluxo Completo de Uma OS

### Dados de Entrada (Portal)

**OS:** 1753 — CARMOPOLIS DE MINAS  
**Agência:** 1753 (TANGARA DA SERRA)  
**Endereço:** Avenida Principal, 456 — TANGARA DA SERRA, MT 78300-000

**Histórico de Atualizações:**
```
2026-04-28 10:15 — Fornecedor Acionado (entrada 1)
2026-04-29 14:30 — Visita Agendada
2026-04-30 09:00 — Visita Realizada
2026-05-01 11:00 — Fotos Coletadas
```

### Extração pelo Formulário

**Dados que o usuário vai preencher:**

```
┌──────────────────────────────────────────┐
│     FORMULÁRIO DE RELATÓRIO DINÂMICO     │
├──────────────────────────────────────────┤
│                                          │
│ Ordem de Serviço (OS)                   │
│ [____________1753_____________]         │
│                                          │
│ Agência (Código)                         │
│ [_____________3575_____________]        │
│                                          │
│ Agência (Nome)                           │
│ [_____TANGARA DA SERRA_______]          │
│                                          │
│ Data de Atendimento                      │
│ [________2026-04-28__________]          │
│                                          │
│ Endereço da Dependência                  │
│ [Avenida Principal, 456,.........]      │
│  TANGARA DA SERRA, MT 78300-000         │
│                                          │
│ Responsável da Dependência               │
│ [_________2024 - JOÃO SILVA____]        │
│                                          │
│ ✅ [GERAR RELATÓRIO]                   │
│                                          │
│ Auto-preenchido (não visível):          │
│ • Data de Elaboração: 2026-05-01        │
│                                          │
└──────────────────────────────────────────┘
```

**Dados consolidados (enviados para backend):**

```json
{
  "pasta_raiz": "/fotos/OS_1753",
  "modelo": "MODELO - 3575 - TANGARA DA SERRA.docx",
  "pasta_saida": "/output",
  "conteudo": [...],
  "meta_fields": {
    "nr_os": "1753",
    "data_elaboracao": "2026-05-01",
    "data_atendimento": "2026-04-28",
    "agencia_codigo": "3575",
    "agencia_nome": "TANGARA DA SERRA",
    "endereco": "Avenida Principal, 456, TANGARA DA SERRA, MT 78300-000",
    "responsavel_dependencia": "2024 - JOÃO SILVA"
  }
}
```

---

## 📄 Cenário 2: Transformação do Template

### ANTES (v3.1 — Sem placeholders)

```docx
═══════════════════════════════════════════════════════
        RELATÓRIO FOTOGRÁFICO — LEVANTAMENTO PREVENTIVO

Contrato: 2025.7421.3575
Elaboração: Ygor Augusto Fernandes
Agência: ________________  (preenchido manualmente)
Nome: ________________    (preenchido manualmente)
Data: ________________    (preenchido manualmente)

═══════════════════════════════════════════════════════
```

### DEPOIS (v3.2 — Com placeholders)

```docx
═══════════════════════════════════════════════════════
        RELATÓRIO FOTOGRÁFICO — LEVANTAMENTO PREVENTIVO

Contrato: 2025.7421.3575
Elaboração: Ygor Augusto Fernandes
Agência: {{agencia_codigo}} — {{agencia_nome}}
Endereço: {{endereco}}
Data Elaboração: {{data_elaboracao}}
Data Atendimento: {{data_atendimento}}
OS: {{nr_os}}
Responsável: {{responsavel_dependencia}}

═══════════════════════════════════════════════════════
```

### RESULTADO FINAL (Após substituição)

```docx
═══════════════════════════════════════════════════════
        RELATÓRIO FOTOGRÁFICO — LEVANTAMENTO PREVENTIVO

Contrato: 2025.7421.3575
Elaboração: Ygor Augusto Fernandes
Agência: 3575 — TANGARA DA SERRA
Endereço: Avenida Principal, 456, TANGARA DA SERRA, MT 78300-000
Data Elaboração: 2026-05-01
Data Atendimento: 2026-04-28
OS: 1753
Responsável: 2024 — JOÃO SILVA

═══════════════════════════════════════════════════════
```

---

## 🔄 Cenário 3: Múltiplas OS (Batch)

### Usando o formulário para processar 3 OS

**OS 1:**
- Nr: 1753
- Código: 3575
- Nome: TANGARA DA SERRA
- Data Atendimento: 2026-04-28
- Endereço: Av. Principal, 456...
- Responsável: 2024 - JOÃO SILVA

**OS 2:**
- Nr: 1758
- Código: 3575
- Nome: TANGARA DA SERRA
- Data Atendimento: 2026-04-29
- Endereço: Av. Secundária, 789...
- Responsável: 2025 - MARIA SANTOS

**OS 3:**
- Nr: 1760
- Código: 1507
- Nome: CUIABÁ
- Data Atendimento: 2026-04-30
- Endereço: Rua Principal, 111...
- Responsável: 2026 - PEDRO OLIVEIRA

### Fluxo de Processamento

```
┌─────────────────────────────────────────────────────────┐
│ Loop: Para cada OS                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 1️⃣  Preencher formulário com dados da OS              │
│    ↓                                                     │
│ 2️⃣  Clicar "GERAR RELATÓRIO"                          │
│    ↓                                                     │
│ 3️⃣  Backend:                                            │
│    a) Gera relatório base (fotos + estrutura)          │
│    b) Substitui placeholders {{campo}}                 │
│    c) Retorna arquivo .docx                            │
│    ↓                                                     │
│ 4️⃣  Frontend:                                           │
│    a) Recebe arquivo                                    │
│    b) Oferece download                                  │
│    c) Formulário reset para próxima OS                 │
│    ↓                                                     │
│ 5️⃣  Usuário salva arquivo e passa para OS 2           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Saída esperada:**
- `RELATÓRIO FOTOGRÁFICO - 1753 - TANGARA DA SERRA.docx`
- `RELATÓRIO FOTOGRÁFICO - 1758 - TANGARA DA SERRA.docx`
- `RELATÓRIO FOTOGRÁFICO - 1760 - CUIABÁ.docx`

---

## 🔍 Cenário 4: Extrair Placeholders de Template

### Requisição HTTP

```http
GET /api/template-placeholders?template=MODELO%20-%203575%20-%20TANGARA%20DA%20SERRA.docx HTTP/1.1
Host: localhost:8000
Accept: application/json
```

### Resposta

```json
{
  "template": "MODELO - 3575 - TANGARA DA SERRA.docx",
  "placeholders": [
    {
      "key": "agencia_codigo",
      "type": "string",
      "required": true,
      "description": "Código/Prefixo da agência"
    },
    {
      "key": "agencia_nome",
      "type": "string",
      "required": true,
      "description": "Nome da agência"
    },
    {
      "key": "data_atendimento",
      "type": "date",
      "required": true,
      "description": "Data do primeiro atendimento"
    },
    {
      "key": "data_elaboracao",
      "type": "date",
      "required": false,
      "description": "Data de elaboração (auto-preenchida com hoje)"
    },
    {
      "key": "endereco",
      "type": "string",
      "required": true,
      "description": "Endereço completo da dependência"
    },
    {
      "key": "nr_os",
      "type": "string",
      "required": true,
      "description": "Número da Ordem de Serviço"
    },
    {
      "key": "responsavel_dependencia",
      "type": "string",
      "required": true,
      "description": "Matrícula + Nome do responsável"
    }
  ],
  "meta": {
    "total_placeholders": 7,
    "required_fields": 6
  }
}
```

### Lógica no Frontend

1. Recebe 7 placeholders
2. Filtra os **obrigatórios** (6 campos)
3. Remove `data_elaboracao` do formulário (auto-preenchida)
4. Renderiza 5 inputs + 1 hidden (data_elaboracao = hoje)

```typescript
const visibleFields = data.placeholders.filter(
  p => p.required && p.key !== "data_elaboracao"
);
// Resultado: 5 campos visíveis
```

---

## 💾 Cenário 5: Geração com Placeholders

### Requisição HTTP

```http
POST /api/generate-report-with-fields HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "pasta_raiz": "/home/user/fotos/OS_1753",
  "modelo": "MODELO - 3575 - TANGARA DA SERRA.docx",
  "pasta_saida": "/home/user/output",
  "conteudo": [
    "- Vista ampla",
    {"imagem": "/home/user/fotos/01.jpg"},
    {"imagem": "/home/user/fotos/02.jpg"},
    "»Área interna",
    {"imagem": "/home/user/fotos/03.jpg"}
  ],
  "tipo_relatorio": "tradicional",
  "meta_fields": {
    "nr_os": "1753",
    "data_elaboracao": "2026-05-01",
    "data_atendimento": "2026-04-28",
    "agencia_codigo": "3575",
    "agencia_nome": "TANGARA DA SERRA",
    "endereco": "Avenida Principal, 456, TANGARA DA SERRA, MT 78300-000",
    "responsavel_dependencia": "2024 - JOÃO SILVA"
  }
}
```

### Resposta (200 OK)

```json
{
  "success": true,
  "output_docx": "RELATÓRIO FOTOGRÁFICO - 1753 - TANGARA DA SERRA - 2026-05-01.docx",
  "url": "/download/RELATÓRIO FOTOGRÁFICO - 1753 - TANGARA DA SERRA - 2026-05-01.docx",
  "log_process": "✓ Scanner: 5 imagens lidas\n✓ Gerador: Relatório criado\n✓ Placeholders: 7 campos substituídos\n✓ Salvo em: /home/user/output/...",
  "meta_applied": {
    "nr_os": "1753",
    "data_elaboracao": "2026-05-01",
    "data_atendimento": "2026-04-28",
    "agencia_codigo": "3575",
    "agencia_nome": "TANGARA DA SERRA",
    "endereco": "Avenida Principal, 456, TANGARA DA SERRA, MT 78300-000",
    "responsavel_dependencia": "2024 - JOÃO SILVA"
  }
}
```

### O que aconteceu internamente

```
Backend Pipeline:
────────────────

1. Receber JSON com meta_fields
   ✅

2. Validar meta_fields
   ✅ Todas as chaves são conhecidas (nr_os, agencia_codigo, etc.)
   ✅ Nenhum valor ultrapassa 500 caracteres
   ✅ data_elaboracao foi auto-gerada com valor "2026-05-01"

3. Chamar generator.py
   ✅ Leu fotos de /home/user/fotos/OS_1753
   ✅ Montou estrutura (- Vista ampla, »Área interna)
   ✅ Inseriu 5 imagens
   ✅ Gerou RELATÓRIO...docx na pasta output

4. Abrir .docx gerado
   ✅ Carregou com python-docx

5. Iterar parágrafos
   ✅ Encontrou "{{agencia_codigo}}" no parágrafo 4
   ✅ Substituiu por "3575"
   ✅ Encontrou "{{agencia_nome}}" no parágrafo 4
   ✅ Substituiu por "TANGARA DA SERRA"
   ✅ ... (repetiu para todos 7 placeholders)

6. Iterar tabelas
   ✅ Tabela 1: {{nr_os}} → "1753"
   ✅ Tabela 1: {{responsavel_dependencia}} → "2024 - JOÃO SILVA"
   ✅ ... (restante)

7. Salvar arquivo
   ✅ Sobrescreveu documento com substituições

8. Retornar resposta
   ✅ JSON com sucesso, log e URL de download
```

---

## 📋 Cenário 6: Mapeamento Exato Portal → Formulário

### Dados do Portal (como aparecem)

```
Visualizar OS → 1753 - CARMOPOLIS DE MINAS
├─ Dependência: 1753 - TANGARA DA SERRA (antes do hífen = TANGARA DA SERRA)
├─ Prefixo/SB: 3575
├─ Endereço da Dependência: Avenida Principal, 456 — TANGARA DA SERRA, MT 78300-000
├─ Responsável: JOÃO SILVA (Matrícula: 2024)
└─ Atualizações:
    ├─ 2026-04-28 10:15 — Fornecedor Acionado ← Data de Atendimento
    ├─ 2026-04-29 14:30 — Visita Agendada
    ├─ 2026-04-30 09:00 — Visita Realizada
    └─ 2026-05-01 11:00 — Fotos Coletadas
```

### Extração para Formulário

| Campo do Formulário | Origem no Portal | Transformação |
|---|---|---|
| **Nr. Ordem de Serviço** | Título: "1753 - ..." | Extrair número: `1753` |
| **Agência (Código)** | Prefixo/SB | Copiar direto: `3575` |
| **Agência (Nome)** | Dependência: "XXXX - YYY" | Pegar antes do hífen: `TANGARA DA SERRA` |
| **Data de Atendimento** | 1ª entrada de "Fornecedor Acionado" | Usar data: `2026-04-28` |
| **Endereço da Dependência** | "Endereço da Dependência" | Copiar exato: `Av. Principal, 456...` |
| **Responsável da Dependência** | Matrícula + Nome | Concatenar: `2024 - JOÃO SILVA` |
| **Data de Elaboração** | *(Não existe no portal)* | Gerar automaticamente: `2026-05-01` (hoje) |

---

## 🎨 Cenário 7: Design do Formulário no Frontend

### Estado: Carregando

```
┌──────────────────────────────────────────┐
│  Carregando formulário...                 │
│  ⏳                                       │
└──────────────────────────────────────────┘
```

### Estado: Renderizado (com 5 campos)

```
┌──────────────────────────────────────────┐
│ PREENCHER INFORMAÇÕES DO RELATÓRIO       │
├──────────────────────────────────────────┤
│                                          │
│ Número da Ordem de Serviço *             │
│ ┌────────────────────────────────────┐   │
│ │ 1753                               │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Código/Prefixo da Agência *              │
│ ┌────────────────────────────────────┐   │
│ │ 3575                               │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Nome da Agência *                        │
│ ┌────────────────────────────────────┐   │
│ │ TANGARA DA SERRA                   │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Data de Atendimento *                    │
│ ┌────────────────────────────────────┐   │
│ │ 2026-04-28                    ▼   │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Endereço da Dependência *                │
│ ┌────────────────────────────────────┐   │
│ │ Av. Principal, 456, TANGARA DA     │   │
│ │ SERRA, MT 78300-000                │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Matrícula + Responsável *                │
│ ┌────────────────────────────────────┐   │
│ │ 2024 - JOÃO SILVA                  │   │
│ └────────────────────────────────────┘   │
│                                          │
│    ┌──────────────────────────────┐      │
│    │  🚀 GERAR RELATÓRIO          │      │
│    └──────────────────────────────┘      │
│                                          │
│ ℹ️ Data de Elaboração: 2026-05-01       │
│    (auto-preenchida com a data de hoje) │
│                                          │
└──────────────────────────────────────────┘
```

### Estado: Enviando

```
┌──────────────────────────────────────────┐
│ Gerando relatório...                     │
│ ████████████░░░░░░░░ 60%                │
│                                          │
│ Etapas:                                  │
│ ✅ Lendo pastas de fotos                 │
│ ✅ Gerando estrutura do relatório        │
│ ⏳ Substituindo placeholders...          │
│ ⏳ Salvando arquivo...                   │
└──────────────────────────────────────────┘
```

### Estado: Sucesso

```
┌──────────────────────────────────────────┐
│ ✅ Relatório gerado com sucesso!        │
│                                          │
│ 📄 RELATÓRIO - 1753 - TANGARA...docx    │
│    (2.5 MB)                              │
│                                          │
│ [📥 FAZER DOWNLOAD]  [📂 ABRIR PASTA]   │
│                                          │
│ Campos preenchidos:                      │
│ • OS: 1753                               │
│ • Agência: TANGARA DA SERRA (3575)      │
│ • Data Elaboração: 2026-05-01            │
│ • Data Atendimento: 2026-04-28           │
│ • Responsável: 2024 - JOÃO SILVA         │
│                                          │
│ [VOLTAR AO FORMULÁRIO]                  │
│                                          │
└──────────────────────────────────────────┘
```

### Estado: Erro

```
┌──────────────────────────────────────────┐
│ ❌ Erro ao gerar relatório              │
│                                          │
│ Campo obrigatório faltando:              │
│ • Número da Ordem de Serviço             │
│                                          │
│ Por favor, preencha todos os campos      │
│ marcados com *                           │
│                                          │
│            [FECHAR]                      │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🧪 Cenário 8: Teste da Função `extract_placeholders()`

### Input (arquivo `.docx`)

```
Documento: MODELO - 3575 - TANGARA DA SERRA.docx

Conteúdo:
- Parágrafo 1: "Agência: {{agencia_codigo}} — {{agencia_nome}}"
- Parágrafo 2: "Endereço: {{endereco}}"
- Tabela 1, Célula 1: "Data: {{data_elaboracao}}"
- Tabela 1, Célula 2: "Atendimento: {{data_atendimento}}"
- Parágrafo 3: "OS: {{nr_os}}"
- Parágrafo 4: "Responsável: {{responsavel_dependencia}}"
```

### Execução

```python
>>> from word_utils import extract_placeholders
>>> placeholders = extract_placeholders("MODELO - 3575 - TANGARA DA SERRA.docx")
>>> print(placeholders)
['agencia_codigo', 'agencia_nome', 'data_atendimento', 'data_elaboracao', 
 'endereco', 'nr_os', 'responsavel_dependencia']
>>> len(placeholders)
7
```

### Output

```
7 placeholders encontrados (deduplicados e ordenados):
✅ agencia_codigo
✅ agencia_nome
✅ data_atendimento
✅ data_elaboracao
✅ endereco
✅ nr_os
✅ responsavel_dependencia
```

---

## 🧪 Cenário 9: Teste da Função `substitute_placeholders()`

### Input

```python
template_path = "MODELO - 3575 - TANGARA DA SERRA.docx"

meta_fields = {
    "nr_os": "1753",
    "data_elaboracao": "2026-05-01",
    "data_atendimento": "2026-04-28",
    "agencia_codigo": "3575",
    "agencia_nome": "TANGARA DA SERRA",
    "endereco": "Av. Principal, 456, TANGARA DA SERRA, MT 78300-000",
    "responsavel_dependencia": "2024 - JOÃO SILVA"
}
```

### Execução

```python
>>> from word_utils import substitute_placeholders
>>> result_bytes = substitute_placeholders(template_path, meta_fields)
>>> 
>>> # Salvar temporariamente para verificar
>>> with open("/tmp/resultado_teste.docx", "wb") as f:
...     f.write(result_bytes)
>>> 
>>> # Verificar resultado
>>> from docx import Document
>>> from io import BytesIO
>>> doc_result = Document(BytesIO(result_bytes))
>>> print(doc_result.paragraphs[0].text)
"Agência: 3575 — TANGARA DA SERRA"
```

### Output

```
✅ Substituição bem-sucedida!

Antes:
  "Agência: {{agencia_codigo}} — {{agencia_nome}}"

Depois:
  "Agência: 3575 — TANGARA DA SERRA"

Todos os 7 placeholders foram substituídos corretamente.
Arquivo salvo em: /tmp/resultado_teste.docx
```

---

## 📊 Resumo de Dados (Quick Reference)

### Os 7 Placeholders

| # | Placeholder | Tipo | Obrigatório | Auto-gerado | Exemplo |
|---|---|---|---|---|---|
| 1 | `nr_os` | string | ✅ | ❌ | `1753` |
| 2 | `agencia_codigo` | string | ✅ | ❌ | `3575` |
| 3 | `agencia_nome` | string | ✅ | ❌ | `TANGARA DA SERRA` |
| 4 | `data_atendimento` | date | ✅ | ❌ | `2026-04-28` |
| 5 | `endereco` | string | ✅ | ❌ | `Av. Principal, 456...` |
| 6 | `responsavel_dependencia` | string | ✅ | ❌ | `2024 - JOÃO SILVA` |
| 7 | `data_elaboracao` | date | ✅ | ✅ | `2026-05-01` |

### Fluxo de Dados Resumido

```
Portal → Usuário preenche Formulário → Backend recebe meta_fields 
   ↓
Backend executa:
  1. Gera relatório base (generator.py)
  2. Substitui {{campos}} por meta_fields (word_utils.py)
  3. Retorna .docx final
   ↓
Frontend oferece download
```

---

**Versão:** 3.2 | **Data:** 2026-05-01 | **Status:** Exemplos Práticos ✅
