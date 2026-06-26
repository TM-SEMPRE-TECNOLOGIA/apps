import React, { useState, useEffect, useRef } from 'react';

// Mock Data
const INITIAL_ITEMS = [
  { id: 1, uasg: '160088', item: 'Notebook Core i7', lanceAtual: 4500.00, meuLimite: 3800.00, step: 5.00, status: 'Vencendo', oponente: '-', updatedAt: new Date() },
  { id: 2, uasg: '160088', item: 'Monitor 27" 4K', lanceAtual: 1800.00, meuLimite: 1500.00, step: 2.00, status: 'Coberto', oponente: 'Empresa X', updatedAt: new Date() },
  { id: 3, uasg: '200114', item: 'Nobreak 1200VA', lanceAtual: 450.00, meuLimite: 300.00, step: 1.00, status: 'Margem Atingida', oponente: 'Empresa Y', updatedAt: new Date() },
  { id: 4, uasg: '200114', item: 'Roteador Wi-Fi 6', lanceAtual: 680.00, meuLimite: 600.00, step: 5.00, status: 'Vencendo', oponente: '-', updatedAt: new Date() },
];

export default function App() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [logs, setLogs] = useState([{ time: new Date().toLocaleTimeString(), type: 'info', msg: 'Sistema Licitus Sniper iniciado e monitorando Compras.gov...' }]);
  const [stats, setStats] = useState({ ativos: 4, vitorias: 12, economia: 8540.00 });
  const logsEndRef = useRef(null);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type, msg }].slice(-50));
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random item not in Margem Atingida and simulate an opponent bid
      const candidates = items.filter(i => i.status !== 'Margem Atingida');
      if (candidates.length === 0) return;

      const target = candidates[Math.floor(Math.random() * candidates.length)];

      // se vencendo, 20% de chance do oponente cobrir
      if (target.status === 'Vencendo') {
        if (Math.random() > 0.8) {
          const drop = target.step * (Math.floor(Math.random() * 3) + 1);
          const newPrice = target.lanceAtual - drop;

          addLog(`[UASG ${target.uasg}] Oponente cobriu lance no item '${target.item}': R$ ${newPrice.toFixed(2)}`, 'alert');

          setItems(prev => prev.map(it =>
            it.id === target.id ? { ...it, lanceAtual: newPrice, status: 'Coberto', oponente: 'Oponente ' + Math.floor(Math.random() * 100), updatedAt: new Date() } : it
          ));
        }
      }
      // se coberto, bot atua em milissegundos
      else if (target.status === 'Coberto') {
        setTimeout(() => {
          const sniperPrice = target.lanceAtual - target.step;
          if (sniperPrice < target.meuLimite) {
            addLog(`[UASG ${target.uasg}] TRAVA DE MARGEM! Lance para '${target.item}' abortado. Limite R$ ${target.meuLimite.toFixed(2)} atingido.`, 'error');
            setItems(prev => prev.map(it => it.id === target.id ? { ...it, status: 'Margem Atingida' } : it));
          } else {
            addLog(`[UASG ${target.uasg}] Snipe executado! Lance enviado R$ ${sniperPrice.toFixed(2)} para '${target.item}' em 180ms.`, 'success');
            setItems(prev => prev.map(it =>
              it.id === target.id ? { ...it, lanceAtual: sniperPrice, status: 'Vencendo', oponente: '-', updatedAt: new Date() } : it
            ));
          }
        }, 500); // simulated reaction time
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [items]);


  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* Navbar */}
      <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-500/20 border border-brand-500/50 flex items-center justify-center text-brand-400">
            <i className="fa-solid fa-crosshairs text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Licitus<span className="text-brand-500">Sniper</span></h1>
            <p className="text-xs text-brand-400 font-mono tracking-widest uppercase">Live Automation Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Websocket Conectado</span>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white">TM Tecnologia</p>
              <p className="text-xs text-slate-400">Operador: Thiago Barbosa</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
              <i className="fa-solid fa-user-tie text-slate-400"></i>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 glass-panel border-r-0 hidden lg:flex flex-col py-6">
          <div className="px-6 mb-8">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Cockpit</p>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium">
                <i className="fa-solid fa-radar fa-fw"></i> Monitoramento
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium transition">
                <i className="fa-solid fa-list-check fa-fw"></i> Meus Limites
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium transition">
                <i className="fa-solid fa-chart-line fa-fw"></i> Relatórios
              </a>
            </div>
          </div>

          <div className="px-6 mt-auto">
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Plano Ativo</span>
                <span className="badge-new text-[10px] bg-amber-500 text-amber-950 px-2 py-0.5 rounded uppercase font-bold">Enterprise</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">45/100 Itens Paralelos</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 hide-scrollbar relative">

          {/* Subtle BG Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="glass-card p-6 border-l-4 border-l-brand-500">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-slate-400">Pregões Ativos</h3>
                <i className="fa-solid fa-gavel text-slate-600"></i>
              </div>
              <div className="text-3xl font-black text-white">{stats.ativos}</div>
              <div className="text-xs text-green-400 mt-2"><i className="fa-solid fa-arrow-up"></i> +2 hoje</div>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-slate-400">Itens Arrematados (Hoje)</h3>
                <i className="fa-solid fa-trophy text-slate-600"></i>
              </div>
              <div className="text-3xl font-black text-white">{stats.vitorias}</div>
              <div className="text-xs text-blue-400 mt-2">Volume Total: R$ 145.200</div>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-purple-500">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-slate-400">Economia via Snipe</h3>
                <i className="fa-solid fa-piggy-bank text-slate-600"></i>
              </div>
              <div className="text-3xl font-black text-white">R$ {stats.economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div className="text-xs text-slate-500 mt-2">Diferença para 2º Colocado</div>
            </div>
          </div>

          {/* Grid Layout for Tables & Logs */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 relative z-10 min-h-[400px]">

            {/* Monitoramento Table */}
            <div className="xl:col-span-2 glass-card flex flex-col">
              <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-bolt text-brand-400"></i> Tempo Randômico Sub-second
                </h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-600 transition">Pausar Todos</button>
                  <button className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs rounded border border-brand-400 transition">Sincronizar</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Item (UASG)</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Meu Limite</th>
                      <th className="px-6 py-4 text-right">Lance Atual</th>
                      <th className="px-6 py-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {items.map(item => {
                      const proximity = Math.max(0, Math.min(100, ((item.lanceAtual - item.meuLimite) / item.meuLimite) * 100)); // just a visual relative value

                      let statusBadge = '';
                      if (item.status === 'Vencendo') statusBadge = 'bg-brand-500/20 text-brand-400 border border-brand-500/30';
                      else if (item.status === 'Coberto') statusBadge = 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse';
                      else statusBadge = 'bg-red-500/20 text-red-400 border border-red-500/30';

                      return (
                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-200">{item.item}</div>
                            <div className="text-xs text-slate-500">UASG: {item.uasg} | Oponente: <span className="text-slate-400">{item.oponente}</span></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${statusBadge}`}>
                              {item.status === 'Vencendo' && <i className="fa-solid fa-crown"></i>}
                              {item.status === 'Coberto' && <i className="fa-solid fa-triangle-exclamation"></i>}
                              {item.status === 'Margem Atingida' && <i className="fa-solid fa-ban"></i>}
                              {item.status}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-slate-400">
                            R$ {item.meuLimite.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="font-mono font-bold text-white text-base">R$ {item.lanceAtual.toFixed(2)}</div>
                            <div className="w-24 h-1.5 bg-slate-800 rounded-full ml-auto mt-2 overflow-hidden flex">
                              <div className={`h-full rounded-full ${item.status === 'Margem Atingida' ? 'bg-red-500' : 'bg-brand-500'}`} style={{ width: `${Math.max(5, proximity)}%` }}></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition" title="Configurar Margem">
                              <i className="fa-solid fa-sliders"></i>
                            </button>
                            <button className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-700 transition ml-1" title="Parar Item">
                              <i className="fa-solid fa-stop"></i>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Terminal Log */}
            <div className="glass-card flex flex-col font-mono text-xs">
              <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center shrink-0">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-slate-500 tracking-wider">TERMINAL • SNIPER LOG</div>
              </div>
              <div className="p-5 overflow-y-auto flex-1 bg-slate-950 hide-scrollbar space-y-2">
                {logs.map((L, i) => {
                  let color = 'text-slate-400';
                  if (L.type === 'alert') color = 'text-yellow-400';
                  if (L.type === 'success') color = 'text-brand-400';
                  if (L.type === 'error') color = 'text-red-400';

                  return (
                    <div key={i} className={`flex gap-3 leading-relaxed ${color} opacity-90 hover:opacity-100 transition-opacity`}>
                      <span className="text-slate-600 shrink-0">[{L.time}]</span>
                      <span className="break-words">{L.msg}</span>
                    </div>
                  )
                })}
                <div ref={logsEndRef} />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
