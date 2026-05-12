# AutoRelatorio V2

> Gerador automático de relatórios fotográficos para manutenção predial.  
> **Status:** v2.0 STABLE (em desenvolvimento ativo)  
> **Desenvolvedor:** Thiago Nascimento Barbosa · TM Sempre Tecnologia

---

## O que é

Sistema profissional que automatiza a geração de relatórios técnicos com fotos, descrições e formatação — reduzindo um trabalho de horas para minutos.

**Fluxo:**
1. Técnico fotografa e organiza fotos em subpastas
2. Seleciona a pasta no app
3. Sistema reconhece estrutura, renderiza grid de imagens
4. Técnico edita fotos (anotações, setas, texto) e adiciona contexto
5. Clica "Gerar" → relatório Word pronto para download

---

## Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Backend** | FastAPI + Uvicorn | Python 3.10+ |
| **Geração** | python-docx + Pillow | — |
| **Frontend** | Next.js + React + Tailwind | 16.1.6 / 19.2.3 / 4.2.2 |
| **Editor** | Fabric.js (canvas) | 7.3.1 |
| **Orquestrador** | Rich (Python logging) | — |

---

## Estrutura

```
AutoRelatorio_V2/
├── APP/
│   ├── backend/              ← FastAPI :5000
│   │   ├── server.py         ← 20+ endpoints HTTP
│   │   ├── generator.py      ← Scanner Tradicional
│   │   ├── generator_sp.py   ← Scanner São Paulo
│   │   ├── word_utils.py     ← Inserção Word Tradicional
│   │   ├── word_utils_sp.py  ← Inserção Word SP
│   │   ├── llm_generator.py  ← Geração IA (em desenvolvimento)
│   │   ├── templates/        ← 9 templates .docx
│   │   ├── output/           ← .docx gerados
│   │   └── requirements.txt
│   └── frontend/             ← Next.js :3000
│       ├── app/page.tsx      ← Core da aplicação
│       ├── components/       ← React components
│       ├── data/             ← Dados de itens (MAFFENG)
│       └── package.json
├── Minha pasta sobre o aplicativo/
│   ├── commit.html           ← Registro visual (roadmap + notas)
│   ├── mapa_edicao.html      ← Mapa clicável de arquivos
│   ├── mapa_edicao.md        ← Documentação técnica
│   ├── setup_guia.html       ← Setup interativo com checklist
│   ├── setup_guia.md         ← Setup markdown
│   ├── meu_plano.html        ← Backlog com 3 views
│   ├── meu_plano.md          ← Backlog markdown
│   └── analise_exploracao.md ← Análise técnica e funcional
├── DOCUMENTOS/               ← Documentação adicional
├── .context/
│   └── planning.md           ← Planejamento PREVC
├── run.py                    ← Orquestrador (backend + frontend)
└── run.bat                   ← Launcher Windows
```

---

## Como usar

### Instalação (primeira vez)

```bash
# Backend
cd APP/backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

**Detalhes completos:** ver `Minha pasta sobre o aplicativo/setup_guia.html` (interativo com checklist)

### Execução diária

```bash
# De qualquer lugar, na raiz do projeto
python run.py
```

Ou simplesmente **duplo clique em `run.bat`**.

O orquestrador cuida de tudo: limpa portas, sobe backend e frontend, exibe logs coloridos.

**Interface:** `http://localhost:3000`

---

## Funcionalidades implementadas

### Backend ✅

- [x] FastAPI com 20+ endpoints
- [x] Scanner de pastas (modo Tradicional)
- [x] Scanner hierárquico com regex (modo São Paulo)
- [x] Inserção automática em templates Word (.docx)
- [x] Processamento de imagens (redimensionamento, thumbnails)
- [x] Tabelas Word 5 colunas com medidas (SP)
- [x] Estrutura extensível de templates

### Frontend ✅

- [x] Dashboard responsivo (Next.js)
- [x] Grade de fotos com preview
- [x] Editor modal com Fabric.js (setas, texto, crop)
- [x] Seletor de descrições (4 opções)
- [x] Wizard lateral (6 steps)
- [x] Console de logs em tempo real
- [x] Suporte a modo Tradicional e SP

### Orquestrador ✅

- [x] Launcher unificado (run.py)
- [x] Limpeza de portas presas
- [x] Health-check automático
- [x] Logging profissional (Rich)
- [x] Graceful shutdown

---

## Em desenvolvimento

### Próximas (Crítico) 🔴

- [ ] Detalhes múltiplos por item
- [ ] Indicador de dificuldade (🟢🟡🔴)
- [ ] Regras MAFFENG automáticas

### Médio prazo (Importante) 🟡

- [ ] Integração IA (llm_generator.py)
- [ ] Editor de contexto dinâmico
- [ ] Múltiplos serviços por foto

### Futuro (Someday) ⭕

- [ ] Instalador Windows
- [ ] Documentação de usuário final
- [ ] Distribuição para outros técnicos

**Detalhes completos:** ver `Minha pasta sobre o aplicativo/meu_plano.md` ou `meu_plano.html` (interativo)

---

## Dois modos de operação

### Tradicional

- Varredura plana de pastas
- Relatório simples em Word
- Ideal para inspeções rápidas

### São Paulo (SP)

- Varredura hierárquica
- Regex nos nomes de arquivos: extrai largura, altura, desconto
- Tabelas Word formatadas com 5 colunas
- Subtotais automáticos
- Ideal para contratos MAFFENG e regulação SP

---

## Arquitetura

```
run.py (orquestrador)
  ├── FastAPI :5000 (backend)
  │     ├── /api/templates    → lista templates
  │     ├── /api/scan         → processa pasta
  │     ├── /api/generate     → cria Word
  │     └── /api/download     → serve arquivo
  └── Next.js :3000 (frontend)
        └── HTTP requests para a API
```

**Não há banco de dados** — os dados transitam em memória por sessão. O estado persiste apenas nos arquivos gerados (.docx).

---

## Documentação interna

Todos esses arquivos estão em `Minha pasta sobre o aplicativo/` com versões HTML **interativas**:

| Arquivo | O que é | Formato |
|---------|---------|---------|
| `commit.html` | Histórico de desenvolvimento + roadmap visual | HTML com timeline |
| `mapa_edicao.html` | Mapa clicável de todos os arquivos | HTML interativo |
| `setup_guia.html` | Setup com checklist persistente | HTML com checklist |
| `meu_plano.html` | Backlog com 3 visualizações | HTML Kanban + Área + Livre |
| `analise_exploracao.md` | Análise técnica e funcional | Markdown |

---

## Para desenvolvedores

### Editar o backend

- **Rotas:** `APP/backend/server.py`
- **Scanner:** `APP/backend/generator.py` (Trad) ou `generator_sp.py` (SP)
- **Word:** `APP/backend/word_utils.py` (Trad) ou `word_utils_sp.py` (SP)
- **Templates:** `APP/backend/templates/` (edite no Word)

**Documentação detalhada:** `mapa_edicao.html` → clique nos arquivos para ver o que cada um faz

### Editar o frontend

- **Core:** `APP/frontend/app/page.tsx`
- **Componentes:** `APP/frontend/components/`
- **Estilos:** `APP/frontend/app/globals.css` + Tailwind

### Testes

```bash
cd APP/backend
python -m pytest tests/
```

---

## Troubleshooting

### "Porta 3000/5000 já em uso"

O `run.py` tenta limpar automaticamente. Se persistir:

```bash
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

### "Backend não responde após 30s"

Verifique `logs/backend.log` para erros. Comum: módulos Python não instalados.

```bash
cd APP/backend
pip install -r requirements.txt
```

### "Node modules corrompidos"

```bash
cd APP/frontend
rm -r node_modules package-lock.json
npm install
```

---

## Contribuindo

- Bugfixes: crie uma branch, teste, envie PR
- Features: sincronize com `meu_plano.md` antes de começar
- Documentação: edite os .md e atualize o .html correspondente

---

## Licença

TM Sempre Tecnologia © 2026

---

**Desenvolvedor:** Thiago Nascimento Barbosa  
**Última atualização:** 24/04/2026
