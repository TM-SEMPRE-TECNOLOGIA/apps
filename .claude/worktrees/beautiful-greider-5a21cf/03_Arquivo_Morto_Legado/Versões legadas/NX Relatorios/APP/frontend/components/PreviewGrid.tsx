"use client";

import { LayoutGrid, ClipboardCheck, MapPin, Eye, Paintbrush, Ruler, Info, CornerDownRight, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface PreviewGridProps {
  conteudo: any[] | null;
  apiUrl: string;
}

export default function PreviewGrid({ conteudo, apiUrl }: PreviewGridProps) {
  
  // Função para limpar o texto de marcadores técnicos desnecessários
  const cleanCategoryText = (text: string) => {
    return text
      .replace(/»/g, '') // Remove setas
      .replace(/^\s*[\-\d]+\s*-\s*/, '') // Remove números e traços iniciais (ex: "1 - ", "»- ")
      .replace(/^- /, '') // Remove traços isolados
      .trim();
  };

  // Função para mapear ícones baseada em palavras-chave (mais sóbria)
  const getIconForText = (text: string) => {
    const clean = text.toLowerCase();
    if (clean.includes('área')) return <MapPin size={14} className="text-teal-500/80" />;
    if (clean.includes('vista') || clean.includes('ampla')) return <Eye size={14} className="text-slate-400" />;
    if (clean.includes('pintura')) return <Paintbrush size={14} className="text-slate-400" />;
    if (clean.includes('medição') || clean.includes('total')) return <Target size={14} className="text-teal-600/60" />;
    return <div className="w-1 h-1 rounded-full bg-slate-300" />;
  };

  return (
    <div className="glass-panel rounded-2xl flex-1 flex flex-col shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] relative overflow-hidden bg-white border-slate-100">
      <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center text-teal-600">
            <LayoutGrid size={18} strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-[13px] text-slate-700">Visualização da Estrutura</h3>
        </div>
        <div className="flex gap-1.5">
           {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-200" />)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {conteudo && conteudo.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
             {conteudo.map((item: any, idx: number) => {
               const isString = typeof item === 'string';
               const isObject = typeof item === 'object' && item !== null;
               const imgPath = isObject ? (item.imagem || item.imagem_fachada) : null;
               const descText = isObject ? item.texto_descricao : null;
               const tableData = isObject ? item.tabela_medicao : null;
               const detailText = isObject ? item.texto_padrao : null;
               
               if (imgPath) {
                 const isFachada = !!item.imagem_fachada;
                 return (
                   <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative aspect-square rounded-xl border-2 overflow-hidden bg-slate-50 transition-all hover:ring-4 hover:ring-teal-500/10 group ${isFachada ? 'border-teal-500 shadow-md' : 'border-slate-100 shadow-sm'}`}
                   >
                     <img 
                      src={`${apiUrl}/api/thumbnail?path=${encodeURIComponent(imgPath)}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt="Preview"
                     />
                     {isFachada && (
                       <div className="absolute top-2 left-2 bg-teal-600 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
                         Fachada
                       </div>
                     )}
                   </motion.div>
                 );
               } else if (isString) {
                  const isSub = item.includes('»');
                  const cleanItem = cleanCategoryText(item);
                  return (
                    <div key={idx} className={`col-span-full py-4 mt-8 first:mt-0 flex items-center gap-4 ${isSub ? 'pl-8' : ''}`}>
                       <div className="flex items-center gap-3">
                         {getIconForText(item)}
                         <span className={`font-black uppercase tracking-[0.2em] ${isSub ? 'text-[11px] text-slate-400' : 'text-[14px] text-slate-800'}`}>
                           {cleanItem}
                         </span>
                       </div>
                       <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-100 to-transparent rounded-full" />
                    </div>
                  );
               } else if (descText) {
                  return (
                    <div key={idx} className="col-span-full py-5 px-6 bg-slate-50/50 border border-slate-100 rounded-2xl my-4 text-slate-600 font-medium text-[13px] leading-relaxed italic pr-12 relative">
                        <div className="absolute right-6 top-6 text-slate-200"><Info size={24} /></div>
                        “{descText.replace(/<RED>|<\/RED>/g, '')}”
                    </div>
                  );
               } else if (tableData) {
                  return (
                    <div key={idx} className="col-span-full md:col-span-4 lg:col-span-3 py-5 px-6 bg-teal-600 text-white rounded-2xl flex items-center justify-between shadow-xl shadow-teal-600/20 my-4 transform hover:scale-[1.02] transition-transform">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-[0.25em] opacity-60 mb-1">Medição Estimada</span>
                          <span className="text-[14px] font-black uppercase tracking-widest">{tableData.tipo === 'pintura' ? 'Consumo de Pintura' : 'Mobília'}</span>
                       </div>
                       <div className="flex gap-3">
                          {tableData.medidas.map((m: any, midx: number) => (
                             <div key={midx} className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 flex flex-col items-center">
                                <span className="text-[14px] font-black">{m.total ? `${m.total.toFixed(1)}m²` : m.total_un ? `${m.total_un}UN` : ''}</span>
                                <span className="text-[8px] font-bold uppercase opacity-60 leading-none">{m.nome.split('_').pop()}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                  );
               } else if (detailText) {
                  return (
                    <div key={idx} className="col-span-full py-3 mt-10 flex items-center justify-center bg-slate-900 rounded-2xl shadow-2xl overflow-hidden relative group">
                       <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-brand-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <span className="text-[13px] font-black text-white uppercase tracking-[0.4em] relative z-10">{detailText}</span>
                    </div>
                  );
               }
               return null;
             })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 shadow-inner"
            >
              <ClipboardCheck size={48} className="text-slate-200" strokeWidth={1} />
            </motion.div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">Aguardando Análise</h4>
            <p className="text-[13px] text-slate-400 max-w-sm leading-relaxed font-medium">
              Insira o diretório raiz e clique em configurar para que o motor possa mapear a árvore de arquivos do projeto e gerar a prévia estrutural.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
