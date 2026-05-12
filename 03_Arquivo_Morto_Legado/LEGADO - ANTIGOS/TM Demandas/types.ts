
export interface PricingRule {
  min: number;
  max: number;
  value: number;
}

export interface DemandStage {
  key: string;
  title: string;
  desc: string;
}

export interface HistoryEntry {
  at: number;
  text: string;
}

export interface Demand {
  id: string;
  estado: string;
  contrato: string;
  chamado: string;
  prefixo: string;
  agencia: string;
  status: string;
  fotos: number | null;
  obs: string;
  vencPortal: string;
  envioCorrecao: string;
  envioOrcamento: string;
  stages: Record<string, boolean>;
  history: HistoryEntry[];
  enviadoPortal?: boolean;
}

export interface ImportLog {
  id: string;
  at: number;
  fileName: string;
  total: number;
  imported: number;
  created: number;
  updated: number;
  warnings: string[];
}

export type View = 'dashboard' | 'demandas' | 'importar' | 'config' | 'ajuda' | 'detalhes';
