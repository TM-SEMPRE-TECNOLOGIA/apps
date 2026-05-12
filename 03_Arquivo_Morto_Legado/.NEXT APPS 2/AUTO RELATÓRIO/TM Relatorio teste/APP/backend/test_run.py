import os
import sys

# Garante que o diretório atual está no path para importar utils_sp e word_utils_sp
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from generator_sp import run_all_sp

def test_generation():
    # Pasta com imagens reais para teste (ITAMONTE)
    pasta_raiz = r"C:\Users\thiag\TM-MEUS-APPS\0 - NEXT APPS\TM Relatorio Final\ITAMONTE - (Relatório sendo feito)"
    
    # Modelo oficial da pasta templates
    templates_dir = r"C:\Users\thiag\TM-MEUS-APPS\0 - NEXT APPS\TM Relatorio SP\APP\backend\templates"
    modelo_path = os.path.join(templates_dir, "MODELO - 2056 - DIVINOPOLIS - ATUALIZADO.docx")
    
    # Pasta de saída
    pasta_saida = r"C:\Users\thiag\TM-MEUS-APPS\0 - NEXT APPS\TM Relatorio teste\output_test"
    
    print(f"Iniciando teste de geração...")
    print(f"Origem: {pasta_raiz}")
    print(f"Modelo: {modelo_path}")
    print(f"Saída: {pasta_saida}")
    
    try:
        # A função run_all_sp não retorna RunResult, mas o inserir_conteudo_sp retorna total
        total_imagens = run_all_sp(
            pasta_raiz=pasta_raiz,
            modelo_path=modelo_path,
            pasta_saida=pasta_saida,
            logger=print
        )
        print("\n=== TESTE CONCLUÍDO COM SUCESSO ===")
        print(f"Total de imagens processadas: {total_imagens}")
    except Exception as e:
        print(f"\n!!! ERRO NO TESTE: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_generation()
