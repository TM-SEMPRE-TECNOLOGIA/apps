#!/usr/bin/env python3
"""
validar_docx.py
===============
Valida um relatorio fotografico organizado contra as 9 regras de formatacao.

Uso:
  python validar_docx.py --file relatorio_organizado.docx
"""

import argparse
import zipfile
import xml.etree.ElementTree as ET
import math
from pathlib import Path

NS = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

SUBTITLE_PREFIXES = (
    '- vista ampla',
    '- detalhes',
    '- croqui',
    '- vista geral',
    '- detalhe',
)


def get_text(para):
    parts = []
    for r in para.findall(f'.//{NS}r'):
        for t in r.findall(f'{NS}t'):
            parts.append(t.text or '')
    return ''.join(parts).strip()


def has_image(para):
    return bool(para.findall(f'.//{NS}drawing'))


def has_page_break(para):
    for br in para.findall(f'.//{NS}br'):
        if br.get(f'{NS}type') == 'page':
            return True
    return False


def get_jc(para):
    pPr = para.find(f'{NS}pPr')
    if pPr is not None:
        jc = pPr.find(f'{NS}jc')
        if jc is not None:
            return jc.get(f'{NS}val')
    return None


def is_subtitle(para):
    txt = get_text(para).lower()
    return any(txt.startswith(p) for p in SUBTITLE_PREFIXES)


def validar(file_path: str):
    file_path = Path(file_path)
    if not file_path.exists():
        raise FileNotFoundError(f"Arquivo nao encontrado: {file_path}")

    with zipfile.ZipFile(file_path, 'r') as z:
        xml_content = z.read('word/document.xml')

    root = ET.fromstring(xml_content)
    body = None
    for elem in root.iter():
        if elem.tag == f'{NS}body':
            body = elem
            break

    if body is None:
        raise ValueError("Nao foi possivel localizar <w:body>")

    children = list(body)
    paras = [c for c in children if c.tag == f'{NS}p']

    total_imgs = 0
    adj_img_pairs = 0
    page_breaks = 0
    subtitulos_both = 0
    subtitulos_wrong = 0
    vazios_sem_center = 0
    vazios_center = 0

    # Contar imagens em tabelas diretas do body
    for tbl in body:
        if tbl.tag == f'{NS}tbl':
            drawings = tbl.findall(f'.//{NS}drawing')
            total_imgs += len(drawings)

    for i, p in enumerate(paras):
        txt = get_text(p)
        img = has_image(p)
        pb = has_page_break(p)
        jc = get_jc(p)

        if img:
            total_imgs += 1
            next_p = paras[i + 1] if i + 1 < len(paras) else None
            if next_p is not None and has_image(next_p):
                adj_img_pairs += 1

        if pb:
            page_breaks += 1

        if is_subtitle(p):
            if jc == 'both':
                subtitulos_both += 1
            else:
                subtitulos_wrong += 1

        if txt == '' and not img and not pb:
            prev_img = (i > 0 and has_image(paras[i - 1]))
            next_img = (i + 1 < len(paras) and has_image(paras[i + 1]))
            if prev_img or next_img:
                if jc == 'center':
                    vazios_center += 1
                else:
                    vazios_sem_center += 1

    expected_pbs = math.ceil(total_imgs / 2)
    pb_ok = (page_breaks == expected_pbs)

    print(f"\n{'=' * 50}")
    print(f"  Validacao: {file_path.name}")
    print(f"{'=' * 50}")
    print(f"  total_paragrafos  : {len(paras)}")
    print(f"  total_imagens     : {total_imgs}")
    print(f"  expected_pbs      : {expected_pbs}  (ceil({total_imgs}/2))")
    print()
    print(f"  adj_img_pairs     : {adj_img_pairs}   {'OK' if adj_img_pairs == 0 else 'PROBLEMA'}")
    print(f"  page_breaks       : {page_breaks}   {'OK' if pb_ok else f'ESPERADO {expected_pbs}'}")
    print(f"  subtitulos_both   : {subtitulos_both}")
    print(f"  subtitulos_wrong  : {subtitulos_wrong}   {'OK' if subtitulos_wrong == 0 else 'PROBLEMA'}")
    print(f"  vazios_center     : {vazios_center}")
    print(f"  vazios_sem_center : {vazios_sem_center}   {'OK' if vazios_sem_center == 0 else 'PROBLEMA'}")
    print()

    all_ok = (
        adj_img_pairs == 0 and
        pb_ok and
        subtitulos_wrong == 0 and
        vazios_sem_center == 0
    )

    if all_ok:
        print("  APROVADO -- formatacao conforme o padrao")
    else:
        print("  COM PROBLEMAS -- veja itens acima")

    print(f"{'=' * 50}\n")
    return all_ok


def main():
    parser = argparse.ArgumentParser(description='Valida formatacao de relatorio fotografico organizado')
    parser.add_argument('--file', required=True, help='Caminho do DOCX a validar')
    args = parser.parse_args()
    validar(args.file)


if __name__ == '__main__':
    main()
