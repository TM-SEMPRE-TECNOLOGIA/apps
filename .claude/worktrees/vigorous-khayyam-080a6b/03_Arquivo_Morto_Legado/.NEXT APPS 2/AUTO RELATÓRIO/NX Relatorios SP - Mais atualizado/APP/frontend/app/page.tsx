"use client";

import { useState, useEffect, useRef } from 'react';
import {
  FolderOpen,
  FileText,
  Play,
  Eye,
  Terminal,
  CheckCircle2,
  Clock,
  ChevronRight,
  Trash2,
  LayoutGrid,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = "http://127.0.0.1:5000";

export default function Home() {
  const [pastaRaiz, setPastaRaiz] = useState('');
  const [modeloSelecionado, setModeloSelecionado] = useState('');
  const [pastaSaida, setPastaSaida] = useState('');
  const [tipoRelatorio, setTipoRelatorio] = useState('tradicional');
  const [templates, setTemplates] = useState<string[]>([]);
  const [logs, setLogs] = useState<{ msg: string, type: 'info' | 'success' | 'error' | 'process' }[]>([
    { msg: "🚀 Sistema iniciado. Aguardando configuração...", type: 'process' }
  ]);
  const [conteudo, setConteudo] = useState<any[] | null>(null);
  const [docGerado, setDocGerado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('Desc 1');
  const [activeStep, setActiveStep] = useState(1);

  const descriptionsOptions = [
    { id: 'Desc 1', label: 'Descrição 1' },
    { id: 'Desc 2', label: 'Descrição 2' },
    { id: 'Desc 3', label: 'Descrição 3' },
    { id: 'Desc 4', label: 'Descrição 4' },
  ];

  const logEndRef = useRef<HTMLDivElement>(null);

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
      addLog("Erro ao carregar templates. Verifique se o backend Python está rodando.", "error");
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
        addLog(`Varredura concluída. ${data.conteudo.length} elementos encontrados.`, "success");
      } else {
        addLog(data.detail || "Erro inesperado no scan.", "error");
      }
    } catch (err) {
      addLog("Erro na comunicação com o servidor.", "error");
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
          selected_description_key: selectedDescription
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
    <div className="min-h-screen pt-24 pb-12 px-4 selection:bg-brand-primary/20">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/10 blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header Section */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-200/60 shadow-2xl">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 rotate-3 transition-transform hover:rotate-0">
              <FileText className="text-slate-800" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter glow-text leading-none uppercase">
                NX RELATÓRIOS SP
              </h1>
              <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">
                Engine v2.1.0
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => openFolder(pastaSaida || "output")}
              className="btn-secondary h-11 flex items-center gap-2 group"
            >
              <FolderOpen size={16} className="text-slate-500 group-hover:text-brand-primary transition-colors" />
              <span className="hidden sm:inline italic">Abrir Saída</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={!docGerado || isDownloading}
              className={`btn-primary h-11 flex items-center gap-2 ${!docGerado ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
              ) : (
                <Download size={16} />
              )}
              <span className="hidden sm:inline">{isDownloading ? 'Baixando...' : 'Baixar Relatório'}</span>
            </button>
          </motion.div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)] relative z-10">
        
        {/* SIDEBAR WIZARD (Left - 4 Cols) */}
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 h-full overflow-y-auto pr-2 custom-scrollbar pb-20">
          
          {/* STEP 1: ORIGEM */}
          <motion.div
            onClick={() => setActiveStep(1)}
            className={`premium-card !p-4 cursor-pointer border-l-4 transition-all duration-300 ${activeStep === 1 ? 'border-l-brand-primary bg-white shadow-lg' : 'border-l-transparent bg-white/40 opacity-70 hover:opacity-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeStep === 1 ? 'bg-brand-primary text-black' : 'bg-slate-200 text-slate-500'}`}>
                <span className="text-xs font-bold font-mono">01</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Diretório Raiz</h3>
                <p className="text-[10px] text-slate-400">Origem das fotos.</p>
              </div>
            </div>
            
            <AnimatePresence>
              {activeStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3 pt-3 border-t border-slate-100"
                >
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setTipoRelatorio('tradicional'); }} className={`flex-1 py-1.5 px-2 text-[9px] font-bold uppercase rounded ${tipoRelatorio === 'tradicional' ? 'bg-brand-primary text-black' : 'bg-slate-100 text-slate-500'}`}>Tradicional</button>
                    <button onClick={(e) => { e.stopPropagation(); setTipoRelatorio('sp'); }} className={`flex-1 py-1.5 px-2 text-[9px] font-bold uppercase rounded ${tipoRelatorio === 'sp' ? 'bg-brand-primary text-black' : 'bg-slate-100 text-slate-500'}`}>Organizado SP</button>
                  </div>
                  <input type="text" value={pastaRaiz} readOnly className="input-field text-[10px] h-9" />
                  <button onClick={(e) => { e.stopPropagation(); selectFolder('raiz'); }} className="btn-secondary w-full py-2 text-[10px] font-black uppercase">Configurar Origem</button>
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
                <p className="text-[10px] text-slate-400">Template padrão.</p>
              </div>
            </div>
            
            <AnimatePresence>
              {activeStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3 pt-3 border-t border-slate-100"
                >
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
                <p className="text-[10px] text-slate-400">Textos do serviço.</p>
              </div>
            </div>
            
            <AnimatePresence>
              {activeStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3 pt-3 border-t border-slate-100"
                >
                  <select className="input-field h-10 text-xs truncate" value={selectedDescription} onChange={(e) => setSelectedDescription(e.target.value)}>
                    {descriptionsOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* STEP 4: GERAR */}
          <motion.div
            onClick={() => setActiveStep(4)}
            className={`premium-card !p-4 cursor-pointer border-l-4 transition-all duration-300 ${activeStep === 4 ? 'border-l-brand-primary bg-white shadow-lg' : 'border-l-transparent bg-white/40 opacity-70 hover:opacity-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeStep === 4 ? 'bg-brand-primary text-black' : 'bg-slate-200 text-slate-500'}`}>
                <Play size={14} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Engine</h3>
                <p className="text-[10px] text-slate-400">Gerar Relatório.</p>
              </div>
            </div>
            
            <AnimatePresence>
              {activeStep === 4 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4 pt-4 border-t border-slate-100"
                >
                  <button onClick={(e) => { e.stopPropagation(); handleScan(); }} disabled={loading} className="btn-secondary w-full py-3 text-[10px] font-black uppercase tracking-widest">{loading ? 'SCANEANDO...' : 'VARREDURA'}</button>
                  <button onClick={(e) => { e.stopPropagation(); handleGenerate(); }} disabled={isGenerating || !conteudo} className="btn-primary w-full py-3 text-[10px] font-black uppercase tracking-widest">{isGenerating ? 'GERANDO...' : 'GERAR DOC'}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </aside>

        {/* PREVIEW & LOGS (Right - 8/9 Cols) */}
        <section className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 h-full overflow-hidden">
          
          {/* Main Display Area */}
          <div className="glass-panel rounded-2xl flex-1 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/60 bg-white/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LayoutGrid size={16} className="text-brand-primary" />
                <h3 className="font-bold text-sm text-slate-800">Visualização da Estrutura</h3>
              </div>
              {conteudo && (
                <span className="status-badge bg-brand-primary/10 text-brand-primary">{conteudo.filter((i: any) => typeof i === 'object' && i !== null && (i.imagem || i.imagem_fachada)).length} Imagens</span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/10">
              {conteudo ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                   {conteudo.map((item: any, idx: number) => {
                     const isString = typeof item === 'string';
                     const isObject = typeof item === 'object' && item !== null;
                     const imgPath = isObject ? (item.imagem || item.imagem_fachada) : null;
                     const detailText = isObject ? item.texto_padrao : null;
                     const descText = isObject ? item.texto_descricao : null;
                     const tableData = isObject ? item.tabela_medicao : null;
                     const isPageBreak = isObject && item.quebra_pagina;
                     
                     if (imgPath) {
                       const isFachada = !!item.imagem_fachada;
                       const isDetalhe = !!item.is_detalhe;
                       return (
                         <div key={idx} className={`relative aspect-square rounded-xl border overflow-hidden shadow-sm group bg-white ${isFachada ? 'border-brand-primary border-2' : isDetalhe ? 'border-slate-200' : 'border-slate-100'}`}>
                           <img src={`${API_URL}/api/thumbnail?path=${encodeURIComponent(imgPath)}`} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[8px] text-white px-2 text-center">{imgPath.split('\\').pop()}</span>
                           </div>
                           {isFachada && <div className="absolute top-1 left-1 bg-brand-primary text-black text-[7px] font-black px-1.5 rounded-sm uppercase shadow-sm">Fachada</div>}
                           {isDetalhe && <div className="absolute top-1 right-1 bg-white text-slate-400 text-[6px] font-bold px-1 rounded-full uppercase border border-slate-100">Clip</div>}
                         </div>
                       );
                     } else if (descText) {
                        return (
                          <div key={idx} className="col-span-full py-3 px-4 bg-slate-50 border border-slate-100 rounded-xl my-2">
                             <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Descrição Técnica</span>
                             </div>
                             <p className="text-[10px] text-slate-700 leading-relaxed italic">
                                {descText.replace(/<RED>|<\/RED>/g, '')}
                             </p>
                          </div>
                        );
                     } else if (tableData) {
                        return (
                          <div key={idx} className="col-span-full md:col-span-2 py-2 px-3 bg-brand-primary/5 border border-brand-primary/10 rounded-lg flex items-center justify-between gap-4">
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                                <span className="text-[8px] font-black text-slate-500 uppercase">{tableData.tipo === 'pintura' ? 'Medição Pintura' : 'Mobiliário'}</span>
                             </div>
                             <div className="flex gap-3">
                                {tableData.medidas.map((m: any, midx: number) => (
                                   <span key={midx} className="text-[9px] font-bold text-slate-800">
                                      {m.total ? `${m.total.toFixed(2)}m²` : m.total_un ? `${m.total_un}UN` : ''}
                                   </span>
                                ))}
                             </div>
                          </div>
                        );
                     } else if (detailText) {
                        return (
                          <div key={idx} className="col-span-full py-2 mt-4 flex items-center gap-2 border-l-2 border-brand-secondary pl-3">
                            <span className="text-[10px] font-black text-brand-secondary uppercase tracking-wider">{detailText}</span>
                          </div>
                        );
                     } else if (isString) {
                       const isSub = item.includes('»');
                       return (
                         <div key={idx} className={`col-span-full py-4 mt-6 first:mt-0 border-b border-slate-100 flex items-center gap-3 ${isSub ? 'pl-8' : ''}`}>
                           {!isSub && <div className="h-px flex-1 bg-slate-200"></div>}
                           <span className={`font-black text-slate-700 uppercase tracking-[0.2em] ${isSub ? 'text-[8px] text-slate-400' : 'text-[11px] px-2'}`}>
                             {item}
                           </span>
                           <div className="h-px flex-1 bg-slate-200"></div>
                         </div>
                       );
                     }
                     return null;
                   })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                  <LayoutGrid size={48} className="mb-4 text-slate-400" />
                  <p className="text-xs font-bold uppercase tracking-widest">Aguardando análise do diretório...</p>
                </div>
              )}
            </div>
          </div>

          {/* Logs Area (Mini Console) */}
          <div className="glass-panel rounded-2xl h-28 flex flex-col overflow-hidden bg-slate-900 border-none shadow-inner">
             <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-black/20">
               <div className="flex items-center gap-2">
                 <Terminal size={12} className="text-brand-primary" />
                 <span className="text-[9px] font-black text-white/40 tracking-widest uppercase">Motor Engine Console</span>
               </div>
               <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400/50" /><div className="w-2 h-2 rounded-full bg-yellow-400/50" /><div className="w-2 h-2 rounded-full bg-green-400/50" /></div>
             </div>
             <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] text-white/80 custom-scrollbar bg-black/10">
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

      {/* High Fidelity Footer */}
      <footer className="mt-24 max-w-[1400px] mx-auto pt-12 border-t border-slate-200/60 pb-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-4 group cursor-default">
              <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-800/20 group-hover:text-slate-800/40 group-hover:bg-slate-200 transition-all">
                <Trash2 size={14} />
              </div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
                STABLE RELEASE <span className="text-slate-800 ml-2 opacity-50">TM RELATÓRIO 2.1.0</span>
              </p>
            </div>
            <div className="h-6 w-[1px] bg-slate-100 hidden md:block" />
            <p className="text-[10px] font-bold text-slate-400 tracking-tight text-center md:text-left">
              Advanced Document Automation & Image Structuring Protocol<br />
              © 2026 TM Sempre Tecnologia. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black tracking-widest text-slate-800/20 uppercase mb-1 flex items-center gap-2">
                Lead Architect <ChevronRight size={8} />
              </span>
              <span className="text-[11px] font-bold text-slate-500 hover:text-brand-primary transition-colors cursor-default">
                Thiago Nascimento Barbosa
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 group hover:border-brand-primary/40 transition-all cursor-pointer">
              <Clock size={18} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
