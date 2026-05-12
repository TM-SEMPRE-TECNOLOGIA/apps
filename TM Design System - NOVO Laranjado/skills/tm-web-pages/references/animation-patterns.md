# Padrões de Animação — TM Sempre Tecnologia

> Animação mínima e técnica. `0.2s ease` em hover, `0.5s ease` em reveal.
> Sem bounce, sem stagger exagerado, sem efeitos de SaaS.
> Sempre honrar `prefers-reduced-motion`.

---

## Catálogo de animações aprovadas

### 1 — Fade + Slide (reveal no scroll)
**Uso:** Cards, features, stat cards, qualquer elemento que entra no viewport.
**Como:** IntersectionObserver + classe `.anim-in` / `.visible`.

```css
.anim-in {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity .5s ease, transform .5s ease;
}
.anim-in.visible {
  opacity: 1;
  transform: none;
}
```

Para stagger entre filhos, adicionar `transition-delay` por índice:
```js
document.querySelectorAll('.feat-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 80}ms`;
});
```

---

### 2 — Hero Stagger (entrada escalonada no load)
**Uso:** Todos os elementos do hero (eyebrow → h1 → subtítulo → CTAs → sociais).
**Como:** setTimeout encadeado, não CSS puro (garante ordem mesmo com fonts não carregadas).

```js
window.addEventListener('load', () => {
  const items = [
    { el: document.getElementById('eyebrow'), delay: 100  },
    { el: document.getElementById('hero-h1'), delay: 250  },
    { el: document.querySelector('.hero-sub'), delay: 400  },
    { el: document.querySelector('.hero-ctas'), delay: 550 },
    { el: document.querySelector('.hero-socials'), delay: 680 },
  ];
  items.forEach(({ el, delay }) => {
    if (!el) return;
    setTimeout(() => el.classList.add('visible'), delay);
  });
});
```

CSS dos elementos hero (opacidade 0 inicial, sem transform de entrada — apenas fade):
```css
.hero-eyebrow, .hero-h1, .hero-sub, .hero-ctas, .hero-socials {
  opacity: 0;
  transition: opacity .5s ease, transform .5s ease;
}
```

---

### 3 — Pulse dot (LIVE indicator)
**Uso:** Badges "LIVE", status pills "ESTÁVEL", live dots em eyebrows.

```css
.live-dot {
  width: 7px; height: 7px;
  background: var(--TM-primary);
  border-radius: 50%;
  animation: pulse-dot 2s ease infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%       { opacity: .3; }
}
```

---

### 4 — Scroll cue (seta flutuante)
**Uso:** Hero section, indicador de scroll para baixo.

```css
.scroll-cue {
  animation: float-cue 1.6s ease infinite;
}
@keyframes float-cue {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(8px); }
}
```

---

### 5 — Typewriter
**Uso:** Subtítulo do hero com frases rotativas que mostram diferentes benefícios do produto.
**Parâmetros:** digitação a 42ms/char, deleção a 22ms/char, pausa de 2200ms no final de cada frase.
Ver SKILL.md para o código completo.

---

### 6 — Countup ao entrar no viewport
**Uso:** Stat cards, seção de números/métricas.
**Easing:** cubic `1 - (1-t)³` (aceleração inicial, desaceleração suave).
**Duração:** 1400ms. Formata com `toLocaleString('pt-BR')`.
Ver SKILL.md para o código completo.

---

### 7 — Terminal animado (hero técnico)
**Uso:** Hero split (texto + painel técnico), páginas de produto com foco em automação.
**Estrutura:** janela com barra de controles (dots), linhas aparecendo com delay, barra de progresso, badge de conclusão. Loop automático.

CSS de cores do terminal (fundo sempre escuro independente do tema):
```css
.terminal { background: #161513; border: 1px solid #2A2926; border-radius: var(--TM-radius-xl); }
.term-bar { background: #1F1E1B; border-bottom: 1px solid #2A2926; }
.term-body { font-family: var(--TM-font-mono); font-size: 12.5px; line-height: 1.9; padding: 20px; }
```

---

### 8 — Card hover (elevação discreta)
**Uso:** Feature cards, depoimentos, qualquer card clicável.
**Regra:** Nunca mais de `translateY(-2px)` — somos engenharia, não SaaS.

```css
.card {
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}
.card:hover {
  border-color: var(--tm-border-hover);
  box-shadow: var(--TM-shadow-md);
  transform: translateY(-2px);
}
```

---

### 9 — Magnetic hover (botões CTA premium)
**Uso:** Botão principal do hero, CTAs de alta prioridade.
**Intensidade:** máx 18% do deslocamento do cursor — sutil.

```js
function addMagnetic(selector) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.18;
      const y = (e.clientY - r.top  - r.height / 2) * 0.18;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
addMagnetic('.btn-primary');
```

---

### 10 — Line clip reveal (títulos)
**Uso:** Títulos de seção que "imprimem" ao entrar no viewport. Efeito de régua técnica.

```css
.line-wrap  { overflow: hidden; }
.line-inner {
  transform: translateY(110%);
  animation: line-up .6s cubic-bezier(.16,1,.3,1) forwards;
}
@keyframes line-up { to { transform: translateY(0); } }
```

Aplicar via JS ao detectar o elemento no viewport:
```js
obs.observe(titleEl); // ao ficar visível, adicionar classe que ativa a animação
```

---

### 11 — Clip-path reveal (cortina lateral)
**Uso:** Barras de acento laranja, imagens, elementos que entram da lateral.

```css
.clip-reveal {
  clip-path: inset(0 100% 0 0);
  animation: clip-slide .7s cubic-bezier(.16,1,.3,1) forwards;
}
@keyframes clip-slide { to { clip-path: inset(0 0% 0 0); } }
```

---

### 12 — Skeleton shimmer (loading state)
**Uso:** Estado de carregamento antes do countup disparar, enquanto terminal "processa".

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--tm-bg-secondary) 25%,
    var(--TM-primary-light) 50%,
    var(--tm-bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { to { background-position: -200% 0; } }
```

---

## Regras de combinação

| Tipo de página | Animações recomendadas |
|---|---|
| Landing / showcase | Hero stagger + Fade slide + Pulse dot + Scroll cue |
| Página de vendas | Hero stagger + Terminal + Countup + Fade slide + Magnetic hover |
| Componente / UI | Card hover + Pulse dot + Skeleton shimmer |
| Página técnica/app | Terminal + Countup + Fade slide |
| Hero com texto longo | Line clip reveal + Fade slide |

## Durações aprovadas

| Tipo | Duração | Easing |
|---|---|---|
| Hover (border, bg, color) | 150ms | `ease` |
| Card hover (transform) | 200ms | `ease` |
| Reveal scroll | 500ms | `ease` |
| Hero stagger (por elemento) | 500ms | `ease` |
| Countup | 1400ms | cubic `1-(1-t)³` |
| Terminal linha | variável (900–7000ms) | — |
| Dark mode transition | 300ms | `ease` |
| Typewriter digita | 42ms/char | — |
| Typewriter deleta | 22ms/char | — |
| Scroll cue float | 1600ms | `ease infinite` |

## O que NUNCA usar

- `bounce` ou `elastic` em qualquer coisa que não seja teste
- `stagger > 120ms` entre cards (fica lento demais para ferramentas de trabalho)
- `scale > 1.05` em hover
- `translateY > -4px` em hover de cards
- `blur()` como efeito de transição
- Animações de entrada em `loop` (exceto pulse-dot e scroll-cue)
- Parallax baseado em scroll JS (pesado, use CSS scroll-driven se quiser)
