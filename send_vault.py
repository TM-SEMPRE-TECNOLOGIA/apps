import urllib.request
import ssl
import os

content = """---
Tags: #jarvis #knowledge #deep-memory #audit #refactor
Project: TM-MEUS-APPS Ecossistema
Date: 2026-04-23
---

## Sacada: Repositório com 3+ camadas de config duplicada

O repo TM-MEUS-APPS acumulou sistemas de config sobrepostos ao longo de migrações:
`.agent/` → `.agents/` → `.jarvis/` → `.claude/skills/` (atual)

**Cada migração deixou o anterior como zumbi.**

### O que ficou para limpar
- `.agent/skills/` — cópia obsoleta de `.claude/skills/` (~50MB)
- `.jarvis/` em 02_Golden e 03_Arquivo — desatualizados, sem uso
- `.jarvis/` em 01_Golden — era legada, revisar `th-design-squad.md` antes de deletar
- `03_Arquivo_Morto_Legado/` — ~500MB, arquivar em HD externo

### Estrutura atual válida
```
.claude/skills/         ← fonte única de verdade
.agents/logs/           ← diário ativo (consolidar aqui)
01_Golden_Apps/.context/ ← contextos vivos por versão
```

### Regra aprendida
> Toda vez que migrar sistema de agentes, **deletar o anterior imediatamente.** Zumbis acumulam.

## Referências e Links Locais

- [Relatório Completo da Auditoria](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/AUDITORIA_DUPLICIDADE_2026-04-23.md)
- [Diário de Dev](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/.agents/logs/diario_de_dev.md)
- [.claude/skills/ — fonte atual](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/.claude/skills/)
- [.jarvis/ legado (01_Golden)](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/01_Golden_Apps_meu_uso/.jarvis/)
"""

url = "https://127.0.0.1:27124/vault/00%20-%20Jarvis%20Brain/Knowledge/checkpoint-audit-duplicidade-2026-04-23.md"
token = "027b0d0239482fd17101036e7e40709c649a28ce603abc0cffcd2b8f7c45eda0"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

data = content.encode('utf-8')
req = urllib.request.Request(url, data=data, method='PUT')
req.add_header('Authorization', f'Bearer {token}')
req.add_header('Content-Type', 'text/markdown')

try:
    with urllib.request.urlopen(req, context=ctx) as resp:
        print(f"Status: {resp.status}")
        if resp.status == 204:
            print("✅ Nota salva no Obsidian com sucesso.")
            os.remove(__file__)
except Exception as e:
    print(f"❌ Erro: {e}")
