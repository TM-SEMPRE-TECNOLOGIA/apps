/**
 * TM·Zap Inspeção — Report Module
 * Dispara geração de relatório no backend FastAPI (word_utils.py)
 */

const API_URL = () => window._TM_API_URL || 'http://localhost:5000';

/* ── Iniciar inspeção no backend ──────────────────── */
export async function iniciarInspecao({ contratoCodigo, tecnicoNome, localidade }) {
  try {
    const res = await fetch(`${API_URL()}/api/inspecao/iniciar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contrato_codigo: contratoCodigo, tecnico_nome: tecnicoNome, localidade }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json(); // { inspecao_id, checklist, contrato }
  } catch (e) {
    console.warn('[Report] Backend offline, modo offline ativado:', e.message);
    return null; // app continua offline
  }
}

/* ── Registrar foto no backend ────────────────────── */
export async function registrarFoto({ inspecaoId, fotoBlob, caption, ambiente }) {
  const form = new FormData();
  form.append('foto', fotoBlob, `foto_${Date.now()}.jpg`);
  form.append('caption', caption || '');
  form.append('ambiente', ambiente || '');

  try {
    const res = await fetch(`${API_URL()}/api/inspecao/${inspecaoId}/foto`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json(); // { foto_id, url, classificacao, anomalia }
  } catch (e) {
    console.warn('[Report] Foto não enviada (offline):', e.message);
    return null;
  }
}

/* ── Finalizar e gerar .docx ──────────────────────── */
export async function finalizarInspecao(inspecaoId, metaFields = {}) {
  try {
    const res = await fetch(`${API_URL()}/api/inspecao/${inspecaoId}/finalizar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meta_fields: metaFields }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json(); // { docx_url, n_fotos, n_anomalias, n_paginas, file_name }
  } catch (e) {
    console.error('[Report] Erro ao gerar relatório:', e);
    throw e;
  }
}

/* ── Baixar arquivo .docx ─────────────────────────── */
export function baixarDocx(docxUrl, fileName) {
  const a = document.createElement('a');
  a.href = docxUrl.startsWith('http') ? docxUrl : `${API_URL()}${docxUrl}`;
  a.download = fileName || 'relatorio.docx';
  a.click();
}

/* ── Compartilhar via Web Share API ───────────────── */
export async function compartilharRelatorio(docxUrl, fileName, title) {
  if (!navigator.share) {
    // Fallback: copiar link
    try {
      await navigator.clipboard.writeText(`${API_URL()}${docxUrl}`);
      return 'clipboard';
    } catch { return null; }
  }

  try {
    // Tenta compartilhar o arquivo
    const fullUrl = docxUrl.startsWith('http') ? docxUrl : `${API_URL()}${docxUrl}`;
    const res = await fetch(fullUrl);
    const blob = await res.blob();
    const file = new File([blob], fileName, { type: blob.type });

    await navigator.share({
      title: title || 'Relatório de Inspeção — TM Construtora',
      files: [file],
    });
    return 'shared';
  } catch (e) {
    if (e.name !== 'AbortError') console.warn('[Report] Share falhou:', e);
    return null;
  }
}

/* ── Verificar se backend está disponível ─────────── */
export async function checkBackend() {
  try {
    const res = await fetch(`${API_URL()}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch { return false; }
}
