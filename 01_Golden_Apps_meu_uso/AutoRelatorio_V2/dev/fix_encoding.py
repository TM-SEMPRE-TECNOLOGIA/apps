import glob

files = glob.glob(r"c:\Users\thiag\TM-MEUS-APPS\.NEXT APPS\AUTO RELATÓRIO\AutoRelatorioV1\APP\frontend\**\*.tsx", recursive=True)

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
            
    replacements = {
        'Ã¡': 'á', 'Ã§': 'ç', 'Ã£': 'ã', 'Ã³': 'ó', 'Ã©': 'é', 
        'Ã­': 'í', 'Ãµ': 'õ', 'Ã¢': 'â', 'Ãª': 'ê', 'Ã€': 'À', 
        'Ã“': 'Ó', 'Â²': '²', 'â€œ': '"', 'â€ ': '"', 'Â»': '»',
        'Ãº': 'ú', 'Ã‡': 'Ç', 'Ã‰': 'É'
    }
    
    modified = False
    for k, v in replacements.items():
        if k in content:
            content = content.replace(k, v)
            modified = True
            
    if modified:
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed {file}")
