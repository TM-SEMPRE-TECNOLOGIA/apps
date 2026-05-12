'use client';

import './memoria.css';

import { useState, useEffect, useCallback } from 'react';
import {
    AREAS_SUGERIDAS,
    AMBIENTES_SUGERIDOS,
    SERVICOS_SUGERIDOS,
    SUBPASTAS_SUGERIDAS,
    DETALHES_SUGERIDOS,
} from '../../data/constants';

/* ─── Tipos ──────────────────────────────────────────────────────────── */
interface CustomItems {
    customAmbientes: string[];
    customServicos: string[];
    customSubpastas: string[];
    customDetalhes: string[];
}

interface Categoria {
    key: string;
    label: string;
    emoji: string;
    cor: string;
    staticItems: string[];
    customKey: keyof CustomItems;
    prefixo?: string;
}

const CATEGORIAS: Categoria[] = [
    {
        key: 'areas',
        label: 'Áreas',
        emoji: '🌎',
        cor: 'var(--nivel-1)',
        staticItems: AREAS_SUGERIDAS,
        customKey: 'customAmbientes',
        prefixo: '- ',
    },
    {
        key: 'ambientes',
        label: 'Ambientes',
        emoji: '📍',
        cor: 'var(--nivel-2)',
        staticItems: AMBIENTES_SUGERIDOS,
        customKey: 'customAmbientes',
        prefixo: '- ',
    },
    {
        key: 'servicos',
        label: 'Serviços',
        emoji: '🔧',
        cor: 'var(--nivel-3)',
        staticItems: SERVICOS_SUGERIDOS,
        customKey: 'customServicos',
        prefixo: '- ',
    },
    {
        key: 'subpastas',
        label: 'Subpastas',
        emoji: '📂',
        cor: 'var(--nivel-4)',
        staticItems: SUBPASTAS_SUGERIDAS,
        customKey: 'customSubpastas',
        prefixo: '- ',
    },
    {
        key: 'detalhes',
        label: 'Detalhes',
        emoji: '🔍',
        cor: 'var(--nivel-va)',
        staticItems: DETALHES_SUGERIDOS,
        customKey: 'customDetalhes',
        prefixo: '- ',
    },
];

/* ─── Componente da Página ───────────────────────────────────────────── */
export default function MemoriaPage() {
    const [customItems, setCustomItems] = useState<CustomItems>({
        customAmbientes: [],
        customServicos: [],
        customSubpastas: [],
        customDetalhes: [],
    });
    const [busca, setBusca] = useState('');
    const [copiadoId, setCopiadoId] = useState<string | null>(null);
    const [novoItem, setNovoItem] = useState<Record<string, string>>({});
    const [categoriaAberta, setCategoriaAberta] = useState<string | null>('ambientes');

    /* Carregar itens customizados */
    const carregarCustom = useCallback(async () => {
        try {
            const res = await fetch('/api/custom-items');
            if (res.ok) {
                const data = await res.json();
                setCustomItems(data);
            }
        } catch (err) {
            console.error('Erro ao carregar itens customizados', err);
        }
    }, []);

    useEffect(() => {
        carregarCustom();
    }, [carregarCustom]);

    /* Copiar para clipboard */
    const copiar = async (texto: string, id: string) => {
        try {
            await navigator.clipboard.writeText(texto);
            setCopiadoId(id);
            setTimeout(() => setCopiadoId(null), 1500);
        } catch {
            console.error('Falha ao copiar');
        }
    };

    /* Adicionar item customizado */
    const adicionarItem = async (cat: Categoria) => {
        const nome = (novoItem[cat.key] || '').trim();
        if (!nome) return;

        // Verificar duplicata
        const allItems = [...cat.staticItems, ...(customItems[cat.customKey] || [])];
        if (allItems.some((i) => i.toLowerCase() === nome.toLowerCase())) return;

        try {
            await fetch('/api/custom-items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'add', key: cat.customKey, item: nome }),
            });
            setNovoItem((prev) => ({ ...prev, [cat.key]: '' }));
            await carregarCustom();
        } catch (err) {
            console.error('Erro ao adicionar item', err);
        }
    };

    /* Remover item customizado */
    const removerItem = async (cat: Categoria, item: string) => {
        try {
            await fetch('/api/custom-items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', key: cat.customKey, item }),
            });
            await carregarCustom();
        } catch (err) {
            console.error('Erro ao remover item', err);
        }
    };

    /* Filtrar itens pela busca */
    const filtrar = (items: string[]) => {
        if (!busca.trim()) return items;
        const termo = busca.toLowerCase();
        return items.filter((i) => i.toLowerCase().includes(termo));
    };

    /* Contar totais */
    const totalItens = CATEGORIAS.reduce((acc, cat) => {
        return acc + cat.staticItems.length + (customItems[cat.customKey] || []).length;
    }, 0);

    return (
        <div className="memoria-page">
            {/* Header da Página */}
            <header className="memoria-header">
                <div className="memoria-header__top">
                    <h1 className="memoria-header__title">
                        🧠 <span className="text-gradient">Memória e Itens</span>
                    </h1>
                    <span className="memoria-header__badge">{totalItens} itens</span>
                </div>
                <p className="memoria-header__subtitle">
                    Busque, copie e gerencie todos os nomes disponíveis para suas pastas.
                </p>

                {/* Barra de Busca */}
                <div className="memoria-search">
                    <span className="memoria-search__icon">🔍</span>
                    <input
                        className="input memoria-search__input"
                        type="text"
                        placeholder="Buscar item pelo nome..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        autoFocus
                    />
                    {busca && (
                        <button
                            className="btn-icon memoria-search__clear"
                            onClick={() => setBusca('')}
                            title="Limpar busca"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </header>

            {/* Lista de Categorias */}
            <main className="memoria-content">
                {CATEGORIAS.map((cat) => {
                    const staticFiltrados = filtrar(cat.staticItems);
                    const customFiltrados = filtrar(customItems[cat.customKey] || []);
                    const totalCat = staticFiltrados.length + customFiltrados.length;
                    const isAberta = categoriaAberta === cat.key;

                    // Se busca ativa e nenhum resultado, pular
                    if (busca && totalCat === 0) return null;

                    return (
                        <section key={cat.key} className="memoria-categoria">
                            <button
                                className={`memoria-categoria__header ${isAberta ? 'memoria-categoria__header--aberta' : ''}`}
                                onClick={() => setCategoriaAberta(isAberta ? null : cat.key)}
                                style={{ '--cat-cor': cat.cor } as React.CSSProperties}
                            >
                                <div className="memoria-categoria__header-left">
                                    <span className="memoria-categoria__emoji">{cat.emoji}</span>
                                    <h2 className="memoria-categoria__titulo">{cat.label}</h2>
                                    <span className="memoria-categoria__count">{totalCat}</span>
                                </div>
                                <span className={`memoria-categoria__arrow ${isAberta ? 'memoria-categoria__arrow--aberta' : ''}`}>
                                    ▾
                                </span>
                            </button>

                            {isAberta && (
                                <div className="memoria-categoria__body">
                                    {/* Itens Estáticos (do sistema) */}
                                    {staticFiltrados.length > 0 && (
                                        <div className="memoria-grupo">
                                            <span className="memoria-grupo__label">📌 Do sistema</span>
                                            <div className="memoria-itens">
                                                {staticFiltrados.map((item) => {
                                                    const itemId = `${cat.key}-static-${item}`;
                                                    const nomeExibido = cat.prefixo ? `${cat.prefixo}${item}` : item;
                                                    return (
                                                        <div key={itemId} className="memoria-item">
                                                            <span className="memoria-item__nome">{nomeExibido}</span>
                                                            <button
                                                                className={`memoria-item__copiar-btn ${copiadoId === itemId ? 'memoria-item__copiar-btn--ok' : ''}`}
                                                                onClick={() => copiar(nomeExibido, itemId)}
                                                            >
                                                                {copiadoId === itemId ? '✓ Copiado!' : 'Copiar'}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Itens Customizados (do usuário) */}
                                    {customFiltrados.length > 0 && (
                                        <div className="memoria-grupo">
                                            <span className="memoria-grupo__label">✨ Customizados</span>
                                            <div className="memoria-itens">
                                                {customFiltrados.map((item) => {
                                                    const itemId = `${cat.key}-custom-${item}`;
                                                    const nomeExibido = cat.prefixo ? `${cat.prefixo}${item}` : item;
                                                    return (
                                                        <div key={itemId} className="memoria-item memoria-item--custom">
                                                            <span className="memoria-item__nome">{nomeExibido}</span>
                                                            <div className="memoria-item__actions">
                                                                <button
                                                                    className={`memoria-item__copiar-btn ${copiadoId === itemId ? 'memoria-item__copiar-btn--ok' : ''}`}
                                                                    onClick={() => copiar(nomeExibido, itemId)}
                                                                >
                                                                    {copiadoId === itemId ? '✓ Copiado!' : 'Copiar'}
                                                                </button>
                                                                <button
                                                                    className="btn-icon memoria-item__remover"
                                                                    onClick={() => {
                                                                        if (window.confirm(`Remover "${item}" da lista?`)) {
                                                                            removerItem(cat, item);
                                                                        }
                                                                    }}
                                                                    title="Remover item"
                                                                >
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Formulário de adição */}
                                    <div className="memoria-add">
                                        <input
                                            className="input input-sm memoria-add__input"
                                            type="text"
                                            placeholder={`Adicionar novo(a) ${cat.label.toLowerCase()}...`}
                                            value={novoItem[cat.key] || ''}
                                            onChange={(e) =>
                                                setNovoItem((prev) => ({ ...prev, [cat.key]: e.target.value }))
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') adicionarItem(cat);
                                            }}
                                        />
                                        <button
                                            className="btn btn-sm btn-add-item"
                                            onClick={() => adicionarItem(cat)}
                                            disabled={!(novoItem[cat.key] || '').trim()}
                                        >
                                            + Adicionar
                                        </button>
                                    </div>

                                    {/* Estado vazio */}
                                    {totalCat === 0 && !busca && (
                                        <p className="memoria-empty">Nenhum item nesta categoria ainda.</p>
                                    )}
                                </div>
                            )}
                        </section>
                    );
                })}

                {/* Sem resultados na busca */}
                {busca &&
                    CATEGORIAS.every((cat) => {
                        const s = filtrar(cat.staticItems).length;
                        const c = filtrar(customItems[cat.customKey] || []).length;
                        return s + c === 0;
                    }) && (
                        <div className="memoria-no-results">
                            <span className="memoria-no-results__emoji">🔍</span>
                            <p>Nenhum item encontrado para &quot;{busca}&quot;</p>
                        </div>
                    )}
            </main>
        </div>
    );
}
