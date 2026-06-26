# Regras de Formatação — Relatório Fotográfico de Vistoria Preventiva

## Contexto

O AutoRelatório 3.2 gera arquivos `.docx` com o conteúdo correto (imagens, textos, legendas)
mas com formatação desordenada. Este documento define as 9 regras que devem ser aplicadas
para que o documento atinja o padrão exigido pelo Banco do Brasil / CEF.

Análise realizada sobre:
- **Referência correta**: `RELATÓRIO FOTOGRÁFICO - 1 - TORIXOREU - 1158 - LEVANTAMENTO PREVENTIVO - FINAL.docx`
  - 1496 parágrafos | 402 imagens | 224 quebras de página | 974 vazios_center | 48 subtítulos_both

- **Cópia gerada**: `RELATÓRIO FOTOGRÁFICO - 1 - TORIXOREU - 1158 - LEVANTAMENTO PREVENTIVO - Copia desorganizada.docx`
  - 743 parágrafos | 398 imagens | 107 quebras de página | 247 pares adjacentes | 38 vazios_center | 46 subtítulos

---

## Regra 1 — Alinhamento de subtítulos → `both`

**Identificação**: parágrafo de texto iniciando com:
- `- Vista ampla`
- `- Detalhes`
- `- Croqui`
- `- Vista geral`
- `- Detalhe`

**Correção**: `<w:jc w:val="both"/>`

**XML antes (errado)**:
```xml
<w:p>
  <w:pPr><w:jc w:val="center"/></w:pPr>
  <w:r><w:t>- Vista ampla da fachada</w:t></w:r>
</w:p>
```

**XML depois (correto)**:
```xml
<w:p>
  <w:pPr><w:jc w:val="both"/></w:pPr>
  <w:r><w:t>- Vista ampla da fachada</w:t></w:r>
</w:p>
```

---

## Regra 2 — Separadores entre imagens adjacentes

Dois parágrafos consecutivos com `<w:drawing>` nunca devem estar sem um separador entre eles.

**Correção**: inserir `<w:p><w:pPr><w:jc w:val="center"/></w:pPr></w:p>` entre eles.

**Padrão antes (errado)**:
```
IMG | IMG | IMG | IMG
```

**Padrão depois (correto)**:
```
IMG | E(center) | IMG | E(center) | IMG | E(center) | IMG
```

---

## Regra 3 — Alinhamento de vazios próximos a imagens → `center`

Qualquer parágrafo vazio (sem texto, sem imagem, sem PB) que esteja imediatamente
antes ou após um parágrafo com imagem deve ter `jc = center`.

---

## Regra 4 — Alinhamento de vazios após títulos principais → `center`

Parágrafo vazio imediatamente após um título de seção (texto longo > 5 chars, não subtítulo,
não imagem) deve ter `jc = center`.

---

## Regra 5 — Quebras de página: 1 por 2 imagens

### 5a — Remover todas as quebras existentes
Todos os `<w:br w:type="page"/>` são removidos antes da reinserção.

### 5b — Reinserir 1 PB a cada 2 imagens
- Contador de imagens reseta a cada PB.
- A PB é inserida no parágrafo separador entre a 2ª e a próxima imagem.
- Após cada PB, inserir um parágrafo buffer vazio+center.

**Padrão alvo (entre dois PBs)**:
```
PB → E(center) [buffer] → IMG → E(center) → IMG → PB
```

**Distâncias entre PBs observadas no documento de referência**:
```
dist=5  → 78x  (padrão base)
dist=6  → 39x  (parágrafo extra ao final)
dist=7+ → 64x  (títulos/subtítulos no intervalo)
```

### Por que 1 PB por 2 imagens?
O relatório é impresso em A4. Cada página comporta exatamente 2 fotos com legendas.
A quebra garante que um par não "vaze" para a página seguinte, sobrepondo a paginação.

---

## Regra 6 — Nunca sobrescrever o original

O arquivo de entrada é copiado antes de qualquer modificação.
O arquivo de saída sempre tem sufixo `_organizado.docx`.

---

## Regra 7 — Preservar todo o conteúdo

Apenas `jc` e inserções de parágrafos vazios são alterados.
Texto, imagens, estilos de parágrafo, cabeçalhos, rodapés, relacionamentos e
metadados do DOCX são preservados integralmente.

---

## Regra 8 — Bibliotecas: stdlib apenas

`zipfile` + `xml.etree.ElementTree` — sem python-docx, sem lxml.
Garante compatibilidade em qualquer Python 3.8+ sem instalação adicional.

---

## Regra 9 — Validação pós-correção

Executar `validar_docx.py --file arquivo_organizado.docx` e confirmar:

| Métrica          | Valor esperado                    |
|------------------|-----------------------------------|
| adj_img_pairs    | 0                                 |
| page_breaks      | ceil(total_imagens / 2)           |
| subtitulos_wrong | 0                                 |
| vazios_sem_center| 0                                 |
