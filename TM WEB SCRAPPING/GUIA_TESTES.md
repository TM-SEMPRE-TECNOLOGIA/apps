# 🧪 Guia de Testes — TM Web Scrapper

## Como Iniciar

### Option 1: Duplo-clique (Fácil)
1. Navegue até `C:\Users\thiag\Desktop\APPS\TM WEB SCRAPPING\`
2. Duplo-clique em `run.bat`
3. Aguarde a mensagem: `> Local: http://localhost:3000`
4. Abra o navegador em **http://localhost:3000**

### Option 2: Terminal
```bash
cd C:\Users\thiag\Desktop\APPS\TM WEB SCRAPPING
npm run dev
```

---

## Testes Manuais (Golden Path)

### Teste 1: Scrape Simples (Wikipedia)

**Objetivo:** Verificar se o Playwright funciona com conteúdo renderizado.

1. Acesse http://localhost:3000
2. Cole em "URL do Site":
   ```
   https://pt.wikipedia.org/wiki/List_of_countries_by_population
   ```
3. Cole em "Seletor CSS":
   ```
   tr td:first-child
   ```
4. Clique em **"▶ Iniciar Scrape"**
5. ✅ **Esperado:** 200+ países listados

---

### Teste 2: Scrape com Classe CSS (GitHub)

**Objetivo:** Testar seletor com classe.

1. URL:
   ```
   https://github.com
   ```
2. Seletor:
   ```
   [data-filterable-for="your-repositories-filter"] span
   ```
3. Clique em **"▶ Iniciar Scrape"**
4. ✅ **Esperado:** Listagem de repositórios (ou mensagem se não autenticado)

---

### Teste 3: Exportar CSV

**Objetivo:** Verificar download e formatação CSV.

1. Faça qualquer scrape com sucesso (use Teste 1)
2. Clique em **"📥 Exportar CSV"**
3. Verifique o arquivo baixado (`scraped_data_YYYY-MM-DD.csv`)
4. ✅ **Esperado:** 
   - Arquivo com `YYYY-MM-DD` na data
   - Cada item em uma linha
   - Aspas envoltas em strings

---

### Teste 4: Exportar JSON

**Objetivo:** Verificar JSON com metadados.

1. Faça qualquer scrape com sucesso
2. Clique em **"📥 Exportar JSON"**
3. Abra o arquivo JSON baixado
4. ✅ **Esperado:**
   ```json
   {
     "metadata": {
       "source_url": "...",
       "selector": "...",
       "scraped_at": "...",
       "total_items": 123
     },
     "items": [...]
   }
   ```

---

## Testes de Erro (Edge Cases)

### Teste 5: URL Inválida

**Cenário:** Usuário digita algo que não é URL.

1. URL: `isso nao eh uma url`
2. Seletor: `.qualquer`
3. Clique em **"▶ Iniciar Scrape"**
4. ✅ **Esperado:** Erro → `✗ URL deve começar com http:// ou https://`

---

### Teste 6: Seletor Vazio

**Cenário:** Seletor CSS deixado em branco.

1. URL: `https://exemplo.com`
2. Seletor: `` (vazio)
3. Clique em **"▶ Iniciar Scrape"**
4. ✅ **Esperado:** Erro → `✗ Seletor CSS não pode ser vazio`

---

### Teste 7: Site Inválido

**Cenário:** URL que não existe ou timeout.

1. URL: `https://site-que-nao-existe-12345.com`
2. Seletor: `.item`
3. Clique em **"▶ Iniciar Scrape"**
4. ✅ **Esperado:** Erro dentro de ~5 segundos (timeout ou DNS fail)

---

### Teste 8: Nenhum Item Encontrado

**Cenário:** Seletor existe mas não tem matches.

1. URL: `https://example.com`
2. Seletor: `.seletor-que-nao-existe-xyz`
3. Clique em **"▶ Iniciar Scrape"**
4. ✅ **Esperado:** 
   - Sucesso (count = 0)
   - Mensagem: `Nenhum item encontrado com o seletor...`

---

## Testes UI (Interação)

### Teste 9: Loading State

**Cenário:** Button desabilita durante scrape.

1. Acesse http://localhost:3000
2. Preencha URL e seletor
3. Clique em **"▶ Iniciar Scrape"**
4. **Enquanto está processando**, verifique:
   - ✅ Button mostra `Scrapando...` com spinner
   - ✅ Inputs desabilitados
   - ✅ Não é possível submeter múltiplas requisições

---

### Teste 10: Botão "Limpar"

**Cenário:** Reset do formulário.

1. Preencha URL e seletor
2. Clique em **"✕ Limpar"**
3. ✅ **Esperado:**
   - URL = vazio
   - Seletor = vazio
   - Results = desaparece
   - Mensagens de erro/sucesso = desaparecem

---

### Teste 11: Responsividade (Mobile)

**Cenário:** UI adapta a telas menores.

1. Abra DevTools (F12)
2. Ativar "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Escolha "iPhone 12 Pro"
4. ✅ **Esperado:**
   - Inputs ocupam 100% da largura
   - Buttons em linha ou empilhados
   - Resultado scrollável
   - Sem overflow horizontal

---

## Testes de Performance

### Teste 12: Scrape Grande

**Cenário:** Página com 1000+ items.

1. URL:
   ```
   https://www.w3schools.com/cssref/
   ```
2. Seletor:
   ```
   a
   ```
3. Clique em **"▶ Iniciar Scrape"**
4. ✅ **Esperado:**
   - Completa em <10 segundos
   - 100+ links coletados
   - Exportação funciona normalmente

---

### Teste 13: Múltiplos Scrapes Sequenciais

**Cenário:** Verificar se há memory leaks.

1. Faça 5 scrapes em sequência (mesma URL/seletor)
2. Monitore task manager (Playwright browser processes)
3. ✅ **Esperado:**
   - Cada scrape fecha completamente o browser
   - Memória retorna ao baseline após cada scrape
   - Sem processes "zumbis" do Chromium

---

## Checklist Final

- [ ] Teste 1: Wikipedia scrape com sucesso
- [ ] Teste 2: Seletor CSS com classe funciona
- [ ] Teste 3: CSV exports com data correta
- [ ] Teste 4: JSON contém metadados
- [ ] Teste 5: Erro URL inválida
- [ ] Teste 6: Erro seletor vazio
- [ ] Teste 7: Erro site inexistente
- [ ] Teste 8: Nenhum item encontrado (graceful)
- [ ] Teste 9: Loading state (button + spinner)
- [ ] Teste 10: Botão "Limpar" reseta tudo
- [ ] Teste 11: Mobile view responsivo
- [ ] Teste 12: Scrape grande (1000+ items)
- [ ] Teste 13: Memory cleanup após múltiplos scrapes

---

## Caso Falhe um Teste

### Erro: "Playwright not installed"
```bash
npx playwright install chromium
```

### Erro: "Address already in use :3000"
```bash
# Matar processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### Erro: "timeout of 30000ms exceeded"
→ Site muito lento ou bloqueado. Aumente `SCRAPER_TIMEOUT_MS` em `.env.local`:
```env
SCRAPER_TIMEOUT_MS=60000
```

### Componente não renderiza
→ Abra F12 > Console e verifique erros JavaScript.

---

## Próximas Features (Roadmap)

- [ ] Suporte a scroll infinito
- [ ] Rotação de proxies
- [ ] Persistência em Supabase
- [ ] Dashboard de histórico
- [ ] Rate limiting inteligente
- [ ] Webhook de callbacks

---

**Testes OK? Commit e push! 🚀**
