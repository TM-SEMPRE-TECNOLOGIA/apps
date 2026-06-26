# TM-Automatizando — Skill instalável

> Skill standalone da TM Sempre Tecnologia para completar relatórios fotográficos preventivos SP pré-finalizados.

## Instalação

### Opção 1 — User-level (recomendado)

Copie esta pasta para o diretório user-level de skills do Claude/Cowork:

**Windows:**
```powershell
xcopy /E /I "C:\Users\thiag\Desktop\TM-MEUS-APPS\Meus Plugins e Skills\tm-automatizando" "%APPDATA%\Claude\skills\tm-automatizando"
```

Ou, se o seu sistema usa `~/.claude/skills/` no estilo Unix:
```bash
cp -r "C:\Users\thiag\Desktop\TM-MEUS-APPS\Meus Plugins e Skills\tm-automatizando" ~/.claude/skills/
```

### Opção 2 — Plugin do Cowork

1. Abra o painel de Plugins do Cowork.
2. Importe a pasta `tm-automatizando` como plugin local.
3. Ative.

### Opção 3 — Workspace-only

Mantenha a pasta onde está (`Meus Plugins e Skills/tm-automatizando/`). Quando trabalhar no workspace `TM-MEUS-APPS`, a skill estará disponível.

## Dependências Python

```bash
pip install python-docx openpyxl pillow --break-system-packages
# opcional (VLM):
pip install anthropic --break-system-packages
# opcional (OCR):
pip install pytesseract --break-system-packages
```

## Como ativar a skill no Claude

Após instalada, basta dizer:

- "Use a TM-Automatizando neste relatório"
- "Completar relatório SP2 pré-finalizado"
- "Rodar TM-Automatizando em Santa Adélia.docx"
- "Preencher .docx com fotos e medidas — contrato 1565"

O Claude detecta a frase-chave e carrega a skill automaticamente.

## Como rodar via linha de comando

```bash
cd <pasta da skill>/scripts
python completar.py \
  --input  "RELATORIO XXX.docx" \
  --output "RELATORIO XXX_PREENCHIDO_PROPOSTA.docx" \
  --contrato 1565 \
  --vlm    auto \
  --preview true
```

## Verificação rápida (smoke test)

```bash
cd scripts
python persona.py
```

Deve imprimir o manifesto da TM-Automatizando com as 7 regras invioláveis.

## Estrutura

```
tm-automatizando/
├── SKILL.md                   ← define a skill (frontmatter + corpo)
├── README.md                  ← este arquivo
└── scripts/
    ├── completar.py           ← entrypoint
    ├── persona.py             ← voz oficial
    ├── parser_docx.py         ← lê .docx
    ├── gerador_texto.py       ← aplica banco
    ├── gerador_memorial.py    ← monta tabela
    ├── inserir_no_docx.py     ← grava no .docx
    ├── validator.py           ← cross-check N1..N4
    ├── vlm_helper.py          ← Claude Vision
    ├── curador.py             ← curadoria manual
    ├── preview_html.py        ← preview interativo
    ├── exportar_etapas.py     ← arquivos por etapa
    ├── banco_frases_sp2.json
    ├── itens_oficiais_master.json
    ├── itens_por_contrato.json
    └── regras_pintura.json
```

## Suporte

Documentação completa em:
`TM-MEUS-APPS/01_Golden_Apps_meu_uso/AutoRelatorio_V4/DOCUMENTOS/`

- `MAPA_RELATORIO_SP2_SANTA_ADELIA.md`
- `PLANO_EXECUCAO_RELATORIO_SP2.md`
- `COMPARATIVO_V4_vs_SP2_SANTA_ADELIA.md`
- `INTEGRACAO_FRONTEND_TM_AUTOMATIZANDO.md`
- `index_entregaveis_SP2.html`

## Versão

**v0.3.0** — 2026-05-14
