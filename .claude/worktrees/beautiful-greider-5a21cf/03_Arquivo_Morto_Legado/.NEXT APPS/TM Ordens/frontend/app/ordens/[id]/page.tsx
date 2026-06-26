'use client';

import { use, useState } from 'react';
import { useOSStore } from '../../../stores/useOSStore';
import { STATUS_COLORS, STATUS_LIST, DEFAULT_STAGES, OSStatus } from '../../../lib/constants';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Calendar, CheckSquare, Image as ImageIcon, MapPin, Building, FileText, AlertTriangle, AlertCircle } from 'lucide-react';

export default function OrdemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use for Next.js 15
    const unwrappedParams = use(params);

    const { ordens, updateOrdem, updateStage, addDificuldade, resolveDificuldade } = useOSStore();

    const ordem = ordens.find(os => os.id === unwrappedParams.id);

    const [dificuldadeDesc, setDificuldadeDesc] = useState('');
    const [showDificuldadeForm, setShowDificuldadeForm] = useState(false);

    if (!ordem) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <AlertCircle className="w-12 h-12 text-[#f85149] mb-4" />
                <h2 className="text-xl text-white">Ordem de Serviço não encontrada.</h2>
                <button onClick={() => router.push('/ordens')} className="mt-4 text-[#00d4ff] hover:underline">
                    Voltar para lista
                </button>
            </div>
        );
    }

    const handleStatusChange = (newStatus: OSStatus) => {
        updateOrdem(ordem.id, { situacao: newStatus });
    };

    const handleAddDificuldade = () => {
        if (!dificuldadeDesc.trim()) return;
        addDificuldade(ordem.id, dificuldadeDesc);
        setDificuldadeDesc('');
        setShowDificuldadeForm(false);
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* HEADER BREADCRUMB */}
            <div className="flex items-center gap-4 text-[#888888] text-sm mb-2">
                <button onClick={() => router.push('/ordens')} className="hover:text-white flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                <span>/</span>
                <span>Ordens de Serviço</span>
                <span>/</span>
                <span className="text-white font-medium">{ordem.os}</span>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">

                {/* COLUNA ESQUERDA - DADOS DA OS */}
                <div className="flex-1 space-y-6">
                    <div className="glass-panel p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-wide">{ordem.os}</h1>
                                <p className="text-[#00d4ff] font-medium mt-1">{ordem.agencia}</p>
                            </div>

                            <div className="relative">
                                <select
                                    className="bg-[#161b22] border text-sm font-semibold rounded-full px-4 py-2 appearance-none cursor-pointer pr-8"
                                    style={{
                                        color: STATUS_COLORS[ordem.situacao as keyof typeof STATUS_COLORS] || '#fff',
                                        borderColor: STATUS_COLORS[ordem.situacao as keyof typeof STATUS_COLORS] || '#30363d'
                                    }}
                                    value={ordem.situacao}
                                    onChange={(e) => handleStatusChange(e.target.value as OSStatus)}
                                >
                                    {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: STATUS_COLORS[ordem.situacao as keyof typeof STATUS_COLORS] || '#fff' }}>▼</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#30363d]">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Building className="w-5 h-5 text-[#888888] mt-0.5" />
                                    <div>
                                        <label className="text-xs text-[#888888] uppercase font-semibold">Prefixo / Agência</label>
                                        <p className="text-white text-sm">{ordem.prefixo} - {ordem.agencia}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-[#888888] mt-0.5" />
                                    <div>
                                        <label className="text-xs text-[#888888] uppercase font-semibold">Contrato</label>
                                        <p className="text-white text-sm">{ordem.contrato}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-[#888888] mt-0.5" />
                                    <div>
                                        <label className="text-xs text-[#888888] uppercase font-semibold">Estado (UF)</label>
                                        <p className="text-white text-sm">{ordem.estado}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-[#888888] mt-0.5" />
                                    <div>
                                        <label className="text-xs text-[#888888] uppercase font-semibold">Vencimento</label>
                                        <p className="text-white text-sm">
                                            {ordem.vencimento ? (isNaN(new Date(ordem.vencimento).getTime()) ? ordem.vencimento : new Date(ordem.vencimento).toLocaleDateString('pt-BR')) : 'Não definido'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ImageIcon className="w-5 h-5 text-[#888888] mt-0.5" />
                                    <div>
                                        <label className="text-xs text-[#888888] uppercase font-semibold">Qtd Fotos</label>
                                        <input
                                            type="number"
                                            className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-20 text-sm mt-1"
                                            value={ordem.fotos || ''}
                                            onChange={(e) => updateOrdem(ordem.id, { fotos: parseInt(e.target.value) || 0 })}
                                            placeholder="Ex: 50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-[#30363d]">
                            <label className="text-xs text-[#888888] uppercase font-semibold mb-2 block">Observações do Relatório</label>
                            <textarea
                                className="w-full bg-[#0d1117] border border-[#30363d] text-white text-sm rounded p-3 min-h-[100px]"
                                value={ordem.observacoes || ''}
                                onChange={(e) => updateOrdem(ordem.id, { observacoes: e.target.value })}
                                placeholder="Detalhes ou anotações específicas do levantamento..."
                            />
                        </div>
                    </div>

                    {/* SESSÃO DE DIFICULDADES (MAFFENG STYLE) */}
                    <div className="glass-panel p-6 border border-[#30363d] border-l-4 border-l-[#f85149]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-[#f85149]" /> Registros de Dificuldade
                            </h3>
                            <button
                                onClick={() => setShowDificuldadeForm(!showDificuldadeForm)}
                                className="text-xs btn-secondary border-[#f85149] text-[#f85149] hover:bg-[rgba(248,81,73,0.1)]"
                            >
                                + Informar Dificuldade
                            </button>
                        </div>

                        {showDificuldadeForm && (
                            <div className="mb-4 bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
                                <textarea
                                    className="w-full bg-[#161b22] border border-[#30363d] text-white text-sm rounded p-2 min-h-[60px] mb-2"
                                    value={dificuldadeDesc}
                                    onChange={(e) => setDificuldadeDesc(e.target.value)}
                                    placeholder="Descreva o problema ou dificuldade técnica..."
                                />
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setShowDificuldadeForm(false)} className="px-3 py-1 text-xs text-[#888888] hover:text-white">Cancelar</button>
                                    <button onClick={handleAddDificuldade} className="px-3 py-1 text-xs bg-[#f85149] text-white font-medium rounded hover:bg-[#d73a49]">Salvar Dificuldade</button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {ordem.dificuldades?.length === 0 ? (
                                <p className="text-sm text-[#888888] italic">Nenhuma dificuldade registrada.</p>
                            ) : (
                                ordem.dificuldades?.map(dif => (
                                    <div key={dif.id} className={`p-3 rounded-lg border ${dif.resolvida ? 'bg-[#161b22] border-[#30363d]' : 'bg-[rgba(248,81,73,0.05)] border-[rgba(248,81,73,0.2)]'}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs text-[#888888]">{new Date(dif.data).toLocaleString('pt-BR')}</span>
                                            {!dif.resolvida && (
                                                <button
                                                    onClick={() => resolveDificuldade(ordem.id, dif.id)}
                                                    className="text-xs text-[#3fb950] font-medium hover:underline bg-[rgba(63,185,80,0.1)] px-2 py-0.5 rounded"
                                                >
                                                    Marcar Resolvido
                                                </button>
                                            )}
                                            {dif.resolvida && <span className="text-xs text-[#3fb950] font-medium">Resolvido</span>}
                                        </div>
                                        <p className={`text-sm ${dif.resolvida ? 'text-[#888888] line-through' : 'text-white'}`}>{dif.descricao}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* COLUNA DIREITA - STAGES E HISTORY */}
                <div className="w-full xl:w-96 flex flex-col gap-6">

                    {/* STAGES (TM DEMANDAS STYLE) */}
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-[#00d4ff]" /> Etapas / Checklist
                        </h3>

                        <div className="space-y-3">
                            {DEFAULT_STAGES.map(stage => {
                                const isChecked = ordem.stages?.[stage.id] || false;
                                return (
                                    <label key={stage.id} className="flex items-center gap-3 p-2 rounded hover:bg-[rgba(255,255,255,0.03)] cursor-pointer transition-colors group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={isChecked}
                                                onChange={(e) => updateStage(ordem.id, stage.id, e.target.checked)}
                                            />
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isChecked
                                                    ? 'bg-[#00d4ff] border-[#00d4ff]'
                                                    : 'bg-[#161b22] border-[#30363d] peer-focus:border-[#00d4ff] group-hover:border-[#7b2cbf]'
                                                }`}>
                                                {isChecked && (
                                                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${isChecked ? 'text-white' : 'text-[#888888]'}`}>
                                            {stage.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-[#888888]">Progresso</span>
                                <span className="text-[#00d4ff] font-bold">
                                    {Math.round((Object.values(ordem.stages || {}).filter(Boolean).length / DEFAULT_STAGES.length) * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-[#161b22] h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-[#00d4ff] to-[#7b2cbf] h-full transition-all duration-500 ease-out"
                                    style={{ width: `${(Object.values(ordem.stages || {}).filter(Boolean).length / DEFAULT_STAGES.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* HISTÓRICO */}
                    <div className="glass-panel p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-4">Histórico / Timeline</h3>

                        <div className="relative pl-3 space-y-4 before:absolute before:inset-y-0 before:left-[15px] before:w-px before:bg-[#30363d] flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                            {ordem.history?.length > 0 ? (
                                ordem.history.map(entry => (
                                    <div key={entry.id} className="relative">
                                        <div className="absolute left-[-15px] top-1 w-2.5 h-2.5 rounded-full bg-[#00d4ff] border-[2px] border-[#0d1117] transform -translate-x-1/2" />
                                        <div className="pl-4">
                                            <p className="text-xs text-[#888888]">{new Date(entry.data).toLocaleString('pt-BR')}</p>
                                            <p className="text-sm text-white mt-0.5">{entry.descricao}</p>
                                            <p className="text-xs text-[#7b2cbf] mt-0.5 font-medium">{entry.autor}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-[#888888] italic">Sem registros no histórico.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
