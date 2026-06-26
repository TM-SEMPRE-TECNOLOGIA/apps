# llm_generator.py — AutoRelatório V2
# Geração de descrição técnica baseada nos itens configurados no Modal Plus+
import json
import os


def build_super_prompt(image_meta: dict) -> str:
    """
    Constrói o prompt técnico a partir dos dados do Modal Plus+.

    image_meta: {
      "image_url": "base64...",          # opcional
      "items": [
        {
          "item": {
            "id": "17.4",
            "desc": "Pintura látex acrílica standard",
            "un": "m²",
            "cat": "PINTURA"
          },
          "qty": 19.5,           # calculado pelo frontend (larg × alt − desc)
          "largura": 6.5,        # para itens m² (opcional)
          "altura": 3.0,
          "desconto": 0.0,
          "repeticoes": 1,
          "totalFinal": 19.5,    # valor final após modificador
          "totalLabel": "Total", # ex: "Total (÷10)", "Total (×5)"
          "context": "Parede com fungos na base"
        },
        ...
      ],
      "contrato": "0857 - Lorena SP",
      "modo": "sp" | "tradicional"
    }
    """
    contrato = image_meta.get("contrato", "Padrão MAFFENG")
    modo = image_meta.get("modo", "tradicional")
    items = image_meta.get("items", [])

    prompt = f"""Você é um Engenheiro Especialista em Laudos Técnicos de Manutenção Preventiva.
Redija a descrição técnica da foto conforme o padrão MAFFENG — tom formal, objetivo e preciso.

=== CONTRATO ===
{contrato} | Modo: {"São Paulo (SP)" if modo == "sp" else "Tradicional"}

=== ITENS CONFIGURADOS PELO TÉCNICO ===
"""

    for i, data in enumerate(items, 1):
        item_obj = data.get("item", {})
        total_final = data.get("totalFinal", data.get("qty", 0))
        total_label = data.get("totalLabel", "Total")
        largura = data.get("largura")
        altura = data.get("altura")
        desconto = data.get("desconto", 0)
        repeticoes = data.get("repeticoes", 1)
        context = data.get("context", "")

        prompt += f"\n[{i}] Item {item_obj.get('id', '')} — {item_obj.get('desc', '')}\n"
        prompt += f"    Unidade: {item_obj.get('un', '')} | Categoria: {item_obj.get('cat', '')}\n"

        # Detalhe da medição
        if largura is not None and altura is not None:
            prompt += f"    Medição: {largura:.2f}m × {altura:.2f}m"
            if desconto:
                prompt += f" − {desconto:.2f}m² de desconto"
            prompt += f" = {total_final:.2f} {item_obj.get('un', '')}\n"
        else:
            prompt += f"    Quantidade: {total_final} {item_obj.get('un', '')}\n"

        if repeticoes > 1:
            prompt += f"    Observação de Campo: {repeticoes} ocorrências idênticas ({total_label})\n"

        prompt += f"    {total_label}: {total_final:.2f} {item_obj.get('un', '')}\n"

        if context:
            prompt += f"    Observação do Técnico: \"{context}\"\n"

    prompt += """
=== INSTRUÇÕES DE FORMATAÇÃO ===
1. Inicie com "Prezados," e identifique o ambiente pela foto.
2. Para cada item, mencione a ocorrência, referencie a medida informada e justifique a intervenção.
3. Cite o número do item do contrato entre parênteses ao final: (item X.X do contrato)
4. NÃO invente medidas — use exatamente os valores fornecidos acima.
5. Tom: formal, técnico, direto. Máximo 3 frases por item.
6. Formato de saída (JSON):
{
  "descricao_tecnica": "Prezados, ..."
}
"""
    return prompt.strip()


def mock_call_llm_api(super_prompt: str, image_base64: str = None) -> dict:
    """Simula chamada LLM para testes."""
    print(f"[LLM] Super Prompt ({len(super_prompt)} chars) → Cloud...")
    return {
        "descricao_tecnica": (
            "Prezados, a parede da área externa apresenta 19,50m² com manchas e marcas de uso. "
            "É necessária a aplicação de pintura látex acrílica standard (item 17.4 do contrato)."
        )
    }


def call_llm_with_services(services: list, image_base64: str = None, contrato: str = "", modo: str = "tradicional") -> str:
    """
    Ponto de entrada principal para o Modal Plus+.
    services: lista de ServiceSelection (do frontend, serializada como dict)
    Retorna: string com a descrição técnica gerada.
    """
    image_meta = {
        "image_url": image_base64 or "",
        "items": services,
        "contrato": contrato,
        "modo": modo,
    }
    prompt = build_super_prompt(image_meta)
    result = mock_call_llm_api(prompt, image_base64)
    return result.get("descricao_tecnica", "")
