"use client";

import { Eraser, ChevronUp, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LogEntry {
  msg: string;
  type: 'info' | 'success' | 'error' | 'process';
}

interface ConsoleWatcherProps {
  logs: LogEntry[];
  onReset?: () => void;
}

export default function ConsoleWatcher({ logs, onReset }: ConsoleWatcherProps) {
  const logEndRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [uptime, setUptime] = useState(0);

  // Foca a visualização no console ao expandir
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        consoleRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 300);
    }
  }, [isExpanded]);

  // Auto-scroll para o final quando novos logs chegam
  useEffect(() => {
    if (isExpanded) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isExpanded]);

  // Lógica do Cronômetro de Uptime
  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div ref={consoleRef} className={`rounded-b-none rounded-t-lg overflow-hidden bg-slate-900 border-t-2 border-slate-800 flex flex-col transition-all duration-300 ${isExpanded ? 'h-48' : 'h-10'} shadow-inner`}>
      {/* Header do Console */}
      <div 
        className="px-6 py-2 flex items-center justify-between bg-slate-950 border-b border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="flex gap-2 mr-2">
            <div className={`w-2 h-2 rounded-sm bg-brand-accent ${isExpanded ? 'animate-pulse' : ''} shadow-[0_0_8px_rgba(138,81,0,0.6)]`} />
          </div>
          <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase flex items-center gap-2">
            CONSOLE DE COMANDO
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={(e) => { 
                e.stopPropagation(); 
                if (onReset) onReset(); 
            }}
            className="text-[9px] font-black text-slate-500 hover:text-red-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest"
          >
            <Eraser size={12} /> CLEAR
          </button>
          
          <div className="text-slate-500 hover:text-white transition-colors">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        </div>
      </div>

      {/* Área de Logs (visível apenas se expandido) */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] custom-scrollbar bg-black/10">
          <div className="space-y-1.5">
            {logs.map((log, i) => (
              <div 
                key={i} 
                className={`flex gap-3 leading-relaxed ${
                  log.type === 'error' ? 'text-red-400 font-bold' : 
                  log.type === 'success' ? 'text-brand-accent font-bold' : 
                  'text-slate-400'
                }`}
              >
                <span className="opacity-30 flex-shrink-0 font-bold">
                  [{new Date().toLocaleTimeString('pt-BR', { hour12: false })}]
                </span>
                <span className="font-medium">
                  {log.msg}
                </span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      )}

      {/* Footer do Console */}
      <div className="px-6 py-1.5 bg-slate-950 border-t border-slate-800 flex justify-between items-center group">
         <div className="flex gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
            <span>AUTO_RELATÓRIO_V1 | STATUS: <span className="text-brand-accent animate-pulse">ONLINE</span></span>
         </div>
         <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
            UPTIME: {formatUptime(uptime)}
         </div>
      </div>
    </div>
  );
}
