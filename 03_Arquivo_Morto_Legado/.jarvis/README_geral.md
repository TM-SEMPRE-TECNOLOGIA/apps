# TM-MEUS-APPS

Este é o repositório principal ("Root") que contém todos os sistemas, integrações e ferramentas da **TM - Sempre Tecnologia**.

## ⚠️ Regra de Commits (Histórico de Atualizações)

Para manter o controle de versão padronizado, de alta qualidade e com design premium, adotamos a regra de **Dupla Atualização de Commits**.

**Toda e qualquer alteração feita em qualquer projeto (pasta de aplicativo) DEVE, OBRIGATORIAMENTE:**

1. **Estar documentada em um arquivo `commit.html`** daquele projeto.
2. **Respeitar a sincronia de cópia**: O arquivo `commit.html` presente na pasta de desenvolvimento do projeto (ex: `NEXT APPS/TM Relatorio/dev/commit.html`) deve ser **idêntico** ao arquivo correspondente salvo na pasta central `MEUS COMMITS/PADRÃO LINHA DO TEMPO/` (ex: `TM Relatorio_commit.html`).

### Novos Projetos / Projetos Sem Commit

Se você está trabalhando em um projeto que **ainda não possui** um arquivo `commit.html` ou que está sendo atualizado após muito tempo:

- **Não prossiga** com a alteração sem planejar o log de desenvolvimento.
- **Crie um novo arquivo de commit** utilizando o layout oficial (`PADRÃO LINHA DO TEMPO`).
- **Defina qual versão** (qual `commit.html`) será o atualizado ou se criará um novo.
- Salve simultaneamente a versão no diretório do projeto e no diretório `MEUS COMMITS/PADRÃO LINHA DO TEMPO`.

## 📜 Histórico de Atualizações do Repositório (Root)

Além dos históricos individuais por aplicativo, as mudanças amplas a nível global do repositório (refatorações massivas, novas regras, exclusões em lote) são documentadas em:

- **`commit.html`** (localizado na raiz desta pasta `TM-MEUS-APPS`).

## 🎨 Design System

Todos os aplicativos do ecossistema TM devem seguir o **Design System Ocean Breeze**, documentado em:

- **Referência canônica**: [`Design System TM/README-TM-UIUX.html`](Design%20System%20TM/README-TM-UIUX.html)
- **Hub de demonstração**: [`Design System TM/hub-ocean-breeze.html`](Design%20System%20TM/hub-ocean-breeze.html)

### Regras visuais de commits:
- Todo arquivo `commit.html` deve utilizar os **tokens Ocean Breeze** (`--TM-primary`, `--tm-*`).
- Tipografia: **Lora** (títulos), **DM Sans** (corpo), **IBM Plex Mono** (badges/código).
- Ícones: **SVG inline** (Lucide/Phosphor). Nunca emojis como ícones de sistema.
- Dark mode obrigatório via `html.dark`.

## 🛠️ Regras de Transparência e Ferramentas (TURBO DEV)

Para garantir o alinhamento técnico e o uso eficiente dos recursos, toda interação com o repositório deve respeitar as seguintes diretrizes:

1. **Declaração de Ferramentas**: Sempre que utilizar uma ferramenta, skill, contexto ou tecnologia proveniente dos repositórios em `TURBO DEV`, a IA deve declarar explicitamente:
    - **O que está sendo usado** (Ferramenta/Skill/Contexto).
    - **A origem** (Caminho no TURBO DEV).
    - **O propósito** (Como isso ajuda no objetivo atual).

2. **Planejamento Técnico (PREVC)**:
    - O planejamento deve seguir preferencialmente as diretrizes em `TURBO DEV/antigravity-awesome-skills/skills/plan-writing`.
    - Para refinamentos visuais premium sem fugir do padrão TM, deve-se consultar `TURBO DEV/ui-ux-pro-max-skill`.
    - A `Skill_geral_prompt.md` na raiz serve como o esqueleto base para converter intenções em prompts estruturados.

3. **Evolução Contínua**: O sistema deve sempre avaliar se a ferramenta atual é a melhor disponível no ecossistema `TURBO DEV` antes de iniciar uma tarefa complexa.

