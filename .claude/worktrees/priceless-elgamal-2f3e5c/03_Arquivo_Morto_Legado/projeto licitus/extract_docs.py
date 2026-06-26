import re
import os

with open(r'c:\Users\thiag\LICITUS_BOT\index.html', 'r', encoding='utf-8') as f:
    text = f.read()

docs_match = re.search(r'(<!-- Tech Docs Section.*?)(?=<!-- Footer -->)', text, re.DOTALL)
docs_html = docs_match.group(1) if docs_match else ''

script_match = re.search(r'(<!-- Tab Logic Script -->.*?)(</body>)', text, re.DOTALL)
script_html = script_match.group(1) if script_match else ''

new_content = f"""<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Docs Técnicos (DEV) | Licitus Bot</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script>
        tailwind.config = {{
            theme: {{
                extend: {{
                    colors: {{
                        brand: {{ 50: '#f0fdfa', 100: '#ccfbf1', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 900: '#134e4a' }}
                    }}
                }}
            }}
        }}
    </script>
    <style>
        .tab-content {{ display: none; }}
        .tab-content.active {{ display: block; animation: fadeIn 0.3s ease-in-out; }}
        @keyframes fadeIn {{ from {{ opacity: 0; transform: translateY(10px); }} to {{ opacity: 1; transform: translateY(0); }} }}
        .hide-scrollbar::-webkit-scrollbar {{ display: none; }}
        .hide-scrollbar {{ -ms-overflow-style: none; scrollbar-width: none; }}
        .badge-new {{ font-size: 0.6rem; padding: 1px 6px; border-radius: 9999px; background: #14b8a6; color: white; margin-left: 6px; font-weight: 700; vertical-align: middle; }}
    </style>
</head>
<body class="bg-slate-900 text-slate-300 font-sans antialiased">
    <div class="py-6 bg-slate-950 border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
                <a href="../index.html" class="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-2"><i class="fa-solid fa-arrow-left"></i> Voltar para landing page</a>
                <h1 class="text-2xl font-bold text-white mt-2"><i class="fa-solid fa-toolbox text-brand-500 mr-2"></i>Documentação Técnica (DEV)</h1>
            </div>
            <div class="text-sm text-slate-500">Apenas para desenvolvedores e investidores</div>
        </div>
    </div>
    {docs_html}
    {script_html}
</body>
</html>"""

os.makedirs(r'c:\Users\thiag\LICITUS_BOT\DEV', exist_ok=True)
with open(r'c:\Users\thiag\LICITUS_BOT\DEV\tech_docs.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
