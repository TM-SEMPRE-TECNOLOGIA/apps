"""
Auditoria completa: le o relatorio original tabela por tabela.
"""
import sys
import os
os.environ['PYTHONIOENCODING'] = 'utf-8'
sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\Meus Plugins e Skills\relatorio-preventivo-v2\skills\relatorio-preventivo\references")
sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\scratch")

from docx import Document
from parse_report import iter_block_items, raw_row, detect_htype, parse_float

INPUT = r"C:\Users\thiag\Downloads\RELATÓRIO FOTOGRÁFICO - BARRETOS - LEVANTAMENTO PREVENTIVO.docx"

print("=" * 80)
print("DUMP COMPLETO DO RELATORIO ORIGINAL")
print("=" * 80)

with open(INPUT, 'rb') as f:
    doc = Document(f)

table_idx = 0
for block in iter_block_items(doc):
    from docx.text.paragraph import Paragraph
    from docx.table import Table

    if isinstance(block, Paragraph):
        text = block.text.strip().lower()
        if "memorial de calculo e itens" in text or "memorial de cálculo e itens" in text or "resumo geral" in text or "memorial final" in text:
            print(f"\n>>> PARADA: encontrou '{block.text.strip()}'")
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
        r2 = raw_row(rows[offset + 2])

        code = r1[0].strip()
        desc = r1[1].strip() if len(r1) > 1 else '(mesclada)'
        ncols = len(r2)
        htype = detect_htype(r2)

        print(f"\n---TABLE #{table_idx}---")
        print(f"  Code: {code}")
        print(f"  Desc: {desc[:80]}")
        print(f"  Cols: {ncols} | htype: {htype}")
        print(f"  Headers: {r2}")
        for ri in range(offset + 3, len(rows)):
            r = raw_row(rows[ri])
            print(f"    R{ri}: {r}")

print(f"\n\nTotal tabelas validas: {table_idx}")
