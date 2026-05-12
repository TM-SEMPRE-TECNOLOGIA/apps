import './Changelog.css';

export default function Changelog() {
    return (
        <div className="changelog-container glass-panel">
            <div className="changelog-header-main">
                <h1>🎨 Histórico de Desenvolvimento</h1>
                <p className="subtitle">
                    Gerador de Relatório Fotográfico<br />
                    <span className="brand-text">TM - Sempre Tecnologia</span> | Thiago Nascimento Barbosa
                </p>
            </div>

            {/* COMMIT NOVO: REACT / VITE */}
            <div className="commit success">
                <div className="commit-header">
                    <span className="commit-time">24/02/2026 - 16:00</span>
                    <span className="commit-tag done">Concluído</span>
                </div>
                <div className="commit-title">🌐 Migração para Arquitetura Web (Vite/React + Flask)</div>
                <div className="commit-desc">
                    Transformação completa do desktop (CustomTkinter) para uma aplicação web nativa:
                    <ul>
                        <li>✅ <strong>Frontend Vite + React:</strong> UI reconstruída com Componentes, mantendo a identidade visual Premium Dark.</li>
                        <li>✅ <strong>Backend Flask:</strong> Servidor local servindo a API responsável pelo escaneamento de pasta e geração DOCX.</li>
                        <li>✅ <strong>Preview Otimizado:</strong> O módulo de pré-visualização agora roda no navegador, com paginação fluída e thumbnails reais (base64).</li>
                        <li>✅ <strong>Orquestração:</strong> <code>run_app.bat</code> atualizado para iniciar ambos os servidores automaticamente.</li>
                    </ul>
                </div>
            </div>

            {/* COMMIT 4 */}
            <div className="commit success">
                <div className="commit-header">
                    <span class="commit-time">06/02/2026 - 04:56</span>
                    <span class="commit-tag done">Concluído</span>
                </div>
                <div className="commit-title">📦 Atualização de Dependências</div>
                <div className="commit-desc">
                    Arquivo requirements.txt atualizado com CustomTkinter, python-docx e Pillow.
                </div>
            </div>

            {/* COMMIT 3 */}
            <div className="commit success">
                <div className="commit-header">
                    <span className="commit-time">06/02/2026 - 04:55</span>
                    <span className="commit-tag done">Concluído</span>
                </div>
                <div className="commit-title">👁️ Migração do ui_preview.py</div>
                <div className="commit-desc">
                    Janela de pré-visualização modernizada com cards coloridos e CTkScrollableFrame.
                </div>
            </div>

            {/* COMMIT 2 */}
            <div className="commit success">
                <div className="commit-header">
                    <span className="commit-time">06/02/2026 - 04:54</span>
                    <span className="commit-tag done">Concluído</span>
                </div>
                <div className="commit-title">📁 Migração do app.py</div>
                <div className="commit-desc">
                    Arquivo principal migrado para CustomTkinter com tema Dark Premium e botões coloridos.
                </div>
            </div>

            {/* COMMIT 1 */}
            <div className="commit success">
                <div className="commit-header">
                    <span className="commit-time">06/02/2026 - 04:53</span>
                    <span className="commit-tag done">Concluído</span>
                </div>
                <div className="commit-title">🚀 Início da Modernização Visual</div>
                <div className="commit-desc">
                    Análise completa do projeto (Tkinter + ttk) e definição da paleta de cores GitHub Dark.
                </div>
            </div>
        </div>
    );
}
