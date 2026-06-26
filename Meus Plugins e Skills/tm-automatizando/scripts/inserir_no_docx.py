#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""inserir_no_docx.py — Grava narrativa + detalhes + memorial no .docx.

Estratégia:
  - Reaproveitar a função `inserir_conteudo_sp2()` de `word_utils_sp2.py`
    quando rodar dentro do AutoRelatório V4.
  - Quando rodar standalone (skill isolada), usar `python-docx` direto.

Ponto crítico: a INSERÇÃO precisa acontecer **após** o parágrafo da Foto N
correspondente, preservando a paginação original do .docx pré-finalizado.
"""
from __future__ import annotations

from pathlib import Path
from typing import Iterable

# from docx import Document
# from docx.shared import Cm, Pt


def gravar(entrada: Path, saida: Path, blocos: Iterable) -> None:
    """Lê `entrada`, aplica os blocos enriquecidos e salva em `saida`.

    TODO:
      [ ] Document(entrada) → doc
      [ ] Para cada bloco enriquecido:
            • localizar parágrafo da foto narrativa (índice já salvo no Bloco).
            • inserir narrativa abaixo do parágrafo.
            • inserir "-Detalhes:" + parágrafos de cada detalhe.
            • inserir tabela de memorial (replicar layout de
              word_utils_sp2._inserir_memoria_calculo).
      [ ] doc.save(saida)

    NOTA:
      Para inserir parágrafos no MEIO do documento com python-docx é preciso
      usar `paragraph._p.addnext(novo_p._p)` na árvore XML. Já existe lógica
      semelhante em `word_utils_sp2._inserir_imagem` e
      `_inserir_memoria_calculo` — copiar dali para manter consistência visual.
    """
    # PLACEHOLDER: copia sem alterações.
    saida.write_bytes(entrada.read_bytes())


def inserir_tabela_memorial(doc, paragrafo_ref, memorial: dict) -> None:
    """Replica visualmente a tabela do `_inserir_memoria_calculo` do V4.

    Colunas conforme tipo:
      pintura  → [Foto, Comp.(m), Altura(m), Total(m²)]
      metalico → [Foto, Comp.(m), Altura(m), Faces, Total(m²)]
      andaime  → [Foto, Altura(m), (mês), Total(m/mês)]
      unitario → [Foto, Quantidade, Total(un)]
      linear   → [Foto, Comp.(m), Total(m)]
    """
    pass


if __name__ == "__main__":  # pragma: no cover
    import sys
    gravar(Path(sys.argv[1]), Path(sys.argv[2]), [])
    print("Cópia gravada.")
