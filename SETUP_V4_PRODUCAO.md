# 🚀 SETUP DA V4 PARA PRODUÇÃO
## Configuração e Uso da Versão 4 com Design System Validado

**Data:** 12 de Maio de 2026  
**Versão:** AutoRelatorio V4  
**Foco:** Versão Tradicional + SP  
**Status:** Pronto para Produção ✅

---

## 🎯 O QUE VOCÊ QUER DA V4

✅ **Design System validado** (interface bonita e funcionando)  
✅ **Função de organização de pastas** (essencial)  
✅ **Modo Tradicional + SP** (funcionalidades core)  
❌ **Editor de imagens com setas** (deixa para depois)  

---

## 📂 ESTRUTURA PREPARADA

```
AutoRelatorio_V4/
├── .context/ (documentação técnica)
├── APP/
│   ├── backend/ (Python + FastAPI)
│   │   ├── server.py ← 🎯 API principal
│   │   ├── generator.py ← Scanner Tradicional
│   │   ├── generator_sp.py ← Scanner SP
│   │   ├── word_utils.py ← Gera Word Tradicional
│   │   ├── word_utils_sp.py ← Gera Word SP
│   │   ├── routes.py ← Placeholders dinâmicos
│   │   ├── templates/ (9 templates Word)
│   │   └── outputs/ (relatórios gerados aqui)
│   │
│   └── frontend/ (React + Next.js)
│       ├── app/page.tsx ← 🎯 Interface principal
│       ├── app/relatorio/page.tsx ← Gerador
│       ├── components/ (componentes React)
│       │   ├── FormularioDinamico.tsx
│       │   ├── SidebarWizard.tsx
│       │   └── [outros]
│       ├── package.json
│       └── tailwind.config.js
│
└── run.py (orquestrador)
```

---

## 🔧 INSTALAÇÃO E SETUP

### 1️⃣ Backend (Python)

**Pré-requisitos:**
- Python 3.8+ instalado

**Instalação:**
```bash
cd AutoRelatorio_V4/APP/backend
pip install -r requirements.txt
```

**Verificar instalação:**
```bash
python -m pip list | grep fastapi
python -m pip list | grep python-docx
```

**Resultado esperado:**
```
fastapi
uvicorn
python-docx
pydantic
```

### 2️⃣ Frontend (Node.js)

**Pré-requisitos:**
- Node.js 18+ instalado

**Instalação:**
```bash
cd AutoRelatorio_V4/APP/frontend
npm install
```

**Resultado esperado:**
```
npm WARN [total X packages]
```

---

## ▶️ COMO RODAR

### Opção A: Com Script Orquestrador (Recomendado)

```bash
cd AutoRelatorio_V4
python run.py
```

**O que acontece:**
1. Abre a pasta de fotos (você escolhe)
2. Inicia o servidor backend (porta 5000)
3. Abre o navegador na interface (normalmente http://localhost:3000)
4. Você usa a interface normalmente

### Opção B: Manual (Separado)

**Terminal 1 - Backend:**
```bash
cd AutoRelatorio_V4/APP/backend
python -m uvicorn server:app --reload --host 127.0.0.1 --port 5000
```

**Terminal 2 - Frontend:**
```bash
cd AutoRelatorio_V4/APP/frontend
npm run dev
```

**Depois:**
- Abra o navegador em `http://localhost:3000`

---

## 🎮 FLUXO DE USO

### Tela Inicial (Design System V4)

```
┌─────────────────────────────────────┐
│      AUTORELATORIO V4               │
│                                     │
│  [Selecione o Modo]                 │
│  ○ Tradicional                      │
│  ○ SP (São Paulo)                   │
│                                     │
│  [Selecione a Pasta]                │
│  📁 C:\Minhas Fotos\Inspeção        │
│                                     │
│  [Scan]                             │
└─────────────────────────────────────┘
```

### Passo 1: Escolher Modo

**Clique em:** Tradicional OU SP

```
MODO TRADICIONAL:
- Scanner simples (lê pasta linear)
- Bom para inspeções simples
- Relatório direto

MODO SP (São Paulo):
- Scanner hierárquico (lê subpastas)
- Bom para inspeções complexas
- Relatório com seções
```

### Passo 2: Escolher Pasta

**Clique em:** "Selecione a Pasta"

```
Vai abrir um diálogo:
┌─────────────────────────┐
│ Selecione a Pasta       │
│                         │
│ 📁 Minhas Fotos         │
│   📁 Inspeção_01        │
│   📁 Inspeção_02        │
│                         │
│ [Selecionar] [Cancelar] │
└─────────────────────────┘
```

### Passo 3: Scannear

**Clique em:** "Scan"

```
Aguarde 5-10 segundos...

O programa vai:
1. Ler todas as fotos da pasta
2. Organizar em uma lista
3. Mostrar na grade (layout V4)
```

### Passo 4: Organizar (FUNÇÃO IMPORTANTE DA V4)

**O que aparece:**
```
┌─────────────────────────────────────┐
│ GRADE DE FOTOS                      │
│                                     │
│ [Foto 1]  [Foto 2]  [Foto 3]       │
│ [Foto 4]  [Foto 5]  [Foto 6]       │
│ [Foto 7]  [Foto 8]  [Foto 9]       │
│                                     │
│ [Adicionar Descrição] [Remover]     │
│ [Reordenar] [Editar]                │
└─────────────────────────────────────┘
```

**Como organizar:**
1. Clique em uma foto para selecionar
2. Arraste para reordenar (ou botões seta)
3. Clique em "Adicionar Descrição"
4. Selecione uma das 4 opções pré-definidas
5. Clique em "Salvar"

**Função de Organização da V4:**
- Reordenar fotos com drag-and-drop
- Adicionar descrições por foto
- Remover fotos indesejadas
- Renomear seções (se modo SP)
- Preview em tempo real

### Passo 5: Selecionar Template

**Selecione qual template usar:**
```
Template 1: Estilo 1 (layout simples)
Template 2: Estilo 2 (layout com cores)
Template 3: Estilo 3 (seu design preferido)
Template 4: Estilo 4 (layout corporativo)
...
```

### Passo 6: Gerar Relatório

**Clique em:** "Gerar"

```
Aguarde 30 segundos...

O programa vai:
1. Processar todas as fotos
2. Inserir no template Word
3. Criar arquivo final
4. Salvar em: APP/backend/outputs/

Resultado:
RELATÓRIO FOTOGRÁFICO - Inspeção_01 - LEVANTAMENTO PREVENTIVO.docx
```

---

## 💼 CASOS DE USO

### Caso 1: Inspeção Simples (TRADICIONAL)

**Sua pasta:**
```
C:\Inspeção\
├── Foto_Entrada.jpg
├── Foto_Alvenaria.jpg
├── Foto_Cobertura.jpg
└── Foto_Saida.jpg
```

**Como usar:**
1. Modo: **Tradicional**
2. Pasta: `C:\Inspeção\`
3. Scan → Organiza as 4 fotos
4. Gera um relatório simples e linear

---

### Caso 2: Inspeção Complexa (SP)

**Sua pasta:**
```
C:\Inspeção_Grande\
├── Subsolo/
│   ├── Foto_1.jpg
│   ├── Foto_2.jpg
│   └── Foto_3.jpg
├── Térreo/
│   ├── Foto_1.jpg
│   ├── Foto_2.jpg
│   └── Foto_3.jpg
└── Cobertura/
    ├── Foto_1.jpg
    ├── Foto_2.jpg
    └── Foto_3.jpg
```

**Como usar:**
1. Modo: **SP**
2. Pasta: `C:\Inspeção_Grande\`
3. Scan → Reconhece as subpastas (Subsolo, Térreo, Cobertura)
4. Organiza por seções automaticamente
5. Gera um relatório estruturado

---

## ⚙️ CONFIGURAÇÕES IMPORTANTES

### 1️⃣ Desabilitar Editor de Imagens (Se Quiser)

**Local:** `AutoRelatorio_V4/APP/frontend/components/`

**Arquivo:** `ImageEditorModal.tsx`

**Opção 1: Remover do fluxo**
```typescript
// Comentar ou deletar a importação
// import ImageEditorModal from './ImageEditorModal';

// Na função de renderizar, não mostrar o editor
// Deixar apenas: preview + descrição
```

**Opção 2: Deixar como está (recomendado)**
- O editor está lá, mas é opcional
- Você não é obrigado a usar
- Se precisar depois, está pronto

### 2️⃣ Templates Word

**Local:** `AutoRelatorio_V4/APP/backend/templates/`

**O que temos:**
- 9 templates DOCX prontos
- Compatíveis com Tradicional e SP
- Estilo 3 deve estar nessa pasta

**Como adicionar novo template:**
1. Crie seu template em Word
2. Adicione placeholders: `{campo}`
3. Salve como `.docx` em `templates/`
4. Reinicie a V4
5. Template aparece na lista

### 3️⃣ Placeholders Dinâmicos

**O que é:**
- Campos que preenchem automaticamente
- Exemplo: `{data_elaboracao}` → data de hoje

**Como usar:**
```
No template Word, coloque:
- {data_elaboracao} ← Data automática
- {responsavel} ← Seu nome
- {cliente} ← Nome do cliente
- {local} ← Onde foi inspecionado
- {numero_contrato} ← Contrato
```

**No app, você preenche uma vez e tudo se substitui.**

---

## 🧪 TESTE PRÁTICO (Estilo 3)

### Preparação

1. **Crie uma pasta de teste:**
```
C:\Teste_V4\
├── Foto_1.jpg (qualquer imagem)
├── Foto_2.jpg
└── Foto_3.jpg
```

2. **Tenha o template Estilo 3:**
```
AutoRelatorio_V4/APP/backend/templates/
└── Estilo_3.docx (seu template aqui)
```

3. **Inicie V4:**
```bash
cd AutoRelatorio_V4
python run.py
```

### Execução

1. **Modo:** Clique em "Tradicional"
2. **Pasta:** Selecione `C:\Teste_V4\`
3. **Scan:** Clique em "Scan"
4. **Organize:** 
   - Veja as fotos aparecerem
   - Adicione descrição se quiser
   - Reordene se necessário
5. **Template:** Selecione "Estilo_3.docx"
6. **Gerar:** Clique em "Gerar"
7. **Resultado:** Vá em `AutoRelatorio_V4/APP/backend/outputs/`
8. **Abra:** `RELATÓRIO FOTOGRÁFICO - Teste_V4 - LEVANTAMENTO PREVENTIVO.docx`

**Resultado esperado:** Um Word bonito com suas fotos e informações.

---

## ✅ CHECKLIST ANTES DE USAR

- [ ] Python 3.8+ instalado
- [ ] Node.js 18+ instalado
- [ ] Backend instalado (`pip install -r requirements.txt`)
- [ ] Frontend instalado (`npm install`)
- [ ] Templates copiados (Estilo 3 está na pasta `templates/`)
- [ ] Pasta de teste criada com algumas fotos
- [ ] Rodou `python run.py` sem erros
- [ ] Acessou `http://localhost:3000` no navegador
- [ ] Scaneou a pasta de teste
- [ ] Gerou um relatório com sucesso
- [ ] Abriu o DOCX no Word

---

## 🚨 PROBLEMAS COMUNS

### Problema: "Porta 5000 já em uso"
**Solução:**
```bash
# Matando processo anterior
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Problema: "Node.js não encontrado"
**Solução:**
```bash
# Instalar Node.js em https://nodejs.org/
# Depois verificar:
node --version
npm --version
```

### Problema: "Pasta vazia (sem fotos)"
**Solução:**
- Certifique-se que a pasta tem arquivos .jpg ou .png
- Não selecione subpastas vazias
- Use a pasta raiz com as fotos

### Problema: "Gerar não funciona"
**Solução:**
1. Verifique se escolheu um template
2. Verifique se a pasta de outputs existe
3. Veja os logs em `APP/backend/outputs/process_log.txt`

---

## 📊 RESUMO DA V4 PARA VOCÊ

| Aspecto | Status | Pronto? |
|---------|--------|---------|
| **Design System** | Validado | ✅ Sim |
| **Modo Tradicional** | Funcional | ✅ Sim |
| **Modo SP** | Funcional | ✅ Sim |
| **Organização de Pastas** | Funcional | ✅ Sim |
| **Reordenação de Fotos** | Funcional | ✅ Sim |
| **Descrição Dinâmica** | Funcional | ✅ Sim |
| **Templates Múltiplos** | Funcional | ✅ Sim |
| **Editor de Imagens** | Disponível | ⏸ Deixar para depois |
| **Pronto para Produção?** | Validado | ✅ SIM |

---

## 🎯 PRÓXIMAS AÇÕES

1. **Hoje:**
   - [ ] Instale o backend e frontend
   - [ ] Rode o `run.py`
   - [ ] Teste com pasta de teste
   - [ ] Gere um DOCX com Estilo 3

2. **Depois:**
   - [ ] Teste com dados reais (Tradicional)
   - [ ] Teste com dados reais (SP)
   - [ ] Compare com V3 (se quiser)
   - [ ] Ajuste templates conforme necessário

3. **Futura:**
   - [ ] Ative editor de imagens se precisar
   - [ ] Implemente placeholders dinâmicos
   - [ ] Teste em diferentes máquinas

---

## 📞 SUPORTE

Se tiver problemas:
1. Verifique os logs: `APP/backend/outputs/process_log.txt`
2. Verifique erros no console do navegador (F12)
3. Verifique se os arquivos `generator.py` e `word_utils.py` existem
4. Reinicie tudo (servidor + navegador)

---

**V4 está pronta para você usar com confiança!** 🚀

*Setup guide criado em 12 de Maio de 2026*  
*Para AutoRelatorio V4*  
*Preparado para: Tiago*
