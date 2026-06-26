#!/usr/bin/env python
"""Teste rápido de imports - verificar se tudo está funcionando"""

print("[TEST] Iniciando verificação de imports...")

try:
    print("[1/5] Importando word_utils...")
    from word_utils import (
        extract_placeholders,
        substitute_placeholders,
        get_template_metadata,
        validate_substitutions,
        inserir_conteudo,
        analisar_imagem,
        otimizar_layout,
        aplicar_estilo,
        substituir_placeholders
    )
    print("  [OK] word_utils importado")

except ImportError as e:
    print(f"  [ERRO] Falha ao importar word_utils: {e}")
    exit(1)

try:
    print("[2/5] Importando generator...")
    from generator import build_content_from_root, generate_report, RunResult
    print("  [OK] generator importado")

except ImportError as e:
    print(f"  [ERRO] Falha ao importar generator: {e}")
    exit(1)

try:
    print("[3/5] Importando routes...")
    from routes import router as placeholders_router
    print("  [OK] routes importado")

except ImportError as e:
    print(f"  [ERRO] Falha ao importar routes: {e}")
    exit(1)

try:
    print("[4/5] Importando server...")
    from server import app
    print("  [OK] server importado")

except ImportError as e:
    print(f"  [ERRO] Falha ao importar server: {e}")
    exit(1)

try:
    print("[5/5] Verificando templates...")
    from pathlib import Path
    templates_dir = Path(__file__).parent / "templates"
    templates = list(templates_dir.glob("*.docx"))
    print(f"  [OK] {len(templates)} templates encontrados")

except Exception as e:
    print(f"  [ERRO] Falha ao verificar templates: {e}")
    exit(1)

print("\n[SUCCESS] Todos os imports funcionando corretamente!")
print("[INFO] O servidor pode ser iniciado com: uvicorn server:app --reload")
