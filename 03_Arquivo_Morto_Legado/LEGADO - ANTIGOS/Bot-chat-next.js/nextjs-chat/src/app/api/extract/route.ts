import { NextResponse } from "next/server";
import { extractText } from "@/lib/knowledge";
import path from "path";
import fs from "fs";
import os from "os";

// Mark as nodejs runtime because we use Mammoth/fs
export const runtime = "nodejs";

export async function POST(req: Request) {
    let tempPath: string | null = null;

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
        }

        const ext = path.extname(file.name).toLowerCase();
        if (![".pdf", ".docx", ".txt"].includes(ext)) {
            return NextResponse.json({ error: "Apenas arquivos PDF, DOCX e TXT são permitidos." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        if (ext === ".txt") {
            const text = buffer.toString("utf-8");
            return NextResponse.json({ success: true, text });
        }

        // Create a temporary file to use with extractText/Mammoth
        const tempDir = os.tmpdir();
        const safeName = `ephemeral-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        tempPath = path.join(tempDir, safeName);

        fs.writeFileSync(tempPath, buffer);

        // We override the extractText logic slightly by calling the underlying libs directly since extractText expects KNOWLEDGE_BASE_DIR
        let extractedText = "";

        if (ext === ".docx") {
            const mammoth = await import("mammoth");
            const result = await mammoth.extractRawText({ path: tempPath });
            extractedText = result.value;
        } else if (ext === ".pdf") {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
            const data = await pdfParse(buffer);
            extractedText = data.text;
        }

        return NextResponse.json({ success: true, text: extractedText });

    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    } finally {
        if (tempPath && fs.existsSync(tempPath)) {
            try {
                fs.unlinkSync(tempPath);
            } catch (e) {
                console.error("Failed to delete temp file:", e);
            }
        }
    }
}
