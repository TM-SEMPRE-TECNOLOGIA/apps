import useFolderStore from '../../stores/useFolderStore';
import { ICONES_NIVEL, CORES_NIVEL } from '../../data/constants';

export default function PreviewRow({
    texto,
    nivel,
    cor,
    isSelected = false,
    acoes = true,
    onSelect,
    onDoubleClick,
    onAdd,
    onRemove,
    onMoveUp,
    onMoveDown,
}) {
    const indent = nivel * 20;

    return (
        <div
            className="preview-row"
            style={{
                paddingLeft: `${indent + 8}px`,
                backgroundColor: isSelected ? 'var(--bg-selected)' : 'transparent',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: `4px 8px 4px ${indent + 8}px`,
                cursor: onSelect ? 'pointer' : 'default',
                transition: 'var(--transition-fast)',
                minHeight: '30px',
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect?.();
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                onDoubleClick?.();
            }}
            onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
            }}
            onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
            }}
        >
            <span
                style={{
                    color: cor,
                    fontSize: 'var(--font-size-sm)',
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {texto}
            </span>

            {acoes && (
                <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                    {onMoveUp && (
                        <button
                            className="btn-icon"
                            title="Mover para cima"
                            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                        >
                            ▲
                        </button>
                    )}
                    {onMoveDown && (
                        <button
                            className="btn-icon"
                            title="Mover para baixo"
                            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                        >
                            ▼
                        </button>
                    )}
                    {onAdd && (
                        <button
                            className="btn-icon"
                            title="Adicionar filho"
                            onClick={(e) => { e.stopPropagation(); onAdd(); }}
                            style={{ color: 'var(--success)' }}
                        >
                            +
                        </button>
                    )}
                    {onRemove && (
                        <button
                            className="btn-icon"
                            title="Remover"
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            style={{ color: 'var(--danger)' }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
