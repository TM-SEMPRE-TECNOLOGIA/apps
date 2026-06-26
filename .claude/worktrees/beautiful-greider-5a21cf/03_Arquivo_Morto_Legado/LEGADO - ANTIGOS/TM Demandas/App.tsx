
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Demand, PricingRule, ImportLog } from './types';
import { DEFAULT_PRICING, STAGES, STATUS_OPTIONS } from './constants';
import { fmtBRL, uid, calcValueByPhotos, getDueBadge, toInt } from './utils';
import { validateFileExtension, ImportResult } from './importService';
import { ImportView } from './ImportView';
import {
  LayoutDashboard,
  ClipboardList,
  UploadCloud,
  Settings,
  HelpCircle,
  Search,
  Plus,
  Download,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  History,
  Trash2,
  Calendar,
  Layers,
  FileSpreadsheet,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

// Sub-components
const Sidebar: React.FC<{ currentView: View; setView: (v: View) => void }> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, tag: 'métricas' },
    { id: 'demandas', label: 'Demandas', icon: ClipboardList, tag: 'lista' },
    { id: 'importar', label: 'Importar', icon: UploadCloud, tag: 'mapeamento' },
    { id: 'config', label: 'Configurações', icon: Settings, tag: 'preço' },
    { id: 'ajuda', label: 'Ajuda', icon: HelpCircle, tag: 'guia' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0f0f18] to-[#0a0a0f] border-r border-white/5 shadow-2xl shadow-black/50 flex flex-col fixed inset-y-0 left-0 z-50">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm leading-tight text-slate-100">Gestor de<br />Demandas</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${currentView === item.id
              ? 'bg-gradient-to-r from-red-500/20 to-red-500/10 text-red-400 border border-red-500/30 shadow-sm shadow-red-500/10'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
              }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700">
              {item.tag}
            </span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Usuário</span>
              <span className="text-slate-200">Admin</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Conexão</span>
              <span className="text-red-400 font-medium">Produção</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Badge: React.FC<{ type?: 'good' | 'warn' | 'bad' | 'neutral'; children: React.ReactNode }> = ({ type = 'neutral', children }) => {
  const styles = {
    good: 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/10',
    warn: 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-400 border-amber-500/20 shadow-sm shadow-amber-500/10',
    bad: 'bg-gradient-to-r from-rose-500/20 to-rose-500/10 text-rose-400 border-rose-500/20 shadow-sm shadow-rose-500/10',
    neutral: 'bg-gradient-to-r from-slate-500/20 to-slate-500/10 text-slate-400 border-slate-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type]}`}>
      {children}
    </span>
  );
};

// Main Component
export default function App() {
  // State
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [demands, setDemands] = useState<Demand[]>(() => {
    const saved = localStorage.getItem('ad_demands');
    return saved ? JSON.parse(saved) : [];
  });
  const [pricing, setPricing] = useState<PricingRule[]>(() => {
    const saved = localStorage.getItem('ad_pricing');
    return saved ? JSON.parse(saved) : DEFAULT_PRICING;
  });
  const [imports, setImports] = useState<ImportLog[]>(() => {
    const saved = localStorage.getItem('ad_imports');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDemandId, setSelectedDemandId] = useState<string | null>(null);

  // Persistence
  useEffect(() => localStorage.setItem('ad_demands', JSON.stringify(demands)), [demands]);
  useEffect(() => localStorage.setItem('ad_pricing', JSON.stringify(pricing)), [pricing]);
  useEffect(() => localStorage.setItem('ad_imports', JSON.stringify(imports)), [imports]);

  // Derived State
  const enrichedDemands = useMemo(() => {
    return demands.map(d => ({
      ...d,
      value: calcValueByPhotos(d.fotos, pricing),
      badge: getDueBadge(d.vencPortal),
      completedStages: Object.values(d.stages).filter(Boolean).length,
    }));
  }, [demands, pricing]);

  const stats = useMemo(() => {
    const totalValue = enrichedDemands.reduce((acc, d) => acc + (d.value || 0), 0);
    const delayedCount = enrichedDemands.filter(d => d.badge.type === 'bad').length;
    const completedCount = enrichedDemands.filter(d => d.status === 'Concluído').length;
    const urgentCount = enrichedDemands.filter(d => d.badge.type === 'warn').length;

    return { totalValue, delayedCount, completedCount, urgentCount, total: enrichedDemands.length };
  }, [enrichedDemands]);

  const filteredDemands = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return enrichedDemands.filter(d =>
      d.agencia.toLowerCase().includes(q) ||
      d.chamado.toLowerCase().includes(q) ||
      d.contrato.toLowerCase().includes(q) ||
      d.prefixo.toLowerCase().includes(q)
    );
  }, [enrichedDemands, searchQuery]);

  // Actions
  const handleAddDemand = () => {
    const newId = uid();
    const emptyStages: Record<string, boolean> = {};
    STAGES.forEach(s => emptyStages[s.key] = false);

    const newDemand: Demand = {
      id: newId,
      estado: '', contrato: '', chamado: '', prefixo: '', agencia: '',
      status: 'Sem Levantamento', fotos: null, obs: '',
      vencPortal: '', envioCorrecao: '', envioOrcamento: '',
      stages: emptyStages,
      history: [{ at: Date.now(), text: 'Demanda criada manualmente.' }]
    };

    setDemands(prev => [newDemand, ...prev]);
    setSelectedDemandId(newId);
    setCurrentView('detalhes');
  };

  const updateDemand = (updated: Demand) => {
    setDemands(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const deleteDemand = (id: string) => {
    if (confirm('Deseja realmente excluir esta demanda?')) {
      setDemands(prev => prev.filter(d => d.id !== id));
      setCurrentView('demandas');
    }
  };

  const selectedDemand = useMemo(() =>
    demands.find(d => d.id === selectedDemandId) || null
    , [selectedDemandId, demands]);

  // View Components
  const DashboardView = () => {
    const statusData = useMemo(() => {
      const counts: Record<string, number> = {};
      enrichedDemands.forEach(d => counts[d.status] = (counts[d.status] || 0) + 1);
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [enrichedDemands]);

    const trendData = useMemo(() => {
      const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
      return days.map((day, i) => ({
        name: day,
        criadas: Math.round((stats.total / 7) * (0.8 + Math.random() * 0.4)),
        concluidas: Math.round((stats.completedCount / 7) * (0.5 + Math.random() * 0.5))
      }));
    }, [stats]);

    const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#6366f1', '#ec4899'];

    const [timeFilter, setTimeFilter] = useState('mês');

    if (stats.total === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-20 bg-[#12121a]/40 border-2 border-dashed border-white/5 rounded-3xl text-center">
          <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 text-slate-500">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">Nenhuma demanda cadastrada</h3>
          <p className="text-slate-500 max-w-xs mt-2 mb-6 text-sm">Importe uma planilha ou adicione manualmente para começar a acompanhar suas métricas.</p>
          <button
            onClick={() => setCurrentView('importar')}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
          >
            Importar Planilha
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resumo de Performance</h3>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-[#12121a] border border-white/10 rounded-lg px-3 py-1 text-xs text-slate-400 focus:outline-none focus:border-red-500 transition-all"
          >
            <option value="hoje">Hoje</option>
            <option value="semana">Últimos 7 dias</option>
            <option value="mês">Este mês</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#12121a]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20 hover:border-white/10 hover:shadow-xl transition-all duration-300 flex flex-col gap-2">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Valor Projetado</span>
            <span className="text-2xl font-bold font-mono text-slate-100">{fmtBRL(stats.totalValue)}</span>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>Meta: {fmtBRL(25000)}</span>
                <span>{Math.round((stats.totalValue / 25000) * 100)}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
                  style={{ width: `${Math.min((stats.totalValue / 25000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="bg-[#12121a]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20 hover:border-white/10 hover:shadow-xl transition-all duration-300 flex flex-col gap-2">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Atrasados</span>
            <span className="text-2xl font-bold font-mono text-rose-500">{stats.delayedCount}</span>
            <span className="text-[10px] text-slate-500">Demanda(s) com prazo vencido</span>
          </div>
          <div className="bg-[#12121a]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20 hover:border-white/10 hover:shadow-xl transition-all duration-300 flex flex-col gap-2">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Urgentes (48h)</span>
            <span className="text-2xl font-bold font-mono text-amber-500">{stats.urgentCount}</span>
            <span className="text-[10px] text-slate-500">Próximos do vencimento</span>
          </div>
          <div className="bg-[#12121a]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20 hover:border-white/10 hover:shadow-xl transition-all duration-300 flex flex-col gap-2">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total de Demandas</span>
            <span className="text-2xl font-bold font-mono text-slate-100">{stats.total}</span>
            <span className="text-[10px] text-slate-500">Demandas cadastradas</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#12121a]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20">
            <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-red-500" />
              Volume por Status
            </h3>
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#12121a]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20">
            <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Tendência Semanal
            </h3>
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorCriadas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConcluidas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="criadas" stroke="#ef4444" fillOpacity={1} fill="url(#colorCriadas)" />
                  <Area type="monotone" dataKey="concluidas" stroke="#10b981" fillOpacity={1} fill="url(#colorConcluidas)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-[#12121a]/80 backdrop-blur-sm rounded-2xl border border-white/5 shadow-lg shadow-black/20 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-semibold">Prioridades Críticas</h3>
            <button onClick={() => setCurrentView('demandas')} className="text-xs text-red-500 hover:text-red-400 font-medium">Ver todas</button>
          </div>
          <div className="divide-y divide-slate-800">
            {enrichedDemands.filter(d => d.badge.type === 'bad' || d.badge.type === 'warn').slice(0, 5).map(d => (
              <div key={d.id} className="p-4 hover:bg-white/[0.03] transition-colors duration-200 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{d.agencia}</span>
                    <Badge type={d.badge.type}>{d.badge.label}</Badge>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    CHAMADO: {d.chamado} • CONTRATO: {d.contrato}
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedDemandId(d.id); setCurrentView('detalhes'); }}
                  className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
            {enrichedDemands.filter(d => d.badge.type === 'bad' || d.badge.type === 'warn').length === 0 && (
              <div className="p-12 text-center text-slate-500 text-sm">Nenhuma prioridade crítica no momento. 🎉</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DemandsView = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar agência, chamado ou contrato..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f0f18] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all duration-200"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { }} className="flex items-center gap-2 bg-[#12121a] border border-white/10 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:border-white/15 transition-all duration-200">
              <Download className="w-4 h-4" /> Exportar
            </button>
            <button onClick={handleAddDemand} className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-xl text-sm font-bold text-white hover:from-red-400 hover:to-red-500 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-red-500/25">
              <Plus className="w-4 h-4" /> Nova Demanda
            </button>
          </div>
        </div>

        <div className="bg-[#12121a]/80 backdrop-blur-sm border border-white/5 rounded-2xl overflow-x-auto shadow-lg shadow-black/20">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Agência / Local</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contrato / Chamado</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Progresso</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Valor</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prazo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDemands.map(d => (
                <tr
                  key={d.id}
                  onClick={() => { setSelectedDemandId(d.id); setCurrentView('detalhes'); }}
                  className="group hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-200">{d.agencia || '—'}</span>
                      <span className="text-[10px] text-slate-500">{d.estado || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col font-mono text-[11px]">
                      <span className="text-slate-300">{d.contrato || '—'}</span>
                      <span className="text-slate-500">{d.chamado || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge type={d.status === 'Concluído' ? 'good' : 'neutral'}>
                      {d.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden min-w-[60px]">
                        <div
                          className="h-full bg-red-600 transition-all duration-500"
                          style={{ width: `${(d.completedStages / STAGES.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{d.completedStages}/{STAGES.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-slate-200 font-mono">{fmtBRL(d.value)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge type={d.badge.type}>{d.badge.label}</Badge>
                  </td>
                </tr>
              ))}
              {filteredDemands.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-800 rounded-full">
                        <Search className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-slate-500 text-sm">Nenhum resultado encontrado para sua busca.</p>
                      <button onClick={() => setSearchQuery('')} className="text-red-500 text-xs font-semibold">Limpar filtros</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ConfigView = () => {
    const [localPricing, setLocalPricing] = useState<PricingRule[]>(pricing);

    const savePricing = () => {
      setPricing(localPricing);
      alert('Tabela de preços salva com sucesso!');
    };

    return (
      <div className="max-w-4xl space-y-6">
        <div className="bg-[#12121a]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-lg shadow-black/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Settings className="w-4 h-4 text-red-500" />
                Tabela de Preços
              </h3>
              <p className="text-xs text-slate-500 mt-1">Defina os valores cobrados com base na quantidade de fotos do levantamento.</p>
            </div>
            <button
              onClick={() => setLocalPricing([...localPricing, { min: 0, max: 0, value: 0 }])}
              className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
            >
              Adicionar Faixa
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Mínimo</span>
              <span>Máximo</span>
              <span>Valor (R$)</span>
              <span>Ações</span>
            </div>
            {localPricing.map((row, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-4 bg-white/5 p-2 rounded-xl border border-white/10 items-center hover:bg-white/[0.07] transition-colors duration-200">
                <input
                  type="number"
                  value={row.min}
                  onChange={(e) => {
                    const next = [...localPricing];
                    next[idx].min = Number(e.target.value);
                    setLocalPricing(next);
                  }}
                  className="bg-[#0f0f18] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
                <input
                  type="number"
                  value={row.max}
                  onChange={(e) => {
                    const next = [...localPricing];
                    next[idx].max = Number(e.target.value);
                    setLocalPricing(next);
                  }}
                  className="bg-[#0f0f18] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
                <input
                  type="number"
                  value={row.value}
                  onChange={(e) => {
                    const next = [...localPricing];
                    next[idx].value = Number(e.target.value);
                    setLocalPricing(next);
                  }}
                  className="bg-[#0f0f18] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
                <button
                  onClick={() => setLocalPricing(localPricing.filter((_, i) => i !== idx))}
                  className="text-rose-500 hover:text-rose-400 p-1.5 w-fit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={savePricing}
            className="mt-6 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.99]"
          >
            Salvar Alterações
          </button>
        </div>

        <div className="bg-[#12121a]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-lg shadow-black/20">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-red-500" />
            Histórico de Importações
          </h3>
          <div className="space-y-3">
            {imports.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-xs">Nenhum log de importação.</div>
            ) : (
              imports.slice().reverse().map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors duration-200">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-300">{log.fileName}</span>
                    <span className="text-[10px] text-slate-500">{new Date(log.at).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-mono text-emerald-500">+{log.created}</span>
                      <span className="text-xs font-mono text-amber-400">~{log.updated}</span>
                    </div>
                    <Badge type={log.warnings.length > 0 ? 'warn' : 'good'}>
                      {log.warnings.length > 0 ? `${log.warnings.length} Avisos` : 'Válido'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const DemandDetailsView = () => {
    if (!selectedDemand) return null;

    const [localDemand, setLocalDemand] = useState<Demand>(selectedDemand);

    // Check if all stages are completed
    const allStagesCompleted = useMemo(() => {
      return STAGES.every(stage => localDemand.stages[stage.key]);
    }, [localDemand.stages]);

    const enriched = {
      ...localDemand,
      value: calcValueByPhotos(localDemand.fotos, pricing),
      badge: getDueBadge(localDemand.vencPortal)
    };

    const handleStageToggle = (key: string) => {
      setLocalDemand(prev => ({
        ...prev,
        stages: { ...prev.stages, [key]: !prev.stages[key] }
      }));
    };

    const handleSave = () => {
      const historyText = `Alterações salvas por Admin em ${new Date().toLocaleString('pt-BR')}`;
      const finalDemand = {
        ...localDemand,
        history: [...localDemand.history, { at: Date.now(), text: historyText }]
      };
      updateDemand(finalDemand);
      setCurrentView('demandas');
    };

    const handleSendToCorrection = () => {
      if (!confirm("Confirma o envio para correção? O status será alterado.")) return;

      const historyText = `Enviado para Correção em ${new Date().toLocaleString('pt-BR')}`;
      const finalDemand = {
        ...localDemand,
        status: 'Correção',
        history: [...localDemand.history, { at: Date.now(), text: historyText }]
      };
      updateDemand(finalDemand);
      setLocalDemand(finalDemand); // Update local state to reflect change immediately
    };

    const handleSendToPortal = () => {
      if (!confirm("Confirma que o orçamento foi enviado ao portal?")) return;

      const historyText = `Enviado ao Portal em ${new Date().toLocaleString('pt-BR')}`;
      const finalDemand = {
        ...localDemand,
        status: 'Orçamento',
        enviadoPortal: true,
        history: [...localDemand.history, { at: Date.now(), text: historyText }]
      };
      updateDemand(finalDemand);
      setLocalDemand(finalDemand);
    };

    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center bg-[#12121a]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20">
          <div>
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('demandas')} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                  O.S.: {localDemand.chamado || 'Sem Número'}
                  <Badge type={enriched.badge.type}>{enriched.badge.label}</Badge>
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  {localDemand.agencia} • {localDemand.contrato}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => deleteDemand(localDemand.id)}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl transition-all text-sm font-medium border border-rose-500/20"
            >
              <Trash2 className="w-4 h-4" /> Excluir
            </button>
            <button
              onClick={() => setCurrentView('demandas')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl transition-all text-sm font-medium border border-slate-700"
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#12121a]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20 space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Dados Principais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Estado</label>
                    <input
                      type="text"
                      value={localDemand.estado}
                      onChange={e => setLocalDemand({ ...localDemand, estado: e.target.value })}
                      placeholder="Ex: Minas Gerais"
                      className="w-full bg-[#0f0f18] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Agência / Local</label>
                    <input
                      type="text"
                      value={localDemand.agencia}
                      onChange={e => setLocalDemand({ ...localDemand, agencia: e.target.value })}
                      className="w-full bg-[#0f0f18] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contrato</label>
                    <input
                      type="text"
                      value={localDemand.contrato}
                      onChange={e => setLocalDemand({ ...localDemand, contrato: e.target.value })}
                      className="w-full bg-[#0f0f18] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Chamado</label>
                    <input
                      type="text"
                      value={localDemand.chamado}
                      onChange={e => setLocalDemand({ ...localDemand, chamado: e.target.value })}
                      className="w-full bg-[#0f0f18] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
                    <select
                      value={localDemand.status}
                      onChange={e => setLocalDemand({ ...localDemand, status: e.target.value })}
                      className="w-full bg-[#0f0f18] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                    >
                      {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Qtd. Fotos</label>
                    <input
                      type="number"
                      value={localDemand.fotos || ''}
                      onChange={e => setLocalDemand({ ...localDemand, fotos: toInt(e.target.value) })}
                      className="w-full bg-[#0f0f18] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Valor Calculado</label>
                    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 font-mono">
                      {fmtBRL(enriched.value)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Venc. Portal</label>
                    <input
                      type="date"
                      value={localDemand.vencPortal}
                      onChange={e => setLocalDemand({ ...localDemand, vencPortal: e.target.value })}
                      className="w-full bg-[#0f0f18] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Envio Correção</label>
                    <input
                      type="date"
                      value={localDemand.envioCorrecao}
                      onChange={e => setLocalDemand({ ...localDemand, envioCorrecao: e.target.value })}
                      className="w-full bg-[#0f0f18] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Envio Orçamento</label>
                    <input
                      type="date"
                      value={localDemand.envioOrcamento}
                      onChange={e => setLocalDemand({ ...localDemand, envioOrcamento: e.target.value })}
                      className="w-full bg-[#0f0f18] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Observações e Detalhes</label>
                  <textarea
                    value={localDemand.obs}
                    onChange={e => setLocalDemand({ ...localDemand, obs: e.target.value })}
                    placeholder="Descreva o andamento da demanda, dificuldades ou informações extras..."
                    rows={4}
                    className="w-full bg-[#0f0f18] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Checklist Section */}
            <div className="space-y-6">
              <div className="bg-[#12121a]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-lg shadow-black/20">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-red-500" />
                  Etapas do Relatório
                </h3>
                <div className="space-y-3">
                  {STAGES.map(stage => (
                    <label
                      key={stage.key}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${localDemand.stages[stage.key]
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={localDemand.stages[stage.key]}
                        onChange={() => handleStageToggle(stage.key)}
                        className="mt-1 accent-emerald-500"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xs font-semibold ${localDemand.stages[stage.key] ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {stage.title}
                        </span>
                        <span className="text-[10px] text-slate-500 leading-tight">{stage.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Workflow Buttons */}
                <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                  {allStagesCompleted && localDemand.status !== 'Correção' && localDemand.status !== 'Orçamento' && localDemand.status !== 'Concluído' ? (
                    <button
                      onClick={handleSendToCorrection}
                      className="w-full flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/50 text-amber-400 hover:bg-amber-500/20 py-3 rounded-xl text-sm font-bold transition-all"
                    >
                      <AlertCircle className="w-4 h-4" /> Enviar para Correção
                    </button>
                  ) : null}

                  {localDemand.status === 'Correção' ? (
                    <button
                      onClick={handleSendToPortal}
                      disabled={localDemand.enviadoPortal}
                      className={`w-full flex items-center justify-center gap-2 border py-3 rounded-xl text-sm font-bold transition-all ${localDemand.enviadoPortal
                        ? 'bg-sky-500/10 border-sky-500/20 text-sky-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/20 border-transparent'
                        }`}
                    >
                      {localDemand.enviadoPortal ? (
                        <> <CheckCircle2 className="w-4 h-4" /> Enviado ao Portal </>
                      ) : (
                        <> <UploadCloud className="w-4 h-4" /> Confirmar Envio ao Portal </>
                      )}
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="bg-[#12121a]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-lg shadow-black/20">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <History className="w-3 h-3" /> Histórico Recente
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {localDemand.history.slice().reverse().map((entry, idx) => (
                    <div key={idx} className="flex flex-col gap-1 border-l-2 border-slate-800 pl-3">
                      <span className="text-[10px] text-slate-200 leading-snug">{entry.text}</span>
                      <span className="text-[9px] text-slate-500">{new Date(entry.at).toLocaleString('pt-BR')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-[#12121a]/95 backdrop-blur-xl shrink-0 flex justify-end fixed bottom-0 left-64 right-0 z-40">
          <div className="max-w-6xl mx-auto w-full flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 px-8 py-3 rounded-xl text-sm font-bold text-white hover:from-red-400 hover:to-red-500 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-red-500/25"
            >
              <CheckCircle2 className="w-4 h-4" /> Salvar e Voltar
            </button>
          </div>
        </div>
        <div className="h-24"></div> {/* Spacer for fixed footer */}
      </div>
    );
  };

  const HelpView = () => {
    return (
      <div className="max-w-4xl space-y-8 pb-10">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-red-500" />
            Guia de Uso (MVP/PRD)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#12121a]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20 space-y-4">
              <h3 className="text-sm font-bold text-red-400">Escopo do MVP</h3>
              <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
                <li>Gestão centralizada de levantamentos técnicos.</li>
                <li>Mapeamento inteligente de planilhas CSV.</li>
                <li>Checklist de produção em 7 etapas fundamentais.</li>
                <li>Precificação dinâmica baseada em volume fotográfico.</li>
                <li>Monitoramento de prazos em tempo real.</li>
              </ul>
            </div>
            <div className="bg-[#12121a]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg shadow-black/20 space-y-4">
              <h3 className="text-sm font-bold text-emerald-400">Funcionalidades Chave</h3>
              <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
                <li>Dashboard com métricas financeiras e operacionais.</li>
                <li>Detecção automática de cabeçalhos em importações.</li>
                <li>Sistema de histórico de alterações por demanda.</li>
                <li>Geração automática de badges de atraso e urgência.</li>
                <li>Filtros avançados e busca global por prefixo.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[#12121a]/60 backdrop-blur-sm p-8 rounded-3xl border border-white/5 border-dashed space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center">
              <UploadCloud className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-base font-bold">Como importar sua planilha?</h3>
              <p className="text-xs text-slate-500">Siga as etapas abaixo para importar seus dados.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="space-y-2">
              <div className="text-lg font-bold text-slate-700">01</div>
              <h4 className="text-sm font-semibold">Upload do Arquivo</h4>
              <p className="text-[10px] text-slate-500">Arraste seu arquivo CSV ou Excel na tela de importação.</p>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-bold text-slate-700">02</div>
              <h4 className="text-sm font-semibold">Mapear Colunas</h4>
              <p className="text-[10px] text-slate-500">O sistema sugere o mapeamento, basta confirmar se os campos estão corretos.</p>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-bold text-slate-700">03</div>
              <h4 className="text-sm font-semibold">Validar e Salvar</h4>
              <p className="text-[10px] text-slate-500">Confira o preview dos dados e finalize para registrar as demandas.</p>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f18] to-[#0a0a0f] flex">
      <Sidebar currentView={currentView} setView={setCurrentView} />

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
              {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Gestão inteligente de demandas e relatórios técnicos</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
            <div className="flex flex-col items-end px-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saldo Mensal</span>
              <span className="text-xs font-mono font-bold text-emerald-500">{fmtBRL(stats.totalValue)}</span>
            </div>
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
              <LayoutDashboard className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </header>

        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'demandas' && <DemandsView />}
        {currentView === 'importar' && (
          <ImportView
            onImportComplete={(newDemands, log) => {
              setDemands(prev => [...newDemands, ...prev]);
              setImports(prev => [...prev, log]);
              setCurrentView('demandas');
            }}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}
        {currentView === 'config' && <ConfigView />}
        {currentView === 'ajuda' && <HelpView />}
        {currentView === 'detalhes' && <DemandDetailsView />}
      </main>
    </div>
  );
}
