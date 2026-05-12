'use client';

import { useState } from 'react';
import Link from 'next/link';
import './ChangelogPage.css';

const releases = [
    {
        version: '3.0',
        date: 'Março 2026',
        title: 'Migração para Next.js 16.1.6',
        isLatest: true,
        highlights: [
            { icon: '🚀', text: 'Migração completa do frontend de Vite para Next.js 16 (App Router)' },
            { icon: '⚡', text: 'Performance otimizada com Turbopack e React 19' },
            { icon: '🎨', text: 'Sistema de Design TM totalmente integrado e modularizado' },
            { icon: '📁', text: 'Estrutura de pastas do repositório organizada e limpa' },
        ]
    },
    {
        version: '2.1',
        date: 'Fevereiro 2026',
        title: 'Reordenação Inteligente & Backend Moderno',
        highlights: [
            { icon: '🆕', text: 'Nova ferramenta para reordenar pastas já criadas no Windows' },
            { icon: '✨', text: 'Feedback Imediato: Numerações se adaptam visualmente em tempo real' },
            { icon: '🆕', text: 'Seleção de pasta via botão nativo do sistema' },
            { icon: '⚡', text: 'Backend migrado para FastAPI' },
        ]
    },
    {
        version: '2.0',
        date: 'Fevereiro 2026',
        title: 'Nova Interface Web — App React',
        highlights: [
            { icon: '🆕', text: 'Aplicação totalmente remodelada para o navegador' },
            { icon: '✨', text: 'Wizard guiado em 4 etapas e Preview interativo' },
            { icon: '🆕', text: 'Download da estrutura como arquivo ZIP' },
        ]
    }
];

export default function ChangelogPage() {
    const [expandedIdx, setExpandedIdx] = useState(0);

    const toggle = (idx: number) => {
        setExpandedIdx(expandedIdx === idx ? -1 : idx);
    };

    return (
        <div className="novidades">
            <div className="novidades__container">
                <div className="novidades__header">
                    <div>
                        <h1 className="text-gradient">🚀 Novidades</h1>
                        <p className="novidades__subtitle">
                            Veja o que há de novo no <span className="text-accent">TM Pastas</span>
                        </p>
                    </div>
                    <Link href="/" className="btn btn-ghost novidades__back">← Voltar</Link>
                </div>

                <div className="novidades__timeline">
                    {releases.map((release, idx) => {
                        const isOpen = expandedIdx === idx;
                        return (
                            <div
                                key={release.version}
                                className={`novidades__release ${isOpen ? 'novidades__release--open' : ''}`}
                            >
                                <div className="novidades__dot-wrapper">
                                    <div className={`novidades__dot ${release.isLatest ? 'novidades__dot--latest' : ''}`} />
                                    {idx < releases.length - 1 && <div className="novidades__line" />}
                                </div>

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

                <div className="novidades__footer">
                    <span className="text-accent" style={{ fontWeight: 600 }}>TM — Sempre Tecnologia</span>
                    <span style={{ color: 'var(--text-muted)' }}> · Thiago Nascimento Barbosa</span>
                </div>
            </div>
        </div>
    );
}
