'use client';

import { Users, Mail, Phone, MapPin } from 'lucide-react';

const MOCK_TEAM = [
    { id: 1, nome: 'Thiago Nascimento', cargo: 'Administrador / Gestor', estado: 'SP', email: 'thiago@tmtecnologia.com.br', fones: '(11) 99999-9999', avatar: 'TN' },
    { id: 2, nome: 'João Técnico', cargo: 'Técnico Visitante - Vistorias', estado: 'RJ', email: 'joao@tech.com', fones: '(21) 98888-8888', avatar: 'JT' },
    { id: 3, nome: 'Maria Silva', cargo: 'Arquiteta / Elaboradora', estado: 'MG', email: 'maria@arq.com', fones: '(31) 97777-7777', avatar: 'MS' },
    { id: 4, nome: 'Carlos Souza', cargo: 'Orçamentista', estado: 'PR', email: 'carlos@calc.com', fones: '(41) 96666-6666', avatar: 'CS' },
];

export default function EquipePage() {
    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Gestão de Equipe</h2>
                    <p className="text-[#888888] mt-1">Controle de acessos, técnicos e elaboradores do sistema.</p>
                </div>
                <button className="btn-primary" onClick={() => alert("Módulo em desenvolvimento.")}>
                    <Users className="w-5 h-5" /> Convidar Membro
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MOCK_TEAM.map(member => (
                    <div key={member.id} className="glass-panel p-6 flex flex-col items-center text-center hover:bg-[rgba(255,255,255,0.02)] transition-colors border-t-2 border-t-transparent hover:border-t-[#00d4ff]">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#7b2cbf] flex items-center justify-center text-xl font-bold text-white shadow-[0_0_15px_rgba(0,212,255,0.3)] mb-4">
                            {member.avatar}
                        </div>

                        <h3 className="text-lg font-semibold text-white">{member.nome}</h3>
                        <p className="text-sm font-medium text-[#00d4ff] mb-4">{member.cargo}</p>

                        <div className="w-full space-y-2 text-left pt-4 border-t border-[#30363d]">
                            <p className="text-xs text-[#888888] flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Atuação: <span className="text-white">{member.estado}</span>
                            </p>
                            <p className="text-xs text-[#888888] flex items-center gap-2">
                                <Mail className="w-4 h-4" /> <span className="text-white truncate" title={member.email}>{member.email}</span>
                            </p>
                            <p className="text-xs text-[#888888] flex items-center gap-2">
                                <Phone className="w-4 h-4" /> <span className="text-white">{member.fones}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
