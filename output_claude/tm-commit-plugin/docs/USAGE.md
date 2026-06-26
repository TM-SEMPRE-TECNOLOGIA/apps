# 📚 Guia de Uso - TM-COMMIT Plugin

Exemplos práticos de como usar o plugin em diferentes cenários.

---

## 🎯 Cenários Comuns

### Cenário 1: Criar um Novo Agente em output_claude/

```bash
User: Cria arquivo em C:\...\output_claude\tm-relatorio.md

📁 Mudança detectada: tm-relatorio.md (1.2 KB)

User: /tm-commit status
📊 Status:
• output_claude/: 1 arquivo novo

User: /tm-commit push
🤖 Sugestão: feat(agentes): criar tm-relatorio

[Aceitar] [Editar] [Cancelar]

User: Aceitar

✅ $ git add output_claude/
✅ $ git commit -m "feat(agentes): criar tm-relatorio"
✅ $ git push origin main

📊 Commit: abc12345
🔗 https://github.com/.../commit/abc12345
```

---

### Cenário 2: Documentação com Múltiplos Arquivos

```bash
User: Cria 3 arquivos:
- MAPA_REPOSITORIO.md
- CHEAT_SHEET.md
- ARQUITETURA.md

📁 Mudança detectada em output_claude/
✏️ 3 arquivos novos

User: /tm-commit sync

🔄 Sincronizando...
1️⃣ git pull origin main → Already up to date
2️⃣ Staging 3 arquivos
3️⃣ Sugestão: docs(output_claude): adicionar documentação

User: Editar
User: docs(output_claude): adicionar mapa, cheat sheet e arquitetura

4️⃣ ✅ git commit -m "docs(output_claude): adicionar mapa, cheat sheet e arquitetura"
5️⃣ ✅ git push origin main

✅ Sincronizado com sucesso
```

---

### Cenário 3: Bug Fix em Gitignore

```bash
User: Edita .gitignore para adicionar .venv

📁 Mudança detectada: .gitignore

User: /tm-commit push

🤖 Sugestão: chore: atualizar .gitignore

[Aceitar] [Editar] [Cancelar]

User: Editar
User: fix(gitignore): adicionar .venv à exclusão

✅ Commit abc98765
🔗 https://github.com/.../commit/abc98765
```

---

### Cenário 4: Sessão com Múltiplas Mudanças

```bash
Chat 1: Cria novo agente
Chat 2: Adiciona documentação
Chat 3: Refatora skills

Ao final da sessão (Chat 3):

📋 Resumo da Sessão - TM-MEUS-APPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Criados: 5
✏️ Modificados: 2
🗑️ Deletados: 0
💾 Tamanho: 2.3 MB

Deseja fazer commit e push?
[1] Sim, auto-commit
[2] Não, deixar para depois
[3] Revisar mudanças

User: 1

🤖 Sugestão: chore: sincronizar checkpoint

User: Aceitar

✅ 5 arquivos staged
✅ $ git commit -m "chore: sincronizar checkpoint"
✅ $ git push origin main

✨ Repositório atualizado
```

---

## 📊 Exemplos de Comandos

### Ver Status

```bash
/tm-commit status

📋 Status do Repositório

✅ Git sincronizado
✅ Nenhuma credencial exposta
✅ 8 pastas monitoradas
✅ Última sincronização: agora
✅ Próximo checkpoint: em 10 chats

📊 Mudanças Detectadas:
• output_claude/: 2 arquivos novos
• Obisidian/: 1 arquivo modificado
• Outros: Sem mudanças

💡 Próximo passo:
/tm-commit push (para fazer staging e push)
```

---

### Fazer Staging

```bash
/tm-commit add

🔧 Fazendo staging...

Staged:
1. output_claude/novo-arquivo.md
2. Obisidian/nota-importada.md

✅ 2 arquivos staged

💡 Próximo passo:
/tm-commit commit "tipo(escopo): descrição"
```

---

### Criar Commit Manual

```bash
/tm-commit commit "feat(output): criar novo dashboard"

📝 Criando commit...

Mensagem: feat(output): criar novo dashboard

✅ Commit criado (local)
Hash: abc12345

💡 Próximo passo:
/tm-commit push
```

---

### Fazer Push

```bash
/tm-commit push

🚀 Fazendo push para GitHub...

Conectando a: https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS
Branch: main
Objetos: 15
Tamanho: 450 KB

✅ Push Realizado!

📊 Resumo:
• Commit: abc12345
• Branch: main
• Status: Sincronizado

🔗 Ver no GitHub: https://github.com/.../commit/abc12345
```

---

### Sincronização Completa

```bash
/tm-commit sync

🔄 Sincronizando repositório...

1️⃣ git pull origin main
   Already up to date

2️⃣ git add <pastas monitoradas>
   Staged: 3 arquivos

3️⃣ Sugestão: chore: sincronizar checkpoint
   [Aceitar] [Editar] [Cancelar]
   
   User: Aceitar

4️⃣ git commit -m "chore: sincronizar checkpoint"
   Commit abc12345 criado

5️⃣ git push origin main
   Push realizado com sucesso

✅ Sincronização Completa!

📊 Status Final:
• Mudanças locais: ✅ No GitHub
• Repositório: ✅ Atualizado
• Próxima ação: Pronto para nova sessão
```

---

### Ver Histórico de Commits

```bash
/tm-commit log 5

📜 Últimos 5 commits

1. abc12345 - feat(agentes): criar tm-commit skill
2. 35dd6460 - docs: criar mapa estruturado
3. e1407139 - feat: criar pasta output_claude
4. 45329568 - Merge branch 'main'
5. 6b5c51a9 - chore: adicionar conteudo das pastas

💡 Ver commit completo:
https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS/commit/abc12345
```

---

### Limpeza de Branches

```bash
/tm-commit clean

🧹 Analisando branches...

Branches antigas encontradas:
1. test (merged 2 semanas atrás)
2. dev (desatualizada)
3. feature/old (abandonada)

Remover? [Sim] [Não]

User: Sim

✅ Cleanup concluído!
Branches removidas: 3
```

---

## ⚙️ Configurações

### Ver Opção de Auto-commit Atual

```bash
/tm-commit settings

🔧 Configurações - TM-COMMIT

Opção de detecção: [2] Perguntar Sempre

[1] Apenas Notificar
    → Plugin avisa, você decide

[2] Perguntar Sempre (ATIVA)
    → Plugin pergunta antes de staging

[3] Auto-commit Sem Perguntar
    → Plugin faz tudo sozinho

Mudar para? [1] [2] [3] [Não alterar]

User: 2

✅ Mantida opção 2
```

---

### Mudar Opção de Auto-commit

```bash
/tm-commit settings

User: 3

⚙️ Mudando para [3] Auto-commit Sem Perguntar...

⚠️ Aviso: Nesta opção, commits serão feitos automaticamente
quando você criar/modificar arquivos.

Tem certeza? [Sim] [Não]

User: Sim

✅ Opção mudada para [3]

A partir da próxima detecção:
📁 Mudança detectada → Auto-commit + push (sem perguntar)
```

---

## 🔒 Lidar com Credenciais

### Se Credencial for Detectada

```bash
User: Cria .env com senha

⚠️ AVISO: Credencial detectada!

Arquivo: .env
Padrão: API_KEY, PASSWORD

→ Arquivo NÃO será commitado
→ Remova a credencial antes de tentar
→ Ou adicione .env a .gitignore

/tm-commit status

Mudanças:
• output_claude/: safe files
❌ .env: BLOQUEADO (credencial)
```

---

### Resolver Credencial

```bash
1. Remova conteúdo sensível de .env:
   ANTES: API_KEY=sk-1234567890
   DEPOIS: API_KEY=

2. Ou remova arquivo:
   rm .env

3. Adicione a .gitignore (se aplicável):
   echo ".env" >> .gitignore

4. Tente novamente:
   /tm-commit push

✅ Sem credenciais, push realizado
```

---

## 🆘 Se Algo Falhar

### Erro: "index.lock exists"

```bash
/tm-commit force-clean

🧹 Limpando lock files...

Removido: .git/index.lock

✅ Repositório limpo
Tente novamente: /tm-commit status
```

### Erro: "rejected - remote has work"

```bash
/tm-commit sync

🔄 Sincronizando...
1️⃣ git pull origin main
   CONFLICT: Resolve conflicts...

2️⃣ Resolvendo...
3️⃣ git push origin main
   ✅ Push realizado

Sem conflitos? Continue normalmente.
Com conflitos? Veja TROUBLESHOOTING.md
```

---

**Pronto para usar!** 🚀
