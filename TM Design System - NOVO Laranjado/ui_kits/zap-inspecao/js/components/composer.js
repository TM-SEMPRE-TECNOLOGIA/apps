/**
 * TM·Zap Inspeção — Composer (input real)
 * Input de texto + botão câmera + enviar
 * Integra com chat.js para editar/apagar mensagens
 */

import { cs } from './chat.js';
import { openCamera, blobToObjectURL } from './camera.js';

/* ── Composer funcional ───────────────────────────── */
export function Composer({ onEnviarTexto, onEnviarFoto } = {}) {
  const wrap = document.createElement('div');
  wrap.id = 'composer';
  Object.assign(wrap.style, {
    background: cs.card,
    borderTop: `1px solid ${cs.border}`,
    padding: '8px 10px',
    paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
    position: 'sticky',
    bottom: '0',
    zIndex: '20',
  });

  const bar = document.createElement('div');
  Object.assign(bar.style, {
    display: 'flex', alignItems: 'flex-end', gap: '6px',
  });

  /* ── Input ───────────────────────────────────────── */
  const input = document.createElement('textarea');
  input.placeholder = 'Mensagem…';
  input.rows = 1;
  Object.assign(input.style, {
    flex: '1',
    minHeight: '36px',
    maxHeight: '120px',
    padding: '8px 14px',
    background: cs.paper,
    border: `1px solid ${cs.border}`,
    borderRadius: '18px',
    fontSize: '14px',
    color: cs.ink,
    outline: 'none',
    fontFamily: 'var(--TM-font-sans)',
    resize: 'none',
    lineHeight: '1.4',
    overflowY: 'auto',
    boxSizing: 'border-box',
  });

  // Auto-resize
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  // Enter envia, Shift+Enter pula linha
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      _enviarTexto();
    }
  });

  /* ── Botão câmera ────────────────────────────────── */
  const btnCam = document.createElement('button');
  btnCam.setAttribute('aria-label', 'Câmera');
  Object.assign(btnCam.style, {
    width: '36px', height: '36px',
    borderRadius: '8px', border: 'none',
    background: 'transparent', color: cs.muted,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: '0',
  });
  btnCam.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
  btnCam.addEventListener('click', _abrirCamera);

  /* ── Botão enviar / mic ──────────────────────────── */
  const btnEnviar = document.createElement('button');
  btnEnviar.setAttribute('aria-label', 'Enviar');
  Object.assign(btnEnviar.style, {
    width: '38px', height: '38px',
    borderRadius: '50%', border: 'none',
    background: cs.orange, color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: '0',
    transition: 'background 0.15s',
  });

  const iconEnviar = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
  const iconMic    = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>`;

  btnEnviar.innerHTML = iconMic; // começa como mic
  btnEnviar.addEventListener('click', () => {
    if (input.value.trim()) _enviarTexto();
    // mic: no futuro
  });

  // Troca ícone conforme há texto
  input.addEventListener('input', () => {
    btnEnviar.innerHTML = input.value.trim() ? iconEnviar : iconMic;
  });

  bar.append(btnCam, input, btnEnviar);
  wrap.appendChild(bar);

  /* ── Funções internas ────────────────────────────── */
  function _enviarTexto() {
    const txt = input.value.trim();
    if (!txt) return;
    input.value = '';
    input.style.height = 'auto';
    btnEnviar.innerHTML = iconMic;
    if (onEnviarTexto) onEnviarTexto(txt);
  }

  async function _abrirCamera() {
    await openCamera(async (blobPromise) => {
      const blob = await blobPromise;
      if (!blob) return;
      const objectUrl = blobToObjectURL(blob);
      if (onEnviarFoto) onEnviarFoto(blob, objectUrl);
    });
  }

  /* ── API pública ─────────────────────────────────── */
  wrap.focarInput = () => input.focus();
  wrap.getInput   = () => input;

  return wrap;
}

/* ═══════════════════════════════════════════════════
   MENU DE CONTEXTO (toque longo) — Editar / Apagar
   ═══════════════════════════════════════════════════ */

let _menuAtivo = null;

export function adicionarMenuContexto(bolhaEl, { onEditar, onApagar } = {}) {
  let holdTimer = null;
  let moved = false;

  // Touch longo (mobile)
  bolhaEl.addEventListener('touchstart', e => {
    moved = false;
    holdTimer = setTimeout(() => {
      if (!moved) _abrirMenu(e.touches[0].clientX, e.touches[0].clientY, { onEditar, onApagar });
    }, 500);
  }, { passive: true });

  bolhaEl.addEventListener('touchmove',  () => { moved = true; clearTimeout(holdTimer); }, { passive: true });
  bolhaEl.addEventListener('touchend',   () => clearTimeout(holdTimer), { passive: true });
  bolhaEl.addEventListener('touchcancel',() => clearTimeout(holdTimer), { passive: true });

  // Click direito (desktop)
  bolhaEl.addEventListener('contextmenu', e => {
    e.preventDefault();
    _abrirMenu(e.clientX, e.clientY, { onEditar, onApagar });
  });
}

function _abrirMenu(x, y, { onEditar, onApagar }) {
  _fecharMenu();

  const menu = document.createElement('div');
  Object.assign(menu.style, {
    position: 'fixed',
    background: cs.ink,
    borderRadius: '8px',
    padding: '4px 0',
    zIndex: '500',
    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    minWidth: '140px',
    animation: 'tmFadeUp 0.12s ease both',
  });

  const itens = [
    { label: '✏️  Editar', action: onEditar },
    { label: '🗑️  Apagar', action: onApagar, danger: true },
  ];

  itens.forEach(item => {
    const btn = document.createElement('button');
    btn.textContent = item.label;
    Object.assign(btn.style, {
      display: 'block', width: '100%',
      padding: '10px 16px',
      background: 'transparent', border: 'none',
      color: item.danger ? '#FF6B6B' : '#fff',
      fontFamily: 'var(--TM-font-sans)',
      fontSize: '13px', fontWeight: '500',
      textAlign: 'left', cursor: 'pointer',
    });
    btn.addEventListener('click', () => {
      _fecharMenu();
      if (item.action) item.action();
    });
    btn.addEventListener('mouseover', () => { btn.style.background = 'rgba(255,255,255,0.1)'; });
    btn.addEventListener('mouseout',  () => { btn.style.background = 'transparent'; });
    menu.appendChild(btn);
  });

  // Posicionar (evitar sair da tela)
  document.body.appendChild(menu);
  const rect = menu.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight;
  menu.style.left = Math.min(x, vw - rect.width  - 8) + 'px';
  menu.style.top  = Math.min(y, vh - rect.height - 8) + 'px';

  _menuAtivo = menu;

  // Fecha ao clicar fora
  setTimeout(() => document.addEventListener('click', _fecharMenu, { once: true }), 10);
}

function _fecharMenu() {
  if (_menuAtivo) { _menuAtivo.remove(); _menuAtivo = null; }
}

/* ═══════════════════════════════════════════════════
   INLINE EDIT — editar texto de uma bolha
   ═══════════════════════════════════════════════════ */
export function editarBolha(bolhaEl, textoAtual, onConfirmar) {
  // Encontra o elemento de texto dentro da bolha
  const textoEl = bolhaEl.querySelector('[data-texto]');
  if (!textoEl) return;

  const original = textoEl.textContent;

  // Transforma em textarea inline
  const ta = document.createElement('textarea');
  ta.value = textoAtual || original;
  Object.assign(ta.style, {
    width: '100%', minHeight: '40px',
    background: 'transparent', border: 'none',
    borderBottom: `2px solid ${cs.orange}`,
    color: cs.ink, fontSize: '14px', lineHeight: '1.45',
    fontFamily: 'var(--TM-font-sans)',
    resize: 'none', outline: 'none',
    padding: '2px 0',
  });
  ta.rows = textoAtual ? textoAtual.split('\n').length : 1;

  textoEl.replaceWith(ta);
  ta.focus();
  ta.setSelectionRange(ta.value.length, ta.value.length);

  // Marca visualmente como editando
  const editLabel = document.createElement('span');
  editLabel.textContent = ' editando…';
  Object.assign(editLabel.style, {
    fontSize: '9px', color: cs.orange,
    fontFamily: 'var(--TM-font-mono)',
    marginLeft: '4px',
  });
  bolhaEl.querySelector('[style*="flex-end"]')?.prepend(editLabel);

  function confirmar() {
    const novoTexto = ta.value.trim();
    editLabel.remove();

    const span = document.createElement('span');
    span.setAttribute('data-texto', '');
    span.style.cssText = `font-size:14px;line-height:1.45;color:${cs.ink};white-space:pre-wrap;`;
    span.textContent = novoTexto || original;
    ta.replaceWith(span);

    if (onConfirmar) onConfirmar(novoTexto);
  }

  ta.addEventListener('blur', confirmar);
  ta.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); confirmar(); }
    if (e.key === 'Escape') { ta.value = original; confirmar(); }
  });
}
