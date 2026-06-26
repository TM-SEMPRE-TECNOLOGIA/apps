'use client'

import { useState, useEffect } from 'react'
import { TOOLS, CATEGORIES } from '@/lib/data'
import { Tool } from '@/lib/data'
import ToolCard from '../ToolCard'
import { IconRefresh, IconFileText, IconBarChart, IconFolder, IconBot } from '../Icons'

interface Props {
  onOpenTool: (tool: Tool) => void
}

function AnimatedCount({ target }: { target: number }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    let cur = 0
    const steps = 40
    const dur = 900
    const timer = setInterval(() => {
      cur += target / steps
      if (cur >= target) { cur = target; clearInterval(timer) }
      setVal(Math.floor(cur))
    }, dur / steps)
    return () => clearInterval(timer)
  }, [target])

  return <>{val}</>
}

const catIcons: Record<string, React.ReactNode> = {
  'Documentos': <IconFileText size={16} />,
  'Análise': <IconBarChart size={16} />,
  'Gestão': <IconFolder size={16} />,
  'Utilidades': <IconFolder size={16} />,
  'IA': <IconBot size={16} />,
}

export default function DashboardPage({ onOpenTool }: Props) {
  const [activecat, setActiveCat] = useState('Todos')

  const filtered = activecat === 'Todos'
    ? TOOLS
    : TOOLS.filter(t => t.cat === activecat)

  return (
    <>
      {/* HERO */}
      <div className="hero">
        <div className="hero-left">
          <div className="hero-greeting">Olá, bem-vindo de volta </div>
          <div className="hero-title">
            Central de Ferramentas TM
            <span className="hero-title-accent">vamos acelerar seu trabalho.</span>
          </div>
          <div className="hero-sub">Tudo que você precisa em um só lugar com interface unificada</div>
        </div>
        <div className="hero-right">
          <div className="hero-badge"> TM · Sempre Tecnologia</div>
          <div className="hero-count">Arquitetura Next.js Total</div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Ferramentas</div>
          <div className="stat-value success"><AnimatedCount target={9} /></div>
          <div className="stat-sub">unificadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tecnologia</div>
          <div className="stat-value primary">Next.js</div>
          <div className="stat-sub">framework base</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Categorias</div>
          <div className="stat-value"><AnimatedCount target={5} /></div>
          <div className="stat-sub">organizadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Design</div>
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>Light System</div>
          <div className="stat-sub">UI Padronizada</div>
        </div>
      </div>

      {/* SECTION HEADER */}
      <div className="section-header">
        <div className="section-title">Ferramentas disponíveis</div>
        <div className="actions">
          <button className="btn btn-ghost">
            <IconRefresh size={14} /> Atualizar
          </button>
          <button className="btn btn-primary">＋ Nova ferramenta</button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="cat-pills">
        {CATEGORIES.map(cat => (
          <span
            key={cat}
            className={`cat-pill${activecat === cat ? ' active' : ''}`}
            onClick={() => setActiveCat(cat)}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') setActiveCat(cat) }}
          >
            {cat !== 'Todos' && catIcons[cat]}
            {cat}
          </span>
        ))}
      </div>

      {/* GRID */}
      <div className="tools-grid" id="grid">
        {filtered.map(tool => (
          <ToolCard key={tool.id} tool={tool} onClick={onOpenTool} />
        ))}
      </div>
    </>
  )
}
