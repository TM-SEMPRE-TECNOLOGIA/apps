---
tags: "#jarvis #knowledge #design-system #checkpoint"
project: "TM-MEUS-APPS"
date: 2026-04-21
---

# Checkpoint: Auditoria Design & Stack TM-MEUS-APPS

## 🎯 Sacada Principal
**Design System Industrial TM é base viável.** Azul `#003694` + Laranja `#8a5100` aprovado e ativo em AutoRelatorio V1/V2. Não é quebrado, é funcional. O salto agora é: centralizar tokens, decidir tipografia, implementar dark mode.

## 📊 10 Apps Mapeados

**Ativos (em uso):**
- AutoRelatorio V2 (Next.js 16 + React 19 + Tailwind v4)
- AutoRelatorioV1_Dev (idêntico ao V2)
- squad-docfactory (React 19 + Vite 8)
- OpenSquad Dashboard (React 19 + Phaser 3 — cena 2D)

**Deploy (sem fontes rastreáveis):**
- AutoGerenciador, AutoLevantamento, AutoRelatorio_SaaS

**Legados (minas de ouro):**
- TM-Gerenciador-OS (49 componentes shadcn/ui prontos para migrar)
- Levantamentos-Preventivas (Supabase/Firebase integration)
- Sistema-de-Gestao-Preventivas (Google Cloud Storage + Uppy)

## 🔴 4 Gaps Bloqueadores

1. **Sem design-system centralizado** — cada app tem `globals.css` próprio
   - Solução: criar `packages/design-system/tokens.css` único com `--tm-*` tokens

2. **Tipografia não decidida** — Manrope/Inter (apps ativos) vs Lora/DM Sans (Th Designer define)
   - Bloqueador: precisa decisão com Th Designer antes de proceder

3. **Dark mode ausente** em AutoRelatorio V1/V2
   - Impacto: apps ativos ficam para trás vs legados e ferramentas que têm

4. **V1 e V2 são idênticos** — canibalizam um ao outro
   - Decisão: consolidar, manter só V2 em desenvolvimento ativo

## ✅ Wins da Sessão

- ✅ Squad `tm-apps-design-audit` criado e executado (4 agentes, 1 relatório)
- ✅ Paleta Industrial TM validada como viável
- ✅ 49 componentes legados identificados como reutilizáveis
- ✅ 4 gaps claros e priorizados

## 📋 Backlog — Próxima Sessão

1. **BLOCKER:** Decidir tipografia oficial TM (Manrope vs Lora) com Th Designer
2. Criar `design-system/tokens.css` central com tokens `--tm-*`
3. Implementar dark mode em AutoRelatorio V2
4. Consolidar AutoRelatorio V1/V2 — manter só V2
5. Migrar componentes do TM-Gerenciador-OS conforme necessário
6. Documentar design system em `design-system-decisions.md` (atualmente raso)

## 🔗 Referências e Links Locais

- [Relatório Completo da Auditoria](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/.NEXT%20APPS/TURBO%20DEV/opensquad/squads/tm-apps-design-audit/output/relatorio-design-apps.md)
- [Diário de Dev 21/04/2026](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/brain_obisidian/00%20-%20Jarvis%20Brain/Logs/diario_de_dev_2026-04-21.md)
- [Squad Config](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/.NEXT%20APPS/TURBO%20DEV/opensquad/squads/tm-apps-design-audit/squad.yaml)
- [AutoRelatorio V2 globals.css](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/01_Golden_Apps_meu_uso/AutoRelatorio_V2/APP/frontend/app/globals.css)
- [TM-Gerenciador-OS (49 componentes)](file:///C:/Users/thiag/Desktop/TM-MEUS-APPS/03_Arquivo_Morto_Legado/TM-Gerenciador-OS%20(exemplo%20interface%20e%20funcionalidades)/components/ui/)
