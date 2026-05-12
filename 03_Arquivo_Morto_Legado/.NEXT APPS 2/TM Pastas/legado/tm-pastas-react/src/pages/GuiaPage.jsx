import { Link } from 'react-router-dom';
import './GuiaPage.css';

export default function GuiaPage() {
    return (
        <div className="guia">
            {/* Hero */}
            <section className="guia-hero">
                <div className="guia-hero__icon animate-float">🏗️</div>
                <h1 className="text-gradient">Gerador de Estrutura de Pastas</h1>
                <p className="guia-hero__subtitle">
                    Monte visualmente a estrutura de pastas para seus levantamentos fotográficos.
                    Simples, intuitivo e sem complicações.
                </p>
                <Link to="/" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '16px 40px', fontSize: 'var(--font-size-lg)' }}>
                    🚀 Começar Agora
                </Link>
                <div className="guia-scroll-indicator animate-bounce">
                    <span></span>
                </div>
            </section>

            {/* Funcionalidades */}
            <section className="guia-section">
                <div className="guia-section__header">
                    <h2>✨ Funcionalidades</h2>
                    <p>Tudo o que você precisa, nada que você não precise</p>
                </div>
                <div className="guia-features">
                    {[
                        { icon: '📍', title: 'Ambientes Personalizados', desc: 'Selecione entre ambientes sugeridos ou crie os seus próprios.' },
                        { icon: '🔢', title: 'Numeração Automática', desc: 'A numeração é aplicada automaticamente na ordem de criação.' },
                        { icon: '👁️', title: 'Preview em Tempo Real', desc: 'Visualize a estrutura antes de gerar. O que você vê é o que será criado.' },
                        { icon: '⚡', title: 'Geração Instantânea', desc: 'Com um clique, toda a estrutura é gerada e baixada como ZIP.' },
                        { icon: '🎯', title: 'Controle Total', desc: 'Nada é criado automaticamente. Você decide cada detalhe.' },
                        { icon: '🌙', title: 'Interface Moderna', desc: 'Design escuro elegante que não cansa a vista.' },
                    ].map((f) => (
                        <div key={f.title} className="guia-feature-card card">
                            <div className="guia-feature-card__icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Como Usar */}
            <section className="guia-section guia-section--alt" id="como-usar">
                <div className="guia-section__header">
                    <h2>📖 Como Usar</h2>
                    <p>Em 5 passos simples você terá sua estrutura pronta</p>
                </div>
                <div className="guia-steps">
                    {[
                        { num: 1, title: 'Defina o nome do levantamento', desc: 'Digite o nome no campo no topo da aplicação.', tip: 'Use um formato padrão, como "01 - Cidade - Status"' },
                        { num: 2, title: 'Selecione as áreas', desc: 'Marque as áreas na Etapa 1. Cada área recebe automaticamente um nível.', tip: 'Use o filtro para encontrar áreas rapidamente' },
                        { num: 3, title: 'Adicione ambientes e serviços', desc: 'Na Etapa 2, marque os ambientes e serviços para cada área.', tip: 'Os serviços são específicos para cada área selecionada' },
                        { num: 4, title: 'Adicione subpastas (opcional)', desc: 'Na Etapa 3, organize com subpastas como "Vista ampla", "Detalhes", etc.', tip: 'Subpastas são opcionais — use apenas se precisar' },
                        { num: 5, title: 'Gere o ZIP!', desc: 'Confira o preview, depois clique em "GERAR E BAIXAR ZIP" e pronto!', tip: 'O ZIP contém exatamente a estrutura mostrada no preview' },
                    ].map((s) => (
                        <div key={s.num} className="guia-step card-compact">
                            <div className="guia-step__number">{s.num}</div>
                            <div className="guia-step__content">
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                <div className="guia-step__tip">💡 Dica: {s.tip}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Requisitos */}
            <section className="guia-section">
                <div className="guia-section__header">
                    <h2>⚙️ Requisitos</h2>
                    <p>O que você precisa para usar</p>
                </div>
                <div className="guia-requirements">
                    {[
                        { icon: '🌐', title: 'Navegador Moderno', desc: 'Chrome, Firefox ou Edge' },
                        { icon: '📦', title: 'Node.js (dev)', desc: 'Apenas para desenvolvimento' },
                        { icon: '💻', title: 'Qualquer SO', desc: 'Windows, Mac ou Linux' },
                    ].map((r) => (
                        <div key={r.title} className="guia-requirement card-compact">
                            <span style={{ fontSize: '2rem' }}>{r.icon}</span>
                            <div>
                                <h4>{r.title}</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{r.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="guia-footer">
                <div style={{ fontSize: '2rem' }}>🏗️</div>
                <p>Gerador de Estrutura de Pastas para Levantamentos Fotográficos</p>
                <p className="text-accent" style={{ marginTop: 'var(--space-xl)' }}>
                    <strong>TM - Sempre Tecnologia</strong>
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                    Desenvolvido por Thiago Nascimento Barbosa
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-xs)' }}>
                    Fevereiro 2026
                </p>
            </footer>
        </div>
    );
}
