---
name: legenda-descricao-sp2
description: >
  Processa relatórios fotográficos .docx no padrão SP2 / MAFFENG / BB / CEF realizando
  duas tarefas: (1) insere parágrafos "Foto N:" em negrito abaixo de cada imagem sem legenda;
  (2) preenche descrições nas legendas vazias (ex: "Foto 4:" sem texto), gerando frases variadas
  por seção — pinturas, forros, extintores, quadros elétricos, torneiras etc. — no padrão
  "Foto N – descrição. (item do contrato)".

  Use sempre que o usuário pedir: legendar fotos, numerar fotos, colocar "Foto N:" abaixo das
  imagens, adicionar descrições nas legendas, preencher textos das fotos, completar legendas
  vazias, corrigir formato de legendas (dois pontos para travessão), unificar estilo de
  descrições em relatório word. Ative também quando o usuário enviar um .docx de relatório
  fotográfico e pedir qualquer processamento nas legendas ou descrições das fotos.
---

# Skill: Legenda + Descrição SP2

Processa relatórios fotográficos `.docx` em duas etapas complementares que podem ser
usadas juntas ou separadamente:

**Etapa A — Inserir legendas:** insere `Foto N:` em negrito abaixo de cada imagem que
ainda não tem legenda (parágrafos soltos e células de tabela).

**Etapa B — Preencher descrições:** localiza legendas sem texto (ex: `Foto 4:` vazio ou
`Foto 4:` com dois pontos) e gera descrições variadas baseadas no contexto da seção,
seguindo o padrão `Foto N – [descrição]. (item 00.00 do contrato)`.

---

## Quando usar cada etapa

- **Só Etapa A:** usuário quer numerar/legendar fotos que ainda não têm nenhuma legenda.
- **Só Etapa B:** relatório já tem `Foto N:` abaixo das imagens, mas as descrições estão
  vazias ou com dois pontos em vez de travessão.
- **Ambas:** relatório tem fotos sem legenda E legendas sem descrição (caso mais comum
  em relatórios em elaboração).

Perguntar ao usuário qual etapa(s) deseja quando não estiver claro pelo contexto.

---

## Regras do padrão SP2

### Formato da legenda
- Texto: `Foto N – Descrição aqui. (item 00.00 do contrato)`
- Separador: travessão (–), não dois pontos (:)
- Negrito: sim
- Alinhamento: centralizado

### Fotos principais vs. fotos de detalhe
O documento agrupa fotos em blocos. Dentro de cada bloco:
- **Foto principal** = a foto que vem *imediatamente antes* de um marcador `- Detalhes N:`
  → recebe descrição da necessidade identificada + `(item 00.00 do contrato)`
- **Fotos de detalhe** = fotos que vêm *após* o marcador `- Detalhes N:`
  → recebem descrição de detalhe mais curta + `(0.00)`

Se não houver marcador `- Detalhes` na seção, todas as fotos são tratadas como principais.

### Seções a pular
Se o usuário indicar seções que não devem ser editadas, identificar pelos títulos
(ex: `2 - Cobertura`, `2.1 - Laje`, `2.2 - Telhado`, `2.3 - Entreforro`) e
não modificar nenhuma foto nessas seções. Passar via `--skip-secoes`.

### Variação de linguagem
As descrições devem variar — não repetir a mesma frase para todas as fotos da mesma
seção. O script `preencher_descricoes.py` já faz isso automaticamente rotando as
opções do banco de frases embutido. Se surgir uma seção não mapeada, usar as frases
do grupo `_default_`.

---

## Passos de execução

### 1. Identificar o arquivo e intenção

Confirmar com o usuário:
- Quais etapas executar (A, B ou ambas)?
- Há seções para pular?
- Qual o placeholder de item de contrato (padrão: `00.00`)?

Copiar o arquivo para `/tmp/relatorio_input.docx`.

### 2. Etapa A — Inserir legendas (se solicitado)

```bash
python3 <skill_dir>/scripts/inserir_legendas.py \
  /tmp/relatorio_input.docx \
  /tmp/relatorio_etapa_a.docx
```

Detecta imagens em parágrafos soltos e em células de tabela, preserva legendas
existentes e numera a partir do próximo número disponível.

### 3. Etapa B — Preencher descrições (se solicitado)

Input: output da Etapa A, ou o original se só Etapa B for pedida.

```bash
python3 <skill_dir>/scripts/preencher_descricoes.py \
  /tmp/relatorio_etapa_a.docx \
  /tmp/relatorio_final.docx \
  --skip-secoes "2 - Cobertura,2.1 - Laje,2.2 - Telhado,2.3 - Entreforro" \
  --item-placeholder "00.00"
```

Ambos os argumentos são opcionais.

### 4. Salvar o resultado — arquivos grandes

Relatórios chegam a 50-80 MB. Salvar em etapas separadas para não estourar o timeout:

**Passo 1** — salvar em /tmp (rápido, feito pelo script acima).

**Passo 2** — copiar para a pasta de saída:
```bash
cp /tmp/relatorio_final.docx /sessions/.../mnt/TM-MEUS-APPS/RELATORIO_COM_LEGENDAS.docx
```

Se a cópia falhar por tamanho/timeout, usar Windows MCP PowerShell:
```powershell
Copy-Item -Path "<outputs_path>\relatorio_final.docx" `
          -Destination "C:\Users\thiag\Desktop\TM-MEUS-APPS\RELATORIO_COM_LEGENDAS.docx" -Force
```

---

## Scripts incluídos

| Script | Etapa | Função |
|---|---|---|
| `scripts/inserir_legendas.py` | A | Insere `Foto N:` em negrito abaixo das imagens |
| `scripts/preencher_descricoes.py` | B | Preenche descrições nas legendas vazias |

Usar em sequência (A depois B) ou individualmente conforme a necessidade.
