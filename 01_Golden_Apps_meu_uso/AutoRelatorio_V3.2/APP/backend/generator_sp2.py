# generator_sp2.py — AutoRelatório V3.2 · Modo São Paulo 2
# Scanner hierárquico para o padrão do Contrato 1565 (São José do Rio Preto)
#
# DIFERENÇAS vs generator_sp.py (SP1):
#   ✦ Suporte a CROQUIS: arquivos "CROQUI xx - desc.jpg" geram item tipo 'croqui'
#   ✦ Múltiplas paredes: várias fotos num mesmo bloco de serviço são agrupadas
#     em uma única tabela de cálculo (linhas separadas por foto/parede)
#   ✦ Fator de faces: "Faces 2" no nome do arquivo multiplica a área × 2
#   ✦ Enunciado textual: bloco "Item 17.X – descrição..." antes de cada tabela
#   ✦ Tabela de Itens separada: item independente no array conteudo
#   ✦ Detecção de item por pasta: identifica o código do contrato pelo nome da pasta
#
# ESTRUTURA DE PASTAS ESPERADA (Modo SP2):
#
#   📁 AGÊNCIA XPTO/
#   ├── Fachada.jpg                         ← imagem de capa (opcional)
#   ├── 📁 1 - 1º Andar – Espaço Desativado/
#   │   ├── 📁 1.1 - Emassamento e pintura de teto/
#   │   │   ├── 01 - 16,20 x 4,63.jpg      ← foto principal com medidas
#   │   │   ├── 02 - vista.jpg              ← foto sem medidas (só insere imagem)
#   │   │   ├── CROQUI 01 - Laje.jpg       ← croqui (legenda automática)
#   │   │   └── - Detalhes 1/              ← subpasta de detalhes da foto 01
#   │   │       └── det_01.jpg
#   ├── 📁 2 - Térreo – Suporte/
#   │   ├── 📁 2.1 - Recuperação e vedação de janela/
#   │   │   └── 01 - 3,85 x 2,18 - Faces 2.jpg
#   │   └── 📁 2.2 - Emassamento e pintura de parede/
#   │       ├── 01 - 3,64 x 4,07.jpg
#   │       ├── 02 - 5,38 x 4,07 - Desconto 8,39m².jpg
#   │       └── ...
#
# TIPOS DE ITEM NO ARRAY conteudo (saída deste scanner):
#
#   str                          → título (prefixo » = nível)
#   {"imagem_fachada": path}     → imagem de capa
#   {"imagem": path}             → foto normal
#   {"croqui": path,             → croqui técnico
#    "legenda": str}
#   {"texto_narrativo": str}     → descrição textual do problema
#   {"enunciado_item": {         → texto "Item 17.X – desc..." antes da tabela
#       "codigo": str,
#       "descricao": str}}
#   {"memoria_calculo": {        → tabela de memória de cálculo (múltiplas linhas)
#       "tipo_item": str,        #   ex: "pintura", "metalico", "unitario"
#       "linhas": [{             #   cada linha = uma foto/parede
#           "referencia": str,
#           "largura": float,
#           "altura": float,
#           "faces": int,
#           "desconto": float,
#           "subtotal": float,
#           "total": float,
#           "parede_nome": str
#       }],
#       "total_geral": float
#   }}
#   {"tabela_itens_sp2": {       → tabela de itens (separada da memória)
#       "codigo": str,
#       "descricao": str,
#       "quantidade": float,
#       "unidade": str
#   }}
#   {"quebra_pagina": True}      → quebra de página

import os
import re
from typing import Callable, List, Any, Optional

from utils_sp2 import (
    parse_medidas_sp2,
    detectar_item_por_pasta,
    formatar_referencia_foto,
    formatar_descricao_narrativa,
    formatar_descricao_elemento_metalico,
    formatar_enunciado_item,
    e_croqui,
    extrair_legenda_croqui,
    ITENS_CONTRATO_SP2,
)

# ---------------------------------------------------------------------------
# ORDENAÇÃO DE PASTAS
# ---------------------------------------------------------------------------

def _natural_sort_key(name: str):
    """Ordena naturalmente pelo número inicial do nome."""
    match = re.match(r'^(\d+)(.*)', name)
    if match:
        return (int(match.group(1)), match.group(2))
    return (float('inf'), name)


def _folder_sort_key(name: str):
    name_lower = name.lower()
    if "vista ampla" in name_lower or "fachada" in name_lower:
        return (0, name_lower)
    match = re.match(r'^(\d+)(.*)', name)
    if match:
        return (1, int(match.group(1)), match.group(2))
    if "detalhes" in name_lower:
        return (3, name_lower)
    return (2, name_lower)


def _default_logger(_: str) -> None:
    pass


# ---------------------------------------------------------------------------
# SCANNER PRINCIPAL
# ---------------------------------------------------------------------------

def build_content_sp2(
    pasta_raiz: str,
    log_errors_path: str,
    logger: Callable[[str], None] = _default_logger
) -> List[Any]:
    """
    Varre a pasta raiz e monta o array conteudo no formato SP2.

    Lógica de agrupamento de tabelas:
      - Para cada pasta de serviço (nível folha), acumula TODAS as fotos
        com medidas em um único bloco de memoria_calculo (múltiplas linhas).
      - Croquis são inseridos após as fotos e antes da tabela.
      - Itens sem medidas geram apenas imagem.
    """
    os.makedirs(os.path.dirname(log_errors_path), exist_ok=True)
    with open(log_errors_path, "w", encoding="utf-8") as log:
        log.write("LOG DE ERROS — Leitura SP2\n\n")

    conteudo: List[Any] = []
    injected_dirs: set = set()

    logger(">>> [SP2] Iniciando varredura hierárquica...")

    for root_dir, dirs, files in os.walk(pasta_raiz, topdown=True):

        # Bloqueia re-entrada em pastas de detalhes já processadas
        if root_dir in injected_dirs:
            dirs[:] = []
            continue

        # Decodificação segura
        try:
            root_dir = os.fsdecode(root_dir)
            dirs[:] = [os.fsdecode(d) for d in dirs]
            files   = [os.fsdecode(f) for f in files]
        except Exception as e:
            with open(log_errors_path, "a", encoding="utf-8") as log:
                log.write(f"Falha ao decodificar: {root_dir} ({e})\n")
            continue

        # Ordenação de subpastas
        if root_dir == pasta_raiz:
            dirs.sort(key=lambda x: (
                0 if re.match(r'^[Ff]achada', x) else 1,
                _folder_sort_key(x),
            ))
        else:
            dirs.sort(key=_folder_sort_key)

        path_parts = os.path.relpath(root_dir, pasta_raiz).split(os.sep)
        nome       = path_parts[-1]
        nivel      = len(path_parts)

        # ── RAIZ: só fachada ──────────────────────────────────────────────
        if nome == ".":
            arquivos_img = [f for f in files if f.lower().endswith((".png", ".jpg", ".jpeg"))]
            for f in arquivos_img:
                if "fachada" in f.lower():
                    conteudo.append({"imagem_fachada": os.path.join(root_dir, f)})
            continue

        # ── TÍTULO DE SEÇÃO ───────────────────────────────────────────────
        prefixos = {1: "", 2: "»", 3: "»»", 4: "»»»"}
        titulo_raw = re.sub(r'^\d+[\.\d]*\s*[-–]\s*', '', nome).strip()
        conteudo.append(f"{prefixos.get(nivel, '»»»')}{nome}")

        # ── PROCESSAMENTO DE FOTOS ────────────────────────────────────────
        arquivos_img = sorted(
            [f for f in files if f.lower().endswith((".png", ".jpg", ".jpeg"))],
            key=_natural_sort_key
        )

        if not arquivos_img:
            continue

        # Detecta o item do contrato pelo nome desta pasta (nível de serviço)
        item_contrato = detectar_item_por_pasta(nome)

        # Separa croquis das fotos normais
        fotos_normais = [f for f in arquivos_img if not e_croqui(f)]
        croquis       = [f for f in arquivos_img if e_croqui(f)]

        # Acumula linhas da memória de cálculo para esta pasta
        linhas_memoria: List[dict] = []
        total_geral = 0.0
        tipo_item = "area"  # padrão

        for imagem_nome in fotos_normais:
            caminho = os.path.join(root_dir, imagem_nome)
            medidas = parse_medidas_sp2(imagem_nome)
            num     = medidas['num']

            # Insere a imagem principal
            conteudo.append({"imagem": caminho})

            # Subpasta de detalhes correspondente
            pasta_detalhes_alvo = None
            for d in dirs:
                if "detalhes" in d.lower():
                    match_sub = re.search(r'\d+', d)
                    if match_sub and num is not None and int(match_sub.group(0)) == num:
                        pasta_detalhes_alvo = os.path.join(root_dir, d)
                        break

            if pasta_detalhes_alvo and pasta_detalhes_alvo not in injected_dirs:
                nome_exib = re.sub(r'^-\s*', '', os.path.basename(pasta_detalhes_alvo)).strip().capitalize()
                conteudo.append({"texto_padrao": nome_exib})
                try:
                    fotos_det = sorted(
                        [fd for fd in os.listdir(pasta_detalhes_alvo)
                         if fd.lower().endswith(('.jpg', '.png', '.jpeg'))],
                        key=_natural_sort_key
                    )
                    for fd in fotos_det:
                        conteudo.append({"imagem": os.path.join(pasta_detalhes_alvo, fd)})
                    injected_dirs.add(pasta_detalhes_alvo)
                except Exception as e:
                    logger(f"[AVISO] Erro lendo detalhes {pasta_detalhes_alvo}: {e}")

            # Acumula na memória de cálculo (só se tem medidas)
            if medidas['tem_medidas']:
                referencia = formatar_referencia_foto(num, medidas.get('parede_nome', ''))
                linha = {
                    "referencia" : referencia,
                    "largura"    : medidas['largura'],
                    "altura"     : medidas['altura'],
                    "faces"      : medidas['faces'],
                    "desconto"   : medidas['desconto'],
                    "subtotal"   : medidas['subtotal'],
                    "total"      : medidas['total'],
                    "parede_nome": medidas.get('parede_nome', ''),
                }
                linhas_memoria.append(linha)
                total_geral += medidas['total']
                if medidas['faces'] > 1:
                    tipo_item = "metalico"

        # Croquis — inseridos após as fotos
        for croqui_nome in croquis:
            caminho_croqui = os.path.join(root_dir, croqui_nome)
            legenda = extrair_legenda_croqui(croqui_nome)
            conteudo.append({
                "croqui"  : caminho_croqui,
                "legenda" : legenda
            })

        # Monta bloco de memória de cálculo + tabela de itens (se houver medidas)
        if linhas_memoria and item_contrato:
            codigo    = item_contrato['id']
            descricao = item_contrato['desc']
            unidade   = item_contrato['un']

            # 1) Enunciado textual (ex: "Item 17.6 – Pintura em látex...")
            conteudo.append({
                "enunciado_item": {
                    "codigo"   : codigo,
                    "descricao": descricao
                }
            })

            # 2) Tabela de Memória de Cálculo (com todas as linhas desta pasta)
            conteudo.append({
                "memoria_calculo": {
                    "tipo_item"   : tipo_item,
                    "codigo"      : codigo,
                    "descricao"   : descricao,
                    "linhas"      : linhas_memoria,
                    "total_geral" : round(total_geral, 2)
                }
            })

            # 3) Tabela de Itens (separada)
            conteudo.append({
                "tabela_itens_sp2": {
                    "codigo"    : codigo,
                    "descricao" : descricao,
                    "quantidade": round(total_geral, 2),
                    "unidade"   : unidade
                }
            })

        elif linhas_memoria and not item_contrato:
            # Tem medidas mas não identificou o item → insere memória genérica sem código
            logger(f"[AVISO] Item não identificado para a pasta: {nome}")
            conteudo.append({
                "memoria_calculo": {
                    "tipo_item"   : tipo_item,
                    "codigo"      : "—",
                    "descricao"   : nome,
                    "linhas"      : linhas_memoria,
                    "total_geral" : round(total_geral, 2)
                }
            })

        # Quebra de página ao final de cada bloco de nível 2+
        if nivel >= 2 and (fotos_normais or croquis):
            conteudo.append({"quebra_pagina": True})

    logger(">>> [SP2] Leitura finalizada.")
    return conteudo


# ---------------------------------------------------------------------------
# PIPELINE COMPLETO
# ---------------------------------------------------------------------------

def run_all_sp2(
    pasta_raiz: str,
    modelo_path: str,
    pasta_saida: str,
    logger: Callable[[str], None] = _default_logger,
    conteudo_aprovado: Optional[List[Any]] = None,
    meta: Optional[dict] = None
):
    """
    Pipeline principal do SP2.

    meta (opcional): dados do cabeçalho institucional
      {
        "contrato"       : "2025.7421.2955",
        "os"             : "250107393",
        "agencia"        : "0419/00 – Igarapava – SP",
        "elaborador"     : "Jônathas Gutierre",
        "data_elaboracao": "11/11/2025",
        "tipo_vistoria"  : "PREVENTIVA",
        "data_vistoria"  : "09/09/2025",
        "empresa"        : "Machado & Machado Engenharia"
      }
    """
    os.makedirs(pasta_saida, exist_ok=True)
    nome_pasta = os.path.basename(pasta_raiz.strip(os.sep))
    output_docx = os.path.join(pasta_saida, f"RELATÓRIO DE VISTORIA - {nome_pasta} - SP2.docx")
    log_errors  = os.path.join(pasta_saida, "erros_sp2.txt")
    log_process = os.path.join(pasta_saida, "process_log_sp2.txt")

    def file_logger(msg: str) -> None:
        logger(msg)
        with open(log_process, "a", encoding="utf-8") as f:
            f.write(msg + "\n")

    with open(log_process, "w", encoding="utf-8") as f:
        f.write("PROCESS LOG — SP2\n\n")
        f.write(f"Pasta raiz : {pasta_raiz}\n")
        f.write(f"Modelo     : {modelo_path}\n")
        f.write(f"Saída      : {pasta_saida}\n\n")

    conteudo = conteudo_aprovado or build_content_sp2(pasta_raiz, log_errors, logger=file_logger)

    from word_utils_sp2 import inserir_conteudo_sp2
    total_imagens = inserir_conteudo_sp2(modelo_path, conteudo, output_docx, meta=meta)
    file_logger(f"[OK] SP2 concluído — {total_imagens} imagens inseridas.")

    class RunResult:
        def __init__(self, out, process, errors, total):
            self.output_docx  = out
            self.log_process  = process
            self.log_errors   = errors
            self.total_images = total

    return RunResult(output_docx, log_process, log_errors, total_imagens)
