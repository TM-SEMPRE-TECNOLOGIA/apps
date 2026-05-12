import { create } from 'zustand';

const useReorderStore = create((set, get) => ({
    // ============================
    // ESTADO PRINCIPAL
    // ============================
    rootPath: '',
    folderStructure: [], // Array of root level items (Áreas)
    selectedNodes: [], // IDs of the selected nodes for bulk actions
    isLoading: false,
    error: null,
    statusMessage: '',

    // ============================
    // SETTERS & ACTIONS
    // ============================

    toggleSelection: (nodeId) => {
        const state = get();
        if (state.selectedNodes.includes(nodeId)) {
            set({ selectedNodes: state.selectedNodes.filter(id => id !== nodeId) });
        } else {
            set({ selectedNodes: [...state.selectedNodes, nodeId] });
        }
    },

    clearSelection: () => set({ selectedNodes: [] }),

    // Fetch structure from backend API picker
    selectAndLoadFolder: async () => {
        set({ isLoading: true, error: null, statusMessage: 'Aguardando seleção de pasta...', selectedNodes: [] });
        try {
            const response = await fetch('http://localhost:5000/api/select-folder');
            if (!response.ok) {
                throw new Error('Erro ao comunicar com a API local.');
            }
            const data = await response.json();

            if (data.status === 'cancelled') {
                set({ isLoading: false, statusMessage: '' });
                return;
            }

            if (data.status === 'error') {
                throw new Error(data.message);
            }

            set({
                rootPath: data.path,
                folderStructure: data.structure ? data.structure.children || [] : [],
                isLoading: false,
                statusMessage: 'Estrutura carregada com sucesso!',
                selectedNodes: []
            });

            // clear success message after 3 seconds
            setTimeout(() => set({ statusMessage: '' }), 3000);

        } catch (error) {
            set({
                isLoading: false,
                error: 'Falha ao conectar com o Backend Local (Python). Certifique-se que ele está rodando.',
                statusMessage: ''
            });
            console.error(error);
        }
    },

    // Reorder items via drag and drop within same parent (Supports Multi-Select)
    reorderItems: (parentId, sourceId, targetId) => {
        const state = get();
        if (sourceId === targetId) return;

        const newStructure = JSON.parse(JSON.stringify(state.folderStructure));

        const findArray = (nodes, pId) => {
            if (pId === null) return nodes;
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].id === pId) return nodes[i].children;
                if (nodes[i].children) {
                    const res = findArray(nodes[i].children, pId);
                    if (res) return res;
                }
            }
            return null;
        };

        const arr = findArray(newStructure, parentId);
        if (!arr) return;

        // Collect all IDs to move
        const isSourceSelected = state.selectedNodes.includes(sourceId);

        let idsToMove = [sourceId];
        if (isSourceSelected) {
            idsToMove = arr.filter(n => state.selectedNodes.includes(n.id)).map(n => n.id);
        }

        // Prevent moving an item into a group of itself 
        if (idsToMove.includes(targetId)) return;

        const originalTargetIdx = arr.findIndex(n => n.id === targetId);
        const originalSourceIdx = arr.findIndex(n => n.id === sourceId);
        if (originalTargetIdx === -1 || originalSourceIdx === -1) return;

        // Determine drop behavior: 
        // Se estamos movendo um item de cima para baixo na lista, devemos inserir APÓS o target.
        // Se estamos movendo de baixo para cima, devemos inserir ANTES do target.
        const insertAfter = originalSourceIdx < originalTargetIdx;

        const itemsToInsert = [];
        // Extract items from array
        for (let i = arr.length - 1; i >= 0; i--) {
            if (idsToMove.includes(arr[i].id)) {
                const [removed] = arr.splice(i, 1);
                itemsToInsert.unshift(removed); // keep relative order
            }
        }

        // Find target again since array mutated
        let newTargetIdx = arr.findIndex(n => n.id === targetId);

        if (newTargetIdx !== -1) {
            // Apply insertion logic based on direction
            const finalInsertIdx = insertAfter ? newTargetIdx + 1 : newTargetIdx;
            arr.splice(finalInsertIdx, 0, ...itemsToInsert);

            // --- Recalculate Visual Numbering Immediately ---
            const updateVisualNumbering = (nodes, parentPrefix = "") => {
                let sequenceCounter = 1;

                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    let newPrefix = node.prefix_num;

                    // If node has a numeric prefix, assign a new one based on visual order
                    if (node.prefix_num) {
                        if (parentPrefix) {
                            newPrefix = `${parentPrefix}.${sequenceCounter}`;
                            sequenceCounter++;
                        } else {
                            newPrefix = `${sequenceCounter}`;
                            sequenceCounter++;
                        }
                    } else if (node.name.toLowerCase().includes('vista ampla')) {
                        // Do not increment counter for vista ampla
                        newPrefix = "";
                    } else if (node.sep && node.sep.includes('-')) {
                        // It's a non-numeric dashed item "- Detalhes", keep it
                        newPrefix = "";
                    }

                    // Assemble new name visually
                    if (node.prefix_num !== undefined) {
                        node.prefix_num = newPrefix;
                        node.name = newPrefix ? `${newPrefix}${node.sep}${node.clean_name}` : `${node.sep}${node.clean_name}`;
                    }

                    // Recurse for children
                    if (node.children && node.children.length > 0) {
                        const passedPrefix = newPrefix ? newPrefix : "";
                        updateVisualNumbering(node.children, passedPrefix);
                    }
                }
            };

            updateVisualNumbering(newStructure, "");
            // ------------------------------------------------

            set({ folderStructure: newStructure, selectedNodes: [] });
        }
    },

    // Calcula as renomeações e envia para o backend
    saveReorder: async () => {
        const state = get();
        if (!state.rootPath || state.folderStructure.length === 0) return;

        set({ isLoading: true, error: null, statusMessage: 'Calculando nova numeração...' });

        const renames = [];

        // Helper to generate the new names based on array index
        const processNodes = (nodes, parentPrefix = "") => {
            let sequenceCounter = 1;

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                let newCleanName = node.clean_name;
                let newPrefix = node.prefix_num;

                // If node has a numeric prefix, we assign it a new one based on visual order
                if (node.prefix_num) {
                    if (parentPrefix) {
                        // E.g., Parent is "15", child becomes "15.1", "15.2" etc
                        newPrefix = `${parentPrefix}.${sequenceCounter}`;
                        sequenceCounter++;
                    } else {
                        // Root numeric item
                        newPrefix = `${sequenceCounter}`;
                        sequenceCounter++;
                    }
                } else if (node.name.toLowerCase().includes('vista ampla')) {
                    // Do not increment counter for vista ampla
                    newPrefix = "";
                } else if (node.sep && node.sep.includes('-')) {
                    // It's a non-numeric dashed item "- Detalhes", keep it
                    newPrefix = "";
                }

                // Assemble new name
                let newName = node.name;
                if (node.prefix_num !== undefined) {
                    newName = newPrefix ? `${newPrefix}${node.sep}${newCleanName}` : `${node.sep}${newCleanName}`;
                }

                // Clean up path separators
                const pathParts = node.full_path.split(/[\\/]/);
                pathParts[pathParts.length - 1] = newName;
                const newPath = pathParts.join('\\'); // Windows style since backend uses \

                if (newPath !== node.full_path) {
                    renames.push({
                        old_path: node.full_path,
                        new_path: newPath
                    });
                }

                // Build a mock updated node to pass the new path down to children
                if (node.children && node.children.length > 0) {
                    const mockedChildren = node.children.map(c => {
                        const childParts = c.full_path.split(/[\\/]/);
                        // Replace the parent folder part with newName
                        childParts[childParts.length - 2] = newName;
                        return { ...c, full_path: childParts.join('\\') };
                    });

                    // Inherit prefix only if parent had a numeric one, and child has one
                    const passedPrefix = newPrefix ? newPrefix : "";
                    processNodes(mockedChildren, passedPrefix);
                }
            }
        };

        processNodes(state.folderStructure, "");

        if (renames.length === 0) {
            set({ isLoading: false, statusMessage: 'Nenhuma alteração detectada.' });
            setTimeout(() => set({ statusMessage: '' }), 3000);
            return;
        }

        set({ statusMessage: 'Aplicando alterações no disco...' });

        try {
            const response = await fetch('http://localhost:5000/api/rename-folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates: renames })
            });

            if (!response.ok) {
                throw new Error('Falha ao renomear pastas.');
            }

            const data = await response.json();

            if (data.status === 'error') {
                throw new Error(data.message);
            }

            set({
                isLoading: false,
                statusMessage: 'Sucesso: Pastas renomeadas fisicamente no seu computador!'
            });

            // Auto clear state or ask to reload
            setTimeout(() => {
                set({ rootPath: '', folderStructure: [], statusMessage: '' });
            }, 3000);

        } catch (e) {
            set({ isLoading: false, error: e.message || 'Ocorreu um erro no backend.', statusMessage: '' });
        }
    },

    clearState: () => {
        set({ rootPath: '', folderStructure: [], error: null, statusMessage: '' });
    }

}));

export default useReorderStore;
