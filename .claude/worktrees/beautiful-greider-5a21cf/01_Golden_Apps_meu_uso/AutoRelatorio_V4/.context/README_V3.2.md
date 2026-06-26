# 📖 AutoRelatorio v3.2 — Documentação Completa

**Planejamento de implementação do sistema de placeholders dinâmicos**

> **Data:** 2026-05-01 | **Versão:** 3.2 | **Status:** Planejamento Completo ✅

---

## 🎯 O Que Muda na v3.2?

Antes (**v3.1**):
```
❌ Preencher manualmente campos no Word
❌ ~5 min por relatório
❌ Risco de erro (digitação errada)
```

Depois (**v3.2**):
```
✅ Formulário automático com 5 campos
✅ ~1 min por relatório
✅ Sem risco de erro (substituição automática)
✅ Relatório 100% preenchido
```

---

## 📚 Documentação por Propósito

### 1️⃣ **Quer Entender o Projeto Completo?**
👉 Comece por: **[PLANEJAMENTO_V3.2.md](./PLANEJAMENTO_V3.2.md)**

- Visão geral da arquitetura
- O que são placeholders (7 campos)
- Campos fixos vs dinâmicos
- Fluxo de dados end-to-end
- Estrutura de diretórios
- Checklist de implementação

**Tempo de leitura:** 15-20 min

---

### 2️⃣ **Precisa Implementar? Vou Programar!**
👉 Comece por: **[DETALHES_TECNICO_V3.2.md](./DETALHES_TECNICO_V3.2.md)**

- Código-fonte esperado (pseudocódigo real)
- Funções Python: `extract_placeholders()`, `substitute_placeholders()`
- Endpoints FastAPI: GET/POST especificados
- Componente React: `FormularioDinamico.tsx` completo
- Integração com código existente
- Validações de segurança
- Testes unitários sugeridos

**Tempo de leitura:** 20-30 min  
**Tempo de implementação:** 10-12 horas

---

### 3️⃣ **Quer Ver Exemplos Reais?**
👉 Comece por: **[EXEMPLOS_PRATICOS_V3.2.md](./EXEMPLOS_PRATICOS_V3.2.md)**

- Cenários de uso completos (9 cenários)
- Dados reais de uma OS (1753)
- Transformação de templates (antes/depois)
- Requisições/respostas HTTP exatas
- Fluxo de formulário passo-a-passo
- Casos de teste com outputs esperados
- Mapeamento exato: Portal → Formulário

**Tempo de leitura:** 15 min  
**Uso:** Referência durante desenvolvimento

---

### 4️⃣ **Qual é o Timeline? Por Onde Começo?**
👉 Comece por: **[ROADMAP_V3.2.md](./ROADMAP_V3.2.md)**

- Timeline (12 horas total)
- 6 fases de desenvolvimento
- Dependências entre fases
- Checklist de cada fase
- Matriz de responsabilidades
- Checklist pré-implementação
- Go-live checklist

**Tempo de leitura:** 10 min  
**Uso:** Acompanhar progresso do projeto

---

## 🗂️ Estrutura de Pastas Esperada

```
AutoRelatorio_V3.2/
├── .context/
│   ├── README_V3.2.md                    ← Você está aqui
│   ├── PLANEJAMENTO_V3.2.md              ← Visão geral
│   ├── DETALHES_TECNICO_V3.2.md          ← Implementação
│   ├── EXEMPLOS_PRATICOS_V3.2.md         ← Exemplos reais
│   └── ROADMAP_V3.2.md                   ← Timeline
│
├── APP/
│   ├── backend/
│   │   ├── server.py                     ← Endpoints (modificar)
│   │   ├── word_utils.py                 ← Funções (adicionar)
│   │   ├── generator.py                  ← Gerador (manter)
│   │   ├── templates/                    ← 9 templates Word
│   │   │   ├── MODELO - 0908 - SÃO PAULO.docx
│   │   │   ├── MODELO - 1507 - CUIABÁ.docx
│   │   │   ├── MODELO - 3575 - TANGARA DA SERRA.docx
│   │   │   └── ... (outros 6)
│   │   └── output/                       ← Relatórios gerados
│   │
│   └── frontend/
│       ├── components/
│       │   └── FormularioDinamico.tsx    ← Novo componente
│       └── app/
│           └── page.tsx                  ← Integração
│
└── DOCUMENTOS/
    └── (Outros documentos do projeto)
```

---

## 🚀 Como Usar Esta Documentação

### Cenário A: Você vai implementar
1. Leia **PLANEJAMENTO_V3.2.md** (10 min) — Entenda o escopo
2. Leia **DETALHES_TECNICO_V3.2.md** (20 min) — Veja o que programar
3. Leia **EXEMPLOS_PRATICOS_V3.2.md** (10 min) — Verifique com dados reais
4. Use **ROADMAP_V3.2.md** — Acompanhe o progresso

### Cenário B: Você vai revisar o código
1. Comece por **DETALHES_TECNICO_V3.2.md** — Especificações esperadas
2. Verifique com **EXEMPLOS_PRATICOS_V3.2.md** — Testes sugeridos
3. Confirme em **PLANEJAMENTO_V3.2.md** — Contexto geral

### Cenário C: Você vai editar templates
1. Leia **EXEMPLOS_PRATICOS_V3.2.md** (Seção 2) — Veja exemplo de template
2. Leia **PLANEJAMENTO_V3.2.md** (Seção "Templates: Mudanças Necessárias")
3. Siga **DETALHES_TECNICO_V3.2.md** (Seção 5) — Especificação de edição

### Cenário D: Você quer entender o impacto
1. Leia **PLANEJAMENTO_V3.2.md** (Seção "Visão Geral")
2. Leia **ROADMAP_V3.2.md** (Seção "Timeline" e "Métricas de Sucesso")
3. Verifique **EXEMPLOS_PRATICOS_V3.2.md** (Cenários reais)

---

## 📋 Resumo Executivo (2 min)

**O que:**  
Sistema automático para preencher relatórios Word com dados de Ordens de Serviço.

**Como:**  
Usuário preenche formulário com 5 dados (OS, Agência, Data, Endereço, Responsável) + 1 auto-preenchido (Data de hoje). Backend substitui automaticamente placeholders `{{campo}}` no template Word.

**Por quê:**  
- Mais rápido (5 min → 1 min)
- Sem erros (preenchimento automático)
- Mais consistente (mesmos padrões sempre)

**Quando:**  
12 horas de desenvolvimento (6 fases)

**Quem:**  
1 desenvolvedor (você ou equipe)

**Impacto:**  
- 9 templates atualizados
- 2 novos endpoints API
- 1 novo componente React
- Economia de 4 minutos por OS

---

## 🎓 Conceitos-Chave

### Placeholders
São marcadores no template Word: `{{campo}}`  
Exemplo: `Agência: {{agencia_codigo}} — {{agencia_nome}}`  
Backend substitui por valores reais: `Agência: 3575 — TANGARA DA SERRA`

### Meta Fields
Dictionary com pares chave-valor para substituição:
```json
{
  "nr_os": "1753",
  "agencia_codigo": "3575",
  "agencia_nome": "TANGARA DA SERRA",
  ...
}
```

### Campos Fixos
Valores que **não mudam** por OS (baked no template):
- Contrato: `2025.7421.3575`
- Elaboração: `Ygor Augusto Fernandes`
- UF: `MT`

### Campos Dinâmicos
Valores que **variam** por OS (vêm do formulário):
- OS, Agência, Data, Endereço, Responsável

---

## ✨ Principais Mudanças no Código

### Backend
```python
# word_utils.py — Novo
def extract_placeholders(docx_path) → List[str]
def substitute_placeholders(docx_path, meta_fields) → bytes

# server.py — Novo
@app.get("/api/template-placeholders")
@app.post("/api/generate-report-with-fields")
```

### Frontend
```typescript
// FormularioDinamico.tsx — Novo
<FormularioDinamico template={selected} onSubmit={handleSubmit} />
```

### Templates
```
9 arquivos .docx:
- Adicionar {{agencia_codigo}}, {{agencia_nome}}, etc.
- Preservar formatação existente
```

---

## 🧪 Testes Essenciais

```python
# Backend
✅ test_extract_placeholders() — Extrai {{campos}}
✅ test_substitute_placeholders() — Substitui valores
✅ test_endpoint_get_placeholders() — API retorna JSON
✅ test_endpoint_generate() — API retorna .docx válido

# Frontend
✅ test_form_renders() — Formulário aparece
✅ test_form_validation() — Valida campos obrigatórios
✅ test_form_submission() — Envia dados corretos
✅ test_e2e_complete() — Todo o fluxo funciona
```

---

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|---|---|
| Placeholder não é substituído | Verificar se está em run diferente no Word |
| Formulário não aparece | Template sem placeholders? (normal, não renderizar) |
| Date format errado | Usar padrão ISO: `YYYY-MM-DD` |
| API retorna erro 404 | Template não existe em `/templates/` |
| Test falha: "run.text read-only" | Usar `run.clear()` + `run.add_text()` |

---

## 📞 Dúvidas Frequentes

**P: Preciso modificar o `generator.py`?**  
R: Não! Mantém como está. Apenas adicione funções em `word_utils.py` e endpoints em `server.py`.

**P: E se o template não tiver placeholders?**  
R: Tudo bem! O sistema detecta que não há placeholders e não renderiza o formulário.

**P: Posso adicionar novos placeholders depois?**  
R: Sim! Basta editar o template + adicionar à `PLACEHOLDER_METADATA` em `server.py`.

**P: O que acontece com templates v3.1 (sem placeholders)?**  
R: Continuam funcionando normalmente. Modo tradicional não é afetado.

**P: Quanto tempo leva para implementar?**  
R: ~12 horas (6 fases). Pode ser paralelo (fases 1-2 com 4).

---

## 📊 Documentação por Tipo

### Para Leitura Rápida (5-10 min)
- ✅ Este arquivo (README_V3.2.md)
- ✅ Seção "Visão Geral" em PLANEJAMENTO_V3.2.md

### Para Implementação (20-30 min)
- ✅ DETALHES_TECNICO_V3.2.md (código completo)
- ✅ EXEMPLOS_PRATICOS_V3.2.md (testes reais)

### Para Acompanhamento (10 min)
- ✅ ROADMAP_V3.2.md (timeline + checklist)

### Para Manutenção Futura
- ✅ Toda a documentação
- ✅ Docstrings no código
- ✅ Comentários inline

---

## 🔗 Arquivos Principais

| Arquivo | Propósito | Tamanho | Leitura |
|---|---|---|---|
| README_V3.2.md | Este guia | ~ 3 KB | 5 min |
| PLANEJAMENTO_V3.2.md | Visão completa | ~ 15 KB | 15 min |
| DETALHES_TECNICO_V3.2.md | Especificações | ~ 20 KB | 20 min |
| EXEMPLOS_PRATICOS_V3.2.md | Casos reais | ~ 18 KB | 15 min |
| ROADMAP_V3.2.md | Timeline | ~ 12 KB | 10 min |

**Total:** ~70 KB de documentação  
**Tempo total de leitura:** ~65 min

---

## ✅ Checklist Pré-Desenvolvimento

Antes de começar a programar:

- [ ] Leu PLANEJAMENTO_V3.2.md
- [ ] Leu DETALHES_TECNICO_V3.2.md
- [ ] Entendeu o fluxo em EXEMPLOS_PRATICOS_V3.2.md
- [ ] Verificou ROADMAP_V3.2.md
- [ ] Python e Node.js instalados
- [ ] Repository clonado e atualizado
- [ ] Criou branch feature (`git checkout -b feature/v3.2-placeholders`)
- [ ] Backup dos templates feito
- [ ] Ambiente pronto (Python venv, npm install)

---

## 🎯 Próximas Ações

1. ✅ **Revisar esta documentação** (você está aqui)
2. ⏳ **Leia PLANEJAMENTO_V3.2.md** (15 min)
3. ⏳ **Leia DETALHES_TECNICO_V3.2.md** (20 min)
4. ⏳ **Leia EXEMPLOS_PRATICOS_V3.2.md** (15 min)
5. ⏳ **Leia ROADMAP_V3.2.md** (10 min)
6. ⏳ **Inicie Fase 1 Backend** (per ROADMAP)

---

## 📝 Versionamento da Documentação

| Versão | Data | Status | Nota |
|---|---|---|---|
| 3.2 | 2026-05-01 | ✅ Completa | Documentação planejamento |
| 3.2.1 | — | ⏳ Futuro | Após implementação |
| 3.2.2 | — | ⏳ Futuro | Após testes |

---

## 🙋 Perguntas?

Se tiver dúvidas sobre este planejamento:
1. Verifique as **FAQ** acima
2. Procure em **EXEMPLOS_PRATICOS_V3.2.md** por seu caso
3. Releia a seção específica em **DETALHES_TECNICO_V3.2.md**
4. Consulte **ROADMAP_V3.2.md** para timeline

---

## 📌 Lembrete

Esta é uma **documentação de planejamento** completa. Toda a análise técnica, exemplo de código, timeline e checklist estão prontos.

**Próximo passo:** Iniciar implementação conforme ROADMAP_V3.2.md

---

**Versão:** 3.2 | **Data:** 2026-05-01 | **Status:** Documentação Completa ✅  
**Criado por:** Claude AI | **Para:** Thiago Nascimento (TM-MEUS-APPS)

---

## 📚 Índice Rápido de Documentos

```
.context/
├── README_V3.2.md ..................... Este arquivo (início aqui)
├── PLANEJAMENTO_V3.2.md ............... Visão arquitetural completa
├── DETALHES_TECNICO_V3.2.md ........... Especificações de código
├── EXEMPLOS_PRATICOS_V3.2.md .......... Cenários reais com dados
└── ROADMAP_V3.2.md ................... Timeline + checklist

Leia na ordem: README → PLANEJAMENTO → DETALHES → EXEMPLOS → ROADMAP
```

---

**Boa leitura! 📖**
