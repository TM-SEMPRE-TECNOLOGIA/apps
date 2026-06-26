import os
import glob

downloads_dir = r"C:\Users\thiag\Downloads"
print(f"Arquivos no diretório: {downloads_dir}")

for entry in os.scandir(downloads_dir):
    if entry.is_file():
        # Filtra apenas por extensões comuns ou tamanho maior que 0
        name = entry.name
        if "tiberio" in name.lower() or "relatorio" in name.lower() or "preventivo" in name.lower() or name.endswith(".docx"):
            print(f" - {name} (Tamanho: {entry.stat().st_size} bytes)")
