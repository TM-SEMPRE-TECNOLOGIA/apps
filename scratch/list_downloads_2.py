import os

downloads_dir = r"C:\Users\thiag\Downloads"
print(f"Arquivos no diretório: {downloads_dir} contendo PREVENTIVO")

for entry in os.scandir(downloads_dir):
    if entry.is_file():
        name = entry.name
        if "PREVENTIVO" in name.upper() or "13.12" in name:
            print(f" - {name} (Tamanho: {entry.stat().st_size} bytes)")
