import './Header.css';

export default function Header({ onNav, currentPage }) {
    return (
        <header className="app-header">
            <div className="header-left">
                <h1 className="header-title" onClick={() => onNav('home')} style={{ cursor: 'pointer' }}>
                    📸 Gerador de Relatório Fotográfico
                </h1>
            </div>
            <div className="header-right">
                <button
                    className={`nav-btn ${currentPage === 'changelog' ? 'active' : ''}`}
                    onClick={() => onNav('changelog')}
                >
                    📝 Changelog
                </button>
                <div className="tm-signature">
                    <span>TM - Sempre Tecnologia</span>
                </div>
            </div>
        </header>
    );
}
