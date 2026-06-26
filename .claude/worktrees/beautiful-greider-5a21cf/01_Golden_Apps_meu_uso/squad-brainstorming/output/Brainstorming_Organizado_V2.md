# 🧠 Brainstorming Organizado: Auto Relatório V2 (NX Relatórios)

Este documento consolida e estrutura as ideias brutas do Obsidian em um plano de desenvolvimento executável para a versão comercial do sistema.

## 1. Visão de Produto: "Tudo Clique Intuitivo"
A V2 abandona a dependência de inputs manuais complexos, focando em uma experiência 100% visual.

### Fluxo de Trabalho (Workflow V2)
1.  **Seleção por Imagem**: O usuário clica na foto no Grid.
2.  **Anatomação de Serviço**: Escolher o item da planilha (Itens_Reorganizado).
3.  **Contexto IA**: Editor rápido para adicionar detalhes (ex: "Parede com infiltração").
4.  **Dificuldade**: Tagging automático (Verde, Amarelo, Vermelho) baseado em regras MAFFENG/Contrato.
5.  **Geração**: Progresso visual (Spinner/Progresso animado) enquanto o Python/Word processa.

---

## 2. Inovação: Editor de Imagem In-App (Modal Plus+)
Em vez de depender de editores externos ou do Word, o usuário marca os detalhes diretamente na interface:
-   **Interface**: Modal full-screen com Backdrop Blur.
-   **Ferramentas**: 
    -   Setas, Círculos e Caixas de Texto com cores padronizadas (Marca).
    -   **Trava de Forma**: Capacidade de "travar" uma ferramenta para marcar múltiplas fotos em sequência sem trocar de ferramenta.
    -   Zoom e Corte (Crop) preservando qualidade original.

---

## 3. Inteligência Artificial: O "Super Prompt"
A geração de descrições técnicas será alimentada por um contexto rico:
-   **Input**: `Foto + Item da Planilha + Contexto Adicional + Regras do Contrato`.
-   **Saída**: Descrição técnica perfeita formatada para o Word.
-   **Suporte**: Multi-serviço por foto (uma foto pode ter descrição de pintura, calha e piso simultaneamente).

---

## 4. Estrutura do Relatório (Ordem de Saída)
1.  **Cabeçalho** (Contrato/Data/Técnico).
2.  **Bloco de Serviço** (Código Planilha + Descrição IA).
3.  **Detalhes Sequenciais** (1, 2, 3...).
4.  **Quantidades e Unidades** (Campos separados e validados).
5.  **Anexos Fotográficos** (Editados in-app).

---

## 5. Regras Críticas de Negócio (Alertas Automáticos)
-   **Fiscal Carol (Contratos 2057/2627)**: Obrigatoriedade de Foto + Justificativa.
-   **São Paulo (Contrato 0908)**: Ordem específica de detalhes logo abaixo do tópico.
-   **Calha (Item 7.14)**: Validação de desenvolvimento mínimo 0,60m.

---

## 🚀 Próxima Etapa: Repositório V2
-   Criar `AutoRelatorio_V2_Dev` com estrutura limpa.
-   Migrar core logic de `run.py` e geradores Python.
-   Implementar Mockup da tela de progresso e Modal Editor.
