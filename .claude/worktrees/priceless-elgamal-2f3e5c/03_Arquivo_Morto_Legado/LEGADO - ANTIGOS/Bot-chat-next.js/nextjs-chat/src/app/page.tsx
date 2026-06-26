"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Cpu, ChevronDown, UsersRound, BookOpen, History, Settings, Database, X, Save, Paperclip, FileText, Image as ImageIcon } from "lucide-react";
import { Persona, getPersonas } from "@/lib/personas";
import { saveConversation } from "@/lib/history";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Attachment = {
  name: string;
  type: "image" | "document";
  data: string; // base64 or extracted text
};

type Message = {
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
};

type DocumentInfo = {
  name: string;
  size: number;
  type: "pdf" | "docx" | "unknown";
  uploadedAt: string;
};

const FREE_MODELS = [
  { id: "openrouter/free", name: "Auto Router" },
  { id: "openai/gpt-oss-120b:free", name: "GPT-OSS 120B" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B" },
  { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B" },
  { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Large" },
  { id: "nvidia/nemotron-3-nano-30b-a3b:free", name: "Nemotron 3 Nano" },
];

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end gap-2.5 items-end">
        <div className="flex flex-col items-end gap-1.5 max-w-[80%] sm:max-w-[70%]">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end mb-1">
              {message.attachments.map((att, i) => (
                att.type === "image" ? (
                  <img key={i} src={att.data} alt={att.name} className="max-w-48 max-h-48 sm:max-w-64 sm:max-h-64 rounded-xl object-cover border border-[#3A3A3A] shadow-sm" />
                ) : (
                  <div key={i} className="flex items-center gap-1.5 bg-[#2B2B2B] border border-[#3A3A3A] px-3 py-2 rounded-xl text-xs text-slate-300">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span className="truncate max-w-32">{att.name}</span>
                  </div>
                )
              ))}
            </div>
          )}
          {message.content && (
            <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm whitespace-pre-wrap">
              {message.content}
            </div>
          )}
        </div>
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mb-0.5">
          <User className="w-3.5 h-3.5 text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-start w-full">
      <div className="w-8 h-8 rounded-lg flex flex-shrink-0 items-center justify-center bg-[#2B2B2B] border border-[#3A3A3A] mt-0.5 shadow-sm">
        <Bot className="w-5 h-5 text-indigo-400" />
      </div>
      <div className="flex-1 text-[15px] leading-relaxed text-slate-200 bg-[#212121] py-3.5 rounded-2xl max-w-none overflow-x-auto overflow-hidden">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="text-lg font-bold text-slate-100 mt-3 mb-2 first:mt-0">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base font-bold text-slate-100 mt-3 mb-1.5 first:mt-0">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-semibold text-slate-200 mt-2 mb-1 first:mt-0">{children}</h3>,
            h4: ({ children }) => <h4 className="text-sm font-semibold text-slate-200 mt-2 mb-1">{children}</h4>,
            p: ({ children }) => <p className="mb-2 last:mb-0 text-slate-300 leading-relaxed">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold text-slate-100">{children}</strong>,
            em: ({ children }) => <em className="italic text-slate-400">{children}</em>,
            ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1 text-slate-300">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-slate-300">{children}</ol>,
            li: ({ children }) => <li className="text-slate-300 leading-relaxed">{children}</li>,
            code: ({ inline, children }: any) =>
              inline ? (
                <code className="bg-[#303030] text-indigo-300 px-1.5 py-0.5 rounded text-[12px] font-mono border border-[#3A3A3A]">
                  {children}
                </code>
              ) : (
                <code>{children}</code>
              ),
            pre: ({ children }) => (
              <pre className="bg-[#121212] text-slate-200 rounded-xl px-4 py-3 overflow-x-auto text-[12px] font-mono my-3 border border-[#3A3A3A] leading-relaxed">
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-indigo-500 pl-4 my-2 text-slate-400 italic bg-indigo-500/10 py-1 rounded-r-lg">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-3">
                <table className="w-full text-xs border-collapse border border-[#3A3A3A] rounded-lg overflow-hidden">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-[#2B2B2B]">{children}</thead>,
            th: ({ children }) => <th className="border border-[#3A3A3A] px-3 py-2 text-left font-semibold text-slate-200">{children}</th>,
            td: ({ children }) => <td className="border border-[#3A3A3A] px-3 py-2 text-slate-300">{children}</td>,
            hr: () => <hr className="border-[#3A3A3A] my-3" />,
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline">
                {children}
              </a>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(FREE_MODELS[0].id);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showKnowledgeMenu, setShowKnowledgeMenu] = useState(false);
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [activeDocuments, setActiveDocuments] = useState<string[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploadingExt, setIsUploadingExt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const list = getPersonas();
    setPersonas(list);
  }, []);

  // Restore conversation from history page
  useEffect(() => {
    const stored = sessionStorage.getItem("tm-restore-conversation");
    if (stored) {
      try {
        const conv = JSON.parse(stored);
        setMessages(conv.messages || []);
      } catch { /* ignore */ }
      sessionStorage.removeItem("tm-restore-conversation");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  // Fetch documents when knowledge menu opens
  useEffect(() => {
    if (!showKnowledgeMenu) return;
    fetch("/api/documents")
      .then((r) => r.json())
      .then((d) => setDocuments(d.files || []))
      .catch(() => { });
  }, [showKnowledgeMenu]);

  const toggleDocument = (name: string) => {
    setActiveDocuments((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingExt(true);
    const newAttachments: Attachment[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) {
        // Process image to Base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        newAttachments.push({ name: file.name, type: "image", data: base64 });
      } else if (['pdf', 'docx', 'txt'].includes(ext || '')) {
        // Upload to ephemeral extractor
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await fetch("/api/extract", { method: "POST", body: formData });
          const json = await res.json();
          if (json.success) {
            newAttachments.push({ name: file.name, type: "document", data: json.text });
          }
        } catch (err) { }
      }
    }

    setAttachments(prev => [...prev, ...newAttachments]);
    setIsUploadingExt(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Removed manual save UI, so handleSaveConversation is removed from UI use
  // We will auto-save in handleSubmit

  const closeAllMenus = () => {
    setShowModelMenu(false);
    setShowPersonaMenu(false);
    setShowKnowledgeMenu(false);
  };

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading || isUploadingExt) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setIsLoading(true);

    try {
      // Build API messages payload properly treating Multimodal combinations
      const apiMessages = [...messages, userMessage].map((m) => {
        let apiContent: string | any[] = m.content;

        if (m.attachments && m.attachments.length > 0) {
          const hasImages = m.attachments.some(a => a.type === "image");
          const docs = m.attachments.filter(a => a.type === "document");

          let textWithDocs = m.content;
          if (docs.length > 0) {
            textWithDocs += docs.map(d => `\n\n--- Conteúdo Escaneado: ${d.name} ---\n${d.data}\n`).join("");
          }

          if (hasImages) {
            const arr: any[] = [{ type: "text", text: textWithDocs }];
            m.attachments.filter(a => a.type === "image").forEach(img => {
              arr.push({ type: "image_url", image_url: { url: img.data } });
            });
            apiContent = arr;
          } else {
            apiContent = textWithDocs;
          }
        }
        return { role: m.role, content: apiContent };
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModel,
          systemPrompt: selectedPersona?.systemPrompt,
          activeDocuments: activeDocuments.length > 0 ? activeDocuments : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const detail = errorData.details || errorData.error || `Erro ${response.status}`;
        throw new Error(detail);
      }

      if (!response.body) throw new Error("A API não retornou uma stream legível.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantMessageContent = "";

      // Initialize an empty assistant message in the state
      const initialAssistantMsg: Message = { role: "assistant", content: "" };
      setMessages((prev) => {
        return [...prev, initialAssistantMsg];
      });

      // Stream loop
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunkValue = decoder.decode(value, { stream: true });
          assistantMessageContent += chunkValue;

          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            newMessages[lastIndex] = { ...newMessages[lastIndex], content: assistantMessageContent };
            return newMessages;
          });
        }
      }

      const finalMessages = [...messages, userMessage, { role: "assistant", content: assistantMessageContent } as Message];

      // Auto-save the conversation after the stream finishes completely
      const firstUserMsg = finalMessages.find(m => m.role === "user")?.content || "Conversa";
      const title = firstUserMsg.slice(0, 60) + (firstUserMsg.length > 60 ? "…" : "");
      const savedConv = saveConversation({
        id: currentConversationId || undefined,
        title,
        messages: finalMessages,
        personaName: selectedPersona?.name,
        personaEmoji: selectedPersona?.emoji,
        modelName: FREE_MODELS.find(m => m.id === selectedModel)?.name,
      });
      setCurrentConversationId(savedConv.id);

    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro desconhecido";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${msg}\n\nTente outro modelo no seletor acima.` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedModelName = FREE_MODELS.find((m) => m.id === selectedModel)?.name ?? selectedModel;

  return (
    <main className="flex flex-col h-screen bg-[#212121] text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header */}
      <header className="bg-[#2B2B2B] border-b border-[#3A3A3A] px-4 py-3 flex items-center justify-between gap-3 shadow-md z-10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-200 leading-tight">TM Chat</h1>
            <p className="text-[10px] text-slate-400 leading-tight">Tecnologia Sempre</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Personas Button */}
          <div className="relative">
            <button
              onClick={() => { setShowPersonaMenu((v) => !v); setShowModelMenu(false); setShowKnowledgeMenu(false); }}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${selectedPersona
                ? "bg-[#332A46] border-[#443765] text-violet-300"
                : "bg-[#303030] border-[#3A3A3A] text-slate-300 hover:bg-[#383838]"
                }`}
            >
              <span>{selectedPersona ? selectedPersona.emoji : <UsersRound className="w-3.5 h-3.5" />}</span>
              <span className="max-w-[80px] truncate hidden sm:inline">{selectedPersona ? selectedPersona.name : "Persona"}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showPersonaMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#2B2B2B] border border-[#3A3A3A] rounded-xl shadow-xl py-1 z-20 overflow-hidden">
                <button
                  onClick={() => { setSelectedPersona(null); setShowPersonaMenu(false); setMessages([]); setCurrentConversationId(null); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#383838] transition-colors flex items-center gap-2 ${!selectedPersona ? "text-indigo-400 font-medium" : "text-slate-300"}`}
                >
                  <Bot className="w-4 h-4 opacity-70" /> Assistente Padrão
                </button>
                {personas.length > 0 && <div className="h-px bg-[#3A3A3A] my-1" />}
                {personas.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPersona(p); setShowPersonaMenu(false); setMessages([]); setCurrentConversationId(null); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#383838] transition-colors flex items-center gap-2 ${selectedPersona?.id === p.id ? "text-indigo-400 font-medium" : "text-slate-300"}`}
                  >
                    <span>{p.emoji}</span> {p.name}
                  </button>
                ))}
                <div className="h-px bg-[#3A3A3A] my-1" />
                <Link
                  href="/personas"
                  onClick={() => setShowPersonaMenu(false)}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-400 hover:text-indigo-400 hover:bg-[#383838] transition-colors flex items-center gap-2"
                >
                  <UsersRound className="w-3.5 h-3.5" /> Gerenciar personas →
                </Link>
              </div>
            )}
          </div>

          {/* Knowledge Base Selector */}
          <div className="relative">
            <button
              onClick={() => { setShowKnowledgeMenu((v) => !v); setShowModelMenu(false); setShowPersonaMenu(false); }}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${activeDocuments.length > 0
                ? "bg-[#253930] border-[#315243] text-emerald-400"
                : "bg-[#303030] border-[#3A3A3A] text-slate-300 hover:bg-[#383838]"
                }`}
              title="Base de Conhecimento"
            >
              <Database className="w-3.5 h-3.5" />
              {activeDocuments.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
                  {activeDocuments.length}
                </span>
              )}
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showKnowledgeMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-72 bg-[#2B2B2B] border border-[#3A3A3A] rounded-xl shadow-xl z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#3A3A3A] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-300">Base de Conhecimento</p>
                    <p className="text-[10px] text-slate-500">Selecione os documentos como fonte</p>
                  </div>
                  <Link
                    href="/knowledge"
                    onClick={closeAllMenus}
                    className="text-[10px] text-indigo-400 hover:underline"
                  >
                    Gerenciar →
                  </Link>
                </div>
                <div className="max-h-52 overflow-y-auto py-1">
                  {documents.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <BookOpen className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                      <p className="text-xs text-slate-400">Nenhum documento disponível</p>
                      <Link href="/knowledge" onClick={closeAllMenus} className="text-[10px] text-indigo-400 hover:underline mt-1 inline-block">
                        Adicionar documentos →
                      </Link>
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <button
                        key={doc.name}
                        onClick={() => toggleDocument(doc.name)}
                        className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2.5 hover:bg-[#383838] transition-colors ${activeDocuments.includes(doc.name) ? "text-emerald-400" : "text-slate-300"}`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${activeDocuments.includes(doc.name) ? "bg-emerald-600 border-emerald-600" : "border-[#4A4A4A]"}`}>
                          {activeDocuments.includes(doc.name) && <span className="text-white text-[8px]">✓</span>}
                        </div>
                        <span className="truncate flex-1">{doc.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${doc.type === "pdf" ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-500"}`}>
                          {doc.type}
                        </span>
                      </button>
                    ))
                  )}
                </div>
                {activeDocuments.length > 0 && (
                  <div className="px-4 py-2 border-t border-[#3A3A3A]">
                    <button
                      onClick={() => setActiveDocuments([])}
                      className="text-[10px] text-slate-400 hover:text-red-400 transition-colors"
                    >
                      Desativar todos
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Model Selector */}
          <div className="relative">
            <button
              onClick={() => { setShowModelMenu((v) => !v); setShowPersonaMenu(false); setShowKnowledgeMenu(false); }}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#3A3A3A] bg-[#303030] text-slate-300 hover:bg-[#383838] transition-colors"
              title="Modelo de IA"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span className="max-w-[80px] truncate hidden sm:inline">{selectedModelName}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showModelMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#2B2B2B] border border-[#3A3A3A] rounded-xl shadow-xl py-1 z-20">
                {FREE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setShowModelMenu(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#383838] transition-colors ${selectedModel === m.id ? "text-indigo-400 font-medium" : "text-slate-300"}`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav Icons */}
          <div className="flex items-center gap-1 ml-1 border-l border-[#3A3A3A] pl-2">
            <Link href="/history" title="Histórico" className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-[#383838] rounded-lg transition-colors">
              <History className="w-4 h-4" />
            </Link>
            <Link href="/settings" title="Configurações" className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-[#383838] rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Active Persona Banner */}
      {selectedPersona && (
        <div className="bg-[#332A46] border-b border-[#443765] px-4 py-2 flex items-center gap-2 flex-shrink-0">
          <span className="text-base">{selectedPersona.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-violet-300 truncate">{selectedPersona.name}</p>
            <p className="text-[10px] text-violet-400/70 truncate">{selectedPersona.description}</p>
          </div>
          <button onClick={() => { setSelectedPersona(null); setMessages([]); setCurrentConversationId(null); }} className="text-violet-400 hover:text-violet-300 text-xs transition-colors">✕</button>
        </div>
      )}

      {/* Active Knowledge Banner */}
      {activeDocuments.length > 0 && (
        <div className="bg-[#253930] border-b border-[#315243] px-4 py-2 flex items-center gap-2 flex-shrink-0">
          <Database className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <p className="text-xs text-emerald-400 flex-1 truncate">
            <span className="font-medium">{activeDocuments.length} documento{activeDocuments.length > 1 ? "s" : ""} ativo{activeDocuments.length > 1 ? "s" : ""}:</span>{" "}
            {activeDocuments.join(", ")}
          </p>
          <button onClick={() => setActiveDocuments([])} className="text-emerald-500 hover:text-emerald-400 transition-colors flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
        onClick={closeAllMenus}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-16 h-16 bg-[#2B2B2B] border border-[#3A3A3A] rounded-2xl flex items-center justify-center shadow-md mb-5">
              {selectedPersona ? (
                <span className="text-3xl">{selectedPersona.emoji}</span>
              ) : (
                <Bot className="w-8 h-8 text-indigo-400" />
              )}
            </div>
            <h2 className="text-xl font-medium text-slate-200 mb-2">
              {selectedPersona ? selectedPersona.name : "Como o TM Chat pode ajudar?"}
            </h2>
            <p className="text-[15px] text-slate-400 max-w-sm leading-relaxed mb-8">
              {selectedPersona
                ? selectedPersona.description
                : "Converse, tire dúvidas, analise código e muito mais."}
            </p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {!selectedPersona && personas.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPersona(p); setMessages([]); setCurrentConversationId(null); }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2B2B2B] border border-[#3A3A3A] rounded-xl text-sm text-slate-300 hover:border-indigo-500/50 hover:bg-[#303030] transition-colors shadow-sm"
                >
                  <span>{p.emoji}</span> {p.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full space-y-6 pb-20">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-lg flex flex-shrink-0 items-center justify-center bg-transparent mt-0.5 animate-pulse">
                  <Bot className="w-5 h-5 text-slate-500" />
                </div>
                <div className="px-1 py-3 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className={`px-4 py-3 flex-shrink-0 transition-all ${messages.length === 0 ? "max-w-3xl mx-auto w-full mb-[15vh]" : "bg-[#212121] pb-6"}`}>
        <div className="max-w-3xl mx-auto relative">

          {attachments.length > 0 && (
            <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
              {attachments.map((att, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-[#2B2B2B] border border-[#3A3A3A] px-2.5 py-1.5 rounded-lg flex-shrink-0 max-w-40 relative group">
                  {att.type === "image" ? <ImageIcon className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" /> : <FileText className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
                  <span className="text-xs text-slate-300 truncate">{att.name}</span>
                  <button onClick={() => removeAttachment(i)} className="absolute -top-1.5 -right-1.5 bg-[#3A3A3A] w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-500/80 text-white shadow-sm transition-colors text-[10px]">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 bg-[#2F2F2F] focus-within:bg-[#383838] border border-[#3A3A3A] focus-within:border-[#555] rounded-2xl p-2 transition-all shadow-lg"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept=".pdf,.docx,.txt,image/png,image/jpeg,image/webp"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-[#3A3A3A] rounded-xl transition-colors mb-0.5 flex-shrink-0 relative"
              title="Anexar Imagem ou Documento"
            >
              {isUploadingExt ? <Loader2 className="w-5 h-5 animate-spin text-indigo-500" /> : <Paperclip className="w-5 h-5" />}
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Envie uma mensagem ou foto..."
              disabled={isLoading || isUploadingExt}
              rows={1}
              className="flex-1 bg-transparent text-[15px] text-slate-200 placeholder:text-slate-500 focus:outline-none resize-none py-2 px-1 max-h-40 leading-relaxed"
            />

            <button
              type="submit"
              disabled={isLoading || isUploadingExt || (!input.trim() && attachments.length === 0)}
              className={`p-2 rounded-xl transition-colors flex-shrink-0 mb-0.5 ${((input.trim() || attachments.length > 0) && !isLoading && !isUploadingExt) ? "bg-white text-[#212121] hover:bg-slate-200" : "bg-transparent text-[#555]"}`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          {messages.length === 0 && (
            <p className="text-center text-xs text-slate-500 mt-4">
              TM Chat pode cometer erros. Considere verificar as informações.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
