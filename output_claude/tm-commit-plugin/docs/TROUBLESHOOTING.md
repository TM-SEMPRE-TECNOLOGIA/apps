# 🔧 Troubleshooting - TM-COMMIT Plugin

Soluções para problemas comuns que você pode encontrar.

---

## 🚨 Erros Comuns e Soluções

### Erro: "index.lock exists"

**Quando ocorre:** Ao tentar fazer `git add` ou `git commit`

**Mensagem:**
```
fatal: Unable to create '.git/index.lock': File exists.

If no other git process is running, this probably means a
git process crashed in this repository earlier.
```

**Solução:**

```bash
/tm-commit force-clean

Ou manualmente:
rm C:\Users\thiag\Desktop\TM-MEUS-APPS\.git\index.lock
```

Depois tente novamente:
```bash
/tm-commit status
```

---

### Erro: "rejected - remote has work that you do not have locally"

**Quando ocorre:** Ao tentar fazer `git push` quando GitHub tem commits não sincronizados

**Mensagem:**
```
! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'origin'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another process pushing
```

**Causa:** GitHub Actions ou outro usuário fez commit/push

**Solução:**

```bash
# Opção 1: Use /tm-commit sync (recomendado)
/tm-commit sync
→ Faz pull, resolve conflitos, faz push

# Opção 2: Manual
git pull origin main
git push origin main
```

---

### Erro: "credencial exposta"

**Quando ocorre:** Ao tentar fazer commit com arquivo `.env` ou `secrets.json`

**Mensagem:**
```
⚠️ AVISO: Credencial detectada em arquivo.env
→ Arquivo NÃO será commitado
→ Remova a credencial antes de tentar novamente
```

**Solução:**

```bash
# 1. Remova a credencial do arquivo
# Edite o arquivo e remova conteúdo sensível

# 2. Adicione a .gitignore
echo ".env" >> .gitignore
echo "*.key" >> .gitignore
echo "secrets.json" >> .gitignore

# 3. Tente novamente
/tm-commit push
```

---

### Erro: "arquivo > 100 MB"

**Quando ocorre:** Ao tentar fazer commit com arquivo grande

**Mensagem:**
```
⚠️ AVISO: Arquivo muito grande
arquivo_grande.zip (250 MB) > 100 MB permitido
→ Não será commitado
```

**Solução:**

```bash
# 1. Remova arquivo do staging
git reset arquivo_grande.zip

# 2. Adicione a .gitignore
echo "*.zip" >> .gitignore

# 3. Use Git LFS para arquivos grandes (opcional)
git lfs install
git lfs track "*.zip"

# 4. Tente novamente
/tm-commit push
```

---

### Erro: "não é um repositório Git"

**Quando ocorre:** Ao tentar usar plugin em pasta sem `.git/`

**Mensagem:**
```
fatal: not a git repository (or any of the parent directories): .git
```

**Solução:**

```bash
# 1. Verifique se está na pasta correta
C:\Users\thiag\Desktop\TM-MEUS-APPS

# 2. Se não for repositório, clone:
git clone https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS
cd TM-MEUS-APPS

# 3. Tente novamente
/tm-commit status
```

---

### Erro: "conflito de merge"

**Quando ocorre:** Ao fazer `git pull` e haver conflitos

**Mensagem:**
```
CONFLICT (content conflict): Merge conflict in arquivo.md
Automatic merge failed; fix conflicts and then commit the result.
```

**Solução:**

```bash
# 1. Veja quais arquivos estão em conflito
git status

# 2. Abra cada arquivo e resolva manualmente
# Procure por:
# <<<<<<< HEAD
# seu conteúdo
# =======
# conteúdo remoto
# >>>>>>> branch

# 3. Escolha qual versão manter

# 4. Faça o commit do merge
git add arquivo.md
git commit -m "chore: resolver merge conflict"

# 5. Ou use /tm-commit sync
/tm-commit sync
```

---

### Erro: "permission denied"

**Quando ocorre:** Ao tentar clonar ou fazer push sem autenticação

**Mensagem:**
```
Permission denied (publickey).
fatal: Could not read from remote repository.
```

**Solução:**

#### Se Usar SSH:
```bash
# 1. Gere SSH key (se não tiver)
ssh-keygen -t ed25519 -C "seu.email@example.com"

# 2. Adicione a GitHub:
# https://github.com/settings/keys
# Copie: cat ~/.ssh/id_ed25519.pub

# 3. Teste conexão
ssh -T git@github.com
→ Deve mostrar: "Hi [seu-usuario]! You've successfully authenticated"
```

#### Se Usar HTTPS:
```bash
# 1. Gere Personal Access Token em GitHub:
# https://github.com/settings/tokens
# Permissões: repo (acesso completo)

# 2. Configure Git:
git config --global credential.helper wincred

# 3. Primeira vez que fizer push, use token como senha:
git push origin main
# username: seu-usuario-github
# password: seu-token-aqui

# 4. Depois será memorizado
```

---

## 📊 Problemas de Configuração

### Plugin não aparece no Cowork

**Solução:**

```bash
# 1. Verifique pasta de plugins
C:\Users\[seu-user]\AppData\Roaming\Claude\plugins\

# 2. Copie plugin lá
Copy-Item -Path "C:\Users\thiag\Desktop\TM-MEUS-APPS\output_claude\tm-commit-plugin" `
  -Destination "C:\Users\[seu-user]\AppData\Roaming\Claude\plugins\tm-commit" `
  -Recurse

# 3. Reinicie Cowork
```

---

### `/tm-commit status` mostra "Git não configurado"

**Solução:**

```bash
# 1. Configure Git user
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"

# 2. Verifique
git config --global --list

# 3. Tente novamente
/tm-commit status
```

---

### Plugin não detecta mudanças

**Solução:**

```bash
# 1. Verifique se os arquivos estão em pasta monitorada
# Pastas válidas:
# - C:\...\output_claude\
# - C:\...\01_Golden_Apps_meu_uso\
# - C:\...\Obisidian\
# etc.

# 2. Veja status manualmente
/tm-commit status

# 3. Se ainda não aparecer, verifique .gitignore
cat .gitignore

# 4. Se arquivo está em .gitignore, remova:
# Edite .gitignore e remova a linha do seu arquivo
```

---

## 🔍 Diagnóstico Avançado

### Ver Logs Detalhados

```bash
/tm-commit debug

# Mostrará:
# - Git status
# - Últimos commits
# - Configuração
# - Erros recentes
```

---

### Forçar Reset Local

**⚠️ Cuidado: Isso descarta mudanças locais não commitadas**

```bash
# Resetar tudo para estado do GitHub
git fetch origin
git reset --hard origin/main

# Depois:
/tm-commit status
```

---

### Limpar Tudo

```bash
# Remove branches deletadas em GitHub
git fetch --prune

# Limpa cache local
git gc

# Valida integridade
git fsck --full
```

---

## 💡 Dicas de Prevenção

### 1. Sempre Faça Pull Antes de Começar

```bash
/tm-commit sync
```

### 2. Commite Regularmente

Não deixe muitos arquivos acumulando. A cada nova funcionalidade:
```bash
/tm-commit push
```

### 3. Adicione a .gitignore

```bash
# Sempre ignore:
.env
.venv/
*.key
secrets.json
node_modules/
.DS_Store
*.log
```

### 4. Use Mensagens Descritivas

```bash
❌ Ruim: chore: update
✅ Bom: feat(output_claude): criar novo dashboard HTML
```

### 5. Revise Antes de Fazer Push

```bash
/tm-commit status
→ Veja o que será commitado

/tm-commit log 1
→ Veja último commit
```

---

## 🆘 Se Tudo Falhar

### Opção Nuclear: Reclonar Repositório

```bash
# 1. Faça backup dos arquivos importantes
copy-item -path "C:\Users\thiag\Desktop\TM-MEUS-APPS" `
  -destination "C:\Users\thiag\Desktop\TM-MEUS-APPS.backup" -recurse

# 2. Remova pasta local
rmdir "C:\Users\thiag\Desktop\TM-MEUS-APPS" -recurse -force

# 3. Clone novamente
git clone https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS

# 4. Copia seus arquivos de volta (manualmente, se necessário)
```

---

### Contato de Suporte

Se não conseguir resolver:

1. Veja `FAQ.md` para perguntas frequentes
2. Leia `SKILL.md` para especificação técnica
3. Execute `/tm-commit help`
4. Verifique logs em `/tm-commit debug`

---

**Sucesso!** 🚀
