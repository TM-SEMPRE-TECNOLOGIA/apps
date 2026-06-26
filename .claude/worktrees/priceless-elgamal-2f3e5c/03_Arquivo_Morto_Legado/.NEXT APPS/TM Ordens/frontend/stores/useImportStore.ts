import { create } from 'zustand';

export interface ImportFieldMap {
    os: string;
    prefixo: string;
    agencia: string;
    contrato: string;
    estado: string;
    elaborador: string;
    tecnico: string;
    vencimento: string;
    observacoes: string;
}

interface ImportState {
    file: File | null;
    data: any[]; // Raw data from Excel
    columns: string[];
    mapping: Partial<ImportFieldMap>;
    currentStep: number;

    // Actions
    setFile: (file: File | null) => void;
    setData: (data: any[], columns: string[]) => void;
    updateMapping: (field: keyof ImportFieldMap, column: string) => void;
    autoMapColumns: () => void;
    setStep: (step: number) => void;
    reset: () => void;
}

// Map of expected column names in Portuguese to try auto-mapping
const AUTO_MAP_DICTIONARY: Record<keyof ImportFieldMap, string[]> = {
    os: ['os', 'ordem', 'chamado', 'numero', 'nº', 'número os', 'os / servico'],
    prefixo: ['prefixo', 'pref', 'código agência', 'cod'],
    agencia: ['agencia', 'agência', 'nome da agencia', 'unidade'],
    contrato: ['contrato', 'tipo de contrato', 'projeto'],
    estado: ['uf', 'estado', 'est'],
    elaborador: ['elaborador', 'responsavel', 'autor'],
    tecnico: ['tecnico', 'técnico', 'vistoriador', 'executor'],
    vencimento: ['vencimento', 'prazo', 'data final', 'limite', 'data conclusao'],
    observacoes: ['observacoes', 'obs', 'detalhes', 'anotacoes', 'notas']
};

export const useImportStore = create<ImportState>((set, get) => ({
    file: null,
    data: [],
    columns: [],
    mapping: {},
    currentStep: 1,

    setFile: (file) => set({ file }),

    setData: (data, columns) => set({ data, columns }),

    updateMapping: (field, column) => set((state) => ({
        mapping: { ...state.mapping, [field]: column }
    })),

    autoMapColumns: () => {
        const { columns } = get();
        const newMapping: Partial<ImportFieldMap> = {};

        // Convert headers to lowercase and remove spaces/accents for easier matching
        const normalizedCols = columns.map(c =>
            c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
        );

        (Object.keys(AUTO_MAP_DICTIONARY) as Array<keyof ImportFieldMap>).forEach(field => {
            const aliases = AUTO_MAP_DICTIONARY[field];

            // Look for an exact match among aliases
            const matchIndex = normalizedCols.findIndex(col =>
                aliases.some(alias => col.includes(alias) || alias === col)
            );

            if (matchIndex !== -1) {
                newMapping[field] = columns[matchIndex];
            }
        });

        set({ mapping: newMapping });
    },

    setStep: (step) => set({ currentStep: step }),

    reset: () => set({
        file: null,
        data: [],
        columns: [],
        mapping: {},
        currentStep: 1
    })
}));
