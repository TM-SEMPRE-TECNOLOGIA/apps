import sys
import os
from dotenv import load_dotenv

# Carrega chaves do dotenv root
load_dotenv()

# Ajusta path para reconhecer módulo
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from docfactory.crew import DocfactoryCrew

def run():
    # Contexto global
    inputs = {
        'project_name': 'Serviço de Ordens (TM-OS) SaaS',
        'project_description': 'Um sistema Multi-Tenant para emissão, gerenciamento e controle de Ordens de Serviço (OS) técnicas para manutenção predial avançada.'
    }
    
    # Roda o super-pipeline
    print("🚀 DocFactory Squad - Kickoff...")
    DocfactoryCrew().crew().kickoff(inputs=inputs)
    print("✅ Todos os 28 documentos gerados com sucesso nas subpastas /output!")

if __name__ == '__main__':
    run()
