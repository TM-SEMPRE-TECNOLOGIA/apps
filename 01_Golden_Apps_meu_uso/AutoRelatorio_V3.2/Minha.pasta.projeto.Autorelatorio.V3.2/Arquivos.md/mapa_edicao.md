# Mapa de Edição — AutoRelatorio V2

> Atualizado em 2026-04-23. Versão interativa: `mapa_edicao.html`

---

## Fluxo de Execução

1. Usuário executa `run.bat` → chama `run.py`
2. `run.py` limpa portas, sobe **FastAPI** na `:5000` e **Next.js** na `:3000`
3. Frontend carrega `page.tsx`, busca templates em `GET /api/templates`
4. Usuário seleciona pasta → `POST /api/scan` → `generator.py` ou `generator_sp.py`
5. `PreviewGrid` renderiza fotos; usuário edita via `ImageEditorModal`
6. Confirmar → `POST /api/generate` → `word_utils.py` monta o `.docx`
7. Download via `GET /api/download` → arquivo salvo em `output/`

---

## Entrada (Orquestrador)

| Arquivo | Caminho | Edite quando |
|---|---|---|
| `run.bat` | `/run.bat` | Mudar título da janela, passar variáveis de ambiente |
| `run.py` | `/run.py` | Mudar timeout do backend, banner, portas, adicionar serviços |

---

## Backend

Diretório: `APP/backend/`

| Arquivo | Responsabilidade | Edite quando |
|---|---|---|
| `server.py` | Endpoints HTTP (20+ rotas) | Adicionar rota, mudar validação, ajustar CORS |
| `generator.py` | Scanner modo Tradicional | Mudar ordenação, filtros de extensão, estrutura de pastas |
| `generator_sp.py` | Scanner modo SP (regex de medidas) | Mudar regex, novos campos extraídos, agrupamento Foto×Detalhe |
| `word_utils.py` | Inserção no Word (Tradicional) | Tamanho de fotos, formatação de legendas |
| `word_utils_sp.py` | Inserção no Word (SP, tabelas 5 col) | Estrutura de tabelas, medidas em vermelho, subtotais |
| `llm_generator.py` | Geração de descrições por IA | Configurar chave de API, ajustar prompt, integrar ao server.py |
| `templates/` | 9 arquivos `.docx` base | Cabeçalho/rodapé, fonte, novo modelo de relatório |

---

## Frontend

Diretório: `APP/frontend/`

| Arquivo | Responsabilidade | Edite quando |
|---|---|---|
| `app/page.tsx` | State machine da sessão | Novo estado global, layout geral, dropdown de descrições |
| `components/SidebarWizard.tsx` | Painel lateral (6 steps) | Novos inputs, mudar steps, alterar labels |
| `components/PreviewGrid.tsx` | Grade responsiva de fotos | Layout dos cards, infos extras, lógica de seleção |
| `components/ImageEditorModal.tsx` | Editor canvas (Fabric.js) | Nova ferramenta de anotação, cores padrão, salvar edição |
| `components/ConsoleWatcher.tsx` | Logs em tempo real na UI | Formato visual, filtros, intervalo de polling |
| `app/globals.css` | CSS global e variáveis | Cores do design system, fontes, variáveis Tailwind |

---

## Saída

| Local | O que é |
|---|---|
| `APP/backend/output/` | `.docx` gerados — não versionar, limpar periodicamente |

---

## Diferença Tradicional vs SP

- **Tradicional:** varredura plana → fotos → Word simples
- **SP:** varredura hierárquica + regex nos nomes de arquivo → medidas (largura/altura/desconto) → tabelas Word 5 colunas com formatação específica
