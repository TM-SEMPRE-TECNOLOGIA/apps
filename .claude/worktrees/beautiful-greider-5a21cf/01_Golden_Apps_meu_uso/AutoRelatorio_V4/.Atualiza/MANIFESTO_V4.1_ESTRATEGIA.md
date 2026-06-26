# Manifesto V4.1 — Estratégia de Engenharia e Roadmap

Este documento consolida as decisões de arquitetura, respostas técnicas e o caminho para a estabilização da Versão 4.1.

---

## 🛠️ Respostas às Dúvidas Estratégicas

### 1. Lógica de Criação do Word (Colunas e Espaçamento)

**O Problema:** Atualmente as imagens estão sendo empilhadas sem considerar a orientação (vertical/horizontal) ou o espaçamento técnico exigido pelos templates.
**A Solução V4.1:**

- Implementar um motor de "Grid Condicional" no `word_utils.py`.
- Se a foto for vertical, agrupar em 2 colunas. Se for horizontal, manter em largura total ou grid dependendo do contrato.
- Adicionar espaçadores fixos (padding) entre as células da tabela do Word para garantir o visual limpo.

### 2. Dualidade de Organização (App vs. Disco)

**O Problema:** Nem sempre o usuário quer organizar no App. Às vezes as pastas já vêm prontas do Gerenciador de arquivos.
**A Solução V4.1:**

- Introduzir o **"Seletor de Origem de Dados"** na Topbar.
- **Modo Estrutura (Disco):** O app lê as subpastas e gera o relatório ignorando as classificações internas do App.
- **Modo Inteligente (App):** O app lê uma pasta plana e usa o `ambienteData` (Zustand) para montar a hierarquia.

### 3. "Mover para" Dinâmico

**O Problema:** O seletor atual é estático e baseado em sugestões mockadas.
**A Solução V4.1:**

- O componente `AmbienteSelector` passará a ler o `conteudo` atual para extrair Áreas/Ambientes que já foram detectados no disco.
- Se a lista estiver vazia, ele habilitará o botão **[+ Criar Nova Estrutura]** para que o usuário defina a hierarquia do zero.

### 4. Itens e Planilhas (MAFFENG / 1565)

**O Problema:** Como ficam os cálculos de m² e m lineares na V4?
**A Solução V4.1:**

- Manter o banco de dados de itens (JSON) integrado ao painel lateral.
- Ao selecionar uma foto ou grupo, o usuário associa o item. O sistema calcula automaticamente com base no nome do arquivo (ex: `10,00 x 2,50`).

### 5. Preview Real-time (WYSWYG)

**O Problema:** O preview lateral é simplificado e não reflete o Word final.
**A Solução V4.1:**

- Refinar o `DocxPreviewPanel` para usar as medidas reais do template.
- O que você vê no painel lateral (ordem, cabeçalho, tabelas) deve ser um espelho exato da estrutura que o Python vai gerar.

---

## 🚀 Roadmap de Atualização V4.1

### [x] Fase 1 — Estabilização do Motor (Imediato)

- [X] Corrigir `word_utils.py` para suportar colunas/espaçamento.
- [X] Implementar o seletor "Modo de Escaneamento" (App vs Disco).
- [X] Habilitar o formulário de cabeçalho (OS, Agência, Contrato) no Store.

### [x] Fase 2 — Organização Fluída

- [X] Refatorar "Mover para" para ser context-aware.
- [X] Adicionar funcionalidade de "Criar Área/Serviço" direto na interface.
- [X] Remover permanentemente o Modal de Edição (foco total em organização).

### [ ] Fase 3 — Inteligência de Itens

- [ ] Integrar a tabela de itens MAFFENG e 1565 no fluxo de classificação.
- [ ] Validação visual de itens selecionados no `DocxPreviewPanel`.

---

## 📝 Registro de Checkpoint (05/05/2026)

**Estado Atual:**

- Frontend V4.1 funcional e reativo.
- Motor de Word inteligente com suporte a colunas (2 imagens verticais).
- Seletor de Modo (Disco vs App) integrado.
- Mover para Context-aware (lê estrutura de pastas e permite criar novos).

**Próximo Passo:**

- Implementar a lógica de cálculo (MAFFENG) e associação de itens de planilha.

---

*Assinado: Antigravity AI — Squad TM Construtora*
