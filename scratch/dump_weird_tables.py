"""Dump da tabela problematica que não tem o header 'Itens'"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\Meus Plugins e Skills\relatorio-preventivo-v2\skills\relatorio-preventivo\references")

from docx import Document
from parse_report import iter_block_items, raw_row

INPUT = r"C:\Users\thiag\Downloads\RELATÓRIO FOTOGRÁFICO - BARRETOS - LEVANTAMENTO PREVENTIVO.docx"

with open(INPUT, 'rb') as f:
    doc = Document(f)

for i, block in enumerate(iter_block_items(doc)):
    from docx.table import Table
    if isinstance(block, Table) and i in [1526, 1581]:
        print(f"\n{'='*70}\nTABELA NO BLOCO {i}")
        for r_idx, row in enumerate(block.rows):
            print(f"  L{r_idx}: {raw_row(row)}")
