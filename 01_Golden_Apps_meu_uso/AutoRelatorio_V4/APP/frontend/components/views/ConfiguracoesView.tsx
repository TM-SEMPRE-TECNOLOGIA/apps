"use client";

import { Save, FolderOpen } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";

export function ConfiguracoesView() {
  const { 
    agenciaName, setAgenciaName, 
    pastaRaiz, pastaSaida, selectFolder,
    modeloSelecionado, setModeloSelecionado,
    tipoRelatorio, setTipoRelatorio
  } = useAppStore();
  const [saved, setSaved] = useState(false);

  const input: React.CSSProperties = {
    width: "100%",
    background: "var(--tm-bg-input)",
    border: "1px solid var(--tm-border)",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 13,
    color: "var(--tm-text)",
    fontFamily: "var(--TM-font-sans)",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const label: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--tm-text-muted)",
    marginBottom: 5,
    display: "block",
    fontFamily: "var(--TM-font-mono)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <Topbar />

      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <div style={{ maxWidth: 560 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--tm-text)", marginBottom: 20, fontFamily: "var(--TM-font-serif)" }}>
            Configurações do relatório
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Agência */}
            <div>
              <label style={label}>Identificação da agência</label>
              <input
                style={input}
                value={agenciaName}
                onChange={(e) => setAgenciaName(e.target.value)}
                onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--TM-primary)"; }}
                onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--tm-border)"; }}
                placeholder="Ex.: Agência 1158 — Torixoréu"
              />
            </div>

            {/* Pasta raiz */}
            <div>
              <label style={label}>Pasta raiz das fotos</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  style={{ ...input, cursor: "pointer", background: "var(--tm-bg-secondary)" }}
                  value={pastaRaiz}
                  onClick={() => selectFolder('raiz')}
                  placeholder="Clique para selecionar a pasta raiz..."
                  readOnly
                />
                <button 
                  onClick={() => selectFolder('raiz')}
                  style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--tm-border)", background: "transparent", cursor: "pointer" }}>
                  <FolderOpen size={16} />
                </button>
              </div>
            </div>

            {/* Pasta saída */}
            <div>
              <label style={label}>Pasta de saída (Opcional)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  style={{ ...input, cursor: "pointer", background: "var(--tm-bg-secondary)" }}
                  value={pastaSaida}
                  onClick={() => selectFolder('saida')}
                  placeholder="Pasta para salvar o Word gerado..."
                  readOnly
                />
                <button 
                  onClick={() => selectFolder('saida')}
                  style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--tm-border)", background: "transparent", cursor: "pointer" }}>
                  <FolderOpen size={16} />
                </button>
              </div>
            </div>

            {/* Contrato / Tipo Relatório */}
            <div>
              <label style={label}>Tipo de Contrato</label>
              <select
                style={{ ...input, cursor: "pointer" }}
                value={tipoRelatorio}
                onChange={(e) => setTipoRelatorio(e.target.value)}
              >
                <option value="sp2">SP2</option>
                <option value="sp">SP</option>
                <option value="tradicional">Tradicional</option>
              </select>
            </div>

            {/* Salvar */}
            <button
              onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 6,
                background: saved ? "var(--tm-success)" : "var(--TM-primary)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "var(--TM-font-sans)",
                border: "none",
                cursor: "pointer",
                alignSelf: "flex-start",
                letterSpacing: "0.03em",
                transition: "background 0.2s",
                marginTop: 8
              }}
            >
              <Save size={14} strokeWidth={2} />
              {saved ? "Configurações Salvas!" : "Salvar configurações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
