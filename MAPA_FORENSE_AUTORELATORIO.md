# 🔬 MAPA FORENSE DO ECOSSISTEMA AUTORELATORIO
## Engenharia Reversa Completa — Gerado em 2026-05-25

> **Objetivo:** Maximizar reaproveitamento e evitar reconstrução desnecessária antes de qualquer desenvolvimento.

---

## 📍 ÍNDICE

1. [Árvore Completa de Projetos](#1-árvore-completa-de-projetos)
2. [Linha do Tempo Técnica](#2-linha-do-tempo-técnica)
3. [Mapa de Dependências](#3-mapa-de-dependências)
4. [Inventário de Módulos por Versão](#4-inventário-de-módulos-por-versão)
5. [Comparação V1–V5 (tabela mestre)](#5-comparação-v1v5-tabela-mestre)
6. [Análise de Regressões e Perdas na Migração](#6-análise-de-regressões-e-perdas-na-migração)
7. [Funções Equivalentes / Duplicadas](#7-funções-equivalentes--duplicadas)
8. [Módulos com Lógica Útil Escondida](#8-módulos-com-lógica-útil-escondida)
9. [Padrões Arquiteturais Recorrentes](#9-padrões-arquiteturais-recorrentes)
10. [Regras de Negócio Implícitas](#10-regras-de-negócio-implícitas)
11. [Biblioteca Interna Reutilizável (CORE)](#11-biblioteca-interna-reutilizável-core)
12. [Roadmap de Reaproveitamento para V5](#12-roadmap-de-reaproveitamento-para-v5)

---

## 1. ÁRVORE COMPLETA DE PROJETOS

```
TM-MEUS-APPS/
│
├── 01_Golden_Apps_meu_uso/              ← ATIVO
│   ├── AutoRelatorio_V2/               ← V2 (frontend sem backend real)
│   │   ├── APP/
│   │   │   ├── backend/                ← FastAPI básico
│   │   │   └── frontend/               ← Next.js (sem page.tsx funcional)
│   │   ├── dev/                        ← rascunhos
│   │   └── mapa_edicao.md              ★ DOC VALIOSO: fluxo de execução V1
│   │
│   ├── AutoRelatorio_V3/               ← V3 FUNCIONAL
│   │   └── APP/
│   │       ├── backend/
│   │       │   ├── server.py           ★ 20+ endpoints, 2 modos (Trad + SP)
│   │       │   ├── generator.py        ★ Scanner Tradicional
│   │       │   ├── generator_sp.py     ★ Scanner SP hierárquico
│   │       │   ├── word_utils.py       ★ Inserção Word Tradicional
│   │       │   ├── word_utils_sp.py    ★ Inserção Word SP
│   │       │   └── llm_generator.py    ★ Geração via IA (mock/real)
│   │       └── frontend/
│   │           └── app/page.tsx        ★ MONOLÍTICO 606 linhas (toda lógica)
│   │
│   ├── AutoRelatorio_V3.2/             ← V3.2 RECOMENDADA (placeholders)
│   │   └── APP/
│   │       ├── backend/
│   │       │   ├── word_utils.py       ★ +funções de placeholder (subset)
│   │       │   ├── routes.py           ★ endpoints específicos de placeholder
│   │       │   └── [herda V3]
│   │       └── frontend/
│   │           └── [herda V3]
│   │
│   └── AutoRelatorio_V4/               ← V4 EM DESENVOLVIMENTO
│       ├── APP/
│       │   ├── backend/
│       │   │   ├── server.py           ★ 3 modos (Trad + SP + SP2)
│       │   │   ├── generator.py        ★ Scanner Trad (v evoluída)
│       │   │   ├── generator_sp.py     ★ Scanner SP (v estável)
│       │   │   ├── generator_sp2.py    ★ Scanner SP2 (NOVO — contrato 1565)
│       │   │   ├── generator_app.py    ★ Scanner "modo app" (pasta plana)
│       │   │   ├── word_utils.py       ★ Trad + Placeholder + analisar_imagem
│       │   │   ├── word_utils_sp.py    ★ Inserção Word SP
│       │   │   ├── word_utils_sp2.py   ★ Inserção Word SP2 (NOVO, complexo)
│       │   │   ├── utils_sp.py         ★ parse_medidas + formatação SP
│       │   │   ├── utils_sp2.py        ★ parse_medidas SP2 + detectar_item
│       │   │   ├── routes.py           ★ API placeholders dinâmicos
│       │   │   └── llm_generator.py    ★ LLM context builder
│       │   └── frontend/
│       │       ├── app/page.tsx        ★ Entry point
│       │       ├── store/useAppStore.ts ★ Zustand store GLOBAL
│       │       └── components/
│       │           ├── AmbienteSelector.tsx    ★ Árvore 4 níveis
│       │           ├── ImageEditorModal.tsx    ★ Editor Fabric.js
│       │           ├── PreviewGrid.tsx         ★ Grid fotos
│       │           ├── SidebarWizard.tsx       ★ Wizard 6 passos
│       │           ├── ConsoleWatcher.tsx      ★ Log em tempo real
│       │           ├── FormularioDinamico.tsx  ★ Formulário placeholders
│       │           ├── ProgressOverlay.tsx     ★ Overlay de progresso
│       │           └── views/
│       │               ├── ConfiguracoesView.tsx
│       │               ├── ModelosView.tsx
│       │               ├── OrganizarView.tsx
│       │               └── RelatoriosView.tsx
│       └── docs/                        ★ Documentação técnica
│
├── 03_Arquivo_Morto_Legado/
│   ├── LEGADO - ANTIGOS/
│   │   ├── Legacy TM Relatorio/         ← PRÉ-V1 (Vite+React, funcional)
│   │   │   ├── App.tsx                  ★ Componente raiz (Vite SPA)
│   │   │   ├── extrair_itens_docx.py    ★ SCRIPT VALIOSO: extrator de itens
│   │   │   ├── AGENTS.md               ★ Design de agentes IA
│   │   │   └── migrated_prompt_history/ ★ Histórico de prompts GPT
│   │   │
│   │   ├── TM STUDIO RELATORIO/         ← PROTO-V1 (primeira FastAPI)
│   │   │   ├── server.py               ★ ORIGINAL — sem SP, só Trad
│   │   │   ├── generator.py            ★ Scanner original sem sort
│   │   │   ├── llm_generator.py        ★ LLM v1
│   │   │   └── templates/              ★ Templates originais
│   │   │
│   │   ├── TM Gerenciador V-2/          ← CMMS paralelo (Replit)
│   │   │   ├── components/             ★ 15 componentes React completos
│   │   │   │   ├── Dashboard.tsx       ★ Dashboard com métricas
│   │   │   │   ├── WorkOrders.tsx      ★ Lista de OS
│   │   │   │   ├── ImportOS.tsx        ★ Importar planilha xlsx
│   │   │   │   ├── PreventiveList.tsx  ★ Lista preventivas
│   │   │   │   ├── BalancoPreventivas.tsx ★ Balanço financeiro
│   │   │   │   ├── Reports.tsx         ★ Relatórios exportáveis
│   │   │   │   └── [+9 mais]
│   │   │   ├── lib/store.ts            ★ Estado global Zustand/local
│   │   │   └── lib/types.ts            ★ Tipos TypeScript completos
│   │   │
│   │   └── TM - Lista de nomes pastas logica/ ← Lógica de nomes de pasta
│   │
│   └── Versões legadas/
│       ├── TM Relatorio/               ← TM Relatorio base (2025)
│       │   ├── generator.py            ★ sort natural básico
│       │   └── word_utils.py           ★ inserção básica
│       │
│       ├── NX Relatorios/              ← NX base (UI sóbria, lógica básica)
│       │   ├── dev/                    ★ histórico de commits (walkthrough)
│       │   └── nextjs-frontend/        ★ Next.js com SidebarWizard
│       │
│       ├── NX Relatorios SP/           ← NX + SP (fusão 1)
│       ├── NX Relatorios SP - Mais atualizado/ ← FUSÃO MAIS COMPLETA
│       │   ├── APP/backend/
│       │   │   ├── generator.py        ★ sort duplo: "Vista ampla" + numérico
│       │   │   ├── generator_sp.py     ★ SP hierárquico completo
│       │   │   ├── word_utils.py       ★ Tradicional
│       │   │   ├── word_utils_sp.py    ★ SP com tabelas
│       │   │   └── utils_sp.py         ★ parse_medidas + formatar_descricao
│       │   └── APP/frontend/           ★ Next.js modular (mesmo nível V4)
│       │
│       ├── NX Relatorios SP Up/        ← SP Up (iteração com análise UX)
│       │   └── Análise Crítica de UX_UI.md ★ VALIOSO: crítica detalhada
│       │
│       └── TM Relatorio SP/            ← SP funcional dark mode
│           └── app/page.tsx            ★ 606 linhas, toda lógica embutida
│
└── [raiz]/
    ├── RELATORIO_AUTORELATORIO_TODAS_VERSOES.md ★ Guia para não-técnicos
    ├── VALIDACAO_LOGICA_V4_vs_V3.md             ★ Validação técnica formal
    ├── MAPA_REPOSITORIO.md                      ★ Estrutura organizacional
    └── AutoRelatorio-v3.2-Design-System-TM.html ★ Design system HTML
```

---

## 2. LINHA DO TEMPO TÉCNICA

```
2024 (?)
  │
  ├─ [PRÉ-HISTÓRICO] TM Extrator
  │   └─ Vite + React puro, sem backend Python
  │   └─ Extração de itens de DOCX manualmente
  │
2025 Q1
  │
  ├─ [PROTO-V1] Legacy TM Relatorio
  │   ├─ Vite SPA com App.tsx
  │   ├─ Python simples sem FastAPI
  │   └─ Sem modos SP
  │
  ├─ [PROTO-V2] TM Studio Relatorio
  │   ├─ PRIMEIRA FastAPI
  │   ├─ generator.py sem sort natural
  │   ├─ llm_generator v1
  │   └─ Apenas modo Tradicional
  │
2025 Q2
  │
  ├─ [V0.9] TM Relatorio (legado)
  │   ├─ Sort natural básico (numérico)
  │   └─ word_utils simples
  │
  ├─ [V0.95] NX Relatorios
  │   ├─ UI Sóbria Next.js (NX design)
  │   ├─ SidebarWizard, PreviewGrid, ConsoleWatcher
  │   └─ Lógica básica (sem SP)
  │
  ├─ [V0.97] TM Relatorio SP
  │   ├─ Modo SP completo (dark mode)
  │   ├─ page.tsx monolítico 606 linhas
  │   └─ generator_sp.py hierárquico
  │
  ├─ [V0.99] NX Relatorios SP (fusão)
  │   ├─ UI do NX + Lógica do TM SP
  │   ├─ Documento: detalhes_diferencas.md
  │   └─ PLANO: criar AutoRelatorioV1
  │
  ├─ [NX SP Mais Atualizado] ← PONTO DE TRANSIÇÃO
  │   ├─ utils_sp.py: parse_medidas_arquivo + formatar_descricao_tecnica
  │   ├─ dump.json: debugging de conteúdo
  │   └─ test_castejon.py + test_sp.py
  │
2026 Q1 (Março)
  │
  ├─ [V2] AutoRelatorio_V2 — scaffold criado 19/04/2026
  │   ├─ Next.js modular
  │   ├─ Backend FastAPI básico (sem generator.py real)
  │   ├─ Planejamento: AmbienteSelector, Editor, Drag-drop
  │   └─ STATUS: frontend OK, backend incompleto
  │
2026 Q2 (Abril–Maio)
  │
  ├─ [V3] AutoRelatorio_V3 — PRIMEIRA VERSÃO COMPLETA
  │   ├─ FastAPI 20+ endpoints
  │   ├─ Dois modos: Tradicional + SP
  │   ├─ Fabric.js (editor imagens)
  │   ├─ AmbienteSelector 4 níveis (portado do V2 plan)
  │   └─ STATUS: 100% funcional
  │
  ├─ [V3.2] AutoRelatorio_V3.2 — PLACEHOLDERS (03/05/2026)
  │   ├─ Sistema {{campo}} dinâmico
  │   ├─ 7 placeholders definidos
  │   ├─ routes.py + word_utils atualizado
  │   ├─ 70+ testes pytest
  │   └─ STATUS: PRODUCTION READY
  │
  ├─ [V4] AutoRelatorio_V4 — EM DESENVOLVIMENTO (12/05/2026)
  │   ├─ SP2: Contrato 1565 (São José do Rio Preto)
  │   ├─ reading_mode: "disco" + "app" (pasta plana)
  │   ├─ Zustand store global
  │   ├─ Views separadas (4 telas)
  │   ├─ generator_sp2.py: croquis, múltiplas paredes, fator faces
  │   └─ STATUS: Em desenvolvimento
  │
2026 Q3 (planejado)
  │
  └─ [V5] AutoRelatorio_V5 — PRÓXIMA GERAÇÃO
      └─ (ver roadmap seção 12)
```

---

## 3. MAPA DE DEPENDÊNCIAS

```
                    ┌─────────────────────────────────────────────────────┐
                    │              FRONTEND (Next.js 15+)                  │
                    │                                                      │
                    │  useAppStore.ts (Zustand)                            │
                    │       │                                              │
                    │  ┌────┴─────────────────────────────────────┐       │
                    │  │                                          │       │
                    │  AppShell.tsx                    page.tsx   │       │
                    │       │                                     │       │
                    │  ┌────┴──────────────────────┐             │       │
                    │  │ Views                     │             │       │
                    │  │  OrganizarView.tsx         │             │       │
                    │  │  RelatoriosView.tsx        │             │       │
                    │  │  ModelosView.tsx           │             │       │
                    │  │  ConfiguracoesView.tsx     │             │       │
                    │  └───────────────────────────┘             │       │
                    │       │                                     │       │
                    │  ┌────┴──────────────────────────────────┐ │       │
                    │  │ Components                            │ │       │
                    │  │  AmbienteSelector.tsx                 │ │       │
                    │  │  ImageEditorModal.tsx (Fabric.js)     │ │       │
                    │  │  PreviewGrid.tsx                      │ │       │
                    │  │  SidebarWizard.tsx                    │ │       │
                    │  │  ConsoleWatcher.tsx                   │ │       │
                    │  │  FormularioDinamico.tsx               │ │       │
                    │  │  ProgressOverlay.tsx                  │ │       │
                    │  └───────────────────────────────────────┘ │       │
                    └─────────────────────────────────────────────────────┘
                                          │ HTTP (porta 5000)
                                          │
                    ┌─────────────────────▼───────────────────────────────┐
                    │              BACKEND (FastAPI + Uvicorn)              │
                    │                                                      │
                    │  server.py ──── routes.py (placeholders)            │
                    │       │                                              │
                    │  ┌────┴──────────────────────────────────────────┐  │
                    │  │           SCANNERS (generators)               │  │
                    │  │                                               │  │
                    │  │  generator.py          ← Modo Tradicional    │  │
                    │  │  generator_sp.py       ← Modo SP             │  │
                    │  │  generator_sp2.py      ← Modo SP2 (1565)     │  │
                    │  │  generator_app.py      ← Modo App (plano)    │  │
                    │  └────────────────────────────────────────────── ┘  │
                    │       │                                              │
                    │  ┌────┴──────────────────────────────────────────┐  │
                    │  │          WORD BUILDERS (word_utils)            │  │
                    │  │                                               │  │
                    │  │  word_utils.py         ← Inserção Trad       │  │
                    │  │  word_utils_sp.py      ← Inserção SP         │  │
                    │  │  word_utils_sp2.py     ← Inserção SP2        │  │
                    │  └───────────────────────────────────────────────┘  │
                    │       │                                              │
                    │  ┌────┴──────────────────────────────────────────┐  │
                    │  │          UTILITÁRIOS (utils)                  │  │
                    │  │                                               │  │
                    │  │  utils_sp.py     ← parse_medidas SP          │  │
                    │  │  utils_sp2.py    ← parse_medidas SP2         │  │
                    │  │  llm_generator.py ← Build de prompts IA      │  │
                    │  └───────────────────────────────────────────────┘  │
                    │                                                      │
                    │  templates/  ← 9 arquivos .docx (por contrato)      │
                    │  output/     ← Relatórios gerados                   │
                    └─────────────────────────────────────────────────────┘
```

---

## 4. INVENTÁRIO DE MÓDULOS POR VERSÃO

### 🔴 TM Studio (Proto-V1) — `LEGADO - ANTIGOS/TM STUDIO RELATORIO`
| Arquivo | Status | Lógica preservada? |
|---------|--------|-------------------|
| server.py | Arquivado | Sim → portado para V3 |
| generator.py | Arquivado | Sim → portado (sem sort natural) |
| llm_generator.py | Arquivado | Sim → portado |
| word_utils.py | Arquivado | Sim → portado |

### 🟡 NX Relatorios SP Mais Atualizado — PONTO DE FUSÃO PRINCIPAL
| Arquivo | Status | Lógica preservada? |
|---------|--------|-------------------|
| generator.py | Arquivado | ✅ Portado para V3/V4 |
| generator_sp.py | Arquivado | ✅ Portado para V3/V4 |
| word_utils_sp.py | Arquivado | ✅ Portado para V3/V4 |
| **utils_sp.py** | Arquivado | ✅ IDÊNTICO ao V4 (código 100% igual) |
| test_castejon.py | Arquivado | ⚠️ Teste ainda válido |
| test_sp.py | Arquivado | ⚠️ Teste ainda válido |
| dump.json | Arquivado | 🔍 Debug valioso |

### 🟢 V3 — `AutoRelatorio_V3`
| Arquivo | Status | Funções chave |
|---------|--------|--------------|
| server.py | Ativo | 20+ endpoints (scan, generate, download, open-folder, tkinter) |
| generator.py | Ativo | build_content_from_root, folder_sort_key, generate_report, run_all |
| generator_sp.py | Ativo | build_content_sp, _natural_sort_key, run_all_sp |
| word_utils.py | Ativo | inserir_conteudo, analisar_imagem, substituir_placeholders |
| word_utils_sp.py | Ativo | inserir_conteudo_sp, set_cell_background |
| llm_generator.py | Ativo | build_super_prompt, call_llm_with_services, mock_call_llm_api |
| page.tsx (frontend) | Ativo | MONOLÍTICO — toda lógica em ~606 linhas |

### 🟢 V3.2 — `AutoRelatorio_V3.2` (baseada em V3)
| Arquivo | Status | Novidades |
|---------|--------|-----------|
| word_utils.py | Ativo | + extract_placeholders, substitute_placeholders, validate_substitutions |
| routes.py | Ativo | endpoints: GET /templates, POST /generate-with-fields, GET /download, GET /health |
| requirements-test.txt | Ativo | pytest + pytest-cov |
| test_*.py (5 arquivos) | Ativo | 70+ testes |

### 🚀 V4 — `AutoRelatorio_V4` (baseada em V3.2)
| Arquivo | Status | Novidades |
|---------|--------|-----------|
| generator_sp2.py | Ativo | Scanner SP2 completo (croquis, faces, itens) |
| word_utils_sp2.py | Ativo | Builder SP2 completo (tabelas complexas) |
| generator_app.py | Ativo | Scanner "modo app" (pasta plana) |
| utils_sp2.py | Ativo | parse_medidas_sp2, detectar_item_por_pasta, e_croqui |
| useAppStore.ts | Ativo | Zustand store — estado global completo |
| views/ (4 telas) | Ativo | Separação de views por responsabilidade |
| organizar/ | Ativo | DocxPreviewPanel, PhotoGrid, ContextMenu, CTABar |

---

## 5. COMPARAÇÃO V1–V5 (TABELA MESTRE)

| Funcionalidade | Proto-V1 | V2 | V3 | V3.2 | V4 |
|----------------|----------|----|----|------|----|
| **Backend FastAPI** | ✅ | ✅ básico | ✅ completo | ✅ completo | ✅ completo |
| **Scanner Tradicional** | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Scanner SP** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Scanner SP2 (1565)** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Scanner "modo app"** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Sort natural numérico** | ❌ | — | ✅ | ✅ | ✅ |
| **Sort "Vista ampla" first** | ❌ | — | ✅ | ✅ | ✅ |
| **Sort "Detalhes" last** | ❌ | — | ✅ | ✅ | ✅ |
| **9 Templates .docx** | parcial | ❌ | ✅ | ✅ | ✅ |
| **Placeholders {{campo}}** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Editor de imagens (Fabric.js)** | ❌ | plano | ✅ | ✅ | ✅ |
| **AmbienteSelector 4 níveis** | ❌ | plano | ✅ | ✅ | ✅ |
| **Multi-seleção de fotos** | ❌ | plano | ✅ | ✅ | ✅ |
| **ConsoleWatcher (logs em tela)** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **LLM Generator** | ✅ v1 | ❌ | ✅ v2 | ✅ v2 | ✅ v3 |
| **Wizard 6 passos (sidebar)** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Zustand store global** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Cálculo de m² automático** | ❌ | plano | ✅ SP | ✅ SP | ✅ SP+SP2 |
| **Croquis técnicos** | ❌ | ❌ | ❌ | ❌ | ✅ SP2 |
| **Tabela memória de cálculo** | ❌ | ❌ | ✅ SP | ✅ SP | ✅ SP+SP2 |
| **Múltiplas paredes por item** | ❌ | ❌ | ❌ | ❌ | ✅ SP2 |
| **Fator faces (×2 área)** | ❌ | ❌ | ❌ | ❌ | ✅ SP2 |
| **70+ testes pytest** | 2 | ❌ | poucos | ✅ 70+ | ✅ |
| **DocxPreviewPanel** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Views separadas** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Dark mode toggle** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **tkinter file picker** | ❌ | ❌ | ✅ | ✅ | ✅ |

---

## 6. ANÁLISE DE REGRESSÕES E PERDAS NA MIGRAÇÃO

### 🔴 PERDAS CONFIRMADAS (não portadas ou degradadas)

#### 1. **`extrair_itens_docx.py`** — Legacy TM Relatorio
- **O que é:** Script Python standalone que extrai itens de um .docx de relatório
- **Status:** Existe somente em `Legacy TM Relatorio/`, nunca portado
- **Risco:** Funcionalidade de extração retroativa perdida
- **Ação:** Portar para V5 como endpoint `/api/extrair-itens`

#### 2. **Validação de UX do NX SP Up**
- **O que é:** Análise crítica detalhada de UX/UI do painel de preview
- **Status:** `NX Relatorios SP Up/Análise Crítica de UX_UI.md` — nunca implementada
- **Risco:** Problemas de UX conhecidos não corrigidos
- **Ação:** Ler e aplicar recomendações antes de V5

#### 3. **`TM Gerenciador V-2` — 15 componentes CMMS**
- **O que é:** Sistema completo de gestão de OS (Ordens de Serviço)
- **Componentes:** Dashboard, WorkOrders, ImportOS, Reports, BalancoPreventivas...
- **Status:** Completamente separado, nunca integrado ao AutoRelatório
- **Potencial:** ImportOS.tsx pode reusar lógica de importar planilhas xlsx

#### 4. **`formatar_descricao_tecnica` em utils_sp.py legado**
- **O que é:** Gera texto narrativo com marcador `<RED>...</RED>` para colorir no Word
- **Status:** Existe em legado e em V4, mas a função `<RED>` não tem correspondência testada em `word_utils_sp.py` atual
- **Risco:** Texto em vermelho pode não estar sendo aplicado
- **Verificar:** `inserir_conteudo_sp` em V4 processa `<RED>`?

#### 5. **`gerar_ipuiuna.py`** — V4 backend
- **O que é:** Script específico para gerar relatório da agência Ipuiuna
- **Status:** Existe no backend V4 mas não está documentado nem integrado
- **Ação:** Verificar se é one-off ou padrão reutilizável

#### 6. **`insert_placeholders_in_templates.py`** — V4 backend
- **O que é:** Script que insere placeholders em todos os 9 templates em batch
- **Status:** Existe mas não está documentado como parte do fluxo
- **Ação:** Documentar como ferramenta de manutenção

#### 7. **`dump.json`** — NX SP Mais atualizado
- **O que é:** Snapshot do array `conteudo` de debugging
- **Status:** Arquivado, nunca virou fixture de teste
- **Ação:** Converter em fixture pytest para testes de regressão

#### 8. **`migrated_prompt_history/`** — Legacy TM Relatorio
- **O que é:** Histórico de prompts enviados ao GPT durante desenvolvimento inicial
- **Status:** Nunca analisado sistematicamente
- **Ação:** Extrair regras de negócio implícitas dos prompts

---

## 7. FUNÇÕES EQUIVALENTES / DUPLICADAS

### 🟡 DUPLICATAS CONFIRMADAS (mesma lógica, arquivos diferentes)

| Função | Ocorrências | Arquivo atual canônico |
|--------|-------------|----------------------|
| `parse_medidas_arquivo` | `utils_sp.py` legado ≡ `utils_sp.py` V4 | `V4/utils_sp.py` (idêntico) |
| `formatar_moeda_texto` | `utils_sp.py` legado ≡ `V4/utils_sp.py` | `V4/utils_sp.py` |
| `_natural_sort_key` | `generator.py` (múltiplas versões) | `V4/generator.py` |
| `folder_sort_key` | `generator.py` todas as versões | `V4/generator.py` (mais completo) |
| `_default_logger` | Todo generator*.py | Copiar e não refatorar (simples) |
| `set_cell_background` | `word_utils_sp.py` V3, V4, legado | `V4/word_utils_sp.py` |
| `inserir_conteudo` | `word_utils.py` todas as versões | `V4/word_utils.py` (mais completo) |
| `substituir_placeholders` | `word_utils.py` V3, V3.2, V4 | `V4/word_utils.py` (com extract_placeholders) |
| `build_super_prompt` | `llm_generator.py` V3 e V4 | `V4/llm_generator.py` |
| `DESCRICOES_OPCOES` | `server.py` V3 e V4 | `V4/server.py` |
| `ScanRequest` (Pydantic) | `server.py` V3 e V4 | `V4/server.py` (+ reading_mode) |

### 🔴 VARIAÇÕES INCOMPATÍVEIS (mesma intenção, lógica diferente)

| Função | Legado | V4 | Diferença |
|--------|--------|-----|-----------|
| `parse_medidas_arquivo` | utils_sp.py | `utils_sp2.py/parse_medidas_sp2` | SP2 tem faces, croqui, item_codigo |
| `formatar_descricao_tecnica` | utils_sp.py | `utils_sp2.py/formatar_descricao_narrativa` | SP2 sem `<RED>`, narrativa diferente |
| `inserir_conteudo_sp` | word_utils_sp.py | `inserir_conteudo_sp2` (word_utils_sp2.py) | SP2 tem tabelas, enunciados, croquis |

---

## 8. MÓDULOS COM LÓGICA ÚTIL ESCONDIDA

### ⭐ TOP 5 — REUTILIZAR IMEDIATAMENTE

#### 1. `utils_sp.py` (V4/backend) — parse completo de medidas SP
```python
# Funções de ouro:
parse_medidas_arquivo(nome_arquivo)       # Extrai L x H, desconto, m²
formatar_moeda_texto(valor)               # Float → "3,10"
formatar_descricao_tecnica(...)           # Texto narrativo padrão
formatar_descricao_cofre(servico)         # Texto específico cofre
```

#### 2. `utils_sp2.py` (V4/backend) — SP2 expandido
```python
# Funções de ouro:
parse_medidas_sp2(nome_arquivo)           # SP2: + faces, + tipo metalico
detectar_item_por_pasta(nome_pasta)       # Mapeia pasta → código item + SINAPI
e_croqui(nome_arquivo)                   # Detecta se arquivo é croqui
extrair_legenda_croqui(nome_arquivo)      # Extrai legenda do nome
formatar_referencia_foto(num, parede)     # "Foto 01 – Parede Norte"
formatar_descricao_elemento_metalico(...) # Texto específico metálico
```

#### 3. `word_utils.py` (V4/backend) — hub de funções
```python
# Funções menos óbvias mas valiosas:
extract_placeholders(template_path)       # Retorna {found, missing, locations}
validate_substitutions(subs, template)    # Valida preenchimento
analisar_imagem(caminho)                  # Detecta orientação (portrait/landscape)
otimizar_layout(conteudo)                 # Reorganiza imagens por orientação
```

#### 4. `generator_sp2.py` (V4/backend) — LÓGICA DE NEGÓCIO COMPLEXA
- Detecção de croquis por nome de arquivo (`CROQUI xx - desc.jpg`)
- Agrupamento de múltiplas paredes por serviço
- Fator faces (multiplicador de área)
- Enunciado textual + Tabela de Itens como tipos separados no `conteudo[]`

#### 5. `llm_generator.py` (V4/backend) — Context engineering
```python
build_super_prompt(image_meta)            # Monta prompt com contexto de imagem
call_llm_with_services(services, ...)     # Chama LLM com lista de serviços
mock_call_llm_api(super_prompt, ...)      # Mock para dev sem API key
```

### 🔍 LÓGICA ESCONDIDA ADICIONAL

#### `extrair_itens_docx.py` (Legacy — nunca portado)
- Lê um .docx de relatório existente e extrai lista de itens
- Útil para: importar relatórios antigos, validar conteúdo, criar fixtures

#### `tmp_compare_sort.py` (NX SP Mais atualizado backend)
- Script de comparação de algoritmos de ordenação
- Contém edge cases descobertos durante desenvolvimento
- Útil para: validar sorting em V5

#### `FormularioDinamico_integration.tsx` (V4 frontend)
- Versão "integration" do formulário — pode ser diferente do principal
- Verificar se há lógica extra não integrada ao main

---

## 9. PADRÕES ARQUITETURAIS RECORRENTES

### Padrão 1: Pipeline Scanner → Builder
```
pasta_raiz
    → generator.py (build_content_from_root)
    → conteudo: List[Any]  ← formato intermediário universal
    → word_utils.py (inserir_conteudo)
    → output.docx
```
**Presente em:** Todas as versões desde Proto-V1. **Nunca quebrado.**

### Padrão 2: Modo de Relatório via `tipo_relatorio`
```python
if tipo_relatorio == "sp":
    build_content_sp(...)
elif tipo_relatorio == "sp2":
    build_content_sp2(...)
else:  # tradicional
    build_content_from_root(...)
```
**Evolução:** V3=2 modos → V4=3 modos. Pattern extensível para V5.

### Padrão 3: `conteudo[]` como formato intermediário
```python
# Tipos de item no array conteudo:
"» Título Nível 1"          # str com prefixo »
"»» Título Nível 2"
{"imagem": path}             # foto normal
{"quebra_pagina": True}      # quebra de página
{"memoria_calculo": {...}}   # tabela SP
{"tabela_itens_sp2": {...}}  # tabela SP2
{"croqui": path, "legenda": str}  # SP2
{"enunciado_item": {...}}    # SP2
```
**Chave do sistema:** Todo scanner produz este formato → todo builder consome.

### Padrão 4: Sort em 3 camadas
```python
def folder_sort_key(name):
    if "vista ampla" in name.lower(): return (0, name)  # Primeiro
    if re.match(r'^(\d+)', name): return (1, int(num), rest)  # Numérico
    if "detalhes" in name.lower(): return (3, name)  # Último
    return (2, name)  # Alfabético
```
**Presente em:** generator.py todas versões. Consolidado no V4.

### Padrão 5: Dual-server (FastAPI + Next.js)
- Backend: FastAPI + Uvicorn na porta 5000
- Frontend: Next.js na porta 3000
- Launcher: `run.py` + `run.bat` para Windows
- **Presente em:** V2, V3, V3.2, V4. Nunca mudou.

### Padrão 6: tkinter como file picker
```python
import tkinter as tk
from tkinter import filedialog
# Usado em: GET /api/open-folder para abrir file browser nativo do Windows
```
**Presente em:** V3, V4. Não existe equivalente web.

---

## 10. REGRAS DE NEGÓCIO IMPLÍCITAS

### RN-01: 9 Contratos fixos com templates específicos
```
0908 - SÃO PAULO
1507 - CUIABÁ
1565 - SAO JOSE DO RIO PRETO  ← único SP2
2056 - DIVINÓPOLIS
2057 - VARGINHA
2626 - SALINAS
2627 - VALADARES
3575 - TANGARA DA SERRA
6122 - MATO GROSSO DO SUL
```

### RN-02: Estrutura de pasta para Modo Tradicional
```
AGENCIA/
├── - Área externa/
│   ├── Vista ampla/          ← sempre primeiro
│   ├── 01 - Fachada/
│   └── 02 - Calha/
├── - Área interna/
│   ├── 01.01 - SAA/
│   └── 01.02 - Banheiro/
└── - Segundo piso/           ← opcional
```

### RN-03: Estrutura de pasta para Modo SP
```
AGENCIA/
├── 1 - Área - Ambiente/
│   ├── 1.1 - Serviço/
│   │   ├── 01 - 3,10 x 2,95.jpg         ← medidas no nome
│   │   └── 02 - 2,50 x 1,80 - Faces 2.jpg  ← multiplicador
│   └── 1.2 - Outro Serviço/
```

### RN-04: Formato de medidas no nome do arquivo
```
"01 - 3,10 x 2,95 - Desconto 1,89m².jpg"
→ Largura: 3.10m
→ Altura: 2.95m
→ Desconto: 1.89m²
→ Subtotal: 9.15m²
→ Total: 7.26m²
```

### RN-05: 4 Descrições padrão de serviço (fixas)
- Desc 1–4: variações do mesmo texto "levantamento preventivo"
- Campos variáveis: `[Nome do Gerente]` e `[Número da Matrícula]`
- Substituídos manualmente após geração (nunca automatizados)

### RN-06: 7 Placeholders dinâmicos (V3.2+)
```
{{nr_os}}                  — Número da OS
{{data_elaboracao}}        — Auto: data de hoje
{{data_atendimento}}       — Data da vistoria
{{agencia_codigo}}         — Prefixo/código da agência
{{agencia_nome}}           — Nome da agência
{{endereco}}               — Endereço completo
{{responsavel_dependencia}} — Matrícula + Nome
```

### RN-07: Altura padrão de imagem = 7cm
```python
ALTURA_PADRAO = 7.0  # cm (ajustado de 6.0 → 7.0 em V4)
```

### RN-08: Layout inteligente por orientação
- Portrait → 2 imagens por linha (2 colunas)
- Landscape → 1 imagem por linha (ocupa toda a largura)

### RN-09: Contrato 1565 é exclusivo SP2
- São José do Rio Preto usa template diferente
- Tem SINAPI (referência de preços de construção)
- Tem croquis técnicos e tabelas de cálculo complexas

---

## 11. BIBLIOTECA INTERNA REUTILIZÁVEL (CORE)

Para V5, estes módulos devem ser tratados como biblioteca estável:

### `core/scanners/`
```
generator.py          → build_content_from_root (Tradicional)
generator_sp.py       → build_content_sp (SP)
generator_sp2.py      → build_content_sp2 (SP2)
generator_app.py      → build_content_app (pasta plana)
```

### `core/builders/`
```
word_utils.py         → inserir_conteudo + placeholder system
word_utils_sp.py      → inserir_conteudo_sp + set_cell_background
word_utils_sp2.py     → inserir_conteudo_sp2 (tabelas complexas)
```

### `core/parsers/`
```
utils_sp.py           → parse_medidas_arquivo + formatar_*
utils_sp2.py          → parse_medidas_sp2 + detectar_item_por_pasta
```

### `core/ai/`
```
llm_generator.py      → build_super_prompt + call_llm_with_services
```

### `core/routes/`
```
routes.py             → API de placeholders dinâmicos
server.py             → FastAPI app + todos os endpoints
```

### `shared/types/` (TypeScript)
```
useAppStore.ts        → Tipos Photo, Ambiente, NavSection, AppState
```

---

## 12. ROADMAP DE REAPROVEITAMENTO PARA V5

### ✅ USAR SEM MODIFICAÇÃO (já maduro)
- `utils_sp.py` — parse de medidas SP
- `utils_sp2.py` — parse de medidas SP2
- `generator_sp.py` — scanner SP
- `generator_sp2.py` — scanner SP2
- `word_utils_sp.py` — builder SP
- `word_utils_sp2.py` — builder SP2
- `routes.py` — endpoints de placeholders
- `llm_generator.py` — geração via IA

### ⚙️ USAR COM REFATORAÇÃO MENOR
- `generator.py` — adicionar suporte a mais padrões de sort
- `word_utils.py` — consolidar todas as funções de análise de imagem
- `server.py` — adicionar novo modo SP3 se necessário
- `useAppStore.ts` — adicionar states de V5

### 🔨 CONSTRUIR EM CIMA DE (requer adaptação)
- `FormularioDinamico.tsx` — expandir para mais campos dinâmicos
- `ImageEditorModal.tsx` — adicionar mais ferramentas de anotação
- `AmbienteSelector.tsx` — sincronizar com backend SP/SP2

### 🆕 CONSTRUIR DO ZERO (não existe em nenhuma versão)
- Integração com `extrair_itens_docx.py` (legacy, nunca portado)
- Dashboard de histórico de relatórios gerados
- Sistema de versionamento de templates
- Exportação para PDF (além de .docx)
- Sincronização com planilha de controle de OS

---

## 🚨 ALERTAS CRÍTICOS PARA V5

### ALERTA 1: `generator_app.py` pode estar incompleto
- `build_content_app` existe mas não há testes
- Verificar se o "modo app" (pasta plana) está 100% funcional

### ALERTA 2: `FormularioDinamico_integration.tsx` vs `FormularioDinamico.tsx`
- Dois arquivos com nomes similares — possível duplicata ou variante
- Comparar antes de usar

### ALERTA 3: `gerar_ipuiuna.py` — script one-off não documentado
- Pode conter lógica de negócio específica da agência Ipuiuna
- Verificar se deve virar endpoint genérico

### ALERTA 4: `insert_placeholders_in_templates.py` — ferramenta de setup
- Insere placeholders nos templates em batch
- Deve ser documentado e integrado ao processo de setup de novos contratos

### ALERTA 5: Texto em vermelho (`<RED>`) pode não estar funcionando
- `formatar_descricao_tecnica` usa `<RED>...</RED>` como marcador
- Verificar se `inserir_conteudo_sp` em V4 processa este marcador corretamente

---

*Gerado por engenharia reversa completa do ecossistema — 2026-05-25*
*Arquivos analisados: ~40 módulos Python, ~15 componentes React/TS, ~20 documentos MD*
