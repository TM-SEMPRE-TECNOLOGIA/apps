"use client";

import { FolderOpen } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const SECTION_LABELS: Record<string, string> = {
  dashboard:      "Dashboard",
  organizar:      "Organizar Fotos",
  relatorios:     "Relatórios Gerados",
  modelos:        "Modelos .docx",
  configuracoes:  "Configurações",
};

interface TopbarProps {
  actions?: React.ReactNode;
}

export function Topbar({ actions }: TopbarProps) {
  const activeSection = useAppStore((s) => s.activeSection);
  const readingMode = useAppStore((s) => s.readingMode);
  const setReadingMode = useAppStore((s) => s.setReadingMode);
  const agenciaName = useAppStore((s) => s.agenciaName);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        height: 48,
        background: "var(--tm-bg-sidebar)",
        borderBottom: "1px solid var(--tm-border)",
        flexShrink: 0,
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--tm-text-subtle)",
            fontFamily: "var(--TM-font-mono)",
          }}
        >
          {SECTION_LABELS[activeSection]}
        </span>

        {activeSection === "organizar" && agenciaName && (
          <>
            <span style={{ color: "var(--tm-border)", fontSize: 12 }}>/</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--tm-text)",
                fontFamily: "var(--TM-font-serif)",
              }}
            >
              {agenciaName}
            </span>
          </>
        )}

        <span
          style={{
            fontSize: 9,
            background: "var(--tm-bg-accent)",
            color: "var(--TM-primary)",
            borderRadius: 3,
            padding: "1px 6px",
            fontFamily: "var(--TM-font-mono)",
            fontWeight: 600,
            letterSpacing: "0.05em",
            border: "1px solid var(--TM-primary-light-alpha)"
          }}
        >
          V4.1
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Seletor de Modo de Leitura */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "var(--tm-bg-muted)",
          padding: 2,
          borderRadius: 8,
          marginRight: 8
        }}>
          <button
            onClick={() => setReadingMode('disco')}
            title="Modo DISCO: Lê estrutura de pastas organizadas manualmente"
            style={{
              padding: "4px 10px",
              fontSize: 10,
              fontWeight: 600,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              background: readingMode === 'disco' ? "var(--tm-bg-card)" : "transparent",
              color: readingMode === 'disco' ? "var(--TM-primary)" : "var(--tm-text-subtle)",
              boxShadow: readingMode === 'disco' ? "var(--TM-shadow-sm)" : "none",
              transition: "all 0.2s"
            }}
          >
            DISCO
          </button>
          <button
            onClick={() => setReadingMode('app')}
            title="Modo APP: Lê pasta plana, organize no app"
            style={{
              padding: "4px 10px",
              fontSize: 10,
              fontWeight: 600,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              background: readingMode === 'app' ? "var(--tm-bg-card)" : "transparent",
              color: readingMode === 'app' ? "var(--TM-primary)" : "var(--tm-text-subtle)",
              boxShadow: readingMode === 'app' ? "var(--TM-shadow-sm)" : "none",
              transition: "all 0.2s"
            }}
          >
            APP
          </button>
        </div>

        {actions}
        <button
          title="Selecionar pasta de origem"
          onClick={() => useAppStore.getState().selectFolder('raiz')}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 6,
            border: "1px solid var(--tm-border)",
            background: "transparent",
            fontSize: 11,
            fontWeight: 500,
            color: "var(--tm-text-muted)",
            cursor: "pointer",
            fontFamily: "var(--TM-font-sans)",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--tm-bg-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <FolderOpen size={12} strokeWidth={1.75} />
          <span>Selecionar pasta</span>
        </button>
      </div>
    </div>
  );
}
