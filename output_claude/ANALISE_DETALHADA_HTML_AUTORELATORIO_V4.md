# 📊 ANÁLISE DETALHADA — AutoRelatorio V4 HTML Prototype

**Arquivo:** `AutoRelatorio V4 - TM Sempre Tecnologia (desenvolver e aplicar).html`  
**Tipo:** Aplicação React bundled (minificada + assets embutidos)  
**Tamanho:** 1.8 MB (bundle completo com fontes)  
**Título Oficial:** AutoRelatorio V2 — UI Kit  
**Linguagem:** Português (pt-BR)  

---

## 🎯 OBJETIVO DO ARQUIVO

Este arquivo é um **wireframe interativo** e **simulação de UI Kit** construído em React que demonstra o fluxo de trabalho completo do AutoRelatorio V4. Funciona como um **protótipo clicável** que combina:

- Layout responsivo e componentes estruturados
- Sistema de design consistente (TM Construtora)
- Fluxo de edição de imagens com assistente
- Console de logs em tempo real
- Editor modal para fotos

---

## 🏗️ ARQUITETURA TÉCNICA

### Stack Tecnológico

| Aspecto | Detalhe |
|--------|---------|
| **Framework** | React (JSX) |
| **Bundler** | Sistema customizado (bundler próprio) |
| **Tipografia** | Inter, JetBrains Mono, Roboto Slab |
| **Modo Dark** | Suportado (toggle via `html.dark`) |
| **Estado** | React Hooks (useState, useEffect) |
| **Renderização** | ReactDOM.createRoot |

### Componentes React Principais

| Componente | Função | Status Implementação |
|-----------|--------|---------------------|
| `<Header />` | Controle de modo (tradicional/IA), toggle dark mode | ✅ Completo |
| `<WizardSidebar />` | Navegação por passos do fluxo (1-6+) | ✅ Completo |
| `<PhotoGrid />` | Galeria de imagens com previews | ✅ Completo |
| `<Console />` | Log em tempo real de operações | ✅ Completo |
| `<EditorModal />` | Editor modal para fotos selecionadas | ✅ Completo |

---

## 🎨 SISTEMA DE DESIGN (TM Construtora v3)

### Identidade Visual

```
Marca: TM Sempre Tecnologia
Segmento: Engenharia Civil Sóbria
Pivô: Construção profissional
```

### Paleta de Cores

#### Cores Primárias

| Variável | Hex | Descrição | Uso |
|----------|-----|-----------|-----|
| `--TM-primary` | #C8541C | Laranja construção | Botões, destaques, ações |
| `--TM-primary-hover` | #A6451A | Laranja mais escuro | Estados hover/active |
| `--TM-primary-light` | #FBEDE3 | Laranja muito suave | Superfícies, backgrounds |

#### Cores de Superfície (Light Mode)

| Variável | Hex | Uso |
|----------|-----|-----|
| `--tm-bg` | #F5F4F1 | Fundo geral (papel cinza-quente) |
| `--tm-bg-card` | #FFFFFF | Cards e containers |
| `--tm-bg-sidebar` | #FAF9F6 | Sidebar |
| `--tm-bg-secondary` | #E8E5DE | Áreas secundárias (concreto) |
| `--tm-bg-accent` | #FBEDE3 | Destaques suaves |
| `--tm-bg-input` | #FFFFFF | Inputs, textareas |

#### Cores de Texto

| Variável | Hex | Nível |
|----------|-----|-------|
| `--tm-text` | #1A1A1A | Primário (quase preto) |
| `--tm-text-muted` | #5C5A55 | Secundário (grafite) |
| `--tm-text-subtle` | #8C8A85 | Terciário (cinza médio) |

#### Cores de Status

| Status | Cor | Hex |
|--------|-----|-----|
| Sucesso | Verde oliva | #4F7A3A |
| Info | Azul blueprint | #345878 |
| Aviso | Laranja construção | #C8541C |
| Destrutivo | Tijolo escuro | #A33B2A |

#### Ramp de Gráficos (Terra/Cinza)

```
--TM-chart-1: #C8541C  (primária)
--TM-chart-2: #8C5A2E  (terra)
--TM-chart-3: #5C5A55  (grafite)
--TM-chart-4: #345878  (blueprint)
--TM-chart-5: #2B2B2B  (preto técnico)
```

### Tipografia

#### Famílias

| Família | Uso | Pesos |
|---------|-----|-------|
| **Roboto Slab** | Display/Títulos | 400, 500, 600, 700 |
| **Inter** | UI/Body | 400, 500, 600, 700 |
| **JetBrains Mono** | Técnico/Código | 400, 500, 600 |

#### Papéis Tipográficos

```css
.tm-display    → Roboto Slab 600 · clamp(2rem, 5vw, 3rem) · line-height 1.1
.tm-h1         → Roboto Slab 600 · 26px · line-height 1.25
.tm-h2         → Roboto Slab 500 · 19px · line-height 1.35
.tm-h3         → Inter 600 · 15px · line-height 1.4
.tm-body       → Inter 400 · 14px · line-height 1.6
.tm-body-muted → Inter 400 · 14px · line-height 1.6 (cor muted)
.tm-small      → Inter · 12px (muted)
.tm-mono       → JetBrains Mono · 13px
.tm-mono-label → JetBrains Mono 500 · 11px · uppercase · letter-spacing 0.12em
```

### Espaçamento e Raios

#### Escala de Espaço

```
--tm-space-1: 4px
--tm-space-2: 8px
--tm-space-3: 12px
--tm-space-4: 16px
--tm-space-5: 24px
--tm-space-6: 32px
--tm-space-7: 48px
--tm-space-8: 64px
```

#### Raios de Borda

```
--TM-radius-sm: 4px   (chips, pequenos componentes)
--TM-radius-md: 6px   (buttons, inputs)
--TM-radius-lg: 8px   (cards padrão)
--TM-radius-xl: 12px  (hero cards)
```

#### Sombras (Papel - discretas)

```
--TM-shadow-sm: 0 1px 0 0 rgba(26,26,26,0.04), 0 1px 2px 0 rgba(26,26,26,0.04)
--TM-shadow-md: 0 2px 4px -1px rgba(26,26,26,0.08), 0 1px 2px 0 rgba(26,26,26,0.04)
--TM-shadow-lg: 0 8px 16px -4px rgba(26,26,26,0.10), 0 2px 4px -1px rgba(26,26,26,0.06)
--TM-shadow-xl: 0 16px 24px -6px rgba(26,26,26,0.12), 0 4px 8px -2px rgba(26,26,26,0.06)
```

### Dark Mode

```html
<!-- Ativado com: html.dark -->
```

Cores invertidas (brand: laranja mais claro em fundo escuro, textos claros):
- Primary: #E47A4A
- BG: #161513 (cinza muito escuro)
- Cards: #1F1E1B
- Text: #EFEDE8 (bege claro)

---

## 🖼️ COMPONENTES E FUNCIONALIDADES

### 1. Header (Cabeçalho Principal)

**Localização:** Topo da aplicação  
**Props recebidas:**
- `mode` — 'trad' (tradicional) ou 'ia'
- `setMode` — função para mudar modo
- `dark` — boolean para dark mode
- `setDark` — função toggle dark mode

**Funcionalidades:**
- Toggle entre "Scanner Tradicional" e "Scanner IA"
- Toggle Dark Mode on/off
- Branding TM Sempre Tecnologia

**Estados Visuais:**
- Modo Tradicional (padrão)
- Modo IA (experimental)

---

### 2. WizardSidebar (Navegação por Passos)

**Localização:** Esquerda da tela principal  
**Props recebidas:**
- `step` — número do passo atual (1-6+)
- `onStep` — função para mudar passo

**Passos Implementados:**

| Step | Descrição | Status |
|------|-----------|--------|
| 1 | Seleção de Projeto | ✅ |
| 2 | Configuração | ✅ |
| 3 | Scanner | ✅ |
| 4 | **Revisão & Edição** (ATUAL) | ✅ |
| 5 | Processamento | ✅ |
| 6+ | Exportação | ✅ |

**Funcionalidades:**
- Navegação entre passos
- Indicador visual do passo atual
- Clicável para pular entre passos

---

### 3. PhotoGrid (Galeria de Imagens)

**Localização:** Área central (main content)  
**Props recebidas:**
- `photos` — array de objetos foto
- `onEdit` — callback ao clicar em foto

**Estrutura de Dados das Fotos:**

```javascript
{
  id: number,                    // ID único 0-7
  name: string,                  // "IMG_2401.jpg", "IMG_2402.jpg", etc.
  tone: string,                  // cor hex para sombra visual #475569, etc.
  desc: number,                  // índice descritor (0-3)
  edited: boolean                // true se já foi editada
}
```

**Dados de Exemplo (8 fotos):**

```javascript
const initialPhotos = [
  { id: 0, name: 'IMG_2401.jpg', tone: '#475569', desc: 0, edited: true },
  { id: 1, name: 'IMG_2402.jpg', tone: '#334155', desc: 1, edited: true },
  { id: 2, name: 'IMG_2403.jpg', tone: '#1e3a5f', desc: 2, edited: true },
  { id: 3, name: 'IMG_2404.jpg', tone: '#0f3a3a', desc: 3, edited: false },
  { id: 4, name: 'IMG_2405.jpg', tone: '#3a3a1e', desc: 0, edited: false },
  { id: 5, name: 'IMG_2406.jpg', tone: '#2d3748', desc: 1, edited: false },
  { id: 6, name: 'IMG_2407.jpg', tone: '#475569', desc: 2, edited: false },
  { id: 7, name: 'IMG_2408.jpg', tone: '#1e3a5f', desc: 3, edited: false },
];
```

**Funcionalidades:**
- Preview visual (cor tone como sombra/hint visual)
- Distinção visual entre fotos editadas e não-editadas
- Click para abrir editor modal
- Exibição de nome da arquivo
- Grid responsivo (provavelmente 2-4 colunas)

**Interações:**
- Clique em foto → Abre EditorModal
- `onEdit(photo)` → Passa a foto para o state `editing`

---

### 4. Console (Log de Operações)

**Localização:** Rodapé da tela  
**Props recebidas:**
- `logs` — array de objetos log

**Estrutura do Log:**

```javascript
{
  t: string,        // timestamp "HH:MM:SS"
  level: string,    // "INFO", "OK", "ERROR", "WARN"
  msg: string       // mensagem de log
}
```

**Logs Iniciais (Simulação):**

```javascript
const initialLogs = [
  { t: '14:32:01', level: 'INFO', msg: 'FastAPI uvicorn iniciado em :5000' },
  { t: '14:32:02', level: 'OK',   msg: 'Backend health-check OK' },
  { t: '14:32:18', level: 'INFO', msg: 'Scanner Tradicional · varrendo MAFFENG-Bloco-A/' },
  { t: '14:32:19', level: 'OK',   msg: '12 imagens reconhecidas, 4 já editadas' },
  { t: '14:33:04', level: 'INFO', msg: 'Aguardando edição do técnico...' },
];
```

**Funcionalidades:**
- Exibição de logs em tempo real
- Cores por nível (INFO, OK, ERROR, WARN)
- Timestamps sincronizados
- Auto-scroll (provavelmente)

**Níveis Implementados:**
- `INFO` — informações gerais
- `OK` — sucesso/confirmação
- Implícitos: `ERROR`, `WARN`

---

### 5. EditorModal (Editor de Fotos)

**Localização:** Overlay modal  
**Props recebidas:**
- `photo` — objeto da foto selecionada
- `onClose` — callback ao fechar

**Funcionalidades:**
- Edição de foto selecionada
- Visualização em detalhe
- Modal overlay (bloqueia background)
- Botão close (`onClose()`)

**Fluxo:**
1. Usuário clica em foto na grade → `setEditing(photo)`
2. EditorModal renderiza com `{editing && <window.EditorModal ... />}`
3. Usuário fecha modal → `setEditing(null)` desativa modal

---

## 🔄 FLUXO DE INTERAÇÃO COMPLETO

### Fluxo Principal do Usuário

```
1. INICIALIZAÇÃO
   ├─ App monta com step=4 (passo Revisão & Edição)
   ├─ App monta com mode='trad' (Scanner Tradicional)
   ├─ App monta com dark=false (light mode)
   └─ photos carregadas: 8 imagens mock

2. HEADER (Topo)
   ├─ [Selector] Scanner Tradicional / Scanner IA
   └─ [Toggle] Dark Mode ON/OFF

3. NAVEGAÇÃO (Sidebar)
   ├─ Step 1: Seleção de Projeto
   ├─ Step 2: Configuração
   ├─ Step 3: Scanner
   ├─ Step 4: ⟵ VOCÊ ESTÁ AQUI (Revisão & Edição)
   ├─ Step 5: Processamento
   └─ Step 6+: Exportação

4. GALERIA (Main)
   ├─ 8 imagens em grid
   ├─ Cada uma com:
   │  ├─ Preview visual (cor tone)
   │  ├─ Nome arquivo (IMG_XXXX.jpg)
   │  ├─ Status: ✓ Editada ou ○ Não editada
   │  └─ Click para editar

5. CONSOLE (Rodapé)
   ├─ 14:32:01 INFO FastAPI uvicorn iniciado em :5000
   ├─ 14:32:02 OK   Backend health-check OK
   ├─ 14:32:18 INFO Scanner Tradicional · varrendo MAFFENG-Bloco-A/
   ├─ 14:32:19 OK   12 imagens reconhecidas, 4 já editadas
   └─ 14:33:04 INFO Aguardando edição do técnico...

6. MODAL EDITOR (Click em foto)
   ├─ Abre overlay modal
   ├─ Mostra editor para a foto selecionada
   └─ Close: volta à galeria
```

### Estado React Global

```javascript
const [step, setStep] = useState(4);
const [mode, setMode] = useState('trad');
const [dark, setDark] = useState(false);
const [editing, setEditing] = useState(null);
const [photos] = useState(initialPhotos);
```

---

## 🎬 ANIMAÇÕES E TRANSIÇÕES

### Keyframes Definidas

```css
@keyframes tmPulse
  → Efeito pulse (opacity 1 → 0.4 → 1)
  → Uso: loading, estado indeterminado

@keyframes tmBlink
  → Efeito blink (opacity 0 → 1)
  → Uso: cursores, status vivos

@keyframes tmFadeUp
  → Fade + TranslateY(8px)
  → Uso: entrada de elementos, modais
```

### Redução de Motion

```css
@media (prefers-reduced-motion: reduce) {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

Respeita preferência de usuário para redução de movimento.

---

## 📱 LAYOUT E RESPONSIVIDADE

### Estrutura Base

```html
<div className="app">
  ├─ <Header />
  ├─ <div className="main">
  │  ├─ <WizardSidebar />
  │  └─ <PhotoGrid />
  ├─ <Console />
  └─ {editing && <EditorModal />}
</div>
```

### CSS Estrutural

```css
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main {
  display: flex;
  flex: 1;
  min-height: 0;  /* importante para overflow em flex */
}
```

**Observação:** Layout flexível, coluna principal, sidebar esquerda.

---

## 🔌 DEPENDÊNCIAS E RECURSOS EXTERNOS

### Bibliotecas JavaScript Bundled

1. React (instalado no bundle)
2. ReactDOM (instalado no bundle)
3. Babel (transpilação JSX)

### Fontes Web (Embutidas)

- **Inter** (4, 5, 6, 7) — UI sans-serif
- **JetBrains Mono** (4, 5, 6) — Código/técnico
- **Roboto Slab** (4, 5, 6, 7) — Display/titulos

Todas as fontes estão **embutidas no arquivo** (não carregadas de CDN).

---

## 📊 DADOS E ESTRUTURA DE INFORMAÇÕES

### Simulação de Projeto

| Campo | Valor |
|-------|-------|
| **Projeto** | (não especificado no init) |
| **Localização** | MAFFENG-Bloco-A/ |
| **Tipo de Scan** | Tradicional (Scanner Tradicional) |
| **Total de Imagens** | 12 |
| **Já Editadas** | 4 |
| **Modo** | Revisão & Edição (Step 4) |

### Informações de Log

```
Backend: FastAPI uvicorn :5000
Health: OK
Scanner: Tradicional
Status: Aguardando edição do técnico
```

---

## ✨ FUNCIONALIDADES AVANÇADAS/EXTRAS

### 1. Dark Mode Completo

```javascript
useEffect(() => {
  document.documentElement.classList.toggle('dark', dark);
}, [dark]);
```

- Toggle via header
- Cores invertidas para dark
- Persistência via className HTML

### 2. Modo Dual (Tradicional vs IA)

```javascript
const [mode, setMode] = useState('trad');
```

- Selecionável via Header
- Scanner Tradicional (padrão)
- Scanner IA (experimental)

### 3. Wizard Steps

6+ passos de navegação clicáveis, permitindo saltar entre fases do fluxo.

### 4. Modal Editor

Sistema de edição foto-por-foto com overlay que bloqueia o background.

### 5. Console em Tempo Real

Simulação de logs backend com timestamps sincronizados.

---

## 🚨 INCONSISTÊNCIAS VISUAIS IDENTIFICADAS

### Comparação: HTML vs AutoRelatorio V4 Atual

| Aspecto | HTML (Prototype) | V4 Atual | Discrepância |
|---------|------------------|----------|--------------|
| **Tipografia Headers** | Roboto Slab (serif) | ? | Pode estar diferente |
| **Raios (Radius)** | 4-12px (sóbrio) | ? | Pode estar maior/menor |
| **Cores Primárias** | #C8541C exato | Pode variar | Brand color diferente? |
| **Sidebar** | Esquerda, sempre visível | ? | Pode ser colapsível |
| **Layout Console** | Rodapé fixo | ? | Pode estar diferente |
| **Grid Photos** | Flexível | ? | Número colunas diferente |
| **Dark Mode** | Implementado | ? | Pode não estar no V4 |
| **Espaçamento** | 4px base scale | ? | Pode usar 8px base |

---

## 📝 DADOS SIMULADOS (Mock Data)

### Fotos Mock

```javascript
Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  name: `IMG_${(2401 + i).toString().padStart(4,'0')}.jpg`,
  tone: tones[i % tones.length],
  desc: i % 4,
  edited: i < 3,
}))
```

Resultado: 8 imagens de teste, IMG_2401 até IMG_2408.

### Logs Mock

```javascript
[
  { t: '14:32:01', level: 'INFO', msg: 'FastAPI uvicorn iniciado em :5000' },
  { t: '14:32:02', level: 'OK',   msg: 'Backend health-check OK' },
  { t: '14:32:18', level: 'INFO', msg: 'Scanner Tradicional · varrendo MAFFENG-Bloco-A/' },
  { t: '14:32:19', level: 'OK',   msg: '12 imagens reconhecidas, 4 já editadas' },
  { t: '14:33:04', level: 'INFO', msg: 'Aguardando edição do técnico...' },
]
```

---

## 🎯 RESUMO EXECUTIVO

**O Arquivo HTML é uma:**

1. ✅ **Simulação de UI Kit** completa do AutoRelatorio V4
2. ✅ **Aplicação React funcional** com componentes estruturados
3. ✅ **Sistema de design consistente** (TM Construtora v3)
4. ✅ **Wireframe interativo** com fluxo de edição de fotos
5. ✅ **Dark mode totalmente suportado**
6. ✅ **Console de logs simulado** com interface realista
7. ✅ **Modal editor funcional** para seleção e edição

**Funcionalidades Superior à V4 Atual:**
- Dark mode completo
- Modo dual (Tradicional/IA)
- Wizard steps navigationável
- Editor modal sofisticado
- Console de logs realista
- Tipografia serif para headers (Roboto Slab)

**Áreas de Desacordo Visual:**
- Possível diferença em tamanho de raios (radius)
- Possível diferença em espaçamento base
- Possível diferença em número de colunas do grid
- Possível sidebar diferente (layout)
- Possível tipografia diferente em headers

---

## 📌 PRÓXIMOS PASSOS RECOMENDADOS

1. **Comparar lado a lado** o HTML com a versão V4 atual para identificar exatamente quais elementos visuais diferem
2. **Extrair componentes React** do bundle para reutilização
3. **Alinhamento visual** — ajustar raios, espaçamento, tipografia para match com V4
4. **Validação de funcionalidades** — testar cada interação (modo, dark, steps, galeria, editor, console)
5. **Integração backend** — conectar com FastAPI em :5000 para logs reais
6. **Fotografia real** — substituir mock photos por imagens reais do projeto

