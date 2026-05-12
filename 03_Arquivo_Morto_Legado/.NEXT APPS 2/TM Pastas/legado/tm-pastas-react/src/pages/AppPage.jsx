import { Link } from 'react-router-dom';
import useFolderStore from '../stores/useFolderStore';
import { APP_VERSION } from '../data/constants';
import Step1Areas from '../components/Wizard/Step1Areas';
import Step2Environments from '../components/Wizard/Step2Environments';
import Step3Services from '../components/Wizard/Step3Services';
import Step4Details from '../components/Wizard/Step4Details';
import InteractivePreview from '../components/Preview/InteractivePreview';

export default function AppPage() {
    const {
        nomeLevantamento, setNomeLevantamento,
        gerarEstruturaZip, limparSelecao,
    } = useFolderStore();

    return (
        <div className="app-container">
            {/* Header */}
            <header className="app-header">
                <h1 className="app-header__title">
                    🏗️ Gerador de Estrutura de Pastas <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>v{APP_VERSION}</span>
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }}>
                    <nav style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <Link to="/guia" className="btn btn-ghost" style={{ textDecoration: 'none' }}>📖 Guia</Link>
                        <Link to="/changelog" className="btn btn-ghost" style={{ textDecoration: 'none' }}>🚀 Novidades</Link>
                    </nav>
                    <div className="app-header__sig">
                        <div className="app-header__sig-company">TM - Sempre Tecnologia</div>
                        <div className="app-header__sig-author">Thiago Nascimento Barbosa</div>
                    </div>
                </div>
            </header>

            {/* Config Bar */}
            <div className="config-bar">
                <div className="config-bar__group">
                    <span className="config-bar__label">📋 Levantamento:</span>
                    <input
                        className="input"
                        placeholder="Ex: 01 - Arcos - Enviado"
                        value={nomeLevantamento}
                        onChange={(e) => setNomeLevantamento(e.target.value)}
                        style={{ width: '350px' }}
                    />
                </div>
            </div>

            {/* Main Area */}
            <div className="main-area">
                {/* Painel Esquerdo — Wizard */}
                <div className="panel-left">
                    <Step1Areas />
                    <Step2Environments />
                    <Step3Services />
                    <Step4Details />
                </div>

                {/* Painel Direito — Preview */}
                <div className="panel-right">
                    <InteractivePreview />
                </div>
            </div>

            {/* Footer */}
            <footer className="app-footer">
                <button
                    className="btn btn-success"
                    onClick={gerarEstruturaZip}
                >
                    📦 GERAR E BAIXAR ZIP
                </button>
                <button
                    className="btn btn-danger"
                    onClick={() => {
                        if (window.confirm('Tem certeza que deseja limpar toda a seleção?')) {
                            limparSelecao();
                        }
                    }}
                >
                    🧹 LIMPAR SELEÇÃO
                </button>
            </footer>
        </div>
    );
}
