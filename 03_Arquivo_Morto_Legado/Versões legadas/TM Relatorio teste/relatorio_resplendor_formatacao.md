# Análise de Engenharia Reversa: Layout e Formatação do Relatório Resplendor

Com base na extração e análise completa dos XMLs internos do arquivo [.docx](file:///c:/Users/thiag/TM-MEUS-APPS/LEGADO%20-%20ANTIGOS/TM%20Extrator/RELAT%C3%93RIO%20FOTOGR%C3%81FICO%20-%20RESPLENDOR%20-%20LEVANTAMENTO%20PREVENTIVO.docx) final gerado para Resplendor, detalho abaixo o descritivo de formatação, layout, espaçamentos e organização do documento. 

> [!NOTE]
> Esta análise extraiu as informações puras de formatação do Word (**styles.xml**, **document.xml**, **sectPr**, etc.), desconsiderando o conteúdo literal de dados e focando estritamente em **como** o documento é montado visualmente estruturalmente.

---

## 1. Configuração de Página e Margens (Page Setup)

O documento possui um padrão estrito de dimensões aplicadas em todas as seções:

- **Tamanho do Papel:** A4 (21,01 cm x 29,7 cm)
- **Orientação:** Retrato (Portrait)
- **Margens:** Estreitas / Uniformes
  - **Superior / Inferior:** 1,27 cm
  - **Esquerda / Direita:** 1,27 cm
  - **Cabeçalho e Rodapé:** 1,27 cm da borda
- **Peculiaridade de Colunas:** O documento é subdividido em 3 seções lógicas de Word [(w:sectPr)](file:///C:/tmp/analyze_resplendor.py#19-23). A maioria flui em 1 coluna, mas uma seção intermediária é predeterminada para **2 colunas** (provavelmente otimizando o agrupamento de fotos ou laudos na horizontal).

## 2. Tipografia e Estilos de Fonte Globais

A definição de fontes baseia-se em padrões da família **Arial** e **Calibri**, alternados de acordo com o peso hierárquico.

- **Corpo do Texto Padrão (Normal / Corpo de texto):** 
  - **Fonte Padrão:** Arial
  - **Tamanho:** 11 pt a 11,5 pt.
  - Alinhamentos variam entre justificado (textos de laudo) e centralizado (conteúdos que precedem ou sucedem imagens).
- **Títulos (Hierarquia):**
  - **Título Principal (Capa / Header):** Centralizado, 12,5 pt a 14 pt, Negrito (Calibri ou Arial).
  - **Heading 1 (Ex: `- Área externa:`):** Calibri, 14 pt, **Negrito**, sem recuos especiais.
  - **Heading 2 (Ex: `- Telhado:`):** Arial, 14 pt, **Negrito**, **espaçamento antes de 40 twips** (~1,4 mm) associado a regra de _keep with next_ (não separar da linha seguinte).
  - **Heading 3 (Ex: `1 - Pintura acrílica:`):** Calibri, **Negrito**, também não separa da próxima linha.

## 3. Organização de Imagens e Caixas de Texto (Croquis/Cotas)

Esta é a parte mais complexa estruturalmente da formatação. O relatório possui **centenas de imagens** e **shapes** (formas de caixas de texto soltas desenhadas com VML Shape / wordprocessingShape).

- **Imagens Fotográficas (Inline):** As fotos principais do relatório são inseridas na forma "Inline com o texto" (`wp:inline`), e frequentemente num tamanho travado de aproximadamente **13,33 cm de largura por 10,0 cm de altura** com o parágrafo marcado como **Centralizado**. 
- **Cotas e Marcações Visuais (Caixas de Texto):** A engenharia reversa mostrou forte uso de caixas de texto tipo "_wordprocessingShape_" e "_VML_" contendo cotas ("0,35 m", "2,96 m", etc). Estas caixas são:
  - Inseridas como elementos **"Float / Anchor"**, posicionadas absolutamente por cima das fotos, relativas ao parágrafo ou coluna.
  - **Bordas / Preenchimento:** Algumas caixas não possuem preenchimento (`noFill`) e nem linhas ao redor de borda (`noFillLn`), para o texto (cota literal) flutuar como se pertencesse diretamente à foto.

## 4. Estrutura e Formatação das Tabelas

As tabelas são o principal ponto de sustentação da diagramação descritiva. Existem 2 padrões primários distintos usados para acomodar textos estruturados e formulários do banco de preços:

### A. Tabelas de Identificação (Cabeçalho do Relatório)
- **Bordas Invisíveis:** Muitas tabelas que organizam o cabeçalho (Endereço da Praça, Dados Gerais) não possuem bordas visíveis em todas células (`val: nil`), usando o sistema de tabelas apenos para guiar o esqueleto em grelha fixa [(tblLayout: fixed)](file:///C:/tmp/analyze_resplendor.py#19-23).
- **Margens Internas da célula (Cell Margins):** 70 twips (~1,2 mm) de margem à esquerda e à direita dos textos (afastando levemente da borda da célula).

### B. Tabelas de Quantitativos / Itens (Levantamento Preventivo)
- As tabelas que fecham as fotos e listam os serviços levantados, seguem um rigor estrutural:
  - **Células de Cabeçalho:** Preenchidas nativamente com cor de fundo cinza [(fill=808080)](file:///C:/tmp/analyze_resplendor.py#19-23), com o texto primário na cor sólida negra [(color=000000)](file:///C:/tmp/analyze_resplendor.py#19-23). Alinhamento inferior (`vAlign=bottom`).
  - **GridSpan (Mesclagem):** A  primeira linha indicando o serviço mestre (Ex: "Pintura de piso" / "Pintura acrílica") e frequentemente fundida (Row/Col span).
  - **Bordas de Separação (TblBorders / TcBorders):** Possuem bordas escuras unitárias contínuas (`val: single, sz: 4`).

## 5. Fluxo Narrativo de Elementos (Visual Padrão)

A análise da árvore DOM do documento reflete o design num fluxo repetitivo e padronizado:

1. Início do Documento (`Normal` centralizado pt 12,5 negrito: _"RELATÓRIO TÉCNICO FOTOGRÁFICO"_).
2. Tabela Oculta de Metadados (dados do prédio, contrato).
3. Texto discorrido justificado ou à esquerda informando a constatação (`Normal` / `Corpo de Text`) - em média linhas de texto convencionais.
4. Cabeçalho primário de delimitação de localização (Heading 1 ou 2).
5. Descrição nominal do item que apresentou o problema (Heading 3).
6. **Agrupamento Gráfico:** Elemento Parágrafo Centralizado → Contém Imagem da Foto.
7. **Overlay Magnético:** Imediatamente no fluxo, parágrafos vazios ou amarrados ancorando formas e medidas em metros flutuando em cima da foto anterior.
8. **Fechamento Numérico:** O ciclo se encerra com a inserção da Tabela Sólida de bordas marcadas e fundo cinza totalizando a compilação fotográfica do trecho examinado.
