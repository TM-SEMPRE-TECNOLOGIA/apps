# ⚡ Cheat Sheet - TM-MEUS-APPS

**Guia Rápido de Referência** | 2026-05-12

---

## 🎯 Onde Salvar As Coisas

| O Que? | Onde? | Observação |
|--------|-------|-----------|
| **Código em Produção** | `01_Golden_Apps_meu_uso/` | ✅ Versionado |
| **Código Antigo** | `03_Arquivo_Morto_Legado/` | ✅ Histórico |
| **IA-Generated Output** | `output_claude/` | ✅ Novo! |
| **Design/UI Components** | `TM Design System - NOVO Laranjado/` | ✅ Versionado |
| **Documentação** | `Obisidian/00 - Jarvis Brain/` | ✅ Knowledge Base |
| **Marketing** | `TM Marketing/` | ✅ Versionado |
| **Estratégia** | `Monetizacao_com_IA/` | ✅ Versionado |

---

## 🤖 Agente `/tm-commit`

**O que faz:** Automatiza Git commits e push para GitHub

### Usar em Final de Chat
```
/tm-commit status    → Ver mudanças
/tm-commit push      → Fazer push automático
```

### Commits Automáticos São Criados Com
```
feat(escopo): descrição clara
fix(escopo): descrição do bug
docs: atualização de documentação
chore: manutenção
```

---

## 📂 Arquivos de Regras

```
.agent/rules/TM-COMMIT-RULES.md  ← Regras do agente
MAPA_REPOSITORIO.md              ← Estrutura completa
CHEAT_SHEET.md                   ← Este arquivo (quick ref)
```

### ⚡ Quick Rules
- ✅ Sempre stage e commit ao final do chat
- ✅ Salve output em `output_claude/` por padrão
- ✅ Respeite `.gitignore` (não versione `.agent/`, `.claude/`, etc)
- ✅ Use mensagens de commit descritivas

---

## 🔄 Fluxo Padrão

```
1. Você cria um arquivo em um chat
   ↓
2. Claude salva em output_claude/ (automático)
   ↓
3. /tm-commit detecta mudanças
   ↓
4. Pede confirmação para commit
   ↓
5. Git commit + git push (automático)
   ↓
6. Arquivo está no GitHub ✓
```

---

## 📋 Pastas NÃO Versionadas

```
.agent/              ← Configuração local
.claude/             ← Cowork/Claude local
.venv/               ← Python dependencies
.vs/, .vscode/       ← IDE config
node_modules/        ← Node dependencies
*.log, *.swp         ← Arquivos temporários
.DS_Store            ← macOS cache
```

**Estes NÃO aparecem no GitHub (gitignored)**

---

## 🚀 Comandos Git (Se Necessário Manualmente)

```powershell
# Ver status
git status

# Ver últimos commits
git log --oneline -5

# Fazer pull
git pull origin main

# Ver branches
git branch -a

# Trocar branch
git checkout branch-name

# Ver mudanças
git diff
```

---

## 🎯 Exemplos Rápidos

### Criar uma página HTML
```
→ Salve em: output_claude/html-pages/nome.html
→ /tm-commit detecta e propõe commit automático
→ Você aprova, pronto!
```

### Criar um agente customizado
```
→ Salve em: output_claude/agentes/nome-agente.md
→ ou: .agent/rules/nome-agente-rules.md
→ /tm-commit sincroniza tudo
```

### Adicionar documentação
```
→ Salve em: Obisidian/00 - Jarvis Brain/
→ /tm-commit commit automático
→ Fica no histórico forever!
```

---

## 📊 Status Atual

- **Branch ativa:** `main`
- **Último commit:** `35dd6460` - docs: criar mapa e regras
- **Arquivos rastreados:** 690+ MB
- **Último push:** 2026-05-12
- **GitHub URL:** https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS

---

## ❓ FAQ Rápido

**P: Posso criar pastas novas?**  
R: Sim! Mas atualize `MAPA_REPOSITORIO.md` depois.

**P: E se esquecer de fazer commit?**  
R: `/tm-commit` lembra no final da sessão.

**P: Posso usar outro branch?**  
R: Sim, mas `/tm-commit` trabalha com `main` por padrão.

**P: Tamanho limite de arquivo?**  
R: Sem limite técnico, mas > 100MB sugira Git LFS.

**P: Preciso atualizar as regras?**  
R: Edite `.agent/rules/TM-COMMIT-RULES.md` e faça commit.

---

## 🎯 Próximos Passos

1. ✅ **Mapa criado** - `MAPA_REPOSITORIO.md`
2. ✅ **Regras criadas** - `.agent/rules/TM-COMMIT-RULES.md`
3. ✅ **Cheat sheet pronto** - Este arquivo
4. ⏳ **Testar /tm-commit** - Na próxima sessão
5. ⏳ **Ajustar conforme necessário** - Com feedback

---

**Imprime este arquivo ou salva como favorito! 📌**

*Última atualização: 2026-05-12*
