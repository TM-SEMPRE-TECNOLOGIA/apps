'use client';

import { useState } from 'react';
import { useOSStore } from '../../stores/useOSStore';
import { STATUS_COLORS, STATUS_LIST, CONTRATOS } from '../../lib/constants';
import { Search, Filter, MoreVertical, Plus, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrdensList() {
    const router = useRouter();
    const { ordens, deleteOrdem } = useOSStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [contratoFilter, setContratoFilter] = useState('');

    const filteredOrdens = ordens.filter(os => {
        const matchesSearch =
            os.os.toLowerCase().includes(searchTerm.toLowerCase()) ||
            os.agencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
            os.prefixo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter ? os.situacao === statusFilter : true;
        const matchesContrato = contratoFilter ? os.contrato === contratoFilter : true;

        return matchesSearch && matchesStatus && matchesContrato;
    });

    return (
        <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Ordens de Serviço</h2>
                    <p className="text-[#888888] mt-1">Gerencie, filtre e acompanhe o andamento das suas OS.</p>
                </div>
                <button
                    onClick={() => alert("Criar OS avulsa em breve. Importe planilhas no Assistente!")}
                    className="btn-primary"
                >
                    <Plus className="w-5 h-5" /> Nova OS
                </button>
            </div>

            <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
                    <input
                        type="text"
                        placeholder="Buscar por OS, Agência ou Prefixo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 text-sm"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-48">
                        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
                        <select
                            className="w-full pl-9 pr-4 text-sm appearance-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Todos os Status</option>
                            {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="relative w-full md:w-48">
                        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
                        <select
                            className="w-full pl-9 pr-4 text-sm appearance-none cursor-pointer"
                            value={contratoFilter}
                            onChange={(e) => setContratoFilter(e.target.value)}
                        >
                            <option value="">Todos os Contratos</option>
                            {CONTRATOS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabela de Resultados */}
            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[#888888] uppercase bg-[rgba(22,27,34,0.5)] border-b border-[#30363d]">
                            <tr>
                                <th className="px-6 py-4 font-medium">Chamado / OS</th>
                                <th className="px-6 py-4 font-medium">Unidade</th>
                                <th className="px-6 py-4 font-medium">Contrato / UF</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Vencimento</th>
                                <th className="px-6 py-4 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                            {filteredOrdens.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[#888888]">
                                        Nenhuma Ordem de Serviço encontrada.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrdens.map(os => (
                                    <tr key={os.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">{os.os}</div>
                                            <div className="text-xs text-[#888888]">Criado em {new Date(os.criadoEm).toLocaleDateString('pt-BR')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white">{os.agencia}</div>
                                            <div className="text-xs text-[#888888]">Prefixo: {os.prefixo}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white">{os.contrato}</div>
                                            <div className="text-xs text-[#888888]">{os.estado}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="badge" style={{
                                                color: STATUS_COLORS[os.situacao as keyof typeof STATUS_COLORS] || '#fff',
                                                borderColor: `rgba(${(STATUS_COLORS[os.situacao as keyof typeof STATUS_COLORS] || '#ffffff').replace('#', '')}40)`
                                            }}>
                                                {os.situacao}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[#e0e0e0]">
                                            {os.vencimento ? (isNaN(new Date(os.vencimento).getTime()) ? os.vencimento : new Date(os.vencimento).toLocaleDateString('pt-BR')) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => router.push(`/ordens/${os.id}`)}
                                                    className="p-1.5 text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)] rounded-md transition-colors"
                                                    title="Detalhes"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Tem certeza que deseja remover a OS ${os.os}?`)) deleteOrdem(os.id);
                                                    }}
                                                    className="p-1.5 text-[#f85149] hover:bg-[rgba(248,81,73,0.1)] rounded-md transition-colors"
                                                    title="Remover"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/ordens/${os.id}`)}
                                                    className="p-1.5 text-[#888888] hover:text-white transition-colors"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination summary */}
                <div className="p-4 border-t border-[#30363d] flex items-center justify-between text-[#888888] text-sm">
                    <span>Mostrando <strong className="text-white">{filteredOrdens.length}</strong> de <strong className="text-white">{ordens.length}</strong> ordens de serviço.</span>
                </div>
            </div>
        </div>
    );
}
