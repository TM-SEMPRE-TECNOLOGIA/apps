# 🎭 Squad: MetaAds-Elite (Orquestração Local)

Este squad emula as 5 skills do Claude Code para quem não tem API, usando a inteligência do Antigravity.

## Pipeline de Execução

1. **Investigação (Sherlock):**
   - Executa `/spy` via Navegador/Pesquisa.
   - Gera o `Gap-Report.md`.

2. **Criação (Copy-Gen):**
   - Executa `/bulk-creative` baseado no Gap-Report.
   - Gera 20 variações de copy no arquivo `output/creatives.md`.

3. **Validação (Score-Auditor):**
   - Executa `/ads-score` em cada copy gerada.
   - Atribui nota 0-10 e sugere ajustes.

4. **Estratégia (Meta-Strategist):**
   - Define o setup de Bid Cap para a oferta.
   - Gera o guia de implementação no Gerenciador de Anúncios.

---
*Configurado para rodar no Antigravity e Claude Code Pro UI.*
