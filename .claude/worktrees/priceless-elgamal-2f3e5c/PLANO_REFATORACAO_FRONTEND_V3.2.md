# Plano de Refatoração Frontend — AutoRelatório V3.2
**Design System TM Sempre Tecnologia v3**
**Data:** 2026-05-02 | **Status:** APROVADO PARA EXECUÇÃO

---

## Diagnóstico Geral

O frontend usa Tailwind v4 com cores azul industrial (#003694), Framer Motion em todos os componentes, sem dark mode e com múltiplas violações do DS TM. A refatoração é cirúrgica: mantém toda a lógica funcional e só altera a camada de apresentação.

**Dependências a remover:** `framer-motion`
**Dependências a adicionar:** nenhuma (CSS puro)

---

## Mapa de Arquivos

```
APP/frontend/
├── app/
│   ├── globals.css           ← REFATORAR (foundation)
│   ├── layout.tsx            ← REFATORAR (fontes + dark mode)
│   └── page.tsx              ← REFATORAR (layout + header)
├── components/
│   ├── ConsoleWatcher.tsx    ← REFATORAR (terminal TM)
│   ├── ProgressOverlay.tsx   ← REFATORAR (overlay de loading)
│   ├── SidebarWizard.tsx     ← REFATORAR MAIOR (sidebar + overlays)
│   ├── PreviewGrid.tsx       ← REFATORAR (grid de thumbnails)
│   ├── ImageEditorModal.tsx  ← REFATORAR PARCIAL (estrutura + cores)
│   └── AmbienteSelector.tsx  ← VERIFICAR (low priority)
└── data/
    ├── ambientes-constants.ts ← NÃO TOCA (lógica pura)
    └── itens-maffeng.ts       ← NÃO TOCA (lógica pura)
```

---

## Auditoria de Violações por Arquivo

### 1 — `globals.css` 🔴 CRÍTICO

| Violação | Linha | Correção |
|---|---|---|
| Cor primária azul `#003694` | 4–5 | → `var(--TM-primary)` (#C8541C) |
| Fonte `Manrope` e `Space Grotesk` | 7–8 | → `Inter` + `Roboto Slab` + `JetBrains Mono` |
| Gradiente radial no `body` | 24–27 | Remover — proibido |
| `background-attachment: fixed` | 28 | Remover — parallax proibido |
| `glass-panel` com `box-shadow` azul | 35–39 | → `var(--TM-shadow-sm)` |
| `glow-text` com gradiente de texto | 56–60 | Remover — proibido |
| `btn-primary` com `text-transform: uppercase` | 66 | Remover — DS TM não usa uppercase em botões |
| `status-badge` com `border-radius: 9999px` | 121–126 | → `var(--TM-radius-sm)` (4px) |
| `custom-scrollbar-thumb` verde (`rgba(34,197,94)`) | 140–144 | → `var(--tm-border-hover)` |
| `@keyframes float` com `translateY(-5px)` | 147–154 | Remover — usar `scroll-cue` TM |
| Sem dark mode em nenhuma parte | — | Adicionar `html.dark` completo |
| Sem `prefers-reduced-motion` | — | Adicionar bloco obrigatório |

**Ação:** Substituir completamente pelo bloco `:root` + `html.dark` + reset + utilitários do DS TM v3.

---

### 2 — `layout.tsx` 🟡 MÉDIO

| Violação | Linha | Correção |
|---|---|---|
| `import { Inter } from 'next/font/google'` — só Inter | 2 | Carregar Google Fonts via `<link>` no `<head>` com as 3 famílias TM |
| Sem `class="dark"` inicial no `<html>` | 18 | Adicionar script inline para ler `localStorage` antes do hydrate |
| Título: "NX RELATÓRIOS SP" | 8 | Pode manter ou ajustar |

**Ação:** Substituir `next/font` por `<link>` de Google Fonts no head. Adicionar script de dark mode no `<head>` (antes do body) para evitar flash branco.

---

### 3 — `page.tsx` 🟡 MÉDIO

| Violação | Linha | Correção |
|---|---|---|
| `framer-motion` para underline da nav | 284 | → CSS `border-bottom` + `transition` |
| `bg-slate-50/50` hardcoded | 260 | → `var(--tm-bg)` |
| `bg-white border-b border-slate-100` no header | 263 | → `var(--tm-bg-card)` + `var(--tm-border)` |
| `bg-brand-primary` e `shadow-brand-primary/20` | 267, 296 | → `var(--TM-primary)` e `var(--TM-shadow-md)` |
| `rounded-xl` no logo | 266 | → `var(--TM-radius-lg)` (8px) |
| Sem dark mode toggle | — | Adicionar botão com lógica de `html.dark` |
| `h-16` para header | 263 | → 56px (altura padrão TM) |

**Ação:** Remover `motion.div` da nav. Substituir todas as classes Tailwind por `style=""` com variáveis CSS TM. Adicionar dark mode toggle no header.

---

### 4 — `ConsoleWatcher.tsx` 🟢 SIMPLES

| Violação | Linha | Correção |
|---|---|---|
| `bg-slate-900` / `bg-slate-950` hardcoded | 54, 57, 113 | → manter dark mas usar `#161513` (terminal TM fixo) |
| `text-brand-accent` para sucesso | 97 | → `var(--tm-success)` |
| `text-red-400` para erro | 96 | → `var(--tm-destructive)` |
| `bg-brand-accent` no dot | 63 | → `var(--TM-primary)` |
| `border-slate-800` | múltiplas | → `#2A2926` (border do terminal TM) |
| `font-black` em labels do console | 64 | → `font-weight: 600` |
| "AUTO_RELATÓRIO_V1" no rodapé | 115 | → "AUTOREL · V3.2" |

**Ação:** O ConsoleWatcher usa fundo sempre-escuro (terminal), o que é correto pelo DS TM. Apenas trocar as cores hardcoded pelas variáveis do terminal TM (`#161513`, `#2A2926`, etc.).

---

### 5 — `ProgressOverlay.tsx` 🟡 MÉDIO

| Violação | Linha | Correção |
|---|---|---|
| `framer-motion` em tudo | 20–57 | → CSS `@keyframes` + classe `.overlay-enter` |
| `blur-3xl` como decoração | 33–34 | Remover — proibido |
| Gradiente `from-brand-primary to-brand-secondary` no ícone | 51 | → `background: var(--TM-primary)` sólido |
| `rounded-3xl` no modal | 31 | → `var(--TM-radius-xl)` (12px) |
| `animate-bounce` no Bot icon | 53 | Remover — proibido |
| `bg-white` hardcoded | 31 | → `var(--tm-bg-card)` |
| Sem dark mode | — | Tokens CSS respondem automaticamente |
| `border-brand-primary` nas bordas giratórias | 44, 48 | → `var(--TM-primary)` |
| `text-green-500` no CheckCircle | 104 | → `var(--tm-success)` |
| `bg-brand-primary text-white shadow-md shadow-brand-primary/20` | 96 | → tokens TM |

**Ação:** Substituir todos os `motion.*` por CSS transitions. Remover blur e gradientes. Manter a estrutura de steps visuais — é um padrão válido.

---

### 6 — `SidebarWizard.tsx` 🔴 MAIOR TRABALHO

| Violação | Área | Correção |
|---|---|---|
| `framer-motion` em overlays, steps, formulários | múltiplas | → CSS transitions + `max-height` trick |
| Overlay "PROCESSAMENTO NEURAL": `#0a111a`, `backdrop-blur-xl` | 280 | → overlay TM sóbrio |
| `w-32 h-32 rounded-full border-dashed` girando | 291–295 | Remover spinning circular — violação estética |
| `scale: [1, 1.1, 1]` | 292 | Scale > 1.05 proibido |
| `Sparkles` icon | 325 | → ícone técnico (FileText, Cpu simples) |
| "Agente IA Consolidando Dados" | 326 | → "Compilando relatório..." (voz TM direta) |
| Texto monopólico de overlay | 329–338 | → terminal TM com linhas simples |
| Overlay de scanning: `#060d18`, `backdrop-blur-md` | 350 | → fundo `var(--tm-bg)` com opacity |
| `text-white font-black text-sm uppercase tracking-widest` | 389 | → fonte TM, sem ALLCAPS em títulos |
| `bg-slate-100` no segmentado | 111 | → `var(--tm-bg-secondary)` |
| `text-brand-secondary` nas abas ativas | 114 | → `var(--TM-primary)` |
| `text-[9px]`, `text-[10px]` hardcoded | múltiplas | → classes `.tm-mono-lbl`, `.tm-small` |
| Sem dark mode responsivo | — | Tokens TM já resolvem automaticamente |

**Ação:** Este é o componente mais trabalhoso. Remover Framer Motion inteiro. Substituir os overlays futurísticos por sobreposições sobrias no estilo TM (terminal com linhas, sem efeitos circulares). Usar `max-height` transition para accordion dos steps.

---

### 7 — `PreviewGrid.tsx` 🟡 MÉDIO

| Violação | Linha | Correção |
|---|---|---|
| `framer-motion` nas thumbnails | 131, 198 | → CSS `transition: opacity .3s, transform .3s` |
| `motion.div` com `scale: 0.95 → 1` | 131 | → `.anim-in` TM |
| `bg-green-500` no badge OK | 166 | → `var(--tm-success)` |
| `bg-amber-500/80` no badge Pendente | 171 | → `var(--TM-warning)` |
| `bg-red-500/70` no badge Sem grupo | 188 | → `var(--tm-destructive)` |
| `bg-blue-600/80` no badge ambiente | 181 | → `var(--tm-info)` |
| Gradiente `from-slate-100 to-transparent` na linha separadora | 262 | → `border-top: 1px solid var(--tm-border)` simples |
| `bg-slate-800` no bloco de texto destacado | 268 | → `var(--tm-bg-secondary)` ou terminal TM |
| Gradiente no hover do bloco de texto | 269 | Remover — proibido |
| `group-hover:scale-110` na imagem | 144 | → máx `scale(1.03)` no hover |
| `hover:ring-2 hover:ring-brand-primary/20` | 135 | → `border-color: var(--TM-primary)` |
| `border-brand-primary shadow-sm` no fachada | 136 | → `border-top: 2px solid var(--TM-primary)` |
| `bg-brand-primary` nos blocos de medição | 211 | → `background: var(--TM-primary)` |
| `border-l-4 border-brand-accent` na obs | 239 | → `border-left: 3px solid var(--TM-primary)` |
| Sem dark mode | — | Tokens respondem automaticamente |

**Ação:** Remover todas as `motion.div`. Substituir cores hardcoded por variáveis. Corrigir badges de status com classes `.badge-ok`, `.badge-warn`, etc. do DS TM. Scale do hover ≤ 1.03.

---

### 8 — `ImageEditorModal.tsx` 🟡 PARCIAL

> O modal usa Fabric.js para anotação em canvas. A lógica não será tocada.
> Somente a estrutura visual (shell) será refatorada.

| Violação | Área | Correção |
|---|---|---|
| `framer-motion` nas abas/painéis | a mapear | → CSS transitions |
| Cores hardcoded da UI shell | a mapear | → tokens TM |
| Cores da paleta do Fabric | NÃO TOCA | cores do Word (vermelho, roxo) são spec de negócio |

**Ação:** Auditar o shell do modal (fundo, header, painéis laterais) na execução. Não tocar em nada do Fabric.js canvas ou paleta de anotação.

---

## Ordem de Execução

```
FASE 1 — FOUNDATION (bloqueante para tudo)
  [ ] 1.1  globals.css         → tokens TM, remover violações
  [ ] 1.2  layout.tsx          → fontes, dark mode script

FASE 2 — CORE LAYOUT
  [ ] 2.1  page.tsx            → header, layout, dark toggle

FASE 3 — COMPONENTES SIMPLES
  [ ] 3.1  ConsoleWatcher.tsx  → terminal TM
  [ ] 3.2  ProgressOverlay.tsx → overlay de loading

FASE 4 — COMPONENTES COMPLEXOS
  [ ] 4.1  SidebarWizard.tsx   → sidebar + overlays (maior)
  [ ] 4.2  PreviewGrid.tsx     → grid de thumbnails

FASE 5 — MODAL (parcial)
  [ ] 5.1  ImageEditorModal.tsx → shell visual
  [ ] 5.2  AmbienteSelector.tsx → verificar e ajustar
```

---

## Critérios de Conclusão por Arquivo

Cada arquivo está "feito" quando:

- [ ] Zero imports de `framer-motion`
- [ ] Zero cores hexadecimais hardcoded fora dos tokens
- [ ] Zero `bg-slate-*`, `bg-brand-*`, `text-brand-*` como classes Tailwind
- [ ] Dark mode funciona sem flash
- [ ] Nenhum `border-radius > 12px` (exceto avatares)
- [ ] Nenhum `scale > 1.05` em hover
- [ ] Nenhum gradiente (exceto scroll-cue-line de 1px)
- [ ] `prefers-reduced-motion` honrado globalmente

---

## O Que NÃO Mudar

- Toda lógica de estado em `page.tsx` (useState, handlers)
- Todos os handlers de API (`handleScan`, `handleGenerate`, `handleDownload`)
- Toda lógica do Fabric.js em `ImageEditorModal.tsx`
- Os arquivos `data/ambientes-constants.ts` e `data/itens-maffeng.ts`
- A estrutura de props de todos os componentes (interfaces TypeScript)
- A lógica de `IntersectionObserver` de thumbnails no `PreviewGrid`
- O uptime timer do `ConsoleWatcher`
- A lógica de `fetchPlaceholders` e metadados dinâmicos

---

## Estimativa de Esforço

| Arquivo | Complexidade | Estimativa |
|---|---|---|
| globals.css | Alta | 1 sessão |
| layout.tsx | Baixa | 15 min |
| page.tsx | Média | 30 min |
| ConsoleWatcher.tsx | Baixa | 20 min |
| ProgressOverlay.tsx | Média | 30 min |
| SidebarWizard.tsx | Muito Alta | 2 sessões |
| PreviewGrid.tsx | Alta | 1 sessão |
| ImageEditorModal.tsx | Média | 1 sessão |
| **Total** | | **~5–6 sessões** |

---

## Como Executar

Para iniciar a execução deste plano, diga:

```
Execute a FASE 1 do plano de refatoração frontend
```

Ou arquivo específico:

```
Refatora o globals.css conforme o plano
```

O modelo deve:
1. Ler o arquivo original
2. Aplicar apenas as mudanças listadas na auditoria
3. Não tocar na lógica funcional
4. Verificar se o servidor Next dev compila sem erros após cada arquivo

---

*Plano gerado em: 2026-05-02 | Versão DS TM: v3*
