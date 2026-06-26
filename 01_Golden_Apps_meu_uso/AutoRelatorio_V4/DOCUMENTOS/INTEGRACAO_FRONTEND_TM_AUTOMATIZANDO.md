# Integração da TM-Automatizando ao AutoRelatório V4

> Documento exclusivamente prático: COMO colocar a skill dentro do app atual sem quebrar nada, qual o visual ideal, e o que fazer onde houver limitação técnica.

---

## 1. Onde plugar — análise do frontend atual

Estrutura atual em `APP/frontend/`:

```
components/
├── shell/Topbar.tsx
├── organizar/
│   ├── PhotoGrid.tsx          ← grid de fotos do levantamento
│   ├── DocxPreviewPanel.tsx   ← preview do .docx ao lado
│   ├── CTABar.tsx             ← barra de ação (botão "Gerar relatório")
│   └── ContextMenu.tsx
└── views/
    ├── OrganizarView.tsx      ← rota /organizar (Rota A - pastas)
    ├── ModelosView.tsx
    ├── RelatoriosView.tsx
    └── ConfiguracoesView.tsx
```

A Rota A (pastas → DOCX) já está consolidada em `OrganizarView`.
A Rota B (DOCX pré-finalizado) **ainda não existe** no frontend.

---

## 2. Recomendação de integração — NOVA view dedicada

### 2.1. Adicionar `CompletarView.tsx`

Cria-se uma nova rota `/completar` com sua própria view, sem mexer no `OrganizarView`. Isso evita acoplamento: quem usa Rota A continua usando, quem precisa de Rota B abre a nova tela.

```
components/views/CompletarView.tsx         ← NOVA
components/completar/
├── DropZone.tsx                          ← arrasta .docx pré-finalizado
├── ContractPicker.tsx                    ← escolhe 0908/1507/1565/...
├── BlocosList.tsx                        ← lista de blocos detectados
├── BlocoCard.tsx                         ← card com foto+narrativa+conta+aprovação
├── PreviewIframe.tsx                     ← embute o preview_html.html
├── CrosscheckPanel.tsx                   ← painel ✅/⚠/❌
└── CuradoriaPanel.tsx                    ← aprovar/rejeitar frases novas
```

### 2.2. Atualizar `Topbar` com nova entrada

```diff
// Topbar.tsx
- <Tab href="/organizar">Organizar</Tab>
- <Tab href="/modelos">Modelos</Tab>
+ <Tab href="/organizar">Organizar (pastas)</Tab>
+ <Tab href="/completar">TM-Automatizando ✨</Tab>
+ <Tab href="/modelos">Modelos</Tab>
```

---

## 3. Como o visual ideal deve ficar (mockup descritivo)

### 3.1. Tela `/completar` — Layout em 3 colunas (desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│ Topbar  · Organizar (pastas) · TM-Automatizando ✨ · Modelos    │
├─────────────────────────────────────────────────────────────────┤
│ ┌────────────────┐  ┌──────────────────────────┐  ┌───────────┐ │
│ │ 1. ENTRADA     │  │ 2. BLOCOS DETECTADOS     │  │ 3. SAÍDA  │ │
│ │                │  │                          │  │           │ │
│ │ [⬇ DropZone]   │  │ ┌─────────────────────┐ │  │ Cross-check│ │
│ │ santa-adelia   │  │ │ Foto 02 · Item 17.4 │ │  │ ✅ 18      │ │
│ │ .docx (5,8 MB) │  │ │ [thumb] [narrativa] │ │  │ ⚠ 3       │ │
│ │                │  │ │ Tabela: 28×0.90=25.20│ │  │ ❌ 0      │ │
│ │ Contrato:      │  │ │ [Aprovar][Ajustar]  │ │  │           │ │
│ │ ◉ 1565         │  │ └─────────────────────┘ │  │ Frases    │ │
│ │ ○ 0908         │  │ ┌─────────────────────┐ │  │ novas: 4  │ │
│ │ ○ 1507         │  │ │ Foto 04 · Item 17.4 │ │  │ [Revisar] │ │
│ │ ...            │  │ │ [thumb] [narrativa] │ │  │           │ │
│ │                │  │ │ ...                 │ │  │ Arquivos  │ │
│ │ VLM:           │  │ └─────────────────────┘ │  │ por etapa │ │
│ │ ◉ auto         │  │ ...                      │  │ [⬇ ZIP]   │ │
│ │ ○ sempre       │  │                          │  │           │ │
│ │ ○ nunca        │  │ [Aprovar todos]          │  │ [Gravar   │ │
│ │                │  │                          │  │  .docx]   │ │
│ │ [Iniciar TM]   │  │                          │  │           │ │
│ └────────────────┘  └──────────────────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2. Identidade visual

Aplicar o **TM Design System v3** já presente no workspace (Roboto Slab + Inter + JetBrains Mono · laranja construção · papel cinza-quente). O `preview_html.py` já gera no padrão certo — basta o frontend usar o mesmo CSS dos cards.

Especificamente:
- **Cards de bloco:** fundo `--TM-card`, borda 1px `--TM-border`, raio 10px, sombra leve.
- **Header de bloco:** badge laranja com código do item.
- **Tabela de cálculo:** monospace (JetBrains Mono) na coluna "conta", cabeçalho cinza-claro.
- **Estados:** ✅ verde · ⚠ âmbar · ❌ vermelho (mesmo CSS do preview_html).

---

## 4. Conexão Backend ↔ Frontend

### 4.1. Rotas REST a adicionar em `APP/backend/routes.py`

```python
# Novas rotas para TM-Automatizando
@router.post("/api/tma/upload")             # recebe .docx pré-finalizado
@router.post("/api/tma/processar")          # roda parsing + análise + geração
@router.get("/api/tma/blocos/{job_id}")     # devolve blocos detectados
@router.post("/api/tma/aprovar-bloco")      # marca bloco como ok
@router.post("/api/tma/gravar-docx")        # escreve _PREENCHIDO_PROPOSTA.docx
@router.get("/api/tma/saida/{job_id}.zip")  # zip com todos os arquivos por etapa
@router.post("/api/tma/curador/aplicar")    # aplica aprovações no banco
```

### 4.2. Modelo de dados (TypeScript)

```ts
type Bloco = {
  id: number;
  ref: string;                // "Foto 02"
  codigoItem: string;          // "17.4"
  textoNarrativa: string;
  detalhes: { texto: string }[];
  memorial: {
    linhas: { referencia: string; largura: number; altura: number;
              faces: number; desconto: number; total: number }[];
    totalGeral: number;
  } | null;
  thumbBase64: string;
  status: "ok" | "ajustar" | "rejeitar" | "pending";
  alertas: { nivel: "WARN" | "FAIL"; mensagem: string }[];
};
```

### 4.3. Fluxo do usuário no frontend

```
1. Usuário arrasta .docx → POST /api/tma/upload → job_id
2. Usuário escolhe contrato e modo VLM → POST /api/tma/processar
3. Frontend faz polling de GET /api/tma/blocos/{job_id}
4. Cards aparecem populados; usuário clica Aprovar/Ajustar em cada
5. Ao terminar, POST /api/tma/gravar-docx
6. Frontend baixa o .docx + zip com saída por etapa
```

---

## 5. Reutilizando componentes existentes

| Componente atual | Reutilizar como |
|---|---|
| `DocxPreviewPanel` | Embutir no painel direito de `/completar` mostrando o `_PREENCHIDO_PROPOSTA.docx` ao vivo |
| `PhotoGrid` | Reaproveitar para mostrar miniaturas extraídas do .docx |
| `CTABar` | Versão `CompletarCTABar` com botão "Gravar .docx" |
| `Topbar` | Adicionar nova aba |

---

## 6. Limitações técnicas e como contornar

| Limitação | Impacto | Contorno proposto |
|---|---|---|
| python-docx não escreve formatação complexa idêntica ao Word | Risco de estilo "quase certo" | Clonar `rPr` do parágrafo vizinho ANTES de inserir + diff visual no preview |
| VLM custa tokens | Centenas de fotos = $$ | Modo híbrido (default): só ambíguos; mostrar contador estimado no painel antes |
| Tamanho de upload (.docx grandes podem passar de 50MB) | Backend timeout | Chunks de 100 fotos + endpoint streaming |
| Frontend não roda Python | Não pode chamar a skill direto | Backend Python expõe REST; frontend só consome |
| localStorage do preview não sincroniza com backend | Aprovação some se trocar de máquina | Persistir aprovações em SQLite (job_id → bloco_id → status) |
| OCR de medidas manuscritas é frágil | Erro de leitura | Pedir ao usuário que digite as medidas no .docx OU OCR com revisão manual |
| Renderização de .docx no navegador é limitada | Preview perfeito é difícil | Usar conversão SVG por página via `docx2pdf` + `pdf2image` no backend (cache) |

---

## 7. Ordem recomendada de implementação

### Fase 1 — Backend isolado (sem frontend)
1. Implementar `parser_docx.py` completo.
2. Implementar `gerador_texto.py` + `gerador_memorial.py`.
3. Implementar `inserir_no_docx.py` com clonagem de estilo.
4. Testar via CLI contra os 3 .docx já entregues.
5. Validar que `crosscheck_report.md` sai correto.

### Fase 2 — REST API
6. Criar `routes.py` com endpoints `/api/tma/*`.
7. Persistir jobs em SQLite (`jobs.db`).
8. Smoke test com Postman.

### Fase 3 — Frontend `/completar`
9. Criar `CompletarView` + componentes.
10. Conectar à API.
11. Testar fluxo completo com Santa Adélia + Ribeirão + Guariba.

### Fase 4 — Refinamento
12. Curador integrado (UI para aprovar frases novas).
13. VLM real (Claude Vision).
14. Métricas (tempo médio, % de aprovação, etc).

---

## 8. Decisão sobre coexistência das duas rotas

| Cenário | Rota A (`/organizar`) | Rota B (`/completar`) |
|---|---|---|
| Levantamento novo, fotos em pastas | ✅ usar | – |
| .docx já volta do campo marcado | – | ✅ usar |
| Pasta + .docx parcial | A primeiro, depois B para finalizar | – |

A skill TM-Automatizando **não substitui** a Rota A — é COMPLEMENTAR.

---

## 9. O que o usuário (Thiago) precisa decidir

- [ ] Confirmar nome da rota: `/completar` ou `/tm-automatizando`?
- [ ] Cor da nova aba na Topbar (sugiro laranja construção do DS).
- [ ] Modelo do VLM: Claude (já no app) ou alternativa?
- [ ] Onde guardar jobs (SQLite local? PostgreSQL futuro?)
- [ ] Frequência da curadoria (revisar a cada relatório ou em lotes?).

---

## 10. Próximo passo prático

Quando você quiser, eu posso:

1. Escrever o `routes.py` com as 6 rotas REST.
2. Criar o `CompletarView.tsx` + componentes (HTML/CSS estáticos, sem state ainda).
3. Implementar 1 módulo Python por vez (sequência sugerida na Fase 1).
4. Rodar smoke test contra 1 dos 3 .docx para validar.

Cada um desses é uma sessão de trabalho focada — me diga qual priorizar.
