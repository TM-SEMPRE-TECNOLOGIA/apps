# TM Construtora Design System

> Sistema de design canônico para **TM Sempre Tecnologia** — visual sóbrio de engenharia civil para todas as ferramentas internas (AutoRelatório V2 e adjacentes).

**Desenvolvedor:** Thiago Nascimento Barbosa
**Versão:** v3 · Civil Engineering pivot (abril/2026)
**Idioma de produto:** Português do Brasil (pt-BR)

---

## Pivô — o que mudou na v3

A versão anterior ("Ocean Breeze") era um SaaS verde-ciano. Essa estética foi descartada. A v3 é **engenharia civil sóbria**:

- **Paleta:** laranja construção (`#C8541C`), cinza concreto (`#5C5A55`), branco papel (`#F5F4F1`), grafite/ink (`#1A1A1A`).
- **Sem gradientes.** Cores chapadas, hairlines, sombras quase imperceptíveis.
- **Tipografia:** Roboto Slab (display, slab arquitetônico) + Inter (UI) + JetBrains Mono (técnico).
- **Casing técnico:** CAIXA-ALTA + tracking + monospace nas badges (`ESTÁVEL`, `EM OBRA`, `01.00`). Numeração estilo norma também aceita: `01.00 · CONTEXTO`.
- **Modo escuro mantido** (estilo CAD noturno: fundos `#161513`, laranja mais quente `#E47A4A`).
- **Radii pequenos** (4–8px) — sóbrio, não SaaS arredondado.

---

## TM Sempre Tecnologia — produto

A flagship é o **AutoRelatório V2** — gera relatórios técnicos `.docx` a partir de pastas de fotos de inspeção predial. Feito para quem trabalha em manutenção/contratos MAFFENG.

Stack: FastAPI + Next.js + Fabric.js. Dois modos: **Tradicional** e **São Paulo** (regex em nomes de arquivo, tabelas Word de 5 colunas).

**Repo origem:** `TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS` no GitHub.

---

## Index

```
TM Construtora Design System/
├── README.md                  ← este arquivo
├── SKILL.md                   ← manifesto Agent-Skill
├── colors_and_type.css        ← tokens canônicos + papéis tipográficos
├── preview/                   ← cards do Design System (registrados)
│   ├── colors-*.html          ← primary, semantic, neutrals, modes
│   ├── type-*.html            ← display, headings, body, mono, families
│   ├── spacing-*.html         ← scale, radii, shadows
│   ├── components-*.html      ← buttons, badges, inputs, card, toasts, stat, header, alerts
│   └── brand-*.html           ← logo, icons
└── ui_kits/
    └── autorelatorio-v2/      ← recriação fiel do app
        ├── README.md
        ├── index.html         ← protótipo interativo
        └── *.jsx              ← componentes React
```

---

## CONTENT FUNDAMENTALS

Voz: **sênior, técnica, direta, focada em solução.** Engenheiro escrevendo para engenheiro.

- **Sempre pt-BR.** Acentuação correta. Sem anglicismos quando há palavra portuguesa limpa.
- **Você** (informal-mas-respeitoso). Nunca **tu** ou **o senhor**.
- **Sem emoji** como ícone de sistema. Toda iconografia é SVG outline.
- **Sem ponto de exclamação** em mensagens de sistema. Tom calmo e confiante.
- **Casing:** Title Case em ações (`Salvar Alterações`, `Excluir Conta`); sentence case em corpo; CAIXA-ALTA + mono + tracked em badges (`ESTÁVEL`, `01.00`).
- **Glossário (use estes verbos):** Salvar (não Gravar), Excluir (não Deletar/Apagar), Configurações (não Opções), Entrar (não Login).
- **Erros explicam + recuperam:** `Não foi possível salvar. Verifique sua conexão e tente novamente.` Nunca `Erro 500`.

Microcopy assinatura:
- Eyebrow: `01.00 · CONTEXTO DA INSPEÇÃO`
- Status pill: `ESTÁVEL` · `EM OBRA` · `EM ANÁLISE` · `CRÍTICO`
- Toast sucesso: `Relatório arquivado.`

---

## VISUAL FOUNDATIONS

**Plano e técnico**, sem brilho de SaaS. Hairlines de 1px, sombras que mal aparecem, papel cinza-quente como fundo.

### Cor
- **Laranja construção `#C8541C`** é a única cor de marca. Carrega CTA, status ativo, marca. No escuro vai para `#E47A4A` (mais quente).
- **Backgrounds são cinza-quente, não branco puro.** `#F5F4F1` (papel), `#FFFFFF` em cards. Modo escuro usa `#161513` (quase preto, levemente quente).
- **Sem gradientes.** O CTA primário é laranja chapado. Hover escurece para `#A6451A`.
- **Texto:** `#1A1A1A` → `#5C5A55` → `#8C8A85`.
- **Status sóbrio:** verde-oliva (`#4F7A3A`), azul-blueprint (`#345878`), tijolo (`#A33B2A`). Nada de verde-Slack ou vermelho-bootstrap.

### Tipografia
| Família | Papel | Onde |
|---|---|---|
| **Roboto Slab** | Display | h1, page titles, hero, card titles · slab arquitetônico, peso 500–600 |
| **Inter** | UI | Body, labels, buttons, nav, forms · neutra técnica |
| **JetBrains Mono** | Técnico | Badges, código, valores tabulares, números norma `01.00` |

Pesos: 400 (body), 500 (mono labels), 600 (h1/h3/buttons). Nada de 700/800 — somos sóbrios.

### Espaçamento & layout
8pt baseline (4/8/12/16/24/32/48/64). Container max 1200px. Densidade média-alta — são ferramentas de trabalho, não landing pages.

### Backgrounds
- **Sem foto full-bleed.** Sem ilustrações desenhadas. Sem texturas.
- **Papel limpo.** O cinza-quente do fundo é a textura.
- **Linhas técnicas** (border-top 2px laranja em stat cards, border-left 3px nos toasts) são o ornamento.

### Animação
Mínima. `0.2s ease` em hover; pulse simples (opacity 1 → 0.4) em LIVE indicators. Sem stagger, sem bounce. `prefers-reduced-motion` honrado.

### Hover & press
- **Botões:** primary escurece para hover; secondary fundo vira `--tm-bg-hover`. Sem lift.
- **Cards:** border deepens para `--tm-border-hover`. Sombra sobe um nível.
- **Press:** opacity 0.92.
- **Inputs focus:** border laranja + halo `0 0 0 3px rgba(200,84,28,0.12)`.

### Bordas
- **Hairline `1px solid #DAD7D0`** universal.
- **Borda técnica preta** `#1A1A1A` em botões secondary outline e em desenhos esquemáticos.
- **Border-top laranja 2px** em stat cards (assinatura).
- **Border-left 3px** em toasts/alerts colorindo por status.

### Sombras
Quatro tiers, mas todos discretos. `sm` mal aparece. `xl` é só para modais. No escuro são pretas profundas (alpha 0.40+).

### Cantos
Pequenos. **Cards 8px**, buttons/inputs 6px, chips 4px, hero 12px. **Sem pílulas 999px** exceto raríssimos casos. Pílulas são SaaS — somos engenharia.

### Tema
Toggle em `html.dark` com persistência localStorage. Transição `background 0.3s ease` no switch.

---

## ICONOGRAPHY

- **SVG inline** sempre. Lucide via CDN (stroke 1.75, currentColor) é a fonte. Phosphor aceito como fallback.
- **Stroke 1.75px** (mais fino que Ocean Breeze v2) — combina com hairlines de 1px. `linecap/linejoin: round`.
- **Tamanhos:** 16/18/22 padrão. 22px no header, 18px em botões, 16px em pills.
- **Sem emoji.** Sem icon fonts. Sem PNG.
- **Glifos unicode aceitos:** `§` (legacy, evitar em v3), `▲ ▼` em deltas de stats, `·` em separadores mono.

A logomark é um **quadrado laranja sólido `#C8541C`** ao lado do wordmark Roboto Slab — não há símbolo desenhado. Simples, técnico, reconhecível.

---

## Como usar

1. Linkar `colors_and_type.css`.
2. Usar variáveis: `var(--TM-primary)`, `var(--tm-text)`. Nunca hardcode `#C8541C`.
3. Tipografia: Roboto Slab para display, Inter para UI, JetBrains Mono para técnico.
4. Title Case nas ações; CAIXA-ALTA mono nas badges.
5. Ler `ui_kits/autorelatorio-v2/index.html` para um exemplo aplicado.

---

## Substituições / pendências

- **Fontes:** Google Fonts (Roboto Slab, Inter, JetBrains Mono) via `@import`. Sem TTFs locais.
- **Ícones:** Lucide via CDN. Sem sprite local.
- **Logo:** quadrado chapado + wordmark. Se houver mark oficial, drop em `assets/`.
- **Cobertura:** UI kit feito apenas para AutoRelatório V2. Outros produtos (Gerenciador O.S., TM Hub) não têm kit.
