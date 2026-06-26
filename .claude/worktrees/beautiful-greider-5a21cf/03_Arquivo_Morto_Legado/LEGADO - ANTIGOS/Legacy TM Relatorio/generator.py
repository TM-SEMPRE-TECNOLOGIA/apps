import os
import datetime
from typing import Dict, Any, List, Tuple, Optional

from ui_preview import preview_conteudo
from word_utils import inserir_conteudo

ORDEM_PASTAS = ["- Área externa", "- Área interna", "- Segundo piso"]


def _write_log_line(log_path: str, line: str) -> None:
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(line.rstrip() + "\n")


def _safe_sort_dirs(dirs: List[str]) -> List[str]:
    return sorted(
        dirs,
        key=lambda x: (
            ORDEM_PASTAS.index(x) if x in ORDEM_PASTAS else len(ORDEM_PASTAS),
            x,
        ),
    )


def build_conteudo_from_folder(pasta_raiz: str, erros_log_path: str, process_log_path: str) -> Tuple[List[Any], Dict[str, Any]]:
    """Lê a estrutura da pasta raiz e monta o conteúdo do relatório.

    Retorna:
      - conteudo: lista de strings (títulos) e dicts ({imagem}, {quebra_pagina}, etc.)
      - stats: métricas do processamento
    """
    conteudo: List[Any] = []
    stats = {
        "pastas_lidas": 0,
        "imagens_encontradas": 0,
        "imagens_validas": 0,
        "imagens_invalidas": 0,
        "arquivos_totais": 0,
    }

    _write_log_line(process_log_path, ">>> Lendo estrutura de pastas e imagens...")

    for root_dir, dirs, files in os.walk(pasta_raiz, topdown=True):
        try:
            root_dir = os.fsdecode(root_dir)
            dirs[:] = [os.fsdecode(d) for d in dirs]
            files = [os.fsdecode(f) for f in files]
        except Exception as e:
            _write_log_line(erros_log_path, f"Falha ao decodificar nomes em: {root_dir} ({e})")
            continue

        if root_dir == pasta_raiz:
            dirs[:] = _safe_sort_dirs(dirs)

        stats["pastas_lidas"] += 1
        stats["arquivos_totais"] += len(files)

        # Título por nível
        rel_path = os.path.relpath(root_dir, pasta_raiz)
        path_parts = rel_path.split(os.sep)
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
            stats["imagens_encontradas"] += len(arquivos_imagens)

            try:
                arquivos_imagens.sort(key=os.path.getctime)
            except Exception:
                arquivos_imagens.sort()

            for imagem_path in arquivos_imagens:
                if os.path.exists(imagem_path) and os.path.getsize(imagem_path) > 0:
                    conteudo.append({"imagem": imagem_path})
                    stats["imagens_validas"] += 1
                else:
                    stats["imagens_invalidas"] += 1
                    _write_log_line(erros_log_path, f"Imagem inválida (não existe ou vazia): {imagem_path}")

            # mantém a lógica original: quebra de página ao fim de cada pasta
            conteudo.append({"quebra_pagina": True})

        except Exception as e_dir:
            _write_log_line(erros_log_path, f"Falha ao processar pasta: {root_dir} ({e_dir})")
            continue

    _write_log_line(process_log_path, ">>> Estrutura lida completamente.")
    _write_log_line(process_log_path, f"Pastas lidas: {stats['pastas_lidas']}")
    _write_log_line(process_log_path, f"Imagens encontradas: {stats['imagens_encontradas']}")
    _write_log_line(process_log_path, f"Imagens válidas: {stats['imagens_validas']}")
    _write_log_line(process_log_path, f"Imagens inválidas: {stats['imagens_invalidas']}")

    return conteudo, stats


def generate_report(pasta_raiz: str, modelo_path: str, pasta_saida: str, use_preview: bool = True) -> Dict[str, Any]:
    """Gera o relatório fotográfico.

    Saídas:
      - DOCX final
      - process_log.txt (log detalhado)
      - erros_pastas.txt (log de erros)

    Retorna um dict com caminhos e métricas.
    """
    start = datetime.datetime.now()

    nome_pasta_raiz = os.path.basename(pasta_raiz.strip(os.sep))
    os.makedirs(pasta_saida, exist_ok=True)

    nome_docx_saida = os.path.join(
        pasta_saida,
        f"RELATÓRIO FOTOGRÁFICO - {nome_pasta_raiz} - LEVANTAMENTO PREVENTIVO.docx",
    )

    erros_log = os.path.join(pasta_saida, "erros_pastas.txt")
    process_log = os.path.join(pasta_saida, "process_log.txt")

    # zera logs
    with open(erros_log, "w", encoding="utf-8") as f:
        f.write("LOG DE ERROS - Leitura de pastas\n\n")
    with open(process_log, "w", encoding="utf-8") as f:
        f.write("PROCESS LOG - Geração de Relatório\n\n")

    _write_log_line(process_log, f"Início: {start:%Y-%m-%d %H:%M:%S}")
    _write_log_line(process_log, f"Pasta raiz: {pasta_raiz}")
    _write_log_line(process_log, f"Modelo: {modelo_path}")
    _write_log_line(process_log, f"Saída: {pasta_saida}")
    _write_log_line(process_log, "")

    conteudo, stats = build_conteudo_from_folder(pasta_raiz, erros_log, process_log)

    conteudo_final = conteudo
    if use_preview:
        _write_log_line(process_log, ">>> Abrindo pré-visualização (usuário pode editar/mover/excluir)...")
        conteudo_editado = preview_conteudo(conteudo)
        if conteudo_editado is None:
            _write_log_line(process_log, "Cancelado pelo usuário na pré-visualização.")
            return {
                "status": "cancelado",
                "docx": None,
                "process_log": process_log,
                "erros_log": erros_log,
                "stats": stats,
            }
        conteudo_final = conteudo_editado

    _write_log_line(process_log, ">>> Gerando documento Word...")

    contador_imagens = inserir_conteudo(modelo_path, conteudo_final, nome_docx_saida)

    end = datetime.datetime.now()
    _write_log_line(process_log, "")
    _write_log_line(process_log, f"Fim: {end:%Y-%m-%d %H:%M:%S}")
    _write_log_line(process_log, f"Duração: {str(end - start)}")
    _write_log_line(process_log, f"Imagens inseridas no Word: {contador_imagens}")
    _write_log_line(process_log, f"Arquivo gerado: {nome_docx_saida}")

    return {
        "status": "ok",
        "docx": nome_docx_saida,
        "process_log": process_log,
        "erros_log": erros_log,
        "stats": {**stats, "imagens_inseridas": contador_imagens},
    }
