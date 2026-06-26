/* global React */
const { useState: usePcState } = React;

const DESCRIPTIONS = [
  'Vista geral do ambiente',
  'Detalhe da anomalia identificada',
  'Após intervenção corretiva',
  'Conformidade verificada',
];

function PhotoCard({ photo, onEdit }) {
  const [desc, setDesc] = usePcState(photo.desc || 0);

  return (
    <div style={pcStyles.card}>
      <div style={pcStyles.thumb}>
        <div style={{ ...pcStyles.placeholder, background: photo.tone }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <span style={pcStyles.fileTag}>{photo.name}</span>
        {photo.edited && (
          <span style={pcStyles.editedTag}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            EDITADA
          </span>
        )}
        <button style={pcStyles.editBtn} onClick={() => onEdit(photo)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
          Editar
        </button>
      </div>
      <div style={pcStyles.descArea}>
        <label style={pcStyles.descLabel}>DESCRIÇÃO</label>
        <select value={desc} onChange={e => setDesc(+e.target.value)} style={pcStyles.select}>
          {DESCRIPTIONS.map((d, i) => <option key={i} value={i}>{d}</option>)}
        </select>
      </div>
    </div>
  );
}

const pcStyles = {
  card: { background: 'var(--tm-bg-card)', border: '1px solid var(--tm-border)', borderRadius: 6, overflow: 'hidden', boxShadow: 'var(--TM-shadow-sm)', transition: 'all 0.2s ease' },
  thumb: { aspectRatio: '4/3', position: 'relative', overflow: 'hidden' },
  placeholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  fileTag: { position: 'absolute', bottom: 8, left: 8, fontFamily: 'var(--TM-font-mono)', fontSize: 10, padding: '2px 6px', borderRadius: 2, background: 'rgba(26,26,26,0.8)', color: '#fff', letterSpacing: '0.04em', fontWeight: 500 },
  editedTag: { position: 'absolute', top: 8, left: 8, display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--TM-font-mono)', fontSize: 9, fontWeight: 600, padding: '3px 7px', borderRadius: 2, background: 'var(--TM-primary)', color: '#fff', letterSpacing: '0.1em' },
  editBtn: { position: 'absolute', top: 8, right: 8, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 9px', fontSize: 12, fontWeight: 500, fontFamily: 'inherit', borderRadius: 4, border: 'none', background: 'rgba(255,255,255,0.95)', color: 'var(--tm-text)', cursor: 'pointer', boxShadow: 'var(--TM-shadow-sm)' },
  descArea: { padding: 12, borderTop: '1px solid var(--tm-border)' },
  descLabel: { fontFamily: 'var(--TM-font-mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--tm-text-subtle)', display: 'block', marginBottom: 6, fontWeight: 500 },
  select: { width: '100%', padding: '7px 10px', fontFamily: 'inherit', fontSize: 13, color: 'var(--tm-text)', background: 'var(--tm-bg-input)', border: '1px solid var(--tm-border)', borderRadius: 4, cursor: 'pointer' },
};

window.PhotoCard = PhotoCard;
