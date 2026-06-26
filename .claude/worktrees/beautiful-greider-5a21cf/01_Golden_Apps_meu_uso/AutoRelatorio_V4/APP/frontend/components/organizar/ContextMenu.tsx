"use client";

import { useEffect, useRef, useState } from "react";
import { Folder, RotateCcw, X } from "lucide-react";
import { useAppStore, AMBIENTE_COLORS } from "@/store/useAppStore";

interface ContextMenuState {
  x: number;
  y: number;
  visible: boolean;
}

export function ContextMenu({
  state,
  onClose,
}: {
  state: ContextMenuState;
  onClose: () => void;
}) {
  const selection = useAppStore((s) => s.selection);
  const moveToAmbiente = useAppStore((s) => s.moveToAmbiente);
  const clearAmbiente = useAppStore((s) => s.clearAmbiente);
  const getAmbientes = useAppStore((s) => s.getAmbientes);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const [subOpen, setSubOpen] = useState(false);
  const [newAmb, setNewAmb] = useState("");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (!state.visible) return null;

  const count = selection.size;
  const label = `${count} foto${count !== 1 ? "s" : ""} selecionada${count !== 1 ? "s" : ""}`;

  const customAmbs = getAmbientes();

  const extAmbs = ["fachada", "acesso"];
  const intAmbs = ["saa", "atendimento", "banheiro", "copa"];

  const menuStyle: React.CSSProperties = {
    position: "fixed",
    left: state.x,
    top: state.y,
    zIndex: 100,
    background: "var(--tm-bg-sidebar)",
    border: "1px solid var(--tm-border)",
    borderRadius: 8,
    overflow: "visible",
    fontSize: 12,
    minWidth: 196,
    boxShadow: "var(--TM-shadow-ctx)",
    fontFamily: "var(--TM-font-sans)",
  };

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 10px",
    cursor: "pointer",
    color: "var(--tm-text)",
    position: "relative",
  };

  const sepStyle: React.CSSProperties = {
    height: 1,
    background: "var(--tm-border)",
    margin: "3px 0",
  };

  const sectionStyle: React.CSSProperties = {
    padding: "5px 10px",
    fontSize: 9,
    color: "var(--tm-text-subtle)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontFamily: "var(--TM-font-mono)",
    borderBottom: "1px solid var(--tm-border)",
  };

  const subItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "6px 10px",
    cursor: "pointer",
    color: "var(--tm-text)",
    fontSize: 11,
  };

  const AmbBtn = ({ ambKey, label }: { ambKey: string; label?: string }) => {
    const info = AMBIENTE_COLORS[ambKey] || { text: "var(--tm-text-subtle)", label: label || ambKey };
    return (
      <div
        style={subItemStyle}
        onClick={() => { moveToAmbiente(ambKey); onClose(); }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--tm-bg-hover)"; (e.currentTarget as HTMLDivElement).style.color = "var(--TM-primary)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; (e.currentTarget as HTMLDivElement).style.color = "var(--tm-text)"; }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 2, background: info.text, flexShrink: 0 }} />
        {info.label}
      </div>
    );
  };

  return (
    <div ref={menuRef} style={menuStyle}>
      {/* Header */}
      <div style={{ padding: "6px 10px", borderBottom: "1px solid var(--tm-border)", fontSize: 10, color: "var(--tm-text-subtle)", fontFamily: "var(--TM-font-mono)" }}>
        {label}
      </div>

      {/* Mover para */}
      <div
        style={{ ...itemStyle, justifyContent: "space-between" }}
        onMouseEnter={() => setSubOpen(true)}
        onMouseLeave={() => setSubOpen(false)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Folder size={13} strokeWidth={1.75} color="var(--tm-text-muted)" />
          Mover para...
        </div>
        <span style={{ fontSize: 9, color: "var(--tm-text-subtle)" }}>▶</span>

        {/* Submenu */}
        {subOpen && (
          <div
            style={{
              position: "absolute",
              left: "100%",
              top: -1,
              minWidth: 176,
              background: "var(--tm-bg-sidebar)",
              border: "1px solid var(--tm-border)",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "var(--TM-shadow-ctx)",
              maxHeight: 300,
              overflowY: "auto"
            }}
          >
            <div style={sectionStyle}>Padrões</div>
            {Object.keys(AMBIENTE_COLORS).map((a) => <AmbBtn key={a} ambKey={a} />)}
            
            {customAmbs.filter(a => !AMBIENTE_COLORS[a]).length > 0 && (
              <>
                <div style={sectionStyle}>Existentes no Disco</div>
                {customAmbs.filter(a => !AMBIENTE_COLORS[a]).map((a) => <AmbBtn key={a} ambKey={a} />)}
              </>
            )}

            <div style={sepStyle} />
            <div style={{ padding: 8 }}>
               <input 
                 autoFocus
                 placeholder="Criar novo..."
                 value={newAmb}
                 onChange={(e) => setNewAmb(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && newAmb.trim()) {
                     moveToAmbiente(newAmb.trim());
                     onClose();
                   }
                 }}
                 style={{
                   width: "100%",
                   background: "var(--tm-bg-input)",
                   border: "1px solid var(--tm-border)",
                   borderRadius: 4,
                   padding: "4px 8px",
                   fontSize: 11,
                   color: "var(--tm-text)",
                   outline: "none"
                 }}
               />
            </div>
          </div>
        )}
      </div>

      <div style={sepStyle} />

      {/* Remover classificação */}
      <div
        style={itemStyle}
        onClick={() => { clearAmbiente(); onClose(); }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--tm-bg-hover)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
      >
        <RotateCcw size={13} strokeWidth={1.75} color="var(--tm-text-muted)" />
        Remover classificação
      </div>

      <div style={sepStyle} />

      {/* Cancelar */}
      <div
        style={{ ...itemStyle, color: "var(--tm-destructive)" }}
        onClick={onClose}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--tm-bg-hover)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
      >
        <X size={13} strokeWidth={1.75} />
        Cancelar
      </div>
    </div>
  );
}
