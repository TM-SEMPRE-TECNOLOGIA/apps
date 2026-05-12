from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    directory: str

def parse_legenda(nome_arquivo):
    # Remove a numeração inicial se existir (ex: "1 - " ou "1.1 - ")
    nome = re.sub(r'^\d+(\.\d+)?\s*-\s*', '', nome_arquivo)
    # Remove extensão
    nome = os.path.splitext(nome)[0].strip()

    # Ignora os arquivos que começam com IMG-
    if nome.upper().startswith("IMG-"):
        return []

    # 1. Verifica padrão com desconto/emassamento no final: "2,00 x 3,00 - Desconto 9,00m²"
    match_desc = re.search(r'^(\d+,\d+)\s*[xX]\s*(\d+,\d+)\s*[-_]?\s*(Desconto.*|Emassamento.*)', nome, re.IGNORECASE)
    if match_desc:
        return [match_desc.group(1) + " m", match_desc.group(2) + " m", match_desc.group(3).strip()]
        
    # 2. Verifica padrão simples: "5,00 x 2,30" ou "5,00x2,30"
    match_simples = re.search(r'^(\d+,\d+)\s*[xX]\s*(\d+,\d+)', nome)
    if match_simples:
        return [match_simples.group(1) + " m", match_simples.group(2) + " m"]
        
    # 3. Verifica texto livre de detalhe (deve conter m² ou palavras-chave)
    termo_lower = nome.lower()
    if "m²" in termo_lower or "m2" in termo_lower or "emassamento" in termo_lower or "desconto" in termo_lower or "pintura" in termo_lower:
        return [nome]
        
    return []

def generate_vba_code(directory):
    if not os.path.isdir(directory):
        raise ValueError(f"O diretório '{directory}' não existe.")

    legendas_encontradas = []

    for root_dir, dirs, files in os.walk(directory):
        # Ignorar pastas - Vista ampla
        if "- Vista ampla" in root_dir:
            continue
            
        arquivos_imagens = [f for f in files if f.lower().endswith((".png", ".jpg", ".jpeg"))]
        
        for imagem in arquivos_imagens:
            textos = parse_legenda(imagem)
            if textos:
                caminho_relativo = os.path.relpath(root_dir, directory)
                legendas_encontradas.append({
                    "arquivo": imagem,
                    "pasta": caminho_relativo if caminho_relativo != "." else "Raiz",
                    "textos": textos
                })

    if not legendas_encontradas:
        return "Nenhuma legenda identificada nas pastas fornecidas.", []

    # Gerar Código VBA
    vba = []
    
    # Dividir em blocos de 50 para evitar o erro "Procedimento muito grande"
    chunk_size = 50
    chunks = [legendas_encontradas[i:i + chunk_size] for i in range(0, len(legendas_encontradas), chunk_size)]
    
    # 1. Sub principal que coordena tudo
    vba.append('Sub InserirLegendas()')
    vba.append('    Dim oDoc As Document')
    vba.append('    Dim imgIdx As Long')
    vba.append('    Set oDoc = ActiveDocument')
    vba.append('    imgIdx = 1 \' Contador de imagens no documento')
    vba.append('')
    for i in range(len(chunks)):
        vba.append(f'    InserirLegendas_Parte{i+1} oDoc, imgIdx')
    vba.append('')
    vba.append('    MsgBox "Todas as legendas foram inseridas com sucesso!", vbInformation, "TM Gerador VBA"')
    vba.append('End Sub')
    vba.append('')

    # 2. Subs de Partes (contendo as chamadas reais)
    for i, chunk in enumerate(chunks):
        vba.append(f'Sub InserirLegendas_Parte{i+1}(doc As Document, ByRef idx As Long)')
        for item in chunk:
            vba.append(f'    \' --- Foto: "{item["arquivo"]}" ---')
            left_pos = 10 # Posição relativa à ancoragem
            for texto in item["textos"]:
                width = 56.7 if len(texto) <= 12 else 150
                vba.append(f'    CriarCaixaTexto doc, "{texto}", {left_pos}, idx, {width}')
                left_pos = left_pos + width + 10
            vba.append(f'    idx = idx + 1')
            vba.append('')
        vba.append('End Sub')
        vba.append('')

    # 3. Sub-rotina auxiliar (Helper) para criação da caixa
    vba.append('Sub CriarCaixaTexto(doc As Document, txt As String, leftPos As Single, imgIdx As Long, w As Single)')
    vba.append('    Dim shp As Shape')
    vba.append('    Dim targetImg As InlineShape')
    vba.append('    ')
    vba.append('    \' Tenta encontrar a imagem correspondente no documento')
    vba.append('    If doc.InlineShapes.Count >= imgIdx Then')
    vba.append('        Set targetImg = doc.InlineShapes(imgIdx)')
    vba.append('        \' Adiciona caixa de texto ancorada ao range da imagem')
    vba.append('        Set shp = doc.Shapes.AddTextbox(1, leftPos, 10, w, 18, targetImg.Range)')
    vba.append('    Else')
    vba.append('        \' Caso não encontre a imagem, adiciona na posição genérica')
    vba.append('        Set shp = doc.Shapes.AddTextbox(1, leftPos, imgIdx * 20, w, 18)')
    vba.append('    End If')
    vba.append('    ')
    vba.append('    With shp.TextFrame.TextRange')
    vba.append('        .Text = txt')
    vba.append('        .Font.Size = 11')
    vba.append('        .Font.Bold = True')
    vba.append('        .Font.Color.RGB = RGB(255, 255, 255) \' Branco')
    vba.append('        .ParagraphFormat.Alignment = 1 \' Center')
    vba.append('    End With')
    vba.append('    ')
    vba.append('    With shp')
    vba.append('        .Fill.Visible = -1')
    vba.append('        .Fill.ForeColor.RGB = RGB(192, 0, 0) \' Vermelho TM')
    vba.append('        .Line.Visible = -1')
    vba.append('        .Line.Weight = 0.5')
    vba.append('        .Line.ForeColor.RGB = RGB(0, 0, 0) \' Borda preta fina')
    vba.append('        ')
    vba.append('        \' Ajuste de margens internas (em pontos: 0.25cm ~ 7pt, 0.13cm ~ 3.7pt)')
    vba.append('        .TextFrame.MarginLeft = 7')
    vba.append('        .TextFrame.MarginRight = 7')
    vba.append('        .TextFrame.MarginTop = 3.5')
    vba.append('        .TextFrame.MarginBottom = 3.5')
    vba.append('        .TextFrame.AutoSize = 1 \' Redimensionar para ajustar ao texto')
    vba.append('    End With')
    vba.append('End Sub')

    return "\n".join(vba), legendas_encontradas

@app.post("/generate")
async def generate(request: GenerateRequest):
    try:
        vba_code, legendas = generate_vba_code(request.directory)
        return {"success": True, "vba": vba_code, "legendas": legendas}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
