---
name: tm-commit
description: >-
  Git automation skill para TM-MEUS-APPS. Detecta mudanças em pastas monitoradas,
  valida segurança, sugere commits estruturados em Conventional Commits, e sincroniza
  com GitHub. Triggers: /tm-commit <comando>, detecção automática ao criar arquivos,
  sync automático ao fim da sessão.
---

# tm-commit Skill

Automatiza o fluxo completo de Git: detecção → validação → commit → push.

## Comandos Disponíveis

Invoque com `/tm-commit <comando>`:

| Comando | O que faz | Exemplo |
|---------|-----------|---------|
| `status` | Ver mudanças não commitadas | `/tm-commit status` |
| `add` | Fazer staging manual | `/tm-commit add` |
| `commit` | Criar commit (precisa de msg) | `/tm-commit commit "feat(output): novo agente"` |
| `push` | Fazer push para GitHub | `/tm-commit push` |
| `sync` | Pull + commit + push | `/tm-commit sync` |
| `log [n]` | Ver últimos n commits | `/tm-commit log 5` |
| `clean` | Limpar branches antigas | `/tm-commit clean` |
| `help` | Ver ajuda | `/tm-commit help` |

---

## Comportamento em Detecção de Mudanças

Quando você cria/modifica um arquivo em uma pasta monitorada:

**Opção 1: Apenas Notificar**
```
📁 Mudança detectada em output_claude/
arquivo_novo.md (123 KB)
→ Próximo passo: /tm-commit status
```

**Opção 2: Notificar + Oferecer Auto-staging**
```
📁 Mudança detectada em output_claude/
arquivo_novo.md (123 KB)

Deseja fazer staging? [Sim/Não]
```

**Opção 3: Auto-commit + Auto-push (sem perguntar)**
```
🤖 Auto-commit em andamento...
$ git add output_claude/
$ git commit -m "feat(output_claude): arquivo_novo"
$ git push origin main
✅ Sincronizado
```

→ **Use /tm-commit status para ver qual modo você ativou**

---

## Sugestão de Commit

Quando você executa `/tm-commit push` ou faz auto-commit, o skill:

1. **Sugere** uma mensagem com base nos arquivos mudados:
   ```
   Sugestão: feat(output_claude): criar novo arquivo
   ```

2. **Você escolhe:**
   - ✅ Aceitar sugestão
   - ✏️ Editar e customizar
   - ❌ Cancelar

---

## Validação de Segurança

Antes de fazer commit, valida:

### ❌ Bloqueia (com aviso)
- Credenciais: `.env`, `*.key`, `secrets.json`, `config.prod.json`
- Arquivos muito grandes: > 100 MB
- Padrões suspeitos: `API_KEY`, `PASSWORD`, `TOKEN`

**Se detectar algo:**
```
⚠️ Arquivo suspeito detectado: .env
→ Não será commitado
→ Remova a credencial antes de tentar novamente
→ Adicione a .gitignore se necessário
```

### ✅ Permite
- Qualquer arquivo em pastas monitoradas
- Respeita `.gitignore` automaticamente

---

## Pastas Monitoradas

O skill rastreia mudanças em:

```
✅ 01_Golden_Apps_meu_uso/
✅ 03_Arquivo_Morto_Legado/
✅ output_claude/           ← IA-generated files
✅ Obisidian/               ← Knowledge base
✅ TM Design System - NOVO Laranjado/
✅ TM Marketing/
✅ Monetizacao_com_IA/
✅ Meus Plugins e Skills/
```

**Não monitora (gitignored):**
```
❌ .agent/, .claude/, .venv/, .vs/
❌ node_modules/, .DS_Store
❌ *.log, *.swp, cache/
```

---

## Padrão de Commits

Usa **Conventional Commits** (https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição curta>

[corpo opcional - detalhes da mudança]

[rodapé opcional - referência a issues]
```

### Tipos Permitidos

| Tipo | Quando usar | Exemplo |
|------|-------------|---------|
| `feat` | Nova funcionalidade | `feat(agentes): criar tm-relatorio` |
| `fix` | Corrigir bug | `fix(gitignore): remover .env` |
| `docs` | Documentação | `docs(mapa): atualizar estrutura` |
| `refactor` | Reorganizar código | `refactor(skills): mover para output` |
| `chore` | Manutenção geral | `chore: sincronizar checkpoint` |
| `test` | Testes | `test(tm-commit): validar regras` |
| `perf` | Performance | `perf(autorelatorio): otimizar` |
| `ci` | CI/CD updates | `ci(github): adicionar workflow` |

### Exemplos Válidos ✅

```
feat(output_claude): criar dashboard com dark mode
docs(readme): atualizar guia de instalação
fix(gitignore): adicionar .venv à exclusão
chore: sincronizar repositório - checkpoint
refactor(agentes): mover skills para output_claude
```

---

## Comportamento no Final da Sessão

Ao encerrar o chat/sessão:

```
📋 Resumo da Sessão - TM-MEUS-APPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Arquivos criados: 3
✏️ Arquivos modificados: 1
🗑️ Arquivos deletados: 0
💾 Tamanho total: 850 KB

Deseja fazer commit e push?
[1] Sim, fazer auto-commit
[2] Não, deixar para depois
[3] Revisar mudanças primeiro
```

Se escolher **[1]**, o skill:
1. Faz `git add` nas pastas monitoradas
2. Sugere mensagem de commit
3. Você confirma ou edita
4. Faz `git push origin main`
5. Mostra resumo

---

## Integração com .agent/rules/TM-COMMIT-RULES.md

O skill lê automaticamente o arquivo `.agent/rules/TM-COMMIT-RULES.md` que contém:

- Pastas monitorizadas (lista oficial)
- Padrão de commits obrigatórios
- Regras de segurança
- Intervalo de checkpoints

Se você modificar esse arquivo, o skill carrega as novas regras na próxima sessão.

---

## Troubleshooting

### Erro: "index.lock exists"
```
/tm-commit force-clean
→ Remove .git/index.lock e retenta
```

### Erro: "rejected - remote has work"
```
/tm-commit sync
→ Faz pull, resolve conflitos, faz push
```

### Erro: "credencial exposta"
```
⚠️ Commit bloqueado
→ Remova a credencial do arquivo
→ Adicione a .gitignore
→ Tente novamente
```

### Não detecta mudanças
```
/tm-commit status
→ Se não mostrar nada, repositório está sincronizado
```

---

## Exemplos de Sessão

### Fluxo 1: Status + Manual Push
```
User: /tm-commit status
Skill:
  📊 3 arquivos novos em output_claude/
  ✏️ 1 arquivo modificado em Obisidian/

User: /tm-commit push
Skill:
  Sugestão: feat(output_claude): criar novo dashboard
  
  [Aceitar] [Editar] [Cancelar]

User: Editar
User: feat(output_claude): criar dashboard com animações
Skill:
  $ git add output_claude/
  $ git commit -m "feat(output_claude): criar dashboard com animações"
  $ git push origin main
  ✅ Commit abc12345
  ✅ Sincronizado com GitHub
```

### Fluxo 2: Auto-commit com Detecção
```
User: cria novo arquivo em output_claude/novo-agente.md

Skill (Opção 2 - pergunta):
  📁 Mudança detectada: novo-agente.md (234 KB)
  Deseja fazer staging? [Sim/Não]

User: Sim

Skill:
  ✅ Staged: novo-agente.md
  
  Próxima ação:
  /tm-commit commit "feat(agentes): criar novo-agente"
  ou
  /tm-commit push (auto-commit com sugestão)
```

### Fluxo 3: Sync Completo
```
User: /tm-commit sync

Skill:
  🔄 Sincronizando...
  
  1️⃣ git pull origin main
     Already up to date
  
  2️⃣ Staging mudanças...
     Staged: 4 arquivos
  
  3️⃣ Sugestão de commit:
     chore: sincronizar checkpoint
     
     [Aceitar] [Editar] [Cancelar]
  
  User: Aceitar
  
  4️⃣ git push origin main
     ✅ Sincronizado
  
  📊 Resumo:
  • Arquivos: 4
  • Tamanho: 520 KB
  • Status: ✅ Tudo atualizado
```

---

## Informações de Sessão

- **Repositório**: `C:\Users\thiag\Desktop\TM-MEUS-APPS\`
- **Branch**: `main`
- **GitHub**: `https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS`
- **Regras**: `.agent/rules/TM-COMMIT-RULES.md`

---

## Dúvidas ou Problemas?

Execute:
```
/tm-commit help
```

Ou consulte:
- `README.md` — Quick start
- `TROUBLESHOOTING.md` — Soluções comuns
- `.agent/rules/TM-COMMIT-RULES.md` — Regras técnicas
