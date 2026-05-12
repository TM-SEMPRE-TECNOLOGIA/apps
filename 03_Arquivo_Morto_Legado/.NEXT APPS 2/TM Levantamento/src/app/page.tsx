"use client";

import React, { useState } from "react";

/**
 * TM LEVANTAMENTO - REPLICAÇÃO 1:1 DAS TELAS STITCH (MAFFENG STEALTH)
 * Baseado puramente na análise visual das screenshots.
 */
export default function MaffengApp() {
  const [view, setView] = useState("login"); // login, dashboard, list, config, capture, profile

  const renderView = () => {
    switch (view) {
      case "login": return <LoginView onLogin={() => setView("dashboard")} />;
      case "dashboard": return <DashboardView onNavigate={setView} />;
      case "list": return <ListView onNavigate={setView} />;
      case "config": return <ConfigView onNavigate={setView} />;
      case "capture": return <CaptureView onNavigate={setView} />;
      case "profile": return <ProfileView onNavigate={setView} />;
      default: return <DashboardView onNavigate={setView} />;
    }
  };

  return (
    <div className="max-w-[375px] mx-auto min-h-screen relative overflow-hidden bg-[var(--tm-bg)]">
      {renderView()}
    </div>
  );
}

// --- 1. LOGIN VIEW ---
function LoginView({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="animate-fade min-h-screen flex flex-col items-center px-8 pt-20">
      <div className="w-20 h-20 bg-gradient-to-tr from-[var(--tm-accent)] to-[#4eb0d6] rounded-2xl flex items-center justify-center shadow-lg mb-6">
        <span className="material-symbols-outlined text-5xl text-white">shield_person</span>
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">MAFFENG</h1>
      <p className="text-[var(--tm-text-muted)] text-sm mb-14 font-medium text-center">Segurança e elegância em cada acesso</p>

      <div className="w-full space-y-6">
        <div className="space-y-2">
          <label className="text-[var(--tm-text-subtle)] text-[10px] font-bold uppercase tracking-widest ml-1">E-mail</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--tm-text-subtle)] text-xl">mail</span>
            <input className="input-field pl-12" placeholder="nome@exemplo.com" type="email" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[var(--tm-text-subtle)] text-[10px] font-bold uppercase tracking-widest ml-1">Senha</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--tm-text-subtle)] text-xl">lock</span>
            <input className="input-field pl-12 pr-12" placeholder="Sua senha" type="password" />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--tm-text-subtle)] text-xl">visibility</span>
          </div>
        </div>

        <div className="text-right">
          <button className="text-[var(--tm-accent)] text-xs font-bold">Esqueci minha senha</button>
        </div>

        <button onClick={onLogin} className="btn-primary btn-teal shadow-xl shadow-[rgba(28,118,156,0.2)]">Entrar</button>

        <div className="flex items-center gap-4 py-4">
          <div className="h-[1px] flex-1 bg-[var(--tm-border)]" />
          <span className="text-[var(--tm-text-subtle)] text-[10px] font-bold uppercase">Ou continue com</span>
          <div className="h-[1px] flex-1 bg-[var(--tm-border)]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="card flex items-center justify-center gap-2 py-3">
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-4 h-4" />
            <span className="text-xs font-bold text-white">Google</span>
          </button>
          <button className="card flex items-center justify-center gap-2 py-3 text-white">
            <span className="material-symbols-outlined text-lg text-[var(--tm-accent)]">face</span>
            <span className="text-xs font-bold">Face ID</span>
          </button>
        </div>
      </div>

      <div className="mt-auto pb-10">
        <p className="text-[var(--tm-text-muted)] text-sm">
          Não tem uma conta? <button className="text-[var(--tm-accent)] font-bold">Criar uma conta</button>
        </p>
      </div>
    </div>
  );
}

// --- 2. DASHBOARD VIEW ---
function DashboardView({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <div className="animate-fade min-h-screen flex flex-col">
      <header className="px-6 py-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">MAFFENG</h1>
          <p className="text-[var(--tm-text-muted)] text-xs font-medium uppercase tracking-widest mt-1">Painel de Controle</p>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 card p-0 flex items-center justify-center text-[var(--tm-text-muted)] border-[var(--tm-border)]">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </div>
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-[var(--tm-accent)]/30 cursor-pointer" onClick={() => onNavigate("profile")}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="px-6 space-y-4">
        <div className="card space-y-4 relative overflow-hidden group">
          <div className="flex justify-between items-center text-[var(--tm-text-muted)]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Levantamentos Ativos</span>
            <span className="material-symbols-outlined text-lg text-[var(--tm-accent)]">analytics</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">12</span>
            <span className="text-[var(--tm-accent)] text-[10px] font-bold">+5%</span>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex justify-between items-center text-[var(--tm-text-muted)]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Fotos Capturadas</span>
            <span className="material-symbols-outlined text-lg text-[var(--tm-accent)]">photo_camera</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">1,248</span>
            <span className="text-[var(--tm-accent)] text-[10px] font-bold">+12%</span>
          </div>
        </div>

        <button onClick={() => onNavigate("config")} className="btn-primary btn-teal mt-6">
          <span className="material-symbols-outlined">add</span>
          Novo Levantamento
        </button>

        <section className="pt-8 space-y-4 pb-12">
          <div className="flex justify-between items-end">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">Atividades Recentes</h2>
            <button onClick={() => onNavigate("list")} className="text-[var(--tm-text-muted)] text-[10px] font-bold uppercase tracking-widest">Ver Tudo</button>
          </div>

          <div className="space-y-3">
            <div className="card flex items-center gap-4 border-l-2 border-l-[var(--tm-accent)] bg-[var(--tm-bg-hover)]">
              <div className="w-10 h-10 bg-[var(--tm-accent)]/10 rounded flex items-center justify-center text-[var(--tm-accent)]">
                <span className="material-symbols-outlined text-lg">map</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate uppercase">Levantamento Residencial Alfa</p>
                <p className="text-[var(--tm-text-muted)] text-[10px]">Há 15 minutos • Setor Central</p>
              </div>
              <span className="material-symbols-outlined text-[var(--tm-text-muted)]">chevron_right</span>
            </div>

            <div className="card flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center text-[var(--tm-text-muted)]">
                <span className="material-symbols-outlined text-lg">cloud_upload</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate uppercase">Sincronização de 128 fotos</p>
                <p className="text-[var(--tm-text-muted)] text-[10px]">Há 2 horas • Backup Automático</p>
              </div>
              <span className="material-symbols-outlined text-[var(--tm-text-muted)]">chevron_right</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// --- 3. LIST VIEW ---
function ListView({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <div className="animate-fade min-h-screen flex flex-col">
      <header className="px-6 py-10 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">MAFFENG</h1>
          <p className="text-[var(--tm-text-muted)] text-[10px] font-bold uppercase tracking-[.25em] mt-1">Sistema de Levantamentos</p>
        </div>
        <button onClick={() => onNavigate("profile")} className="w-10 h-10 card p-0 rounded-full flex items-center justify-center text-[var(--tm-primary)] border-[var(--tm-border)]">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </header>

      <div className="px-6 pb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--tm-text-muted)]">search</span>
          <input className="input-field pl-12 h-12 text-sm" placeholder="Buscar agência ou código..." />
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="flex gap-6 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar">
          <button className="text-xs font-bold text-white border-b-2 border-[var(--tm-primary)] pb-4 -mb-4 whitespace-nowrap">Todos</button>
          <button className="text-xs font-bold text-[var(--tm-text-muted)] whitespace-nowrap">Pendentes</button>
          <button className="text-xs font-bold text-[var(--tm-text-muted)] whitespace-nowrap">Em revisão</button>
          <button className="text-xs font-bold text-[var(--tm-text-muted)] whitespace-nowrap">Concluídos</button>
        </div>
      </div>

      <main className="px-6 space-y-4 pb-20">
        <div className="card space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[8px] font-extrabold text-[var(--tm-primary)] uppercase tracking-widest">Em andamento</span>
              <h3 className="text-sm font-bold text-white uppercase">Agência Centro - 001</h3>
              <p className="text-[var(--tm-text-muted)] text-[10px] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">calendar_today</span> 15 Out 2023
              </p>
            </div>
            <div className="w-16 h-16 rounded-lg bg-cover bg-center border border-white/10" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200")' }}>
              <div className="w-full h-full bg-black/40 flex items-end justify-center pb-1">
                <span className="text-[8px] font-bold text-white uppercase tracking-tighter">12 fotos</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => onNavigate("capture")} className="flex-1 bg-[var(--tm-primary)] rounded h-10 text-[10px] font-bold text-white flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">edit_document</span> Continuar
            </button>
            <button className="w-10 h-10 bg-white/5 rounded flex items-center justify-center text-[var(--tm-text-muted)]">
              <span className="material-symbols-outlined text-lg">more_horiz</span>
            </button>
          </div>
        </div>
      </main>

      <button onClick={() => onNavigate("config")} className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--tm-primary)] shadow-2xl flex items-center justify-center text-white">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
}

// --- 4. CONFIG VIEW ---
function ConfigView({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <div className="animate-fade min-h-screen px-6 pt-12 flex flex-col">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-extrabold text-white tracking-[.3em] uppercase">MAFFENG</h1>
      </div>
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => onNavigate("dashboard")} className="text-[var(--tm-text-muted)]"><span className="material-symbols-outlined">arrow_back</span></button>
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Novo Levantamento</h2>
      </div>

      <div className="space-y-8 flex-1">
        <p className="text-[10px] font-bold text-[var(--tm-text-muted)]/60 uppercase tracking-[.3em]">Detalhes da Agência</p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--tm-text-muted)] ml-1">Nome da Agência</label>
            <input className="input-field" placeholder="Ex: Agência Central" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--tm-text-muted)] ml-1">Endereço Completo</label>
            <div className="relative">
              <input className="input-field pr-12" placeholder="Rua, número, bairro..." />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--tm-text-muted)] text-xl">location_on</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--tm-text-muted)] ml-1">Responsável Local</label>
            <input className="input-field" placeholder="Nome do contato" />
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold text-[var(--tm-text-muted)]/60 uppercase tracking-[.3em]">Ambientes</p>
            <button className="text-[var(--tm-primary)] text-[10px] font-extrabold flex items-center gap-1 uppercase tracking-widest"><span className="material-symbols-outlined text-sm">add_circle</span> Adicionar</button>
          </div>

          <div className="space-y-3">
            <div className="card flex items-center justify-between p-4 py-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-[var(--tm-primary)]/10 flex items-center justify-center text-[var(--tm-primary)]"><span className="material-symbols-outlined">meeting_room</span></div>
                <div>
                  <p className="text-xs font-bold text-white uppercase">Área de Atendimento</p>
                  <p className="text-[8px] text-[var(--tm-text-muted)]">Principal • 42m²</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-lg text-[var(--tm-text-subtle)]">edit</span>
                <span className="material-symbols-outlined text-lg text-[var(--tm-text-subtle)]">delete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-10 pt-6">
        <button onClick={() => onNavigate("capture")} className="btn-primary gap-4">Iniciar Levantamento <span className="material-symbols-outlined">play_arrow</span></button>
        <p className="text-center mt-6 text-xs font-bold text-[var(--tm-text-subtle)]">Salvar Rascunho</p>
      </div>
    </div>
  );
}

// --- 5. CAPTURE VIEW ---
function CaptureView({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <div className="animate-fade min-h-screen flex flex-col pt-6">
      <header className="px-6 py-4 flex justify-between items-center">
        <button onClick={() => onNavigate("dashboard")} className="text-[var(--tm-text-muted)]"><span className="material-symbols-outlined text-2xl">arrow_back</span></button>
        <h1 className="text-sm font-extrabold text-white tracking-[.3em] uppercase">MAFFENG</h1>
        <button className="text-[var(--tm-text-muted)]"><span className="material-symbols-outlined text-2xl">settings</span></button>
      </header>

      <div className="px-6 pb-6">
        <div className="flex border-b border-white/5">
          <button className="flex-1 pb-4 text-[10px] font-extrabold text-white border-b-2 border-[var(--tm-accent)] tracking-widest uppercase">Vista Ampla</button>
          <button className="flex-1 pb-4 text-[10px] font-extrabold text-[var(--tm-text-muted)] tracking-widest uppercase">Serviços</button>
          <button className="flex-1 pb-4 text-[10px] font-extrabold text-[var(--tm-text-muted)] tracking-widest uppercase">Detalhes</button>
        </div>
      </div>

      <div className="flex-1 px-4 relative">
        <div className="w-full h-full bg-[#141414] rounded-2xl border border-white/5 relative flex items-center justify-center overflow-hidden">
          {/* Viewfinder Corners */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[var(--tm-accent)]/30 rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[var(--tm-accent)]/30 rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[var(--tm-accent)]/30 rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[var(--tm-accent)]/30 rounded-br-lg" />

          <div className="w-12 h-px bg-[var(--tm-accent)]/30 absolute" />
          <div className="h-12 w-px bg-[var(--tm-accent)]/30 absolute" />

          <div className="absolute top-6 left-6 px-3 py-1 bg-black/40 backdrop-blur rounded border border-white/10">
            <span className="text-[8px] font-extrabold text-[var(--tm-accent)] uppercase tracking-[.2em]">Live</span>
          </div>

          <div className="absolute top-6 right-6 flex flex-col gap-3">
            <div className="w-8 h-8 bg-black/40 backdrop-blur rounded flex items-center justify-center text-white border border-white/10"><span className="material-symbols-outlined text-sm">flash_on</span></div>
            <div className="w-8 h-8 bg-black/40 backdrop-blur rounded flex items-center justify-center text-white border border-white/10"><span className="material-symbols-outlined text-sm">grid_on</span></div>
          </div>
        </div>
      </div>

      <div className="py-12 px-8">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg bg-[var(--tm-bg-card)] border border-white/10 overflow-hidden shadow-inner">
            <div className="w-full h-full bg-slate-900 opacity-50" />
          </div>

          <button className="w-20 h-20 rounded-full border-2 border-[var(--tm-accent)]/20 p-1">
            <div className="w-full h-full rounded-full bg-[var(--tm-accent)] flex items-center justify-center shadow-[0_0_30px_rgba(28,118,156,0.5)] active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
            </div>
          </button>

          <button className="w-12 h-12 rounded-full border border-white/10 bg-[var(--tm-bg-card)] flex items-center justify-center text-white">
            <span className="material-symbols-outlined">flip_camera_ios</span>
          </button>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <span className="text-[10px] font-bold text-[var(--tm-text-muted)]">.5x</span>
          <span className="text-[10px] font-bold text-[var(--tm-accent)] py-1 px-3 bg-[var(--tm-accent)]/10 rounded-full">1x</span>
          <span className="text-[10px] font-bold text-[var(--tm-text-muted)]">2x</span>
        </div>
        <p className="text-center mt-6 text-[8px] font-bold text-[var(--tm-text-muted)] uppercase tracking-[.5em]">Toque para focar</p>
      </div>
    </div>
  );
}

// --- 6. PROFILE VIEW ---
function ProfileView({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <div className="animate-fade min-h-screen flex flex-col pb-10">
      <header className="p-6">
        <button onClick={() => onNavigate("dashboard")} className="text-white"><span className="material-symbols-outlined text-2xl">arrow_back</span></button>
      </header>

      <div className="flex flex-col items-center py-6">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full p-1 border-2 border-[var(--tm-primary)] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="absolute bottom-2 right-0 w-8 h-8 rounded-full bg-[var(--tm-primary)] border-2 border-[var(--tm-bg)] flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">edit</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Carlos Alberto</h1>
        <p className="text-[var(--tm-text-muted)] text-[10px] font-bold uppercase tracking-[.3em] mt-1">Auditor Sênior</p>
      </div>

      <div className="px-6 space-y-3 pt-4 flex-1">
        <p className="text-[8px] font-extrabold text-[var(--tm-text-muted)]/40 uppercase tracking-[.4em] px-2 mb-2">Conta e Sistema</p>

        <ProfileOption icon="person" label="Meus Dados" />
        <ProfileOption icon="sync" label="Sincronização" />
        <ProfileOption icon="settings" label="Preferências" />

        <div className="pt-6">
          <button onClick={() => onNavigate("login")} className="card w-full flex items-center gap-4 py-4 text-red-500 border-red-500/10 hover:bg-red-500/5 transition-colors">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center"><span className="material-symbols-outlined">logout</span></div>
            <span className="text-sm font-bold uppercase">Sair da conta</span>
          </button>
        </div>
      </div>

      <p className="text-center text-[8px] font-bold text-[var(--tm-text-muted)]/20 uppercase tracking-[.4em] mt-8">Maffeng v4.2.0 • Stealth Edition</p>
    </div>
  );
}

function ProfileOption({ icon, label }: { icon: string, label: string }) {
  return (
    <div className="card flex items-center gap-4 py-4 group cursor-pointer hover:bg-[var(--tm-bg-hover)]">
      <div className="w-10 h-10 bg-[var(--tm-primary)]/10 rounded-lg flex items-center justify-center text-[var(--tm-primary)]">
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span className="flex-1 text-sm font-bold text-white uppercase">{label}</span>
      <span className="material-symbols-outlined text-[var(--tm-text-muted)]/40 group-hover:text-[var(--tm-primary)]">chevron_right</span>
    </div>
  );
}
