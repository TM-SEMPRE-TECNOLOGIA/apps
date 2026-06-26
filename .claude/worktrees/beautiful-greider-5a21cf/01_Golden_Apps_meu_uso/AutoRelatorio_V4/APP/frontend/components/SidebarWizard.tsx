"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Play, ChevronDown, ChevronUp, FileText, Settings, Eye, Loader2, Bot, Cpu, Sparkles } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface SidebarWizardProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  tipoRelatorio: string;
  setTipoRelatorio: (type: string) => void;
  pastaRaiz: string;
  selectFolder: (type: 'raiz' | 'saida') => void;
  modeloSelecionado: string;
  setModeloSelecionado: (model: string) => void;
  templates: string[];
  fetchTemplates: () => void;
  selectedDescription: string;
  setSelectedDescription: (desc: string) => void;
  descriptionsOptions: { id: string; label: string }[];
  handleScan: () => void;
  handleGenerate: () => void;
  loading: boolean;
  isGenerating: boolean;
  hasConteudo: boolean;
  metaFields: Record<string, string>;
  setMetaFields: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  templatePlaceholders: string[];
  isScanning: boolean;
}

// Labels amigáveis para placeholders comuns
const PLACEHOLDER_LABELS: Record<string, string> = {
  contrato: 'Contrato',
  os: 'OS',
  agencia: 'Agência',
  elaborador: 'Elaborador',
  empresa: 'Empresa',
  data_elaboracao: 'Data Elaboração',
  data_vistoria: 'Data Vistoria',
  tipo_vistoria: 'Tipo Vistoria',
  gerente: 'Gerente',
  matricula: 'Matrícula',
  obra: 'Obra',
  local: 'Local',
  contratante: 'Contratante',
  fiscal: 'Fiscal',
  responsavel: 'Responsável',
  data: 'Data',
  periodo: 'Período',
  cidade: 'Cidade',
  estado: 'Estado',
};

const PLACEHOLDER_PLACEHOLDERS: Record<string, string> = {
  contrato: '2025.7421.2955',
  os: '250107393',
  agencia: '0419/00 – Igarapava – SP',
  elaborador: 'Nome do Elaborador',
  empresa: 'Nome da Empresa',
  data_elaboracao: 'dd/mm/aaaa',
  data_vistoria: 'dd/mm/aaaa',
  tipo_vistoria: 'PREVENTIVA',
  gerente: 'Nome do Gerente',
  matricula: '000000',
};

// Campos que renderizam como <select>
const SELECT_OPTIONS: Record<string, string[]> = {
  tipo_vistoria: ['PREVENTIVA', 'CORRETIVA', 'EMERGENCIAL'],
};

export default function SidebarWizard({
  activeStep,
  setActiveStep,
  tipoRelatorio,
  setTipoRelatorio,
  pastaRaiz,
  selectFolder,
  modeloSelecionado,
  setModeloSelecionado,
  templates,
  fetchTemplates,
  selectedDescription,
  setSelectedDescription,
  descriptionsOptions,
  handleScan,
  handleGenerate,
  loading,
  isGenerating,
  hasConteudo,
  metaFields,
  setMetaFields,
  templatePlaceholders,
  isScanning,
}: SidebarWizardProps) {
  const updateMeta = (field: string, value: string) =>
    setMetaFields({ ...metaFields, [field]: value });
  
  const steps = [
    {
      id: 1,
      isLocked: false,
      title: "Diretório Raiz",
      subtitle: "CONFIGURAÇÃO DE ORIGEM",
      icon: <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">01</div>,
      content: (
        <div className="space-y-6 pt-2">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Modo de Organização</label>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={(e) => { e.stopPropagation(); setTipoRelatorio('tradicional'); }}
                className={`flex-1 py-2 px-2 text-[10px] font-bold rounded-md transition-all ${tipoRelatorio === 'tradicional' ? 'bg-white text-brand-secondary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Tradicional
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setTipoRelatorio('sp'); }}
                className={`flex-1 py-2 px-2 text-[10px] font-bold rounded-md transition-all ${tipoRelatorio === 'sp' ? 'bg-white text-brand-secondary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                SP1
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setTipoRelatorio('sp2'); }}
                title="Modo São Paulo 2 — Contrato 1565 (São José do Rio Preto)"
                className={`flex-1 py-2 px-2 text-[10px] font-bold rounded-md transition-all ${tipoRelatorio === 'sp2' ? 'bg-white text-brand-secondary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                SP2
              </button>
            </div>
            {tipoRelatorio === 'sp2' && (
              <p className="text-[9px] text-brand-primary font-bold uppercase tracking-wider mt-1">
                ✦ Contrato 1565 · Memória de Cálculo + Croquis
              </p>
            )}
            {tipoRelatorio === 'sp' && (
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                ✦ Modo São Paulo · Varredura Hierárquica
              </p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Caminho do Diretório</label>
            <div className="relative group">
              <input
                type="text"
                value={pastaRaiz}
                placeholder="C:\Users\Admin\Documents\Project"
                readOnly
                className="input-field text-xs h-11 pr-10 border-slate-200"
              />
              <button 
                onClick={(e) => { e.stopPropagation(); selectFolder('raiz'); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary hover:text-brand-secondary transition-colors"
              >
                 <FolderOpen size={16} />
              </button>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); selectFolder('raiz'); }}
            className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest bg-brand-primary hover:bg-brand-secondary shadow-brand-primary/20"
          >
            Configurar Origem
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); handleScan(); }}
            disabled={!pastaRaiz || loading}
            className={`btn-secondary w-full py-4 text-xs font-black uppercase tracking-widest border-2 border-brand-primary/20 text-brand-secondary hover:bg-slate-100 mt-2 ${!pastaRaiz ? 'opacity-30' : ''}`}
          >
            {loading ? 'Escaneando...' : 'Iniciar Varredura'}
          </button>
        </div>
      )
    },
    {
      id: 2,
      isLocked: !hasConteudo,
      title: "Modelo DOCX",
      subtitle: "PRÓXIMA ETAPA",
      icon: <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${!hasConteudo ? 'bg-slate-100 text-slate-300' : 'bg-brand-primary/10 text-brand-primary'}`}><FileText size={16} /></div>,
      content: (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <select
            className="w-full h-11 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-slate-700 cursor-pointer appearance-none shadow-sm"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            value={modeloSelecionado}
            onChange={(e) => setModeloSelecionado(e.target.value)}
          >
            <option value="" disabled>Escolha um modelo...</option>
            {templates.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button
            onClick={(e) => { e.stopPropagation(); fetchTemplates(); }}
            className="btn-secondary w-full py-2 text-[10px] font-black uppercase"
          >
            Atualizar Lista
          </button>

          {/* Formulário dinâmico — campos {placeholder} lidos do template selecionado */}
          <AnimatePresence>
          {templatePlaceholders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-3 space-y-2">
                <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1">
                  Cabeçalho do Template · {templatePlaceholders.length} campo{templatePlaceholders.length !== 1 ? 's' : ''}
                </p>
                {templatePlaceholders.map((field) => {
                  const label = PLACEHOLDER_LABELS[field] ?? field.replace(/_/g, ' ');
                  const ph = PLACEHOLDER_PLACEHOLDERS[field] ?? '';
                  const options = SELECT_OPTIONS[field];
                  return (
                    <div key={field}>
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">{label}</label>
                      {options ? (
                        <select
                          value={metaFields[field] ?? options[0]}
                          onChange={(e) => updateMeta(field, e.target.value)}
                          className="w-full h-8 px-2 text-[10px] bg-white border border-slate-200 rounded-lg outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-slate-700"
                        >
                          {options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={metaFields[field] ?? ''}
                          placeholder={ph}
                          onChange={(e) => updateMeta(field, e.target.value)}
                          className="w-full h-8 px-2 text-[10px] bg-white border border-slate-200 rounded-lg outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-slate-700"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      )
    },
    {
      id: 3,
      isLocked: !hasConteudo || !modeloSelecionado,
      title: "Visualização",
      subtitle: "RESULTADO FINAL",
      icon: <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${!hasConteudo || !modeloSelecionado ? 'bg-slate-100 text-slate-300' : 'bg-brand-primary/10 text-brand-primary'}`}><Eye size={16} /></div>,
      content: (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <button
            onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
            disabled={isGenerating || !hasConteudo}
            className={`btn-primary w-full py-4 text-xs font-black uppercase tracking-widest hover:bg-brand-secondary ${!hasConteudo ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
          >
            Gerar Relatório
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a111a]/90 backdrop-blur-xl p-6"
          >
            <div className="relative w-full max-w-lg aspect-square bg-[#0f172a] rounded-3xl border border-brand-primary/30 shadow-[0_0_50px_rgba(0,54,148,0.2)] overflow-hidden flex flex-col items-center justify-center p-10 text-center">
              
              {/* Pontos de conexão futuristas */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-brand-primary/50 rounded-tl-3xl m-4" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-brand-primary/50 rounded-br-3xl m-4" />

              {/* Central AI Component */}
              <div className="relative mb-10">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: 360 
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-brand-accent/30 flex items-center justify-center"
                >
                   <motion.div 
                     animate={{ 
                       boxShadow: [
                         '0 0 10px rgba(138, 81, 0, 0.4)',
                         '0 0 30px rgba(138, 81, 0, 0.8)',
                         '0 0 10px rgba(138, 81, 0, 0.4)'
                       ]
                     }}
                     transition={{ duration: 2, repeat: Infinity }}
                     className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center border border-brand-accent/40"
                   >
                      <Cpu size={40} className="text-brand-accent" />
                   </motion.div>
                </motion.div>
                
                {/* Orbital dots */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0"
                >
                   <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-primary rounded-full blur-[2px] shadow-[0_0_15px_#003694]" />
                </motion.div>
              </div>

              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">PROCESSAMENTO NEURAL</h2>
              <div className="flex items-center gap-2 text-brand-accent/80 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Sparkles size={14} />
                Agente IA Consolidando Dados
              </div>

              {/* Progress Logs */}
              <div className="w-full bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-[10px] space-y-2 text-left h-32 overflow-hidden shadow-inner">
                <StatusLog text="Iniciando motor de renderização DOCX..." delay={0} />
                <StatusLog text="Carregando templates autorizados (SP 1565)..." delay={800} />
                <StatusLog text="Interpolarizando fotos e anotações técnicas..." delay={1600} />
                <StatusLog text="Validando itens Maffeng Selecionados..." delay={2400} />
                <StatusLog text="Redigindo memorial descritivo avançado..." delay={3200} />
                <StatusLog text="Finalizando documento word v2026.04..." delay={4000} />
                <div className="flex items-center gap-2 text-brand-primary animate-pulse">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Sincronizando buffers de saída...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay de varredura — bloqueia interação até grid renderizar */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-[#060d18]/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#0f172a] border border-brand-primary/30 rounded-2xl p-10 flex flex-col items-center gap-6 shadow-[0_0_60px_rgba(0,54,148,0.25)] max-w-xs w-full mx-4"
            >
              {/* Cantos decorativos */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-brand-primary/50 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-brand-primary/50 rounded-br-2xl" />

              {/* Spinner duplo */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-primary"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border-2 border-transparent border-t-brand-accent/60"
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-8 h-8 bg-brand-primary/20 rounded-full border border-brand-primary/40 flex items-center justify-center"
                >
                  <Loader2 size={14} className="text-brand-primary animate-spin" />
                </motion.div>
              </div>

              <div className="text-center">
                <h3 className="text-white font-black text-sm uppercase tracking-widest mb-1">Varrendo Estrutura</h3>
                <p className="text-slate-400 text-[10px] font-medium">Aguarde — carregando e renderizando todos os elementos antes de liberar a edição.</p>
              </div>

              {/* Barra de progresso indeterminada */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-brand-primary to-transparent rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-3 h-full overflow-y-auto pr-2 custom-scrollbar pb-20 lg:pb-0">
      {steps.map((step) => (
        <motion.div
          key={step.id}
          layout
          onClick={() => !step.isLocked && setActiveStep(activeStep === step.id ? 0 : step.id)}
          className={`premium-card p-5 border transition-all duration-300 ${
            step.isLocked 
              ? 'opacity-40 grayscale pointer-events-none border-transparent bg-slate-50/40' 
              : activeStep === step.id 
                ? 'border-brand-primary bg-white shadow-sm cursor-default' 
                : 'border-slate-100 bg-slate-50/80 hover:bg-white cursor-pointer hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {step.icon}
              <div>
                <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">{step.title}</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{step.subtitle}</p>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {activeStep === step.id && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }} 
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar nos inputs/botões
              >
                {step.content}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
      
    </aside>
    </>
  );
}

function StatusLog({ text, delay }: { text: string, delay: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!show) return null;

  return (
    <div className="flex items-center gap-2 text-slate-400">
      <span className="text-emerald-500">✔</span>
      <span>{text}</span>
    </div>
  );
}

