import { useState } from 'react';

export default function EditModal({ titulo, itens, onClose, onRenomear, onMover, onRemover, onAdicionar }) {
    const [novoItem, setNovoItem] = useState('');

    const handleAdd = () => {
        if (!novoItem.trim()) return;
        onAdicionar(novoItem.trim());
        setNovoItem('');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>✏️ {titulo}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    {itens.map((item, idx) => (
                        <div
                            key={`${item}-${idx}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-sm)',
                                padding: 'var(--space-sm) var(--space-md)',
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-md)',
                            }}
                        >
                            <span style={{ flex: 1, fontSize: 'var(--font-size-sm)' }}>{item}</span>

                            <button
                                className="btn-icon"
                                title="Renomear"
                                onClick={() => {
                                    const novo = prompt(`Renomear "${item}" para:`, item);
                                    if (novo && novo.trim() && novo.trim() !== item) {
                                        onRenomear(idx, novo.trim());
                                    }
                                }}
                            >
                                ✏️
                            </button>
                            <button
                                className="btn-icon"
                                title="Mover para cima"
                                onClick={() => onMover(idx, -1)}
                                disabled={idx === 0}
                            >
                                ▲
                            </button>
                            <button
                                className="btn-icon"
                                title="Mover para baixo"
                                onClick={() => onMover(idx, 1)}
                                disabled={idx === itens.length - 1}
                            >
                                ▼
                            </button>
                            <button
                                className="btn-icon"
                                title="Remover"
                                onClick={() => onRemover(idx)}
                                style={{ color: 'var(--danger)' }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                {/* Adicionar novo */}
                <div className="custom-input-row" style={{ marginTop: 'var(--space-lg)' }}>
                    <input
                        className="input input-sm"
                        placeholder="Adicionar novo item..."
                        value={novoItem}
                        onChange={(e) => setNovoItem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button className="btn btn-ghost" onClick={handleAdd}>+</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-lg)' }}>
                    <button className="btn btn-primary btn-sm" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
}
