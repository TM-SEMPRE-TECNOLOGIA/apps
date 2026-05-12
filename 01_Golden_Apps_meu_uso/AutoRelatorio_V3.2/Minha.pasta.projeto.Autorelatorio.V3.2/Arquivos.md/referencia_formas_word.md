# Referência de Formas do Word — Relatório Lorena
Mapeamento completo das formas utilizadas no documento, com código XML correspondente.

---

## 🎨 Cores Utilizadas

| Nome no Word | Código HEX | Uso |
|---|---|---|
| Vermelho vivo | `EE0000` | Fundo das caixas de texto vermelhas |
| Vermelho puro | `FF0000` | Bordas dos círculos e linhas/setas |
| Roxo | `7030A0` | Fundo das caixas de texto roxas |
| Preto | `000000` | Sombra externa / borda |

---

## 1. Caixa de Texto — Fundo Vermelho (com sombra)

**Onde aparece no Word:** Inserir → Caixa de Texto → Desenhar Caixa de Texto, depois Formatar → Preenchimento: Vermelho, Borda: preta sólida, Efeitos: Sombra.

**Características:**
- Forma: Retângulo (`rect`)
- Fundo: `#EE0000` (vermelho)
- Borda: 1,5 pt, cor preta (`tx1`)
- Sombra externa: desfoque 40000 EMU, distância 23000, direção 90° (abaixo)
- Texto interno: **negrito**, fonte padrão do tema
- Margens internas: esquerda/direita = 91440 EMU (≈ 0,1"), cima/baixo = 45720 EMU (≈ 0,05")

```xml
<wps:wsp>
  <wps:cNvSpPr txBox="1"/>
  <wps:spPr>
    <a:xfrm>
      <a:off x="0" y="0"/>
      <a:ext cx="724680" cy="277200"/>  <!-- largura x altura em EMU -->
    </a:xfrm>
    <a:prstGeom prst="rect">
      <a:avLst/>
    </a:prstGeom>
    <a:solidFill>
      <a:srgbClr val="EE0000"/>          <!-- fundo vermelho -->
    </a:solidFill>
    <a:ln w="19050" cap="flat" cmpd="sng" algn="ctr">   <!-- borda 1,5pt -->
      <a:solidFill>
        <a:schemeClr val="tx1"/>         <!-- cor da borda = preto do tema -->
      </a:solidFill>
      <a:prstDash val="solid"/>
    </a:ln>
    <a:effectLst>
      <a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0">
        <a:srgbClr val="000000">
          <a:alpha val="35000"/>         <!-- sombra preta 35% opacidade -->
        </a:srgbClr>
      </a:outerShdw>
    </a:effectLst>
  </wps:spPr>
  <wps:txbx>
    <w:txbxContent>
      <w:p>
        <w:pPr>
          <w:rPr><w:b/><w:bCs/></w:rPr>   <!-- parágrafo em negrito -->
        </w:pPr>
        <w:r>
          <w:rPr><w:b/><w:bCs/></w:rPr>
          <w:t>SEU TEXTO AQUI</w:t>
        </w:r>
      </w:p>
    </w:txbxContent>
  </wps:txbx>
  <wps:bodyPr rot="0" vert="horz" wrap="square"
    lIns="91440" tIns="45720" rIns="91440" bIns="45720"
    anchor="t" compatLnSpc="1">
    <a:prstTxWarp prst="textNoShape"><a:avLst/></a:prstTxWarp>
    <a:noAutofit/>
  </wps:bodyPr>
</wps:wsp>
```

---

## 2. Caixa de Texto — Fundo Roxo (sem sombra, auto-ajuste)

**Onde aparece no Word:** Inserir → Caixa de Texto → Preenchimento: Roxo, Borda fina, sem sombra.

**Características:**
- Forma: Retângulo (`rect`)
- Fundo: `#7030A0` (roxo)
- Borda: 0,75 pt, cor preta (`tx1`)
- Sem sombra
- Texto: **negrito**
- Altura ajusta automaticamente ao conteúdo (`spAutoFit`)
- Quebra de linha: `wrap="none"` (sem quebra)

```xml
<wps:wsp>
  <wps:cNvSpPr txBox="1"/>
  <wps:spPr>
    <a:xfrm>
      <a:off x="0" y="0"/>
      <a:ext cx="914400" cy="914400"/>   <!-- 1 polegada x 1 polegada -->
    </a:xfrm>
    <a:prstGeom prst="rect">
      <a:avLst/>
    </a:prstGeom>
    <a:solidFill>
      <a:srgbClr val="7030A0"/>          <!-- fundo roxo -->
    </a:solidFill>
    <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">  <!-- borda 0,75pt -->
      <a:solidFill>
        <a:schemeClr val="tx1"/>
      </a:solidFill>
      <a:prstDash val="solid"/>
    </a:ln>
    <a:effectLst/>                       <!-- sem efeitos -->
  </wps:spPr>
  <wps:txbx>
    <w:txbxContent>
      <w:p>
        <w:r>
          <w:rPr><w:b/><w:bCs/></w:rPr>
          <w:t>SEU TEXTO AQUI</w:t>
        </w:r>
      </w:p>
    </w:txbxContent>
  </wps:txbx>
  <wps:bodyPr wrap="none" lIns="91440" tIns="45720" rIns="91440" bIns="45720"
    anchor="t" compatLnSpc="1">
    <a:prstTxWarp prst="textNoShape"><a:avLst/></a:prstTxWarp>
    <a:spAutoFit/>                       <!-- altura automática -->
  </wps:bodyPr>
</wps:wsp>
```

---

## 3. Círculo / Elipse — Apenas Contorno Vermelho (sem preenchimento)

**Onde aparece no Word:** Inserir → Formas → Elipse. Sem preenchimento, borda vermelha.

**Características:**
- Forma: Elipse (`ellipse`) — se cx = cy é um círculo perfeito
- Preenchimento: **nenhum** (`noFill`)
- Borda: cor `#FF0000` (vermelho), espessura padrão
- Sem sombra

```xml
<wps:wsp>
  <wps:cNvSpPr/>
  <wps:spPr>
    <a:xfrm>
      <a:off x="0" y="0"/>
      <a:ext cx="1890793" cy="1890793"/>  <!-- cx=cy = círculo perfeito -->
    </a:xfrm>
    <a:prstGeom prst="ellipse">
      <a:avLst/>
    </a:prstGeom>
    <a:noFill/>                           <!-- sem preenchimento -->
    <a:ln>
      <a:solidFill>
        <a:srgbClr val="FF0000"/>         <!-- borda vermelha -->
      </a:solidFill>
    </a:ln>
  </wps:spPr>
  <wps:bodyPr rot="0" vert="horz" wrap="square"
    lIns="91440" tIns="45720" rIns="91440" bIns="45720"
    anchor="ctr" compatLnSpc="1">
    <a:prstTxWarp prst="textNoShape"><a:avLst/></a:prstTxWarp>
    <a:noAutofit/>
  </wps:bodyPr>
</wps:wsp>
```

**Variação — Círculo com preenchimento vermelho:**
```xml
<!-- Substituir <a:noFill/> e <a:ln> por: -->
<a:solidFill>
  <a:srgbClr val="FF0000"/>
</a:solidFill>
<!-- sem <a:ln> = sem borda visível -->
```

---

## 4. Seta Reta com Duas Pontas (Conector)

**Onde aparece no Word:** Inserir → Formas → Conectores → Conector de Seta Reta. Cor vermelha, 1,5 pt.

**Características:**
- Forma: `straightConnector1`
- Linha: 1,5 pt (`w="19050"` em EMU = 19050/12700 ≈ 1,5pt)
- Cor: `#FF0000` (vermelho)
- Pontas: triângulo em ambas as extremidades (seta dupla)
- Sem preenchimento (é uma linha)
- `flipH="1"` e `flipV="1"` controlam a direção/orientação

```xml
<wps:wsp>
  <wps:cNvCnPr/>   <!-- indica que é conector, não caixa de texto -->
  <wps:spPr>
    <a:xfrm flipH="1" flipV="1">   <!-- flipH/flipV = espelha horizontalmente/verticalmente -->
      <a:off x="0" y="0"/>
      <a:ext cx="4863869" cy="1405660"/>
    </a:xfrm>
    <a:prstGeom prst="straightConnector1">
      <a:avLst/>
    </a:prstGeom>
    <a:ln w="19050">                 <!-- espessura da linha: 19050 EMU = 1,5pt -->
      <a:solidFill>
        <a:srgbClr val="FF0000"/>   <!-- cor vermelha -->
      </a:solidFill>
      <a:headEnd type="triangle"/>  <!-- ponta de início: triângulo -->
      <a:tailEnd type="triangle"/>  <!-- ponta do fim: triângulo -->
    </a:ln>
  </wps:spPr>
  <wps:bodyPr/>   <!-- sem conteúdo de texto -->
</wps:wsp>
```

**Variações de tipo de ponta (`type`):**
| Valor | Aparência |
|---|---|
| `none` | sem ponta (linha simples) |
| `triangle` | triângulo sólido (seta padrão) |
| `stealth` | triângulo pequeno/fino |
| `diamond` | losango |
| `oval` | bolinha |
| `arrow` | seta aberta |

---

## 5. Seta Reta — Apenas Uma Direção

**Variação da seta acima, mas com flip apenas em um eixo:**

```xml
<a:xfrm flipH="1">   <!-- apenas flip horizontal, sem flipV -->
  <a:off x="0" y="0"/>
  <a:ext cx="139065" cy="1814772"/>
</a:xfrm>
```

---

## 📐 Unidades de Medida (EMU)

Todo tamanho no XML do Word usa **EMU (English Metric Units)**:

| Medida real | Em EMU |
|---|---|
| 1 polegada | 914.400 |
| 1 cm | 360.000 |
| 1 mm | 36.000 |
| 1 ponto tipográfico | 12.700 |

**Exemplos do seu documento:**
| Forma | Largura (EMU) | Altura (EMU) | Equivalente |
|---|---|---|---|
| Caixa vermelha pequena | 724.680 | 277.200 | ≈ 2 cm x 0,77 cm |
| Caixa roxa | 914.400 | 914.400 | 1" x 1" |
| Círculo (elipse) | 1.890.793 | 1.890.793 | ≈ 5,25 cm |
| Linha/seta longa | 4.863.869 | 1.405.660 | ≈ 13,5 cm x 3,9 cm |

---

## 🔤 Espessura de Linha

| Valor `w=` em EMU | Pontos (pt) | Aparência |
|---|---|---|
| `9525` | 0,75 pt | Muito fina |
| `12700` | 1 pt | Fina padrão |
| `19050` | **1,5 pt** | Usada no seu documento |
| `25400` | 2 pt | Média |
| `38100` | 3 pt | Grossa |

---

## 📦 Posicionamento (Âncora)

As formas flutuantes usam `wp:anchor` com posição absoluta na página:

```xml
<wp:anchor relativeHeight="252598272" behindDoc="0" layoutInCell="1" allowOverlap="1">
  <wp:positionH relativeFrom="page">
    <wp:posOffset>160735</wp:posOffset>   <!-- distância da margem esquerda em EMU -->
  </wp:positionH>
  <wp:positionV relativeFrom="page">
    <wp:posOffset>1295400</wp:posOffset>  <!-- distância do topo da página em EMU -->
  </wp:positionV>
  <wp:extent cx="724680" cy="277200"/>    <!-- tamanho da forma -->
  <wp:wrapNone/>                          <!-- sem quebra de texto ao redor -->
</wp:anchor>
```

`relativeFrom` pode ser: `"page"`, `"margin"`, `"column"`, `"paragraph"`

---

## ✏️ Como Criar Cada Forma no Word (Interface Visual)

| Forma | Caminho no Word |
|---|---|
| Caixa de texto | Inserir → Caixa de Texto → Desenhar Caixa de Texto |
| Retângulo | Inserir → Formas → Retângulos → Retângulo |
| Círculo/Elipse | Inserir → Formas → Formas Básicas → Elipse |
| Seta reta | Inserir → Formas → Linhas → Seta |
| Seta dupla | Inserir → Formas → Linhas → Seta Dupla |
| Conector reto | Inserir → Formas → Conectores → Conector Reto |
| Mudar cor fundo | Selecionar forma → Formato → Preenchimento de Forma |
| Mudar cor borda | Selecionar forma → Formato → Contorno de Forma |
| Adicionar sombra | Selecionar forma → Formato → Efeitos de Forma → Sombra |
| Negrito no texto | Selecionar texto dentro da forma → Ctrl+B |
