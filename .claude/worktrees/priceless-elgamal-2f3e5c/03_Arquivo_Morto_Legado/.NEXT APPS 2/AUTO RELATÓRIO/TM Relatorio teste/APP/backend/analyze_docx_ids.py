import zipfile, re, sys, os

path = r'C:\Users\thiag\TM-MEUS-APPS\0 - NEXT APPS\TM Relatorio teste\output_test\RELATÓRIO FOTOGRÁFICO - RESPLENDOR - LEVANTAMENTO PREVENTIVO.docx'

if not os.path.exists(path):
    print('Arquivo não encontrado')
    sys.exit(1)

with zipfile.ZipFile(path, 'r') as z:
    if 'word/document.xml' not in z.namelist():
        print('document.xml não encontrado')
        sys.exit(1)
    xml = z.read('word/document.xml').decode('utf-8')
    # Encontrar todos os ids de docPr (Shapes)
    ids = re.findall(r'wp:docPr[^>]*id="(\d+)"', xml)
    print(f'Encontrados {len(ids)} ids de wp:docPr')
    # Contar duplicados
    from collections import Counter
    cnt = Counter(ids)
    dup = [i for i,c in cnt.items() if c>1]
    if dup:
        print('IDs duplicados:', dup)
    else:
        print('Nenhum ID duplicado encontrado')
    # Opcional: listar alguns ids
    print('Primeiros 20 ids:', ids[:20])
