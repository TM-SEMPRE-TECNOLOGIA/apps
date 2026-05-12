/* global React */
const { useState: useEdState } = React;

function EditorModal({ photo, onClose }) {
  const [tool, setTool] = useEdState('arrow');
  if (!photo) return null;

  const tools = [
    { id: 'arrow', label: 'Seta',   icon: 'M5 12h14M13 6l6 6-6 6' },
    { id: 'rect',  label: 'Caixa',  icon: 'M3 3h18v18H3z' },
    { id: 'text',  label: 'Texto',  icon: 'M4 7V4h16v3M9 20h6M12 4v16' },
    { id: 'pen',   label: 'Caneta', icon: 'M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z' },
    { id: 'crop',  label: 'Crop',   icon: 'M6 2v14a2 2 0 0 0 2 2h14M18 22V8a2 2 0 0 0-2-2H2' },
  ];

  return (
    <div style={emStyles.scrim} onClick={onClose}>
      <div style={emStyles.modal} onClick={e => e.stopPropagation()}>
        <header style={emStyles.head}>
          <div>
            <span style={emStyles.kicker}>04.00 · EDITOR · FABRIC.JS</span>
            <h2 style={emStyles.title}>{photo.name}</h2>
          </div>
          <button style={emStyles.closeBtn} onClick={onClose} aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </header>

        <div style={emStyles.body}>
          <div style={emStyles.toolbar}>
            {tools.map(t => (
              <button key={t.id} onClick={() => setTool(t.id)} style={{ ...emStyles.toolBtn, ...(tool === t.id ? emStyles.toolBtnActive : {}) }} title={t.label}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon}/></svg>
                <span style={emStyles.toolLabel}>{t.label}</span>
              </button>
            ))}
          </div>
          <div style={emStyles.canvas}>
            <div style={{ ...emStyles.placeholder, background: photo.tone }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <svg style={emStyles.overlay} viewBox="0 0 600 400" preserveAspectRatio="none">
              <defs>
                <marker id="arrowheadOrange" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#C8541C"/>
                </marker>
              </defs>
              <line x1="120" y1="280" x2="320" y2="160" stroke="#C8541C" strokeWidth="3" markerEnd="url(#arrowheadOrange)"/>
              <text x="335" y="155" fill="#fff" fontFamily="Inter" fontWeight="600" fontSize="14" style={{ paintOrder: 'stroke', stroke: '#1A1A1A', strokeWidth: 4 }}>Trinca de retração</text>
            </svg>
          </div>
        </div>

        <footer style={emStyles.foot}>
          <span style={emStyles.footHint}>Ctrl+Z desfaz · ESC fecha</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={emStyles.btnSecondary} onClick={onClose}>Cancelar</button>
            <button style={emStyles.btnPrimary} onClick={onClose}>Salvar Alterações</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

const emStyles = {
  scrim: { position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 },
  modal: { width: '100%', maxWidth: 880, background: 'var(--tm-bg-card)', borderRadius: 8, boxShadow: 'var(--TM-shadow-xl)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh', border: '1px solid var(--tm-border)' },
  head: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--tm-border)' },
  kicker: { fontFamily: 'var(--TM-font-mono)', fontSize: 10, letterSpacing: '0.15em', color: 'var(--tm-text-subtle)', fontWeight: 500 },
  title: { fontFamily: 'var(--TM-font-serif)', fontWeight: 600, fontSize: 19, margin: '4px 0 0', color: 'var(--tm-text)', letterSpacing: '-0.005em' },
  closeBtn: { width: 30, height: 30, borderRadius: 4, border: '1px solid var(--tm-border)', background: 'transparent', color: 'var(--tm-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  body: { display: 'flex', minHeight: 380, flex: 1 },
  toolbar: { width: 92, padding: 10, borderRight: '1px solid var(--tm-border)', display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--tm-bg-sidebar)' },
  toolBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 6px', borderRadius: 4, border: '1px solid transparent', background: 'transparent', color: 'var(--tm-text-muted)', cursor: 'pointer', fontFamily: 'inherit' },
  toolBtnActive: { background: 'var(--TM-primary-light)', color: 'var(--TM-primary)', borderColor: 'rgba(200,84,28,0.25)' },
  toolLabel: { fontSize: 10, fontFamily: 'var(--TM-font-mono)', letterSpacing: '0.05em' },
  canvas: { flex: 1, position: 'relative', background: '#1A1A1A' },
  placeholder: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  overlay: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  foot: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px', borderTop: '1px solid var(--tm-border)' },
  footHint: { fontFamily: 'var(--TM-font-mono)', fontSize: 11, color: 'var(--tm-text-subtle)' },
  btnSecondary: { padding: '8px 16px', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', borderRadius: 6, border: '1px solid var(--tm-border)', background: 'transparent', color: 'var(--tm-text)', cursor: 'pointer' },
  btnPrimary: { padding: '8px 18px', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', borderRadius: 6, border: 'none', background: 'var(--TM-primary)', color: '#fff', cursor: 'pointer' },
};

window.EditorModal = EditorModal;
