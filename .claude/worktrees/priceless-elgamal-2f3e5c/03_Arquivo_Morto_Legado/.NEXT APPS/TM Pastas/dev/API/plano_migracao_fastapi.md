# Plano de Migração: Flask para FastAPI

Este documento descreve o plano para substituir a API backend atual (implementada em Flask) por FastAPI. A alteração deve preservar a interface existente para o front‑end e documentar todos os passos necessários.

## Objetivo

Substituir a API backend em **Flask** por **FastAPI**, mantendo a mesma interface usada pelo React:

- `GET /api/select-folder`
- `POST /api/rename-folders` (com JSON contendo a lista `updates`)

O front‑end não deve precisar de nenhuma modificação além de possíveis ajustes em documentação.

## Passos da migração

1. **Atualizar dependências**
   - Remover `flask` e `flask-cors` de `requirements.txt`.
   - Adicionar `fastapi`, `uvicorn` (e outras bibliotecas opcionais, como `python-multipart` ou `pydantic` se necessário).
   - Ajustar scripts de inicialização (`executar_app.bat`, etc.) para iniciar a aplicação com `uvicorn`.

2. **Reescrever `backend/api.py`**
   - Importar a partir de `fastapi` e criar `app = FastAPI()`.
   - Configurar CORS usando `CORSMiddleware` em vez de `flask_cors`.
   - Converter as rotas para o estilo do FastAPI (podem ser `async def` ou funções normais).
   - Definir modelos Pydantic para entradas, e usar `HTTPException` para erros.
   - Manter as funções utilitárias existentes (`build_directory_tree`, `extract_prefix_and_name`) inalteradas.
   - Substituir o bloco de execução direta (`if __name__ == '__main__':`) por chamada a `uvicorn.run(...)`.

3. **Front‑end e referências**
   - Procurar no código React por qualquer menção explícita a "Flask"; deve ser retornado vazio.
   - Garantir que os endpoints utilizados permaneçam os mesmos. Nenhuma alteração adicional deve ser necessária, mas atualizar qualquer documentação que mencione Flask.

4. **Testar e validar**
   - Executar a API localmente com `uvicorn` e chamar os endpoints via navegador ou Postman.
   - Verificar se o CORS está configurado para permitir solicitações do aplicativo React (`allow_origins=["*"]`).
   - Testar o diálogo de seleção de pasta via subprocesso para garantir que não há regressão.

5. **Documentação**
   - Atualizar `requirements.txt`, `executar_app.bat` e README para refletir o novo stack (FastAPI + uvicorn).
   - Incluir menção ao `/docs` e `/redoc` gerados automaticamente pelo FastAPI.

6. **Melhorias opcionais**
   - Usar validação de modelo com Pydantic para as respostas também, proporcionando documentação automática.
   - Extrair código de subprocesso para um módulo separado se quiser organização maior.

> 📌 **Nota:** este documento também serve como lembrete de que é necessário atualizar o `commit.html` correspondente e criar um `walkthrough.md` da migração. Essas ações devem ser concluídas junto com a implementação.

---

## Atualização de outros arquivos

- O arquivo `dev/commit.html` (ou outro `commit.html` relevante) precisa receber uma entrada descrevendo a migração para FastAPI.
- Criar um `walkthrough.md` específico relatando os passos da migração e quaisquer detalhes úteis para futuros desenvolvedores.


---

Feito o planejamento, os próximos passos são implementar as alterações no código e documentá‑las de acordo.
