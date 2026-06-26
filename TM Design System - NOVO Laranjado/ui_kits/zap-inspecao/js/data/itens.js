/**
 * TM·Zap Inspeção — Catálogo de Itens MAFFENG
 * Portado de itens-maffeng.ts (AutoRelatório V4)
 * Usados pelo bot para sugerir classificações automáticas
 */

export const ITENS = [
  // Pintura
  { id: '01.01', desc: 'Pintura acrílica (paredes internas)', un: 'm²', categoria: 'pintura' },
  { id: '01.02', desc: 'Pintura automotiva (fachada externa)', un: 'm²', categoria: 'pintura' },
  { id: '01.03', desc: 'Pintura esmalte em porta (madeira)', un: 'm²', categoria: 'pintura' },
  { id: '01.04', desc: 'Pintura esmalte em porta (metálica)', un: 'm²', categoria: 'pintura' },
  { id: '01.05', desc: 'Pintura esmalte em gradil/muretas', un: 'm²', categoria: 'pintura' },
  // Vedação e impermeabilização
  { id: '02.01', desc: 'Impermeabilização de cobertura/laje', un: 'm²', categoria: 'vedacao' },
  { id: '02.02', desc: 'Selagem de trincas e fissuras', un: 'm', categoria: 'vedacao' },
  { id: '02.03', desc: 'Recuperação de rufo metálico', un: 'm', categoria: 'vedacao' },
  { id: '02.04', desc: 'Recuperação de calha', un: 'm', categoria: 'vedacao' },
  { id: '02.05', desc: 'Tratamento de infiltração', un: 'm²', categoria: 'vedacao' },
  // Vidros e películas
  { id: '03.01', desc: 'Película de controle solar (vidros)', un: 'm²', categoria: 'vidros' },
  { id: '03.02', desc: 'Policarbonato (coberturas e marquises)', un: 'm²', categoria: 'vidros' },
  { id: '03.03', desc: 'Substituição de vidro', un: 'm²', categoria: 'vidros' },
  // Piso e acessibilidade
  { id: '04.01', desc: 'Piso tátil (alerta/direcional)', un: 'un', categoria: 'piso' },
  { id: '04.02', desc: 'Reposição de piso cerâmico', un: 'm²', categoria: 'piso' },
  { id: '04.03', desc: 'Reposição de piso granito/mármore', un: 'm²', categoria: 'piso' },
  // Elétrica
  { id: '05.01', desc: 'Substituição de lâmpada LED (tubular)', un: 'un', categoria: 'eletrica' },
  { id: '05.02', desc: 'Substituição de lâmpada LED (downlight)', un: 'un', categoria: 'eletrica' },
  { id: '05.03', desc: 'Substituição de luminária completa', un: 'un', categoria: 'eletrica' },
  { id: '05.04', desc: 'Substituição de tomada/interruptor', un: 'un', categoria: 'eletrica' },
  // Hidráulica
  { id: '06.01', desc: 'Substituição de torneira', un: 'un', categoria: 'hidraulica' },
  { id: '06.02', desc: 'Substituição de vaso sanitário', un: 'un', categoria: 'hidraulica' },
  { id: '06.03', desc: 'Reparo em ramal de água', un: 'un', categoria: 'hidraulica' },
  // Esquadrias e serralheria
  { id: '07.01', desc: 'Regulagem/manutenção de porta de alumínio', un: 'un', categoria: 'esquadria' },
  { id: '07.02', desc: 'Regulagem/manutenção de janela de alumínio', un: 'un', categoria: 'esquadria' },
  { id: '07.03', desc: 'Substituição de fechadura', un: 'un', categoria: 'esquadria' },
  { id: '07.04', desc: 'Recuperação de estrutura metálica', un: 'm²', categoria: 'esquadria' },
  // Limpeza e conservação
  { id: '08.01', desc: 'Limpeza de fachada (lavagem pressão)', un: 'm²', categoria: 'limpeza' },
  { id: '08.02', desc: 'Limpeza de calha e rufos', un: 'm', categoria: 'limpeza' },
  { id: '08.03', desc: 'Dedetização/desinsetização', un: 'm²', categoria: 'limpeza' },
];

/* ── Keywords para classificação automática ───────── */
export const KEYWORDS_ANOMALIA = {
  ALTO: [
    'infiltração', 'infiltracao', 'goteira', 'vazamento', 'rachadur', 'fissur',
    'desplacamento', 'colapso', 'estrutural', 'ativo', 'urgente',
  ],
  MÉDIO: [
    'trinca', 'retração', 'retracao', 'mancha', 'mofo', 'bolor', 'eflorescência',
    'eflorescencia', 'corrosão', 'corrosao', 'oxidação', 'oxidacao', 'desgaste',
  ],
  BAIXO: [
    'arranhão', 'arranhao', 'sujeira', 'riscos', 'pintura', 'desbotamento',
    'pequeno', 'leve', 'superficial', 'estético', 'estetico',
  ],
};

/* ── Classificar anomalia por caption/contexto ────── */
export function classificarAnomalia(texto) {
  const t = (texto || '').toLowerCase();
  for (const [nivel, words] of Object.entries(KEYWORDS_ANOMALIA)) {
    if (words.some(w => t.includes(w))) return nivel;
  }
  return null;
}

/* ── Sugerir item por nome/contexto ──────────────── */
export function sugerirItem(texto) {
  const t = (texto || '').toLowerCase();
  const ranked = ITENS.map(item => {
    const score = item.desc.toLowerCase().split(' ').filter(w => w.length > 3 && t.includes(w)).length;
    return { item, score };
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
  return ranked.length ? ranked[0].item : null;
}
