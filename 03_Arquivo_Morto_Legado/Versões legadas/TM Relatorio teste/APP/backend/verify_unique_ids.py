import zipfile
import re
import os

path = r'C:\Users\thiag\TM-MEUS-APPS\0 - NEXT APPS\TM Relatorio teste\output_test\RELATÓRIO FOTOGRÁFICO - ITAMONTE - (Relatório sendo feito) - SP.docx'

if os.path.exists(path):
    with zipfile.ZipFile(path) as z:
        xml_content = z.read('word/document.xml').decode('utf-8')
        # Procura por IDs em docPr e cNvSpPr
        docpr_ids = re.findall(r'wp:docPr id="(\d+)"', xml_content)
        unique_ids = set(docpr_ids)
        print(f"Total Shapes: {len(docpr_ids)}")
        print(f"IDs Únicos: {len(unique_ids)}")
        if len(docpr_ids) != len(unique_ids):
            print("AVISO: Existem IDs duplicados!")
        else:
            print("SUCESSO: Todos os IDs de Shape são únicos.")
else:
    print(f"Arquivo não encontrado: {path}")
