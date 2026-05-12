'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();

    // Simple title mapper
    const getPageTitle = () => {
        if (pathname === '/') return 'Dashboard';
        if (pathname?.startsWith('/ordens')) return 'Ordens de Serviço';
        if (pathname?.startsWith('/importar')) return 'Importação Inteligente';
        if (pathname?.startsWith('/equipe')) return 'Gestão de Equipe';
        if (pathname?.startsWith('/calendario')) return 'Calendário e Prazos';
        if (pathname?.startsWith('/relatorios')) return 'Relatórios e Exportação';
        if (pathname?.startsWith('/config')) return 'Configurações de Sistema';
        return 'TM Ordens';
    };

    return (
        <header className="h-16 bg-[rgba(13,17,23,0.85)] backdrop-blur-md border-b border-[#30363d] flex items-center justify-between px-6 sticky top-0 z-30 ml-64">
            <div className="flex items-center gap-4">
                {/* Mobile menu toggle (hidden on desktop) */}
                <button className="md:hidden text-[#888888] hover:text-white">
                    <Menu className="w-6 h-6" />
                </button>

                <h1 className="text-lg font-semibold text-white tracking-wide">
                    {getPageTitle()}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Global Search Bar */}
                <div className="relative group flex items-center">
                    <div className="absolute left-3 text-[#888888] group-focus-within:text-[#00d4ff] transition-colors">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar chamado..."
                        className="bg-[#161b22] border border-[#30363d] focus:border-[#00d4ff] text-sm text-white rounded-full py-1.5 pl-9 pr-4 w-64 transition-all focus:outline-none focus:shadow-[0_0_0_1px_rgba(0,212,255,0.3)] placeholder-[#484f58]"
                    />
                </div>

                {/* Notifications */}
                <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[rgba(255,255,255,0.05)] text-[#888888] hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f85149] rounded-full border border-[#0d1117]"></span>
                </button>
            </div>
        </header>
    );
}
