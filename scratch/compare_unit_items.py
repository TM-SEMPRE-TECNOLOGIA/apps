"""
Compara tabelas do original vs o que o parser extraiu.
Foco em itens unitarios para achar os que estao faltando.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\Meus Plugins e Skills\relatorio-preventivo-v2\skills\relatorio-preventivo\references")
sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\scratch")

from docx import Document
from parse_report import iter_block_items, raw_row
from process_report import parse_docx_stream, consolidate, fmt

INPUT = r"C:\Users\thiag\Downloads\RELATÓRIO FOTOGRÁFICO - BARRETOS - LEVANTAMENTO PREVENTIVO.docx"

# 1. Lista TODAS as tabelas do original com seus totais
print("=" * 80)
print("TODAS AS TABELAS DO ORIGINAL (com total)")
print("=" * 80)

with open(INPUT, 'rb') as f:
    doc = Document(f)

original_tables = []
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
        headers = raw_row(rows[offset + 2])
        total_row = raw_row(rows[-1])
        
        code = r1[0].strip()
        ncols = len(headers)
        total_str = total_row[-1] if total_row else '?'
        
        original_tables.append({
            'idx': table_idx,
            'code': code,
            'ncols': ncols,
            'headers': headers,
            'total': total_str,
            'total_row': total_row,
        })

# 2. Parser output
with open(INPUT, 'rb') as f:
    occurrences = parse_docx_stream(f)

print(f"Original: {len(original_tables)} tabelas")
print(f"Parser:   {len(occurrences)} ocorrencias")

if len(original_tables) != len(occurrences):
    print(f"\n!!! DIVERGENCIA: {len(original_tables) - len(occurrences)} tabelas perdidas !!!")

# 3. Compara 1 a 1
print(f"\n{'='*80}")
print("COMPARACAO 1:1")
print("=" * 80)

for i, orig in enumerate(original_tables):
    if i < len(occurrences):
        parsed = occurrences[i]
        code_match = orig['code'].startswith(parsed['code']) or parsed['code'] in orig['code']
        total_match = str(orig['total']).strip() == fmt(parsed['total_value'])
        
        if not code_match or not total_match:
            print(f"\n  DIVERGENCIA na tabela #{orig['idx']}:")
            print(f"    Original: code={orig['code']} total={orig['total']}")
            print(f"    Parser:   code={parsed['code']} total={fmt(parsed['total_value'])} htype={parsed['htype']}")
            print(f"    Headers orig: {orig['headers']}")
            print(f"    Total row orig: {orig['total_row']}")
    else:
        print(f"\n  PERDIDA: tabela #{orig['idx']} code={orig['code']} total={orig['total']}")

# 4. Consolidado - foco unitarios
print(f"\n{'='*80}")
print("CONSOLIDADO - ITENS UNITARIOS")
print("=" * 80)

cons = consolidate(occurrences)
for code, d in cons.items():
    if d['htype'] == 'unit':
        # Conta quantas ocorrencias no original
        orig_count = sum(1 for t in original_tables if t['code'].startswith(code + ' ') or t['code'] == code)
        print(f"  {code:12s} | total={fmt(d['total']):>8s} {d['unit']:>3s} | linhas={len(d['rows'])} | ocorrencias_orig={orig_count}")

# 5. Mostra os totais individuais por ocorrencia para cada item unitario
print(f"\n{'='*80}")
print("DETALHAMENTO POR OCORRENCIA (unitarios)")
print("=" * 80)

for code, d in cons.items():
    if d['htype'] == 'unit':
        print(f"\n  >>> {code}:")
        for occ in occurrences:
            if occ['code'] == code:
                print(f"      total={fmt(occ['total_value'])} | rows={len(occ['rows'])} | label={occ['total_label']}")
