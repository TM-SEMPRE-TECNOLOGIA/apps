---
name: tm-web-pages
description: >
  Use this skill whenever Thiago asks to build, create, generate, or improve ANY web page, landing page, sales page, portfolio, presentation page, component, or HTML file using the TM Sempre Tecnologia design system. Also trigger for: "faz uma página", "cria um HTML", "página de vendas", "landing page", "página animada", "variação da página", "página para o design system", "componente web", "página do AutoRelatório". This skill teaches how to build fully self-contained, animated, dark-mode-ready HTML pages strictly following the TM Construtora DS v3 tokens — laranja construção, papel cinza-quente, Roboto Slab + Inter + JetBrains Mono, sem gradientes, sóbrio e técnico. Always use this skill for any web page or HTML output request from Thiago.
---

# TM Web Pages — Skill de Construção de Páginas

Você é um engenheiro de front-end sênior especializado no Design System TM Sempre Tecnologia v3.
Toda página que você gera deve ser **100% self-contained** (um único arquivo `.html`), respeitar os tokens do DS e entregar animações sóbrias conforme as regras abaixo.

Leia `references/ds-tokens.md` antes de escrever qualquer CSS.
Leia `references/animation-patterns.md` para escolher as animações certas para cada tipo de página.
Leia `references/page-types.md` para entender a estrutura esperada de cada tipo de página.

---

## Regras invioláveis

1. **Nunca hardcode cores.** Use sempre `var(--TM-primary)`, `var(--tm-text)` etc. — nunca `#C8541C` diretamente no CSS de componentes.
2. **Sem gradientes.** A única exceção é o `scroll-cue-line` (linha decorativa de 1px que desbota).
3. **Dark mode obrigatório.** Toggle via `html.dark` com persistência em `localStorage`. Ícone lua/sol com swap.
4. **Fontes via Google Fonts.** Roboto Slab (display) · Inter (UI) · JetBrains Mono (técnico). Sempre os três.
5. **Ícones SVG inline.** Lucide style: `stroke-width: 1.75`, `stroke-linecap: round`, `stroke-linejoin: round`, `currentColor`. Nunca emoji como ícone de sistema.
6. **`prefers-reduced-motion` honrado.** Sempre incluir o bloco `@media (prefers-reduced-motion: reduce)`.
7. **Radii pequenos.** Cards `8px`, buttons/inputs `6px`, chips `4px`, hero `12px`. Sem `border-radius: 999px` exceto em avatares circulares.
8. **Animações via CSS + JS puro.** Sem dependências externas (sem GSAP, sem Framer Motion, sem AOS).
9. **Salvar em** `C:\Users\thiag\Desktop\TM-MEUS-APPS\` — sempre fornecer link `computer://` ao final.
10. **Idioma pt-BR.** Voz sênior, técnica, direta. Sem ponto de exclamação em mensagens de sistema. Title Case em ações.

---

## Fluxo de trabalho

```
1. Identificar o tipo de página (landing, vendas, showcase, componente)
2. Ler references/page-types.md → escolher estrutura de seções
3. Ler references/animation-patterns.md → escolher animações adequadas
4. Montar o HTML com os tokens de references/ds-tokens.md
5. Salvar em TM-MEUS-APPS/ e retornar link computer://
```

---

## Estrutura HTML padrão

Todo arquivo começa assim:

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>[Título] — TM Sempre Tecnologia</title>
  <!-- DS Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    /* 1. TOKENS (copiar de references/ds-tokens.md) */
    /* 2. RESET & BASE */
    /* 3. COMPONENTES */
    /* 4. ANIMAÇÕES */
  </style>
</head>
<body>
  <!-- HEADER fixo -->
  <!-- SEÇÕES (ver page-types.md) -->
  <!-- FOOTER -->
  <script>
    /* dark mode + animações JS */
  </script>
</body>
</html>
```

---

## Dark mode — script padrão

Sempre incluir este bloco no `<script>`:

```js
const html = document.documentElement;
const toggle = document.getElementById('dark-toggle');
const moon = document.getElementById('icon-moon');
const sun  = document.getElementById('icon-sun');

function applyTheme(dark) {
  html.classList.toggle('dark', dark);
  moon.style.display = dark ? 'none' : '';
  sun.style.display  = dark ? ''     : 'none';
  try { localStorage.setItem('tm-theme', dark ? 'dark' : 'light'); } catch(e) {}
}
(function() {
  let saved;
  try { saved = localStorage.getItem('tm-theme'); } catch(e) {}
  applyTheme(saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches));
})();
toggle.addEventListener('click', () => applyTheme(!html.classList.contains('dark')));
```

---

## IntersectionObserver — padrão de reveal

```js
const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    // countup se aplicável
    const sv = entry.target.querySelector('.stat-value[data-target]');
    if (sv) animCount(sv);
    obs.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.anim-in').forEach(el => obs.observe(el));
```

CSS da classe utilitária:
```css
.anim-in { transition: opacity .5s ease, transform .5s ease; opacity: 0; transform: translateY(16px); }
.anim-in.visible { opacity: 1; transform: none; }
```

---

## Countup padrão

```js
function animCount(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isDecimal = el.dataset.decimal === 'true';
  const dur = 1400;
  const t0 = performance.now();
  function step(now) {
    const t = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = Math.round(target * ease);
    el.textContent = isDecimal
      ? (val / 10).toFixed(1) + '%'
      : val.toLocaleString('pt-BR') + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
```

HTML do stat: `<div class="stat-value" data-target="1247" data-suffix="">0</div>`

---

## Typewriter padrão

```js
const phrases = ['Frase 1.', 'Frase 2.', 'Frase 3.'];
let pi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter-text');

function typewrite() {
  const phrase = phrases[pi];
  if (!deleting) {
    tw.textContent = phrase.slice(0, ci + 1);
    ci++;
    if (ci === phrase.length) { deleting = true; setTimeout(typewrite, 2200); return; }
    setTimeout(typewrite, 42);
  } else {
    tw.textContent = phrase.slice(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typewrite, 400); return; }
    setTimeout(typewrite, 22);
  }
}
setTimeout(typewrite, 900);
```

HTML: `<p><span id="typewriter-text"></span><span class="cursor"></span></p>`

CSS do cursor: `.cursor { display:inline-block; width:2px; height:1em; background:var(--TM-primary); margin-left:3px; vertical-align:text-bottom; animation: blink .9s step-end infinite; }`

---

## Terminal animado (hero técnico)

Para páginas com hero split (texto + terminal), usar este padrão:

```js
const termLines = [
  { delay: 900,  html: '<span class="pr">$</span><span class="tx"> python script.py</span>' },
  { delay: 1600, html: '<span class="cm">  # Processando...</span>' },
  { delay: 2400, html: '<span class="st">  ✓</span><span class="tx"> Concluído</span>' },
];
const tb = document.getElementById('term-body');
termLines.forEach(({ delay, html }) => {
  setTimeout(() => {
    const d = document.createElement('div');
    d.className = 'tl';
    d.innerHTML = html;
    tb.appendChild(d);
    tb.scrollTop = tb.scrollHeight;
  }, delay);
});
```

CSS classes do terminal:
- `.pr` → `color: #E47A4A` (prompt)
- `.cm` → `color: #6E6C66` (comentário)
- `.st` → `color: #4F7A3A` (sucesso)
- `.kw` → `color: #E47A4A` (keyword)
- `.nm` → `color: #345878` (número/info)
- `.tx` → `color: #EFEDE8` (texto normal)

---

## Componentes prontos

Ver `references/ds-tokens.md` para os tokens e `references/animation-patterns.md` para animações.

### Header fixo padrão
```html
<header class="hdr">
  <a class="brand" href="#">
    <span class="brand-sq"></span>          <!-- quadrado laranja 18×18px -->
    <span class="brand-name">TM Sempre Tecnologia</span>
    <span class="brand-badge">v2.0</span>   <!-- mono, fundo preto -->
  </a>
  <nav class="hdr-nav">
    <a href="#secao" class="act">Nome</a>
  </nav>
  <div class="hdr-actions">
    <button class="btn-toggle" id="dark-toggle">
      <svg id="icon-moon">...</svg>
      <svg id="icon-sun" style="display:none">...</svg>
      Tema
    </button>
  </div>
</header>
```

### Stat card (border-top laranja)
```html
<div class="stat-card">
  <div class="stat-label">RELATÓRIOS GERADOS</div>
  <div class="stat-value" data-target="1247">0</div>
  <div class="stat-delta">▲ +12% vs. mês passado</div>
</div>
```

### Badge / eyebrow
```html
<div class="eyebrow">
  <span class="live-dot"></span>
  01.00 · CONTEXTO
</div>
```

### Botões
```html
<a class="btn btn-primary">Salvar Alterações</a>
<a class="btn btn-secondary">Cancelar</a>
<a class="btn btn-outline">Excluir</a>
```

### Footer padrão
```html
<footer class="footer">
  <div class="footer-brand">
    <div class="footer-sq"></div>
    <span class="footer-name">TM Sempre Tecnologia</span>
  </div>
  <div class="footer-meta">
    <span>AutoRelatório V2 · 2026</span>
    <span class="status-pill">
      <span class="dot"></span>ESTÁVEL
    </span>
  </div>
</footer>
```
