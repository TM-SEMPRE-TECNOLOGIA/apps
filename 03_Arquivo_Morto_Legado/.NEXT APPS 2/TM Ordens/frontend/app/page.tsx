'use client';

import { useOSStore } from '../stores/useOSStore';
import { FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STATUS_COLORS } from '../lib/constants';

export default function Dashboard() {
  const { ordens } = useOSStore();

  const total = ordens.length;
  const concluidas = ordens.filter(os => os.situacao === 'Concluída').length;
  const comDificuldade = ordens.filter(os => os.situacao === 'Com Dificuldade').length;

  // Calculate overdue (simplified logic for now)
  const atrasadas = ordens.filter(os => {
    if (os.situacao === 'Concluída') return false;
    const prazoDate = new Date(os.vencimento);
    return prazoDate < new Date();
  }).length;

  const kpis = [
    { title: 'Total de OS', value: total, icon: FileText, color: 'text-[#00d4ff]' },
    { title: 'Concluídas', value: concluidas, icon: CheckCircle, color: 'text-[#3fb950]' },
    { title: 'Atrasadas', value: atrasadas, icon: Clock, color: 'text-[#f1c40f]' },
    { title: 'Com Dificuldade', value: comDificuldade, icon: AlertTriangle, color: 'text-[#f85149]' },
  ];

  // Group by status for chart
  const statusStats = ordens.reduce((acc, os) => {
    acc[os.situacao] = (acc[os.situacao] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(statusStats).map(status => ({
    name: status,
    quantidade: statusStats[status],
  })).sort((a, b) => b.quantidade - a.quantidade);

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Visão Geral</h2>
          <p className="text-[#888888] mt-1">Acompanhamento das Ordens de Serviço em tempo real.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="glass-panel p-5 flex items-center justify-between hover:bg-[rgba(255,255,255,0.03)] transition-colors">
            <div>
              <p className="text-sm font-medium text-[#888888] mb-1">{kpi.title}</p>
              <h3 className="text-3xl font-bold text-white">{kpi.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.02)] flex items-center justify-center border border-[#30363d] ${kpi.color}`}>
              <kpi.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Chart */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Pedidos por Status</h3>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#888888', fontSize: 12 }}
                    axisLine={{ stroke: '#30363d' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#888888', fontSize: 12 }}
                    axisLine={{ stroke: '#30363d' }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0d1117', borderColor: '#30363d', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#00d4ff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-[#888888] border border-dashed border-[#30363d] rounded-lg">
                Nenhum dado inserido ainda.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Mini-Feed */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Atividade Recente</h3>
          <div className="space-y-4">
            {ordens.slice(0, 5).map(os => (
              <div key={os.id} className="flex gap-4 p-3 rounded-lg hover:bg-[rgba(255,255,255,0.03)] border border-transparent hover:border-[#30363d] transition-all">
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: STATUS_COLORS[os.situacao] }}></div>
                <div>
                  <p className="text-sm font-medium text-white">{os.os} <span className="text-[#888888] font-normal">- {os.agencia}</span></p>
                  <p className="text-xs text-[#888888] mt-1">{os.situacao}</p>
                </div>
              </div>
            ))}
            {ordens.length === 0 && (
              <p className="text-[#888888] text-sm text-center italic mt-10">
                O fluxo de atividades aparecerá aqui.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
