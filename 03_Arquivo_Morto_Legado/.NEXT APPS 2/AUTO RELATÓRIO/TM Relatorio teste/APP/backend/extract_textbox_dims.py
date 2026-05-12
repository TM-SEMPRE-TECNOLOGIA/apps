"""
Extrai múltiplas TextBoxes do RESPLENDOR para encontrar as legendas pequenas (tipo "2,80 m").
"""
import zipfile, re
from lxml import etree

path = r'C:\Users\thiag\TM-MEUS-APPS\0 - NEXT APPS\TM Relatorio teste\output_test\RELATÓRIO FOTOGRÁFICO - RESPLENDOR - LEVANTAMENTO PREVENTIVO.docx'

with zipfile.ZipFile(path, 'r') as z:
    xml_bytes = z.read('word/document.xml')
    
root = etree.fromstring(xml_bytes)

nsmap = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    'wps': 'http://schemas.microsoft.com/office/word/2010/wordprocessingShape',
    'mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'w14': 'http://schemas.microsoft.com/office/word/2010/wordml',
}

# Encontra todos os mc:AlternateContent que contêm TextBoxes
alt_contents = root.findall('.//mc:AlternateContent', nsmap)

print(f"Total mc:AlternateContent: {len(alt_contents)}")
print("="*80)

count = 0
for ac in alt_contents:
    # Procura wps:wsp dentro
    wsps = ac.findall('.//wps:wsp', nsmap)
    if not wsps:
        continue
    
    for wsp in wsps:
        # Extrai o texto do txbxContent
        txbx_texts = wsp.findall('.//w:txbxContent//w:t', nsmap)
        text_content = ''.join([t.text or '' for t in txbx_texts])
        
        # Extrai dimensões do anchor
        anchor = ac.find('.//wp:anchor', nsmap)
        if anchor is not None:
            extent = anchor.find('wp:extent', nsmap)
            cx = extent.get('cx') if extent is not None else '?'
            cy = extent.get('cy') if extent is not None else '?'
        else:
            cx, cy = '?', '?'
        
        # Extrai bodyPr
        body_pr = wsp.find('.//wps:bodyPr', nsmap)
        if body_pr is not None:
            lIns = body_pr.get('lIns', '?')
            tIns = body_pr.get('tIns', '?')
            rIns = body_pr.get('rIns', '?')
            bIns = body_pr.get('bIns', '?')
            anchor_val = body_pr.get('anchor', '?')
            autofit = body_pr.find('a:spAutoFit', nsmap)
            noautofit = body_pr.find('a:noAutofit', nsmap)
            fit_type = 'spAutoFit' if autofit is not None else ('noAutofit' if noautofit is not None else '?')
        else:
            lIns = tIns = rIns = bIns = anchor_val = fit_type = '?'
        
        # Filtra: mostra apenas legendas curtas (tipo medidas)
        text_short = text_content.strip()
        if len(text_short) < 30:  # Legendas curtas
            count += 1
            print(f"\n--- TextBox #{count}: \"{text_short}\" ---")
            print(f"  Dimensões: cx={cx} cy={cy}")
            print(f"  Margens: L={lIns} T={tIns} R={rIns} B={bIns}")
            print(f"  Anchor: {anchor_val}")
            print(f"  AutoFit: {fit_type}")
            
            if count >= 10:
                break
    
    if count >= 10:
        break

if count == 0:
    print("\nNenhuma legenda curta encontrada. Mostrando as primeiras 5:")
    count2 = 0
    for ac in alt_contents[:5]:
        wsps = ac.findall('.//wps:wsp', nsmap)
        for wsp in wsps:
            txbx_texts = wsp.findall('.//w:txbxContent//w:t', nsmap)
            text_content = ''.join([t.text or '' for t in txbx_texts])
            
            anchor = ac.find('.//wp:anchor', nsmap)
            extent = anchor.find('wp:extent', nsmap) if anchor is not None else None
            cx = extent.get('cx') if extent is not None else '?'
            cy = extent.get('cy') if extent is not None else '?'
            
            body_pr = wsp.find('.//wps:bodyPr', nsmap)
            lIns = body_pr.get('lIns', '?') if body_pr is not None else '?'
            tIns = body_pr.get('tIns', '?') if body_pr is not None else '?'
            rIns = body_pr.get('rIns', '?') if body_pr is not None else '?'
            bIns = body_pr.get('bIns', '?') if body_pr is not None else '?'
            
            count2 += 1
            print(f"\n--- TextBox #{count2}: \"{text_content[:60]}\" ---")
            print(f"  Dimensões: cx={cx} cy={cy}")
            print(f"  Margens: L={lIns} T={tIns} R={rIns} B={bIns}")
