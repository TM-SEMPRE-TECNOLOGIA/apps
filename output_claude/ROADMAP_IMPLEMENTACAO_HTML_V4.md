# 🚀 ROADMAP DE IMPLEMENTAÇÃO — Integração HTML ao AutoRelatorio V4

**Documento Técnico de Desenvolvimento**  
**Data:** 2026-05-12  
**Escopo:** Converter funcionalidades HTML em componentes V4  

---

## 📌 ESTRUTURA RECOMENDADA

### Diretório Sugerido

```
01_Golden_Apps_meu_uso/AutoRelatorio_V4/APP/
├── frontend/
│  ├── src/
│  │  ├── components/
│  │  │  ├── Layout/
│  │  │  │  ├── Header.jsx          ← Do HTML
│  │  │  │  ├── WizardSidebar.jsx   ← Do HTML
│  │  │  │  └── AppContainer.jsx
│  │  │  ├── Gallery/
│  │  │  │  ├── PhotoGrid.jsx       ← Do HTML
│  │  │  │  ├── PhotoCard.jsx
│  │  │  │  └── EditorModal.jsx     ← Do HTML
│  │  │  ├── System/
│  │  │  │  └── Console.jsx         ← Do HTML
│  │  │  └── App.jsx                ← Orquestração
│  │  ├── hooks/
│  │  │  ├── usePhotos.js
│  │  │  ├── useLogs.js
│  │  │  └── useDarkMode.js
│  │  ├── styles/
│  │  │  ├── theme.css              ← Tokens TM do HTML
│  │  │  ├── components.css
│  │  │  └── dark-mode.css
│  │  └── utils/
│  │     └── constants.js
│  └── package.json
└── backend/
   └── (mantém FastAPI :5000)
```

---

## 🛠️ PASSO 1: EXTRAIR E PADRONIZAR TOKENS CSS

### Arquivo: `src/styles/theme.css`

```css
/* ═══════════════════════════════════════════════════════════════
   TM CONSTRUTORA — DESIGN TOKENS v3 (Do HTML)
   ═══════════════════════════════════════════════════════════════ */

:root {
  /* ── BRAND ──────────────────────────────────────────────── */
  --tm-primary:        #C8541C;
  --tm-primary-hover:  #A6451A;
  --tm-primary-light:  #FBEDE3;
  --tm-primary-light-alpha: rgba(200, 84, 28, 0.12);

  /* ── SUPERFÍCIES (light mode) ───────────────────────────── */
  --tm-bg:             #F5F4F1;
  --tm-bg-card:        #FFFFFF;
  --tm-bg-hover:       #ECEAE5;
  --tm-bg-input:       #FFFFFF;
  --tm-bg-sidebar:     #FAF9F6;
  --tm-bg-secondary:   #E8E5DE;
  --tm-bg-accent:      #FBEDE3;
  --tm-bg-muted:       #EFEDE8;

  /* ── TEXTO ─────────────────────────────────────────────── */
  --tm-text:           #1A1A1A;
  --tm-text-muted:     #5C5A55;
  --tm-text-subtle:    #8C8A85;

  /* ── BORDAS ────────────────────────────────────────────── */
  --tm-border:         #DAD7D0;
  --tm-border-hover:   #B8B5AD;
  --tm-border-strong:  #1A1A1A;

  /* ── STATUS ────────────────────────────────────────────── */
  --tm-success:        #4F7A3A;
  --tm-info:           #345878;
  --tm-warning:        #C8541C;
  --tm-destructive:    #A33B2A;

  /* ── CHART RAMP ────────────────────────────────────────── */
  --tm-chart-1: #C8541C;
  --tm-chart-2: #8C5A2E;
  --tm-chart-3: #5C5A55;
  --tm-chart-4: #345878;
  --tm-chart-5: #2B2B2B;

  /* ── TIPOGRAFIA ────────────────────────────────────────── */
  --tm-font-serif: "Roboto Slab", serif;
  --tm-font-sans:  "Inter", system-ui, sans-serif;
  --tm-font-mono:  "JetBrains Mono", monospace;

  /* ── RAIO ──────────────────────────────────────────────── */
  --tm-radius-sm: 4px;
  --tm-radius-md: 6px;
  --tm-radius-lg: 8px;
  --tm-radius-xl: 12px;

  /* ── SOMBRAS ───────────────────────────────────────────── */
  --tm-shadow-sm: 0 1px 0 0 rgba(26,26,26,0.04), 0 1px 2px 0 rgba(26,26,26,0.04);
  --tm-shadow-md: 0 2px 4px -1px rgba(26,26,26,0.08), 0 1px 2px 0 rgba(26,26,26,0.04);
  --tm-shadow-lg: 0 8px 16px -4px rgba(26,26,26,0.10), 0 2px 4px -1px rgba(26,26,26,0.06);
  --tm-shadow-xl: 0 16px 24px -6px rgba(26,26,26,0.12), 0 4px 8px -2px rgba(26,26,26,0.06);

  /* ── ESPAÇAMENTO ───────────────────────────────────────── */
  --tm-space-1: 4px;
  --tm-space-2: 8px;
  --tm-space-3: 12px;
  --tm-space-4: 16px;
  --tm-space-5: 24px;
  --tm-space-6: 32px;
  --tm-space-7: 48px;
  --tm-space-8: 64px;
}

/* Dark Mode */
html.dark {
  --tm-primary:        #E47A4A;
  --tm-primary-hover:  #C8541C;
  --tm-primary-light:  #2B2520;

  --tm-bg:             #161513;
  --tm-bg-card:        #1F1E1B;
  --tm-bg-hover:       #2A2926;
  --tm-bg-input:       #1F1E1B;
  --tm-bg-sidebar:     #1A1916;
  --tm-bg-secondary:   #2A2926;
  --tm-bg-accent:      #2B2520;
  --tm-bg-muted:       #232220;

  --tm-text:           #EFEDE8;
  --tm-text-muted:     #A8A6A0;
  --tm-text-subtle:    #6E6C66;

  --tm-border:         #34322E;
  --tm-border-hover:   #4A4842;
}

/* Papéis Tipográficos */
.tm-display {
  font-family: var(--tm-font-serif);
  font-weight: 600;
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.1;
  color: var(--tm-text);
}

.tm-h1 {
  font-family: var(--tm-font-serif);
  font-weight: 600;
  font-size: 26px;
  line-height: 1.25;
  color: var(--tm-text);
}

.tm-h2 {
  font-family: var(--tm-font-serif);
  font-weight: 500;
  font-size: 19px;
  line-height: 1.35;
  color: var(--tm-text);
}

.tm-h3 {
  font-family: var(--tm-font-sans);
  font-weight: 600;
  font-size: 15px;
  line-height: 1.4;
  color: var(--tm-text);
}

.tm-body {
  font-family: var(--tm-font-sans);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.6;
  color: var(--tm-text);
}

.tm-body-muted {
  font-family: var(--tm-font-sans);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.6;
  color: var(--tm-text-muted);
}

.tm-small {
  font-family: var(--tm-font-sans);
  font-size: 12px;
  color: var(--tm-text-muted);
}

.tm-mono {
  font-family: var(--tm-font-mono);
  font-size: 13px;
  color: var(--tm-text);
}

.tm-mono-label {
  font-family: var(--tm-font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--tm-text-subtle);
  font-weight: 500;
}
```

---

## 🛠️ PASSO 2: COMPONENTE App.jsx

### Arquivo: `src/components/App.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import Header from './Layout/Header';
import WizardSidebar from './Layout/WizardSidebar';
import PhotoGrid from './Gallery/PhotoGrid';
import Console from './System/Console';
import EditorModal from './Gallery/EditorModal';
import usePhotos from '../hooks/usePhotos';
import useLogs from '../hooks/useLogs';

function App() {
  const [step, setStep] = useState(4);
  const [mode, setMode] = useState('trad'); // 'trad' | 'ia'
  const [dark, setDark] = useState(false);
  const [editing, setEditing] = useState(null);

  // Hooks customizados
  const { photos, updatePhoto } = usePhotos();
  const { logs, addLog } = useLogs();

  // Dark mode listener
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Logs simulados de inicialização
  useEffect(() => {
    addLog('14:32:01', 'INFO', 'FastAPI uvicorn iniciado em :5000');
    addLog('14:32:02', 'OK', 'Backend health-check OK');
    addLog('14:32:18', 'INFO', `Scanner ${mode === 'trad' ? 'Tradicional' : 'IA'} · varrendo MAFFENG-Bloco-A/`);
    addLog('14:32:19', 'OK', `${photos.length} imagens reconhecidas, ${photos.filter(p => p.edited).length} já editadas`);
    addLog('14:33:04', 'INFO', 'Aguardando edição do técnico...');
  }, []);

  return (
    <div className="app">
      <Header
        mode={mode}
        setMode={setMode}
        dark={dark}
        setDark={setDark}
      />

      <div className="main">
        <WizardSidebar
          step={step}
          onStep={setStep}
        />

        <PhotoGrid
          photos={photos}
          onEdit={setEditing}
        />
      </div>

      <Console logs={logs} />

      {editing && (
        <EditorModal
          photo={editing}
          onClose={() => setEditing(null)}
          onSave={(updatedPhoto) => {
            updatePhoto(updatedPhoto);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
```

---

## 🛠️ PASSO 3: COMPONENTE Header.jsx

### Arquivo: `src/components/Layout/Header.jsx`

```jsx
import React from 'react';

function Header({ mode, setMode, dark, setDark }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="tm-h2">AutoRelatorio V4</h1>
      </div>

      <div className="header-center">
        <div className="mode-selector">
          <label>
            <input
              type="radio"
              name="scanner-mode"
              value="trad"
              checked={mode === 'trad'}
              onChange={(e) => setMode(e.target.value)}
            />
            Scanner Tradicional
          </label>
          <label>
            <input
              type="radio"
              name="scanner-mode"
              value="ia"
              checked={mode === 'ia'}
              onChange={(e) => setMode(e.target.value)}
            />
            Scanner IA
          </label>
        </div>
      </div>

      <div className="header-right">
        <button
          className="toggle-dark"
          onClick={() => setDark(!dark)}
          aria-label={`Ativar ${dark ? 'modo claro' : 'modo escuro'}`}
        >
          {dark ? '☀️ Claro' : '🌙 Escuro'}
        </button>
      </div>
    </header>
  );
}

export default Header;
```

### CSS Relacionado: `src/styles/components.css`

```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--tm-space-4) var(--tm-space-5);
  background-color: var(--tm-bg-card);
  border-bottom: 1px solid var(--tm-border);
  box-shadow: var(--tm-shadow-sm);
}

.header-left {
  flex: 0 0 auto;
  color: var(--tm-text);
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  flex: 0 0 auto;
  display: flex;
  gap: var(--tm-space-3);
}

.mode-selector label {
  display: inline-flex;
  align-items: center;
  gap: var(--tm-space-2);
  margin-right: var(--tm-space-3);
  cursor: pointer;
  font-size: 14px;
  color: var(--tm-text-muted);
}

.mode-selector input[type="radio"] {
  cursor: pointer;
}

.toggle-dark {
  padding: var(--tm-space-2) var(--tm-space-3);
  background-color: var(--tm-bg-secondary);
  border: 1px solid var(--tm-border);
  border-radius: var(--tm-radius-md);
  cursor: pointer;
  font-size: 13px;
  color: var(--tm-text);
  transition: all 0.2s ease;
}

.toggle-dark:hover {
  background-color: var(--tm-bg-hover);
  border-color: var(--tm-border-hover);
}
```

---

## 🛠️ PASSO 4: COMPONENTE WizardSidebar.jsx

### Arquivo: `src/components/Layout/WizardSidebar.jsx`

```jsx
import React from 'react';

const STEPS = [
  { id: 1, label: 'Seleção de Projeto', icon: '📁' },
  { id: 2, label: 'Configuração', icon: '⚙️' },
  { id: 3, label: 'Scanner', icon: '📷' },
  { id: 4, label: 'Revisão & Edição', icon: '✏️' },
  { id: 5, label: 'Processamento', icon: '⚡' },
  { id: 6, label: 'Exportação', icon: '📥' },
];

function WizardSidebar({ step, onStep }) {
  return (
    <aside className="wizard-sidebar">
      <nav className="wizard-nav">
        {STEPS.map((s) => (
          <button
            key={s.id}
            className={`wizard-step ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}
            onClick={() => onStep(s.id)}
            aria-current={step === s.id ? 'step' : undefined}
          >
            <span className="step-icon">{s.icon}</span>
            <span className="step-label">{s.label}</span>
            <span className="step-number">{s.id}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default WizardSidebar;
```

### CSS Relacionado

```css
.wizard-sidebar {
  width: 220px;
  background-color: var(--tm-bg-sidebar);
  border-right: 1px solid var(--tm-border);
  padding: var(--tm-space-4) 0;
  overflow-y: auto;
}

.wizard-nav {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

.wizard-step {
  display: flex;
  align-items: center;
  gap: var(--tm-space-3);
  padding: var(--tm-space-3) var(--tm-space-4);
  background: none;
  border: none;
  border-left: 3px solid transparent;
  color: var(--tm-text-muted);
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  transition: all 0.2s ease;
}

.wizard-step:hover {
  background-color: var(--tm-bg-hover);
}

.wizard-step.active {
  background-color: var(--tm-primary-light);
  border-left-color: var(--tm-primary);
  color: var(--tm-text);
  font-weight: 600;
}

.wizard-step.completed {
  opacity: 0.6;
}

.step-icon {
  font-size: 18px;
}

.step-number {
  margin-left: auto;
  font-size: 12px;
  color: var(--tm-text-subtle);
  opacity: 0.6;
}
```

---

## 🛠️ PASSO 5: COMPONENTE PhotoGrid.jsx

### Arquivo: `src/components/Gallery/PhotoGrid.jsx`

```jsx
import React from 'react';
import PhotoCard from './PhotoCard';

function PhotoGrid({ photos, onEdit }) {
  return (
    <div className="photo-grid-container">
      <div className="photo-grid-header">
        <h2 className="tm-h2">Galeria de Imagens</h2>
        <p className="tm-body-muted">
          {photos.length} imagens · {photos.filter(p => p.edited).length} editadas
        </p>
      </div>

      <div className="photo-grid">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => onEdit(photo)}
          />
        ))}
      </div>
    </div>
  );
}

export default PhotoGrid;
```

### Arquivo: `src/components/Gallery/PhotoCard.jsx`

```jsx
import React from 'react';

function PhotoCard({ photo, onClick }) {
  return (
    <button
      className="photo-card"
      onClick={onClick}
      aria-label={`Editar ${photo.name}`}
    >
      <div
        className="photo-preview"
        style={{
          backgroundColor: photo.tone,
          backgroundImage: `linear-gradient(135deg, ${photo.tone} 0%, ${photo.tone}dd 100%)`,
        }}
      >
        {photo.edited && <div className="edited-badge">✓</div>}
      </div>
      <div className="photo-info">
        <p className="photo-name tm-small">{photo.name}</p>
        <p className="photo-status tm-mono-label">
          {photo.edited ? 'Editada' : 'Pendente'}
        </p>
      </div>
    </button>
  );
}

export default PhotoCard;
```

### CSS Relacionado

```css
.photo-grid-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--tm-space-5);
  overflow-y: auto;
}

.photo-grid-header {
  margin-bottom: var(--tm-space-5);
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--tm-space-4);
}

.photo-card {
  display: flex;
  flex-direction: column;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: var(--tm-radius-lg);
  overflow: hidden;
}

.photo-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--tm-shadow-md);
}

.photo-card:focus {
  outline: 2px solid var(--tm-primary);
  outline-offset: 2px;
}

.photo-preview {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--tm-radius-lg);
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: var(--tm-space-2);
  box-shadow: var(--tm-shadow-sm);
}

.edited-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--tm-success);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.photo-info {
  padding: var(--tm-space-2) 0;
  text-align: left;
}

.photo-name {
  margin: 0;
  color: var(--tm-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.photo-status {
  margin: var(--tm-space-1) 0 0 0;
  color: var(--tm-text-subtle);
}
```

---

## 🛠️ PASSO 6: COMPONENTE Console.jsx

### Arquivo: `src/components/System/Console.jsx`

```jsx
import React, { useEffect, useRef } from 'react';

function Console({ logs }) {
  const consoleRef = useRef(null);

  useEffect(() => {
    // Auto-scroll para o final
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="console">
      <div className="console-header">
        <h3 className="tm-h3">System Console</h3>
      </div>
      <div className="console-content" ref={consoleRef}>
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`console-line level-${log.level.toLowerCase()}`}
          >
            <span className="console-time">{log.t}</span>
            <span className={`console-level level-${log.level.toLowerCase()}`}>
              {log.level}
            </span>
            <span className="console-msg">{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Console;
```

### CSS Relacionado

```css
.console {
  height: 160px;
  background-color: var(--tm-bg);
  border-top: 1px solid var(--tm-border);
  display: flex;
  flex-direction: column;
  font-family: var(--tm-font-mono);
  font-size: 12px;
}

.console-header {
  padding: var(--tm-space-3) var(--tm-space-4);
  border-bottom: 1px solid var(--tm-border);
  background-color: var(--tm-bg-secondary);
}

.console-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--tm-space-3) var(--tm-space-4);
}

.console-line {
  display: flex;
  gap: var(--tm-space-2);
  margin-bottom: var(--tm-space-1);
  color: var(--tm-text-muted);
  align-items: baseline;
}

.console-time {
  color: var(--tm-text-subtle);
  opacity: 0.6;
  min-width: 70px;
}

.console-level {
  font-weight: 600;
  min-width: 50px;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.1em;
}

.console-level.level-info {
  color: var(--tm-info);
}

.console-level.level-ok {
  color: var(--tm-success);
}

.console-level.level-error {
  color: var(--tm-destructive);
}

.console-level.level-warn {
  color: var(--tm-warning);
}

.console-msg {
  flex: 1;
  color: var(--tm-text-muted);
  word-break: break-word;
}
```

---

## 🛠️ PASSO 7: COMPONENTE EditorModal.jsx

### Arquivo: `src/components/Gallery/EditorModal.jsx`

```jsx
import React, { useState } from 'react';

function EditorModal({ photo, onClose, onSave }) {
  const [edited, setEdited] = useState(photo.edited);

  const handleSave = () => {
    onSave({
      ...photo,
      edited: true,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="tm-h2">Editor: {photo.name}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="editor-preview">
            <div
              className="editor-image"
              style={{
                backgroundColor: photo.tone,
                backgroundImage: `linear-gradient(135deg, ${photo.tone} 0%, ${photo.tone}dd 100%)`,
              }}
            >
              {/* Placeholder para editor de imagem */}
              <p className="tm-body-muted">Editor de Imagem</p>
            </div>
          </div>

          <div className="editor-controls">
            <div className="control-group">
              <label className="tm-mono-label">Descritor</label>
              <select defaultValue={photo.desc} className="input-select">
                <option value={0}>Tipo A</option>
                <option value={1}>Tipo B</option>
                <option value={2}>Tipo C</option>
                <option value={3}>Tipo D</option>
              </select>
            </div>

            <div className="control-group">
              <label className="tm-mono-label">Notas</label>
              <textarea
                placeholder="Adicionar notas sobre a imagem..."
                className="input-textarea"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
          >
            Salvar Edições
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditorModal;
```

### CSS Relacionado

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background-color: var(--tm-bg-card);
  border-radius: var(--tm-radius-lg);
  box-shadow: var(--tm-shadow-xl);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--tm-space-4);
  border-bottom: 1px solid var(--tm-border);
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 20px;
  color: var(--tm-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: var(--tm-text);
}

.modal-body {
  flex: 1;
  padding: var(--tm-space-4);
  overflow-y: auto;
  display: flex;
  gap: var(--tm-space-4);
}

.editor-preview {
  flex: 1;
}

.editor-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--tm-radius-lg);
  border: 1px solid var(--tm-border);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--tm-shadow-md);
}

.editor-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--tm-space-3);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: var(--tm-space-2);
}

.input-select,
.input-textarea {
  padding: var(--tm-space-2) var(--tm-space-3);
  background-color: var(--tm-bg-input);
  border: 1px solid var(--tm-border);
  border-radius: var(--tm-radius-md);
  font-family: var(--tm-font-sans);
  font-size: 14px;
  color: var(--tm-text);
  transition: border-color 0.2s ease;
}

.input-select:focus,
.input-textarea:focus {
  outline: none;
  border-color: var(--tm-primary);
  box-shadow: 0 0 0 3px var(--tm-primary-light-alpha);
}

.input-textarea {
  resize: vertical;
  min-height: 120px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--tm-space-3);
  padding: var(--tm-space-4);
  border-top: 1px solid var(--tm-border);
  background-color: var(--tm-bg-secondary);
}

.btn {
  padding: var(--tm-space-2) var(--tm-space-4);
  border: none;
  border-radius: var(--tm-radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--tm-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--tm-primary-hover);
  box-shadow: var(--tm-shadow-md);
}

.btn-secondary {
  background-color: var(--tm-bg-hover);
  color: var(--tm-text);
  border: 1px solid var(--tm-border);
}

.btn-secondary:hover {
  background-color: var(--tm-bg-secondary);
}
```

---

## 🛠️ PASSO 8: HOOKS CUSTOMIZADOS

### Arquivo: `src/hooks/usePhotos.js`

```javascript
import { useState } from 'react';

const MOCK_PHOTOS = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  name: `IMG_${(2401 + i).toString().padStart(4, '0')}.jpg`,
  tone: ['#475569', '#334155', '#1e3a5f', '#0f3a3a', '#3a3a1e', '#2d3748', '#475569', '#1e3a5f'][i],
  desc: i % 4,
  edited: i < 3,
}));

export function usePhotos() {
  const [photos, setPhotos] = useState(MOCK_PHOTOS);

  const updatePhoto = (updatedPhoto) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p))
    );
  };

  return { photos, updatePhoto };
}

export default usePhotos;
```

### Arquivo: `src/hooks/useLogs.js`

```javascript
import { useState } from 'react';

export function useLogs() {
  const [logs, setLogs] = useState([]);

  const addLog = (time, level, message) => {
    setLogs((prev) => [...prev, { t: time, level, msg: message }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return { logs, addLog, clearLogs };
}

export default useLogs;
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Setup Base
- [ ] Criar estrutura de pastas recomendada
- [ ] Copiar tokens CSS do HTML
- [ ] Importar fontes (Inter, JetBrains Mono, Roboto Slab)
- [ ] Configurar dark mode (className toggle)

### Fase 2: Componentes
- [ ] Implementar App.jsx
- [ ] Implementar Header.jsx
- [ ] Implementar WizardSidebar.jsx
- [ ] Implementar PhotoGrid.jsx + PhotoCard.jsx
- [ ] Implementar Console.jsx
- [ ] Implementar EditorModal.jsx

### Fase 3: Hooks e Dados
- [ ] Criar usePhotos.js
- [ ] Criar useLogs.js
- [ ] Integrar dados reais do backend
- [ ] Testar fluxo completo

### Fase 4: Styling & Polish
- [ ] Validar cores em light/dark mode
- [ ] Ajustar espaçamento se necessário
- [ ] Testar responsividade
- [ ] Otimizar animações

### Fase 5: Integração Backend
- [ ] Conectar FastAPI :5000
- [ ] Buscar fotos reais
- [ ] Buscar logs em tempo real
- [ ] Implementar salvar edições

---

## 🔗 PRÓXIMAS REFERÊNCIAS

- Arquivo HTML original: `AutoRelatorio V4 - TM Sempre Tecnologia (desenvolver e aplicar).html`
- Análise detalhada: `ANALISE_DETALHADA_HTML_AUTORELATORIO_V4.md`
- Recomendações visuais: `RECOMENDACOES_AJUSTES_HTML_PARA_V4.md`

