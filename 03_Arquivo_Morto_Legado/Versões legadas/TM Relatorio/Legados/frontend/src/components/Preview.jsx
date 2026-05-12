import { useState } from 'react';
import './Preview.css';

const ITENS_POR_PAGINA = 100;

export default function Preview({ conteudo, setConteudo, pastaRaiz, modeloSelecionado, pastaSaida, addLog }) {
    const [selecionados, setSelecionados] = useState(new Set());
    const [pagina, setPagina] = useState(1);
    const [loadingGenerate, setLoadingGenerate] = useState(false);

    const totalPaginas = Math.max(1, Math.ceil(conteudo.length / ITENS_POR_PAGINA));
    const inicio = (pagina - 1) * ITENS_POR_PAGINA;
    const fim = Math.min(inicio + ITENS_POR_PAGINA, conteudo.length);
    const subset = conteudo.slice(inicio, fim);

    // Ações globais
    const handleConfirmarEGerar = async () => {
        if (!modeloSelecionado) {
            addLog("❌ Selecione um modelo antes de gerar.");
            return;
        }

        setLoadingGenerate(true);
        addLog("─".repeat(50));
        addLog("🚀 Gerando relatório com conteúdo editado...");

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pasta_raiz: pastaRaiz,
                    modelo: modeloSelecionado,
                    pasta_saida: pastaSaida,
                    conteudo: conteudo
                })
            });
            const data = await res.json();

            if (res.ok) {
                addLog(`✅ Geração concluída com sucesso!`);
                addLog(`📸 Imagens inseridas: ${data.total_images}`);
                addLog(`📄 Salvo em: ${data.output_docx}`);
                setConteudo(null); // Volta pra tela inicial
            } else {
                addLog(`❌ Erro na geração: ${data.error}`);
            }
        } catch (err) {
            addLog(`❌ Falha de conexão: ${err.message}`);
        } finally {
            setLoadingGenerate(false);
        }
    };

    const handleCancelar = () => {
        addLog("❌ Preview cancelado.");
        setConteudo(null);
    };

    const moverSel = (dir) => {
        if (selecionados.size === 0) return;

        let novoConteudo = [...conteudo];
        let indices = Array.from(selecionados).sort((a, b) => a - b);
        let novosSelecionados = new Set();

        if (dir < 0) {
            for (let i of indices) {
                if (i > 0 && !selecionados.has(i - 1)) {
                    [novoConteudo[i], novoConteudo[i - 1]] = [novoConteudo[i - 1], novoConteudo[i]];
                    novosSelecionados.add(i - 1);
                } else {
                    novosSelecionados.add(i);
                }
            }
        } else {
            for (let i of indices.reverse()) {
                if (i < novoConteudo.length - 1 && !selecionados.has(i + 1)) {
                    [novoConteudo[i], novoConteudo[i + 1]] = [novoConteudo[i + 1], novoConteudo[i]];
                    novosSelecionados.add(i + 1);
                } else {
                    novosSelecionados.add(i);
                }
            }
        }

        setConteudo(novoConteudo);
        setSelecionados(novosSelecionados);
    };

    const excluirSel = () => {
        if (selecionados.size === 0) return;
        if (!window.confirm("Remover todos os itens selecionados?")) return;

        const novoConteudo = conteudo.filter((_, i) => !selecionados.has(i));
        setConteudo(novoConteudo);
        setSelecionados(new Set());

        // Ajusta página se a atual ficar vazia
        if (novoConteudo.length > 0) {
            const novoTotal = Math.ceil(novoConteudo.length / ITENS_POR_PAGINA);
            if (pagina > novoTotal) setPagina(novoTotal);
        } else {
            setPagina(1);
        }
    };

    // Ações de item
    const toggleSelect = (globalIdx) => {
        const next = new Set(selecionados);
        if (next.has(globalIdx)) next.delete(globalIdx);
        else next.add(globalIdx);
        setSelecionados(next);
    };

    const moverItem = (globalIdx, dir) => {
        const novoIdx = globalIdx + dir;
        if (novoIdx >= 0 && novoIdx < conteudo.length) {
            let novoConteudo = [...conteudo];
            [novoConteudo[globalIdx], novoConteudo[novoIdx]] = [novoConteudo[novoIdx], novoConteudo[globalIdx]];
            setConteudo(novoConteudo);

            // Update selecionados para acompanhar o item se estava selecionado
            if (selecionados.has(globalIdx)) {
                const nextSel = new Set(selecionados);
                nextSel.delete(globalIdx);
                nextSel.add(novoIdx);
                setSelecionados(nextSel);
            }
        }
    };

    const removerItem = (globalIdx) => {
        if (window.confirm("Remover este item?")) {
            const novoConteudo = [...conteudo];
            novoConteudo.splice(globalIdx, 1);
            setConteudo(novoConteudo);

            if (selecionados.has(globalIdx)) {
                const nextSel = new Set(selecionados);
                nextSel.delete(globalIdx);
                setSelecionados(nextSel);
            }
        }
    };

    const editarItem = (globalIdx) => {
        let item = conteudo[globalIdx];
        let novoConteudo = [...conteudo];

        if (typeof item === 'string') {
            const novoNome = window.prompt("Novo nome do tópico:", item);
            if (novoNome !== null && novoNome.trim() !== "") {
                novoConteudo[globalIdx] = novoNome;
                setConteudo(novoConteudo);
            }
        } else if (item.quebra_pagina || item.paragrafo) {
            if (item.quebra_pagina) {
                novoConteudo[globalIdx] = { paragrafo: true };
            } else {
                novoConteudo[globalIdx] = { quebra_pagina: true };
            }
            setConteudo(novoConteudo);
        }
    };

    return (
        <div className="preview-container glass-panel">
            {/* Header Preview */}
            <div className="preview-header">
                <h2>👁️ Revise e edite o relatório antes da geração final</h2>
            </div>

            {/* Toolbar */}
            <div className="preview-toolbar">
                <div className="toolbar-left">
                    <button className="btn-tool btn-blue" onClick={() => moverSel(-1)}>▲ Mover</button>
                    <button className="btn-tool btn-blue" onClick={() => moverSel(1)}>▼ Mover</button>
                    <button className="btn-tool btn-red" onClick={excluirSel}>🗑️ Excluir</button>
                </div>
                <div className="toolbar-right">
                    <button className="btn-tool btn-outline" onClick={handleCancelar}>❌ Cancelar</button>
                    <button
                        className="btn-tool btn-green"
                        onClick={handleConfirmarEGerar}
                        disabled={loadingGenerate}
                    >
                        {loadingGenerate ? "Gerando..." : "✅ Confirmar e Gerar"}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="preview-list">
                {subset.map((item, idx) => {
                    const globalIdx = inicio + idx;
                    let isImage = false;
                    let isBreak = false;
                    let isPara = false;
                    let isTopic = typeof item === 'string';

                    let icon = "•";
                    let texto = "";
                    let bgColorClass = "bg-topic";

                    if (item?.imagem) {
                        isImage = true;
                        bgColorClass = "bg-image";
                        icon = "🖼️";
                        texto = item.imagem.split(/[\\/]/).pop(); // Pega nome do arquivo
                    } else if (item?.quebra_pagina) {
                        isBreak = true;
                        bgColorClass = "bg-break";
                        icon = "⤴️";
                        texto = "[Quebra de página]";
                    } else if (item?.paragrafo) {
                        isPara = true;
                        bgColorClass = "bg-para";
                        icon = "¶";
                        texto = "[Parágrafo]";
                    } else if (isTopic) {
                        bgColorClass = "bg-topic";
                        icon = item.includes("»") ? "🔹" : "📁";
                        texto = item;
                    }

                    return (
                        <div key={globalIdx} className={`preview-item ${bgColorClass}`}>
                            <input
                                type="checkbox"
                                className="item-checkbox"
                                checked={selecionados.has(globalIdx)}
                                onChange={() => toggleSelect(globalIdx)}
                            />

                            <div className="item-thumb">
                                {isImage ? (
                                    <img src={`/api/thumbnail?path=${encodeURIComponent(item.imagem)}`} alt={texto} loading="lazy" onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                    <span className="item-icon">{icon}</span>
                                )}
                            </div>

                            <div className="item-text" title={typeof item === 'string' ? item : item.imagem}>
                                {texto}
                            </div>

                            <div className="item-actions">
                                <button title="Excluir" onClick={() => removerItem(globalIdx)}>❌</button>
                                <button title="Editar" onClick={() => editarItem(globalIdx)}>✏️</button>
                                <button title="Subir" onClick={() => moverItem(globalIdx, -1)}>▲</button>
                                <button title="Descer" onClick={() => moverItem(globalIdx, 1)}>▼</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Paginação */}
            <div className="preview-pagination">
                <span className="page-info">
                    Página {pagina} de {totalPaginas} • {conteudo.length} itens
                </span>
                <div className="page-controls">
                    <button
                        disabled={pagina === 1}
                        onClick={() => setPagina(p => p - 1)}
                        className="btn-page"
                    >
                        ◀ Anterior
                    </button>
                    <button
                        disabled={pagina === totalPaginas}
                        onClick={() => setPagina(p => p + 1)}
                        className="btn-page"
                    >
                        Próxima ▶
                    </button>
                </div>
            </div>
        </div>
    );
}
