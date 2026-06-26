/**
 * TM·Zap Inspeção — Persistência de Sessão
 * Mensagens de texto → localStorage (JSON, leve)
 * Fotos (blobs)      → IndexedDB (pesado, binário)
 */

const DB_NAME   = 'tmzap';
const DB_VER    = 1;
const STORE_FOTOS = 'fotos';

/* ── IndexedDB: abrir ─────────────────────────────── */
let _db = null;

function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_FOTOS)) {
        db.createObjectStore(STORE_FOTOS); // key = fotoId
      }
    };
    req.onsuccess = e => { _db = e.target.result; resolve(_db); };
    req.onerror   = () => reject(req.error);
  });
}

/* ── Salvar blob de foto ──────────────────────────── */
export async function salvarFotoBlob(fotoId, blob) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_FOTOS, 'readwrite');
    tx.objectStore(STORE_FOTOS).put(blob, fotoId);
    tx.oncomplete = resolve;
    tx.onerror    = () => reject(tx.error);
  });
}

/* ── Ler blob de foto ─────────────────────────────── */
export async function lerFotoBlob(fotoId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_FOTOS, 'readonly');
    const req = tx.objectStore(STORE_FOTOS).get(fotoId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror   = () => reject(req.error);
  });
}

/* ── Deletar blob de foto ─────────────────────────── */
export async function deletarFotoBlob(fotoId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_FOTOS, 'readwrite');
    tx.objectStore(STORE_FOTOS).delete(fotoId);
    tx.oncomplete = resolve;
    tx.onerror    = () => reject(tx.error);
  });
}

/* ── Listar todos os fotoIds ──────────────────────── */
export async function listarFotoIds() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_FOTOS, 'readonly');
    const req = tx.objectStore(STORE_FOTOS).getAllKeys();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

/* ── localStorage: OSs e mensagens ───────────────── */

const LS_OSS       = 'tmzap_oss';        // lista de OSs
const LS_MSGS      = (osId) => `tmzap_msgs_${osId}`;

/* ── Salvar lista de OSs ─────────────────────────── */
export function salvarOSs(oss) {
  try {
    // Não salva objectURLs (temporários), só metadados
    localStorage.setItem(LS_OSS, JSON.stringify(oss));
  } catch (e) { console.warn('[Sessao] localStorage quota:', e); }
}

/* ── Carregar lista de OSs ───────────────────────── */
export function carregarOSs() {
  try {
    return JSON.parse(localStorage.getItem(LS_OSS) || '[]');
  } catch { return []; }
}

/* ── Salvar mensagens de uma OS ──────────────────── */
export function salvarMensagens(osId, mensagens) {
  try {
    // Remove objectURLs antes de salvar (não persistem entre sessões)
    const clean = mensagens.map(m => {
      if (m.tipo === 'foto') return { ...m, objectUrl: null };
      return m;
    });
    localStorage.setItem(LS_MSGS(osId), JSON.stringify(clean));
  } catch (e) { console.warn('[Sessao] localStorage quota:', e); }
}

/* ── Carregar mensagens de uma OS ────────────────── */
export function carregarMensagens(osId) {
  try {
    return JSON.parse(localStorage.getItem(LS_MSGS(osId)) || '[]');
  } catch { return []; }
}

/* ── Deletar mensagens de uma OS ─────────────────── */
export function deletarMensagens(osId) {
  localStorage.removeItem(LS_MSGS(osId));
}

/* ── Restaurar objectURLs das fotos ──────────────── */
export async function restaurarFotos(mensagens) {
  const result = [...mensagens];
  for (let i = 0; i < result.length; i++) {
    const m = result[i];
    if (m.tipo === 'foto' && m.fotoId && !m.objectUrl) {
      try {
        const blob = await lerFotoBlob(m.fotoId);
        if (blob) result[i] = { ...m, objectUrl: URL.createObjectURL(blob) };
      } catch { /* blob não encontrado, foto perdida */ }
    }
  }
  return result;
}