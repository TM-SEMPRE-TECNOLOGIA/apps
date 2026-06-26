"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, BarChart3 } from "lucide-react";
import { useCompareStore, type Summary } from "@/stores/useCompareStore";

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    delay: number;
}

function StatCard({ label, value, icon, color, bgColor, delay }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className="premium-card flex items-center gap-4 hover:border-white/10 group"
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                style={{ background: bgColor }}
            >
                <span style={{ color }}>{icon}</span>
            </div>
            <div>
                <p className="text-2xl font-bold tracking-tight" style={{ color }}>{value}</p>
                <p className="text-xs text-white/40 tracking-wide">{label}</p>
            </div>
        </motion.div>
    );
}

export default function SummaryPanel() {
    const { summary } = useCompareStore();

    if (!summary) return null;

    const cards: Omit<StatCardProps, "delay">[] = [
        {
            label: "Total",
            value: summary.total,
            icon: <BarChart3 size={22} />,
            color: "#00d4ff",
            bgColor: "rgba(0, 212, 255, 0.1)",
        },
        {
            label: "Compatíveis",
            value: summary["compatível"],
            icon: <CheckCircle2 size={22} />,
            color: "#3fb950",
            bgColor: "rgba(63, 185, 80, 0.1)",
        },
        {
            label: "Divergentes",
            value: summary.divergente,
            icon: <XCircle size={22} />,
            color: "#f85149",
            bgColor: "rgba(248, 81, 73, 0.1)",
        },
        {
            label: "Só no Orçamento",
            value: summary["não citado no relatório"],
            icon: <AlertTriangle size={22} />,
            color: "#d29922",
            bgColor: "rgba(210, 153, 34, 0.1)",
        },
        {
            label: "Só no Relatório",
            value: summary["não previsto no orçamento"],
            icon: <HelpCircle size={22} />,
            color: "#7b2cbf",
            bgColor: "rgba(123, 44, 191, 0.1)",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {cards.map((card, i) => (
                <StatCard key={card.label} {...card} delay={i * 0.08} />
            ))}
        </div>
    );
}
