"use client";

import { useState } from "react";
import { FileCheck2, Search, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function CTABar() {
  const { photos, conteudo, scanFolder, generateReport, isScanning, isGenerating } = useAppStore();
  const [toast, setToast] = useState<string | null>(null);

  const classified = photos.filter((p) => p.amb).length;
  const total = photos.length;
  const canGenerate = classified > 0 && !isGenerating;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async () => {
    if (!conteudo) {
      showToast("Iniciando varredura...");
      await scanFolder();
    } else if (canGenerate) {
      showToast("Enviando para o gerador DOCX...");
      await generateReport();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 16px",
        background: "var(--tm-bg-sidebar)",
        borderTop: "1px solid var(--tm-border)",
        gap: 12,
        flexShrink: 0,
        transition: "background 0.2s, border-color 0.2s",
        position: "relative",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1A1A1A",
            color: "#EFEDE8",
            fontSize: 11,
            padding: "7px 14px",
            borderRadius: 99,
            whiteSpace: "nowrap",
            fontFamily: "var(--TM-font-mono)",
            animation: "tm-fade-in 0.18s ease forwards",
            zIndex: 20,
          }}
        >
          {toast}
        </div>
      )}

      {/* CTA Button */}
      <button
        disabled={conteudo ? !canGenerate : isScanning}
        onClick={handleAction}
        style={{
          flex: 1,
          padding: "12px",
          borderRadius: 6,
          background: (conteudo ? canGenerate : !isScanning) ? "#C8541C" : "var(--tm-bg-secondary)",
          color: (conteudo ? canGenerate : !isScanning) ? "#fff" : "var(--tm-text-subtle)",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "var(--TM-font-sans)",
          border: "none",
          cursor: (conteudo ? canGenerate : !isScanning) ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          letterSpacing: "0.02em",
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          if ((conteudo ? canGenerate : !isScanning)) (e.currentTarget as HTMLButtonElement).style.background = "#A6451A";
        }}
        onMouseLeave={(e) => {
          if ((conteudo ? canGenerate : !isScanning)) (e.currentTarget as HTMLButtonElement).style.background = "#C8541C";
        }}
      >
        {isScanning || isGenerating ? (
          <Loader2 size={16} strokeWidth={2} className="animate-spin" />
        ) : !conteudo ? (
          <Search size={16} strokeWidth={2} />
        ) : (
          <FileCheck2 size={16} strokeWidth={2} />
        )}
        {!conteudo 
          ? (isScanning ? "ESCANEANDO PASTAS..." : "ESCANEAR PASTAS") 
          : (isGenerating ? "GERANDO RELATÓRIO..." : "GERAR RELATÓRIO")}
      </button>

      {/* Status */}
      {conteudo && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
            fontFamily: "var(--TM-font-mono)",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: classified > 0 ? "var(--tm-success)" : "var(--tm-text-subtle)",
              fontWeight: 600,
              transition: "color 0.2s",
            }}
          >
            {classified} classificada{classified !== 1 ? "s" : ""}
          </span>
          <span style={{ fontSize: 9, color: "var(--tm-text-subtle)" }}>de {total} fotos</span>
        </div>
      )}
    </div>
  );
}
