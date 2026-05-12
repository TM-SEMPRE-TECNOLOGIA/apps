# 🧠 Relatório de Copy & Microcopy

## 📋 Resumo Executivo

Este documento apresenta uma análise heurística dos textos da interface do **Acompanha Demanda**, com foco em clareza, consistência e experiência do usuário (UX Writing). O objetivo é elevar o tom da comunicação para ser mais profissional, direto e amigável.

---

## 🔎 Análise Geral

A aplicação apresenta uma boa estrutura de informações, mas utiliza terminologias técnicas em alguns pontos ("Sessão", "Ambiente", "Alimentar") e inconsistências.

### Principais Pontos de Atenção:

1. **Ambiguidade**: Termos como "Acompanha Demanda" (Marca ou Verbo?) e "Valor Estimado" (Calculado ou Chute?).
2. **Tecnicismo**: Exposição de termos de dev ("Sessão", "Log").
3. **Gramática**: Pequenos ajustes de hifenização e concordância.

---

## 🛠 Sugestões de Melhoria (Detalhado)

### 1. Navegação Lateral (Sidebar)

#### **Contexto**: Cabeçalho da Sidebar

- **Texto Atual**: "Acompanha Demanda" / "Pro Edition"
- **Problema**: "Acompanha Demanda" soa como uma frase solta. "Pro Edition" adiciona ruído se não houver outras versões.
- **Sugestão**: **Gestor de Demandas** ou **TechDemand** (se for nome de produto). Remover "Pro Edition" se irrelevante, ou mudar para **Versão Pro**.
- **Justificativa**: Mais profissional e com cara de produto estabelecido.

#### **Contexto**: Rodapé da Sidebar

- **Texto Atual**: "Sessão Atual" / "Ambiente"
- **Problema**: "Sessão" e "Ambiente" são termos de desenvolvedor.
- **Sugestão**: Remover o título "Sessão Atual". Trocar "Ambiente" por **Conexão** ou apenas mostrar "Produção" com um ícone de status.
- **Justificativa**: O usuário não precisa saber que está em uma "sessão". Ele quer saber quem ele é e onde está trabalhando.

### 2. Dashboard

#### **Contexto**: Card de Valor

- **Texto Atual**: "Valor Estimado"
- **Problema**: "Estimado" gera dúvida. O valor é calculado com base em regras precisas de fotos.
- **Sugestão**: **Valor Projetado**.
- **Justificativa**: "Projetado" indica futuro (o que vou receber), enquanto "Estimado" parece impreciso.

#### **Contexto**: Card de Atividades

- **Texto Atual**: "Total Ativo" / "Total de registros no sistema"
- **Problema**: Genérico.
- **Sugestão**: **Total de Demandas** / "Demandas cadastradas".
- **Justificativa**: Clareza imediata sobre o que está sendo contado.

### 3. Importação (Fluxo Crítico)

#### **Contexto**: Cards de Instrução

- **Texto Atual**: "Siga este passo-a-passo simples para alimentar o sistema."
- **Problema**: "Passo-a-passo" (erro gramatical, não têm hífen). "Alimentar" é termo de sistema ("feed the system").
- **Sugestão**: "Siga as etapas abaixo para importar seus dados."
- **Justificativa**: Mais humano e direto. Remove o conceito mecanicista de "alimentar".

#### **Contexto**: Botão de Upload Card

- **Texto Atual**: "Clique para selecionar ou arraste e solte"
- **Sugestão**: **Clique para carregar** ou arraste seu arquivo aqui.
- **Justificativa**: Verbo de ação forte no início.

#### **Contexto**: Dica de Rodapé

- **Texto Atual**: "...importação bem sucedida."
- **Problema**: Erro gramatical.
- **Sugestão**: "...importação **bem-sucedida**." (Com hífen).
- **Justificativa**: Correção ortográfica.

### 4. Import Service (Mensagens de Erro)

#### **Contexto**: `importService.ts`

- **Texto Atual**: "Arquivo deve conter pelo menos cabeçalho e uma linha de dados"
- **Sugestão**: "O arquivo está vazio ou sem cabeçalho."
- **Justificativa**: Mais curto e direto.
- **Texto Atual**: "Colunas obrigatórias não encontradas. Necessário pelo menos: Chamado, Contrato ou Agência"
- **Sugestão**: "Não identificamos as colunas obrigatórias (Chamado, Contrato ou Agência)."
- **Justificativa**: Voz ativa ("Não identificamos") soa mais como um assistente do que um erro de sistema passivo.

### 5. Configurações

#### **Contexto**: Tabela de Preços

- **Texto Atual**: "Precificação por Faixa de Fotos"
- **Sugestão**: **Tabela de Preços**
- **Justificativa**: Simplificação. O subtítulo já explica a lógica.

---

## ⚡ Quick Wins (Correções Imediatas Propostas)

| Arquivo     | Trecho Original         | Sugestão              | Motivo                 |
| :---------- | :---------------------- | :--------------------- | :--------------------- |
| `App.tsx` | `passo-a-passo`       | `passo a passo`      | Gramática (Novo A.O.) |
| `App.tsx` | `bem sucedida`        | `bem-sucedida`       | Gramática             |
| `App.tsx` | `Valor Estimado`      | `Valor Projetado`    | Precisão Semântica   |
| `App.tsx` | `Alimentar o sistema` | `Registrar demandas` | Humanização          |
| `App.tsx` | `Sessão Atual`       | *Remover*            | Ruído Visual          |
| `App.tsx` | `Limpo` (Badge)       | `Válido`            | Profissionalismo       |
