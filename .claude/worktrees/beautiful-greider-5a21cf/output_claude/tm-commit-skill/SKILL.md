# tm-commit Skill

**Descrição:** Agente automático de versionamento Git para TM-MEUS-APPS. Detecta mudanças, cria commits estruturados e sincroniza com GitHub.

**Tipo:** Skill (reutilizável)  
**Versão:** 1.0  
**Compatibilidade:** Cowork, Claude Code, Chat  
**Status:** Ativo

---

## O Que Faz

O skill `/tm-commit` automatiza o fluxo Git completo:

✅ **Detecta** mudanças em pastas monitoradas  
✅ **Stages** arquivos automaticamente  
✅ **Cria** commits com Conventional Commits  
✅ **Faz push** para GitHub main branch  
✅ **Relata** status e sincronização  
✅ **Gerencia** branches e cleanup  

---

## Como Usar

### Invocação Rápida

```
/tm-commit                    # Status geral
/tm-commit status             # Ver mudanças
/tm-commit add                # Fazer staging
/tm-commit commit             # Criar commit com mensagem
/tm-commit push               # Fazer push
/tm-commit sync               # Pull + Push completo
/tm-commit log [n]            # Ver últimos n commits
/tm-commit clean              # Limpar branches antigas
```

### Exemplos

```
/tm-commit status
→ Detecta 3 arquivos novos em output_claude/
→ Sugere mensagem de commit

/tm-commit push
→ Valida segurança (não há secrets)
→ Faz git push origin main
→ Mostra URL do commit no GitHub

/tm-commit sync
→ git pull origin main
→ Resolve conflitos se houver
→ git push origin main
→ Status final
```

---

## Configuração

### Arquivo de Regras (Obrigatório)

Localização: `.agent/rules/TM-COMMIT-RULES.md`

O skill lê automaticamente este arquivo que contém:
- Pastas monitoradas
- Padrão de commits
- Regras de segurança
- Comportamento em cada chat

### Pasta Monitorada

Pasta raiz: `C:\Users\thiag\Desktop\TM-MEUS-APPS\`

Subpastas rastreadas:
```
✅ 01_Golden_Apps_meu_uso/
✅ 03_Arquivo_Morto_Legado/
✅ output_claude/
✅ Obisidian/
✅ TM Design System - NOVO Laranjado/
✅ TM Marketing/
✅ Monetizacao_com_IA/
✅ Meus Plugins e Skills/
```

Não rastreadas (gitignored):
```
❌ .agent/
❌ .claude/
❌ .venv/
❌ .vs/
❌ node_modules/
❌ *.log
```

---

## Comportamento Automático

### Em Cada Sessão

**Início:**
```
🔄 Sincronizando repositório TM-MEUS-APPS...
Status: Tudo atualizado ✓
ou
Status: 3 mudanças não commitadas
```

**Durante:**
```
📁 Arquivo criado: output_claude/novo-agente.md
Auto-staging agendado...
```

**Fim:**
```
📋 Resumo da Sessão:
- Arquivos criados: 2
- Modificados: 1
- Deletados: 0
- Tamanho: 500 KB

Deseja fazer commit e push? [Sim/Não/Depois]
```

---

## Padrão de Commits

Segue **Conventional Commits** (https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição>

<corpo opcional>

<rodapé opcional>
```

### Tipos

| Tipo | Uso | Exemplo |
|------|-----|---------|
| `feat` | Nova funcionalidade | `feat(agentes): criar tm-relatorio` |
| `fix` | Bug corrigido | `fix(gitignore): remover .env` |
| `docs` | Documentação | `docs(mapa): atualizar estrutura` |
| `refactor` | Reorganização | `refactor(skills): mover para output` |
| `chore` | Manutenção | `chore: sincronizar checkpoint` |
| `test` | Testes | `test(tm-commit): validar regras` |
| `perf` | Performance | `perf(autorelatorio): otimizar` |
| `ci` | CI/CD | `ci(github): adicionar workflow` |

### Exemplos Bons

```
✅ feat(output_claude): criar dashboard HTML com dark mode
✅ docs(readme): documentar estrutura de pastas
✅ fix(gitignore): adicionar .venv à exclusão
✅ chore: sincronizar repositório - checkpoint
✅ refactor(agentes): reorganizar skills em output_claude
```

---

## Fluxo de Execução

### 1. Detecção
```bash
git status
```
Se houver mudanças, continua para passo 2.

### 2. Validação de Segurança
- ❌ Verifica se há credenciais (.env, secrets.json, API keys)
- ❌ Alerta sobre arquivos > 100MB
- ✅ Respeita `.gitignore`

### 3. Staging por Pasta
```bash
git add 01_Golden_Apps_meu_uso/ 2>/dev/null || true
git add output_claude/ || true
git add Obisidian/ 2>/dev/null || true
# ... outras pastas
```

### 4. Commit
```bash
git commit -m "tipo(escopo): descrição"
```

### 5. Push
```bash
git push origin main -v
```

Se falhar com `rejected`:
```bash
git pull origin main
# Resolver conflitos
git push origin main
```

### 6. Relatório
```
✅ Commit Realizado

📊 Resumo:
- Branch: main
- Commit: abc12345 (5b688fb2)
- Mensagem: docs: adicionar cheat sheet
- Arquivos: 1 novo
- Tamanho: 181 KB
- URL: https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS/commit/5b688fb2

✅ Sincronizado com GitHub
```

---

## Checklist de Segurança

Antes de cada push, o skill verifica:

- [ ] Nenhuma credencial exposta
- [ ] Nenhum `.env`, `secrets.json`, API keys
- [ ] Padrão de commit respeita convenção
- [ ] Sem conflitos pendentes
- [ ] Conexão com GitHub funciona
- [ ] Branch sincronizado com remote
- [ ] Arquivos > 50MB documentados

---

## Regras Invioláveis

### ❌ NÃO FAÇA

1. **Não commitar credenciais**
   - Detecta automaticamente e alerta

2. **Não usar force push**
   - `git push --force` é bloqueado

3. **Não commitir arquivos > 100MB**
   - Sugere Git LFS automaticamente

4. **Não fazer merge automático**
   - Sempre informa sobre conflitos

5. **Não deletar branches sem confirmar**
   - Pede confirmação explícita

---

## Permissões Necessárias

O skill `/tm-commit` pode:
- ✅ Ler arquivos em pastas monitoradas
- ✅ Executar comandos Git (add, commit, push, pull)
- ✅ Acessar `.gitignore`
- ✅ Ler regras em `.agent/rules/`
- ❌ Não pode deletar arquivos
- ❌ Não pode alterar `.git` diretamente

---

## Integração com Outros Agentes

O skill `/tm-commit` funciona junto com:

- **Claude (main)** → Cria arquivos em `output_claude/`
- **`/tm-relatorio`** → Detecta relatórios e commita
- **`/tm-designer`** → Detecta páginas HTML e commita
- Qualquer outro agente que salve em pastas monitoradas

---

## Configuração Avançada

### Customizar Tipos de Commit

Edite `.agent/rules/TM-COMMIT-RULES.md` seção "Tipos Permitidos"

### Customizar Pastas Monitoradas

Edite `.agent/rules/TM-COMMIT-RULES.md` seção "Pastas Monitoradas"

### Customizar Intervalo de Checkpoint

Default: A cada 10 chats  
Edite em `.agent/rules/TM-COMMIT-RULES.md`

---

## Exemplos de Sessão Completa

### Cenário 1: Criar Novo Agente

```
User: Cria agente /tm-relatorio

Claude: Criando /tm-relatorio...
        Salvando em output_claude/agentes/tm-relatorio.md

/tm-commit (automático):
[Detecta] 1 arquivo novo em output_claude/

Deseja fazer commit? [Sim/Não/Depois]

User: Sim

/tm-commit:
$ git add output_claude/
$ git commit -m "feat(agentes): criar tm-relatorio"
$ git push origin main

✅ Commit 5a2f1b3: feat(agentes): criar tm-relatorio
✅ Sincronizado com GitHub
```

### Cenário 2: Modificar Documentação

```
User: Atualizar CHEAT_SHEET.md

Claude: Atualizando...

/tm-commit (automático):
[Detecta] CHEAT_SHEET.md modificado

Deseja fazer commit? [Sim/Não/Depois]

User: Sim

/tm-commit:
$ git add CHEAT_SHEET.md
$ git commit -m "docs(referencia): atualizar cheat sheet"
$ git push origin main

✅ Commit 3c7a2e1: docs(referencia): atualizar cheat sheet
✅ Sincronizado com GitHub
```

### Cenário 3: Cleanup de Branches

```
User: /tm-commit clean

/tm-commit:
Analisando branches...

Branches antigas encontradas:
- test (merged 2 semanas atrás)
- dev (desatualizada)
- feature/old (abandonada)

Deletar? [Sim/Não]

User: Sim

$ git branch -d test
$ git push origin --delete test
✓ test removida

✓ dev removida
✓ feature/old removida

Cleanup concluído!
```

---

## Troubleshooting

### Erro: "index.lock exists"
```
/tm-commit force-clean
→ Remove .git/index.lock
→ Retenta operação
```

### Erro: "rejected - remote has work"
```
/tm-commit sync
→ git pull origin main
→ Resolve conflitos
→ git push origin main
```

### Erro: "credencial exposta"
```
/tm-commit
⚠️ Credencial detectada: .env
❌ Commit bloqueado

Ações:
1. Remova a credencial
2. Adicione a .gitignore
3. Tente novamente
```

---

## Métricas e Estatísticas

O skill rastreia:

```
📊 Estatísticas da Sessão:
- Total de commits: 47
- Arquivos alterados: 238
- Linhas adicionadas: 15,234
- Linhas removidas: 3,421
- Média de commits/dia: 1.5
- Branch mais ativa: main
- Último push: 5 minutos atrás
- Próximo checkpoint: em 5 chats
```

---

## Atualização de Versão

**Versão Atual:** 1.0  
**Data de Criação:** 2026-05-12  
**Última Atualização:** 2026-05-12  
**Próxima Revisão:** 2026-06-12

### Histórico

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 2026-05-12 | Criação inicial do skill |

---

## Suporte e Feedback

Problemas ou sugestões?

```
/tm-commit feedback "Sugestão aqui"
→ Cria issue no GitHub
→ Ou salva em output_claude/feedback/

/tm-commit debug
→ Mostra logs detalhados
→ Ajuda na resolução de problemas
```

---

## Licença e Uso

Este skill é **específico para TM-MEUS-APPS** e pode ser:
- ✅ Usado em qualquer sessão de chat
- ✅ Modificado conforme necessário
- ✅ Compartilhado com outros agentes
- ✅ Versionado no Git

---

**Pronto para usar! Invoke com `/tm-commit` em qualquer chat.**
