/* global React */
/* Chat components — TM·Zap (WhatsApp-like, brand TM Construtora) */

const cs = {
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

/* personas + cores fixas para as etiquetas dos nomes */
const personas = {
  thiago:  { name: 'Eng. Thiago',   color: cs.orange, you: true,  initials: 'TN' },
  marcos:  { name: 'Sup. Marcos',   color: cs.blue,   you: false, initials: 'MS' },
  daniel:  { name: 'Cliente Daniel',color: cs.red,    you: false, initials: 'DC' },
  bot:     { name: 'TM·bot',        color: cs.ink,    you: false, bot: true,  initials: 'TM' },
};

/* ─────────── chat header ─────────── */
function ChatHeader() {
  return (
    <div style={ch.bar}>
      <button style={ch.back} aria-label="Voltar">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div style={ch.avatars}>
        {['#475569','#334155','#C8541C','#3A5A2C'].map((c, i) => (
          <span key={i} style={{ ...ch.avDot, background: c, marginLeft: i ? -8 : 0, zIndex: 4 - i }} />
        ))}
      </div>
      <div style={ch.title}>
        <div style={ch.tName}>MAFFENG · Bloco A</div>
        <div style={ch.tSub}>Inspeção 15·04 · 4 membros</div>
      </div>
      <button style={ch.menu} aria-label="Menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></svg>
      </button>
    </div>
  );
}
const ch = {
  bar: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px 10px 6px', background: cs.card, borderBottom: `1px solid ${cs.border}`, position: 'sticky', top: 0, zIndex: 30 },
  back: { width: 32, height: 32, border: 'none', background: 'transparent', color: cs.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  avatars: { display: 'flex', alignItems: 'center', position: 'relative' },
  avDot: { width: 30, height: 30, borderRadius: '50%', border: `2px solid ${cs.card}`, display: 'inline-block' },
  title: { flex: 1, marginLeft: 6, minWidth: 0 },
  tName: { fontFamily: 'var(--TM-font-serif)', fontWeight: 600, fontSize: 15, color: cs.ink, letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  tSub: { fontFamily: 'var(--TM-font-mono)', fontSize: 10, color: cs.subtle, letterSpacing: '0.06em', marginTop: 1 },
  menu: { width: 32, height: 32, border: 'none', background: 'transparent', color: cs.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
};

/* ─────────── date separator ─────────── */
function DateSep({ children }) {
  return <div style={ds.wrap}><span style={ds.pill}>{children}</span></div>;
}
const ds = {
  wrap: { display: 'flex', justifyContent: 'center', margin: '14px 0 10px' },
  pill: { fontFamily: 'var(--TM-font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', padding: '4px 12px', borderRadius: 999, background: cs.paper, color: cs.muted, border: `1px solid ${cs.border}`, textTransform: 'uppercase' },
};

/* ─────────── system event ─────────── */
function SystemMsg({ children }) {
  return <div style={sy.wrap}><span style={sy.pill}>{children}</span></div>;
}
const sy = {
  wrap: { display: 'flex', justifyContent: 'center', margin: '6px 12px' },
  pill: { fontFamily: 'var(--TM-font-mono)', fontSize: 10, color: cs.subtle, letterSpacing: '0.08em', padding: '5px 12px', background: 'rgba(255,255,255,0.7)', border: `1px solid ${cs.border}`, borderRadius: 999, textTransform: 'uppercase', fontWeight: 500, textAlign: 'center', maxWidth: '85%' },
};

/* ─────────── read receipts ─────────── */
function Ticks({ read }) {
  const c = read ? cs.orange : cs.subtle;
  return (
    <svg width="14" height="10" viewBox="0 0 16 11" style={{ marginLeft: 4, verticalAlign: '-1px' }}>
      <polyline points="1.5 5.5 5 9 11 2.5" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="5 9 8 5.5" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="6 5.5 9.5 9 15 2.5" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─────────── bubble shell ─────────── */
function Bubble({ from, time, read, children, pad = '8px 12px', maxw = '78%' }) {
  const p = personas[from];
  const isOut = !!p.you;
  return (
    <div style={{ ...bb.row, justifyContent: isOut ? 'flex-end' : 'flex-start' }}>
      <div style={{
        maxWidth: maxw,
        background: isOut ? cs.orangeBg : (p.bot ? '#FFFCF8' : cs.card),
        border: p.bot ? `1px solid ${cs.border}` : '1px solid transparent',
        borderTop: p.bot ? `2px solid ${cs.ink}` : undefined,
        borderRadius: 8,
        padding: pad,
        boxShadow: '0 1px 0 rgba(26,26,26,0.04)',
        color: cs.ink,
      }}>
        {!isOut && <div style={{ ...bb.name, color: p.color }}>{p.bot ? <BotMark /> : null}{p.name}</div>}
        {children}
        <div style={bb.foot}>
          <span style={bb.time}>{time}</span>
          {isOut && <Ticks read={read}/>}
        </div>
      </div>
    </div>
  );
}
const bb = {
  row: { display: 'flex', padding: '2px 10px' },
  name: { fontFamily: 'var(--TM-font-sans)', fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.005em' },
  foot: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4 },
  time: { fontFamily: 'var(--TM-font-mono)', fontSize: 9, color: cs.subtle, letterSpacing: '0.06em' },
};

function BotMark() {
  return <span style={{ display: 'inline-block', width: 7, height: 7, background: cs.orange, marginRight: 4 }}/>;
}

/* ─────────── text bubble ─────────── */
function Text({ children }) {
  return <div style={{ fontSize: 14, lineHeight: 1.45, color: cs.ink, whiteSpace: 'pre-wrap' }}>{children}</div>;
}

/* ─────────── reply quote bar ─────────── */
function Quote({ author, text }) {
  const p = personas[author];
  return (
    <div style={{ borderLeft: `3px solid ${p.color}`, background: 'rgba(0,0,0,0.03)', padding: '5px 8px', borderRadius: 3, marginBottom: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: p.color, lineHeight: 1.2 }}>{p.name}</div>
      <div style={{ fontSize: 12, color: cs.muted, marginTop: 2, lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
    </div>
  );
}

/* ─────────── photo with annotation ─────────── */
function Photo({ tone = '#475569', caption, anomaly, num }) {
  return (
    <div style={{ width: 220, margin: '-2px -4px 6px' }}>
      <div style={{ position: 'relative', aspectRatio: '4/3', background: tone, borderRadius: 4, overflow: 'hidden', border: `1px solid ${cs.border}` }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        {anomaly && (
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 75" preserveAspectRatio="none">
            <defs><marker id={`ah-${num}`} markerWidth="6" markerHeight="6" refX="5" refY="2" orient="auto"><polygon points="0 0,6 2,0 4" fill={cs.orange}/></marker></defs>
            <line x1="22" y1="55" x2="55" y2="35" stroke={cs.orange} strokeWidth="1.5" markerEnd={`url(#ah-${num})`}/>
          </svg>
        )}
        {num && <span style={{ position: 'absolute', top: 5, left: 5, fontFamily: 'var(--TM-font-mono)', fontSize: 9, fontWeight: 600, padding: '2px 5px', background: 'rgba(26,26,26,0.8)', color: '#fff', letterSpacing: '0.08em', borderRadius: 2 }}>IMG·{num}</span>}
        {anomaly && (
          <span style={{ position: 'absolute', bottom: 5, left: 5, fontFamily: 'var(--TM-font-mono)', fontSize: 9, fontWeight: 600, padding: '3px 7px', background: cs.orange, color: '#fff', letterSpacing: '0.1em', borderRadius: 2 }}>ANOMALIA · {anomaly}</span>
        )}
      </div>
      {caption && <div style={{ fontSize: 13, color: cs.ink, marginTop: 5, lineHeight: 1.4 }}>{caption}</div>}
    </div>
  );
}

/* ─────────── voice note ─────────── */
function Voice({ duration = '0:34', playing = false }) {
  // fake waveform
  const bars = [3,5,8,12,10,14,18,11,6,9,16,13,7,4,8,11,15,9,5,3,6,10,12,8,4];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 2px', width: 200, margin: '-1px 0' }}>
      <button style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: cs.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, height: 24 }}>
        {bars.map((h, i) => (
          <span key={i} style={{ width: 2, height: h, background: i < 8 ? cs.orange : cs.subtle, borderRadius: 1, opacity: i < 8 ? 1 : 0.55 }}/>
        ))}
      </div>
      <span style={{ fontFamily: 'var(--TM-font-mono)', fontSize: 10, color: cs.muted, letterSpacing: '0.04em', flexShrink: 0 }}>{duration}</span>
    </div>
  );
}

/* ─────────── location pin embed ─────────── */
function LocationPin({ address }) {
  return (
    <div style={{ width: 220, margin: '-2px -4px 4px' }}>
      <div style={{ position: 'relative', height: 110, borderRadius: 4, overflow: 'hidden', border: `1px solid ${cs.border}`, background: '#EFEDE8' }}>
        {/* fake map grid */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="mapgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#DAD7D0" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapgrid)"/>
          <path d="M0 60 Q60 40 120 70 T 240 50" fill="none" stroke="#C8C5BD" strokeWidth="6" opacity="0.5"/>
          <path d="M0 60 Q60 40 120 70 T 240 50" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
        </svg>
        {/* pin */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -100%)' }}>
          <svg width="22" height="28" viewBox="0 0 24 30">
            <path d="M12 0c-6.6 0-12 5.4-12 12 0 9 12 18 12 18s12-9 12-18c0-6.6-5.4-12-12-12z" fill={cs.orange}/>
            <circle cx="12" cy="12" r="4" fill="#fff"/>
          </svg>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 5, fontSize: 12, color: cs.ink, lineHeight: 1.35 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={cs.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>{address}</span>
      </div>
    </div>
  );
}

/* ─────────── bot suggestion card ─────────── */
function BotCard({ title, body, actions, badge }) {
  return (
    <div style={{ width: 230, margin: '-1px -2px 4px' }}>
      {badge && (
        <div style={{ display: 'inline-block', fontFamily: 'var(--TM-font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', padding: '2px 7px', background: cs.ink, color: '#fff', marginBottom: 6, borderRadius: 2 }}>{badge}</div>
      )}
      <div style={{ fontFamily: 'var(--TM-font-serif)', fontWeight: 600, fontSize: 14, color: cs.ink, marginBottom: 4, letterSpacing: '-0.005em', lineHeight: 1.25 }}>{title}</div>
      {body && <div style={{ fontSize: 12, color: cs.muted, lineHeight: 1.5, marginBottom: actions ? 10 : 0 }}>{body}</div>}
      {actions && (
        <div style={{ display: 'flex', gap: 6 }}>
          {actions.map((a, i) => (
            <button key={i} style={{
              flex: 1, padding: '7px 8px', fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
              border: i === 0 ? 'none' : `1px solid ${cs.border}`,
              background: i === 0 ? cs.orange : 'transparent',
              color: i === 0 ? '#fff' : cs.ink,
              borderRadius: 4, cursor: 'pointer', letterSpacing: '0.01em',
            }}>{a}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────── poll ─────────── */
function Poll({ question, options }) {
  const total = options.reduce((a, o) => a + o.votes, 0);
  return (
    <div style={{ width: 230, margin: '-1px -2px 4px' }}>
      <div style={{ fontFamily: 'var(--TM-font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: cs.subtle, marginBottom: 4 }}>ENQUETE · {total} VOTOS</div>
      <div style={{ fontFamily: 'var(--TM-font-serif)', fontWeight: 600, fontSize: 14, color: cs.ink, marginBottom: 10, lineHeight: 1.3 }}>{question}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {options.map((o, i) => {
          const pct = total ? (o.votes / total * 100) : 0;
          return (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: cs.ink, fontWeight: o.votes ? 600 : 500 }}>{o.label}</span>
                <span style={{ fontFamily: 'var(--TM-font-mono)', color: cs.muted }}>{o.votes}</span>
              </div>
              <div style={{ height: 4, background: cs.paper, borderRadius: 0, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: o.votes ? cs.orange : cs.border, width: `${Math.max(pct, 4)}%` }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── file card (.docx) ─────────── */
function FileCard({ name, meta, actions }) {
  return (
    <div style={{ width: 230, margin: '-1px -2px 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: cs.paper, border: `1px solid ${cs.border}`, borderLeft: `3px solid ${cs.orange}`, borderRadius: 3 }}>
        <div style={{ width: 38, height: 46, background: '#fff', border: `1px solid ${cs.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--TM-font-mono)', fontSize: 8, fontWeight: 700, color: cs.orange, letterSpacing: '0.08em' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span style={{ marginTop: 2 }}>DOCX</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--TM-font-mono)', fontSize: 11, fontWeight: 600, color: cs.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          <div style={{ fontFamily: 'var(--TM-font-mono)', fontSize: 10, color: cs.muted, marginTop: 2, letterSpacing: '0.04em' }}>{meta}</div>
        </div>
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          {actions.map((a, i) => (
            <button key={i} style={{
              flex: 1, padding: '7px 6px', fontSize: 11, fontWeight: 600,
              fontFamily: 'inherit', borderRadius: 4, cursor: 'pointer',
              border: i === 0 ? 'none' : `1px solid ${cs.border}`,
              background: i === 0 ? cs.ink : 'transparent',
              color: i === 0 ? '#fff' : cs.ink,
            }}>{a}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────── input footer (composer) ─────────── */
function Composer({ typing }) {
  return (
    <div style={cp.wrap}>
      {typing && <div style={cp.typing}><span style={cp.typingDot}/>{typing} digitando…</div>}
      <div style={cp.bar}>
        <button style={cp.iconBtn} aria-label="Anexar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div style={cp.input}>Mensagem…</div>
        <button style={cp.iconBtn} aria-label="Câmera">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </button>
        <button style={cp.micBtn} aria-label="Gravar áudio">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
        </button>
      </div>
    </div>
  );
}
const cp = {
  wrap: { background: cs.card, borderTop: `1px solid ${cs.border}`, padding: '8px 10px 18px', position: 'sticky', bottom: 0 },
  typing: { display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--TM-font-mono)', fontSize: 10, color: cs.subtle, letterSpacing: '0.06em', padding: '0 4px 6px' },
  typingDot: { width: 6, height: 6, background: cs.orange, borderRadius: '50%', animation: 'tmPulse 1.2s ease-in-out infinite' },
  bar: { display: 'flex', alignItems: 'center', gap: 6 },
  iconBtn: { width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent', color: cs.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
  input: { flex: 1, height: 36, padding: '0 14px', display: 'flex', alignItems: 'center', background: cs.paper, border: `1px solid ${cs.border}`, borderRadius: 18, fontSize: 13, color: cs.subtle },
  micBtn: { width: 38, height: 38, borderRadius: '50%', border: 'none', background: cs.orange, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
};

/* ─────────── chat shell ─────────── */
function ChatShell({ children, typing }) {
  return (
    <div style={{ background: cs.paper, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ChatHeader />
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0 8px' }}>{children}</div>
      <Composer typing={typing} />
    </div>
  );
}

Object.assign(window, {
  ChatShell, ChatHeader, DateSep, SystemMsg, Bubble,
  Text, Quote, Photo, Voice, LocationPin, BotCard, Poll, FileCard,
});
