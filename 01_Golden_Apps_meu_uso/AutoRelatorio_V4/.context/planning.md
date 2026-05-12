# 🚀 Planejamento Local: AutoRelatorio V2 (NX Relatórios)

Este é o documento de planejamento local guiado pela metodologia **PREVC**.

## 1. Visão Arquitetural

Temos 5 grandes frentes para o AutoRelatorio V2 para tornar tudo "Tudo Clique Intuitivo":

1. **UX/Frontend Base (Next.js + Tailwind):** Reformular o painel (Página de Vendas / Preview) para a exibição dos itens e o grid de imagens.
2. **Sistema de Seleção & Planilhas Específicas:** Criação do preview visual de planilhas padronizadas (17.7, 17.1, 2.18, etc.) dentro do Front-End. O usuário poderá associar múltiplos serviços a uma única foto e o sistema fará parse do "Super Prompt".
3. **Modal Plus+ (Editor de Imagens In-App):** Criação do modal com *backdrop blur* dotado de funcionalidades de setas, caixas de texto com estilos travados (cores da marca e formatos pre-setados), zoom e crop sems perda de qualidade na escala do canvas.
4. **Cérebro LLM Backend (Python):** Interação com Python/IA para receber `{Foto + Item + Contexto do App + Regras de Tagging}` e retornar uma `{Descrição de Engenharia Perfeita}`.
5. **Automação de Relatório e Animções:** Implementar spinners e progress bar de UI, impedindo a tela de "travar", com o sistema comunicando as etapas (Processando IA, Modificando Word, Injetando Fotos).

## 2. Mudanças Propostas

### 📁 `.context/` (PREVC Docs)
- [NEW] `planning.md` - Este arquivo.
- [NEW] `review.md` - Detalhamento minucioso dos riscos (será criado na sequencia).

### 📁 `DOCUMENTOS/`
- [NEW] `mapa_design.md` - Já criado. Explica a estrutura de estilização de planilhas usando React + Tailwind.

### 📁 `APP/frontend/components/`
- [NEW] `ImageEditorModal.tsx` - O MVP do sistema de Modal Plus+ para as fotos.
- [NEW] `ServiceAnatomySelector.tsx` - Componente de tags de dificuldade e campos para contexto de IA por foto.
- [NEW] `ProgressOverlay.tsx` - Animações robustas de processamento da IA para segurar o frontend.

### 📁 `APP/backend/modules/`
- [MODIFY] `llm_generator.py` - Reformulação para receber Contexto Humano + Item Fixo e criar o Super Prompt unificado da IA.

> ⏳ *Aguardando revisão (Review) do plano via artefato principal do sistema para seguirmos com a Execução.*
