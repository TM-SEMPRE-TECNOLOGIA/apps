"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, History, Trash2, MessageSquare, RefreshCw, Bot } from "lucide-react";
import Link from "next/link";
import { getConversations, deleteConversation, clearAllConversations, SavedConversation } from "@/lib/history";
import { useRouter } from "next/navigation";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
}

export default function HistoryPage() {
    const [conversations, setConversations] = useState<SavedConversation[]>([]);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        setConversations(getConversations());
    }, []);

    const handleDelete = (id: string) => {
        deleteConversation(id);
        setConversations(getConversations());
    };

    const handleClearAll = () => {
        if (!confirm("Apagar todo o histórico de conversas?")) return;
        clearAllConversations();
        setConversations([]);
    };

    const handleRestore = (conv: SavedConversation) => {
        // Store the conversation to restore in sessionStorage and redirect to chat
        sessionStorage.setItem("tm-restore-conversation", JSON.stringify(conv));
        router.push("/");
    };

    if (!mounted) return null;

    return (
        <main className="flex-1 overflow-y-auto px-4 py-8 bg-[#212121] text-slate-200">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-200">Histórico de Conversas</h1>
                        <p className="text-xs text-slate-400 mt-1">Conversas salvas localmente</p>
                    </div>
                    {conversations.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-white hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Limpar tudo
                        </button>
                    )}
                </div>
                {conversations.length === 0 ? (
                    <div className="bg-[#2B2B2B] border border-[#3A3A3A] rounded-2xl p-12 text-center">
                        <MessageSquare className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-300">Nenhuma conversa salva</p>
                        <p className="text-xs text-slate-400 mt-1">
                            O TM Chat salvará suas próximas conversas automaticamente aqui.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {conversations.map((conv) => (
                            <div key={conv.id} className="bg-[#2B2B2B] border border-[#3A3A3A] rounded-xl p-5 hover:border-indigo-500/50 transition-colors group">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#303030] border border-[#3A3A3A] flex items-center justify-center flex-shrink-0 text-lg">
                                        {conv.personaEmoji || <Bot className="w-5 h-5 text-indigo-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <p className="text-[15px] font-medium text-slate-200 truncate">{conv.title}</p>
                                            {conv.personaName && (
                                                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium border border-indigo-500/20">
                                                    {conv.personaName}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-400 truncate mb-3">
                                            {conv.messages.find(m => m.role === "user")?.content || "—"}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-slate-500">{formatDate(conv.savedAt)}</span>
                                            <span className="text-xs text-slate-600">·</span>
                                            <span className="text-xs text-slate-500">{conv.messages.length} mensagens</span>
                                            {conv.modelName && (
                                                <>
                                                    <span className="text-xs text-slate-600">·</span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1.5"><Bot className="w-3.5 h-3.5" />{conv.modelName}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <button
                                            onClick={() => handleRestore(conv)}
                                            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-white hover:bg-indigo-600 px-3 py-2 rounded-lg transition-colors border border-indigo-500/30 font-medium"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                            Restaurar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(conv.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
