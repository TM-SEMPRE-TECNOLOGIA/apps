# Diagrama de Estrutura de Pastas (Em substituição ao DER) — Auto Relatório

Como a arquitetura é 100% *File-System based* (não usamos PostgreSQL/MySQL), o conceito de DER (Diagrama de Entidade Relacionamento) transmutou-se para um **Diagrama de Mapeamento Hierárquico Local**. 

As Pastas substituem Bancos de Dados; Arquivos substituem Registros. O `generator.py` atua como a interface ORM que percorre e traduz.

## 1. Mapeamento Raiz

```
RAIZ_VISTORIA/ 
(Escolha feita via Tkinter - Path Input)
 │
 ├── - 01 Vista Ampla/ (Sessão 1 do Word)
 │    ├── fotoA.jpg (Entidade Imagem 1)
 │    └── fotoB.png (Entidade Imagem 2)
 │
 ├── - 02 Área Externa/ (Sessão 2)
 │    ├── 01 Estacionamento/ (SubSessão 2.1)
 │    │    └── buraco.jpg
 │    └── 02 Calçada/ (Subsessão 2.2)
 │
 └── - 03 Área Interna/ (Sessão 3)
      └── ...
```

## 2. Tradução Entidade (Python) -> Entidade (docx)

O dicionário Python `structure` retornado pelo scanner (via função `scan_directory()`) converte este layout para:

| Elemento File System | JSON Gerado (Memória Temp) | Mapeamento no Template.docx |
|----------------------|---------------------------|----------------------------|
| Diretório Nível 1 | `[{"tipo": "titulo", "nivel": 1, "texto": "01 Vista Ampla"}]` | Estilo Heading 1 / Sessão Principal |
| Diretório Nível 2 | `[{"tipo": "titulo", "nivel": 2, "texto": "01 Estacionamento"}]`| Estilo Heading 2 / SubTópico Escrito |
| Arquivo .JPG | `[{"tipo": "imagem", "path": "D:\\fotos\\buraco.jpg"}]` | Inserção InlinePicture (redimensionada para largura = Inches(6.0) e centralizada numa tabela/parágrafo alinhado ao centro) |

## 3. Estado (Memória Temporária)
Todo estado vitalício é zerado assim que a API de _Generate_ fecha a conexão. Nenhuma gravação transacional ou tracking idempotente é mantido. O estado é o disco rígido do Técnico Carlos.
