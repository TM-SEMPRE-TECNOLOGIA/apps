# 🗺️ MAPA VISUAL — Estrutura do HTML AutoRelatorio V4

Visualização rápida da arquitetura, componentes e fluxo.

---

## 📐 ESTRUTURA DE LAYOUT

```
┌─────────────────────────────────────────────────────────────────┐
│                           HEADER                                │
│    Logo / Título        Mode Toggle (Trad/IA)    Dark Toggle   │
└─────────────────────────────────────────────────────────────────┘
┌──────────────────┬──────────────────────────────────────────────┐
│                  │                                              │
│  WIZARD SIDEBAR  │         PHOTO GRID (Main Content)            │
│                  │                                              │
│  ① Projeto       │  ┌────────┐ ┌────────┐ ┌────────┐           │
│  ② Configur.     │  │        │ │        │ │        │           │
│  ③ Scanner       │  │ Foto 1 │ │ Foto 2 │ │ Foto 3 │ ...       │
│  ④ Review ✓      │  │        │ │        │ │        │           │
│  ⑤ Process       │  └────────┘ └────────┘ └────────┘           │
│  ⑥ Export        │  ┌────────┐ ┌────────┐ ┌────────┐           │
│                  │  │        │ │        │ │        │           │
│                  │  │ Foto 4 │ │ Foto 5 │ │ Foto 6 │ ...       │
│                  │  │        │ │        │ │        │           │
│                  │  └────────┘ └────────┘ └────────┘           │
│                  │                                              │
└──────────────────┴──────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                  CONSOLE (System Logs)                          │
│ 14:32:01 INFO FastAPI uvicorn iniciado                         │
│ 14:32:02 OK   Backend health-check OK                          │
│ 14:32:18 INFO Scanner Tradicional · varrendo...                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 ÁRVORE DE COMPONENTES

```
<App>
├── <Header>
│   ├── Mode Selector (Tradicional / IA)
│   └── Dark Mode Toggle
│
├── <div className="main">
│   ├── <WizardSidebar>
│   │   └── [6+ Step Buttons]
│   │       ├── Projeto (Step 1)
│   │       ├── Configuração (Step 2)
│   │       ├── Scanner (Step 3)
│   │       ├── Revisão & Edição (Step 4) ← ATUAL
│   │       ├── Processamento (Step 5)
│   │       └── Exportação (Step 6)
│   │
│   └── <PhotoGrid>
│       └── [8x PhotoCard]
│           ├── photo.preview (tone color)
│           ├── photo.name (IMG_2401.jpg)
│           ├── photo.edited (badge ✓)
│           └── onClick → setEditing(photo)
│
├── <Console>
│   └── [5+ Log Entries]
│       ├── timestamp (14:32:01)
│       ├── level (INFO, OK, ERROR, WARN)
│       └── message
│
└── {editing && <EditorModal>}
    ├── photo.preview (grande)
    ├── Editor Controls
    │   ├── Descritor (select)
    │   └── Notas (textarea)
    └── Actions
        ├── Cancelar
        └── Salvar Edições
```

---

## 🎨 PALETA DE CORES (Simplificada)

```
PRIMARY
  #C8541C ████ Laranja Construção (botões, ação)
  #A6451A ████ Laranja Hover
  #FBEDE3 ████ Laranja Superfície (light)

BACKGROUNDS
  #F5F4F1 ████ Papel Cinza-Quente (main bg)
  #FFFFFF ████ Branco (cards)
  #FAF9F6 ████ Cinza Suave (sidebar)
  #E8E5DE ████ Cinza Médio (secondary)

TEXT
  #1A1A1A ████ Primário (quase preto)
  #5C5A55 ████ Secundário (grafite)
  #8C8A85 ████ Terciário (cinza)

STATUS
  #4F7A3A ████ Verde Oliva (sucesso)
  #345878 ████ Azul Blueprint (info)
  #C8541C ████ Laranja (warning)
  #A33B2A ████ Tijolo Escuro (erro)

DARK MODE
  #161513 ████ BG Escuro
  #E47A4A ████ Laranja Claro
  #EFEDE8 ████ Texto Claro
```

---

## 📝 TIPOGRAFIA

```
DISPLAY (Grande)
┌─────────────────────────────────────────┐
│     Roboto Slab 600 · clamp()           │
│     "AutoRelatorio V4"                  │
└─────────────────────────────────────────┘

H1 (Título 1)
┌─────────────────────────────────────────┐
│  Roboto Slab 600 · 26px · #1A1A1A       │
│  Galeria de Imagens                     │
└─────────────────────────────────────────┘

H2 (Título 2)
┌─────────────────────────────────────────┐
│  Roboto Slab 500 · 19px · #1A1A1A       │
│  Revisão & Edição                       │
└─────────────────────────────────────────┘

H3 (Título 3)
┌─────────────────────────────────────────┐
│  Inter 600 · 15px · #1A1A1A             │
│  System Console                         │
└─────────────────────────────────────────┘

BODY (Padrão)
┌─────────────────────────────────────────┐
│  Inter 400 · 14px · #1A1A1A             │
│  Texto normal do aplicativo              │
└─────────────────────────────────────────┘

BODY MUTED (Secundário)
┌─────────────────────────────────────────┐
│  Inter 400 · 14px · #5C5A55             │
│  8 imagens · 3 editadas                  │
└─────────────────────────────────────────┘

MONO (Código/Técnico)
┌─────────────────────────────────────────┐
│  JetBrains Mono · 13px · #1A1A1A        │
│  IMG_2401.jpg                           │
└─────────────────────────────────────────┘

MONO LABEL (Pequeno Técnico)
┌─────────────────────────────────────────┐
│  JetBrains Mono · 11px · UPPERCASE      │
│  EDITADA                                │
└─────────────────────────────────────────┘
```

---

## 📦 DADOS SIMULADOS (Mock Data)

### Photos Array
```javascript
[
  {
    id: 0,
    name: "IMG_2401.jpg",
    tone: "#475569",      // cor para preview
    desc: 0,              // tipo A, B, C ou D
    edited: true          // ✓ ou ○
  },
  {
    id: 1,
    name: "IMG_2402.jpg",
    tone: "#334155",
    desc: 1,
    edited: true
  },
  // ... até ID 7
]

Total: 8 imagens
Editadas: 3 (IDs 0, 1, 2)
Pendentes: 5 (IDs 3-7)
```

### Logs Array
```javascript
[
  {
    t: "14:32:01",
    level: "INFO",
    msg: "FastAPI uvicorn iniciado em :5000"
  },
  {
    t: "14:32:02",
    level: "OK",
    msg: "Backend health-check OK"
  },
  {
    t: "14:32:18",
    level: "INFO",
    msg: "Scanner Tradicional · varrendo MAFFENG-Bloco-A/"
  },
  {
    t: "14:32:19",
    level: "OK",
    msg: "12 imagens reconhecidas, 4 já editadas"
  },
  {
    t: "14:33:04",
    level: "INFO",
    msg: "Aguardando edição do técnico..."
  }
]

Total: 5 logs
Níveis: INFO (3x), OK (2x)
```

---

## 🔄 FLUXO DE INTERAÇÃO

### 1. Inicialização
```
App monta
├── step = 4 (Review)
├── mode = 'trad' (Tradicional)
├── dark = false (Light mode)
└── photos carregadas (8 mocks)
```

### 2. Header Interaction
```
User clica em Mode Toggle
├── setMode('ia') ou setMode('trad')
└── Console atualiza com novo modo

User clica em Dark Toggle
├── setDark(!dark)
├── html.classList.toggle('dark')
└── Cores invertem para dark mode
```

### 3. Sidebar Interaction
```
User clica em Step X
├── setStep(X)
└── Visual atualiza (step ativo em destaque)
```

### 4. PhotoGrid Interaction
```
User clica em PhotoCard
├── onEdit(photo)
├── setEditing(photo)
└── EditorModal renderiza
```

### 5. EditorModal Interaction
```
User edita a foto
├── Modifica descritor
├── Adiciona notas
└── Clica "Salvar Edições"
    ├── updatePhoto(updatedPhoto)
    ├── photo.edited = true
    ├── badge ✓ aparece
    └── setEditing(null) fecha modal

User clica X ou fora do modal
├── setEditing(null)
└── Modal fecha
```

### 6. Console Logs
```
Auto-updated ao carregar
├── 5 linhas simuladas
├── Auto-scroll ao final
└── Novos logs podem ser adicionados via addLog()
```

---

## ⚙️ ESTADO REACT GLOBAL

```
const [step, setStep] = useState(4)
   ↓ valor padrão: 4 (Review & Edit)
   ↓ mudado por: WizardSidebar click

const [mode, setMode] = useState('trad')
   ↓ valor padrão: 'trad' (Tradicional)
   ↓ mudado por: Header Mode Selector
   ↓ opções: 'trad' | 'ia'

const [dark, setDark] = useState(false)
   ↓ valor padrão: false (Light mode)
   ↓ mudado por: Header Dark Toggle
   ↓ efeito: html.classList.toggle('dark')

const [editing, setEditing] = useState(null)
   ↓ valor padrão: null
   ↓ mudado por: PhotoCard click → setEditing(photo)
   ↓ mudado por: EditorModal close → setEditing(null)

const [photos] = useState(initialPhotos)
   ↓ valor padrão: 8 fotos mock
   ↓ estático (não muda neste exemplo)
   ↓ na prática: viria de API ou banco
```

---

## 📏 ESPAÇAMENTO (Spacing Scale)

```
--tm-space-1  =  4px    (micro, gaps)
--tm-space-2  =  8px    (pequeno, padding botões)
--tm-space-3  = 12px    (pequeno-médio)
--tm-space-4  = 16px    (médio, padrão)
--tm-space-5  = 24px    (médio-grande)
--tm-space-6  = 32px    (grande, seções)
--tm-space-7  = 48px    (muito grande)
--tm-space-8  = 64px    (huge, hero sections)
```

---

## 🔘 RAIOS (Border Radius)

```
--tm-radius-sm  = 4px    (chips, badges pequenos)
--tm-radius-md  = 6px    (buttons, inputs)
--tm-radius-lg  = 8px    (cards padrão)
--tm-radius-xl  = 12px   (hero cards, modals)

Estilo: SÓBRIO (não playful)
Usado em: divs, buttons, inputs, cards, badges
```

---

## 🌑 ANIMAÇÕES

```
@keyframes tmPulse
  from: opacity 1
  50%:  opacity 0.4
  to:   opacity 1
  uso:  loading, indeterminate states

@keyframes tmBlink
  50%:  opacity 0
  uso:  cursores, status vivos

@keyframes tmFadeUp
  from: opacity 0; transform: translateY(8px)
  to:   opacity 1; transform: none
  uso:  entrada de elementos, modals
```

---

## ✨ DARK MODE PREVIEW

```
LIGHT MODE                    DARK MODE
──────────────────────────────────────────────
#F5F4F1  ████ Background      #161513  ████
#FFFFFF  ████ Cards           #1F1E1B  ████
#1A1A1A  ████ Text            #EFEDE8  ████
#C8541C  ████ Primary         #E47A4A  ████

html.dark ativa automaticamente
document.documentElement.classList.toggle('dark')
```

---

## 📊 COMPONENTE DETALHADO: PhotoCard

```
PhotoCard
├── <button className="photo-card">
│   ├── <div className="photo-preview">
│   │   ├── background: tone (cor)
│   │   └── {photo.edited && <div>✓</div>}
│   │
│   └── <div className="photo-info">
│       ├── <p className="photo-name">IMG_2401.jpg</p>
│       └── <p className="photo-status">EDITADA/PENDENTE</p>
│
└── onClick → onEdit(photo)

Dimensões (sugeridas):
  Width: minmax(160px, 1fr)
  Aspect-ratio: 1 / 1
  Gap entre: 16px (--tm-space-4)

Estados:
  default: foto + nome + status
  hover: elevado (shadow), Y-translate -4px
  editing: destaque visual (border focus)
  focus: outline 2px solid #C8541C
```

---

## 🎬 FLUXO MODAL

```
ANTES (editing = null)
├── EditorModal não renderiza
└── PhotoGrid visível

CLIQUE EM FOTO
├── onClick → onEdit(photo)
├── setEditing(photo)
└── Re-render

DEPOIS (editing = photo)
├── EditorModal renderiza
├── Overlay bloqueia background
├── Modal desliza (slideUp animation)
└── FotosGrid parcialmente hidden atrás do overlay

SALVAR
├── onSave(updatedPhoto)
├── updatePhoto(updatedPhoto)
├── setEditing(null)
└── Modal fecha (slideDown)

CANCELAR / FECHAR
├── onClose()
├── setEditing(null)
└── Modal desaparece
```

---

## 📱 RESPONSIVIDADE (Esperada)

```
Desktop (1200px+)
├── Sidebar: 220px (fixo)
├── Grid: 4 colunas
├── Header: altura normal
└── Console: altura normal

Tablet (768px - 1199px)
├── Sidebar: colapsível?
├── Grid: 2-3 colunas
├── Header: altura reduzida?
└── Console: altura reduzida?

Mobile (< 768px)
├── Sidebar: menu hambúrguer?
├── Grid: 1 coluna
├── Header: compacto
├── Console: oculto ou abas?
└── Modal: fullscreen
```

*Nota: O HTML não especifica breakpoints. Validar com V4 atual.*

---

## 🔗 CONEXÕES ENTRE COMPONENTES

```
App
 ├─ Header (modo, dark) ──→ Console (lê modo para logs)
 ├─ WizardSidebar ────────→ (visual feedback)
 ├─ PhotoGrid ───────────→ EditorModal (foto selecionada)
 ├─ Console ─────────────→ (read-only, mostra status)
 └─ Dark Mode ───────────→ Todos (aplica tema)

State Sharing
├── step    : Header ← WizardSidebar
├── mode    : Header ← Console
├── dark    : Header ← Todos (via CSS)
├── editing : PhotoGrid ← EditorModal
└── photos  : PhotoGrid ← EditorModal
```

---

## 🎯 RESUMO EM 3 FRASES

1. **Layout:** Header + Sidebar esquerdo + Grid central + Console rodapé
2. **Componentes:** 5 principais (Header, Sidebar, Grid, Console, Modal)
3. **Estado:** 4 estados React principais (step, mode, dark, editing)

---

**Fim do Mapa Visual** 📍

