import zipfile
import re
import os

path = r'C:\Users\thiag\TM-MEUS-APPS\0 - NEXT APPS\TM Relatorio teste\output_test\RELATÓRIO FOTOGRÁFICO - ITAMONTE - (Relatório sendo feito) - SP.docx'

if os.path.exists(path):
    with zipfile.ZipFile(path) as z:
        xml_content = z.read('word/document.xml').decode('utf-8')
        count = xml_content.count('wps:wsp')
        print(f"Shapes (wps:wsp) encontrados: {count}")
        # Também verifica se o preenchimento vermelho está lá
        red_fills = xml_content.count('a:srgbClr val="C00000"')
        print(f"Preenchimentos vermelhos (#C00000) encontrados: {red_fills}")
else:
    print(f"Arquivo não encontrado em: {path}")
