# Lições Aprendidas — Skill Relatório Preventivo

> Arquivo de referência para evitar retrabalho em execuções futuras.
> Consulte este arquivo SEMPRE que houver divergências ou comportamentos inesperados.

---

## 1. Detecção de tipo de tabela (full vs nodiscount)

**Problema:** Tabelas com 5 ou 6 colunas mas SEM a palavra "Desconto" no cabeçalho eram
detectadas como `nodiscount` (4 colunas), fazendo o parser ler a coluna errada como "Total".

**Exemplo:** Tabela com header `['Foto', 'Comp. (m)', 'Altura (m)', 'Subtotal', 'Total (m²)']`
— 5 colunas, sem "Desconto", mas é uma tabela full.

**Solução aplicada:** `detect_htype()` agora trata `len(headers) >= 5` como `full`,
mesmo sem "Desconto" no cabeçalho. (parse_report.py:55)

---

## 2. Tabelas full de 5 vs 6 colunas

**Problema:** Tabelas full podem ter 5 colunas (Foto|Comp|Alt|Subtotal|Total) ou
6 colunas (Foto|Comp|Alt|Desconto|Subtotal|Total). O parser esperava sempre 6,
causando `tot = r[5]` inexistente (= vazio = 0,00) em tabelas de 5 colunas.

**Exemplo:** Tabela 17.1 (X3), fotos 64-70: `r[4]` = "1,50" (Total real),
mas parser lia `r[5]` que não existe → tot=0,00.

**Solução aplicada:** `parse_docx()` agora verifica `len(headers)` — se >= 6 usa
índices [0..5], se 5 usa [0..4] com `tot = r[4]`. (parse_report.py:169-187)

---

## 3. Multiplicadores e divisores nas tabelas

**Problema:** Muitas tabelas têm multiplicadores/divisores no rodapé:
- `Total (X3)` — multiplicar por 3
- `Total multiplicado por 25` — multiplicar por 25
- `Total dividido por 10` — dividir por 10
- `Total dividido por` (sem número) — auto-detectar proporção

O parser lia o valor bruto da linha de dados, mas o memorial deve mostrar
o valor EFETIVO (com fator aplicado). A divergência entre soma das linhas
e total declarado é ESPERADA nesses casos.

**Exemplos corrigidos:**
| Item | Fotos | Raw tot | Fator | tot final |
|------|-------|---------|-------|-----------|
| 17.1 | 64-70 | 1,50 | ×3 | 4,50 |
| 17.9 | 161-168 | 0,78 | ×3 | 2,34 |
| 2.18 | 90-109 | 16,28 | ÷10 | 1,63 |
| 2.18 | 71-72 | 0,95/5,40 | ÷auto | 0,09/0,54 |

**Solução aplicada:** `extract_factor()` extrai o fator do label da linha de Total.
`apply_factor_to_rows()` aplica às linhas de dados. Para "dividido por" sem número,
usa auto-detecção: `factor = declared / sum_tots`. (parse_report.py:59-120)

---

## 4. Campo Desconto vazio → "0,00"

**Problema:** Em tabelas sem a coluna Desconto (5 colunas), ou com Desconto vazio,
o memorial mostrava a célula em branco. Deve mostrar "0,00".

**Solução aplicada:** `apply_factor_to_rows()` preenche `desc = '0,00'` quando
vazio em tabelas full. (parse_report.py:116)

---

## 5. Tabelas de memorial duplicadas no documento

**Problema:** Alguns arquivos .docx (ex: "Copia.docx") têm o memorial JÁ incorporado
no final do documento. Se essas tabelas têm "Itens" no título, o parser as lê
como dados, DOBRANDO os totais consolidados.

**Sintoma:** Totais ~2× maiores que o esperado (ex: 1.766 vs 947 m²).

**Solução:** Verificar antes de processar se o documento tem memorial duplicado.
O parser já ignora tabelas sem "Itens" no título (parse_report.py:82).
Se houver duplicação, usar a versão do arquivo SEM o memorial incorporado.

**Verificação:** `Total de tabelas no doc` vs `Tabelas parseadas como dados` —
se a diferença for grande (>30%), provável que haja memorial incorporado.

---

## 6. Formatação do memorial

**Fonte:** Calibri 11pt (alterado de 9pt — gerar_memorial.py:60)

**Larguras de coluna (todas com total 10.540 twips):**
| Tipo | Foto | Comp | Alt | Desc/Sub | Outros | Total |
|------|------|------|-----|----------|--------|-------|
| full (6) | 1500 | 1800 | 1800 | 1800 | 1800+1840 | 10540 |
| nodiscount (4) | 1500 | 3013 | 3013 | - | 3014 | 10540 |
| unit (3) | 1500 | 4520 | - | - | 4520 | 10540 |

**Cores:** Cabeçalho #808080 (cinza escuro), Total #AEAAAA (cinza médio)
