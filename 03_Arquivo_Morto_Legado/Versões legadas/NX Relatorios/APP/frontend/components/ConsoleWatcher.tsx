"use client";

import { Terminal, LayoutPanelLeft, Eraser, Share } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface LogEntry {
  msg: string;
  type: 'info' | 'success' | 'error' | 'process';
}

interface ConsoleWatcherProps {
  logs: LogEntry[];
}

export default function ConsoleWatcher({ logs }: ConsoleWatcherProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="rounded-b-none rounded-t-xl overflow-hidden bg-[#1a1c23] border-t border-white/5 flex flex-col h-48 shadow-2xl">
      <div className="px-6 py-2 flex items-center justify-between bg-black/20 border-b border-white/[0.03]">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          </div>
          <span className="text-[10px] font-black text-teal-400/80 tracking-widest uppercase flex items-center gap-2">
            MOTOR ENGINE CONSOLE
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-[9px] font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <LayoutPanelLeft size={12} /> View Logs
          </button>
          <button className="text-[9px] font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <Eraser size={12} /> Clear
          </button>
          <button className="text-[9px] font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <Share size={12} /> Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] custom-scrollbar bg-black/10">
        <div className="space-y-1.5">
          {logs.map((log, i) => (
            <div 
              key={i} 
              className={`flex gap-3 leading-relaxed ${
                log.type === 'error' ? 'text-red-400' : 
                log.type === 'success' ? 'text-teal-400' : 
                'text-teal-400/60'
              }`}
            >
              <span className="opacity-30 flex-shrink-0">
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

      <div className="px-6 py-1.5 bg-black/40 border-t border-white/[0.02] flex justify-between items-center">
         <div className="flex gap-4 text-[9px] font-medium text-slate-500">
            <span>Motor Engine Console | System Status: <span className="text-teal-500">Active</span></span>
         </div>
         <div className="text-[9px] font-medium text-slate-500 uppercase tracking-tighter">
            Uptime: 00:00:03
         </div>
      </div>
    </div>
  );
}
