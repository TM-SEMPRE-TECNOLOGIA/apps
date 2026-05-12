#!/usr/bin/env python
"""Debug de templates e funções word_utils"""

from pathlib import Path
from word_utils import extract_placeholders, get_template_metadata

print("[DEBUG] Testando word_utils com templates...\n")

templates_dir = Path(__file__).parent / "templates"
template_name = "MODELO - 3575 - TANGARA DA SERRA.docx"
template_path = templates_dir / template_name

print(f"[1] Verificando arquivo:")
print(f"    Path: {template_path}")
print(f"    Exists: {template_path.exists()}")
print()

if not template_path.exists():
    print("[ERROR] Template não encontrado!")
    print(f"Templates disponíveis:")
    if templates_dir.exists():
        for f in templates_dir.glob("*.docx"):
            print(f"  - {f.name}")
    exit(1)

print(f"[2] Testando extract_placeholders():")
try:
    extracted = extract_placeholders(str(template_path))
    print(f"    Total found: {extracted['total_found']}")
    print(f"    Total expected: {extracted['total_expected']}")
    print(f"    Missing: {extracted['missing']}")
    print(f"    Extra: {extracted['extra']}")
    print(f"    Placeholders: {extracted['placeholders']}")
    print()
except Exception as e:
    print(f"    [ERROR] {e}")
    print()

print(f"[3] Testando get_template_metadata():")
try:
    metadata = get_template_metadata(template_name)
    print(f"    Name: {metadata['name']}")
    print(f"    Code: {metadata['code']}")
    print(f"    Agency: {metadata['agency']}")
    print(f"    Fields: {len(metadata['fields'])}")
    for field_name, field_info in metadata['fields'].items():
        print(f"      - {field_name}: {field_info['label']}")
    print()
except Exception as e:
    print(f"    [ERROR] {e}")
    print()

print("[SUCCESS] Debug completo!")
