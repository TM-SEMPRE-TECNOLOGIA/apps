"use client";

import { useState, useEffect, useRef } from 'react';
import {
  FileArchive,
  FileText,
  Play,
  Terminal,
  Clock,
  ChevronRight,
  Trash2,
  LayoutGrid,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = ""; // Relative path for Vercel

export default function Home() {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [modeloSelecionado, setModeloSelecionado] = useState('');
  const [tipoRelatorio, setTipoRelatorio] = useState('tradicional');
  const [templates, setTemplates] = useState<string[]>([]);
  const [logs, setLogs] = useState<{ msg: string, type: 'info' | 'success' | 'error' | 'process' }[]>([
    { msg: "🚀 Engine Cloud iniciada. Aguardando upload do ZIP...", type: 'process' }
  ]);
  const [conteudo, setConteudo] = useState<any[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('Desc 1');
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const descriptionsOptions = [
    { id: 'Desc 1', label: 'Descrição 1' },
    { id: 'Desc 2', label: 'Descrição 2' },
    { id: 'Desc 3', label: 'Descrição 3' },
    { id: 'Desc 4', label: 'Descrição 4' },
  ];

  const logEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'process' = 'info') => {
    setLogs(prev => [...prev, { msg, type }]);
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`/templates.json`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTemplates(data);
        if (data.length > 0 && !modeloSelecionado) setModeloSelecionado(data[0]);
      }
    } catch (err) {
      addLog("Erro ao carregar templates hospedados.", "error");
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (mounted) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, mounted]);

  if (!mounted) return <div className="min-h-screen bg-bg-light" />;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.zip')) {
        setZipFile(file);
        addLog(`Arquivo ZIP pronto: ${file.name}`, "success");
      } else {
        addLog("Por favor, selecione apenas arquivos .zip", "error");
      }
    }
  };

  const handleScan = async () => {
    if (!zipFile) return addLog("Faça o upload de um ZIP antes de escanear.", "error");

    setLoading(true);
    addLog("Fazendo upload e processando fotos do ZIP...", "process");

    try {
      const formData = new FormData();
      formData.append('file', zipFile);
      
      const res = await fetch(`${API_URL}/api/scan-zip?tipo_relatorio=${tipoRelatorio}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (data.conteudo) {
        setConteudo(data.conteudo);
        setSessionId(data.session_id);
        addLog(`Varredura concluída. ${data.conteudo.length} elementos encontrados. Pronto para gerar.`, "success");
        setActiveStep(2);
      } else {
        addLog(data.detail || "Erro no processamento do ZIP.", "error");
      }
    } catch (err) {
      addLog("Erro na comunicação com a API Cloud.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!sessionId || !modeloSelecionado || !conteudo) {
      return addLog("Configurações incompletas (Falta upload ou modelo).", "error");
    }

    setIsGenerating(true);
    setIsDownloading(true);
    addLog("Gerando documento Word na nuvem...", "process");

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          modelo: modeloSelecionado,
          conteudo: conteudo,
          tipo_relatorio: tipoRelatorio,
          selected_description_key: selectedDescription
        })
      });

      if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Erro na geração");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RELATORIO_${tipoRelatorio.toUpperCase()}_${new Date().getTime()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      addLog("✅ Relatório gerado e baixado com sucesso!", "success");
    } catch (err: any) {
      addLog(`Erro crítico: ${err.message}`, "error");
    } finally {
      setIsGenerating(false);
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 selection:bg-brand-primary/20">
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/10 blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-200/60 shadow-2xl">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 rotate-3">
              <FileText className="text-slate-800" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter glow-text leading-none uppercase">NX RELATÓRIOS UP</h1>
              <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Cloud Edition v3.0</span>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
             {sessionId && (
               <div className="text-[10px] bg-slate-100 px-3 py-1.5 rounded-full font-mono text-slate-500 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  Sessão: {sessionId.substring(0,8)}...
               </div>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)] relative z-10">
        
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 h-full overflow-y-auto pr-2 custom-scrollbar pb-20">
          
          {/* STEP 1: UPLOAD ZIP */}
          <motion.div
            onClick={() => setActiveStep(1)}
            className={`premium-card !p-4 cursor-pointer border-l-4 transition-all duration-300 ${activeStep === 1 ? 'border-l-brand-primary bg-white shadow-lg' : 'border-l-transparent bg-white/40 opacity-70 hover:opacity-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeStep === 1 ? 'bg-brand-primary text-black' : 'bg-slate-200 text-slate-500'}`}>
                <FileArchive size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Origem (ZIP)</h3>
                <p className="text-[10px] text-slate-400">Suba as fotos da agência.</p>
              </div>
            </div>
            
            <AnimatePresence>
              {activeStep === 1 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setTipoRelatorio('tradicional'); }} className={`flex-1 py-1.5 px-2 text-[9px] font-bold uppercase rounded ${tipoRelatorio === 'tradicional' ? 'bg-brand-primary text-black' : 'bg-slate-100 text-slate-500'}`}>Tradicional</button>
                    <button onClick={(e) => { e.stopPropagation(); setTipoRelatorio('sp'); }} className={`flex-1 py-1.5 px-2 text-[9px] font-bold uppercase rounded ${tipoRelatorio === 'sp' ? 'bg-brand-primary text-black' : 'bg-slate-100 text-slate-500'}`}>Organizado SP</button>
                  </div>
                  
                  <div 
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-brand-primary/50 transition-colors bg-slate-50/50"
                  >
                    <Upload size={24} className={zipFile ? "text-brand-primary" : "text-slate-300"} />
                    <span className="text-[10px] font-bold text-slate-500 text-center">
                      {zipFile ? zipFile.name : "Clique para selecionar ZIP"}
                    </span>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".zip" className="hidden" />
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); handleScan(); }} 
                    disabled={!zipFile || loading}
                    className="btn-primary w-full py-2.5 text-[10px] font-black uppercase flex items-center justify-center gap-2"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={12} /> : <Play size={12} />}
                    {loading ? 'Processando...' : 'Iniciar Análise'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* STEP 2: MODELO */}
          <motion.div
            onClick={() => setActiveStep(2)}
            className={`premium-card !p-4 cursor-pointer border-l-4 transition-all duration-300 ${activeStep === 2 ? 'border-l-brand-secondary bg-white shadow-lg' : 'border-l-transparent bg-white/40 opacity-70 hover:opacity-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeStep === 2 ? 'bg-brand-secondary text-white' : 'bg-slate-200 text-slate-500'}`}>
                <span className="text-xs font-bold font-mono">02</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Modelo DOCX</h3>
                <p className="text-[10px] text-slate-400">Template do servidor.</p>
              </div>
            </div>
            
            <AnimatePresence>
              {activeStep === 2 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                  <select className="input-field h-10 text-xs truncate" value={modeloSelecionado} onChange={(e) => setModeloSelecionado(e.target.value)}>
                    <option value="" disabled>Escolha um modelo...</option>
                    {templates.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button onClick={(e) => { e.stopPropagation(); fetchTemplates(); }} className="btn-secondary w-full py-2 text-[10px] font-black uppercase">Atualizar Lista</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* STEP 3: DESCRIÇÃO */}
          <motion.div
            onClick={() => setActiveStep(3)}
            className={`premium-card !p-4 cursor-pointer border-l-4 transition-all duration-300 ${activeStep === 3 ? 'border-l-cyan-400 bg-white shadow-lg' : 'border-l-transparent bg-white/40 opacity-70 hover:opacity-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeStep === 3 ? 'bg-cyan-400 text-white' : 'bg-slate-200 text-slate-500'}`}>
                <span className="text-xs font-bold font-mono">03</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Descrição</h3>
                <p className="text-[10px] text-slate-400">Configuração de textos.</p>
              </div>
            </div>
            
            <AnimatePresence>
              {activeStep === 3 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                  <select className="input-field h-10 text-xs truncate" value={selectedDescription} onChange={(e) => setSelectedDescription(e.target.value)}>
                    {descriptionsOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <button 
            onClick={handleGenerate} 
            disabled={isGenerating || !conteudo || isDownloading} 
            className={`btn-primary w-full py-4 text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 mt-4 ${!conteudo ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
            {isGenerating ? 'GERANDO RELATÓRIO...' : 'GERAR E BAIXAR DOC'}
          </button>

        </aside>

        <section className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 h-full overflow-hidden">
          <div className="glass-panel rounded-2xl flex-1 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/60 bg-white/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LayoutGrid size={16} className="text-brand-primary" />
                <h3 className="font-bold text-sm text-slate-800">Visualização Cloud</h3>
              </div>
              {conteudo && (
                <span className="status-badge bg-brand-primary/10 text-brand-primary">{conteudo.filter((i: any) => i.imagem || i.imagem_fachada).length} Imagens</span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/10">
              {conteudo ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                   {conteudo.map((item: any, idx: number) => {
                     const isString = typeof item === 'string';
                     const imgPath = item.imagem || item.imagem_fachada;
                     const detailText = item.texto_padrao;
                     const descText = item.texto_descricao;
                     const tableData = item.tabela_medicao;
                     
                     if (imgPath) {
                       const isFachada = !!item.imagem_fachada;
                       const isDetalhe = !!item.is_detalhe;
                       return (
                         <div key={idx} className={`relative aspect-square rounded-xl border overflow-hidden shadow-sm group bg-white ${isFachada ? 'border-brand-primary border-2' : isDetalhe ? 'border-slate-200' : 'border-slate-100'}`}>
                           <img src={`${API_URL}/api/thumbnail?session_id=${sessionId}&path=${encodeURIComponent(imgPath)}`} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[8px] text-white px-2 text-center text-xs">Foto #{idx}</span>
                           </div>
                           {isFachada && <div className="absolute top-1 left-1 bg-brand-primary text-black text-[7px] font-black px-1.5 rounded-sm uppercase">Fachada</div>}
                         </div>
                       );
                     } else if (descText) {
                        return <div key={idx} className="col-span-full py-3 px-4 bg-slate-50 border border-slate-100 rounded-xl my-2 text-[10px] text-slate-700 italic">{descText.replace(/<RED>|<\/RED>/g, '')}</div>;
                     } else if (tableData) {
                        return <div key={idx} className="col-span-full md:col-span-2 py-2 px-3 bg-brand-primary/5 border border-brand-primary/10 rounded-lg text-[9px] font-bold">Tabela {tableData.tipo === 'pintura' ? 'Pintura' : 'Mobiliário'}</div>;
                     } else if (detailText) {
                        return <div key={idx} className="col-span-full py-2 mt-4 border-l-2 border-brand-secondary pl-2 text-[10px] font-black text-brand-secondary uppercase">{detailText}</div>;
                     } else if (isString) {
                       const isSub = item.includes('»');
                       return (
                         <div key={idx} className={`col-span-full py-2 mt-4 first:mt-0 border-b border-slate-100 flex items-center gap-3 ${isSub ? 'pl-8' : ''}`}>
                           <span className={`font-black uppercase tracking-widest ${isSub ? 'text-[8px] text-slate-400' : 'text-[11px] text-slate-700'}`}>{item.replace(/»/g, '')}</span>
                         </div>
                       );
                     }
                     return null;
                   })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                  <Upload size={48} className="mb-4 text-slate-400" />
                  <p className="text-xs font-bold uppercase tracking-widest">Aguardando upload do ZIP para análise...</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel rounded-2xl h-28 flex flex-col overflow-hidden bg-slate-900 border-none">
             <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-black/20">
               <div className="flex items-center gap-2">
                 <Terminal size={12} className="text-brand-primary" />
                 <span className="text-[9px] font-black text-white/40 tracking-widest uppercase">Cloud Engine Console</span>
               </div>
             </div>
             <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] text-white/80 custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className={`mb-1.5 flex gap-2 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-brand-primary' : 'text-slate-400'}`}>
                    <span className="opacity-30">[{new Date().toLocaleTimeString('pt-BR', { hour12: false })}]</span>
                    <span>{log.msg}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
             </div>
          </div>
        
        </section>
      </main>

      <footer className="mt-24 max-w-[1400px] mx-auto pt-12 border-t border-slate-200/60 pb-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 italic">
               NX RELATÓRIOS UP - CLOUD NATIVE 2026
            </p>
            <div className="h-6 w-[1px] bg-slate-100 hidden md:block" />
            <p className="text-[10px] font-bold text-slate-400 tracking-tight text-center md:text-left">
              © 2026 TM Sempre Tecnologia. All rights reserved.
            </p>
          </div>
          <div className="text-[11px] font-bold text-slate-500 hover:text-brand-primary transition-colors cursor-default">
            Thiago Nascimento Barbosa
          </div>
        </div>
      </footer>
    </div>
  );
}
