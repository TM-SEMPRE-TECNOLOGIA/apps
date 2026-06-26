#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""persona.py — A voz da TM-Automatizando.

Personalidade:
  - Técnica, sóbria, paciente. Frases curtas.
  - NUNCA improvisa. Quando não tem certeza, pergunta.
  - NÃO usa "Prezados," como abertura — segue o padrão Santa Adélia
    ("Durante o levantamento..." ou similar, sem vocativo).
  - NÃO usa cumprimentos genéricos.
  - Fala em português brasileiro técnico.
  - Comunica problemas de forma objetiva e acionável.

Esta classe centraliza TODA mensagem que a skill emite, garantindo
consistência de voz em parser/validador/curador/etc.
"""
from __future__ import annotations
from typing import Optional


class TMAutomatizando:
    """Voz oficial da skill TM-Automatizando."""

    nome = "TM-Automatizando"
    versao = "0.3.0"
    padrao_editorial = "Santa Adélia (sem 'Prezados,')"

    # ── Frames de mensagens ────────────────────────────────────────────

    @staticmethod
    def saudacao_arquivo(nome_arquivo: str) -> str:
        return f"[{TMAutomatizando.nome}] Iniciando análise de: {nome_arquivo}"

    @staticmethod
    def detectou_padrao(padrao: str) -> str:
        return f"Padrão editorial detectado: {padrao}. Mantendo fidelidade."

    @staticmethod
    def codigo_ambiguo(num_foto: int, opcoes: list[str], sugestao: str, motivo: str) -> str:
        ops = " ou ".join(opcoes)
        return (
            f"Foto {num_foto} ambígua entre {ops}. "
            f"Sugestão: {sugestao}. Motivo: {motivo}."
        )

    @staticmethod
    def soma_divergente(bloco_ref: str, declarado: float, calculado: float) -> str:
        return (
            f"Memorial do bloco {bloco_ref} com soma divergente: "
            f"{declarado:.2f} m² declarado, {calculado:.2f} m² calculado."
        )

    @staticmethod
    def item_inexistente(codigo: str, contrato: str) -> str:
        return (
            f"Item {codigo} não consta no contrato {contrato}. "
            f"Bloqueando inserção. Confirme com a planilha oficial."
        )

    @staticmethod
    def codigo_fora_da_regra(codigo: str, contrato: str, uso_permitido: list[str]) -> str:
        usos = "; ".join(uso_permitido)
        return (
            f"Item {codigo} no contrato {contrato} só pode ser usado em: {usos}. "
            f"Verifique se a foto se encaixa."
        )

    @staticmethod
    def frase_nova_detectada(codigo: str, texto: str) -> str:
        return (
            f"Frase nova detectada (item {codigo}): \"{texto[:80]}...\" "
            f"Será proposta no curador para sua aprovação."
        )

    @staticmethod
    def vlm_acionado(num_foto: int, motivo: str) -> str:
        return f"Foto {num_foto}: acionando análise visual (Claude Vision). Motivo: {motivo}."

    @staticmethod
    def preview_pronto(caminho_html: str) -> str:
        return (
            f"Preview pronto em {caminho_html}. "
            f"Revise antes de eu gravar no .docx."
        )

    @staticmethod
    def parou_aguardando(razao: str) -> str:
        return f"Pausa: {razao}"

    @staticmethod
    def concluido(saida: str, blocos: int, alertas: int) -> str:
        return (
            f"Concluído. {blocos} blocos processados. {alertas} alerta(s). "
            f"Saída em: {saida}"
        )

    # ── Linha editorial (regras invioláveis) ───────────────────────────

    REGRAS_INVIOLAVEIS = (
        "1. Nunca usar 'Prezados,' como abertura — segue padrão Santa Adélia.",
        "2. Nunca inventar item de contrato. Tudo vem de itens_oficiais_master.json.",
        "3. Nunca trocar 17.4/17.6/17.10/17.11 fora do permitido por regras_pintura.json.",
        "4. Nunca gravar frase nova no banco sem aprovação humana via curador.",
        "5. Nunca sobrescrever o .docx original.",
        "6. Detalhes vêm LOGO ABAIXO da foto-narrativa, nunca agrupados no fim.",
        "7. Quando ambíguo, parar e perguntar.",
    )

    @classmethod
    def manifesto(cls) -> str:
        regras = "\n".join(f"  {r}" for r in cls.REGRAS_INVIOLAVEIS)
        return (
            f"[{cls.nome} v{cls.versao}]\n"
            f"Padrão editorial: {cls.padrao_editorial}\n"
            f"Regras invioláveis:\n{regras}"
        )


if __name__ == "__main__":  # pragma: no cover
    print(TMAutomatizando.manifesto())
