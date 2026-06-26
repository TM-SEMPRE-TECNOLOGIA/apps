#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""gerador_texto.py — Usa o banco de frases SP2 para enriquecer cada Bloco.

Para cada bloco identificado pelo parser:
  1. Determina a chave do banco a partir de (codigo_item, ambiente).
  2. Aplica `{qtd}`, `{ambiente}`, `{item}` por substituição simples.
  3. Define legendas curtas para cada foto-detalhe.
"""
from __future__ import annotations

from typing import Iterable

# from parser_docx import Bloco, Foto


# Mapeamento "ambiente hint" → sufixo da chave
HINTS_NARRATIVA = {
    "17.4": {
        "mureta amarela": "17.4_pintura_mureta_amarela",
        "mureta": "17.4_pintura_mureta_calcada",
        "parede": "17.4_pintura_externa_parede",
        "_default": "17.4_pintura_externa_parede",
    },
    "17.9": {"_default": "17.9_pintura_automotiva_fachada"},
    "17.1": {
        "portão": "17.1_pintura_metalica_portao",
        "portal": "17.1_pintura_metalica_portao",
        "escada": "17.1_pintura_metalica_escada",
        "grade": "17.1_pintura_metalica_grade_janela_longa",
        "_default": "17.1_pintura_metalica_grade_janela_longa",
    },
    "17.8": {"_default": "17.8_pintura_piso_resina"},
    "17.6": {
        "saa": "17.6_pintura_interna_saa",
        "_default": "17.6_pintura_interna_generica",
    },
    "2.12": {"_default": "2.12_29.6_piso_tatil"},
    "12.10": {"_default": "12.10_2.18_forro_fibra_mineral"},
    "19.80": {
        "luminosidade": "19.80_luminaria_baixa",
        "fraca": "19.80_luminaria_baixa",
        "_default": "19.80_luminaria_led",
    },
    "15.13": {"_default": "15.13_fechadura_porta_vidro"},
    "17.2": {"_default": "17.6_17.2_pintura_forro"},
    "19.18": {"_default": "19.18_luminaria_led_padrao"},
    "19.1": {"_default": "19.1_ponto_eletrico"},
    "19.8": {"_default": "19.8_ponto_logico"},
    "8.7": {"_default": "8.7_vedacao_calha_pu"},
}


def escolher_chave_narrativa(codigo_item: str, ambiente_hint: str = "") -> str:
    hints = HINTS_NARRATIVA.get(codigo_item, {})
    h_lower = ambiente_hint.lower()
    for k, v in hints.items():
        if k != "_default" and k in h_lower:
            return v
    return hints.get("_default", "")


def gerar_narrativa(banco: dict, codigo_item: str, ambiente: str = "", qtd: float = 1.0) -> str:
    chave = escolher_chave_narrativa(codigo_item, ambiente)
    txt = banco.get("narrativas", {}).get(chave, "")
    if "{qtd}" in txt:
        # quantidade no padrão "1,00" ou "5,00"
        txt = txt.replace("{qtd}", f"{qtd:.2f}".replace(".", ","))
    if "{ambiente}" in txt:
        txt = txt.replace("{ambiente}", ambiente or "")
    return txt


def gerar_detalhe(banco: dict, codigo_item: str, ambiente: str = "") -> str:
    """Escolhe a melhor variante de detalhe para o código + ambiente."""
    detalhes = banco.get("detalhes", {})
    h = ambiente.lower()
    candidatos = [k for k in detalhes if k.startswith(codigo_item)]
    if not candidatos:
        return f"Detalhes referentes ao Item {codigo_item}."
    # se algum candidato contém o ambiente, use-o
    for k in candidatos:
        sufixo = k.split("_", 1)[1] if "_" in k else ""
        if sufixo and sufixo in h:
            return detalhes[k]
    return detalhes[candidatos[0]]


def enriquecer_blocos(blocos: Iterable, banco: dict, itens: dict) -> list:
    """Roda em cada bloco: aplica narrativa + define legendas detalhe.

    TODO:
      [ ] Iterar blocos, ler `bloco.codigo_item` e seção.
      [ ] Atribuir `bloco.foto_narrativa.texto_gerado = gerar_narrativa(...)`.
      [ ] Para cada `foto in bloco.fotos_detalhe`: `foto.texto_gerado = gerar_detalhe(...)`.
      [ ] Marcar bloco com `foi_enriquecido = True` para o inseridor.
    """
    return list(blocos)


if __name__ == "__main__":  # pragma: no cover
    import json, sys
    banco = json.loads(open(sys.argv[1], "r", encoding="utf-8").read())
    print(gerar_narrativa(banco, "17.4", "mureta amarela"))
    print(gerar_detalhe(banco, "17.4", "mureta"))
