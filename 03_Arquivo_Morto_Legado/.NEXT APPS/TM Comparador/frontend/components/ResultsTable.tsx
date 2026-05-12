"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCompareStore, type CompareRow } from "@/stores/useCompareStore";
import { ArrowDownAZ, Filter } from "lucide-react";
import { useMemo, useState } from "react";

function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    let bg: string, text: string, border: string;

    if (s.includes("compat")) {
        bg = "rgba(63, 185, 80, 0.1)";
        text = "#3fb950";
        border = "rgba(63, 185, 80, 0.25)";
    } else if (s.includes("diverg")) {
        bg = "rgba(248, 81, 73, 0.1)";
        text = "#f85149";
        border = "rgba(248, 81, 73, 0.25)";
    } else if (s.includes("não citado")) {
        bg = "rgba(210, 153, 34, 0.1)";
        text = "#d29922";
        border = "rgba(210, 153, 34, 0.25)";
    } else {
        bg = "rgba(123, 44, 191, 0.1)";
        text = "#b87aed";
        border = "rgba(123, 44, 191, 0.25)";
    }

    return (
        <span
            className="status-badge"
            style={{ background: bg, color: text, borderColor: border, borderWidth: "1px", borderStyle: "solid" }}
        >
            {status}
        </span>
    );
}

function formatQty(value: number | null): string {
    if (value === null || value === undefined) return "—";
    return value.toFixed(2).replace(".", ",");
}

function formatDiff(value: number | null): string {
    if (value === null || value === undefined) return "—";
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(2).replace(".", ",")}`;
}

type SortKey = "item" | "qtd_relatorio" | "qtd_orcamento" | "status" | "diferenca";
type SortDir = "asc" | "desc";

export default function ResultsTable() {
    const { results, statusFilter, setStatusFilter } = useCompareStore();
    const [sortKey, setSortKey] = useState<SortKey>("item");
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const filtered = useMemo(() => {
        let data = [...results];

        // Filter
        if (statusFilter !== "all") {
            data = data.filter((r) => {
                const s = r.status.toLowerCase();
                if (statusFilter === "compatível") return s.includes("compat");
                if (statusFilter === "divergente") return s.includes("diverg");
                if (statusFilter === "não citado") return s.includes("não citado");
                if (statusFilter === "não previsto") return s.includes("não previsto");
                return true;
            });
        }

        // Sort
        data.sort((a, b) => {
            let aVal: string | number = 0;
            let bVal: string | number = 0;

            if (sortKey === "item") {
                const parseCode = (code: string) => {
                    const parts = code.split(".");
                    return parts.map((p) => parseInt(p) || 0);
                };
                const aParts = parseCode(a.item);
                const bParts = parseCode(b.item);
                for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                    const diff = (aParts[i] || 0) - (bParts[i] || 0);
                    if (diff !== 0) return sortDir === "asc" ? diff : -diff;
                }
                return 0;
            }

            if (sortKey === "status") {
                aVal = a.status;
                bVal = b.status;
                return sortDir === "asc"
                    ? (aVal as string).localeCompare(bVal as string)
                    : (bVal as string).localeCompare(aVal as string);
            }

            aVal = a[sortKey] ?? -Infinity;
            bVal = b[sortKey] ?? -Infinity;
            return sortDir === "asc"
                ? (aVal as number) - (bVal as number)
                : (bVal as number) - (aVal as number);
        });

        return data;
    }, [results, statusFilter, sortKey, sortDir]);

    if (results.length === 0) return null;

    const filters = [
        { key: "all", label: "Todos" },
        { key: "compatível", label: "Compatíveis" },
        { key: "divergente", label: "Divergentes" },
        { key: "não citado", label: "Só Orçamento" },
        { key: "não previsto", label: "Só Relatório" },
    ];

    const columns: { key: SortKey; label: string; align: string }[] = [
        { key: "item", label: "Item", align: "text-center" },
        { key: "qtd_relatorio", label: "Qtd. Relatório", align: "text-right" },
        { key: "qtd_orcamento", label: "Qtd. Orçamento", align: "text-right" },
        { key: "diferenca", label: "Diferença", align: "text-right" },
        { key: "status", label: "Status", align: "text-left" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="premium-card overflow-hidden !p-0"
        >
            {/* Filter bar */}
            <div className="flex items-center gap-2 p-4 border-b border-white/5 flex-wrap">
                <Filter size={14} className="text-white/30" />
                {filters.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setStatusFilter(f.key)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${statusFilter === f.key
                                ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/30"
                                : "text-white/40 hover:text-white/70 border border-transparent hover:border-white/10"
                            }`}
                    >
                        {f.label}
                        {f.key !== "all" && (
                            <span className="ml-1 opacity-60">
                                ({results.filter((r) => {
                                    const s = r.status.toLowerCase();
                                    if (f.key === "compatível") return s.includes("compat");
                                    if (f.key === "divergente") return s.includes("diverg");
                                    if (f.key === "não citado") return s.includes("não citado");
                                    if (f.key === "não previsto") return s.includes("não previsto");
                                    return false;
                                }).length})
                            </span>
                        )}
                    </button>
                ))}
                <span className="ml-auto text-xs text-white/30">
                    {filtered.length} de {results.length} itens
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => toggleSort(col.key)}
                                    className={`px-4 py-3 font-semibold text-white/50 text-xs uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors select-none ${col.align}`}
                                >
                                    <span className="inline-flex items-center gap-1">
                                        {col.label}
                                        {sortKey === col.key && (
                                            <ArrowDownAZ
                                                size={12}
                                                className={`transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`}
                                            />
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filtered.map((row, i) => (
                                <motion.tr
                                    key={row.item}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.5) }}
                                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-4 py-3 text-center font-mono text-brand-primary font-semibold text-sm">
                                        {row.item}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-white/70">
                                        {formatQty(row.qtd_relatorio)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-white/70">
                                        {formatQty(row.qtd_orcamento)}
                                    </td>
                                    <td
                                        className={`px-4 py-3 text-right font-mono font-medium ${row.diferenca === null || row.diferenca === undefined
                                                ? "text-white/30"
                                                : row.diferenca === 0
                                                    ? "text-brand-success"
                                                    : "text-brand-danger"
                                            }`}
                                    >
                                        {formatDiff(row.diferenca)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={row.status} />
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-white/30 text-sm">
                    Nenhum item encontrado com este filtro.
                </div>
            )}
        </motion.div>
    );
}
