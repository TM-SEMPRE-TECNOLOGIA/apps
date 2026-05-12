# TM — Gerador de Relatório Fotográfico (Tkinter)

App local (Windows) para gerar relatório Word a partir de uma **pasta raiz de fotos** + **modelo DOCX**.

## Entradas
- **Pasta raiz**: estrutura de pastas + imagens (`.jpg`, `.jpeg`, `.png`)
- **Modelo Word**: `.docx` com a marca `{{start_here}}` (ponto de inserção do conteúdo)
- **Pasta de saída**: onde salvar o relatório e logs

## Saídas
- `RELATÓRIO FOTOGRÁFICO - <NOME_DA_PASTA_RAIZ> - LEVANTAMENTO PREVENTIVO.docx`
- `process_log.txt` (log detalhado)
- `erros_pastas.txt` (log de erros de leitura/arquivos)

## Como rodar
1. Extraia a pasta do projeto.
2. Dê duplo clique em `run_app.bat`.
3. Selecione:
   - Pasta raiz (fotos)
   - Modelo DOCX
   - Pasta de saída
4. Clique em **Gerar**.

O app abrirá uma tela de **pré-visualização** permitindo mover/excluir/editar antes de gerar o Word final.

## Observações
- O layout no Word tenta agrupar imagens verticais em tabelas (2 ou 3 colunas) quando possível.
- Ao final de cada pasta, o app insere uma **quebra de página**.

## Estrutura
- `app.py` -> interface principal
- `generator.py` -> monta o conteúdo, chama preview e gera DOCX
- `ui_preview.py` -> pré-visualização (edição/mover/excluir)
- `word_utils.py` -> inserção no Word + otimização de layout
