import sys
sys.path.insert(0, r'C:\Users\thiag\TM-MEUS-APPS\.NEXT APPS\TM Relatorio SP\APP\backend')
from generator_sp import build_content_sp
import json

conteudo = build_content_sp(
    r'C:\Users\thiag\Desktop\000 - Minha Demanda\2 - EM ANDAMENTO\ESTILO CASTEJON 8642 - PRIORIDADE',
    'log_test.txt',
    print
)
with open('dump.json', 'w', encoding='utf-8') as f:
    json.dump(conteudo, f, indent=2, ensure_ascii=False)
