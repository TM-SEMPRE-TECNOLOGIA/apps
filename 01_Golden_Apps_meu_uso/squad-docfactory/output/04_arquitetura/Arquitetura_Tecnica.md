# Arquitetura Técnica — Auto Relatório V1

## 1. Visão Geral da Arquitetura
O sistema opera em um modelo **Desacoplado Local** (Single Node, Dual Process). Não é uma aplicação monolítica. Ele é dividido em dois grandes componentes que conversam via HTTP na interface de rede local (localhost).

**Motivação:** Essa separação permite que o Backend (Python) seja pesado no processamento de imagens e automação Word, enquanto o Frontend (React/Next.js) seja ultrarrápido na pré-visualização.

## 2. Diagrama de Blocos

```
[ Usuário ] -> Interage com Browser (localhost:3000)
    │
    ▼
[ FRONTEND (Next.js) ]
  - Renderiza UI (Tailwind)
  - Chamadas Assíncronas (Axios/Fetch)
    │
    ▼ HTTP GET/POST (CORS Habilitado p/ localhost)
    │
[ BACKEND (FastAPI - localhost:5000) ]
  - Core Logic (Processamento via python-docx / Pillow)
  - Acesso ao File System do SO Windows (Disco Local C:, D:)
```

## 3. Orquestração (O "run.py")
O calcanhar de aquiles de arquiteturas desacopladas locais é que o usuário teria que abrir dois terminais e rodar os servidores separadamente. O script `run.py` resolve isso:
1. Limpa agressivamente portas zumbis `:3000` e `:5000` usando `netstat` e `taskkill` do Windows.
2. Sobe subprocessos (Uvicorn e Next.js/npm) em background.
3. Fica monitorando a pipe stdout para montar uma interface estilo "Mosaico/Terminal" com o pacote `rich`.

## 4. Pilha Tecnológica
- **Backend:** Python 3.10+, FastAPI, Uvicorn (Server), Python-docx (Edição Word), Pillow/PIL (Compressão de Imagens), Tkinter (Diálogos nativos).
- **Frontend:** Node.js, Next.js (App Router), React, TailwindCSS, Framer Motion, Axios.
- **Armazenamento:** Stateless (Nenhum banco de dados. Os "dados" são as pastas lidas no momento do scan).
