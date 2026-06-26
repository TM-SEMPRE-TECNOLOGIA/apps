"""
Engenharia reversa do DOCX RESPLENDOR para extrair a estrutura XML das TextBoxes.
Extrai o primeiro bloco completo de TextBox (wps:wsp) para análise.
"""
import zipfile
import re
import os
from lxml import etree

path = r'C:\Users\thiag\TM-MEUS-APPS\0 - NEXT APPS\TM Relatorio teste\output_test\RELATÓRIO FOTOGRÁFICO - RESPLENDOR - LEVANTAMENTO PREVENTIVO.docx'

if not os.path.exists(path):
    print('Arquivo não encontrado!')
    exit(1)

with zipfile.ZipFile(path, 'r') as z:
    xml_bytes = z.read('word/document.xml')
    
root = etree.fromstring(xml_bytes)

# Namespaces
nsmap = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    'wps': 'http://schemas.microsoft.com/office/word/2010/wordprocessingShape',
    'mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'v': 'urn:schemas-microsoft-com:vml',
    'w14': 'http://schemas.microsoft.com/office/word/2010/wordml',
    'wp14': 'http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing14',
}

# 1. Procura por w:drawing (método moderno de Shapes)
drawings = root.findall('.//w:drawing', nsmap)
print(f'Total de w:drawing encontrados: {len(drawings)}')

# 2. Procura por wps:wsp (WordProcessing Shape - TextBox)
shapes = root.findall('.//wps:wsp', nsmap)
print(f'Total de wps:wsp (shapes) encontrados: {len(shapes)}')

# 3. Procura por mc:AlternateContent (que costuma envolver shapes)
alt_content = root.findall('.//mc:AlternateContent', nsmap)
print(f'Total de mc:AlternateContent encontrados: {len(alt_content)}')

# 4. Procura por VML (fallback mais antigo)
vml_shapes = root.findall('.//v:shape', nsmap)
print(f'Total de v:shape (VML) encontrados: {len(vml_shapes)}')

# 5. Extrai o XML completo do PRIMEIRO w:drawing que contenha um textbox
print('\n' + '='*80)
print('EXTRAINDO PRIMEIRO BLOCO DE TEXTBOX COMPLETO:')
print('='*80)

# Procura o primeiro drawing que contenha um wps:wsp
found = False
for drawing in drawings:
    wsp = drawing.findall('.//wps:wsp', nsmap)
    if wsp:
        # Pega o parágrafo pai (w:p) que contém este drawing
        # Navega para cima para encontrar o w:r e w:p
        parent_run = drawing.getparent()  # w:r
        if parent_run is not None:
            parent_para = parent_run.getparent()  # w:p
            if parent_para is not None:
                xml_str = etree.tostring(parent_para, pretty_print=True).decode('utf-8')
                print(xml_str[:5000])
                
                # Salva o XML completo em arquivo para análise
                with open('textbox_xml_sample.xml', 'w', encoding='utf-8') as f:
                    f.write(xml_str)
                print(f'\n[Saved full XML to textbox_xml_sample.xml - {len(xml_str)} chars]')
                found = True
                break

if not found:
    print('Nenhum w:drawing com wps:wsp encontrado!')
    # Tenta encontrar via mc:AlternateContent
    print('\nTentando via mc:AlternateContent...')
    for ac in alt_content[:3]:
        xml_str = etree.tostring(ac, pretty_print=True).decode('utf-8')
        print(xml_str[:3000])
        print('---')
        with open('textbox_xml_sample.xml', 'w', encoding='utf-8') as f:
            f.write(xml_str)
        break

# 6. Verifica se o documento tem textboxes em VML
if vml_shapes:
    print('\n' + '='*80)
    print('PRIMEIRO BLOCO VML:')
    print('='*80)
    vml_parent = vml_shapes[0].getparent()
    if vml_parent is not None:
        xml_str = etree.tostring(vml_parent, pretty_print=True).decode('utf-8')
        print(xml_str[:3000])
        with open('textbox_vml_sample.xml', 'w', encoding='utf-8') as f:
            f.write(xml_str)
        print(f'\n[Saved VML to textbox_vml_sample.xml - {len(xml_str)} chars]')

# 7. Extrai os IDs usados para entender padrão
print('\n' + '='*80)
print('ANÁLISE DE IDs:')
print('='*80)
doc_prs = root.findall('.//wp:docPr', nsmap)
ids_used = []
for dp in doc_prs:
    id_val = dp.get('id')
    name_val = dp.get('name')
    if id_val:
        ids_used.append(int(id_val))
    if name_val and 'Text' in name_val:
        print(f'  docPr id={id_val} name="{name_val}"')

if ids_used:
    print(f'\nRange de IDs: {min(ids_used)} a {max(ids_used)}')
    print(f'Total de IDs: {len(ids_used)}')
    print(f'IDs únicos: {len(set(ids_used))}')
    if len(ids_used) != len(set(ids_used)):
        from collections import Counter
        dupes = {k:v for k,v in Counter(ids_used).items() if v > 1}
        print(f'DUPLICADOS: {dupes}')
