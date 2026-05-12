# Mapa de Componentes UI (Next.js) — Auto Relatório

A arquitetura do Frontend em Next.js (App Router) foi montada com foco total em Single-Page-Feel (sensação de aplicativo compilado). Todos os elementos coexistem em `page.tsx`.

## 1. Estrutura de Layout Base `page.tsx`

O layout divide a tela da seguinte forma estrutural:
- **Esquerda (Sidebar):** 30% da tela (largura fixa em telas grandes). Controles estáticos.
- **Centro/Direita (Main):** 70% da tela. Área dinâmica (Preview).
- **Rodapé (Footer):** Barra fina fixada na base para o Console UI.

## 2. Árvore de Componentes Principais

### `SidebarWizard` (The Controller)
O painel de navegação de "Fluxo de Trabalho" do Técnico. Mantém os estados de Select.
- **`ModeSelector`**: Toggle `Tradicional` vs `SP`.
- **`FolderPicker`**: Botão primário que chama a ponte de seleção do SO (`/api/dialog/folder`).
- **`TemplateDropdown`**: Lista os templates base carregados do backend (`/api/templates`).
- **`ActionPanel`**: Botões de `Escanear` e `Gerar Relatório`. Controlam as mutações Assíncronas. Inclui Spinners de Framer Motion.

### `PreviewGrid` (The Observer)
Responsável por consumir o JSON em memória e pintar os resultados do File System.
- **`SectionDivider`**: Renderizado quando o tipo de nó for "String". Corta o grid inteiro em horizontal com a Label de pasta gerada (Azul Industrial com glow sutil).
- **`ImageThumbnail`**: Componente isolado com `<img>` que chama a API com o source URL `/api/thumbnail?id=base64(path)`. Otimiza RAM usando Lazy Load nativo ou Fetching dinâmico.

### `ConsoleWatcher` (The Telemetry)
Painel persistente em bottom de tela.
- Captura hooks de estado: `onScan()`, `onError()`, `onSuccess()`.
- Rola automaticamente para baixo com novas mensagens (`scrollIntoView`).
- Imprime as linhas em tipografia Monospace (`Space Grotesk`).

## 3. Lógica de Estado (State Management)
Como o app é de propósito único, não foi inserido Redux ou Zustand. Todo o estado flui pelo `page.tsx` usando hooks reativos simples:
- `isScanning` (bool)
- `isGenerating` (bool)
- `reportContent` (Array dinâmico)
- `consoleLogs` (Array de strings)
