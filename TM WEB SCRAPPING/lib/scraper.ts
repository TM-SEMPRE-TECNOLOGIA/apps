import { chromium, Browser, Page } from 'playwright';

interface ScrapedData {
  items: string[];
  count: number;
  timestamp: string;
}

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const TIMEOUT_MS = parseInt(process.env.SCRAPER_TIMEOUT_MS || '30000', 10);

export async function scrapeUrl(url: string, selector: string): Promise<ScrapedData> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--disable-blink-features=AutomationControlled'],
    });

    page = await browser.newPage({
      userAgent: USER_AGENT,
    });

    // Adiciona header para parecer um navegador real
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    });

    // Navega para a URL com timeout
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: TIMEOUT_MS,
    });

    // Valida o seletor CSS antes de usar
    const validSelector = validateSelector(selector);

    // Coleta os items do DOM
    const items = await page.evaluate((sel: string) => {
      const elements = document.querySelectorAll(sel);
      return Array.from(elements).map(el => {
        const text = el.textContent || '';
        return text.trim();
      }).filter(text => text.length > 0);
    }, validSelector);

    // Remove duplicatas e ordena
    const uniqueItems = Array.from(new Set(items));

    return {
      items: uniqueItems,
      count: uniqueItems.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao scrape: ${error.message}`);
    }
    throw new Error('Erro desconhecido ao fazer scrape');
  } finally {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }
}

function validateSelector(selector: string): string {
  const trimmed = selector.trim();

  if (!trimmed) {
    throw new Error('Seletor CSS não pode ser vazio');
  }

  // Verifica se é um seletor CSS válido (básico)
  if (!/^[a-zA-Z0-9\s#.\[\]=":>+~*^$|()-]+$/.test(trimmed)) {
    throw new Error('Seletor CSS contém caracteres inválidos');
  }

  return trimmed;
}

export function validateUrl(urlString: string): URL {
  try {
    const url = new URL(urlString);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('URL deve começar com http:// ou https://');
    }
    return url;
  } catch {
    throw new Error('URL inválida');
  }
}
