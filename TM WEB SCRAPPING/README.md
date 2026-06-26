# 🕷️ TM Web Scrapper — Universal Data Miner

Aplicação **Next.js** que usa **Playwright no servidor** para extrair dados estruturados de qualquer site. Suporta CSS selectors, contorna CORS automaticamente e exporta em CSV/JSON.

## Características

- ✅ Scraping com Playwright (headless Chromium)
- ✅ Suporte a conteúdo renderizado por JavaScript
- ✅ Seletores CSS flexíveis
- ✅ Exportação CSV e JSON
- ✅ UI reativa em tempo real
- ✅ Validação robusta de entrada
- ✅ Zero dependências externas (exceto Playwright)

## Stack

```
Frontend:   Next.js 15 + TypeScript + Tailwind CSS (inline)
Backend:    Route Handlers nativos do Next.js
Scraping:   Playwright (Chromium headless)
State:      React Hooks (useState)
```

## Instalação

```bash
# Instalar dependências
npm install

# Instalar browsers do Playwright (obrigatório)
npx playwright install chromium

# Dev local
npm run dev
# Acesso: http://localhost:3000
```

## Desenvolvimento

```bash
npm run dev      # Inicia servidor em :3000
npm run build    # Build de produção
npm start        # Roda a build compilada
npm run lint     # Type check com TypeScript
```

## Arquitetura

### Fluxo de Dados

1. **Client Component** (`app/page.tsx`)
   - Formulário: URL + Seletor CSS
   - Estado local: loading, error, results
   - Envia `POST /api/scrape`

2. **Route Handler** (`app/api/scrape/route.ts`)
   - Valida URL e seletor
   - Chama `scrapeUrl()`
   - Retorna `{ success, data }`

3. **Scraper** (`lib/scraper.ts`)
   - Inicializa Playwright Chromium
   - Navega com User-Agent camuflado
   - Aguarda `networkidle` (JS 100%)
   - Coleta nós do DOM via seletor CSS
   - Fecha browser (libera memória)

4. **Exporter** (`lib/exporter.ts`)
   - Converte array → CSV ou JSON
   - Gerencia downloads no browser
   - Adiciona timestamps automaticamente

### Estrutura de Pastas

```
├── app/
│   ├── page.tsx          → Client Component (formulário + UI)
│   ├── layout.tsx        → RootLayout
│   ├── globals.css       → Estilos globais
│   └── api/
│       └── scrape/
│           └── route.ts  → POST handler
├── lib/
│   ├── scraper.ts        → Playwright + validações
│   └── exporter.ts       → CSV/JSON export
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Como Usar

### Interface Web

1. Acesse http://localhost:3000
2. Cole a URL do site que quer scrappear
3. Digite um seletor CSS (ex: `.product`, `#items`, `div.card`)
4. Clique em "Iniciar Scrape"
5. Exporte os resultados em CSV ou JSON

### Exemplos de Seletores CSS

```css
.product              /* Elementos com classe 'product' */
#main-list            /* Elemento com id 'main-list' */
div.item > span       /* Spans dentro de divs com classe 'item' */
a[href*="store"]      /* Links que contêm "store" no href */
li:not(.hidden)       /* Items de lista que não têm classe 'hidden' */
```

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `SCRAPER_TIMEOUT_MS` | `30000` | Tempo máximo de espera por página (ms) |
| `SCRAPER_USER_AGENT` | Chrome 120 | User-Agent injetado no Chromium |

### Exemplo `.env.local`

```env
SCRAPER_TIMEOUT_MS=45000
```

## Roadmap (O PLANO.md)

- [x] Arquitetura base (Playwright + Route Handlers)
- [x] Client Component com formulário
- [x] Seletor CSS validado
- [x] Exportação CSV/JSON
- [ ] Rotação dinâmica de proxies
- [ ] Persistência em Supabase
- [ ] Suporte a scroll infinito
- [ ] Fila de jobs assíncrona
- [ ] Dashboard de histórico de scrapes
- [ ] Rate limiting por IP

## Limitações Conhecidas

- **Timeout:** Páginas muito lentas (>30s) podem expirar. Aumente `SCRAPER_TIMEOUT_MS`.
- **JavaScript complexo:** Se a página carrega dados com AJAX atrasado, o `networkidle` pode não esperar o suficiente.
- **Memória:** Cada scrape abre/fecha uma instância Chromium. Em alta concorrência, considere um pool de browsers.
- **Bloqueios:** Sites com rate limiting agressivo podem bloquear IPs. Use rotação de proxies (roadmap).

## Segurança

- ✅ Seletores CSS validados (regex whitelist)
- ✅ URLs validadas (protocolo HTTP/HTTPS apenas)
- ✅ Inputs sanitizados antes do DOM
- ✅ User-Agent camuflado (parece um browser real)
- ⚠️ **Respeite `robots.txt`** e termos de serviço dos sites

## Troubleshooting

### "Erro ao fazer scrape: timeout of 30000ms exceeded"
→ Aumente `SCRAPER_TIMEOUT_MS` ou verifique se o site está acessível.

### "Nenhum item encontrado com o seletor..."
→ Inspete o HTML da página (F12) e copie o seletor exato.

### "URL inválida"
→ Certifique-se de usar `http://` ou `https://` no início.

### Chromium não iniciado
→ Execute `npx playwright install chromium` novamente.

## Performance

- Scrape típico: **2-5 segundos** (depende do site)
- Memória: **~100MB por browser** (libera após scrape)
- CPU: Mínimo (Chromium otimizado)

## Deploy (Vercel/Railway)

1. Push para GitHub
2. Conecte repo no Vercel/Railway
3. Defina `SCRAPER_TIMEOUT_MS` se necessário
4. Deploy automático

**⚠️ Nota:** Vercel Serverless é limitado a 10 segundos. Use **Railway** ou **VPS** para scrapes maiores.

## Contribuição

Fork → Branch → Commit → PR

## Licença

MIT

---

**Feito com 🕷️ por TM Sempre Tecnologia**
