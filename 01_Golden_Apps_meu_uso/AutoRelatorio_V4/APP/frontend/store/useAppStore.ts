"use client";

import { create } from "zustand";

// ── Tipos ───────────────────────────────────────────────────────────
export type NavSection = "dashboard" | "organizar" | "relatorios" | "modelos" | "configuracoes";

export const AMBIENTE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  fachada:    { bg: "#EAF1E4", text: "#3A5A2C", label: "Fachada" },
  acesso:     { bg: "#EAF1E4", text: "#3A5A2C", label: "Corredor de Acesso" },
  saa:        { bg: "#E2EBF2", text: "#1F3D55", label: "SAA" },
  atendimento:{ bg: "#E2EBF2", text: "#1F3D55", label: "Atendimento" },
  banheiro:   { bg: "#F5DCD7", text: "#A33B2A", label: "Banheiro" },
  copa:       { bg: "#FBEDE3", text: "#7A3010", label: "Copa" },
};

export type Ambiente = keyof typeof AMBIENTE_COLORS | null;

export interface Photo {
  id: number;
  path: string;
  isFachada: boolean;
  amb: Ambiente;
  // Campos auxiliares para V3
  configured: boolean;
}

interface AppState {
  // ── Nav ──
  activeSection: NavSection;
  readingMode: "disco" | "app";
  setActiveSection: (s: NavSection) => void;
  setReadingMode: (m: "disco" | "app") => void;

  // ── Dark mode ──
  isDark: boolean;
  toggleDark: () => void;

  // ── Lógica Base V3 ──
  apiUrl: string;
  pastaRaiz: string;
  pastaSaida: string;
  modeloSelecionado: string;
  tipoRelatorio: string;
  conteudo: any[] | null;
  modalData: Record<string, any[]>;
  annotatedImages: Record<string, string>;
  metaFields: Record<string, string>;
  logs: { msg: string, type: 'info' | 'success' | 'error' | 'process' }[];
  isScanning: boolean;
  isGenerating: boolean;
  docGerado: string | null;

  setPastaRaiz: (p: string) => void;
  setPastaSaida: (p: string) => void;
  setModeloSelecionado: (m: string) => void;
  setTipoRelatorio: (t: string) => void;
  addLog: (msg: string, type?: 'info' | 'success' | 'error' | 'process') => void;
  scanFolder: () => Promise<void>;
  generateReport: () => Promise<void>;
  downloadReport: () => Promise<void>;
  selectFolder: (type: 'raiz' | 'saida') => Promise<void>;
  
  templates: string[];
  fetchTemplates: () => Promise<void>;

  // ── Fotos & Interação ──
  photos: Photo[];
  selection: Set<number>;
  lastSelectedIdx: number | null;
  selectPhoto: (id: number, idx: number, shift: boolean) => void;
  clearSelection: () => void;
  moveToAmbiente: (amb: string) => void;
  clearAmbiente: () => void;

  // ── Config ──
  agenciaName: string;
  setAgenciaName: (name: string) => void;
  updateMetaField: (field: string, value: string) => void;
  getAmbientes: () => string[];
}

export const useAppStore = create<AppState>((set, get) => ({
  activeSection: "organizar",
  readingMode: "disco",
  setActiveSection: (s) => set({ activeSection: s, selection: new Set() }),
  setReadingMode: (m) => set({ readingMode: m }),

  isDark: false,
  toggleDark: () => {
    const next = !get().isDark;
    set({ isDark: next });
    document.documentElement.classList.toggle("dark", next);
  },

  // ── Estados reais V3 ──
  apiUrl: "http://localhost:5000", // Backend AutoRelatorio V4.1
  pastaRaiz: "",
  pastaSaida: "",
  modeloSelecionado: "Modelo_Tradicional.docx",
  tipoRelatorio: "tradicional",
  conteudo: null,
  modalData: {},
  annotatedImages: {},
  metaFields: {},
  logs: [],
  isScanning: false,
  isGenerating: false,
  docGerado: null,

  setPastaRaiz: (p) => set({ pastaRaiz: p }),
  setPastaSaida: (p) => set({ pastaSaida: p }),
  setModeloSelecionado: (m) => set({ modeloSelecionado: m }),
  setTipoRelatorio: (t) => set({ tipoRelatorio: t }),
  
  templates: [],
  fetchTemplates: async () => {
    try {
      const res = await fetch(`${get().apiUrl}/api/templates`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.templates ?? []);
      if (list.length > 0) {
        set({ templates: list, modeloSelecionado: list[0] });
      }
    } catch (err) {
      get().addLog("Erro ao carregar templates. Backend offline?", "error");
    }
  },

  addLog: (msg, type = 'info') => {
    set((state) => ({ logs: [...state.logs, { msg, type }] }));
  },

  selectFolder: async (type) => {
    try {
      const res = await fetch(`${get().apiUrl}/api/dialog/folder`);
      const data = await res.json();
      if (data.path) {
        if (type === 'raiz') {
          set({ pastaRaiz: data.path });
          get().addLog(`Pasta raiz selecionada: ${data.path}`, "success");
        } else {
          set({ pastaSaida: data.path });
          get().addLog(`Pasta de saída selecionada: ${data.path}`, "success");
        }
      }
    } catch (err) {
      get().addLog("Erro ao abrir seletor de pastas. Backend offline?", "error");
    }
  },

  scanFolder: async () => {
    const { pastaRaiz, pastaSaida, tipoRelatorio, apiUrl, addLog } = get();
    if (!pastaRaiz) return addLog("Selecione uma pasta raiz antes de escanear.", "error");

    set({ isScanning: true, conteudo: null, photos: [], selection: new Set() });
    addLog("Iniciando varredura de pastas...", "process");

    try {
      const res = await fetch(`${apiUrl}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pasta_raiz: pastaRaiz, pasta_saida: pastaSaida, tipo_relatorio: tipoRelatorio })
      });
      const data = await res.json();
      
      if (data.conteudo) {
        // Parsear o conteúdo para popular a lista de fotos real para o Grid
        const fotosParsed: Photo[] = [];
        let idCounter = 1;
        for (const item of data.conteudo) {
          if (typeof item === 'object' && item !== null) {
            const path = item.imagem || item.imagem_fachada;
            if (path) {
              fotosParsed.push({
                id: idCounter++,
                path: path,
                isFachada: !!item.imagem_fachada,
                amb: null,
                configured: false
              });
            }
          }
        }
        
        set({ conteudo: data.conteudo, photos: fotosParsed });
        addLog(`Varredura concluída. ${fotosParsed.length} imagens encontradas.`, "success");
      } else {
        addLog(data.detail || "Erro inesperado no scan.", "error");
      }
    } catch (err) {
      addLog("Erro na comunicação com o servidor. O backend (Python) está rodando?", "error");
    } finally {
      set({ isScanning: false });
    }
  },

  generateReport: async () => {
    const state = get();
    if (!state.pastaRaiz || !state.conteudo) {
      return state.addLog("Configurações incompletas para geração.", "error");
    }

    set({ isGenerating: true });
    state.addLog("Iniciando geração do documento Word...", "process");

    // Reconstruir o 'ambienteData' da V3 com base na propriedade 'amb' atual do Grid
    const newAmbienteData: Record<string, string[]> = {};
    for (const p of state.photos) {
      if (p.amb) {
         newAmbienteData[p.path] = [AMBIENTE_COLORS[p.amb]?.label || p.amb];
      }
    }

    try {
      const res = await fetch(`${state.apiUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pasta_raiz: state.pastaRaiz,
          modelo: state.modeloSelecionado,
          pasta_saida: state.pastaSaida || "output",
          conteudo: state.conteudo,
          tipo_relatorio: state.tipoRelatorio,
          selected_description_key: "Desc 1", // Ou puxar de alguma var
          modal_data: state.modalData,
          annotated_images: state.annotatedImages,
          meta_fields: state.metaFields,
          ambiente_data: newAmbienteData, // Envia o agrupamento por ambientes do V4 para o backend
          ...(state.tipoRelatorio === 'sp2' ? { meta_sp2: state.metaFields } : {})
        })
      });
      const data = await res.json();
      if (data.message) {
        state.addLog(`✅ ${data.message}`, "success");
        set({ docGerado: data.output_docx });
      } else {
        state.addLog(data.detail || "Erro na geração.", "error");
      }
    } catch (err) {
      state.addLog("Erro crítico na geração.", "error");
    } finally {
      set({ isGenerating: false });
    }
  },

  downloadReport: async () => {
    const { apiUrl, docGerado, addLog } = get();
    if (!docGerado) return;
    addLog("Iniciando download do relatório...", "process");
    try {
      const res = await fetch(`${apiUrl}/api/download?path=${encodeURIComponent(docGerado)}`);
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = docGerado.split(/[\\/]/).pop() || 'relatorio.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      addLog("✅ Download concluído!", "success");
    } catch (err) {
      addLog("Erro ao baixar o arquivo.", "error");
    }
  },

  // ── Fotos (Mock removido - state puro V4 adaptado para as APIs) ──
  photos: [],
  selection: new Set(),
  lastSelectedIdx: null,

  selectPhoto: (id, idx, shift) => {
    const { selection, lastSelectedIdx, photos } = get();
    const unclassified = photos.filter((p) => !p.amb);
    const newSel = new Set(selection);

    if (shift && lastSelectedIdx !== null) {
      const from = Math.min(idx, lastSelectedIdx);
      const to = Math.max(idx, lastSelectedIdx);
      for (let i = from; i <= to; i++) newSel.add(unclassified[i].id);
    } else {
      if (newSel.has(id) && newSel.size === 1) {
        newSel.clear();
      } else {
        newSel.clear();
        newSel.add(id);
      }
    }
    set({ selection: newSel, lastSelectedIdx: idx });
  },

  clearSelection: () => set({ selection: new Set(), lastSelectedIdx: null }),

  moveToAmbiente: (amb) => {
    const { selection, photos } = get();
    const updated = photos.map((p) =>
      selection.has(p.id) ? { ...p, amb: amb as Ambiente } : p
    );
    set({ photos: updated, selection: new Set(), lastSelectedIdx: null });
  },

  clearAmbiente: () => {
    const { selection, photos } = get();
    const updated = photos.map((p) =>
      selection.has(p.id) ? { ...p, amb: null } : p
    );
    set({ photos: updated, selection: new Set(), lastSelectedIdx: null });
  },

  agenciaName: "",
  setAgenciaName: (name) => set({ agenciaName: name }),

  updateMetaField: (field, value) => set((s) => ({
    metaFields: { ...s.metaFields, [field]: value }
  })),

  getAmbientes: () => {
    const s = get();
    if (!s.photos) return [];
    const fromPhotos = Array.from(new Set(s.photos.map(p => p.amb).filter(Boolean))) as string[];
    return fromPhotos;
  },
}));
