"use client";

import { FileText, Download, Calendar, CheckCircle2 } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { useAppStore } from "@/store/useAppStore";

const MOCK_RELATORIOS = [
  { id: 1, agencia: "Agência 1158 — Torixoréu", data: "04/05/2026", modelo: "SP2", fotos: 8 },
  { id: 2, agencia: "Agência 0231 — Barra do Garças", data: "01/05/2026", modelo: "Tradicional", fotos: 12 },
  { id: 3, agencia: "Agência 0744 — Rondonópolis", data: "28/04/2026", modelo: "SP", fotos: 6 },
];

export function RelatoriosView() {
  const { docGerado, downloadReport, agenciaName, tipoRelatorio, photos } = useAppStore();
  
  const classifiedCount = photos.filter((p) => p.amb).length;
  
  const relatorios = [...MOCK_RELATORIOS];
  
  // Insere o recém-gerado no topo
  if (docGerado) {
    relatorios.unshift({
      id: 999,
      agencia: agenciaName || "Relatório Recém-gerado",
      data: new Date().toLocaleDateString('pt-BR'),
      modelo: tipoRelatorio === 'sp2' ? 'SP2' : tipoRelatorio === 'sp' ? 'SP' : 'Tradicional',
      fotos: classifiedCount,
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <Topbar />

      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total gerados", value: docGerado ? "4" : "3", sub: "esse mês" },
            { label: "Último gerado", value: docGerado ? new Date().toLocaleDateString('pt-BR') : "04/05/2026", sub: docGerado ? "Agora" : "Agência 1158" },
            { label: "Modelos usados", value: "3", sub: "SP, SP2, Tradicional" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--tm-bg-card)",
                border: "1px solid var(--tm-border)",
                borderTop: "3px solid var(--TM-primary)",
                borderRadius: 8,
                padding: "14px 16px",
                transition: "border-color 0.2s",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 600, color: "var(--tm-text)", fontFamily: "var(--TM-font-serif)", marginBottom: 2 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--tm-text-muted)", marginBottom: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 10, color: "var(--tm-text-subtle)", fontFamily: "var(--TM-font-mono)" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Lista */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {relatorios.map((r) => {
            const isNovo = r.id === 999;
            return (
              <div
                key={r.id}
                style={{
                  background: isNovo ? "var(--tm-bg-highlight)" : "var(--tm-bg-card)",
                  border: isNovo ? "1px solid var(--tm-success)" : "1px solid var(--tm-border)",
                  borderRadius: 8,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = isNovo ? "var(--tm-success)" : "var(--tm-border-hover)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = isNovo ? "var(--tm-success)" : "var(--tm-border)"; }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    background: isNovo ? "var(--tm-success-light)" : "var(--TM-primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={16} color={isNovo ? "var(--tm-success)" : "var(--TM-primary)"} strokeWidth={1.75} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tm-text)", marginBottom: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    {r.agencia}
                    {isNovo && <CheckCircle2 size={12} color="var(--tm-success)" strokeWidth={3} />}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "var(--tm-text-subtle)", display: "flex", alignItems: "center", gap: 3 }}>
                      <Calendar size={10} strokeWidth={1.75} /> {r.data}
                    </span>
                    <BadgeTipo tipo={r.modelo} />
                    <span style={{ fontSize: 10, color: "var(--tm-text-subtle)", fontFamily: "var(--TM-font-mono)" }}>{r.fotos} fotos</span>
                  </div>
                </div>
                <button
                  onClick={isNovo ? downloadReport : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: isNovo ? "1px solid var(--TM-primary)" : "1px solid var(--tm-border)",
                    background: isNovo ? "var(--TM-primary)" : "transparent",
                    fontSize: 11,
                    fontWeight: 500,
                    color: isNovo ? "#fff" : "var(--tm-text-muted)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isNovo) {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--TM-primary)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--TM-primary)";
                    } else {
                      (e.currentTarget as HTMLButtonElement).style.background = "#A6451A";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isNovo) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--tm-text-muted)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--tm-border)";
                    } else {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--TM-primary)";
                    }
                  }}
                >
                  <Download size={12} strokeWidth={1.75} />
                  Baixar
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BadgeTipo({ tipo }: { tipo: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    SP2: { bg: "#FBEDE3", text: "#993c1d" },
    SP: { bg: "#E2EBF2", text: "#1F3D55" },
    Tradicional: { bg: "#EFEDE8", text: "#5C5A55" },
  };
  const c = colors[tipo] ?? { bg: "var(--tm-bg-secondary)", text: "var(--tm-text-muted)" };
  return (
    <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, fontWeight: 600, fontFamily: "var(--TM-font-mono)", background: c.bg, color: c.text }}>
      {tipo}
    </span>
  );
}
