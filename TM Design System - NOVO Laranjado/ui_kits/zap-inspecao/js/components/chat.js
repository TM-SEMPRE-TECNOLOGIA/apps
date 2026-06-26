/**
 * TM·Zap Inspeção — Chat Components (vanilla JS)
 * Portado de chat.jsx — mantém exatamente o mesmo visual
 */

/* ── PALETA ───────────────────────────────────────── */
export const cs = {
  paper:    '#F5F4F1',
  card:     '#FFFFFF',
  ink:      '#1A1A1A',
  muted:    '#5C5A55',
  subtle:   '#8C8A85',
  border:   '#DAD7D0',
  orange:   '#C8541C',
  orangeBg: '#FBEDE3',
  ok:       '#4F7A3A',
  okBg:     '#EAF1E4',
  blue:     '#345878',
  blueBg:   '#E2EBF2',
  red:      '#A33B2A',
  redBg:    '#F5DCD7',
};

/* ── PERSONAS ─────────────────────────────────────── */
export const personas = {
  thiago:  { name: 'Eng. Thiago',    color: cs.orange, you: true,  initials: 'TN' },
  marcos:  { name: 'Sup. Marcos',    color: cs.blue,   you: false, initials: 'MS' },
  daniel:  { name: 'Cliente Daniel', color: cs.red,    you: false, initials: 'DC' },
  bot:     { name: 'TM·bot',         color: cs.ink,    you: false, bot: true, initials: 'TM' },
};

/* ── HELPER: criar elemento ───────────────────────── */
function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (k === 'className') e.className = v;
    else if (k === 'innerHTML') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v);
  }
  for (const c of children) {
    if (!c && c !== 0) continue;
    e.append(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return e;
}

function svgEl(svgStr) {
  const d = document.createElement('div');
  d.innerHTML = svgStr;
  return d.firstElementChild;
}

/* ── SVG HELPERS ──────────────────────────────────── */
const SVG_BACK = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const SVG_MENU = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></svg>`;
const SVG_PLAY = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const SVG_MIC  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>`;
const SVG_CAM  = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
const SVG_PLUS = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
const SVG_PIN  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${cs.orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const SVG_FILE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

/* ════════════════════════════════════════════════════
   COMPONENTES
   ════════════════════════════════════════════════════ */

/* ── ChatHeader ───────────────────────────────────── */
export function ChatHeader({ title = 'MAFFENG · Bloco A', subtitle = 'Inspeção 15·04 · 4 membros', onBack, onMenu } = {}) {
  const bar = el('div', { style: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 12px 10px 6px',
    background: cs.card,
    borderBottom: `1px solid ${cs.border}`,
    position: 'sticky', top: 0, zIndex: 30,
  }});

  const btnBack = el('button', { style: { width:'32px', height:'32px', border:'none', background:'transparent', color:cs.ink, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }, 'aria-label': 'Voltar' });
  btnBack.appendChild(svgEl(SVG_BACK));
  if (onBack) btnBack.addEventListener('click', onBack);

  const avWrap = el('div', { style: { display:'flex', alignItems:'center', position:'relative' }});
  ['#475569','#334155','#C8541C','#3A5A2C'].forEach((c, i) => {
    const dot = el('span', { style: { width:'30px', height:'30px', borderRadius:'50%', border:`2px solid ${cs.card}`, background:c, display:'inline-block', marginLeft: i ? '-8px' : '0', zIndex: String(4 - i) }});
    avWrap.appendChild(dot);
  });

  const titleWrap = el('div', { style: { flex:1, marginLeft:'6px', minWidth:0 }});
  titleWrap.appendChild(el('div', { style: { fontFamily:"var(--TM-font-serif)", fontWeight:'600', fontSize:'15px', color:cs.ink, letterSpacing:'-0.005em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}, title));
  titleWrap.appendChild(el('div', { style: { fontFamily:"var(--TM-font-mono)", fontSize:'10px', color:cs.subtle, letterSpacing:'0.06em', marginTop:'1px' }}, subtitle));

  const btnMenu = el('button', { style: { width:'32px', height:'32px', border:'none', background:'transparent', color:cs.ink, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }, 'aria-label': 'Menu' });
  btnMenu.appendChild(svgEl(SVG_MENU));
  if (onMenu) btnMenu.addEventListener('click', onMenu);

  bar.append(btnBack, avWrap, titleWrap, btnMenu);
  return bar;
}

/* ── DateSep ──────────────────────────────────────── */
export function DateSep(text) {
  const wrap = el('div', { style: { display:'flex', justifyContent:'center', margin:'14px 0 10px' }});
  const pill = el('span', { style: { fontFamily:"var(--TM-font-mono)", fontSize:'10px', fontWeight:'600', letterSpacing:'0.14em', padding:'4px 12px', borderRadius:'999px', background:cs.paper, color:cs.muted, border:`1px solid ${cs.border}`, textTransform:'uppercase' }}, text);
  wrap.appendChild(pill);
  return wrap;
}

/* ── SystemMsg ────────────────────────────────────── */
export function SystemMsg(text) {
  const wrap = el('div', { style: { display:'flex', justifyContent:'center', margin:'6px 12px' }});
  const pill = el('span', { style: { fontFamily:"var(--TM-font-mono)", fontSize:'10px', color:cs.subtle, letterSpacing:'0.08em', padding:'5px 12px', background:'rgba(255,255,255,0.7)', border:`1px solid ${cs.border}`, borderRadius:'999px', textTransform:'uppercase', fontWeight:'500', textAlign:'center', maxWidth:'85%' }}, text);
  wrap.appendChild(pill);
  return wrap;
}

/* ── Ticks ────────────────────────────────────────── */
export function Ticks(read) {
  const c = read ? cs.orange : cs.subtle;
  return svgEl(`<svg width="14" height="10" viewBox="0 0 16 11" style="margin-left:4px;vertical-align:-1px"><polyline points="1.5 5.5 5 9 11 2.5" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="5 9 8 5.5" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="6 5.5 9.5 9 15 2.5" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
}

/* ── BotMark ──────────────────────────────────────── */
function BotMark() {
  return el('span', { style: { display:'inline-block', width:'7px', height:'7px', background:cs.orange, marginRight:'4px', verticalAlign:'middle' }});
}

/* ── Bubble ───────────────────────────────────────── */
export function Bubble({ from, time, read, pad = '8px 12px', maxw = '78%', animate = true }, ...children) {
  const p = personas[from] || personas.thiago;
  const isOut = !!p.you;

  const row = el('div', { style: { display:'flex', padding:'2px 10px', justifyContent: isOut ? 'flex-end' : 'flex-start' }});
  if (animate) row.classList.add(isOut ? 'bubble-out' : 'bubble-in');

  const box = el('div', { style: {
    maxWidth: maxw,
    background: isOut ? cs.orangeBg : (p.bot ? '#FFFCF8' : cs.card),
    border: p.bot ? `1px solid ${cs.border}` : '1px solid transparent',
    borderTop: p.bot ? `2px solid ${cs.ink}` : undefined,
    borderRadius: '8px',
    padding: pad,
    boxShadow: '0 1px 0 rgba(26,26,26,0.04)',
    color: cs.ink,
  }});

  if (!isOut) {
    const nameRow = el('div', { style: { fontFamily:"var(--TM-font-sans)", fontSize:'12px', fontWeight:'600', marginBottom:'4px', display:'flex', alignItems:'center', gap:'4px', letterSpacing:'0.005em', color: p.color }});
    if (p.bot) nameRow.appendChild(BotMark());
    nameRow.appendChild(document.createTextNode(p.name));
    box.appendChild(nameRow);
  }

  for (const c of children) {
    if (c) box.appendChild(typeof c === 'string' ? el('span', {}, c) : c);
  }

  const foot = el('div', { style: { display:'flex', justifyContent:'flex-end', alignItems:'center', marginTop:'4px' }});
  foot.appendChild(el('span', { style: { fontFamily:"var(--TM-font-mono)", fontSize:'9px', color:cs.subtle, letterSpacing:'0.06em' }}, time));
  if (isOut) foot.appendChild(Ticks(read));
  box.appendChild(foot);

  row.appendChild(box);
  return row;
}

/* ── TextMsg ──────────────────────────────────────── */
export function TextMsg(text) {
  const span = el('span', { style: { fontSize:'14px', lineHeight:'1.45', color:cs.ink, whiteSpace:'pre-wrap', display:'block' }}, text);
  span.setAttribute('data-texto', '');
  return span;
}

/* ── Quote ────────────────────────────────────────── */
export function Quote({ author, text: qText }) {
  const p = personas[author] || personas.marcos;
  const wrap = el('div', { style: { borderLeft:`3px solid ${p.color}`, background:'rgba(0,0,0,0.03)', padding:'5px 8px', borderRadius:'3px', marginBottom:'6px' }});
  wrap.appendChild(el('div', { style: { fontSize:'11px', fontWeight:'600', color:p.color, lineHeight:'1.2' }}, p.name));
  wrap.appendChild(el('div', { style: { fontSize:'12px', color:cs.muted, marginTop:'2px', lineHeight:'1.35', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}, qText));
  return wrap;
}

/* ── Photo ────────────────────────────────────────── */
export function Photo({ tone = '#475569', caption, anomaly, num, src }) {
  const wrap = el('div', { style: { width:'220px', margin:'-2px -4px 6px' }});
  const imgWrap = el('div', { style: { position:'relative', aspectRatio:'4/3', background: src ? 'transparent' : tone, borderRadius:'4px', overflow:'hidden', border:`1px solid ${cs.border}` }});

  if (src) {
    // Foto real
    const img = el('img', { style: { width:'100%', height:'100%', objectFit:'cover', display:'block' }});
    img.src = src;
    imgWrap.appendChild(img);
  } else {
    // Placeholder (câmera icon)
    const iconWrap = el('div', { style: { position:'absolute', inset:'0', display:'flex', alignItems:'center', justifyContent:'center' }});
    iconWrap.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
    imgWrap.appendChild(iconWrap);
  }

  if (anomaly) {
    const arrowSvg = svgEl(`<svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 100 75" preserveAspectRatio="none"><defs><marker id="ah-${num||'x'}" markerWidth="6" markerHeight="6" refX="5" refY="2" orient="auto"><polygon points="0 0,6 2,0 4" fill="${cs.orange}"/></marker></defs><line x1="22" y1="55" x2="55" y2="35" stroke="${cs.orange}" stroke-width="1.5" marker-end="url(#ah-${num||'x'})"/></svg>`);
    imgWrap.appendChild(arrowSvg);
  }

  if (num) {
    imgWrap.appendChild(el('span', { style: { position:'absolute', top:'5px', left:'5px', fontFamily:"var(--TM-font-mono)", fontSize:'9px', fontWeight:'600', padding:'2px 5px', background:'rgba(26,26,26,0.8)', color:'#fff', letterSpacing:'0.08em', borderRadius:'2px' }}, `IMG·${num}`));
  }

  if (anomaly) {
    imgWrap.appendChild(el('span', { style: { position:'absolute', bottom:'5px', left:'5px', fontFamily:"var(--TM-font-mono)", fontSize:'9px', fontWeight:'600', padding:'3px 7px', background:cs.orange, color:'#fff', letterSpacing:'0.1em', borderRadius:'2px' }}, `ANOMALIA · ${anomaly}`));
  }

  wrap.appendChild(imgWrap);
  if (caption) wrap.appendChild(el('div', { style: { fontSize:'13px', color:cs.ink, marginTop:'5px', lineHeight:'1.4' }}, caption));
  return wrap;
}

/* ── Voice ────────────────────────────────────────── */
export function Voice({ duration = '0:34' } = {}) {
  const bars = [3,5,8,12,10,14,18,11,6,9,16,13,7,4,8,11,15,9,5,3,6,10,12,8,4];
  const wrap = el('div', { style: { display:'flex', alignItems:'center', gap:'10px', padding:'4px 2px', width:'200px', margin:'-1px 0' }});

  const btn = el('button', { style: { width:'32px', height:'32px', borderRadius:'50%', border:'none', background:cs.ink, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:'0' }});
  btn.innerHTML = SVG_PLAY;

  const waveform = el('div', { style: { display:'flex', alignItems:'center', gap:'2px', flex:'1', height:'24px' }});
  bars.forEach((h, i) => {
    waveform.appendChild(el('span', { style: { width:'2px', height:`${h}px`, background: i < 8 ? cs.orange : cs.subtle, borderRadius:'1px', opacity: i < 8 ? '1' : '0.55' }}));
  });

  wrap.append(btn, waveform, el('span', { style: { fontFamily:"var(--TM-font-mono)", fontSize:'10px', color:cs.muted, letterSpacing:'0.04em', flexShrink:'0' }}, duration));
  return wrap;
}

/* ── LocationPin ──────────────────────────────────── */
export function LocationPin({ address }) {
  const wrap = el('div', { style: { width:'220px', margin:'-2px -4px 4px' }});
  const mapWrap = el('div', { style: { position:'relative', height:'110px', borderRadius:'4px', overflow:'hidden', border:`1px solid ${cs.border}`, background:'#EFEDE8' }});

  mapWrap.innerHTML = `
    <svg width="100%" height="100%" style="position:absolute;inset:0">
      <defs><pattern id="mapgrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#DAD7D0" stroke-width="0.5"/></pattern></defs>
      <rect width="100%" height="100%" fill="url(#mapgrid)"/>
      <path d="M0 60 Q60 40 120 70 T 240 50" fill="none" stroke="#C8C5BD" stroke-width="6" opacity="0.5"/>
      <path d="M0 60 Q60 40 120 70 T 240 50" fill="none" stroke="#FFFFFF" stroke-width="2"/>
    </svg>
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-100%)">
      <svg width="22" height="28" viewBox="0 0 24 30"><path d="M12 0c-6.6 0-12 5.4-12 12 0 9 12 18 12 18s12-9 12-18c0-6.6-5.4-12-12-12z" fill="${cs.orange}"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>
    </div>`;

  const addrRow = el('div', { style: { display:'flex', alignItems:'flex-start', gap:'6px', marginTop:'5px', fontSize:'12px', color:cs.ink, lineHeight:'1.35' }});
  addrRow.append(svgEl(SVG_PIN), el('span', {}, address));

  wrap.append(mapWrap, addrRow);
  return wrap;
}

/* ── BotCard ──────────────────────────────────────── */
export function BotCard({ title, body, actions, badge, onAction } = {}) {
  const wrap = el('div', { style: { width:'230px', margin:'-1px -2px 4px' }});

  if (badge) {
    wrap.appendChild(el('div', { style: { display:'inline-block', fontFamily:"var(--TM-font-mono)", fontSize:'9px', fontWeight:'700', letterSpacing:'0.14em', padding:'2px 7px', background:cs.ink, color:'#fff', marginBottom:'6px', borderRadius:'2px' }}, badge));
  }

  wrap.appendChild(el('div', { style: { fontFamily:"var(--TM-font-serif)", fontWeight:'600', fontSize:'14px', color:cs.ink, marginBottom:'4px', letterSpacing:'-0.005em', lineHeight:'1.25' }}, title));

  if (body) wrap.appendChild(el('div', { style: { fontSize:'12px', color:cs.muted, lineHeight:'1.5', marginBottom: actions ? '10px' : '0' }}, body));

  if (actions && actions.length) {
    const btns = el('div', { style: { display:'flex', gap:'6px' }});
    actions.forEach((a, i) => {
      const btn = el('button', { style: {
        flex:'1', padding:'7px 8px', fontSize:'11px', fontWeight:'600', fontFamily:'inherit',
        border: i === 0 ? 'none' : `1px solid ${cs.border}`,
        background: i === 0 ? cs.orange : 'transparent',
        color: i === 0 ? '#fff' : cs.ink,
        borderRadius:'4px', cursor:'pointer', letterSpacing:'0.01em',
      }}, a);
      if (onAction) btn.addEventListener('click', () => onAction(a, i));
      btns.appendChild(btn);
    });
    wrap.appendChild(btns);
  }

  return wrap;
}

/* ── Poll ─────────────────────────────────────────── */
export function Poll({ question, options } = {}) {
  const total = (options || []).reduce((a, o) => a + o.votes, 0);
  const wrap = el('div', { style: { width:'230px', margin:'-1px -2px 4px' }});

  wrap.appendChild(el('div', { style: { fontFamily:"var(--TM-font-mono)", fontSize:'9px', fontWeight:'700', letterSpacing:'0.14em', color:cs.subtle, marginBottom:'4px' }}, `ENQUETE · ${total} VOTOS`));
  wrap.appendChild(el('div', { style: { fontFamily:"var(--TM-font-serif)", fontWeight:'600', fontSize:'14px', color:cs.ink, marginBottom:'10px', lineHeight:'1.3' }}, question));

  const list = el('div', { style: { display:'flex', flexDirection:'column', gap:'7px' }});
  (options || []).forEach(o => {
    const pct = total ? (o.votes / total * 100) : 0;
    const row = el('div');
    const labelRow = el('div', { style: { display:'flex', justifyContent:'space-between', fontSize:'11px', marginBottom:'3px' }});
    labelRow.appendChild(el('span', { style: { color:cs.ink, fontWeight: o.votes ? '600' : '500' }}, o.label));
    labelRow.appendChild(el('span', { style: { fontFamily:"var(--TM-font-mono)", color:cs.muted }}, String(o.votes)));
    const bar = el('div', { style: { height:'4px', background:cs.paper, borderRadius:'0', overflow:'hidden' }});
    bar.appendChild(el('div', { style: { height:'100%', background: o.votes ? cs.orange : cs.border, width:`${Math.max(pct, 4)}%` }}));
    row.append(labelRow, bar);
    list.appendChild(row);
  });

  wrap.appendChild(list);
  return wrap;
}

/* ── FileCard ─────────────────────────────────────── */
export function FileCard({ name, meta, actions, onAction } = {}) {
  const wrap = el('div', { style: { width:'230px', margin:'-1px -2px 4px' }});

  const card = el('div', { style: { display:'flex', alignItems:'center', gap:'10px', padding:'10px', background:cs.paper, border:`1px solid ${cs.border}`, borderLeft:`3px solid ${cs.orange}`, borderRadius:'3px' }});
  const icon = el('div', { style: { width:'38px', height:'46px', background:'#fff', border:`1px solid ${cs.border}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:'0', fontFamily:"var(--TM-font-mono)", fontSize:'8px', fontWeight:'700', color:cs.orange, letterSpacing:'0.08em' }});
  icon.innerHTML = SVG_FILE;
  icon.appendChild(el('span', { style: { marginTop:'2px' }}, 'DOCX'));

  const info = el('div', { style: { flex:'1', minWidth:'0' }});
  info.appendChild(el('div', { style: { fontFamily:"var(--TM-font-mono)", fontSize:'11px', fontWeight:'600', color:cs.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}, name));
  info.appendChild(el('div', { style: { fontFamily:"var(--TM-font-mono)", fontSize:'10px', color:cs.muted, marginTop:'2px', letterSpacing:'0.04em' }}, meta));

  card.append(icon, info);
  wrap.appendChild(card);

  if (actions && actions.length) {
    const btns = el('div', { style: { display:'flex', gap:'6px', marginTop:'6px' }});
    actions.forEach((a, i) => {
      const btn = el('button', { style: {
        flex:'1', padding:'7px 6px', fontSize:'11px', fontWeight:'600',
        fontFamily:'inherit', borderRadius:'4px', cursor:'pointer',
        border: i === 0 ? 'none' : `1px solid ${cs.border}`,
        background: i === 0 ? cs.ink : 'transparent',
        color: i === 0 ? '#fff' : cs.ink,
      }}, a);
      if (onAction) btn.addEventListener('click', () => onAction(a, i));
      btns.appendChild(btn);
    });
    wrap.appendChild(btns);
  }

  return wrap;
}

/* ── Composer ─────────────────────────────────────── */
export function Composer({ typing, onCamera, onSend, onAttach } = {}) {
  const wrap = el('div', { style: { background:cs.card, borderTop:`1px solid ${cs.border}`, padding:'8px 10px 18px', paddingBottom:'calc(18px + env(safe-area-inset-bottom, 0px))', position:'sticky', bottom:'0' }});

  if (typing) {
    const typingRow = el('div', { style: { display:'flex', alignItems:'center', gap:'6px', fontFamily:"var(--TM-font-mono)", fontSize:'10px', color:cs.subtle, letterSpacing:'0.06em', padding:'0 4px 6px' }});
    const dot = el('span', { style: { width:'6px', height:'6px', background:cs.orange, borderRadius:'50%', animation:'tmPulse 1.2s ease-in-out infinite' }});
    typingRow.append(dot, document.createTextNode(`${typing} digitando…`));
    wrap.appendChild(typingRow);
  }

  const bar = el('div', { style: { display:'flex', alignItems:'center', gap:'6px' }});

  const iconStyle = { width:'36px', height:'36px', borderRadius:'8px', border:'none', background:'transparent', color:cs.muted, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:'0' };

  const btnPlus = el('button', { style: iconStyle, 'aria-label': 'Anexar' });
  btnPlus.innerHTML = SVG_PLUS;
  if (onAttach) btnPlus.addEventListener('click', onAttach);

  const input = el('input', { type:'text', placeholder:'Mensagem…', style: { flex:'1', height:'36px', padding:'0 14px', background:cs.paper, border:`1px solid ${cs.border}`, borderRadius:'18px', fontSize:'13px', color:cs.ink, outline:'none', fontFamily:"var(--TM-font-sans)" }});
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && onSend) { onSend(input.value); input.value = ''; }});

  const btnCam = el('button', { style: iconStyle, 'aria-label': 'Câmera' });
  btnCam.innerHTML = SVG_CAM;
  if (onCamera) btnCam.addEventListener('click', onCamera);

  const btnMic = el('button', { style: { width:'38px', height:'38px', borderRadius:'50%', border:'none', background:cs.orange, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:'0' }, 'aria-label': 'Gravar áudio' });
  btnMic.innerHTML = SVG_MIC;

  bar.append(btnPlus, input, btnCam, btnMic);
  wrap.appendChild(bar);

  // Expõe o input para o app.js
  wrap._input = input;
  wrap._btnCam = btnCam;

  return wrap;
}

/* ── ChatShell ────────────────────────────────────── */
export function ChatShell({ title, subtitle, typing, onBack, onCamera, onSend, onMenu } = {}) {
  const shell = el('div', { style: { background:cs.paper, display:'flex', flexDirection:'column', flex:'1', minHeight:'0', overflow:'hidden' }});

  const header = ChatHeader({ title, subtitle, onBack, onMenu });
  const body = el('div', { className: 'chat-body' });

  shell.append(header, body);

  // API pública do shell
  shell.addMessage = (node) => {
    body.appendChild(node);
    body.scrollTop = body.scrollHeight;
  };
  shell.clearMessages = () => { body.innerHTML = ''; };

  return shell;
}

/* ── Toast ────────────────────────────────────────── */
export function showToast(msg, duration = 2500) {
  const t = el('div', { className: 'toast' }, msg);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), duration);
}
