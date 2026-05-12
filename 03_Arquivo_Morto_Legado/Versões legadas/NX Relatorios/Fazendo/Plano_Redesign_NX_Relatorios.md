# NX RELATÓRIOS SP — Plano de Redesign UX/UI
**Engine v2.1.0 · Análise crítica e diretrizes de implementação**

---

## 1. Diagnóstico — Pontuação Atual

| Dimensão | Observação | Nota |
|---|---|:---:|
| Hierarquia visual | Preview espremido; sidebar é a protagonista errada | 3.5 / 10 |
| Uso do espaço | Sidebar + console consomem ~65% da área útil | 2.8 / 10 |
| Feedback ao usuário | Console visível, mas sem estados dos steps | 4.5 / 10 |
| Clareza do fluxo | Steps numerados mas sem indicação de estado | 5.5 / 10 |
| Identidade visual | Logo, cores e tipografia bem executados | 7.2 / 10 |

---

## 2. Problemas Críticos — Prioridade Alta

> Estes três problemas têm o maior impacto na experiência do usuário e devem ser resolvidos primeiro.

### 2.1 Preview é coadjuvante, não protagonista

**Problema**
O conteúdo principal do app — visualizar 263 imagens — está espremido em ~65% da tela. As thumbnails aparecem em tamanho reduzido sem forma de explorar os dados gerados. O usuário não consegue revisar o trabalho com qualidade.

**Solução**
- Inverter a proporção de espaço: preview ocupa 75–80% da largura total da tela
- Sidebar reduzida para 240–260px (largura fixa)
- Grid de imagens com pelo menos 3 colunas e thumbnails maiores
- Adicionar contagem por pasta, zoom e navegação dentro do preview

---

### 2.2 Console sempre visível consome espaço nobre

**Problema**
O "Motor Engine Console" ocupa ~35% da altura da janela com logs que só são relevantes durante a geração. Ao revisar o preview, o console é ruído visual desnecessário.

**Solução**
- Console colapsável com comportamento de acordeão
- Estado padrão: fechado
- Abre automaticamente quando o usuário clica em "Gerar Doc"
- Fecha automaticamente (ou exibe badge de sucesso) quando a operação termina
- Botão manual para abrir/fechar quando necessário

---

### 2.3 Sidebar larga demais para o que entrega

**Problema**
A sidebar ocupa ~32% da largura total, mas exibe apenas 4 itens com texto mínimo: Modelo DOCX, Descrição, Engine e os botões Varredura + Gerar Doc. É uma proporção desproporcional para esse conteúdo.

**Solução**
- Reduzir largura para 240–260px fixos
- Alternativa: transformar em painel flutuante/drawer lateral colapsável
- Ícone de menu (hamburger ou seta) para mostrar/ocultar
- Em telas menores, colapsar automaticamente para dar prioridade ao preview

---

## 3. Problemas Moderados — Prioridade Média

> Estes problemas afetam a clareza do fluxo de trabalho e devem ser endereçados após as correções críticas.

### 3.1 Contador de imagens sem contexto

**Problema**
O badge verde no canto do preview exibe apenas "263 imagens", sem indicar quantas foram processadas, quantas têm erro, ou o progresso por pasta.

**Solução**
- Substituir por texto mais completo: `"263 imagens · 4 pastas · 0 erros"`
- Ou adicionar mini barra de progresso abaixo do badge
- Em caso de erros, destacar com cor vermelha e ícone de alerta

---

### 3.2 Hierarquia de steps confusa

**Problema**
Os itens "02 Modelo DOCX" e "03 Descrição" não têm estado visual claro. Não é possível saber se estão configurados, pendentes ou ignoráveis. O item "Engine" tem destaque de cor mas aparenta ser um botão play, não um step de configuração.

**Solução**
- Steps numerados com estado visual explícito:
  - ✓ **Verde** — step concluído
  - → **Azul** — step ativo/atual
  - ○ **Cinza** — step pendente
- Separar visualmente o botão "play" do Engine do fluxo de configuração

---

### 3.3 Botões "Abrir Saída" e "Baixar Relatório" prematuros

**Problema**
Esses botões ficam no header sempre visíveis mesmo antes do relatório ser gerado. Isso cria confusão sobre o estado atual da tarefa — o usuário não sabe se há um relatório pronto ou não.

**Solução**
- Mover os botões para o rodapé da sidebar ou para uma área de "resultados"
- Exibir desabilitados (com tooltip explicativo) enquanto não há relatório gerado
- Ao concluir a geração, ativar os botões e destacar com animação sutil

---

## 4. Melhorias Pontuais — Prioridade Baixa

> Refinamentos que melhoram a qualidade geral da interface sem impacto crítico no fluxo principal.

### 4.1 Modo de expansão do preview

**Solução**
- Adicionar ícone de expandir (⤢) no canto superior do preview
- Ao clicar, abrir modal/fullscreen com grid navegável
- Modal deve ter: busca por nome de arquivo, filtro por pasta, zoom via scroll ou pinch
- Atalho de teclado: `Esc` para fechar o modal

---

### 4.2 Separadores "»»- DETALHES"

**Solução**
- Substituir os caracteres ASCII (`»»-`) por um divider tipográfico limpo
- Usar linha horizontal fina + label de texto em caixa-baixa com cor cinza
- Exemplo: `───── detalhes ─────`

---

## 5. Tabela Completa de Issues

| Prioridade | Problema | Diagnóstico | Correção recomendada |
|:---:|---|---|---|
| 🔴 Crítico | Preview é coadjuvante | Espremido em ~65% da tela; thumbnails pequenas sem navegação | Preview em 75–80%; sidebar em 240–260px; grid maior |
| 🔴 Crítico | Console sempre visível | Ocupa ~35% da altura; ruído durante revisão do preview | Console colapsável; abre ao gerar, fecha ao concluir |
| 🔴 Crítico | Sidebar desproporcional | ~32% da largura para apenas 4 itens de texto mínimo | Fixar em 240–260px ou transformar em drawer colapsável |
| 🟡 Médio | Badge sem contexto | "263 imagens" sem progresso, pastas ou erros | "263 imgs · 4 pastas · 0 erros" + mini barra de progresso |
| 🟡 Médio | Steps sem estado visual | Não indica se step está concluído, ativo ou pendente | Adicionar ícones de estado: ✓ → ○ por step |
| 🟡 Médio | Botões prematuros no header | "Baixar Relatório" visível antes de qualquer geração | Mover para footer; desabilitar até relatório gerado |
| 🔵 Baixo | Sem modo de expansão | Preview não tem fullscreen ou zoom de imagens | Botão ⤢ para modal com grid navegável e zoom |
| 🔵 Baixo | Separadores ASCII | "»»- DETALHES" parece provisório e quebra consistência | Substituir por divider tipográfico: linha + label |

---

## 6. Roadmap de Implementação

| Sprint | Foco | Tarefas | Issues |
|:---:|---|---|:---:|
| 1 | Layout — maior impacto | Reduzir sidebar para 240–260px · Console colapsável · Preview em 75–80% da largura | 2.1, 2.2, 2.3 |
| 2 | Experiência do preview | Botão expand ⤢ · Modal fullscreen com grid · Zoom e navegação por pasta | 4.1 |
| 3 | Fluxo de estados | Steps com ícone de estado (✓ → ○) · Botões com disabled state · Tooltip de contexto | 3.2, 3.3 |
| 4 | Refinamentos finais | Badge de imagens completo · Separadores tipográficos · Revisão geral de espaçamento | 3.1, 4.2 |

---

*NX RELATÓRIOS SP · Análise UX/UI · Engine v2.1.0 · março de 2026*
