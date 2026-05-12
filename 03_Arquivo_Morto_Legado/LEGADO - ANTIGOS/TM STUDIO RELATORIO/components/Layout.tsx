import React from 'react';
import { AppView } from '../types';
import { LayoutGrid, Home, Settings, Bell, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onLogout }) => {
  return (
    <div 
      className="min-h-screen text-tm-gray font-sans selection:bg-tm-primary/20 bg-tm-bg"
      style={{
        backgroundImage: `
          radial-gradient(1200px 600px at 20% -10%, rgba(34, 197, 94, 0.12), transparent 55%),
          radial-gradient(1000px 500px at 90% 0%, rgba(14, 165, 233, 0.10), transparent 50%)
        `
      }}
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 px-6 py-4 bg-white/75 backdrop-blur-md border-b border-tm-border shadow-tm-sm flex items-center justify-between">
        
        {/* Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onNavigate(AppView.DASHBOARD)}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-tm-primary to-tm-secondary text-white flex items-center justify-center shadow-tm-md transition-transform group-hover:scale-105">
            <span className="font-extrabold text-xl tracking-tight">TM</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base leading-tight text-tm-dark">Stúdio Relatório</span>
            <span className="text-xs font-medium text-gray-500">Document Intelligence v1.0</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-2">
             <button 
                onClick={() => onNavigate(AppView.DASHBOARD)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                  currentView === AppView.DASHBOARD 
                    ? 'bg-tm-dark text-white border-tm-dark' 
                    : 'bg-white text-gray-600 border-tm-border hover:bg-tm-muted'
                }`}
             >
                <LayoutGrid size={14} />
                <span>Dashboard</span>
             </button>
             <div className="h-6 w-px bg-gray-200 mx-2"></div>
          </nav>

          <button className="p-2 rounded-xl hover:bg-white/80 transition-colors text-gray-500 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white border border-tm-border shadow-sm hover:shadow-md transition-all">
               <div className="w-7 h-7 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                  <User size={14} className="text-gray-600"/>
               </div>
               <span className="text-xs font-bold text-gray-700">Thiago B.</span>
            </div>
            
            {onLogout && (
              <button 
                onClick={onLogout}
                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs font-medium text-gray-400">
        <p>&copy; {new Date().getFullYear()} TM - Stúdio Relatório. Todos os direitos reservados.</p>
        <div className="mt-2 flex justify-center gap-4">
          <span className="hover:text-tm-primary cursor-pointer transition-colors">Termos</span>
          <span className="hover:text-tm-primary cursor-pointer transition-colors">Privacidade</span>
          <span 
            onClick={() => onNavigate(AppView.SUPPORT)}
            className="hover:text-tm-primary cursor-pointer transition-colors"
          >
            Suporte
          </span>
        </div>
      </footer>
    </div>
  );
};