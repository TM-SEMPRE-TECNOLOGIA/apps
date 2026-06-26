# 🗺️ Mapa do Repositório TM-MEUS-APPS

**Última atualização:** 2026-05-12  
**Propósito:** Guia de organização e estrutura de diretórios para o repositório

---

## 📍 Estrutura Raiz

```
TM-MEUS-APPS/
├── 01_Golden_Apps_meu_uso/              ← ATIVO: Aplicações em produção
├── 03_Arquivo_Morto_Legado/             ← ARQUIVO: Projetos antigos/descontinuados
├── output_claude/                       ← NOVO: Arquivos gerados em chats (AI-generated)
├── Design Maffeng/                      ← Design: Referências visuais Maffeng
├── Meus Plugins e Skills/               ← Plugins/Skills instalados localmente
├── Monetizacao_com_IA/                  ← Estratégia: Monetização com IA
├── Obisidian/                           ← Knowledge Base: Obsidian vault
├── Prints/                              ← Screenshots/Capturas de tela
├── TM Design System - NOVO Laranjado/   ← Design System: Tokens e componentes
├── TM Marketing/                        ← Marketing: Estratégia e conteúdo
├── .agent/                              ← CONFIG: Configuração de agentes (gitignored)
├── .claude/                             ← CONFIG: Cowork/Claude local (gitignored)
├── .venv/                               ← CONFIG: Virtual environment Python (gitignored)
├── .vscode/                             ← CONFIG: VSCode settings (gitignored)
└── .gitignore                           ← Regras de versionamento Git

```

---

## 📂 Onde Salvar Cada Tipo de Arquivo

### 🟢 **PRODUÇÃO / ATIVO**
**Pasta:** `01_Golden_Apps_meu_uso/`

Subdivisões:
- `AutoRelatorio_V2/` → Versão estável do AutoRelatório
- `AutoRelatorio_V3/` → Versão em desenvolvimento
- `AutoRelatorio_V3.2/` → Melhorias
- `AutoRelatorio_V4/` → Versão mais recente
- `squad-brainstorming/` → Ideias de funcionalidades
- `squad-docfactory/` → Geração de documentos

**Salvar aqui:**
- ✅ Código-fonte em produção
- ✅ Aplicações ativas
- ✅ Funcionalidades testadas
- ✅ Versões estáveis

---

### 🟡 **LEGADO / ARQUIVO**
**Pasta:** `03_Arquivo_Morto_Legado/`

Subdivisões:
- `.NEXT APPS/` → Antigos projetos Next.js
- `.NEXT APPS 2/` → Iteração 2
- `Design System TM/` → Sistema anterior
- `LEGADO - ANTIGOS/` → Código muito antigo
- `Levantamentos-Preventivos/` → Exemplos antigos
- `MEUS COMMITS/` → Histórico de commits
- `Versões legadas/` → Variações antigas

**Salvar aqui:**
- ⚠️ Projetos descontinuados
- ⚠️ Versões antigas de produtos
- ⚠️ Referências históricas
- ⚠️ Código não mantido

---

### 🟦 **CLAUDE/IA GENERATED**
**Pasta:** `output_claude/`

**Estrutura sugerida:**
```
output_claude/
├── 2026-05-12/                    ← Por data
│   ├── tm-commit-agent.md
│   ├── regras-github.md
│   └── dashboard-html.html
├── agentes/                       ← Agentes e skills
│   ├── tm-commit/
│   └── tm-relatorio/
└── templates/                     ← Modelos reutilizáveis
    ├── .gitkeep
```

**Salvar aqui:**
- ✨ Relatórios HTML/DOCX gerados
- ✨ Scripts e automações criadas
- ✨ Definições de agentes
- ✨ Templates e boilerplates
- ✨ Documentação gerada

---

### 🎨 **DESIGN**
**Pasta:** `TM Design System - NOVO Laranjado/`

Subdivisões:
- `skills/tm-web-pages/` → Skill para geração de páginas
- `ui_kits/` → Kits de componentes
- `Exemplos/` → Exemplos de uso
- `Imagens/` → Assets visuais

**Salvar aqui:**
- 🎭 Design tokens
- 🎭 Componentes UI
- 🎭 Padrões visuais
- 🎭 Referências de design

---

### 📚 **CONHECIMENTO**
**Pasta:** `Obisidian/`

Subdivisões:
- `00 - Jarvis Brain/` → Base de conhecimento
- `Technical_Docs/` → Documentação técnica
- `Logs/` → Histórico de tarefas

**Salvar aqui:**
- 📖 Documentação
- 📖 Procedimentos
- 📖 Decisões arquiteturais
- 📖 Aprendizados

---

### 🧠 **ESTRATÉGIA / NEGÓCIO**
**Pasta:** `Monetizacao_com_IA/`

Subdivisões:
- `01_ESTRATEGIAS/` → Planos
- `02_AGENTES/` → Agentes de IA
- `03_PROJETOS/` → Projetos ativos
- `04_SETUP/` → Configurações
- `05_LOGS/` → Execução

**Pasta:** `TM Marketing/`

Subdivisões:
- `01-estrategia/`
- `02-identidade-visual/`
- `03-blog/`
- `04-redes-sociais/`
- `05-meta-ads/`

**Salvar aqui:**
- 💼 Planos de negócio
- 💼 Estratégias de marketing
- 💼 Documentos de projeto
- 💼 Campanhas publicitárias

---

### 🔧 **PLUGINS E SKILLS (Local)**
**Pasta:** `Meus Plugins e Skills/`

Subdivisões:
- `antigravity-awesome-skills/` → Framework de skills
- `impeccable-framework/` → Framework de agentes
- `opensquad/` → Plataforma de squads
- `tm-design-system-plugin/` → Plugin de design
- `relatorio-preventivo.skill/` → Skill de relatórios

**Salvar aqui:**
- 🔌 Extensões locais
- 🔌 Skills customizadas
- 🔌 Plugins do Cowork
- 🔌 Frameworks pessoais

---

### 📸 **MÍDIA**
**Pasta:** `Prints/`

**Salvar aqui:**
- 📷 Screenshots
- 📷 Capturas de tela
- 📷 Imagens de referência

---

## 🚫 O QUE NÃO VERSIONAMOS (gitignored)

```
.agent/              ← Agentes locais do Cowork
.claude/             ← Configuração local do Claude
.venv/               ← Dependências Python
.vs/                 ← Visual Studio cache
.vscode/             ← Configuração local VSCode
.obsidian/           ← Configuração local Obsidian
node_modules/        ← Dependências Node
*.log                ← Arquivos de log
*.swp, *.swo         ← Arquivos temporários de editor
.DS_Store            ← Arquivos do macOS
Thumbs.db            ← Arquivos do Windows
```

---

## 📋 Regra de Ouro

| Tipo de Arquivo | Destino | Git |
|---|---|---|
| Código em Produção | `01_Golden_Apps/` | ✅ Sim |
| Código Legado | `03_Arquivo_Morto/` | ✅ Sim |
| IA-Generated Output | `output_claude/` | ✅ Sim |
| Design/UI | `TM Design System/` | ✅ Sim |
| Knowledge Base | `Obisidian/` | ✅ Sim |
| Plugins Locais | `Meus Plugins/` | ✅ Sim |
| Marketing/Negócio | `TM Marketing/` ou `Monetizacao/` | ✅ Sim |
| Configuração Local | `.agent/`, `.claude/`, `.venv/` | ❌ Não |
| Dependências | `node_modules/`, `.venv/` | ❌ Não |
| Cache/Temp | `*.log`, `*.swp` | ❌ Não |

---

## 🎯 Para o Agente `/tm-commit`

O agente deve:
1. ✅ Monitorar mudanças em TODAS as pastas versionadas
2. ✅ Criar commits automáticos quando solicitado
3. ✅ Seguir convenção de commits (tipo: mensagem)
4. ✅ Fazer push para `main` branch
5. ✅ Respeitar `.gitignore`
6. ✅ Salvar outputs em `output_claude/` por padrão

**Padrão de commit:**
```
feat: descrição clara do que foi adicionado
fix: descrição do bug corrigido
docs: atualização de documentação
refactor: reorganização sem mudança funcional
chore: atualizações de dependências, etc
```

---

## 📍 Quick Reference

```bash
# Você criou um arquivo AI-generated?
→ Salve em: output_claude/

# Quer fazer commit de tudo?
→ Use o agente: /tm-commit

# Quer versionamento automático?
→ Configure regras no agente: .agent/rules/

# Quer documentar decisões?
→ Escreva em: Obisidian/00 - Jarvis Brain/
```

---

**Última revisão:** 2026-05-12  
**Próxima revisão:** Quando adicionar novas pastas principais
