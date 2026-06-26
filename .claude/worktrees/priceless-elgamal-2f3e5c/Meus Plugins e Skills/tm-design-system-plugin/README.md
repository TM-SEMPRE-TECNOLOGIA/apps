# TM Design System Plugin

Plugin oficial do **Design System TM Sempre Tecnologia v3** para Cowork.

Cria páginas web animadas, landing pages e páginas de vendas com os tokens do DS — laranja construção, papel cinza-quente, Roboto Slab + Inter + JetBrains Mono — e com curadoria de referências de design integrada ao fluxo de criação.

---

## O que este plugin faz

Ao instalar este plugin, o Claude passa a:

- Criar páginas HTML self-contained seguindo os tokens do DS TM automaticamente
- Escolher o tipo de estrutura certa para cada pedido (landing, vendas, componente)
- Aplicar animações sóbrias e técnicas sem dependências externas
- Buscar inspiração nas fontes de referência curadas (Contra, Mobbin, Godly, ScreensDesign, Design Spells) e traduzir para o vocabulário visual TM
- Incluir dark mode com toggle e `localStorage` em toda página
- Salvar os arquivos diretamente em `TM-MEUS-APPS/`

---

## Como usar

Basta pedir naturalmente. Exemplos de frases que ativam o plugin:

- "Faz uma landing page para o AutoRelatório"
- "Quero uma página de vendas bem estruturada"
- "Cria uma variação da página com hero diferente"
- "Quero inspiração do Godly para a animação do hero"
- "Faz um componente de card com o DS"

---

## Fontes de referência integradas

| Fonte | O que usa | URL |
|---|---|---|
| **Contra** | Layouts de hero, portfólios, hierarquia visual | https://contra.com/?view=projects |
| **Mobbin** | Padrões de UI (inputs, cards, nav, flows) | https://mobbin.com/discover/apps/ios/latest |
| **Godly** | Animações de alto nível, tipografia, narrativa | https://godly.website |
| **ScreensDesign** | Pricing, onboarding, fluxos de conversão | https://screensdesign.com |
| **Design Spells** | Micro-interações, detalhes, estados de loading | https://designspells.com |

---

## Estrutura do plugin

```
tm-design-system-plugin/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    └── tm-web-pages/
        ├── SKILL.md                      ← instruções principais + componentes prontos
        └── references/
            ├── ds-tokens.md              ← tokens CSS completos (cores, tipo, bordas, sombras)
            ├── animation-patterns.md     ← 12 padrões de animação com código
            ├── page-types.md             ← estrutura de seções por tipo de página
            └── design-sources.md         ← fontes de referência + protocolo de tradução
```

---

## Desenvolvido por

**Thiago Nascimento Barbosa** — TM Sempre Tecnologia  
thiagonascimento.barbosapro@gmail.com
