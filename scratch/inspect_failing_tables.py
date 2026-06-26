import sys
from docx import Document

sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\scratch")
from process_report import iter_block_items, raw_row

input_path = r"C:\Users\thiag\Downloads\RELATÓRIO FOTOGRÁFICO - BARRETOS - LEVANTAMENTO PREVENTIVO.docx"

print(f"Lendo e inspecionando arquivo: {input_path}")
try:
    with open(input_path, 'rb') as f:
        doc = Document(f)
        
        for block in iter_block_items(doc):
            from docx.text.paragraph import Paragraph
            from docx.table import Table
            
            if isinstance(block, Table):
                table = block
                rows = table.rows
                if len(rows) < 4:
                    continue
                    
                offset = -1
                for i in range(min(4, len(rows))):
                    r = raw_row(rows[i])
                    if r and 'Itens' in str(r[0]):
                        offset = i
                        break
                        
                if offset == -1 or len(rows) < offset + 4:
                    continue
                    
                r1 = raw_row(rows[offset + 1])
                code = r1[0].strip()
                
                # Vamos focar apenas nestes itens problemáticos
                if code in ['17.1', '15.6', '19.6', '12.10', '19.37', '17.7']:
                    print(f"\n================ TABELA (Item {code}) ================")
                    for r_idx, row in enumerate(block.rows):
                        print(f"L{r_idx}: {raw_row(row)}")

except Exception as e:
    import traceback
    traceback.print_exc()

