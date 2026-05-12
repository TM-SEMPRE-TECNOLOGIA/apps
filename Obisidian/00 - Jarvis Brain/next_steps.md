# 🚀 Próximos Passos (Jarvis) - Centralizado

Última atualização: 19/04/2026 (Sessão de investigação e sincronização do vault)

---

# 🚀 Próximos Passos: Ecossistema SaaS & Consolidação



---

## 📍 Estado Atual do Ecossistema (19/04/2026)

- **Branch atual:** `test`
- **HEAD:** `73758af` — Design System Industrial funcional + trava do wizard
- **TM-OS:** Núcleo implementado (WhatsApp style), frontend Ocean Breeze funcional
- **AutoRelatorio V1:** Estabilizado e funcional (checkpoint 27/03/2026)
- **Vault:** Sincronizado após 22 dias de defasagem

---

## 🏗️ Prioridade P0 — AutoRelatorio v2

A próxima grande evolução é o **AutoRelatorio v2**, com base no brainstorming estruturado em `Ideia desorganizada.md`. A ideia central é transformar o fluxo "um por um" em um workflow intuitivo de cliques.

1. **Detalhes múltiplos por item:** Criar campos Detalhe 1, 2, 3... (ilimitado) que entram direto no documento final.
2. **Editor de Contexto Dinâmico:** Campo opcional onde o usuário adiciona informações que enriquecem o prompt enviado à IA.
3. **Seletor de Itens da Planilha:** O usuário escolhe o item (ex: 17.6 Pintura), e o sistema já monta o prompt base.
4. **Regras MAFFENG automáticas:** Alertas para Fiscal Carol, São Paulo 0908, calha, forro, lâmpadas.
5. **Tela de Progresso:** Animação enquanto o documento Word está sendo gerado.
6. **Editor de Imagem no Modal:** Ao clicar na foto, abre tela cheia com ferramentas (seta, caixa de texto, círculo).

---

## 🏗️ Prioridade P1 — Monorepo e Infraestrutura

1. **Scaffolding do Monorepo (Turborepo):** Organizar `AutoRelatorio_SaaS` e `TM-OS` em workspaces oficiais via `/turbo-mono`.
2. **Setup do Banco de Dados (Supabase/MCP):** Validar Access Token e testar MCP Server para consultas diretas via IA.
3. **Integração Backend:** Conectar `run.py` ao Supabase em vez de depender apenas de pastas locais.

---

## 🧠 Perguntas Estratégicas (Ainda Abertas)

1. **Escalabilidade de Captura:** Como otimizar o upload de fotos do TM-OS para processamento paralelo no backend?
2. **Validação Inteligente:** Integrar visão computacional (Gemini Flash) para validar fotos em tempo real no campo?
3. **Migração Monorepo:** Turborepo é suficiente ou precisamos de `git sparse-checkout` dado o peso (>3.800 arquivos)?

---

## 📌 Contexto da Arquitetura
- **Estado Técnico:** Git Sincronizado (Hash `73758af`), branch `test`.
- **Regra 4.1 (Auto-Scan):** Ativa na Constituição.
- **Obsidian:** Sincronizado em 19/04/2026.
- **PRD AutoRelatorio v2:** Ver `00 - Jarvis Brain/Knowledge/AutoRelatorio_v2_PRD.md`

---

## 📝 Metas para o Próximo Login
1. Definir stack técnica do AutoRelatorio v2 (qual LLM? Quwen, Claude, Gemini Flash?)
2. Mapear todos os itens da planilha que alimentarão o seletor
3. Criar protótipo de tela do fluxo "clique e clique → confirma"
