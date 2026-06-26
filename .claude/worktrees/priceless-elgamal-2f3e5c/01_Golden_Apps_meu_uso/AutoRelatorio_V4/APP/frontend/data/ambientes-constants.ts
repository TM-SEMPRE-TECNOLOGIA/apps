// Hierarquia de ambientes — base do TM Pastas
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

export const LEVEL_LABELS = ['ÁREA', 'AMBIENTE', 'SERVIÇO', 'SUBPASTA'] as const;
export const LEVEL_COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6'] as const;

export const ALL_SUGGESTIONS = [
  AREAS_SUGERIDAS,
  AMBIENTES_SUGERIDOS,
  SERVICOS_SUGERIDOS,
  SUBPASTAS_SUGERIDAS,
] as const;

export type CustomAmbienteItems = [string[], string[], string[], string[]];
