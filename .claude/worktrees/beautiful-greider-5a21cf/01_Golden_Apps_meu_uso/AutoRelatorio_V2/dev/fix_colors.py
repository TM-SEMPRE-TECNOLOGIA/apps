import glob

files = glob.glob(r"c:\Users\thiag\TM-MEUS-APPS\.NEXT APPS\AUTO RELATÓRIO\AutoRelatorioV1\APP\frontend\**\*.tsx", recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple semantic color replacements
    content = (content
        .replace('bg-teal-600', 'bg-brand-primary')
        .replace('text-teal-600', 'text-brand-primary')
        .replace('shadow-teal-600/', 'shadow-brand-primary/')
        .replace('ring-teal-600/', 'ring-brand-primary/')
        
        .replace('bg-teal-700', 'bg-brand-secondary')
        .replace('text-teal-700', 'text-brand-secondary')
        .replace('border-teal-600/', 'border-brand-primary/')
        
        .replace('text-teal-500', 'text-brand-primary')
        .replace('bg-teal-500', 'bg-brand-primary')
        .replace('ring-teal-500/', 'ring-brand-primary/')
        .replace('border-teal-500', 'border-brand-primary')
        
        .replace('hover:bg-teal-50', 'hover:bg-slate-100')
        .replace('hover:bg-teal-700', 'hover:bg-brand-secondary')
        
        .replace('text-teal-400', 'text-brand-accent')
    )
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("All static teal classes replaced with design system semantic tokens.")
