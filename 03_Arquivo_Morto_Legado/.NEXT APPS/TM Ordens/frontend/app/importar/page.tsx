'use client';

import { useState, useRef } from 'react';
import { useImportStore, ImportFieldMap } from '../../stores/useImportStore';
import { useOSStore } from '../../stores/useOSStore';
import { readExcelFile } from '../../lib/importService';
import { Upload, ArrowRight, CheckCircle, AlertCircle, FileSpreadsheet, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ImportarPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const {
        currentStep, setStep, file, setFile,
        data, setData, columns, mapping, updateMapping, autoMapColumns, reset
    } = useImportStore();

    const { importOrdens } = useOSStore();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
            setErrorMsg('Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV.');
            return;
        }

        setErrorMsg('');
        setIsProcessing(true);
        setFile(selectedFile);

        try {
            const result = await readExcelFile(selectedFile);
            if (result.error) {
                setErrorMsg(result.error);
                setFile(null);
            } else {
                setData(result.data, result.headers);
                autoMapColumns();
                setStep(2);
            }
        } catch (err) {
            setErrorMsg('Erro inesperado ao ler arquivo.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            if (fileInputRef.current) {
                fileInputRef.current.files = e.dataTransfer.files;
                const dummyEvent = { target: { files: e.dataTransfer.files } } as any;
                handleFileUpload(dummyEvent);
            }
        }
    };

    const finalizeImport = () => {
        // Generate the final list of Ordens objects based on mapping
        const ordensToImport = data.map(row => {
            return {
                os: String(row[mapping.os || ''] || ''),
                prefixo: String(row[mapping.prefixo || ''] || ''),
                agencia: String(row[mapping.agencia || ''] || ''),
                contrato: String(row[mapping.contrato || ''] || ''),
                estado: String(row[mapping.estado || ''] || ''),
                elaborador: String(row[mapping.elaborador || ''] || ''),
                tecnico: String(row[mapping.tecnico || ''] || ''),
                vencimento: String(row[mapping.vencimento || ''] || ''),
                observacoes: String(row[mapping.observacoes || ''] || ''),
                situacao: 'Fornecedor Acionado' as const,
                fotos: null
            };
        }).filter(os => os.os !== ''); // Remove ones without OS Number

        importOrdens(ordensToImport);
        setStep(4);
    };

    const requiredFields: (keyof ImportFieldMap)[] = ['os', 'agencia', 'contrato'];
    const mappingComplete = requiredFields.every(field => !!mapping[field]);

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Importação Inteligente</h2>
                    <p className="text-[#888888] mt-1">Carregue planilhas de relatórios para gerar Ordens de Serviço em lote.</p>
                </div>
                {currentStep > 1 && currentStep < 4 && (
                    <button onClick={reset} className="btn-secondary text-sm">
                        <X className="w-4 h-4" /> Cancelar
                    </button>
                )}
            </div>

            {/* Stepper Progress */}
            <div className="flex items-center justify-center mb-8 pt-4">
                {[1, 2, 3, 4].map((step, idx) => (
                    <div key={step} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep === step
                                ? 'bg-[#00d4ff] text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                                : currentStep > step
                                    ? 'bg-[rgba(0,212,255,0.2)] text-[#00d4ff] border border-[#00d4ff]'
                                    : 'bg-[#161b22] text-[#888888] border border-[#30363d]'
                            }`}>
                            {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                        </div>
                        {idx < 3 && (
                            <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${currentStep > step ? 'bg-[rgba(0,212,255,0.4)]' : 'bg-[#30363d]'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* STEP 1: UPLOAD */}
            {currentStep === 1 && (
                <div className="glass-panel p-10 mt-6 flex flex-col items-center justify-center min-h-[400px]"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}>
                    <div className="w-20 h-20 rounded-full bg-[rgba(0,212,255,0.1)] flex items-center justify-center mb-6 border border-[rgba(0,212,255,0.2)]">
                        <FileSpreadsheet className="w-10 h-10 text-[#00d4ff]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Selecione seu arquivo</h3>
                    <p className="text-[#888888] mb-8 max-w-md text-center">
                        Arraste e solte sua planilha aqui ou clique para selecionar. Formatos suportados: <strong>.xlsx, .xls, .csv</strong>
                    </p>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".xlsx, .xls, .csv"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                        className="btn-primary"
                    >
                        {isProcessing ? 'Processando...' : 'Procurar Arquivo'}
                        {!isProcessing && <Upload className="w-5 h-5" />}
                    </button>

                    {errorMsg && (
                        <div className="mt-6 flex items-center gap-2 text-[#f85149] bg-[rgba(248,81,73,0.1)] px-4 py-2 rounded-lg border border-[rgba(248,81,73,0.2)]">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">{errorMsg}</span>
                        </div>
                    )}
                </div>
            )}

            {/* STEP 2: MAPPING */}
            {currentStep === 2 && (
                <div className="glass-panel p-6 animate-[fadeIn_0.5s_ease-out]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white">Mapeamento de Colunas</h3>
                        <span className="text-sm text-[#888888] bg-[#161b22] px-3 py-1 rounded-full border border-[#30363d]">
                            {columns.length} colunas detectadas
                        </span>
                    </div>

                    <div className="bg-[rgba(255,255,255,0.02)] p-4 rounded-lg border border-[#30363d] mb-6">
                        <p className="text-sm text-[#888888]">
                            O sistema tentou mapear as colunas automaticamente. Revise e associe as informações do seu Excel com os campos do sistema.
                            Campos com <span className="text-[#00d4ff]">*</span> são obrigatórios.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(Object.keys(AUTO_MAP_FIELDS) as Array<keyof ImportFieldMap>).map((field) => (
                            <div key={field} className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-white flex items-center gap-1">
                                    {AUTO_MAP_FIELDS[field].label}
                                    {requiredFields.includes(field) && <span className="text-[#00d4ff]">*</span>}
                                </label>
                                <select
                                    value={mapping[field] || ''}
                                    onChange={(e) => updateMapping(field, e.target.value)}
                                    className={`w-full ${!mapping[field] && requiredFields.includes(field) ? 'border-[#f85149]' : ''}`}
                                >
                                    <option value="">-- Ignorar este campo --</option>
                                    {columns.map(col => (
                                        <option key={col} value={col}>{col}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => setStep(3)}
                            disabled={!mappingComplete}
                            className={`btn-primary ${!mappingComplete ? 'opacity-50 cursor-not-allowed border "pointer-events-none"' : ''}`}
                        >
                            Pré-visualizar Dados <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: PREVIEW */}
            {currentStep === 3 && (
                <div className="glass-panel p-6 animate-[fadeIn_0.5s_ease-out]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white">Pré-visualização</h3>
                        <span className="text-sm text-[#00d4ff] font-medium bg-[rgba(0,212,255,0.1)] px-3 py-1 rounded-full border border-[rgba(0,212,255,0.2)]">
                            {data.length} registros serão importados
                        </span>
                    </div>

                    <div className="overflow-x-auto border border-[#30363d] rounded-lg bg-[#0d1117]">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-[#888888] uppercase bg-[#161b22] border-b border-[#30363d]">
                                <tr>
                                    <th className="px-4 py-3 font-medium">OS</th>
                                    <th className="px-4 py-3 font-medium">Agência</th>
                                    <th className="px-4 py-3 font-medium">Prefixo</th>
                                    <th className="px-4 py-3 font-medium">Contrato</th>
                                    <th className="px-4 py-3 font-medium">Elaborador</th>
                                    <th className="px-4 py-3 font-medium">Vencimento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(0, 5).map((row, idx) => (
                                    <tr key={idx} className="border-b border-[#30363d] hover:bg-[rgba(255,255,255,0.02)]">
                                        <td className="px-4 py-3 font-medium text-white">{row[mapping.os || '']}</td>
                                        <td className="px-4 py-3">{row[mapping.agencia || '']}</td>
                                        <td className="px-4 py-3">{row[mapping.prefixo || '']}</td>
                                        <td className="px-4 py-3">{row[mapping.contrato || '']}</td>
                                        <td className="px-4 py-3">{row[mapping.elaborador || '']}</td>
                                        <td className="px-4 py-3">{row[mapping.vencimento || '']}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {data.length > 5 && (
                            <div className="text-center py-3 text-xs text-[#888888] bg-[#0d1117]">
                                ... e mais {data.length - 5} registros.
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                        <button onClick={() => setStep(2)} className="btn-secondary">
                            Voltar ao Mapeamento
                        </button>
                        <button onClick={finalizeImport} className="btn-primary">
                            <CheckCircle className="w-5 h-5" /> Importar Ordens
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 4: SUCCESS */}
            {currentStep === 4 && (
                <div className="glass-panel p-10 mt-6 flex flex-col items-center justify-center animate-[slideUp_0.5s_ease-out]">
                    <div className="w-20 h-20 rounded-full bg-[rgba(63,185,80,0.1)] flex items-center justify-center mb-6 border border-[rgba(63,185,80,0.2)]">
                        <CheckCircle className="w-10 h-10 text-[#3fb950]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Importação Concluída!</h3>
                    <p className="text-[#888888] mb-8 max-w-md text-center">
                        O arquivo <strong>{file?.name}</strong> foi processado e todas as Ordens de Serviço foram cadastradas no banco local do sistema.
                    </p>

                    <div className="flex gap-4">
                        <button onClick={() => { reset(); router.push('/ordens'); }} className="btn-primary">
                            Ver Ordens de Serviço
                        </button>
                        <button onClick={reset} className="btn-secondary">
                            <Upload className="w-5 h-5" /> Nova Importação
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

// Helper para exibição na UI
const AUTO_MAP_FIELDS: Record<keyof ImportFieldMap, { label: string }> = {
    os: { label: 'Número da OS / Chamado' },
    prefixo: { label: 'Card / Prefixo' },
    agencia: { label: 'Nome da Agência / Unidade' },
    contrato: { label: 'Contrato' },
    estado: { label: 'Estado (UF)' },
    elaborador: { label: 'Elaborador / Arquiteto' },
    tecnico: { label: 'Técnico Visitante' },
    vencimento: { label: 'Prazo / Conclusão' },
    observacoes: { label: 'Observações' }
};
