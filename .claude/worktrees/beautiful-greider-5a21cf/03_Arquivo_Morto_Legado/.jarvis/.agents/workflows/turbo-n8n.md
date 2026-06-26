---
description: Ativa o foco em Automação via N8N e Webhooks.
---

# /turbo-n8n

**Contexto Técnico:** `C:\Users\thiag\TM-MEUS-APPS\.NEXT APPS\TURBO DEV\n8n-mcp`

Ativa a orquestração de robôs e automações via MCP.

// turbo
### 1. Iniciar Servidor n8n-MCP
`npx n8n-mcp`

### 2. Instruções de Integração
1. **Consulta de Nodes:** Se o usuário pedir uma integração (ex: Telegram), use a ferramenta de busca de nodes do MCP para pegar a spec exata.
2. **Segurança:** Nunca edite workflows em produção. Gere sempre o JSON do workflow para revisão no diretório `dev/n8n/`.
3. **Payloads:** Siga o padrão de schemas JSON do diretório `src/types/` do repositório n8n-mcp.

Diga ao usuário: "🔗 **MCP N8N LINKED.** Acessando o catálogo de 1.200 robôs do Hub."omação."
