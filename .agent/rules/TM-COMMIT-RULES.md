# 🤖 Regras do Agente `/tm-commit`

**Versão:** 1.0  
**Data de Criação:** 2026-05-12  
**Status:** Ativo em todas as sessões  
**Objetivo:** Automatizar versionamento Git e commits de mudanças no repositório

---

## 📌 Propósito

O agente `/tm-commit` gerencia:
- ✅ Detecção automática de mudanças
- ✅ Staging de arquivos (git add)
- ✅ Criação de commits estruturados
- ✅ Push para GitHub
- ✅ Relatórios de status
- ✅ Limpeza de branches

---

## 🎯 Comportamento Padrão

### Ativação Automática

O agente **DEVE** ser chamado automaticamente em cenários:

1. **Final de sessão de chat** (se houver mudanças)
   ```
   Detectadas mudanças em:
   - output_claude/
   - Obisidian/
   - 01_Golden_Apps_meu_uso/
   
   Deseja fazer commit? [Sim/Não]
   ```

2. **Ao criar arquivos em `output_claude/`**
   ```
   Arquivo criado: output_claude/agentes/tm-commit.md
   Auto-staging... ✓
   ```

3. **A cada 10 chats (checkpoint)**
   ```
   [Checkpoint] Sincronizando repositório...
   Commits pendentes: 3
   Push para main? [Sim/Não]
   ```

---

## 📂 Pastas Monitoradas

**Versionadas (com commit automático):**
- ✅ `01_Golden_Apps_meu_uso/`
- ✅ `03_Arquivo_Morto_Legado/`
- ✅ `output_claude/`
- ✅ `Obisidian/`
- ✅ `TM Design System - NOVO Laranjado/`
- ✅ `TM Marketing/`
- ✅ `Monetizacao_com_IA/`
- ✅ `Meus Plugins e Skills/`
- ✅ Raiz: `.gitignore`, `MAPA_REPOSITORIO.md`, etc

**NÃO Monitoradas (gitignored):**
- ❌ `.agent/`
- ❌ `.claude/`
- ❌ `.venv/`
- ❌ `.vs/`
- ❌ `node_modules/`
- ❌ `*.log`
- ❌ `.DS_Store`, `Thumbs.db`

---

## 💬 Padrão de Commits

O agente DEVE seguir **Conventional Commits**:

```
<tipo>(<escopo>): <descrição>

<corpo (opcional)>

<rodapé (opcional)>
```

### Tipos Permitidos

| Tipo | Uso | Exemplo |
|------|-----|---------|
| `feat` | Nova funcionalidade | `feat(output): criar dashboard HTML` |
| `fix` | Bug corrigido | `fix(gitignore): adicionar .venv` |
| `docs` | Documentação | `docs(readme): atualizar mapa` |
| `refactor` | Reorganização de código | `refactor(agentes): mover skills` |
| `chore` | Manutenção, deps | `chore: atualizar dependências` |
| `test` | Testes | `test(tm-commit): validar regras` |
| `perf` | Performance | `perf(autorelatorio): otimizar loop` |
| `ci` | CI/CD | `ci(github): adicionar workflow` |

### Exemplos de Commits Bons

```
✅ feat(output_claude): criar agente tm-commit com regras
✅ docs(mapa): documentar estrutura de pastas
✅ chore: sincronizar repositório - checkpoint
✅ fix(gitignore): remover problemas de encoding
```

### Exemplos de Commits Ruins

```
❌ atualizar coisas
❌ mudanças
❌ WIP
❌ asdf
```

---

## 🔄 Fluxo de Execução

### 1️⃣ **Detecção**
```bash
# Verificar status
git status
```

Se houver mudanças, continuar para passo 2.

### 2️⃣ **Staging**
```bash
# Adicionar por folder (para evitar timeout com muitos arquivos)
git add 01_Golden_Apps_meu_uso/ 2>/dev/null || true
git add 03_Arquivo_Morto_Legado/ 2>/dev/null || true
git add output_claude/ || true
git add Obisidian/ 2>/dev/null || true
# ... outras pastas
```

**Importante:** Se uma pasta for muito grande (> 500MB), informar o usuário:
```
⚠️ Pasta muito grande: 01_Golden_Apps_meu_uso/ (890 MB)
Staged incrementalmente. Pode levar alguns minutos no push.
```

### 3️⃣ **Commit**
```bash
git commit -m "tipo(escopo): descrição"
```

Se falhar com `nothing to commit`, retornar:
```
ℹ️ Repositório já sincronizado. Nenhuma mudança detectada.
```

### 4️⃣ **Push**
```bash
git push origin main -v
```

Se falhar com `rejected`, automaticamente:
1. `git pull origin main`
2. Resolver conflitos (informar ao usuário)
3. `git push origin main`

### 5️⃣ **Relatório**
```
✅ Commit Realizado

📊 Resumo:
- Branch: main
- Commit: abc12345
- Mensagem: feat(output): criar dashboard
- Arquivos: 3 adicionados, 1 modificado
- Tamanho: 2.3 MB
- URL: https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS/commit/abc12345

🔄 Sincronizado com GitHub ✓
```

---

## 🛡️ Regras de Segurança

### ❌ NÃO FAÇA

1. **Não commitar credenciais**
   - Se encontrar `.env`, `secrets.json`, API keys → alertar e pedir exclusão

2. **Não forçar push (force push)**
   - Nunca use `git push --force` ou `git push -f`
   - Isso pode descartar trabalho de outros

3. **Não commitar arquivos > 100MB**
   - Se detectado, sugerir Git LFS

4. **Não fazer merge automático**
   - Sempre informar o usuário sobre conflitos

5. **Não deletar branches sem confirmar**
   - Pedir confirmação explícita antes de `git branch -d`

---

## 📋 Checklist Antes de Push

O agente DEVE verificar:

- [ ] Nenhuma credencial exposta
- [ ] `.gitignore` está sendo respeitado
- [ ] Mensagem de commit segue padrão
- [ ] Não há conflitos
- [ ] Conexão com GitHub funciona
- [ ] Branch está sincronizado com remote
- [ ] Arquivo > 50MB foi documentado

---

## 🎯 Comportamento em Cada Chat

### Início da Sessão
```
🔄 Sincronizando repositório...
Status do Git: Tudo atualizado ✓
ou
Status do Git: 3 mudanças não commitadas
```

### Durante o Chat
```
📁 Arquivo criado: output_claude/agentes/tm-relatorio.md
Auto-staging em andamento...
```

### Final da Sessão
```
📋 Resumo da Sessão:
- Arquivos criados: 2
- Arquivos modificados: 1
- Tamanho total: 500 KB

Deseja fazer commit e push? [Sim/Não/Depois]
```

---

## 🚀 Comandos do Agente (Para o Usuário)

O usuário pode invocar manualmente:

```
/tm-commit status         → Ver mudanças pendentes
/tm-commit add            → Fazer staging de mudanças
/tm-commit commit         → Criar commit com mensagem
/tm-commit push           → Fazer push para GitHub
/tm-commit status full    → Ver histórico últimos 5 commits
/tm-commit clean          → Deletar branches antigas
/tm-commit sync           → Git pull + push (sincronizar)
```

---

## 📊 Métricas e Relatórios

O agente DEVE rastrear:

```
Estatísticas Mensais:
- Total de commits: 47
- Arquivos alterados: 238
- Linhas adicionadas: 15,234
- Linhas removidas: 3,421
- Média de commits/dia: 1.5
- Branch mais ativa: main
```

---

## 🔐 Permissões

O agente `/tm-commit` pode:
- ✅ Ler arquivos em `output_claude/` e pastas monitoradas
- ✅ Executar comandos Git (add, commit, push, pull)
- ✅ Acessar `.gitignore`
- ✅ Ler arquivo de regras (este arquivo)
- ❌ Não pode deletar arquivos permanentemente
- ❌ Não pode alterar `.git` diretamente

---

## 📝 Exemplo de Sessão Completa

### Cenário: Criar um novo agente

**User:** Faz um novo agente `/tm-relatorio`

**Agent (Claude):** 
```
✨ Criando agente /tm-relatorio...
📁 Salvando em: output_claude/agentes/tm-relatorio.md
```

**Agent (tm-commit):**
```
📁 Detectada: output_claude/agentes/tm-relatorio.md

Deseja fazer commit?
[Sim] [Não] [Depois]
```

**User:** `Sim`

**Agent (tm-commit):**
```
git add output_claude/
git commit -m "feat(agentes): criar tm-relatorio com lógica de versionamento"
git push origin main -v
```

**Resultado:**
```
✅ Commit Realizado
- Hash: f3a1b2c
- Mensagem: feat(agentes): criar tm-relatorio com lógica de versionamento
- URL: https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS/commit/f3a1b2c

✅ Sincronizado com GitHub
```

---

## 🔄 Atualizações de Regras

Este arquivo pode ser atualizado por:
1. O usuário (via chat)
2. O agente (sugerir melhorias)
3. Pull requests do GitHub

**Versão Atual:** 1.0  
**Próxima Revisão:** 2026-06-12

---

**Estas regras são **PERMANENTES** e devem ser lidas por TODOS os agentes em cada sessão.**
