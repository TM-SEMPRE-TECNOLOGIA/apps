/* global React */
const { useState } = React;

function Header({ mode, setMode, dark, setDark }) {
  return (
    <header style={headerStyles.root}>
      <div style={headerStyles.brand}>
        <span style={headerStyles.dot} />
        <h1 style={headerStyles.wordmark}>TM Construtora</h1>
        <span style={headerStyles.versionPill}>v2.0</span>
      </div>

      <div style={headerStyles.modeWrap}>
        <button onClick={() => setMode('trad')} style={{...headerStyles.modeBtn, ...(mode==='trad'?headerStyles.modeBtnActive:{})}}>Tradicional</button>
        <button onClick={() => setMode('sp')} style={{...headerStyles.modeBtn, ...(mode==='sp'?headerStyles.modeBtnActive:{})}}>São Paulo</button>
      </div>

      <button style={headerStyles.themeBtn} onClick={() => setDark(d => !d)} aria-label="Alternar tema">
        {dark ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>
    </header>
  );
}

const headerStyles = {
  root: { background: 'var(--tm-bg-card)', borderBottom: '1px solid var(--tm-border)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 18, position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--TM-shadow-sm)' },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  dot: { width: 12, height: 12, background: 'var(--TM-primary)', flexShrink: 0 },
  wordmark: { fontFamily: 'var(--TM-font-serif)', fontWeight: 600, fontSize: 18, margin: 0, color: 'var(--tm-text)', letterSpacing: '-0.005em' },
  versionPill: { fontFamily: 'var(--TM-font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', padding: '3px 8px', borderRadius: 3, background: '#1A1A1A', color: '#FFF' },
  modeWrap: { display: 'flex', gap: 0, padding: 3, background: 'var(--tm-bg-muted)', borderRadius: 6, marginLeft: 'auto', border: '1px solid var(--tm-border)' },
  modeBtn: { padding: '6px 14px', borderRadius: 4, border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, color: 'var(--tm-text-muted)', cursor: 'pointer' },
  modeBtnActive: { background: 'var(--tm-bg-card)', color: 'var(--TM-primary)', boxShadow: 'var(--TM-shadow-sm)', fontWeight: 600 },
  themeBtn: { width: 34, height: 34, borderRadius: 6, border: '1px solid var(--tm-border)', background: 'var(--tm-bg-card)', color: 'var(--tm-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

window.Header = Header;
