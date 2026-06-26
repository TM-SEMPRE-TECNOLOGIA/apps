import { create } from "zustand";

const API = "http://127.0.0.1:5000";

export interface CompareRow {
    item: string;
    qtd_relatorio: number | null;
    qtd_orcamento: number | null;
    status: string;
    diferenca: number | null;
}

export interface Summary {
    total: number;
    "compatível": number;
    divergente: number;
    "não citado no relatório": number;
    "não previsto no orçamento": number;
}

export interface OutputFile {
    name: string;
    path: string;
    size: number;
}

interface CompareStore {
    // Paths
    reportPath: string;
    budgetPath: string;
    setReportPath: (p: string) => void;
    setBudgetPath: (p: string) => void;

    // State
    loading: boolean;
    error: string | null;
    results: CompareRow[];
    summary: Summary | null;
    logPath: string;
    csvPath: string;

    // Filter
    statusFilter: string;
    setStatusFilter: (f: string) => void;

    // Output history
    outputs: OutputFile[];

    // Actions
    selectReport: () => Promise<void>;
    selectBudget: () => Promise<void>;
    runCompare: () => Promise<void>;
    openOutputFolder: () => Promise<void>;
    loadOutputs: () => Promise<void>;
    downloadFile: (filePath: string) => void;
    reset: () => void;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
    reportPath: "",
    budgetPath: "",
    setReportPath: (p) => set({ reportPath: p }),
    setBudgetPath: (p) => set({ budgetPath: p }),

    loading: false,
    error: null,
    results: [],
    summary: null,
    logPath: "",
    csvPath: "",

    statusFilter: "all",
    setStatusFilter: (f) => set({ statusFilter: f }),

    outputs: [],

    selectReport: async () => {
        try {
            const res = await fetch(
                `${API}/api/dialog/file?title=${encodeURIComponent("Selecione o Relatório (DOCX)")}&filetypes=${encodeURIComponent("Relatório DOCX|*.docx")}`
            );
            const data = await res.json();
            if (data.path) set({ reportPath: data.path });
        } catch {
            set({ error: "Erro ao abrir seletor de arquivo." });
        }
    },

    selectBudget: async () => {
        try {
            const res = await fetch(
                `${API}/api/dialog/file?title=${encodeURIComponent("Selecione o Orçamento (XLSX)")}&filetypes=${encodeURIComponent("Orçamento XLSX|*.xlsx")}`
            );
            const data = await res.json();
            if (data.path) set({ budgetPath: data.path });
        } catch {
            set({ error: "Erro ao abrir seletor de arquivo." });
        }
    },

    runCompare: async () => {
        const { reportPath, budgetPath } = get();
        if (!reportPath || !budgetPath) {
            set({ error: "Selecione os dois arquivos antes de comparar." });
            return;
        }
        set({ loading: true, error: null, results: [], summary: null });
        try {
            const res = await fetch(`${API}/api/compare`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ report_path: reportPath, budget_path: budgetPath }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Erro na comparação");
            }
            const data = await res.json();
            set({
                results: data.results,
                summary: data.summary,
                logPath: data.log_path,
                csvPath: data.csv_path,
                loading: false,
            });
        } catch (e: unknown) {
            set({ error: (e as Error).message, loading: false });
        }
    },

    openOutputFolder: async () => {
        try {
            await fetch(`${API}/api/open-folder`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: "output" }),
            });
        } catch {
            // silent
        }
    },

    loadOutputs: async () => {
        try {
            const res = await fetch(`${API}/api/outputs`);
            const data = await res.json();
            set({ outputs: data.files || [] });
        } catch {
            // silent
        }
    },

    downloadFile: (filePath: string) => {
        window.open(`${API}/api/download?path=${encodeURIComponent(filePath)}`, "_blank");
    },

    reset: () =>
        set({
            reportPath: "",
            budgetPath: "",
            results: [],
            summary: null,
            logPath: "",
            csvPath: "",
            error: null,
            statusFilter: "all",
        }),
}));
