---
name: auto-chat-naming
description: |
  Gera nomes automáticos em português para novos chats. Quando o usuário inicia um novo chat ou pede sugestão de nome, analisa a tarefa proposta e sugere 3 nomes seguindo padrão PT-BR com verbo + descrição + status opcional.
  
  Dispara quando: usuário abre novo chat, pede "qual nome para este chat?", "sugira um nome", "como deveria chamar isso?", ou naturalmente ao detectar novo chat vazio com primeiro prompt.
  
  Sempre use este skill quando há um novo chat sendo criado ou o usuário pede naming de chat/sessão/projeto.
compatibility: None
---

# Auto Chat Naming — Skill

## Propósito

Manter seus chats nomeados **consistentemente em português**, com nomenclatura clara e status visível. Em vez de chats com nomes genéricos em inglês ou sem status, você passa a ter chats organizados com padrão: `[Verbo] [O que faz] ([Status])`.

## Como Funciona

### Fluxo Natural

```
┌─────────────────────────────┐
│  Usuário abre novo chat     │
│  Escreve primeiro prompt    │
│  em português               │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│  Claude detecta novo chat   │
│  e primeiro prompt          │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│  Gera 3 sugestões PT-BR     │
│  com verbo + descrição +    │
│  status                     │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│  Usuário escolhe ou adapta  │
│  uma das sugestões          │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│  Chat é nomeado com esse   │
│  padrão fixo               │
└─────────────────────────────┘
```

### Padrão de Nomenclatura

**Formato obrigatório:**
```
[Verbo PT-BR em infinitivo] [Descrição concisa] ([Status opcional])
```

**Exemplos válidos:**
- ✅ `Implementar placeholders nos templates Word (BLOQUEANTE)`
- ✅ `Analisar performance do drag-and-drop (CONTINUAR)`
- ✅ `Revisar código do repositório`
- ✅ `Corrigir lógica de ordenação (EM PROGRESSO)`
- ✅ `Otimizar bundles do webpack`

**Exemplos INVÁLIDOS (não usar):**
- ❌ `Plan Auto Relatorio v3.2` (inglês)
- ❌ `quick summary of auto-report versions` (inglês demais)
- ❌ `create new cowork plugin` (englês)
- ❌ `Implementar` (descrição faltando)

## Verbos Recomendados (escolha 1 por sugestão)

Escolha verbos que refletem exatamente a ação:

| Verbo | Contexto | Exemplo |
|-------|----------|---------|
| **Implementar** | Codificar nova feature | Implementar modo organizar |
| **Analisar** | Investigar, entender, diagnosticar | Analisar performance do app |
| **Revisar** | Code review, inspecionar | Revisar qualidade do código |
| **Criar** | Gerar documento, design, arquivo | Criar mockup da tela |
| **Corrigir** | Fix bug, resolver problema | Corrigir lógica de ordenação |
| **Otimizar** | Melhorar performance, eficiência | Otimizar bundles |
| **Refatorar** | Reorganizar código existente | Refatorar scanner SP3 |
| **Documentar** | Escrever docs, guias, specs | Documentar API REST |
| **Validar** | Testar, verificar, checar | Validar testes automatizados |
| **Integrar** | Conectar sistemas, combinar | Integrar nova biblioteca |

## Status Opcional (use quando relevante)

Adicione entre parênteses no **final** quando a tarefa tiver dependência:

| Status | Quando usar | Exemplo |
|--------|-----------|---------|
| `(BLOQUEANTE)` | Bloqueia outras tarefas | Inserir placeholders (BLOQUEANTE) |
| `(CONTINUAR)` | Retomar trabalho anterior | Implementar SP3 (CONTINUAR) |
| `(EM PROGRESSO)` | Work in progress | Corrigir tests (EM PROGRESSO) |
| `(PENDENTE)` | Aguardando algo/alguém | Brainstorm features (PENDENTE) |
| `(URGENT)` | Alta prioridade | Corrigir bug crítico (URGENT) |

## Passo a Passo Para Gerar Sugestões

### 1. Leia o primeiro prompt do usuário
Extraia a **intenção clara**: o que ele quer fazer?

### 2. Escolha 3 verbos diferentes
Não repita verbo nas 3 sugestões. Varie para dar opções:
- Sugestão 1: foco na ação principal
- Sugestão 2: foco no resultado esperado
- Sugestão 3: foco no domínio/contexto

### 3. Escreva descrição concisa
- **Comprimento:** 4-8 palavras no máximo
- **Especificidade:** detalhe O QUÊ, não HOW
- **Tom:** técnico, objetivo, sem emojis na descrição

Exemplo ruim: `Criar uma página web super legal com animações e efeitos especiais`
Exemplo bom: `Criar página web com animações (DS TM)`

### 4. Decida se adiciona status
Adicione status APENAS se:
- A tarefa bloqueia outras
- É continuação de trabalho anterior
- Tem dependência clara
- É urgente

Se nenhum desses, deixe sem status.

### 5. Formule as 3 sugestões
Apresente assim:

```
Sugestões de nome para seu novo chat:

1. ✅ [Verbo 1] [Descrição] ([Status])
2. ✅ [Verbo 2] [Descrição]
3. ✅ [Verbo 3] [Descrição] ([Status])

Gostou de alguma? Pode usar a sugestão 1, 2 ou 3 — ou combinar/adaptar! 
Basta clicar no nome quando o chat pedir confirmação.
```

## Cenários de Uso

### Novo chat vazio + primeiro prompt
**Usuário:** "Vou criar um script Python que lê PDFs e extrai tabelas"

**Você detecta:** novo chat + prompt em PT-BR
**Gera sugestões:**
```
1. ✅ Criar script para extração de tabelas
2. ✅ Implementar parser de PDF com tabelas
3. ✅ Automatizar leitura de arquivos PDF
```

### Usuário explicitamente pede nome
**Usuário:** "Como deveria chamar este chat?"

**Você:**
```
Com base no que conversamos, sugiro:

1. ✅ Revisar qualidade do código do backend
2. ✅ Analisar complexidade das funções
3. ✅ Otimizar performance das queries

Qual você prefere?
```

### Chat com várias tarefas relacionadas
**Usuário:** "Preciso: 1) refatorar a store Zustand, 2) otimizar re-renders, 3) adicionar testes"

**Você:**
Neste caso, identifique a **tarefa PRINCIPAL** e crie sugestões em torno dela:
```
1. ✅ Refatorar store Zustand (BLOQUEANTE)
2. ✅ Implementar otimização de re-renders
3. ✅ Estruturar testes do estado global
```

(A tarefa principal é a refatoração, porque bloqueia as outras duas)

## O Que NÃO Fazer

❌ Gerar mais de 3 sugestões — cansa o usuário
❌ Usar nomes genéricos ("Chat 1", "Trabalho", "To Do")
❌ Nomes em inglês ou misturados (Pt + En)
❌ Descrições muito longas (>8 palavras)
❌ Adicionar status sem motivo
❌ Usar emojis no nome (deixa feio no Cowork)
❌ Nomes vagos como "Vários ajustes"

## Dicas Práticas

1. **Se o usuário não responder imediatamente**: espere uma ou duas mensagens, mas não force. Se ele começar a trabalhar sem escolher um nome, deixa pra depois — a sugestão continua válida.

2. **Se o usuário customize**: Valide se segue o padrão. Se disser "prefiro chamar de X", deixa assim — o padrão é recomendação, não obrigação.

3. **Se o chat já tem nome**: Não sugira novo nome a menos que o usuário peça.

4. **Quando atualizar nome**: Só atualize se o usuário pedir explicitamente ou se a tarefa mudar radicalmente (ex: "na verdade vou fazer outra coisa").

## Exemplos Reais do seu Repositório

Com base em seus chats existentes, aqui estão names já refatorados:

| Nome Original | Nome Sugerido | Por quê |
|---|---|---|
| "Plan Auto Relatório v3.2 template system — (CONTINUAR)" | ✅ Implementar sistema de placeholders (BLOQUEANTE) | Foco na ação; status indica bloqueio |
| "Brainstorm AutoRelatorio app update ideas" | ✅ Analisar modo organizar de fotos | Mais específico; remove "app update ideas" genérico |
| "Analyze repository code — (Continuar)" | ✅ Implementar testes automatizados (CONTINUAR) | Verbo mais claro; foco no resultado |
| "Relatórios Preventivos — Versão 1.0 (SKILL_BASE)" | ✅ Criar skill base para relatórios preventivos | Reduz jargão; deixa clara a deliverable |

## Integração com seu Fluxo

Toda vez que você criar um novo chat no Cowork:

1. Escreva sua tarefa em português (como faz normalmente)
2. **Claude detecta automaticamente** e oferece 3 sugestões
3. Você escolhe uma (ou combina/adapta)
4. Chat fica nomeado com esse padrão daqui em diante

**Resultado:** seu histórico de chats fica limpo, organizado e fácil de navegar quando arquivar. 🎉
