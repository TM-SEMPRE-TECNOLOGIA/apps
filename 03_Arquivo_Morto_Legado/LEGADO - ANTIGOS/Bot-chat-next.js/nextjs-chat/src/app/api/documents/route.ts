import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { listDocuments, KNOWLEDGE_BASE_DIR } from "@/lib/knowledge";

export const runtime = "nodejs";

// GET — listar documentos
export async function GET() {
    try {
        const files = listDocuments();
        return NextResponse.json({ files });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

// POST — upload de documento
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });

        const ext = path.extname(file.name).toLowerCase();
        if (![".pdf", ".docx"].includes(ext)) {
            return NextResponse.json({ error: "Apenas arquivos PDF e DOCX são suportados." }, { status: 400 });
        }

        if (!fs.existsSync(KNOWLEDGE_BASE_DIR)) fs.mkdirSync(KNOWLEDGE_BASE_DIR, { recursive: true });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const destPath = path.join(KNOWLEDGE_BASE_DIR, file.name);
        fs.writeFileSync(destPath, buffer);

        return NextResponse.json({ success: true, name: file.name });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

// DELETE — remover documento
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get("name");
        if (!name) return NextResponse.json({ error: "Nome do arquivo não informado." }, { status: 400 });

        // Prevent path traversal
        const safe = path.basename(name);
        const filePath = path.join(KNOWLEDGE_BASE_DIR, safe);

        if (!fs.existsSync(filePath)) return NextResponse.json({ error: "Arquivo não encontrado." }, { status: 404 });

        fs.unlinkSync(filePath);
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
