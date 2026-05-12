---
name: turbo-checkpoint
description: |
  Auto-atualizar contexto e checkpoints do repositório. Use SEMPRE que terminar uma sessão de trabalho ou quando disser "salve isso", "checkpoint", "atualizar contexto", ou qualquer variação. Esta skill mantém o repositório sempre com contexto fresco:
  
  - Quando você entra em um chat sobre este repo, ela carrega automaticamente o estado anterior
  - Quando você diz "salve isso" durante o trabalho, ela captura tudo que foi feito (mudanças de arquivo, decisões, próximos passos)
  - Mantém 3 arquivos sincronizados: diario_de_dev.md, CLAUDE.md, e checkpoint_atual.json
  - Extrai estrutura atual do repo, detecta o que mudou, lista próximas tarefas
  - Integra perfeitamente ao seu workflow sem exigir formatação especial
  
  **Contextos de disparo:** relatório preventivo com mudanças, salvar progresso, documentar decisões, capturar estado do repositório, consolidar aprendizados da sessão, atualizar memória do projeto, "salve isso", "checkpoint", "guarda isso", "consolidate".
---

# Skill: Turbo-Checkpoint — Auto-Atualização de Contexto

## Visão Geral

Esta skill automatiza a captura e persistência de contexto do seu repositório TM-MEUS-APPS. Ao invés de você precisar lembrar de fechar uma skill `/turbo-checkpoint` manual, você simplesmente:

1. **Diz "salve isso"** a qualquer momento
2. **A skill captura automaticamente:**
   - O que você estava fazendo
   - Mudanças e decisões tomadas
   - Estado atual de cada módulo/pasta
   - Próximas tarefas (baseado no que falta fazer)
3. **Atualiza 3 arquivos estratégicos:**
   - `diario_de_dev.md` — histórico legível de sessões
   - `CLAUDE.md` — contexto machine-readable para próximo chat
   - `checkpoint_atual.json` — snapshot estruturado do estado

## Como Usar

### Opção 1: Comando Simples (Recomendado)
Simplesmente diga em qualquer ponto da conversa:
- "salve isso"
- "checkpoint"
- "atualizar contexto"
- "guarda isso aí"
- "consolidate"

### Opção 2: Explícito
Se quiser ser mais específico, você pode dizer:
- "salve o progresso de [módulo específico]"
- "atualizar contexto com as mudanças no [arquivo]"
- "capture o estado atual do relatório preventivo"

## O Que a Skill Faz Passo a Passo

### 1️⃣ Analisa Estado Atual do Repositório
A skill varre seu repositório e detecta:
```
✓ Arquivos modificados (últimas 2-3 horas)
✓ Estrutura de diretórios principais
✓ Status de cada módulo:
  - 01_Golden_Apps_meu_uso/ (estado)
  - 02_Golden_Apps_Deploy/ (estado)
  - 03_Arquivo_Morto_Legado/ (estado)
✓ Configurações ativas (.vscode, .obsidian, etc)
✓ Ramo Git atual e commits pendentes
```

### 2️⃣ Extrai Contexto da Sua Conversa
Lê a conversa e captura:
```
✓ Seu objetivo (o que você estava tentando fazer)
✓ Decisões importantes tomadas
✓ Bloqueadores ou observações críticas
✓ Próximas ações recomendadas
✓ Quais arquivos/módulos foram tocados
```

### 3️⃣ Atualiza Três Arquivos Sincronizados

#### Arquivo A: `.claude/logs/diario_de_dev.md`
Nova sessão adicionada seguindo **exatamente seu formato atual**:

```markdown
## 🗓️ Sessão: 29/04/2026
**Status:** Descrição concisa do que foi feito

### ✅ O que foi feito
- Tarefa 1 com detalhe
- Tarefa 2 com detalhe
- Integração com Módulo X

### 🧠 Decisões Tomadas
- Decisão 1 e por quê
- Decisão 2 e impacto

### 📋 Pendências / Backlog
- [ ] Próxima ação 1
- [ ] Próxima ação 2
- [ ] Dependência para sessão seguinte
```

#### Arquivo B: `.claude/CLAUDE.md` (novo)
Contexto estruturado para máquina e humano:

```yaml
# Contexto Persistente — TM-MEUS-APPS
**Última atualização:** 2026-04-29T14:30:00Z
**Próxima sessão deve:**
- [ ] Continuar de: [X]
- [ ] Revisar: [Y]

**Módulos em foco:** [lista]
**Arquivos críticos recentes:** [lista]
**Estado geral:** Verde/Amarelo/Vermelho
```

#### Arquivo C: `.claude/checkpoint_atual.json`
Estrutura machine-readable para scripts/agentes:

```json
{
  "timestamp": "2026-04-29T14:30:00Z",
  "session_date": "29/04/2026",
  "session_summary": "Descrição executiva",
  "objectives_completed": [...],
  "decisions_made": [...],
  "modules_touched": [...],
  "next_actions": [...],
  "files_modified": [...]
}
```

## Workflow na Prática

### Cenário 1: Você Faz Trabalho e Diz "Salve Isso"

```
Você edita relatório-preventivo.docx
Você cria memorial final
Você identifica divergências
Você: "Salve isso"

Skill faz:
  ✅ Detecta que relatório foi editado
  ✅ Vê estrutura atual de arquivos
  ✅ Lê sua conversa (objetivo, decisões)
  ✅ Cria nova sessão em diario_de_dev.md com data/hora
  ✅ Atualiza CLAUDE.md com próximos passos
  ✅ Salva checkpoint_atual.json
  
Você vê:
  ✅ "Checkpoint salvo às 14:30
     📝 Diário atualizado: sessão 29/04/2026
     💾 Contexto persistido para próximo chat"
```

### Cenário 2: Próximo Chat — Contexto Auto-Injetado

```
Você abre novo chat sobre TM-MEUS-APPS
(Você não faz nada, é automático)

Claude vê:
  ✅ Lê CLAUDE.md e últimas 3 sessões de diario_de_dev.md
  ✅ Injeta contexto silenciosamente na memória
  
Resultado:
  "Vejo que na última sessão você estava trabalhando 
   com relatório preventivo. Deixou pendente: [X, Y].
   Quer continuar daqui ou fazer outra coisa?"
```

### Cenário 3: Você Resolve uma Tarefa Pendente

```
Você trabalha e finaliza uma tarefa
Você: "Finalizei a auditoria de divergências"

Skill:
  ✅ Marca como ✅ em diario_de_dev.md
  ✅ Move de "Pendências" para "Feito"
  ✅ Detecta próximas ações bloqueadas
  ✅ Atualiza CLAUDE.md
```

## Formato — Exatamente Como Você Já Usa

✅ **Datas legíveis**: `## 🗓️ Sessão: 29/04/2026`  
✅ **Status em 1 linha**: `**Status:** AutoRelatorio V2 — Refinamento de Formulários`  
✅ **Seções claras**: `### ✅ O que foi feito`, `### 🧠 Decisões`, `### 📋 Pendências`  
✅ **Bullets descritivos**: Não apenas "feito X", mas "feito X porque [motivo]"  
✅ **Checkboxes para tasks**: `- [ ] Próxima ação`  
✅ **Histórico preservado**: Nada é deletado, apenas adicionado  

Você **reconhecerá o formato** — é o mesmo que você já escreve no `diario_de_dev.md`.

## Integração Automática com `/relatorio-preventivo`

Se você estiver usando a skill de relatório preventivo nesta mesma sessão:
- turbo-checkpoint detecta mudanças no .docx
- Registra itens extraídos para memorial
- Captura divergências encontradas
- Adiciona ao checkpoint como "Módulo: Relatório Preventivo"

Ambas skills trabalham juntas naturalmente.

## Por Que Funciona

**Problema original:** 
- Você tinha que lembrar de rodar `/turbo-checkpoint` ao final
- Às vezes esquecia → contexto desatualizado
- Próximo chat começava sem memória

**Solução:**
- Você trabalha naturalmente
- Quando disser qualquer variação de "salve", a skill captura tudo
- 3 arquivos ficam sincronizados
- Próximo chat? Contexto já está lá, injetado automaticamente

## Invocação Automática

A skill ativa quando você:
- Diz "salve isso", "checkpoint", "consolidate", "guarda", "atualizar contexto"
- Trabalha por 20+ minutos e quer consolidar
- Termina um módulo/fase logicamente completa

**Mas você SEMPRE pode invocar manualmente** — é a forma mais confiável.

## Checklist — O Que Esperar

Após usar a skill:
- [ ] ✅ Nova seção adicionada a `diario_de_dev.md`
- [ ] ✅ `CLAUDE.md` criado ou atualizado
- [ ] ✅ `checkpoint_atual.json` salvo
- [ ] ✅ Confirmação visual na chat
- [ ] ✅ Próximo chat carregará contexto automaticamente

Tudo sincronizado. Nenhum trabalho perdido.
