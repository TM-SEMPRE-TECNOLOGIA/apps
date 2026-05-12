"""
TM Pastas — Backend API (FastAPI)
Servidor local para seleção e renomeação de pastas.
"""

import os
import re
import uuid
import subprocess
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# ─── App ────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="TM Pastas API",
    version="2.1.0",
    description="API local para leitura e renomeação de estruturas de pastas.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Models ─────────────────────────────────────────────────────────────────────

class RenameItem(BaseModel):
    old_path: str
    new_path: str


class RenameRequest(BaseModel):
    updates: List[RenameItem]


# ─── Utility helpers ────────────────────────────────────────────────────────────

def build_directory_tree(path: str, max_depth: int, current_depth: int = 0):
    """Percorre o sistema de arquivos e devolve a árvore de diretórios."""
    if current_depth > max_depth:
        return None

    if not os.path.isdir(path):
        return None

    name = os.path.basename(path)
    children = []

    try:
        entries = sorted(os.listdir(path))
        for entry in entries:
            full_path = os.path.join(path, entry)
            if os.path.isdir(full_path):
                child_node = build_directory_tree(full_path, max_depth, current_depth + 1)
                if child_node:
                    children.append(child_node)
    except PermissionError:
        pass

    prefix_num, sep, clean_name = extract_prefix_and_name(name)

    return {
        "id": path,
        "name": name,
        "clean_name": clean_name,
        "prefix_num": prefix_num,
        "sep": sep,
        "full_path": path,
        "children": children,
    }


def extract_prefix_and_name(folder_name: str):
    """Extrai prefixo numérico e nome limpo de um nome de diretório.

    Exemplos:
        '15 - CAIEX'      → ('15', ' - ', 'CAIEX')
        '- Vista ampla'   → ('',   '- ',  'Vista ampla')
    """
    match = re.match(r"^([\d\.]*)([-\s]+)(.*)", folder_name)
    if match and (match.group(1) or "-" in match.group(2)):
        return match.group(1).strip(), match.group(2), match.group(3).strip()
    return "", "", folder_name


# ─── Endpoints ──────────────────────────────────────────────────────────────────

@app.get("/api/select-folder")
def select_folder():
    """Abre o diálogo nativo do Windows para selecionar uma pasta e devolve sua estrutura."""
    try:
        cmd = [
            "python",
            "-c",
            (
                "import tkinter as tk; from tkinter import filedialog; "
                "root = tk.Tk(); root.withdraw(); "
                'root.attributes("-topmost", True); '
                'print(filedialog.askdirectory(title="Selecione a Pasta Principal"))'
            ),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        folder_path = result.stdout.strip()

        if not folder_path:
            return {"status": "cancelled"}

        structure = build_directory_tree(folder_path, max_depth=4)

        return {"status": "success", "path": folder_path, "structure": structure}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno local: {str(e)}")


@app.post("/api/rename-folders")
def rename_folders(payload: RenameRequest):
    """Recebe uma lista de atualizações e aplica as renomeações físicas (two-stage safe rename)."""
    updates = payload.updates
    temp_moves = []
    
    # Rastrear caminhos atuais pois renomear um pai invalida o caminho antigo dos filhos
    current_mappings = [
        {"original_old": item.old_path, "current_old": item.old_path, "final_new": item.new_path}
        for item in updates
    ]

    try:
        # Stage 1: renomear para nomes temporários
        for i, move in enumerate(current_mappings):
            old_p = move["current_old"]
            new_p = move["final_new"]
            
            if old_p != new_p and os.path.exists(old_p):
                temp_p = os.path.join(os.path.dirname(old_p), f"_tmp_{uuid.uuid4().hex}")
                os.rename(old_p, temp_p)
                move["temp_path"] = temp_p
                temp_moves.append(move)
                
                # Atualizar outros caminhos que são descendentes deste que foi movido
                for j in range(len(current_mappings)):
                    if i == j: continue
                    other = current_mappings[j]
                    if other["current_old"].startswith(old_p + os.sep):
                        other["current_old"] = other["current_old"].replace(old_p, temp_p, 1)

        # Stage 2: renomear do temporário para o destino final
        for i, move in enumerate(temp_moves):
            final_p = move["final_new"]
            temp_p = move["temp_path"]
            
            os.makedirs(os.path.dirname(final_p), exist_ok=True)
            os.rename(temp_p, final_p)
            
            # Se movemos uma pasta pai temporária para o final, os caminhos temporários 
            # de seus filhos que ainda não foram movidos para o final também mudam
            for j in range(len(temp_moves)):
                if i == j: continue
                other = temp_moves[j]
                if other["temp_path"].startswith(temp_p + os.sep):
                     other["temp_path"] = other["temp_path"].replace(temp_p, final_p, 1)

        return {
            "status": "success",
            "message": f"{len(temp_moves)} pastas renomeadas com sucesso!",
        }
    except Exception as e:
        # Rollback de emergência (tentar voltar do temporário para o original se possível)
        for move in temp_moves:
            if "temp_path" in move and os.path.exists(move["temp_path"]):
                try:
                    os.rename(move["temp_path"], move["original_old"])
                except Exception:
                    pass
        raise HTTPException(
            status_code=500,
            detail=(
                f"Erro crítico na renomeação: {str(e)}\n"
                "Reversão de emergência aplicada onde possível."
            ),
        )


# ─── Startup ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Iniciando TM Pastas Backend API (FastAPI) em localhost:5000...")
    uvicorn.run(app, host="0.0.0.0", port=5000)
