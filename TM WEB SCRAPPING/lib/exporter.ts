export interface ExportOptions {
  filename?: string;
  timestamp?: boolean;
}

export function exportToCSV(items: string[], options: ExportOptions = {}): Blob {
  const { filename = 'data', timestamp = true } = options;

  // Adiciona timestamp ao nome do arquivo se solicitado
  const filenameWithTime = timestamp
    ? `${filename}_${new Date().toISOString().slice(0, 10)}`
    : filename;

  // Escapa valores CSV (envolve entre aspas e escapa aspas internas)
  const csvContent = items
    .map(item => `"${item.replace(/"/g, '""')}"`)
    .join('\n');

  // Adiciona BOM para melhor suporte em Excel
  const bom = '﻿';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

  return blob;
}

export function exportToJSON(
  items: string[],
  metadata: { selector: string; url: string; timestamp: string },
  options: ExportOptions = {}
): Blob {
  const { timestamp = true } = options;

  const data = {
    metadata: {
      source_url: metadata.url,
      selector: metadata.selector,
      scraped_at: metadata.timestamp,
      total_items: items.length,
    },
    items,
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });

  return blob;
}

export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') {
    throw new Error('downloadBlob só pode ser chamado no client');
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getDownloadFilename(format: 'csv' | 'json', baseFilename?: string): string {
  const base = baseFilename || 'scraped_data';
  const date = new Date().toISOString().slice(0, 10);
  const ext = format === 'csv' ? '.csv' : '.json';

  return `${base}_${date}${ext}`;
}
