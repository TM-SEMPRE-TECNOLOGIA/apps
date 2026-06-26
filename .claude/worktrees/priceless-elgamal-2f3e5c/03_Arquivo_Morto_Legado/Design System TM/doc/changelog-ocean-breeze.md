# Changelog — Design System TM (Ocean Breeze)

Este log acompanha todas as mudanças significativas no Design System **Ocean Breeze**, seguindo convenções de [Versionamento Semântico](https://semver.org/).

---

## [2.0.0] - 2026-03-08

### 🚀 Adicionado (Premium features)
- **Command Palette (Ctrl+K)**: Novo overlay acessível globalmente via atalho de teclado, permitindo busca filtrada por ferramentas, páginas e categorias. Modulando com navegação por setas e `Enter`.
- **Card Details Drawer**: Novo side-panel deslizante à direita para mostrar os detalhes completos de ferramentas na versão Hub, incluindo metadados (categoria, tech, status).
- **Breadcrumb Navigation**: Trilhas de navegação dinâmicas (`Hub > Dashboard`, etc.) in-page para melhor orientação do usuário.
- **Micro-interações**: Skeleton loading pulse e transições suaves de hover nos list items e modais fechando.

### 🔄 Modificado (Compliance & Upgrade)
- **Migração de Ícones**: 100% dos emojis da interface (cards, sidebar, header, toasts) foram substituídos por ícones vetorizados escaláveis em formato **SVG (Lucide)**.
- Mínimos de tipografia elevados: tamanhos subdimensionados (como 0.58rem) foram subidos para a base mínima de **0.75rem (12px)** para leitura amigável.
- Hub clonado: Original mantido intacto; a evolução encontra-se estritamente na versão `hub-ocean-breeze-v2.html`.

### 🛡️ Acessibilidade & CSS (Fixes)
- **Focus Rings**: Implementada a pseudo-classe `:focus-visible` em toda a aplicação garantindo navegabilidade amigável via teclado sem rings de mouse desnecessários.
- Inclusão dos atributos requeridos ARIA nas âncoras vazias: `aria-label`, `role="button"` e `tabindex="0"`.
- Breakpoints fixados: Ajustado o grid de stats para decair elegantemente de 4 para 2 (em 900px) e para 1 coluna (em 600px). Sidebar colapsa automaticamente no mobile (<768px).
- **Redução de Movimentos Atendida**: Adicionada `@media (prefers-reduced-motion: reduce)` anulando transições/animações sob demanda do OS.
- Retirada da declaração duplicada `}` causadora de erros de parser no CSS de `sec-title`.

---

## [1.0.0] - 2026-02

### 🎉 Lançamento
- Fundação da linguagem visual **Ocean Breeze**.
- Construção dos tokens centrais do sistema (famílias tipográficas Lora e DM Sans, gradientes primários na escala verde: `#22c55e` às matizes complementares).
- Estabelecimento do hub de referências UI e definições em formato Markdown compilado (`ocean-breeze-pages`).
- Integração e definição do Dark Mode padronizado `.dark` class toggled at `<html>` scope.
