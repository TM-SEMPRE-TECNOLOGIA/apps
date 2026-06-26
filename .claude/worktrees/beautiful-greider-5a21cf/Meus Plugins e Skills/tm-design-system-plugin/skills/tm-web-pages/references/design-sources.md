# Fontes de Referência de Design — TM Sempre Tecnologia

Thiago usa esses 5 sites para garimpar referências visuais de outros produtos e designers. Eles são **galerias** — o que importa não é o estilo visual deles, mas o conteúdo que hospedam (telas de apps reais, sites premiados, micro-interações de produtos famosos).

O fluxo de uso é sempre:
1. Thiago navega no site e encontra algo que chama atenção
2. Manda o print, link ou descreve o que viu
3. O agente identifica o padrão técnico e traduz para o vocabulário visual TM

---

## Os 5 sites e o que cada um hospeda

### 1. Contra
**URL:** https://contra.com/?view=projects
**O que hospeda:** Portfólios e projetos de freelancers criativos — designers, ilustradores, motion designers, devs. Cada projeto é uma apresentação real de trabalho.
**O que Thiago normalmente busca lá:** composições de hero, formas de apresentar um produto ou caso de uso, layouts de portfólio com identidade forte.

### 2. Mobbin
**URL:** https://mobbin.com/discover/apps/ios/latest
**O que hospeda:** Biblioteca de screenshots reais de apps iOS e Web — Notion, Linear, Stripe, Figma, Airbnb, etc. Organizado por fluxo (onboarding, settings, empty states, etc.).
**O que Thiago normalmente busca lá:** como um app específico resolveu um padrão de UI (card de dado, input com erro, tela de loading, nav inferior, pricing screen).

### 3. Godly
**URL:** https://godly.website
**O que hospeda:** Curadoria de sites com design excepcional — agências, produtos SaaS, portfólios premiados. Foco em web design de alto nível.
**O que Thiago normalmente busca lá:** animações de entrada de hero, uso de tipografia como elemento visual, transições de scroll, estrutura de narrativa de produto.

### 4. ScreensDesign
**URL:** https://screensdesign.com
**O que hospeda:** Biblioteca de flows completos de apps — onboarding, paywall, pricing, settings. Inclui dados de mercado (revenue, downloads) dos apps catalogados.
**O que Thiago normalmente busca lá:** como apps de sucesso estruturam pricing, fluxos de conversão (trial → pago), onboarding de produto, comparativos de planos.

### 5. Design Spells
**URL:** https://designspells.com
**O que hospeda:** Coleção de detalhes mágicos de design de produtos reais — micro-interações, easter eggs, animações de estado, feedbacks táteis, delights de UI.
**O que Thiago normalmente busca lá:** aquele detalhe especial que faz uma UI parecer viva — como o Linear anima o loading, como o Stripe faz o hover do cartão, etc.

---

## Como agir quando Thiago traz uma referência

### Ele manda um print ou descreve o que viu
1. Identificar o **padrão técnico** — o que está acontecendo tecnicamente? (clip-path? scroll-driven? magnetic? countup? typewriter?)
2. Verificar se é compatível com as regras do DS TM (sem bounce, sem gradiente, radii pequenos, sóbrio)
3. Adaptar: mesmo padrão técnico + tokens TM + sobriedade de engenharia

### Ele manda um link de um item específico
Tratar o link como referência visual, não como algo para copiar. Extrair o padrão e reinterpretar.

### Ele diz "quero algo parecido com X que vi no Godly/Mobbin/etc."
Perguntar apenas **o que especificamente chamou atenção** — a animação? o layout? a tipografia? o componente? Não tentar adivinhar.

---

## Protocolo de tradução: referência → DS TM

Quando a referência vier de qualquer fonte, aplicar sempre esta tabela de conversão:

| O que aparece na referência | Como traduzir para o DS TM |
|---|---|
| Gradiente como background | Fundo chapado `var(--tm-bg)` ou `var(--tm-bg-card)` alternados |
| Cor primária vibrante (azul, verde, roxo) | `var(--TM-primary)` laranja como único acento |
| Border-radius generoso (16px+) | 8px em cards, 6px em buttons — sóbrio |
| Animação com spring ou bounce | `cubic-bezier(.16,1,.3,1)` ou `ease` simples |
| Tipografia decorativa ou display exótica | Roboto Slab 600 com `letter-spacing: -.015em` |
| Ícone colorido ou emoji | SVG Lucide `stroke-width: 1.75`, `currentColor` |
| Sombra dramática com cor | Sombra neutra: `var(--TM-shadow-lg)` |
| Glassmorphism ou blur de fundo | Fundo `#161513` flat, sem blur, sem glassmorphism |
| Badge pill arredondado (border-radius: 999px) | Badge mono com `border-radius: 3px` |
| Stagger longo (200ms+ entre elementos) | Máximo 80ms entre elementos do mesmo grupo |
| Hover scale exagerado (>1.05) | `translateY(-2px)` máximo — somos engenharia |
| Fundo com textura ou pattern elaborado | Grid técnico de 28px com opacidade baixa (já no DS) |
