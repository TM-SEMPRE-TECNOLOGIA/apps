# Automação de Marketing com n8n — TM Sempre Tecnologia

**Versão 1.0 · Maio 2026**

---

## Avaliação Honesta: Vai Funcionar?

**Resposta curta: Sim — com ressalvas importantes.**

### O que o n8n faz muito bem para este caso
- Agendar publicações automáticas (RSS do blog → LinkedIn/Facebook)
- Capturar leads de formulários e enviar para WhatsApp/email
- Notificar no WhatsApp quando alguém preencher o formulário de contato
- Monitorar métricas e gerar relatório semanal automático
- Conectar blog → redes sociais no fluxo de publicação

### O que NÃO vai funcionar com n8n
- **Instagram:** A API do Meta para Instagram não permite postar diretamente pelo n8n na conta pessoal. Precisa de conta Business verificada + aprovação de app Meta. Complexo.
- **LinkedIn pessoal:** A API do LinkedIn bloqueia automações de postagem em perfis pessoais. Página empresarial: funciona.
- **Criar conteúdo automaticamente com qualidade:** n8n pode chamar a API do Claude/GPT, mas o conteúdo gerado sem curadoria humana vai sair genérico. Não recomendo automatizar a criação — só a distribuição.

### Conclusão prática
Use o n8n para **distribuição e notificações**, não para criação. O conteúdo você escreve (ou gera com Grok + prompt certo), o n8n distribui e monitora.

**ROI real:** 2–3h de setup inicial → economiza 30–40 min/dia de tarefas manuais repetitivas.

---

## Arquitetura Geral dos Fluxos

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO CENTRAL DE CONTEÚDO                    │
│                                                                 │
│  Você escreve artigo                                            │
│       │                                                         │
│       ▼                                                         │
│  [Blog publica] ──→ RSS Feed                                    │
│                          │                                      │
│                          ▼                                      │
│              n8n detecta novo post                              │
│                          │                                      │
│            ┌─────────────┼─────────────┐                       │
│            ▼             ▼             ▼                        │
│      LinkedIn        Facebook       WhatsApp                    │
│      (página TM)     (página TM)    (seu número)                │
│      post adaptado   link do artigo  notificação                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO DE LEADS                               │
│                                                                 │
│  Alguém preenche formulário do site                             │
│       │                                                         │
│       ▼                                                         │
│  n8n captura os dados                                           │
│       │                                                         │
│  ┌────┴────────────────────────┐                                │
│  ▼                             ▼                                │
│  WhatsApp Business             Email                            │
│  notificação imediata          cópia completa dos dados         │
│  "Novo lead: João — projeto X"                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  FLUXO DE MONITORAMENTO                         │
│                                                                 │
│  Toda segunda-feira, 8h                                         │
│       │                                                         │
│       ▼                                                         │
│  n8n busca métricas (Google Analytics / Umami)                  │
│       │                                                         │
│       ▼                                                         │
│  Gera resumo: sessões, artigos mais lidos, leads da semana      │
│       │                                                         │
│       ▼                                                         │
│  Envia relatório por WhatsApp / email                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fluxo 1 — Blog → Redes Sociais

### O que faz
Sempre que você publicar um artigo no blog, o n8n detecta pelo RSS, adapta o texto e posta automaticamente na página do LinkedIn e Facebook.

### Pré-requisitos
- Blog com RSS feed ativo (Next.js + feed.xml)
- Página empresarial no LinkedIn (não perfil pessoal)
- Página empresarial no Facebook
- Conta n8n (cloud gratuita ou self-hosted)

### Nodes do fluxo (ordem)

```
1. [RSS Feed Trigger]
   - URL: https://thiagonascimentobarbosapro.com/feed.xml
   - Polling: a cada 30 minutos

2. [IF] → artigo publicado nas últimas 2h?
   - Evita repostar conteúdo antigo

3. [HTTP Request] → busca conteúdo completo do artigo
   - Para extrair resumo real

4. [Code Node] → monta o texto do post
   - LinkedIn: primeiras 3 linhas + link no comentário
   - Facebook: título + resumo + link

5a. [LinkedIn Node] → posta na página TM
    - Usar OAuth da página empresarial

5b. [Facebook Node] → posta na página TM
    - Usar Graph API

6. [WhatsApp / Telegram] → notifica você
   - "✓ Artigo distribuído: [título]"
```

### JSON base do fluxo (importar no n8n)

```json
{
  "name": "Blog → Redes Sociais TM",
  "nodes": [
    {
      "type": "n8n-nodes-base.rssFeedReadTrigger",
      "name": "RSS Blog",
      "parameters": {
        "url": "https://thiagonascimentobarbosapro.com/feed.xml",
        "pollTimes": { "item": [{ "mode": "everyMinute", "minute": 30 }] }
      }
    },
    {
      "type": "n8n-nodes-base.code",
      "name": "Montar Post LinkedIn",
      "parameters": {
        "jsCode": "const titulo = $input.first().json.title;\nconst link = $input.first().json.link;\nconst resumo = $input.first().json.contentSnippet?.slice(0, 280) || '';\n\nreturn [{\n  json: {\n    linkedin_text: `${titulo}\\n\\n${resumo}\\n\\n→ Artigo completo no primeiro comentário.\\n\\n#automacao #desenvolvimentosoftware #tmsempretecnologia`,\n    facebook_text: `${titulo}\\n\\n${resumo}\\n\\n${link}`,\n    link: link\n  }\n}];"
      }
    }
  ]
}
```

---

## Fluxo 2 — Formulário → Notificação de Lead

### O que faz
Quando alguém preenche o formulário de contato do site, você recebe uma notificação imediata no WhatsApp com nome, email e assunto.

### Pré-requisitos
- Formulário do site enviando para webhook do n8n (ou via Formspree/TypeForm)
- WhatsApp Business API (Evolution API self-hosted é mais simples) ou Telegram

### Nodes do fluxo

```
1. [Webhook Trigger]
   - URL pública gerada pelo n8n
   - Método: POST

2. [Code Node] → formata a mensagem
   - Extrai: nome, email, assunto, mensagem

3. [WhatsApp / Telegram Node] → envia para você
   - "🔶 NOVO LEAD\nNome: João Silva\nEmail: joao@empresa.com\nAssunto: App mobile\nMensagem: [texto]"

4. [Gmail Node] → envia cópia por email
   - Para: tm.sempretecnologia@gmail.com
   - Com todos os dados do formulário

5. [Google Sheets Node] → registra em planilha
   - Coluna: data | nome | email | assunto | status (Novo)
   - Para gestão manual de CRM básico
```

---

## Fluxo 3 — Relatório Semanal de Marketing

### O que faz
Toda segunda-feira às 8h, você recebe um relatório automático com as métricas da semana anterior.

### Nodes do fluxo

```
1. [Schedule Trigger]
   - Toda segunda-feira, 08:00

2. [HTTP Request] → Umami Analytics API
   - Busca: sessões, pageviews, top 5 artigos

3. [Google Sheets Node]
   - Busca leads da semana na planilha do Fluxo 2

4. [Code Node] → monta o relatório
   - Formata os dados em texto legível

5. [WhatsApp / Email] → envia para você
   - "📊 RELATÓRIO SEMANA [DATA]\n
      Blog: 245 sessões (+12%)\n
      Artigos mais lidos: ...\n
      Leads recebidos: 3\n
      Conversas abertas: 1"
```

---

## Fluxo 4 — Calendário Editorial (Lembrete)

### O que faz
Lembra você de publicar conforme o calendário, sem precisar abrir o Notion/arquivo todo dia.

### Nodes do fluxo

```
1. [Schedule Trigger]
   - Segunda, Quarta e Sexta — 07:30

2. [Google Sheets Node]
   - Lê o calendário editorial da semana

3. [Code Node]
   - Filtra o post do dia atual

4. [WhatsApp] → notifica
   - "📝 POST DE HOJE (LinkedIn)\nTema: [tema]\nPilar: Autoridade Técnica\nTemplate: L1 em templates-posts.md"
```

---

## Setup Inicial — Passo a Passo

### 1. Criar conta n8n
- **Opção A (mais fácil):** n8n Cloud — https://app.n8n.cloud — plano gratuito com 5 workflows ativos
- **Opção B (mais controle):** Self-hosted no Railway/Render — gratuito, sem limite de workflows

**Recomendação para fase 1:** n8n Cloud gratuito. Os 4 fluxos acima cabem no plano free.

### 2. Conectar serviços (por ordem de prioridade)
1. WhatsApp / Telegram (notificações de lead — maior valor imediato)
2. LinkedIn página empresarial (OAuth)
3. Facebook página (Graph API)
4. Google Sheets (CRM básico)
5. Umami ou Google Analytics (métricas)

### 3. Integrar o formulário do site
No formulário HTML atual (`thiagonascimento.html`), o `action` do form precisa apontar para o webhook do n8n:

```html
<!-- Trocar o onsubmit por fetch para o webhook -->
<form id="contact-form">
  ...
</form>

<script>
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    assunto: document.getElementById('assunto').value,
    mensagem: document.getElementById('mensagem').value
  };
  await fetch('https://SEU-N8N.app.n8n.cloud/webhook/contato-tm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  // mostrar feedback de sucesso
});
</script>
```

---

## Limitações e Alternativas

| Limitação | Alternativa |
|---|---|
| Instagram não aceita post direto | Buffer (plano free: 3 canais, 10 posts agendados) |
| LinkedIn perfil pessoal bloqueado | Postar manualmente — leva 2 min |
| WhatsApp Business API tem custo | Telegram Bot (gratuito, igual na prática) |
| n8n Cloud free: 5 workflows | Self-hosted no Railway (gratuito, ilimitado) |

---

## Conexão via MCP do n8n no Cowork

O MCP do n8n está disponível no registry do Cowork. Com ele conectado, posso:
- Buscar seus workflows ativos
- Executar um workflow sob demanda
- Ver o histórico de execuções

Para conectar: clique em "Connect" no card do n8n acima e siga o OAuth. Precisa ter uma conta n8n Cloud ativa.
