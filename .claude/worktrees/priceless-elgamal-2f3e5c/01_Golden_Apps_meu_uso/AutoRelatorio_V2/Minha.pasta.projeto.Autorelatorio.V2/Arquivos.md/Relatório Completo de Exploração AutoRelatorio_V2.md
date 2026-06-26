# Análise de Exploração — AutoRelatorio V2
> Sessão: 2026-04-23 · Claude Sonnet 4.6 · Desenvolvedor: Thiago Nascimento Barbosa

---

## Em linguagem técnica

### Stack atual
| Camada | Tecnologia | Versão |
|---|---|---|
| Backend | FastAPI + Uvicorn | Python 3.10+ |
| Geração de documentos | python-docx + Pillow | — |
| Frontend | Next.js + React | 16.1.6 / 19.2.3 |
| Estilização | Tailwind CSS | 4.2.2 |
| Editor de imagem | Fabric.js (canvas) | 7.3.1 |
| Animações | Framer Motion | 12.34.4 |
| Orquestrador | Rich (Python) | — |

### Arquitetura
O sistema segue o padrão **BFF (Backend for Frontend)**: o `run.py` sobe dois processos independentes (FastAPI na :5000, Next.js na :3000), onde o frontend consome a API REST local via fetch. Não há banco de dados — os dados transitam em memória por sessão.

### Fluxo de dados
```
run.py (orquestrador)
  ├── server.py (FastAPI :5000)
  │     ├── /api/scan       → generator.py | generator_sp.py
  │     ├── /api/generate   → word_utils.py | word_utils_sp.py
  │     └── /api/download   → arquivo .docx gerado
  └── npm run dev (Next.js :3000)
        ├── page.tsx         (state machine da sessão)
        ├── SidebarWizard    (inputs + seleção de modo)
        ├── PreviewGrid      (renderização das fotos)
        └── ImageEditorModal (canvas com Fabric.js)
```

### Dois modos operacionais
- **Tradicional:** Varredura plana de pasta → fotos → Word simples
- **São Paulo (SP):** Varredura hierárquica com regex em nomes de arquivo para extrair medidas (largura, altura, desconto) → tabelas Word de 5 colunas com formatação específica

### Problema identificado: Frontend duplicado
- `AutoRelatorio_V2/frontend/` — pasta legada, contém apenas `package.json`, zero componentes. Resquício da migração do V1. **Pode ser deletada.**
- `AutoRelatorio_V2/APP/frontend/` — frontend ativo e funcional, referenciado pelo `run.py`

### Estado atual dos arquivos de documentação
| Arquivo | Status | Problema identificado |
|---|---|---|
| `commit.html` | Desatualizado | Reflete V1 (SP), não V2. Sem persistência de anotações. |
| `mapa_edicao.md` | Desatualizado | Referencia `AutoRelatorioV1_Dev`, não V2. Falta `llm_generator.py`. |
| `setup_guia.md` | Desatualizado | Caminho errado (`C:\AutoRelatorioV1_Dev` em vez de caminho V2). Falta `run.bat`. |
| `README.md` | Incompleto | Estrutura não condiz com estado real (falta `/Minha pasta`, `/logs`, `.context/`). Funcionalidades não marcadas como concluídas. |

---

## Em linguagem que eu entendo

### O que o app faz
Você tem um trabalho onde precisa tirar fotos de lugares (agências bancárias, prédios) e montar um relatório Word com essas fotos organizadas, descritas e formatadas. Isso era feito manualmente ou de forma muito lenta.

O AutoRelatorio resolve isso assim:
1. Você aponta para a pasta com as fotos
2. O app escaneia tudo automaticamente
3. Você vê as fotos na tela, pode editar, adicionar seta, texto
4. Clica em gerar — sai um relatório Word completo, formatado, pronto

**A V2 é a evolução da V1:** na V1 você fazia um por um. Na V2 o fluxo é sequencial — seleciona os itens, adiciona contexto, clica gerar, pronto. Muito mais rápido.

### Qual é o estado atual
O código do aplicativo em si está **bom e funcional**. O que está desatualizado é a **documentação** — os três arquivos na pasta "Minha pasta sobre o aplicativo" ainda falam da V1 em vários lugares.

### O que precisamos fazer (prioridade)

**Alta prioridade:**
- Reescrever `commit.html` — nova versão com estilo sóbrio/clássico, linha do tempo horizontal em roadmap, anotações que você edita direto na tela e baixa salvo
- Reescrever `mapa_edicao.md` e criar versão `.html` interativa com mapa clicável
- Reescrever `setup_guia.md` e criar versão `.html` com checklist interativo
- Criar `Meu Plano.html` + `Meu Plano.md` (por prioridade + por área + campo livre)
- Atualizar `README.md`

**Recomendado:**
- Deletar pasta `/frontend` legada da raiz
- Criar `pagina_vendas_gestor.html` (para dono da empresa)
- Criar `pagina_vendas_portfolio.html` (portfólio pessoal)
- Criar `pagina_vendas_interno.html` (documentação interna TM)

### Blueprint de estilo definido (pós-brainstorming)
- **Visual:** Sóbrio, clássico — dark neutro (não hacker, não neon), tipografia humanizada, grid limpo
- **Linha do tempo:** Roadmap horizontal, blocos com fase e status, animações suaves
- **Persistência de dados:** Edição direto na tela + botão "Salvar e Baixar HTML"
- **Mapas interativos:** Clicáveis com hover animations, mapa visual do sistema
- **Página de vendas:** 3 versões distintas (gestor, portfólio, interno)
- **Apresentação pessoal:** Dashboard técnico — arquitetura, stack, fluxo visual
- **Meu Plano:** 3 modos — por prioridade (Crítico/Importante/Someday) + por área + campo livre que exporta `.md`

---

## Observações finais

O app em si está sólido. A documentação está desatualizada e o projeto merece uma identidade documental à altura do trabalho feito. Tudo que está planejado acima é sobre apresentação, registro e usabilidade dos arquivos que cercam o app — não mexe em código de produção.
