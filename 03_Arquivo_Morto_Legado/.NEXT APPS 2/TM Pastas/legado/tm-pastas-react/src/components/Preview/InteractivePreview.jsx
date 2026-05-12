import { useState } from 'react';
import useFolderStore from '../../stores/useFolderStore';
import { ICONES_NIVEL, CORES_NIVEL, SERVICOS_SUGERIDOS } from '../../data/constants';
import PreviewRow from './PreviewRow';
import EditModal from './EditModal';

export default function InteractivePreview() {
    const store = useFolderStore();
    const [modal, setModal] = useState(null); // { nivel, area, item }

    const {
        nomeLevantamento, areasSelecionadas, itensPorArea,
        subpastasPorItem, detalhesPorSubitem, vistaAmplaGeral,
        areaAtual, itemAtual, subitemAtual,
        selecionarNoPreview, removerDoPreview,
        moverArea, moverItemNaArea, moverSubPastaNoItem,
        adicionarFilhoInline, renomearItem,
        customServicos,
    } = store;

    const nomeRaiz = nomeLevantamento.trim() || 'Levantamento';

    // ============================
    // Modal handlers
    // ============================
    const handleOpenModal = (nivel, area, item) => {
        setModal({ nivel, area, item });
    };

    const getModalItens = () => {
        if (!modal) return [];
        if (modal.nivel === 1) {
            return itensPorArea[modal.area] || [];
        }
        if (modal.nivel === 2) {
            const key = `${modal.area}||${modal.item}`;
            return subpastasPorItem[key] || [];
        }
        return [];
    };

    const handleModalRenomear = (idx, novoNome) => {
        if (modal.nivel === 1) {
            const itens = itensPorArea[modal.area] || [];
            renomearItem(2, modal.area, itens[idx], null, null, novoNome);
        }
    };

    const handleModalMover = (idx, dir) => {
        if (modal.nivel === 1) {
            const itens = itensPorArea[modal.area] || [];
            moverItemNaArea(modal.area, itens[idx], dir);
        }
        if (modal.nivel === 2) {
            const key = `${modal.area}||${modal.item}`;
            const subs = subpastasPorItem[key] || [];
            moverSubPastaNoItem(modal.area, modal.item, subs[idx], dir);
        }
    };

    const handleModalRemover = (idx) => {
        if (modal.nivel === 1) {
            const itens = itensPorArea[modal.area] || [];
            removerDoPreview(2, modal.area, itens[idx]);
        }
        if (modal.nivel === 2) {
            const key = `${modal.area}||${modal.item}`;
            const subs = subpastasPorItem[key] || [];
            removerDoPreview(3, modal.area, modal.item, subs[idx]);
        }
    };

    const handleModalAdicionar = (nome) => {
        if (modal.nivel === 1) {
            adicionarFilhoInline(1, modal.area, null, null, nome);
        }
        if (modal.nivel === 2) {
            adicionarFilhoInline(2, modal.area, modal.item, null, nome);
        }
    };

    // ============================
    // Inline add prompt
    // ============================
    const handleAddInline = (nivel, area, item, sub) => {
        const nome = prompt('Nome do novo item:');
        if (nome && nome.trim()) {
            adicionarFilhoInline(nivel, area, item, sub, nome.trim());
        }
    };

    return (
        <>
            <div className="panel-right__header">
                <h3>👁️ PREVIEW INTERATIVO</h3>
                <div className="panel-right__legend">
                    {Object.entries(ICONES_NIVEL).map(([nivel, icone]) => (
                        <span
                            key={nivel}
                            className="panel-right__legend-item"
                            style={{ color: CORES_NIVEL[nivel] }}
                        >
                            {icone} N{nivel}
                        </span>
                    ))}
                </div>
            </div>

            <div className="panel-right__content">
                {/* Raiz */}
                <PreviewRow
                    texto={`📁 ${nomeRaiz}`}
                    nivel={0}
                    cor="#ffffff"
                    acoes={false}
                />

                {areasSelecionadas.map((area, areaIdx) => {
                    const itens = itensPorArea[area] || [];

                    return (
                        <div key={area}>
                            {/* Área (N1) */}
                            <PreviewRow
                                texto={`${ICONES_NIVEL[1]} ${area}`}
                                nivel={1}
                                cor={CORES_NIVEL[1]}
                                isSelected={areaAtual === area}
                                onSelect={() => selecionarNoPreview(1, area)}
                                onDoubleClick={() => handleOpenModal(1, area)}
                                onMoveUp={areaIdx > 0 ? () => moverArea(area, -1) : null}
                                onMoveDown={areaIdx < areasSelecionadas.length - 1 ? () => moverArea(area, 1) : null}
                                onAdd={() => handleAddInline(1, area)}
                                onRemove={() => removerDoPreview(1, area)}
                            />

                            {/* Vista ampla da área */}
                            {vistaAmplaGeral[area] && (
                                <PreviewRow
                                    texto="📷 Vista ampla"
                                    nivel={2}
                                    cor="var(--nivel-va)"
                                    acoes={false}
                                />
                            )}

                            {/* Itens (N2) */}
                            {itens.map((item, itemIdx) => {
                                const subKey = `${area}||${item}`;
                                const subs = subpastasPorItem[subKey] || [];

                                return (
                                    <div key={`${area}-${item}`}>
                                        <PreviewRow
                                            texto={`${ICONES_NIVEL[2]} ${itemIdx + 1} - ${item}`}
                                            nivel={2}
                                            cor={CORES_NIVEL[2]}
                                            isSelected={areaAtual === area && itemAtual === item}
                                            onSelect={() => selecionarNoPreview(2, area, item)}
                                            onDoubleClick={() => handleOpenModal(2, area, item)}
                                            onMoveUp={itemIdx > 0 ? () => moverItemNaArea(area, item, -1) : null}
                                            onMoveDown={itemIdx < itens.length - 1 ? () => moverItemNaArea(area, item, 1) : null}
                                            onAdd={() => handleAddInline(2, area, item)}
                                            onRemove={() => removerDoPreview(2, area, item)}
                                        />

                                        {/* Subs (N3) */}
                                        {(() => {
                                            let serviceCounter = 0;
                                            return subs.map((sub, subIdx) => {
                                                const ehServico = SERVICOS_SUGERIDOS.includes(sub) || customServicos.includes(sub);
                                                let textoSub;
                                                if (sub.toLowerCase() === 'vista ampla') {
                                                    textoSub = `${ICONES_NIVEL[3]} - ${sub}`;
                                                } else if (ehServico) {
                                                    serviceCounter++;
                                                    textoSub = `${ICONES_NIVEL[3]} ${itemIdx + 1}.${serviceCounter} - ${sub}`;
                                                } else {
                                                    textoSub = `${ICONES_NIVEL[3]} - ${sub}`;
                                                }

                                                const detKey = `${area}||${item}||${sub}`;
                                                const detalhes = detalhesPorSubitem[detKey] || [];

                                                return (
                                                    <div key={`${area}-${item}-${sub}`}>
                                                        <PreviewRow
                                                            texto={textoSub}
                                                            nivel={3}
                                                            cor={CORES_NIVEL[3]}
                                                            isSelected={areaAtual === area && itemAtual === item && subitemAtual === sub}
                                                            onSelect={() => selecionarNoPreview(3, area, item, sub)}
                                                            onMoveUp={subIdx > 0 ? () => moverSubPastaNoItem(area, item, sub, -1) : null}
                                                            onMoveDown={subIdx < subs.length - 1 ? () => moverSubPastaNoItem(area, item, sub, 1) : null}
                                                            onAdd={() => handleAddInline(3, area, item, sub)}
                                                            onRemove={() => removerDoPreview(3, area, item, sub)}
                                                        />

                                                        {/* Detalhes (N4) */}
                                                        {detalhes.map((det) => (
                                                            <PreviewRow
                                                                key={`${area}-${item}-${sub}-${det}`}
                                                                texto={`${ICONES_NIVEL[4]} ${det}`}
                                                                nivel={4}
                                                                cor={CORES_NIVEL[4]}
                                                                onRemove={() => removerDoPreview(4, area, item, sub, det)}
                                                                onMoveUp={null}
                                                                onMoveDown={null}
                                                                onAdd={null}
                                                            />
                                                        ))}
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

                {areasSelecionadas.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--space-3xl)',
                        color: 'var(--text-muted)',
                        fontSize: 'var(--font-size-sm)',
                    }}>
                        Selecione áreas na etapa 1 para visualizar a estrutura
                    </div>
                )}
            </div>

            {/* Modal de Edição */}
            {modal && (
                <EditModal
                    titulo={modal.nivel === 1
                        ? `Editar itens de "${modal.area}"`
                        : `Editar subitens de "${modal.item}"`}
                    itens={getModalItens()}
                    onClose={() => setModal(null)}
                    onRenomear={handleModalRenomear}
                    onMover={handleModalMover}
                    onRemover={handleModalRemover}
                    onAdicionar={handleModalAdicionar}
                />
            )}
        </>
    );
}
