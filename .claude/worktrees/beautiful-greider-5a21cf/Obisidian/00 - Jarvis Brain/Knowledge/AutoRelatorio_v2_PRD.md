# AutoRelatorio v2 — PRD (Documento de Requisitos do Produto)

> Estruturado em 19/04/2026 a partir do brainstorming em `Ideia desorganizada.md`
> 
> **Visão central:** "TUDO CLIQUE INTUITIVO — SEPARA > APP LÊ > EDITA DENTRO DO APP > CLIQUE A CLIQUE > CONFIRMA > ESTÁ PRONTO"

---

## 🎯 Problema que o v2 Resolve

O AutoRelatorio v1 exige que o usuário configure item por item, foto por foto. Isso é lento no campo. O v2 transforma o fluxo em um processo de **cliques sequenciais**, onde o app faz o trabalho pesado e o técnico só confirma.

---

## 📦 Funcionalidades do v2

### 1. Detalhes Múltiplos por Item
- Cada item pode ter **Detalhe 1, Detalhe 2, Detalhe 3...** (ilimitado)
- Todos os detalhes entram diretamente no documento Word final
- Ordem sequencial obrigatória: 1 → 2 → 3...
- Botão "+ Adicionar Detalhe" visível e acessível

### 2. Seletor de Itens da Planilha
- O seletor é alimentado diretamente pelos itens do `Itens_Reorganizado`
- Ao selecionar um item (ex: `17.6 - Pintura látex acrílica premium`), o sistema:
  - Monta o **prompt base automático**
  - Exibe o **campo de contexto adicional** (opcional)
  - Identifica regras especiais (MAFFENG, Fiscal Carol, SP 0908)

### 3. Editor de Contexto Dinâmico (Super Prompt)
- Campo de texto livre para o técnico adicionar informações ao prompt
- **Prompt Final = Prompt Base + Contexto do Usuário**
- Exemplo prático:
  - Base: "Descrever pintura premium conforme MAFFENG"
  - Contexto: "Parede com umidade na base, necessita emassamento prévio"
  - Resultado: IA gera descrição técnica muito mais precisa

### 4. Múltiplos Serviços na Mesma Foto
- O técnico pode vincular **vários serviços a uma única foto**
- Todos os serviços vinculados são considerados no prompt antes de gerar o relatório
- Útil para cenários como carpete que envolve pintura + forro + piso ao mesmo tempo

### 5. Editor de Imagem (Modal Tela Cheia)
- Clicar na foto abre um **modal que preenche a tela**, com fundo com blur
- Ferramentas disponíveis (estilo padronizado da marca):
  - **Seta** (cor, espessura)
  - **Caixa de texto** (fonte padrão)
  - **Círculo** (cor, espessura)
  - **Zoom** e **corte** (preservando máxima qualidade)
- **Trava de forma:** Permite usar o mesmo tool em múltiplas fotos sem ter que selecionar novamente (resolve o problema "1 por 1")

### 6. Indicador de Dificuldade (Flag)
- Ao clicar em uma imagem, o técnico pode indicar o grau de dificuldade do serviço
- Exibido no preview como destaque visual:
  - 🟢 **Fácil** — Serviço padrão
  - 🟡 **Médio** — Requer atenção / foto obrigatória
  - 🔴 **Difícil** — Fiscal exigente / regra especial

### 7. Regras MAFFENG Automáticas
| Regra | Validação |
|-------|-----------|
| Calha (7.14) | Bloquear 7.8; exigir desenvolvimento ≥ 0,60m |
| Forro Fibra Mineral | Se qtde > 5 placas → sugerir +4 unidades |
| Lâmpadas Fluorescentes | Sugerir troca completa por LED (não parcial) |
| Fiscal Carol (2057, 2627) | Alerta: foto + justificativa técnica obrigatórias |
| São Paulo 0908 | Alerta: detalhes logo abaixo do tópico (não no final) |
| Orçamentos SP | Alerta: apenas PDF com assinatura eletrônica |

### 8. Tela de Progresso na Geração do Relatório
- Animação de progresso visível enquanto o Word está sendo gerado
- Impede que o frontend trave sem feedback
- Necessário planejar bem a arquitetura para não quebrar a UI durante a geração

---

## 🗂️ Estrutura de Pastas (3 Tipos)

| Pasta | Contrato | Regras Especiais |
|-------|---------|-----------------|
| **Normal** | Contratos padrão | Segue MAFFENG geral |
| **São Paulo** | Contrato 0908 - SJC | Detalhes abaixo do tópico; orçamentos em PDF |
| **Fiscal Carol** | Contratos 2057, 2627 (MG) | Extremamente exigente; medidas reais; fotos obrigatórias |

---

## 🚀 Fases de Execução

### Fase 1 — Fundação (Semanas 1–2)
- [ ] Estruturar pastas (Normal / SP / Carol)
- [ ] Implementar campos Detalhe 1, 2, 3... no formulário
- [ ] Garantir que detalhes entram no documento final
- [ ] Importar itens do `Itens_Reorganizado` para o seletor

### Fase 2 — Core IA (Semanas 3–4)
- [ ] Integrar seletor ao sistema de prompt base
- [ ] Criar campo de contexto adicional (concatena ao prompt)
- [ ] Testar geração com 5–10 itens reais
- [ ] Implementar suporte a múltiplos serviços por foto

### Fase 3 — UX/UI (Semanas 5–6)
- [ ] Implementar modal de edição de imagem (tela cheia + blur)
- [ ] Adicionar ferramentas: seta, caixa de texto, círculo
- [ ] Implementar trava de forma entre fotos
- [ ] Adicionar zoom e corte (máxima qualidade)
- [ ] Preview com destaque de dificuldade (🟢🟡🔴)

### Fase 4 — Validação (Semanas 7–8)
- [ ] Implementar regras MAFFENG automáticas (calha, forro, Carol)
- [ ] Criar tela de progresso durante geração do Word
- [ ] Validar exportação e qualidade do documento final
- [ ] Testes com contratos reais (SP 0908, Carol 2057, Normal)

---

## ❓ Decisões em Aberto

1. **Stack de IA:** Qual LLM usar? Claude (Anthropic), Quwen, Gemini Flash?
2. **Planilhas prontas:** Construir planilhas padrão para itens 17.7, 17.1, 2.18, 2.12, 29.24 etc. (tarefa manual)
3. **Preview de planilha:** Ao selecionar item, mostrar preview da planilha + escolher estilo antes de gerar

---

## 📎 Referências
- Brainstorming original: `Ideia desorganizada.md` (vault raiz)
- App atual (v1): `.NEXT APPS/.NEXT APPS 2/AUTO RELATÓRIO/`
- Planilha de itens: `Itens_Reorganizado` (arquivo de referência do projeto)
