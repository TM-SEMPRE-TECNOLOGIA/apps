"use client";

import { motion } from "framer-motion";
import { FileText, FileSpreadsheet, FolderOpen, RotateCcw, GitCompareArrows } from "lucide-react";
import { useCompareStore } from "@/stores/useCompareStore";

export default function Header() {
    const { reportPath, budgetPath, selectReport, selectBudget, runCompare, openOutputFolder, reset, loading } =
        useCompareStore();

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass-panel border-b border-white/5 sticky top-0 z-50"
        >
            <div className="max-w-[1600px] mx-auto px-6 py-5">
                {/* Title */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#7b2cbf] flex items-center justify-center shadow-lg shadow-[#00d4ff]/20">
                            <GitCompareArrows size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">
                                <span className="glow-text">TM Comparador</span>
                            </h1>
                            <p className="text-[0.7rem] text-white/40 tracking-wide uppercase">
                                Relatório × Orçamento
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={openOutputFolder}
                            className="btn-secondary text-sm flex items-center gap-2 hover:border-white/20 hover:bg-white/5"
                        >
                            <FolderOpen size={15} />
                            <span className="hidden sm:inline">Saída</span>
                        </button>
                        <button
                            onClick={reset}
                            className="btn-secondary text-sm flex items-center gap-2 hover:border-white/20 hover:bg-white/5"
                        >
                            <RotateCcw size={15} />
                            <span className="hidden sm:inline">Limpar</span>
                        </button>
                    </div>
                </div>

                {/* File selectors */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                    {/* Report */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                            <FileText size={12} className="text-brand-primary" />
                            Relatório (DOCX)
                        </label>
                        <div className="flex gap-2">
                            <input
                                readOnly
                                value={reportPath}
                                placeholder="Nenhum arquivo selecionado..."
                                className="input-field text-sm truncate focus:border-brand-primary/40"
                            />
                            <button
                                onClick={selectReport}
                                className="btn-secondary text-sm whitespace-nowrap hover:border-brand-primary/40 hover:text-brand-primary"
                            >
                                Selecionar
                            </button>
                        </div>
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                            <FileSpreadsheet size={12} className="text-brand-accent" />
                            Orçamento (XLSX)
                        </label>
                        <div className="flex gap-2">
                            <input
                                readOnly
                                value={budgetPath}
                                placeholder="Nenhum arquivo selecionado..."
                                className="input-field text-sm truncate focus:border-brand-accent/40"
                            />
                            <button
                                onClick={selectBudget}
                                className="btn-secondary text-sm whitespace-nowrap hover:border-brand-accent/40 hover:text-brand-accent"
                            >
                                Selecionar
                            </button>
                        </div>
                    </div>

                    {/* Compare button */}
                    <button
                        onClick={runCompare}
                        disabled={loading || !reportPath || !budgetPath}
                        className="btn-primary text-sm flex items-center justify-center gap-2 h-[42px] min-w-[140px] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Comparando...
                            </span>
                        ) : (
                            <>
                                <GitCompareArrows size={16} />
                                Comparar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.header>
    );
}
