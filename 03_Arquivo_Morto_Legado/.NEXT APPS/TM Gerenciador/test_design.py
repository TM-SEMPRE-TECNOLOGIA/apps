#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""TM-Testes — Design Capture Full — TM Gerenciador"""

import time
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE   = "http://localhost:5000"
SHOTS  = Path(r"C:\Users\thiag\Desktop\APPS\03_Arquivo_Morto_Legado\.NEXT APPS\TM Gerenciador\test_screenshots")
SHOTS.mkdir(exist_ok=True)
results = []

def shot(page, name):
    p = str(SHOTS / f"{name}.png")
    try:
        page.screenshot(path=p, full_page=True)
        print(f"  [IMG] {name}.png")
    except Exception as e:
        print(f"  [WARN] {name}: {e}")
    return p

def ok(n, d=""): results.append((n, True, d)); print(f"  [PASS] {n}" + (f" - {d}" if d else ""))
def fail(n, d=""): results.append((n, False, d)); print(f"  [FAIL] {n}" + (f" - {d[:80]}" if d else ""))

def try_click(page, selectors, timeout=2500):
    for sel in selectors:
        try:
            page.click(sel, timeout=timeout)
            return sel
        except Exception:
            pass
    return None

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=False, slow_mo=600)
    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    errs = []
    page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)

    # ── CARREGAMENTO ──────────────────────────────────────
    print("\n=== CARREGAMENTO ===")
    page.goto(BASE, timeout=30000, wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle", timeout=12000)
    ok("App carrega", page.title())
    shot(page, "01_login_full")

    # ── LOGIN ─────────────────────────────────────────────
    print("\n=== LOGIN ===")
    time.sleep(1.5)
    shot(page, "02_login_roles")

    # Clicar em role Manager
    clicked = try_click(page, [
        "text=Manager", "text=manager", "text=Gerente",
        "button:has-text('Manager')", "button:has-text('Gerente')",
        "[data-role='manager']",
    ])
    if clicked:
        print(f"  Role: {clicked}")
        time.sleep(0.8)
    else:
        # Pegar primeiro botao visivel
        btns = page.locator("button:visible").all()
        print(f"  {len(btns)} botões visíveis")
        if btns:
            btns[0].click()
            time.sleep(0.8)

    shot(page, "03_role_selected")

    # Botao entrar
    entered = try_click(page, [
        "button:has-text('Entrar')",
        "button:has-text('Login')",
        "button:has-text('Acessar')",
        "button:has-text('Continuar')",
        "button[type='submit']",
    ])
    if entered:
        ok("Login realizado")
        time.sleep(2)
    else:
        fail("Botão de login não encontrado")
    shot(page, "04_pos_login")

    # ── DASHBOARD ─────────────────────────────────────────
    print("\n=== DASHBOARD ===")
    time.sleep(1.5)
    shot(page, "05_dashboard_1440")
    page.set_viewport_size({"width": 1920, "height": 1080})
    time.sleep(0.5)
    shot(page, "06_dashboard_1920")
    page.set_viewport_size({"width": 1440, "height": 900})

    # ── NAVEGAÇÃO POR TELAS ───────────────────────────────
    print("\n=== NAVEGAÇÃO ===")
    nav = [
        (["text=Ordens de Serviço", "text=Ordens", "text=OS",
          "nav a:has-text('OS')", "nav a:has-text('Ordens')"], "07_workorders"),
        (["text=Relatórios", "text=Relatorios", "nav a:has-text('Relat')"], "08_relatorios"),
        (["text=Balanço", "text=Balanco", "nav a:has-text('Balan')"], "09_balanco"),
        (["text=Equipe", "nav a:has-text('Equipe')"], "10_equipe"),
        (["text=Agenda", "nav a:has-text('Agenda')"], "11_agenda"),
        (["text=Notificações", "text=Notificacoes", "nav a:has-text('Notif')"], "12_notificacoes"),
        (["text=Dificuldades", "nav a:has-text('Dificul')"], "13_dificuldades"),
        (["text=Importar", "nav a:has-text('Import')"], "14_importar"),
        (["text=Configurações", "text=Configuracoes", "nav a:has-text('Config')"], "15_settings"),
        (["text=Dashboard", "nav a:has-text('Dashboard')"], "16_dashboard_return"),
    ]
    for sels, fname in nav:
        r = try_click(page, sels)
        if r:
            time.sleep(1.5)
            shot(page, fname)
            ok(f"Tela: {fname.split('_',1)[1]}")
        else:
            fail(f"Tela: {fname}")

    # ── SIDEBAR COLAPSADA ─────────────────────────────────
    print("\n=== SIDEBAR COLAPSADA ===")
    collapsed = try_click(page, [
        "button[aria-label*='collapse']",
        "button[aria-label*='sidebar']",
        "button:has-text('«')",
        "[data-sidebar-toggle]",
        "button.sidebar-toggle",
    ])
    if collapsed:
        time.sleep(1)
        shot(page, "17_sidebar_collapsed")
        try_click(page, ["button[aria-label*='expand']", collapsed])
        time.sleep(0.8)

    # ── RESPONSIVIDADE ────────────────────────────────────
    print("\n=== RESPONSIVIDADE ===")
    page.set_viewport_size({"width": 375, "height": 812})
    time.sleep(1)
    shot(page, "18_mobile_375")
    page.set_viewport_size({"width": 768, "height": 1024})
    time.sleep(0.5)
    shot(page, "19_tablet_768")
    page.set_viewport_size({"width": 1440, "height": 900})
    time.sleep(0.5)

    # ── CORES VIA JS ─────────────────────────────────────
    print("\n=== ANÁLISE DE CORES ===")
    try:
        cor = page.evaluate("""() => {
            const btn = document.querySelector('button.bg-primary, [class*=bg-primary], nav a[class*=active], nav a[aria-current]');
            if (btn) return window.getComputedStyle(btn).backgroundColor;
            const style = getComputedStyle(document.documentElement);
            return style.getPropertyValue('--primary') || style.getPropertyValue('--color-primary') || 'n/a';
        }""")
        ok(f"Cor primária detectada", cor)
    except Exception as e:
        fail("Análise de cores", str(e))

    # ── MODAL / FORM ──────────────────────────────────────
    print("\n=== MODAL NOVA OS ===")
    # Tentar abrir modal de nova OS
    modal_btn = try_click(page, [
        "button:has-text('Nova OS')",
        "button:has-text('Nova Ordem')",
        "button:has-text('Criar')",
        "button:has-text('Adicionar')",
        "button:has-text('+')",
    ])
    if modal_btn:
        time.sleep(1.5)
        shot(page, "20_modal_nova_os")
        try_click(page, ["button:has-text('Cancelar')", "button:has-text('Fechar')", "[aria-label='Close']", "button:has-text('×')"])
        time.sleep(0.5)

    # ── ESTADO FINAL ──────────────────────────────────────
    shot(page, "99_estado_final")
    b.close()

# ── RELATÓRIO ─────────────────────────────────────────────
total  = len(results)
passed = sum(1 for _, p, _ in results if p)
pct    = round(passed / total * 100) if total else 0
shots  = sorted(SHOTS.glob("*.png"))

print(f"\n{'='*55}")
print(f"  TM-TESTES — RESULTADO FINAL")
print(f"  {passed}/{total} passaram ({pct}%)")
print(f"  {len(shots)} screenshots capturadas")
for n, p, d in results:
    print(f"  {'[PASS]' if p else '[FAIL]'} {n}" + (f" - {d}" if d else ""))
print(f"{'='*55}")

# HTML report
rows = "".join(
    f'<tr><td style="color:{"#16a34a" if p else "#dc2626"};font-weight:bold">{"PASS" if p else "FAIL"}</td>'
    f'<td>{n}</td><td style="color:#6b7280;font-size:13px">{d}</td></tr>'
    for n, p, d in results
)
imgs = "".join(
    f'<div style="margin:20px 0"><p style="font-size:12px;color:#9ca3af;margin:0 0 6px">{s.name}</p>'
    f'<img src="{s}" style="max-width:100%;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.1)"></div>'
    for s in shots
)
errs_html = "".join(f'<li style="color:#dc2626;font-size:13px">{e[:200]}</li>' for e in errs[:15]) or '<li style="color:#16a34a">Sem erros críticos</li>'

html = f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8">
<title>TM-Testes — Design Audit TM Gerenciador</title>
<style>body{{font-family:system-ui,sans-serif;max-width:1200px;margin:0 auto;padding:24px;background:#f9fafb;color:#111}}
h1{{font-size:22px}}h2{{font-size:16px;margin:24px 0 8px;color:#374151}}
table{{width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)}}
th{{background:#f3f4f6;padding:10px 14px;text-align:left;font-size:13px}}
td{{padding:9px 14px;border-top:1px solid #e5e7eb;font-size:14px}}</style></head><body>
<h1>TM-Testes — Design Audit: TM Gerenciador Legado</h1>
<p style="color:#6b7280">Gerado em {time.strftime('%d/%m/%Y %H:%M')} | {passed}/{total} ({pct}%) | {len(shots)} screenshots</p>
<h2>Resultados</h2>
<table><tr><th>Status</th><th>Teste</th><th>Detalhe</th></tr>{rows}</table>
<h2>Console Errors</h2><ul>{errs_html}</ul>
<h2>Screenshots ({len(shots)})</h2>{imgs}
</body></html>"""

rpt = Path(r"C:\Users\thiag\Desktop\APPS\03_Arquivo_Morto_Legado\.NEXT APPS\TM Gerenciador\test_report.html")
rpt.write_text(html, encoding="utf-8")
print(f"  Relatório: {rpt}")
