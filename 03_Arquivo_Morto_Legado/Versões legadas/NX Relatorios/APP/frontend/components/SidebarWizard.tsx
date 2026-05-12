"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Play, ChevronDown, ChevronUp, FileText, Settings, Eye } from 'lucide-react';

interface SidebarWizardProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  tipoRelatorio: string;
  setTipoRelatorio: (type: string) => void;
  pastaRaiz: string;
  selectFolder: (type: 'raiz') => void;
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
}

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
  hasConteudo
}: SidebarWizardProps) {
  
  const steps = [
    {
      id: 1,
      title: "Diretório Raiz",
      subtitle: "CONFIGURAÇÃO DE ORIGEM",
      icon: <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">01</div>,
      content: (
        <div className="space-y-6 pt-2">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Modo de Organização</label>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={(e) => { e.stopPropagation(); setTipoRelatorio('tradicional'); }}
                className={`flex-1 py-2 px-3 text-[11px] font-bold rounded-md transition-all ${tipoRelatorio === 'tradicional' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Tradicional
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setTipoRelatorio('sp'); }}
                className={`flex-1 py-2 px-3 text-[11px] font-bold rounded-md transition-all ${tipoRelatorio === 'sp' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Organizado SP
              </button>
            </div>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-700 transition-colors"
              >
                 <FolderOpen size={16} />
              </button>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); selectFolder('raiz'); }}
            className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest bg-teal-600 hover:bg-teal-700 shadow-teal-600/20"
          >
            Configurar Origem
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); handleScan(); }}
            disabled={!pastaRaiz || loading}
            className={`btn-secondary w-full py-4 text-xs font-black uppercase tracking-widest border-2 border-teal-600/20 text-teal-700 hover:bg-teal-50 mt-2 ${!pastaRaiz ? 'opacity-30' : ''}`}
          >
            {loading ? 'Escaneando...' : 'Iniciar Varredura'}
          </button>
        </div>
      )
    },
    {
      id: 2,
      title: "Modelo DOCX",
      subtitle: "PRÓXIMA ETAPA",
      icon: <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><FileText size={16} /></div>,
      content: (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <select
            className="input-field h-11 text-xs"
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
        </div>
      )
    },
    {
      id: 3,
      title: "Parâmetros",
      subtitle: "CONFIGURAÇÕES ADICIONAIS",
      icon: <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><Settings size={16} /></div>,
      content: (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <select
            className="input-field h-11 text-xs"
            value={selectedDescription}
            onChange={(e) => setSelectedDescription(e.target.value)}
          >
            {descriptionsOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
          </select>
        </div>
      )
    },
    {
      id: 4,
      title: "Visualização",
      subtitle: "RESULTADO FINAL",
      icon: <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><Eye size={16} /></div>,
      content: (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <button
            onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
            disabled={isGenerating || !hasConteudo}
            className={`btn-primary w-full py-4 text-xs font-black uppercase tracking-widest bg-teal-600 hover:bg-teal-700 shadow-teal-600/20 ${!hasConteudo ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
          >
            Gerar Relatório
          </button>
        </div>
      )
    }
  ];

  return (
    <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-3 h-full overflow-y-auto pr-2 custom-scrollbar pb-20 lg:pb-0">
      {steps.map((step) => (
        <motion.div
          key={step.id}
          layout
          onClick={() => setActiveStep(activeStep === step.id ? 0 : step.id)}
          className={`premium-card !p-6 cursor-pointer border-2 transition-all duration-500 ${activeStep === step.id ? 'border-teal-600/20 bg-white ring-4 ring-teal-600/5' : 'border-transparent bg-slate-50 opacity-80 hover:opacity-100'}`}
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
      
      {/* Visual Placeholder for the bottom of Sidebar in Desktop image */}
      <div className="mt-auto pt-6 opacity-20 hidden lg:block">
        <div className="h-24 border-2 border-dashed border-slate-300 rounded-3xl flex items-center justify-center">
           <div className="w-8 h-8 rounded-full bg-slate-300" />
        </div>
      </div>
    </aside>
  );
}
