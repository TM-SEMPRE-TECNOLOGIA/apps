# 🎨 Mapa de Design: NX Relatórios (AutoRelatorio V2)

Este mapa de design detalha a arquitetura de estilização do AutoRelatório V2, especificando como e onde alterar o visual da aplicação, incluindo as tabelas (planilhas) renderizadas.

## 1. Arquitetura de Estilização

O projeto utiliza **Next.js com Tailwind CSS**. Isso significa que as regras CSS globais e as definições do *Design System* base (como tipografia, cores e resiliência) estão em um arquivo central, enquanto as estilizações específicas dos elementos são aplicadas diretamente no TypeScript/React.

### 📍 Ponto Central das Variáveis: `APP/frontend/app/globals.css`
Aqui é onde o tema base do "Ocean Breeze" ou do "Industrial Minimalist" é definido (as cores HEX que viram `--color-*`, as fontes `--font-*` e animações globais).
- **Alterações permitidas:** Mudar cores de base, fundos, estilos de scrollbar.

### 📍 Componentes e Páginas: `APP/frontend/app/page.tsx` (e pasta `components/`)
A interface em si usa as classes utilitárias do Tailwind dentro dos arquivos `.tsx`.
- Exemplo de botão no Next.js: `<button className="bg-primary text-white p-2 rounded">`

## 2. Onde eu Estilizo as Planilhas / Itens?

O preview das planilhas (Itens) do relatório que serão visualizadas antes da geração também segue o Tailwind CSS. 

Dependendo da estrutura da "Planilha" (por exemplo, 17.7, 17.1, 2.18, etc.), o Next.js gerará dinamicamente os grids/tabelas baseados no tipo do serviço (as planilhas estarão no código React).

### 🔍 Estrutura Futura das Planilhas

```
APP/frontend/components/
├── planilhas/
│   ├── PlanilhaPadrao.tsx    (Tabela básica de serviço)
│   ├── Planilha17_7.tsx      (Estilização específica do layout de pintura)
│   └── Planilha2_X.tsx       (Serviços elétricos divididos)
```

**Como Funciona no Front-end:**
1. A interface (app) lê a flag do serviço (ex: `17.7`).
2. O React renderiza o componente correto renderizando um mini-HTML parecido com a tabela do Word.
3. Para *alterar o visual da planilha* (ex: trocar a borda de cinza para azul), você editará o arquivo `.tsx` específico.

**Como Funciona para o DOCX (Python Backend):**
1. Lembre-se de que a estilização para a tela (Next.js) é apenas para **Preview** do usuário.
2. A estilização *real* do Documento final (.docx) de saída que você faz na mão ocorre nos scripts Python (via `python-docx`) do backend, que injetam dados no seu arquivo Template`.docx`).

## 3. Guia de Modificação Rápida

| Desejo Visual | Onde Ir | O que Fazer |
|--------------|---------|-------------|
| **Mudar Azul Principal** | `globals.css` | Editar a variável CSS de `primary` |
| **Arredondar botões** | Componente Base | Mudar classe de `rounded-sm` para `rounded-lg` |
| **Grid do Item 17.7 (Front)** | `Planilha17_7.tsx` | Editar o `<table className="...">` do React |
| **Mudar cor do Hover na tabela**| `Planilha17_7.tsx` | Adicionar tag `hover:bg-gray-100` na linha |
| **Mudar a tabela gerada no WORD**| Backend Python | Mexer no script que processa Tabela (run.py/modules) |

## 4. O Sistema "Tudo Clique" e Modal Plus+

O Modal Superposto com o **Editor de Imagem integrado** será um componente isolado:
- `APP/frontend/components/ImageEditorModal.tsx`
- Ele terá o fundo (`backdrop-blur-md bg-black/50`) e encapsulará as ferramentas (setinhas coloridas, cores padronizadas da marca) no React.

---
> 💡 *Nota do Diário:* Mantenha sempre o Design System atrelado ao Th Designer para que todos os novos componentes de planilhas pareçam construídos sob o mesmo frame.
