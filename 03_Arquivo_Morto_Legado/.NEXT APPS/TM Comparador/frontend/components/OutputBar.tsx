"use client";

import { motion } from "framer-motion";
import { Download, FileText, FileSpreadsheet, Clock } from "lucide-react";
import { useCompareStore } from "@/stores/useCompareStore";

export default function OutputBar() {
    const { logPath, csvPath, downloadFile } = useCompareStore();

    if (!logPath && !csvPath) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="premium-card flex flex-wrap items-center gap-3"
        >
            <div className="flex items-center gap-2 text-white/40 text-xs mr-auto">
                <Clock size={13} />
                <span>Arquivos gerados</span>
            </div>
            {logPath && (
                <button
                    onClick={() => downloadFile(logPath)}
                    className="btn-secondary text-xs flex items-center gap-2 hover:border-brand-primary/30 hover:text-brand-primary"
                >
                    <FileText size={14} />
                    Baixar Log (.txt)
                    <Download size={12} className="opacity-50" />
                </button>
            )}
            {csvPath && (
                <button
                    onClick={() => downloadFile(csvPath)}
                    className="btn-secondary text-xs flex items-center gap-2 hover:border-brand-success/30 hover:text-brand-success"
                >
                    <FileSpreadsheet size={14} />
                    Baixar CSV
                    <Download size={12} className="opacity-50" />
                </button>
            )}
        </motion.div>
    );
}
