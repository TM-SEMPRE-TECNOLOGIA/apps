import zipfile, sys, os

path = r'C:\Users\thiag\TM-MEUS-APPS\0 - NEXT APPS\TM Relatorio teste\output_test\RELATÓRIO FOTOGRÁFICO - RESPLENDOR - LEVANTAMENTO PREVENTIVO.docx'

if not os.path.exists(path):
    print('Arquivo não encontrado')
    sys.exit(1)

with zipfile.ZipFile(path, 'r') as z:
    # List essential parts
    essential = ['[Content_Types].xml', 'word/document.xml', 'word/_rels/document.xml.rels']
    for f in essential:
        if f in z.namelist():
            print(f'OK: {f}')
        else:
            print(f'FALTA: {f}')
    # Print first 200 chars of document.xml
    if 'word/document.xml' in z.namelist():
        data = z.read('word/document.xml').decode('utf-8')
        print('\n--- word/document.xml preview (first 300 chars) ---')
        print(data[:300])
    else:
        print('document.xml não encontrado')
