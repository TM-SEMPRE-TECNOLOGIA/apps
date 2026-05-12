# utils_sp2.py — AutoRelatório V3.2 · Modo São Paulo 2
# Parser e formatadores para o padrão do Contrato 1565 (São José do Rio Preto)
#
# DIFERENÇAS vs utils_sp.py:
#   - Suporte a múltiplas paredes por item (linhas nomeadas: Parede 1, Parede 2...)
#   - Suporte a fator de faces (elementos metálicos com 2 faces = × 2)
#   - Enunciado textual de item antes da tabela (ex: "Item 17.2 – Emassamento...")
#   - Tabela de Itens separada da tabela de cálculo (padrão contrato 1565)
#
# FORMATO DE NOME DE ARQUIVO ESPERADO:
#   Parede simples:    "01 - 6,50 x 3,00 - Desconto 1,89m².jpg"
#   Com faces:         "01 - 3,85 x 2,18 - Faces 2.jpg"
#   Sem medidas:       "01 - vista geral.jpg"  (sem tabela)
#   Croqui:            "CROQUI 01 - descricao.jpg"

import re
from typing import Optional


# ---------------------------------------------------------------------------
# CONSTANTES DE ITENS DO CONTRATO 1565
# Mapeamento: nome de serviço (pasta) → código de contrato + unidade
# ---------------------------------------------------------------------------

ITENS_CONTRATO_SP2 = {
    # PINTURA
    "pintura acrilica"          : {"id": "17.6",  "desc": "Pintura em látex acrílica premium fosca em paredes internas ou externas, exceto muros, com três demãos, sem emassamento, com aplicação de selador para alvenaria exterior", "un": "m²"},
    "pintura acrilica standard" : {"id": "17.4",  "desc": "Pintura em látex acrílica standard fosca sem emassamento, 3 demãos, com aplicação de selador para exterior", "un": "m²"},
    "pintura acrilica premium"  : {"id": "17.11", "desc": "Pintura em látex acrílica premium acetinada em paredes internas", "un": "m²"},
    "pintura acrilica fosca"    : {"id": "17.6",  "desc": "Pintura em látex acrílica premium fosca em paredes internas ou externas", "un": "m²"},
    "pintura esmalte"           : {"id": "17.1",  "desc": "Pintura em esmalte sintético standard em estrutura metálica com duas demãos", "un": "m²"},
    "pintura esmalte madeira"   : {"id": "17.7",  "desc": "Pintura em esmalte sintético para madeira com duas demãos, sem emassamento", "un": "m²"},
    "pintura automotiva"        : {"id": "17.9",  "desc": "Pintura Automotiva", "un": "m²"},
    "pintura resina piso"       : {"id": "17.8",  "desc": "Pintura para piso a base de resina acrílica - piso, faixas de demarcação", "un": "m²"},
    "pintura muro"              : {"id": "17.10", "desc": "Pintura em látex acrílica econômica fosca, em muros, com duas demãos, sem emassamento, com aplicação de selador para alvenaria exterior", "un": "m²"},
    # EMASSAMENTO
    "emassamento"               : {"id": "17.2",  "desc": "Emassamento de parede interna ou teto com massa corrida a base de PVA com duas demãos", "un": "m²"},
    "emassamento externo"       : {"id": "17.5",  "desc": "Emassamento de parede ou teto externo com massa acrílica com duas demãos", "un": "m²"},
    # FORRO
    "forro mineral"             : {"id": "12.10", "desc": "Forro de fibra mineral, incluindo fixação, sem estrutura", "un": "m²"},
    # IMPERMEABILIZAÇÃO
    "impermeabilizacao manta"   : {"id": "8.3",   "desc": "Impermeabilização utilizando manta asfáltica polimérica (cobertura)", "un": "m²"},
    "impermeabilizacao argamassa": {"id": "8.6",  "desc": "Impermeabilização com argamassa polimérica impermeabilizante", "un": "m²"},
    # MOBILIÁRIO
    "mobiliario"                : {"id": "13.12", "desc": "Deslocamento ou remanejamento de mobiliário dentro da agência", "un": "un"},
    # ANDAIME
    "andaime torre"             : {"id": "2.21",  "desc": "Andaime torre metálico (1,5 x 1,5 m) com piso metálico", "un": "m"},
    # ENTULHO
    "remocao entulho"           : {"id": "2.18",  "desc": "Remoção de entulho com caçamba metálica, inclusive limpeza, transporte e destinação final", "un": "m³"},
    # SINALIZAÇÃO / ADESIVOS
    "fita antiderrapante"       : {"id": "29.12", "desc": "Fita antiderrapante para degraus de escada ou rampas", "un": "M"},
    "piso tatil"                : {"id": "29.6",  "desc": "Piso tátil de borracha - direcional ou alerta (por placa)", "un": "UN"},
    "adesivos"                  : {"id": "29.2",  "desc": "Adesivos padrão BB (ex: remus, estilo, high-tech, nova ambiência)", "un": "M"},
    "remocao adesivos"          : {"id": "29.24", "desc": "Remoção de adesivos e limpeza", "un": "m²"},
    "pelicula policarbonato"    : {"id": "29.14", "desc": "Sinalização externa - substituição de policarbonato e película", "un": "M²"},
    # SERRALHERIA / PORTAS / VIDROS
    "recuperacao grades"        : {"id": "14.6",  "desc": "Recuperação de grades, corrimãos e outros elementos metálicos", "un": "m²"},
    "vedacao janelas"           : {"id": "29.43", "desc": "Vedações em geral (janelas, portas, pias e similares)", "un": "un"},
    "ajuste portas"             : {"id": "13.20", "desc": "Ajuste e manutenção de portas", "un": "un"},
    "fechadura"                 : {"id": "15.3",  "desc": "Ferragem para Porta de madeira (fechadura completa) - Substituição", "un": "cj"},
    "chapa inox"                : {"id": "14.9",  "desc": "Chapa metálica inox, para portas de madeira", "un": "un"},
    "vidro"                     : {"id": "2.17",  "desc": "Retirada ou recolocação de vidro", "un": "m²"},
    "mola hidraulica"           : {"id": "15.7",  "desc": "Mola hidráulica de Piso ou Aérea - Manutenção (ajuste e regulagem)", "un": "un"},
    # EXTINTORES
    "extintor po"               : {"id": "21.21", "desc": "Recarga de Extintor de Incêndio Portátil Com Carga de Pó Químico Seco – ABC", "un": "un"},
    "extintor co2"              : {"id": "21.22", "desc": "Recarga de Extintor de Incêndio Portátil Com Carga de CO₂", "un": "um"},
    # ELÉTRICA
    "lampada led tubular 9w"    : {"id": "19.36", "desc": "Lâmpada LED tubular bivolt 9/10W", "un": "UN"},
    "lampada led tubular 18w"   : {"id": "19.37", "desc": "Lâmpada LED tubular bivolt 18/20W", "un": "UN"},
    # PISO
    "retirada piso tatil"       : {"id": "2.12",  "desc": "Retirada de piso tátil com limpeza", "un": "m²"},
    "regularizacao piso"        : {"id": "10.1",  "desc": "Regularização de base ou contrapiso", "un": "m²"},
    "rejunte"                   : {"id": "10.5",  "desc": "Rejuntamento de pisos e revestimentos", "un": "m²"},
    # CALHA / TELHADO
    "calha galvanizada"         : {"id": "7.14",  "desc": "Calha de chapa galvanizada", "un": "m²"},
    "retirada calha"            : {"id": "2.11",  "desc": "Retirada de cumeeira, espigão, rufo, calha ou chapim, perfil de alumínio", "un": "m"},
    "ponto agua fria"           : {"id": "20.20", "desc": "Ponto de água fria (até 6m)", "un": "un"},
    # SANITÁRIOS
    "torneira"                  : {"id": "20.11", "desc": "Torneira - substituição", "un": "un"},
}


# ---------------------------------------------------------------------------
# PARSE DE MEDIDAS (nome do arquivo)
# ---------------------------------------------------------------------------

def parse_medidas_sp2(nome_arquivo: str) -> dict:
    """
    Extrai medidas do nome do arquivo no padrão SP2 (Contrato 1565).

    Formatos suportados:
      "01 - 6,50 x 3,00.jpg"                      → largura, altura simples
      "01 - 6,50 x 3,00 - Desconto 1,89m².jpg"    → com desconto
      "01 - 3,85 x 2,18 - Faces 2.jpg"            → com fator de faces
      "01 - 3,85 x 2,18 - Faces 2 - Desconto 1,89m².jpg" → faces + desconto
      "01 - 5,00 x 1,90 - Muro 1.jpg"             → com nome de parede
      "01 - 0,10 x 5,00 - Qtd 3.jpg"              → com quantidade (mastros, etc.)

    Retorna dict com:
      {
        'num': int | None,          # número da foto (prefixo)
        'largura': float,
        'altura': float,
        'faces': int,               # padrão 1
        'desconto': float,
        'subtotal': float,          # largura × altura × faces (antes do desconto)
        'total': float,             # subtotal − desconto
        'parede_nome': str,         # ex: "Muro 1", "Parede Esquerda"
        'quantidade': float,        # para mastros, pisos táteis, etc.
        'tem_medidas': bool
      }
    """
    resultado = {
        'num': None,
        'largura': 0.0,
        'altura': 0.0,
        'faces': 1,
        'desconto': 0.0,
        'subtotal': 0.0,
        'total': 0.0,
        'parede_nome': '',
        'quantidade': 1.0,
        'tem_medidas': False
    }

    # Número do arquivo (prefixo)
    match_num = re.match(r'^(\d+)', nome_arquivo)
    if match_num:
        resultado['num'] = int(match_num.group(1))

    # Dimensões: "6,50 x 3,00" ou "6.50 x 3.00"
    match_dim = re.search(r'(\d+[,\.]\d+)\s*[xX]\s*(\d+[,\.]\d+)', nome_arquivo)
    if match_dim:
        try:
            resultado['largura'] = float(match_dim.group(1).replace(',', '.'))
            resultado['altura']  = float(match_dim.group(2).replace(',', '.'))
            resultado['tem_medidas'] = True
        except ValueError:
            pass

    # Faces: "Faces 2" ou "2 faces"
    match_faces = re.search(r'[Ff]aces?\s*(\d+)', nome_arquivo)
    if match_faces:
        resultado['faces'] = int(match_faces.group(1))

    # Desconto: "Desconto 1,89" ou "Desc 1,89m²"
    match_desc = re.search(r'[Dd]es(?:conto|c)\.?\s*(\d+[,\.]\d+)', nome_arquivo)
    if match_desc:
        try:
            resultado['desconto'] = float(match_desc.group(1).replace(',', '.'))
        except ValueError:
            pass

    # Nome da parede/muro: "Muro 1", "Parede 2", "Fachada Esquerda"
    match_parede = re.search(
        r'((?:Muro|Parede|Fachada|Lateral|Frontal|Posterior|Grade)\s+[\w\s]+?)(?:\s*[-–]|\.(?:jpg|png|jpeg)|$)',
        nome_arquivo, re.IGNORECASE
    )
    if match_parede:
        resultado['parede_nome'] = match_parede.group(1).strip()

    # Quantidade unitária: "Qtd 3" ou "X3"
    match_qtd = re.search(r'(?:[Qq]td|[Xx])\s*(\d+)', nome_arquivo)
    if match_qtd:
        resultado['quantidade'] = float(match_qtd.group(1))

    # Cálculo
    if resultado['tem_medidas']:
        subtotal = round(resultado['largura'] * resultado['altura'] * resultado['faces'], 2)
        resultado['subtotal'] = subtotal
        resultado['total']    = round(subtotal - resultado['desconto'], 2)

    return resultado


# ---------------------------------------------------------------------------
# FORMATADORES DE TEXTO
# ---------------------------------------------------------------------------

def formatar_moeda(valor: float) -> str:
    """Float → string no formato brasileiro. Ex: 3.1 → '3,10'"""
    return f"{valor:.2f}".replace('.', ',')


def formatar_enunciado_item(codigo: str, descricao: str) -> str:
    """
    Gera o texto de enunciado que aparece antes da tabela de cálculo.
    Exemplo:
      "Item 17.2 – Emassamento de parede interna ou teto com massa corrida..."
    """
    return f"Item {codigo} – {descricao}."


def formatar_referencia_foto(num: Optional[int], parede_nome: str = '') -> str:
    """
    Gera o texto da célula REFERÊNCIA na tabela.
    Exemplos:
      num=1, parede_nome=''         → "Foto 01"
      num=1, parede_nome='Parede 1' → "Foto 01 – Parede 1"
    """
    base = f"Foto {num:02d}" if num is not None else "Foto"
    if parede_nome:
        return f"{base} – {parede_nome}"
    return base


def formatar_descricao_narrativa(ambiente: str, servico: str, area_m2: float) -> str:
    """
    Gera descrição padrão para o Modo SP2 (narrativa, sem marcador <RED>).
    Mais detalhada que o SP1, seguindo o padrão do Contrato 1565.
    """
    amb = ambiente.strip().lower()
    srv = servico.strip().lower()
    return (
        f"Com base na inspeção realizada na área de {amb}, foram identificadas "
        f"ocorrências que necessitam de intervenção. Em função dessas não conformidades, "
        f"será necessário executar os serviços de {srv}, totalizando "
        f"{formatar_moeda(area_m2)} m², a fim de restabelecer as condições adequadas "
        f"de uso e conservação do ambiente."
    )


def formatar_descricao_elemento_metalico(elemento: str, area_m2: float, faces: int) -> str:
    """Descrição para pintura de elemento metálico com faces."""
    faces_str = f"{faces} {'face' if faces == 1 else 'faces'}"
    return (
        f"O elemento {elemento.lower()} apresenta sinais de desgaste na pintura e início "
        f"de oxidação. Será necessária a execução de pintura em esmalte sintético para "
        f"proteção da estrutura, considerando {faces_str} ({formatar_moeda(area_m2)} m²)."
    )


# ---------------------------------------------------------------------------
# DETECÇÃO DE TIPO DE ITEM POR NOME DE PASTA
# ---------------------------------------------------------------------------

def detectar_item_por_pasta(nome_pasta: str) -> Optional[dict]:
    """
    Tenta identificar o item do contrato pelo nome da pasta (serviço).
    Retorna o dict de item ou None.

    Busca por substring no nome da pasta (normalizado).
    """
    nome_norm = nome_pasta.lower()
    # Remove prefixos numéricos como "2.1-" ou "- "
    nome_norm = re.sub(r'^\d+[\.\d]*\s*[-–]\s*', '', nome_norm).strip()

    for chave, item in ITENS_CONTRATO_SP2.items():
        # Busca por palavras-chave da chave no nome
        palavras = chave.split()
        if all(p in nome_norm for p in palavras):
            return item

    return None


# ---------------------------------------------------------------------------
# UTILITÁRIOS DE CROQUI
# ---------------------------------------------------------------------------

def e_croqui(nome_arquivo: str) -> bool:
    """Retorna True se o arquivo é um croqui (nome começa com CROQUI)."""
    return bool(re.match(r'^[Cc][Rr][Oo][Qq][Uu][Ii]', nome_arquivo.strip()))


def extrair_legenda_croqui(nome_arquivo: str) -> str:
    """
    Extrai a legenda do croqui a partir do nome do arquivo.
    Ex: "CROQUI 01 - Dimensões da laje.jpg" → "CROQUI 01 – Dimensões da laje"
    """
    nome_sem_ext = re.sub(r'\.[^.]+$', '', nome_arquivo).strip()
    # Normaliza traços
    legenda = re.sub(r'\s*[-–]\s*', ' – ', nome_sem_ext, count=1)
    return legenda.upper() if 'CROQUI' in legenda.upper() else f"CROQUI – {legenda}"
