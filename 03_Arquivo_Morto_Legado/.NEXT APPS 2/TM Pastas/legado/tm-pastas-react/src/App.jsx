import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import AppPage from './pages/AppPage';
import GuiaPage from './pages/GuiaPage';
import ChangelogPage from './pages/ChangelogPage';
import ReorderPage from './pages/ReorderPage';

function App() {
  return (
    <BrowserRouter>
      {/* Globals Navigation for switching modes */}
      <div className="global-nav" style={{
        display: 'flex', gap: '15px', padding: '10px 20px',
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)'
      }}>
        <span style={{ fontWeight: 'bold', marginRight: '20px', color: 'var(--accent)' }}>TM Pastas</span>
        <NavLink to="/" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>🏗️ Criar Nova Estrutura</NavLink>
        <NavLink to="/reorder" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>✏️ Editar Existentes</NavLink>
        <div style={{ flex: 1 }}></div>
        <NavLink to="/guia" className="btn btn-sm btn-ghost">📖 Guia</NavLink>
        <NavLink to="/changelog" className="btn btn-sm btn-ghost">🚀 Novidades</NavLink>
      </div>

      <Routes>
        <Route path="/" element={<AppPage />} />
        <Route path="/reorder" element={<ReorderPage />} />
        <Route path="/guia" element={<GuiaPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
