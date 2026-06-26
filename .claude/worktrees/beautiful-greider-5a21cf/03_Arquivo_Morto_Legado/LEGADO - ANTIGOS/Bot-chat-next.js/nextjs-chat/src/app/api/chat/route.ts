import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { buildKnowledgeContext } from "@/lib/knowledge";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "TM Chat",
    },
});

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const { messages, model: requestModel, systemPrompt, activeDocuments } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Mensagens inválidas ou ausentes." },
                { status: 400 }
            );
        }

        const model = requestModel || process.env.DEFAULT_MODEL || "openrouter/free";

        // Build base system prompt
        let finalSystemPrompt = systemPrompt ||
            "Você se chama TM - Tecnologia Sempre, um assistente virtual prestativo, inteligente e amigável. Responda as dúvidas do usuário de forma clara e objetiva.";

        // RAG: inject document context if any documents are active
        if (activeDocuments && Array.isArray(activeDocuments) && activeDocuments.length > 0) {
            const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === "user");

            let userQuery = "";
            if (lastUserMessage?.content) {
                if (Array.isArray(lastUserMessage.content)) {
                    const textPart = lastUserMessage.content.find((c: any) => c.type === "text" || c.type === "text_url");
                    userQuery = textPart?.text || "";
                } else {
                    userQuery = String(lastUserMessage.content);
                }
            }

            const knowledgeContext = await buildKnowledgeContext(activeDocuments, userQuery);
            if (knowledgeContext) {
                finalSystemPrompt = finalSystemPrompt + "\n\n" + knowledgeContext;
            }
        }

        const stream = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: finalSystemPrompt },
                ...messages,
            ],
            stream: true,
        });

        // Create a ReadableStream from the generator
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } catch (error) {
                    controller.error(error);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error) {
        let errorMessage = "Ocorreu um erro desconhecido";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "object" && error !== null && "response" in error) {
            errorMessage = JSON.stringify((error as any).response?.data || error);
        }

        console.error("Erro na API do OpenRouter:", errorMessage);
        return NextResponse.json(
            { error: "Ocorreu um erro ao processar sua requisição.", details: errorMessage },
            { status: 500 }
        );
    }
}
