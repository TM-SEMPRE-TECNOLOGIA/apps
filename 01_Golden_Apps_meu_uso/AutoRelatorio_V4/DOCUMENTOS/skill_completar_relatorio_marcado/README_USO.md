# TM-Automatizando — Como usar

## Instalação

```bash
cd skill_completar_relatorio_marcado
pip install python-docx openpyxl pillow
# opcional para VLM:
pip install anthropic
# opcional para OCR de medidas manuscritas:
pip install pytesseract
```

## Uso básico

```bash
python scripts/completar.py \
  --input  "RELATORIO XXX.docx" \
  --output "RELATORIO XXX_PREENCHIDO_PROPOSTA.docx" \
  --contrato 1565 \
  --vlm    auto \
  --preview true
```

Argumentos:
- `--input` — .docx pré-finalizado (fotos + marcações + medidas).
- `--output` — caminho da saída (não sobrescreve original).
- `--contrato` — `1565` | `0908` | `1507` | `3575` | `6122` | `2056` | `2057` | `2626` | `2627`.
- `--vlm` — `auto` (default, só ambíguos) | `sempre` | `nunca`.
- `--preview` — `true` (gera HTML e para) | `false` (segue direto).

## Estrutura de saída

A cada execução, é criada uma pasta `saida/<nome_relatorio>/` com:

```
saida/SANTA_ADELIA/
├── 00_preview/preview_<ts>.html      ← interativo: aprove cada bloco
├── 01_cabecalho/cabecalho.json
├── 02_capa/capa.txt + foto1.jpg
├── 03_blocos/
│   ├── bloco_001_narrativa.md
│   ├── bloco_001_detalhes.md
│   ├── bloco_001_tabela.csv
│   └── ...
├── 04_memorial_consolidado.xlsx      ← todas as tabelas
├── 05_crosscheck.md                  ← N1..N4 ✅/⚠/❌
├── 06_proposta_novas_frases.md       ← curadoria
└── 07_resumo.md                      ← visão geral
```

## Fluxo recomendado

1. Rode com `--preview true` (default).
2. Abra `00_preview/preview_<ts>.html` no navegador.
3. Marque cada bloco como **Aprovar / Ajustar / Rejeitar**.
4. Revise `05_crosscheck.md` — resolva ❌ e ⚠.
5. Revise `06_proposta_novas_frases.md` — aprove frases que devem entrar no banco.
6. Rode novamente com `--preview false` para gravar o `.docx` final.

## Status atual dos módulos

| Módulo | Estado |
|---|---|
| `SKILL.md` | ✅ pronto |
| `persona.py` | ✅ voz + manifesto |
| `validator.py` | ✅ N1..N4 prontos |
| `preview_html.py` | ✅ gera HTML interativo |
| `exportar_etapas.py` | ✅ arquivos por etapa |
| `curador.py` | ✅ propor + aplicar prontos |
| `vlm_helper.py` | 🟡 prompt + schema prontos, chamada API TODO |
| `banco_frases_sp2.json` | ✅ 22 narrativas + 13 detalhes |
| `itens_oficiais_master.json` | ✅ 467 itens oficiais |
| `itens_por_contrato.json` | ✅ 6 contratos |
| `regras_pintura.json` | ✅ 9 contratos |
| `completar.py` | 🟡 esqueleto com fluxo |
| `parser_docx.py` | 🟡 regex prontos, parser O(n) TODO |
| `gerador_texto.py` | 🟡 hints prontos, integração TODO |
| `gerador_memorial.py` | 🟡 cálculo pronto, integração TODO |
| `inserir_no_docx.py` | 🟡 contrato pronto, escrita XML TODO |

## Próximos passos para tornar 100% funcional

1. Implementar `parser_docx.parse_docx_marcado()`.
2. Conectar `enriquecer_blocos` / `montar_memoriais` no `completar.py`.
3. Implementar `inserir_no_docx.gravar()` clonando `word_utils_sp2`.
4. Plugar `vlm_helper.analisar_foto()` na API Claude.
5. Smoke test: re-rodar contra Santa Adélia/Ribeirão/Guariba apagando texto.

## Integração com AutoRelatório V4

Ver `INTEGRACAO_FRONTEND_TM_AUTOMATIZANDO.md` — guia com mockup da view `/completar`, rotas REST e ordem de implementação em 4 fases.
