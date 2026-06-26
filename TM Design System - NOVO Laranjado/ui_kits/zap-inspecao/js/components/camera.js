/**
 * TM·Zap Inspeção — Camera Module
 * Web API câmera nativa (funciona no celular como app nativo)
 */

let _stream = null;
let _onPhoto = null;

/* ── Overlay DOM ──────────────────────────────────── */
function buildOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'camera-overlay';
  overlay.id = 'camera-overlay';

  const video = document.createElement('video');
  video.className = 'camera-video';
  video.autoplay = true;
  video.playsInline = true;  // CRÍTICO no iOS — sem isso não funciona
  video.muted = true;

  const controls = document.createElement('div');
  controls.className = 'camera-controls';

  const btnCancel = document.createElement('button');
  btnCancel.className = 'camera-cancel';
  btnCancel.textContent = 'Cancelar';

  const shutter = document.createElement('button');
  shutter.className = 'camera-shutter';
  shutter.setAttribute('aria-label', 'Tirar foto');
  shutter.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10"/></svg>`;

  const btnFlip = document.createElement('button');
  btnFlip.className = 'camera-cancel';
  btnFlip.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>`;

  controls.append(btnCancel, shutter, btnFlip);
  overlay.append(video, controls);

  return { overlay, video, shutter, btnCancel, btnFlip };
}

/* ── Abrir câmera ─────────────────────────────────── */
export async function openCamera(callback) {
  _onPhoto = callback;

  // Se não suporta getUserMedia → fallback input file
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    _fallbackFileInput(callback);
    return;
  }

  const { overlay, video, shutter, btnCancel, btnFlip } = buildOverlay();
  document.body.appendChild(overlay);

  let facingMode = 'environment'; // câmera traseira por padrão

  async function startStream(mode) {
    if (_stream) _stream.getTracks().forEach(t => t.stop());
    try {
      _stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      video.srcObject = _stream;
    } catch (err) {
      console.warn('[Camera] Erro ao acessar câmera:', err);
      overlay.remove();
      _fallbackFileInput(callback);
    }
  }

  await startStream(facingMode);

  // Flip câmera
  btnFlip.addEventListener('click', async () => {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    await startStream(facingMode);
  });

  // Cancelar
  btnCancel.addEventListener('click', () => {
    _stopStream();
    overlay.remove();
  });

  // Tirar foto
  shutter.addEventListener('click', () => {
    const blob = _captureFrame(video);
    _stopStream();
    overlay.remove();
    if (blob && _onPhoto) _onPhoto(blob);
  });

  // Fechar ao pressionar ESC
  const onKey = (e) => { if (e.key === 'Escape') { btnCancel.click(); document.removeEventListener('keydown', onKey); }};
  document.addEventListener('keydown', onKey);
}

/* ── Capturar frame do vídeo ──────────────────────── */
function _captureFrame(video) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth  || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Retorna como Blob JPEG qualidade 0.92
    return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92));
  } catch (e) {
    console.error('[Camera] Erro ao capturar frame:', e);
    return null;
  }
}

/* ── Para o stream ────────────────────────────────── */
function _stopStream() {
  if (_stream) {
    _stream.getTracks().forEach(t => t.stop());
    _stream = null;
  }
}

/* ── Fallback: input file (iOS Safari / desktop) ──── */
function _fallbackFileInput(callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  input.style.display = 'none';
  document.body.appendChild(input);

  input.addEventListener('change', () => {
    const file = input.files[0];
    input.remove();
    if (file && callback) callback(Promise.resolve(file));
  });

  input.click();
}

/* ── Blob → Data URL ──────────────────────────────── */
export function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/* ── Blob → URL temporária ────────────────────────── */
export function blobToObjectURL(blob) {
  return URL.createObjectURL(blob);
}

/* ── Upload foto para o backend ───────────────────── */
export async function uploadFoto(blobOrFile, inspecaoId, apiUrl = 'http://localhost:5000') {
  const formData = new FormData();
  const file = blobOrFile instanceof Blob ? blobOrFile : await blobOrFile;
  formData.append('foto', file, `foto_${Date.now()}.jpg`);
  formData.append('inspecao_id', inspecaoId);

  try {
    const res = await fetch(`${apiUrl}/api/inspecao/${inspecaoId}/foto`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json(); // { foto_id, url, classificacao, anomalia }
  } catch (err) {
    console.error('[Camera] Erro ao enviar foto:', err);
    return null;
  }
}
