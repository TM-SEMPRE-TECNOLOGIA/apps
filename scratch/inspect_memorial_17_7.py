"""Inspeciona o memorial gerado - tabela 17.7"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\Meus Plugins e Skills\relatorio-preventivo-v2\skills\relatorio-preventivo\references")

from docx import Document
from parse_report import iter_block_items, raw_row

MEMORIAL = r"C:\Users\thiag\Downloads\MEMORIAL FINAL - BARRETOS - LEVANTAMENTO PREVENTIVO.docx"

with open(MEMORIAL, 'rb') as f:
    doc = Document(f)

for i, table in enumerate(doc.tables):
    rows = table.rows
    r1 = raw_row(rows[1]) if len(rows) > 1 else []
    code = r1[0].strip() if r1 else ''
    if '17.7' in code:
        print(f"\n{'='*70}")
        print(f"MEMORIAL - TABELA 17.7")
        for ri, row in enumerate(rows):
            print(f"  L{ri}: {raw_row(row)}")
