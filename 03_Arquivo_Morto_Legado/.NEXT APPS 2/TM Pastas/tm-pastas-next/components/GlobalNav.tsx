'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalNav() {
    const pathname = usePathname();

    const getBtnClass = (path: string) => {
        const isActive = pathname === path;
        return `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`;
    };

    return (
        <div className="global-nav">
            <span className="global-nav__brand">TM Pastas</span>
            <Link href="/" className={getBtnClass('/')}>🏗️ Criar Nova Estrutura</Link>
            <Link href="/reorder" className={getBtnClass('/reorder')}>✏️ Editar Existentes</Link>
            <Link href="/memoria" className={getBtnClass('/memoria')}>🧠 Memória e Itens</Link>
            <div style={{ flex: 1 }}></div>
            <Link href="/guia" className="btn btn-sm btn-ghost">📖 Guia</Link>
            <Link href="/changelog" className="btn btn-sm btn-ghost">🚀 Novidades</Link>
        </div>
    );
}
