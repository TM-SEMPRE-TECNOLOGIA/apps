# Plano de Desenvolvimento — TM DEV HUB

## Objetivo
Implementar o portal central (SaaS Factory) rigorosamente fiel ao design estipulado no arquivo `hub-ocean-breeze-v2.html`. O DEV HUB será o "iLovePDF" da empresa, unindo todos os sub-apps em um único portal escalável.

## 🎨 Especificações Visuais (Ocean Breeze v2.0)
Extraídas diretamente de `hub-ocean-breeze-v2.html`:
- **Tema:** Light Mode nativo (variáveis `--tm-*` no `:root`), com suporte a `.dark` no HTML.
- **Tipografia:** `DM Sans` (sans-serif), `Lora` (serif para títulos), `IBM Plex Mono` (monospace).
- **Core Elements:**
  - **Sidebar:** Navegação lateral colapsável com transições suaves (0.25s) e tooltips hover.
  - **Header:** Barra superior com search-bar animada, badges "ONLINE" e menu de usuário.
  - **Hero Section:** Banner de boas-vindas com animação de gradiente contínua e texto em *shimmer*.
  - **Tools Grid:** Grid responsivo de cartões para os aplicativos (Extrator, Relatório, etc.) com hover effects (elevação e borda).

## Estruturação Técnica 
A implementação deverá:
1. Extrair os tokens visuais do `<style>` do `.html`.
2. Mapear a base HTML bruta para componentes modulares (Hero, Sidebar, Header, ToolGrid).
3. Utilizar lógicas de roteamento ou de monorepo para abrigar e injetar o padrão de ui/ux nos demais apps da mesma base (quando unificados).

## 🔗 Estratégia de Conexão dos Apps ao HUB

Para garantir que o HUB atue de fato como o "Portal Central SaaS" sem precisar misturar as bases de código antes da hora, utilizaremos a seguinte estratégia de integração progressiva:

### Fase 1: Conexão por Roteamento Externo (Links)
Na primeira etapa (atual), os cards do DEV HUB funcionarão como um diretório central.
- Cada app (TM Relatório SP, TM Pastas, TM Extrator) possui seu próprio diretório físico (`1 - PROXIMOS_PASSOS` ou outro repo).
- Ao clicar em "Acessar Módulo" no HUB, o Next.js redirecionará o usuário para a URL (porta local ou domínio de prod) específica do app correspondente (ex: `http://localhost:3001` para Relatório SP).
- O trunfo desta fase é a **Identidade Visual**: Como todos os apps compartilharão exatamente o mesmo CSS (`globals.css` Ocean Breeze) e usarão a mesma `Sidebar`/`Header`, para o usuário final, a transição entre apps será invisível e fluida.

### Fase 2: Autenticação Universal (SSO Mocado / Token via URL)
- O usuário ("Admin TM") faz login no DEV HUB.
- Ao clicar no link de um módulo via URL, passamos um token de sessão seguro na requisição (ou em cookies de cross-domain local) para que o módulo carregue diretamente, mantendo as credenciais de quem está logado.

### Fase 3: Unificação Monorepo (Next.js Multi-Zones ou Turborepo)
- Quando todos os apps estiverem migrados para Next.js 16+, eles migrarão progressivamente para a pasta `0 - NEXT APPS/DEV HUB/tm-hub-next/src/app/(modulos)`.
- O roteamento deixará de ser externo (`localhost:3001`, `3002`) e passará a ser rotas internas do HUB (`/relatorio-sp`, `/extrator`, `/pastas`).
- Isso garantirá um build único (opcional com Turborepo), componentes centralizados (`<Sidebar />` literal), e performance otimizada (iLovePDF strategy).
