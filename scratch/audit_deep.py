"""
Auditoria profunda: compara cabecalhos vs linhas de dados reais.
Identifica divergencias de quantidade de colunas entre header e data rows.
"""
import sys, os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\Meus Plugins e Skills\relatorio-preventivo-v2\skills\relatorio-preventivo\references")

from docx import Document
from parse_report import iter_block_items, raw_row, parse_float

INPUT = r"C:\Users\thiag\Downloads\RELATÓRIO FOTOGRÁFICO - BARRETOS - LEVANTAMENTO PREVENTIVO.docx"

with open(INPUT, 'rb') as f:
    doc = Document(f)

table_idx = 0
issues = []

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
        headers = raw_row(rows[offset + 2])
        
        code = r1[0].strip()
        ncols_header = len(headers)
        
        has_issue = False
        
        for ri in range(offset + 3, len(rows)):
            r = raw_row(rows[ri])
            ncols_data = len(r)
            
            # Checa se a linha de dados tem numero diferente de colunas do header
            if ncols_data != ncols_header:
                has_issue = True
                issues.append({
                    'table': table_idx,
                    'code': code,
                    'header_cols': ncols_header,
                    'headers': headers,
                    'row_idx': ri,
                    'row_cols': ncols_data,
                    'row_data': r,
                })
        
        # Mostra toda tabela que tem divergencia
        if has_issue:
            print(f"\n{'!'*60}")
            print(f"TABELA #{table_idx} - CODIGO: {code}")
            print(f"  Headers ({ncols_header} cols): {headers}")
            for ri in range(offset + 3, len(rows)):
                r = raw_row(rows[ri])
                flag = " <<<< DIVERGENCIA" if len(r) != ncols_header else ""
                print(f"  R{ri} ({len(r)} cols): {r}{flag}")

# Agora mostra TODAS as tabelas com seus layouts completos para auditoria
print("\n\n" + "=" * 80)
print("RESUMO DE LAYOUTS: HEADER COLS vs DATA COLS")
print("=" * 80)

with open(INPUT, 'rb') as f:
    doc = Document(f)

table_idx = 0
layout_types = {}

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
        headers = raw_row(rows[offset + 2])
        code = r1[0].strip()
        
        # Pega as colunas reais de cada data row
        data_col_counts = set()
        for ri in range(offset + 3, len(rows)):
            r = raw_row(rows[ri])
            data_col_counts.add(len(r))
        
        key = f"H{len(headers)}_D{sorted(data_col_counts)}"
        if key not in layout_types:
            layout_types[key] = []
        layout_types[key].append((table_idx, code, headers))

print()
for key, tables in sorted(layout_types.items()):
    print(f"\nLayout: {key}  ({len(tables)} tabelas)")
    for t_idx, code, hdrs in tables[:5]:  # mostra ate 5 exemplos
        print(f"  #{t_idx} {code[:50]:50s} | {hdrs}")
    if len(tables) > 5:
        print(f"  ... e mais {len(tables) - 5} tabelas")

print(f"\n\nTotal de layouts diferentes: {len(layout_types)}")
print(f"Total de divergencias header vs data: {len(issues)}")
