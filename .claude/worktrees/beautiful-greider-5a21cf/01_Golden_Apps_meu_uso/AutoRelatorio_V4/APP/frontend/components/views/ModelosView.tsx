"use client";

import { Package, Upload } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { useState } from "react";

const MOCK_MODELOS = [
  { id: 1, agencia: "Agência 1158", contrato: "SP2", tipo: "SP2", selected: true },
  { id: 2, agencia: "Geral Caixa", contrato: "Tradicional", tipo: "Tradicional", selected: false },
  { id: 3, agencia: "Modelo SP", contrato: "SP", tipo: "SP", selected: false },
];

export function ModelosView() {
  const [selected, setSelected] = useState(1);
  const [dragging, setDragging] = useState(false);

  const TIPOS: Record<string, { bg: string; text: string }> = {
    SP2: { bg: "#FBEDE3", text: "#993c1d" },
    SP: { bg: "#E2EBF2", text: "#1F3D55" },
    Tradicional: { bg: "#EFEDE8", text: "#5C5A55" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <Topbar />

      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {/* Grid de modelos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
          {MOCK_MODELOS.map((m) => {
            const isSel = selected === m.id;
            const tipo = TIPOS[m.tipo] ?? { bg: "var(--tm-bg-secondary)", text: "var(--tm-text-muted)" };
            return (
              <div
                key={m.id}
                onClick={() => setSelected(m.id)}
                style={{
                  background: "var(--tm-bg-card)",
                  border: isSel ? "2px solid var(--TM-primary)" : "1px solid var(--tm-border)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <Package size={20} color={isSel ? "var(--TM-primary)" : "var(--tm-text-subtle)"} strokeWidth={1.5} />
                  <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, fontWeight: 600, fontFamily: "var(--TM-font-mono)", background: tipo.bg, color: tipo.text }}>
                    {m.tipo}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tm-text)", marginBottom: 3 }}>{m.agencia}</div>
                <div style={{ fontSize: 10, color: "var(--tm-text-subtle)", fontFamily: "var(--TM-font-mono)" }}>{m.contrato}</div>
              </div>
            );
          })}
        </div>

        {/* Drop zone */}
        <div
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          style={{
            border: `1.5px dashed ${dragging ? "var(--TM-primary)" : "var(--tm-border)"}`,
            borderRadius: 8,
            padding: "28px 20px",
            textAlign: "center",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            transition: "border-color 0.15s, background 0.15s",
            background: dragging ? "var(--TM-primary-light)" : "transparent",
          }}
        >
          <Upload size={20} color="var(--tm-text-subtle)" strokeWidth={1.5} />
          <div style={{ fontSize: 12, color: "var(--tm-text-muted)", fontWeight: 500 }}>
            Arraste um arquivo .docx para adicionar novo modelo
          </div>
          <div style={{ fontSize: 10, color: "var(--tm-text-subtle)", fontFamily: "var(--TM-font-mono)" }}>
            ou clique para selecionar
          </div>
        </div>
      </div>
    </div>
  );
}
