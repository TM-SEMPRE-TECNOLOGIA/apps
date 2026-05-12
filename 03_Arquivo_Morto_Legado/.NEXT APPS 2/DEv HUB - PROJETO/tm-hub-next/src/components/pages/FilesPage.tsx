'use client'

import { useToast } from '../Toast'

const FILES = [
  { name: 'relatorio-jan-2025.docx', type: '📄', meta: '245 KB · DOCX' },
  { name: 'planilha-comparacao.xlsx', type: '📊', meta: '128 KB · XLSX' },
  { name: 'carta-encaminhamento.pdf', type: '📕', meta: '89 KB · PDF' },
  { name: 'os-2024-001.docx', type: '📄', meta: '312 KB · DOCX' },
  { name: 'backup-dados.zip', type: '📦', meta: '2.1 MB · ZIP' },
  { name: 'foto-evidencia.jpg', type: '🖼️', meta: '1.8 MB · JPG' },
]

export default function FilesPage() {
  const { toast } = useToast()

  return (
    <>
      <div className="section-header">
        <div className="section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          Arquivos
        </div>
        <button className="btn btn-primary" onClick={() => toast('info', 'Upload em breve...')}>
          ↑ Upload
        </button>
      </div>
      <div className="files-grid">
        {FILES.map(f => (
          <div key={f.name} className="file-card" onClick={() => toast('info', `Abrindo ${f.name}...`)}>
            <div className="file-icon">{f.type}</div>
            <div>
              <div className="file-card-name">{f.name}</div>
              <div className="file-card-meta">{f.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
