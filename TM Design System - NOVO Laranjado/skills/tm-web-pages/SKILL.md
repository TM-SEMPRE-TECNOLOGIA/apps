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

1. **Nunca hardcode cores.** Use sempre `var(--TM-primary)`, `var(--tm-text)` etc.
2. **Sem gradientes.** Exceção única: `scroll-cue-line` (linha decorativa de 1px que desbota).
3. **Dark mode obrigatório.** Toggle via `html.dark` + `localStorage`. Ícone lua/sol com swap.
4. **Fontes via Google Fonts.** Roboto Slab (display) · Inter (UI) · JetBrains Mono (técnico). Sempre os três.
5. **Ícones SVG inline.** Lucide style: `stroke-width: 1.75`, `stroke-linecap: round`, `stroke-linejoin: round`, `currentColor`. Nunca emoji como ícone de sistema.
6. **`prefers-reduced-motion` honrado.** Sempre incluir o bloco `@media (prefers-reduced-motion: reduce)`.
7. **Radii pequenos.** Cards `8px`, buttons/inputs `6px`, chips `4px`, hero `12px`. Sem `border-radius: 999px` exceto avatares.
8. **Animações via CSS + JS puro.** Sem GSAP, Framer Motion, AOS ou dependências externas.
9. **Salvar em** `C:\\Users\\thiag\\Desktop\\TM-MEUS-APPS\\` — sempre fornecer link `computer://` ao final.
10. **Idioma pt-BR.** Voz sênior, técnica, direta. Sem ponto de exclamação em mensagens de sistema. Title Case em ações.
11. **LOGO OBRIGATÓRIO.** Nunca usar o quadrado laranja (`brand-sq`) como identidade visual. Sempre usar o `<img>` base64 do LOGO.png com o CSS `.brand-logo` especificado na seção abaixo.

---

## Logo Oficial TM — Regra de Uso

O logo da TM Sempre Tecnologia é sempre renderizado como `<img>` com base64 inline — sem dependência de arquivo externo, sem quadrado laranja improvisado.

O CSS aplica um **glow laranja pulsante** sutil no light mode e mais intenso no dark mode, com hover que para a animação e aplica brilho + escala.

### CSS obrigatório do logo

```css
.brand-logo {
  height: 28px;
  width: auto;
  display: block;
  transition: filter .35s ease, transform .25s ease;
  animation: logo-glow 4s ease-in-out infinite;
}
html.dark .brand-logo {
  animation: logo-glow-dark 4s ease-in-out infinite;
}
@keyframes logo-glow {
  0%,100% { filter: drop-shadow(0 0 4px rgba(200,84,28,.15)) brightness(1.0); }
  50%      { filter: drop-shadow(0 0 9px rgba(200,84,28,.30)) brightness(1.05); }
}
@keyframes logo-glow-dark {
  0%,100% { filter: drop-shadow(0 0 6px rgba(228,122,74,.30)) brightness(1.08); }
  50%      { filter: drop-shadow(0 0 14px rgba(228,122,74,.55)) brightness(1.18); }
}
.brand-logo:hover {
  animation: none;
  filter: drop-shadow(0 0 12px rgba(200,84,28,.50)) brightness(1.1) saturate(1.15);
  transform: scale(1.03);
}
.brand-badge {
  font-family: var(--TM-font-mono);
  font-size: 9px; font-weight: 600; letter-spacing: .1em;
  padding: 2px 6px; border-radius: 3px;
  background: var(--tm-text); color: var(--tm-bg-card);
}
```

### HTML do brand (substitui brand-sq para sempre)

```html
<a class="brand" href="#" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
  <img class="brand-logo"
       alt="TM Sempre Tecnologia"
       src="data:image/png;base64,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">
  <span class="brand-badge">v5.0</span>
</a>
```

> Ajuste o número da versão no `brand-badge` conforme o projeto (`v4.0`, `v5.0`, etc.).

### Footer com logo (substituir footer-sq)

No footer, usar o mesmo `<img class="brand-logo">` com `height: 22px` inline:

```html
<footer class="footer">
  <div class="footer-brand" style="display:flex;align-items:center;gap:8px;">
    <img class="brand-logo" alt="TM" style="height:22px;"
         src="data:image/png;base64,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">
    <span class="footer-name">TM Sempre Tecnologia</span>
  </div>
  <div class="footer-meta">
    <span>AutoRelatório V5 · 2026</span>
    <span class="status-pill"><span class="dot"></span>ESTÁVEL</span>
  </div>
</footer>
```

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

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>[Título] — TM Sempre Tecnologia</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    /* 1. TOKENS (copiar de references/ds-tokens.md) */
    /* 2. RESET & BASE */
    /* 3. COMPONENTES — incluindo .brand-logo e @keyframes logo-glow */
    /* 4. ANIMAÇÕES */
  </style>
</head>
<body>
  <!-- HEADER fixo com <img class="brand-logo"> -->
  <!-- SEÇÕES (ver page-types.md) -->
  <!-- FOOTER com <img class="brand-logo"> -->
  <script>/* dark mode + animações JS */</script>
</body>
</html>
```

---

## Dark mode — script padrão

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
    const sv = entry.target.querySelector('.stat-value[data-target]');
    if (sv) animCount(sv);
    obs.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.anim-in').forEach(el => obs.observe(el));
```

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
    el.textContent = isDecimal ? (val/10).toFixed(1)+'%' : val.toLocaleString('pt-BR')+suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
```
HTML: `<div class="stat-value" data-target="1247" data-suffix="">0</div>`

---

## Typewriter padrão

```js
const phrases = ['Frase 1.', 'Frase 2.', 'Frase 3.'];
let pi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter-text');
function typewrite() {
  const phrase = phrases[pi];
  if (!deleting) {
    tw.textContent = phrase.slice(0, ci + 1); ci++;
    if (ci === phrase.length) { deleting = true; setTimeout(typewrite, 2200); return; }
    setTimeout(typewrite, 42);
  } else {
    tw.textContent = phrase.slice(0, ci - 1); ci--;
    if (ci === 0) { deleting = false; pi = (pi+1) % phrases.length; setTimeout(typewrite, 400); return; }
    setTimeout(typewrite, 22);
  }
}
setTimeout(typewrite, 900);
```
CSS cursor: `.cursor { display:inline-block; width:2px; height:1em; background:var(--TM-primary); margin-left:3px; vertical-align:text-bottom; animation:blink .9s step-end infinite; }`

---

## Terminal animado (hero técnico)

```js
const termLines = [
  { delay: 900,  html: '<span class="pr">$</span><span class="tx"> python script.py</span>' },
  { delay: 1600, html: '<span class="cm">  # Processando...</span>' },
  { delay: 2400, html: '<span class="st">  ✓</span><span class="tx"> Concluído</span>' },
];
const tb = document.getElementById('term-body');
termLines.forEach(({ delay, html }) => {
  setTimeout(() => {
    const d = document.createElement('div'); d.className = 'tl'; d.innerHTML = html;
    tb.appendChild(d); tb.scrollTop = tb.scrollHeight;
  }, delay);
});
```

CSS cores do terminal:
- `.pr` → `#E47A4A` | `.cm` → `#6E6C66` | `.st` → `#4F7A3A` | `.tx` → `#EFEDE8`

---

## Componentes prontos

### Header fixo (com logo oficial)
Ver seção **Logo Oficial TM** acima — usar sempre `<img class="brand-logo">`.

### Stat card (border-top laranja)
```html
<div class="stat-card">
  <div class="stat-label">RELATÓRIOS GERADOS</div>
  <div class="stat-value" data-target="1247">0</div>
  <div class="stat-delta">▲ +12% vs. mês passado</div>
</div>
```

### Badge eyebrow com live dot
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
<a class="btn btn-outline">Ver Detalhes</a>
<a class="btn btn-danger">Excluir</a>
```

### Footer padrão (com logo oficial)
Ver seção **Logo Oficial TM** acima — usar sempre `<img class="brand-logo" style="height:22px">`.
