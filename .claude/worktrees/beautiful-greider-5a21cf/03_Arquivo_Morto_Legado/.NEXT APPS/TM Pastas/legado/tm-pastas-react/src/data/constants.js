/**
 * Gerador de Estrutura de Pastas para Levantamentos Fotográficos
 * Constantes e dados pré-definidos
 * 
 * TM - Sempre Tecnologia
 * Desenvolvido por: Thiago Nascimento Barbosa
 */

export const APP_VERSION = '2.0.0';

// ============================
// DADOS PRÉ-DEFINIDOS
// ============================

export const AREAS_SUGERIDAS = [
  'Área externa',
  'Área interna',
  'Segundo piso',
  'Primeiro piso',
  'Cobertura',
];

export const AMBIENTES_SUGERIDOS = [
  'SAA (sala de autoatendimento)',
  'Atendimento',
  'Corredor de acesso',
  'Banheiro feminino',
  'Banheiro masculino',
  'Banheiro PNE',
  'Copa',
  'Cozinha',
  'Suporte',
  'CAIEX',
  'Tesouraria',
  'Sala de reunião',
  'Sala do gerente',
  'Depósito',
  'Arquivo',
  'Corredor de abastecimento',
  'Escadas',
  'Área restrita',
];

export const SERVICOS_SUGERIDOS = [
  'Pintura acrílica',
  'Pintura automotiva',
  'Pintura esmalte em porta',
  'Pintura esmalte metal',
  'Piso tátil inox',
  'Piso tátil',
  'Substituição de lâmpadas',
  'Substituição de ducha higiênica',
  'Substituição de torneira',
  'Substituição de fechadura',
  'Substituição de puxador',
  'Substituição de película e policarbonato',
  'Telhado',
  'Impermeabilização de calha',
  'SPDA',
  'Forro de fibra mineral',
  'Forro de gesso',
  'Manutenção em ponto elétrico',
  'Manutenção em ponto lógico',
  'Ar condicionado',
  'Pictograma',
  'Letreiro',
  'Limpeza de fachada',
];

export const SUBPASTAS_SUGERIDAS = [
  'Vista ampla',
  'Detalhes',
  'Antes',
  'Depois',
  'Descrição',
];

// Cores por nível para o preview interativo
export const CORES_NIVEL = {
  1: '#3b82f6', // Azul - Área
  2: '#10b981', // Verde - Ambiente/Serviço
  3: '#f97316', // Laranja - Subpasta/Serviço filho
  4: '#8b5cf6', // Roxo - Detalhe
};

export const ICONES_NIVEL = {
  1: '🌎',
  2: '📍',
  3: '📂',
  4: '🔍',
};
