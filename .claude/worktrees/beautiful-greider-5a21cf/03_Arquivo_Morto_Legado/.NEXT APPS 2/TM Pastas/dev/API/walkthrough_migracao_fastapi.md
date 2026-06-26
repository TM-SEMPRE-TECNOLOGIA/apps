# Walkthrough da Migração de Flask para FastAPI

Este documento acompanha a execução prática do plano de migração para FastAPI.

## Etapas Concluídas

1. **Dependências** — Atualizei `requirements.txt`, removendo `flask`/`flask-cors` e adicionando `fastapi` e `uvicorn`.
2. **Reescrita do Backend** — Reescrevi `backend/api.py` para usar FastAPI:
   - `app = FastAPI()` com metadata (título, versão, descrição).
   - CORS configurado via `CORSMiddleware` com `allow_origins=["*"]`.
   - Modelos Pydantic: `RenameItem` e `RenameRequest` para validação de entrada.
   - Erros tratados com `HTTPException` em vez de `jsonify + status code`.
   - Funções utilitárias (`build_directory_tree`, `extract_prefix_and_name`) preservadas sem alteração.
   - Bloco `if __name__` agora chama `uvicorn.run()`.
3. **Script de Inicialização** — Ajustei `executar_app.bat`:
   - Comando alterado de `python backend/api.py` para `uvicorn backend.api:app --host 0.0.0.0 --port 5000`.
   - Versão atualizada para v2.1.0 (React + FastAPI).
   - Mensagem de inicialização agora menciona `/docs` do FastAPI.
4. **Frontend** — Verificado: nenhuma referência a Flask encontrada no código React. Os endpoints chamados pelo frontend permanecem idênticos (`localhost:5000/api/select-folder` e `localhost:5000/api/rename-folders`).
5. **Validação** — Servidor iniciado com `uvicorn`, OpenAPI schema acessado com sucesso em `/openapi.json`, confirmando os dois endpoints registrados com validação Pydantic.
6. **Documentação** — Registro de commit adicionado ao `dev/commit.html` (Commit 16). Este walkthrough atualizado.

## Endpoints Disponíveis

| Método | Rota                   | Descrição                                |
|--------|------------------------|------------------------------------------|
| GET    | `/api/select-folder`   | Abre diálogo nativo e retorna árvore     |
| POST   | `/api/rename-folders`  | Aplica renomeação segura (two-stage)     |
| GET    | `/docs`                | Swagger UI (documentação interativa)     |
| GET    | `/redoc`               | ReDoc (documentação alternativa)         |
| GET    | `/openapi.json`        | Schema OpenAPI em JSON                   |

## Notas

- O CORS está configurado para aceitar qualquer origem (`*`), adequado para desenvolvimento local.
- A lógica de renomeação em dois estágios (temp UUID → nome final) foi preservada integralmente.
- Nenhuma alteração foi necessária no frontend React.
