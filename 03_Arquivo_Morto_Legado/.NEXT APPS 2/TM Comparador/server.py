"""
TM Comparador – FastAPI Backend
Exposes the comparison logic from comparer.py via REST endpoints.
"""

import os
from typing import Optional

from fastapi import FastAPI, HTTPException, Query, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import tkinter as tk
from tkinter import filedialog

from comparer import (
    compare_items,
    load_budget_items,
    load_report_items,
    summarize,
    write_outputs,
)

app = FastAPI(title="TM Comparador API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(PROJECT_DIR, "output")
UPLOAD_DIR = os.path.join(PROJECT_DIR, "uploads")
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ── Models ───────────────────────────────────────────────────────────
class CompareRequest(BaseModel):
    report_path: str
    budget_path: str


class OpenFolderRequest(BaseModel):
    path: str


# ── Endpoints ────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/dialog/file")
async def ask_file(
    title: str = Query("Selecione um arquivo"),
    filetypes: str = Query("*.*"),
):
    """Open a native file‑picker dialog and return the chosen path."""
    try:
        root = tk.Tk()
        root.withdraw()
        root.attributes("-topmost", True)

        # Parse filetypes string like "DOCX|*.docx|XLSX|*.xlsx"
        ft_list = []
        if filetypes and filetypes != "*.*":
            parts = filetypes.split("|")
            for i in range(0, len(parts) - 1, 2):
                ft_list.append((parts[i], parts[i + 1]))
        ft_list.append(("Todos os arquivos", "*.*"))

        path = filedialog.askopenfilename(parent=root, title=title, filetypes=ft_list)
        root.destroy()
        return {"path": path or ""}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Accept an uploaded file (report DOCX or budget XLSX), save locally, and return its path."""
    try:
        dest = os.path.join(UPLOAD_DIR, file.filename)
        with open(dest, "wb") as f:
            f.write(await file.read())
        return {"path": dest, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/compare")
async def compare(data: CompareRequest):
    """Run the comparison logic and return results + summary."""
    rep = data.report_path.strip()
    bud = data.budget_path.strip()

    if not rep or not os.path.exists(rep):
        raise HTTPException(status_code=400, detail="Relatório DOCX não encontrado.")
    if not bud or not os.path.exists(bud):
        raise HTTPException(status_code=400, detail="Orçamento XLSX não encontrado.")

    try:
        report_items = load_report_items(rep)
        budget_items = load_budget_items(bud)
        rows = compare_items(report_items, budget_items)
        summ = summarize(rows)
        log_path, csv_path = write_outputs(OUTPUT_DIR, rep, bud, rows)

        results = []
        for r in rows:
            results.append({
                "item": r.item,
                "qtd_relatorio": r.qtd_relatorio,
                "qtd_orcamento": r.qtd_orcamento,
                "status": r.status,
                "diferenca": r.diferenca,
            })

        return {
            "results": results,
            "summary": summ,
            "log_path": log_path,
            "csv_path": csv_path,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/download")
async def download(path: str = Query(...)):
    """Serve a log/csv for download."""
    if not path or not os.path.exists(path) or not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado.")
    return FileResponse(path, filename=os.path.basename(path))


@app.post("/api/open-folder")
async def open_folder(data: OpenFolderRequest):
    folder = data.path.strip()
    if folder and os.path.isdir(folder):
        try:
            os.startfile(folder)
            return {"status": "ok"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=400, detail="Pasta inválida")


@app.get("/api/outputs")
async def list_outputs():
    """Return the list of previous comparison outputs."""
    files = []
    if os.path.isdir(OUTPUT_DIR):
        for f in sorted(os.listdir(OUTPUT_DIR), reverse=True):
            fp = os.path.join(OUTPUT_DIR, f)
            if os.path.isfile(fp):
                files.append({"name": f, "path": fp, "size": os.path.getsize(fp)})
    return {"files": files}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000)
