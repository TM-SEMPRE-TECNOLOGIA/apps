# 🔍 Diagnóstico: Por que os Templates Não Aparecem

**Data:** 3 de Maio de 2026  
**Status:** Problema identificado

---

## ⚠️ Problemas Encontrados

### **Problema 1: API_URL Incorreta** ❌
**Local:** `app/page.tsx` linha 16

```typescript
const API_URL = "http://127.0.0.1:5000";  // ❌ ERRADO
```

**Por quê é um problema:**
- Backend está rodando em **porta 8000** (uvicorn)
- Frontend está tentando conectar em **porta 5000** (Flask/outro)
- Nenhuma conexão é estabelecida → templates não carregam

---

### **Problema 2: .env.local Não Existe** ❌
**Local:** `app/frontend/.env.local`

**Por quê é um problema:**
- FormularioDinamico.tsx espera a variável de ambiente
- Sem `.env.local`, o componente não tem a URL do backend
- Requisições caem por CORS ou timeout

---

### **Problema 3: Estrutura de Dados Incorreta** ⚠️
**Local:** `app/page.tsx` linha 93-96

```typescript
const res = await fetch(`${API_URL}/api/templates`);
const data = await res.json();
if (data.templates) {  // ❌ Espera "templates" no response
  setTemplates(data.templates);
}
```

**Mas a API retorna:**
```json
["MODELO - 0908 - SÃO PAULO.docx", "MODELO - 1507 - CUIABÁ.docx", ...]
```

**Por quê é um problema:**
- API retorna um **array direto**, não um objeto com `{templates: [...]}`
- O `if (data.templates)` falha porque `data` é um array
- Templates nunca são atribuídos ao state

---

## 📊 Resumo dos Problemas

| Problema | Tipo | Severidade | Causa |
|----------|------|-----------|-------|
| API_URL errada | Configuração | 🔴 Crítico | Porta 5000 vs 8000 |
| .env.local missing | Configuração | 🔴 Crítico | Arquivo não existe |
| Estructura de response | Código | 🟠 Alto | Mismatch entre API e UI |

---

## ✅ O Que Precisa Ser Feito

### 1️⃣ **Criar `.env.local`**
Arquivo: `APP/frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2️⃣ **Corrigir API_URL em `page.tsx`**
Mudar linha 16 de:
```typescript
const API_URL = "http://127.0.0.1:5000";
```
Para:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

### 3️⃣ **Corrigir estrutura de response em `page.tsx`**
Mudar linhas 93-96 de:
```typescript
if (data.templates) {
  setTemplates(data.templates);
}
```
Para:
```typescript
if (Array.isArray(data)) {
  setTemplates(data);
}
```

### 4️⃣ **Corrigir estrutura de metadados em `page.tsx`**
Mudar linhas 73-76 de:
```typescript
const res = await fetch(`${API_URL}/api/template-placeholders?template=${encodeURIComponent(templateName)}`);
const data = await res.json();
if (data.placeholders) {
  setTemplatePlaceholders(data.placeholders);
```
Para:
```typescript
const res = await fetch(`${API_URL}/api/template-placeholders/${encodeURIComponent(templateName)}`);
const data = await res.json();
if (data.fields) {
  setTemplatePlaceholders(Object.keys(data.fields));
```

---

## 🔧 Resumo de Mudanças Necessárias

**Arquivos a modificar:**
1. ✏️ `APP/frontend/.env.local` — **Criar arquivo novo**
2. ✏️ `APP/frontend/app/page.tsx` — **3 mudanças pequenas**

**Arquivos que estão certos:**
- ✅ `APP/frontend/components/FormularioDinamico.tsx` — Componente está OK
- ✅ `APP/backend/routes.py` — API endpoints estão OK
- ✅ `APP/backend/server.py` — Router está integrado

---

## 🎯 Resultado Esperado Após Correções

```
✅ Frontend conecta ao backend na porta 8000
✅ GET /api/templates retorna 9 templates
✅ Dropdown é preenchido com templates
✅ Ao selecionar template, formulário aparece com 5 campos
✅ Data de elaboração é auto-preenchida
```

---

## 🚀 Próximas Ações

1. ✏️ Criar `.env.local` com URL correta
2. ✏️ Corrigir `page.tsx` com as 3 mudanças
3. 🔄 Reiniciar frontend: `npm run dev`
4. ✅ Verificar se templates aparecem no dropdown

---

**Pronto para fazer as correções? Confirma para eu começar!**
