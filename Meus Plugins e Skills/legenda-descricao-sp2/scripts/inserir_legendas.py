"""
inserir_legendas.py — Skill legendar-fotos-SP2
Insere "Foto N:" em negrito abaixo de cada imagem em relatórios .docx.
Detecta imagens em parágrafos soltos e em células de tabela.

Uso:
    python3 inserir_legendas.py <input.docx> <output.docx>
"""

import sys
import re
from docx import Document
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

A_NS = 'http://schemas.openxmlformats.org/drawingml/2006/main'
WP_NS = 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing'


def count_inline_shapes(elem):
    """Conta apenas imagens alinhadas ao texto (InlineShapes), assim como o VBA original."""
    return len(elem.findall('.//' + qn('wp:inline'), {'wp': WP_NS}))


def get_text(elem):
    """Extrai texto concatenado de todos os w:t dentro de um elemento."""
    return ''.join(t.text or '' for t in elem.findall('.//' + qn('w:t')))


def is_caption(elem):
    """Verifica se um elemento já é uma legenda 'Foto N'."""
    return bool(re.match(r'^\s*Foto\s*\d', get_text(elem), re.IGNORECASE))


def make_caption_para(foto_num):
    """
    Cria um parágrafo XML com 'Foto N:' em negrito e centralizado.
    Estilo: Normal, alinhamento center, run com <w:b/>.
    """
    p = OxmlElement('w:p')

    # Propriedades do parágrafo: centralizado
    pPr = OxmlElement('w:pPr')
    jc = OxmlElement('w:jc')
    jc.set(qn('w:val'), 'center')
    pPr.append(jc)
    p.append(pPr)

    # Run com negrito
    r = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    b = OxmlElement('w:b')
    rPr.append(b)
    r.append(rPr)

    t = OxmlElement('w:t')
    t.text = f'Foto {foto_num} –'
    r.append(t)
    p.append(r)

    return p


def detectar_ultimo_numero(body):
    """
    Percorre todo o body e retorna o maior número de legenda já existente.
    Retorna 2 se Foto 1 e Foto 2 forem as únicas, ou 0 se não houver nenhuma.
    """
    max_num = 0
    for t_elem in body.findall('.//' + qn('w:t')):
        txt = (t_elem.text or '').strip()
        m = re.match(r'^Foto\s*(\d+)', txt, re.IGNORECASE)
        if m:
            n = int(m.group(1))
            if n > max_num:
                max_num = n
    return max_num


def coletar_operacoes(body, children):
    """
    Percorre o body e coleta todos os elementos de imagem que precisam de legenda.
    Retorna lista de elementos âncora (onde inserir addnext).
    """
    ops = []

    for i, child in enumerate(children):
        tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag

        # Caso 1: parágrafo solto com imagem
        if tag == 'p':
            inline_count = count_inline_shapes(child)
            if inline_count > 0:
                nxt = children[i + 1] if i + 1 < len(children) else None
                if nxt is None or not is_caption(nxt):
                    for _ in range(inline_count):
                        ops.append(child)

        # Caso 2: tabela com imagens (fotos lado a lado)
        elif tag == 'tbl':
            if count_inline_shapes(child) > 0:
                for row in child.findall(qn('w:tr')):
                    for cell in row.findall(qn('w:tc')):
                        paras = cell.findall(qn('w:p'))
                        for pi, para in enumerate(paras):
                            inline_count = count_inline_shapes(para)
                            if inline_count > 0:
                                nxt = paras[pi + 1] if pi + 1 < len(paras) else None
                                if nxt is None or not is_caption(nxt):
                                    for _ in range(inline_count):
                                        ops.append(para)

    return ops


def inserir_legendas(input_path, output_path):
    print(f"Carregando: {input_path}")
    doc = Document(input_path)
    body = doc.element.body
    children = list(body)

    # Detectar numeração existente
    ultimo_num = detectar_ultimo_numero(body)
    proximo_num = ultimo_num + 1
    print(f"Último número de foto encontrado: {ultimo_num} → começando em Foto {proximo_num}")

    # Coletar onde inserir
    ops = coletar_operacoes(body, children)
    total = len(ops)
    print(f"Imagens sem legenda encontradas: {total}")

    if total == 0:
        print("Nenhuma legenda a inserir. Documento já está completo.")
        doc.save(output_path)
        return

    # Inserir de trás para frente para não deslocar posições
    for idx, anchor in enumerate(reversed(ops)):
        foto_num = proximo_num + (total - 1 - idx)
        anchor.addnext(make_caption_para(foto_num))

    doc.save(output_path)
    print(f"Legendas inseridas: {total} (Foto {proximo_num} a Foto {proximo_num + total - 1})")
    print(f"Salvo em: {output_path}")


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Uso: python3 inserir_legendas.py <input.docx> <output.docx>")
        sys.exit(1)
    inserir_legendas(sys.argv[1], sys.argv[2])
