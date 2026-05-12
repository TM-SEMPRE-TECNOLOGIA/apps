import { useState, useEffect } from 'react';
import './ConfigPanel.css';

export default function ConfigPanel({ pastaRaiz, setPastaRaiz, modeloSelecionado, setModeloSelecionado, pastaSaida, setPastaSaida, addLog }) {
    const [modelos, setModelos] = useState([]);

    const fetchModelos = async () => {
        try {
            const res = await fetch('/api/templates');
            const data = await res.json();
            if (data.templates) {
                setModelos(data.templates);
                // Autoseleciona o primeiro se estiver vazio
                if (!modeloSelecionado && data.templates.length > 0) {
                    setModeloSelecionado(data.templates[0]);
                }
            }
        } catch (error) {
            addLog(`❌ Erro ao buscar templates: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchModelos();
    }, []); // Run once on mount

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload-template', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                addLog(`➕ Modelo adicionado: ${data.filename}`);
                await fetchModelos();
                setModeloSelecionado(data.filename);
            } else {
                addLog(`❌ Falha ao adicionar modelo: ${data.error}`);
            }
        } catch (error) {
            addLog(`❌ Erro de conexão ao adicionar modelo: ${error.message}`);
        }
    };

    const handleSelectFolder = async (setter) => {
        try {
            const res = await fetch('/api/dialog/folder');
            const data = await res.json();
            if (res.ok && data.path) {
                setter(data.path);
            }
        } catch (error) {
            addLog(`❌ Erro ao abrir seletor: ${error.message}`);
        }
    };

    return (
        <div className="config-panel glass-panel">
            <div className="config-group">
                <label>📁 Pasta raiz (fotos):</label>
                <div className="input-row">
                    <input
                        type="text"
                        placeholder="Caminho da pasta com as fotos..."
                        value={pastaRaiz}
                        onChange={(e) => setPastaRaiz(e.target.value)}
                    />
                    <button className="btn-upload" onClick={() => handleSelectFolder(setPastaRaiz)}>
                        Selecionar...
                    </button>
                </div>
            </div>

            <div className="config-group">
                <label>📄 Modelo Word:</label>
                <div className="input-row">
                    <select
                        value={modeloSelecionado}
                        onChange={(e) => setModeloSelecionado(e.target.value)}
                    >
                        {modelos.length === 0 ? (
                            <option value="">Nenhum modelo disponível</option>
                        ) : (
                            modelos.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))
                        )}
                    </select>
                    <label className="btn-upload">
                        <input
                            type="file"
                            accept=".docx"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                        ➕ Adicionar
                    </label>
                </div>
            </div>

            <div className="config-group">
                <label>💾 Pasta de saída:</label>
                <div className="input-row">
                    <input
                        type="text"
                        placeholder="Onde salvar o relatório... (opcional)"
                        value={pastaSaida}
                        onChange={(e) => setPastaSaida(e.target.value)}
                    />
                    <button className="btn-upload" onClick={() => handleSelectFolder(setPastaSaida)}>
                        Selecionar...
                    </button>
                </div>
            </div>
        </div>
    );
}
