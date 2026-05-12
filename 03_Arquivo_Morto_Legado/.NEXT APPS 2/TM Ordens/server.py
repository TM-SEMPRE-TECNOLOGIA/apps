from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import tempfile

app = FastAPI(title="TM Ordens Backend", version="1.0.0")

# Allow Next.js frontend to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "TM Ordens Backend API"}

@app.get("/api/export/pdf")
def export_pdf():
    # Generate a simple mockup PDF for the report using ReportLab
    try:
        fd, temp_path = tempfile.mkstemp(suffix=".pdf")
        os.close(fd)

        c = canvas.Canvas(temp_path, pagesize=letter)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, 750, "TM Ordens - Relatorio Executivo de Atividades")
        
        c.setFont("Helvetica", 12)
        c.drawString(50, 720, "Data de Geracao: Automatica pelo Sistema")
        c.drawString(50, 700, "-" * 70)
        c.drawString(50, 680, "Este e um documento gerado pelo TM Ordens Backend (FastAPI).")
        c.drawString(50, 660, "As informacoes financeiras e composicoes de custo nao constam")
        c.drawString(50, 640, "neste documento, conforme nova arquitetura de distribuicao da equipe.")
        c.drawString(50, 610, "A finalidade deste relatorio e acompanhamento de etapas fotograficas,")
        c.drawString(50, 590, "documentais e execucao de vistorias cadastradas na base.")
        
        c.setFont("Helvetica-Oblique", 10)
        c.drawString(50, 100, "Gerado por: TM Sempre Tecnologia | Inteligencia Operacional")
        c.save()

        # The FileResponse will stream the file back and we can set background tasks to delete if we wanted
        return FileResponse(path=temp_path, filename="tm_ordens_relatorio.pdf", media_type='application/pdf')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Runs on port 5002 as configured in run_app.bat
    uvicorn.run("server:app", host="0.0.0.0", port=5002, reload=True)
