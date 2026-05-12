import * as XLSX from 'xlsx';
import { Demand, ImportLog } from './types';
import { STAGES } from './constants';
import { uid } from './utils';

// =====================
// TYPES
// =====================

export interface ColumnMapping {
    estado: string;
    contrato: string;
    chamado: string;
    prefixo: string;
    agencia: string;
    status: string;
    fotos: string;
    vencPortal: string;
    obs: string;
}

export interface ImportPreviewRow {
    originalIndex: number;
    data: any; // The raw object from sheet_to_json
    demand: Partial<Demand>;
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export interface ImportResult {
    success: boolean;
    imported: number;
    total: number;
    created: number;
    updated: number;
    errors: string[];
    warnings: string[];
    demands: Demand[];
}

// =====================
// HELPERS
// =====================

function normalizeStatus(raw: string): string {
    const statusMap: Record<string, string> = {
        'sem levantamento': 'Sem Levantamento',
        'levantado': 'Levantado',
        'em relatório': 'Em Relatório',
        'em relatorio': 'Em Relatório',
        'correção': 'Correção',
        'correcao': 'Correção',
        'orçamento': 'Orçamento',
        'orcamento': 'Orçamento',
        'concluído': 'Concluído',
        'concluido': 'Concluído',
        'finalizado': 'Concluído',
        'fechado': 'Concluído',
        'com dificuldade': 'Com Dificuldade',
    };

    const normalized = String(raw || '').trim().toLowerCase();

    // Check exact match
    if (statusMap[normalized]) return statusMap[normalized];

    // Check partial match
    for (const [key, value] of Object.entries(statusMap)) {
        if (normalized.includes(key)) return value;
    }

    return 'Sem Levantamento';
}

function parsePhotos(raw: any): number | null {
    if (raw == null || raw === '') return null;
    if (typeof raw === 'number') return Math.floor(raw);
    const cleaned = String(raw).replace(/[^\d]/g, '');
    if (!cleaned) return null;
    return parseInt(cleaned, 10);
}

function parseDate(raw: any): string {
    if (!raw) return '';

    // Excel serial date number
    if (typeof raw === 'number') {
        try {
            const date = XLSX.SSF.parse_date_code(raw);
            if (date) {
                const y = date.y;
                const m = String(date.m).padStart(2, '0');
                const d = String(date.d).padStart(2, '0');
                return `${y}-${m}-${d}`;
            }
        } catch (e) { return ''; }
    }

    // String in various formats
    const str = String(raw).trim();

    // DD/MM/YYYY
    const brMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (brMatch) {
        const [, d, m, y] = brMatch;
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    // YYYY-MM-DD (with optional time)
    const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        const [, y, m, d] = isoMatch;
        return `${y}-${m}-${d}`;
    }

    return '';
}

// =====================
// EXPORTED LOGIC
// =====================

export async function readExcelFile(file: File): Promise<{ headers: string[], data: any[] }> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Use header:1 to get raw array of arrays to find the header row
    const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (rawRows.length < 1) throw new Error('O arquivo está vazio ou sem cabeçalho.');

    // Smart header detection
    let headerRowIndex = 0;
    const keywords = ['contrato', 'chamado', 'agência', 'agencia', 'estado', 'status', 'fotos', 'local', 'os', 'prefixo'];

    for (let i = 0; i < Math.min(10, rawRows.length); i++) {
        const row = rawRows[i];
        if (!Array.isArray(row)) continue;
        const matchCount = row.map(c => String(c).toLowerCase()).filter(c => keywords.some(k => c.includes(k))).length;
        if (matchCount >= 2) {
            headerRowIndex = i;
            break;
        }
    }

    const headers = Array.from(rawRows[headerRowIndex] || []).map(h => String(h || '').trim());

    // Now get data as object array using the detected header
    // We can't rely on range option easily with dynamic header index in one pass without re-reading or slicing manually
    // So we slice the raw rows and map them to objects
    const dataRows = rawRows.slice(headerRowIndex + 1).map(row => {
        const obj: any = {};
        headers.forEach((h, i) => {
            if (h) obj[h] = row[i]; // Use index access which works on sparse arrays safely enough
        });
        return obj;
    });

    return { headers, data: dataRows };
}

export function autoMapColumns(headers: string[]): ColumnMapping {
    const map: ColumnMapping = {
        estado: '', contrato: '', chamado: '', prefixo: '',
        agencia: '', status: '', fotos: '', vencPortal: '', obs: ''
    };

    // Helper to find best match
    const find = (keywords: string[]) => {
        return headers.find(h => {
            if (!h) return false;
            return keywords.some(k => h.toLowerCase().includes(k));
        }) || '';
    };

    map.estado = find(['estado', 'uf']);
    map.contrato = find(['contrato', 'contract']);
    map.chamado = find(['chamado', 'os', 'ordem', 'ticket']);
    map.prefixo = find(['prefixo', 'prefix']);
    map.agencia = find(['agência', 'agencia', 'local', 'unidade', 'loja']);
    map.status = find(['status', 'situação', 'situacao', 'fase']);
    map.fotos = find(['foto', 'img', 'imagem']);
    map.vencPortal = find(['venc', 'prazo', 'data', 'limite']);
    map.obs = find(['obs', 'detalhe', 'desc']);

    return map;
}

export function processRows(data: any[], mapping: ColumnMapping, defaultDate: string): ImportPreviewRow[] {
    const emptyStages: Record<string, boolean> = {};
    STAGES.forEach(s => emptyStages[s.key] = false);

    return data.map((row, index) => {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Skip totals or empty rows
        const values = Object.values(row).join('').toLowerCase();
        if (!values || values.includes('total')) {
            return null;
        }

        // Extract using mapping (which are keys in the row object)
        const getVal = (key: string) => row[key];

        const chamado = String(getVal(mapping.chamado) || '').trim();
        const contrato = String(getVal(mapping.contrato) || '').trim();
        const agencia = String(getVal(mapping.agencia) || '').trim();

        // Validation
        if (!chamado && !contrato && !agencia) {
            return null; // Skip completely empty of identifiers
        }
        if (!agencia) warnings.push('Agência não identificada');
        if (!contrato && !chamado) warnings.push('Sem Contrato ou Chamado');

        const statusRaw = String(getVal(mapping.status) || '');
        const status = normalizeStatus(statusRaw);

        const fotosRaw = getVal(mapping.fotos);
        const fotos = parsePhotos(fotosRaw);

        const vencRaw = getVal(mapping.vencPortal);
        const vencPortal = parseDate(vencRaw) || defaultDate;

        const demand: Partial<Demand> = {
            id: uid(),
            estado: String(getVal(mapping.estado) || '').trim(),
            contrato,
            chamado,
            prefixo: String(getVal(mapping.prefixo) || '').trim(),
            agencia,
            status,
            fotos,
            obs: String(getVal(mapping.obs) || '').trim(),
            vencPortal,
            envioCorrecao: '',
            envioOrcamento: '',
            stages: { ...emptyStages },
            history: [{ at: Date.now(), text: 'Importado via Planilha' }]
        };

        return {
            originalIndex: index,
            data: row,
            demand,
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }).filter(Boolean) as ImportPreviewRow[];
}

export function validateFileExtension(filename: string): boolean {
    const ext = filename.toLowerCase();
    return ext.endsWith('.xlsx') || ext.endsWith('.xls') || ext.endsWith('.csv');
}
