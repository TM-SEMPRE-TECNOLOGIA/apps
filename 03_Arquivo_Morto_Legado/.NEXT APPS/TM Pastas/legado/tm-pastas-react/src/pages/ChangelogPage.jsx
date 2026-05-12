import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ChangelogPage.css';

const releases = [
    {
        version: '2.1',
        date: 'Fevereiro 2026',
        title: 'Reordenação Inteligente & Backend Moderno',
        isLatest: true,
        highlights: [
            { icon: '🆕', text: 'Nova ferramenta para reordenar pastas já criadas no Windows — use setas ↑↓ ou arraste as pastas para reorganizar' },
            { icon: '✨', text: 'Feedback Imediato: As numerações das pastas e subpastas acompanham e se readaptam visualmente em tempo real durante a reordenação' },
            { icon: '🆕', text: 'Seleção de pasta via botão nativo do sistema — sem precisar digitar caminhos' },
            { icon: '⚡', text: 'Backend migrado para FastAPI — inicialização mais rápida e mais estável' },
            { icon: '🆕', text: 'Documentação da API disponível automaticamente em /docs (Swagger)' },
            { icon: '✨', text: 'Script de execução atualizado — tudo inicia com um único duplo-clique no executar_app.bat' },
        ]
    },
    {
        version: '2.0',
        date: 'Fevereiro 2026',
        title: 'Nova Interface Web — App React',
        highlights: [
            { icon: '🆕', text: 'Aplicação totalmente remodelada para rodar no navegador com visual moderno' },
            { icon: '✨', text: 'Wizard guiado em 4 etapas: Área → Ambientes → Serviços → Detalhes' },
            { icon: '✨', text: 'Preview interativo — clique em qualquer item para selecioná-lo e editar diretamente' },
            { icon: '🆕', text: 'Download da estrutura como arquivo ZIP, sem necessidade de permissões especiais' },
            { icon: '✨', text: 'Menu lateral com acordeão inteligente — só mostra a etapa atual, reduzindo a complexidade' },
            { icon: '✨', text: 'Duplo clique no preview abre modal de edição rápida para renomear e reordenar' },
        ]
    },
    {
        version: '1.1',
        date: 'Fevereiro 2026',
        title: 'Melhorias de Usabilidade e Performance',
        highlights: [
            { icon: '⚡', text: 'Navegação entre ambientes agora é instantânea, sem travamentos ou saltos na tela' },
            { icon: '🔧', text: 'Correção da numeração: "Vista ampla" não afeta mais a sequência dos serviços' },
            { icon: '✨', text: 'Hierarquia de 3 níveis: Área → Ambiente → Serviço com numeração automática' },
            { icon: '✨', text: 'Listas de sugestões baseadas no histórico real de levantamentos anteriores' },
            { icon: '🆕', text: 'Versão do app e assinatura TM exibidas na interface' },
        ]
    },
    {
        version: '1.0',
        date: 'Fevereiro 2026',
        title: 'Lançamento — Gerador de Pastas',
        highlights: [
            { icon: '🆕', text: 'Geração automática de estrutura de pastas para levantamentos fotográficos' },
            { icon: '🆕', text: 'Seletor de ambientes com checkboxes + campo customizado' },
            { icon: '🆕', text: 'Numeração automática de serviços (1.1, 1.2, 2.1...)' },
            { icon: '🆕', text: 'Opção "Vista ampla" para adicionar pasta panorâmica em cada ambiente' },
            { icon: '🆕', text: 'Preview em tempo real da estrutura antes de gerar' },
            { icon: '🆕', text: 'Subpastas opcionais (Detalhes, Danos, etc.) dentro dos serviços' },
        ]
    },
];

export default function ChangelogPage() {
    const [expandedIdx, setExpandedIdx] = useState(0);

    const toggle = (idx) => {
        setExpandedIdx(expandedIdx === idx ? -1 : idx);
    };

    return (
        <div className="novidades">
            <div className="novidades__container">
                {/* Header */}
                <div className="novidades__header">
                    <div>
                        <h1 className="text-gradient">🚀 Novidades</h1>
                        <p className="novidades__subtitle">
                            Veja o que há de novo no <span className="text-accent">TM Pastas</span>
                        </p>
                    </div>
                    <Link to="/" className="btn btn-ghost novidades__back">← Voltar</Link>
                </div>

                {/* Timeline */}
                <div className="novidades__timeline">
                    {releases.map((release, idx) => {
                        const isOpen = expandedIdx === idx;
                        return (
                            <div
                                key={release.version}
                                className={`novidades__release ${isOpen ? 'novidades__release--open' : ''}`}
                            >
                                {/* Timeline dot */}
                                <div className="novidades__dot-wrapper">
                                    <div className={`novidades__dot ${release.isLatest ? 'novidades__dot--latest' : ''}`} />
                                    {idx < releases.length - 1 && <div className="novidades__line" />}
                                </div>

                                {/* Card */}
                                <div className="novidades__card" onClick={() => toggle(idx)}>
                                    <div className="novidades__card-header">
                                        <div className="novidades__card-meta">
                                            <span className="novidades__version">v{release.version}</span>
                                            {release.isLatest && <span className="novidades__badge-novo">NOVO</span>}
                                            <span className="novidades__date">{release.date}</span>
                                        </div>
                                        <span className={`novidades__chevron ${isOpen ? 'novidades__chevron--open' : ''}`}>
                                            ▾
                                        </span>
                                    </div>
                                    <h2 className="novidades__card-title">{release.title}</h2>

                                    <div className={`novidades__card-body ${isOpen ? 'novidades__card-body--open' : ''}`}>
                                        <ul className="novidades__list">
                                            {release.highlights.map((h, i) => (
                                                <li key={i} className="novidades__item">
                                                    <span className="novidades__item-icon">{h.icon}</span>
                                                    <span>{h.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="novidades__footer">
                    <span className="text-accent" style={{ fontWeight: 600 }}>TM — Sempre Tecnologia</span>
                    <span style={{ color: 'var(--text-muted)' }}> · Thiago Nascimento Barbosa</span>
                </div>
            </div>
        </div>
    );
}
