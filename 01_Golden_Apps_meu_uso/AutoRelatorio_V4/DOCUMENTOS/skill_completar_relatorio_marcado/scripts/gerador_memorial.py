#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""gerador_memorial.py — Monta o memorial de cálculo de cada bloco.

Replica a lógica do `utils_sp2.parse_medidas_sp2` e o formato visual do
`word_utils_sp2._inserir_memoria_calculo` que já existe no AutoRelatório V4.

Saída: dicionário no formato:
    {
        "tipo_item": "pintura" | "metalico" | "unitario" | "andaime",
        "linhas": [
            {"referencia": "Foto 02", "largura": 28.0, "altura": 0.9,
             "faces": 1, "desconto": 0.0, "subtotal": 25.2, "total": 25.2,
             "parede_nome": ""}
        ],
        "total_geral": 25.2
    }
"""
from __future__ import annotations

from typing import Iterable


def _fmt_br(valor: float) -> str:
    return f"{valor:.2f}".replace(".", ",")


def classificar_tipo_item(codigo_item: str) -> str:
    """Decide o layout da tabela conforme o código.

    Heurística:
      17.1, 17.9              → metalico
      17.4, 17.6, 17.8, 17.10 → pintura
      2.21                    → andaime
      2.12, 12.10, 15.13,
      19.1, 19.8, 19.18,
      19.80, 29.6, 12.5       → unitario
      8.7                     → linear (m)
    """
    if codigo_item in {"17.1", "17.9"}:
        return "metalico"
    if codigo_item in {"17.4", "17.6", "17.8", "17.10", "17.2"}:
        return "pintura"
    if codigo_item == "2.21":
        return "andaime"
    if codigo_item == "8.7":
        return "linear"
    return "unitario"


def calcular_linha(largura: float, altura: float, faces: int = 1, desconto: float = 0.0) -> dict:
    subtotal = round(largura * altura * faces, 2)
    total = round(subtotal - desconto, 2)
    return {
        "largura": largura,
        "altura": altura,
        "faces": faces,
        "desconto": desconto,
        "subtotal": subtotal,
        "total": total,
    }


def montar_memorial_pintura(foto_ref: str, medidas: list[tuple[float, float]]) -> dict:
    linhas = []
    for (l, a) in medidas:
        info = calcular_linha(l, a)
        info.update({"referencia": foto_ref, "parede_nome": ""})
        linhas.append(info)
    total = round(sum(li["total"] for li in linhas), 2)
    return {"tipo_item": "pintura", "linhas": linhas, "total_geral": total}


def montar_memorial_unitario(foto_ref: str, quantidade: float = 1.0) -> dict:
    linha = {
        "referencia": foto_ref,
        "quantidade": quantidade,
        "total": quantidade,
        "parede_nome": "",
    }
    return {"tipo_item": "unitario", "linhas": [linha], "total_geral": quantidade}


def montar_memoriais(blocos: Iterable, itens: dict) -> list:
    """Para cada Bloco, atribui `bloco.memorial = ...` baseado nas medidas.

    TODO:
      [ ] Iterar blocos, obter `tipo = classificar_tipo_item(bloco.codigo_item)`.
      [ ] Conforme tipo, chamar montar_memorial_pintura / _unitario / _andaime.
      [ ] Setar `bloco.memorial` no Bloco.
    """
    return list(blocos)


if __name__ == "__main__":  # pragma: no cover
    # smoke test
    m = montar_memorial_pintura("Foto 02", [(28.0, 0.9)])
    print(m, "→ total:", _fmt_br(m["total_geral"]))
