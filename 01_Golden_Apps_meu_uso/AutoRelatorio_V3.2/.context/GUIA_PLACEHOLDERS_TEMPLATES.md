# 📝 Guia: Como Inserir Placeholders nos Templates Word

**Instruções detalhadas para adicionar placeholders {{campo}} em cada template**

---

## 🎯 O Que Você Precisa Fazer

Editar cada um dos **9 templates Word** e adicionar **7 placeholders dinâmicos** nos locais corretos.

Os templates **NÃO TÊM** os placeholders ainda — você vai inserir manualmente.

---

## 📋 Os 7 Placeholders que Precisam Ser Inseridos

```
1. {{nr_os}}                  — Número da Ordem de Serviço
2. {{data_elaboracao}}        — Data de Elaboração (gerada automaticamente)
3. {{data_atendimento}}       — Data do primeiro atendimento
4. {{agencia_codigo}}         — Código/Prefixo da agência
5. {{agencia_nome}}           — Nome da agência
6. {{endereco}}               — Endereço completo da dependência
7. {{responsavel_dependencia}} — Matrícula + Nome do responsável
```

---

## 🛠️ Passo-a-Passo: Editar Um Template

### PASSO 1: Abrir o Template no Word

```
1. Abra C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\
            AutoRelatorio_V3.2\APP\backend\templates\

2. Escolha um template para começar:
   MODELO - 3575 - TANGARA DA SERRA.docx  ← Comece com este!
   (É o principal para testes)

3. Clique duplo para abrir no Microsoft Word
```

---

### PASSO 2: Localizar Onde Inserir Cada Placeholder

Cada template tem uma **estrutura similar**, com seções para:
- **Capa/Cabeçalho** (informações da agência)
- **Primeira página** (data, OS, responsável)
- **Corpo** (imagens e descrições)
- **Rodapé** (assinatura)

**IMPORTANTE:** Você vai encontrar campos **já preenchidos manualmente** com valores como:
- "TANGARA DA SERRA" (hardcoded)
- "3575" (hardcoded)
- "Avenida Principal, 456..." (hardcoded)

Você **substitui esses valores por placeholders**.

---

### PASSO 3: Inserir Placeholder para AGÊNCIA (Código)

**Localizar:** Procure pela seção de cabeçalho onde está escrito o código da agência (ex: "3575")

**Exemplo de locais possíveis:**
```
┌─────────────────────────────────────┐
│ RELATÓRIO FOTOGRÁFICO              │
│ Agência: 3575                       │ ← Aqui (código)
│ ┌──────────────────────────────────┐
```

**Como substituir:**
1. Selecione o texto "3575" (ou valor que estiver lá)
2. Delete-o
3. Digite: `{{agencia_codigo}}`
4. **Não altere a formatação** (fonte, tamanho, cor)

**Resultado:**
```
Agência: {{agencia_codigo}}
```

---

### PASSO 4: Inserir Placeholder para AGÊNCIA (Nome)

**Localizar:** Logo abaixo ou próximo ao código, você encontrará o nome da agência

**Exemplo:**
```
┌─────────────────────────────────────┐
│ Agência: {{agencia_codigo}}         │
│ TANGARA DA SERRA                    │ ← Aqui (nome)
│ ┌──────────────────────────────────┐
```

**Como substituir:**
1. Selecione "TANGARA DA SERRA" (ou valor que estiver)
2. Delete-o
3. Digite: `{{agencia_nome}}`

**Resultado:**
```
TANGARA DA SERRA → {{agencia_nome}}
```

---

### PASSO 5: Inserir Placeholder para ENDEREÇO

**Localizar:** Campo com endereço completo da dependência

**Exemplo:**
```
Endereço: Avenida Principal, 456 — TANGARA DA SERRA, MT 78300-000
```

**Como substituir:**
1. Selecione todo o endereço (copie primeiro para backuplocal)
2. Delete-o
3. Digite: `{{endereco}}`

**Resultado:**
```
Endereço: {{endereco}}
```

---

### PASSO 6: Inserir Placeholder para DATA ELABORAÇÃO

**Localizar:** Campo com data de elaboração (geralmente "hoje" ou uma data recente)

**Exemplo:**
```
Data de Elaboração: 2026-05-01
```

**Como substituir:**
1. Selecione a data
2. Delete-a
3. Digite: `{{data_elaboracao}}`

**Resultado:**
```
Data de Elaboração: {{data_elaboracao}}
```

---

### PASSO 7: Inserir Placeholder para DATA ATENDIMENTO

**Localizar:** Campo com data do atendimento/vistoria

**Exemplo:**
```
Data de Atendimento: 2026-04-28
```

**Como substituir:**
1. Selecione a data
2. Delete-a
3. Digite: `{{data_atendimento}}`

**Resultado:**
```
Data de Atendimento: {{data_atendimento}}
```

---

### PASSO 8: Inserir Placeholder para ORDEM DE SERVIÇO (OS)

**Localizar:** Campo com número da OS

**Exemplo:**
```
Ordem de Serviço: 1753
```

**Como substituir:**
1. Selecione o número "1753"
2. Delete-o
3. Digite: `{{nr_os}}`

**Resultado:**
```
Ordem de Serviço: {{nr_os}}
```

---

### PASSO 9: Inserir Placeholder para RESPONSÁVEL

**Localizar:** Campo com matrícula + nome do responsável

**Exemplo:**
```
Responsável da Dependência: 2024 — JOÃO SILVA
```

**Como substituir:**
1. Selecione "2024 — JOÃO SILVA" (toda concatenação)
2. Delete-a
3. Digite: `{{responsavel_dependencia}}`

**Resultado:**
```
Responsável da Dependência: {{responsavel_dependencia}}
```

---

## ✅ Checklist por Template

Para cada um dos 9 templates, marque conforme editar:

```
Template: MODELO - 3575 - TANGARA DA SERRA.docx
├─ [ ] {{agencia_codigo}} inserido
├─ [ ] {{agencia_nome}} inserido
├─ [ ] {{endereco}} inserido
├─ [ ] {{data_elaboracao}} inserido
├─ [ ] {{data_atendimento}} inserido
├─ [ ] {{nr_os}} inserido
├─ [ ] {{responsavel_dependencia}} inserido
└─ [ ] SALVO (Ctrl+S)

Template: MODELO - 1507 - CUIABÁ.docx
├─ [ ] {{agencia_codigo}} inserido
├─ [ ] {{agencia_nome}} inserido
├─ [ ] {{endereco}} inserido
├─ [ ] {{data_elaboracao}} inserido
├─ [ ] {{data_atendimento}} inserido
├─ [ ] {{nr_os}} inserido
├─ [ ] {{responsavel_dependencia}} inserido
└─ [ ] SALVO (Ctrl+S)

Template: MODELO - 0908 - SÃO PAULO.docx
├─ [ ] {{agencia_codigo}} inserido
├─ [ ] {{agencia_nome}} inserido
├─ [ ] {{endereco}} inserido
├─ [ ] {{data_elaboracao}} inserido
├─ [ ] {{data_atendimento}} inserido
├─ [ ] {{nr_os}} inserido
├─ [ ] {{responsavel_dependencia}} inserido
└─ [ ] SALVO (Ctrl+S)

Template: MODELO - 1565 - SAO JOSE DO RIO PRETO.docx
├─ [ ] {{agencia_codigo}} inserido
├─ [ ] {{agencia_nome}} inserido
├─ [ ] {{endereco}} inserido
├─ [ ] {{data_elaboracao}} inserido
├─ [ ] {{data_atendimento}} inserido
├─ [ ] {{nr_os}} inserido
├─ [ ] {{responsavel_dependencia}} inserido
└─ [ ] SALVO (Ctrl+S)

Template: MODELO - 2056 - DIVINÓPOLIS.docx
├─ [ ] {{agencia_codigo}} inserido
├─ [ ] {{agencia_nome}} inserido
├─ [ ] {{endereco}} inserido
├─ [ ] {{data_elaboracao}} inserido
├─ [ ] {{data_atendimento}} inserido
├─ [ ] {{nr_os}} inserido
├─ [ ] {{responsavel_dependencia}} inserido
└─ [ ] SALVO (Ctrl+S)

Template: MODELO - 2057 - VARGINHA.docx
├─ [ ] {{agencia_codigo}} inserido
├─ [ ] {{agencia_nome}} inserido
├─ [ ] {{endereco}} inserido
├─ [ ] {{data_elaboracao}} inserido
├─ [ ] {{data_atendimento}} inserido
├─ [ ] {{nr_os}} inserido
├─ [ ] {{responsavel_dependencia}} inserido
└─ [ ] SALVO (Ctrl+S)

Template: MODELO - 2626 - SALINAS.docx
├─ [ ] {{agencia_codigo}} inserido
├─ [ ] {{agencia_nome}} inserido
├─ [ ] {{endereco}} inserido
├─ [ ] {{data_elaboracao}} inserido
├─ [ ] {{data_atendimento}} inserido
├─ [ ] {{nr_os}} inserido
├─ [ ] {{responsavel_dependencia}} inserido
└─ [ ] SALVO (Ctrl+S)

Template: MODELO - 2627 - VALADARES.docx
├─ [ ] {{agencia_codigo}} inserido
├─ [ ] {{agencia_nome}} inserido
├─ [ ] {{endereco}} inserido
├─ [ ] {{data_elaboracao}} inserido
├─ [ ] {{data_atendimento}} inserido
├─ [ ] {{nr_os}} inserido
├─ [ ] {{responsavel_dependencia}} inserido
└─ [ ] SALVO (Ctrl+S)

Template: MODELO - 6122 - MATO GROSSO DO SUL.docx
├─ [ ] {{agencia_codigo}} inserido
├─ [ ] {{agencia_nome}} inserido
├─ [ ] {{endereco}} inserido
├─ [ ] {{data_elaboracao}} inserido
├─ [ ] {{data_atendimento}} inserido
├─ [ ] {{nr_os}} inserido
├─ [ ] {{responsavel_dependencia}} inserido
└─ [ ] SALVO (Ctrl+S)
```

---

## 🎬 Fluxo Recomendado de Edição

### Ordem Sugerida (por prioridade):

```
SEMANA 1:

Seg (Template 1 + Teste):
├─ 09:00 - 10:30 | Editar: MODELO - 3575 - TANGARA DA SERRA.docx
├─ 10:30 - 11:00 | Salvar e fechar
├─ 11:00 - 12:00 | TESTER: Rodar pipeline completo com este template
└─ 12:00         | ✅ Validar resultado

Ter (Validar + Template 2):
├─ 09:00 - 09:30 | Verificar resultado de segunda-feira
├─ 09:30 - 10:30 | Editar: MODELO - 1507 - CUIABÁ.docx
├─ 10:30 - 11:00 | TESTER: Rodar pipeline com este template
└─ 11:00         | ✅ Validar resultado

Qua-Qui (Batch Templates 3-9):
├─ 09:00 - 16:00 | Editar templates 3, 4, 5, 6, 7, 8, 9
├─ 16:00 - 17:00 | Salvar todos
└─ 17:00         | ✅ Validar

Sex (Testes Finais):
├─ 09:00 - 12:00 | TESTER: Rodar pipeline com todos 9 templates
├─ 12:00 - 13:00 | Corrigir qualquer problema
└─ 13:00         | ✅ Todos prontos
```

---

## 🔍 Encontrando os Campos nos Templates

### Método 1: Procura Rápida (Ctrl+H)

Se tiver dificuldade em localizar um campo:

```
1. Word aberto com template
2. Pressione: Ctrl+H (Localizar & Substituir)
3. Campo "Procurar": Digite o valor antigo
   Exemplo: "TANGARA DA SERRA"
4. Campo "Substituir por": Digite o placeholder
   Exemplo: {{agencia_nome}}
5. Clique "Substituir" (não "Substituir Tudo")
```

**Resultado:** Word leva você direto ao campo!

---

### Método 2: Navegação Manual

Se a função Ctrl+H não funcionar bem:

```
1. Use Ctrl+F (Localizar apenas)
2. Digite parte do valor (ex: "TANGARA")
3. Word destaca o campo
4. Feche o localizador (Esc)
5. Selecione manualmente
6. Substitua pelo placeholder
```

---

## ⚠️ IMPORTANTE: O Que NÃO Fazer

### ❌ NÃO faça isso:

```
❌ Não mude a formatação do placeholder
   Errado: "Agência: {{agencia_codigo}}" (em itálico/cor diferente)
   Certo:  "Agência: {{agencia_codigo}}" (mesma formatação do resto)

❌ Não coloque espaços extras
   Errado: "Agência:  {{ agencia_codigo }}"  (espaços dentro das chaves)
   Certo:  "Agência: {{agencia_codigo}}"

❌ Não use maiúsculas/minúsculas diferentes
   Errado: "{{Agencia_Codigo}}" ou "{{AGENCIA_CODIGO}}"
   Certo:  "{{agencia_codigo}}"

❌ Não delete partes do template sem necessidade
   Errado: Remover toda uma linha só para adicionar placeholder
   Certo:  Substituir apenas o valor, manter a estrutura

❌ Não adicione placeholders extras que não foram pedidos
   Certo:  Apenas os 7 placeholders listados acima

❌ Não salve com "Salvar Como" ou em formato diferente
   Certo:  Salve como .docx original (Ctrl+S)
```

---

## ✨ DICAS DE EFICIÊNCIA

### Copiar & Colar Placeholders

Para não digitar errado, **copie** os placeholders:

```
1. No seu editor favorito (Notepad, VS Code, etc), crie lista:

{{nr_os}}
{{data_elaboracao}}
{{data_atendimento}}
{{agencia_codigo}}
{{agencia_nome}}
{{endereco}}
{{responsavel_dependencia}}

2. Ao editar template, copie (Ctrl+C) e cole (Ctrl+V)
3. Isso evita erros de digitação
```

### Template Checker

Após editar cada template, **verifique**:

```
1. Abra a cópia em backup
2. Use Ctrl+F para procurar por:
   {{nr_os}} ✅ 1 resultado
   {{agencia_codigo}} ✅ 1 resultado
   {{agencia_nome}} ✅ 1 resultado
   {{endereco}} ✅ 1 resultado
   {{data_elaboracao}} ✅ 1 resultado
   {{data_atendimento}} ✅ 1 resultado
   {{responsavel_dependencia}} ✅ 1 resultado

Se algum não aparecer, template não está completo!
```

---

## 🧪 Validação: Teste um Template Após Editar

Após editar o primeiro template (3575), **teste-o**:

### Teste Manual:

```
1. Após editar MODELO - 3575.docx, salve-o
2. Abra Python/backend
3. Execute:
   from word_utils import extract_placeholders
   placeholders = extract_placeholders(
     "APP/backend/templates/MODELO - 3575 - TANGARA DA SERRA.docx"
   )
   print(placeholders)
   
4. Esperado:
   ['agencia_codigo', 'agencia_nome', 'data_atendimento', 
    'data_elaboracao', 'endereco', 'nr_os', 'responsavel_dependencia']
    
5. Se mostrar 7 placeholders → ✅ Template correto!
   Se mostrar menos → Template incompleto, revise
```

---

## 📊 Exemplo Visual: Antes vs Depois

### ANTES (Sem Placeholders)

```docx
═══════════════════════════════════════════════════════════
      RELATÓRIO FOTOGRÁFICO — LEVANTAMENTO PREVENTIVO

Contrato: 2025.7421.3575
Elaboração: Ygor Augusto Fernandes

Agência: 3575
Nome: TANGARA DA SERRA
Endereço: Avenida Principal, 456, TANGARA DA SERRA, MT 78300-000

Data de Elaboração: 2026-05-01
Data de Atendimento: 2026-04-28
Ordem de Serviço: 1753
Responsável: 2024 — JOÃO SILVA

═══════════════════════════════════════════════════════════
```

### DEPOIS (Com Placeholders)

```docx
═══════════════════════════════════════════════════════════
      RELATÓRIO FOTOGRÁFICO — LEVANTAMENTO PREVENTIVO

Contrato: 2025.7421.3575
Elaboração: Ygor Augusto Fernandes

Agência: {{agencia_codigo}}
Nome: {{agencia_nome}}
Endereço: {{endereco}}

Data de Elaboração: {{data_elaboracao}}
Data de Atendimento: {{data_atendimento}}
Ordem de Serviço: {{nr_os}}
Responsável: {{responsavel_dependencia}}

═══════════════════════════════════════════════════════════
```

### RESULTADO FINAL (Após Substituição)

```docx
═══════════════════════════════════════════════════════════
      RELATÓRIO FOTOGRÁFICO — LEVANTAMENTO PREVENTIVO

Contrato: 2025.7421.3575
Elaboração: Ygor Augusto Fernandes

Agência: 3575
Nome: TANGARA DA SERRA
Endereço: Avenida Principal, 456, TANGARA DA SERRA, MT 78300-000

Data de Elaboração: 2026-05-01
Data de Atendimento: 2026-04-28
Ordem de Serviço: 1753
Responsável: 2024 — JOÃO SILVA

═══════════════════════════════════════════════════════════
```

---

## 📋 Passo-a-Passo Final (TL;DR)

Para cada um dos 9 templates:

```
1. Abra template no Word
2. Procure por: "3575", "TANGARA DA SERRA", "Avenida Principal...", etc
3. Selecione cada valor
4. Delete-o
5. Digite o placeholder correspondente:
   - 3575 → {{agencia_codigo}}
   - TANGARA DA SERRA → {{agencia_nome}}
   - Avenida... → {{endereco}}
   - 2026-05-01 → {{data_elaboracao}}
   - 2026-04-28 → {{data_atendimento}}
   - 1753 → {{nr_os}}
   - 2024 — JOÃO SILVA → {{responsavel_dependencia}}
6. Salve (Ctrl+S)
7. Feche Word
8. Próximo template!
```

---

## 🚨 Troubleshooting: Se Algo der Errado

| Problema | Solução |
|---|---|
| Template não abre | Verifique se arquivo está corrompido, tente "Abrir e Reparar" |
| Não consegue achar campo | Use Ctrl+F para procurar por valor antigo |
| Placeholder digitado errado | Use Ctrl+H (Localizar & Substituir) para corrigir em lote |
| Formatação ficou feia | Refaça seleção e substituição com cuidado |
| Não salva | Verifique se arquivo não está aberto em outra janela |
| Dúvida qual placeholder usar | Consulte seção "Os 7 Placeholders" acima |

---

## ✅ Quando Terminar Todos os 9 Templates

Após editar todos:

```
1. Faça backup dos arquivos editados
2. Execute a função extract_placeholders() para cada um
3. Verifique se todos retornam 7 placeholders
4. Faça teste E2E completo com 1 OS
5. Valide resultado no Word
6. ✅ Pronto para Fase 2 (Backend)
```

---

## 📞 Dúvidas Frequentes

**P: Por que adicionar manualmente e não automaticamente?**  
R: Porque cada template tem layout diferente e precisa de edição visual para não quebrar design.

**P: Posso usar Find & Replace para substituir todos de uma vez?**  
R: Parcialmente. Use com cuidado — alguns valores podem aparecer em múltiplos lugares.

**P: Precisa salvar em formato específico?**  
R: Sim! Sempre .docx (Microsoft Word). Não use .doc ou outros formatos.

**P: E se quebrar a formatação?**  
R: Desfaça (Ctrl+Z) e refaça com cuidado.

**P: Quanto tempo leva editar 9 templates?**  
R: ~3 horas (20 min por template). Primeiro pode demorar mais.

**P: Precisa validar cada um?**  
R: Sim! Pelo menos testar o primeiro (3575) completamente.

---

## 🎯 Próximos Passos

1. ✅ Leia este guia até o fim
2. ⏳ Comece com template 3575
3. ⏳ Siga passo-a-passo acima
4. ⏳ Valide com extract_placeholders()
5. ⏳ Replique para outros 8 templates
6. ⏳ Avise quando terminar — próxima fase!

---

**Versão:** 3.2 | **Data:** 2026-05-01 | **Status:** Guia Completo ✅

**Este é um trabalho manual que VOCÊ precisa fazer nos templates Word.**
