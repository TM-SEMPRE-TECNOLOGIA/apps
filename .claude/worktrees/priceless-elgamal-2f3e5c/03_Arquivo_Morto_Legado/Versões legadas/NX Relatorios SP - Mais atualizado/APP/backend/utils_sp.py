import re

def parse_medidas_arquivo(nome_arquivo):
    """
    Extrai medidas numéricas a partir do nome do arquivo no Modelo Organizado (São Paulo).
    Exemplo de entrada: "1 - 3,10 x 2,95 - Desconto 1,89m².jpg"
    Retorna: largura (float), altura (float), desconto (float), subtotal (float), area_total (float)
    """
    largura = 0.0
    altura = 0.0
    desconto = 0.0
    
    # Busca por dimensões, ex: "3,10 x 2,95"
    match_dim = re.search(r'(\d+,\d+)\s*[xX]\s*(\d+,\d+)', nome_arquivo)
    if match_dim:
        larg = match_dim.group(1).replace(',', '.')
        alt = match_dim.group(2).replace(',', '.')
        try:
            largura = float(larg)
            altura = float(alt)
        except ValueError:
            pass

    # Busca por "Desconto 1,89m²"
    match_desc = re.search(r'[Dd]esconto.*?(\d+,\d+)', nome_arquivo)
    if match_desc:
        desc = match_desc.group(1).replace(',', '.')
        try:
            desconto = float(desc)
        except ValueError:
            pass

    subtotal = round(largura * altura, 2)
    area_total = round(subtotal - desconto, 2)
    
    return largura, altura, desconto, subtotal, area_total

def formatar_moeda_texto(valor):
    """
    Converte um float para string no formato brasileiro com vírgula.
    Ex: 3.1 => "3,10"
    """
    return f"{valor:.2f}".replace('.', ',')

def formatar_descricao_tecnica(ambiente, servico, area_m2, mobiliario_un, possui_cofre=False):
    """
    Gera o texto da descrição padrão de acordo com o modelo.
    Usa o marcador <RED>...</RED> para que o word_utils saiba o que colorir.
    """
    ambiente_label = "do " + ambiente.lower() if "acesso" in ambiente.lower() or "corredor" in ambiente.lower() else "de " + ambiente.lower()
    
    texto = (
        f"--Prezados, parede {ambiente_label} apresenta <RED>{formatar_moeda_texto(area_m2)} m²</RED> "
        f"com manchas e marcas de uso. É necessária a pintura e o "
        f"<RED>remanejamento de {formatar_moeda_texto(mobiliario_un)} unidades de mobiliário para execução</RED> "
        f"e conservação do ambiente. (itens 17.4 e 13.12 do contrato)"
    )

    return texto

def formatar_descricao_cofre(servico):
    """
    Gera o texto de recusa para movimentação de cofre.
    """
    return (
        f"- Prezados, informamos a impossibilidade de retirada ou remanejamento do cofre "
        f"para a realização do serviço de {servico.lower()}. Isso ocorre devido ao peso "
        f"e o mesmo estará fixado no chão."
    )
