'use client'

import { NavIcon, IconChevronLeft } from './Icons'
import { NAV_ITEMS, CAT_ITEMS, ADMIN_ITEMS } from '@/lib/data'

interface Props {
  collapsed: boolean
  onToggle: () => void
  activePage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({ collapsed, onToggle, activePage, onNavigate }: Props) {
  const SidebarItem = ({ label, page, icon, count }: { label: string; page: string; icon: string; count?: number }) => (
    <a
      className={`sidebar-item${activePage === page ? ' active' : ''}`}
      data-label={label}
      onClick={() => onNavigate(page)}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') onNavigate(page) }}
    >
      <span className="icon"><NavIcon icon={icon} /></span>
      <span>{label}</span>
      {count && <span className="sidebar-count">{count}</span>}
    </a>
  )

  return (
    <aside id="sidebar" className={collapsed ? 'collapsed' : ''}>
      <button className="sidebar-toggle" id="sidebarToggle" title="Recolher menu" onClick={onToggle}>
        <IconChevronLeft size={10} />
      </button>

      <div className="sidebar-section">
        <div className="sidebar-label">Menu</div>
        {NAV_ITEMS.map(item => (
          <SidebarItem key={item.page} {...item} />
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Categorias</div>
        {CAT_ITEMS.map(item => (
          <SidebarItem key={item.page} {...item} />
        ))}
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-label">Admin</div>
        {ADMIN_ITEMS.map(item => (
          <SidebarItem key={item.page} {...item} />
        ))}
      </div>
    </aside>
  )
}
