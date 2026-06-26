# Planejamento: Organização da Pasta DEV e Bot Preview

## Objetivo
Organizar os documentos de desenvolvimento do projeto `Licitus Bot` dentro da pasta `DEV` utilizando um painel central de documentação (`DEV/index.html`). Além disso, desenvolver uma simulação fiel ao produto final de um Bot em React (`DEV/bot-preview`).

## Proposed Changes

### 1. Central de Documentos DEV
Vamos padronizar a experiência de desenvolvedores e gerentes do projeto com uma página índice.

#### [NEW] [DEV/index.html](file:///c:/Users/thiag/LICITUS_BOT/DEV/index.html)
- Criação de uma interface estilizada (usando TailwindCSS e as cores da marca Teal `brand` e Slate).
- Cards de atalho para:
  - `commit.html` (Changelog de integrações)
  - `plan_th.html` (Planejamento)
  - `tech_docs.html` (Documentação Técnica)
  - **Licitus Bot Preview** (Link para o preview React)

### 2. Licitus Bot Preview (App React)
A simulação em React do painel de controle do Bot.

#### [NEW] [DEV/bot-preview/](file:///c:/Users/thiag/LICITUS_BOT/DEV/bot-preview)
- Inicializar projeto Vite + React (`npx -y create-vite@latest bot-preview --template react`).
- Instalar TailwindCSS e configurar as cores da paleta `brand` (Teal) `slate`.
- Desenvolver a interface principal (Dashboard do Bot Sniper):
  - **Status Geral**: Pregões em andamento ativos, economia gerada, vitórias.
  - **Monitoramento de Bids**: Tabela simulando itens em tempo randômico cobrindo concorrência.
  - **Margem de Segurança**: Interface mostrando o controle entre preço atual e preço limite.
  - **Log de Eventos**: Terminal/log lateral demonstrando a latência do 'sniper'.

## Verification Plan
### Automated Tests
- Executar `npm run build` na pasta `DEV/bot-preview` para assegurar que não há erros de compilação.
### Manual Verification
- Visualizar `DEV/index.html` no browser web e assegurar o UI profissional contendo atalhos para os outros documentos.
- Executar o preview em `DEV/bot-preview` e navegar pela interface do painel web. Garantir que as animações, tipografias e paleta de cores estejam fiéis ao site principal.
