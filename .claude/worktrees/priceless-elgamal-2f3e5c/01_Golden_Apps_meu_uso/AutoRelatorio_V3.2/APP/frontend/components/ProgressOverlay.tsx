"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, FileDown, CheckCircle, Image as ImageIcon, Loader2 } from 'lucide-react';

export type ProgressStep = 'idle' | 'analyzing' | 'ai_generating' | 'compiling_docx' | 'done';

export default function ProgressOverlay({ 
  step, 
  message 
}: { 
  step: ProgressStep, 
  message: string 
}) {
  
  if (step === 'idle') return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-lg p-6"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="flex flex-col w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        >
          {/* Fundo Decorativo */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            
            {/* Animating Icon */}
            <div className="relative flex items-center justify-center w-24 h-24 mb-6">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                 className="absolute inset-0 rounded-full border-t-2 border-brand-primary opacity-30"
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                 className="absolute inset-2 rounded-full border-l-2 border-brand-accent opacity-30"
               />
               
               <div className="w-16 h-16 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/30">
                 {step === 'analyzing' && <ImageIcon className="text-white animate-pulse" size={32} />}
                 {step === 'ai_generating' && <Bot className="text-white animate-bounce" size={32} />}
                 {step === 'compiling_docx' && <FileDown className="text-white animate-pulse" size={32} />}
                 {step === 'done' && <CheckCircle className="text-white" size={32} />}
               </div>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-slate-800 mb-2">Processando Relatório</h2>
            <p className="text-sm text-slate-500 font-medium mb-8 max-w-[260px]">
              {message}
            </p>

            {/* Stepper Vertical */}
            <div className="flex flex-col gap-4 w-full">
               <StepItem 
                 active={step === 'analyzing' || step === 'ai_generating' || step === 'compiling_docx' || step === 'done'} 
                 icon={<ImageIcon size={16} />} 
                 title="Preparando Imagens" 
               />
               <StepItem 
                 active={step === 'ai_generating' || step === 'compiling_docx' || step === 'done'} 
                 icon={<Bot size={16} />} 
                 title="I.A Construindo Descrições" 
                 isCurrent={step === 'ai_generating'}
               />
               <StepItem 
                 active={step === 'compiling_docx' || step === 'done'} 
                 icon={<FileDown size={16} />} 
                 title="Injetando Visual no Word" 
                 isCurrent={step === 'compiling_docx'}
               />
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function StepItem({ active, isCurrent, icon, title }: { active: boolean, isCurrent?: boolean, icon: React.ReactNode, title: string }) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl transition-all ${active ? 'bg-slate-50 border border-slate-100' : 'opacity-40 grayscale'}`}>
       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'bg-slate-200 text-slate-500'}`}>
         {isCurrent ? <Loader2 size={14} className="animate-spin" /> : icon}
       </div>
       <span className={`text-sm font-bold ${active ? 'text-slate-700' : 'text-slate-400'}`}>
          {title}
       </span>
       
       {active && !isCurrent && (
         <div className="ml-auto text-green-500">
           <CheckCircle size={16} />
         </div>
       )}
    </div>
  )
}
