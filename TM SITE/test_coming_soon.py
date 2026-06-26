#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""TM-Testes — coming soon page"""

import subprocess, time, sys, socket
from pathlib import Path
from playwright.sync_api import sync_playwright

PORT     = 8181
BASE_URL = f"http://localhost:{PORT}"
SHOTS    = Path("test_screenshots")
results  = []

def add(name, ok, detail="", shot=""):
    results.append({"name": name, "ok": ok, "detail": detail, "shot": shot})
    print(f"  {'[PASS]' if ok else '[FAIL]'} {name}" + (f" — {detail[:100]}" if not ok and detail else ""))

def screenshot(page, name):
    SHOTS.mkdir(exist_ok=True)
    p = str(SHOTS / f"{name}.png")
    try: page.screenshot(path=p, full_page=True)
    except: pass
    return p

def run():
    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    time.sleep(1.5)

    try:
        with sync_playwright() as pw:
            console_errors = []
            browser = pw.chromium.launch(headless=True)
            ctx = browser.new_context(viewport={"width": 1440, "height": 900})
            page = ctx.new_page()
            page.on("console", lambda m: console_errors.append(f"[{m.type}] {m.text}") if m.type == "error" else None)
            page.on("pageerror", lambda e: console_errors.append(f"[PAGEERROR] {e}"))

            # 1 — carregamento
            try:
                page.goto(f"{BASE_URL}/tm-coming-soon.html", timeout=30000, wait_until="networkidle")
                add("Página carrega sem crash", True, f"title={page.title()!r}")
                screenshot(page, "01_full_page")
            except Exception as e:
                add("Página carrega sem crash", False, str(e)[:120])

            # 2 — hero banner visível
            banner = page.locator(".hero img").first
            try:
                banner.wait_for(timeout=5000)
                box = banner.bounding_box()
                ok = box and box["width"] > 100 and box["height"] > 100
                add("Hero banner renderizado", ok, f"w={box['width'] if box else '?'} h={box['height'] if box else '?'}")
                screenshot(page, "02_hero")
            except Exception as e:
                add("Hero banner renderizado", False, str(e)[:80])

            # 3 — logo ausente no banner (como o usuário pediu remover)
            logo_count = page.locator(".hero-logo").count()
            add("Logo removido do banner", logo_count == 0, f"encontrou {logo_count} elementos .hero-logo")

            # 4 — badge "em construção"
            badge = page.locator(".badge")
            try:
                badge.wait_for(timeout=3000)
                txt = badge.text_content()
                add("Badge 'Em construção' visível", "construção" in txt.lower(), f"texto={txt!r}")
            except Exception as e:
                add("Badge visível", False, str(e)[:80])

            # 5 — headline
            h1 = page.locator("h1.headline")
            try:
                h1.wait_for(timeout=3000)
                txt = h1.text_content()
                add("Headline presente", bool(txt and len(txt) > 5), f"texto={txt[:60]!r}")
            except Exception as e:
                add("Headline presente", False, str(e)[:80])

            # 6 — barra de progresso
            bar = page.locator(".progress-bar")
            try:
                bar.wait_for(timeout=3000)
                add("Barra de progresso presente", True)
            except:
                add("Barra de progresso presente", False)

            # 7 — botão WhatsApp com número correto
            wa = page.locator("a.btn-primary[href*='wa.me']")
            try:
                wa.wait_for(timeout=3000)
                href = wa.get_attribute("href") or ""
                ok = "5562996046458" in href
                add("WhatsApp com número correto", ok, f"href={href}")
            except Exception as e:
                add("WhatsApp link presente", False, str(e)[:80])

            # 8 — responsivo mobile
            ctx2 = browser.new_context(viewport={"width": 390, "height": 844})
            page2 = ctx2.new_page()
            try:
                page2.goto(f"{BASE_URL}/tm-coming-soon.html", wait_until="networkidle", timeout=20000)
                screenshot(page2, "03_mobile")
                add("Responsivo mobile (390px)", True)
            except Exception as e:
                add("Responsivo mobile", False, str(e)[:80])
            ctx2.close()

            # 9 — erros de console
            IGNORAR = ["favicon", "fonts.googleapis", "fonts.gstatic", "analytics", "cdn."]
            criticos = [e for e in console_errors if not any(p in e for p in IGNORAR)]
            if criticos:
                add(f"Erros críticos no console ({len(criticos)})", False, criticos[0][:120])
            else:
                add("Sem erros críticos no console", True)

            screenshot(page, "99_estado_final")
            browser.close()

    finally:
        server.terminate()

    # resultado
    total = len(results)
    passou = sum(1 for r in results if r["ok"])
    pct = int(passou / total * 100) if total else 0

    print()
    print("=" * 60)
    print(f"  TM-TESTES — RESULTADO FINAL")
    print(f"  {passou}/{total} testes passaram ({pct}%)")
    print("=" * 60)
    for r in results:
        print(f"  {'[PASS]' if r['ok'] else '[FAIL]'} {r['name']}")
    print("=" * 60)
    print(f"  Screenshots: test_screenshots/")
    print("=" * 60)

    return results

if __name__ == "__main__":
    run()
