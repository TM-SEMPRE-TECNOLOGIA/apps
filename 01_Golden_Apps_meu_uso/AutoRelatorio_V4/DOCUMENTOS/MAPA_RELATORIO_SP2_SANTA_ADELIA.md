# MAPA DO RELATÓRIO SP2 — Triangulação Santa Adélia × Ribeirão Preto × Guariba

> Skill responsável: **TM-Automatizando** (modo SP2)
> Arquivos-fonte: três relatórios reais já entregues (família contrato 1565)
> Data do mapeamento: 2026-05-14
> Princípio editorial: **nenhuma frase é genérica.** Tudo o que entra no relatório vem do banco de referência alimentado pelos relatórios já aprovados.

---

## 0. Quem é a TM-Automatizando?

> "Não invento texto. Eu observo. Cada palavra que entrego veio antes da sua caneta."
>
> — *TM-Automatizando, voz da skill*

**Personalidade**: técnica, sóbria, paciente. Não improvisa. Se não tem certeza, pergunta. Se a foto está ambígua, chama reforço visual (VLM). Se uma frase nova precisar ser usada, propõe — mas **não grava** no banco sem sua aprovação por item. Fala em português brasileiro técnico, sem coloquialismos, sem cumprimentos.

**Padrão editorial OFICIAL: Santa Adélia.** Significa: as narrativas começam direto em "Durante o levantamento..." ou "Constatamos que..." — **NUNCA com "Prezados,"**, mesmo que o .docx de entrada use Prezados (a skill normaliza ao escrever).

**Padrão de numeração de seções**: o que estiver no .docx de entrada — pode ser Santa Adélia (`2.1 –`), Ribeirão (`1.1 –`) ou Guariba (`2.4-`). A skill respeita o de entrada e mantém consistência interna.

---

## 1. Os três relatórios em números (visão executiva)

| Métrica | Santa Adélia (2568) | Ribeirão Preto (4392) | Guariba (4585) |
|---|---:|---:|---:|
| Parágrafos | 3.037 | 1.664 | 3.495 |
| Imagens embutidas | 192 | 202 | 288 |
| Fotos com legenda `Foto N` | 199 | 197 | 294 |
| Códigos de contrato distintos | 20 | 9 | 52 |
| Narrativas únicas | 24 | 4 | 37 |
| Detalhes únicos | 13 | 12 | 25 |
| Fonte predominante | Calibri | Calibri | Calibri |
| Tamanho predominante (half-points) | 20 (=10pt), 18 (=9pt) | 20 (=10pt) | 20 (=10pt) |
| Runs em negrito | 1.568 | 1.675 | 2.832 |
| Numeração de seções | `2.1 – Texto` | `1.1 – Texto` | `2.4- Texto` |
| Abertura editorial | "Durante o levantamento..." | "Prezados, durante..." | "Prezados, durante..." |

### Observação editorial crítica
- **Padrão oficial = Santa Adélia** (sem "Prezados,").
- Ribeirão e Guariba usaram "Prezados," por estilo individual do redator — **NÃO é o padrão da TM-Automatizando**.
- A skill **normaliza** qualquer abertura "Prezados," removendo o vocativo e ajustando a frase.
- Mensagens novas geradas pela skill **NUNCA** começam com "Prezados,".

---

## 2. Cabeçalho fixo (capa / dados da dependência)

O cabeçalho é IDÊNTICO nos três, com 4 campos + capa + descrição:

| Campo | Santa Adélia | Ribeirão | Guariba | Placeholder |
|---|---|---|---|---|
| Endereço | PCA.DR. ADHEMAR DE BARROS,175 | AV. PRES.VARGAS,1720 | R. NOVE DE JULHO 349/357 | `{{ENDERECO}}` |
| Responsável da Dependência | F2268209 - SISTEMA | F2268209 - SISTEMA | F2268209 - SISTEMA | `{{RESP_DEPENDENCIA}}` |
| Responsável Técnico | LAURA | Laura | Laura | `{{RESP_TECNICO}}` |
| Responsável Técnico/Empresa | Ygor Augusto Fernandes Ferrugem – CREA: 1017279403/D-GO | idem | idem | `{{RESP_EMPRESA_CREA}}` |
| Capa | `Foto 1 – AGÊNCIA 2568 – PCA. Dr Adhemar de Barros,175 – SANTA ADELIA - SP` | `Foto 1 – AGÊNCIA 4392/00 – Av. Presidente. Vargas, 1720 – Estilo Ribeirão Preto - SP` | `Foto 1 – AGÊNCIA 4585-00 – Rua nove de julho 349/357 – Guariba - SP` | `Foto 1 – AGÊNCIA {NUM} – {END} – {CIDADE} - {UF}` |

**Observação**: o número da agência aparece com **três sufixos distintos** (`2568`, `4392/00`, `4585-00`). A skill aceita qualquer um.

---

## 3. Estrutura hierárquica — comparativo das três

| Santa Adélia | Ribeirão | Guariba |
|---|---|---|
| 1 – Área Externa | 1 – Área interna | 1 – Área Externa |
| 2 – Área Interna | 1.1 – Sala de atendimento | 2 – Área Interna |
| 2.1 – SAA Sala de Autoatendimento | 1.2 – Corredor acesso banheiros | 2.1 – SAA Sala de Autoatendimento |
| 2.2 – Sala de atendimento | 1.3 – Sala gerencia | 2.2 – Sala atendimento |
| 2.3 – Corredor 01 | 2 – Subsolo | 2.4- Corredor de abastecimentos |
| 2.4 – Sala Gerência | | 2.5- Sala Cofre |
| 2.5 – Sala de Suporte | | 2.6- Tesouraria |
| 2.6 – Corredor de abastecimento | | 2.7- Sala de Reunião |
| 2.7 – Corredor 02 | | 2.9- Sala Online |
| 2.8 – Sala Online | | 2.11- Sala Deposito 02 |
| 2.9 – Quadros | | 2.12- Sala Vigilante |
| 3 – Telhado | | 2.13- Corredor |
| 3.1 – Vedação em Calhas | | 2.16- Almoxarifado |
| 3.2 – Infiltrações interna | | 2.17- Banheiro Masculino Funcionários |
| | | 2.20- Banheiro Masculino Cliente |
| | | 3.1- Calhas |

**Regex unificado**: `^(\d+(\.\d+)?)\s*[–\-]\s*(.+)` — aceita en-dash, hífen, com ou sem espaço.

---

## 4. Banco unificado de NARRATIVAS (extraído dos 3 relatórios)

Cada frase abaixo é **literal**, copiada dos relatórios aprovados. Nenhuma palavra foi inventada. Esta é a fonte de verdade da TM-Automatizando.

### 4.1. Área externa — paredes/muretas (acrílica)

| Origem | Frase |
|---|---|
| SantaAd | "Durante o levantamento na área externa, constatamos a presença de manchas de sujeira nas paredes, comprometendo a estética do ambiente. Será necessário a aplicação de pintura acrílica para restaurar a aparência do ambiente. (Item 17.4 do contrato)" |
| SantaAd | "Durante o levantamento na área externa, constatamos a presença de manchas de sujeira na mureta amarela... (Item 17.4 do contrato)" |
| SantaAd | "Durante o levantamento na área externa, constatamos a presença de manchas de sujeira na mureta da calçada... (Item 17.4 do contrato)" |
| Guariba | "Prezados, durante o levantamento na área externa, constatamos a presença de manchas de sujeira nas paredes, comprometendo a estética do ambiente. Será necessário a aplicação de pintura acrílica em algumas áreas externas para restaurar a aparência. (Item 17.4 do contrato)" |

### 4.2. Fachada / pórtico (automotiva)

| Origem | Frase |
|---|---|
| SantaAd | "Durante o levantamento constatamos que a fachada se encontra com sinais de desgaste e manchas de sujeiras... Será necessário a aplicação de pintura automotiva. (Item 17.9 do contrato)" |
| Guariba | "Prezados, a fachada se encontra com sinais de desgaste e manchas de sujeiras, afetando diretamente a estética do ambiente e a durabilidade da superfície. Será necessário a pintura automotiva para restaurar a estética. (Item 17.9 do contrato)" |
| Guariba | "Prezados, o pórtico da fachada se encontra com sinais de desgaste, oxidações e manchas de sujeiras... Será necessário a pintura automotiva. (Item 17.9 do contrato)" |
| Guariba | "Prezados, durante o levantamento constatamos que o policarbonato e a película do pórtico se encontram com manchas de sujeiras e sinais de desgastes... (Item 29.14 do contrato)" |

### 4.3. Metálicas (portão, escada, grade, corrimão)

| Origem | Frase |
|---|---|
| SantaAd | "Durante o levantamento constatamos que a pintura do portal lateral da área externa se encontra danificado, com ferrugem e desgaste... Será necessário a aplicação de pintura esmalte metálica. (Item 17.1 do contrato)" |
| SantaAd | "Durante o levantamento constatamos que a pintura da escada lateral da área externa se encontra danificado... (Item 17.1 do contrato)" |
| SantaAd | "A grade lateral das janelas se encontra danificado, com ferrugem e desgaste, será necessário a aplicação de pintura esmalte metálica (Item 17.1 do contrato)" |
| Guariba | "Prezados, durante o levantamento constatamos que a pintura dos corrimões e das grades da SAA se encontra danificado, com ferrugem e desgaste... (Item 17.1 do contrato)" |

### 4.4. Piso (resina + tátil + antiderrapante)

| Origem | Frase |
|---|---|
| SantaAd | "Devido ao desgaste e o desbotamento da pintura. Será necessário a pintura de resina em piso. (Item 17.8 do contrato)" |
| Guariba | "Prezados, durante o levantamento, verificamos a necessidade de manutenção nos pisos da área externa, devido ao desgaste e desbotamento da pintura, o que compromete a visibilidade e a segurança dos pedestres. (Item 17.8 do contrato)" |
| Guariba | "Croqui com as dimensões da calçada (18,00m x 2,30m) que será necessário a pintura de resina em piso. (Item 17.8)" |
| SantaAd/Guariba | "Durante o levantamento, verificamos a manutenção/instalação de {qtd}un de piso tátil que se encontra arrancado no local de entrada da SAA... (Itens 2.12 e 29.6 do contrato)" |
| Guariba | "Prezados, durante o levantamento constatamos que {qtd}un de fita antiderrapante da rampa de 1,00m, que se encontra com desgastes/soltas. Será necessário a substituição... (Itens 29.12 e 29.24 do contrato)" |

### 4.5. Pintura interna acrílica

| Origem | Frase | Item |
|---|---|---|
| SantaAd | "Durante o levantamento na SAA sala de autoatendimento, constatamos manchas de sujeiras nas paredes, comprometendo a estética do ambiente, sendo necessário a aplicação de pintura acrílica para restaurar a aparência do ambiente. (Item 17.6 do contrato)" | 17.6 |
| SantaAd | "Durante o levantamento, constatamos a presença de manchas de sujeira nas paredes... (Item 17.6 do contrato)" | 17.6 |
| Ribeirão | "Prezados, durante o levantamento no corredor acesso aos banheiros, constatamos a presença de manchas de sujeira nas paredes... Será necessário a aplicação de pintura acrílica para restaurar a aparência do ambiente. (Item 17.11 do contrato)" | **17.11** |
| Ribeirão | "Prezados, durante o levantamento constatamos a presença de manchas de sujeira nas paredes. Sendo assim necessário a pintura acrílica, para restaurar a aparência e garantir a conservação das superfícies. (Item 17.11 do contrato)" | **17.11** |
| Guariba | "Prezados, constatamos a presença de manchas de sujeiras na parede, sendo assim necessário a aplicação de pintura acrílica no ambiente. Informamos a impossibilidade de remanejamento ou retirada do cofre. (Item 17.11 do contrato)" | **17.11** |
| Guariba | "Prezados, durante o levantamento na sala de atendimento, constatamos a presença de manchas de sujeira nas paredes e infiltrações, comprometendo a estética do ambiente. Será necessário a aplicação de pintura acrílica. (Itens 17.11, 17.2, 13.12 e 8.6 do contrato)" | 17.11+17.2+13.12+8.6 |

> 🔍 **Diferença sutil mas crítica**: Santa Adélia usa **17.6 (premium fosca)**, Ribeirão e Guariba usam **17.11 (premium acetinada)**. A TM-Automatizando precisa olhar o relatório de entrada e detectar qual sub-código é o padrão daquela unidade — **nunca trocar 17.6↔17.11 por engano**.

### 4.6. Forro, gesso, teto

| Origem | Frase | Itens |
|---|---|---|
| SantaAd | "Durante o levantamento foi constatado que o forro de fibra mineral se encontra com manchas de sujeiras e pontos com umidade. Será necessário a substituição de {qtd}Un de placas do forro. (Itens 12.10 e 2.18 do contrato)" | 12.10 + 2.18 |
| Guariba | "Prezados, durante o levantamento foi constatado que o forro de fibra mineral se encontra desgastado e com manchas de sujeiras. Será necessário a substituição de placas de forro. Informamos que não há danos estruturais. (Itens 12.10 e 2.18 do contrato)" | 12.10 + 2.18 |
| SantaAd | "Durante o levantamento constatamos que será necessário a substituição do gesso acartonado, a pintura acrílica e seu emassamento. (Itens 17.6 e 17.2 do contrato)" | 17.6 + 17.2 |
| Guariba | "Prezados, durante o levantamento constatamos manchas de sujeiras no teto. Será necessário a aplicação de pintura acrílica e emassamento no teto para restaurar a aparência do ambiente. (Itens 17.11 e 17.2 do contrato)" | 17.11 + 17.2 |

### 4.7. Elétrica (luminária, ponto)

| Origem | Frase | Item |
|---|---|---|
| SantaAd | "Durante o levantamento constatamos que será necessário a substituição de {qtd}Un de luminária em LED, para restaurar a estética do ambiente. (Item 19.80 do contrato)" | 19.80 |
| SantaAd | "Durante o levantamento constatamos que {qtd}un luminária está com a luminosidade baixa/fraca. (Item 19.80 do contrato)" | 19.80 |
| SantaAd | "Durante o levantamento constatamos que será necessário a substituição de {qtd}Un de luminária em LED. (Item 19.18 do contrato)" | 19.18 |
| Ribeirão | "Prezados, durante o levantamento constatamos que será necessário a substituição de {qtd}un de lâmpadas tubular em LED na sala de atendimento, para restaurar a estética do ambiente. (Item 19.36 do contrato)" | **19.36** |
| SantaAd | "Será necessario a manutenção de {qtd}un dos pontos eletricos. (Item 19.1 do contrato)" | 19.1 |
| SantaAd | "Será necessário a manutenção de {qtd}un dos pontos lógicos. (Item 19.8 do contrato)" | 19.8 |

### 4.8. Portas, fechaduras, ferragens

| Origem | Frase |
|---|---|
| SantaAd | "Durante o levantamento constatamos que será necessário a substituição da fechadura da porta de vidro, pois a mesma não está trancando. (Item 15.13 do contrato)" |
| Guariba | "Prezados, durante o levantamento constatamos que a porta lateral da PGDM apresenta desalinhamento e interferência com o piso. Será necessário a retirada da porta para execução e manutenção, instalação de mola, ajustes e regulagens. (Itens 2.17, 15.7, 13.20 e 10.1 do contrato)" |

### 4.9. Persianas (Ribeirão + Guariba)

| Origem | Frase |
|---|---|
| Ribeirão | "Prezados, durante o levantamento... necessidade da instalação de persianas de tecidos para controle de luminosidade e adequação do ambiente de trabalho. (Item 16.16 do contrato)" |
| Guariba | "Prezados, durante o levantamento constatamos que houve um desalinhamento das persianas dos caixas eletrônicos. Será necessário o alinhamento adequado delas. (Item 13.16 do contrato)" |

### 4.10. Carenagens, biombos, adesivos (Guariba)

| Origem | Frase |
|---|---|
| Guariba | "Prezados, durante o levantamento constatamos o desalinhamento das carenagens dos caixas eletrônicos, sendo necessário realizar o ajuste e reparos para o correto alinhamento e fixação. (Itens 29.22 e 29.25 do contrato)" |
| Guariba | "Prezados, durante o levantamento constatamos que as fitas adesivas High-tech encontram desgastadas e desgrudada dos vidros das portas. Será necessário a substituição {qtd}un de 1,20m cada. (Itens 29.2 e 29.24 do contrato)" |

### 4.11. Telhado / vedação calha

| Origem | Frase |
|---|---|
| SantaAd | "Durante o levantamento constatamos que será necessário a aplicação poliuretano (P.U) nas emendas da calha com a platibanda, visto que as mesmas se encontram vãos e permitem a passagem de água para a área interna. (Item 8.7 do contrato)" |
| Guariba | "Prezados, durante o levantamento constatamos que será necessário substituir as calhas galvanizadas. (Itens 3.1, 7.14 e 8.7 do contrato)" |

---

## 5. Banco unificado de DETALHES (legendas curtas)

Padrão invariante: começa com **"Detalhe(s)"**, termina com **"(Item(s) X.Y...)"**.

| Item | Frase | Origem |
|---|---|---|
| 17.4 | "Detalhe de marcas evidentes de manchas de sujeiras na parede da fachada frontal da agência. (Itens 17.4)" | SantaAd |
| 17.4 | "Detalhe de marcas evidentes de manchas de sujeiras na parede da fachada frontal da agência. (Itens 17.4 e 2.21)" | Guariba |
| 17.4 | "Detalhes de manchas de sujeiras na parede. (Item 17.4)" | SantaAd |
| 17.4 | "Detalhes de desgaste e mancha de sujeira na mureta amarela. (item 17.4)" | SantaAd |
| 17.9 | "Detalhes de marcas de presença de manchas de sujeiras. (Item 17.9)" | SantaAd |
| 17.9 | "Detalhes de sinais de desgastes, oxidações e manchas de sujeiras. (Item 17.9)" | Guariba |
| 17.1 | "Detalhes de desgaste e mancha de sujeira nas grandes. (item 17.1)" | SantaAd *(typo "grandes" preservado intencionalmente)* |
| 17.1 | "Detalhes de desgaste e mancha de sujeira no corrimão. (item 17.1)" | Guariba |
| 17.6 | "Detalhes de manchas de sujeiras nas paredes. (Item 17.6)" | SantaAd |
| 17.11 | "Detalhes de manchas de sujeiras nas paredes. (Item 17.11)" | Guariba |
| 17.11 | "Detalhes de manchas de sujeiras na parede. (Item 17.11 do contrato)" | Ribeirão |
| 17.11 | "Detalhes de manchas de sujeiras na parede e furos (Item 17.11 do contrato)" | Ribeirão |
| 17.8 | "Detalhes de desgastes e desbotamento da pintura calçada. (Item 17.8)" | Guariba |
| 12.10 + 2.18 | "Detalhes de manchas no forro (Itens 12.10 e 2.18)" | SantaAd/Guariba |
| 17.2 | "Detalhes de fissuras no teto. (Item 17.2)" | Guariba |
| 17.6 + 17.2 | "Detalhes de manchas de umidade no gesso acartonado. Informamos que a correção da infiltração está levantada no tópico "3.1 – Vedação em Calhas" (Itens 17.6 e 17.2)" | SantaAd |
| 29.14 | "Detalhe de manchas de sujeiras e sinais de desgastes. (Item 29.14)" | Guariba |
| 29.22 + 29.25 | "Detalhes de aberturas e desalinhamentos caixas. (Itens 29.22 e 29.25)" | Guariba |
| 29.12 + 29.24 | "Detalhes da fita que se encontra com desgaste/soltas nos degraus. (Itens 29.12 e 29.24)" | Guariba |
| 13.16 | "Detalhes de desalinhamento suporte das persianas (Item 13.16)" | Guariba |
| 16.16 | "Detalhes das medidas da persiana 1,00un, altura de 4,05m e largura de 1,05m. (Item 16.16 do contrato)" | Ribeirão |
| 16.16 | "Detalhes das persianas para substituição. (Item 16.16 do contrato)" | Ribeirão |
| 8.7 | "Detalhes dos vãos nas emendas da calha com a platibanda, sendo necessário a aplicação de PU (Item 8.7 do contrato)" | SantaAd |
| 17.6 + 17.2 | "Infiltrações no corredor de abastecimento (Item 17.6 e 17.2 do contrato)" | SantaAd |
| 19.36 | "Detalhes da iluminação fraca e queimada no ambiente. (Item 19.36 do contrato)" | Ribeirão |

---

## 6. Catálogo CONSOLIDADO de itens do contrato (extraído das 3 unidades)

| Código | Descrição (literal, do contrato) | Unidade | Visto em |
|---|---|---|---|
| **2.12** | Retirada de piso tátil com limpeza | un | SA |
| **2.18** | Remoção de entulho com caçamba metálica, inclusive limpeza, transporte, carga, descarga e descarte conforme legislação ambiental | un | SA, GU |
| **2.21** | Andaime torre metálico (1,5 x 1,5 m) com piso metálico | m/mês | SA, GU |
| **7.14** | Calha de chapa galvanizada | m | GU |
| **8.3** | Impermeabilização utilizando manta asfáltica polimérica (cobertura, lajes, banheiros, jardins, reservatórios e similares) | m² | GU |
| **8.6** | Impermeabilização com argamassa polimérica impermeabilizante | m² | GU |
| **8.7** | Impermeabilização com membrana de poliuretano (PU) | m | SA, GU |
| **10.1** | Regularização de base ou contrapiso | m² | GU |
| **12.5** | Forro de gesso acartonado, estruturado ou aramado | m² | SA |
| **12.10** | Forro de fibra mineral, incluindo fixação, sem estrutura | un | SA, GU |
| **13.12** | Deslocamento ou remanejamento de mobiliário dentro da agência | un | SA, GU |
| **13.16** | Persiana de enrolar para carenagens | un | GU |
| **13.20** | Ajuste e manutenção de portas | un | GU |
| **14.9** | Chapa metálica inox, para portas de madeira | un | GU |
| **15.3** | Ferragem para Porta de madeira (fechadura completa) - Substituição/instalação | un | GU |
| **15.7** | Mola hidráulica de Piso ou Aérea - Manutenção (ajuste e regulagem) | un | GU |
| **15.13** | Fechadura e contra fechadura para Porta de vidro laminado/temperado pivotante | un | SA |
| **16.16** | Persiana vertical em tecido | un | RIB |
| **17.1** | Pintura em esmalte sintético standard em estrutura metálica com duas demãos | m² | SA, GU |
| **17.2** | Emassamento de parede interna ou teto com massa corrida a base de PVA com duas demãos | m² | SA, GU |
| **17.4** | Pintura em látex acrílica standard fosca sem emassamento, 3 demãos, com aplicação de selador para exterior | m² | SA, GU |
| **17.6** | Pintura em látex acrílica premium **fosca** em paredes internas ou externas, exceto muros, com três demãos | m² | **SA** |
| **17.7** | Pintura em esmalte sintético para madeira com duas demãos, sem emassamento | m² | GU |
| **17.8** | Pintura para piso a base de resina acrílica - piso, faixas de demarcação de vagas, PNE, carro forte e similares | m² | SA, GU |
| **17.9** | Pintura Automotiva | m² | SA, GU |
| **17.10** | Pintura em látex acrílica econômica fosca, em muros, com duas demãos | m² | SA |
| **17.11** | Pintura em látex acrílica premium **acetinada** em paredes internas ou externas, exceto muros, com três demãos | m² | **RIB, GU** |
| **19.1** | Ponto elétrico duplo - Custos Fixos | un | SA |
| **19.8** | Ponto lógico duplo - Custos Fixos | un | SA |
| **19.18** | Lâmpada LED 14W T5 | un | SA |
| **19.36** | Lâmpada LED tubular bivolt 9/10W | un | RIB |
| **19.37** | Lâmpada LED tubular bivolt 18/20W | un | GU |
| **19.80** | Luminária LED circular ou quadrada | un | SA |
| **20.20** | Ponto de água fria (até 6m) | un | (legado) |
| **21.14** | Recarga de Extintor de Incêndio Portátil Com Carga de Água Pressurizada de 10L | un | GU |
| **21.16** | Recarga de Extintor de Incêndio Portátil Com Carga de Gás Carbônico (CO2) de 6KG | un | GU |
| **21.18** | Recarga de Extintor de Incêndio Portátil Com Carga de Pó Químico Seco (PQS) de 6KG, Classe ABC | un | GU |
| **21.21** | Recarga de Extintor PQS de 4KG, Classe BC | un | GU |
| **21.22** | Recarga de Extintor PQS de 6KG, Classe BC | un | GU |
| **21.23** | Recarga de Extintor PQS de 8KG, Classe BC | un | GU |
| **29.2** | Adesivos padrão BB (remus, estilo, high-tech, nova ambiência, padrão 98 ou similares) | un / m² | GU |
| **29.6** | Piso tátil de borracha - direcional ou alerta (por placa) | un | SA |
| **29.12** | Fita antiderrapante para degraus de escada ou rampas | m | GU |
| **29.14** | Sinalização externa - substituição de policarbonato e película, inclusive montagem da marca e instalação | un | GU |
| **29.22** | Ajuste de biombo, divisórias, carenagens e mobiliário em geral | un | GU |
| **29.24** | Remoção de adesivos e limpeza | un / m² | GU |
| **29.25** | Reparo de carenagens - Padrões BB | un | GU |

**Total**: 47 códigos consolidados a partir dos 3 .docx (vs 20 antes de cruzar com Ribeirão+Guariba).

### 🔒 FONTE DE VERDADE (atualizado 2026-05-14)

A tabela acima é **derivada** dos .docx, mas **NÃO é a fonte oficial**. A fonte oficial agora é:

| Arquivo | Origem | Conteúdo |
|---|---|---|
| `scripts/itens_oficiais_master.json` | `MEMORIAL DE ITENS - LOTE SP.xlsx` aba *Valores* | **467 itens oficiais** com código, descrição literal, unidade e capítulo |
| `scripts/itens_por_contrato.json` | 6 planilhas PREVISÃO ORÇAMENTÁRIA + RAT 1565 | Itens usados em cada contrato (1507, 2626, 0908, 3575, 2627, 2057) |
| `scripts/regras_pintura.json` | `MAFFENG - PINTURAS SOMENTE.html` | Regras de uso dos códigos 17.x por contrato |

**A TM-Automatizando consulta SEMPRE esses arquivos.** Se um código está nos .docx mas não nessas fontes, é tratado como inexistente.

---

## 13. Regras de pintura por contrato (CRÍTICO)

Extraídas literalmente do `MAFFENG - PINTURAS SOMENTE.html`:

| Contrato | Cidade(s) | Regras de pintura |
|---|---|---|
| **1565** | SJ Rio Preto + Ribeirão Preto (cobre **Santa Adélia, Guariba, Estilo Ribeirão**) | `17.10` TODOS os muros · `17.4` TODAS paredes externas · `17.6` TODA pintura acrílica INTERNA e TETOS |
| **0908** | SJ Campos | `17.6` Teto · `17.4` Restante das paredes internas/externas e muros |
| **1507** | Cuiabá | `17.11` Pintura colorida (azul/amarelo) · `17.6` Teto · `17.4` Restante |
| **3575** | Tangará/Sinop/Barra das Garças | `17.11` Colorida · `17.6` Teto · `17.4` Restante |
| **6122** | Campo Grande + Aquidauana | `17.4` Paredes internas/externas + FORRO · `17.10` Muros · `17.11` Coloridas |
| **2056** | Divinópolis | `17.6` Teto+muros+externas · `17.11` TODA interna |
| **2057** | Varginha | `17.6` Teto+externas · `17.10` Muros divisão · `17.11` Interna |
| **2627** | Valadares/Joaíma | `17.6` Teto+externas · `17.10` Muros · `17.11` Interna |
| **2626** | Salinas/SF | `17.6` Teto+muros+externas · `17.11` Toda interna |

### Conflito detectado entre .docx × HTML oficial

🚨 **Atenção:** os relatórios **Ribeirão** e **Guariba** usaram `17.11` em pintura interna, mas o HTML MAFFENG diz que no contrato **1565** a pintura interna é `17.6`. Há 3 possibilidades:

1. Erro do redator desses dois relatórios (mais provável).
2. HTML está desatualizado.
3. Mudança contratual entre as datas.

**Decisão da TM-Automatizando:** prevalece o `regras_pintura.json` (HTML). Em qualquer relatório de contrato 1565, pintura interna = **17.6**. Se o .docx de entrada usar 17.11, o cross-check N1 marca ❌ e força revisão.

### Restrições / observações por contrato

- **2057 e 2627**: fiscal Carol — extremamente exigente; vinílico/porcelanato/carpete só troca se realmente ruim.
- **6122**: registro de remanejamento de mobiliário OBRIGATÓRIO com quantidades exatas.
- **0908 e 1565**: detalhes vêm LOGO ABAIXO da foto-narrativa correspondente — nunca agrupados no fim do tópico. Orçamento separado por andar/setor.
- **Item 29.24 (todos)**: valor total dividido por 10, depois por 2.

---

## 7. Padrão do BLOCO fotográfico (unidade que se repete)

Idêntico nos três relatórios:

```
<NARRATIVA principal>     ← Foto N (foto-narrativa, ângulo amplo)
-Detalhes:
<DETALHE 1>               ← Foto N+1 (close)
<DETALHE 2>               ← Foto N+2
... (0..N detalhes)
Itens
<CODIGO> - <DESCRIÇÃO LITERAL DO ITEM>
Foto | Comp.(m) | Altura(m) | Total(m²)         ← cabeçalho da tabela
<linhas calculadas>
Total
<soma>
```

Variações observadas:
- **Múltiplos itens encadeados** (Guariba): mesmo bloco tem até 4 códigos (`17.11, 17.2, 13.12, 8.6`).
- **Croquis** (Guariba apenas): legenda começa com "Croqui com as dimensões...".
- **Andaime concomitante** (SA, GU): item 2.21 entra junto com 17.4 quando há trabalho em altura.

---

## 8. FORMATAÇÃO E LAYOUT (fidelidade visual obrigatória)

Extraído por inspeção dos `word/document.xml` dos três .docx:

| Atributo | Valor invariante | Observação |
|---|---|---|
| Fonte texto corrido | **Calibri** | 100% dos runs nos três |
| Tamanho texto corrido | **10pt** (`sz=20` em half-points) | predominante nos três |
| Tamanho legendas de foto | **10pt** | idem |
| Tamanho de subtítulos do item | **9pt** (`sz=18`) | usado em ~3% dos runs (Santa Adélia) |
| Negrito (`<w:b/>`) | Usado em títulos de seção, cabeçalho de tabela e linha "Total" | ~1.5k–2.8k runs por relatório |
| Cor de fundo da linha de cabeçalho da tabela | cinza claro (`#D9D9D9` no template 1565) | confirmado em `word_utils_sp2._set_cell_bg` |
| Alinhamento das fotos | centralizado | sempre |
| Tamanho de imagem | largura ~7cm (compatível com `AJUSTES_V4_IMAGENS_7CM.md` no workspace) | confirmado |
| Espaçamento entre blocos | linha em branco antes da próxima "Foto N" | sempre |
| Separador decimal | vírgula (BR) | sempre |

**Estratégia de fidelidade da TM-Automatizando**:
1. Antes de gravar qualquer parágrafo novo, **lê o estilo do parágrafo vizinho** no .docx de entrada (estratégia escolhida pelo usuário).
2. Replica `rPr` (font, size, bold, color, italic) e `pPr` (alignment, spacing).
3. Para tabelas, **clona a primeira tabela já presente no documento** como template visual (não cria do zero).
4. Loga em `formatacao_log.txt` qualquer parágrafo onde a clonagem falhou (fallback: usa `Calibri 10pt`).

---

## 9. Análise REAL das imagens — abordagem híbrida (decidida pelo usuário)

A TM-Automatizando processa cada foto assim:

```
┌─────────────────────────────────────────────────────────────┐
│  FOTO N (imagem extraída do .docx)                          │
└─────────────────────────────────────────────────────────────┘
                          │
       ┌──────────────────┴───────────────────┐
       ▼                                      ▼
[ETAPA 1 - HEURÍSTICA]                 [PARALELO]
• OCR (Tesseract) na imagem            • Lê texto adjacente
• Extrai medidas escritas a punho      • Detecta "(Item X.Y)"
• Lê código se aparecer                • Identifica seção
       │                                      │
       └──────────────┬───────────────────────┘
                      ▼
            CÓDIGO IDENTIFICADO?
              │              │
          SIM │              │ AMBÍGUO / NÃO
              │              ▼
              │      [ETAPA 2 - VLM]
              │      • Envia imagem ao Claude Vision
              │      • Prompt: "Identifique o problema
              │        visual e sugira o código do
              │        contrato SP2 (lista abaixo)"
              │      • Recebe: código + descrição curta
              │              │
              ▼              ▼
        CONFERÊNCIA CRUZADA (sempre)
        ─ código bate com a frase escolhida do banco?
        ─ frase contém o item correto entre parênteses?
        ─ medidas extraídas batem com o que o VLM viu?
                      │
                      ▼
              GERA OU PEDE REVISÃO
```

### Estimativa de taxa de erro (do meu lado, honesto)

| Cenário | Taxa de erro esperada | Por quê |
|---|---|---|
| Heurística + foto bem marcada | < 2% | Texto adjacente já diz o item. |
| Heurística sem marcação clara | ~15% | Ambíguo entre 17.6/17.11 ou entre 17.4/17.10. |
| **Híbrido com VLM** | **~3–5%** | VLM erra em fotos muito escuras ou ambíguas (ex.: distinguir "premium fosca" de "premium acetinada" visualmente é quase impossível — esse caso *sempre* exige revisão humana). |
| VLM em todas as fotos | ~3% | Custa tokens; ganho marginal pequeno. |

**Limitação honesta**: distinguir 17.6 (fosca) de 17.11 (acetinada) **não é possível visualmente** em foto de baixa luz. A TM-Automatizando vai sempre marcar esse caso como `⚠ revisar` e propor o item baseado no **histórico da unidade** (Santa Adélia → 17.6; Ribeirão/Guariba → 17.11).

---

## 10. Cross-check / correção cruzada (4 níveis decididos com o usuário)

A TM-Automatizando roda 4 baterias de validação ANTES de salvar o `_PREENCHIDO_PROPOSTA.docx`:

### 10.1. Aritmética + coerência foto↔código↔frase
- `L × A × Faces − Desconto == Total` em cada linha.
- Soma de linhas == Total Geral.
- Código citado entre parênteses na frase == código do dicionário == código da tabela de itens.

### 10.2. Sequência de fotos + cabeçalho vs corpo
- `Foto 1, 2, 3, ..., N` sem buracos nem duplicatas.
- Endereço/agência/responsáveis batem entre cabeçalho, capa e descrição.
- Total de Foto N declarados == total de imagens embutidas no .docx.

### 10.3. Formatação (negrito, fonte, espaçamento, estilo de tabela)
- Cada parágrafo novo herda `rPr` do vizinho.
- Cada tabela nova clona a primeira tabela do documento.
- Diff visual logado para qualquer divergência.

### 10.4. Imagens órfãs e legendas duplicadas
- Imagem embutida sem `Foto N` → loga.
- `Foto N` sem imagem → loga.
- Duas fotos com texto idêntico → alerta (provável copy-paste).

**Saída**: `crosscheck_report.md` com ✅/⚠/❌ para cada item — entregue junto com o `_PREENCHIDO_PROPOSTA.docx`.

---

## 11. Curadoria do banco (decidida pelo usuário: manual via JSON)

Toda vez que você aprovar um relatório:

```
[Relatório aprovado]
        │
        ▼
TM-Automatizando compara frases usadas
contra banco_frases_sp2.json
        │
        ▼
Detecta frases NOVAS (ou ajustadas)
        │
        ▼
Gera proposta_novas_frases.md
        │
        ▼
Você revisa item por item:
   ✅ aprovar → grava no banco
   ✏️ ajustar e aprovar → grava ajustada
   ❌ rejeitar → não entra
```

O banco cresce **só com frases que você validou**. Zero risco de drift.

---

## 12. Referências cruzadas

- Plano de execução: `PLANO_EXECUCAO_RELATORIO_SP2.md`
- Comparativo cruzado: `COMPARATIVO_V4_vs_SP2_SANTA_ADELIA.md`
- Skill TM-Automatizando: `skill_completar_relatorio_marcado/SKILL.md`
- Integração frontend: `INTEGRACAO_FRONTEND_TM_AUTOMATIZANDO.md`
- Index navegável: `index_entregaveis_SP2.html`
