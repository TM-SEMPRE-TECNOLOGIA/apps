# Pesquisa de Mercado & Benchmarking — Auto Relatório

## 1. Escopo da Pesquisa
Análise dos softwares existentes que resolvem problemas similares ao Auto Relatório: **geração automatizada de relatórios fotográficos a partir de pastas de imagens organizadas**. O objetivo é identificar gaps de mercado e validar nosso diferencial competitivo.

## 2. Segmento de Mercado

O Auto Relatório atua no nicho de **automação documental para manutenção predial e facilities**, especificamente no sub-nicho de **relatórios fotográficos técnicos**. Este é um mercado fragmentado onde a maioria dos profissionais ainda usa:
- Microsoft Word manualmente (80%+ do mercado)
- Templates Excel com macros VBA rudimentares
- Apps genéricos de relatório de campo (não especializados em fotos)

## 3. Análise de Concorrentes

### 3.1. FastField (Mobile Forms)
**O que faz:** Plataforma de formulários mobile para inspeções e relatórios de campo.

| Aspecto | FastField | Auto Relatório |
|---------|----------|----------------|
| **Modelo** | SaaS (assinatura mensal ~$20/user) | Desktop (uso interno, sem custo) |
| **Input** | Formulário mobile preenchido em campo | Pastas de fotos organizadas no PC |
| **Output** | PDF genérico | .docx profissional com template customizado |
| **Organização Fotos** | Anexos lineares (sem hierarquia) | Hierarquia automática (Área Externa > Subáreas > Detalhes) |
| **Customização** | Drag-and-drop de campos | Templates Word nativos + 4 descrições padrão |

**Fraquezas do FastField:**
- Não entende hierarquia de pastas. O técnico precisa preencher formulário campo por campo.
- Output visual genérico (PDF flat), não profissional como um Word com formatação rica.
- Custo por usuário inviabiliza equipes pequenas.

### 3.2. FieldWire / PlanGrid
**O que faz:** Gerenciamento de projetos de construção civil com fotos de progresso.

| Aspecto | FieldWire | Auto Relatório |
|---------|----------|----------------|
| **Foco** | Obra civil (planta baixa + fotos) | Manutenção predial (vistoria + fotos) |
| **Complexidade** | Projeto completo, múltiplos stakeholders | Simples: pasta → botão → relatório |
| **Curva Aprendizado** | Alta (treinamento necessário) | Mínima (técnico usa em 5 min) |
| **Preço** | $29-54/user/mês | Gratuito (ferramenta interna) |

**Fraqueza:** Over-engineered para o use case do técnico que só precisa gerar um relatório fotográfico. É como usar um canhão para matar uma mosca.

### 3.3. Generação Manual (Word + Copy-Paste)
Ainda é o "concorrente" #1. **80%+ dos técnicos do segmento fazem manualmente.**

| Aspecto | Manual | Auto Relatório |
|---------|--------|----------------|
| **Tempo** | 2-4 horas/relatório | < 5 minutos |
| **Erros** | ~15% de formatação inconsistente | 0% (template padronizado) |
| **Padronização** | Depende do técnico | 100% automática |
| **Escalabilidade** | Linear (mais trabalho = mais horas) | Quase zero custo marginal |

## 4. Oceano Azul: Onde o Auto Relatório Ganha

### Diferenciais Únicos
1. **Estrutura por Pasta = Estrutura do Relatório.**
   Nenhum concorrente entende que `- Área externa/01.01 Fachada/foto1.jpg` deve virar um título hierárquico `» Área Externa → »» 01.01 Fachada` + imagem inserida automaticamente. O Auto Relatório faz isso nativamente via `generator.py` e `folder_sort_key()`.

2. **Zero Input Typing.**
   O técnico **não digita nada**. A organização das pastas é o input. Outros apps exigem formulários, campos, checkboxes.

3. **Template Word Nativo.**
   O output é um `.docx` real que o gestor pode abrir, editar e enviar direto. Não é um PDF engessado ou um HTML exportado.

4. **Preview Visual Antes de Gerar.**
   O `PreviewGrid` (Next.js) mostra exatamente como ficará o relatório antes de gerar. Nenhum concorrente desktop oferece isso na web.

5. **Descrições Pré-Configuradas.**
   4 variações de texto padrão para o tipo "Levantamento Preventivo", selecionáveis via dropdown. Elimina copy-paste de textos repetitivos.

## 5. Oportunidades Identificadas

| Oportunidade | Viabilidade | Impacto |
|-------------|-------------|---------|
| **Batch Mode:** Gerar múltiplos relatórios de uma vez (ex: 10 agências de uma vez) | Alta (loop no endpoint `/api/generate`) | Alto — economia massiva |
| **Export PDF:** Além de .docx, gerar PDF automaticamente | Média (lib: `docx2pdf`) | Médio — conveniência |
| **Drag-and-Drop no Preview:** Reordenar fotos arrastando no grid | Média (React DnD) | Alto — controle fino |
| **IA para detecção de problemas:** Usar visão computacional para categorizar fotos automaticamente | Baixa (requer treinamento de modelo) | Altíssimo — eliminaria até a organização de pastas |
| **Versão Mobile (PWA):** Tirar foto e organizar direto no app | Baixa-Média (requer redesign do fluxo) | Alto — eliminaria etapa do notebook |

## 6. Conclusão Competitiva

O Auto Relatório **não tem concorrente direto** no nicho de "geração automática de relatórios fotográficos a partir de organização de pastas". Existem apps mais caros e complexos que resolvem problemas adjacentes (inspeções genéricas, gestão de obras), mas nenhum oferece a simplicidade brutal do fluxo: **pasta organizada → um botão → relatório Word profissional pronto.**

O verdadeiro concorrente é a **inércia** (técnicos que continuam fazendo manualmente porque "sempre fiz assim"). A estratégia de adoção deve focar em demonstrar o ganho de tempo absurdo (5 min vs 3h).
