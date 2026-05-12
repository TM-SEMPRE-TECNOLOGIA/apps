'use client'

import { IconSearch, IconSun, IconMoon, IconBell } from './Icons'

interface Props {
  isDark: boolean
  onToggleDark: () => void
  onOpenCmd: () => void
}

export default function Header({ isDark, onToggleDark, onOpenCmd }: Props) {
  return (
    <header>
      <div className="logo">
        <div className="logo-mark">TM</div>
        <div className="logo-text">HUB <span>TM</span></div>
      </div>
      <div className="header-divider" />
      <div className="search-bar" onClick={onOpenCmd}>
        <IconSearch size={13} />
        <input
          type="text"
          placeholder="Buscar ferramenta..."
          id="search"
          readOnly
          onClick={onOpenCmd}
        />
        <span className="search-hint">Ctrl+K</span>
      </div>
      <div className="header-right">
        <button className="theme-toggle" onClick={onToggleDark} aria-label="Alternar tema claro/escuro" title="Alternar tema">
          <span className="icon-sun"><IconSun size={16} /></span>
          <span className="icon-moon"><IconMoon size={16} /></span>
        </button>
        <button className="notif-btn" aria-label="Notificações" title="Notificações">
          <IconBell size={16} />
          <div className="notif-dot" />
        </button>
        <div className="badge-online">
          <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor"><circle cx="3" cy="3" r="3" /></svg>
          Online
        </div>
        <div className="user-chip" role="button" tabIndex={0}>
          <div className="avatar">TN</div>
          <div className="user-name">Thiago N. B.</div>
          <span className="admin-badge">Admin</span>
        </div>
      </div>
    </header>
  )
}
