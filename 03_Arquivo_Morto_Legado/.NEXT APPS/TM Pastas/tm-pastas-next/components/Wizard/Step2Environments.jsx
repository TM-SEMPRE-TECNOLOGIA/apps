import { useState } from 'react';
import useFolderStore from '../../stores/useFolderStore';
import { AMBIENTES_SUGERIDOS, SERVICOS_SUGERIDOS } from '../../data/constants';
import StepAccordion from './StepAccordion';

export default function Step2Environments() {
    const [filtro, setFiltro] = useState('');
    const [tabAtiva, setTabAtiva] = useState('ambientes');
    const [novoItem, setNovoItem] = useState('');

    const {
        areaAtual, itensPorArea, vistaAmplaGeral,
        toggleItem, toggleVistaAmpla,
        adicionarCustomAmbiente, adicionarCustomServico,
        customAmbientes, customServicos,
    } = useFolderStore();

    const selecionados = areaAtual ? (itensPorArea[areaAtual] || []) : [];
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

    const todosAmbientes = uniqueFilter([...AMBIENTES_SUGERIDOS, ...customAmbientes]);
    const todosServicos = uniqueFilter([...SERVICOS_SUGERIDOS, ...customServicos]);

    const ambientesFiltrados = todosAmbientes.filter(
        a => !filtroLower || a.toLowerCase().includes(filtroLower)
    );
    const servicosFiltrados = todosServicos.filter(
        s => !filtroLower || s.toLowerCase().includes(filtroLower)
    );

    const handleAddCustom = () => {
        if (!novoItem.trim()) return;
        if (tabAtiva === 'ambientes') {
            adicionarCustomAmbiente(novoItem);
        } else {
            adicionarCustomServico(novoItem);
        }
        toggleItem(novoItem.trim());
        setNovoItem('');
    };

    return (
        <StepAccordion numero={2} titulo="AMBIENTES / SERVIÇOS">
            {areaAtual && (
                <div className="step-context-label" style={{ color: 'var(--nivel-1)' }}>
                    📌 Área: {areaAtual}
                </div>
            )}

            {/* Vista Ampla Toggle */}
            {areaAtual && (
                <label className="toggle-wrapper" style={{ marginBottom: 'var(--space-sm)' }}>
                    <input
                        type="checkbox"
                        checked={!!vistaAmplaGeral[areaAtual]}
                        onChange={() => toggleVistaAmpla(areaAtual)}
                        style={{ accentColor: 'var(--success-dark)' }}
                    />
                    <span style={{ fontSize: 'var(--font-size-sm)' }}>
                        📷 Incluir &apos;Vista ampla&apos; nesta ÁREA
                    </span>
                </label>
            )}

            {/* Filtro */}
            <input
                className="input input-sm"
                placeholder="🔍 Filtrar ambientes/serviços..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
            />

            {/* Tabs */}
            <div className="tabs" style={{ marginTop: 'var(--space-sm)' }}>
                <button
                    className={`tab ${tabAtiva === 'ambientes' ? 'active' : ''}`}
                    onClick={() => setTabAtiva('ambientes')}
                >
                    Ambientes
                </button>
                <button
                    className={`tab ${tabAtiva === 'servicos' ? 'active' : ''}`}
                    onClick={() => setTabAtiva('servicos')}
                >
                    Serviços
                </button>
            </div>

            {/* Lista */}
            <div className="scrollable-panel" style={{ marginTop: 'var(--space-sm)' }}>
                <div className="checkbox-list">
                    {(tabAtiva === 'ambientes' ? ambientesFiltrados : servicosFiltrados).map((item) => (
                        <label key={item} className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                checked={selecionados.includes(item)}
                                onChange={() => toggleItem(item)}
                            />
                            <span>{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Adicionar Personalizado */}
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
