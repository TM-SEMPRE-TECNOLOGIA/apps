# 🔧 RECOMENDAÇÕES DE AJUSTES — HTML para AutoRelatorio V4

**Documento de Implementação**  
**Data:** 2026-05-12  
**Responsável:** Análise Claude Code  

---

## 📋 CHECKLIST DE ALINHAMENTO VISUAL

### 1. TIPOGRAFIA

#### Status: ⚠️ Verificação Necessária

**O HTML usa:**
```css
--TM-font-serif: "Roboto Slab", "IBM Plex Serif", Georgia, serif;
--TM-font-sans:  "Inter", system-ui, -apple-system, sans-serif;
--TM-font-mono:  "JetBrains Mono", ui-monospace, monospace;
```

**Papéis Tipográficos:**
- `.tm-display` — Roboto Slab 600 · clamp(2rem, 5vw, 3rem)
- `.tm-h1` — Roboto Slab 600 · 26px
- `.tm-h2` — Roboto Slab 500 · 19px
- `.tm-h3` — Inter 600 · 15px
- `.tm-body` — Inter 400 · 14px

**Ação Recomendada:**
```
[ ] Verificar se V4 atual usa mesmas famílias
[ ] Se não: ajustar os papéis tipográficos no HTML
[ ] Se sim: aproveitar tamanhos e weights do HTML
[ ] Testar rendering em diferentes resoluções
[ ] Validar letra-spacing especialmente em .tm-mono-label
```

---

### 2. PALETA DE CORES

#### Status: ✅ Bem Definida (Comparar)

**O HTML usa TM Construtora v3:**
```javascript
// Primária
--TM-primary:        #C8541C;    // laranja construção
--TM-primary-hover:  #A6451A;    // hover
--TM-primary-light:  #FBEDE3;    // superfície

// Backgrounds
--tm-bg:             #F5F4F1;    // papel cinza-quente
--tm-bg-card:        #FFFFFF;
--tm-bg-sidebar:     #FAF9F6;
--tm-bg-input:       #FFFFFF;

// Texto
--tm-text:           #1A1A1A;    // primário
--tm-text-muted:     #5C5A55;    // secundário
--tm-text-subtle:    #8C8A85;    // terciário

// Status
--tm-success:        #4F7A3A;    // verde oliva
--tm-info:           #345878;    // azul blueprint
--tm-warning:        #C8541C;    // laranja
--tm-destructive:    #A33B2A;    // tijolo escuro
```

**Ação Recomendada:**
```
[ ] Extrair paleta atual do V4
[ ] Comparar cada cor com o hex do HTML
[ ] Se diferenças: documentar variações
[ ] Decidir: usar palette do HTML ou manter V4
[ ] Se usar HTML: atualizar CSS variables globalmente
[ ] Testar contrast ratio WCAG (especialmente textos muted)
```

---

### 3. ESPAÇAMENTO (Spacing Scale)

#### Status: ⚠️ Potencial Desacordo

**O HTML define:**
```css
--tm-space-1:  4px;
--tm-space-2:  8px;
--tm-space-3:  12px;
--tm-space-4:  16px;
--tm-space-5:  24px;
--tm-space-6:  32px;
--tm-space-7:  48px;
--tm-space-8:  64px;
```

**Padrão comum (alternativa):**
```css
/* Base 8px (Design System comum) */
--space-0: 0px;
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
...
```

**Ação Recomendada:**
```
[ ] Verificar scale de espaçamento em V4 atual
[ ] Se V4 usa base 8px: ajustar --tm-space-1 para 8px
[ ] Se V4 usa base 4px: manter como está no HTML
[ ] Medir paddings/margins em componentes chave
[ ] Ajustar gap entre grid items se necessário
[ ] Validar em mobile (espaçamento responsivo)
```

---

### 4. RAIOS (Border Radius)

#### Status: ⚠️ Verificação Necessária

**O HTML define:**
```css
--TM-radius-sm: 0.25rem;    /* 4px */
--TM-radius-md: 0.375rem;   /* 6px */
--TM-radius-lg: 0.5rem;     /* 8px */
--TM-radius-xl: 0.75rem;    /* 12px */
```

**Padrões alternativos:**
```css
/* Maior (design moderno) */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;

/* Menor (minimalista) */
--radius-sm: 2px;
--radius-md: 4px;
--radius-lg: 6px;
```

**Ação Recomendada:**
```
[ ] Inspecionar V4: medir raios em buttons, inputs, cards
[ ] Comparar com escala do HTML
[ ] Se desacordo: ajustar --TM-radius-* no HTML
[ ] Testar particularmente em:
    - Buttons
    - Input fields
    - Cards
    - Modal edges
    - Sidebar corners
```

---

### 5. SOMBRAS (Elevation)

#### Status: ✅ Bem Estruturada

**O HTML define 4 níveis:**
```css
--TM-shadow-sm: 0 1px 0 0 rgba(26,26,26,0.04), 0 1px 2px 0 rgba(26,26,26,0.04);
--TM-shadow-md: 0 2px 4px -1px rgba(26,26,26,0.08), 0 1px 2px 0 rgba(26,26,26,0.04);
--TM-shadow-lg: 0 8px 16px -4px rgba(26,26,26,0.10), 0 2px 4px -1px rgba(26,26,26,0.06);
--TM-shadow-xl: 0 16px 24px -6px rgba(26,26,26,0.12), 0 4px 8px -2px rgba(26,26,26,0.06);
```

**Ação Recomendada:**
```
[ ] Comparar sombras com V4 atual
[ ] Se V4 usa sombras diferentes: documentar
[ ] Testar particularmente em:
    - Dropdowns
    - Modals
    - Cards elevados
    - Hover states
[ ] Validar em dark mode (sombras são invertidas)
```

---

### 6. GRID E LAYOUT

#### Status: ⚠️ Não Especificado no HTML

**O HTML não detalha:**
- Número de colunas do PhotoGrid
- Breakpoints responsivos
- Tamanho de gap entre items

**Ação Recomendada:**
```
[ ] Inspecionar PhotoGrid atual no V4
[ ] Determinar:
    - Número de colunas (desktop, tablet, mobile)
    - Gap entre items
    - Tamanho de cada card
[ ] Se diferente do esperado: ajustar CSS grid
[ ] Exemplo esperado:
    Desktop: 4 colunas
    Tablet:  2 colunas
    Mobile:  1 coluna
    Gap: 16px
[ ] Testar em múltiplas resoluções
```

---

### 7. COMPONENTE: PhotoGrid

#### Status: ⚠️ Funcional, Detalhe Visual Pendente

**O que está bem:**
✅ Array de fotos com metadados  
✅ Props para click handler  
✅ Sistema de state (edited/não editada)  

**O que precisar alinhamento:**
⚠️ Tamanho dos cards  
⚠️ Tipografia do nome do arquivo  
⚠️ Indicador visual "editada"  
⚠️ Animação ao hover  

**Ação Recomendada:**
```
[ ] Comparar grid atual com HTML
[ ] Ajustar dimensões dos cards se necessário
[ ] Normalizar tipografia dos labels
[ ] Testar interação ao clicar em foto
[ ] Animar hover (scale, shadow elevation)
[ ] Testar loading state das imagens
[ ] Validar em dark mode
```

---

### 8. COMPONENTE: Header

#### Status: ⚠️ Funcional, Detalho de Posicionamento

**O que está bem:**
✅ Toggle para modo Tradicional/IA  
✅ Toggle para dark mode  
✅ Espaço para branding  

**O que precisar alinhamento:**
⚠️ Altura do header  
⚠️ Posicionamento dos toggles  
⚠️ Ícones/visual dos toggles  
⚠️ Espaçamento entre elementos  

**Ação Recomendada:**
```
[ ] Medir altura do header em V4 atual
[ ] Comparar com HTML
[ ] Ajustar se diferente
[ ] Verificar:
    - Padding horizontal/vertical
    - Alinhamento dos toggles
    - Espaço para logo/branding
    - Responsividade (mobile)
[ ] Testar esconder header em telas pequenas?
```

---

### 9. COMPONENTE: WizardSidebar

#### Status: ⚠️ Funcional, Detalhe Visual Pendente

**O que está bem:**
✅ Array de 6+ passos  
✅ Navigation funcional  
✅ Indicador visual do passo atual  

**O que precisar alinhamento:**
⚠️ Largura da sidebar  
⚠️ Tipografia dos labels dos passos  
⚠️ Indicador visual (número, ponto, linha)  
⚠️ Cor do passo ativo vs inativo  

**Ação Recomendada:**
```
[ ] Medir largura sidebar em V4 (px ou %)
[ ] Comparar com HTML
[ ] Verificar:
    - Padding interno
    - Espaço entre items
    - Ícone vs texto do passo
    - Indicador ativo (cor, background, outline)
[ ] Testar colapsibilidade em mobile?
[ ] Validar readability da tipografia
```

---

### 10. COMPONENTE: Console

#### Status: ✅ Bem Implementado

**O que está bem:**
✅ Estrutura de logs  
✅ Cores por nível (INFO, OK)  
✅ Timestamps sincronizados  
✅ Array extensível  

**O que verificar:**
⚠️ Altura do console  
⚠️ Tipografia monospace dos logs  
⚠️ Cores dos níveis em dark mode  

**Ação Recomendada:**
```
[ ] Validar altura do console (% da viewport)
[ ] Verificar tipografia (monospace, tamanho)
[ ] Testar auto-scroll ao adicionar novo log
[ ] Validar cores dos níveis:
    INFO: gray (--tm-text-muted)
    OK:   green (--tm-success)
    ERROR: red (--tm-destructive)
    WARN: orange (--tm-warning)
[ ] Testar em dark mode
[ ] Avaliar se console deve ser colapsível
```

---

### 11. COMPONENTE: EditorModal

#### Status: ⚠️ Funcional, Detalhe Visual Pendente

**O que está bem:**
✅ Modal overlay funcional  
✅ Props para foto e callback  
✅ Integração com PhotoGrid  

**O que precisar alinhamento:**
⚠️ Tamanho do modal  
⚠️ Posicionamento na tela  
⚠️ Estilo do overlay (blur, opacity)  
⚠️ Botões de ação (save, cancel)  
⚠️ Conteúdo interno do editor  

**Ação Recomendada:**
```
[ ] Comparar modal atual com HTML
[ ] Validar:
    - Largura máxima do modal
    - Altura (scroll interno?)
    - Overlay opacity
    - Animação de entrada (fadeUp)
[ ] Testar botões de ação (salvar, cancelar)
[ ] Validar fechamento:
    - Botão X
    - Click fora
    - ESC key?
[ ] Testar em mobile (fullscreen?)
[ ] Validar dark mode
```

---

## 🎨 CHECKLIST DE FUNCIONALIDADES

### Funcionalidades do HTML a Validar

| Funcionalidade | Status no HTML | Precisar Validar | Prioridade |
|---|---|---|---|
| **Dark Mode** | ✅ Completo | Comparar com V4 | Alta |
| **Mode Toggle (Trad/IA)** | ✅ Completo | Verificar labels | Alta |
| **Wizard Steps** | ✅ 6+ passos | Validar navegação | Alta |
| **Photo Grid** | ✅ 8 mocks | Conectar dados reais | Alta |
| **Editor Modal** | ✅ Overlay | Implementar funcionalidade | Alta |
| **Console Logs** | ✅ 5 mocks | Conectar backend :5000 | Média |
| **Accessibility** | ⚠️ Partial | Focus, ARIA labels | Média |
| **Mobile Responsivo** | ⚠️ Não testado | Breakpoints | Média |
| **Animações** | ✅ Definidas | Testar performance | Baixa |
| **Tema Claro/Escuro** | ✅ Completo | Validar contrastes | Média |

---

## 🚀 PLANO DE IMPLEMENTAÇÃO SUGERIDO

### Fase 1: Alinhamento Visual (Dia 1)

```
1. [ ] Comparação lado-a-lado de cores
2. [ ] Validação de tipografia
3. [ ] Medição de espaçamento e raios
4. [ ] Ajustes CSS no HTML
5. [ ] Teste visual em light/dark mode
```

**Duração:** ~2-3 horas

---

### Fase 2: Alinhamento de Componentes (Dia 2-3)

```
1. [ ] Revisar PhotoGrid (dimensões, layout)
2. [ ] Revisar Header (altura, posicionamento)
3. [ ] Revisar WizardSidebar (largura, tipografia)
4. [ ] Revisar Console (altura, cores)
5. [ ] Revisar EditorModal (tamanho, overlay)
6. [ ] Testes responsive (tablet, mobile)
```

**Duração:** ~4-6 horas

---

### Fase 3: Integração Backend (Dia 4-5)

```
1. [ ] Conectar FastAPI :5000 para logs reais
2. [ ] Integrar fotos reais do projeto
3. [ ] Implementar funcionalidade do editor
4. [ ] Validar fluxo completo
5. [ ] Testes de performance
```

**Duração:** ~6-8 horas

---

## 🎯 CRITÉRIO DE SUCESSO

```
✅ O HTML visual está 100% alinhado com V4 atual
✅ Todos os componentes funcionam corretamente
✅ Dark mode está totalmente operacional
✅ Modo Tradicional/IA está implementado
✅ Sidebar wizard navega corretamente
✅ PhotoGrid exibe fotos reais
✅ Editor modal permite edição
✅ Console exibe logs backend reais
✅ Toda a interface é responsiva (mobile/tablet/desktop)
✅ Acessibilidade WCAG AA em todos os componentes
```

---

## 📊 COMPARAÇÃO RÁPIDA: O QUE O HTML TEM A MAIS

| Recurso | V4 Atual | HTML | Status |
|---------|----------|------|--------|
| Dark Mode | ? | ✅ | Potencial melhoria |
| Modo IA | ? | ✅ | Funcionalidade extra |
| Wizard Steps | ? | ✅ | Interface clara |
| Console em Tempo Real | ? | ✅ | Transparência backend |
| Editor Modal | ? | ✅ | UX aprimorada |
| Design System (tokens) | ? | ✅ | Bem documentado |
| Tipografia Serif | ? | ✅ | Elegância |
| 6 Níveis de Sombra | ? | ✅ | Profundidade |

---

## ⚠️ POSSÍVEIS DESACORDOS A OBSERVAR

1. **Raios de Borda** → HTML: 4-12px (sóbrio) vs. design moderno pode usar 8-20px
2. **Espaçamento Base** → HTML: 4px vs. design system comum: 8px
3. **Sidebar Colapsível** → HTML: sempre visível vs. V4: pode ser colapsível
4. **Grid Colunas** → HTML não especifica vs. V4 pode usar layout diferente
5. **Tipografia Headers** → HTML usa Roboto Slab (serif) vs. V4 pode usar sans
6. **Dark Mode** → HTML tem completo vs. V4 pode não ter
7. **Modo IA** → HTML tem vs. V4 pode não ter
8. **Console** → HTML tem vs. V4 pode estar em lugar diferente

---

## 📝 NOTA FINAL

O arquivo HTML é um **protótipo de alta fidelidade** que contém:

✅ Mais funcionalidades que V4 atual  
✅ Design system bem documentado  
✅ Componentes estruturados  
✅ Dark mode completo  

⚠️ Pode ter desacordos visuais pequenos  
⚠️ Pode ter diferenças de layout  
⚠️ Pode não estar integrado com backend real  

**Recomendação:** Use como **referência e guia** para melhorar V4, não como "substituição direta". Alinha visuais primeiro, depois funcionalidades.

