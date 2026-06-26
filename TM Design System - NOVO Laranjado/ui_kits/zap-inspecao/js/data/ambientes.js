/**
 * TM·Zap Inspeção — Contratos e Ambientes
 * Portado de ambientes-constants.ts (AutoRelatório V4)
 */

export const CONTRATOS = [
  {
    codigo: '2056',
    sigla: 'DPS',
    nome: 'Divinópolis',
    estado: 'MG',
    endereco: 'Rua Bias Fortes, 244 — Centro, Divinópolis/MG',
    checklist: ['Fachada externa', 'Área de autoatendimento', 'Sanitários', 'Copa/cozinha', 'Sala cofre', 'Casa de máquinas', 'Cobertura/rufo', 'Calçada/acessibilidade'],
  },
  {
    codigo: '2057',
    sigla: 'VRN',
    nome: 'Varginha',
    estado: 'MG',
    endereco: 'Av. Rui Barbosa, 799 — Centro, Varginha/MG',
    checklist: ['Fachada externa', 'Área de autoatendimento', 'Sanitários', 'Copa/cozinha', 'Sala cofre', 'Casa de máquinas', 'Cobertura/rufo'],
  },
  {
    codigo: '0908',
    sigla: 'SP',
    nome: 'São Paulo',
    estado: 'SP',
    endereco: 'Av. Paulista, 1578 — Bela Vista, São Paulo/SP',
    checklist: ['Fachada externa', 'Área de autoatendimento (SAA)', 'Sanitários', 'Copa/cozinha', 'Sala cofre', 'Casa de máquinas', 'Piso tátil', 'Película e policarbonato', 'Cobertura/rufo', 'Calçada/acessibilidade'],
  },
  {
    codigo: '1507',
    sigla: 'CBA',
    nome: 'Cuiabá',
    estado: 'MT',
    endereco: 'Av. Isaac Póvoas, 1000 — Centro Sul, Cuiabá/MT',
    checklist: ['Fachada externa', 'Área de autoatendimento', 'Sanitários', 'Copa/cozinha', 'Sala cofre', 'Casa de máquinas', 'Cobertura/rufo'],
  },
  {
    codigo: '6122',
    sigla: 'MGS',
    nome: 'Mato Grosso do Sul',
    estado: 'MS',
    endereco: 'Rua 13 de Maio, 2685 — Centro, Campo Grande/MS',
    checklist: ['Fachada externa', 'Área de autoatendimento', 'Sanitários', 'Copa/cozinha', 'Sala cofre', 'Casa de máquinas', 'Cobertura/rufo'],
  },
  {
    codigo: '2626',
    sigla: 'SAL',
    nome: 'Salinas',
    estado: 'MG',
    endereco: 'Praça Coronel Adolfo Fulgêncio, 50 — Centro, Salinas/MG',
    checklist: ['Fachada externa', 'Área de autoatendimento', 'Sanitários', 'Copa/cozinha', 'Sala cofre', 'Cobertura/rufo'],
  },
  {
    codigo: '2627',
    sigla: 'VDR',
    nome: 'Governador Valadares',
    estado: 'MG',
    endereco: 'Rua Prefeito Alair Ferreira, 300 — Centro, Gov. Valadares/MG',
    checklist: ['Fachada externa', 'Área de autoatendimento', 'Sanitários', 'Copa/cozinha', 'Sala cofre', 'Cobertura/rufo'],
  },
  {
    codigo: '3575',
    sigla: 'TDS',
    nome: 'Tangará da Serra',
    estado: 'MT',
    endereco: 'Av. Brasil, 555 — Centro, Tangará da Serra/MT',
    checklist: ['Fachada externa', 'Área de autoatendimento', 'Sanitários', 'Copa/cozinha', 'Sala cofre', 'Cobertura/rufo'],
  },
  {
    codigo: '1565',
    sigla: 'SJRP',
    nome: 'São José do Rio Preto',
    estado: 'SP',
    endereco: 'Av. Alberto Andaló, 2872 — Centro, São José do Rio Preto/SP',
    checklist: ['Fachada externa (Bloco A)', 'Fachada externa (Bloco B)', 'SAA', 'Sanitários', 'Copa', 'Sala cofre', 'Casa de máquinas', 'Cobertura', 'Croquis estruturais'],
  },
];

export function getContrato(codigo) {
  return CONTRATOS.find(c => c.codigo === codigo) || null;
}

export function getChecklistContrato(codigo) {
  const c = getContrato(codigo);
  return c ? c.checklist.map((item, i) => ({ id: i + 1, descricao: item, concluido: false })) : [];
}
