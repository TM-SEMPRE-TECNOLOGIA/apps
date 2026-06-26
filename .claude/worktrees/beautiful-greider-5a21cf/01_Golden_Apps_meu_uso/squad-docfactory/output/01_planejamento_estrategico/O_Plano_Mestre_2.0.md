# O Plano Mestre 2.0: Auto Relatório (NX Relatórios)

## 1. Introdução e Visão Geral

Este documento estabelece a fundação estratégica para a evolução do **Auto Relatório V1** (comercialmente: **NX Relatórios**). O Auto Relatório é um aplicativo Desktop de uso interno da **TM Sempre Tecnologia** que automatiza a geração de **Relatórios Fotográficos em formato .docx** a partir de pastas de imagens organizadas hierarquicamente.

**O que o produto faz hoje:**
O técnico de campo (manutenção predial) tira fotos organizadas em pastas no PC. O Auto Relatório varre essas pastas, monta um preview visual no navegador, e gera automaticamente um documento Word profissional com todas as fotos categorizadas, títulos hierárquicos e descrições padronizadas — eliminando horas de trabalho manual em editores de texto.

## 2. Contexto do Problema

O setor de manutenção predial (especialmente levantamentos preventivos em agências bancárias e edifícios corporativos) exige a entrega de **Relatórios Fotográficos** detalhados após cada visita técnica. Esses relatórios são obrigatórios para:

- **Comprovação de Serviço:** Evidenciar visualmente que a vistoria foi realizada.
- **Documentação Técnica:** Registrar o estado de cada item inspecionado (área externa, área interna, segundo piso, etc.).
- **Conformidade Contratual:** Atender exigências de SLA com o cliente final (ex: bancos, administradoras).

**Dores que o Auto Relatório resolve:**
- ❌ Montar relatórios manualmente no Word leva **2-4 horas** por agência.
- ❌ Inserir fotos uma a uma, redimensionar, categorizar e formatar é tedioso e propenso a erros.
- ❌ Técnicos não-técnicos cometem erros de formatação constantemente.
- ✅ Com o Auto Relatório, o processo inteiro leva **menos de 5 minutos**.

## 3. Arquitetura Técnica Atual

### Stack Tecnológico
| Camada | Tecnologia | Função |
|--------|-----------|---------|
| **Orquestrador** | `run.py` (Python + Rich) | Script pai que gerencia Backend e Frontend em um único terminal. Limpa portas (3000/5000), faz health-check com spinner premium, e monitora crashes. |
| **Backend API** | FastAPI (Python, porta 5000) | Endpoints REST: `/api/scan` (varredura de pastas), `/api/generate` (geração do .docx), `/api/templates` (listagem de modelos Word), `/api/thumbnail` (preview de imagens), `/api/download`, `/api/dialog/folder` (seletor nativo Windows). |
| **Frontend UI** | Next.js + Tailwind + Framer Motion (porta 3000) | Interface visual responsiva com 3 componentes modulares: `SidebarWizard` (wizard de configuração passo-a-passo), `PreviewGrid` (grid de imagens pós-scan), `ConsoleWatcher` (terminal visual de logs). |
| **Motor de Geração** | `python-docx` via `word_utils.py` / `word_utils_sp.py` | Insere conteúdo estruturado (títulos hierárquicos + imagens redimensionadas) no template `.docx` base. |

### Fluxo de Execução
1. Usuário executa `python run.py` → Backend + Frontend sobem.
2. Frontend carrega o Dashboard, busca templates disponíveis via `/api/templates`.
3. Usuário seleciona a **pasta raiz** com fotos organizadas (via diálogo nativo Windows).
4. App chama `/api/scan` → Backend varre subpastas, ordena (Vista Ampla > Área Externa > Interna > Segundo Piso), extrai imagens.
5. `PreviewGrid` renderiza as imagens no navegador. Usuário pode editar.
6. Usuário confirma → `POST /api/generate` → Backend usa `word_utils.py` para inserir dados no `.docx`.
7. Relatório salvo. Download disponível via `/api/download`.

### Dois Modos Operacionais
- **Tradicional:** Hierarquia simples (pasta raiz → subpastas com nomes descritivos → fotos).
- **SP:** Hierarquias pesadas com repetições complexas no Word (`generator_sp.py` + `word_utils_sp.py`).

## 4. Objetivos Estratégicos

### Curto Prazo (V1 → V1.5)
- Estabilizar o motor de geração atual (corrigir edge cases de encoding, pastas vazias).
- Melhorar a UX do PreviewGrid (drag-and-drop para reordenar imagens antes de gerar).
- Adicionar suporte a mais formatos de imagem (.webp, .heic).
- Implementar seleção múltipla de pastas-raiz para gerar relatórios em batch.

### Médio Prazo (V2.0)
- Transformar em produto distribuível (instalador `.exe` via PyInstaller ou Electron).
- Adicionar módulo de OCR para extrair texto de placas/etiquetas nas fotos automaticamente.
- Templates dinâmicos configuráveis pelo próprio usuário (sem depender de `.docx` pré-montados).
- Suporte a exportação em PDF além de DOCX.

### Longo Prazo (V3.0 — SaaS)
- Migrar para plataforma web (Supabase + Vercel) para uso multi-tenant.
- Upload de fotos direto do celular do técnico (PWA/Camera API).
- IA para categorização automática das fotos (visão computacional).
- Dashboard de gerenciamento para gestores acompanharem os relatórios de múltiplas equipes.

## 5. KPIs de Sucesso

| KPI | Meta V1 | Fonte |
|-----|---------|-------|
| Tempo de geração por relatório | < 5 min (vs 2-4h manual) | Cronômetro usuário |
| Taxa de erro de formatação | 0% (vs ~15% manual) | Feedback técnico |
| Satisfação do usuário (NPS interno) | > 80 | Pesquisa interna |
| Adoção pelos técnicos | 100% da equipe TM | Controle interno |
| Relatórios gerados/mês | > 50 | Logs do sistema |

## 6. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Pastas com nomes em encoding não-UTF8 | Crash do scan | Tratamento de exceção com `os.fsdecode()` + log de erro (já implementado) |
| Templates .docx corrompidos | Relatório quebrado | Validação do template antes de processar |
| Imagens muito grandes (>10MB) | Lentidão / Memory | Resize automático via Pillow no scan |
| Dependência do Windows (tkinter, os.startfile) | Não portável | Para V2, abstrair com Electron ou web-only |

## 7. Conclusão

O Auto Relatório é uma ferramenta de alto impacto operacional que já provou seu valor eliminando trabalho repetitivo massivo. Este Plano Mestre guia a evolução do produto de ferramenta interna para um potencial produto comercializável, mantendo sempre o foco na simplicidade brutal que o torna eficaz: **o técnico aponta para uma pasta, aperta um botão, e sai com o relatório pronto.**