'use client'

import { useToast } from '../Toast'
import { IconKey, IconShield, IconClipboard, IconUsers } from '../Icons'

export default function SecurityPage() {
  const { toast } = useToast()

  const items = [
    {
      icon: <IconKey size={18} />,
      iconStyle: { background: 'rgba(34,197,94,0.08)', border: '1.5px solid rgba(34,197,94,0.15)' },
      title: 'Alterar Senha',
      desc: 'Última alteração há 30 dias',
      action: 'Alterar',
      msg: 'Funcionalidade em breve',
    },
    {
      icon: <IconShield size={18} />,
      iconStyle: { background: 'rgba(139,92,246,0.08)', border: '1.5px solid rgba(139,92,246,0.15)' },
      title: 'Autenticação 2FA',
      desc: 'Não configurado',
      action: 'Configurar',
      msg: 'Funcionalidade em breve',
    },
    {
      icon: <IconClipboard size={18} />,
      iconStyle: { background: 'rgba(6,182,212,0.08)', border: '1.5px solid rgba(6,182,212,0.15)' },
      title: 'Log de Acesso',
      desc: '3 sessões ativas',
      action: 'Ver Logs',
      msg: 'Visualizando logs...',
    },
    {
      icon: <IconUsers size={18} />,
      iconStyle: { background: 'rgba(245,158,11,0.08)', border: '1.5px solid rgba(245,158,11,0.15)' },
      title: 'Sessões Ativas',
      desc: 'Gerenciar dispositivos',
      action: 'Gerenciar',
      msg: 'Funcionalidade em breve',
    },
  ]

  return (
    <>
      <div className="section-header">
        <div className="section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Segurança
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map(item => (
          <div key={item.title} className="sec-card">
            <div className="sec-icon" style={item.iconStyle}>{item.icon}</div>
            <div className="sec-info">
              <div className="sec-title">{item.title}</div>
              <div className="sec-desc">{item.desc}</div>
            </div>
            <button className="btn btn-ghost" onClick={() => toast('info', item.msg)}>
              {item.action}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
