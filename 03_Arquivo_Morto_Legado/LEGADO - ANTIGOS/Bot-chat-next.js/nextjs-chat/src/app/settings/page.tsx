"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Settings, Trash2, RotateCcw } from "lucide-react";
import Link from "next/link";

const SETTINGS_KEY = "tm-chat-settings";

type AppSettings = {
    defaultModel: string;
    assistantName: string;
    autoSaveHistory: boolean;
};

const DEFAULT_SETTINGS: AppSettings = {
    defaultModel: "openrouter/free",
    assistantName: "TM - Tecnologia Sempre",
    autoSaveHistory: true,
};

const FREE_MODELS = [
    { id: "openrouter/free", name: "Auto Router" },
    { id: "openai/gpt-oss-120b:free", name: "GPT-OSS 120B" },
    { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B" },
    { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B" },
    { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Large" },
    { id: "nvidia/nemotron-3-nano-30b-a3b:free", name: "Nemotron 3 Nano" },
];

export function getSettings(): AppSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (!stored) return DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

function saveSettings(settings: AppSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [mounted, setMounted] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setMounted(true);
        setSettings(getSettings());
    }, []);

    const handleSave = () => {
        saveSettings(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        saveSettings(DEFAULT_SETTINGS);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleClearAllData = () => {
        if (!confirm("Isso apagará todo histórico de conversas e configurações. Continuar?")) return;
        localStorage.clear();
        setSettings(DEFAULT_SETTINGS);
        alert("Todos os dados foram apagados.");
    };

    if (!mounted) return null;

    return (
        <main className="flex-1 overflow-y-auto px-4 py-8 bg-[#212121] text-slate-200">
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <h1 className="text-xl font-semibold text-slate-200">Configurações</h1>
                    <p className="text-xs text-slate-400 mt-1">Personalizar o comportamento global do TM Chat</p>
                </div>
                {/* Section: Modelo */}
                <section className="bg-[#2B2B2B] border border-[#3A3A3A] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#3A3A3A] bg-[#222222]">
                        <h2 className="text-sm font-semibold text-slate-200">Modelo Padrão</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Modelo selecionado automaticamente ao abrir o chat</p>
                    </div>
                    <div className="p-5">
                        <select
                            value={settings.defaultModel}
                            onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
                            className="w-full text-sm text-slate-200 border border-[#4A4A4A] rounded-xl px-3 py-2.5 bg-[#303030] focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                        >
                            {FREE_MODELS.map((m) => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Section: Assistente */}
                <section className="bg-[#2B2B2B] border border-[#3A3A3A] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#3A3A3A] bg-[#222222]">
                        <h2 className="text-sm font-semibold text-slate-200">Nome do Assistente</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Identificação padrão nas respostas sem persona</p>
                    </div>
                    <div className="p-5">
                        <input
                            type="text"
                            value={settings.assistantName}
                            onChange={(e) => setSettings({ ...settings, assistantName: e.target.value })}
                            className="w-full text-sm text-slate-200 border border-[#4A4A4A] rounded-xl px-3 py-2.5 bg-[#303030] focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Nome do assistente"
                        />
                    </div>
                </section>

                {/* Section: Histórico */}
                <section className="bg-[#2B2B2B] border border-[#3A3A3A] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#3A3A3A] bg-[#222222]">
                        <h2 className="text-sm font-semibold text-slate-200">Histórico</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Controle de salvamento de conversas</p>
                    </div>
                    <div className="p-5">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                onClick={() => setSettings({ ...settings, autoSaveHistory: !settings.autoSaveHistory })}
                                className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 border ${settings.autoSaveHistory ? "bg-indigo-600 border-indigo-500" : "bg-[#4A4A4A] border-[#555]"}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-transform ${settings.autoSaveHistory ? "translate-x-5" : "translate-x-1"}`} />
                            </div>
                            <div>
                                <span className="text-sm text-slate-200">Salvar conversas automaticamente</span>
                                <p className="text-xs text-slate-400">Salva cada conversa no histórico sem você precisar clicar em botões.</p>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Save / Reset Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        className={`flex-1 text-sm font-medium py-2.5 rounded-xl transition-colors ${saved ? "bg-emerald-600 border border-emerald-500 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                    >
                        {saved ? "✓ Salvo!" : "Salvar configurações"}
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-4 text-sm text-slate-300 hover:text-white border border-[#4A4A4A] bg-[#2B2B2B] hover:bg-[#383838] rounded-xl transition-colors"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Padrão
                    </button>
                </div>

                {/* Danger Zone */}
                <section className="bg-black/30 border border-red-500/20 rounded-2xl overflow-hidden mt-8">
                    <div className="px-5 py-4 border-b border-red-500/10 bg-red-500/5">
                        <h2 className="text-sm font-semibold text-red-500">Zona de Perigo</h2>
                    </div>
                    <div className="p-5">
                        <button
                            onClick={handleClearAllData}
                            className="flex items-center gap-2 text-sm text-red-400 hover:text-white hover:bg-red-500/20 px-4 py-2.5 rounded-xl transition-colors border border-red-500/30 font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Apagar todos os dados e histórico
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}
