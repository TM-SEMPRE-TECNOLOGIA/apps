# ❓ FAQ - TM-COMMIT Plugin

Perguntas frequentes e respostas rápidas.

---

## 🤔 Perguntas Gerais

### **P: O plugin já está pronto para usar?**
R: Sim! Após instalação e reiniciar o Cowork, execute `/tm-commit status` para confirmar.

### **P: O plugin commita automaticamente?**
R: Depende da opção que você escolher:
- **Opção 1**: Apenas notifica (você decide)
- **Opção 2**: Pergunta antes (recomendado)
- **Opção 3**: Auto-commit sem perguntar

Configure com `/tm-commit settings`

### **P: Posso desfazer um commit?**
R: Sim. Se não fez push ainda:
```bash
git reset HEAD~1          # Desfaz commit, mantém arquivos
git reset --soft HEAD~1   # Desfaz commit, mantém staging
git reset --hard HEAD~1   # Desfaz tudo (cuidado!)
```

Se já fez push:
```bash
git revert abc12345       # Cria novo commit revertendo mudanças
git push origin main
```

### **P: Posso usar o plugin em outro repositório?**
R: Sim! Configure em `.agent/rules/TM-COMMIT-RULES.md` com o novo path:
```
repoPath: C:\novo\caminho\repo
```

---

## 🔐 Segurança

### **P: O plugin enviará minhas credenciais para GitHub?**
R: Não! O plugin **bloqueia** arquivos com credenciais:
- `.env`, `*.key`, `secrets.json`, `config.prod.json`
- Padrões: `API_KEY`, `PASSWORD`, `TOKEN`

Se tentar commitá-los, você recebe aviso e o arquivo não é commitado.

### **P: E se a credencial já foi enviada?**
R: GitHub avisa quando detecta credenciais expostas. Faça:
1. Remova do arquivo local
2. Revogue a credencial (se for token/chave)
3. Execute: `git reset --hard origin/main` para sincronizar

GitHub também mostrará um alert no repositório.

### **P: Onde fica armazenado meu GitHub token?**
R: Com o Git Credential Manager (configurado automaticamente).

**Local:** `Windows Credential Manager → Generic Credentials`

Pode ser revogado em qualquer momento em GitHub Settings.

---

## 💾 Arquivo & Repositório

### **P: Quais pastas são monitoradas?**
R: Estas 8 pastas:
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

Outras não são rastreadas (gitignored).

### **P: Posso adicionar nova pasta para monitorar?**
R: Sim! Edite `.agent/rules/TM-COMMIT-RULES.md` e adicione a lista `monitoredFolders`.

### **P: Onde o plugin salva a configuração?**
R: Em dois lugares:
1. `.agent/rules/TM-COMMIT-RULES.md` — Regras permanentes
2. `C:\Users\[user]\AppData\Roaming\Claude\plugins\tm-commit\config.json` — Suas preferências

### **P: Posso fazer backup de tudo?**
R: Sim, o repositório é seu backup!

```bash
# Tudo que foi commitado está seguro no GitHub
git log --oneline  # Ver histórico

# Se perder arquivos locais:
git reset --hard origin/main  # Recupera do GitHub
```

---

## 🚀 Operações Git

### **P: Como saber se há mudanças não commitadas?**
R: Execute:
```bash
/tm-commit status

# Mostrará:
📊 Mudanças Detectadas:
• output_claude/: 2 arquivos novos
• Obisidian/: 1 arquivo modificado
```

### **P: O que é "staging"?**
R: Staging é marcar arquivos para serem commitados:
```bash
git add arquivo.txt   # Staging
git commit -m "msg"   # Commit (permanent)
git push              # Push (enviar para GitHub)
```

O plugin faz isso automaticamente com `/tm-commit push`.

### **P: Posso committar parcialmente (alguns arquivos, não todos)?**
R: Sim, use `git add` manual:
```bash
git add arquivo1.txt
git add arquivo2.txt
# NÃO adiciona outros arquivos

git commit -m "msg"
```

Ou edite:
```bash
git add -p   # Seleciona partes de arquivos
```

### **P: O que significam aqueles "tipos" de commit (feat, fix, docs)?**
R: São convenções de Conventional Commits:
- **feat** = Nova funcionalidade
- **fix** = Corrigir bug
- **docs** = Documentação
- **chore** = Manutenção
- **refactor** = Reorganizar
- **test** = Testes
- **perf** = Performance
- **ci** = CI/CD

Usar padrão ajuda a manter histórico organizado.

### **P: Posso ver quem fez cada commit?**
R: Sim:
```bash
git log --oneline              # Histórico
git log --author="seu nome"    # Commits seus
git blame arquivo.txt          # Quem editou cada linha
```

---

## ⚡ Automação

### **P: Quando o plugin executa automaticamente?**
R: Em 3 momentos:
1. **Session-start** — Sincroniza ao abrir chat novo
2. **File-created** — Detecta ao criar arquivo
3. **Session-end** — Oferece opções ao encerrar

### **P: Posso desativar a automação?**
R: Sim, escolha Opção 1 (Apenas Notificar):
```bash
/tm-commit settings
→ Selecione [1]
```

### **P: A cada quantos chats faz sync automático?**
R: No final de cada sessão (ao encerrar chat/Cowork).

Configure intervalo em `.agent/rules/TM-COMMIT-RULES.md`:
```
checkpointInterval: 10  # a cada 10 chats OU ao fim da sessão
```

---

## 🔧 Troubleshooting Rápido

### **P: "/tm-commit status" não mostra nada**
R: Repositório está sincronizado! Nenhuma mudança pendente.

Para confirmar:
```bash
git status   # Mesmo resultado
```

### **P: Plugin diz "credencial detectada" mas não vejo**
R: Padrões bloqueados (mesmo que valor esteja vazio):
```
❌ API_KEY=
❌ PASSWORD=
❌ TOKEN=
```

### **P: Como vejo os últimos commits?**
R: Execute:
```bash
/tm-commit log 10   # Últimos 10 commits
git log --oneline    # Manualmente
```

### **P: Posso editar mensagem de commit DEPOIS de fazer?**
R: Se não fez push ainda:
```bash
git commit --amend -m "nova mensagem"
```

Se já fez push (não recomendado):
```bash
git commit --amend -m "nova mensagem"
git push -f origin main  # -f = force (perigoso)
```

### **P: Como resolver conflito de merge?**
R: Veja `TROUBLESHOOTING.md` seção "conflito de merge".

Ou use:
```bash
/tm-commit sync   # Resolve automaticamente se possível
```

---

## 📚 Aprendizado

### **P: Onde aprendo mais sobre Git?**
R: Recursos:
- **Oficial**: https://git-scm.com/doc
- **Interativo**: https://learngitbranching.js.org/
- **Cheat Sheet**: https://github.github.com/training-kit/

### **P: O que é "rebase" vs "merge"?**
R: Dois modos de integrar mudanças:
- **Merge** → Cria commit de merge, mantém histórico (usado aqui)
- **Rebase** → Reorganiza commits (mais "limpo" mas reescreve história)

O plugin usa merge (mais seguro).

### **P: Como funciona GitHub Actions?**
R: Automação no GitHub (CI/CD):
- Roda testes automaticamente
- Valida commits
- Deploya aplicações

O plugin não interfere. Configurado em `.github/workflows/`.

---

## 🎯 Boas Práticas

### **P: Com que frequência devo fazer commit?**
R: Idealmente:
- ✅ A cada funcionalidade/tarefa concluída
- ✅ Quando quer fazer checkpoint
- ✅ Ao final de cada sessão

**Não faça:**
- ❌ Um commit com tudo de uma vez
- ❌ Commits vagas (ex: "update")
- ❌ Deixar mudanças por dias sem committar

### **P: Como escrever boas mensagens de commit?**
R: Padrão Conventional Commits:
```
tipo(escopo): descrição curta

Detalhes adicionais (opcional)

Referências (optional)
```

**Exemplos bons:**
```
✅ feat(output_claude): criar novo dashboard HTML
✅ docs(readme): atualizar guia de instalação
✅ fix(gitignore): adicionar .venv à exclusão
✅ refactor(agentes): mover skills para output_claude
```

---

## 🆘 Não Encontrei Minha Dúvida

1. Veja `SKILL.md` para especificação técnica
2. Veja `USAGE.md` para exemplos práticos
3. Veja `TROUBLESHOOTING.md` para problemas comuns
4. Execute `/tm-commit help` para ajuda rápida
5. Execute `/tm-commit debug` para logs detalhados

---

**Sucesso!** 🚀
