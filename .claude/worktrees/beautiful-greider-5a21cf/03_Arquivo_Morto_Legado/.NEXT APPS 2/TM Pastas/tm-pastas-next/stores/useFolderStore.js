import { create } from 'zustand';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SERVICOS_SUGERIDOS } from '../data/constants';

const useFolderStore = create((set, get) => ({
    // ============================
    // ESTADO PRINCIPAL
    // ============================
    nomeLevantamento: '',
    areasSelecionadas: [],
    itensPorArea: {},           // { area: [item1, item2] }
    subpastasPorItem: {},       // { "area||item": [sub1, sub2] }
    detalhesPorSubitem: {},     // { "area||item||sub": [det1] }
    vistaAmplaGeral: {},        // { area: true/false }

    // Itens customizados
    customAmbientes: [],
    customServicos: [],
    customSubpastas: [],
    customDetalhes: [],

    // Navegação / Contexto atual
    areaAtual: null,
    itemAtual: null,
    subitemAtual: null,
    etapaAtiva: 1,

    // ============================
    // SETTERS SIMPLES
    // ============================
    setNomeLevantamento: (nome) => set({ nomeLevantamento: nome }),

    setEtapaAtiva: (etapa) => {
        const state = get();
        // Bloqueios inteligentes
        if (etapa > 1 && state.areasSelecionadas.length === 0) return;
        if (etapa > 2 && !(state.areaAtual && (state.itensPorArea[state.areaAtual] || []).length > 0)) return;
        if (etapa > 3 && !(state.areaAtual && state.itemAtual && (state.subpastasPorItem[`${state.areaAtual}||${state.itemAtual}`] || []).length > 0)) return;
        set({ etapaAtiva: etapa });
    },

    // ============================
    // TOGGLE ACTIONS
    // ============================
    toggleArea: (area) => set((state) => {
        const list = [...state.areasSelecionadas];
        const idx = list.indexOf(area);
        if (idx >= 0) {
            list.splice(idx, 1);
            // Limpar seleção se removeu a área ativa
            const updates = {};
            if (state.areaAtual === area) {
                updates.areaAtual = null;
                updates.itemAtual = null;
                updates.subitemAtual = null;
            }
            return { areasSelecionadas: list, ...updates };
        } else {
            list.push(area);
            return { areasSelecionadas: list, areaAtual: area, etapaAtiva: 2 };
        }
    }),

    toggleVistaAmpla: (area) => set((state) => ({
        vistaAmplaGeral: {
            ...state.vistaAmplaGeral,
            [area]: !state.vistaAmplaGeral[area],
        },
    })),

    toggleItem: (item) => set((state) => {
        const area = state.areaAtual;
        if (!area) return {};
        const list = [...(state.itensPorArea[area] || [])];
        const idx = list.indexOf(item);
        if (idx >= 0) {
            list.splice(idx, 1);
            const updates = {};
            if (state.itemAtual === item) {
                updates.itemAtual = null;
                updates.subitemAtual = null;
            }
            return {
                itensPorArea: { ...state.itensPorArea, [area]: list },
                ...updates,
            };
        } else {
            list.push(item);
            return {
                itensPorArea: { ...state.itensPorArea, [area]: list },
                itemAtual: item,
                etapaAtiva: 3,
            };
        }
    }),

    toggleSub: (sub) => set((state) => {
        const area = state.areaAtual;
        const item = state.itemAtual;
        if (!area || !item) return {};
        const key = `${area}||${item}`;
        const list = [...(state.subpastasPorItem[key] || [])];
        const idx = list.indexOf(sub);
        if (idx >= 0) {
            list.splice(idx, 1);
            const updates = {};
            if (state.subitemAtual === sub) {
                updates.subitemAtual = null;
            }
            return {
                subpastasPorItem: { ...state.subpastasPorItem, [key]: list },
                ...updates,
            };
        } else {
            list.push(sub);
            return {
                subpastasPorItem: { ...state.subpastasPorItem, [key]: list },
                subitemAtual: sub,
                etapaAtiva: 4,
            };
        }
    }),

    toggleNivel4: (detalhe) => set((state) => {
        const area = state.areaAtual;
        const item = state.itemAtual;
        const sub = state.subitemAtual;
        if (!area || !item || !sub) return {};
        const key = `${area}||${item}||${sub}`;
        const list = [...(state.detalhesPorSubitem[key] || [])];
        const idx = list.indexOf(detalhe);
        if (idx >= 0) {
            list.splice(idx, 1);
        } else {
            list.push(detalhe);
        }
        return {
            detalhesPorSubitem: { ...state.detalhesPorSubitem, [key]: list },
        };
    }),

    // ============================
    // SELEÇÃO DE CONTEXTO (PREVIEW)
    // ============================
    selecionarNoPreview: (nivel, area, item, sub) => set(() => {
        const updates = { areaAtual: area || null };
        if (nivel >= 2) updates.itemAtual = item || null;
        else updates.itemAtual = null;
        if (nivel >= 3) updates.subitemAtual = sub || null;
        else updates.subitemAtual = null;

        updates.etapaAtiva = Math.min(nivel + 1, 4);
        return updates;
    }),

    // ============================
    // ADICIONAR CUSTOM E PERSISTIR
    // ============================
    carregarCustomItems: async () => {
        try {
            const res = await fetch('/api/custom-items');
            if (res.ok) {
                const data = await res.json();
                set({
                    customAmbientes: data.customAmbientes || [],
                    customServicos: data.customServicos || [],
                    customSubpastas: data.customSubpastas || [],
                    customDetalhes: data.customDetalhes || []
                });
            }
        } catch (error) {
            console.error('Erro ao carregar itens customizados', error);
        }
    },

    salvarItemCustom: async (type, item) => {
        try {
            await fetch('/api/custom-items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'add', key: type, item: item.trim() })
            });
        } catch (error) {
            console.error('Erro ao salvar item', error);
        }
    },

    adicionarCustomAmbiente: (nome) => set((state) => {
        if (!nome.trim() || state.customAmbientes.includes(nome.trim())) return {};
        state.salvarItemCustom('customAmbientes', nome);
        return { customAmbientes: [...state.customAmbientes, nome.trim()] };
    }),

    adicionarCustomServico: (nome) => set((state) => {
        if (!nome.trim() || state.customServicos.includes(nome.trim())) return {};
        state.salvarItemCustom('customServicos', nome);
        return { customServicos: [...state.customServicos, nome.trim()] };
    }),

    adicionarCustomSubpasta: (nome) => set((state) => {
        if (!nome.trim() || state.customSubpastas.includes(nome.trim())) return {};
        state.salvarItemCustom('customSubpastas', nome);
        return { customSubpastas: [...state.customSubpastas, nome.trim()] };
    }),

    adicionarCustomDetalhe: (nome) => set((state) => {
        if (!nome.trim() || state.customDetalhes.includes(nome.trim())) return {};
        state.salvarItemCustom('customDetalhes', nome);
        return { customDetalhes: [...state.customDetalhes, nome.trim()] };
    }),

    // ============================
    // MOVER / REMOVER ITENS
    // ============================
    moverItem: (lista, item, direcao) => {
        // direcao: -1 (cima) / +1 (baixo)
        const arr = [...lista];
        const idx = arr.indexOf(item);
        if (idx < 0) return arr;
        const newIdx = idx + direcao;
        if (newIdx < 0 || newIdx >= arr.length) return arr;
        [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
        return arr;
    },

    moverArea: (area, direcao) => set((state) => {
        const arr = [...state.areasSelecionadas];
        const idx = arr.indexOf(area);
        const newIdx = idx + direcao;
        if (newIdx < 0 || newIdx >= arr.length) return {};
        [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
        return { areasSelecionadas: arr };
    }),

    moverItemNaArea: (area, item, direcao) => set((state) => {
        const list = [...(state.itensPorArea[area] || [])];
        const idx = list.indexOf(item);
        const newIdx = idx + direcao;
        if (newIdx < 0 || newIdx >= list.length) return {};
        [list[idx], list[newIdx]] = [list[newIdx], list[idx]];
        return { itensPorArea: { ...state.itensPorArea, [area]: list } };
    }),

    moverSubPastaNoItem: (area, item, sub, direcao) => set((state) => {
        const key = `${area}||${item}`;
        const list = [...(state.subpastasPorItem[key] || [])];
        const idx = list.indexOf(sub);
        const newIdx = idx + direcao;
        if (newIdx < 0 || newIdx >= list.length) return {};
        [list[idx], list[newIdx]] = [list[newIdx], list[idx]];
        return { subpastasPorItem: { ...state.subpastasPorItem, [key]: list } };
    }),

    removerDoPreview: (nivel, area, item, sub, detalhe) => set((state) => {
        if (nivel === 1) {
            const list = state.areasSelecionadas.filter(a => a !== area);
            const updates = {};
            if (state.areaAtual === area) {
                updates.areaAtual = null;
                updates.itemAtual = null;
                updates.subitemAtual = null;
            }
            return { areasSelecionadas: list, ...updates };
        }
        if (nivel === 2) {
            const list = (state.itensPorArea[area] || []).filter(i => i !== item);
            const updates = {};
            if (state.itemAtual === item) {
                updates.itemAtual = null;
                updates.subitemAtual = null;
            }
            return {
                itensPorArea: { ...state.itensPorArea, [area]: list },
                ...updates,
            };
        }
        if (nivel === 3) {
            const key = `${area}||${item}`;
            const list = (state.subpastasPorItem[key] || []).filter(s => s !== sub);
            const updates = {};
            if (state.subitemAtual === sub) {
                updates.subitemAtual = null;
            }
            return {
                subpastasPorItem: { ...state.subpastasPorItem, [key]: list },
                ...updates,
            };
        }
        if (nivel === 4) {
            const key = `${area}||${item}||${sub}`;
            const list = (state.detalhesPorSubitem[key] || []).filter(d => d !== detalhe);
            return { detalhesPorSubitem: { ...state.detalhesPorSubitem, [key]: list } };
        }
        return {};
    }),

    adicionarFilhoInline: (nivel, area, item, sub, nome) => set((state) => {
        if (!nome || !nome.trim()) return {};
        const trimmed = nome.trim();
        if (nivel === 1) {
            // Adicionar item na área
            const list = [...(state.itensPorArea[area] || [])];
            if (list.includes(trimmed)) return {};
            list.push(trimmed);
            return { itensPorArea: { ...state.itensPorArea, [area]: list } };
        }
        if (nivel === 2) {
            // Adicionar subpasta no item
            const key = `${area}||${item}`;
            const list = [...(state.subpastasPorItem[key] || [])];
            if (list.includes(trimmed)) return {};
            list.push(trimmed);
            return { subpastasPorItem: { ...state.subpastasPorItem, [key]: list } };
        }
        if (nivel === 3) {
            // Adicionar detalhe na subpasta
            const key = `${area}||${item}||${sub}`;
            const list = [...(state.detalhesPorSubitem[key] || [])];
            if (list.includes(trimmed)) return {};
            list.push(trimmed);
            return { detalhesPorSubitem: { ...state.detalhesPorSubitem, [key]: list } };
        }
        return {};
    }),

    renomearItem: (nivel, area, item, sub, detalhe, novoNome) => set((state) => {
        if (!novoNome || !novoNome.trim()) return {};
        const trimmed = novoNome.trim();

        if (nivel === 1) {
            const idx = state.areasSelecionadas.indexOf(area);
            if (idx < 0) return {};
            const newAreas = [...state.areasSelecionadas];
            newAreas[idx] = trimmed;
            const updates = {};
            if (state.areaAtual === area) updates.areaAtual = trimmed;
            // Update dependent keys
            const newItensPorArea = { ...state.itensPorArea };
            if (newItensPorArea[area]) {
                newItensPorArea[trimmed] = newItensPorArea[area];
                delete newItensPorArea[area];
            }
            const newVA = { ...state.vistaAmplaGeral };
            if (area in newVA) {
                newVA[trimmed] = newVA[area];
                delete newVA[area];
            }
            return { areasSelecionadas: newAreas, itensPorArea: newItensPorArea, vistaAmplaGeral: newVA, ...updates };
        }

        if (nivel === 2) {
            const list = [...(state.itensPorArea[area] || [])];
            const idx = list.indexOf(item);
            if (idx < 0) return {};
            list[idx] = trimmed;
            const updates = {};
            if (state.itemAtual === item) updates.itemAtual = trimmed;
            return { itensPorArea: { ...state.itensPorArea, [area]: list }, ...updates };
        }

        return {};
    }),

    // ============================
    // GERAR ESTRUTURA (ZIP)
    // ============================
    gerarEstruturaZip: async () => {
        const state = get();
        const nomeRaiz = state.nomeLevantamento.trim() || 'Levantamento';

        if (state.areasSelecionadas.length === 0) {
            alert('Selecione pelo menos uma área!');
            return;
        }

        const zip = new JSZip();
        const root = zip.folder(nomeRaiz);

        for (const area of state.areasSelecionadas) {
            let areaNome = area;
            const areaLower = area.toLowerCase().trim();
            if (['área externa', 'área interna'].includes(areaLower) && !area.trim().startsWith('-')) {
                areaNome = `- ${area.trim()}`;
            }
            const areaFolder = root.folder(areaNome);

            // Vista ampla da área
            if (state.vistaAmplaGeral[area]) {
                areaFolder.folder('- Vista ampla');
            }

            const itens = state.itensPorArea[area] || [];
            let serviceCounter = 0;

            for (const item of itens) {
                const ehServico = SERVICOS_SUGERIDOS.includes(item) || state.customServicos.includes(item);
                serviceCounter++;
                const itemNome = `${serviceCounter} - ${item}`;
                const itemFolder = areaFolder.folder(itemNome);

                const key = `${area}||${item}`;
                const subs = state.subpastasPorItem[key] || [];
                let subServiceCounter = 0;

                for (const sub of subs) {
                    const subEhServico = SERVICOS_SUGERIDOS.includes(sub) || state.customServicos.includes(sub);

                    let subNome;
                    const subHasHyphen = sub.trim().startsWith('-');
                    if (subEhServico) {
                        subServiceCounter++;
                        subNome = `${serviceCounter}.${subServiceCounter} - ${sub}`;
                    } else {
                        subNome = subHasHyphen ? sub.trim() : `- ${sub.trim()}`;
                    }

                    const subFolder = itemFolder.folder(subNome);

                    const detKey = `${area}||${item}||${sub}`;
                    const detalhes = state.detalhesPorSubitem[detKey] || [];
                    for (const det of detalhes) {
                        let detNome = det;
                        const detLower = det.toLowerCase().trim();
                        if (['detalhes', 'vista ampla'].includes(detLower) && !det.trim().startsWith('-')) {
                            detNome = `- ${det.trim()}`;
                        }
                        subFolder.folder(detNome);
                    }
                }
            }
        }

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${nomeRaiz}.zip`);
    },

    // ============================
    // LIMPAR SELEÇÃO
    // ============================
    limparSelecao: () => set({
        nomeLevantamento: '',
        areasSelecionadas: [],
        itensPorArea: {},
        subpastasPorItem: {},
        detalhesPorSubitem: {},
        vistaAmplaGeral: {},
        customAmbientes: [],
        customServicos: [],
        customSubpastas: [],
        customDetalhes: [],
        areaAtual: null,
        itemAtual: null,
        subitemAtual: null,
        etapaAtiva: 1,
    }),
}));

export default useFolderStore;
