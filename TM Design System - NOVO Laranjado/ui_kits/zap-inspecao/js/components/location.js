/**
 * TM·Zap Inspeção — Location Module
 * Geolocation API → endereço via Nominatim (OpenStreetMap, gratuito)
 */

/* ── Pegar localização ────────────────────────────── */
export function getLocation(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada neste dispositivo.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      err => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
        ...options,
      }
    );
  });
}

/* ── Coords → endereço (Nominatim) ───────────────── */
export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=pt-BR`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' }});
    if (!res.ok) throw new Error('Nominatim error');
    const data = await res.json();

    const addr = data.address || {};
    const parts = [
      addr.road && addr.house_number ? `${addr.road}, ${addr.house_number}` : addr.road,
      addr.suburb || addr.neighbourhood || addr.quarter,
      addr.city || addr.town || addr.municipality,
      addr.state,
    ].filter(Boolean);

    return parts.join(' — ') || data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  } catch (e) {
    console.warn('[Location] Geocode falhou:', e);
    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }
}

/* ── API principal: pegar + geocodificar ──────────── */
export async function getCurrentAddress() {
  try {
    const coords = await getLocation();
    const address = await reverseGeocode(coords.latitude, coords.longitude);
    return {
      lat: coords.latitude,
      lon: coords.longitude,
      address,
      accuracy: coords.accuracy,
    };
  } catch (err) {
    const msg = err.code === 1 ? 'Permissão de localização negada.'
               : err.code === 2 ? 'Posição indisponível.'
               : err.code === 3 ? 'Tempo esgotado.'
               : err.message || 'Erro de localização.';
    throw new Error(msg);
  }
}

/* ── Formata coordenadas para exibição ───────────── */
export function formatCoords(lat, lon) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'L' : 'O';
  return `${Math.abs(lat).toFixed(5)}° ${latDir}, ${Math.abs(lon).toFixed(5)}° ${lonDir}`;
}
