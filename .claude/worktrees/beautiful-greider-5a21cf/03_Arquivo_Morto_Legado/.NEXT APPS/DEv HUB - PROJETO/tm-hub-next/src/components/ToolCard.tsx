'use client'

import { useState } from 'react'
import { Tool } from '@/lib/data'
import { ToolIcon, IconStar } from './Icons'
import { useToast } from './Toast'

interface Props {
  tool: Tool
  onClick: (tool: Tool) => void
}

export default function ToolCard({ tool, onClick }: Props) {
  const [fav, setFav] = useState(false)
  const { toast } = useToast()

  const style = {
    '--card-accent': tool.cardAccent,
    '--icon-bg': tool.iconBg,
    '--icon-border': tool.iconBorder,
    '--badge-bg': tool.badgeBg,
    '--badge-color': tool.badgeColor,
    '--badge-border': tool.badgeBorder,
  } as React.CSSProperties

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFav(f => !f)
    toast('success', fav ? 'Removido dos favoritos' : `${tool.name} adicionado aos favoritos`)
  }

  const handleCta = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast('info', `Abrindo ${tool.name}...`)
  }

  return (
    <div className="tool-card" style={style} onClick={() => onClick(tool)} tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') onClick(tool) }}
    >
      <button className={`fav-btn${fav ? ' active' : ''}`} title="Favoritar" onClick={handleFav}>
        <IconStar size={16} filled={fav} />
      </button>
      <div className="card-header">
        <div className="card-icon">
          <ToolIcon icon={tool.icon} size={18} />
        </div>
        <div className="card-badge">{tool.badge}</div>
      </div>
      <div className="card-body">
        <div className="card-title">{tool.name}</div>
        <div className="card-desc">{tool.desc}</div>
      </div>
      <div className="card-footer">
        <div className="card-meta">
          <div className="status-dot" />
          {tool.status}
        </div>
        <div className="card-cta" onClick={handleCta}>Abrir →</div>
      </div>
    </div>
  )
}
