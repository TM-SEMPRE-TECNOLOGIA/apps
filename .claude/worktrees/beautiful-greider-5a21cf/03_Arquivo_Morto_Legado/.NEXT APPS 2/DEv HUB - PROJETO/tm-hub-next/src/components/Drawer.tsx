'use client'

import { useEffect } from 'react'
import { Tool } from '@/lib/data'
import { IconX } from './Icons'

interface Props {
  tool: Tool | null
  onClose: () => void
}

export default function Drawer({ tool, onClose }: Props) {
  const open = !!tool

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <div className={`drawer-overlay${open ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="drawer">
        <div className="drawer-header">
          <span className="drawer-title">{tool?.name || 'Detalhes'}</span>
          <button className="drawer-close" onClick={onClose} aria-label="Fechar painel">
            <IconX />
          </button>
        </div>
        <div className="drawer-body">
          {tool && (
            <>
              <p className="detail-desc">{tool.desc}</p>
              <div className="detail-row">
                <span className="detail-label">Categoria</span>
                <span className="detail-value">{tool.cat}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Tecnologia</span>
                <span className="detail-value">{tool.badge}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className="detail-value">{tool.status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Última verificação</span>
                <span className="detail-value">Agora</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
