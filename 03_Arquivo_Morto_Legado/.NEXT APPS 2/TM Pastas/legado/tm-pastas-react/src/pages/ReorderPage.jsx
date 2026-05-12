import React, { useState } from 'react';
import useReorderStore from '../stores/useReorderStore';
import './ReorderPage.css';

function RenderNode({ node, parentId = null, level = 1 }) {
    const { reorderItems, toggleSelection, selectedNodes } = useReorderStore();
    const [isDragOver, setIsDragOver] = useState(false);

    const isSelected = selectedNodes.includes(node.id);

    // Check if this node is considered reorderable. We only allow reordering if it has a prefix_num normally,
    // or if it's a top level item to prevent breaking fixed structures like "Vista ampla".
    const canReorder = level <= 2 || node.prefix_num;

    const handleDragStart = (e) => {
        // Required for Firefox
        e.dataTransfer.setData("application/json", JSON.stringify({ parentId, id: node.id }));
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = "move";

        // --- Smart Auto-Scroll Logic ---
        const buffer = 100; // pixels near the edge to trigger scroll
        const speed = 15; // scroll speed
        const clientY = e.clientY;
        const windowHeight = window.innerHeight;

        if (clientY < buffer) {
            // Scroll Up
            window.scrollBy(0, -speed);
        } else if (clientY > windowHeight - buffer) {
            // Scroll Down
            window.scrollBy(0, speed);
        }
        // -------------------------------

        if (canReorder) {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!canReorder) return;

        try {
            const dataStr = e.dataTransfer.getData("application/json");
            if (!dataStr) return;
            const data = JSON.parse(dataStr);
            // Only allow dropping between siblings 
            if (data.parentId === parentId && data.id !== node.id) {
                reorderItems(parentId, data.id, node.id);
            }
        } catch (err) {
            console.error("Drag drop error", err);
        }
    };

    return (
        <div className={`reorder-node level-${level}`}>
            <div
                className={`reorder-node__header ${canReorder ? 'draggable' : ''} ${isDragOver ? 'drag-over' : ''} ${isSelected ? 'selected' : ''}`}
                draggable={canReorder}
                onDragStart={canReorder ? handleDragStart : undefined}
                onDragOver={canReorder ? handleDragOver : undefined}
                onDragLeave={canReorder ? handleDragLeave : undefined}
                onDrop={canReorder ? handleDrop : undefined}
            >
                {canReorder && (
                    <span className="reorder-node__drag-handle" title="Arraste para reordenar">
                        ☰
                    </span>
                )}
                {canReorder && (
                    <input
                        type="checkbox"
                        className="reorder-node__checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(node.id)}
                        onClick={(e) => e.stopPropagation()}
                        title="Selecionar para mover vários"
                    />
                )}
                <span className="reorder-node__icon">
                    {level === 1 ? '🌎' : level === 2 ? '📍' : level === 3 ? '📂' : '🔍'}
                </span>
                <span className="reorder-node__name">{node.name}</span>
            </div>

            {node.children && node.children.length > 0 && (
                <div className="reorder-node__children">
                    {node.children.map(child => (
                        <RenderNode key={child.id} node={child} parentId={node.id} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ReorderPage() {
    const {
        rootPath, folderStructure, isLoading, error, statusMessage,
        selectAndLoadFolder, saveReorder, clearState
    } = useReorderStore();

    return (
        <div className="reorder-page fade-in">
            <header className="reorder-header">
                <h2>Editar Pastas Existentes no PC</h2>
                <p className="text-muted">Selecione uma pasta principal no seu computador, reordene os itens e salve para renomeá-los fisicamente.</p>
            </header>

            {error && <div className="alert alert-danger">{error}</div>}
            {statusMessage && <div className="alert alert-info">{statusMessage}</div>}

            <div className="reorder-controls card">
                {!rootPath ? (
                    <div className="reorder-empty">
                        <p>Nenhuma pasta selecionada ainda.</p>
                        <button
                            className="btn btn-primary"
                            onClick={selectAndLoadFolder}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Aguardando...' : '📂 Selecionar Pasta Local'}
                        </button>
                        <p className="text-muted" style={{ marginTop: '10px', fontSize: '0.85em' }}>
                            Nota: Se a janela de seleção não aparecer, verifique atrás do seu navegador. O servidor local Python precisa estar rodando.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="reorder-path-info">
                            <strong>Pasta Atual:</strong> {rootPath}
                            <button className="btn btn-ghost btn-sm" onClick={clearState}>Trocar</button>
                        </div>

                        <div className="reorder-tree-container">
                            {folderStructure.length === 0 ? (
                                <p className="text-muted">Nenhum diretório encontrado dentro desta pasta.</p>
                            ) : (
                                folderStructure.map(rootNode => (
                                    <RenderNode key={rootNode.id} node={rootNode} parentId={null} level={1} />
                                ))
                            )}
                        </div>

                        <div className="reorder-actions">
                            <button
                                className="btn btn-success"
                                onClick={saveReorder}
                                disabled={isLoading || folderStructure.length === 0}
                            >
                                {isLoading ? 'Salvando...' : '💾 Salvar Nova Ordem'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
