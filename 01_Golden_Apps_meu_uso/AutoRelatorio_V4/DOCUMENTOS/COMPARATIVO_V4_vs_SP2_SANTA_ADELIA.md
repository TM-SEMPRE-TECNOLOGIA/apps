# COMPARATIVO CRUZADO — Modos do AutoRelatório V4 × TM-Automatizando × 3 relatórios reais

> Atualização: cruzando agora os três relatórios (Santa Adélia, Ribeirão Preto, Guariba) com tudo que existe no V4.
> Skill responsável: **TM-Automatizando** (SP2).

---

## 1. Modos atualmente implementados no V4

Backend em `APP/backend/`:

| Modo | Arquivo gerador | Word utils | Utils auxiliares | Foco |
|---|---|---|---|---|
| **Genérico (App padrão)** | `generator.py` (200 LOC) | `word_utils.py` (539 LOC) | — | Modo histórico, scanner livre. |
| **SP1** | `generator_sp.py` (218 LOC) | `word_utils_sp.py` (323 LOC) | `utils_sp.py` (69 LOC) | Padrão mais simples, sem croquis. |
| **SP2** | `generator_sp2.py` (372 LOC) | `word_utils_sp2.py` (469 LOC) | `utils_sp2.py` (274 LOC) | Contrato 1565. **Família dos três relatórios.** |
| **TM-Automatizando** (novo, esta skill) | a integrar | reusa `word_utils_sp2` | reusa `utils_sp2` + novos módulos | Rota B: parte do **.docx pré-finalizado** em vez de pastas. |

Templates disponíveis em `APP/backend/templates/`:
- 0908 SJ Campos / 1507 Cuiabá / 1565 SJ Rio Preto e Ribeirão / 2056 Divinópolis / 2057 Varginha / 2626 Salinas / 2627 Valadares / 3575 Tangará da Serra / 6122 MS.
- **Santa Adélia (2568), Guariba (4585) e Ribeirão Estilo (4392) não têm template próprio** — derivam do 1565.

---

## 2. Cobertura do SP2 atual × Necessidades reais dos 3 relatórios

| Capacidade | SP2 v4 | SA | RIB | GU | Status |
|---|---|:---:|:---:|:---:|---|
| Detectar item por nome de pasta | ✅ | ✅ | ✅ | ✅ | ✅ Cobre |
| Parsear medidas `L × A` | ✅ | ✅ | ✅ | ✅ | ✅ Cobre |
| Faces, Desconto, Parede 1/2 | ✅ | parcial | sim | sim | ✅ Cobre |
| Croquis (`CROQUI XX`) | ✅ | – | – | ✅ usa | ✅ Cobre GU |
| Item 17.6 (premium fosca) | ✅ no dicionário | ✅ usa | – | – | ✅ Cobre SA |
| **Item 17.11 (premium acetinada)** | 🔴 não vejo no dicionário atual | – | ✅ usa | ✅ usa | 🔴 **Gap em RIB+GU** |
| Item 17.9 (automotiva) | 🟡 conferir | ✅ | – | ✅ | 🟡 Verificar |
| Item 17.7 (esmalte madeira) | 🟡 conferir | – | – | ✅ | 🟡 Verificar |
| Item 17.8 (resina piso) | 🟡 conferir | ✅ | – | ✅ | 🟡 Verificar |
| Item 8.7 (PU calha) | 🟡 conferir | ✅ | – | – | 🟡 Verificar |
| **Item 8.3 (manta asfáltica)** | 🔴 não vejo | – | – | ✅ | 🔴 Gap GU |
| **Item 8.6 (argamassa polimérica)** | 🔴 não vejo | – | – | ✅ | 🔴 Gap GU |
| Item 19.18 / 19.80 (luminária LED) | 🟡 conferir | ✅ | – | – | 🟡 Verificar |
| **Item 19.36 / 19.37 (lâmpada tubular)** | 🔴 não vejo | – | ✅ | ✅ | 🔴 Gap |
| Item 29.6 (piso tátil) | ✅ | ✅ | – | – | ✅ |
| **Item 29.12 (fita antiderrapante)** | 🔴 | – | – | ✅ | 🔴 Gap GU |
| **Item 29.14 (sinalização externa)** | 🔴 | – | – | ✅ | 🔴 Gap GU |
| **Item 29.22 (ajuste biombo)** | 🔴 | – | – | ✅ | 🔴 Gap GU |
| **Item 29.24 (remoção adesivos)** | 🔴 | – | – | ✅ | 🔴 Gap GU |
| **Item 29.25 (reparo carenagens)** | 🔴 | – | – | ✅ | 🔴 Gap GU |
| **Item 13.16 (persiana enrolar)** | 🔴 | – | – | ✅ | 🔴 Gap GU |
| **Item 13.20 (ajuste portas)** | 🔴 | – | – | ✅ | 🔴 Gap GU |
| **Item 14.9 (chapa inox)** | 🔴 | – | – | ✅ | 🔴 Gap GU |
| **Item 15.3 (ferragem)** | 🔴 | – | – | ✅ | 🔴 Gap GU |
| **Item 15.7 (mola hidráulica)** | 🔴 | – | – | ✅ | 🔴 Gap GU |
| Item 15.13 (fechadura porta vidro) | 🟡 | ✅ | – | – | 🟡 Verificar |
| **Item 16.16 (persiana vertical)** | 🔴 | – | ✅ | – | 🔴 Gap RIB |
| **Item 21.x (recargas extintor)** | 🔴 (5 sub-códigos) | – | – | ✅ | 🔴 Gap GU |
| Geração de NARRATIVAS | 🟡 banco mínimo | – | – | – | 🔴 **Gap principal** |
| Geração de DETALHES curtos | 🔴 | – | – | – | 🔴 Gap |
| Padrão "Prezados," (Ribeirão/Guariba) | 🔴 não detecta | – | ✅ | ✅ | 🔴 Gap editorial |
| Rota B (DOCX pré-finalizado) | 🔴 não existe | – | – | – | 🔴 **Maior gap** |
| Cabeçalho dinâmico | 🟡 vem do template | – | – | – | 🟡 Manual |
| Análise visual real (VLM) | 🔴 | – | – | – | 🔴 **Decidido: implementar** |
| Cross-check 4 níveis | 🔴 | – | – | – | 🔴 **Decidido: implementar** |
| Curadoria de banco | 🔴 | – | – | – | 🔴 **Decidido: implementar** |

**Total de itens do contrato que precisam ENTRAR no `ITENS_CONTRATO_SP2`**: **24 novos** (descobertos cruzando os 3 relatórios).

---

## 3. O que o V4 vence × O que precisa evoluir

### Pontos fortes do V4 (manter)
- **Pipeline pastas → DOCX**: completo, com cálculo de áreas, faces, descontos.
- **Estrutura hierárquica** robusta: parser respeita `1 / 2.x / 3.x`.
- **Tabela de memória**: formatação visual (cores, larguras de coluna) pronta.
- **Croquis**: detecção + legenda automática (já usado em Guariba).
- **Quebras de página**: `quebra_pagina` no `conteudo`.

### Gaps identificados (cruzando 3 relatórios)
1. **Banco textual minúsculo.** Existem ~50 frases ricas distribuídas nos três; o `utils_sp2.formatar_descricao_narrativa` cobre talvez 3. Solução: externalizar para JSON crescente (curadoria).
2. **Detalhes curtos não têm gerador.** A função `formatar_descricao_detalhe(codigo, ambiente)` não existe. Solução: criar e popular com 25+ variações.
3. **Sem rota DOCX → DOCX preenchido.** O V4 só vai de "pastas → DOCX". Cenário real do usuário (relatório que volta do campo pré-marcado) não tem solução. Solução: **TM-Automatizando**.
4. **Cabeçalho hard-coded no template.** Solução: parametrizar via placeholders + skill que reescreve.
5. **Catálogo de itens incompleto.** Faltam 24 códigos (lista §2 desta seção). Solução: ampliar `ITENS_CONTRATO_SP2` com os 47 códigos do MAPA §6.
6. **Não distingue padrão editorial "Prezados,".** SA usa um, RIB/GU outro. Skill precisa detectar e replicar.
7. **Sem análise visual.** Decidido: implementar VLM híbrido.
8. **Sem cross-check.** Decidido: implementar 4 níveis.
9. **Banco não cresce.** Decidido: curadoria manual com aprovação por item.

---

## 4. Decisão técnica (após cruzamento dos 3)

| Decisão | Justificativa |
|---|---|
| **Manter** `generator_sp2.py` para Rota A | Cobre 100% da estrutura de pastas. |
| **Ampliar** `ITENS_CONTRATO_SP2` para 47 códigos | Cobrir SA + RIB + GU; depois novos. |
| **Externalizar** banco em `banco_frases_sp2.json` | Já existe esqueleto; expandir com frases de RIB e GU. |
| **Criar** `formatar_descricao_detalhe()` | Função pública no `utils_sp2`. |
| **Criar** TM-Automatizando para Rota B | Skill com `parser_docx`, `gerador_texto`, `gerador_memorial`, `validator`, `vlm_helper`, `curador`. |
| **Detectar padrão editorial** automaticamente | Lê primeira narrativa do .docx, vê se começa com "Prezados,". |
| **Integrar VLM** via Claude Vision API ou similar | Híbrido: só quando código não é óbvio. |
| **Não criar SP3** ainda | Os três cabem em SP2. |

---

## 5. Matriz "antes × depois" (concreta)

| Cenário | Hoje no V4 | Com TM-Automatizando |
|---|---|---|
| Fotos em pastas | SP2 gera, frases pobres | SP2 gera + skill enriquece com banco rico |
| .docx pré-finalizado | Refazer tudo manualmente | TM-Automatizando preenche em segundos |
| Santa Adélia (2568) | 1565 + revisão pesada | 1565 + skill + banco SA — quase final |
| Ribeirão (4392) | 1565 + revisão pesada | 1565 + skill detecta padrão "Prezados," + 17.11 |
| Guariba (4585) | 1565 + revisão MUITO pesada | 1565 + skill + croquis + 24 códigos novos |
| Próxima unidade SP2 nova | Idem trabalho manual | Skill aprende com as 3 anteriores |

---

## 6. KPIs sugeridos (mensuráveis depois do piloto)

- **% de frases prontas (sem edição)** — meta ≥ 85% após 5 relatórios processados.
- **Tempo médio para finalizar um relatório** — meta < 15 min (hoje ~1h por relatório).
- **% de itens cobertos no dicionário** — meta 100% dos vistos nos relatórios já entregues.
- **Defeitos por relatório (memorial com erro, foto sem legenda, código incoerente)** — meta 0 após cross-check.
- **% de frases que viram banco após curadoria** — sem meta, mas acompanhar.
- **Custo médio de VLM por relatório** — manter < US$ 0.50 com a abordagem híbrida.

---

## 7. Itens de ação (curto prazo)

1. [x] Mapear 3 relatórios e consolidar banco. → **feito** no `MAPA_RELATORIO_SP2_SANTA_ADELIA.md`.
2. [ ] Ampliar `ITENS_CONTRATO_SP2` em `utils_sp2.py` para os 47 códigos do MAPA §6.
3. [ ] Externalizar narrativas/detalhes em `banco_frases_sp2.json` (já tem v0.2, expandir).
4. [ ] Implementar `parser_docx.py` da skill.
5. [ ] Implementar `gerador_texto.py` com detecção de padrão editorial.
6. [ ] Implementar `gerador_memorial.py` com clonagem de estilo.
7. [ ] Implementar `validator.py` com os 4 níveis de cross-check.
8. [ ] Implementar `vlm_helper.py` (Claude Vision API).
9. [ ] Implementar `curador.py` (proposta de novas frases).
10. [ ] Expor opção "TM-Automatizando" no `OrganizarView.tsx` (ver `INTEGRACAO_FRONTEND_TM_AUTOMATIZANDO.md`).
11. [ ] Smoke test: re-rodar Guariba apagando texto.
