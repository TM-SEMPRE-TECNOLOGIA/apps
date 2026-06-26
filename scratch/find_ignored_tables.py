"""Procura por tabelas no documento que parecem itens do relatorio mas foram ignoradas pelo parser."""
import sys
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
        continue

    if isinstance(block, Table):
        rows = block.rows
        if len(rows) < 2:
            continue
        
        # O parser exige que a palavra 'Itens' esteja em uma das 4 primeiras linhas
        offset = -1
        for i in range(min(4, len(rows))):
            r = raw_row(rows[i])
            if r and 'Itens' in str(r[0]):
                offset = i
                break
        
        if offset == -1:
            # Tabela ignorada pelo parser. Vamos ver se tem cara de item.
            # Geralmente itens começam com um número "X.Y"
            r0 = raw_row(rows[0])
            if r0 and len(r0) > 0:
                text = str(r0[0]).strip()
                import re
                if re.match(r'^\d+\.\d+', text):
                    print(f"TABELA IGNORADA COM CARA DE ITEM:")
                    print(f"  R0: {r0}")
                    if len(rows) > 1:
                        print(f"  R1: {raw_row(rows[1])}")
                    print("-" * 50)
