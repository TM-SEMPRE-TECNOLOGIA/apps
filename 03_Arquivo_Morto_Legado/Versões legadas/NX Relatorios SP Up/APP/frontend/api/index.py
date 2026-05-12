import os
import shutil
import base64
import zipfile
import tempfile
from io import BytesIO
from typing import List, Optional, Any
from fastapi import FastAPI, Request, File, UploadFile, HTTPException, Query
from fastapi.responses import JSONResponse, FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

# Tenta os dois tipos de import (local vs package) para compatibilidade Vercel/Local
try:
    from .generator import build_content_from_root, generate_report
    from .generator_sp import build_content_sp
except (ImportError, ValueError):
    from generator import build_content_from_root, generate_report
    from generator_sp import build_content_sp

app = FastAPI(title="NX Relatórios Cloud API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caminho dos templates dentro do projeto (em /api/templates)
API_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(API_DIR, "templates")

class GenerateRequest(BaseModel):
    session_id: str
    modelo: str
    conteudo: list
    tipo_relatorio: str = "tradicional"
    selected_description_key: Optional[str] = None

DESCRICOES_OPCOES = {
    "Desc 1": "Descrição do serviço: Informamos que foi realizada visita técnica à agência para fins de levantamento preventivo. A atividade contou com o acompanhamento do gerente [Nome do Gerente] – Matrícula [Número da Matrícula], que esteve presente durante todo o procedimento. Durante a vistoria, foram identificadas necessidades de intervenção nos seguintes itens.",
    "Desc 2": "Descrição do serviço: No cumprimento das atividades programadas, nosso técnico realizou uma visita à agência para a execução do levantamento preventivo. O gerente [Nome do Gerente] – Matrícula [Número da Matrícula] acompanhou todas as etapas do procedimento. Após a avaliação, verificou-se a necessidade de intervenção nos seguintes itens.",
    "Desc 3": "Descrição do serviço: Informamos que nosso técnico realizou uma visita à agência para a execução do levantamento preventivo. Durante a visita, o gerente [Nome do Gerente] – Matrícula [Número da Matrícula] esteve presente, acompanhando todo o procedimento. Constatou-se a necessidade de intervenção nos seguintes itens.",
    "Desc 4": "Descrição do serviço: Nosso técnico realizou uma visita à agência para a execução do levantamento preventivo. O gerente [Nome do Gerente] – Matrícula [Número da Matrícula] acompanhou todo o processo. Durante a vistoria, identificamos a necessidade de intervenção nos seguintes itens."
}

@app.get("/templates")
@app.get("/api/templates")
async def list_templates():
    try:
        if not os.path.exists(TEMPLATES_DIR):
            return {"templates": []}
        files = [f for f in os.listdir(TEMPLATES_DIR) if f.lower().endswith(".docx")]
        files.sort(key=str.casefold)
        return {"templates": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scan-zip")
@app.post("/api/scan-zip")
async def scan_zip(file: UploadFile = File(...), tipo_relatorio: str = "tradicional"):
    if not file.filename.lower().endswith(".zip"):
        raise HTTPException(status_code=400, detail="Apenas arquivos .zip são permitidos")
    
    # Criar diretório temporário para esta sessão
    temp_dir = tempfile.mkdtemp()
    zip_path = os.path.join(temp_dir, "upload.zip")
    extract_dir = os.path.join(temp_dir, "extracted")
    
    try:
        # Salvar ZIP
        with open(zip_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extrair
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        
        # Escanear conteúdo
        log_errors = os.path.join(temp_dir, "erros_pastas.txt")
        def dummy_logger(msg): print(msg)

        if tipo_relatorio == "sp":
            conteudo = build_content_sp(extract_dir, log_errors, logger=dummy_logger)
        else:
            conteudo = build_content_from_root(extract_dir, log_errors, logger=dummy_logger)
        
        # Retornamos o conteúdo e o ID do diretório temporário para a fase de geração
        return {
            "conteudo": conteudo, 
            "session_id": os.path.basename(temp_dir)
        }
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/thumbnail")
@app.get("/api/thumbnail")
async def get_thumbnail(path: str = Query(...), session_id: str = Query(...)):
    # Validar que o path está dentro do /tmp correspondente à sessão
    temp_base = tempfile.gettempdir()
    full_path = os.path.join(temp_base, session_id, "extracted", path.split("extracted" + os.sep)[-1])
    
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
        
    try:
        img = Image.open(full_path)
        img.thumbnail((200, 200), Image.Resampling.LANCZOS)
        buffered = BytesIO()
        img_format = img.format if img.format else 'JPEG'
        if img.mode in ('RGBA', 'P') and img_format in ('JPEG', 'JPG'):
             img = img.convert('RGB')
        img.save(buffered, format=img_format)
        buffered.seek(0)
        return StreamingResponse(buffered, media_type=f"image/{img_format.lower()}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate")
@app.post("/api/generate")
async def generate_docx(data: GenerateRequest):
    temp_base = tempfile.gettempdir()
    session_dir = os.path.join(temp_base, data.session_id)
    extract_dir = os.path.join(session_dir, "extracted")
    
    if not os.path.exists(session_dir):
        raise HTTPException(status_code=400, detail="Sessão expirada ou inválida")
        
    modelo_path = os.path.join(TEMPLATES_DIR, data.modelo)
    output_docx = os.path.join(session_dir, "RELATORIO_FINAL.docx")
    
    selected_description = DESCRICOES_OPCOES.get(data.selected_description_key)
    
    try:
        def dummy_logger(msg): print(msg)
        
        if data.tipo_relatorio == "sp":
            from .word_utils_sp import inserir_conteudo_sp
            total_images = inserir_conteudo_sp(modelo_path, data.conteudo, output_docx, selected_description=selected_description)
        else:
            total_images = generate_report(modelo_path, data.conteudo, output_docx, logger=dummy_logger, selected_description=selected_description)
        
        # Retornar o arquivo Word para download direto
        return FileResponse(
            output_docx, 
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
            filename=f"RELATORIO_{data.session_id}.docx"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check
@app.get("/")
async def root():
    return {"status": "NX Relatórios API Online"}
