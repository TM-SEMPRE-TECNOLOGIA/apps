import { useState, useEffect } from 'react';
import './App.css';

type Doc = { name: string; status: 'done' | 'pending'; sizeKb: number };
type Phase = {
  id: string;
  name: string;
  folder: string;
  agent: string;
  status: 'done' | 'pending' | 'in_progress';
  docs: Doc[];
};

type StatusData = {
  lastUpdate: string;
  projectName: string;
  orchestrator: string;
  phases: Phase[];
};

function App() {
  const [data, setData] = useState<StatusData | null>(null);

  useEffect(() => {
    // Polling do status.json a cada 2 segundos
    const fetchData = async () => {
      try {
        const res = await fetch('/status.json?' + new Date().getTime());
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Erro ao carregar o status", e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="loading">Iniciando conexão com Squad...</div>;

  const totalPhases = data.phases.length;
  const completedPhases = data.phases.filter(p => p.status === 'done').length;
  const progress = Math.round((completedPhases / totalPhases) * 100);

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-content">
          <div className="brand">
            <div className="pulse-dot"></div>
            <h1>OpenSquad <span>Telemetry</span></h1>
          </div>
          <div className="meta-info">
            <span className="badge">{data.orchestrator}</span>
            <span className="last-sync">Sync: {new Date(data.lastUpdate).toLocaleTimeString()}</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="project-header">
          <h2>Projeto alvo: {data.projectName}</h2>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">Progresso Geral: {progress}% concluído</p>
        </div>

        <div className="nodes-grid">
          {data.phases.map((phase) => (
            <div key={phase.id} className={`node-card status-${phase.status}`}>
              <div className="node-header">
                <span className="node-id">Fase {phase.id}</span>
                <span className={`status-icon ${phase.status}`}></span>
              </div>
              <h3 className="node-title">{phase.name}</h3>
              <div className="agent-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {phase.agent}
              </div>
              
              <ul className="docs-list">
                {phase.docs.map((doc, i) => (
                  <li key={i} className={`doc-item ${doc.status}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span className="doc-name">{doc.name}</span>
                    {doc.sizeKb > 0 && <span className="doc-size">{doc.sizeKb}kb</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
