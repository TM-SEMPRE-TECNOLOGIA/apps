#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Captura página inteira com Playwright e salva em HTML + JSON estruturado.
Uso: python capture_page.py <url>
"""

import asyncio
import json
import sys
import os
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

# Force UTF-8 output on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

async def capture_page(url: str, output_dir: Path = Path("captures")):
    """Captura página inteira e salva em múltiplos formatos."""

    output_dir.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )

        print(f"🌐 Navegando para {url}...")
        await page.goto(url, wait_until="networkidle", timeout=60000)

        # Captura HTML completo
        html_content = await page.content()

        # Extrai metadados
        title = await page.title()
        meta_description = await page.locator('meta[name="description"]').get_attribute("content")

        print(f"📄 Título: {title}")
        print(f"📝 Descrição: {meta_description}")

        # Parse HTML com BeautifulSoup para estruturação
        soup = BeautifulSoup(html_content, "html.parser")

        # Remove scripts e styles
        for script in soup(["script", "style"]):
            script.decompose()

        # Extrai seções principais
        sections = []
        for section in soup.find_all(["section", "article", "div"], class_=lambda x: x and ("section" in str(x).lower() or "container" in str(x).lower())):
            section_text = section.get_text(strip=True)
            if section_text:
                sections.append(section_text[:500])  # Primeiros 500 chars

        # Extrai links
        links = []
        for a in soup.find_all("a", href=True):
            link_text = a.get_text(strip=True)
            link_href = a["href"]
            if link_text:
                links.append({
                    "text": link_text,
                    "href": link_href
                })

        # Salva HTML completo
        html_filename = output_dir / f"page_{timestamp}.html"
        with open(html_filename, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"✅ HTML salvo: {html_filename}")

        # Salva JSON estruturado
        json_data = {
            "metadata": {
                "url": url,
                "title": title,
                "description": meta_description,
                "captured_at": datetime.now().isoformat(),
                "total_links": len(links),
                "total_sections": len(sections)
            },
            "links": links[:20],  # Primeiros 20 links
            "sections": sections[:10],  # Primeiras 10 seções
            "full_text": soup.get_text(strip=True)[:5000]  # Primeiros 5000 chars do texto
        }

        json_filename = output_dir / f"page_{timestamp}.json"
        with open(json_filename, "w", encoding="utf-8") as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        print(f"✅ JSON salvo: {json_filename}")

        await browser.close()

        return {
            "html_file": str(html_filename),
            "json_file": str(json_filename),
            "title": title,
            "links_count": len(links),
            "size_html": len(html_content)
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Uso: python capture_page.py <url>")
        print("Exemplo: python capture_page.py https://www.aicoders.academy/")
        sys.exit(1)

    url = sys.argv[1]
    result = asyncio.run(capture_page(url))
    print(f"\n✅ Captura concluída!")
    print(f"   HTML: {result['html_file']}")
    print(f"   JSON: {result['json_file']}")
    print(f"   Links extraídos: {result['links_count']}")
    print(f"   Tamanho HTML: {result['size_html'] / 1024:.1f}KB")
