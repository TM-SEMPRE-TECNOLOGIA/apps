# CHANGELOG — Modo São Paulo 2 (SP2)
> AutoRelatório V3.2 · Contrato 1565 · São José do Rio Preto  
> Implementado em: 28/04/2026  
> Referência: OS 250107393 — Agência 0419/00 Igarapava — Machado & Machado Engenharia

---

## O que é o Modo SP2

O **Modo São Paulo 2** é a terceira lógica de montagem de relatório do AutoRelatório V3.2.  
Ele foi projetado a partir da análise do PDF `0419 - OS 250107393 - RELATÓRIO FOTOGRÁFICO ass.pdf`,  
que representa o padrão exigido pelo **Contrato 1565 (São José do Rio Preto)**.

---

## Comparativo entre os três modos

| Característica | Tradicional | SP1 (Organizado SP) | SP2 (Contrato 1565) |
|---|---|---|---|
| Estrutura de pastas | Plana | Hierárquica | Hierárquica numerada |
| Tabela de cálculo | Não | Sim (5 colunas) | Sim (5+ colunas, com faces) |
| Múltiplas paredes por tabela | Não | Não | **Sim** |
| Fator de faces (metálicos) | Não | Não | **Sim (× 2 faces)** |
| Enunciado textual do item | Não | Não | **Sim (antes da tabela)** |
| Tabela de Itens separada | Não | Acoplada | **Separada** |
| Suporte a Croquis | Não | Não | **Sim (imagem + legenda)** |
| Cabeçalho institucional | Não | Não | **Sim (todas as páginas)** |
| Detecção de item por pasta | Não | Parcial | **Automática** |

---

## Arquivos criados/modificados

### Novos arquivos (backend)

| Arquivo | Responsabilidade |
|---|---|
| `APP/backend/utils_sp2.py` | Parser de medidas (faces, paredes, croquis), formatadores, mapeamento de itens do contrato |
| `APP/backend/generator_sp2.py` | Scanner hierárquico — monta o array `conteudo` com todos os novos tipos de item |
| `APP/backend/word_utils_sp2.py` | Motor Word — insere memória de cálculo, tabela de itens separada, croquis, enunciados |

### Arquivos modificados

| Arquivo | O que mudou |
|---|---|
| `APP/backend/server.py` | Import de `generator_sp2` e `word_utils_sp2`; suporte a `tipo_relatorio == 'sp2'` em `/api/scan` e `/api/generate`; campo `meta_sp2` no modelo Pydantic |
| `APP/frontend/components/SidebarWizard.tsx` | Botão "SP2" no seletor de modo; label "SP1" para o antigo "Organizado SP"; badge informativo do contrato |

---

## Estrutura de pastas esperada pelo SP2

```
📁 AGÊNCIA XPTO/
├── Fachada.jpg                          ← capa (opcional, nome deve conter "fachada")
├── 📁 1 - 1º Andar – Espaço Desativado/
│   ├── 📁 1.1 - Emassamento e pintura de teto/
│   │   ├── 01 - 16,20 x 4,63.jpg       ← foto com medidas (largura × altura)
│   │   ├── 02 - adicional.jpg           ← foto sem medidas (só insere imagem)
│   │   ├── CROQUI 01 - Laje.jpg        ← croqui (legenda automática)
│   │   └── 📁 - Detalhes 1/            ← detalhes da foto 01
│   │       └── det_01.jpg
├── 📁 2 - Térreo – Suporte/
│   ├── 📁 2.1 - Recuperacao e vedacao de janela/
│   │   └── 01 - 3,85 x 2,18 - Faces 2.jpg    ← com fator de faces (× 2)
│   └── 📁 2.2 - Emassamento e pintura de parede/
│       ├── 01 - 3,64 x 4,07.jpg               ← Parede 1
│       ├── 02 - 5,38 x 4,07 - Desconto 8,39m².jpg  ← com desconto
│       ├── 03 - 3,64 x 4,07.jpg               ← Parede 3
│       └── 04 - 5,38 x 4,07 - Desconto 1,68m².jpg
```

---

## Formatos de nome de arquivo suportados

| Formato | Exemplo | Resultado |
|---|---|---|
| Simples | `01 - 6,50 x 3,00.jpg` | Largura × Altura |
| Com desconto | `01 - 6,50 x 3,00 - Desconto 1,89m².jpg` | Subtotal − Desconto |
| Com faces | `01 - 3,85 x 2,18 - Faces 2.jpg` | Área × 2 faces |
| Com faces + desconto | `01 - 3,85 x 2,18 - Faces 2 - Desconto 1,00m².jpg` | (Área × 2) − Desconto |
| Com nome de parede | `01 - 5,00 x 1,90 - Muro 1.jpg` | Coluna Referência mostra "Foto 01 – Muro 1" |
| Com quantidade | `01 - 0,10 x 5,00 - Qtd 3.jpg` | Para mastros, elementos unitários |
| Sem medidas | `02 - vista geral.jpg` | Só insere a imagem, sem tabela |
| Croqui | `CROQUI 01 - Dimensoes da laje.jpg` | Insere imagem + legenda centralizada abaixo |

---

## Tipos de item no array `conteudo` (saída do generator_sp2)

```python
# Título de seção
"Título da seção"           # sem » = Heading 1
"»Subtítulo"                # Heading 2
"»»Sub-subtítulo"           # Heading 3

# Imagem de capa
{"imagem_fachada": "/path/Fachada.jpg"}

# Foto normal
{"imagem": "/path/01.jpg"}

# Croqui técnico
{"croqui": "/path/CROQUI 01.jpg", "legenda": "CROQUI 01 – DIMENSÕES DA LAJE"}

# Texto de detalhes
{"texto_padrao": "Detalhes 1"}

# Enunciado do item (antes da tabela de cálculo)
{"enunciado_item": {"codigo": "17.6", "descricao": "Pintura em látex acrílica..."}}

# Tabela de Memória de Cálculo (múltiplas linhas)
{"memoria_calculo": {
    "tipo_item"   : "area",     # "area" | "metalico" | "unitario"
    "codigo"      : "17.6",
    "descricao"   : "Pintura em látex acrílica...",
    "linhas"      : [
        {"referencia": "Foto 01", "largura": 3.64, "altura": 4.07, "faces": 1,
         "desconto": 0.0, "subtotal": 14.81, "total": 14.81, "parede_nome": ""},
        {"referencia": "Foto 02 – Muro 1", "largura": 5.38, "altura": 4.07, "faces": 1,
         "desconto": 8.39, "subtotal": 21.90, "total": 13.51, "parede_nome": "Muro 1"},
    ],
    "total_geral" : 28.32
}}

# Tabela de Itens separada
{"tabela_itens_sp2": {
    "codigo"    : "17.6",
    "descricao" : "Pintura em látex acrílica premium fosca...",
    "quantidade": 28.32,
    "unidade"   : "m²"
}}

# Quebra de página
{"quebra_pagina": True}
```

---

## Mapeamento automático de itens por nome de pasta

O `generator_sp2.py` detecta o item do contrato automaticamente pelo nome da pasta de serviço.  
O mapeamento completo está em `utils_sp2.py` → `ITENS_CONTRATO_SP2`.

Exemplos de correspondência:

| Nome da pasta (contém) | Item detectado |
|---|---|
| `emassamento` | 17.2 — Emassamento de parede interna |
| `pintura acrilica` | 17.6 — Pintura látex acrílica premium fosca |
| `pintura esmalte` | 17.1 — Pintura esmalte sintético em estrutura metálica |
| `pintura esmalte madeira` | 17.7 — Pintura esmalte para madeira |
| `forro mineral` | 12.10 — Forro de fibra mineral |
| `impermeabilizacao manta` | 8.3 — Impermeabilização com manta asfáltica |
| `vedacao janelas` | 29.43 — Vedações em geral |
| `recuperacao grades` | 14.6 — Recuperação de grades/corrimãos |

---

## Cabeçalho institucional (meta_sp2)

O template Word do SP2 deve conter os seguintes placeholders no cabeçalho:

```
{contrato}        → ex: "2025.7421.2955"
{os}              → ex: "250107393"
{agencia}         → ex: "0419/00 – Igarapava – SP"
{elaborador}      → ex: "Jônathas Gutierre"
{data_elaboracao} → ex: "11/11/2025"
{tipo_vistoria}   → ex: "PREVENTIVA"
{data_vistoria}   → ex: "09/09/2025"
{empresa}         → ex: "Machado & Machado Engenharia"
```

O campo `meta_sp2` pode ser enviado pelo frontend via `POST /api/generate` como:
```json
{
  "meta_sp2": {
    "contrato": "2025.7421.2955",
    "os": "250107393",
    "agencia": "0419/00 – Igarapava – SP",
    "elaborador": "Jônathas Gutierre",
    "data_elaboracao": "11/11/2025",
    "tipo_vistoria": "PREVENTIVA",
    "data_vistoria": "09/09/2025",
    "empresa": "Machado & Machado Engenharia"
  }
}
```

---

## Template Word recomendado

Use o template: **`MODELO - 1565 - SAO JOSE DO RIO PRETO.docx`**

O template deve ter:
- Cabeçalho com a tabela institucional e os placeholders `{contrato}`, `{os}`, etc.
- Marca `{{start_here}}` no corpo do documento (onde o conteúdo será inserido)
- Placeholder `{Desc_here}` onde a descrição do serviço deve aparecer
- Rodapé com número de página (pode usar o campo nativo do Word)

---

## Atualização — 28/04/2026 (formulário meta_sp2)

### Arquivos modificados

| Arquivo | O que mudou |
|---|---|
| `APP/frontend/app/page.tsx` | Estado `metaSp2` com 8 campos; passagem via props para `SidebarWizard`; inclusão no body do `POST /api/generate` quando `tipo_relatorio === 'sp2'` |
| `APP/frontend/components/SidebarWizard.tsx` | Interface `MetaSp2`; props `metaSp2` + `setMetaSp2`; helper `updateMeta`; formulário animado com 8 campos que aparece/desaparece ao selecionar modo SP2 |

### Campos do formulário

| Campo | Placeholder | Observação |
|---|---|---|
| Contrato | `2025.7421.2955` | Mapeia `{contrato}` no template |
| OS | `250107393` | Mapeia `{os}` |
| Agência | `0419/00 – Igarapava – SP` | Mapeia `{agencia}` |
| Elaborador | `Jônathas Gutierre` | Mapeia `{elaborador}` |
| Empresa | `Machado & Machado Engenharia` | Mapeia `{empresa}` |
| Data Vistoria | `dd/mm/aaaa` | Mapeia `{data_vistoria}` |
| Data Elaboração | `dd/mm/aaaa` | Mapeia `{data_elaboracao}` |
| Tipo Vistoria | Select: PREVENTIVA / CORRETIVA / EMERGENCIAL | Mapeia `{tipo_vistoria}` |

---

## Próximos passos sugeridos

- [x] Formulário no frontend para preenchimento do `meta_sp2` (Contrato, OS, Agência, etc.) ✅ 28/04/2026
- [ ] Validação do template 1565 com os placeholders de cabeçalho
- [ ] Teste real com a estrutura de pastas do contrato 1565
- [ ] Suporte a item `andaime_torre` com altura como unidade (já no mapeamento)
- [ ] Agrupamento automático de itens iguais em múltiplas pastas (ex: 17.11 em 3 ambientes → total consolidado)
