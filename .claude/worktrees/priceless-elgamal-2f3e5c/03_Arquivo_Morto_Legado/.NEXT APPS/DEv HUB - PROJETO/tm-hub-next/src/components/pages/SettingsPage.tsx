'use client'

import { useState } from 'react'

interface Props {
  isDark: boolean
  onToggleDark: () => void
}

export default function SettingsPage({ isDark, onToggleDark }: Props) {
  const [prefs, setPrefs] = useState({
    autoRefresh: true,
    notifications: true,
    animations: true,
  })

  const toggle = (key: keyof typeof prefs) =>
    setPrefs(p => ({ ...p, [key]: !p[key] }))

  const PrefRow = ({ label, hint, checked, onChange }: {
    label: string; hint: string; checked: boolean; onChange: () => void
  }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--tm-border)' }}>
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{label}</div>
        <div className="form-hint">{hint}</div>
      </div>
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="toggle-slider" />
      </label>
    </div>
  )

  return (
    <>
      <div className="section-header">
        <div className="section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.18V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.09 15H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a2 2 0 0 1 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Configurações
        </div>
      </div>

      <div className="settings-card">
        <div style={{ fontFamily: 'var(--TM-font-serif)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Perfil do Usuário
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input className="form-input" defaultValue="Thiago Nascimento Barbosa" />
          </div>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input className="form-input" defaultValue="thiago@tm.com.br" />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Empresa</label>
          <input className="form-input" defaultValue="TM — Sempre Tecnologia" />
        </div>

        <div style={{ fontFamily: 'var(--TM-font-serif)', fontSize: '0.95rem', fontWeight: 700, margin: '1.5rem 0 1rem' }}>
          Preferências
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <PrefRow label="Auto-refresh dos apps" hint="Verifica status online a cada 30s" checked={prefs.autoRefresh} onChange={() => toggle('autoRefresh')} />
          <PrefRow label="Notificações" hint="Receber alertas de apps offline" checked={prefs.notifications} onChange={() => toggle('notifications')} />
          <PrefRow label="Animações" hint="Efeitos de transição na interface" checked={prefs.animations} onChange={() => toggle('animations')} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Modo Escuro</div>
              <div className="form-hint">Alterna entre tema claro e escuro</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={isDark} onChange={onToggleDark} />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
