# Plugin: Relatório Preventivo v2.0

Automatiza o processamento de relatórios fotográficos de vistoria preventiva
(Banco do Brasil / Caixa Econômica Federal).

## O que faz

- Gera memorial final consolidado em Word (.docx)
- Verifica divergências entre corpo do relatório e memorial
- Valida sequência de legendas de fotos
- Extrai lista de itens para Excel (.xlsx)

## Parser Adaptativo v2

A versão 2.0 reescreve completamente o parser:

- Lê **diretamente do .docx** via python-docx (sem conversão para markdown)
- Detecta o tipo de cada tabela pelo cabeçalho real — sem templates fixos
- Usa índice posicional raw, preservando valores iguais em colunas adjacentes
- Compatível com qualquer variação de estrutura de relatório

## Tipos de tabela reconhecidos automaticamente

| Tipo | Colunas | Detecção |
|------|---------|----------|
| `full` | Foto, Comp, Altura, Desconto, Subtotal, Total | Header contém "Desconto" |
| `nodiscount` | Foto, Comp, Altura, Total | Header sem Desconto/Quantitativo |
| `unit` | Foto, Quantitativo, Unidade | Header contém "Quantitativo" ou "Unidade" |

## Instalação

Importe o arquivo `.plugin` no Cowork.
