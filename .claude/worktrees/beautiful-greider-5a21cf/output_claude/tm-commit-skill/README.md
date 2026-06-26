# 🚀 TM-COMMIT Skill

Git automation skill para o repositório **TM-MEUS-APPS**. Automatiza versionamento, cria commits estruturados e sincroniza com GitHub.

---

## ⚡ Quick Start

```bash
# Verificar status
/tm-commit status

# Fazer push para GitHub
/tm-commit push

# Sincronizar completo
/tm-commit sync

# Ver ajuda
/tm-commit help
```

---

## 📦 Instalação

### Opção 1: Como Skill do Cowork (Recomendado)

```bash
# Copie a pasta tm-commit-skill para:
C:\Users\[user]\AppData\Roaming\Claude\skills\

# Ou instale via Cowork Dashboard
# Procure por "tm-commit" na aba Skills
```

### Opção 2: Via NPM (Se configurado)

```bash
npm install tm-commit-skill
npx tm-commit status
```

### Opção 3: Direto no Chat

Basta invocar:
```
/tm-commit <comando>
```

---

## 🎯 Comandos

| Comando | Descrição | Uso |
|---------|-----------|-----|
| `status` | Ver mudanças e status | `/tm-commit status` |
| `add` | Fazer staging | `/tm-commit add` |
| `commit` | Criar commit | `/tm-commit commit "tipo: msg"` |
| `push` | Fazer push | `/tm-commit push` |
| `sync` | Pull + Push | `/tm-commit sync` |
| `log` | Ver commits | `/tm-commit log 5` |
| `clean` | Limpar branches | `/tm-commit clean` |
| `help` | Ajuda | `/tm-commit help` |

---

## 📁 Pastas Monitoradas

✅ Versionadas automaticamente:
- `01_Golden_Apps_meu_uso/`
- `03_Arquivo_Morto_Legado/`
- `output_claude/` ← IA-Generated
- `Obisidian/` ← Knowledge Base
- `TM Design System - NOVO Laranjado/`
- `TM Marketing/`
- `Monetizacao_com_IA/`
- `Meus Plugins e Skills/`

❌ Ignoradas (gitignore):
- `.agent/`, `.claude/`, `.venv/`
- `node_modules/`, `.vs/`
- Logs, cache, temporários

---

## 📋 Padrão de Commits

Segue **Conventional Commits**:

```
feat(escopo): descrição clara
fix(escopo): corrigir bug
docs: atualizar documentação
refactor: reorganizar código
chore: manutenção
test: adicionar testes
perf: otimizar performance
ci: CI/CD updates
```

### Exemplos

```
✅ feat(agentes): criar tm-relatorio
✅ docs(mapa): atualizar estrutura
✅ fix(gitignore): remover .env
✅ chore: sincronizar checkpoint
```

---

## 🤖 Comportamento Automático

### Início da Sessão
```
🔄 Sincronizando repositório TM-MEUS-APPS...
Status: Tudo atualizado ✓
```

### Durante a Sessão
```
📁 Arquivo criado: output_claude/novo-agente.md
Auto-staging em andamento...
```

### Final da Sessão
```
📋 Resumo da Sessão:
- Arquivos criados: 2
- Modificados: 1
- Tamanho: 500 KB

Deseja fazer commit e push? [Sim/Não/Depois]
```

---

## 🔒 Segurança

O skill valida:
- ❌ Não commita credenciais (`.env`, API keys, secrets)
- ❌ Bloqueia force push (`git push --force`)
- ❌ Alerta sobre arquivos > 100MB
- ✅ Respeita `.gitignore`
- ✅ Valida padrão de commits

---

## 📊 Exemplo de Sessão

```
User: Cria novo agente /tm-relatorio

Claude: Criando /tm-relatorio...
        Salvando em output_claude/agentes/

/tm-commit detecta mudança:
[Detecta] 1 arquivo novo em output_claude/
Deseja fazer commit? [Sim/Não/Depois]

User: Sim

/tm-commit executa:
$ git add output_claude/
$ git commit -m "feat(agentes): criar tm-relatorio"
$ git push origin main

✅ Commit abc12345
✅ Sincronizado com GitHub
```

---

## 🛠️ Configuração

Arquivo de regras: `.agent/rules/TM-COMMIT-RULES.md`

Customize:
- Tipos de commits permitidos
- Pastas monitoradas
- Intervalo de checkpoints
- Regras de segurança

---

## 📚 Documentação

- **Regras Completas:** `.agent/rules/TM-COMMIT-RULES.md`
- **Mapa do Repositório:** `MAPA_REPOSITORIO.md`
- **Quick Reference:** `CHEAT_SHEET.md`
- **Este Skill:** `output_claude/tm-commit-skill/SKILL.md`

---

## 🆘 Troubleshooting

### Erro: "index.lock exists"
```
/tm-commit force-clean
→ Remove .git/index.lock e retenta
```

### Erro: "rejected - remote has work"
```
/tm-commit sync
→ Pull + resolve conflicts + push
```

### Erro: "credencial exposta"
```
⚠️ Commit bloqueado
→ Remova a credencial
→ Adicione a .gitignore
→ Tente novamente
```

---

## 📈 Estatísticas

O skill rastreia:
- Total de commits por sessão
- Arquivos alterados
- Linhas adicionadas/removidas
- Média de commits por dia
- Último push

Acesse com:
```
/tm-commit stats
```

---

## 🤝 Integração com Outros Agentes

O skill funciona automaticamente com:
- **Claude** → Detecta arquivos criados em `output_claude/`
- **`/tm-relatorio`** → Detecta relatórios e commita
- **`/tm-designer`** → Detecta páginas HTML e commita
- Qualquer agente que salve em pastas monitoradas

---

## 📝 Licença

MIT License - Livre para usar e modificar

---

## 📞 Suporte

Problemas ou sugestões?

```
/tm-commit feedback "Sua sugestão aqui"
→ Cria issue no GitHub ou salva em output_claude/feedback/

/tm-commit debug
→ Mostra logs detalhados
```

---

**Versão:** 1.0  
**Data:** 2026-05-12  
**Status:** Ativo e funcional  
**Próxima revisão:** 2026-06-12

---

**Pronto para usar! Invoke com `/tm-commit` em qualquer sessão de chat.** 🚀
