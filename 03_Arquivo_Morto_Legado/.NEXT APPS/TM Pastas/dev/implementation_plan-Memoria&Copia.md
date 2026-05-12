# Plano de Implementação: Memória e Gerenciamento de Itens — TM Pastas (REVISADO)

## Contexto
O usuário deseja uma forma simples de gerenciar os nomes das pastas que o aplicativo sugere e usa automaticamente. Ele precisa de uma página onde possa buscar um item, clicar em um ícone e copiar o nome para uso manual, além de poder adicionar ou remover itens das listas de sugestões (Áreas, Ambientes, Serviços, etc.) sem precisar editar o código.

## Objetivos da Atualização (Simplificados)
- **Botão no Header**: Adicionar um novo botão "🧠 Memória e Itens" no cabeçalho, ao lado de "Criar Nova Estrutura".
- **Página de Memória**:
    - Listar todos os itens disponíveis (os que já vêm no sistema e os criados pelo usuário).
    - Barra de busca global para encontrar itens rapidamente.
    - Ícone de "copiar" ao lado de cada nome.
- **Gerenciamento de Itens**:
    - Interface para adicionar novos itens às listas customizadas.
    - Opção para remover itens das listas customizadas (controlando o que "roda" automaticamente no wizard).

## Respostas aos Comentários do Usuário
- **Flags de Automação**: Esclarecendo — Em vez de configurações complexas, o "controle" será simplesmente a capacidade de adicionar/remover itens das listas que alimentam o gerador automático. Se um item está na lista, ele aparece para o usuário no wizard.
- **Duas Páginas**: Podemos unificar a "Memória" (busca/cópia) e o "Manual" (gerenciamento) em uma única visão organizada por categorias para facilitar o uso, ou usar abas simples.
- **Botão no Header**: Será colocado exatamente como solicitado, mantendo o estilo visual.

## Mudanças Propostas

### Frontend (`tm-pastas-next`)

#### [MODIFY] [page.tsx](file:///c:/Users/thiag/TM-MEUS-APPS/0%20-%20NEXT%20APPS/TM%20Pastas/tm-pastas-next/app/page.tsx)
- Adicionar o botão "🧠 Memória e Itens" no `nav` do header.

#### [NEW] [memoria/page.tsx](file:///c:/Users/thiag/TM-MEUS-APPS/0%20-%20NEXT%20APPS/TM%20Pastas/tm-pastas-next/app/memoria/page.tsx)
- Página com:
    - Input de busca.
    - Seções (Áreas, Ambientes, Serviços, Subpastas).
    - Cada item terá: Texto, Botão Copiar, Botão Deletar (se for customizado).
    - Formulário rápido para adicionar novo item em cada categoria.

#### [MODIFY] [route.js](file:///c:/Users/thiag/TM-MEUS-APPS/0%20-%20NEXT%20APPS/TM%20Pastas/tm-pastas-next/app/api/custom-items/route.js)
- Adicionar ação de `delete` para permitir remover itens do [custom_items.json](file:///c:/Users/thiag/TM-MEUS-APPS/0%20-%20NEXT%20APPS/TM%20Pastas/tm-pastas-next/data/custom_items.json).

---

## Plano de Verificação
- Verificar se o botão no header funciona.
- Testar a busca global na nova página.
- Validar a cópia para o clipboard.
- Testar adição e remoção de itens, verificando se refletem no wizard principal.
