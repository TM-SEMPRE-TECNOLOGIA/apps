"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquarePlus, History, UsersRound, Database, Settings, Menu, X, Bot } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: "/", label: "Nova Conversa", icon: MessageSquarePlus },
        { href: "/history", label: "Histórico", icon: History },
        { href: "/personas", label: "Personas", icon: UsersRound },
        { href: "/knowledge", label: "Base de Conhecimento", icon: Database },
        { href: "/settings", label: "Configurações", icon: Settings },
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-3 left-4 z-50 p-2 bg-[#2B2B2B] text-slate-300 rounded-lg border border-[#3A3A3A] shadow-md"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-4 flex items-center justify-between border-b border-[#2A2A2A]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
                            <Bot className="text-white w-4 h-4" />
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold text-slate-200 leading-tight">TM Chat</h1>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#2A2A2A]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-[#2B2B2B] text-white"
                                        : "text-slate-400 hover:bg-[#222222] hover:text-slate-200"
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : ""}`} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#2A2A2A]">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#222222] border border-[#2A2A2A]">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-400 text-xs font-bold">TM</span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-medium text-slate-200 truncate">Thiago</span>
                            <span className="text-[10px] text-slate-500 truncate">Plano Pro</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
