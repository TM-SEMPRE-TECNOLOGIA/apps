# Endpoints Reference (FastAPI Backend) — Auto Relatório

A API roda em `localhost:5000` (uvicorn) e serve primariamente de ponte entre o Frontend React e o Sistema Operacional Windows.

## 1. Scanner de Diretórios

### `POST /api/scan`
Faz o parsing de uma pasta raiz buscando imagens (JPG, PNG) e constrói a hierarquia de sessões.

- **Request Body (JSON):**
  ```json
  {
    "pasta_raiz": "D:/Fotos/Banco XYZ",
    "modo": "Tradicional"
  }
  ```
- **Response `200 OK`:** Retorna um array ordenado (chaves `folder_sort_key`). Elementos tipo `"string"` representam Títulos, elementos tipo `dict` (`{"imagem": "path_absoluto"}`) representam fotos.
- **Errors `400 Bad Request`:** Pasta não encontrada ou acesso negado pelo Windows (Permissions).

## 2. Processador de Documento Word

### `POST /api/generate`
Pega o layout do Frontend e instrui a biblioteca `python-docx` baseada no `template.docx`.

- **Request Body (JSON):**
  ```json
  {
    "pasta_raiz": "D:/Fotos/Banco XYZ",
    "template": "Modelo Base 01.docx",
    "descricao": "Levantamento fotográfico das áreas",
    "imagens": [ ... ]
  }
  ```
- **Fluxo Interno:** Copia o template cru, busca marcadores `{Desc_here}`, edita o cabeçalho, percorre o array inserindo os Strings como "Títulos Heading N" e as imagens redimensionadas (`word_utils.add_image_to_docx`). Salva como `Relatorio_Temp.docx`.
- **Response `200 OK`:** `{"status": "success", "file": "Relatorio_Temp.docx"}`

## 3. Utilidades do Frontend

### `GET /api/thumbnail`
Usado no `<img src="...">` do PreviewGrid para evitar travar o navegador carregando 50 fotos de 10MB ao mesmo tempo.
- **Query Param:** `path` (Base64 Encoded absolute path)
- **Ação:** O Pillow (PIL) abre o arquivo em memória, aplica resize para `200px` usando `LANCZOS`, e joga um stream BytesIO na response no formato JPEG `quality=60`.

### `GET /api/dialog/folder`
Gambiarra de Engenharia (Bridge Mágica). Como Browsers não podem ler Path absoluto por questões de segurança (FakePath string), essa rota dispara o `tkinter.filedialog` direto do Backend Python. Ao abrir a janela nativa por cima do navegador e o técnico selecionar a pasta, a rota responde o path da pasta selecionada.
