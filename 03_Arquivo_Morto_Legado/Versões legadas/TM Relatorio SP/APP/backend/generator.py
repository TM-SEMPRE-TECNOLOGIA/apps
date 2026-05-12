import os
from dataclasses import dataclass
from typing import Callable, List, Dict, Any, Optional, Tuple

from word_utils import inserir_conteudo
import re

# Ordem preferencial de pastas (nível 1)
ORDEM_PASTAS = ["- Área externa", "- Área interna", "- Segundo piso"]

def folder_sort_key(name: str):
    name_lower = name.lower()
    
    # 1. Prioriza "Vista ampla"
    if "vista ampla" in name_lower:
        return (0, name_lower)
        
    # 2. Pastas com númeração sequencial (01.01, etc)
    match = re.match(r'^(\d+)(.*)', name)
    if match:
        return (1, int(match.group(1)), match.group(2))
        
    # 4. Detalhes sempre no fim
    if "detalhes" in name_lower:
        return (3, name_lower)
        
    # 3. Restante (alfabético normal)
    return (2, name_lower)


@dataclass
class RunResult:
    output_docx: str
    log_process: str
    log_errors: str
    total_images: int


def _default_logger(_: str) -> None:
    return


def build_content_from_root(pasta_raiz: str, log_errors_path: str, logger: Callable[[str], None] = _default_logger) -> List[Any]:
    """Varre a pasta raiz e monta o array `conteudo` no formato esperado pelo gerador.

    Conteúdo gerado:
    - títulos (str) com níveis (»)
    - imagens: {"imagem": <path>}
    - quebra de página: {"quebra_pagina": True}
    """
    os.makedirs(os.path.dirname(log_errors_path), exist_ok=True)

    with open(log_errors_path, "w", encoding="utf-8") as log:
        log.write("LOG DE ERROS - Leitura de pastas\n\n")

    conteudo: List[Any] = []

    logger(">>> Lendo estrutura de pastas e imagens...")

    for root_dir, dirs, files in os.walk(pasta_raiz, topdown=True):
        try:
            root_dir = os.fsdecode(root_dir)
            dirs[:] = [os.fsdecode(d) for d in dirs]
            files = [os.fsdecode(f) for f in files]
        except Exception as e:
            with open(log_errors_path, "a", encoding="utf-8") as log:
                log.write(f"Falha ao decodificar nomes em: {root_dir} ({e})\n")
            continue

        # Ordena subpastas baseando-se na nova proposta Perfeita
        if root_dir == pasta_raiz:
            dirs.sort(
                key=lambda x: (
                    0 if x == "- Vista ampla" else 1,
                    ORDEM_PASTAS.index(x) if x in ORDEM_PASTAS else len(ORDEM_PASTAS),
                    folder_sort_key(x),
                )
            )
        else:
            dirs.sort(key=folder_sort_key)

        path_parts = os.path.relpath(root_dir, pasta_raiz).split(os.sep)
        nome = path_parts[-1]

        if nome != ".":
            nivel = len(path_parts)
            prefixos = {1: "", 2: "»", 3: "»»"}
            conteudo.append(f"{prefixos.get(nivel, '»»»')}{nome}")

        try:
            arquivos_imagens = [
                os.path.join(root_dir, f)
                for f in files
                if f.lower().endswith((".png", ".jpg", ".jpeg"))
            ]
            try:
                arquivos_imagens.sort(key=os.path.getctime)
            except Exception:
                arquivos_imagens.sort()

            for imagem_path in arquivos_imagens:
                if os.path.exists(imagem_path):
                    conteudo.append({"imagem": imagem_path})

            # Sempre adiciona quebra de página ao final do bloco
            conteudo.append({"quebra_pagina": True})

        except Exception as e_dir:
            with open(log_errors_path, "a", encoding="utf-8") as log:
                log.write(f"Falha ao processar pasta: {root_dir} ({e_dir})\n")
            continue

    logger(">>> Estrutura lida completamente.")
    logger(f"(Verifique eventuais erros em: {log_errors_path})")

    return conteudo


def run_preview(conteudo: List[Any]) -> Optional[List[Any]]:
    """No modo web, o preview é gerenciado pelo frontend Next.js.
    Esta função retorna o conteúdo diretamente."""
    return conteudo


def generate_report(modelo_path: str, conteudo_editado: List[Any], output_docx_path: str, logger: Callable[[str], None] = _default_logger, selected_description: Optional[str] = None) -> int:
    """Gera o DOCX final usando o modelo e o conteúdo editado. Retorna total de imagens inseridas."""
    logger(">>> Gerando relatório...")
    total = inserir_conteudo(modelo_path, conteudo_editado, output_docx_path, selected_description=selected_description)
    logger(f"[OK] Relatório salvo em: {output_docx_path}")
    logger(f"[OK] Total de imagens inseridas: {total}")
    return total


def run_all(
    pasta_raiz: str,
    modelo_path: str,
    pasta_saida: str,
    logger: Callable[[str], None] = _default_logger,
    conteudo_aprovado: Optional[List[Any]] = None,
    selected_description: Optional[str] = None,
) -> RunResult:
    """Pipeline completo: varre pasta -> (preview) -> gera docx + logs."""
    os.makedirs(pasta_saida, exist_ok=True)

    nome_pasta_raiz = os.path.basename(pasta_raiz.strip(os.sep))
    output_docx = os.path.join(pasta_saida, f"RELATÓRIO FOTOGRÁFICO - {nome_pasta_raiz} - LEVANTAMENTO PREVENTIVO.docx")
    log_errors = os.path.join(pasta_saida, "erros_pastas.txt")
    log_process = os.path.join(pasta_saida, "process_log.txt")

    def file_logger(msg: str) -> None:
        logger(msg)
        with open(log_process, "a", encoding="utf-8") as f:
            f.write(msg + "\n")

    # inicia log
    with open(log_process, "w", encoding="utf-8") as f:
        f.write("PROCESS LOG - Geração de Relatório\n\n")
        f.write(f"Pasta raiz: {pasta_raiz}\n")
        f.write(f"Modelo: {modelo_path}\n")
        f.write(f"Saída: {pasta_saida}\n\n")

    conteudo = build_content_from_root(pasta_raiz, log_errors, logger=file_logger)

    if conteudo_aprovado is None:
        conteudo_editado = run_preview(conteudo)
        if conteudo_editado is None:
            file_logger("[AVISO] Geração cancelada pelo usuário no preview.")
            raise RuntimeError("Geração cancelada pelo usuário.")
    else:
        conteudo_editado = conteudo_aprovado

    total_images = generate_report(modelo_path, conteudo_editado, output_docx, logger=file_logger, selected_description=selected_description)

    return RunResult(
        output_docx=output_docx,
        log_process=log_process,
        log_errors=log_errors,
        total_images=total_images,
    )
