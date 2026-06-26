# Contratos de API (FastAPI) — Auto Relatório

## 1. Módulo Local (localhost:5000/api)
A aplicação Backend atua como provedora de serviços Restful para o Painel do Técnico.
*Note: Como roda inteiramente offline/local e só aceita localhost/127.0.0.1 (CORS estrito), não utilizamos JWT ou chaves de API OAuth.*

---

## 2. Endpoints Core

### 2.1. `POST /api/scan`
O coração do PreviewGrid. Lê a pasta selecionada e dita a ordem das sessões.
**Request:**
```json
{
  "pasta_raiz": "C:/Users/thiag/Fotos Banco XPTO/",
  "modo": "Tradicional"  // Enum: ["Tradicional", "SP"]
}
```
**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    "» Vista ampla",                 // String denota Título H1
    {"imagem": "C:/Fotos/P1.jpg"},   // Obj denotes path absoluto pro img
    "» Área externa → »» Subfaixa",  // String denota Título > Subtitulo (Breadcrumb)
    {"imagem": "C:/Fotos/P2.jpg"}
  ]
}
```

### 2.2. `POST /api/generate`
O gerador do arquivo `.docx` pelo Template.
**Request:**
```json
{
  "pasta_raiz": "C:/Users/thiag/Fotos/",
  "template": "Modelo_Banco_Brasil.docx",
  "descricao": "Levantamento Preventivo Semanal",
  "imagens": [ ... array retornada do scan possivelmente reordenada pelo Front ]
}
```
**Response (200 OK):**
```json
{
  "status": "success",
  "file_url": "/api/download?file=Gerado_102030.docx" // Disponibiliza Link
}
```

### 2.3. `GET /api/thumbnail?id=<base64_path>`
Fornece resize live assíncrono pro Frontend não quebrar RAM (Max 200px resample LANZOS).
**Retorno:**
`IMAGE_BYTES` (Header: `image/jpeg`)

### 2.4. `GET /api/dialog/folder` (Opcional - Tkinter Bridge)
Ativa Diálogo nativo de Janela do Explorer pro técnico "Buscar". Retorna a string do caminho da pasta clicada que será injetada no Input HTML.
