#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""parser_docx.py — Esqueleto do parser de .docx pré-finalizado (SP2).

Responsabilidades:
1. Abrir o .docx com `python-docx`.
2. Iterar parágrafos preservando a ordem original.
3. Detectar marcadores `Foto N`, medidas (`L,LL x A,AA`) e códigos de item (`(Item 17.4)`).
4. Agrupar em "blocos" — uma narrativa + N detalhes + tabela esperada.
5. Devolver lista de dicionários compatíveis com `gerador_texto`/`gerador_memorial`.

Esta é a versão SKELETON: assinaturas e docstrings prontas, lógica como TODO.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional

# from docx import Document   # python-docx ≥ 1.1
# from docx.text.paragraph import Paragraph


RE_FOTO = re.compile(r"^Foto\s+(\d+)\s*[–\-]?\s*(.*)", re.IGNORECASE)
RE_MEDIDA = re.compile(r"(\d+[,\.]\d+)\s*[xX]\s*(\d+[,\.]\d+)")
RE_ITEM = re.compile(r"\(?\s*[Ii]ten?s?\s+([\d\.\s,e]+?)\s*(?:do contrato)?\s*\)?")
RE_SECAO = re.compile(r"^(\d+(?:\.\d+)?)\s*[–\-]\s*(.+)")


@dataclass
class Foto:
    numero: int
    paragrafo_idx: int
    texto_original: str
    tipo: str = "indef"          # "narrativa" | "detalhe" | "capa" | "indef"
    codigo_item: Optional[str] = None
    medidas: List[tuple[float, float]] = field(default_factory=list)


@dataclass
class Bloco:
    secao: str                   # ex.: "2.1 – SAA Sala de Autoatendimento"
    codigo_item: Optional[str]
    foto_narrativa: Optional[Foto] = None
    fotos_detalhe: List[Foto] = field(default_factory=list)
    medidas_associadas: List[tuple[float, float]] = field(default_factory=list)


def parse_docx_marcado(docx_path: Path) -> List[Bloco]:
    """Lê o .docx e devolve a lista de blocos identificados.

    TODO:
      [ ] Abrir documento com `python-docx`.
      [ ] Iterar `doc.paragraphs` capturando índice e texto.
      [ ] Detectar Foto, Medida, Item, Seção por regex.
      [ ] Classificar Foto:
            - se primeira do bloco e contém "constatamos|durante o levantamento" ou estiver vazia → narrativa
            - se já há narrativa no bloco corrente e texto vazio/curto → detalhe
            - Foto 1 = capa
      [ ] Fechar bloco quando: muda a seção OU surge novo Foto narrativa.
      [ ] Coletar medidas que aparecem entre a foto-narrativa e o próximo Foto.
      [ ] Retornar lista de Blocos preservando ordem.

    NOTA DE PERFORMANCE:
      .docx grandes (>150 fotos) costumam ter 2k+ parágrafos. O parser deve
      ser single-pass O(n) — sem fazer re-leituras.
    """
    blocos: list[Bloco] = []
    # doc = Document(docx_path)
    # secao_atual = ""
    # bloco_atual: Optional[Bloco] = None
    # for idx, p in enumerate(doc.paragraphs):
    #     texto = p.text.strip()
    #     ... (lógica TODO acima)
    return blocos


def classificar_foto(texto: str, contexto_bloco: Optional[Bloco]) -> str:
    """Retorna 'narrativa' | 'detalhe' | 'capa' | 'indef'."""
    t = texto.lower()
    if "agência" in t and "foto 1" in t:
        return "capa"
    if "durante o levantamento" in t or "constatamos" in t or "será necessário" in t:
        return "narrativa"
    if t.startswith("detalhe"):
        return "detalhe"
    return "indef"


def extrair_codigo_item(texto: str) -> Optional[str]:
    """Encontra '17.4' ou '17.6 e 17.2' em uma string. Devolve o primeiro código."""
    m = RE_ITEM.search(texto)
    if not m:
        return None
    tokens = re.findall(r"\d+\.\d+", m.group(1))
    return tokens[0] if tokens else None


def extrair_medidas(texto: str) -> List[tuple[float, float]]:
    """Extrai pares (largura, altura) do texto. Aceita vírgula ou ponto."""
    pares = []
    for ml, ma in RE_MEDIDA.findall(texto):
        try:
            l = float(ml.replace(",", "."))
            a = float(ma.replace(",", "."))
            pares.append((l, a))
        except ValueError:
            continue
    return pares


if __name__ == "__main__":  # pragma: no cover
    import sys
    p = Path(sys.argv[1])
    for b in parse_docx_marcado(p):
        print(b)
