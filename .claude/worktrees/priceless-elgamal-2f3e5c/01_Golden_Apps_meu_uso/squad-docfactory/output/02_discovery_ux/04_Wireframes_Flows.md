# Wireframes e Fluxos UX — Auto Relatório

## 1. Visão Arquitetural da UI

A interface atual do Auto Relatório (NX Relatórios) é fundamentada na topologia de um SPA (Single Page Application) limpo. O foco absoluto da UX é eliminar a "fadiga de cliques".

## 2. Mapa de Interface (Sitemap Visual)

```text
[ HOME / Dashboard Principal ]
  │
  ├── Header Superior (Branding, Status da Conexão, Botões Globais "Abrir Saída" / "Baixar Download")
  │
  ├── Coluna Esquerda: SidebarWizard (Fluxo 1-2-3-4)
  │    ├─ Passo 1: Seleção de Modo (Tradicional ou SP)
  │    ├─ Passo 2: Seleção de Pasta (Input -> Botão Dialog Nativo)
  │    ├─ Passo 3: Configuração do Modelo (Dropdown Templates base)
  │    └─ Passo 4: Descrição Pré-Formatada (Dropdown de Variáveis)
  │
  ├── Coluna Central/Direita: PreviewGrid (A "Mágica")
  │    ├─ Blank State (Avisos de "Aguardando Scan")
  │    └─ Grid Responsivo (Cards de imagens com miniaturas de 200px)
  │
  └── Footer: ConsoleWatcher
       └─ Terminal Fake mostrando logs da API (verde/vermelho/amarelo)
```

## 3. Especificações do PreviewGrid (O Core)

O `PreviewGrid` é o componente mais valioso da ferramenta. Ele materializa o que antes era um processo "cego" no Word.

**Fluxo de Interação do Grid:**
1. O backend responde ao `/api/scan` com uma array JSON.
2. O React itera o array. Se o item for um `string` (título hierárquico, ex: `» Área externa`), o React renderiza uma *Section Divider* elegante na cor primária.
3. Se for um *object* `{"imagem": "path"}`, o React chama a API `GET /api/thumbnail?path=...` para não travar a memória do browser carregando fotos brutas de 10MB.

**Melhorias Estratégicas Planejadas para Wireframes V1.5:**
- **Reordenamento (Drag and Drop):** Permitir que o usuário pegue o card de uma miniatura e troque de ordem com outro caso ele queira corrigir a cronologia da foto diretamente pela UI antes de bater no botão de Gerar.

## 4. ConsoleWatcher (Transparência Sistêmica)

Ao lidar com scripts de automação ou geração massiva, o usuário comum tem ansiedade ("Travou? Deu erro?"). O `ConsoleWatcher` foi projetado com "fundo preto e texto monospace" de propósito para simular um terminal (Hackerman feel), ancorado no Footer.

**Feedback Loop:**
- Azul: Transição normal.
- Verde: Scans e Gerações bem-sucedidas.
- Vermelho: Quebra de pasta ou erro de Python, exibido diretamente ali sem o usuário precisar olhar o terminal do sistema operacional.

## 5. Próximos Passos
O time de UI irá construir Protótipos de Média Fidelidade (Figma) focados na V2 — A versão Desktop portável.
