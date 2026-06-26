export type OSStatus =
    | 'Fornecedor Acionado'
    | 'Em Levantamento'
    | 'Em Elaboração'
    | 'Em Orçamento'
    | 'Correção'
    | 'Concluída'
    | 'Com Dificuldade';

export interface HistoryEntry {
    id: string;
    data: string; // ISO date string
    descricao: string;
    autor: string;
}

export interface Dificuldade {
    id: string;
    data: string;
    descricao: string;
    resolvida: boolean;
}

export interface OrdemServico {
    id: string;
    os: string;               // Chamado / número da OS
    prefixo: string;
    agencia: string;
    contrato: string;
    estado: string;            // UF
    situacao: OSStatus;
    elaborador: string | null;
    tecnico: string | null;
    fotos: number | null;
    vencimento: string;        // prazo final
    observacoes: string;
    stages: Record<string, boolean>; // Ex: org_foto, form_doc
    dificuldades: Dificuldade[];
    history: HistoryEntry[];
    criadoEm: string;
    atualizadoEm: string;
}

export interface User {
    id: string;
    nome: string;
    avatar?: string;
}

export interface Tecnico {
    id: string;
    nome: string;
    estado_atuacao: string;
}
