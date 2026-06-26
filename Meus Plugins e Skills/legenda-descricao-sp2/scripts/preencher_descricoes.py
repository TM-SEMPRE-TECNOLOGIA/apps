"""
preencher_descricoes.py — Skill legenda-descricao-SP2
Preenche descrições em legendas de foto vazias em relatórios .docx.

Regras:
- Foto PRINCIPAL (vem imediatamente antes de "- Detalhes N:") →
    "Foto N – Descrição da necessidade. (item 00.00 do contrato)"
- Foto DETALHE (vem após "- Detalhes N:") →
    "Foto N – Descrição curta do detalhe. (0.00)"
- Fotos já com descrição: corrige separador ":" → "–" e mantém o texto.
- Seções listadas em --skip-secoes são ignoradas completamente.

Uso:
    python3 preencher_descricoes.py <input.docx> <output.docx> \
        [--skip-secoes "Sec1,Sec2"] \
        [--item-placeholder "00.00"]
"""

import sys
import re
import argparse
from docx import Document

# ── Banco de frases por seção ──────────────────────────────────────────────────
# Chave: prefixo do título da subseção (sem ":")
# Cada lista é rotada automaticamente para evitar repetição.

PRINCIPAIS = {
    "1.1 - Pintura acrílica": [
        "Parede da área externa com necessidade de pintura acrílica, apresentando manchas e desgastes visíveis.",
        "Superfície externa com manchas de sujeira e sinais de desgaste, necessitando de pintura acrílica.",
        "Área da fachada com marcas de uso e sujeira acumulada, indicando necessidade de repintura.",
        "Parede externa apresentando desbotamento e sujeira, com necessidade de aplicação de pintura acrílica.",
        "Trecho da área externa com sinais de deterioração e manchas, necessitando de pintura.",
        "Superfície com marcas de umidade e desgaste, indicando a necessidade de pintura acrílica.",
        "Parede com presença de sujeira e desgaste aparente, necessitando de repintura acrílica.",
    ],
    "3.1.1 - Pintura acrílica": [
        "Parede interna da SAA com manchas e marcas de uso, necessitando de pintura acrílica.",
        "Superfície da SAA com sinais de desgaste e sujeira acumulada, indicando necessidade de repintura.",
        "Trecho interno da SAA apresentando manchas visíveis, com necessidade de aplicação de pintura.",
        "Parede da sala de autoatendimento com desgaste e manchas, necessitando de pintura acrílica.",
    ],
    "3.2.1 - Pintura acrílica": [
        "Parede da área de atendimento com manchas e sinais de uso, necessitando de pintura acrílica.",
        "Superfície interna do atendimento com desgaste e sujeira aparente, indicando necessidade de repintura.",
        "Trecho da área de atendimento com marcas de uso e manchas acumuladas.",
        "Parede do atendimento com sinais de deterioração, necessitando de aplicação de pintura acrílica.",
    ],
    "3.8 - Extintores de incêndio": [
        "Extintor de incêndio da agência, verificando conservação, validade e posicionamento.",
        "Registro do extintor, com análise das condições gerais e prazo de validade.",
        "Extintor verificado quanto ao estado de conservação e localização no ambiente.",
        "Equipamento extintor com verificação de validade e condições de uso.",
    ],
    "3.9 - Quadro elétrico": [
        "Quadro elétrico da agência, verificando as condições dos componentes internos.",
        "Painel elétrico com análise dos disjuntores e estado geral dos componentes.",
        "Quadro elétrico verificado quanto à organização e condições dos circuitos.",
    ],
    "_default_": [
        "Vista geral do ambiente, verificando as condições de conservação.",
        "Registro do local, com análise das condições gerais observadas.",
        "Ambiente registrado para levantamento das condições de conservação.",
        "Vista do trecho verificado, com análise das condições identificadas.",
    ],
}

DETALHES = {
    "1.1 - Pintura acrílica": [
        "Detalhe das manchas de sujeira na superfície a ser pintada.",
        "Marcas de desgaste e sujeira na parede.",
        "Detalhe do desbotamento e manchas visíveis na superfície.",
        "Sinais de deterioração e sujeira acumulada na parede.",
        "Detalhe das marcas de uso na superfície da parede externa.",
        "Manchas e desgaste aparente na área a ser repintada.",
        "Marcas de umidade e sujeira no trecho a ser pintado.",
    ],
    "3.1.1 - Pintura acrílica": [
        "Detalhe das manchas na superfície interna da SAA.",
        "Marcas de uso e sujeira na parede da sala de autoatendimento.",
        "Detalhe do desgaste visível na superfície interna.",
        "Sinais de deterioração na parede da SAA.",
    ],
    "3.1.2 - Forro de fibra mineral": [
        "Detalhe da placa de forro danificada ou desalinhada.",
        "Placa de forro com sinais de dano e desnivelamento.",
        "Trecho do forro com placa quebrada ou fora do lugar.",
        "Detalhe da placa de forro em estado inadequado.",
    ],
    "3.1.3 - Capacho": [
        "Detalhe do capacho desgastado com necessidade de troca.",
        "Capacho com sinais de uso intenso e desgaste aparente.",
    ],
    "3.1.4 - Fita de piso": [
        "Detalhe da fita de piso danificada com necessidade de substituição.",
        "Fita de piso com desgaste e descolamento aparente.",
    ],
    "3.2.1 - Pintura acrílica": [
        "Detalhe das manchas na superfície da área de atendimento.",
        "Marcas de uso e sujeira na parede do atendimento.",
        "Detalhe do desgaste visível na superfície interna.",
        "Sinais de deterioração e manchas na parede do atendimento.",
        "Detalhe da sujeira acumulada na superfície a ser repintada.",
    ],
    "3.2.2 - Forro de fibra mineral": [
        "Detalhe da placa de forro danificada na área de atendimento.",
        "Placa de forro com sinais de dano ou desalinhamento.",
        "Trecho do forro com placa em estado inadequado.",
        "Detalhe da placa fora do lugar ou danificada.",
    ],
    "3.2.3 - Adesivo": [
        "Detalhe do adesivo com necessidade de substituição.",
        "Adesivo danificado ou descolado, necessitando de troca.",
        "Detalhe do adesivo com sinais de desgaste e deterioração.",
    ],
    "3.2.4 - Interruptor": [
        "Detalhe do interruptor com necessidade de substituição.",
        "Interruptor com sinais de desgaste ou mau funcionamento.",
    ],
    "3.3.1- Forro de fibra mineral": [
        "Detalhe da placa de forro danificada no corredor de abastecimento.",
        "Placa de forro fora do lugar ou com danos no corredor.",
    ],
    "3.3.1 - Forro de fibra mineral": [
        "Detalhe da placa de forro danificada no corredor de abastecimento.",
        "Placa de forro fora do lugar ou com danos no corredor.",
    ],
    "3.4.1- Forro de fibra mineral": [
        "Detalhe da placa de forro danificada no CAIEX.",
        "Placa de forro com sinais de dano ou desalinhamento no CAIEX.",
    ],
    "3.4.1 - Forro de fibra mineral": [
        "Detalhe da placa de forro danificada no CAIEX.",
        "Placa de forro com sinais de dano ou desalinhamento no CAIEX.",
    ],
    "3.5.1- Torneira com alavanca": [
        "Detalhe da torneira com necessidade de substituição.",
        "Torneira com sinais de desgaste ou defeito.",
    ],
    "3.5.1 - Torneira com alavanca": [
        "Detalhe da torneira com necessidade de substituição.",
        "Torneira com sinais de desgaste ou defeito.",
    ],
    "3.6 - Banheiro feminino": [
        "Vista do banheiro feminino em bom estado de conservação.",
        "Ambiente do banheiro feminino sem necessidade de intervenções imediatas.",
    ],
    "3.7 - Banheiro masculino": [
        "Detalhe da torneira com vazamento identificado.",
        "Torneira do banheiro masculino apresentando vazamento.",
    ],
    "3.8 - Extintores de incêndio": [
        "Detalhe do extintor, verificando a validade e conservação.",
        "Registro detalhado do extintor e suas condições.",
    ],
    "3.9 - Quadro elétrico": [
        "Detalhe dos componentes do quadro elétrico.",
        "Detalhe interno do painel elétrico.",
    ],
    "3.1 - SAA (sala de autoatendimento)": [
        "Vista geral da SAA, verificando as condições do ambiente.",
        "Registro da sala de autoatendimento para levantamento geral.",
    ],
    "3.2 - Atendimento": [
        "Vista geral da área de atendimento para levantamento.",
        "Registro do ambiente de atendimento e suas condições gerais.",
    ],
    "_default_": [
        "Detalhe do local, verificando as condições observadas.",
        "Registro detalhado do trecho inspecionado.",
        "Detalhe da área com necessidade de intervenção.",
        "Vista aproximada evidenciando as condições identificadas.",
    ],
}


def pegar_frase(banco, chave, contadores):
    """Retorna a próxima frase do banco para a chave, rotando entre as opções."""
    opcoes = banco.get(chave, banco.get("_default_", ["Registro do ambiente."]))
    idx = contadores.get(chave, 0) % len(opcoes)
    contadores[chave] = idx + 1
    return opcoes[idx]


def proxima_linha_significativa(all_texts, idx):
    """Retorna o texto da próxima linha não vazia após idx."""
    for j in range(idx + 1, min(idx + 10, len(all_texts))):
        if all_texts[j]:
            return all_texts[j]
    return ""


def preencher_descricoes(input_path, output_path, skip_secoes=None, item_placeholder="00.00"):
    if skip_secoes is None:
        skip_secoes = set()
    else:
        skip_secoes = set(s.strip() for s in skip_secoes.split(",") if s.strip())

    print(f"Carregando: {input_path}")
    doc = Document(input_path)
    paras = doc.paragraphs
    all_texts = [p.text.strip() for p in paras]
    n = len(paras)

    secao = ""
    subsecao = ""
    contadores_pri = {}
    contadores_det = {}
    modificadas = 0
    puladas_skip = 0

    for idx in range(n):
        txt = all_texts[idx]
        if not txt:
            continue

        # Detectar seção principal (ex: "1 - Área externa:", "3 - Área interna:")
        if re.match(r'^\d+ [-–] [A-ZÁÉÍÓÚ]', txt) and not txt.startswith("Foto"):
            secao = txt.split(":")[0].strip()
            subsecao = ""

        # Detectar subseção (ex: "1.1 - Pintura acrílica:", "3.1.2 - Forro...")
        elif re.match(r'^\d+\.\d+', txt) and not txt.startswith("Foto"):
            subsecao = txt.split(":")[0].strip()

        chave = subsecao if subsecao else secao

        # Verificar se deve pular esta seção
        if secao in skip_secoes or subsecao in skip_secoes:
            puladas_skip += 1
            continue

        # Foto já com descrição após dois pontos → corrigir separador
        m_com_desc = re.match(r'^(Foto \d+): (.+)', txt)
        if m_com_desc:
            novo = f"{m_com_desc.group(1)} – {m_com_desc.group(2)}"
            p = paras[idx]
            if p.runs:
                p.runs[0].text = novo
                for r in p.runs[1:]:
                    r.text = ""
            else:
                p.text = novo
            modificadas += 1
            continue

        # Foto sem descrição (ex: "Foto 4:" ou "Foto 4" ou "Foto 4 -")
        m_vazia = re.match(r'^Foto (\d+)\s*[–\-:]?\s*$', txt)
        if not m_vazia:
            continue

        num = m_vazia.group(1)

        # Determinar se é PRINCIPAL ou DETALHE
        prox = proxima_linha_significativa(all_texts, idx)
        is_principal = bool(re.match(r'^- Detalhes', prox))

        if is_principal:
            desc = pegar_frase(PRINCIPAIS, chave, contadores_pri)
            novo = f"Foto {num} – {desc} (item {item_placeholder} do contrato)"
        else:
            desc = pegar_frase(DETALHES, chave, contadores_det)
            novo = f"Foto {num} – {desc} ({item_placeholder if not is_principal else '0.00'})"
            # Para detalhes, sempre usar (0.00)
            novo = f"Foto {num} – {desc} (0.00)"

        p = paras[idx]
        if p.runs:
            p.runs[0].text = novo
            for r in p.runs[1:]:
                r.text = ""
        else:
            p.text = novo

        modificadas += 1

    doc.save(output_path)
    print(f"Legendas preenchidas: {modificadas}")
    if puladas_skip:
        print(f"Fotos puladas (seções excluídas): {puladas_skip}")
    print(f"Salvo em: {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Preenche descrições em legendas de foto vazias")
    parser.add_argument("input", help="Arquivo .docx de entrada")
    parser.add_argument("output", help="Arquivo .docx de saída")
    parser.add_argument("--skip-secoes", default="", help="Seções a pular, separadas por vírgula")
    parser.add_argument("--item-placeholder", default="00.00", help="Placeholder do item do contrato")
    args = parser.parse_args()

    preencher_descricoes(
        args.input,
        args.output,
        skip_secoes=args.skip_secoes if args.skip_secoes else None,
        item_placeholder=args.item_placeholder,
    )
