'use client';

import { useOSStore } from '../../stores/useOSStore';
import { Download, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function RelatoriosPage() {
    const { ordens } = useOSStore();

    const handleExportCSV = () => {
        // Generate simple CSV
        if (ordens.length === 0) {
            alert("Nenhum dado para exportar");
            return;
        }

        const headers = ['OS', 'Agencia', 'Prefixo', 'Contrato', 'Estado', 'Situacao', 'Vencimento', 'Fotos'];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + ordens.map(row => {
                return `${row.os},"${row.agencia}",${row.prefixo},"${row.contrato}",${row.estado},"${row.situacao}",${row.vencimento},${row.fotos || 0}`;
            }).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `tm_ordens_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDFBackend = async () => {
        try {
            // Calls the FastAPI Python Backend!
            const response = await fetch('http://localhost:5002/api/export/pdf');
            if (!response.ok) throw new Error("Erro do backend FastAPI");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio_ordens_${new Date().getTime()}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error(err);
            alert("Falha conectando ao backend Python (Porta 5002). Verifique se o server.py está rodando.");
        }
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Relatórios & Exportação</h2>
                    <p className="text-[#888888] mt-1">Exporte dados operacionais para planilhas ou PDF (Processado via API).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* CSV Export */}
                <div className="glass-panel p-6 hover:border-[#00d4ff] transition-all">
                    <div className="w-14 h-14 rounded-xl bg-[rgba(0,212,255,0.1)] flex items-center justify-center text-[#00d4ff] mb-4">
                        <FileText className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Exportar Planilha CSV</h3>
                    <p className="text-[#888888] text-sm mb-6 min-h-[40px]">
                        Gera rapidamente uma planilha simplificada contendo todas as OS registradas localmente para análise no Excel.
                    </p>
                    <button onClick={handleExportCSV} className="btn-secondary w-full text-[#00d4ff] border-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)]">
                        <Download className="w-4 h-4" /> Baixar CSV (Client-side)
                    </button>
                </div>

                {/* PDF Export (FastAPI) */}
                <div className="glass-panel p-6 hover:border-[#7b2cbf] transition-all">
                    <div className="w-14 h-14 rounded-xl bg-[rgba(123,44,191,0.1)] flex items-center justify-center text-[#7b2cbf] mb-4">
                        <CheckCircle className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Relatório Executivo PDF</h3>
                    <p className="text-[#888888] text-sm mb-6 min-h-[40px]">
                        Gera um relatório formal em PDF processado pelo backend (Python FastAPI), exibindo as métricas ativas.
                    </p>
                    <button onClick={handleExportPDFBackend} className="btn-secondary w-full text-[#7b2cbf] border-[#7b2cbf] hover:bg-[rgba(123,44,191,0.1)]">
                        <Download className="w-4 h-4" /> Gerar PDF (Backend 5002)
                    </button>
                </div>

            </div>

            <div className="mt-8 glass-panel p-6 border-l-4 border-l-[#ffab00]">
                <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-[#ffab00]" /> Nota sobre Valores Financeiros
                </h4>
                <p className="text-sm text-[#888888]">
                    Conforme diretriz do projeto, as requisições de relatório nesta plataforma foram adaptadas para <strong>não conter informações financeiras ou tabelas de preços</strong>. Estes relatórios focam estritamente no avanço de processos operacionais, etapas fotográficas, documentais e prazos dos projetistas/técnicos.
                </p>
            </div>

        </div>
    );
}
