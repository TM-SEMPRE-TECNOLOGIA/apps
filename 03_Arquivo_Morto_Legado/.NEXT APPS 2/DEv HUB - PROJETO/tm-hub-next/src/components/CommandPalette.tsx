'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { TOOLS, NAV_ITEMS, CAT_ITEMS, ADMIN_ITEMS } from '@/lib/data'
import { IconSearch } from './Icons'

interface CmdItem {
  type: 'tool' | 'page'
  label: string
  cat: string
  toolId?: string
  page?: string
}

interface Props {
  open: boolean
  onClose: () => void
  onNavigate: (page: string) => void
  onOpenTool: (toolId: string) => void
}

export default function CommandPalette({ open, onClose, onNavigate, onOpenTool }: Props) {
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const allItems: CmdItem[] = [
    ...TOOLS.map(t => ({ type: 'tool' as const, label: t.name, cat: t.cat, toolId: t.id })),
    ...[...NAV_ITEMS, ...CAT_ITEMS, ...ADMIN_ITEMS].map(n => ({
      type: 'page' as const,
      label: n.label,
      cat: 'Navegação',
      page: n.page,
    })),
  ]

  const filtered = query
    ? allItems.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.cat.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 8)

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => { setSelectedIdx(0) }, [query])

  const execute = useCallback((item: CmdItem) => {
    onClose()
    if (item.type === 'page' && item.page) {
      onNavigate(item.page)
    } else if (item.toolId) {
      onOpenTool(item.toolId)
    }
  }, [onClose, onNavigate, onOpenTool])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, filtered.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter' && filtered[selectedIdx]) execute(filtered[selectedIdx])
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, filtered, selectedIdx, execute, onClose])

  return (
    <div className={`cmd-overlay${open ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cmd-box">
        <div className="cmd-input-wrap">
          <IconSearch size={16} />
          <input
            ref={inputRef}
            className="cmd-input"
            type="text"
            placeholder="Buscar ferramentas, páginas, ações..."
            autoComplete="off"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="cmd-kbd">ESC</span>
        </div>
        <div className="cmd-results">
          {filtered.map((item, i) => (
            <div
              key={`${item.label}-${i}`}
              className={`cmd-item${i === selectedIdx ? ' selected' : ''}`}
              onClick={() => execute(item)}
              onMouseEnter={() => setSelectedIdx(i)}
            >
              {item.type === 'tool' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              )}
              <span className="cmd-item-label">{item.label}</span>
              <span className="cmd-item-cat">{item.cat}</span>
            </div>
          ))}
        </div>
        <div className="cmd-footer">
          <span>↑↓ navegar</span>
          <span>↵ abrir</span>
          <span>esc fechar</span>
        </div>
      </div>
    </div>
  )
}
