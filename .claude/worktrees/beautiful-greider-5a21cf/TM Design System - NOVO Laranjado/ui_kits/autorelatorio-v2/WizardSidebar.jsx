/* global React */

const WIZARD_STEPS = [
  { id: 1, code: '01.00', label: 'Pasta',     desc: 'Selecionar diretório' },
  { id: 2, code: '02.00', label: 'Modo',      desc: 'Tradicional ou SP' },
  { id: 3, code: '03.00', label: 'Scan',      desc: 'Reconhecimento' },
  { id: 4, code: '04.00', label: 'Edição',    desc: 'Anotar fotos' },
  { id: 5, code: '05.00', label: 'Contexto',  desc: 'Detalhes do laudo' },
  { id: 6, code: '06.00', label: 'Gerar',     desc: 'Word .docx' },
];

function WizardSidebar({ step, onStep }) {
  return (
    <aside style={wizStyles.root}>
      <div style={wizStyles.head}>
        <span style={wizStyles.kicker}>FLUXO · 6 ETAPAS</span>
        <h2 style={wizStyles.title}>Geração do<br/>Relatório</h2>
      </div>
      <ol style={wizStyles.list}>
        {WIZARD_STEPS.map((s, i) => {
          const state = s.id < step ? 'done' : s.id === step ? 'active' : 'idle';
          return (
            <li key={s.id} style={wizStyles.item} onClick={() => onStep(s.id)}>
              <div style={{ ...wizStyles.bullet, ...wizStyles[`bullet_${state}`] }}>
                {state === 'done' ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : null}
              </div>
              <div style={wizStyles.body}>
                <div style={wizStyles.code}>{s.code}</div>
                <div style={wizStyles.label}>{s.label}</div>
                <div style={wizStyles.desc}>{s.desc}</div>
              </div>
              {i < WIZARD_STEPS.length - 1 && <div style={wizStyles.connector} />}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

const wizStyles = {
  root: { width: 240, background: 'var(--tm-bg-sidebar)', borderRight: '1px solid var(--tm-border)', padding: '24px 18px', flexShrink: 0 },
  head: { paddingBottom: 18, borderBottom: '1px solid var(--tm-border)', marginBottom: 18 },
  kicker: { fontFamily: 'var(--TM-font-mono)', fontSize: 10, letterSpacing: '0.15em', color: 'var(--tm-text-subtle)', textTransform: 'uppercase', fontWeight: 500 },
  title: { fontFamily: 'var(--TM-font-serif)', fontWeight: 600, fontSize: 20, margin: '6px 0 0', color: 'var(--tm-text)', lineHeight: 1.2, letterSpacing: '-0.01em' },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  item: { display: 'flex', gap: 12, padding: '6px 4px', position: 'relative', cursor: 'pointer', borderRadius: 4 },
  bullet: { width: 16, height: 16, borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 2, marginTop: 2 },
  bullet_idle:   { background: 'transparent', color: 'transparent', border: '1px solid var(--tm-border)' },
  bullet_active: { background: 'var(--TM-primary)', color: '#fff' },
  bullet_done:   { background: '#1A1A1A', color: '#fff' },
  body: { flex: 1 },
  code: { fontFamily: 'var(--TM-font-mono)', fontSize: 10, color: 'var(--tm-text-subtle)', letterSpacing: '0.06em', fontWeight: 500 },
  label: { fontWeight: 600, fontSize: 14, color: 'var(--tm-text)', marginTop: 1 },
  desc: { fontSize: 12, color: 'var(--tm-text-muted)', marginTop: 1 },
  connector: { position: 'absolute', left: 11, top: 26, width: 1, height: 'calc(100% - 4px)', background: 'var(--tm-border)', zIndex: 1 },
};

window.WizardSidebar = WizardSidebar;
