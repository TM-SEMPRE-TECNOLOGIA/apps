'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    FileText,
    Upload,
    Users,
    Calendar,
    BarChart2,
    Settings
} from 'lucide-react';

const MENU_ITEMS = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Ordens de Serviço', icon: FileText, path: '/ordens' },
    { name: 'Importar OS', icon: Upload, path: '/importar' },
    { name: 'Equipe', icon: Users, path: '/equipe' },
    { name: 'Calendário', icon: Calendar, path: '/calendario' },
    { name: 'Relatórios', icon: BarChart2, path: '/relatorios' },
    { name: 'Configurações', icon: Settings, path: '/config' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-[#0d1117] border-r border-[#30363d] flex flex-col fixed left-0 top-0 z-40">
            <div className="h-16 flex items-center px-6 border-b border-[#30363d]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#7b2cbf] flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(0,212,255,0.4)]">
                        TM
                    </div>
                    <span className="font-bold text-lg text-white tracking-wide">
                        Ordens<span className="text-[#00d4ff]">.os</span>
                    </span>
                </div>
            </div>

            <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border border-[rgba(0,212,255,0.2)] shadow-[inset_4px_0_0_#00d4ff]'
                                    : 'text-[#888888] hover:bg-[rgba(255,255,255,0.03)] hover:text-white border border-transparent border-l-transparent hover:border-l-[#7b2cbf]'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#30363d]">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-9 h-9 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-xs font-bold text-[#00d4ff]">
                        TN
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">Thiago</span>
                        <span className="text-xs text-[#888888]">Administrador</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
