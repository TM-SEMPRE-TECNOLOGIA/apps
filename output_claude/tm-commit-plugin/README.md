# 🚀 TM-COMMIT Plugin

**Git automation plugin para TM-MEUS-APPS**

Detecta mudanças em pastas monitoradas, valida segurança, cria commits estruturados em Conventional Commits, e sincroniza automaticamente com GitHub.

---

## ⚡ Quick Start

### Instalação

1. **Extraia o plugin** em sua pasta de plugins Cowork
2. **Reinicie o Cowork**
3. **Pronto!** O plugin auto-carrega em cada sessão

### Primeiros Passos

```
/tm-commit status     # Ver mudanças atuais
/tm-commit push       # Fazer commit + push manual
/tm-commit help       # Ver todos os comandos
```

---

## 📦 O Que Vem no Plugin

```
tm-commit-plugin/
├── .claude-plugin/
│   └── plugin.json              # Metadados do plugin
├── skills/
│   └── tm-commit/
│       └── SKILL.md             # Documentação completa da skill
├── hooks/
│   └── hooks.json               # Auto-triggers (session-start, file-created, session-end)
├── docs/
│   ├── SETUP.md                 # Guia de instalação detalhado
│   ├── USAGE.md                 # Exemplos de uso
│   ├── TROUBLESHOOTING.md       # Soluções de problemas comuns
│   └── FAQ.md                   # Perguntas frequentes
├── README.md                    # Este arquivo
└── ARQUITETURA.md               # Diagramas e fluxos técnicos
```

---

## 🎯 Funcionalidades

### ✅ Automação Git Completa
- Detecta mudanças em 8 pastas monitoradas
- Staging automático ou manual
- Commits estruturados (Conventional Commits)
- Push para GitHub com validação

### 🔒 Segurança Integrada
- Bloqueia credenciais (`.env`, API keys, secrets)
- Alerta sobre arquivos > 100 MB
- Respeita `.gitignore` automaticamente

### 🤖 Automação Inteligente
- **Session-start**: Sincroniza repositório
- **File-created**: Detecta mudanças em tempo real
- **Session-end**: Oferece 3 opções de commit/push
- **Checkpoints**: Sync automático a cada sessão

### 💬 Sugestões Inteligentes
- Analisa arquivos mudados
- Sugere mensagem de commit
- Você confirma, edita ou cancela
- Nunca commita sem sua aprovação

---

## 📋 Pastas Monitoradas

O plugin rastreia mudanças em:

```
✅ 01_Golden_Apps_meu_uso/
✅ 03_Arquivo_Morto_Legado/
✅ output_claude/           ← Arquivos gerados por IA
✅ Obisidian/               ← Base de conhecimento
✅ TM Design System - NOVO Laranjado/
✅ TM Marketing/
✅ Monetizacao_com_IA/
✅ Meus Plugins e Skills/
```

Ignoradas (gitignored):
```
❌ .agent/, .claude/, .venv/, .vs/
❌ node_modules/, .DS_Store
❌ *.log, *.swp, cache/
```

---

## 🎮 Comandos

Invoque com `/tm-commit <comando>`:

| Comando | O Que Faz | Exemplo |
|---------|-----------|---------|
| `status` | Ver mudanças não commitadas | `/tm-commit status` |
| `add` | Fazer staging | `/tm-commit add` |
| `commit` | Criar commit (precisa mensagem) | `/tm-commit commit "feat(output): novo"` |
| `push` | Fazer push com sugestão | `/tm-commit push` |
| `sync` | Pull + commit + push | `/tm-commit sync` |
| `log [n]` | Ver últimos n commits | `/tm-commit log 5` |
| `clean` | Limpar branches antigas | `/tm-commit clean` |
| `help` | Ver ajuda | `/tm-commit help` |

---

## 🔄 Fluxo de Detecção de Mudanças

Você tem **3 opções** para como o plugin reagirá ao detectar mudanças:

### **Opção 1: Apenas Notificar**
```
📁 Mudança detectada em output_claude/
arquivo_novo.md (123 KB)

Próximo passo: /tm-commit status
```
→ Plugin avisa, você decide o que fazer

### **Opção 2: Notificar + Perguntar**
```
📁 Mudança detectada em output_claude/
arquivo_novo.md (123 KB)

Deseja fazer staging? [Sim/Não]
```
→ Plugin avisa e oferece staging automático

### **Opção 3: Auto-commit Sem Perguntar**
```
🤖 Auto-commit em andamento...
$ git add output_claude/
$ git commit -m "feat(output_claude): arquivo_novo"
$ git push origin main
✅ Sincronizado
```
→ Plugin faz tudo automaticamente

**Como escolher sua opção:**
```
/tm-commit settings
→ Selecione sua preferência (1, 2 ou 3)
```

---

## 💡 Padrão de Commits

Usa **Conventional Commits** (https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição curta>
```

### Tipos Disponíveis

| Tipo | Quando usar | Exemplo |
|------|-------------|---------|
| `feat` | Nova funcionalidade | `feat(agentes): criar tm-relatorio` |
| `fix` | Bug corrigido | `fix(gitignore): remover .env` |
| `docs` | Documentação | `docs(mapa): atualizar estrutura` |
| `refactor` | Reorganização | `refactor(skills): mover para output` |
| `chore` | Manutenção | `chore: sincronizar checkpoint` |
| `test` | Testes | `test(tm-commit): validar regras` |
| `perf` | Performance | `perf(autorelatorio): otimizar` |
| `ci` | CI/CD | `ci(github): adicionar workflow` |

### Exemplos Válidos ✅

```
feat(output_claude): criar dashboard com dark mode
docs(readme): atualizar guia de instalação
fix(gitignore): adicionar .venv à exclusão
chore: sincronizar repositório
refactor(agentes): mover skills para output_claude
```

---

## 🔐 Validação de Segurança

Antes de fazer commit, o plugin verifica:

### ❌ Bloqueia (com aviso)
- `.env`, `*.key`, `secrets.json`, `config.prod.json`
- Arquivos > 100 MB
- Padrões: `API_KEY`, `PASSWORD`, `TOKEN`

**Se detectar algo:**
```
⚠️ AVISO: Credencial detectada em arquivo.env
→ Arquivo NÃO será commitado
→ Remova a credencial antes de tentar novamente
→ Adicione a .gitignore se necessário
```

### ✅ Permite
- Qualquer arquivo em pastas monitoradas
- Respeita `.gitignore` automaticamente

---

## 📊 Comportamento em Cada Momento

### Início da Sessão
```
🔄 Sincronizando repositório TM-MEUS-APPS...
Status: Tudo atualizado ✓
(ou: Status: 3 mudanças não commitadas)
```

### Ao Criar Arquivo
```
📁 Mudança detectada em output_claude/novo.md
Opções: [1] Notificar [2] Perguntar [3] Auto-commit
```

### Final da Sessão
```
📋 Resumo da Sessão
━━━━━━━━━━━━━━━━━━━━━
📁 Criados: 2
✏️ Modificados: 1
💾 Tamanho: 500 KB

Deseja fazer commit e push?
[1] Sim [2] Não [3] Revisar
```

---

## 📚 Documentação Completa

- **`SKILL.md`** — Especificação completa (comandos, fluxos, exemplos)
- **`docs/SETUP.md`** — Instalação passo a passo
- **`docs/USAGE.md`** — Exemplos de uso
- **`docs/TROUBLESHOOTING.md`** — Soluções de problemas
- **`docs/FAQ.md`** — Perguntas frequentes
- **`ARQUITETURA.md`** — Diagramas técnicos
- **`.agent/rules/TM-COMMIT-RULES.md`** — Regras e configuração

---

## 🔗 GitHub & Repositório

- **URL**: `https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS`
- **Branch**: `main`
- **Raiz**: `C:\Users\thiag\Desktop\TM-MEUS-APPS\`

---

## 🆘 Suporte Rápido

```bash
# Ver ajuda completa
/tm-commit help

# Sincronizar manualmente
/tm-commit sync

# Limpar problemas de lock
/tm-commit force-clean

# Ver últimos commits
/tm-commit log 10
```

---

## 📝 Licença

MIT License — Livre para usar e modificar

---

## 📞 Mais Informações

Consulte os arquivos de documentação inclusos ou execute `/tm-commit help` em qualquer sessão.

**Versão**: 1.0.0  
**Status**: ✅ Ativo e funcional  
**Data**: 2026-05-13

---

**Pronto para usar!** 🚀
