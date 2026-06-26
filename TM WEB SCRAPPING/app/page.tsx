'use client';

import { useState } from 'react';
import { exportToCSV, exportToJSON, downloadBlob, getDownloadFilename } from '@/lib/exporter';

interface ScrapedData {
  items: string[];
  count: number;
  timestamp: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [data, setData] = useState<ScrapedData | null>(null);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    setData(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, selector }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao fazer scrape');
      }

      setData(result.data);
      setSuccess(`✓ ${result.data.count} items coletados com sucesso`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`✗ ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (!data) return;

    try {
      let blob: Blob;
      const filename = getDownloadFilename(format, 'scraped_data');

      if (format === 'csv') {
        blob = exportToCSV(data.items);
      } else {
        blob = exportToJSON(data.items, {
          url,
          selector,
          timestamp: data.timestamp,
        });
      }

      downloadBlob(blob, filename);
      setSuccess(`✓ Arquivo exportado: ${filename}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao exportar';
      setError(`✗ ${errorMsg}`);
    }
  };

  const handleClear = () => {
    setUrl('');
    setSelector('');
    setData(null);
    setError('');
    setSuccess('');
  };

  return (
    <main>
      <div className="container">
        <header className="header">
          <h1>🕷️ TM Web Scrapper</h1>
          <p>Extraia dados estruturados de qualquer site usando seletores CSS</p>
        </header>

        <form onSubmit={handleScrape}>
          <div className="form-group">
            <label htmlFor="url">URL do Site</label>
            <input
              id="url"
              type="text"
              placeholder="https://exemplo.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="selector">Seletor CSS</label>
            <textarea
              id="selector"
              placeholder=".produto, .price, #items, div.card, etc."
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              disabled={isLoading}
              required
            />
            <div className="tip">
              <strong>Dica:</strong> Use qualquer seletor CSS válido. Exemplos: <code>.class</code>, <code>#id</code>, <code>div.item</code>, <code>a[href*="xyz"]</code>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span> Scrapando...
                </>
              ) : (
                '▶ Iniciar Scrape'
              )}
            </button>
            {(url || selector) && (
              <button type="button" className="btn-secondary" onClick={handleClear} disabled={isLoading}>
                ✕ Limpar
              </button>
            )}
          </div>
        </form>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {data && (
          <div className="results">
            <div className="results-header">
              <h2>Resultados ({data.count})</h2>
              <div className="button-group">
                <button onClick={() => handleExport('csv')} className="btn-secondary">
                  📥 Exportar CSV
                </button>
                <button onClick={() => handleExport('json')} className="btn-secondary">
                  📥 Exportar JSON
                </button>
              </div>
            </div>

            {data.items.length > 0 ? (
              <>
                <div className="results-meta">
                  Total: {data.count} items | Coletado em: {new Date(data.timestamp).toLocaleString('pt-BR')}
                </div>
                <ul className="results-list">
                  {data.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="empty-state">
                Nenhum item encontrado com o seletor "{selector}"
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
