"use client";

import { useAppStore } from "@/store/useAppStore";
import { useEffect, useRef, useState } from "react";
import { Terminal, ChevronUp, ChevronDown, Activity, CheckCircle2, AlertCircle } from "lucide-react";

export function ConsoleWatcher() {
  const logs = useAppStore((s) => s.logs);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-expandir quando houver um log de processo importante
  useEffect(() => {
    if (logs.length > 0) {
      const lastLog = logs[logs.length - 1];
      if (!isOpen && (lastLog.type === 'process' || lastLog.type === 'error')) {
        setIsOpen(true);
      }
      
      // Scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [logs, isOpen]);

  // Se não houver logs, mostramos apenas uma barra mínima de "Status: Online"
  const hasLogs = logs.length > 0;

  return (
    <div
      style={{
        width: "100%",
        background: "var(--tm-sidebar-bg)",
        borderTop: "1px solid var(--tm-sidebar-border)",
        display: "flex",
        flexDirection: "column",
        transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        height: isOpen ? 220 : 32,
        zIndex: 40,
        position: "relative",
      }}
    >
      {/* Header Bar / Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height: 32,
          minHeight: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          cursor: "pointer",
          userSelect: "none",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--tm-sidebar-hover-bg)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Terminal size={14} color="var(--TM-primary)" strokeWidth={2} />
            <span style={{ 
              fontFamily: "var(--TM-font-mono)", 
              fontSize: 10, 
              fontWeight: 600, 
              letterSpacing: "0.1em",
              color: "var(--tm-text-subtle)",
              textTransform: "uppercase"
            }}>
              Terminal de Processamento
            </span>
          </div>

          {hasLogs && (
             <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 12, borderLeft: "1px solid var(--tm-sidebar-border)" }}>
                <span style={{ fontFamily: "var(--TM-font-mono)", fontSize: 10, color: "var(--TM-primary)" }}>
                  {logs.length} EVENTOS
                </span>
                {logs[logs.length-1].type === 'process' && (
                  <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--TM-primary)" }} />
                )}
             </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
             <Activity size={12} color="var(--tm-success)" />
             <span style={{ fontFamily: "var(--TM-font-mono)", fontSize: 10, color: "var(--tm-text-subtle)" }}>
               BACKEND: ONLINE
             </span>
          </div>
          {isOpen ? <ChevronDown size={14} color="var(--tm-text-subtle)" /> : <ChevronUp size={14} color="var(--tm-text-subtle)" />}
        </div>
      </div>

      {/* Logs Area */}
      {isOpen && (
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 16px 16px 16px",
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
          className="custom-scrollbar"
        >
          {hasLogs ? logs.map((log, i) => {
            let Icon = Activity;
            let color = "var(--tm-text-subtle)";
            
            if (log.type === "error") { color = "var(--tm-destructive)"; Icon = AlertCircle; }
            if (log.type === "success") { color = "var(--tm-success)"; Icon = CheckCircle2; }
            if (log.type === "process") { color = "var(--TM-primary)"; Icon = Activity; }

            return (
              <div key={i} style={{ 
                display: "flex", 
                gap: 10, 
                alignItems: "flex-start",
                animation: "tm-fade-in 0.2s ease forwards",
                padding: "2px 0"
              }}>
                <span style={{ 
                  fontFamily: "var(--TM-font-mono)", 
                  fontSize: 10, 
                  color: "var(--tm-text-subtle)", 
                  width: 30,
                  flexShrink: 0,
                  opacity: 0.5
                }}>
                  {i.toString().padStart(3, '0')}
                </span>
                <Icon size={12} color={color} style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ 
                  fontFamily: "var(--TM-font-mono)", 
                  fontSize: 12, 
                  color: log.type === 'process' ? 'var(--tm-text)' : color,
                  lineHeight: "1.4"
                }}>
                  {log.msg}
                </span>
              </div>
            );
          }) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tm-text-subtle)", fontFamily: "var(--TM-font-mono)", fontSize: 11 }}>
              Nenhum processo em execução no momento.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
