"""
Validacao cruzada: roda o parser novo e compara com os dados brutos.
"""
import sys, os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\thiag\Desktop\TM-MEUS-APPS\scratch")

from process_report import parse_docx_stream, consolidate, fmt

INPUT = r"C:\Users\thiag\Downloads\RELATÓRIO FOTOGRÁFICO - BARRETOS - LEVANTAMENTO PREVENTIVO.docx"

with open(INPUT, 'rb') as f:
    occurrences = parse_docx_stream(f)

print(f"Total de tabelas extraidas: {len(occurrences)}")
print()

# Mostra cada ocorrencia com seus dados parseados
for i, occ in enumerate(occurrences):
    print(f"--- OCC #{i+1}: {occ['code']} | htype={occ['htype']} | total={fmt(occ['total_value'])} | unit={occ['unit']}")
    for j, r in enumerate(occ['rows']):
        if occ['htype'] == 'full':
            print(f"    L{j}: foto={r['foto']} comp={r['comp']} alt={r['alt']} desc={r['desc']} sub={r['sub']} tot={r['tot']}")
        else:
            print(f"    L{j}: foto={r['foto']} qty={r['qty']} unit={r['unit']}")

print("\n" + "=" * 60)
print("CONSOLIDADO")
print("=" * 60)

cons = consolidate(occurrences)
for code, d in cons.items():
    print(f"  {code:12s} | {d['htype']:4s} | total={fmt(d['total']):>10s} | unit={d['unit']:>4s} | linhas={len(d['rows'])}")

print(f"\nTotal itens unicos: {len(cons)}")
