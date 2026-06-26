# Identidade Visual — TM Sempre Tecnologia (Marketing)

**Versão 1.0 · Maio 2026**

---

## Princípio

A identidade visual de marketing segue os mesmos tokens do Design System TM v3. Não inventamos uma linguagem nova para o marketing — a marca é uma só.

---

## Cores

| Papel | Valor | Uso |
|---|---|---|
| Primária (laranja construção) | `#C8541C` | CTA, destaques, ícones |
| Primária dark | `#E47A4A` | Versão escura dos posts |
| Fundo claro | `#F5F4F1` | Fundo de posts claros |
| Fundo escuro | `#161513` | Fundo de posts escuros / dark |
| Texto principal | `#1A1A1A` | Corpo de texto em fundo claro |
| Texto principal dark | `#EFEDE8` | Corpo de texto em fundo escuro |
| Texto secundário | `#5C5A55` | Subtítulos, descrições |
| Sucesso | `#4F7A3A` | Métricas positivas, resultados |
| Info / Blueprint | `#345878` | Contexto técnico, dados |

---

## Tipografia

| Papel | Fonte | Peso | Uso |
|---|---|---|---|
| Display / Headline | Roboto Slab | 600–700 | Títulos de posts, covers |
| Corpo | Inter | 400–500 | Texto de post, legendas |
| Técnico / Código | JetBrains Mono | 400–500 | Snippets, dados, badges |

**Regras:**
- Títulos sempre em Roboto Slab com `letter-spacing: -.015em`
- Nunca misturar mais de 2 pesos da mesma família num mesmo post
- Tamanho mínimo de texto em imagem: 24px equivalente

---

## Linguagem Visual

### O que define os posts TM
- Fundo escuro (`#161513`) ou papel (`#F5F4F1`) — nunca gradiente
- Quadrado laranja 18×18px como assinatura de marca (canto inferior direito)
- Grid técnico de fundo (28px × 28px, 4% de opacidade) nos posts de tecnologia
- Border-radius pequeno: 8px em cards, 6px em badges
- Ícones Lucide-style: `stroke-width: 1.75`, sem fill

### Estilo de foto/imagem
- Fotos de ambiente de trabalho real (setup, código, reuniões)
- **Sem** fotos de banco de imagens estilo "pessoa sorrindo na frente do computador"
- Screenshots reais de produtos e projetos são bem-vindos
- Mockups de telas com fundo escuro quando possível

### Elementos de assinatura nos posts
```
┌─────────────────────────────┐
│                             │
│   [conteúdo do post]        │
│                             │
│   ■ TM Sempre Tecnologia    │  ← quadrado laranja + nome
│   @tmsempretecnologia       │
└─────────────────────────────┘
```

---

## Formatos por Canal

| Canal | Formato feed | Stories/Vertical | Cover |
|---|---|---|---|
| Instagram | 1080×1080px | 1080×1920px | — |
| LinkedIn | 1200×627px | 1080×1920px | 1584×396px |
| Facebook | 1200×630px | 1080×1920px | 820×312px |
| YouTube | — | — | 2560×1440px (thumb: 1280×720px) |
| Blog | — | — | 1200×630px (OG image) |

---

## Badge / Tag padrão

```
┌──────────────────┐
│ AUTOMAÇÃO · 2026 │   ← JetBrains Mono, 10px, uppercase, border-radius: 3px
└──────────────────┘
```

Variantes de cor de badge:
- Laranja (produto/lançamento): fundo `#FBEDE3`, texto `#A6451A`, borda `rgba(200,84,28,.3)`
- Verde (resultado/case): fundo `#EAF1E4`, texto `#3A5A2C`, borda `#C5D4B4`
- Azul (técnico/tutorial): fundo `#E2EBF2`, texto `#1F3D55`, borda `#B8CADB`
- Escuro (novidade): fundo `#1A1A1A`, texto `#F5F4F1`

---

## O que NUNCA fazer

- Gradiente como fundo de post
- Múltiplas cores primárias no mesmo post
- Tipografia decorativa ou display que não seja Roboto Slab
- Ícones coloridos ou emojis como elemento visual estrutural
- Border-radius 999px em elementos que não sejam avatares
- Animações com bounce ou spring nos reels/motion
