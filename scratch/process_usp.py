import sys, os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\scratch")

from process_report import parse_docx_stream, consolidate, export_excel, export_docx

INPUT = r"C:\Users\thiag\Downloads\RELATÓRIO FOTOGRÁFICO - USP - LEVANTAMENTO PREVENTIVO.docx"
BASE_DIR = os.path.dirname(INPUT)
EXCEL_OUT = os.path.join(BASE_DIR, "LISTA DE ITENS - USP - CONSOLIDADO.xlsx")
DOCX_OUT = os.path.join(BASE_DIR, "MEMORIAL FINAL - USP - LEVANTAMENTO PREVENTIVO.docx")

def main():
    print(f"Lendo arquivo: {INPUT}")
    
    if not os.path.exists(INPUT):
        print("ERRO: Arquivo não encontrado.")
        return

    with open(INPUT, 'rb') as f:
        occurrences = parse_docx_stream(f)

    if not occurrences:
        print("Nenhuma tabela encontrada ou erro no parsing.")
        return

    print(f"Extraídas {len(occurrences)} tabelas válidas.")
    
    print("Consolidando itens...")
    cons = consolidate(occurrences)
    print(f"Total de itens únicos: {len(cons)}")

    print(f"Gerando Excel em: {EXCEL_OUT}...")
    export_excel(occurrences, cons, EXCEL_OUT)

    print(f"Gerando Memorial DOCX em: {DOCX_OUT}...")
    export_docx(cons, DOCX_OUT)

    print("\nProcessamento de USP Finalizado com Sucesso!")

if __name__ == '__main__':
    main()
