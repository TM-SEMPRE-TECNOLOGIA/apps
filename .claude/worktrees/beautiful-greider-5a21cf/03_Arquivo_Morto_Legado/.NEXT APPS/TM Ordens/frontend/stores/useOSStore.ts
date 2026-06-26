import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrdemServico, OSStatus, HistoryEntry, Dificuldade } from '../lib/types';
import { DEFAULT_STAGES } from '../lib/constants';

interface OSState {
    ordens: OrdemServico[];

    // Actions
    addOrdem: (os: Omit<OrdemServico, 'id' | 'criadoEm' | 'atualizadoEm' | 'history' | 'dificuldades' | 'stages'>) => void;
    updateOrdem: (id: string, updates: Partial<OrdemServico>) => void;
    deleteOrdem: (id: string) => void;
    updateStage: (id: string, stageId: string, value: boolean) => void;
    addHistory: (id: string, descricao: string, autor: string) => void;
    addDificuldade: (id: string, descricao: string) => void;
    resolveDificuldade: (osId: string, dificuldadeId: string) => void;

    // Batch Actions (for imports)
    importOrdens: (ordens: Omit<OrdemServico, 'id' | 'criadoEm' | 'atualizadoEm' | 'stages' | 'history' | 'dificuldades'>[]) => void;
}

export const useOSStore = create<OSState>()(
    persist(
        (set) => ({
            ordens: [],

            addOrdem: (data) => set((state) => {
                const now = new Date().toISOString();
                const newOrdem: OrdemServico = {
                    ...data,
                    id: crypto.randomUUID(),
                    criadoEm: now,
                    atualizadoEm: now,
                    history: [{ id: crypto.randomUUID(), data: now, descricao: 'OS Criada', autor: 'Sistema' }],
                    dificuldades: [],
                    stages: DEFAULT_STAGES.reduce((acc, stage) => ({ ...acc, [stage.id]: false }), {})
                };
                return { ordens: [...state.ordens, newOrdem] };
            }),

            updateOrdem: (id, updates) => set((state) => ({
                ordens: state.ordens.map((os) =>
                    os.id === id ? { ...os, ...updates, atualizadoEm: new Date().toISOString() } : os
                ),
            })),

            deleteOrdem: (id) => set((state) => ({
                ordens: state.ordens.filter((os) => os.id !== id),
            })),

            updateStage: (id, stageId, value) => set((state) => ({
                ordens: state.ordens.map((os) => {
                    if (os.id !== id) return os;
                    return {
                        ...os,
                        stages: { ...os.stages, [stageId]: value },
                        atualizadoEm: new Date().toISOString()
                    };
                }),
            })),

            addHistory: (id, descricao, autor) => set((state) => ({
                ordens: state.ordens.map((os) => {
                    if (os.id !== id) return os;
                    const newEntry: HistoryEntry = {
                        id: crypto.randomUUID(),
                        data: new Date().toISOString(),
                        descricao,
                        autor
                    };
                    return {
                        ...os,
                        history: [newEntry, ...os.history],
                        atualizadoEm: new Date().toISOString()
                    };
                }),
            })),

            addDificuldade: (id, descricao) => set((state) => ({
                ordens: state.ordens.map((os) => {
                    if (os.id !== id) return os;
                    const newDif: Dificuldade = {
                        id: crypto.randomUUID(),
                        data: new Date().toISOString(),
                        descricao,
                        resolvida: false
                    };
                    return {
                        ...os,
                        dificuldades: [...os.dificuldades, newDif],
                        atualizadoEm: new Date().toISOString(),
                        situacao: 'Com Dificuldade' // Auto update status
                    };
                }),
            })),

            resolveDificuldade: (osId, difId) => set((state) => ({
                ordens: state.ordens.map((os) => {
                    if (os.id !== osId) return os;
                    return {
                        ...os,
                        dificuldades: os.dificuldades.map(d =>
                            d.id === difId ? { ...d, resolvida: true } : d
                        ),
                        atualizadoEm: new Date().toISOString()
                    };
                }),
            })),

            importOrdens: (novasOrdens) => set((state) => {
                const now = new Date().toISOString();
                const mapped = novasOrdens.map(o => ({
                    ...o,
                    id: crypto.randomUUID(),
                    criadoEm: now,
                    atualizadoEm: now,
                    history: [{ id: crypto.randomUUID(), data: now, descricao: 'Sistema', autor: 'Importação em Lote' }],
                    dificuldades: [],
                    stages: DEFAULT_STAGES.reduce((acc, stage) => ({ ...acc, [stage.id]: false }), {})
                }));

                // Evitar duplicidade exata de OS+Agencia talvez (futuro)
                return { ordens: [...mapped, ...state.ordens] };
            })
        }),
        {
            name: 'tm-ordens-storage',
        }
    )
);
