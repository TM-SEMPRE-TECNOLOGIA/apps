import { useState } from 'react';
import './ActionBar.css';

export default function ActionBar({ pastaRaiz, modeloSelecionado, pastaSaida, addLog, setConteudo }) {
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [loadingGenerate, setLoadingGenerate] = useState(false);

    const handlePreview = async () => {
        if (!pastaRaiz) {
            addLog("❌ Selecione uma pasta raiz válida.");
            return;
        }

        setLoadingPreview(true);
        addLog("─".repeat(50));
        addLog("👁️ Montando conteúdo para preview...");

        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pasta_raiz: pastaRaiz,
                    pasta_saida: pastaSaida
                })
            });
            const data = await res.json();

            if (res.ok && data.conteudo) {
                addLog(`📊 Conteúdo montado: ${data.conteudo.length} elementos.`);
                setConteudo(data.conteudo); // Isso aciona o render do componente de Preview no App.jsx
            } else {
                addLog(`❌ Erro no preview: ${data.error || 'Erro desconhecido'}`);
            }
        } catch (err) {
            addLog(`❌ Falha de conexão: ${err.message}`);
        } finally {
            setLoadingPreview(false);
        }
    };

    const handleGenerateDirectly = async () => {
        if (!pastaRaiz || !modeloSelecionado) {
            addLog("❌ Verifique a pasta raiz e o modelo selecionado.");
            return;
        }

        setLoadingGenerate(true);
        addLog("─".repeat(50));
        addLog("🚀 Gerando relatório diretamente sem preview...");

        try {
            // 1. Fazer o scan puro
            const resScan = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pasta_raiz: pastaRaiz, pasta_saida: pastaSaida })
            });
            const dataScan = await resScan.json();

            if (!resScan.ok || !dataScan.conteudo) {
                addLog(`❌ Erro ao mapear arquivos: ${dataScan.error}`);
                setLoadingGenerate(false);
                return;
            }

            // 2. Comandar a geração
            const resGen = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pasta_raiz: pastaRaiz,
                    modelo: modeloSelecionado,
                    pasta_saida: pastaSaida,
                    conteudo: dataScan.conteudo
                })
            });
            const dataGen = await resGen.json();

            if (resGen.ok) {
                addLog(`✅ Geração concluída com sucesso!`);
                addLog(`📸 Imagens inseridas: ${dataGen.total_images}`);
                addLog(`📄 Salvo em: ${dataGen.output_docx}`);
            } else {
                addLog(`❌ Erro na geração: ${dataGen.error}`);
            }
        } catch (err) {
            addLog(`❌ Falha de conexão: ${err.message}`);
        } finally {
            setLoadingGenerate(false);
        }
    };

    const handleOpenFolder = async () => {
        try {
            const res = await fetch('/api/open-folder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: pastaSaida })
            });
            if (!res.ok) {
                const data = await res.json();
                addLog(`❌ Não foi possível abrir pasta: ${data.error}`);
            }
        } catch (err) {
            addLog(`❌ Erro de conexão: ${err.message}`);
        }
    };

    return (
        <div className="action-bar header-btn-row">
            <button
                className="btn-action btn-preview"
                onClick={handlePreview}
                disabled={loadingPreview || loadingGenerate}
            >
                {loadingPreview ? "Carregando..." : "👁️ Pré-visualizar"}
            </button>

            <button
                className="btn-action btn-generate"
                onClick={handleGenerateDirectly}
                disabled={loadingPreview || loadingGenerate}
            >
                {loadingGenerate ? "Gerando..." : "🚀 Gerar Direto"}
            </button>

            <button className="btn-action btn-open" onClick={handleOpenFolder}>
                📂 Abrir pasta
            </button>
        </div>
    );
}
