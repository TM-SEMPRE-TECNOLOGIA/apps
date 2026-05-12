---
description: Executa o protocolo de encerramento de sessão, atualizando logs, diário e Git.
---

# /turbo-checkpoint

Ativa o Protocolo Oficial de Checkpoint e Encerramento de Sessão.

// turbo-all
### 1. Atualização do Diário
Atualize obrigatoriamente o arquivo `diario_de_dev.md` da sessão ativa no formato Resumo Executivo (o que foi feito, decisões, o que falta).

### 2. Gestão de Logs HTML
Verifique as mudanças e analise a necessidade de atualizar os arquivos `commit_geral.html` ou o `commit.html` local. *Sempre peça verificação do usuário antes de injetar.*

### 3. Sincronização Git
1. Revise o que foi alterado.
2. Crie uma mensagem de commit usando Padrão Conventional (`feat:`, `fix:`, `refactor:`).
3. Peça permissão expressa para executar o `git commit` e o `git push`.

Diga ao usuário: "💾 **CHECKPOINT REACHED.** Iniciando protocolo de salvamento: Diário, Logs e Git."
