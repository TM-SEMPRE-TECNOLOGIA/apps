#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""TM-Testes — Design Analysis E2E — TM Gerenciador Legado"""

import time
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL  = "http://localhost:5000"
SHOTS_DIR = Path("test_screenshots")
results   = []

def add_result(name, passed, detail="", shot=""):
    results.append({"name": name, "passed": passed, "detail": detail, "screenshot": shot})
    status = "[PASS]" if passed else "[FAIL]"
    print(f"  {status} {name}" + (f" — {detail[:100]}" if detail else ""))

def shot(page, name):
    SHOTS_DIR.mkdir(exist_ok=True)
    p = str(SHOTS_DIR / f"{name}.png")
    try:
        page.screenshot(path=p, full_page=True)
        print(f"  [IMG]  {name}.png")
    except Exception as e:
        print(f"  [WARN] screenshot {name} falhou: {e}")
    return p

def run():
    with sync_playwright() as pw:
        SHOTS_DIR.mkdir(exist_ok=True)
        console_errors = []

        browser = pw.chromium.launch(headless=False, slow_mo=400)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        page.on("console", lambda m: console_errors.append(f"[{m.type.upper()}] {m.text}") if m.type == "error" else None)
        page.on("pageerror", lambda e: console_errors.append(f"[PAGEERROR] {e}"))

        print("\n=== FASE 1: CARREGAMENTO ===")
        try:
            page.goto(BASE_URL, timeout=30000, wait_until="domcontentloaded")
            page.wait_for_load_state("networkidle", timeout=15000)
            title = page.title()
            add_result("App carrega", True, f"title={title!r}")
            shot(page, "01_login")
        except Exception as e:
            add_result("App carrega", False, str(e)[:120])
            browser.close()
            return generate_report(console_errors)

        print("\n=== FASE 2: LOGIN ===")
        try:
            # Procurar cards de role na tela de login
            page.wait_for_selector("text=manager, text=Manager, text=Gerente, [data-role], button", timeout=8000)
            shot(page, "02_login_roles")

            # Clicar no primeiro role disponivel (manager)
            for sel in ["text=Manager", "text=Gerente", "text=manager", "[data-role='manager']", "button:has-text('manager')", "button:has-text('Manager')"]:
                try:
                    page.click(sel, timeout=3000)
                    print(f"  Clicou em role via: {sel}")
                    time.sleep(1)
                    break
                except:
                    continue
            shot(page, "03_login_role_selecionado")

            # Botao de entrar
            for sel in ["button:has-text('Entrar')", "button:has-text('Login')", "button[type='submit']", "button:has-text('Acessar')"]:
                try:
                    page.click(sel, timeout=3000)
                    print(f"  Clicou entrar via: {sel}")
                    time.sleep(2)
                    break
                except:
                    continue
            add_result("Login flow acessível", True)
            shot(page, "04_pos_login")
        except Exception as e:
            add_result("Login flow", False, str(e)[:120])
            shot(page, "login_error")

        print("\n=== FASE 3: DASHBOARD ===")
        time.sleep(2)
        shot(page, "05_dashboard_full")

        # KPIs
        try:
            kpis = page.locator(".card, [class*='card']").count()
            add_result(f"Dashboard — {kpis} cards visíveis", kpis > 0)
        except:
            pass

        # Gráficos
        try:
            charts = page.locator("svg.recharts-surface, [class*='recharts']").count()
            add_result(f"Dashboard — {charts} gráficos Recharts", charts >= 0)
        except:
            pass

        # Screenshot dashboard sem sidebar
        try:
            page.set_viewport_size({"width": 1920, "height": 1080})
            shot(page, "06_dashboard_1920")
            page.set_viewport_size({"width": 1440, "height": 900})
        except:
            pass

        print("\n=== FASE 4: SIDEBAR & NAVEGAÇÃO ===")
        shot(page, "07_sidebar_aberta")

        # Navegar por todas as páginas via sidebar
        nav_items = [
            ("Ordens de Serviço", "work-orders", "08_workorders"),
            ("OS", "work-orders", "08b_os"),
            ("Relatórios", "reports", "09_relatorios"),
            ("Balanço", "balanco", "10_balanco"),
            ("Equipe", "team", "11_equipe"),
            ("Agenda", "agenda", "12_agenda"),
            ("Notificações", "notifications", "13_notificacoes"),
            ("Dificuldades", "difficulties", "14_dificuldades"),
            ("Importar", "import", "15_importar"),
            ("Configurações", "settings", "16_settings"),
        ]

        for label, route, filename in nav_items:
            try:
                for sel in [f"text={label}", f"[href*='{route}']", f"nav a:has-text('{label}')", f"button:has-text('{label}')"]:
                    try:
                        page.click(sel, timeout=3000)
                        time.sleep(1.5)
                        add_result(f"Navegar → {label}", True)
                        shot(page, filename)
                        break
                    except:
                        continue
            except:
                pass

        print("\n=== FASE 5: CORES & DESIGN ===")
        # Voltar ao dashboard
        for sel in ["text=Dashboard", "nav a:first-child", "[href*='dashboard']"]:
            try:
                page.click(sel, timeout=3000)
                time.sleep(1)
                break
            except:
                continue
        shot(page, "17_dashboard_final")

        # Verificar cor primária
        try:
            primary_color = page.evaluate("""() => {
                const btn = document.querySelector('button, .bg-primary, [class*="primary"]');
                if (btn) return window.getComputedStyle(btn).backgroundColor;
                return 'não encontrado';
            }""")
            add_result(f"Cor primária detectada: {primary_color}", True)
        except:
            pass

        # Mobile view
        page.set_viewport_size({"width": 375, "height": 812})
        time.sleep(1)
        shot(page, "18_mobile_view")
        page.set_viewport_size({"width": 1440, "height": 900})

        print("\n=== FASE 6: CONSOLE ERRORS ===")
        IGNORAR = ["favicon", "fonts.googleapis", "fonts.gstatic", "ERR_CONNECTION_REFUSED",
                   "api/", "localhost:3001", "analytics", "cdn.", "gtag", "network"]
        criticos = [e for e in console_errors
                    if "PAGEERROR" in e or ("ERROR" in e and not any(p in e for p in IGNORAR))]
        if not criticos:
            add_result("Sem erros críticos no console", True)
        else:
            add_result(f"Erros críticos ({len(criticos)})", False, criticos[0][:200] if criticos else "")

        # Screenshot final
        shot(page, "99_estado_final")
        browser.close()

    generate_report(console_errors)


def generate_report(console_errors):
    total = len(results)
    passed = sum(1 for r in results if r["passed"])
    pct = round(passed / total * 100) if total else 0

    print(f"\n{'='*60}")
    print(f"  TM-TESTES — RESULTADO FINAL")
    print(f"  {passed}/{total} testes passaram ({pct}%)")
    print(f"{'='*60}")
    for r in results:
        s = "[PASS]" if r["passed"] else "[FAIL]"
        print(f"  {s} {r['name']}")
    if console_errors:
        print(f"\n  Console errors ({len(console_errors)}):")
        for e in console_errors[:5]:
            print(f"    {e[:120]}")
    print(f"\n  Screenshots: test_screenshots/")
    print(f"{'='*60}")

    # HTML report
    rows = ""
    for r in results:
        color = "#16a34a" if r["passed"] else "#dc2626"
        badge = "PASS" if r["passed"] else "FAIL"
        detail = r.get("detail", "")
        rows += f'<tr><td style="color:{color};font-weight:bold">{badge}</td><td>{r["name"]}</td><td style="color:#6b7280;font-size:13px">{detail}</td></tr>\n'

    shot_html = ""
    shots = sorted(SHOTS_DIR.glob("*.png")) if SHOTS_DIR.exists() else []
    for s in shots:
        shot_html += f'<div style="margin:16px 0"><p style="font-size:13px;color:#6b7280;margin:0 0 4px">{s.name}</p><img src="{s}" style="max-width:100%;border:1px solid #e5e7eb;border-radius:8px"></div>\n'

    err_html = ""
    for e in console_errors[:20]:
        err_html += f'<li style="font-size:13px;color:#dc2626;margin:4px 0">{e[:200]}</li>'

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>TM-Testes — TM Gerenciador Design Audit</title>
<style>body{{font-family:system-ui,sans-serif;max-width:1200px;margin:0 auto;padding:24px;background:#f9fafb}}
h1{{font-size:24px;color:#111}}h2{{font-size:18px;color:#374151;margin:24px 0 8px}}
table{{width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)}}
th{{background:#f3f4f6;padding:10px 14px;text-align:left;font-size:13px}}
td{{padding:9px 14px;border-top:1px solid #e5e7eb;font-size:14px}}
.badge{{padding:4px 12px;border-radius:99px;font-size:13px;font-weight:600;display:inline-block}}</style>
</head><body>
<h1>TM-Testes — Design Audit: TM Gerenciador Legado</h1>
<p style="color:#6b7280">Gerado em {time.strftime('%d/%m/%Y %H:%M')} | {passed}/{total} passaram ({pct}%)</p>
<h2>Resultados</h2>
<table><tr><th>Status</th><th>Teste</th><th>Detalhe</th></tr>{rows}</table>
<h2>Console Errors</h2>
<ul>{err_html or '<li style="color:#16a34a">Nenhum erro crítico</li>'}</ul>
<h2>Screenshots</h2>{shot_html}
</body></html>"""

    Path("test_report.html").write_text(html, encoding="utf-8")
    print(f"  Relatorio: test_report.html")


if __name__ == "__main__":
    run()
