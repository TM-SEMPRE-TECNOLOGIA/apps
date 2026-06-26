# 🧠 Skills de Elite: Meta Ads (Emulação Antigravity)

Este arquivo contém a lógica das 5 skills do "Nerd AI Guy" adaptadas para o modo local.

---

### /spy (Espião de Concorrentes)
**Lógica:** Usar o navegador para acessar a Ad Library e extrair padrões.
**Prompt Interno:** 
"Acesse a Biblioteca de Anúncios do Facebook para o domínio [TARGET]. Identifique:
1. Anúncios rodando há mais de 30 dias (Winners).
2. Padrão de Headlines e CTAs.
3. Formato dos criativos (Vídeo vs Imagem)."

---

### /competitive-ads-extractor (Gap Report)
**Lógica:** Comparar 3-5 concorrentes e achar o que ninguém está dizendo.
**Prompt Interno:**
"Compare os anúncios de [LISTA DE CONCORRENTES]. Crie uma tabela de 'Ângulos Emocionais'. Identifique o 'Espaço Vazio' (Ângulo inexplorado) e sugira uma nova promessa matadora."

---

### /bulk-creative (Volume de Copy)
**Lógica:** Gerar 20 variações baseadas no CLAUDE.md ou company.md.
**Prompt Interno:**
"Gere 20 variações de copy seguindo a proporção:
- 7 Curtas (Direto ao ponto, foco em curiosidade).
- 8 Médias (Problema -> Agitação -> Solução).
- 5 Longas (Storytelling/Prova Social).
Use o tom de voz do Guilherme Franklim."

---

### /ads-score (Auditoria de Criativo)
**Lógica:** Pontuar de 1-10 em 6 dimensões.
**Prompt Interno:**
"Avalie o criativo [CRIATIVO] em:
1. Hook (Gancho inicial)
2. CTA (Chamada)
3. Visual
4. Emoção
5. Oferta
6. Confiança
Dê uma nota final e 3 sugestões práticas de melhoria."

---

### /ads-meta (Estratégia de Conta)
**Lógica:** Checklist de 186 pontos (Simulado).
**Prompt Interno:**
"Analise o setup da conta: 1. Sobreposição de Público? 2. Fadiga Criativa? 3. CBO vs ABO? Gere um Health Score e o Roadmap de ajustes prioritários."
