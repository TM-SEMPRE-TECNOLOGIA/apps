import os
import re
from typing import Callable, List, Any

def _natural_sort_key(name: str):
    """Extrai o número inicial do nome para ordenar naturalmente."""
    match = re.match(r'^(\d+)(.*)', name)
    if match:
        return (int(match.group(1)), match.group(2))
    return (float('inf'), name)

def _default_logger(_: str) -> None:
    pass

def build_content_app(pasta_raiz: str, log_errors_path: str, logger: Callable[[str], None] = _default_logger) -> List[Any]:
    """
    Modo APP: Lê TODAS as imagens de forma plana (sem estrutura de pastas).
    Usuário define os ambientes no PhotoGrid do app.
    """
    os.makedirs(os.path.dirname(log_errors_path), exist_ok=True)
    with open(log_errors_path, "w", encoding="utf-8") as log:
        log.write("LOG DE ERROS - Leitura de pastas (Modo APP)\n\n")

    conteudo: List[Any] = []
    logger(">>> Lendo todas as imagens (Modo APP - organização manual no app)...")

    todas_imagens = []

    # Varre TODOS os arquivos recursivamente buscando imagens
    for root_dir, dirs, files in os.walk(pasta_raiz, topdown=True):
        try:
            root_dir = os.fsdecode(root_dir)
            files = [os.fsdecode(f) for f in files]
        except Exception as e:
            with open(log_errors_path, "a", encoding="utf-8") as log:
                log.write(f"Falha ao decodificar nomes em: {root_dir} ({e})\n")
            continue

        # Procura por imagens em qualquer pasta
        arquivos_imagens = [f for f in files if f.lower().endswith((".png", ".jpg", ".jpeg"))]

        for img in arquivos_imagens:
            caminho_img = os.path.join(root_dir, img)
            is_fachada = "fachada" in img.lower()

            todas_imagens.append({
                "path": caminho_img,
                "is_fachada": is_fachada,
                "nome": img
            })

    # Ordena por fachada (primeiro) e depois por nome
    todas_imagens.sort(key=lambda x: (not x["is_fachada"], _natural_sort_key(x["nome"])))

    # Monta o conteúdo: primeiro fachadas, depois o resto
    for img_data in todas_imagens:
        if img_data["is_fachada"]:
            conteudo.append({"imagem_fachada": img_data["path"]})

    for img_data in todas_imagens:
        if not img_data["is_fachada"]:
            conteudo.append({"imagem": img_data["path"]})

    logger(f">>> Leitura concluída. {len(todas_imagens)} imagens encontradas (todas sem estrutura de pastas).")
    return conteudo
