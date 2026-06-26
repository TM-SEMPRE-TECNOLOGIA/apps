# Lógica de Negócios (Generator & Word Utils) — Auto Relatório

## 1. O Core do Scanner (`generator.py`)
A regra comercial principal do Auto Relatório é transformar hierarquia de pastas em texto do Relatório.
A extração é feita via `os.walk` ou recursividade manual limitando níveis.

### Tratamento de Nomes de Pastas
As pastas vêm cruas do usuário (Ex: `01. Vista Frontal - Loja`).
- A lógica de negócio arranca pre-fixos numéricos (pra evitar repetição redundante se o banco já tiver numeração no Word).
- Transforma em Strings de Hierarquia, por exemplo:
  `Nivel 1: "Subsolo"`
  `Nivel 2: "Bombas"`
  O gerador produz o texto que será renderizado pelo `word_utils.py` como Heading 1 e Heading 2 no MSWord.

### Ordenamento Estrito (Sort Keys)
As fotos nunca chegam em ordem natural das máquinas. O backend usa expressōes regulares em sort keys para organizar os subdiretórios numericamente primeiro e depois alfabeticamente.

## 2. Motor Gráfico de Documentos (`word_utils.py` e `word_utils_sp.py`)
A inserção no modelo `python-docx` requer cautela para *não quebrar o documento pré-impresso*. O script não desenha o Word do zero; ele **copia e complementa**.

### Operações Críticas
1. **Find & Replace:** Identifica marcadores de texto (ex: `[DATA]`, `[TITULO]`, `{Desc_here}`) e aplica strings substitutas mantendo o `Run Font` original.
2. **Adição de Imagens Centradas:**
   Quando a lista atinge o item `{imagem: path}`, o `word_utils`:
   - Lote a imagem para Pillow (`Image.open`).
   - Escala (redimensiona) matematicamente para respeitar a margem (ex: 6.0 Inches de largura).
   - Insere numa tabela centralizada, adicionando margens falsas com parágrafos vazios.
   - Aplica "Tight Fitting" para evitar pulo incorreto de páginas.

## 3. Fluxo de Sessão Única e Limpeza
Ao gerar, o programa escreve os JPEGs na memória e escreve tudo diretamente no `.docx` fechado e salvo no final da rota. Se o usuário estiver com o "Word Aberto travando o arquivo" a exceção de `PermissionError` é deflagrada pro Front exibir "Cuidado, Feche o Relatório Anterior".
