"use client";

import { LayoutGrid, MapPin, Eye, Paintbrush, Info, Target, Edit2, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';
import ImageEditorModal, { type ServiceSelection } from './ImageEditorModal';
import type { CustomAmbienteItems } from '../data/ambientes-constants';

interface PreviewGridProps {
  conteudo: any[] | null;
  apiUrl: string;
  modalData: Record<string, ServiceSelection[]>;
  setModalData: React.Dispatch<React.SetStateAction<Record<string, ServiceSelection[]>>>;
  annotatedImages: Record<string, string>;
  setAnnotatedImages: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  ambienteData: Record<string, string[]>;
  setAmbienteData: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  customAmbienteItems: CustomAmbienteItems;
  onAddCustomAmbiente: (levelIdx: number, item: string) => void;
  isScanning?: boolean;
  onGridReady?: () => void;
}

/** Retorna a URL de thumbnail (grade) ou imagem original (modal) */
function thumbUrl(apiUrl: string, path: string) {
  return `${apiUrl}/api/thumbnail?path=${encodeURIComponent(path)}`;
}
function fullUrl(apiUrl: string, path: string) {
  return `${apiUrl}/api/image?path=${encodeURIComponent(path)}`;
}

export default function PreviewGrid({
  conteudo, apiUrl, modalData, setModalData,
  annotatedImages, setAnnotatedImages,
  ambienteData, setAmbienteData, customAmbienteItems, onAddCustomAmbiente,
  isScanning, onGridReady,
}: PreviewGridProps) {
  const [editingPath, setEditingPath] = useState<string | null>(null);

  // Controle de carregamento de thumbnails
  const totalImgsRef = useRef(0);
  const loadedImgsRef = useRef(0);
  const gridReadyFiredRef = useRef(false);

  // Recalcula total de imagens sempre que conteudo mudar
  useEffect(() => {
    if (!conteudo) return;
    gridReadyFiredRef.current = false;
    loadedImgsRef.current = 0;
    const imgCount = conteudo.filter(
      (item: any) => typeof item === 'object' && item !== null && (item.imagem || item.imagem_fachada)
    ).length;
    totalImgsRef.current = imgCount;
    // Se não há imagens, libera imediatamente
    if (imgCount === 0) {
      onGridReady?.();
      gridReadyFiredRef.current = true;
    }
  }, [conteudo]);

  const handleImgSettled = useCallback(() => {
    if (gridReadyFiredRef.current) return;
    loadedImgsRef.current += 1;
    if (loadedImgsRef.current >= totalImgsRef.current) {
      gridReadyFiredRef.current = true;
      onGridReady?.();
    }
  }, [onGridReady]);

  // Limpa texto de marcadores técnicos
  const cleanCategoryText = (text: string) =>
    text.replace(/»/g, '').replace(/^\s*[\-\d]+\s*-\s*/, '').replace(/^- /, '').trim();

  const getIconForText = (text: string) => {
    const clean = text.toLowerCase();
    if (clean.includes('área')) return <MapPin size={14} className="text-brand-primary/80" />;
    if (clean.includes('vista') || clean.includes('ampla')) return <Eye size={14} className="text-slate-400" />;
    if (clean.includes('pintura')) return <Paintbrush size={14} className="text-slate-400" />;
    if (clean.includes('medição') || clean.includes('total')) return <Target size={14} className="text-brand-primary/60" />;
    return <div className="w-1 h-1 rounded-full bg-slate-300" />;
  };

  const handleSave = useCallback((imgPath: string, dataUrl: string, services: ServiceSelection[]) => {
    // Salva imagem anotada para ser enviada ao Word na geração
    setAnnotatedImages(prev => ({ ...prev, [imgPath]: dataUrl }));
    if (services && services.length > 0) {
      setModalData(prev => ({ ...prev, [imgPath]: services }));
    }
    setEditingPath(null);
  }, [setAnnotatedImages]);

  return (
    <div className={`glass-panel flex flex-col relative overflow-hidden bg-white transition-all duration-500 ${!conteudo ? 'h-[425px]' : 'flex-1 min-h-[425px]'}`}>
      <div className="px-8 py-4 border-b border-brand-primary/10 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center text-brand-primary">
            <LayoutGrid size={16} strokeWidth={2} />
          </div>
          <h3 className="font-bold text-[13px] text-slate-700 uppercase tracking-wide">Visualização da Estrutura</h3>
        </div>
        {conteudo && (
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
            <CheckCircle2 size={12} className="text-green-500" />
            {Object.keys(modalData).length} foto(s) configurada(s)
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {conteudo && conteudo.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {conteudo.map((item: any, idx: number) => {
              const isString = typeof item === 'string';
              const isObject = typeof item === 'object' && item !== null;
              const imgPath = isObject ? (item.imagem || item.imagem_fachada) : null;
              // Blocos de desc e tabela do backend — ignorados na grade,
              // substituídos pelos dados do modal abaixo
              const detailText = isObject ? item.texto_padrao : null;

              if (imgPath) {
                const isFachada = !!item.imagem_fachada;
                const tUrl = thumbUrl(apiUrl, imgPath);
                const configured = modalData[imgPath];
                const isConfigured = !!configured && configured.length > 0;
                const ambientePath = ambienteData[imgPath] ?? [];
                const hasAmbiente = ambientePath.length > 0;

                return (
                  <div key={idx} className="col-span-full">
                    {/* ── GRADE: Imagem Thumbnail ── */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative w-full aspect-square rounded-lg border-2 overflow-hidden bg-slate-50 transition-all hover:ring-2 hover:ring-brand-primary/20 group cursor-pointer
                        ${isFachada ? 'border-brand-primary shadow-sm' : 'border-slate-200'}
                        ${isConfigured ? 'ring-2 ring-green-500/60 border-green-500' : ''}
                      `}
                      style={{ maxWidth: '160px' }}
                      onClick={() => setEditingPath(imgPath)}
                    >
                      <img
                        src={tUrl}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt="Preview"
                        onLoad={handleImgSettled}
                        onError={handleImgSettled}
                      />

                      {/* Overlay de hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="flex items-center gap-2 text-white font-bold text-xs bg-brand-primary px-3 py-1.5 rounded-xl shadow-xl">
                          <Edit2 size={12} /> {isConfigured ? 'Editar' : 'Configurar'}
                        </div>
                      </div>

                      {/* Badge Fachada */}
                      {isFachada && (
                        <div className="absolute top-2 left-2 bg-brand-primary text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-wider z-10">
                          Fachada
                        </div>
                      )}

                      {/* Badge status serviços */}
                      {isConfigured ? (
                        <div className="absolute top-2 right-2 z-10">
                          <div className="bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5">
                            <CheckCircle2 size={8} /> OK
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-2 right-2 z-10">
                          <div className="bg-amber-500/80 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5">
                            <Clock size={8} /> Pendente
                          </div>
                        </div>
                      )}

                      {/* Badge de ambiente */}
                      {hasAmbiente ? (
                        <div className="absolute bottom-2 left-2 right-2 z-10">
                          <div className="bg-blue-600/80 backdrop-blur-sm text-white text-[7px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5 truncate">
                            <MapPin size={7} className="shrink-0" />
                            <span className="truncate">{ambientePath.join(' › ')}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute bottom-2 left-2 z-10">
                          <div className="bg-red-500/70 text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                            <MapPin size={7} /> Sem grupo
                          </div>
                        </div>
                      )}
                    </motion.div>

                    {/* ── BLOCOS AZUIS: aparecem SOMENTE se modal foi configurado ── */}
                    <AnimatePresence>
                      {isConfigured && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3 }}
                          className="col-span-full mt-3 space-y-2"
                        >
                          {/* Cards de medição por item */}
                          <div className="flex flex-wrap gap-2">
                            {configured.map((sel, sidx) => (
                              <div
                                key={sidx}
                                className="bg-brand-primary text-white rounded-xl flex items-center justify-between border border-brand-secondary px-4 py-2.5 min-w-[180px]"
                              >
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">
                                    {sel.totalLabel}
                                  </span>
                                  <span className="text-[12px] font-black uppercase tracking-wider leading-tight">
                                    {sel.item.id} — {sel.item.desc.split(' ').slice(0, 3).join(' ')}
                                  </span>
                                </div>
                                <div className="ml-3 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10 flex flex-col items-center shrink-0">
                                  <span className="text-[14px] font-black">
                                    {sel.totalFinal?.toFixed(2)}
                                  </span>
                                  <span className="text-[8px] font-bold uppercase opacity-60 leading-none">
                                    {sel.item.un}
                                  </span>
                                </div>
                                {sel.item.modificador && (
                                  <span className="ml-2 text-[8px] font-black px-1 py-0.5 rounded bg-red-400/30 text-red-200">
                                    {sel.item.modificador.label}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Observação técnica (se houver) */}
                          {configured[0]?.context && (
                            <div className="col-span-full py-3 px-4 bg-slate-50 border-l-4 border-brand-accent rounded-r-lg text-slate-700 font-medium text-[12px] leading-relaxed relative shadow-sm">
                              <div className="absolute right-4 top-3 text-brand-accent/30"><Info size={16} /></div>
                              <span className="italic text-slate-400 mr-1">[Obs.]</span>
                              {configured[0].context}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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

              } else if (detailText) {
                return (
                  <div key={idx} className="col-span-full py-3 mt-10 flex items-center justify-center bg-slate-800 rounded-lg border border-slate-700 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[13px] font-black text-white uppercase tracking-[0.4em] relative z-10">{detailText}</span>
                  </div>
                );
              }
              // descText e tableData do backend são descartados — substituídos pelos dados do modal
              return null;
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-slate-200"
            >
              <LayoutGrid size={24} className="text-slate-300" strokeWidth={1.5} />
            </motion.div>
            <h4 className="text-[14px] font-black text-slate-700 mb-2 uppercase tracking-wide">Aguardando Análise</h4>
            <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed font-medium">
              Insira o diretório raiz e clique em configurar para que o motor possa mapear a árvore de arquivos do projeto e gerar a prévia estrutural.
            </p>
          </div>
        )}
      </div>

      {/* ── MODAL: abre com imagem original ── */}
      {editingPath && (
        <div className="fixed inset-0 z-[150] flex">
          <ImageEditorModal
            imageUrl={fullUrl(apiUrl, editingPath)}
            onClose={() => setEditingPath(null)}
            onSave={(dataUrl, services) => handleSave(editingPath, dataUrl, services)}
            ambientePath={ambienteData[editingPath] ?? []}
            onAmbienteChange={path => setAmbienteData(prev => ({ ...prev, [editingPath]: path }))}
            customAmbienteItems={customAmbienteItems}
            onAddCustomAmbiente={onAddCustomAmbiente}
          />
        </div>
      )}
    </div>
  );
}
