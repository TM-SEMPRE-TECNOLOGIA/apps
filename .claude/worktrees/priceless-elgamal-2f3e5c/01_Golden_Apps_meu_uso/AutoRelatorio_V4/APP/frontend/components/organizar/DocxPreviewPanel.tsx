"use client";

import { useAppStore } from "@/store/useAppStore";
import { FileText, Layers, FileType } from "lucide-react";

const EXT_AMBS = ["fachada", "acesso"];

export function DocxPreviewPanel() {
  const { 
    photos, 
    apiUrl, 
    agenciaName, 
    templates, 
    modeloSelecionado, 
    tipoRelatorio,
    metaFields,
    setModeloSelecionado,
    setTipoRelatorio,
    updateMetaField 
  } = useAppStore();

  const extPhotos = photos.filter((p) => p.amb && EXT_AMBS.includes(p.amb));
  const intPhotos = photos.filter((p) => p.amb && !EXT_AMBS.includes(p.amb));
  const classified = photos.filter((p) => p.amb).length;

  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        borderLeft: "1px solid var(--tm-border)",
        background: "var(--tm-bg-sidebar)",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid var(--tm-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={14} color="var(--TM-primary)" />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--tm-text-subtle)",
              fontFamily: "var(--TM-font-mono)",
            }}
          >
            Preview .docx
          </span>
        </div>
        <span
          style={{
            fontSize: 9,
            background: "var(--tm-bg-accent)",
            color: "var(--TM-primary)",
            border: "1px solid var(--TM-primary-light-alpha)",
            borderRadius: 3,
            padding: "1px 6px",
            fontFamily: "var(--TM-font-mono)",
            fontWeight: 600,
            letterSpacing: "0.05em"
          }}
        >
          AO VIVO
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
        
        {/* Bloco de Configuração Rápida */}
        <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
           
           {/* Seletor de Contrato */}
           <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Layers size={12} color="var(--tm-text-subtle)" />
                <span style={{ fontSize: 10, fontWeight: 600, color: "var(--tm-text-muted)", letterSpacing: "0.02em" }}>TIPO DE CONTRATO</span>
              </div>
              <select
                value={tipoRelatorio}
                onChange={(e) => setTipoRelatorio(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--tm-bg-input)",
                  border: "1px solid var(--tm-border)",
                  borderRadius: "var(--TM-radius-md)",
                  padding: "6px 10px",
                  fontSize: 11,
                  color: "var(--tm-text)",
                  fontFamily: "var(--TM-font-mono)",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="tradicional">Tradicional (MAFFENG)</option>
                <option value="sp">São Paulo (Legado)</option>
                <option value="sp2">São Paulo v2 (Novo)</option>
              </select>
           </div>

           {/* Seletor de Modelo */}
           <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <FileType size={12} color="var(--tm-text-subtle)" />
                <span style={{ fontSize: 10, fontWeight: 600, color: "var(--tm-text-muted)", letterSpacing: "0.02em" }}>MODELO DE TEMPLATE</span>
              </div>
              <select
                value={modeloSelecionado}
                onChange={(e) => setModeloSelecionado(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--tm-bg-input)",
                  border: "1px solid var(--tm-border)",
                  borderRadius: "var(--TM-radius-md)",
                  padding: "6px 10px",
                  fontSize: 11,
                  color: "var(--tm-text)",
                  fontFamily: "var(--TM-font-mono)",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                {templates.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
                {templates.length === 0 && (
                  <option value="">Nenhum modelo encontrado</option>
                )}
              </select>
           </div>

           {/* Metadados do Cabeçalho */}
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                 <span style={{ fontSize: 9, fontWeight: 700, color: "var(--tm-text-subtle)", display: "block", marginBottom: 4 }}>Nº ORDEM SERVIÇO</span>
                 <input 
                   type="text" 
                   placeholder="Ex: 1565"
                   value={metaFields.nr_os || ""}
                   onChange={(e) => updateMetaField('nr_os', e.target.value)}
                   style={{
                     width: "100%",
                     background: "var(--tm-bg-input)",
                     border: "1px solid var(--tm-border)",
                     borderRadius: 4,
                     padding: "4px 8px",
                     fontSize: 11,
                     color: "var(--tm-text)",
                     fontFamily: "var(--TM-font-mono)",
                     outline: "none"
                   }}
                 />
              </div>
              <div>
                 <span style={{ fontSize: 9, fontWeight: 700, color: "var(--tm-text-subtle)", display: "block", marginBottom: 4 }}>DATA ELABORAÇÃO</span>
                 <input 
                   type="date" 
                   value={metaFields.data_elaboracao || ""}
                   onChange={(e) => updateMetaField('data_elaboracao', e.target.value)}
                   style={{
                     width: "100%",
                     background: "var(--tm-bg-input)",
                     border: "1px solid var(--tm-border)",
                     borderRadius: 4,
                     padding: "4px 8px",
                     fontSize: 11,
                     color: "var(--tm-text)",
                     fontFamily: "var(--TM-font-mono)",
                     outline: "none"
                   }}
                 />
              </div>
           </div>

           <div>
              <span style={{ fontSize: 9, fontWeight: 700, color: "var(--tm-text-subtle)", display: "block", marginBottom: 4 }}>DATA DO ATENDIMENTO</span>
              <input 
                type="date" 
                value={metaFields.data_atendimento || ""}
                onChange={(e) => updateMetaField('data_atendimento', e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--tm-bg-input)",
                  border: "1px solid var(--tm-border)",
                  borderRadius: 4,
                  padding: "4px 8px",
                  fontSize: 11,
                  color: "var(--tm-text)",
                  fontFamily: "var(--TM-font-mono)",
                  outline: "none"
                }}
              />
           </div>
        </div>

        {/* Simulador de Documento */}
        <div
          style={{
            background: "var(--tm-bg-card)",
            border: "1px solid var(--tm-border)",
            borderRadius: 4,
            padding: 16,
            marginBottom: 12,
            boxShadow: "var(--TM-shadow-sm)"
          }}
        >
          {/* Cabeçalho do Doc */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: "1px solid var(--tm-border)",
            }}
          >
            <div style={{ width: 20, height: 20, background: "var(--TM-primary)", borderRadius: 2, flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--tm-text)",
                  fontFamily: "var(--TM-font-serif)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                Relatório Técnico
              </div>
              <div style={{ fontSize: 9, color: "var(--tm-text-subtle)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {agenciaName || "AGÊNCIA / LOCALIZAÇÃO"}
              </div>
            </div>
          </div>

          {/* Seção externa */}
          <PreviewSection
            title={`01.00 · Área Externa (${extPhotos.length})`}
            photos={extPhotos}
            apiUrl={apiUrl}
          />

          {/* Seção interna */}
          <div style={{ marginTop: 12 }}>
            <PreviewSection
              title={`02.00 · Área Interna (${intPhotos.length})`}
              photos={intPhotos}
              apiUrl={apiUrl}
            />
          </div>

          {/* Linhas de rodapé simuladas */}
          <div style={{ height: 4, borderRadius: 1, background: "var(--tm-bg-muted)", width: "85%", marginTop: 12 }} />
          <div style={{ height: 4, borderRadius: 1, background: "var(--tm-bg-muted)", width: "50%", marginTop: 4 }} />
        </div>

        {/* Progress */}
        <div
          style={{
            textAlign: "center",
            fontSize: 10,
            color: classified === photos.length ? "var(--tm-success)" : "var(--tm-text-subtle)",
            fontFamily: "var(--TM-font-mono)",
            fontWeight: 500,
            padding: "8px 0",
            letterSpacing: "0.02em"
          }}
        >
          {classified} / {photos.length} FOTOS CLASSIFICADAS
        </div>
      </div>
    </div>
  );
}

function PreviewSection({
  title,
  photos,
  apiUrl
}: {
  title: string;
  photos: { id: number; path: string; amb: string | null }[];
  apiUrl: string;
}) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--tm-text-muted)",
          marginBottom: 6,
          fontFamily: "var(--TM-font-mono)",
        }}
      >
        {title}
      </div>

      {photos.length === 0 ? (
        <div
          style={{
            border: "1px dashed var(--tm-border)",
            borderRadius: 4,
            padding: "12px 8px",
            textAlign: "center",
            fontSize: 9,
            color: "var(--tm-text-subtle)",
            fontFamily: "var(--TM-font-sans)"
          }}
        >
          Nenhum registro classificado
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 4,
              marginBottom: 4,
            }}
          >
            {photos.slice(0, 4).map((p) => (
              <div
                key={p.id}
                style={{
                  borderRadius: 2,
                  aspectRatio: "4/3",
                  background: "var(--tm-bg)",
                  border: "1px solid var(--tm-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}
              >
                <img 
                  src={`${apiUrl}/api/thumbnail?path=${encodeURIComponent(p.path)}`} 
                  alt="" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>
            ))}
          </div>
          {photos.length > 4 && (
            <div
              style={{
                fontSize: 8,
                color: "var(--tm-text-subtle)",
                textAlign: "center",
                fontFamily: "var(--TM-font-mono)",
                marginTop: 4
              }}
            >
              + {photos.length - 4} REGISTRO{photos.length - 4 !== 1 ? "S" : ""} ADICIONAIS
            </div>
          )}
        </>
      )}
    </div>
  );
}
