#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""vlm_helper.py — Análise visual REAL das fotos (Claude Vision).

Modo híbrido:
  - Heurística primeiro (texto adjacente, código escrito a punho).
  - VLM SÓ é chamado quando heurística não resolve ou está abaixo do
    limiar de confiança (default 80%).

Limitação honesta documentada:
  - 17.6 (fosca) vs 17.11 (acetinada): visualmente indistinguível.
    Skill marca ⚠ e usa histórico da unidade + regras_pintura.json.

Esta é a versão ESQUELETO: a chamada de API fica como TODO para integração
final. A função `analisar_foto()` já reflete o contrato esperado.
"""
from __future__ import annotations

import base64
import os
import json
from pathlib import Path
from typing import Optional

from persona import TMAutomatizando as TM


PROMPT_VLM = """Você é um perito civil analisando uma foto de levantamento preventivo de agência bancária Banco do Brasil.

Identifique objetivamente o problema visual mais provável entre estas categorias:
- pintura_acrilica_externa (manchas/sujeira em parede ou muro externo)
- pintura_acrilica_interna (manchas/sujeira em parede interna)
- pintura_metalica (ferrugem, desgaste em portão, grade, corrimão, escada)
- pintura_automotiva (fachada com desgaste/oxidação)
- pintura_piso_resina (piso pintado com desgaste)
- piso_tatil_arrancado (peça de piso tátil arrancada/danificada)
- forro_fibra_mineral (manchas, umidade em placas de forro)
- gesso_acartonado (manchas, fissuras em gesso)
- luminaria_led_queimada (luminária apagada/queimada/escurecida)
- vedacao_calha_pu (vão na emenda calha/platibanda)
- carenagem_caixa (carenagem de caixa eletrônico danificada)
- adesivo_bb (adesivo BB desgastado)
- fita_antiderrapante (fita antiderrapante em rampa/degrau)
- persiana (persiana vertical ou de enrolar)
- fechadura (porta com fechadura defeituosa)
- outro

Responda APENAS em JSON com este schema:
{
  "categoria": "<uma das acima>",
  "confianca": 0.0-1.0,
  "descricao_observada": "<o que você efetivamente vê>",
  "codigo_sugerido": "<X.Y do contrato>",
  "ambiguidade": "<se for indistinguível, descreva>"
}

Atenção: NUNCA invente. Se não tem certeza > 0.8, devolva confianca baixa e descreva a ambiguidade.
"""


def _codificar_imagem(caminho: Path) -> str:
    return base64.b64encode(caminho.read_bytes()).decode("ascii")


def analisar_foto(caminho_imagem: Path, modo: str = "auto") -> Optional[dict]:
    """Analisa uma foto. Retorna dict com {categoria, confianca, codigo_sugerido, ...} ou None.

    modo:
      - 'auto' (default) — chama VLM
      - 'mock'  — devolve resposta fixa para teste sem custo
      - 'skip'  — sempre devolve None (forçar heurística)
    """
    if modo == "skip":
        return None
    if modo == "mock":
        return {
            "categoria": "pintura_acrilica_interna",
            "confianca": 0.9,
            "descricao_observada": "Parede interna com manchas de sujeira (mock).",
            "codigo_sugerido": "17.6",
            "ambiguidade": ""
        }

    # ── modo auto ────────────────────────────────────────────────
    # TODO: substituir por chamada real ao Claude/Anthropic
    # Exemplo de assinatura esperada:
    #
    #   from anthropic import Anthropic
    #   client = Anthropic()
    #   resp = client.messages.create(
    #       model="claude-3-5-sonnet-latest",
    #       max_tokens=400,
    #       messages=[{"role": "user", "content": [
    #           {"type": "image", "source": {"type": "base64",
    #            "media_type": "image/jpeg", "data": _codificar_imagem(caminho_imagem)}},
    #           {"type": "text", "text": PROMPT_VLM}
    #       ]}]
    #   )
    #   return json.loads(resp.content[0].text)
    return None


def precisa_de_vlm(bloco: dict, limiar_conf: float = 0.8) -> tuple[bool, str]:
    """Heurística: VLM é necessário?"""
    if not bloco.get("codigo_item"):
        return True, "Sem código identificado por heurística."
    if bloco.get("codigo_item_confianca", 1.0) < limiar_conf:
        return True, f"Confiança {bloco.get('codigo_item_confianca'):.2f} < {limiar_conf}."
    # 17.6 vs 17.11 sempre passa pelo histórico — não pelo VLM
    return False, ""


if __name__ == "__main__":  # pragma: no cover
    print(TM.manifesto())
    print()
    print("VLM mock test:", analisar_foto(Path("dummy.jpg"), modo="mock"))
