# 🗺 Mapeamento de Edição: Auto Relatório V1

Este documento descreve onde encontrar e editar cada função principal do ecossistema Auto Relatório. Esta doc foi criada a partir da análise da arquitetura base (Next.js + FastAPI).

## 1. Fluxo de Execução da Aplicação (Sequência Mapeada)

1. O usuário executa `python run.py`.
2. O script inicia o Backend (FastAPI na porta `5000`) e o Frontend (Next.js na porta `3000`).
3. O Frontend carrega o *Dashboard* (via `APP/frontend/app/page.tsx`), buscando na API os modelos de relatório disponíveis (`/api/templates`).
4. O usuário escolhe a pasta raiz local. O App chama `/api/scan` no Backend.
5. O Backend valida o tipo de relatório e delega para `generator.py` (Tradicional) ou `generator_sp.py` (SP), e em seguida retorna para o Frontend as fotos organizadas e seus descritivos.
6. O componente visual `PreviewGrid` renderiza essas imagens no navegador. O usuário pode alterá-las.
7. O usuário confirma para gerar. O Frontend bate no endpoint `POST /api/generate`.
8. O Backend usa iteradores para inserir dados no `.docx` base referenciando o `word_utils.py` ou `word_utils_sp.py`.
9. O relatório `.docx` é salvo. O painel avisa o sucesso, permitindo o download via `/api/download`.

---

## 2. Mapa de Edição (Onde Alterar as Configurações)

### 🖥 Frontend (Interface & UX)
Diretório principal: `APP/frontend/`
- **Página Principal (Layout, Botoes Gerais, Core State):** `app/page.tsx`
- **Menu Lateral/Wizard (Inputs, Seletores de Modo Tradicional/SP):** `components/SidebarWizard.tsx` (se existir refatorado)
- **Lista de Imagens Pós-Scanner (Grid Responsivo):** `components/PreviewGrid.tsx` (se existir refatorado)
- **Console Visual de Status (Onde mostra Logs verdes/vermelhos em tela):** `components/ConsoleWatcher.tsx` (se existir refatorado)
- **Design Base Global / Cores Tailwind / Estilos Custom:** `app/globals.css`, `postcss.config.mjs` ou pacote `tailwindcss` em si.
- *(Nota)*: Para editar as labels do dropdown de textos base, altere a constante `descriptionsOptions` ou as lógicas fixas descritas no início de `page.tsx` ou mesmo lá na API FastAPI onde mapeiam a chave.

### ⚙ Backend (Lógica de Varredura e Implantação de Templates)
Diretório principal: `APP/backend/`
- **Rotas (Endpoints HTTP) e Lógicas do Core:** `server.py`
  - *Editar aqui caso queira adicionar uma nova ação de requisição visual com a GUI do Windows ou com JSONs.*
- **Lógica de Leitura/Extração de Pastas (Modo Tradicional):** `generator.py`
- **Lógica de Inserção de Elementos no Word (Modo Tradicional):** `word_utils.py`
- **Lógica de Leitura/Extração Específica (Modo SP, hierarquias pesadas):** `generator_sp.py`
- **Lógica de Inserção de Elementos Específicos (Modo SP, repetições complexas no Word):** `word_utils_sp.py`
- **Alteração de Templates (`.docx` base):** `templates/` (coloque apenas arquivos nativos Word lá, são a matéria prima)

### 🕹️ Inicializador Global
Diretório principal: Módulo Raiz do Projeto `AutoRelatorioV1_Dev`
- **Script Pai e Console Manager:** `run.py` 
  - *Aqui você muda timeouts, estilo de log de output local no terminal Windows ou gerencia as instâncias NextJS/FastAPI caso adicione um outro módulo.*
