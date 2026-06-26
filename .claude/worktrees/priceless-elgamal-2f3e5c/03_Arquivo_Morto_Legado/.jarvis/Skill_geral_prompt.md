# Skill: Gerador de Prompt Técnico Estruturado

## Objetivo

Transformar explicações livres do usuário em **prompts técnicos organizados**, claros e prontos para uso em ferramentas de IA (ChatGPT, Cursor, Copilot, etc.), especialmente para **desenvolvimento de software, correção de bugs, melhorias de sistema e automações**.

---

## Estrutura Padrão do Prompt

Sempre organizar o prompt nas seguintes seções:

- **Título do Projeto / Sistema**
- **Contexto**
- **Problema**
- **Problemas identificados**
- **Objetivos da atualização**
- **Regras / requisitos técnicos**
- **Instrução adicional para a IA**
- **Perguntas para alinhamento (se necessário)**

---

## Template de Prompt

```text
[Título do Projeto ou Sistema]

Contexto:
[explicação resumida do cenário atual]

Problema:
[descrição clara do problema principal]

Problemas identificados:
1.
2.
3.

Objetivos da atualização:
-
-
-

Regras / requisitos:
-
-
-

Instrução adicional:
[orientação para a IA antes de iniciar a solução]
```

---

## Regras da Skill

1. Sempre converter explicações livres em estrutura organizada.
2. Nunca remover informações fornecidas pelo usuário, apenas reorganizar.
3. Sempre transformar informações implícitas em:
   - listas numeradas
   - bullet points
4. Utilizar linguagem técnica, objetiva e clara.
5. Separar corretamente:
   - problema
   - objetivos
   - requisitos técnicos
6. Caso faltem informações importantes, adicionar ao final:

```text
Perguntas para alinhamento:
1.
2.
3.
```

---

## Fluxo Mental da Skill

Sempre estruturar seguindo esta sequência:

```
Contexto → Problema → Lista de erros → Objetivos → Regras → Perguntas
```

---

## Comportamento Esperado

### Entrada
Texto desorganizado explicando uma situação técnica.

### Saída
Prompt técnico estruturado e pronto para uso em IA.

---

## Casos de Uso

Esta skill pode ser usada para:

- Correção de bugs
- Criação de novas funcionalidades
- Refatoração de sistemas
- Melhorias de arquitetura
- Geração de documentação técnica
- Criação de tarefas para times de desenvolvimento

---

## Exemplo de Uso

### Entrada do usuário

> "A função que gera a descrição no relatório parou de funcionar. O placeholder sumiu do docx e a descrição não aparece mais. Preciso restaurar isso e melhorar o formato do texto."

### Saída estruturada

```text
Atualização do sistema de geração de descrição – TM Relatórios SP

Contexto:
Foi adicionada recentemente uma funcionalidade de geração automática de descrição dentro do relatório.

Problema:
A funcionalidade deixou de funcionar corretamente.

Problemas identificados:
1. O placeholder foi removido do template DOCX.
2. A descrição automática não está sendo inserida no documento.
3. O local correto de inserção não está sendo reconhecido.

Objetivos da atualização:
- Restaurar o placeholder no template DOCX
- Garantir inserção automática da descrição
- Melhorar formatação da descrição

Regras:
- Texto justificado
- Partes importantes em negrito
- Manter padrão técnico de relatório

Instrução adicional:
Antes de implementar a solução, faça perguntas para alinhar detalhes da geração da descrição e estrutura do template.
```
