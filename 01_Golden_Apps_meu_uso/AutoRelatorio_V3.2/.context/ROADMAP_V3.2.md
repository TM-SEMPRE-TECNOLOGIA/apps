# 🗺️ Roadmap de Implementação: AutoRelatorio v3.2

**Visão geral, timeline, prioridades e dependências**

---

## 📌 Sumário Executivo

**O que está acontecendo?**  
Atualizar AutoRelatorio para usar um sistema de **placeholders dinâmicos** (`{{campo}}`) em todos os templates Word. O usuário preenche um formulário simples com **5 campos** (OS, Agência, Data, Endereço, Responsável) + **1 auto-preenchido** (Data de hoje), e o sistema substitui automaticamente os placeholders no documento final.

**Por quê?**  
- ✅ Elimina preenchimento manual no Word (error-prone)
- ✅ UX mais simples (apenas 5 campos necessários)
- ✅ Relatórios mais rápidos e consistentes
- ✅ Fácil adicionar novos campos futuramente

**Impacto:**
- 🎯 Economia de ~5 min por OS (preenchimento manual → automático)
- 📊 9 templates atualizados com placeholders
- 🔧 2 novos endpoints no backend
- 🎨 1 novo componente no frontend

---

## 📅 Timeline Estimada

| Fase | Duração | Dependências | Status |
|---|---|---|---|
| **1. Backend (Funções)** | 2h | Nenhuma | ⏳ Próxima |
| **2. Backend (Endpoints)** | 2h | Fase 1 | ⏳ Dependente |
| **3. Frontend (Componente)** | 2h | Fase 2 | ⏳ Dependente |
| **4. Templates (Atualizar)** | 3h | Nenhuma | ⏳ Paralelo |
| **5. Testes & QA** | 2h | Fases 1-4 | ⏳ Final |
| **6. Documentação** | 1h | Todas | ⏳ Final |
| **Total** | **12h** | — | ⏳ |

**Observação:** Fases 1-2 e 4 podem rodar em paralelo (não têm dependência uma da outra).

---

## 🎯 Fases Detalhadas

### Fase 1: Backend — Funções Auxiliares (2h)

**Objetivo:** Criar funções para extrair e substituir placeholders

**Arquivos afetados:**
- ✏️ `APP/backend/word_utils.py`

**O que fazer:**
1. Implementar `extract_placeholders(docx_path) → List[str]`
   - Ler `.docx` com `python-docx`
   - Regex: `\{\{([a-z_]+)\}\}`
   - Retornar lista única de placeholders

2. Implementar `substitute_placeholders(docx_path, meta_fields) → bytes`
   - Abrir `.docx`
   - Iterar parágrafos e tabelas
   - Substituir `{{campo}}` por `meta_fields[campo]`
   - Retornar bytes

**Testes:**
- Teste unitário: `extract_placeholders()` com documento mock
- Teste unitário: `substitute_placeholders()` com valores conhecidos
- Verificar resultado em Word

**Critério de Conclusão:** ✅ Ambas as funções testadas e documentadas

---

### Fase 2: Backend — Endpoints FastAPI (2h)

**Objetivo:** Expor funções via API REST

**Arquivos afetados:**
- ✏️ `APP/backend/server.py`

**O que fazer:**
1. Novo endpoint: `GET /api/template-placeholders?template=...`
   - Retorna lista de placeholders + metadados
   - Used pelo frontend para renderizar formulário

2. Novo endpoint: `POST /api/generate-report-with-fields`
   - Recebe `meta_fields` no body
   - Chama gerador existente
   - Integra substituição de placeholders
   - Retorna `.docx` final

**Integração:**
- Reutilizar `GenerateRequest` (adicionar `meta_fields`)
- Chamar `generator.py` como antes
- Aplicar `substitute_placeholders()` após geração

**Testes:**
- Teste E2E: GET endpoint retorna JSON válido
- Teste E2E: POST endpoint retorna `.docx` com placeholders substituídos
- Teste de segurança: validar `meta_fields` (chaves conhecidas, tamanho máximo)

**Critério de Conclusão:** ✅ Ambos os endpoints testados e documentados

---

### Fase 3: Frontend — Componente Dinâmico (2h)

**Objetivo:** Criar formulário que se adapta aos placeholders do template

**Arquivos afetados:**
- 🆕 `APP/frontend/components/FormularioDinamico.tsx` (novo)
- ✏️ `APP/frontend/app/page.tsx` (ou similar — integração)

**O que fazer:**
1. Novo componente: `FormularioDinamico.tsx`
   - Props: `template`, `onSubmit`
   - Chamar `GET /api/template-placeholders` ao montar
   - Renderizar apenas campos **obrigatórios** (exceto `data_elaboracao`)
   - Auto-preencher `data_elaboracao = hoje`
   - Validação básica (campos obrigatórios)
   - Submit chama `onSubmit` com todos 7 campos

2. Integrar na página principal
   - Mostrar após seleção de template
   - Conectar `onSubmit` → POST `/api/generate-report-with-fields`
   - Feedback visual: loading, sucesso, erro

**Componentes auxiliares:**
- Toast/Alert para mensagens
- Button com estado de loading
- Input campos dinâmicos

**Testes:**
- Renderização: componente mostra 5 campos corretos
- Carregamento: chamada GET ao montar
- Validação: não permite submit com campos vazios
- Envio: POST é feito com dados corretos

**Critério de Conclusão:** ✅ Componente integrado e funcionando no fluxo principal

---

### Fase 4: Templates — Atualizar com Placeholders (3h)

**Objetivo:** Adicionar placeholders aos 9 templates Word

**Arquivos afetados:**
- ✏️ `APP/backend/templates/MODELO - XXXX - NOME.docx` (9 arquivos)

**O que fazer (para cada template):**
1. Abrir template no Word
2. Localizar seções:
   - Cabeçalho (Agência, Data, OS)
   - Página 1 (Data Elaboração, Atendimento)
   - Rodapé/Assinatura (Responsável)
3. Inserir placeholders:
   - `{{agencia_codigo}}` (onde fica o código)
   - `{{agencia_nome}}` (onde fica o nome)
   - `{{data_elaboracao}}` (onde fica a data de hoje)
   - `{{data_atendimento}}` (onde fica a data do atendimento)
   - `{{nr_os}}` (onde fica o número da OS)
   - `{{endereco}}` (onde fica o endereço)
   - `{{responsavel_dependencia}}` (onde fica matrícula + nome)

4. **Preservar formatação:** Não modificar estilos, fontes, tamanhos — apenas adicionar placeholders como texto

**Templates a atualizar:**
1. MODELO - 0908 - SÃO PAULO.docx
2. MODELO - 1507 - CUIABÁ.docx
3. MODELO - 1565 - SAO JOSE DO RIO PRETO.docx
4. MODELO - 2056 - DIVINÓPOLIS.docx
5. MODELO - 2057 - VARGINHA.docx
6. MODELO - 2626 - SALINAS.docx
7. MODELO - 2627 - VALADARES.docx
8. **MODELO - 3575 - TANGARA DA SERRA.docx** ← Principal (testar primeiro)
9. MODELO - 6122 - MATO GROSSO DO SUL.docx

**Ordem sugerida:**
- 1️⃣ Template 3575 (testar completo)
- 2️⃣ Template 1507 (confirmar padrão)
- 3️⃣ Restante (batch)

**Testes:**
- Após template 1: executar pipeline completo (extract → substitute)
- Verificar resultado no Word
- Replicar para outros 8

**Critério de Conclusão:** ✅ Todos os 9 templates com placeholders corretos

---

### Fase 5: Testes & QA (2h)

**Objetivo:** Validar todo o sistema end-to-end

**Testes Unitários:**
- ✅ `test_extract_placeholders()` — Extrai corretamente
- ✅ `test_substitute_placeholders()` — Substitui corretamente
- ✅ `test_endpoint_get_placeholders()` — API retorna JSON válido
- ✅ `test_endpoint_generate_with_fields()` — API gera `.docx` válido

**Testes de Integração:**
- ✅ E2E: Selecionar template → Formulário carrega com 5 campos → Preencher → Gerar → Download `.docx` → Abrir e verificar dados

**Testes de Regressão:**
- ✅ Modo tradicional (sem `meta_fields`) continua funcionando
- ✅ Outros tipos de relatório não afetados
- ✅ Relatórios antigos (v3.1) ainda abrem corretamente

**Testes Manuais:**
- ✅ Template 3575: Gerar 3 OS diferentes
- ✅ Template 1507: Gerar 1 OS
- ✅ Verificar formatação no Word final

**Performance:**
- ✅ Tempo de extração de placeholders < 100ms
- ✅ Tempo de substituição < 200ms
- ✅ Tempo total de geração (com imagens) < 10s

**Critério de Conclusão:** ✅ Todos os testes passando, sistema estável

---

### Fase 6: Documentação (1h)

**Objetivo:** Documentar para manutenção futura

**Arquivos:**
- ✅ `PLANEJAMENTO_V3.2.md` (já criado)
- ✅ `DETALHES_TECNICO_V3.2.md` (já criado)
- ✅ `EXEMPLOS_PRATICOS_V3.2.md` (já criado)
- 🆕 `README_PLACEHOLDERS.md` (guia rápido)
- ✏️ `server.py` — Adicionar docstrings nos endpoints
- ✏️ `word_utils.py` — Adicionar docstrings nas funções

**Conteúdo mínimo:**
- Como adicionar novo placeholder a um template
- Como testar substituição
- Troubleshooting comum

**Critério de Conclusão:** ✅ Documentação completa e exemplos claros

---

## 🔄 Fluxo de Dependências

```
Fase 1 (Backend Funcs)
    ↓
Fase 2 (Backend Endpoints) — Paralelo: Fase 4 (Templates)
    ↓
Fase 3 (Frontend Component)
    ↓
Fase 5 (Testes & QA)
    ↓
Fase 6 (Documentação)
    ↓
✅ v3.2 Pronto para produção
```

---

## 📊 Matriz de Responsabilidades

| Tarefa | Tipo | Complexidade | Tempo |
|---|---|---|---|
| Função `extract_placeholders()` | Backend/Python | 🟢 Baixa | 30 min |
| Função `substitute_placeholders()` | Backend/Python | 🟡 Média | 45 min |
| Endpoint GET `/api/template-placeholders` | Backend/API | 🟡 Média | 45 min |
| Endpoint POST `/api/generate-report-with-fields` | Backend/API | 🟡 Média | 45 min |
| Componente `FormularioDinamico.tsx` | Frontend/React | 🟡 Média | 90 min |
| Integração Frontend | Frontend/React | 🟢 Baixa | 30 min |
| Atualizar 9 templates | Manual/Word | 🟡 Média | 180 min |
| Testes unitários | QA | 🟡 Média | 60 min |
| Testes E2E | QA | 🟡 Média | 60 min |
| Documentação | Docs | 🟢 Baixa | 60 min |

---

## ✅ Checklist Pré-Implementação

Antes de começar, verificar:

- [ ] Repository está atualizado (pull latest)
- [ ] Ambiente Python tem `python-docx` instalado
- [ ] Ambiente Node tem dependências do frontend (npm install)
- [ ] Backup dos templates feito (save para version control)
- [ ] Branch feature criada: `feature/v3.2-placeholders`
- [ ] Nenhuma mudança em produção durante desenvolvimento

---

## 🚀 Go-Live Checklist

Antes de deploy para produção:

- [ ] Todos os testes passando (local + CI/CD)
- [ ] Code review realizado
- [ ] Documentação atualizada
- [ ] Backup dos templates existentes feito
- [ ] 1 template testado end-to-end em produção
- [ ] Rollback plan em lugar (reverter para v3.1 se necessário)
- [ ] Comunicado ao usuário sobre nova feature
- [ ] Monitoramento ativado para novos endpoints

---

## 🔧 Ferramentas & Ambiente

**Backend:**
- Python 3.8+
- FastAPI
- python-docx (docx manipulation)
- pytest (testes)

**Frontend:**
- Node.js 16+
- Next.js 13+
- React 18+
- Tailwind CSS

**Desenvolvimento:**
- Git (version control)
- VS Code (IDE)
- Postman (testes de API)
- Word (verificação de templates)

---

## 📚 Referências Técnicas

### Documentação Criada
1. `PLANEJAMENTO_V3.2.md` — Visão geral completa
2. `DETALHES_TECNICO_V3.2.md` — Especificações técnicas
3. `EXEMPLOS_PRATICOS_V3.2.md` — Casos de uso reais
4. `ROADMAP_V3.2.md` — Este arquivo

### Recursos Externos
- [python-docx documentation](https://python-docx.readthedocs.io/)
- [FastAPI tutorials](https://fastapi.tiangolo.com/)
- [React hooks](https://react.dev/reference/react/hooks)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 💬 Notas Importantes

### Backward Compatibility
- ✅ Modo tradicional (sem placeholders) continua funcionando
- ✅ Templates antigos (v3.1) não são afetados
- ✅ Novos templates recebem os placeholders

### Escalabilidade
- 🟢 Fácil adicionar novos placeholders (só editar templates)
- 🟢 Performance é O(n) onde n = número de parágrafos/cells
- 🟡 Para documentos muito grandes (>1000 páginas), considerar cache

### Segurança
- ✅ Validar `meta_fields` no backend (chaves conhecidas)
- ✅ Limitar tamanho dos valores (max 500 chars)
- ✅ Não aceitar caracteres especiais perigosos

### Manutenção Futura
- 📝 Se adicionar novo placeholder:
  1. Editar todos os 9 templates
  2. Atualizar `PLACEHOLDER_METADATA` em `server.py`
  3. Testar endpoint GET
  4. Testar pipeline completo

---

## 🎓 Boas Práticas

1. **Sempre testar localmente antes de deploy**
2. **Manter templates em version control (git)**
3. **Documentar qualquer mudança nos placeholders**
4. **Fazer backup antes de editar templates**
5. **Usar branches feature para desenvolvimento**
6. **Code review antes de merge para main**

---

## 📞 Próximas Ações

1. ✅ **Aprovação do planejamento** (você aqui)
2. ⏳ **Iniciar Fase 1** (Backend - Funções)
3. ⏳ **Iniciar Fase 4** (Templates - Atualizar)
4. ⏳ **Fase 2 & 3** (Após Fase 1)
5. ⏳ **Fase 5 & 6** (Final)

---

## 📈 Métricas de Sucesso

Após conclusão da v3.2:

| Métrica | Meta |
|---|---|
| Tempo de preenchimento de OS | < 1 min (vs 5 min antes) |
| Taxa de erro de preenchimento | 0% (automático) |
| Cobertura de templates | 100% (9/9) |
| Testes passando | 100% |
| Performance de geração | < 10s |

---

**Versão:** 3.2 | **Data:** 2026-05-01 | **Status:** Roadmap Aprovado ✅

**Próximo passo:** Iniciar Fase 1 (Backend - Funções)
