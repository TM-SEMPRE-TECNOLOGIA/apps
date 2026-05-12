"use client";

import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  FolderOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

// Componentes modulares
import SidebarWizard from '../components/SidebarWizard';
import PreviewGrid from '../components/PreviewGrid';
import ConsoleWatcher from '../components/ConsoleWatcher';

const API_URL = "http://127.0.0.1:5000";

export default function Home() {
  const [pastaRaiz, setPastaRaiz] = useState('');
  const [modeloSelecionado, setModeloSelecionado] = useState('');
  const [pastaSaida, setPastaSaida] = useState('');
  const [tipoRelatorio, setTipoRelatorio] = useState('tradicional');
  const [templates, setTemplates] = useState<string[]>([]);
  const [logs, setLogs] = useState<{ msg: string, type: 'info' | 'success' | 'error' | 'process' }[]>([
    { msg: "Sistema iniciado com sucesso. Versão do Motor: 2.1.0-STABLE", type: 'success' },
    { msg: "Conexão com repositório de templates DOCX estabelecida.", type: 'success' },
    { msg: "Aguardando entrada do usuário no módulo 'Diretório Raiz'...", type: 'info' }
  ]);
  const [conteudo, setConteudo] = useState<any[] | null>(null);
  const [docGerado, setDocGerado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('Desc 1');
  const [activeStep, setActiveStep] = useState(1);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const descriptionsOptions = [
    { id: 'Desc 1', label: 'Descrição 1' },
    { id: 'Desc 2', label: 'Descrição 2' },
    { id: 'Desc 3', label: 'Descrição 3' },
    { id: 'Desc 4', label: 'Descrição 4' },
  ];

  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'process' = 'info') => {
    setLogs(prev => [...prev, { msg, type }]);
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_URL}/api/templates`);
      const data = await res.json();
      if (data.templates) {
        setTemplates(data.templates);
        if (data.templates.length > 0) setModeloSelecionado(data.templates[0]);
      }
    } catch (err) {
      addLog("Erro ao carregar templates.", "error");
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchTemplates();
  }, []);

  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  const selectFolder = async (type: 'raiz' | 'saida') => {
    try {
      const res = await fetch(`${API_URL}/api/dialog/folder`);
      const data = await res.json();
      if (data.path) {
        if (type === 'raiz') {
          setPastaRaiz(data.path);
          addLog(`Pasta raiz selecionada: ${data.path}`, "success");
        } else {
          setPastaSaida(data.path);
          addLog(`Pasta de saída selecionada: ${data.path}`, "success");
        }
      }
    } catch (err) {
      addLog("Erro ao abrir seletor de pastas.", "error");
    }
  };

  const handleScan = async () => {
    if (!pastaRaiz) return addLog("Selecione uma pasta raiz antes de escanear.", "error");
    setLoading(true);
    addLog("Iniciando varredura...", "process");
    try {
      const res = await fetch(`${API_URL}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pasta_raiz: pastaRaiz, pasta_saida: pastaSaida, tipo_relatorio: tipoRelatorio })
      });
      const data = await res.json();
      if (data.conteudo) {
        setConteudo(data.conteudo);
        addLog(`Varredura concluída. ${data.conteudo.length} elementos encontrados.`, "success");
      }
    } catch (err) {
      addLog("Erro na comunicação com o servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!pastaRaiz || !modeloSelecionado || !conteudo) return;
    setIsGenerating(true);
    addLog("Iniciando geração do documento...", "process");
    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pasta_raiz: pastaRaiz,
          modelo: modeloSelecionado,
          pasta_saida: pastaSaida || "output",
          conteudo: conteudo,
          tipo_relatorio: tipoRelatorio,
          selected_description_key: selectedDescription
        })
      });
      const data = await res.json();
      if (data.message) {
        addLog(`✅ ${data.message}`, "success");
        setDocGerado(data.output_docx);
      }
    } catch (err) {
      addLog("Erro crítico na geração.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const openFolder = async (path: string) => {
    try {
      await fetch(`${API_URL}/api/open-folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });
    } catch (err) {
      addLog("Erro ao abrir pasta.", "error");
    }
  };

  const handleDownload = async () => {
    if (!docGerado) return;
    setIsDownloading(true);
    try {
      const res = await fetch(`${API_URL}/api/download?path=${encodeURIComponent(docGerado)}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = docGerado.split('\\').pop() || 'relatorio.docx';
      a.click();
      window.URL.revokeObjectURL(url);
      addLog("Download concluído!", "success");
    } catch (err) {
      addLog("Erro ao baixar o arquivo.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-teal-600/10">
      
      {/* Header Premium - Desktop Reference */}
      <header className="h-20 bg-white border-b border-slate-100 flex items-center px-10 sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-600/20">
                <FileText className="text-white" size={20} />
             </div>
             <div className="flex flex-col">
               <h1 className="text-lg font-black text-slate-800 leading-none">NX Relatórios</h1>
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">v2.1.0</span>
             </div>
          </div>

          <nav className="flex items-center h-20 gap-8">
             {['Dashboard', 'Logs de Execução'].map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative h-full px-2 text-[13px] font-bold transition-colors ${activeTab === tab ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {tab}
                 {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-teal-600 rounded-t-full" />}
               </button>
             ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-3">
           <button onClick={() => openFolder('output')} className="h-11 px-6 bg-slate-100 text-slate-700 text-[12px] font-bold rounded-xl hover:bg-slate-200 transition-colors">
              Abrir Saída
           </button>
           <button 
            disabled={!docGerado} 
            onClick={handleDownload}
            className={`h-11 px-6 bg-teal-600 text-white text-[12px] font-bold rounded-xl shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-colors ${!docGerado ? 'opacity-40 cursor-not-allowed' : ''}`}
           >
              Baixar Relatório
           </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        
        {/* LADO ESQUERDO: Wizard de Configuração */}
        <SidebarWizard 
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          tipoRelatorio={tipoRelatorio}
          setTipoRelatorio={setTipoRelatorio}
          pastaRaiz={pastaRaiz}
          selectFolder={selectFolder}
          modeloSelecionado={modeloSelecionado}
          setModeloSelecionado={setModeloSelecionado}
          templates={templates}
          fetchTemplates={fetchTemplates}
          selectedDescription={selectedDescription}
          setSelectedDescription={setSelectedDescription}
          descriptionsOptions={descriptionsOptions}
          handleScan={handleScan}
          handleGenerate={handleGenerate}
          loading={loading}
          isGenerating={isGenerating}
          hasConteudo={!!conteudo}
        />

        {/* LADO DIREITO: Preview Area */}
        <section className="lg:col-span-8 xl:col-span-9 flex flex-col h-full">
           <PreviewGrid conteudo={conteudo} apiUrl={API_URL} />
        </section>
      </main>

      {/* Footer Console (Fixed Bottom) */}
      <footer className="w-full">
        <ConsoleWatcher logs={logs} />
      </footer>
    </div>
  );
}
