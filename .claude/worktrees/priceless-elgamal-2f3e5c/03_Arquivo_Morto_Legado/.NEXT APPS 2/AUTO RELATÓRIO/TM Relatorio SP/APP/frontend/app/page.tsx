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

  if (!mounted) return <div className="min-h-screen bg-[#010409]" />;

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
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 shadow-2xl">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 rotate-3 transition-transform hover:rotate-0">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter glow-text leading-none uppercase">
                TM Relatório
              </h1>
              <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">
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
              <FolderOpen size={16} className="text-gray-400 group-hover:text-brand-primary transition-colors" />
              <span className="hidden sm:inline italic">Abrir Saída</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={!docGerado || isDownloading}
              className={`btn-primary h-11 flex items-center gap-2 ${!docGerado ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download size={16} />
              )}
              <span className="hidden sm:inline">{isDownloading ? 'Baixando...' : 'Baixar Relatório'}</span>
            </button>
          </motion.div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
        {/* Setup Cards Row */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
          {/* Step 1: Root Folder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="premium-card flex flex-col gap-5 border-l-4 border-l-brand-primary group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-inner shadow-brand-primary/20">
                <FolderOpen size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Diretório Raiz</h3>
                <p className="text-[10px] text-gray-500 font-medium tracking-tight">Fotos e subpastas originais.</p>
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex gap-2">
                <button 
                  onClick={() => setTipoRelatorio('tradicional')}
                  className={`flex-1 py-1.5 px-2 text-[10px] font-bold uppercase rounded transition-all ${tipoRelatorio === 'tradicional' ? 'bg-brand-primary text-black shadow-[0_0_10px_rgba(88,166,255,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  Tradicional
                </button>
                <button 
                  onClick={() => setTipoRelatorio('sp')}
                  className={`flex-1 py-1.5 px-2 text-[10px] font-bold uppercase rounded transition-all ${tipoRelatorio === 'sp' ? 'bg-brand-primary text-black shadow-[0_0_10px_rgba(88,166,255,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  Organizado SP
                </button>
              </div>
              <div className="relative group/input">
                <input
                  type="text"
                  value={pastaRaiz}
                  readOnly
                  placeholder="Selecione o caminho base..."
                  className="input-field pr-10 text-[11px] font-mono tracking-tight"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 group-hover/input:text-brand-primary transition-colors">
                  <ChevronRight size={14} />
                </div>
              </div>
              <button
                onClick={() => selectFolder('raiz')}
                className="btn-secondary w-full text-xs font-black uppercase tracking-widest hover:bg-brand-primary/5 hover:border-brand-primary/30 active:scale-95"
              >
                Configurar Origem
              </button>
            </div>
          </motion.div>

          {/* Step 2: Template Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="premium-card flex flex-col gap-5 border-l-4 border-l-brand-secondary group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shadow-inner shadow-brand-secondary/20">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Modelo DOCX</h3>
                <p className="text-[10px] text-gray-500 font-medium tracking-tight">Template padrão do sistema.</p>
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="relative group/input">
                <select
                  className="input-field appearance-none cursor-pointer pr-10"
                  value={modeloSelecionado}
                  onChange={(e) => setModeloSelecionado(e.target.value)}
                >
                  <option value="" disabled>Escolha um modelo...</option>
                  {templates.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover/input:text-brand-secondary transition-colors">
                  <LayoutGrid size={14} />
                </div>
              </div>
              <button
                onClick={fetchTemplates}
                className="btn-secondary w-full text-xs font-black uppercase tracking-widest hover:bg-brand-secondary/5 hover:border-brand-secondary/30 active:scale-95"
              >
                Scan Templates
              </button>
            </div>
          </motion.div>

          {/* Step ?: Description Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="premium-card flex flex-col gap-5 border-l-4 border-l-brand-secondary/60 group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shadow-inner shadow-brand-secondary/20">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Descrição do Serviço</h3>
                <p className="text-[10px] text-gray-500 font-medium tracking-tight">Selecione o texto do placeholder.</p>
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="relative group/input">
                <select
                  className="input-field appearance-none cursor-pointer pr-10"
                  value={selectedDescription}
                  onChange={(e) => setSelectedDescription(e.target.value)}
                >
                  {descriptionsOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover/input:text-brand-secondary transition-colors">
                  <LayoutGrid size={14} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3: Action Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`premium-card flex flex-col gap-5 border-l-4 transition-colors duration-500 ${docGerado ? 'border-l-brand-secondary' : (conteudo ? 'border-l-brand-primary' : 'border-l-white/10')} `}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${docGerado ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-white/5 text-gray-500'} `}>
                {docGerado ? <CheckCircle2 size={20} /> : <Play size={20} />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Engine</h3>
                <p className="text-[10px] text-gray-500 font-medium tracking-tight">Processamento em tempo real.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleScan}
                disabled={loading || !pastaRaiz}
                className="btn-secondary text-[10px] h-12 flex flex-col items-center justify-center gap-1 leading-tight group overflow-hidden relative"
              >
                <Eye size={14} className="group-hover:text-brand-primary transition-colors z-10" />
                <span className="z-10 tracking-tighter">VARREDURA</span>
                {loading && (
                  <div className="absolute inset-0 bg-brand-primary/10 animate-pulse" />
                )}
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !conteudo}
                className="btn-primary text-[10px] h-12 flex flex-col items-center justify-center gap-1 leading-tight group"
              >
                {isGenerating ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 size={14} className="group-hover:scale-110 transition-transform" />
                )}
                <span className="tracking-tighter">GERAR DOC</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Preview Container (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-2xl overflow-hidden h-[600px] flex flex-col shadow-2xl relative"
          >
            {/* Dynamic Accent Glow */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />

            <div className="px-6 py-5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                  <LayoutGrid size={16} />
                </div>
                <h3 className="font-bold text-sm tracking-tight text-white/90">Estrutura do Relatório</h3>
              </div>
              {conteudo && (
                <div className="status-badge border-brand-primary/30 text-brand-primary bg-brand-primary/5 px-3 py-1.5 shadow-[0_0_10px_rgba(88,166,255,0.1)]">
                  {conteudo.filter(item => item.imagem).length} Imagens
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(88,166,255,0.03),transparent_70%)]">
              {conteudo ? (
                <div className="space-y-4">
                  {conteudo.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(idx * 0.01, 0.5) }}
                      className="group"
                    >
                      {typeof item === 'string' ? (
                        <div className="flex items-center gap-3 py-3 px-5 rounded-xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all duration-300 group-hover:translate-x-1 shadow-sm">
                          <ChevronRight size={14} className="text-brand-primary animate-pulse" />
                          <span className="text-xs font-bold text-gray-200 tracking-wide">
                            {item.replace(/»/g, '  ')}
                          </span>
                        </div>
                      ) : item.imagem ? (
                        <div className="ml-8 mt-3 inline-block">
                          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-white/5 group-hover:border-brand-primary/50 transition-all duration-500 shadow-xl cursor-crosshair group/img">
                            <img
                              src={`${API_URL}/api/thumbnail?path=${encodeURIComponent(item.imagem)}`}
                              alt="preview"
                              className="w-full h-full object-cover grayscale-[0.3] group-hover/img:grayscale-0 transition-all duration-700 scale-[1.02] group-hover/img:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3">
                              <span className="text-[10px] font-bold text-white mb-0.5 truncate">
                                {item.imagem.split('\\').pop()}
                              </span>
                              <span className="text-[8px] text-white/50 tracking-tighter uppercase font-medium">Node Reference Asset</span>
                            </div>
                          </div>
                        </div>
                      ) : item.quebra_pagina ? (
                        <div className="ml-8 my-6 flex items-center gap-6">
                          <div className="h-[1px] flex-1 bg-gradient-to-r from-brand-primary/20 via-brand-primary/5 to-transparent" />
                          <div className="flex items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                            <Clock size={10} />
                            <span className="text-[8px] font-black tracking-[0.4em] text-gray-500 uppercase">PAGE BREAK SYSTEM</span>
                          </div>
                          <div className="h-[1px] flex-1 bg-gradient-to-l from-brand-primary/20 via-brand-primary/5 to-transparent" />
                        </div>
                      ) : null}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center gap-8 -mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-primary/20 blur-[40px] rounded-full animate-pulse" />
                    <div className="w-24 h-24 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center relative bg-[#0d1117]/80 group-hover:border-brand-primary/50 transition-colors duration-500">
                      <LayoutGrid size={48} className="text-gray-600 group-hover:text-brand-primary/50 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-black text-xl tracking-tight text-white/80">READY FOR ANALYSIS</h4>
                    <p className="text-xs max-w-[280px] leading-relaxed text-gray-500 font-medium">
                      Configure as pastas e execute a varredura para popular o motor de estruturação do relatório.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Logs Console (4 Columns) */}
        <div className="lg:col-span-4 h-full flex flex-col">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-panel rounded-2xl h-[600px] flex flex-col overflow-hidden bg-black/60 shadow-inner relative"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-brand-primary animate-pulse" />
                <h3 className="font-black text-[10px] tracking-[0.3em] uppercase text-gray-500">System Logs</h3>
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 font-mono text-[10px] space-y-4 custom-scrollbar selection:bg-brand-primary/30">
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex gap-3 leading-relaxed relative group/log ${log.type === 'error' ? 'text-red-400 bg-red-400/5 p-3 rounded-xl border border-red-400/10' :
                      log.type === 'success' ? 'text-brand-secondary' :
                        log.type === 'process' ? 'text-brand-primary italic' :
                          'text-gray-400'
                      }`}
                  >
                    <span className="opacity-30 flex-shrink-0 select-none">[{new Date().toLocaleTimeString('pt-BR', { hour12: false })}]</span>
                    <span className="opacity-20 flex-shrink-0">::</span>
                    <span className="break-all tracking-tight">{log.msg}</span>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover/log:h-1/2 bg-current opacity-20 transition-all duration-300" />
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={logEndRef} />
            </div>
          </motion.div>
        </div>
      </main>

      {/* High Fidelity Footer */}
      <footer className="mt-24 max-w-[1400px] mx-auto pt-12 border-t border-white/5 pb-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-4 group cursor-default">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white/40 group-hover:bg-white/10 transition-all">
                <Trash2 size={14} />
              </div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">
                STABLE RELEASE <span className="text-white ml-2 opacity-50">TM RELATÓRIO 2.1.0</span>
              </p>
            </div>
            <div className="h-6 w-[1px] bg-white/5 hidden md:block" />
            <p className="text-[10px] font-bold text-gray-600 tracking-tight text-center md:text-left">
              Advanced Document Automation & Image Structuring Protocol<br />
              © 2026 TM Sempre Tecnologia. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black tracking-widest text-white/20 uppercase mb-1 flex items-center gap-2">
                Lead Architect <ChevronRight size={8} />
              </span>
              <span className="text-[11px] font-bold text-gray-400 hover:text-brand-primary transition-colors cursor-default">
                Thiago Nascimento Barbosa
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group hover:border-brand-primary/40 transition-all cursor-pointer">
              <Clock size={18} className="text-gray-500 group-hover:text-brand-primary transition-colors" />
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
