#!/usr/bin/env python3
import subprocess
import sys
import os
import time

os.chdir(r"C:\Users\thiag\Desktop\TM-MEUS-APPS")

print("\n" + "="*60)
print("GIT ADD E PUSH - TM-MEUS-APPS")
print("="*60 + "\n")

# Remover lock
lock_file = r".git\index.lock"
if os.path.exists(lock_file):
    print("[1/5] Removendo lock file...")
    try:
        os.remove(lock_file)
        time.sleep(2)
    except:
        pass

# Adicionar pasta 01
print("[2/5] Adicionando pasta 01_Golden_Apps_meu_uso...")
print("      (isto pode levar 2-3 minutos, aguarde...)")
try:
    result = subprocess.run(
        ["git", "add", "01_Golden_Apps_meu_uso/"],
        capture_output=True,
        timeout=300,
        text=True
    )
    if result.returncode == 0:
        print("      ✓ Pasta 01 adicionada")
    else:
        print(f"      ✗ Erro: {result.stderr}")
except subprocess.TimeoutExpired:
    print("      ✗ Timeout ao adicionar pasta 01")
    sys.exit(1)

# Adicionar pasta 03
print("[3/5] Adicionando pasta 03_Arquivo_Morto_Legado...")
print("      (isto pode levar 2-3 minutos, aguarde...)")
try:
    result = subprocess.run(
        ["git", "add", "03_Arquivo_Morto_Legado/"],
        capture_output=True,
        timeout=300,
        text=True
    )
    if result.returncode == 0:
        print("      ✓ Pasta 03 adicionada")
    else:
        print(f"      ✗ Erro: {result.stderr}")
except subprocess.TimeoutExpired:
    print("      ✗ Timeout ao adicionar pasta 03")
    sys.exit(1)

# Status
print("[4/5] Verificando status...")
result = subprocess.run(["git", "status", "--short"], capture_output=True, text=True)
print(result.stdout)

# Commit
print("[5/5] Fazendo commit...")
result = subprocess.run(
    ["git", "commit", "-m", "chore: adicionar conteudo completo das pastas 01 e 03"],
    capture_output=True,
    text=True
)
if result.returncode == 0:
    print("      ✓ Commit realizado")
    print(result.stdout[:200])
else:
    print(f"      ✗ Erro: {result.stderr}")
    sys.exit(1)

# Push
print("\n[6/6] Fazendo push para GitHub...")
print("      (aguarde a conclusão...)")
result = subprocess.run(
    ["git", "push", "origin", "test", "-v"],
    capture_output=True,
    timeout=300,
    text=True
)
if result.returncode == 0:
    print("      ✓ Push concluído com sucesso!")
    print("\n" + "="*60)
    print("✓ TUDO ENVIADO PARA O GITHUB!")
    print("="*60)
    print("\nVerifique em:")
    print("https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS/tree/test")
else:
    print(f"      ✗ Erro no push: {result.stderr}")
    sys.exit(1)

print("\n")
