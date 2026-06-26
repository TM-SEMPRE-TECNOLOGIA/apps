/* global React */

function Console({ logs }) {
  return (
    <div style={cnStyles.root}>
      <div style={cnStyles.head}>
        <div style={cnStyles.dots}>
          <span style={{ ...cnStyles.dot, background: '#A33B2A' }}/>
          <span style={{ ...cnStyles.dot, background: '#C8541C' }}/>
          <span style={{ ...cnStyles.dot, background: '#4F7A3A' }}/>
        </div>
        <span style={cnStyles.title}>backend · uvicorn :5000</span>
        <span style={cnStyles.live}><span style={cnStyles.pulse}/>LIVE</span>
      </div>
      <div style={cnStyles.body}>
        {logs.map((l, i) => (
          <div key={i} style={cnStyles.line}>
            <span style={cnStyles.time}>{l.t}</span>
            <span style={{ ...cnStyles.level, color: levelColor(l.level) }}>{l.level}</span>
            <span style={cnStyles.msg}>{l.msg}</span>
          </div>
        ))}
        <div style={cnStyles.cursorLine}><span style={cnStyles.prompt}>$</span><span style={cnStyles.cursor}/></div>
      </div>
    </div>
  );
}

function levelColor(l) {
  return { INFO: '#7BA1C5', OK: '#9CC089', WARN: '#E47A4A', ERR: '#D67264' }[l] || '#A8A6A0';
}

const cnStyles = {
  root: { background: '#1A1A1A', color: '#EFEDE8', borderTop: '1px solid var(--tm-border)', fontFamily: 'var(--TM-font-mono)', fontSize: 12 },
  head: { padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #2B2B2B' },
  dots: { display: 'flex', gap: 6 },
  dot: { width: 9, height: 9, borderRadius: '50%' },
  title: { color: '#8C8A85', letterSpacing: '0.06em' },
  live: { marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, color: '#E47A4A', fontSize: 10, letterSpacing: '0.15em', fontWeight: 600 },
  pulse: { width: 8, height: 8, borderRadius: '50%', background: '#E47A4A', animation: 'tmPulse 2s ease-in-out infinite' },
  body: { padding: '10px 14px', maxHeight: 140, overflow: 'auto', lineHeight: 1.7 },
  line: { display: 'flex', gap: 10 },
  time: { color: '#5C5A55', minWidth: 70 },
  level: { fontWeight: 600, minWidth: 46 },
  msg: { color: '#C8C6C0', flex: 1 },
  cursorLine: { display: 'flex', gap: 8, marginTop: 4 },
  prompt: { color: '#E47A4A' },
  cursor: { display: 'inline-block', width: 7, height: 13, background: '#E47A4A', animation: 'tmBlink 1s steps(2) infinite' },
};

window.Console = Console;
