'use client'

export default function FavoritesPage() {
  return (
    <>
      <div className="section-header">
        <div className="section-title">Favoritos</div>
      </div>
      <div className="empty-state">
        <div className="empty-state-icon">⭐</div>
        <div className="empty-state-text">Nenhum favorito ainda. Clique na estrela de uma ferramenta para favoritar.</div>
      </div>
    </>
  )
}
