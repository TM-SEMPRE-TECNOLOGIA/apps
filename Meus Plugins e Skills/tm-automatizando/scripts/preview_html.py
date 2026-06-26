#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""preview_html.py — Gera preview HTML ANTES da skill gravar no .docx.

Para cada bloco identificado, o preview mostra:
  - Miniatura da foto (extraída do .docx)
  - Narrativa proposta
  - Detalhes propostos
  - Tabela de memória (com a CONTA explícita)
  - Botões "marcar como OK / ajustar / rejeitar"

Saída: `<saida>/00_preview/preview_<timestamp>.html`

Esta é a versão ESQUELETO: gera o HTML estático. A interação de botões
é local (estado em localStorage do navegador).
"""
from __future__ import annotations

import html
import json
from datetime import datetime
from pathlib import Path

from persona import TMAutomatizando as TM


CSS = """
:root { --bg:#f6f4f1; --paper:#fff; --ink:#1c1a17; --muted:#4a443d;
        --line:#d9d3ca; --laranja:#d96a1f; --ok:#2f7d4f; --warn:#b07300; --err:#a23131; }
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font-family:Inter,system-ui,sans-serif;line-height:1.5;padding:32px}
.wrap{max-width:1100px;margin:0 auto}
h1{font-family:'Roboto Slab',serif;font-size:30px;margin-bottom:6px}
.lede{color:var(--muted);margin-bottom:28px}
.bloco{background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:22px;margin-bottom:20px}
.bloco h3{margin-bottom:12px}
.row{display:flex;gap:16px;flex-wrap:wrap}
.foto{flex:0 0 280px}
.foto img{width:100%;border-radius:8px;border:1px solid var(--line)}
.conteudo{flex:1;min-width:340px}
.narrativa{background:#fff8ed;padding:12px;border-left:3px solid var(--laranja);border-radius:6px;margin-bottom:10px}
.detalhe{background:#f0ece5;padding:8px 12px;border-radius:6px;margin:4px 0;font-size:14px}
table{border-collapse:collapse;width:100%;margin-top:12px;font-size:14px}
th,td{border:1px solid var(--line);padding:6px 10px;text-align:right}
th{background:#ebe6dd;text-align:center}
td:first-child,th:first-child{text-align:left}
.total{background:#fff8ed;font-weight:600}
.tag{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;letter-spacing:.08em;text-transform:uppercase}
.tag.ok{background:#d4ead8;color:var(--ok)}
.tag.warn{background:#f6e7c4;color:var(--warn)}
.tag.err{background:#f4d2d2;color:var(--err)}
.actions{margin-top:12px;display:flex;gap:8px}
button{font-family:inherit;font-size:13px;padding:7px 14px;border-radius:6px;border:1px solid var(--ink);background:var(--paper);cursor:pointer}
button.aprovar{background:var(--ok);color:#fff;border-color:var(--ok)}
button.rejeitar{background:var(--err);color:#fff;border-color:var(--err)}
.calc{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--muted);margin-top:4px}
"""


def gerar_preview(blocos: list[dict], saida_html: Path, meta: dict) -> None:
    saida_html.parent.mkdir(parents=True, exist_ok=True)
    out = [
        "<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'>",
        f"<title>Preview TM-Automatizando — {meta.get('relatorio','')}</title>",
        f"<style>{CSS}</style></head><body><div class='wrap'>",
        f"<h1>TM-Automatizando · Preview de Validação</h1>",
        f"<p class='lede'>Relatório: <b>{html.escape(meta.get('relatorio',''))}</b> · "
        f"Contrato: <b>{html.escape(meta.get('contrato',''))}</b> · "
        f"Gerado em {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>",
        f"<p class='lede'><b>Padrão editorial:</b> {meta.get('padrao_editorial','Santa Adélia (sem Prezados,)')}</p>",
        f"<p class='lede'>Total de blocos: <b>{len(blocos)}</b> — revise cada um antes da gravação no .docx.</p>",
    ]

    for i, b in enumerate(blocos, 1):
        cod = html.escape(str(b.get("codigo_item", "?")))
        ref = html.escape(b.get("ref", f"Bloco {i}"))
        narr = html.escape(b.get("texto_narrativa", ""))
        img_b64 = b.get("foto_thumb_b64", "")
        memorial = b.get("memorial", {})

        out.append(f"<div class='bloco' id='bloco-{i}'>")
        out.append(f"<h3>{i}. {ref} <span class='tag {b.get('status','warn')}'>{b.get('status','warn').upper()}</span> · Item {cod}</h3>")
        out.append("<div class='row'>")
        if img_b64:
            out.append(f"<div class='foto'><img src='data:image/jpeg;base64,{img_b64}' alt='Foto {ref}'></div>")
        out.append("<div class='conteudo'>")
        out.append(f"<div class='narrativa'>{narr}</div>")
        for d in b.get("detalhes", []):
            out.append(f"<div class='detalhe'>{html.escape(d.get('texto',''))}</div>")
        if memorial:
            out.append(_render_tabela(memorial))
        out.append("<div class='actions'>")
        out.append(f"<button class='aprovar' onclick=\"marcar({i},'ok')\">Aprovar</button>")
        out.append(f"<button onclick=\"marcar({i},'ajustar')\">Marcar para ajuste</button>")
        out.append(f"<button class='rejeitar' onclick=\"marcar({i},'rejeitar')\">Rejeitar</button>")
        out.append("</div></div></div></div>")

    out.append("""
<script>
function marcar(i, estado){
  const k = 'tma_'+i;
  localStorage.setItem(k, estado);
  document.querySelector('#bloco-'+i+' .tag').className = 'tag '+
    (estado==='ok'?'ok':(estado==='rejeitar'?'err':'warn'));
  document.querySelector('#bloco-'+i+' .tag').textContent = estado.toUpperCase();
}
// restore
document.querySelectorAll('.bloco').forEach(el => {
  const i = el.id.split('-')[1];
  const v = localStorage.getItem('tma_'+i);
  if (v) marcar(i, v);
});
</script>
</div></body></html>""")

    saida_html.write_text("\n".join(out), encoding="utf-8")


def _render_tabela(memorial: dict) -> str:
    tipo = memorial.get("tipo_item", "pintura")
    linhas = memorial.get("linhas", [])
    total = memorial.get("total_geral", 0)
    if tipo == "pintura":
        cols = ["Foto", "Comp. (m)", "Altura (m)", "Faces", "Desc.", "Total (m²)"]
        rows = []
        for l in linhas:
            calc = f"{l.get('largura',0):.2f} × {l.get('altura',0):.2f} × {l.get('faces',1)} − {l.get('desconto',0):.2f} = <b>{l.get('total',0):.2f}</b>"
            rows.append(
                f"<tr><td>{html.escape(l.get('referencia',''))}</td>"
                f"<td>{l.get('largura',0):.2f}</td>"
                f"<td>{l.get('altura',0):.2f}</td>"
                f"<td>{l.get('faces',1)}</td>"
                f"<td>{l.get('desconto',0):.2f}</td>"
                f"<td>{l.get('total',0):.2f}<div class='calc'>{calc}</div></td></tr>"
            )
        head = "<tr>" + "".join(f"<th>{c}</th>" for c in cols) + "</tr>"
        body = "".join(rows)
        foot = f"<tr class='total'><td colspan='{len(cols)-1}'>Total</td><td>{total:.2f}</td></tr>"
        return f"<table>{head}{body}{foot}</table>"
    return ""


if __name__ == "__main__":  # pragma: no cover
    print(TM.manifesto())
