# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão do Projeto

Aplicação Next.js de web scraping universal que usa **Playwright no servidor** para contornar CORS e conteúdo renderizado por JavaScript. O usuário informa URL + seletor CSS; o servidor retorna os dados limpos; a UI exporta em CSV/JSON.

## Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS — Client Components apenas para estado e interação
- **Backend:** Route Handlers nativos do Next.js (sem framework extra)
- **Scraping:** Playwright (Chromium headless) rodando exclusivamente no servidor
- **Export:** CSV e JSON via download direto no browser

## Arquitetura

```
app/
  page.tsx                  → Client Component — formulário (URL + seletor) + exibe resultado
  api/
    scrape/
      route.ts              → Route Handler POST — núcleo de scraping via Playwright
lib/
  scraper.ts                → Inicializa browser, aguarda networkidle, coleta nós do DOM
  exporter.ts               → Converte array de strings → CSV / JSON Blob
```

**Fluxo de dados:**
1. Client Component envia `POST /api/scrape` com `{ url, selector }`
2. Route Handler lança Playwright Chromium com User-Agent camuflado
3. Aguarda `networkidle` (página 100% carregada, JS incluído)
4. Coleta textos dos nós que batem com o seletor, limpa HTML residual
5. Fecha o browser imediatamente (libera memória do servidor)
6. Retorna `{ items: string[], count: number }` para o Client Component

## Regras de Arquitetura

- **Playwright NUNCA roda no client** — apenas dentro de Route Handlers ou funções de servidor
- **Nenhuma requisição direta ao alvo a partir do browser** — tudo passa pelo Route Handler para evitar CORS
- Cada scraping abre e fecha uma instância isolada do browser — sem pool persistente por padrão
- Seletor CSS é o único mecanismo de seleção — sem XPath, sem heurísticas automáticas

## Comandos

```bash
# Instalar dependências (incluindo browsers do Playwright)
pnpm install
npx playwright install chromium

# Dev
pnpm dev          # http://localhost:3000

# Build de produção
pnpm build
pnpm start

# Type check
pnpm tsc --noEmit
```

## Variáveis de Ambiente

| Variável | Propósito | Padrão |
|----------|-----------|--------|
| `SCRAPER_TIMEOUT_MS` | Tempo máximo de espera por página (ms) | `30000` |
| `SCRAPER_USER_AGENT` | User-Agent injetado no Chromium | UA moderno do Chrome |

## Expansões Planejadas (ver `O PLANO.MD`)

- Rotação de proxies dinâmicos
- Persistência de resultados em Supabase
- Suporte a scroll infinito (scroll-then-collect)
