'use client';

import { useOSStore } from '../../stores/useOSStore';
import { Calendar as CalendarIcon, Clock, AlertTriangle } from 'lucide-react';
import { format, isBefore, isToday, addDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

export default function CalendarioPage() {
    const { ordens } = useOSStore();
    const router = useRouter();

    // Filter out OS without a valid due date and completed OS
    const activeOS = ordens.filter(os => {
        if (os.situacao === 'Concluída') return false;
        if (!os.vencimento) return false;
        const d = new Date(os.vencimento);
        return !isNaN(d.getTime());
    });

    // Sort by closest due date
    activeOS.sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime());

    const today = new Date();

    const getStatusColor = (vencimento: string) => {
        const date = parseISO(vencimento);
        if (isBefore(date, today) && !isToday(date)) return 'text-[#f85149] border-[#f85149]'; // Atrasado
        if (isToday(date)) return 'text-[#ffab00] border-[#ffab00]'; // Para Hoje
        if (isBefore(date, addDays(today, 3))) return 'text-[#f1c40f] border-[#f1c40f]'; // Próximos 3 dias
        return 'text-[#3fb950] border-[#3fb950]'; // No prazo
    };

    const agrupadosPorMes = activeOS.reduce((acc, os) => {
        const date = parseISO(os.vencimento);
        const monthYear = format(date, 'MMMM yyyy', { locale: ptBR });

        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(os);

        return acc;
    }, {} as Record<string, typeof activeOS>);

    return (
        <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Calendário e Prazos</h2>
                    <p className="text-[#888888] mt-1">Visão timeline das suas entregas pendentes.</p>
                </div>
            </div>

            <div className="glass-panel p-6">
                {Object.keys(agrupadosPorMes).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-[#888888]">
                        <CalendarIcon className="w-12 h-12 mb-4 opacity-50" />
                        <p>Nenhuma entrega programada.</p>
                    </div>
                ) : (
                    <div className="space-y-10 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#00d4ff] before:to-[#7b2cbf]">

                        {Object.entries(agrupadosPorMes).map(([mesSelecionado, ordensMes]) => (
                            <div key={mesSelecionado} className="relative">
                                <div className="sticky top-20 z-10 flex items-center justify-start md:justify-center mb-6">
                                    <div className="bg-[#161b22] px-4 py-1.5 rounded-full border border-[#30363d] text-sm font-bold text-white capitalize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20">
                                        {mesSelecionado}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {ordensMes.map((os, index) => {
                                        const isLeft = index % 2 === 0;
                                        const statusClass = getStatusColor(os.vencimento);

                                        return (
                                            <div key={os.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                                                {/* Icon/Dot */}
                                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 bg-[#0d1117] relative z-10 md:mx-auto shadow-[0_0_0_4px_#0d1117] ${statusClass} group-hover:bg-[#161b22] group-hover:scale-110 transition-all cursor-pointer`} onClick={() => router.push(`/ordens/${os.id}`)}>
                                                    {statusClass.includes('f85149') ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                </div>

                                                {/* Card */}
                                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-lg bg-[rgba(22,27,34,0.7)] border border-[#30363d] hover:border-[#00d4ff] transition-all cursor-pointer group-hover:-translate-y-1" onClick={() => router.push(`/ordens/${os.id}`)}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-xs font-bold text-[#888888] bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
                                                            {format(parseISO(os.vencimento), "dd 'de' MMM", { locale: ptBR })}
                                                        </span>
                                                        <span className="text-xs text-[#00d4ff] font-medium">{os.prefixo}</span>
                                                    </div>
                                                    <h4 className="text-lg font-bold text-white leading-tight">{os.os}</h4>
                                                    <p className="text-sm text-[#888888] mt-1">{os.agencia} — {os.contrato}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
}
