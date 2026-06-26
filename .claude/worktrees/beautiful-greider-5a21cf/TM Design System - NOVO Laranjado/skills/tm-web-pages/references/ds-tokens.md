# DS Tokens — TM Sempre Tecnologia v3

Copie este bloco `:root` + `html.dark` no início de todo `<style>` de página.

## Bloco CSS completo

```css
:root {
  /* ── BRAND ──────────────────────────────────── */
  --TM-primary:             #C8541C;   /* laranja construção */
  --TM-primary-hover:       #A6451A;   /* hover/active */
  --TM-primary-light:       #FBEDE3;   /* superfície laranja suave */
  --TM-primary-light-alpha: rgba(200,84,28,.12);

  /* ── SUPERFÍCIES (light) ─────────────────────── */
  --tm-bg:           #F5F4F1;   /* papel cinza-quente */
  --tm-bg-card:      #FFFFFF;
  --tm-bg-hover:     #ECEAE5;
  --tm-bg-input:     #FFFFFF;
  --tm-bg-sidebar:   #FAF9F6;
  --tm-bg-secondary: #E8E5DE;   /* concreto claro */
  --tm-bg-accent:    #FBEDE3;   /* laranja muito suave */
  --tm-bg-muted:     #EFEDE8;

  /* ── TEXTO ───────────────────────────────────── */
  --tm-text:        #1A1A1A;
  --tm-text-muted:  #5C5A55;
  --tm-text-subtle: #8C8A85;

  /* ── BORDAS ──────────────────────────────────── */
  --tm-border:       #DAD7D0;
  --tm-border-hover: #B8B5AD;
  --tm-border-strong:#1A1A1A;

  /* ── STATUS ──────────────────────────────────── */
  --tm-success:     #4F7A3A;   /* verde oliva sóbrio */
  --tm-info:        #345878;   /* azul blueprint */
  --tm-warning:     #C8541C;   /* = laranja primária */
  --tm-destructive: #A33B2A;   /* tijolo escuro */

  /* ── CHART RAMP ──────────────────────────────── */
  --TM-chart-1: #C8541C;
  --TM-chart-2: #8C5A2E;
  --TM-chart-3: #5C5A55;
  --TM-chart-4: #345878;
  --TM-chart-5: #2B2B2B;

  /* ── TIPOGRAFIA ──────────────────────────────── */
  --TM-font-serif: "Roboto Slab", Georgia, serif;
  --TM-font-sans:  "Inter", system-ui, sans-serif;
  --TM-font-mono:  "JetBrains Mono", monospace;

  /* ── RADII ───────────────────────────────────── */
  --TM-radius-sm: 4px;    /* chips, pequenos */
  --TM-radius-md: 6px;    /* buttons, inputs */
  --TM-radius-lg: 8px;    /* cards */
  --TM-radius-xl: 12px;   /* hero cards, modais */

  /* ── SOMBRAS ─────────────────────────────────── */
  --TM-shadow-sm: 0 1px 0 rgba(26,26,26,.04), 0 1px 2px rgba(26,26,26,.04);
  --TM-shadow-md: 0 2px 4px -1px rgba(26,26,26,.08), 0 1px 2px rgba(26,26,26,.04);
  --TM-shadow-lg: 0 8px 16px -4px rgba(26,26,26,.10), 0 2px 4px -1px rgba(26,26,26,.06);
  --TM-shadow-xl: 0 16px 24px -6px rgba(26,26,26,.12), 0 4px 8px -2px rgba(26,26,26,.06);

  /* ── ESPAÇAMENTO ─────────────────────────────── */
  --tm-space-1:  4px;
  --tm-space-2:  8px;
  --tm-space-3:  12px;
  --tm-space-4:  16px;
  --tm-space-5:  24px;
  --tm-space-6:  32px;
  --tm-space-7:  48px;
  --tm-space-8:  64px;
}

/* ── DARK MODE (CAD noturno) ─────────────────── */
html.dark {
  --TM-primary:             #E47A4A;
  --TM-primary-hover:       #C8541C;
  --TM-primary-light:       #2B2520;
  --TM-primary-light-alpha: rgba(228,122,74,.18);

  --tm-bg:           #161513;
  --tm-bg-card:      #1F1E1B;
  --tm-bg-hover:     #2A2926;
  --tm-bg-input:     #1F1E1B;
  --tm-bg-sidebar:   #1A1916;
  --tm-bg-secondary: #2A2926;
  --tm-bg-accent:    #2B2520;
  --tm-bg-muted:     #232220;

  --tm-text:        #EFEDE8;
  --tm-text-muted:  #A8A6A0;
  --tm-text-subtle: #6E6C66;

  --tm-border:       #34322E;
  --tm-border-hover: #4A4842;
  --tm-border-strong:#EFEDE8;

  --TM-shadow-sm: 0 1px 0 rgba(0,0,0,.40);
  --TM-shadow-md: 0 2px 4px -1px rgba(0,0,0,.50);
  --TM-shadow-lg: 0 8px 16px -4px rgba(0,0,0,.55);
  --TM-shadow-xl: 0 16px 24px -6px rgba(0,0,0,.65);
}
```

---

## Reset + base obrigatório

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  scroll-behavior: smooth;
  background: var(--tm-bg);
  transition: background .3s ease, color .3s ease;
}

body {
  font-family: var(--TM-font-sans);
  color: var(--tm-text);
  background: var(--tm-bg);
  line-height: 1.6;
  overflow-x: hidden;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}

:focus-visible {
  outline: 2px solid var(--TM-primary);
  outline-offset: 2px;
}
```

---

## Tipografia — classes utilitárias

```css
.tm-display  { font-family: var(--TM-font-serif); font-weight: 600; font-size: clamp(2rem,5vw,3rem); line-height: 1.1; letter-spacing: -.015em; color: var(--tm-text); }
.tm-h1       { font-family: var(--TM-font-serif); font-weight: 600; font-size: 26px; line-height: 1.25; letter-spacing: -.01em; color: var(--tm-text); }
.tm-h2       { font-family: var(--TM-font-serif); font-weight: 500; font-size: 19px; line-height: 1.35; color: var(--tm-text); }
.tm-h3       { font-family: var(--TM-font-sans);  font-weight: 600; font-size: 15px; line-height: 1.4; color: var(--tm-text); letter-spacing: .005em; }
.tm-body     { font-family: var(--TM-font-sans);  font-weight: 400; font-size: 14px; line-height: 1.6; color: var(--tm-text); }
.tm-body-m   { font-family: var(--TM-font-sans);  font-weight: 400; font-size: 14px; line-height: 1.6; color: var(--tm-text-muted); }
.tm-small    { font-family: var(--TM-font-sans);  font-size: 12px; color: var(--tm-text-muted); }
.tm-mono     { font-family: var(--TM-font-mono);  font-size: 13px; color: var(--tm-text); }
.tm-mono-lbl { font-family: var(--TM-font-mono);  font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--tm-text-subtle); font-weight: 500; }
```

---

## Botões — CSS completo

```css
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 18px; font-size: 14px; font-weight: 600;
  font-family: var(--TM-font-sans); border-radius: var(--TM-radius-md);
  cursor: pointer; border: 1px solid transparent;
  letter-spacing: .005em; text-decoration: none;
  transition: background .15s, border-color .15s, transform .15s, opacity .15s;
}
.btn:active { opacity: .92; transform: translateY(0) !important; }

/* Variantes */
.btn-primary   { background: var(--TM-primary); color: #fff; }
.btn-primary:hover { background: var(--TM-primary-hover); transform: translateY(-1px); }

.btn-secondary { background: transparent; color: var(--tm-text); border-color: var(--tm-border-strong); }
.btn-secondary:hover { background: var(--tm-bg-hover); transform: translateY(-1px); }

.btn-outline   { background: var(--tm-bg-card); color: var(--tm-text); border-color: var(--tm-border); }
.btn-outline:hover { border-color: var(--tm-border-hover); transform: translateY(-1px); }

.btn-danger    { background: transparent; color: var(--tm-destructive); border-color: var(--tm-destructive); }
.btn-danger:hover { background: rgba(163,59,42,.06); }
```

---

## Badges — CSS completo

```css
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 10px; font-family: var(--TM-font-mono);
  font-size: 10px; font-weight: 600; letter-spacing: .12em;
  border-radius: var(--TM-radius-sm); border: 1px solid transparent;
  text-transform: uppercase;
}
.badge-ok      { background: #EAF1E4; color: #3A5A2C; border-color: #C5D4B4; }
.badge-info    { background: #E2EBF2; color: #1F3D55; border-color: #B8CADB; }
.badge-warn    { background: var(--TM-primary-light); color: var(--TM-primary-hover); border-color: rgba(200,84,28,.3); }
.badge-danger  { background: #F5DCD7; color: var(--tm-destructive); border-color: #E5B5AB; }
.badge-dark    { background: var(--tm-text); color: var(--tm-bg-card); }
```

---

## Cards — variantes

### Card padrão
```css
.card {
  background: var(--tm-bg-card);
  border: 1px solid var(--tm-border);
  border-radius: var(--TM-radius-lg);
  padding: 22px;
  box-shadow: var(--TM-shadow-sm);
  transition: border-color .2s, box-shadow .2s;
}
.card:hover { border-color: var(--tm-border-hover); box-shadow: var(--TM-shadow-md); }
```

### Stat card (border-top laranja — assinatura TM)
```css
.stat-card {
  background: var(--tm-bg-card);
  border: 1px solid var(--tm-border);
  border-top: 3px solid var(--TM-primary);   /* ← assinatura */
  border-radius: var(--TM-radius-lg);
  padding: 20px;
}
.stat-label { font-family: var(--TM-font-mono); font-size: 10px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--tm-text-subtle); margin-bottom: 8px; }
.stat-value { font-family: var(--TM-font-serif); font-size: 2rem; font-weight: 600; color: var(--tm-text); letter-spacing: -.01em; line-height: 1; }
.stat-delta { font-family: var(--TM-font-mono); font-size: 11px; font-weight: 500; margin-top: 8px; color: var(--tm-success); }
.stat-delta.neg { color: var(--tm-destructive); }
```

### Feature card com ícone
```css
.feat-icon {
  width: 44px; height: 44px;
  border-radius: var(--TM-radius-md);
  background: var(--TM-primary-light);
  color: var(--TM-primary);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(200,84,28,.2);
  margin-bottom: 16px;
}
```

---

## Header fixo — CSS completo

```css
.hdr {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: var(--tm-bg-card);
  border-bottom: 1px solid var(--tm-border);
  box-shadow: var(--TM-shadow-sm);
  height: 56px;
  display: flex; align-items: center; gap: 18px;
  padding: 0 24px;
  transition: background .3s, border-color .3s;
}
.brand-sq   { width: 18px; height: 18px; background: var(--TM-primary); border-radius: 2px; }
.brand-name { font-family: var(--TM-font-serif); font-weight: 600; font-size: 16px; color: var(--tm-text); letter-spacing: -.005em; }
.brand-badge { font-family: var(--TM-font-mono); font-size: 10px; font-weight: 600; letter-spacing: .12em; padding: 2px 7px; border-radius: 3px; background: var(--tm-text); color: var(--tm-bg-card); }

.hdr-nav a { padding: 7px 13px; border-radius: 4px 4px 0 0; text-decoration: none; color: var(--tm-text-muted); font-weight: 500; font-size: 14px; transition: color .15s, background .15s; }
.hdr-nav a:hover { color: var(--tm-text); background: var(--tm-bg-hover); }
.hdr-nav a.act { background: var(--TM-primary-light); color: var(--TM-primary-hover); border-bottom: 2px solid var(--TM-primary); border-radius: 4px 4px 0 0; }
```

---

## Status pill + live dot

```css
.status-pill {
  display: inline-flex; align-items: center; gap: 5px;
  font-family: var(--TM-font-mono); font-size: 10px; font-weight: 600;
  letter-spacing: .1em; padding: 3px 8px; border-radius: 3px;
  background: rgba(79,122,58,.12); color: var(--tm-success);
  border: 1px solid rgba(79,122,58,.25);
}
.live-dot {
  width: 6px; height: 6px;
  background: var(--tm-success); border-radius: 50%;
  animation: pulse-dot 2.5s ease infinite;
}
@keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
```

---

## Toasts / Alerts

```css
/* Toast */
.toast {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 16px;
  background: var(--tm-bg-card);
  border: 1px solid var(--tm-border);
  border-radius: var(--TM-radius-md);
  box-shadow: var(--TM-shadow-md);
  font-size: 14px; font-weight: 500;
  max-width: 380px;
}
.toast-ok  { border-left: 3px solid var(--tm-success); }
.toast-err { border-left: 3px solid var(--tm-destructive); }
.toast-info{ border-left: 3px solid var(--tm-info); }

/* Alert inline */
.alert {
  padding: 13px 16px;
  border-radius: var(--TM-radius-sm);
  border: 1px solid var(--tm-border);
  border-left: 3px solid;
  font-size: 14px; line-height: 1.5;
  background: var(--tm-bg-card);
}
.alert-ok  { border-left-color: var(--tm-success); }
.alert-err { border-left-color: var(--tm-destructive); }
.alert-info{ border-left-color: var(--tm-info); }
```

---

## Grid técnico de fundo (hero)

```css
.hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right,  rgba(26,26,26,.055) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(26,26,26,.055) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}
html.dark .hero-grid {
  background-image:
    linear-gradient(to right,  rgba(239,237,232,.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(239,237,232,.04) 1px, transparent 1px);
}
```

---

## Microcopy padrão (voz TM)

| Contexto | Texto |
|---|---|
| Toast sucesso | `Relatório arquivado.` |
| Toast erro | `Não foi possível salvar. Verifique sua conexão e tente novamente.` |
| Toast info | `Modo escuro ativado. Preferência salva.` |
| Eyebrow | `01.00 · CONTEXTO DA INSPEÇÃO` |
| Status ativo | `ESTÁVEL` · `EM OBRA` · `EM ANÁLISE` · `CRÍTICO` |
| Botão CTA | `Gerar Relatório` · `Salvar Alterações` · `Contratar Agora` |
| Nav | `Entrar` (nunca "Login") · `Configurações` (nunca "Opções") |
