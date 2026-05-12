import path from "path";
import fs from "fs";

export const KNOWLEDGE_BASE_DIR = path.join(process.cwd(), "knowledge-base");

export interface DocumentInfo {
    name: string;
    size: number;
    type: "pdf" | "docx" | "unknown";
    uploadedAt: string;
}

// ──────────────────────────────────────────────
// FILE LISTING
// ──────────────────────────────────────────────
export function listDocuments(): DocumentInfo[] {
    if (!fs.existsSync(KNOWLEDGE_BASE_DIR)) {
        fs.mkdirSync(KNOWLEDGE_BASE_DIR, { recursive: true });
        return [];
    }

    const files = fs.readdirSync(KNOWLEDGE_BASE_DIR);
    return files
        .filter((f) => /\.(pdf|docx)$/i.test(f))
        .map((f) => {
            const filePath = path.join(KNOWLEDGE_BASE_DIR, f);
            const stat = fs.statSync(filePath);
            const ext = path.extname(f).toLowerCase().slice(1);
            return {
                name: f,
                size: stat.size,
                type: (ext === "pdf" || ext === "docx" ? ext : "unknown") as DocumentInfo["type"],
                uploadedAt: stat.mtime.toISOString(),
            };
        })
        .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

// ──────────────────────────────────────────────
// TEXT EXTRACTION
// ──────────────────────────────────────────────
export async function extractText(fileName: string): Promise<string> {
    const filePath = path.join(KNOWLEDGE_BASE_DIR, fileName);
    if (!fs.existsSync(filePath)) throw new Error(`Arquivo não encontrado: ${fileName}`);

    const ext = path.extname(fileName).toLowerCase();

    if (ext === ".docx") {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    }

    if (ext === ".pdf") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        return data.text;
    }

    throw new Error(`Tipo de arquivo não suportado: ${ext}`);
}

// ──────────────────────────────────────────────
// CHUNKING
// ──────────────────────────────────────────────
export function chunkText(text: string, chunkSize = 600, overlap = 100): string[] {
    const words = text.split(/\s+/).filter(Boolean);
    const chunks: string[] = [];
    let i = 0;
    while (i < words.length) {
        chunks.push(words.slice(i, i + chunkSize).join(" "));
        i += chunkSize - overlap;
    }
    return chunks.filter((c) => c.trim().length > 50);
}

// ──────────────────────────────────────────────
// RELEVANCE SEARCH (TF-IDF simples por palavras-chave)
// ──────────────────────────────────────────────
function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-záàâãéèêíïóôõöúüç\s]/gi, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3);
}

function scoreChunk(chunk: string, queryTokens: string[]): number {
    const chunkTokens = tokenize(chunk);
    const chunkFreq: Record<string, number> = {};
    chunkTokens.forEach((t) => (chunkFreq[t] = (chunkFreq[t] || 0) + 1));

    return queryTokens.reduce((score, qt) => {
        return score + (chunkFreq[qt] || 0);
    }, 0);
}

export function findRelevantChunks(
    query: string,
    chunks: string[],
    topN = 5
): string[] {
    const queryTokens = tokenize(query);
    const scored = chunks
        .map((chunk, i) => ({ chunk, score: scoreChunk(chunk, queryTokens), i }))
        .sort((a, b) => b.score - a.score || a.i - b.i);

    // Return top N with score > 0, else return first N chunks for coverage
    const relevant = scored.filter((s) => s.score > 0).slice(0, topN);
    if (relevant.length > 0) return relevant.map((s) => s.chunk);
    return chunks.slice(0, topN);
}

// ──────────────────────────────────────────────
// MAIN: Build context from active documents
// ──────────────────────────────────────────────
export async function buildKnowledgeContext(
    activeDocuments: string[],
    userQuery: string
): Promise<string> {
    if (!activeDocuments || activeDocuments.length === 0) return "";

    const sections: string[] = [];

    for (const docName of activeDocuments) {
        try {
            const text = await extractText(docName);
            const chunks = chunkText(text);
            const relevant = findRelevantChunks(userQuery, chunks, 4);
            sections.push(`--- ${docName} ---\n${relevant.join("\n\n")}`);
        } catch (err) {
            console.warn(`Falha ao processar ${docName}:`, err);
        }
    }

    if (sections.length === 0) return "";

    return (
        "[CONTEXTO DOS DOCUMENTOS]:\n" +
        sections.join("\n\n") +
        "\n[FIM DO CONTEXTO]\n\nUse os documentos acima como fonte quando relevante para responder."
    );
}
