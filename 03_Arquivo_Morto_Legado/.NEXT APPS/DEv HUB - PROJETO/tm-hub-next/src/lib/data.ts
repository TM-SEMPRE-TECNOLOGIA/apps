export interface Tool {
  id: string
  name: string
  desc: string
  cat: string
  badge: string
  status: string
  cardAccent: string
  iconBg: string
  iconBorder: string
  badgeBg: string
  badgeColor: string
  badgeBorder: string
  icon: string // SVG path string identifier
}

export const TOOLS: Tool[] = [
  {
    id: 'tm-relatorio',
    name: 'TM Relatorio',
    desc: 'Gera relatórios DOCX profissionais a partir de templates e dados.',
    cat: 'Documentos',
    badge: 'Next.js',
    status: 'Online · Documentos',
    cardAccent: '#4f6ef7',
    iconBg: 'rgba(79,110,247,0.08)',
    iconBorder: 'rgba(79,110,247,0.15)',
    badgeBg: 'rgba(79,110,247,0.08)',
    badgeColor: '#4f6ef7',
    badgeBorder: 'rgba(79,110,247,0.2)',
    icon: 'edit',
  },
  {
    id: 'tm-comparador',
    name: 'TM Comparador',
    desc: 'Compara planilhas Excel com documentos DOCX e aponta divergências.',
    cat: 'Análise',
    badge: 'Next.js',
    status: 'Online · Análise',
    cardAccent: '#22c55e',
    iconBg: 'rgba(34,197,94,0.08)',
    iconBorder: 'rgba(34,197,94,0.15)',
    badgeBg: 'rgba(34,197,94,0.08)',
    badgeColor: '#16a34a',
    badgeBorder: 'rgba(34,197,94,0.2)',
    icon: 'compare',
  },
  {
    id: 'tm-carta-encaminhamento',
    name: 'TM Carta de Encaminhamento',
    desc: 'Gera cartas de encaminhamento profissionais para documentos e processos.',
    cat: 'Documentos',
    badge: 'Next.js',
    status: 'Online · Documentos',
    cardAccent: '#06b6d4',
    iconBg: 'rgba(6,182,212,0.08)',
    iconBorder: 'rgba(6,182,212,0.15)',
    badgeBg: 'rgba(6,182,212,0.08)',
    badgeColor: '#0891b2',
    badgeBorder: 'rgba(6,182,212,0.2)',
    icon: 'mail',
  },
  {
    id: 'bot-chat-tm',
    name: 'Bot Chat TM',
    desc: 'Assistente de IA com suporte a upload de documentos PDF e DOCX.',
    cat: 'IA',
    badge: 'Next.js',
    status: 'Online · IA',
    cardAccent: '#8b5cf6',
    iconBg: 'rgba(139,92,246,0.08)',
    iconBorder: 'rgba(139,92,246,0.15)',
    badgeBg: 'rgba(139,92,246,0.08)',
    badgeColor: '#7c3aed',
    badgeBorder: 'rgba(139,92,246,0.2)',
    icon: 'bot',
  },
  {
    id: 'gerenciador-os',
    name: 'Gerenciador de O.S. V2',
    desc: 'Sistema de gestão com banco de dados, relatórios e dashboard. (Ex-Vite)',
    cat: 'Gestão',
    badge: 'Migrado',
    status: 'Next.js · Gestão',
    cardAccent: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.08)',
    iconBorder: 'rgba(245,158,11,0.15)',
    badgeBg: 'rgba(245,158,11,0.08)',
    badgeColor: '#d97706',
    badgeBorder: 'rgba(245,158,11,0.2)',
    icon: 'settings',
  },
  {
    id: 'tm-extrator',
    name: 'TM Extrator',
    desc: 'Extrai e analisa itens de documentos PDF/DOCX automaticamente. (Ex-Vite)',
    cat: 'Documentos',
    badge: 'Migrado',
    status: 'Next.js · Documentos',
    cardAccent: '#22c55e',
    iconBg: 'rgba(34,197,94,0.08)',
    iconBorder: 'rgba(34,197,94,0.15)',
    badgeBg: 'rgba(34,197,94,0.08)',
    badgeColor: '#16a34a',
    badgeBorder: 'rgba(34,197,94,0.2)',
    icon: 'file',
  },
  {
    id: 'tm-relatorio-sp',
    name: 'TM Relatorio SP',
    desc: 'Versão SP do gerador de relatórios com templates específicos regionais.',
    cat: 'Documentos',
    badge: 'Next.js',
    status: 'Online · Documentos',
    cardAccent: '#ef4444',
    iconBg: 'rgba(239,68,68,0.08)',
    iconBorder: 'rgba(239,68,68,0.15)',
    badgeBg: 'rgba(239,68,68,0.08)',
    badgeColor: '#ef4444',
    badgeBorder: 'rgba(239,68,68,0.2)',
    icon: 'camera',
  },
  {
    id: 'tm-gerenciador-arquivos',
    name: 'TM Gerenciador de Arquivos',
    desc: 'Upload, organização e gerenciamento de arquivos com preview integrado.',
    cat: 'Utilidades',
    badge: 'Next.js',
    status: 'Online · Utilidades',
    cardAccent: '#0ea5e9',
    iconBg: 'rgba(14,165,233,0.08)',
    iconBorder: 'rgba(14,165,233,0.15)',
    badgeBg: 'rgba(14,165,233,0.08)',
    badgeColor: '#0284c7',
    badgeBorder: 'rgba(14,165,233,0.2)',
    icon: 'folder',
  },
  {
    id: 'tm-lancamentos',
    name: 'TM Lançamentos',
    desc: 'Sistema de lançamentos financeiros e controle de caixa com relatórios.',
    cat: 'Gestão',
    badge: 'Next.js',
    status: 'Online · Gestão',
    cardAccent: '#10b981',
    iconBg: 'rgba(16,185,129,0.08)',
    iconBorder: 'rgba(16,185,129,0.15)',
    badgeBg: 'rgba(16,185,129,0.08)',
    badgeColor: '#059669',
    badgeBorder: 'rgba(16,185,129,0.2)',
    icon: 'bar-chart',
  },
]

export const CATEGORIES = ['Todos', 'Documentos', 'Análise', 'Gestão', 'Utilidades', 'IA']

export const NAV_ITEMS = [
  { label: 'Dashboard', page: 'dashboard', icon: 'grid' },
  { label: 'Ferramentas', page: 'tools', icon: 'wrench', count: 9 },
  { label: 'Favoritos', page: 'favorites', icon: 'star' },
]

export const CAT_ITEMS = [
  { label: 'Documentos', page: 'cat-docs', icon: 'file-text', count: 4 },
  { label: 'Análise', page: 'cat-analysis', icon: 'bar-chart', count: 1 },
  { label: 'Gestão', page: 'cat-management', icon: 'folder', count: 2 },
  { label: 'Utilidades', page: 'cat-utils', icon: 'folder', count: 1 },
  { label: 'IA', page: 'cat-ai', icon: 'bot', count: 1 },
]

export const ADMIN_ITEMS = [
  { label: 'Arquivos', page: 'files', icon: 'folder' },
  { label: 'Configurações', page: 'settings', icon: 'settings' },
  { label: 'Segurança', page: 'security', icon: 'lock' },
]
