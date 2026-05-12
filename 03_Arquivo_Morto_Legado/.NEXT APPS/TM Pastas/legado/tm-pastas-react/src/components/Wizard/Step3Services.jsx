import { useState } from 'react';
import useFolderStore from '../../stores/useFolderStore';
import { SUBPASTAS_SUGERIDAS, SERVICOS_SUGERIDOS } from '../../data/constants';
import StepAccordion from './StepAccordion';

export default function Step3Services() {
    const [filtro, setFiltro] = useState('');
    const [tabAtiva, setTabAtiva] = useState('padrao');
    const [novoItem, setNovoItem] = useState('');

    const {
        areaAtual, itemAtual, subpastasPorItem,
        toggleSub,
        adicionarCustomSubpasta, adicionarCustomServico,
        customSubpastas, customServicos,
    } = useFolderStore();

    const key = areaAtual && itemAtual ? `${areaAtual}||${itemAtual}` : null;
    const selecionados = key ? (subpastasPorItem[key] || []) : [];
    const filtroLower = filtro.toLowerCase().trim();

    const todosPadrao = [...SUBPASTAS_SUGERIDAS, ...customSubpastas];
    const todosServicos = [...SERVICOS_SUGERIDOS, ...customServicos.filter(s => !SERVICOS_SUGERIDOS.includes(s))];

    const padraoFiltrados = todosPadrao.filter(
        s => !filtroLower || s.toLowerCase().includes(filtroLower)
    );
    const servicosFiltrados = todosServicos.filter(
        s => !filtroLower || s.toLowerCase().includes(filtroLower)
    );

    const handleAddCustom = () => {
        if (!novoItem.trim()) return;
        if (tabAtiva === 'padrao') {
            adicionarCustomSubpasta(novoItem);
        } else {
            adicionarCustomServico(novoItem);
        }
        toggleSub(novoItem.trim());
        setNovoItem('');
    };

    return (
        <StepAccordion numero={3} titulo="SERVIÇOS / SUBPASTAS">
            {itemAtual && (
                <div className="step-context-label" style={{ color: 'var(--nivel-2)' }}>
                    📌 Ambiente: {itemAtual}
                </div>
            )}

            <input
                className="input input-sm"
                placeholder="🔍 Filtrar subpastas/serviços..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
            />

            <div className="tabs" style={{ marginTop: 'var(--space-sm)' }}>
                <button
                    className={`tab ${tabAtiva === 'padrao' ? 'active' : ''}`}
                    onClick={() => setTabAtiva('padrao')}
                >
                    Padrão
                </button>
                <button
                    className={`tab ${tabAtiva === 'servicos' ? 'active' : ''}`}
                    onClick={() => setTabAtiva('servicos')}
                >
                    Serviços
                </button>
            </div>

            <div className="scrollable-panel" style={{ marginTop: 'var(--space-sm)' }}>
                <div className="checkbox-list">
                    {(tabAtiva === 'padrao' ? padraoFiltrados : servicosFiltrados).map((item) => (
                        <label key={item} className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                checked={selecionados.includes(item)}
                                onChange={() => toggleSub(item)}
                            />
                            <span>{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="custom-input-row">
                <input
                    className="input input-sm"
                    placeholder="Novo item..."
                    value={novoItem}
                    onChange={(e) => setNovoItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                />
                <button className="btn btn-ghost" onClick={handleAddCustom}>+</button>
            </div>
        </StepAccordion>
    );
}
