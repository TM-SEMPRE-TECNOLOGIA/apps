"""
server_integration.py - Exemplo de como integrar routes.py com server.py

Adicione estas linhas ao seu server.py existente para incluir os novos endpoints.
"""

# ============================================================================
# INTEGRAÇÃO COM FASTAPI SERVER
# ============================================================================

# Em seu server.py, adicione:

"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

# ──────────────────────────────────────────────────────────────────────────
# IMPORTAR ROUTES DE PLACEHOLDERS
# ──────────────────────────────────────────────────────────────────────────

from routes import router as placeholders_router  # ← ADICIONAR ESTA LINHA

# ──────────────────────────────────────────────────────────────────────────
# CRIAR APLICAÇÃO FASTAPI
# ──────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="AutoRelatorio v3.2",
    description="Sistema automático de preenchimento de relatórios Word",
    version="3.2.0"
)

# ──────────────────────────────────────────────────────────────────────────
# CORS (se necessário para desenvolvimento)
# ──────────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adaptar para produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────────────────────────────────
# INCLUIR ROUTES DE PLACEHOLDERS
# ──────────────────────────────────────────────────────────────────────────

app.include_router(placeholders_router)  # ← ADICIONAR ESTA LINHA

# ──────────────────────────────────────────────────────────────────────────
# ROTAS EXISTENTES (manter as rotas já existentes)
# ──────────────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {
        "message": "AutoRelatorio v3.2",
        "version": "3.2.0",
        "endpoints": [
            "/api/templates",
            "/api/template-placeholders/{template_name}",
            "/api/validate-fields",
            "/api/generate-report-with-fields",
            "/api/download/{filename}",
            "/api/health",
            "/docs"  # Swagger UI
        ]
    }

@app.get("/docs")
def get_docs():
    return {
        "message": "Acesse http://localhost:8000/docs para Swagger UI",
        "info": "Documentação interativa dos endpoints"
    }

# ──────────────────────────────────────────────────────────────────────────
# EXECUTAR SERVIDOR (se este for o arquivo principal)
# ──────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,  # Desenvolvimento
        log_level="info"
    )
"""

# ============================================================================
# CHECKLIST DE INTEGRAÇÃO
# ============================================================================

INTEGRATION_CHECKLIST = """
✅ Checklist de Integração com server.py

1. Importação:
   [ ] Adicionar: from routes import router as placeholders_router
   
2. Incluir Routes:
   [ ] Adicionar: app.include_router(placeholders_router)
   
3. CORS (se necessário):
   [ ] Adicionar middleware CORS
   
4. Testar:
   [ ] curl http://localhost:8000/api/templates
   [ ] curl http://localhost:8000/api/health
   [ ] Acessar http://localhost:8000/docs (Swagger UI)
   
5. Validar:
   [ ] Todos os 7 endpoints funcionando
   [ ] Banco de templates acessível
   [ ] Outputs directory criado
   [ ] Permissões de arquivo corretas
"""

print(INTEGRATION_CHECKLIST)
