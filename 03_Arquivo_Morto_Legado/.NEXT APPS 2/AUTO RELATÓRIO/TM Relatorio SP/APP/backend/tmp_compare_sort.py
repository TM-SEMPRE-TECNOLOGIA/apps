import re

ORDEM_PASTAS = ["- Área externa", "- Área interna", "- Segundo piso"]

def _natural_sort_key(name: str):
    match = re.match(r'^(\d+)(.*)', name)
    if match:
        return (int(match.group(1)), match.group(2))
    return (float('inf'), name)

# Como é hoje no gerador tradicional
def sort_tradicional(dirs, is_root=False):
    if is_root:
        dirs.sort(
            key=lambda x: (
                ORDEM_PASTAS.index(x) if x in ORDEM_PASTAS else len(ORDEM_PASTAS),
                _natural_sort_key(x),
            )
        )
    else:
        dirs.sort(key=_natural_sort_key)
    return list(dirs)

# Como era no legado (auto.py na pasta Compare)
def sort_legado(dirs, is_root=False):
    if is_root:
        dirs.sort(key=lambda x: (
            ORDEM_PASTAS.index(x) if x in ORDEM_PASTAS else len(ORDEM_PASTAS),
            x
        ))
    else:
        # Legado não ordenava subpastas. O Windows as envia em ordem alfabética.
        dirs.sort()
    return list(dirs)

# Nova Proposta
def sort_perfeito(dirs, is_root=False):
    def key_func(name: str):
        name_lower = name.lower()
        if "vista ampla" in name_lower:
            return (0, name_lower)
        
        match = re.match(r'^(\d+)(.*)', name)
        if match:
            return (1, int(match.group(1)), match.group(2))
            
        if "detalhes" in name_lower:
            return (3, name_lower)
            
        return (2, name_lower)

    if is_root:
        dirs.sort(
            key=lambda x: (
                0 if x == "- Vista ampla" else 1,
                ORDEM_PASTAS.index(x) if x in ORDEM_PASTAS else len(ORDEM_PASTAS),
                key_func(x),
            )
        )
    else:
        dirs.sort(key=key_func)
    return list(dirs)

def generate_comparativo_html(output_path):
    amostras = [
        ["01.02 - Elétrica", "01.01 - Pintura", "- Vista ampla", "- Detalhes"],
        ["Escadaria", "02 - Cozinha", "- Vista ampla", "01 - Garagem"],
        ["- Vista ampla", "- Detalhes", "01.01 - Piso"],
    ]
    
    html = """
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Comparativo de Ordenação de Pastas - TM Relatório</title>
        <style>
            :root {
                --primary: #2563eb;
                --bg: #f8fafc;
                --card-bg: #ffffff;
                --text: #1e293b;
                --border: #e2e8f0;
            }
            body { 
                font-family: 'Inter', sans-serif; 
                background: var(--bg); 
                color: var(--text); 
                margin: 0; 
                padding: 40px; 
            }
            .container { max-width: 1200px; margin: 0 auto; }
            h1 { color: #0f172a; border-bottom: 2px solid var(--primary); padding-bottom: 10px; }
            .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 30px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
            h2 { margin-top: 0; color: var(--primary); }
            .grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; }
            .list-box { background: #f1f5f9; padding: 15px; border-radius: 8px; }
            .list-box h3 { margin-top: 0; font-size: 0.9rem; text-transform: uppercase; color: #64748b; }
            ul { list-style: none; padding: 0; margin: 0; }
            li { padding: 8px 12px; background: #fff; border: 1px solid #e2e8f0; margin-bottom: 4px; border-radius: 4px; font-family: monospace; font-size: 0.85rem;}
            .highlight-va { border-left: 4px solid #10b981; background: #f0fdf4; } 
            .highlight-det { border-left: 4px solid #f59e0b; background: #fffbeb; } 
            .highlight-num { border-left: 4px solid #3b82f6; background: #eff6ff; }
            .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 0.8rem; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: bold; margin-left: 5px; }
            .badge-va { background: #dcfce7; color: #166534; }
            .badge-det { background: #fef3c7; color: #92400e; }
            .badge-num { background: #dbeafe; color: #1e40af; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Comparativo de Ordenação (Leitor de Pastas)</h1>
            <p>Comparando o modo atual (Tradicional), o Legado, e a Nova Proposta Perfeita.</p>
    """
    
    def format_li(d):
        c = "highlight-va" if "vista ampla" in d.lower() else "highlight-det" if "detalhes" in d.lower() else "highlight-num" if re.match(r'^\d', d) else ""
        b = "<span class='badge badge-va'>VA</span>" if "vista" in d.lower() else "<span class='badge badge-det'>DET</span>" if "detalhes" in d.lower() else "<span class='badge badge-num'>SRV</span>" if re.match(r'^\d', d) else ""
        return f'<li class="{c}">{d} {b}</li>'

    for i, original in enumerate(amostras):
        html += f"""
        <div class="card">
            <h2>Cenário {i+1}: Subpastas internas</h2>
            <div class="grid">
                <div class="list-box">
                    <h3>Entrada sem ordem</h3>
                    <ul>{''.join(f'<li>{d}</li>' for d in original)}</ul>
                </div>
                
                <div class="list-box">
                    <h3>Modo Legado</h3>
                    <ul>{''.join(format_li(d) for d in sort_legado(list(original)))}</ul>
                    <p style="font-size: 0.75rem; color: #64748b; margin-top: 10px;"><em>Dependia do Windows (ordem alfabética): hífen vem antes de número. Logo 'Detalhes' vinha antes da pintura também!</em></p>
                </div>

                <div class="list-box">
                    <h3>Tradicional (Atual)</h3>
                    <ul>{''.join(format_li(d) for d in sort_tradicional(list(original)))}</ul>
                    <p style="font-size: 0.75rem; color: #64748b; margin-top: 10px;"><em>Problema atual: Joga 'Vista ampla' e 'Detalhes' pro fim (ambos sem número).</em></p>
                </div>

                <div class="list-box" style="background: #e0f2fe; border: 1px solid #bae6fd;">
                    <h3 style="color: #0369a1;">Nova Proposta Perfeita</h3>
                    <ul>{''.join(format_li(d) for d in sort_perfeito(list(original)))}</ul>
                    <p style="font-size: 0.75rem; color: #0369a1; margin-top: 10px;"><em>Garante: Vista Ampla -> Serviços Numerados -> Outros -> Detalhes.</em></p>
                </div>
            </div>
        </div>
        """
        
    html += """
        </div>
    </body>
    </html>
    """
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"HTML gerado em: {output_path}")

if __name__ == "__main__":
    import os
    target = r"C:\Users\thiag\TM-MEUS-APPS\0 - NEXT APPS\TM Relatorio SP\comparativo_ordenacao.html"
    generate_comparativo_html(target)
