#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""curador.py — Curadoria manual do banco_frases_sp2.json.

A cada execução, detecta frases NOVAS (não presentes no banco) e gera
`proposta_novas_frases.md` para você aprovar item por item.

Princípios:
  - Banco cresce SÓ com sua aprovação (zero auto-aprendizado).
  - Cada frase nova é proposta com:
      * texto candidato
      * código do item
      * exemplo de uso (qual foto/relatório a gerou)
      * sugestão de chave no banco
  - Você marca ✅ aprovar / ✏️ ajustar / ❌ rejeitar no arquivo;
    skill relê na próxima execução e aplica.
"""
from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path

from persona import TMAutomatizando as TM


def normalizar(s: str) -> str:
    """Normaliza para comparação: remove números, espaços, caixa."""
    s = re.sub(r"\d", "", s)
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s


def detectar_frases_novas(blocos: list[dict], banco: dict) -> list[dict]:
    """Compara cada frase usada nos blocos vs. banco existente."""
    propostas = []
    narrs_banco = {normalizar(v): k for k, v in banco.get("narrativas", {}).items()}
    dets_banco = {normalizar(v): k for k, v in banco.get("detalhes", {}).items()}

    for b in blocos:
        cod = b.get("codigo_item", "?")
        # Narrativa
        narr = b.get("texto_narrativa", "").strip()
        if narr and normalizar(narr) not in narrs_banco:
            propostas.append({
                "tipo": "narrativa",
                "codigo": cod,
                "texto": narr,
                "chave_sugerida": f"{cod}_{_slug(narr)}",
                "exemplo": b.get("ref", ""),
            })
        # Detalhes
        for det in b.get("detalhes", []):
            t = det.get("texto", "").strip()
            if t and normalizar(t) not in dets_banco:
                propostas.append({
                    "tipo": "detalhe",
                    "codigo": cod,
                    "texto": t,
                    "chave_sugerida": f"{cod}_{_slug(t)}",
                    "exemplo": b.get("ref", ""),
                })
    return propostas


def _slug(s: str, n: int = 4) -> str:
    s = re.sub(r"[^a-zA-ZÀ-ſ]+", " ", s).strip()
    palavras = s.lower().split()
    return "_".join(palavras[:n])


def gerar_proposta_md(propostas: list[dict], saida: Path) -> None:
    """Gera arquivo para o usuário aprovar."""
    if not propostas:
        saida.write_text(
            "# Proposta de novas frases\n\nNenhuma frase nova detectada.\n",
            encoding="utf-8")
        return

    out = [
        "# Proposta de novas frases — TM-Automatizando",
        "",
        f"_Gerado em {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}_",
        "",
        "## Como usar",
        "",
        "Para cada frase abaixo, marque ANTES da palavra `STATUS:`:",
        "",
        "- `APROVAR` — grava como está no banco",
        "- `AJUSTAR: <novo texto>` — grava o ajustado",
        "- `REJEITAR` — descarta",
        "",
        "Salve este arquivo. Na próxima execução a skill lê e aplica.",
        "",
        "---",
        "",
    ]
    for i, p in enumerate(propostas, 1):
        out.extend([
            f"## {i}. {p['tipo'].title()} · Item {p['codigo']}",
            "",
            f"**Chave sugerida:** `{p['chave_sugerida']}`",
            f"**Exemplo:** {p['exemplo']}",
            "",
            "> " + p["texto"].replace("\n", "\n> "),
            "",
            "STATUS: ___ (APROVAR | AJUSTAR: ... | REJEITAR)",
            "",
            "---",
            "",
        ])
    saida.write_text("\n".join(out), encoding="utf-8")


def aplicar_aprovacoes(propostas_md: Path, banco: dict, banco_path: Path) -> dict:
    """Lê o markdown editado pelo usuário e aplica APROVAR/AJUSTAR ao banco."""
    texto = propostas_md.read_text(encoding="utf-8")
    blocos = re.split(r"^## \d+\. ", texto, flags=re.M)[1:]
    aplicadas = {"aprovadas": 0, "ajustadas": 0, "rejeitadas": 0}
    for bl in blocos:
        m_tipo = re.match(r"(\w+)\s*·\s*Item\s+([\d\.]+)", bl)
        m_chave = re.search(r"\*\*Chave sugerida:\*\*\s*`([^`]+)`", bl)
        m_txt = re.search(r"\n> (.+?)\n\nSTATUS:", bl, re.S)
        m_status = re.search(r"STATUS:\s*(\w+)(?::\s*(.+))?", bl)
        if not (m_tipo and m_chave and m_txt and m_status):
            continue
        tipo = m_tipo.group(1).lower()
        chave = m_chave.group(1)
        texto_original = m_txt.group(1).replace("\n> ", "\n").strip()
        status = m_status.group(1).upper()
        ajuste = (m_status.group(2) or "").strip()

        secao = "narrativas" if tipo == "narrativa" else "detalhes"
        if status == "APROVAR":
            banco.setdefault(secao, {})[chave] = texto_original
            aplicadas["aprovadas"] += 1
        elif status == "AJUSTAR" and ajuste:
            banco.setdefault(secao, {})[chave] = ajuste
            aplicadas["ajustadas"] += 1
        elif status == "REJEITAR":
            aplicadas["rejeitadas"] += 1

    banco_path.write_text(json.dumps(banco, ensure_ascii=False, indent=2), encoding="utf-8")
    return aplicadas


if __name__ == "__main__":  # pragma: no cover
    print(TM.manifesto())
