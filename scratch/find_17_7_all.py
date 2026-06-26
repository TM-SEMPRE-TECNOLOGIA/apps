"""Encontra TODAS as tabelas do documento e lista as ocorrencias do 17.7 ou tabelas perdidas"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\Meus Plugins e Skills\relatorio-preventivo-v2\skills\relatorio-preventivo\references")

from docx import Document
from parse_report import iter_block_items, raw_row

INPUT = r"C:\Users\thiag\Downloads\RELATÓRIO FOTOGRÁFICO - BARRETOS - LEVANTAMENTO PREVENTIVO.docx"

with open(INPUT, 'rb') as f:
    doc = Document(f)

for i, block in enumerate(iter_block_items(doc)):
    from docx.text.paragraph import Paragraph
    from docx.table import Table

    if isinstance(block, Table):
        rows = block.rows
        if len(rows) > 0:
            for r_idx, row in enumerate(rows):
                r = raw_row(row)
                if r and any('17.7' in str(cell) for cell in r):
                    print(f"Achei '17.7' no bloco {i}, linha {r_idx}: {r}")

        # Check for tables that might not have "Itens"
        if len(rows) >= 2:
            r1 = raw_row(rows[0])
            r2 = raw_row(rows[1])
            if r1 and r2 and len(r2) > 0 and '17.7' in str(r2[0]):
                print(f"Tabela estranha com 17.7: {r1} | {r2}")
