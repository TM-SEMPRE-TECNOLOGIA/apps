"use client";

import { useAppStore, AMBIENTE_COLORS } from "@/store/useAppStore";
import { ContextMenu } from "@/components/organizar/ContextMenu";
import { useState, useCallback } from "react";
import { LayoutGrid, Loader2, Check, MoreHorizontal, Plus } from "lucide-react";

interface CtxState { x: number; y: number; visible: boolean; photoId?: number }

export function PhotoGrid() {
  const { photos, selection, selectPhoto, clearSelection, conteudo, isScanning, apiUrl } = useAppStore();
  
  const [ctx, setCtx] = useState<CtxState>({ x: 0, y: 0, visible: false });

  const unclassified = photos.filter((p) => !p.amb);
  const classified = photos.filter((p) => p.amb).length;

  const openCtx = useCallback((e: React.MouseEvent, id?: number) => {
    e.preventDefault();
    if (id !== undefined && !selection.has(id)) {
      clearSelection();
      useAppStore.getState().selectPhoto(id, unclassified.findIndex((p) => p.id === id), false);
    }
    setCtx({ x: e.clientX, y: e.clientY, visible: true, photoId: id });
  }, [selection, clearSelection, unclassified]);

  const closeCtx = useCallback(() => setCtx((s) => ({ ...s, visible: false })), []);

  if (isScanning) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--tm-bg)", padding: 20 }}>
        <Loader2 size={32} className="animate-spin text-brand-primary mb-4" color="#C8541C" />
        <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--tm-text)", textTransform: "uppercase" }}>Escaneando Diretório...</h4>
        <p style={{ fontSize: 11, color: "var(--tm-text-muted)", marginTop: 4 }}>Aguarde enquanto as imagens são processadas</p>
      </div>
    );
  }

  if (!conteudo || photos.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--tm-bg)", padding: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", border: "2px dashed var(--tm-border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <LayoutGrid size={24} color="var(--tm-text-subtle)" />
        </div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--tm-text)", textTransform: "uppercase" }}>Aguardando Fotos</h4>
        <p style={{ fontSize: 11, color: "var(--tm-text-muted)", marginTop: 4 }}>Vá em Configurações, selecione a Pasta Raiz e clique em Escanear.</p>
      </div>
    );
  }

  return (
    <>
      {/* Hint bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "6px 16px",
          background: "var(--tm-bg-muted)",
          borderBottom: "1px solid var(--tm-border)",
          flexShrink: 0,
          fontSize: 10,
          fontFamily: "var(--TM-font-sans)",
          transition: "background 0.2s",
        }}
      >
        <HintKey k="Clique" label="seleciona" />
        <HintKey k="Shift+clique" label="múltiplas" />
        <HintKey k="Botão direito" label="move para ambiente" />
        <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--tm-success)", fontFamily: "var(--TM-font-mono)", fontWeight: 600 }}>
          {classified} / {photos.length} classificadas
        </span>
      </div>

      {/* Grid área */}
      <div
        style={{ flex: 1, overflowY: "auto", padding: 14 }}
        onClick={closeCtx}
        onContextMenu={(e) => { if ((e.target as HTMLElement).closest("[data-photo-id]")) return; openCtx(e); }}
      >
        {/* Cabeçalho */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: "var(--tm-text-muted)" }}>
            Não classificadas ({unclassified.length})
          </span>
          {selection.size > 0 && (
            <span style={{ fontSize: 11, color: "var(--TM-primary)", fontWeight: 500 }}>
              {selection.size} selecionada{selection.size !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
        >
          {unclassified.map((photo, idx) => {
            const isSel = selection.has(photo.id);
            return (
              <div
                key={photo.id}
                data-photo-id={photo.id}
                onClick={(e) => { e.stopPropagation(); selectPhoto(photo.id, idx, e.shiftKey); closeCtx(); }}
                onContextMenu={(e) => openCtx(e, photo.id)}
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  border: isSel ? "2px solid #C8541C" : "1.5px solid var(--tm-border)",
                  cursor: "pointer",
                  background: "var(--tm-bg-card)",
                  transition: "border-color 0.15s, transform 0.1s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!isSel) (e.currentTarget as HTMLDivElement).style.borderColor = "var(--tm-border-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!isSel) (e.currentTarget as HTMLDivElement).style.borderColor = "var(--tm-border)";
                }}
              >
                {/* Thumb */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    background: "var(--tm-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <img 
                    src={`${apiUrl}/api/thumbnail?path=${encodeURIComponent(photo.path)}`} 
                    alt="" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />

                  {/* Fachada badge */}
                  {photo.isFachada && (
                    <div style={{ position: "absolute", top: 5, right: 5, background: "var(--TM-primary)", color: "#fff", fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 3, textTransform: "uppercase" }}>
                      Fachada
                    </div>
                  )}

                  {/* Número */}
                  <span
                    style={{
                      position: "absolute",
                      top: 5,
                      left: 5,
                      fontSize: 9,
                      fontFamily: "var(--TM-font-mono)",
                      background: "rgba(26,26,26,0.65)",
                      color: "#fff",
                      borderRadius: 3,
                      padding: "1px 4px",
                      fontWeight: 500,
                    }}
                  >
                    {String(photo.id).padStart(2, "0")}
                  </span>

                  {/* Checkmark seleção */}
                  {isSel && (
                    <span
                      style={{
                        position: "absolute",
                        top: 5,
                        left: 5,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "#C8541C",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                      }}
                    >
                      <Check size={9} color="#fff" strokeWidth={2.5} />
                    </span>
                  )}

                  {/* Overlay */}
                  {isSel && <div style={{ position: "absolute", inset: 0, background: "var(--TM-primary)", opacity: 0.1, pointerEvents: "none" }} />}

                  {/* Menu btn */}
                  <PhotoMenuBtn onOpen={(e) => { e.stopPropagation(); openCtx(e, photo.id); }} />
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px 7px",
                    borderTop: "1px solid var(--tm-border)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--tm-text-muted)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                      fontFamily: "var(--TM-font-mono)",
                    }}
                  >
                    {photo.path.split(/[\\/]/).pop()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ContextMenu state={ctx} onClose={closeCtx} />
    </>
  );
}

function HintKey({ k, label }: { k: string; label: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--tm-text-subtle)" }}>
      <kbd
        style={{
          background: "var(--tm-bg-sidebar)",
          border: "1px solid var(--tm-border)",
          borderRadius: 3,
          padding: "1px 5px",
          fontSize: 10,
          color: "var(--tm-text-muted)",
          fontFamily: "var(--TM-font-mono)",
        }}
      >
        {k}
      </kbd>
      {label}
    </span>
  );
}

function PhotoMenuBtn({ onOpen }: { onOpen: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onOpen}
      style={{
        position: "absolute",
        top: 4,
        right: 4,
        width: 20,
        height: 20,
        borderRadius: 4,
        background: "rgba(26,26,26,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: "pointer",
        opacity: 0,
        transition: "opacity 0.15s",
      }}
      className="photo-menu-btn"
    >
      <MoreHorizontal size={10} color="#fff" strokeWidth={2} />
    </button>
  );
}
