#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""exportar_etapas.py — Exporta CADA composição gerada como arquivo separado.

Decisão do usuário: além de inserir no .docx, cada composição (legenda,
tabela, item, memorial consolidado) precisa virar arquivo individual.

Estrutura de saída:

    saida/<nome_relatorio>/
    ├── 00_preview/
    │   └── preview_<timestamp>.html        ← preview interativo
    ├── 01_cabecalho/
    │   └── cabecalho.json
    ├── 02_capa/
    │   ├── capa.txt
    │   └── capa_foto1.jpg
    ├── 03_blocos/
    │   ├── bloco_001_narrativa.md
    │   ├── bloco_001_detalhes.md
    │   ├── bloco_001_tabela.xlsx
    │   ├── bloco_001_tabela.csv          ← também CSV para inspeção rápida
    │   └── ...
    ├── 04_memorial_consolidado.xlsx       ← todas as tabelas em 1 planilha
    ├── 05_crosscheck.md                   ← N1..N4 ✅/⚠/❌
    ├── 06_proposta_novas_frases.md        ← curadoria
    └── 07_resumo.md                       ← visão geral final
"""
from __future__ import annotations

import csv
import json
from datetime import datetime
from pathlib import Path
from typing import Iterable

from persona import TMAutomatizando as TM


def montar_estrutura(saida_base: Path, nome_relatorio: str) -> Path:
    raiz = saida_base / nome_relatorio
    for sub in ("00_preview", "01_cabecalho", "02_capa", "03_blocos"):
        (raiz / sub).mkdir(parents=True, exist_ok=True)
    return raiz


def salvar_cabecalho(raiz: Path, cabecalho: dict) -> None:
    (raiz / "01_cabecalho" / "cabecalho.json").write_text(
        json.dumps(cabecalho, ensure_ascii=False, indent=2), encoding="utf-8")


def salvar_capa(raiz: Path, texto_capa: str, foto_bytes: bytes | None = None) -> None:
    (raiz / "02_capa" / "capa.txt").write_text(texto_capa, encoding="utf-8")
    if foto_bytes:
        (raiz / "02_capa" / "capa_foto1.jpg").write_bytes(foto_bytes)


def salvar_bloco(raiz: Path, idx: int, bloco: dict) -> None:
    p = raiz / "03_blocos"
    pref = f"bloco_{idx:03d}"

    # Narrativa
    (p / f"{pref}_narrativa.md").write_text(
        f"# Bloco {idx} · Item {bloco.get('codigo_item','?')}\n\n"
        f"**Foto-ref:** {bloco.get('ref','')}\n\n"
        f"{bloco.get('texto_narrativa','')}\n",
        encoding="utf-8")

    # Detalhes
    if bloco.get("detalhes"):
        lines = [f"# Detalhes do bloco {idx}\n"]
        for j, d in enumerate(bloco["detalhes"], 1):
            lines.append(f"## Detalhe {j}\n\n{d.get('texto','')}\n")
        (p / f"{pref}_detalhes.md").write_text("\n".join(lines), encoding="utf-8")

    # Tabela CSV
    memorial = bloco.get("memorial")
    if memorial and memorial.get("linhas"):
        csv_path = p / f"{pref}_tabela.csv"
        cols = ["Foto", "Comp.(m)", "Altura(m)", "Faces", "Desconto", "Total(m²)"]
        with csv_path.open("w", newline="", encoding="utf-8") as f:
            w = csv.writer(f, delimiter=";")
            w.writerow(cols)
            for l in memorial["linhas"]:
                w.writerow([
                    l.get("referencia",""),
                    f"{l.get('largura',0):.2f}",
                    f"{l.get('altura',0):.2f}",
                    l.get("faces",1),
                    f"{l.get('desconto',0):.2f}",
                    f"{l.get('total',0):.2f}",
                ])
            w.writerow(["Total", "", "", "", "", f"{memorial.get('total_geral',0):.2f}"])


def salvar_memorial_consolidado(raiz: Path, blocos: list[dict]) -> None:
    """Gera 04_memorial_consolidado.xlsx com 1 aba por bloco + aba 'Resumo'."""
    try:
        import openpyxl
    except ImportError:
        # fallback: gera CSV consolidado
        path = raiz / "04_memorial_consolidado.csv"
        with path.open("w", newline="", encoding="utf-8") as f:
            w = csv.writer(f, delimiter=";")
            w.writerow(["Bloco", "Item", "Foto", "Comp.(m)", "Altura(m)", "Faces", "Desc.", "Total(m²)"])
            for i, b in enumerate(blocos, 1):
                for l in (b.get("memorial",{}) or {}).get("linhas", []):
                    w.writerow([
                        i, b.get("codigo_item",""), l.get("referencia",""),
                        f"{l.get('largura',0):.2f}", f"{l.get('altura',0):.2f}",
                        l.get("faces",1), f"{l.get('desconto',0):.2f}",
                        f"{l.get('total',0):.2f}"
                    ])
        return

    wb = openpyxl.Workbook()
    ws_resumo = wb.active
    ws_resumo.title = "Resumo"
    ws_resumo.append(["Bloco", "Ref", "Código", "Total"])
    for i, b in enumerate(blocos, 1):
        m = b.get("memorial", {}) or {}
        ws_resumo.append([i, b.get("ref",""), b.get("codigo_item",""), m.get("total_geral", 0)])
        ws_b = wb.create_sheet(title=f"Bloco {i}"[:30])
        ws_b.append(["Foto", "Comp.(m)", "Altura(m)", "Faces", "Desc.", "Total(m²)"])
        for l in m.get("linhas", []):
            ws_b.append([
                l.get("referencia",""),
                round(l.get("largura",0), 2),
                round(l.get("altura",0), 2),
                l.get("faces", 1),
                round(l.get("desconto",0), 2),
                round(l.get("total",0), 2),
            ])
        ws_b.append(["Total", "", "", "", "", round(m.get("total_geral", 0), 2)])
    wb.save(raiz / "04_memorial_consolidado.xlsx")


def salvar_crosscheck(raiz: Path, relatorio_md: str) -> None:
    (raiz / "05_crosscheck.md").write_text(relatorio_md, encoding="utf-8")


def salvar_proposta_curador(raiz: Path, proposta_md: str) -> None:
    (raiz / "06_proposta_novas_frases.md").write_text(proposta_md, encoding="utf-8")


def salvar_resumo(raiz: Path, meta: dict, blocos: list[dict], crosscheck_counts: dict) -> None:
    lines = [
        f"# Resumo — {meta.get('relatorio','')}",
        "",
        f"_Gerado por TM-Automatizando em {datetime.now().strftime('%Y-%m-%d %H:%M')}_",
        "",
        f"- **Contrato:** {meta.get('contrato','')}",
        f"- **Padrão editorial:** {meta.get('padrao_editorial','Santa Adélia (sem Prezados,)')}",
        f"- **Total de blocos:** {len(blocos)}",
        f"- **Cross-check:** ✅ {crosscheck_counts.get('OK',0)} · ⚠ {crosscheck_counts.get('WARN',0)} · ❌ {crosscheck_counts.get('FAIL',0)}",
        "",
        "## Arquivos gerados",
        "",
        "- `00_preview/preview_*.html`",
        "- `01_cabecalho/cabecalho.json`",
        "- `02_capa/capa.txt` (+ foto)",
        "- `03_blocos/bloco_XXX_*.md|csv`",
        "- `04_memorial_consolidado.xlsx`",
        "- `05_crosscheck.md`",
        "- `06_proposta_novas_frases.md`",
        "",
        "Revise os arquivos individuais antes de aprovar a gravação final no .docx.",
    ]
    (raiz / "07_resumo.md").write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":  # pragma: no cover
    print(TM.manifesto())
