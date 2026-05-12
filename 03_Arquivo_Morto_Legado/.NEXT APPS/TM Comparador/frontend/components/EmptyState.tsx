"use client";

import { motion } from "framer-motion";
import { GitCompareArrows, FileText, FileSpreadsheet, ArrowRight } from "lucide-react";

export default function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-24 text-center"
        >
            {/* Animated icon */}
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative mb-8"
            >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00d4ff]/10 to-[#7b2cbf]/10 border border-white/5 flex items-center justify-center animate-pulse-glow">
                    <GitCompareArrows size={36} className="text-brand-primary" />
                </div>
                {/* Decorative dots */}
                <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-brand-primary/30 animate-ping" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-brand-secondary/30 animate-ping delay-1000" />
            </motion.div>

            <h2 className="text-lg font-semibold text-white/70 mb-2">
                Nenhuma comparação realizada
            </h2>
            <p className="text-sm text-white/30 max-w-md mb-8 leading-relaxed">
                Selecione um relatório <strong className="text-white/50">(.docx)</strong> e um
                orçamento <strong className="text-white/50">(.xlsx)</strong> acima para iniciar a
                comparação de itens.
            </p>

            {/* Steps illustration */}
            <div className="flex items-center gap-3 text-xs text-white/25">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <FileText size={14} className="text-brand-primary" />
                    <span>DOCX</span>
                </div>
                <ArrowRight size={14} className="text-white/15" />
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <FileSpreadsheet size={14} className="text-brand-accent" />
                    <span>XLSX</span>
                </div>
                <ArrowRight size={14} className="text-white/15" />
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <GitCompareArrows size={14} className="text-brand-success" />
                    <span>Comparar</span>
                </div>
            </div>
        </motion.div>
    );
}
