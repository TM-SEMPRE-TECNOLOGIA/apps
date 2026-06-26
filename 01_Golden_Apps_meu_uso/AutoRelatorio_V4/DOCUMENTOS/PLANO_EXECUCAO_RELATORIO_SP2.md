# PLANO DE EXECUÇÃO — TM-Automatizando (Skill SP2)

> Base: triangulação Santa Adélia (2568) × Ribeirão Preto (4392) × Guariba (4585).
> Princípio: **nenhum texto genérico.** Toda frase vem de relatório aprovado.
> Pré-condição: `.docx` "pré-finalizado" = fotos inseridas + marcações `Foto N` + medidas escritas a punho. Sem texto narrativo.

---

## 0. Voz da TM-Automatizando

> "Eu não escrevo. Eu reconheço. Quando não reconheço, eu pergunto."

A skill nunca usa primeira pessoa do plural genérica. Quando precisa interagir, o tom é técnico, frase curta, sem jargão de marketing. Exemplos do estilo TM-Automatizando:

- ✅ "Foto 14 ambígua: parede com 17.6 ou 17.11? Histórico desta unidade aponta 17.11."
- ✅ "Memorial do bloco 2.4 com soma divergente: 25,20 m² declarado, 24,80 m² calculado."
- ❌ "Olá! Encontrei algumas coisinhas..."
- ❌ "Vou fazer o meu melhor..."

---

## 1. Visão geral do fluxo

```
.docx pré-finalizado ───┐
                        │
                        ▼
           ┌─────────────────────────────┐
           │   ETAPA A — PARSING         │
           │   • python-docx             │
           │   • mapeia Foto N → posição │
           │   • extrai medidas (L × A)  │
           │   • lê código (Item X.Y)    │
           │   • detecta seções          │
           └────────────┬────────────────┘
                        │
                        ▼
           ┌─────────────────────────────┐
           │   ETAPA B — ANÁLISE VISUAL  │
           │   • heurística (rápida)     │
           │   • VLM (Claude Vision)     │
           │     só nos ambíguos         │
           └────────────┬────────────────┘
                        │
                        ▼
           ┌─────────────────────────────┐
           │   ETAPA C — GERAÇÃO         │
           │   • banco_frases_sp2.json   │
           │   • itens_contrato.json     │
           │   • aplica padrão da unidade│
           │     ("Prezados," ou não)    │
           │   • respeita 17.6 vs 17.11  │
           └────────────┬────────────────┘
                        │
                        ▼
           ┌─────────────────────────────┐
           │   ETAPA D — FIDELIDADE      │
           │   • clona estilo do vizinho │
           │   • clona 1ª tabela do doc  │
           └────────────┬────────────────┘
                        │
                        ▼
           ┌─────────────────────────────┐
           │   ETAPA E — CROSS-CHECK     │
           │   • aritmética + coerência  │
           │   • sequência + cabeçalho   │
           │   • formatação              │
           │   • órfãs + duplicatas      │
           └────────────┬────────────────┘
                        │
                        ▼
           ┌─────────────────────────────┐
           │   ETAPA F — REVISÃO + DOC   │
           │   • _PREENCHIDO_PROPOSTA.docx│
           │   • crosscheck_report.md    │
           │   • proposta_novas_frases.md│
           └────────────┬────────────────┘
                        │
                        ▼
              VOCÊ APROVA / AJUSTA
                        │
                        ▼
            Banco cresce com sua aprovação
```

---

## 2. ROTA A — A partir de pastas (gerador SP2 atual)

Ainda válida; é o caminho original do `generator_sp2.py`.

### Passos
1. Organizar fotos conforme estrutura de pastas (ver MAPA §7 da versão anterior).
2. Renomear arquivos: `NN - L,LL x A,AA [- Faces N] [- Desconto X,XXm²].jpg`.
3. Rodar:
   ```bash
   cd APP/backend
   python -c "from generator_sp2 import run_all_sp2; run_all_sp2('<pasta>', 'templates/MODELO - 1565 - ....docx', '<saida>')"
   ```
4. Revisar saída — a TM-Automatizando **não** roda nesta rota; ela é só Rota B.

### Quando usar
- Levantamento totalmente novo, fotos vieram do drone/celular sem .docx prévio.

---

## 3. ROTA B — A partir de DOCX pré-finalizado (TM-Automatizando)

### Entrada
Um `.docx` que tem:
- Fotos embutidas em ordem.
- Marcações `Foto 1, Foto 2, ...` escritas a punho.
- Medidas escritas a punho próximo às fotos (`28,00 x 0,90`).
- Opcionalmente: codigo do item escrito a punho (`(Item 17.4)`).

### Saída
- `<nome>_PREENCHIDO_PROPOSTA.docx` — com todo o texto, detalhes e memorial.
- `crosscheck_report.md` — com ✅/⚠/❌ para cada validação.
- `proposta_novas_frases.md` — frases que sairiam novas para o banco (você aprova).
- `formatacao_log.txt` — parágrafos onde a clonagem de estilo destoou.

### Comando
```bash
tm-automatizando \
  --input  "RELATORIO XXX.docx" \
  --output "RELATORIO XXX_PREENCHIDO_PROPOSTA.docx" \
  --modo   sp2 \
  --vlm    auto        # auto | sempre | nunca
```

---

## 4. Cross-check em detalhe (correção cruzada de TUDO)

### 4.1. Aritmética
Para cada tabela de memória, a TM-Automatizando faz:
```python
for linha in tabela:
    esperado = linha.largura * linha.altura * linha.faces - linha.desconto
    if abs(esperado - linha.total) > 0.01:
        registrar("⚠ Linha {ref}: {esperado:.2f} ≠ {declarado:.2f}")
soma = sum(l.total for l in tabela)
if abs(soma - tabela.total_geral) > 0.01:
    registrar("❌ Soma diverge no bloco {bloco}")
```

### 4.2. Coerência foto↔código↔frase
- A frase escolhida contém `(Item X.Y)`?
- O `X.Y` da frase == `X.Y` da tabela?
- O `X.Y` está no `itens_contrato.json`?
- A descrição da tabela == descrição do `itens_contrato.json`?

Se qualquer um desses falha, a TM-Automatizando para e marca como ⚠.

### 4.3. Sequência de fotos
- Lista todos os `Foto N` no doc → checa que é `[1, 2, ..., max]` sem repetições.
- Compara `Foto N` declarados vs imagens embutidas no `.docx`.

### 4.4. Cabeçalho vs corpo
- Endereço do cabeçalho == endereço da capa (Foto 1)?
- Agência do cabeçalho == agência da capa?
- Responsável técnico aparece nas duas?

### 4.5. Formatação
- Para cada parágrafo gerado: lê `rPr` do vizinho, compara contra Calibri 10pt esperado.
- Para cada tabela gerada: clona a primeira tabela existente.

### 4.6. Órfãs e duplicatas
- Imagem sem legenda `Foto N` → loga.
- `Foto N` sem imagem → loga.
- Duas fotos com texto literalmente idêntico (sem ser detalhe-padrão) → alerta.

---

## 5. Análise visual real — quando o VLM entra

| Cenário | Ação |
|---|---|
| Foto com `(Item X.Y)` escrito a punho | Pula VLM. Usa o código. |
| Foto sem código mas texto adjacente cita item | Pula VLM. Usa o código adjacente. |
| Foto sem código e sem contexto | **Chama VLM** com prompt: "Identifique o problema na foto: ferrugem, mancha, infiltração, desgaste, ausência de equipamento, ou outro. Sugira o código do contrato SP2 mais provável." |
| VLM responde com confiança < 80% | Marca como ⚠ "revisar" e propõe baseado no histórico da unidade. |

### Limitações honestas (vou repetir, é importante)

1. **17.6 vs 17.11** — distinção visual é praticamente impossível em fotos sem laudo de produto. Heurística: usa o histórico da unidade (Santa Adélia → 17.6; Ribeirão/Guariba → 17.11).
2. **Quantidade exata em fotos** — VLM pode contar mal lâmpadas em uma luminária. Se a quantidade não vier escrita no .docx, marca ⚠.
3. **Cor de mancha** — VLM pode confundir mancha de mofo com sujeira pigmentada. Não muda o código (ambos caem em 17.6/17.11), mas pode mudar a frase ("infiltração" vs "sujeira").
4. **Fotos muito escuras / desfocadas** — VLM falha completamente. Marca ⚠ e pede revisão.

### Taxa de erro projetada (TM-Automatizando rodando híbrido)

| Tipo de relatório | Esperado de "frases prontas para uso sem revisão" |
|---|---|
| Unidade já com histórico no banco (Santa Adélia/Ribeirão/Guariba) | **92–96%** |
| Unidade nova mas mesma família SP2 | **80–88%** |
| Unidade SP2 com itens novos não vistos | **65–75%** |

Esses números são **estimativas honestas**, baseadas em similaridade textual + heurística + VLM em ambíguos. Vão melhorar conforme o banco crescer (curadoria manual).

---

## 6. Checklist operacional (para cada novo relatório)

- [ ] 1. Receber `.docx` pré-finalizado.
- [ ] 2. Conferir que tem ≥1 foto por bloco.
- [ ] 3. Identificar a agência (nº + cidade) → ajustar cabeçalho.
- [ ] 4. Conferir se o `.docx` segue o padrão "Prezados,..." (Ribeirão/Guariba) ou Santa Adélia (sem Prezados). Anotar.
- [ ] 5. Conferir se as marcações de Foto seguem `Foto 1, Foto 2, ...` em ordem.
- [ ] 6. Rodar `tm-automatizando --input <arquivo> --output <saida>`.
- [ ] 7. Abrir `crosscheck_report.md`:
  - [ ] Todas as somas conferem?
  - [ ] Foto↔código↔frase coerente?
  - [ ] Sequência sem gaps?
  - [ ] Cabeçalho bate com capa?
  - [ ] Formatação preservada?
  - [ ] Sem órfãs nem duplicatas?
- [ ] 8. Abrir `_PREENCHIDO_PROPOSTA.docx` e revisar visualmente.
- [ ] 9. Abrir `proposta_novas_frases.md`:
  - [ ] Aprovar, ajustar ou rejeitar cada frase nova.
- [ ] 10. Salvar versão final + commitar banco atualizado.

---

## 7. Definition of Done (DoD)

Um relatório está "pronto" quando:

1. ✅ Cross-check report com **zero ❌** e **zero ⚠ não resolvidos**.
2. ✅ Cabeçalho com 4 campos corretos.
3. ✅ Foto 1 = capa no padrão `Foto 1 – AGÊNCIA NNN – ...`.
4. ✅ Cada bloco tem narrativa + (0..N detalhes) + tabela de memória.
5. ✅ Todo código de item referenciado existe no `itens_contrato.json`.
6. ✅ Nenhum `{placeholder}` sobrou.
7. ✅ Nenhum `Foto N` órfão.
8. ✅ Estilo (fonte, tamanho, negrito) idêntico ao do template.
9. ✅ Estilo editorial coerente (todo o doc usa "Prezados,..." OU nenhum bloco usa).

---

## 8. Riscos conhecidos / pontos de atenção

| Risco | Mitigação |
|---|---|
| Frase do banco vira "genérica" depois de muitos relatórios | Curadoria manual: você só aprova frases que realmente coubessem em outro contexto. |
| VLM erra distinção 17.6/17.11 | Skill nunca decide sozinha — usa histórico da unidade + marca ⚠ se for caso novo. |
| Medidas escritas a punho com erro de vírgula/ponto | Parser tolera; se nada bater, marca `tem_medidas=False` e loga. |
| Foto sem detalhe adjacente | Aceita; tabela é montada com 1 linha. |
| Múltiplos itens encadeados (Guariba) | Suportado: o bloco aceita lista `[17.11, 17.2, 13.12, 8.6]`. |
| Estilo editorial misturado | Cross-check detecta e exige que todo o doc use o mesmo padrão. |
| Item do contrato não está no banco | Skill para e pede confirmação ANTES de gerar. |

---

## 9. Limitações que não são contornáveis (e o que fazer)

| Limitação | Solução de contorno |
|---|---|
| Skill **não substitui** revisão humana | DoD exige sua aprovação no `proposta_novas_frases.md` antes do banco crescer. |
| VLM **não distingue** material de pintura por foto | Skill usa histórico da unidade + alerta ⚠ no relatório. |
| Quantidades **escondidas** em fotos (lâmpadas dentro de luminária fechada) | Skill pede ao usuário no `crosscheck_report.md`. |
| `.docx` **muito grande** (>500 fotos) | Processamento em lote: skill divide em chunks de 100 fotos. |
| Imagem **arrastada** em formato proprietário (ex.: HEIC com link externo) | Skill converte para PNG via `pillow` antes; se falhar, loga e pula a foto. |

---

## 10. Próximos passos sugeridos

1. Validar este plano com 1 .docx-piloto real (re-rodar contra Guariba apagando o texto).
2. Implementar os TODOs dos módulos da skill (`parser_docx.py`, `gerador_texto.py`, `gerador_memorial.py`, `inserir_no_docx.py`, `validator.py`, `vlm_helper.py`, `curador.py`).
3. Integrar a skill ao AutoRelatório V4 (ver `INTEGRACAO_FRONTEND_TM_AUTOMATIZANDO.md`).
4. Medir KPIs: % frases prontas, tempo médio por relatório, defeitos por relatório.
5. A cada 5 relatórios aprovados, fazer review do banco com você.
