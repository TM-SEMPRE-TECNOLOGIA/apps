"""Inspeciona apenas as tabelas do item 17.7 no relatorio original."""
import sys, os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\Meus Plugins e Skills\relatorio-preventivo-v2\skills\relatorio-preventivo\references")

from docx import Document
from parse_report import iter_block_items, raw_row

INPUT = r"C:\Users\thiag\Downloads\RELATÓRIO FOTOGRÁFICO - BARRETOS - LEVANTAMENTO PREVENTIVO.docx"

with open(INPUT, 'rb') as f:
    doc = Document(f)

table_idx = 0
for block in iter_block_items(doc):
    from docx.text.paragraph import Paragraph
    from docx.table import Table

    if isinstance(block, Paragraph):
        text = block.text.strip().lower()
        if any(k in text for k in ["memorial de cálculo e itens", "resumo geral", "memorial final"]):
            break
        continue

    if isinstance(block, Table):
        rows = block.rows
        if len(rows) < 4:
            continue
        offset = -1
        for i in range(min(4, len(rows))):
            r = raw_row(rows[i])
            if r and 'Itens' in str(r[0]):
                offset = i
                break
        if offset == -1:
            continue

        table_idx += 1
        r1 = raw_row(rows[offset + 1])
        code = r1[0].strip()

        if '17.7' in code:
            print(f"\n{'='*70}")
            print(f"TABELA #{table_idx} - CODIGO: {code}")
            print(f"  Desc: {r1[1] if len(r1) > 1 else '(mesclada)'}")
            for ri in range(len(rows)):
                r = raw_row(rows[ri])
                print(f"  L{ri}: {r}")
