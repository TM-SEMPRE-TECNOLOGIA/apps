/**
 * TM·Zap Inspeção — App Principal
 * State machine + Router · Vanilla JS · Sem frameworks
 *
 * Views: 'inicio' → tela de OSs
 *        'nova-os' → modal de criação de OS
 *        'chat'   → conversa com o técnico
 */

import { CONTRATOS } from './data/ambientes.js';
import {
  ChatShell, Bubble, TextMsg, Photo, DateSep, SystemMsg, showToast, cs
} from './components/chat.js';
import { openCamera, blobToObjectURL } from './components/camera.js';
import { Composer, adicionarMenuContexto, editarBolha } from './components/composer.js';
import {
  salvarOSs, carregarOSs,
  salvarMensagens, carregarMensagens, deletarMensagens,
  salvarFotoBlob, restaurarFotos,
} from './data/sessao.js';
import {
  parsearMensagens, gerarZip, baixarZip,
  enviarParaAutorelatorio, previewEstrutura,
} from './components/export.js';

/* ════════════════════════════════════════════════════
   ESTADO GLOBAL
   ════════════════════════════════════════════════════ */
const state = {
  oss: [],          // [{ id, nomeOS, contraCodigo, tecnico, estagio, criadaEm }]
  osAtiva: null,    // objeto da OS em edição
  mensagens: [],    // [{ id, tipo, texto, fotoId, objectUrl, hora, apagada, editada }]
};

/* ── IDs únicos ───────────────────────────────────── */
function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ── Hora formatada HH:MM ─────────────────────────── */
function agora() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

/* ── Nome do grupo conforme estágio ──────────────────*/
const ESTAGIOS = ['1️⃣ LEV', '2️⃣ ORÇ ENV', '3️⃣ ORÇ APROV', '4️⃣ EXECUTANDO', '5️⃣ CONCLUÍDA'];

function nomeDoGrupo(os) {
  const estagio = ESTAGIOS[os.estagio] ?? ESTAGIOS[0];
  return `${estagio} - ${os.cidade} ${os.contratoCodigo}`;
}

/* ── Contrato pelo código ─────────────────────────── */
function getContrato(codigo) {
  return CONTRATOS.find(c => c.codigo === codigo) || null;
}

/* ════════════════════════════════════════════════════
   PERSISTÊNCIA
   ════════════════════════════════════════════════════ */
function salvar() {
  salvarOSs(state.oss);
  if (state.osAtiva) {
    salvarMensagens(state.osAtiva.id, state.mensagens);
  }
}

/* ════════════════════════════════════════════════════
   ROUTER — ponto único de renderização
   ════════════════════════════════════════════════════ */
const appEl = document.getElementById('app');
let _currentView = null;

function render(view) {
  _currentView = view;
  appEl.innerHTML = '';

  if (view === 'inicio') renderInicio();
  else if (view === 'chat') renderChat();
}

/* ════════════════════════════════════════════════════
   VIEW: INÍCIO — lista de OSs abertas
   ════════════════════════════════════════════════════ */
function renderInicio() {
  const screen = document.createElement('div');
  screen.className = 'screen-inicio';

  /* ── Header ─────────────────────────────────────── */
  const header = document.createElement('div');
  header.className = 'inicio-header safe-top';
  header.innerHTML = `
    <div class="inicio-logo">TM·Zap Inspeção</div>
    <div class="inicio-sub">Ordens de Serviço</div>
  `;

  /* ── Botão nova OS ──────────────────────────────── */
  const btnNova = document.createElement('button');
  btnNova.className = 'btn-nova-os';
  btnNova.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    Nova OS
  `;
  btnNova.addEventListener('click', () => abrirModalNovaOS());
  header.appendChild(btnNova);

  /* ── Lista de OSs ───────────────────────────────── */
  const body = document.createElement('div');
  body.className = 'inicio-body';

  if (state.oss.length === 0) {
    const vazio = document.createElement('div');
    vazio.className = 'oss-vazio';
    vazio.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${cs.border}" stroke-width="1.5" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <p>Nenhuma OS aberta</p>
      <span>Toque em <strong>+ Nova OS</strong> para começar</span>
    `;
    body.appendChild(vazio);
  } else {
    state.oss.forEach(os => {
      body.appendChild(_cardOS(os));
    });
  }

  screen.append(header, body);
  appEl.appendChild(screen);
}

/* ── Card de uma OS ──────────────────────────────── */
function _cardOS(os) {
  const card = document.createElement('div');
  card.className = 'os-card';
  card.dataset.osId = os.id;

  const contrato = getContrato(os.contratoCodigo);
  const nomeContrato = contrato ? `${contrato.nome} — ${contrato.estado}` : os.contratoCodigo;
  const estagioLabel = ESTAGIOS[os.estagio] ?? ESTAGIOS[0];
  const data = new Date(os.criadaEm).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  card.innerHTML = `
    <div class="os-card-top">
      <span class="os-estagio-badge">${estagioLabel}</span>
      <span class="os-data">${data}</span>
    </div>
    <div class="os-nome">${nomeDoGrupo(os)}</div>
    <div class="os-contrato">${nomeContrato}</div>
    <div class="os-tecnico">👤 ${os.tecnico}</div>
  `;

  card.addEventListener('click', () => abrirOS(os));
  return card;
}

/* ════════════════════════════════════════════════════
   MODAL: NOVA OS
   ════════════════════════════════════════════════════ */
function abrirModalNovaOS() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal-nova-os';

  modal.innerHTML = `
    <div class="modal-header">
      <span class="modal-title">Nova OS — Levantamento</span>
      <button class="modal-fechar" aria-label="Fechar">✕</button>
    </div>

    <div class="modal-body">
      <label class="form-label">Contrato</label>
      <select id="sel-contrato" class="form-select">
        <option value="">Selecione…</option>
        ${CONTRATOS.map(c => `<option value="${c.codigo}">${c.codigo} · ${c.sigla} — ${c.nome}</option>`).join('')}
      </select>

      <label class="form-label" style="margin-top:14px">Cidade</label>
      <input id="inp-cidade" type="text" class="form-input" placeholder="Ex: Lambari" autocapitalize="words">

      <label class="form-label" style="margin-top:14px">Nome do Técnico</label>
      <input id="inp-tecnico" type="text" class="form-input" placeholder="Ex: Thiago" autocapitalize="words">

      <button id="btn-criar-os" class="btn-criar-os" disabled>Criar OS e Abrir Chat</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const selContrato = modal.querySelector('#sel-contrato');
  const inpCidade   = modal.querySelector('#inp-cidade');
  const inpTecnico  = modal.querySelector('#inp-tecnico');
  const btnCriar    = modal.querySelector('#btn-criar-os');

  function _validar() {
    btnCriar.disabled = !(selContrato.value && inpCidade.value.trim() && inpTecnico.value.trim());
  }

  selContrato.addEventListener('change', _validar);
  inpCidade.addEventListener('input', _validar);
  inpTecnico.addEventListener('input', _validar);

  modal.querySelector('.modal-fechar').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  btnCriar.addEventListener('click', () => {
    const codigo  = selContrato.value;
    const cidade  = inpCidade.value.trim();
    const tecnico = inpTecnico.value.trim();

    const os = {
      id: gerarId(),
      contratoCodigo: codigo,
      cidade,
      tecnico,
      estagio: 0,
      criadaEm: Date.now(),
    };

    state.oss.unshift(os);
    salvarOSs(state.oss);
    overlay.remove();
    abrirOS(os);
  });
}

/* ════════════════════════════════════════════════════
   ABRIR OS → entra no chat
   ════════════════════════════════════════════════════ */
async function abrirOS(os) {
  state.osAtiva = os;

  // Carrega mensagens salvas e reconstrói objectURLs das fotos
  const msgs = carregarMensagens(os.id);
  state.mensagens = await restaurarFotos(msgs);

  render('chat');
}

/* ════════════════════════════════════════════════════
   VIEW: CHAT
   ════════════════════════════════════════════════════ */
let _chatShell = null;

function renderChat() {
  const os = state.osAtiva;
  const titulo   = nomeDoGrupo(os);
  const subtitulo = `${os.tecnico} · ${ESTAGIOS[os.estagio]}`;

  /* ── Shell do chat ──────────────────────────────── */
  _chatShell = ChatShell({
    title: titulo,
    subtitle: subtitulo,
    onBack: () => {
      state.osAtiva = null;
      state.mensagens = [];
      _chatShell = null;
      render('inicio');
    },
    onMenu: _handleExportar,
  });

  appEl.appendChild(_chatShell);

  /* ── Composer (input real) ──────────────────────── */
  const composer = Composer({
    onEnviarTexto: _handleTexto,
    onEnviarFoto: _handleFoto,
  });
  appEl.appendChild(composer);

  /* ── Rebuild mensagens salvas ───────────────────── */
  _rebuildChat();

  /* ── Scroll para o fim ──────────────────────────── */
  setTimeout(() => {
    const body = _chatShell.querySelector('.chat-body');
    if (body) body.scrollTop = body.scrollHeight;
  }, 50);
}

/* ── Rebuild visual do histórico ────────────────── */
function _rebuildChat() {
  if (!_chatShell) return;

  let ultimaData = null;

  for (const msg of state.mensagens) {
    if (msg.apagada) {
      _chatShell.addMessage(_buildBolhaApagada(msg));
      continue;
    }

    // Separador de data
    const diaMsg = new Date(msg.ts || Date.now()).toLocaleDateString('pt-BR');
    if (diaMsg !== ultimaData) {
      ultimaData = diaMsg;
      _chatShell.addMessage(DateSep(diaMsg));
    }

    if (msg.tipo === 'foto') {
      _chatShell.addMessage(_buildBolhaFoto(msg));
    } else if (msg.tipo === 'texto') {
      const isSep = _ehSeparador(msg);
      if (isSep) {
        _chatShell.addMessage(SystemMsg(`📍 ${msg.texto}`));
      } else {
        _chatShell.addMessage(_buildBolhaTexto(msg));
      }
    }
  }
}

/* ════════════════════════════════════════════════════
   HANDLERS DE MENSAGEM
   ════════════════════════════════════════════════════ */

/* ── Enviar texto ───────────────────────────────── */
function _handleTexto(txt) {
  const msg = {
    id: gerarId(),
    tipo: 'texto',
    texto: txt,
    hora: agora(),
    ts: Date.now(),
    apagada: false,
    editada: false,
  };

  state.mensagens.push(msg);
  salvar();

  // Detecta separador de ambiente (texto puro sem medição)
  if (_ehSeparador(msg)) {
    _chatShell.addMessage(SystemMsg(`📍 ${txt}`));
  } else {
    _chatShell.addMessage(_buildBolhaTexto(msg));
  }

  _scrollFim();
}

/* ── Enviar foto ────────────────────────────────── */
async function _handleFoto(blob, objectUrl) {
  const fotoId = gerarId();

  // Salva blob no IndexedDB
  await salvarFotoBlob(fotoId, blob);

  const msg = {
    id: gerarId(),
    tipo: 'foto',
    fotoId,
    objectUrl,
    blob,   // referência temporária
    hora: agora(),
    ts: Date.now(),
    apagada: false,
  };

  state.mensagens.push(msg);
  salvar();

  _chatShell.addMessage(_buildBolhaFoto(msg));
  _scrollFim();
}

/* ── Exportar ───────────────────────────────────── */
async function _handleExportar() {
  const os = state.osAtiva;
  if (!os) return;

  const nFotos = state.mensagens.filter(m => !m.apagada && m.tipo === 'foto').length;
  if (nFotos === 0) {
    showToast('Nenhuma foto no levantamento');
    return;
  }

  // Mostra opções
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const grupos = parsearMensagens(state.mensagens);
  const preview = previewEstrutura(grupos);
  const nomeOS  = nomeDoGrupo(os).replace(/[^\w\s\-]/g, '').trim();

  const modal = document.createElement('div');
  modal.className = 'modal-export';
  modal.innerHTML = `
    <div class="modal-header">
      <span class="modal-title">Exportar para AutoRelatório</span>
      <button class="modal-fechar" aria-label="Fechar">✕</button>
    </div>
    <div class="modal-body">
      <div class="export-preview">${preview.replace(/\n/g,'<br>')}</div>
      <div class="export-info">${nFotos} foto${nFotos !== 1 ? 's' : ''} · ${grupos.length} ambiente${grupos.length !== 1 ? 's' : ''}</div>
      <div class="export-progress" style="display:none">
        <div class="export-bar"><div class="export-bar-fill" style="width:0%"></div></div>
        <span class="export-pct">0%</span>
      </div>
      <div class="export-actions">
        <button class="btn-export-zip">⬇ Baixar ZIP</button>
        <button class="btn-export-api">📡 Abrir no AutoRelatório</button>
      </div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  modal.querySelector('.modal-fechar').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  const progressEl = modal.querySelector('.export-progress');
  const barFill    = modal.querySelector('.export-bar-fill');
  const pctEl      = modal.querySelector('.export-pct');

  function onProgress(pct) {
    progressEl.style.display = 'flex';
    barFill.style.width = pct + '%';
    pctEl.textContent   = pct + '%';
  }

  modal.querySelector('.btn-export-zip').addEventListener('click', async () => {
    try {
      showToast('Gerando ZIP…');
      const blob = await gerarZip(grupos, nomeOS, onProgress);
      baixarZip(blob, nomeOS);
      overlay.remove();
      showToast('ZIP baixado com sucesso!');
    } catch (e) {
      console.error('[Export]', e);
      showToast('Erro ao gerar ZIP: ' + e.message);
    }
  });

  modal.querySelector('.btn-export-api').addEventListener('click', async () => {
    try {
      showToast('Enviando para AutoRelatório…');
      const result = await enviarParaAutorelatorio(grupos, nomeOS);
      overlay.remove();
      showToast(`✓ ${result.n_fotos} fotos enviadas!`);
    } catch (e) {
      console.error('[Export]', e);
      showToast('AutoRelatório não encontrado na rede');
    }
  });
}

/* ════════════════════════════════════════════════════
   BUILDERS: DOM das bolhas
   ════════════════════════════════════════════════════ */

function _buildBolhaTexto(msg) {
  const bolha = Bubble({ from: 'thiago', time: msg.hora, read: true },
    TextMsg(msg.texto)
  );

  // Se editada, exibe label
  if (msg.editada) {
    const label = bolha.querySelector('.msg-status') || bolha;
    const editSpan = document.createElement('span');
    editSpan.style.cssText = `font-size:9px;color:${cs.muted};font-family:var(--TM-font-mono);margin-right:4px;`;
    editSpan.textContent = 'editada';
    label.prepend?.(editSpan);
  }

  adicionarMenuContexto(bolha, {
    onEditar: () => {
      const textoEl = bolha.querySelector('[data-texto]');
      if (!textoEl) return;
      editarBolha(bolha, msg.texto, (novoTexto) => {
        if (!novoTexto || novoTexto === msg.texto) return;
        msg.texto = novoTexto;
        msg.editada = true;
        salvar();
      });
    },
    onApagar: () => {
      msg.apagada = true;
      salvar();
      // Substitui a bolha pela versão apagada
      const apagada = _buildBolhaApagada(msg);
      bolha.replaceWith(apagada);
    },
  });

  return bolha;
}

function _buildBolhaFoto(msg) {
  const src = msg.objectUrl || null;
  const fotoNode = document.createElement('div');
  Object.assign(fotoNode.style, {
    borderRadius: '6px', overflow: 'hidden',
    maxWidth: '240px', position: 'relative',
  });

  if (src) {
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = 'width:100%;display:block;border-radius:6px;';
    img.loading = 'lazy';
    fotoNode.appendChild(img);
  } else {
    // Placeholder enquanto blob não carrega
    fotoNode.style.cssText += `background:${cs.border};height:160px;display:flex;align-items:center;justify-content:center;color:${cs.muted};font-size:12px;`;
    fotoNode.textContent = '📷 foto';
  }

  const bolha = Bubble({ from: 'thiago', time: msg.hora, read: true }, fotoNode);

  adicionarMenuContexto(bolha, {
    onEditar: () => showToast('Fotos não podem ser editadas'),
    onApagar: () => {
      msg.apagada = true;
      salvar();
      const apagada = _buildBolhaApagada(msg);
      bolha.replaceWith(apagada);
    },
  });

  return bolha;
}

function _buildBolhaApagada(msg) {
  const bolha = Bubble({ from: 'thiago', time: msg.hora, read: true });
  const inner = bolha.querySelector('div > div');
  if (inner) {
    const apg = document.createElement('span');
    apg.style.cssText = `font-size:13px;color:${cs.muted};font-style:italic;`;
    apg.textContent = '🚫 Mensagem apagada';
    inner.prepend(apg);
  }
  return bolha;
}

/* ════════════════════════════════════════════════════
   HEURÍSTICA: detecta separador de ambiente
   (cópia leve do export.js para renderização inline)
   ════════════════════════════════════════════════════ */
function _ehSeparador(msg) {
  if (msg.tipo !== 'texto') return false;
  const txt = msg.texto || '';
  const temMedicao = /\d+[,.]?\d*\s*[\/x]/.test(txt);
  const temDesconto = /descontar|desconto/i.test(txt);
  const temUnidade = /\d+\s*(und|unid|un\b)/i.test(txt);
  if (temMedicao || temDesconto || temUnidade) return false;

  const palavrasAmbiente = ['atendimento', 'autoatendimento', 'corredor', 'banheiro',
    'copa', 'cozinha', 'sala', 'cofre', 'fachada', 'cobertura', 'telhado',
    'almoxarifado', 'recepção', 'recepçao', 'entrada', 'garagem', 'subsolo',
    'pavimento', 'andar', 'escada', 'externo', 'interno', 'quintal'];

  const txtLow = txt.toLowerCase();
  const temPalavra = palavrasAmbiente.some(p => txtLow.includes(p));

  const semNumeros = txt.replace(/\d/g, '').trim();
  const ehMaisculo = semNumeros.length > 3 && semNumeros === semNumeros.toUpperCase();

  return ehMaisculo || temPalavra;
}

/* ── Scroll para o fim do chat ───────────────────── */
function _scrollFim() {
  if (!_chatShell) return;
  const body = _chatShell.querySelector('.chat-body');
  if (body) {
    requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });
  }
}

/* ════════════════════════════════════════════════════
   INSTALL BANNER (PWA)
   ════════════════════════════════════════════════════ */
let _installPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  _installPrompt = e;

  setTimeout(() => {
    const banner = document.createElement('div');
    banner.className = 'install-banner';
    banner.innerHTML = `
      <div class="install-banner-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div class="install-banner-text">
        <div class="install-banner-title">Instalar TM·Zap</div>
        <div class="install-banner-sub">Adicionar à tela inicial</div>
      </div>
      <button class="install-btn">Instalar</button>
    `;
    banner.querySelector('.install-btn').addEventListener('click', () => {
      banner.remove();
      if (_installPrompt) { _installPrompt.prompt(); _installPrompt = null; }
    });
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 8000);
  }, 3000);
});

/* ════════════════════════════════════════════════════
   BOOT
   ════════════════════════════════════════════════════ */
function boot() {
  // Carrega OSs salvas
  state.oss = carregarOSs();

  render('inicio');

  // Remove splash
  const loading = document.getElementById('app-loading');
  if (loading) loading.remove();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
