import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    UploadCloud,
    FileSpreadsheet,
    X,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Loader2,
    HelpCircle,
    ChevronDown,
    AlertTriangle,
    Info
} from 'lucide-react';
import { readExcelFile, autoMapColumns, processRows, validateFileExtension, ColumnMapping, ImportPreviewRow } from './importService';
import { Demand, ImportLog } from './types';
import { uid } from './utils';

interface ImportViewProps {
    onImportComplete: (demands: Demand[], log: ImportLog) => void;
    onCancel: () => void;
}

type Step = 'upload' | 'mapping' | 'preview' | 'success';

export function ImportView({ onImportComplete, onCancel }: ImportViewProps) {
    // State
    const [step, setStep] = useState<Step>('upload');
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Data State
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [headers, setHeaders] = useState<string[]>([]);
    const [rawData, setRawData] = useState<any[]>([]);
    const [mapping, setMapping] = useState<ColumnMapping>({
        estado: '', contrato: '', chamado: '', prefixo: '',
        agencia: '', status: '', fotos: '', vencPortal: '', obs: ''
    });
    const [previewData, setPreviewData] = useState<ImportPreviewRow[]>([]);
    const [importDate] = useState(() => new Date().toISOString().split('T')[0]);

    // Actions
    const handleFileSelect = async (selectedFile: File) => {
        if (!selectedFile) return;

        if (!validateFileExtension(selectedFile.name)) {
            alert('Arquivo inválido. Apenas .xlsx, .xls ou .csv são aceitos.');
            return;
        }

        setIsLoading(true);
        try {
            const { headers: detectedHeaders, data } = await readExcelFile(selectedFile);

            setFile(selectedFile);
            setFileName(selectedFile.name);
            setHeaders(detectedHeaders);
            setRawData(data);

            const suggestedMapping = autoMapColumns(detectedHeaders);
            setMapping(suggestedMapping);

            setStep('mapping');
        } catch (error) {
            console.error(error);
            alert('Erro ao ler arquivo. Verifique se é uma planilha válida.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileSelect(droppedFile);
    };

    const updateMapping = (field: keyof ColumnMapping, column: string) => {
        setMapping(prev => ({ ...prev, [field]: column }));
    };

    const handlePreview = () => {
        if (!mapping.chamado && !mapping.contrato && !mapping.agencia) {
            alert('Não identificamos as colunas obrigatórias (Chamado, Contrato ou Agência).');
            return;
        }

        setIsLoading(true);
        // Give UI a moment to update
        setTimeout(() => {
            const processed = processRows(rawData, mapping, importDate);
            setPreviewData(processed);
            setStep('preview');
            setIsLoading(false);
        }, 100);
    };

    const handleConfirmImport = () => {
        const validRows = previewData.filter(r => r.isValid);
        if (validRows.length === 0) {
            alert('Não há dados válidos para importar.');
            return;
        }

        const demands = validRows.map(r => r.demand as Demand);
        const warnings = previewData.flatMap(r => r.warnings);
        const errors = previewData.flatMap(r => r.errors);

        const log: ImportLog = {
            id: uid(),
            at: Date.now(),
            fileName,
            total: previewData.length,
            imported: demands.length,
            created: demands.length, // Simplified for now (all considered new)
            updated: 0,
            warnings: [...new Set(warnings)] // Dedupe simple string warnings
        };

        onImportComplete(demands, log);
        setStep('success');
    };

    // Render Steps

    // 1. UPLOAD
    if (step === 'upload') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
                <div className="bg-[#12121a]/80 backdrop-blur-sm border border-white/5 rounded-3xl p-10 flex flex-col items-center max-w-2xl w-full shadow-lg shadow-black/20">
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-2xl">
                        <UploadCloud className="w-12 h-12 text-slate-400" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-100 mb-2">Importar seus dados</h2>
                    <p className="text-slate-500 text-center mb-8 max-w-md">
                        Siga as etapas abaixo para importar seus dados.
                    </p>

                    <div
                        className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer
                ${isDragging ? 'border-red-500 bg-red-500/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/30'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".xlsx,.xls,.csv"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleFileSelect(f);
                                e.target.value = '';
                            }}
                        />
                        <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                            {isLoading ? (
                                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                            ) : (
                                <>
                                    <FileSpreadsheet className="w-10 h-10 text-slate-600 mb-4" />
                                    <span className="text-slate-300 font-medium">Clique para carregar</span>
                                    <span className="text-slate-600 text-sm mt-1">ou arraste o arquivo</span>
                                </>
                            )}
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    // 2. MAPPING
    if (step === 'mapping') {
        const fields: { key: keyof ColumnMapping; label: string; required?: boolean }[] = [
            { key: 'chamado', label: 'Chamado / ID', required: true },
            { key: 'contrato', label: 'Contrato', required: true },
            { key: 'agencia', label: 'Agência / Local', required: true },
            { key: 'estado', label: 'Estado / UF' },
            { key: 'prefixo', label: 'Prefixo' },
            { key: 'status', label: 'Status' },
            { key: 'fotos', label: 'Qtd. Fotos' },
            { key: 'vencPortal', label: 'Vencimento' },
            { key: 'obs', label: 'Observações' },
        ];

        return (
            <div className="w-full h-full p-6 animate-in slide-in-from-right-10 duration-500 flex flex-col gap-6">
                <header className="flex justify-between items-center bg-[#12121a]/90 p-6 rounded-2xl border border-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                            Mapeamento de Colunas
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Arquivo: <span className="text-slate-300">{fileName}</span> ({rawData.length} linhas)</p>
                    </div>
                    <button onClick={() => setStep('upload')} className="text-slate-500 hover:text-slate-300 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 overflow-y-auto pb-20">
                    {fields.map((f) => (
                        <div key={f.key} className="bg-[#12121a]/80 p-5 rounded-2xl border border-white/5 space-y-3">
                            <div className="flex justify-between items-center">
                                <label className={`text-xs font-bold uppercase tracking-wider ${f.required ? 'text-red-400' : 'text-slate-500'}`}>
                                    {f.label} {f.required && '*'}
                                </label>
                                {mapping[f.key] && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                )}
                            </div>
                            <div className="relative">
                                <select
                                    value={mapping[f.key]}
                                    onChange={(e) => updateMapping(f.key, e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 appearance-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                                >
                                    <option value="">Não mapear</option>
                                    {headers.map(h => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                            </div>
                            {mapping[f.key] && (
                                <div className="text-[10px] text-slate-500 px-1 truncate">
                                    Ex: {rawData[0]?.[mapping[f.key]] || 'vazio'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="fixed bottom-6 right-6 flex gap-4">
                    <button
                        onClick={() => setStep('upload')}
                        className="px-6 py-3 rounded-xl bg-slate-800 text-slate-400 font-bold hover:bg-slate-700 transition-all"
                    >
                        Voltar
                    </button>
                    <button
                        onClick={handlePreview}
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Pré-visualizar'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    // 3. PREVIEW
    if (step === 'preview') {
        const validCount = previewData.filter(r => r.isValid).length;
        const errorCount = previewData.length - validCount;

        return (
            <div className="w-full h-full p-6 animate-in slide-in-from-bottom-10 duration-500 flex flex-col gap-6">
                <header className="flex justify-between items-center bg-[#12121a]/90 p-6 rounded-2xl border border-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <Info className="w-5 h-5 text-sky-500" />
                            Validar Importação
                        </h2>
                        <div className="flex gap-4 mt-2 text-sm">
                            <span className="text-emerald-400 font-medium">{validCount} linhas válidas</span>
                            {errorCount > 0 && <span className="text-rose-400 font-medium">{errorCount} erros</span>}
                        </div>
                    </div>
                    <button onClick={() => setStep('mapping')} className="text-slate-500 hover:text-slate-300 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-auto bg-[#12121a]/80 border border-white/5 rounded-2xl">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-900 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Linha</th>
                                <th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Status</th>
                                <th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Agência</th>
                                <th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Contrato</th>
                                <th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Chamado</th>
                                <th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Data Venc.</th>
                                <th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Situação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {previewData.slice(0, 100).map((row, i) => (
                                <tr key={i} className={`hover:bg-white/[0.02] ${!row.isValid ? 'bg-rose-500/5' : ''}`}>
                                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.originalIndex + 2}</td>
                                    <td className="px-4 py-3">
                                        {row.isValid ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <div className="flex items-center gap-2 text-rose-400" title={row.errors.join(', ')}>
                                                <AlertCircle className="w-4 h-4" />
                                                <span className="text-xs max-w-[100px] truncate">{row.errors[0]}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">{row.demand.agencia || '-'}</td>
                                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{row.demand.contrato || '-'}</td>
                                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{row.demand.chamado || '-'}</td>
                                    <td className="px-4 py-3 text-slate-400 text-xs">{formatDateBR(row.demand.vencPortal)}</td>
                                    <td className="px-4 py-3">
                                        <CategoryBadge status={row.demand.status || ''} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {previewData.length > 100 && (
                        <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-800">
                            Mostrando as primeiras 100 linhas de {previewData.length}
                        </div>
                    )}
                </div>

                <div className="fixed bottom-6 right-6 flex gap-4">
                    <button
                        onClick={() => setStep('mapping')}
                        className="px-6 py-3 rounded-xl bg-slate-800 text-slate-400 font-bold hover:bg-slate-700 transition-all"
                    >
                        Ajustar Mapeamento
                    </button>
                    <button
                        onClick={handleConfirmImport}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Confirmar Importação
                    </button>
                </div>
            </div>
        );
    }

    // 4. SUCCESS
    if (step === 'success') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-in zoom-in duration-300">
                <div className="bg-[#12121a]/80 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-12 flex flex-col items-center max-w-lg w-full shadow-2xl shadow-emerald-900/10 text-center">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-emerald-500/5">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Importação Concluída!</h2>
                    <p className="text-slate-400 mb-8">
                        Os dados foram processados e a importação foi bem-sucedida. Você pode visualizar o histórico completo no log.
                    </p>

                    <button
                        onClick={() => onCancel()}
                        className="w-full px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all"
                    >
                        Voltar ao Painel
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

function CategoryBadge({ status }: { status: string }) {
    let colorClass = "bg-slate-500/10 text-slate-400 border-slate-500/20";

    if (status === 'Concluído') colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (status === 'Orçamento') colorClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (status === 'Sem Levantamento') colorClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (status === 'Em Relatório') colorClass = "bg-sky-500/10 text-sky-400 border-sky-500/20";

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${colorClass}`}>
            {status}
        </span>
    );
}

function formatDateBR(isoDate: string | undefined): string {
    if (!isoDate) return '-';
    // Ensure string
    let s = String(isoDate).trim();
    // Split potential time "2023-12-12T..."
    if (s.includes('T')) s = s.split('T')[0];

    // Validate format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        const [y, m, d] = s.split('-');
        return `${d}/${m}/${y}`;
    }
    return s;
}
