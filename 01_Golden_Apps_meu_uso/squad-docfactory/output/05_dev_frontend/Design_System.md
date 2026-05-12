# Design System e Identidade Visual (UI/UX) — Auto Relatório

## 1. O Padrão "Minimalista Industrial"

O design do Auto Relatório abandonou as clássicas cores de dashboard genéricas e adotou um perfil que remete a uniformes e engenharia civil/predial, focando na solidez ("Trabalho braçal da máquina").

## 2. Paleta de Cores (Tailwind + CSS Props)

O core cromático que reside no `globals.css` é composto por:

- **Primary Brand (Azul Industrial):** `#003694` (Tom central de chamadas à ação, inspira confiança corporativa).
- **Secondary Brand (Azul Mais Escuro):** `#002266` (Hover e profundidade).
- **Accent Brand (Laranja Ouro):** `#8a5100` (Usado para os glows e accent text — contraste complementar de alto impacto com o azul).
- **Backgrounds:** Off-white (`#fdfdfd`) para os cards e o background principal tem gradientes radiais mixando os tons azuis e laranjas (`#0f172a` se em dark mode for ativado na V2).
- **Foreground Text:** Slate escuro (`#1e293b`).

## 3. Tipografia

- **San-serif Base (`--font-sans`):** `Manrope`, `Inter`.
- **Monospace Base (`--font-mono`):** `Space Grotesk` (Usado puramente para ler o Console e Status).

## 4. Utilities Premium (Tailwind v4)

O Tailwind no projeto tem classes utilitárias personalizadas no `@theme` para garantir a consistência de UI Componente:

1. `@utility glass-panel`: Background branco + fallback de blur, com borda extremamente fina (`rgba(0, 54, 148, 0.08)`) conferindo aspecto de "vidro de obra".
2. `@utility premium-card`: Usado nas seções do PreviewGrid. O raio de borda é menor (arredondamento "seco" `0.5rem`) para passar uma impressão mais de "software desktop" e não "rede social bubble".
3. `@utility glow-text`: O texto ganha brilho radiante em Laranja/Azul, aplicado ao Hero ou a Labels fortes.
4. `@utility btn-primary`: Text-transform em Uppercase (Maiúsculas) + Tracking (letter spacing).

## 5. Regra Estrita de UI
⚠️ **Aviso ao Squad:** A interface do Auto Relatório já foi validada com os técnicos de campo e tem uma identidade que une **Tons Azul Laranja** de alta densidade. Jamais aplicar temas padronizados tipo `DaisyUI` sem consultar o Product Owner. O Frontend preza por interfaces "Sólidas e Secas".
