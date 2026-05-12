
import { DemandStage } from './types';

export const STAGES: DemandStage[] = [
  { key: 'org_foto', title: 'Organização Fotográfica', desc: 'Separar e selecionar as fotos brutas que serão usadas' },
  { key: 'format_doc', title: 'Formatação Documental', desc: 'Preparar o arquivo com layout padrão' },
  { key: 'ident_elem', title: 'Identificação de Elementos', desc: 'Marcar pontos relevantes nas imagens' },
  { key: 'anot_dim', title: 'Anotação Dimensional', desc: 'Inserir balões/indicadores de medidas' },
  { key: 'desc_tec', title: 'Descrição Técnica', desc: 'Texto claro para cada elemento destacado' },
  { key: 'mem_calc', title: 'Memorial de Cálculo', desc: 'Cálculos de quantitativos e medições' },
  { key: 'mem_itens', title: 'Memorial de Itens', desc: 'Lista consolidada com referência contratual/normas' }
];

export const STATUS_OPTIONS = [
  'Sem Levantamento',
  'Levantado',
  'Em Relatório',
  'Correção',
  'Orçamento',
  'Concluído',
  'Com Dificuldade'
];

export const DEFAULT_PRICING = [
  { min: 0, max: 170, value: 50 },
  { min: 171, max: 240, value: 80 },
  { min: 241, max: 300, value: 100 },
  { min: 301, max: 360, value: 150 },
  { min: 361, max: 450, value: 200 },
  { min: 451, max: 550, value: 240 },
  { min: 551, max: 650, value: 288 },
  { min: 651, max: 750, value: 345 },
  { min: 751, max: 850, value: 414 },
  { min: 851, max: 950, value: 497 },
  { min: 951, max: 1000, value: 596 },
];
