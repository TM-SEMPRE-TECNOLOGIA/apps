import { OSStatus } from './types';

export const STATUS_LIST: OSStatus[] = [
    'Fornecedor Acionado',
    'Em Levantamento',
    'Em Elaboração',
    'Em Orçamento',
    'Correção',
    'Concluída',
    'Com Dificuldade'
];

export const STATUS_COLORS: Record<OSStatus, string> = {
    'Fornecedor Acionado': '#00d4ff', // Cyan
    'Em Levantamento': '#ffab00',    // Amber
    'Em Elaboração': '#7b2cbf',      // Purple
    'Em Orçamento': '#f1c40f',       // Yellow
    'Correção': '#f85149',           // Red
    'Concluída': '#3fb950',          // Green
    'Com Dificuldade': '#8b0000'     // Dark Red
};

// Similar to TM Demandas stages
export const DEFAULT_STAGES = [
    { id: 'importada', label: 'OS Importada' },
    { id: 'org_foto', label: 'Organização Fotográfica' },
    { id: 'form_doc', label: 'Formatação Documental' },
    { id: 'analise_tec', label: 'Análise Técnica' },
    { id: 'orcamento', label: 'Cálculo de Orçamento' },
    { id: 'revisao', label: 'Revisão Final' }
];

export const CONTRATOS = [
    'BB MANUTENÇÃO',
    'BB ADEQUAÇÃO',
    'CAIXA GERAL',
    'SANTANDER OBRAS'
];

export const ESTADOS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];
