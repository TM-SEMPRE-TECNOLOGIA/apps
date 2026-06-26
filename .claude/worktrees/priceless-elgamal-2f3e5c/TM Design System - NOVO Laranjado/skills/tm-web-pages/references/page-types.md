# Tipos de Página — TM Sempre Tecnologia

Guia de estrutura de seções para cada tipo de página web produzida pelo DS TM.

---

## 1 — Landing Page / Showcase

**Quando usar:** Apresentar o produto, design system, ou ferramenta. Foco em demonstração visual.

**Estrutura de seções:**
```
01. HEADER fixo (brand + nav + dark mode toggle)
02. HERO — eyebrow + h1 Roboto Slab + subtítulo typewriter + CTAs + sociais + scroll cue
03. STATS STRIP — 3 stat cards com border-top laranja e countup
04. FEATURES — grid de cards com ícone + título + corpo + badge mono
05. FLOW DIAGRAM — "hoje vs futuro" ou diagrama de processo
06. CTA FINAL — fundo escuro com grid laranja
07. FOOTER — wordmark + versão + status pill
```

**Animações:** Hero stagger + Fade slide + Pulse dot + Scroll cue + Countup + Card hover

**Exemplo gerado:** `tm-landing.html`

---

## 2 — Página de Vendas

**Quando usar:** Converter visitante em cliente/lead. Alta densidade de prova social e CTAs.

**Estrutura de seções:**
```
01. HEADER fixo (brand + nav + CTA no topo direito)
02. HERO SPLIT — texto à esquerda + terminal animado à direita
03. SOCIAL PROOF STRIP — logos/parcerias em fundo laranja sólido
04. PROBLEMA / AGITAÇÃO — dores do usuário com cards border-left vermelho
05. TRANSIÇÃO — linha conectora laranja + label "A solução"
06. SOLUÇÃO / FEATURES — grid numerado (01, 02, 03...)
07. COMO FUNCIONA — 3 passos com numeração circular e linha conectora
08. DEPOIMENTOS — 3 cards com estrelas, citação, avatar e cargo
09. NÚMEROS / STATS — grid 4 colunas com countup e delta
10. PLANOS / PREÇO — 3 cards (Básico / Pro[destaque] / Enterprise)
11. FAQ — accordion com details/summary nativo
12. CTA FINAL — fundo escuro, sem fidelidade, 48h de setup
13. FOOTER — wordmark + links + status pill + copyright
```

**Animações:** Hero stagger + Terminal loop + Countup + Fade slide + Card hover + Magnetic hover (CTAs)

**Exemplo gerado:** `tm-vendas.html`

**Regras específicas de vendas:**
- CTA principal sempre `btn-primary` (laranja sólido)
- Plano destaque: `border-color: var(--TM-primary)` + tag "MAIS ESCOLHIDO"
- FAQ: `<details>/<summary>` nativo — zero JavaScript necessário
- Preço: formato `R$ 290/mês` (sem centavos para SaaS, com centavos para e-commerce)
- Depoimentos: nome real + cargo + empresa + contrato (ex: "CONTRATO BB")
- Garantia: sempre terminar CTA final com linha de garantia/sem-fidelidade

---

## 3 — Página de Componente / UI Kit

**Quando usar:** Mostrar um componente do DS isolado ou em contexto.

**Estrutura:**
```
01. HEADER mínimo (só brand + badge versão)
02. HERO pequeno — título + descrição do componente
03. DEMO ao vivo — componente interativo
04. VARIANTES — grid de variações (primary/secondary/danger/etc.)
05. PROPS/TOKENS — tabela mono com variáveis CSS usadas
06. CÓDIGO — bloco de código com syntax highlight simples
```

---

## 4 — Hero Split (padrão para páginas técnicas)

**Quando usar:** Qualquer página que quer mostrar o produto "funcionando" ao lado do pitch.

**Layout:**
```
┌──────────────────┬──────────────────┐
│   TEXTO          │   PAINEL         │
│                  │   TÉCNICO        │
│  eyebrow badge   │                  │
│  h1 Roboto Slab  │  Terminal /      │
│  subtítulo       │  Dashboard /     │
│  CTAs            │  Preview do app  │
│  proof avatars   │                  │
└──────────────────┴──────────────────┘
```

CSS do layout:
```css
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  padding-top: 56px; /* altura do header */
}
.hero-right {
  background: var(--tm-bg-muted);
  border-left: 1px solid var(--tm-border);
}
@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; }
}
```

---

## 5 — Página de Produto / App (dashboard)

**Quando usar:** Protótipo de interface interna, dashboard de métricas, tela de app.

**Estrutura:**
```
01. SIDEBAR esquerda — nav vertical + brand
02. MAIN — grid de widgets
    ├── HEADER da área — eyebrow + h1 + ações
    ├── STATS ROW — 3-4 stat cards
    ├── TABLE ou CHART
    └── ACTIVITY FEED ou LOG
```

---

## Padrões comuns a todos os tipos

### Eyebrow / seção label
Sempre numerar as seções no estilo norma técnica:
```
01.00 · HERO
02.00 · INDICADORES
03.00 · RECURSOS
04.00 · COMO FUNCIONA
05.00 · DEPOIMENTOS
06.00 · PLANOS
07.00 · FAQ
08.00 · CONTATO
```

### Separadores de seção
- Fundo alternado: `var(--tm-bg)` → `var(--tm-bg-card)` → `var(--tm-bg)` → ...
- Borda `border-top: 1px solid var(--tm-border)` entre seções que mudam de fundo
- Nunca usar `<hr>` — usar `border-top` no próprio `<section>`

### Max-width por tipo de conteúdo
```css
.container-text  { max-width: 640px;  margin: 0 auto; } /* textos longos, FAQ */
.container-mid   { max-width: 860px;  margin: 0 auto; } /* flow, depoimentos */
.container-wide  { max-width: 1040px; margin: 0 auto; } /* features, planos */
.container-full  { max-width: 1200px; margin: 0 auto; } /* dashboard, tabelas */
```

### Padding de seções
```css
/* Seção normal */
padding: 72px 32px;

/* Seção hero */
padding: 80px 80px; /* lados generosos */

/* Seção compacta (stats strip, proof) */
padding: 48px 32px;
```

### Responsividade obrigatória
Toda grade de 3+ colunas deve quebrar em mobile:
```css
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 700px) { .grid-3 { grid-template-columns: 1fr; } }
```
