"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, FileText, File, RefreshCw, ArrowLeft, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";

type DocumentInfo = {
    name: string;
    size: number;
    type: "pdf" | "docx" | "unknown";
    uploadedAt: string;
};

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
}

export default function KnowledgePage() {
    const [documents, setDocuments] = useState<DocumentInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/documents");
            const data = await res.json();
            setDocuments(data.files || []);
        } catch {
            setError("Falha ao carregar documentos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDocuments(); }, []);

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const uploadFile = async (file: File) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!["pdf", "docx"].includes(ext || "")) {
            setError("Apenas arquivos PDF e DOCX são suportados.");
            return;
        }
        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/documents", { method: "POST", body: formData });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erro no upload.");
            }
            showSuccess(`"${file.name}" adicionado com sucesso!`);
            await fetchDocuments();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro no upload.");
        } finally {
            setUploading(false);
        }
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        Array.from(files).forEach(uploadFile);
    };

    const deleteDocument = async (name: string) => {
        if (!confirm(`Remover "${name}" da base de conhecimento?`)) return;
        try {
            const res = await fetch(`/api/documents?name=${encodeURIComponent(name)}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Falha ao remover.");
            showSuccess(`"${name}" removido.`);
            await fetchDocuments();
        } catch {
            setError("Falha ao remover documento.");
        }
    };

    return (
        <main className="flex-1 overflow-y-auto px-4 py-8 bg-[#212121] text-slate-200">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-200">Base de Conhecimento</h1>
                        <p className="text-xs text-slate-400 mt-1">Documentos PDF e DOCX para consulta da IA</p>
                    </div>
                    <button
                        onClick={fetchDocuments}
                        className="text-slate-400 hover:text-indigo-400 transition-colors bg-[#2B2B2B] border border-[#3A3A3A] p-2.5 rounded-lg hover:bg-[#383838]"
                        title="Atualizar lista"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
                {/* Alertas */}
                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                    </div>
                )}
                {successMsg && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
                        ✓ {successMsg}
                    </div>
                )}

                {/* Upload Area */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${isDragging
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-[#3A3A3A] hover:border-indigo-500/50 hover:bg-indigo-500/5 bg-[#2B2B2B]"
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                    />
                    <div className="w-12 h-12 bg-[#303030] border border-[#4A4A4A] rounded-xl flex items-center justify-center mx-auto mb-3">
                        {uploading ? (
                            <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                        ) : (
                            <Upload className="w-6 h-6 text-indigo-400" />
                        )}
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                        {uploading ? "Enviando..." : "Arraste arquivos aqui ou clique para selecionar"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Suporta PDF e DOCX • Múltiplos arquivos</p>
                </div>

                {/* Info Box */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3 text-sm text-indigo-300 leading-relaxed">
                    <strong>Como funciona:</strong> Os documentos ficam armazenados no servidor (pasta <code className="bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-200 text-xs">knowledge-base/</code>). No chat principal, ative os documentos que deseja usar como fonte — a IA consultará o conteúdo relevante antes de responder.
                </div>

                {/* Documents List */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-slate-300">
                            Documentos disponíveis {!loading && <span className="text-slate-500 font-normal">({documents.length})</span>}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="bg-[#2B2B2B] border border-[#3A3A3A] rounded-2xl p-8 text-center">
                            <RefreshCw className="w-6 h-6 text-slate-500 animate-spin mx-auto mb-2" />
                            <p className="text-sm text-slate-400">Carregando...</p>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="bg-[#2B2B2B] border border-[#3A3A3A] rounded-2xl p-8 text-center">
                            <File className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                            <p className="text-sm text-slate-300">Nenhum documento ainda.</p>
                            <p className="text-xs text-slate-500 mt-1">Faça upload acima ou coloque arquivos na pasta <code>knowledge-base/</code></p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {documents.map((doc) => (
                                <div key={doc.name} className="bg-[#2B2B2B] border border-[#3A3A3A] rounded-xl px-4 py-3.5 flex items-center gap-4 hover:border-indigo-500/50 transition-colors group">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${doc.type === "pdf" ? "bg-red-500/10 border border-red-500/20" : "bg-blue-500/10 border border-blue-500/20"}`}>
                                        <FileText className={`w-5 h-5 ${doc.type === "pdf" ? "text-red-400" : "text-blue-400"}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-200 truncate">{doc.name}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{formatBytes(doc.size)} · {formatDate(doc.uploadedAt)}</p>
                                    </div>
                                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase border ${doc.type === "pdf" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                                        {doc.type}
                                    </span>
                                    <button
                                        onClick={() => deleteDocument(doc.name)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remover"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}
