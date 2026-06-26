import { NextRequest, NextResponse } from 'next/server';
import { scrapeUrl, validateUrl } from '@/lib/scraper';

export const maxDuration = 60;

interface ScrapeRequest {
  url: string;
  selector: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ScrapeRequest = await request.json();

    // Valida entrada
    if (!body.url || !body.selector) {
      return NextResponse.json(
        { error: 'URL e seletor CSS são obrigatórios' },
        { status: 400 }
      );
    }

    // Valida URL
    try {
      validateUrl(body.url);
    } catch (error) {
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : 'URL inválida',
        },
        { status: 400 }
      );
    }

    // Executa o scraping
    const result = await scrapeUrl(body.url, body.selector);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro no endpoint /api/scrape:', error);

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
