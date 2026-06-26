---
name: tm-automatizando
description: >
  TM-Automatizando — skill da TM Sempre Tecnologia para completar relatórios fotográficos
  preventivos do Banco do Brasil (contratos 0908, 1507, 1565, 2056, 2057, 2626, 2627,
  3575, 6122) que chegam PRÉ-FINALIZADOS — só com fotos, marcações `Foto N` e medidas
  escritas a punho — gerando narrativas, "-Detalhes:" e tabela de memorial de cálculo
  com fidelidade total ao padrão visual/editorial.

  Padrão editorial OFICIAL: Santa Adélia (sem "Prezados,").

  Regras invioláveis: (1) nenhuma frase genérica — tudo vem de banco curado;
  (2) nenhum item inventado — usa apenas itens_oficiais_master.json e
  itens_por_contrato.json; (3) códigos de pintura 17.x seguem regras_pintura.json
  por contrato; (4) banco só cresce com aprovação humana via curador; (5) gera
  preview HTML antes da gravação no .docx; (6) cada composição (legenda, tabela,
  item) sai como arquivo individual em saida/<relatorio>/.

  Use este skill SEMPRE que o usuário mencionar: "TM-Automatizando",
  "completar relatório", "preencher .docx com fotos e medidas", "relatório SP2
  pré-finalizado", "rodar TM-Automatizando", "completar Santa Adélia / Ribeirão
  Preto / Guariba / Cuiabá / Salinas / Varginha / Valadares / Tangará / Divinópolis",
  "contrato 1565", "1507", "0908", "3575", "6122", "2056", "2057", "2626", "2627".

  Etapas cobertas pelo skill:
  1. Parsing do .docx pré-finalizado (detecta Foto N, medidas, código, seção)
  2. Análise visual híbrida (heurística + Claude Vision em ambíguos)
  3. Geração textual a partir do banco curado
  4. Memorial de cálculo (L × A × Faces − Desconto = Total)
  5. Preview HTML interativo antes da gravação
  6. Cross-check N1–N4 (aritmética, coerência, sequência, formatação, órfãs)
  7. Gravação no .docx + curadoria de frases novas
---

# TM-Automatizando · Skill SP da TM Sempre Tecnologia

> "Eu não escrevo. Eu reconheço. Cada palavra que entrego veio antes da sua caneta."

## Identidade

- **Nome:** TM-Automatizando
- **Versão:** 0.3.0
- **Padrão editorial:** Santa Adélia (sem "Prezados,")
- **Princípio:** zero texto genérico, zero item inventado

## Dependências

```bash
pip install python-docx openpyxl pillow --break-system-packages
# opcional para VLM:
pip install anthropic --break-system-packages
# opcional para OCR:
pip install pytesseract --break-system-packages
```

## Quando ativar

- Usuário envia um `.docx` SP sem texto narrativo.
- Frases-chave: "TM-Automatizando", "completar", "preencher", "pré-finalizado",
  nomes de unidades (Santa Adélia, Ribeirão, Guariba…), códigos de contrato
  (1565, 0908, 1507, etc.).

## Quando NÃO ativar

- Há pastas de fotos organizadas → use `generator_sp2.run_all_sp2()` (Rota A do V4).
- Contrato Caixa Econômica → use a skill `relatorio-preventivo`.
- `.docx` já tem texto narrativo completo → revisão manual.

## Fluxo de 7 etapas

```
.docx pré-finalizado
  → A. Parsing            → 01_cabecalho/, 02_capa/
  → B. Análise visual     → (logs internos)
  → C. Geração textual    → 03_blocos/bloco_NNN_narrativa.md, _detalhes.md
  → D. Memorial           → 03_blocos/bloco_NNN_tabela.csv, 04_memorial_consolidado.xlsx
  → E. Preview HTML       → 00_preview/preview_<ts>.html  [VOCÊ APROVA AQUI]
  → F. Cross-check        → 05_crosscheck.md
  → G. Gravação           → _PREENCHIDO_PROPOSTA.docx + 06_proposta_novas_frases.md + 07_resumo.md
```

## Uso

```bash
python scripts/completar.py \
  --input  "RELATORIO XXX.docx" \
  --output "RELATORIO XXX_PREENCHIDO_PROPOSTA.docx" \
  --contrato 1565 \
  --vlm    auto \
  --preview true
```

Argumentos:
- `--input` — .docx pré-finalizado.
- `--output` — caminho da saída (nunca sobrescreve o original).
- `--contrato` — 1565 | 0908 | 1507 | 3575 | 6122 | 2056 | 2057 | 2626 | 2627.
- `--vlm` — auto (default, só ambíguos) | sempre | nunca.
- `--preview` — true (gera HTML e para) | false (segue direto).

## Fonte de verdade

| Arquivo | Conteúdo |
|---|---|
| `scripts/itens_oficiais_master.json` | 467 itens oficiais (do `MEMORIAL DE ITENS - LOTE SP.xlsx`) |
| `scripts/itens_por_contrato.json` | 6 contratos × ~470 itens (das previsões orçamentárias) |
| `scripts/regras_pintura.json` | 9 contratos × regras 17.x (do HTML MAFFENG) |
| `scripts/banco_frases_sp2.json` | 22 narrativas + 13 detalhes curados |

Se um item não existe em nenhum desses, a skill **PARA** e avisa.

## Regras de pintura por contrato

| Contrato | Cidade(s) | Pintura permitida |
|---|---|---|
| **1565** | SJ Rio Preto + Ribeirão (Santa Adélia, Guariba) | 17.10 muros · 17.4 paredes externas · **17.6 interna+teto** |
| **0908** | SJ Campos | 17.6 teto · 17.4 restante e muros |
| **1507** | Cuiabá | 17.11 colorida · 17.6 teto · 17.4 restante |
| **3575** | Tangará/Sinop/Barra das Garças | 17.11 colorida · 17.6 teto · 17.4 restante |
| **6122** | Campo Grande + Aquidauana | 17.4 paredes+forro · 17.10 muros · 17.11 coloridas |
| **2056** | Divinópolis | 17.6 teto+muros+externas · 17.11 toda interna |
| **2057** | Varginha | 17.6 teto+externas · 17.10 muros vizinho · 17.11 interna |
| **2627** | Valadares/Joaíma | 17.6 teto+externas · 17.10 muros · 17.11 interna |
| **2626** | Salinas/SF | 17.6 teto+muros+externas · 17.11 toda interna |

## Regras invioláveis

1. Nunca usar "Prezados," como abertura — segue padrão Santa Adélia.
2. Nunca inventar item de contrato.
3. Nunca trocar 17.4/17.6/17.10/17.11 fora do permitido.
4. Nunca gravar frase nova no banco sem aprovação humana.
5. Nunca sobrescrever o .docx original.
6. Detalhes vêm LOGO ABAIXO da foto-narrativa, nunca no fim.
7. Quando ambíguo, parar e perguntar.

## Estrutura da skill

```
tm-automatizando/
├── SKILL.md
├── README.md
└── scripts/
    ├── completar.py
    ├── persona.py
    ├── parser_docx.py
    ├── gerador_texto.py
    ├── gerador_memorial.py
    ├── inserir_no_docx.py
    ├── validator.py
    ├── vlm_helper.py
    ├── curador.py
    ├── preview_html.py
    ├── exportar_etapas.py
    ├── banco_frases_sp2.json
    ├── itens_oficiais_master.json
    ├── itens_por_contrato.json
    └── regras_pintura.json
```

## Garantias

- Não sobrescreve o original (`_PREENCHIDO_PROPOSTA.docx` sempre).
- Não inventa texto.
- Não inventa item.
- Não viola regras de pintura.
- Não grava no banco sem aprovação.
- Preserva formatação (clona estilo do parágrafo vizinho).
- Falha alto: item ausente, regra violada, ou ambiguidade ⇒ PARA e avisa.

## Limitações honestas

1. 17.6 vs 17.11 visualmente indistinguíveis — usa `regras_pintura.json` por contrato.
2. Quantidades escondidas (lâmpadas em luminária fechada) — pede revisão.
3. VLM falha em fotos escuras/desfocadas — marca ⚠.
4. .docx > 500 fotos — processa em chunks de 100.

## Personalidade na voz

> ✅ "Foto 14 ambígua. Histórico do contrato 1565 aponta 17.6."
> ✅ "Memorial do bloco 2.4 com soma divergente: 25,20 m² declarado, 24,80 m² calculado."
> ✅ "Item 8.6 ausente no contrato 1565. Bloqueando inserção."
>
> ❌ "Olá! Tudo bem? Vou começar..." *(nunca)*
> ❌ "Prezados, durante o levantamento..." *(nunca)*
> ❌ "Acho que talvez seja..." *(nunca)*
