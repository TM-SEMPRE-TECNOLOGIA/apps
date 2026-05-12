import { useState } from 'react';
import useFolderStore from '../../stores/useFolderStore';
import { SUBPASTAS_SUGERIDAS } from '../../data/constants';
import StepAccordion from './StepAccordion';

export default function Step4Details() {
    const [filtro, setFiltro] = useState('');
    const [novoItem, setNovoItem] = useState('');

    const {
        areaAtual, itemAtual, subitemAtual,
        detalhesPorSubitem, toggleNivel4,
        adicionarCustomDetalhe, customDetalhes,
    } = useFolderStore();

    const key = areaAtual && itemAtual && subitemAtual
        ? `${areaAtual}||${itemAtual}||${subitemAtual}`
        : null;
    const selecionados = key ? (detalhesPorSubitem[key] || []) : [];
    const filtroLower = filtro.toLowerCase().trim();

    const uniqueFilter = (arr) => {
        const seen = new Set();
        return arr.filter((item) => {
            const lower = item.toLowerCase().trim();
            if (seen.has(lower)) return false;
            seen.add(lower);
            return true;
        });
    };

    const todos = uniqueFilter([...SUBPASTAS_SUGERIDAS, ...customDetalhes]);
    const filtrados = todos.filter(
        d => !filtroLower || d.toLowerCase().includes(filtroLower)
    );

    const handleAddCustom = () => {
        if (!novoItem.trim()) return;
        adicionarCustomDetalhe(novoItem);
        toggleNivel4(novoItem.trim());
        setNovoItem('');
    };

    return (
        <StepAccordion numero={4} titulo="DETALHES">
            {subitemAtual && (
                <div className="step-context-label" style={{ color: 'var(--nivel-3)' }}>
                    📌 Serviço: {subitemAtual}
                </div>
            )}

            <input
                className="input input-sm"
                placeholder="🔍 Filtrar detalhes..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
            />

            <div className="scrollable-panel" style={{ marginTop: 'var(--space-sm)' }}>
                <div className="checkbox-list">
                    {filtrados.map((det) => (
                        <label key={det} className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                checked={selecionados.includes(det)}
                                onChange={() => toggleNivel4(det)}
                            />
                            <span>{det}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="custom-input-row">
                <input
                    className="input input-sm"
                    placeholder="Novo detalhe..."
                    value={novoItem}
                    onChange={(e) => setNovoItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                />
                <button className="btn btn-ghost" onClick={handleAddCustom}>+</button>
            </div>
        </StepAccordion>
    );
}
