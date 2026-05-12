import os
from generator_sp import run_all_sp

if __name__ == "__main__":
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    
    pasta_raiz = r"c:\Users\thiag\teste de relatório\VILA TATETUBA 7027 - MODELO ORGANIZAÇÃO NOVA PARA SÃO PAULO\- Área interna"
    modelo_path = os.path.join(BASE_DIR, "templates", "MODELO - 0908 - SAO PAULO.docx")
    pasta_saida = os.path.join(BASE_DIR, "..", "..", "DOCUMENTOS", "output")
    
    # Executa teste
    resultado = run_all_sp(
        pasta_raiz=pasta_raiz, 
        modelo_path=modelo_path, 
        pasta_saida=pasta_saida,
        logger=print
    )
    
    print("\n[RESULTADO]")
    print(f"Relatório gerado em: {resultado.output_docx}")
    print(f"Total de imagens processadas: {resultado.total_images}")
