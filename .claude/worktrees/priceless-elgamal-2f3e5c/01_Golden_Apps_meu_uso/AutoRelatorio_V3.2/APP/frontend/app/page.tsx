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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  const [modalData, setModalData] = useState<Record<string, any>>({});
  const [annotatedImages, setAnnotatedImages] = useState<Record<string, string>>({});
  // V3: atribuição de ambientes por foto
  const [ambienteData, setAmbienteData] = useState<Record<string, string[]>>({});
  const [customAmbienteItems, setCustomAmbienteItems] = useState<[string[], string[], string[], string[]]>([[], [], [], []]);

  const handleAddCustomAmbiente = (levelIdx: number, item: string) => {
    setCustomAmbienteItems(prev => {
      const next = [...prev] as [string[], string[], string[], string[]];
      next[levelIdx] = [...next[levelIdx], item];
      return next;
    });
  };
  // Metadados dinâmicos: chave → valor, preenchidos com base nos placeholders do template
  const [metaFields, setMetaFields] = useState<Record<string, string>>({});
  const [templatePlaceholders, setTemplatePlaceholders] = useState<string[]>([]);
  // Estado de varredura: scanDone = resposta chegou, gridReady = thumbnails carregados
  const [scanDone, setScanDone] = useState(false);
  const [gridReady, setGridReady] = useState(false);
  const [docGerado, setDocGerado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const isScanning = loading || (scanDone && !gridReady);
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

  const fetchPlaceholders = async (templateName: string) => {
    if (!templateName) return;
    try {
      const res = await fetch(`${API_URL}/api/template-placeholders?template=${encodeURIComponent(templateName)}`);
      const data = await res.json();
      if (data.placeholders) {
        setTemplatePlaceholders(data.placeholders);
        // Preserva valores já digitados; inicializa novos campos em branco
        setMetaFields(prev => {
          const next: Record<string, string> = {};
          for (const key of data.placeholders) {
            next[key] = prev[key] ?? '';
          }
          return next;
        });
      }
    } catch {
      // silently fail — template pode não ter placeholders
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_URL}/api/templates`);
      const data = await res.json();
      const list: string[] = Array.isArray(data) ? data : (data.templates ?? []);
      if (list.length > 0) {
        setTemplates(list);
        setModeloSelecionado(list[0]);
        fetchPlaceholders(list[0]);
      }
    } catch (err) {
      addLog("Erro ao carregar templates. Verifique se o backend Python está rodando.", "error");
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
    setScanDone(false);
    setGridReady(false);
    setConteudo(null);
    addLog("Iniciando varredura de pastas...", "process");
    try {
      const res = await fetch(`${API_URL}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pasta_raiz: pastaRaiz, pasta_saida: pastaSaida, tipo_relatorio: tipoRelatorio })
      });
      const data = await res.json();
      if (data.conteudo) {
        setConteudo(data.conteudo);
        setScanDone(true); // scan terminou — aguarda grid confirmar render
        addLog(`Varredura concluída. ${data.conteudo.length} elementos encontrados.`, "success");
      } else {
        addLog(data.detail || "Erro inesperado no scan.", "error");
        setGridReady(true); // libera overlay mesmo em erro
      }
    } catch (err) {
      addLog("Erro na comunicação com o servidor.", "error");
      setGridReady(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!pastaRaiz || !modeloSelecionado || !conteudo) {
      return addLog("Configurações incompletas para geração.", "error");
    }
    setIsGenerating(true);
    addLog("Iniciando geração do documento Word...", "process");
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
          selected_description_key: selectedDescription,
          modal_data: modalData,
          annotated_images: annotatedImages,
          meta_fields: metaFields,
          // Retrocompat SP2: repassa metaFields como meta_sp2 se no modo sp2
          ...(tipoRelatorio === 'sp2' ? { meta_sp2: metaFields } : {})
        })
      });
      const data = await res.json();
      if (data.message) {
        addLog(`✅ ${data.message}`, "success");
        addLog(`📊 Total de imagens: ${data.total_images}`, "info");
        addLog(`📄 Local: ${data.output_docx}`, "info");
        setDocGerado(data.output_docx);
      } else {
        const errMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        addLog(errMsg || "Erro na geração.", "error");
      }
    } catch (err) {
      addLog("Erro crítico na geração.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetApp = () => {
    if (window.confirm("Tem certeza que deseja resetar todo o progresso?")) {
      setPastaRaiz('');
      setModeloSelecionado(templates.length > 0 ? templates[0] : '');
      setPastaSaida('');
      setConteudo(null);
      setModalData({});
      setAnnotatedImages({});
      setMetaFields({});
      setScanDone(false);
      setGridReady(false);
      setDocGerado(null);
      setActiveStep(1);
      setLogs([
        { msg: "Sistema reiniciado com sucesso.", type: 'success' },
        { msg: "Relatório limpo. Aguardando nova entrada no 'Diretório Raiz'...", type: 'info' }
      ]);
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
    if (!docGerado || isDownloading) return;
    setIsDownloading(true);
    addLog("Iniciando download do relatório...", "process");
    try {
      const res = await fetch(`${API_URL}/api/download?path=${encodeURIComponent(docGerado)}`);
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = docGerado.split('\\').pop() || 'relatorio.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      addLog("✅ Download concluído!", "success");
    } catch (err) {
      addLog("Erro ao baixar o arquivo.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-brand-primary/10">
      
      {/* Header Premium - Desktop Reference */}
      <header className="h-16 bg-white border-b border-slate-100 flex items-center px-8 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
                <FileText className="text-white" size={18} />
             </div>
             <div className="flex flex-col">
               <h1 className="text-md font-black text-slate-800 leading-none">NX Relatórios</h1>
               <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">v2.1.0</span>
             </div>
          </div>

          <nav className="flex items-center h-16 gap-6">
             {['Dashboard'].map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative h-full px-2 text-[13px] font-bold transition-colors ${activeTab === tab ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {tab}
                 {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-primary rounded-t-full" />}
               </button>
             ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-3">
           <button onClick={() => openFolder('output')} className="h-10 px-5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-xl hover:bg-slate-200 transition-colors">
              Abrir Saída
           </button>
           <button 
            disabled={!docGerado} 
            onClick={handleDownload}
            className={`h-10 px-5 bg-brand-primary text-white text-[11px] font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-colors ${!docGerado ? 'opacity-40 cursor-not-allowed' : ''}`}
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
          setModeloSelecionado={(m) => { setModeloSelecionado(m); fetchPlaceholders(m); }}
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
          metaFields={metaFields}
          setMetaFields={setMetaFields}
          templatePlaceholders={templatePlaceholders}
          isScanning={isScanning}
        />

        {/* LADO DIREITO: Preview Area */}
        <section className="lg:col-span-8 xl:col-span-9 flex flex-col h-full">
          <PreviewGrid
             conteudo={conteudo}
             apiUrl={API_URL}
             modalData={modalData}
             setModalData={setModalData}
             annotatedImages={annotatedImages}
             setAnnotatedImages={setAnnotatedImages}
             ambienteData={ambienteData}
             setAmbienteData={setAmbienteData}
             customAmbienteItems={customAmbienteItems}
             onAddCustomAmbiente={handleAddCustomAmbiente}
             isScanning={isScanning}
             onGridReady={() => setGridReady(true)}
          />
        </section>
      </main>

      {/* Footer Console (Fixed Bottom) */}
      <footer className="w-full">
        <ConsoleWatcher logs={logs} onReset={resetApp} />
      </footer>
    </div>
  );
}

