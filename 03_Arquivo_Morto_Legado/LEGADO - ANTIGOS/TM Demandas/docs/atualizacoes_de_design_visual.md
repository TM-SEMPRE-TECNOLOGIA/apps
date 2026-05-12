# 🎨 Relatório de Design Visual, Cores e Profundidade

## 📋 Resumo Executivo
Análise técnico-estética do sistema visual do **Acompanha Demanda**, focando em paleta de cores, contraste, sombras/elevação e consistência entre estados.

**Tema**: Dark Mode (Slate 950 base).
**Cor Primária**: Vermelho (Red 600).
**Sistema de Tokens**: Não existe formalmente (cores inline via Tailwind).

---

## 🎯 Diagnóstico Visual

### ✅ Pontos Fortes
1.  **Paleta Coesa**: Uso consistente de `slate-*` para neutros e `red-*` para ações primárias.
2.  **Hierarquia Clara**: Cards com bordas `slate-800` e fundo `slate-900` criam separação visual.
3.  **Estados de Feedback**: Uso correto de `emerald` (sucesso), `amber` (alerta) e `rose` (erro).

### ⚠️ Problemas Identificados

| Problema | Local | Impacto |
| :--- | :--- | :--- |
| **Contraste Baixo em Texto Secundário** | `text-slate-500` sobre `bg-slate-900` | Ratio ~3.5:1 (abaixo do mínimo 4.5:1 para texto pequeno). Dificulta leitura. |
| **Sombras Inconsistentes** | `shadow-lg shadow-red-900/20` | A sombra vermelha aparece em alguns botões, mas não em todos. Falta padrão. |
| **Cor Órfã (Azul)** | `text-blue-500` em `~{log.updated}` | Azul aparece uma única vez no app sem função semântica definida. |
| **Estados Hover Fracos** | `hover:bg-slate-800` | Em dark mode, a diferença entre `slate-900` e `slate-800` é sutil demais. |
| **Falta de Focus Ring** | Inputs e Botões | Não há indicador de foco para navegação por teclado (acessibilidade). |

---

## 🎨 Recomendações

### 1. Aumentar Contraste de Textos Secundários
- **Atual**: `text-slate-500` (~#64748b).
- **Proposta**: `text-slate-400` (~#94a3b8) para textos secundários.
- **Justificativa**: Melhora o ratio de contraste para 5.5:1, atendendo WCAG AA.

### 2. Padronizar Sombras
- **Proposta**: Criar 3 níveis de elevação:
    - **Nível 0 (Base)**: Sem sombra (cards estáticos).
    - **Nível 1 (Interativo)**: `shadow-md` (botões, inputs em foco).
    - **Nível 2 (Destaque)**: `shadow-lg shadow-red-900/20` (modais, CTAs principais).
- **Ação**: Remover sombras vermelhas de botões secundários (como "Exportar").

### 3. Remover Cor Órfã (Azul)
- **Local**: `App.tsx:528` (`text-blue-500`).
- **Proposta**: Substituir por `text-amber-500` (update) ou `text-slate-400` (neutro).
- **Justificativa**: O azul não tem significado no sistema atual. Introduz ruído visual.

### 4. Melhorar Estados Hover
- **Proposta**: Usar `hover:bg-slate-700/50` ou adicionar borda sutil no hover.
- **Justificativa**: O salto de `slate-900` para `slate-800` é de apenas ~5% de luminosidade. Precisa de pelo menos 10-15% para ser perceptível.

### 5. Adicionar Focus Ring para Acessibilidade
- **Proposta**: Adicionar `focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-900` a todos os elementos interativos.
- **Justificativa**: Usuários que navegam por teclado não têm indicação visual de onde estão.

---

## 🪄 Análise de Elevação e Profundidade

| Elemento | Sombra Atual | Recomendação |
| :--- | :--- | :--- |
| Cards do Dashboard | `shadow-sm` (implícito) | Manter (nível 0). |
| Sidebar | Nenhuma | Adicionar `shadow-xl` para separar do conteúdo. |
| Modal | `shadow-2xl` | ✅ Correto (máxima elevação). |
| Botão Primário "Salvar" | `shadow-lg shadow-red-900/20` | ✅ Correto. |
| Botão Secundário "Exportar" | Nenhuma | Manter sem sombra (coerente com hierarquia). |

---

## 🧠 Justificativa Técnica Geral

| Mudança | Benefício |
| :--- | :--- |
| Aumentar contraste | Leitura mais fácil, acessibilidade (WCAG AA). |
| Padronizar sombras | Previsibilidade visual, menos "ruído cognitivo". |
| Remover cor órfã | Sistema de cores mais coeso e escalável. |
| Focus ring | Navegação por teclado funcional (a11y). |

---

## ⚡ Quick Wins

| Arquivo | Classe/Trecho | Ação |
| :--- | :--- | :--- |
| `App.tsx` (global) | `text-slate-500` | Substituir por `text-slate-400` em textos pequenos. |
| `App.tsx:528` | `text-blue-500` | Substituir por `text-amber-400`. |
| `App.tsx:42` | `<aside>` Sidebar | Adicionar `shadow-xl`. |
| `App.tsx` (inputs) | `focus:outline-none` | Adicionar `focus:ring-2 focus:ring-red-500/50`. |

