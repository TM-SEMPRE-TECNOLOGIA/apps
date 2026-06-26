---
name: relatorio-preventivo
description: |
  Skill para automatizar o relatório fotográfico de vistoria preventiva
  (Banco do Brasil / Caixa Econômica Federal — contratos de manutenção).

  Gera memorial final (.docx), extrai itens para Excel (.xlsx),
  verifica divergências entre corpo e memorial, e valida legendas de fotos.
input_template: |
  Caminho completo do arquivo .docx de entrada.
  Exemplo: "C:\Users\thiag\Desktop\Meus Relatorios\Relatorio.docx"
scripts:
  - scripts/parse_report.py
  - scripts/gerar_memorial.py
  - scripts/extrair_itens_v2.py
  - scripts/verificar_divergencias_v2.py
  - scripts/verificar_legendas_v2.py
---

# Skill: Relatório Preventivo

## Contexto

Automatiza o processamento de relatórios fotográficos de vistoria
preventiva usados em contratos de manutenção do Banco do Brasil e
Caixa Econômica Federal.

Parser adaptativo v2: lê DIRETAMENTE do .docx via python-docx
(sem conversão intermediária para markdown). Detecta automaticamente
o tipo de cada tabela pelo cabeçalho real e número de colunas.

## Fluxo de trabalho com o usuário (IMPORTANTE)

SEMPRE siga esta ordem:

1. **Rode o pipeline completo** sem pausar para investigar
2. **Apresente os resultados** (memorial, itens, divergências) em formato limpo
3. **SÓ investigue** se o usuário apontar um problema específico

O usuário quer ver os resultados primeiro, depois decide se algo está errado.

## Pipeline de Processamento

### 1. Verificar legendas (sempre primeiro)
```bash
python3 scripts/verificar_legendas_v2.py <input.docx>
```

### 2. Extrair itens para Excel
```bash
python3 scripts/extrair_itens_v2.py <input.docx> <output.xlsx>
```
Gera planilha com duas abas: "Lista Completa" (todas as ocorrências)
e "Consolidado" (quantidades somadas por código).

### 3. Gerar memorial final (.docx)
```bash
python3 scripts/gerar_memorial.py <input.docx> <output.docx>
```
Consolida todas as ocorrências do mesmo código em uma única tabela,
com formatação padrão (cinza escuro para cabeçalhos, cinza médio para totais).

### 4. Verificar divergências
```bash
python3 scripts/verificar_divergencias_v2.py <input.docx>
```
Compara total declarado vs soma das linhas individuais.

## Lógica do Parser (parse_report.py)

### Detecção do tipo de tabela (`detect_htype`)

A função detecta o tipo combinando **texto do cabeçalho** + **número de colunas**:

| Tipo | Colunas | Critério de detecção |
|------|---------|----------------------|
| `unit` | 3 | Header contém "Quantitativo" ou "Unidade" |
| `full` | 5 ou 6 | Header contém "Desconto" **OU** `len(headers) >= 5` |
| `nodiscount` | 4 | Demais casos (Foto, Comp, Alt, Total) |

### Mapeamento de colunas para `full`

**6 colunas** (com Desconto explícito):
```
[0]=Foto | [1]=Comp | [2]=Alt | [3]=Desc | [4]=Sub | [5]=Tot
```

**5 colunas** (sem Desconto — Subtotal implícito):
```
[0]=Foto | [1]=Comp | [2]=Alt | [3]=Sub | [4]=Tot
```
Neste caso `desc` fica vazio e `tot` usa `r[4]`.

### Linha de total para `unit`

Para tabelas unitárias, a última linha pode ser:
- 3 células: `['Total', '6,00', 'M/MÊS']` → lê `[-2]` e `[-1]`
- 2 células: `['Total', '6,00']` → lê `[-1]`
- 1 célula mesclada: `['Total 12,00 M/MÊS']` → extrai valor+unidade do texto

### Detectores de fator multiplicador/divisor (`extract_factor`)

A função `extract_factor(total_label)` extrai o fator da label da última linha:

| Padrão detectado | Fator retornado | Exemplo |
|---|---|---|
| `Total (X3)` | `3.0` (multiplica) | `['Total (X3)', ..., '4,50']` |
| `Total multiplicado por 25` | `25.0` (multiplica) | `['Total multiplicado por 25', ..., '1,56']` |
| `Total dividido por 10` | `0.1` (multiplica = 1/10) | `['Total dividido por 10', ..., '1,63']` |
| `Total dividido por` (sem nº) | `-1.0` (auto-detect) | Detecta via ratio `declared / sum(tots)` |
| `Total` (normal) | `1.0` (sem ajuste) | Nenhum fator |

### Aplicação do fator às linhas (`apply_factor_to_rows`)

Quando `factor != 1.0`, os valores `tot` de CADA linha de dados são recalculados:
- `tot_novo = tot_original × factor`
- `Desconto` vazio é preenchido com `'0,00'`

Para `factor = -1.0` (auto-detect), calcula: `factor = declared_total / sum(tots_originais)`

## Formatação do Memorial

- Fonte: **Calibri 11** (parâmetro `size_pt=11` em `gerar_memorial.py`)
- Cabeçalhos: cinza escuro `#808080`
- Linha de Total: cinza médio `#AEAAAA`
- **Todas as tabelas têm 10.540 twips de largura total** (Foto fixa em 1500):
  - full (6 col): `[1500, 1800, 1800, 1800, 1800, 1840]`
  - nodiscount (4 col): `[1500, 3013, 3013, 3014]`
  - unit (3 col): `[1500, 4520, 4520]`

## Padrões de tabelas encontradas em relatórios reais (BB/CEF)

Consulte `references/padroes-tabelas.md` para a referência completa.

Resumo dos padrões de **última linha** observados:

| Padrão na última linha | Significado | Exemplo |
|------------------------|-------------|---------|
| `Total` | Valor normal | Célula contém apenas "Total" nas primeiras N-1 colunas, valor na última |
| `Total (X3)` | Valor declarado = Subtotal × 3 | `['Total (X3)', ..., '4,50']` — 4,50 = 1,50 × 3 |
| `Total multiplicado por N` | Valor declarado = Subtotal × N | `['Total multiplicado por 25', ..., '1,56']` |
| `Total dividido por N` | Valor declarado = Subtotal ÷ N | `['Total dividido por 10', ..., '1,63']` — Subtotal real 16,28 |
| `Total dividido por` (sem N) | Auto-detecta via ratio | Declarado=0,63, soma linhas=6,35 → fator=0,63/6,35≈0,099 |

> O memorial usa SEMPRE o **valor declarado na última linha** (já com o multiplicador/divisor aplicado). As divergências reportadas pelo checker são esperadas nesses casos.

## Problemas Conhecidos (Pitfalls)

> ⚠️ **ANTES de qualquer debug, leia `references/licoes-aprendidas.md`** —
> contém o histórico completo de todos os problemas já resolvidos,
> sintomas, causas e soluções. Evite retrabalho.

### Memorial pré-existente no documento
O relatório pode conter tabelas de memorial já geradas no final do documento.
O parser as lê junto com as tabelas de dados brutos quando elas têm "Itens"
no título. Isso pode **dobrar os valores** no consolidado.

**Solução**: O script `verificar_divergencias_v2.py` detecta tabelas de memorial
(onde total_value=0.0 para unitárias com célula mesclada) e as sinaliza.
Sempre processe a versão do relatório que NÃO tenha o memorial embutido,
ou remova as tabelas de memorial antes de processar.

### Tabelas de 4 colunas que na verdade são de 5
Se o header não contém "Desconto" mas tem 5 colunas, o parser antigo detectava
como `nodiscount` (4 colunas), lendo a coluna "Subtotal" como se fosse "Total".
A correção `len(headers) >= 5` → `full` resolveu, mas exige que o mapeamento
de colunas também se ajuste (5 colunas usa `r[4]` para `tot`, não `r[5]`).

### Arquivos " - Copia" vs originais
Podem ter conteúdos diferentes (quantidade de tabelas, presença/ausência de
memorial embutido). Sempre processe o arquivo que o usuário explicitamente
apontar, não o que você achar na mesma pasta.

## Notas Técnicas

- **Windows + git-bash/MSYS**: o terminal usa bash, não PowerShell. Caminhos
  podem ser POSIX (`/c/Users/...`) ou nativos (`C:\Users\...`).
- **Dependências**: python-docx e openpyxl.
- **Parser adaptativo**: não existe layout fixo. Cada tabela é interpretada
  individualmente pelo cabeçalho real + contagem de colunas.
- **Totais**: sempre lidos da última linha da tabela no .docx, nunca recalculados.
