# AutoRelatorio V2 — UI Kit

High-fidelity recreation of the AutoRelatorio V2 frontend (Next.js + Tailwind + Fabric.js).

**Source of truth:** `APP/frontend/app/page.tsx` and `APP/frontend/components/*` from the TM-MEUS-APPS repo.

## What's here
- `index.html` — interactive click-thru of the app (Wizard sidebar, photo grid, editor modal, console).
- `Header.jsx` — top app bar with logo, mode pills, theme toggle.
- `WizardSidebar.jsx` — 6-step lateral wizard (Pasta → Modo → Scan → Edição → Contexto → Gerar).
- `PhotoGrid.jsx` — responsive grid of inspection photos with edit/select state.
- `PhotoCard.jsx` — single thumbnail with description selector and overlay.
- `EditorModal.jsx` — Fabric.js-style canvas editor (arrows, text, crop) — visual only.
- `Console.jsx` — bottom log console with Rich-style colored streaming.
- `ModeToggle.jsx` — Tradicional vs São Paulo pill switch.

## Style rules
Inherits all tokens from `../../colors_and_type.css`. No new colors are introduced.
The kit fakes data; nothing actually scans or generates.
