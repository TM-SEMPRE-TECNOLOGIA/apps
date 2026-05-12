'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import CommandPalette from './CommandPalette'
import Drawer from './Drawer'
import DashboardPage from './pages/DashboardPage'
import FilesPage from './pages/FilesPage'
import SettingsPage from './pages/SettingsPage'
import SecurityPage from './pages/SecurityPage'
import FavoritesPage from './pages/FavoritesPage'
import { TOOLS, Tool } from '@/lib/data'
import { IconChevronRight } from './Icons'

export default function HubLayout() {
  const [isDark, setIsDark] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')
  const [cmdOpen, setCmdOpen] = useState(false)
  const [drawerTool, setDrawerTool] = useState<Tool | null>(null)

  // Init dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDark = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const openCmd = useCallback(() => setCmdOpen(true), [])

  // Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        openCmd()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [openCmd])

  const openTool = (tool: Tool) => setDrawerTool(tool)
  const openToolById = (id: string) => {
    const t = TOOLS.find(t => t.id === id)
    if (t) setDrawerTool(t)
  }

  // Breadcrumb label
  const breadcrumbLabel = () => {
    const map: Record<string, string> = {
      dashboard: 'Dashboard',
      tools: 'Ferramentas',
      favorites: 'Favoritos',
      'cat-docs': 'Documentos',
      'cat-analysis': 'Análise',
      'cat-management': 'Gestão',
      'cat-utils': 'Utilidades',
      'cat-ai': 'IA',
      files: 'Arquivos',
      settings: 'Configurações',
      security: 'Segurança',
    }
    return map[activePage] || activePage
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
      case 'tools':
      case 'cat-docs':
      case 'cat-analysis':
      case 'cat-management':
      case 'cat-utils':
      case 'cat-ai':
        return <DashboardPage onOpenTool={openTool} />
      case 'files':
        return <FilesPage />
      case 'settings':
        return <SettingsPage isDark={isDark} onToggleDark={toggleDark} />
      case 'security':
        return <SecurityPage />
      case 'favorites':
        return <FavoritesPage />
      default:
        return <DashboardPage onOpenTool={openTool} />
    }
  }

  return (
    <>
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={setActivePage}
        onOpenTool={openToolById}
      />
      <Drawer tool={drawerTool} onClose={() => setDrawerTool(null)} />

      <Header isDark={isDark} onToggleDark={toggleDark} onOpenCmd={openCmd} />

      <div className="layout">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          activePage={activePage}
          onNavigate={setActivePage}
        />
        <main>
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <a href="#" onClick={e => { e.preventDefault(); setActivePage('dashboard') }}>Hub</a>
            <IconChevronRight size={12} />
            <span>{breadcrumbLabel()}</span>
          </nav>

          <div className="page active">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  )
}
