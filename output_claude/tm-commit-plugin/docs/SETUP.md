# 📦 Guia de Instalação - TM-COMMIT Plugin

Passo a passo para instalar e configurar o plugin TM-COMMIT em seu Cowork.

---

## ✅ Pré-requisitos

- Cowork Desktop 1.0+ instalado
- Repositório TM-MEUS-APPS já clonado em `C:\Users\[seu-user]\Desktop\TM-MEUS-APPS\`
- Git instalado e configurado (`git config --global user.name` e `user.email`)
- Acesso a GitHub (token de acesso se necessário)

---

## 📥 Instalação - 3 Opções

### **Opção 1: Instalar via Plugin do Cowork (Recomendado)**

1. **Abra o Cowork**
2. **Clique em "Plugins"** (menu lateral)
3. **Procure por "tm-commit"** ou cole este path:
   ```
   C:\Users\thiag\Desktop\TM-MEUS-APPS\output_claude\tm-commit-plugin
   ```
4. **Clique em "Instalar"**
5. **Reinicie o Cowork**

✅ Pronto! O plugin está ativo.

---

### **Opção 2: Manual - Copiar Pasta**

1. **Localize a pasta do plugin:**
   ```
   C:\Users\thiag\Desktop\TM-MEUS-APPS\output_claude\tm-commit-plugin
   ```

2. **Copie para a pasta de plugins Cowork:**
   ```
   C:\Users\[seu-user]\AppData\Roaming\Claude\plugins\tm-commit
   ```

3. **Reinicie o Cowork**

✅ Plugin auto-carregará

---

### **Opção 3: Via CLI (Se instalado)**

```bash
claude plugin install C:\Users\thiag\Desktop\TM-MEUS-APPS\output_claude\tm-commit-plugin
```

---

## ⚙️ Configuração Inicial

### 1️⃣ **Verificar Instalação**

Abra um novo chat e execute:

```
/tm-commit status
```

**Esperado:**
```
📋 Status do Repositório

✅ Git sincronizado
✅ Nenhuma credencial exposta
✅ 8 pastas monitoradas detectadas
✅ Última sincronização: agora
```

Se vir isso, a instalação foi bem-sucedida! ✅

### 2️⃣ **Configurar Opção de Auto-commit**

O plugin oferece 3 opções para detecção de mudanças:

```bash
/tm-commit settings
```

Escolha uma:

```
[1] Apenas Notificar (sem automação)
    → Plugin avisa, você decide o que fazer
    → Mais controle, menos automático

[2] Perguntar Sempre (recomendado)
    → Plugin avisa e oferece staging
    → Balanço entre controle e automação

[3] Auto-commit Sem Perguntar
    → Plugin faz tudo automaticamente
    → Máxima automação, mínimo controle
```

**Recomendação:** Opção 2 (Perguntar Sempre)

### 3️⃣ **Testar o Plugin**

1. **Crie um arquivo de teste:**
   ```
   C:\Users\thiag\Desktop\TM-MEUS-APPS\output_claude\teste.txt
   ```

2. **Execute:**
   ```
   /tm-commit status
   ```

3. **Você deve ver:**
   ```
   📊 Mudanças Detectadas:
   • output_claude/: 1 arquivo novo
   ```

4. **Faça um push teste:**
   ```
   /tm-commit push
   ```

5. **Confirme a sugestão:**
   - Plugin sugere: `chore: adicionar teste`
   - Você aceita
   - Plugin commita e faz push

6. **Verifique no GitHub:**
   ```
   https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS/commits/main
   ```
   Deve aparecer o commit `chore: adicionar teste`

✅ Tudo funcionando!

---

## 🔐 Configuração de Segurança

### Git User (Obrigatório)

Se ainda não configurou:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"
```

Verifique:
```bash
git config --global --list
```

### GitHub Access Token (Opcional, para HTTPS)

Se usar HTTPS em vez de SSH:

1. **Gere um token em GitHub:**
   https://github.com/settings/tokens

2. **Permissões mínimas:** `repo` (acesso completo a repositórios)

3. **Configure no Git:**
   ```bash
   git config --global credential.helper wincred
   ```

4. **Primeira vez que fizer push, digite token como senha**

### SSH Key (Opcional, para SSH)

Se preferir SSH:

```bash
# Gere chave (se não tiver)
ssh-keygen -t ed25519 -C "seu.email@example.com"

# Adicione em GitHub Settings → SSH Keys
cat ~/.ssh/id_ed25519.pub  # Copie e cole no GitHub
```

---

## 📁 Estrutura do Plugin

```
tm-commit-plugin/
├── .claude-plugin/
│   └── plugin.json              # Metadados
├── skills/
│   └── tm-commit/
│       └── SKILL.md             # Documentação da skill
├── hooks/
│   └── hooks.json               # Auto-triggers
├── docs/
│   ├── SETUP.md                 # Este arquivo
│   ├── USAGE.md                 # Exemplos
│   ├── TROUBLESHOOTING.md       # Problemas comuns
│   └── FAQ.md                   # Perguntas
├── README.md
└── ARQUITETURA.md
```

---

## ✅ Checklist Pós-Instalação

- [ ] Plugin aparece no menu de Plugins do Cowork
- [ ] `/tm-commit status` mostra repositório sincronizado
- [ ] Você escolheu opção de auto-commit (1, 2 ou 3)
- [ ] Teste com arquivo dummy funcionou
- [ ] GitHub token/SSH configurado (se HTTPS/SSH)
- [ ] `.agent/rules/TM-COMMIT-RULES.md` existe em seu repo

---

## 🆘 Se Algo Falhar

Consulte `TROUBLESHOOTING.md` para soluções de problemas comuns.

Ou execute:
```
/tm-commit help
```

---

**Pronto para começar!** 🚀
