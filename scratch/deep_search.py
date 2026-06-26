import os
import fnmatch

search_dirs = [
    r"C:\Users\thiag\Desktop",
    r"C:\Users\thiag\Documents",
    r"C:\Users\thiag\Downloads"
]

print("Pesquisando arquivos *TIBERIO*.docx no computador...")
found_any = False

for s_dir in search_dirs:
    if not os.path.exists(s_dir):
        continue
    print(f"\nBuscando em {s_dir}...")
    for root, dirs, files in os.walk(s_dir):
        # Evita entrar em pastas ocultas ou muito grandes desnecessárias
        dirs[:] = [d for d in dirs if not d.startswith('.') and d.lower() not in ['node_modules', 'venv', 'env', 'appdata']]
        for filename in fnmatch.filter(files, '*TIBERIO*.docx'):
            filepath = os.path.join(root, filename)
            try:
                size = os.path.getsize(filepath)
                print(f" -> Encontrado: {filepath} (Tamanho: {size} bytes)")
                found_any = True
            except Exception as e:
                print(f" -> Encontrado {filepath} mas erro ao ler tamanho: {e}")

if not found_any:
    print("\nNenhum arquivo correspondente com tamanho > 0 encontrado nos caminhos padrão.")
