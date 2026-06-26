---
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
.agents/logs/           ← diário ativo
01_Golden_Apps/.context/ ← contextos vivos por versão
```

### Regra aprendida
> Toda vez que migrar sistema de agentes, **deletar o anterior imediatamente.** Zumbis acumulam.

## Referências e Links Locais

- [Relatório Completo da Auditoria](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/AUDITORIA_DUPLICIDADE_2026-04-23.md)
- [Diário de Dev](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/.agents/logs/diario_de_dev.md)
- [.claude/skills/ — fonte atual](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/.claude/skills/)
- [.jarvis/ legado (01_Golden)](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/01_Golden_Apps_meu_uso/.jarvis/)
