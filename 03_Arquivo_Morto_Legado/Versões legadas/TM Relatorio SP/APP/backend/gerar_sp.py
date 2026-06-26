"""
Gerador SP standalone — roda direto pelo terminal.

Uso:
    python gerar_sp.py "C:\caminho\da\pasta"

A pasta deve ter a estrutura SP:
    Pasta Raiz/
    ├── - Área externa/
    │   ├── - Vista ampla/  (fotos panorâmicas)
    │   ├── 1 - Serviço/
    │   │   ├── 1 - 2,10 x 0,40.jpg
    │   │   ├── - Detalhes 1/
    │   │   │   └── foto_detalhe.jpg
    │   │   └── ...
    │   └── ...
    └── - Área interna/
        └── ...

O modelo usado é: templates/MODELO - 0908 - SAO PAULO - ATUALIZADO.docx
O relatório é salvo na mesma pasta raiz.
"""

import sys
import os

# Permite importar os módulos da pasta atual mesmo sem instalar
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from generator_sp import build_content_sp
from word_utils_sp import inserir_conteudo_sp


MODELO_PADRAO = os.path.join(BASE_DIR, "templates", "MODELO - 0908 - SAO PAULO - ATUALIZADO.docx")


def gerar(pasta_raiz: str, modelo: str = MODELO_PADRAO):
    if not os.path.isdir(pasta_raiz):
        print(f"[ERRO] Pasta não encontrada: {pasta_raiz}")
        sys.exit(1)

    if not os.path.isfile(modelo):
        print(f"[ERRO] Template não encontrado: {modelo}")
        print(f"Templates disponíveis:")
        templates_dir = os.path.join(BASE_DIR, "templates")
        for t in os.listdir(templates_dir):
            print(f"  - {t}")
        sys.exit(1)

    nome_pasta = os.path.basename(pasta_raiz.rstrip(os.sep))
    output_path = os.path.join(pasta_raiz, f"RELATÓRIO FOTOGRÁFICO - {nome_pasta}.docx")
    log_errors_path = os.path.join(pasta_raiz, "erros_pastas.txt")

    print(f"\n{'='*60}")
    print(f"  GERADOR SP - CONTRATO 0908 - SÃO PAULO")
    print(f"{'='*60}")
    print(f"  Pasta:    {pasta_raiz}")
    print(f"  Template: {os.path.basename(modelo)}")
    print(f"  Saída:    {output_path}")
    print(f"{'='*60}\n")

    def log(msg):
        print(f"  {msg}")

    conteudo = build_content_sp(pasta_raiz, log_errors_path, logger=log)

    print(f"\n  Itens lidos: {len(conteudo)}")
    print(f"  Gerando documento Word...\n")

    total_imagens = inserir_conteudo_sp(modelo, conteudo, output_path)

    print(f"\n{'='*60}")
    print(f"  [OK] Relatório gerado com sucesso!")
    print(f"  Imagens inseridas: {total_imagens}")
    print(f"  Arquivo: {output_path}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("\nUso: python gerar_sp.py \"C:\\caminho\\da\\pasta\"")
        print("\nExemplo:")
        print('  python gerar_sp.py "C:\\Users\\thiag\\Desktop\\000 - Minha Demanda\\2 - Em andamento\\BAIRRO IPIRANGA - 1184 (em andamento)"')
        sys.exit(0)

    pasta = sys.argv[1]
    modelo_custom = sys.argv[2] if len(sys.argv) > 2 else MODELO_PADRAO

    gerar(pasta, modelo_custom)
