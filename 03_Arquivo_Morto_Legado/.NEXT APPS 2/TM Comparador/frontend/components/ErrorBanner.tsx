"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useCompareStore } from "@/stores/useCompareStore";

export default function ErrorBanner() {
    const { error } = useCompareStore();

    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    className="premium-card !border-brand-danger/30 flex items-center gap-3"
                >
                    <AlertCircle size={18} className="text-brand-danger shrink-0" />
                    <p className="text-sm text-brand-danger/90 flex-1">{error}</p>
                    <button
                        onClick={() => useCompareStore.setState({ error: null })}
                        className="text-white/30 hover:text-white/60 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
