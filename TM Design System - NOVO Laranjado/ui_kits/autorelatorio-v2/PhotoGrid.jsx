/* global React */

function PhotoGrid({ photos, onEdit }) {
  return (
    <div style={pgStyles.wrap}>
      <div style={pgStyles.headerRow}>
        <div>
          <span style={pgStyles.kicker}>02.00 · PASTA RECONHECIDA</span>
          <h2 style={pgStyles.title}>Inspeção Bloco A — 12 fotos</h2>
          <p style={pgStyles.path}>~/Inspeções/2026-04/MAFFENG-Bloco-A/</p>
        </div>
        <div style={pgStyles.stats}>
          <div style={pgStyles.stat}><span style={pgStyles.statValue}>12</span><span style={pgStyles.statLabel}>FOTOS</span></div>
          <div style={pgStyles.stat}><span style={pgStyles.statValue}>4</span><span style={pgStyles.statLabel}>EDITADAS</span></div>
          <div style={pgStyles.stat}><span style={pgStyles.statValueOk}>OK</span><span style={pgStyles.statLabel}>SCANNER</span></div>
        </div>
      </div>
      <div style={pgStyles.grid}>
        {photos.map(p => <window.PhotoCard key={p.id} photo={p} onEdit={onEdit} />)}
      </div>
    </div>
  );
}

const pgStyles = {
  wrap: { flex: 1, padding: 28, overflow: 'auto', minWidth: 0 },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid var(--tm-border)' },
  kicker: { fontFamily: 'var(--TM-font-mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--tm-text-subtle)', fontWeight: 500 },
  title: { fontFamily: 'var(--TM-font-serif)', fontWeight: 600, fontSize: 26, color: 'var(--tm-text)', margin: '6px 0 4px', letterSpacing: '-0.01em' },
  path: { fontFamily: 'var(--TM-font-mono)', fontSize: 13, color: 'var(--tm-text-muted)', margin: 0 },
  stats: { display: 'flex', gap: 8 },
  stat: { background: 'var(--tm-bg-card)', border: '1px solid var(--tm-border)', borderRadius: 4, padding: '10px 16px', textAlign: 'center', minWidth: 70, borderTop: '2px solid var(--TM-primary)' },
  statValue: { display: 'block', fontFamily: 'var(--TM-font-serif)', fontWeight: 600, fontSize: 22, color: 'var(--tm-text)', letterSpacing: '-0.01em' },
  statValueOk: { display: 'block', fontFamily: 'var(--TM-font-serif)', fontWeight: 600, fontSize: 22, color: 'var(--TM-primary)' },
  statLabel: { display: 'block', fontFamily: 'var(--TM-font-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'var(--tm-text-subtle)', textTransform: 'uppercase', marginTop: 2, fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 },
};

window.PhotoGrid = PhotoGrid;
