import sys
import os

sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\scratch")
from process_report import parse_docx_stream, consolidate, export_excel, export_docx

input_path = r"C:\Users\thiag\Downloads\RELATÓRIO FOTOGRÁFICO - BARRETOS - LEVANTAMENTO PREVENTIVO.docx"

output_dir = os.path.dirname(input_path)
excel_out = os.path.join(output_dir, "LISTA DE ITENS - BARRETOS - CONSOLIDADO.xlsx")
docx_out = os.path.join(output_dir, "MEMORIAL FINAL - BARRETOS - LEVANTAMENTO PREVENTIVO.docx")

print(f"Lendo arquivo: {input_path}")
try:
    with open(input_path, 'rb') as f:
        occurrences = parse_docx_stream(f)
        
    print(f"Extraídas {len(occurrences)} tabelas válidas.")
    
    print("Consolidando itens...")
    consolidated = consolidate(occurrences)
    print(f"Total de itens únicos: {len(consolidated)}")

    print(f"Gerando Excel em: {excel_out}...")
    export_excel(occurrences, consolidated, excel_out)

    print(f"Gerando Memorial DOCX em: {docx_out}...")
    export_docx(consolidated, docx_out)

    print("\nProcessamento de Barretos Finalizado com Sucesso!")
    
except Exception as e:
    import traceback
    print("Erro durante o processamento:")
    traceback.print_exc()
