"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, FlaskConical, X, Save, ArrowLeft, CheckCircle } from "lucide-react";
import { Persona, getPersonas, savePersonas, createPersona } from "@/lib/personas";
import Link from "next/link";

const FREE_MODELS = [
    { id: "openrouter/free", name: "Auto Router" },
    { id: "openai/gpt-oss-120b:free", name: "GPT-OSS 120B" },
    { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B" },
    { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B" },
    { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Large" },
    { id: "nvidia/nemotron-3-nano-30b-a3b:free", name: "Nemotron 3 Nano" },
];

const EMOJI_OPTIONS = ["🤖", "✍️", "🏗️", "🎨", "📊", "🔬", "🌐", "💼", "📝", "🎯", "⚙️", "🧠", "💡", "🔐", "📱"];

type FormState = {
    name: string;
    emoji: string;
    description: string;
    systemPrompt: string;
};

type TestState = {
    model: string;
    userMessage: string;
    response: string;
    loading: boolean;
    error: string;
};

const emptyForm = (): FormState => ({ name: "", emoji: "🤖", description: "", systemPrompt: "" });

export default function PersonasPage() {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [editing, setEditing] = useState<Persona | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm());
    const [saved, setSaved] = useState(false);
    const [testState, setTestState] = useState<TestState>({
        model: FREE_MODELS[0].id,
        userMessage: "",
        response: "",
        loading: false,
        error: "",
    });
    const [testingPersona, setTestingPersona] = useState<Persona | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        setPersonas(getPersonas());
    }, []);

    const openCreate = () => {
        setForm(emptyForm());
        setEditing(null);
        setIsCreating(true);
    };

    const openEdit = (p: Persona) => {
        setForm({ name: p.name, emoji: p.emoji, description: p.description, systemPrompt: p.systemPrompt });
        setEditing(p);
        setIsCreating(true);
    };

    const closeForm = () => {
        setIsCreating(false);
        setEditing(null);
        setSaved(false);
    };

    const handleSave = () => {
        if (!form.name.trim() || !form.systemPrompt.trim()) return;
        let updated: Persona[];
        if (editing) {
            updated = personas.map((p) => p.id === editing.id ? { ...p, ...form } : p);
        } else {
            updated = [...personas, createPersona(form)];
        }
        savePersonas(updated);
        setPersonas(updated);
        setSaved(true);
        setTimeout(closeForm, 1200);
    };

    const handleDelete = (id: string) => {
        const updated = personas.filter((p) => p.id !== id);
        savePersonas(updated);
        setPersonas(updated);
        setDeletingId(null);
    };

    const openTest = (p: Persona) => {
        setTestingPersona(p);
        setTestState({ model: FREE_MODELS[0].id, userMessage: "", response: "", loading: false, error: "" });
    };

    const runTest = async () => {
        if (!testingPersona || !testState.userMessage.trim()) return;
        setTestState((s) => ({ ...s, loading: true, response: "", error: "" }));
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [{ role: "user", content: testState.userMessage }],
                    model: testState.model,
                    systemPrompt: testingPersona.systemPrompt,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setTestState((s) => ({ ...s, loading: false, error: data.details || data.error || "Erro desconhecido" }));
            } else {
                setTestState((s) => ({ ...s, loading: false, response: data.message.content }));
            }
        } catch (e) {
            setTestState((s) => ({ ...s, loading: false, error: "Falha na conexão" }));
        }
    };

    return (
        <div className="flex-1 overflow-y-auto px-4 py-8 bg-[#212121] text-slate-200 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-200">Personagens</h1>
                        <p className="text-xs text-slate-400 mt-1">Gerencie as personas dos seus assistentes de IA</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Nova Persona
                    </button>
                </div>

                <div className="space-y-4">
                    {personas.length === 0 ? (
                        <div className="text-center py-24 text-slate-500 bg-[#2B2B2B] border border-[#3A3A3A] rounded-2xl">
                            <div className="text-5xl mb-4">🎭</div>
                            <p className="font-medium text-slate-300">Nenhuma persona ainda</p>
                            <p className="text-sm mt-1">Crie sua primeira persona clicando no botão acima.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {personas.map((p) => (
                                <div key={p.id} className="bg-[#2B2B2B] border border-[#3A3A3A] rounded-xl p-5 shadow-sm hover:border-indigo-500/50 transition-colors group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{p.emoji}</span>
                                            <div>
                                                <h2 className="font-semibold text-slate-200">{p.name}</h2>
                                                <p className="text-xs text-slate-400">{p.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 bg-[#222222] rounded-lg p-3 line-clamp-2 font-mono leading-relaxed mb-4 border border-[#3A3A3A]">
                                        {p.systemPrompt.substring(0, 120)}…
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openTest(p)}
                                            className="flex-1 flex items-center justify-center gap-1.5 text-sm text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 font-medium py-1.5 rounded-lg transition-colors border border-indigo-500/20"
                                        >
                                            <FlaskConical className="w-3.5 h-3.5" /> Testar
                                        </button>
                                        <button
                                            onClick={() => openEdit(p)}
                                            className="flex items-center gap-1.5 text-sm text-slate-300 bg-[#303030] hover:bg-[#383838] font-medium px-3 py-1.5 rounded-lg transition-colors border border-[#4A4A4A]"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        {deletingId === p.id ? (
                                            <div className="flex gap-1">
                                                <button onClick={() => handleDelete(p.id)} className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors font-medium">Confirmar</button>
                                                <button onClick={() => setDeletingId(null)} className="text-sm text-slate-300 bg-[#303030] hover:bg-[#383838] px-3 py-1.5 rounded-lg transition-colors border border-[#4A4A4A]">Cancelar</button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeletingId(p.id)}
                                                className="flex items-center gap-1.5 text-sm text-red-500 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create/Edit Modal */}
                {isCreating && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                                <h2 className="font-bold text-slate-800 text-lg">{editing ? "Editar Persona" : "Nova Persona"}</h2>
                                <button onClick={closeForm} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="px-6 py-4 space-y-4">
                                {/* Emoji */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Ícone</label>
                                    <div className="flex flex-wrap gap-2">
                                        {EMOJI_OPTIONS.map((e) => (
                                            <button
                                                key={e}
                                                onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                                                className={`text-xl w-10 h-10 rounded-lg border-2 transition-colors ${form.emoji === e ? "border-indigo-500 bg-indigo-50" : "border-transparent bg-slate-100 hover:bg-slate-200"}`}
                                            >{e}</button>
                                        ))}
                                    </div>
                                </div>
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                                    <input
                                        value={form.name}
                                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                        placeholder="Ex: Redator Técnico"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
                                    />
                                </div>
                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Descrição curta</label>
                                    <input
                                        value={form.description}
                                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                        placeholder="Ex: Especialista em documentação técnica..."
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
                                    />
                                </div>
                                {/* System Prompt */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">System Prompt</label>
                                    <textarea
                                        value={form.systemPrompt}
                                        onChange={(e) => setForm((f) => ({ ...f, systemPrompt: e.target.value }))}
                                        rows={7}
                                        placeholder="Descreva como a IA deve se comportar, qual é seu papel, regras, tom de voz..."
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 resize-y font-mono"
                                    />
                                </div>
                            </div>
                            <div className="px-6 pb-6 flex gap-3">
                                <button onClick={closeForm} className="flex-1 py-2.5 rounded-lg text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium transition-colors">
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!form.name.trim() || !form.systemPrompt.trim()}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {saved ? <><CheckCircle className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar</>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Test Modal */}
                {testingPersona && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{testingPersona.emoji}</span>
                                    <div>
                                        <h2 className="font-bold text-slate-800">Testar: {testingPersona.name}</h2>
                                        <p className="text-xs text-slate-400">Simule uma conversa com esta persona</p>
                                    </div>
                                </div>
                                <button onClick={() => setTestingPersona(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="px-6 py-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
                                    <select
                                        value={testState.model}
                                        onChange={(e) => setTestState((s) => ({ ...s, model: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
                                    >
                                        {FREE_MODELS.map((m) => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Sua mensagem</label>
                                    <textarea
                                        value={testState.userMessage}
                                        onChange={(e) => setTestState((s) => ({ ...s, userMessage: e.target.value }))}
                                        rows={3}
                                        placeholder="Ex: Explique o que é microsserviço..."
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 resize-none"
                                    />
                                </div>
                                {testState.response && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                                        {testState.response}
                                    </div>
                                )}
                                {testState.error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                                        ⚠️ {testState.error}
                                    </div>
                                )}
                            </div>
                            <div className="px-6 pb-6">
                                <button
                                    onClick={runTest}
                                    disabled={testState.loading || !testState.userMessage.trim()}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors"
                                >
                                    {testState.loading ? (
                                        <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Gerando...</>
                                    ) : (
                                        <><FlaskConical className="w-4 h-4" /> Enviar Teste</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
