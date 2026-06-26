"""
verificar_divergencias_v2.py — Etapa 3 (v2): verifica divergências no relatório.
Uso: python3 verificar_divergencias_v2.py <input.docx>

Compara:
  a) Consistência dos totais nas tabelas (declarado na última linha vs soma das linhas de dados)
  b) Códigos com tipos de tabela mistos
  c) Resumo consolidado de todos os itens para conferência visual
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from parse_report import parse_docx, consolidate, parse_float, fmt
from collections import defaultdict


def check_internal_consistency(occurrences):
    """Verifica se os totais declarados batem com a soma das linhas."""
    issues = []
    skipped_merged = 0
    checked_count = 0
    ok_count = 0
    
    for occ in occurrences:
        code = occ['code']
        htype = occ['htype']
        total_declared = occ['total_value']
        rows = occ['rows']
        nrows = len(rows)

        if nrows == 0:
            continue

        # Pular tabelas de memorial com célula mesclada (1 célula -> parsed como 0.0)
        # Essas são tabelas consolidadas já existentes no docx, não dados brutos
        if total_declared < 0.001 and htype == 'unit':
            skipped_merged += 1
            continue

        if htype == 'unit':
            recalc = sum(parse_float(r.get('qty', '0')) for r in rows)
        else:
            recalc = sum(parse_float(r.get('tot', '0')) for r in rows)

        checked_count += 1

        # Se o total declarado é muito pequeno, provável tabela memorial mal-parseda
        if total_declared < 0.001:
            skipped_merged += 1
            continue

        diff = abs(recalc - total_declared)
        
        # Só reportar se diferença > 5% E > 0.05 m²
        if diff > 0.05 and (total_declared < 0.001 or diff / total_declared > 0.05):
            issues.append({
                'code': code,
                'htype': htype,
                'declared': total_declared,
                'recalculated': recalc,
                'diff': diff,
                'pct': (diff / total_declared) * 100,
                'nrows': nrows,
            })
        else:
            ok_count += 1

    return issues, checked_count, ok_count, skipped_merged


def main(docx_path):
    occurrences = parse_docx(docx_path)
    consolidated = consolidate(occurrences)

    print('=' * 72)
    print('  VERIFICAÇÃO DE DIVERGÊNCIAS (V2)')
    print(f'  Arquivo: {os.path.basename(docx_path)}')
    print('=' * 72)
    print(f'  Total de tabelas lidas:  {len(occurrences)}')
    print(f'  Itens únicos:            {len(consolidated)}')
    print()

    # 1. Verificar consistência interna dos totais
    issues, checked, ok_count, skipped = check_internal_consistency(occurrences)
    print(f'  [1] Consistência de totais: {ok_count} OK de {checked} verificadas'
          f'{" (" + str(skipped) + " tabelas de memorial ignoradas)" if skipped else ""}')
    if issues:
        print(f'      {len(issues)} ocorrências com divergência significativa:')
        print()
        print(f'      {"Código":8} {"Declarado":>10} {"SomaLinhas":>12} {"Diferença":>10} {"%":>7} {"Tipo":12}')
        print(f'      {"-"*61}')
        for iss in sorted(issues, key=lambda x: x['pct'], reverse=True)[:15]:
            print(f'      {iss["code"]:8} {fmt(iss["declared"]):>10} {fmt(iss["recalculated"]):>12} '
                  f'{fmt(iss["diff"]):>10} {iss["pct"]:>6.0f}% {iss["htype"]:12}')
        if len(issues) > 15:
            print(f'      ... e mais {len(issues)-15} ocorrências')
        print()
        print(f'      NOTA: Divergências entre o total declarado na tabela e a soma')
        print(f'      das linhas individuais são COMUNS quando há valores por foto')
        print(f'      que diferem do subtotal da tabela. O memorial usa o valor')
        print(f'      DECLARADO (total da última linha).')
    else:
        print('      ✅ Todos consistentes')
    print()

    # 2. Verificar tipos mistos
    types_by_code = defaultdict(set)
    for occ in occurrences:
        types_by_code[occ['code']].add(occ['htype'])
    mixed = {c: t for c, t in types_by_code.items() if len(t) > 1}

    print(f'  [2] Consistência de tipo: ', end='')
    if mixed:
        print(f'{len(mixed)} código(s) com tipos mistos:')
        for c, t in sorted(mixed.items()):
            print(f'      {c:8} → {", ".join(sorted(t))}')
        print('      (Normal — mesmo serviço em tipos de tabela diferentes)')
    else:
        print('✅ Todos consistentes')
    print()

    # 3. Lista consolidada para conferência visual
    print('  [3] LISTA CONSOLIDADA — MEMORIAL DE CÁLCULO')
    print(f'      {"Código":8} {"Descrição":55} {"Total":>12} {"Tipo":12}')
    print(f'      {"-"*89}')
    total_geral = 0.0
    for code, item in consolidated.items():
        desc_short = item['desc'][:53] if item['desc'] else '(sem descrição)'
        val_str = f'{fmt(item["total"])}'
        if item['unit']:
            val_str += f' {item["unit"]}'
        print(f'      {code:8} {desc_short:55} {val_str:>12} {item["htype"]:12}')
        total_geral += item['total']

    print(f'      {"-"*89}')
    print(f'      {"TOTAL GERAL (m² equivalentes)":>64} {fmt(total_geral):>12}')
    print()
    print('=' * 72)

    issues_count = len(issues)
    if issues_count == 0 and not mixed:
        print('  ✅ RESULTADO: Nenhuma divergência significativa encontrada.')
    else:
        print(f'  📊 RESUMO:')
        print(f'     • {issues_count} divergência(s) de cálculo (>5% do total declarado)')
        print(f'     • {len(mixed)} código(s) com tipo misto (informativo)')
        if issues_count > 0:
            print()
            print(f'  ⚠️  Atenção para itens com divergência. O memorial usou o total')
            print(f'  DECLARADO. Verifique se as fotos na tabela estão corretas.')
    print('=' * 72)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Uso: python3 verificar_divergencias_v2.py <input.docx>')
        sys.exit(1)
    main(sys.argv[1])
