import sys
import os

sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\Meus Plugins e Skills\relatorio-preventivo-v2\skills\relatorio-preventivo\references")
from parse_report import iter_block_items, raw_row, detect_htype, parse_float
from docx import Document

docx_path = r"C:\Users\thiag\Downloads\- Teste execução - DANILO\RELATÓRIO FOTOGRÁFICO - VILA TIBERIO - LEVANTAMENTO PREVENTIVO(1).docx"

print(f"Lendo arquivo: {docx_path}")

def parse_docx_stream(stream):
    doc = Document(stream)
    occurrences = []
    
    for block in iter_block_items(doc):
        from docx.text.paragraph import Paragraph
        from docx.table import Table
        
        if isinstance(block, Paragraph):
            text = block.text.strip().lower()
            if "memorial de cálculo e itens" in text or "resumo geral" in text or "memorial final" in text:
                break
            continue

        if isinstance(block, Table):
            table = block
            rows = table.rows
            if len(rows) < 4:
                continue

            r0 = raw_row(rows[0])
            r1 = raw_row(rows[1])
            r2 = raw_row(rows[2])

            if not r0 or 'Itens' not in r0[0]:
                continue

            code = r1[0].strip()
            desc = r1[1].strip() if len(r1) > 1 else ''
            
            headers = r2
            htype = detect_htype(headers)
            last_header = headers[-1] if headers else 'Total (m²)'

            data_rows = []
            unit = ''
            for ri in range(3, len(rows) - 1):
                r = raw_row(rows[ri])
                if not r or not r[0].strip():
                    continue
                # Ignorar a linha de Total que geralmente é a última do corpo
                if r[0].strip().lower().startswith('total'):
                    continue

                if htype == 'full':
                    data_rows.append({'raw': r, 'qty_col': r[5] if len(r) > 5 else ''})
                elif htype == 'nodiscount':
                    data_rows.append({'raw': r, 'qty_col': r[3] if len(r) > 3 else ''})
                else:  # unit
                    un = r[2] if len(r) > 2 else ''
                    if un:
                        unit = un
                    data_rows.append({'raw': r, 'qty_col': r[1] if len(r) > 1 else ''})

            total_row = raw_row(rows[-1])
            total_label = total_row[0].strip() if total_row else 'Total'
            total_value = 0.0

            if htype == 'unit':
                if len(total_row) >= 3:
                    total_value = parse_float(total_row[-2])
                    unit = total_row[-1] or unit
                elif len(total_row) == 2:
                    total_value = parse_float(total_row[-1])
            else:
                total_value = parse_float(total_row[-1]) if total_row else 0.0

            occurrences.append({
                'code':        code,
                'desc':        desc,
                'htype':       htype,
                'headers':     headers,
                'last_header': last_header,
                'rows':        data_rows,
                'total_row':   total_row,
                'total_value': total_value,
                'total_label': total_label,
                'unit':        unit,
            })
    return occurrences

try:
    with open(docx_path, 'rb') as f:
        occurrences = parse_docx_stream(f)
        
    print("--- INVESTIGAÇÃO DO ITEM 13.12 ---")
    
    target_code = '13.12'
    found = False
    total_consolidado = 0.0
    
    for idx, occ in enumerate(occurrences):
        if target_code in occ['code']:
            found = True
            print(f"\n[+] Tabela de dados (Índice geral de ocorrências: {idx+1}) para {occ['code']}")
            print(f"    Descrição: {occ['desc']}")
            print(f"    Tipo: {occ['htype']} | Cabeçalhos: {occ['headers']}")
            
            print("    Linhas de Dados (raw):")
            for r_idx, r in enumerate(occ['rows']):
                print(f"      L{r_idx+1}: {r['raw']}")
                
            print(f"    Linha de Total capturada pelo parser: {occ['total_row']}")
            print(f"    Valor do Total lido pelo parser (última linha): {occ['total_value']} {occ['unit']}")
            
            # Cálculo manual das linhas de dados do corpo da tabela
            soma_linhas = 0.0
            for r in occ['rows']:
                soma_linhas += parse_float(r['qty_col'])
            print(f"    Soma manual das colunas de quantidade no corpo da tabela: {soma_linhas}")
            
            total_consolidado += occ['total_value']
            
    if not found:
        print(f"Nenhum item contendo '{target_code}' encontrado nas tabelas lidas.")
    else:
        print(f"\n=> Soma final consolidada pelo parser para {target_code}: {total_consolidado}")

except Exception as e:
    import traceback
    traceback.print_exc()
