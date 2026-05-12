'use client';

import { Settings, User, Bell, Shield, Database } from 'lucide-react';

export default function ConfigPage() {
    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Configurações de Sistema</h2>
                    <p className="text-[#888888] mt-1">Ajuste preferências de interface, notificações e integrações.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Menu Lateral de Configurações */}
                <div className="md:col-span-1 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border border-[rgba(0,212,255,0.2)] font-medium text-sm transition-colors text-left">
                        <User className="w-4 h-4" /> Perfil e Conta
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#888888] hover:bg-[rgba(255,255,255,0.03)] hover:text-white font-medium text-sm transition-colors text-left">
                        <Settings className="w-4 h-4" /> Geral
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#888888] hover:bg-[rgba(255,255,255,0.03)] hover:text-white font-medium text-sm transition-colors text-left">
                        <Bell className="w-4 h-4" /> Notificações
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#888888] hover:bg-[rgba(255,255,255,0.03)] hover:text-white font-medium text-sm transition-colors text-left">
                        <Shield className="w-4 h-4" /> Segurança
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#888888] hover:bg-[rgba(255,255,255,0.03)] hover:text-white font-medium text-sm transition-colors text-left">
                        <Database className="w-4 h-4" /> Banco de Dados
                    </button>
                </div>

                {/* Área de Conteúdo */}
                <div className="md:col-span-3 glass-panel p-8">
                    <h3 className="text-lg font-semibold text-white mb-6 border-b border-[#30363d] pb-4">
                        Opções de Perfil
                    </h3>

                    <div className="space-y-6 max-w-lg">
                        <div>
                            <label className="text-sm font-medium text-[#888888] block mb-2">Nome de Exibição</label>
                            <input type="text" className="w-full" defaultValue="Thiago Nascimento" />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-[#888888] block mb-2">E-mail Corporativo</label>
                            <input type="email" className="w-full opacity-50 cursor-not-allowed" disabled defaultValue="thiago@tmtecnologia.com.br" />
                            <p className="text-xs text-[#888888] mt-2">O e-mail só pode ser alterado pelo Administrador da rede.</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-[#888888] block mb-2">Tema Visual</label>
                            <select className="w-full" disabled>
                                <option>Cyber-Dark (Padrão)</option>
                                <option>Light Mode</option>
                            </select>
                        </div>

                        <div className="pt-4 mt-6 border-t border-[#30363d]">
                            <button className="btn-primary" onClick={() => alert("As preferências foram salvas localmente.")}>
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
