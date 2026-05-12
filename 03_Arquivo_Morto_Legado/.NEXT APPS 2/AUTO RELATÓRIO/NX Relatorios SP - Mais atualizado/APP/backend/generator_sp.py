import os
import re
from typing import Callable, List, Any, Optional
from utils_sp import parse_medidas_arquivo, formatar_descricao_tecnica, formatar_descricao_cofre

# Ordem preferencial de pastas (nível 1)
ORDEM_PASTAS = ["- Área externa", "- Área interna", "- Segundo piso"]

def _natural_sort_key(name: str):
    """Extrai o número inicial do nome para ordenar naturalmente."""
    match = re.match(r'^(\d+)(.*)', name)
    if match:
        return (int(match.group(1)), match.group(2))
    return (float('inf'), name)

def folder_sort_key(name: str):
    name_lower = name.lower()
    if "vista ampla" in name_lower:
        return (0, name_lower)
    match = re.match(r'^(\d+)(.*)', name)
    if match:
        return (1, int(match.group(1)), match.group(2))
    if "detalhes" in name_lower:
        return (3, name_lower)
    return (2, name_lower)

def _default_logger(_: str) -> None:
    pass

def build_content_sp(pasta_raiz: str, log_errors_path: str, logger: Callable[[str], None] = _default_logger) -> List[Any]:
    os.makedirs(os.path.dirname(log_errors_path), exist_ok=True)
    with open(log_errors_path, "w", encoding="utf-8") as log:
        log.write("LOG DE ERROS - Leitura de pastas (SP)\n\n")

    conteudo: List[Any] = []
    injected_dirs = set()
    logger(">>> Lendo estrutura de pastas e imagens (Modo Organizado SP)...")

    for root_dir, dirs, files in os.walk(pasta_raiz, topdown=True):
        if root_dir in injected_dirs:
            dirs[:] = []  # Bloqueia a varredura dentro das subpastas que já foram injetadas
            continue

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
            prefixos = {1: "", 2: "»", 3: "»»", 4: "»»»", 5: "»»»»", 6: "»»»»»"}
            conteudo.append(f"{prefixos.get(nivel, '»»»')}{nome}")

        try:
            arquivos_imagens = [f for f in files if f.lower().endswith((".png", ".jpg", ".jpeg"))]
            arquivos_imagens.sort(key=_natural_sort_key)

            # EXTRAÇÃO DA FACHADA
            # Pega as imagens na raiz do projeto (não entramos numa subpasta e o nome começa com - Fachada)
            if root_dir == pasta_raiz:
                fachadas = [f for f in arquivos_imagens if "fachada" in f.lower()]
                for f in fachadas:
                    caminho_fachada = os.path.join(root_dir, f)
                    conteudo.append({"imagem_fachada": caminho_fachada})
                    # Remove da lista de arquivos pra não repetir
                    arquivos_imagens.remove(f)
                    
            for imagem_nome in arquivos_imagens:
                caminho_imagem = os.path.join(root_dir, imagem_nome)
                match_num = re.match(r'^(\d+)', imagem_nome)
                num = int(match_num.group(1)) if match_num else None
                
                conteudo.append({"imagem": caminho_imagem})

                # --- 1. DESCRIÇÃO E TABELAS (Acompanham a Foto Principal) ---
                largura, altura, desconto, subtotal, area_total = parse_medidas_arquivo(imagem_nome)
                
                if largura > 0 and altura > 0:
                    ambiente_nome = path_parts[-2] if len(path_parts) >= 2 else "Ambiente"
                    servico_nome = path_parts[-1] if len(path_parts) >= 1 else "Serviço"
                    
                    ambiente_limpo = re.sub(r'^\d+\s*-\s*', '', ambiente_nome)
                    servico_limpo = re.sub(r'^\d+\.\d+\s*-\s*', '', servico_nome)
                    
                    mobiliario_un = 2.0 if area_total > 20 else 1.0
                    possui_cofre = "cofre" in ambiente_limpo.lower()
                    desc = formatar_descricao_tecnica(ambiente_limpo, servico_limpo, area_total, mobiliario_un, possui_cofre)
                    conteudo.append({"texto_descricao": desc})

                    if possui_cofre:
                        desc_cofre = formatar_descricao_cofre(servico_limpo)
                        conteudo.append({"texto_descricao": desc_cofre})

                    # Tabela de Pintura
                    tabela_pintura = {
                        "tipo": "pintura",
                        "medidas": [
                            {
                                "referencia": f"Foto {num:02d}" if num else "Foto",
                                "largura": largura,
                                "altura": altura,
                                "desconto": desconto,
                                "subtotal": subtotal,
                                "total": area_total
                            }
                        ]
                    }
                    conteudo.append({"tabela_medicao": tabela_pintura})

                    # Tabela de Mobiliário (Item 13.12)
                    tabela_mobiliario = {
                        "tipo": "mobiliario",
                        "medidas": [
                            {
                                "referencia": f"Foto {num:02d}" if num else "Foto",
                                "total_un": mobiliario_un
                            }
                        ]
                    }
                    conteudo.append({"tabela_medicao": tabela_mobiliario})

                # --- 2. DETALHES (Injetados após a descrição) ---
                if num is not None:
                    pasta_detalhes_alvo = None
                    nome_detalhes_alvo = None
                    
                    for d in dirs:
                        if "detalhes" in d.lower():
                            match_sub = re.search(r'\d+', d)
                            if match_sub and int(match_sub.group(0)) == num:
                                pasta_detalhes_alvo = os.path.join(root_dir, d)
                                nome_detalhes_alvo = d
                                break
                    
                    if pasta_detalhes_alvo and pasta_detalhes_alvo not in injected_dirs:
                        nome_exibicao = nome_detalhes_alvo.replace("-", "").strip().capitalize()
                        conteudo.append({"texto_padrao": nome_exibicao})
                        
                        try:
                            fotos_det = [fd for fd in os.listdir(pasta_detalhes_alvo) if fd.lower().endswith(('.jpg', '.png', '.jpeg'))]
                            fotos_det.sort(key=_natural_sort_key)
                            for fd in fotos_det:
                                conteudo.append({"imagem": os.path.join(pasta_detalhes_alvo, fd), "is_detalhe": True})
                            injected_dirs.add(pasta_detalhes_alvo)
                        except Exception as e:
                            logger(f"Erro lendo subpasta de detalhes {pasta_detalhes_alvo}: {e}")

            # Removido o block de dirs.remove(detalhes_dir_name) para não perdermos pastas anômalas

            # Só adiciona quebra se houver arquivos ou se houveram subpastas que não foram recém injetadas
            if arquivos_imagens or dirs:
                 conteudo.append({"quebra_pagina": True})

        except Exception as e_dir:
            with open(log_errors_path, "a", encoding="utf-8") as log:
                log.write(f"Falha ao processar pasta: {root_dir} ({e_dir})\n")
            continue

    logger(">>> Leitura finalizada.")
    return conteudo

def run_all_sp(pasta_raiz: str, modelo_path: str, pasta_saida: str, logger: Callable[[str], None] = _default_logger, conteudo_aprovado: Optional[List[Any]] = None):
    """Pipeline principal do SP."""
    os.makedirs(pasta_saida, exist_ok=True)
    nome_pasta_raiz = os.path.basename(pasta_raiz.strip(os.sep))
    output_docx = os.path.join(pasta_saida, f"RELATÓRIO FOTOGRÁFICO - {nome_pasta_raiz} - SP.docx")
    log_errors = os.path.join(pasta_saida, "erros_pastas.txt")
    log_process = os.path.join(pasta_saida, "process_log_sp.txt")

    def file_logger(msg: str) -> None:
        logger(msg)
        with open(log_process, "a", encoding="utf-8") as f:
            f.write(msg + "\n")

    with open(log_process, "w", encoding="utf-8") as f:
        f.write("PROCESS LOG - Geração SP\n\n")

    conteudo = build_content_sp(pasta_raiz, log_errors, logger=file_logger)
    
    if conteudo_aprovado:
        conteudo = conteudo_aprovado
        
    from word_utils_sp import inserir_conteudo_sp
    total_imagens = inserir_conteudo_sp(modelo_path, conteudo, output_docx)
    
    file_logger(f"[OK] Total de imagens: {total_imagens}")
    
    class RunResult:
        def __init__(self, out, process, errors, total):
            self.output_docx = out
            self.log_process = process
            self.log_errors = errors
            self.total_images = total
            
    return RunResult(output_docx, log_process, log_errors, total_imagens)
