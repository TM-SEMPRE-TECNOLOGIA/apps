# 🎨 Design System — TM Pastas

Design system centralizado do **Gerador de Estrutura de Pastas**.  
Todos os tokens visuais (cores, tipografia, espaçamentos, animações) estão nesta pasta.

## Arquivos

| Arquivo | Descrição |
|---|---|
| `tokens.css` | Variáveis CSS (cores, fontes, sombras, raios) |
| `animations.css` | Keyframes e transições reutilizáveis |
| `components.css` | Estilos base para botões, inputs, cards, modais |
| `layout.css` | Grid, containers, responsividade |

## Como editar

Para alterar cores, fontes ou qualquer aspecto visual:

1. Edite as **variáveis CSS** em `tokens.css`
2. Os componentes React usam essas variáveis automaticamente
3. Nenhum arquivo de componente precisa ser alterado para mudanças visuais

## Paleta de Cores Atual

| Token | Valor | Uso |
|---|---|---|
| `--bg-primary` | `#0a0a0f` | Fundo principal |
| `--bg-secondary` | `#12121a` | Fundo de painéis/cards |
| `--bg-card` | `rgba(255,255,255,0.03)` | Fundo de cards (glassmorphism) |
| `--text-primary` | `#ffffff` | Texto principal |
| `--text-secondary` | `#a0a0a0` | Texto secundário |
| `--accent` | `#00d4ff` | Cor de destaque primária |
| `--accent-secondary` | `#7b2cbf` | Cor de destaque secundária |
| `--success` | `#00c853` | Ações de sucesso |
| `--danger` | `#991b1b` | Ações destrutivas |
| `--nivel-1` | `#3b82f6` | Azul — Área |
| `--nivel-2` | `#10b981` | Verde — Ambiente |
| `--nivel-3` | `#f97316` | Laranja — Serviço/Subpasta |
| `--nivel-4` | `#8b5cf6` | Roxo — Detalhe |

## Tipografia

- **Fonte primária**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700
- **Escala**: 0.75rem → 3.5rem

## Animações

- `float` — Animação de flutuação suave para ícones hero
- `fadeIn` — Entrada suave para componentes
- `slideDown` — Abertura de accordion
- `glow` — Efeito de brilho para elementos em foco

## Breakpoints

| Nome | Valor | Uso |
|---|---|---|
| Mobile | `≤ 768px` | Stack vertical, wizard full-width |
| Tablet | `769px – 1024px` | Layout adaptado |
| Desktop | `≥ 1025px` | Layout side-by-side (wizard + preview) |
