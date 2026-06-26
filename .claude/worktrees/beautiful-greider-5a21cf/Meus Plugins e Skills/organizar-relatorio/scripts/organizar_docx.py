#!/usr/bin/env python3
"""
organizar_docx.py
=================
Corrige automaticamente a formatação de relatórios fotográficos (.docx)
gerados pelo AutoRelatório 3.2 para o padrão Banco do Brasil / CEF.

Correções aplicadas:
  1. jc de subtítulos (Vista ampla, Detalhes, Croqui, Vista geral) → both
  2. Inserção de parágrafos separadores (vazio, center) entre imagens adjacentes
  3. jc de parágrafos vazios próximos a imagens → center
  4. jc de parágrafos vazios imediatamente após títulos principais → center
  5. Remoção de todas as quebras de página existentes e reinserção de 1 PB
     a cada 2 imagens (no separador entre o par), com buffer vazio+center após cada PB

Uso:
  python organizar_docx.py --input relatorio.docx --output relatorio_organizado.docx

Requisitos: Python 3.8+ (stdlib apenas — sem dependências externas)
"""

import argparse
import copy
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

# ---------------------------------------------------------------------------
# Namespace Word Open XML
# ---------------------------------------------------------------------------
NS  = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
NS2 = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

# Prefixos de subtítulo (case-insensitive, strip)
SUBTITLE_PREFIXES = (
    '- vista ampla',
    '- detalhes',
    '- croqui',
    '- vista geral',
    '- detalhe',
)

# ---------------------------------------------------------------------------
# Helpers de leitura de XML
# ---------------------------------------------------------------------------

def get_text(para: ET.Element) -> str:
    """Concatena todo o texto de um parágrafo."""
    parts = []
    for r in para.findall(f'.//{NS}r'):
        for t in r.findall(f'{NS}t'):
            parts.append(t.text or '')
    return ''.join(parts).strip()


def has_image(para: ET.Element) -> bool:
    """Verifica se o parágrafo contém uma imagem (drawing)."""
    return bool(para.findall(f'.//{NS}drawing'))


def has_page_break(para: ET.Element) -> bool:
    """Verifica se o parágrafo contém uma quebra de página hard."""
    for br in para.findall(f'.//{NS}br'):
        if br.get(f'{NS}type') == 'page':
            return True
    return False


def get_jc(para: ET.Element):
    """Retorna o valor do elemento jc ou None."""
    pPr = para.find(f'{NS}pPr')
    if pPr is not None:
        jc = pPr.find(f'{NS}jc')
        if jc is not None:
            return jc.get(f'{NS}val')
    return None


def is_subtitle(para: ET.Element) -> bool:
    """Verifica se o parágrafo é um subtítulo do relatório."""
    txt = get_text(para).lower()
    return any(txt.startswith(p) for p in SUBTITLE_PREFIXES)


def is_main_title(para: ET.Element) -> bool:
    """
    Verifica se o parágrafo é um título principal (linha com número de protocolo,
    nome de agência, etc.) — heurística: não é imagem, não é vazio, não é subtítulo,
    e tem mais de 5 caracteres.
    """
    txt = get_text(para)
    return (
        txt != ''
        and not has_image(para)
        and not is_subtitle(para)
        and len(txt) > 5
    )

# ---------------------------------------------------------------------------
# Helpers de escrita de XML
# ---------------------------------------------------------------------------

def set_jc(para: ET.Element, val: str):
    """Define (ou cria) o elemento jc dentro de pPr."""
    pPr = para.find(f'{NS}pPr')
    if pPr is None:
        pPr = ET.SubElement(para, f'{NS}pPr')
        para.insert(0, pPr)
    jc = pPr.find(f'{NS}jc')
    if jc is None:
        jc = ET.SubElement(pPr, f'{NS}jc')
    jc.set(f'{NS}val', val)


def make_empty_para_center() -> ET.Element:
    """Cria um parágrafo vazio com alinhamento center."""
    p   = ET.Element(f'{NS}p')
    pPr = ET.SubElement(p, f'{NS}pPr')
    jc  = ET.SubElement(pPr, f'{NS}jc')
    jc.set(f'{NS}val', 'center')
    return p


def make_page_break_para() -> ET.Element:
    """Cria um parágrafo vazio que contém uma quebra de página."""
    p   = ET.Element(f'{NS}p')
    pPr = ET.SubElement(p, f'{NS}pPr')
    jc  = ET.SubElement(pPr, f'{NS}jc')
    jc.set(f'{NS}val', 'center')
    r   = ET.SubElement(p, f'{NS}r')
    br  = ET.SubElement(r, f'{NS}br')
    br.set(f'{NS}type', 'page')
    return p


def remove_page_breaks_from_para(para: ET.Element):
    """Remove todos os elementos <w:br w:type='page'> de um parágrafo."""
    for r in para.findall(f'{NS}r'):
        for br in r.findall(f'{NS}br'):
            if br.get(f'{NS}type') == 'page':
                r.remove(br)
        # Remove runs vazios que sobraram
        if not list(r):
            para.remove(r)

# ---------------------------------------------------------------------------
# Passo 1 — Corrigir jc dos subtítulos → both
# ---------------------------------------------------------------------------

def corrigir_subtitulos(body_children):
    """Aplica jc=both em todos os subtítulos identificados."""
    count = 0
    for p in body_children:
        if p.tag == f'{NS}p' and is_subtitle(p):
            if get_jc(p) != 'both':
                set_jc(p, 'both')
                count += 1
    print(f"  [1] Subtítulos corrigidos (jc→both): {count}")
    return count


# ---------------------------------------------------------------------------
# Passo 2 — Inserir separadores entre imagens adjacentes
# ---------------------------------------------------------------------------

def inserir_separadores(body: ET.Element):
    """
    Percorre os filhos do body e insere um parágrafo vazio+center entre
    quaisquer dois parágrafos consecutivos que contenham imagens.
    Retorna a nova lista de filhos.
    """
    children = list(body)
    new_children = []
    inserted = 0

    for i, p in enumerate(children):
        new_children.append(p)
        if p.tag == f'{NS}p' and has_image(p):
            next_p = children[i + 1] if i + 1 < len(children) else None
            if next_p is not None and next_p.tag == f'{NS}p' and has_image(next_p):
                new_children.append(make_empty_para_center())
                inserted += 1

    # Rebuild body
    for child in list(body):
        body.remove(child)
    for child in new_children:
        body.append(child)

    print(f"  [2] Separadores inseridos entre imagens adjacentes: {inserted}")
    return inserted


# ---------------------------------------------------------------------------
# Passo 3 — Corrigir jc de parágrafos vazios próximos a imagens → center
# ---------------------------------------------------------------------------

def corrigir_vazios_proximos_imagens(body: ET.Element):
    """
    Para cada parágrafo vazio (sem imagem, sem texto) que está imediatamente
    antes ou após um parágrafo com imagem, define jc=center.
    """
    children = list(body)
    count = 0

    for i, p in enumerate(children):
        if p.tag != f'{NS}p':
            continue
        txt = get_text(p)
        img = has_image(p)
        if txt != '' or img:
            continue

        prev_img = (i > 0 and children[i-1].tag == f'{NS}p' and has_image(children[i-1]))
        next_img = (i + 1 < len(children) and children[i+1].tag == f'{NS}p' and has_image(children[i+1]))

        if prev_img or next_img:
            if get_jc(p) != 'center':
                set_jc(p, 'center')
                count += 1

    print(f"  [3] Vazios próximos a imagens corrigidos (jc→center): {count}")
    return count


# ---------------------------------------------------------------------------
# Passo 4 — Corrigir jc de vazios após títulos principais → center
# ---------------------------------------------------------------------------

def corrigir_vazios_apos_titulos(body: ET.Element):
    """
    Parágrafos vazios imediatamente após títulos principais (seção) devem
    ter jc=center para manter consistência visual.
    """
    children = list(body)
    count = 0

    for i, p in enumerate(children):
        if p.tag != f'{NS}p':
            continue
        if i == 0:
            continue
        prev = children[i - 1]
        if prev.tag != f'{NS}p':
            continue

        txt = get_text(p)
        img = has_image(p)

        if txt == '' and not img and is_main_title(prev):
            if get_jc(p) != 'center':
                set_jc(p, 'center')
                count += 1

    print(f"  [4] Vazios após títulos corrigidos (jc→center): {count}")
    return count


# ---------------------------------------------------------------------------
# Helpers para tabelas
# ---------------------------------------------------------------------------

def has_image_in_table(tbl: ET.Element) -> bool:
    """Verifica se a tabela contém alguma imagem."""
    return bool(tbl.findall(f'.//{NS}drawing'))


def count_images_in_table(tbl: ET.Element) -> int:
    """Conta quantas imagens (drawing) a tabela contém."""
    return len(tbl.findall(f'.//{NS}drawing'))


# ---------------------------------------------------------------------------
# Passo 5 — Reposicionar quebras de página (1 PB por 2 imagens)
# ---------------------------------------------------------------------------

def reposicionar_quebras_pagina(body: ET.Element):
    """
    Lógica de quebra de página para relatórios fotográficos onde as imagens
    podem estar tanto em <w:p> quanto dentro de <w:tbl>.

    Estratégia:
    - Percorre todos os filhos diretos do body (parágrafos e tabelas).
    - Mantém um contador de imagens (img_count).
    - Cada <w:p> com drawing = +1 imagem.
    - Cada <w:tbl> com drawing = +N imagens (normalmente 2 por tabela).
    - A cada 2 imagens acumuladas, insere uma quebra de página APÓS o bloco atual,
      seguida de buffer vazio+center.

    Padrão alvo entre PBs (quando imagens em parágrafos):
      PB → E(center) → IMG → E(center) → IMG → PB

    Padrão alvo quando imagens em tabelas:
      PB → E(center) → TBL(2 imgs) → PB
    """
    # — Remover todas as PBs existentes em parágrafos —
    children = list(body)
    pb_removidas = 0
    for p in children:
        if p.tag == f'{NS}p' and has_page_break(p):
            remove_page_breaks_from_para(p)
            pb_removidas += 1

    print(f"  [5a] Quebras de página removidas: {pb_removidas}")

    # — Re-inserir 1 PB por 2 imagens —
    children = list(body)
    new_children = []
    img_count = 0
    pb_inseridas = 0

    i = 0
    while i < len(children):
        elem = children[i]
        new_children.append(elem)

        imgs_this = 0
        is_img_block = False

        if elem.tag == f'{NS}p' and has_image(elem):
            imgs_this = 1
            is_img_block = True
        elif elem.tag == f'{NS}tbl' and has_image_in_table(elem):
            imgs_this = count_images_in_table(elem)
            is_img_block = True

        if is_img_block:
            img_count += imgs_this

            if img_count >= 2:
                # Inserir quebra de página após este bloco
                # Verificar se o próximo elemento é um separador vazio reutilizável
                next_elem = children[i + 1] if i + 1 < len(children) else None
                if (next_elem is not None
                        and next_elem.tag == f'{NS}p'
                        and not has_image(next_elem)
                        and get_text(next_elem) == ''):
                    # Reutilizar o separador: transformar em PB
                    set_jc(next_elem, 'center')
                    r = ET.SubElement(next_elem, f'{NS}r')
                    br = ET.SubElement(r, f'{NS}br')
                    br.set(f'{NS}type', 'page')
                    new_children.append(next_elem)
                    i += 1  # pular (já incluído)
                else:
                    new_children.append(make_page_break_para())

                # Buffer vazio+center após PB
                new_children.append(make_empty_para_center())
                pb_inseridas += 1
                img_count = 0  # reset

        i += 1

    # Rebuild body
    for child in list(body):
        body.remove(child)
    for child in new_children:
        body.append(child)

    print(f"  [5b] Quebras de página reinseridas: {pb_inseridas}")
    return pb_inseridas


# ---------------------------------------------------------------------------
# Pipeline principal
# ---------------------------------------------------------------------------

def organizar_docx(input_path: str, output_path: str):
    """Executa o pipeline completo de correção."""
    input_path  = Path(input_path)
    output_path = Path(output_path)

    print(f"\n{'='*60}")
    print(f"  AutoRelatório DOCX Organizer")
    print(f"{'='*60}")
    print(f"  Entrada : {input_path.name}")
    print(f"  Saída   : {output_path.name}")
    print(f"{'='*60}\n")

    if not input_path.exists():
        raise FileNotFoundError(f"Arquivo não encontrado: {input_path}")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Extrair e manipular document.xml — lemos diretamente do input original
    with zipfile.ZipFile(input_path, 'r') as zin:
        xml_content = zin.read('word/document.xml')

    # Parse XML
    ET.register_namespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
    # Preservar todos os namespaces presentes
    tree = ET.ElementTree(ET.fromstring(xml_content))
    root = tree.getroot()

    # Localizar o body
    body = None
    for elem in root.iter():
        if elem.tag == f'{NS}body':
            body = elem
            break

    if body is None:
        raise ValueError("Não foi possível localizar <w:body> no document.xml")

    body_children = [c for c in body if c.tag == f'{NS}p']
    total_paras = len(list(body))
    total_imgs  = sum(1 for c in body if c.tag == f'{NS}p' and has_image(c))

    print(f"  Parágrafos totais   : {total_paras}")
    print(f"  Imagens detectadas  : {total_imgs}")
    print(f"\n  Aplicando correções...\n")

    # — Passo 1: Subtítulos —
    corrigir_subtitulos(list(body))

    # — Passo 2: Separadores —
    inserir_separadores(body)

    # — Passo 3: Vazios próximos a imagens —
    corrigir_vazios_proximos_imagens(body)

    # — Passo 4: Vazios após títulos —
    corrigir_vazios_apos_titulos(body)

    # — Passo 5: Quebras de página —
    reposicionar_quebras_pagina(body)

    # Serializar de volta para XML
    xml_out = ET.tostring(root, encoding='unicode', xml_declaration=False)
    xml_bytes = ('<?xml version=\'1.0\' encoding=\'UTF-8\' standalone=\'yes\'?>\n' + xml_out).encode('utf-8')

    # Reescrever o zip mantendo todos os outros arquivos intactos.
    # IMPORTANTE: ler o input_path original (não output_path que ainda está "em cópia")
    # e escrever num tmp separado antes de mover para output_path.
    import tempfile, os
    tmp_fd, tmp_name = tempfile.mkstemp(suffix='.tmp.docx', dir=output_path.parent)
    os.close(tmp_fd)
    tmp_path = Path(tmp_name)

    try:
        # Ler do input original (já temos o XML modificado em memória)
        with zipfile.ZipFile(input_path, 'r') as zin:
            with zipfile.ZipFile(tmp_path, 'w', zipfile.ZIP_DEFLATED) as zout:
                for item in zin.infolist():
                    if item.filename == 'word/document.xml':
                        zout.writestr(item, xml_bytes)
                    else:
                        zout.writestr(item, zin.read(item.filename))
        # Mover o tmp para o destino final
        os.replace(tmp_path, output_path)
    except Exception:
        # Limpar o tmp em caso de erro
        if tmp_path.exists():
            tmp_path.unlink()
        raise

    print(f"\n{'='*60}")
    print(f"  Arquivo salvo: {output_path}")
    print(f"{'='*60}\n")
    print("  Execute validar_docx.py para confirmar as correções.")
    print()


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description='Organiza formatação de relatório fotográfico gerado pelo AutoRelatório 3.2'
    )
    parser.add_argument('--input',  required=True, help='Caminho do DOCX de entrada (gerado pelo AutoRelatório)')
    parser.add_argument('--output', required=True, help='Caminho do DOCX de saída corrigido')
    args = parser.parse_args()

    organizar_docx(args.input, args.output)



def main():
    """Entry point com argumentos via CLI."""
    parser = argparse.ArgumentParser(
        description="Organiza e corrige formatação de relatórios fotográficos DOCX",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        '--input', '-i',
        required=True,
        help='Caminho do arquivo DOCX de entrada'
    )
    parser.add_argument(
        '--output', '-o',
        required=True,
        help='Caminho do arquivo DOCX de saída'
    )
    
    args = parser.parse_args()
    
    try:
        organizar_docx(args.input, args.output)
    except Exception as e:
        print(f"[ERRO] {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    import sys
    main()
