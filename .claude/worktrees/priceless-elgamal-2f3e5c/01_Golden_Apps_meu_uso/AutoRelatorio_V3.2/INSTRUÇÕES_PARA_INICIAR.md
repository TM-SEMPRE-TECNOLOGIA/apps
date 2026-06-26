# 🚀 Instruções para Iniciar AutoRelatorio v3.2 — CORRIGIDO

**Data:** 3 de Maio de 2026, 02:30  
**Status:** ✅ **Pronto para iniciar**

---

## ✅ O que foi corrigido

1. **Router de placeholders integrado no server.py** ✅
   - Adicionado import: `from routes import router as placeholders_router`
   - Adicionado: `app.include_router(placeholders_router)`

2. **Templates restaurados e com placeholders** ✅
   - Copiados do backup (estavam corrompidos)
   - Inseridos os 7 placeholders dinâmicos em cada template

3. **Endpoints testados e funcionando** ✅
   - `/api/health` → 200 OK
   - `/api/templates` → 200 OK (9 templates encontrados)
   - `/api/template-placeholders/{template_name}` → 200 OK

---

## 🚀 Para Iniciar (3 Terminais)

### Terminal 1 — Backend FastAPI

```bash
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V3.2\APP\backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Esperado:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Terminal 2 — Frontend Next.js

```bash
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V3.2\APP\frontend
npm run dev
```

Esperado:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

### Terminal 3 — Testes (Opcional)

```bash
cd C:\Users\thiag\Desktop\TM-MEUS-APPS\01_Golden_Apps_meu_uso\AutoRelatorio_V3.2\APP\backend
python test_endpoints.py
```

Esperado:
```
[OK] Health endpoint funcionando
[OK] List templates funcionando
[OK] Template metadata funcionando
[SUCCESS] Todos os endpoints testados!
```

---

## 🌐 Acessar Aplicação

1. **Abrir navegador:**
   ```
   http://localhost:3000
   ```

2. **Você verá:**
   - ✅ Dropdown com 9 templates
   - ✅ Formulário com 5 campos para preencher
   - ✅ 1 campo auto-preenchido (Data de Elaboração = hoje)
   - ✅ Botão "GERAR RELATÓRIO"

3. **Para testar:**
   - Selecionar template: "MODELO - 3575 - TANGARA DA SERRA.docx"
   - Número OS: `1753`
   - Data Atendimento: `2026-05-01`
   - Código Agência: `3575`
   - Nome Agência: `TANGARA DA SERRA`
   - Endereço: `Avenida Brasil, 1000`
   - Responsável: `123456 - João Silva`
   - Clicar "GERAR RELATÓRIO"

4. **Resultado esperado:**
   - Arquivo baixa automaticamente
   - Nome: `RELATORIO_1753_*.docx`
   - Abrir no Word
   - Verificar que {{placeholders}} foram substituídos

---

## 📊 Estrutura de Arquivos

```
APP/
├── backend/
│   ├── server.py ................... [ATUALIZADO] Com router integrado
│   ├── routes.py ................... [CRIADO] Endpoints do v3.2
│   ├── word_utils.py ............... [ATUALIZADO] Com compatibilidade
│   ├── templates/ .................. [RESTAURADO] 9 templates válidos
│   │   ├── MODELO - 0908 - SÃO PAULO.docx
│   │   ├── MODELO - 1507 - CUIABÁ.docx
│   │   ├── ... (7 mais)
│   ├── templates_backup/ ........... [BACKUP]
│   ├── outputs/ .................... [OUTPUT - será preenchido]
│   └── test_endpoints.py ........... [VERIFICAÇÃO]
│
└── frontend/
    ├── components/
    │   ├── FormularioDinamico.tsx .. [CRIADO] Componente principal
    │   └── ...
    ├── .env.local .................. [VERIFIQUE] NEXT_PUBLIC_API_URL
    └── ...
```

---

## 🔍 Checklist Antes de Iniciar

- [ ] Backend folder (`APP/backend/`) tem 9 templates .docx
  ```bash
  cd APP\backend\templates
  ls *.docx | wc -l  # Deve ser 9
  ```

- [ ] Server.py tem o import:
  ```bash
  grep "from routes import" APP\backend\server.py
  ```

- [ ] Frontend .env.local configurado:
  ```bash
  cat APP\frontend\.env.local
  # Deve ter: NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

---

## ⚠️ Se der erro

### "ModuleNotFoundError: No module named 'uvicorn'"
```bash
pip install uvicorn
```

### "Port 8000 already in use"
```bash
# Mudar porta em um dos terminais
python -m uvicorn server:app --port 8001
```

### "Cannot find templates"
```bash
# Restaurar do backup
Copy-Item "templates_backup\*.docx" -Destination "templates\" -Force
```

### "Frontend não conecta ao backend"
```bash
# Verifique .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > APP\frontend\.env.local
```

---

## ✨ Estatus Final

| Componente | Status | Ação |
|-----------|--------|------|
| Backend Server | ✅ Pronto | Iniciar com uvicorn |
| Frontend App | ✅ Pronto | Iniciar com npm run dev |
| Templates | ✅ Restaurados | 9 templates com placeholders |
| API Endpoints | ✅ Funcionando | 7 endpoints disponíveis |
| Router Integrado | ✅ Sim | Incluído em server.py |

---

**Próximo passo: Abrir 3 terminais e iniciar!** 🚀
