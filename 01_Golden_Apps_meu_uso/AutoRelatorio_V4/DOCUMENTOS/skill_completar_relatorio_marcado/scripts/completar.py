#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""completar.py — Entrypoint da skill `completar-relatorio-marcado`.

Recebe um .docx SP2 pré-finalizado (só fotos + marcações + medidas) e devolve
uma cópia preenchida com: legendas narrativas, blocos "-Detalhes:" e tabela
de memorial de cálculo.

USO:
    python completar.py --input  RELATORIO.docx \
                        --output RELATORIO_PREENCHIDO.docx \
                        --banco  banco_frases_sp2.json \
                        --itens  itens_contrato.json

Este arquivo é o ESQUELETO — as etapas internas chamam módulos auxiliares
(parser_docx, gerador_texto, gerador_memorial, inserir_no_docx) que ainda
precisam ser implementados. A função `main()` já reflete o fluxo final.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def carregar_json(caminho: Path) -> dict:
    with caminho.open("r", encoding="utf-8") as f:
        return json.load(f)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Completa relatório SP2 pré-finalizado.")
    parser.add_argument("--input", required=True, help="Arquivo .docx de entrada (pré-finalizado).")
    parser.add_argument("--output", required=True, help="Arquivo .docx de saída (proposta).")
    parser.add_argument("--banco", required=True, help="JSON com banco de frases SP2.")
    parser.add_argument("--itens", required=True, help="JSON com itens do contrato SP2.")
    parser.add_argument("--modo", default="sp2", choices=["sp2"], help="Modo (atualmente só sp2).")
    parser.add_argument("--log", default="completar_log.txt", help="Arquivo de log.")
    args = parser.parse_args(argv)

    entrada = Path(args.input)
    saida = Path(args.output)
    banco = carregar_json(Path(args.banco))
    itens = carregar_json(Path(args.itens))

    if not entrada.exists():
        print(f"[ERRO] Arquivo de entrada não encontrado: {entrada}", file=sys.stderr)
        return 1

    # ──────────────────────────────────────────────────────────────────────
    # ETAPA 1 — PARSE
    # ──────────────────────────────────────────────────────────────────────
    # from parser_docx import parse_docx_marcado
    # blocos = parse_docx_marcado(entrada)
    blocos = []  # placeholder

    # ──────────────────────────────────────────────────────────────────────
    # ETAPA 2 — GERAÇÃO TEXTUAL
    # ──────────────────────────────────────────────────────────────────────
    # from gerador_texto import enriquecer_blocos
    # blocos = enriquecer_blocos(blocos, banco, itens)

    # ──────────────────────────────────────────────────────────────────────
    # ETAPA 3 — GERAÇÃO DO MEMORIAL
    # ──────────────────────────────────────────────────────────────────────
    # from gerador_memorial import montar_memoriais
    # blocos = montar_memoriais(blocos, itens)

    # ──────────────────────────────────────────────────────────────────────
    # ETAPA 4 — INSERÇÃO NO DOCX
    # ──────────────────────────────────────────────────────────────────────
    # from inserir_no_docx import gravar
    # gravar(entrada, saida, blocos)

    # ESQUELETO: copia o arquivo intocado e avisa.
    if saida.resolve() != entrada.resolve():
        saida.write_bytes(entrada.read_bytes())

    with open(args.log, "w", encoding="utf-8") as logf:
        logf.write("[OK] Skeleton executou. Blocos identificados: 0 (esqueleto).\n")
        logf.write(f"[INFO] Banco carregado: {len(banco.get('narrativas', {}))} narrativas, "
                   f"{len(banco.get('detalhes', {}))} detalhes.\n")
        logf.write(f"[INFO] Itens contrato carregados: {len(itens.get('itens', {}))}.\n")

    print(f"[OK] Esqueleto rodou. Saída em {saida}.")
    print("Implementar parser_docx.py, gerador_texto.py, gerador_memorial.py, inserir_no_docx.py.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
