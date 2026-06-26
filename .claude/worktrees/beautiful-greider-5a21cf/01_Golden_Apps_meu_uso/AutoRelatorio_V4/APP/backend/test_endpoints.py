#!/usr/bin/env python
"""Teste dos endpoints da API"""

from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

print("[TEST] Testando endpoints do AutoRelatorio v3.2...\n")

# Test 1: Health endpoint
print("[1/4] Testando /api/health...")
try:
    response = client.get("/api/health")
    print(f"  Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"  Status: {data.get('status')}")
        print(f"  Versao: {data.get('version')}")
        print(f"  Templates: {data.get('templates_available')}")
        print("  [OK] Health endpoint funcionando\n")
    else:
        print(f"  [ERRO] Status {response.status_code}")
        print(f"  Response: {response.text}\n")
except Exception as e:
    print(f"  [ERRO] {e}\n")

# Test 2: List templates
print("[2/4] Testando /api/templates...")
response = client.get("/api/templates")
print(f"  Status: {response.status_code}")
if response.status_code == 200:
    templates = response.json()
    print(f"  Templates encontrados: {len(templates)}")
    if templates:
        print(f"  Primeiro template: {templates[0]}")
    print("  [OK] List templates funcionando\n")
else:
    print(f"  [ERRO] Status {response.status_code}\n")

# Test 3: Get template metadata
print("[3/4] Testando /api/template-placeholders/{template_name}...")
if templates:
    template_name = templates[0]
    response = client.get(f"/api/template-placeholders/{template_name}")
    print(f"  Status: {response.status_code}")
    if response.status_code == 200:
        metadata = response.json()
        print(f"  Template: {metadata.get('name')}")
        print(f"  Agência: {metadata.get('agency')}")
        print(f"  Campos: {len(metadata.get('fields', {}))}")
        print("  [OK] Template metadata funcionando\n")
    else:
        print(f"  [ERRO] Status {response.status_code}\n")

# Test 4: Validate fields
print("[4/4] Testando /api/validate-fields...")
response = client.post("/api/validate-fields", json={
    "template_name": templates[0] if templates else "MODELO - 3575 - TANGARA DA SERRA.docx",
    "nr_os": "1753",
    "data_atendimento": "2026-05-01",
    "agencia_codigo": "3575",
    "agencia_nome": "TANGARA DA SERRA",
    "endereco": "Avenida Brasil, 1000",
    "responsavel_dependencia": "123456 - João Silva"
})
print(f"  Status: {response.status_code}")
if response.status_code == 200:
    result = response.json()
    print(f"  Válido: {result.get('valid')}")
    if result.get('errors'):
        print(f"  Erros: {result.get('errors')}")
    print("  [OK] Validate fields funcionando\n")
else:
    print(f"  [ERRO] Status {response.status_code}\n")

print("[SUCCESS] Todos os endpoints testados!")
