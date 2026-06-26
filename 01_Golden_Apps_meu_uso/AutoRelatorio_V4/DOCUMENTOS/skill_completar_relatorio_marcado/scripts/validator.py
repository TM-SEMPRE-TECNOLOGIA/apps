#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""validator.py — Cross-check 4 níveis da TM-Automatizando.

Roda DEPOIS de gerar o conteúdo proposto e ANTES de escrever no .docx.
Gera `crosscheck_report.md` com ✅/⚠/❌ por checagem.

Níveis (decididos com o usuário):
  N1. Aritmética + coerência foto↔código↔frase
  N2. Sequência fotos + cabeçalho vs corpo
  N3. Formatação (negrito, fonte, espaçamento, estilo de tabela)
  N4. Imagens órfãs e legendas duplicadas
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

from persona import TMAutomatizando as TM


@dataclass
class Achado:
    nivel: str            # "OK" | "WARN" | "FAIL"
    categoria: str        # "aritmetica" | "coerencia" | "sequencia" | ...
    mensagem: str
    bloco_ref: str = ""

    @property
    def icone(self) -> str:
        return {"OK": "✅", "WARN": "⚠", "FAIL": "❌"}[self.nivel]


@dataclass
class RelatorioValidacao:
    achados: list[Achado] = field(default_factory=list)

    def add(self, *a, **k): self.achados.append(Achado(*a, **k))

    @property
    def ok(self) -> bool:
        return all(a.nivel != "FAIL" for a in self.achados)

    @property
    def counts(self) -> dict:
        c = {"OK": 0, "WARN": 0, "FAIL": 0}
        for a in self.achados:
            c[a.nivel] += 1
        return c

    def to_markdown(self) -> str:
        c = self.counts
        out = [
            "# Cross-check Report — TM-Automatizando",
            "",
            f"**Total:** {len(self.achados)}  ·  "
            f"✅ {c['OK']}  ·  ⚠ {c['WARN']}  ·  ❌ {c['FAIL']}",
            "",
            "## Achados",
            "",
        ]
        for a in self.achados:
            ref = f" `{a.bloco_ref}`" if a.bloco_ref else ""
            out.append(f"- {a.icone} **{a.categoria}**{ref} — {a.mensagem}")
        return "\n".join(out) + "\n"


# ── N1: Aritmética + coerência ─────────────────────────────────────────

def check_aritmetica(memorial: dict, ref: str, rel: RelatorioValidacao) -> None:
    """Confere L×A×Faces − Desconto = Total em cada linha e soma."""
    soma = 0.0
    for linha in memorial.get("linhas", []):
        l = float(linha.get("largura", 0))
        a = float(linha.get("altura", 0))
        f = int(linha.get("faces", 1))
        d = float(linha.get("desconto", 0))
        t_declarado = float(linha.get("total", 0))
        t_calc = round(l * a * f - d, 2)
        if abs(t_calc - t_declarado) > 0.01:
            rel.add("FAIL", "aritmetica",
                    f"Linha {linha.get('referencia','?')}: {t_calc:.2f} ≠ {t_declarado:.2f}",
                    bloco_ref=ref)
        soma += t_declarado
    total_geral = float(memorial.get("total_geral", 0))
    if abs(soma - total_geral) > 0.01:
        rel.add("FAIL", "aritmetica",
                TM.soma_divergente(ref, total_geral, soma), bloco_ref=ref)


def check_coerencia(bloco: dict, itens_contrato: dict, regras_pintura: dict,
                    contrato_id: str, rel: RelatorioValidacao) -> None:
    """foto↔código↔frase: o código citado entre parênteses bate com a tabela e com o dicionário oficial."""
    cod = bloco.get("codigo_item")
    if not cod:
        rel.add("WARN", "coerencia", "Bloco sem código definido.", bloco_ref=bloco.get("ref", ""))
        return

    # 1. Item existe na planilha oficial?
    if cod not in itens_contrato:
        rel.add("FAIL", "coerencia",
                TM.item_inexistente(cod, contrato_id), bloco_ref=bloco.get("ref", ""))
        return

    # 2. Frase usada cita o código?
    frase = bloco.get("texto_narrativa", "")
    if cod not in frase:
        rel.add("WARN", "coerencia",
                f"Frase narrativa não cita Item {cod}.", bloco_ref=bloco.get("ref", ""))

    # 3. Se for código de pintura (17.x), confere regras_pintura
    if cod.startswith("17."):
        regras = regras_pintura.get("contratos", {}).get(contrato_id, {}).get("regras", [])
        permitidos = [r["codigo"] for r in regras]
        if permitidos and cod not in permitidos:
            usos = [f"{r['codigo']}: {r['uso']}" for r in regras]
            rel.add("FAIL", "coerencia",
                    TM.codigo_fora_da_regra(cod, contrato_id, usos),
                    bloco_ref=bloco.get("ref", ""))


# ── N2: Sequência + cabeçalho ──────────────────────────────────────────

def check_sequencia_fotos(fotos: list[int], rel: RelatorioValidacao) -> None:
    if not fotos:
        rel.add("WARN", "sequencia", "Nenhuma Foto N detectada.")
        return
    esperado = set(range(1, max(fotos) + 1))
    presente = set(fotos)
    gaps = sorted(esperado - presente)
    dups = sorted([n for n in presente if fotos.count(n) > 1])
    if gaps:
        rel.add("FAIL", "sequencia", f"Fotos faltantes: {gaps[:10]}...")
    if dups:
        rel.add("FAIL", "sequencia", f"Fotos duplicadas: {dups[:10]}...")
    if not gaps and not dups:
        rel.add("OK", "sequencia", f"Sequência {min(fotos)}..{max(fotos)} íntegra.")


def check_cabecalho_vs_capa(cabecalho: dict, capa: str, rel: RelatorioValidacao) -> None:
    end = cabecalho.get("endereco", "").upper().replace(" ", "")
    capa_up = capa.upper().replace(" ", "")
    if end and end not in capa_up:
        rel.add("WARN", "cabecalho",
                f"Endereço do cabeçalho não aparece na capa (Foto 1).")


# ── N3: Formatação ─────────────────────────────────────────────────────

def check_formatacao(estilos_doc: dict, rel: RelatorioValidacao) -> None:
    fonte = estilos_doc.get("fonte_predominante", "")
    if fonte and fonte.lower() != "calibri":
        rel.add("WARN", "formatacao",
                f"Fonte predominante é '{fonte}', esperado 'Calibri'.")
    tam = estilos_doc.get("tamanho_predominante_pt", 0)
    if tam and abs(tam - 10) > 0.5:
        rel.add("WARN", "formatacao",
                f"Tamanho predominante é {tam}pt, esperado ~10pt.")


# ── N4: Órfãs + duplicatas ─────────────────────────────────────────────

def check_orfas(num_imagens: int, num_legendas: int, rel: RelatorioValidacao) -> None:
    if num_imagens != num_legendas:
        rel.add("WARN", "orfas",
                f"{num_imagens} imagens embutidas vs {num_legendas} legendas Foto N.")


def check_legendas_duplicadas(legendas: list[str], rel: RelatorioValidacao) -> None:
    vistas = {}
    for i, leg in enumerate(legendas):
        if not leg.startswith("Detalhe"):  # detalhes podem repetir
            key = re.sub(r"\d", "", leg)[:100].strip().lower()
            if key and key in vistas:
                rel.add("WARN", "duplicada",
                        f"Legenda da Foto {i+1} igual à Foto {vistas[key]+1}.")
            vistas[key] = i


# ── Orquestrador ───────────────────────────────────────────────────────

def rodar_crosscheck(blocos: list[dict], contexto: dict) -> RelatorioValidacao:
    rel = RelatorioValidacao()
    itens_oficiais = contexto["itens_contrato"]
    regras = contexto["regras_pintura"]
    contrato_id = contexto["contrato_id"]
    for b in blocos:
        if b.get("memorial"):
            check_aritmetica(b["memorial"], b.get("ref", ""), rel)
        check_coerencia(b, itens_oficiais, regras, contrato_id, rel)
    check_sequencia_fotos(contexto.get("fotos_numeros", []), rel)
    check_cabecalho_vs_capa(contexto.get("cabecalho", {}),
                             contexto.get("capa", ""), rel)
    check_formatacao(contexto.get("estilos_doc", {}), rel)
    check_orfas(contexto.get("num_imagens", 0),
                contexto.get("num_legendas", 0), rel)
    check_legendas_duplicadas(contexto.get("legendas", []), rel)
    return rel


if __name__ == "__main__":  # pragma: no cover
    print(TM.manifesto())
