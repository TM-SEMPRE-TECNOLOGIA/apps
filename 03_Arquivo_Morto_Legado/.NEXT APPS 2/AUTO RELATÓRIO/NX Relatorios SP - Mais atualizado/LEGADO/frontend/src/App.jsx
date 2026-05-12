import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import ConfigPanel from './components/ConfigPanel';
import ActionBar from './components/ActionBar';
import LogPanel from './components/LogPanel';
import Preview from './components/Preview';
import Changelog from './components/Changelog';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'changelog'

  // Estado global do relatório
  const [pastaRaiz, setPastaRaiz] = useState('');
  const [modeloSelecionado, setModeloSelecionado] = useState('');
  const [pastaSaida, setPastaSaida] = useState('');
  const [logs, setLogs] = useState(["✅ Pronto. Selecione a pasta raiz e o modelo."]);
  const [conteudo, setConteudo] = useState(null); // array = preview aberto

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
  };

  if (currentPage === 'changelog') {
    return (
      <div className="app-container">
        <Header onNav={(page) => setCurrentPage(page)} currentPage={currentPage} />
        <Changelog />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header onNav={(page) => setCurrentPage(page)} currentPage={currentPage} />

      <main className="main-content">
        {!conteudo ? (
          <div className="dashboard-grid">
            <div className="left-col">
              <ConfigPanel
                pastaRaiz={pastaRaiz} setPastaRaiz={setPastaRaiz}
                modeloSelecionado={modeloSelecionado} setModeloSelecionado={setModeloSelecionado}
                pastaSaida={pastaSaida} setPastaSaida={setPastaSaida}
                addLog={addLog}
              />
              <ActionBar
                pastaRaiz={pastaRaiz}
                modeloSelecionado={modeloSelecionado}
                pastaSaida={pastaSaida}
                addLog={addLog}
                setConteudo={setConteudo}
              />
            </div>
            <div className="right-col">
              <LogPanel logs={logs} />
            </div>
          </div>
        ) : (
          <Preview
            conteudo={conteudo}
            setConteudo={setConteudo}
            pastaRaiz={pastaRaiz}
            modeloSelecionado={modeloSelecionado}
            pastaSaida={pastaSaida}
            addLog={addLog}
          />
        )}
      </main>
    </div>
  );
}

export default App;
