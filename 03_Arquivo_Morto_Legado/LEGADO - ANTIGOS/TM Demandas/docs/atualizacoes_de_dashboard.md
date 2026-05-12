# 📊 Relatório de Dashboard & Monitoramento

## 📋 Resumo Executivo

Análise heurística do painel de métricas do **Acompanha Demanda**, avaliando clareza analítica, hierarquia visual e apoio à tomada de decisão.

**Público-Alvo Identificado**: Operacional / Gestor de Equipe Técnica.
**Objetivo Principal**: Monitorar volume de trabalho, prazos críticos e receita projetada.

---

## 🔎 Diagnóstico

### Pontos Fortes ✅

1. **Hierarquia de Cards**: A ordem (Valor > Atrasados > Urgentes > Total) é intuitiva.
2. **Prioridades Críticas**: A lista filtrada por `bad` e `warn` é excelente para ação imediata.
3. **Gráfico de Barras por Status**: Responde a pergunta "Onde está o gargalo?".

### Problemas Identificados ⚠️

| Problema                               | Local                     | Impacto                                                                                           |
| :------------------------------------- | :------------------------ | :------------------------------------------------------------------------------------------------ |
| **Métrica Estática**           | Card "+12.5% este mês"   | O valor é fictício (hardcoded). Engana o usuário.                                              |
| **Gráfico de Pizza Redundante** | "Distribuição Relativa" | O gráfico de barras já mostra a proporção. Pizza ocupa espaço sem agregar informação nova. |
| **Falta de Contexto Temporal**   | Todos os cards            | Não há indicação de "atualizado em..." ou filtro de período.                                 |
| **Legenda Truncada**             | Pizza Chart               | Mostra apenas 4 de N status, escondendo informações.                                            |
| **Sem Meta/Benchmark**           | Card de "Valor Projetado" | O usuário não sabe se o valor atual é bom ou ruim.                                             |

---

## 📐 Recomendações Estruturais

### 1. Remover o Gráfico de Pizza

- **Motivo**: Gráficos de pizza são ineficientes para comparar mais de 3 categorias. O gráfico de barras horizontais já cumpre o papel e permite leitura precisa.
- **Ação**: Substituir pelo **Gráfico de Tendência** (linha) mostrando a evolução semanal de demandas criadas vs. concluídas.
- **Justificativa Analítica**: Responde à pergunta crítica: "Estamos fechando mais do que abrimos?" (Throughput vs. Intake).

### 2. Tornar a Métrica "+12.5%" Dinâmica ou Removê-la

- **Atual**: `<span>+12.5% este mês</span>` (valor fixo).
- **Ação Mínima**: Remover o badge para não induzir o usuário ao erro.

### 3. Adicionar Indicador de Meta no Card de Valor

- **Proposta**: Exibir uma barra de progresso sutil abaixo do valor, indicando % da meta mensal atingida (ex: `R$ 15.000 / R$ 25.000`).
- **Justificativa**: Transforma um número isolado em uma métrica acionável ("Estou no caminho certo?").

### 4. Adicionar Filtro de Período

- **Proposta**: Dropdown no cabeçalho do Dashboard com opções: "Último mês", "Últimos 7 dias", "Hoje".
- **Justificativa**: Sem contexto temporal, o usuário não sabe se os dados refletem o dia ou toda a história.

### 5. Estado Vazio do Dashboard

- **Problema**: Se não houver demandas, os gráficos quebram ou ficam vazios sem explicação.
- **Proposta**: Exibir um estado vazio informativo: "Nenhuma demanda cadastrada. Importe uma planilha para começar."

---

## 🧠 Justificativa Analítica Geral

| Mudança Proposta      | Pergunta que Responde                         |
| :--------------------- | :-------------------------------------------- |
| Gráfico de Tendência | "Estamos sendo produtivos ao longo do tempo?" |
| Barra de Meta          | "Vou bater a meta deste mês?"                |
| Filtro de Período     | "Esses dados são de quando?"                 |
| Remover Pizza          | (Nenhuma - era ruído)                        |

---

## ⚡ Quick Wins (Correções Imediatas)

| Arquivo             | Trecho               | Ação                                                               |
| :------------------ | :------------------- | :------------------------------------------------------------------- |
| `App.tsx:213`     | `+12.5% este mês` | **Remover** o badge.                                           |
| `App.tsx:255-290` | `<PieChart>`       | **Remover** o componente e substituir por Tendência Semanal". |
| `App.tsx:282`     | `.slice(0, 4)`     | Apagar a pizza                                                       |
