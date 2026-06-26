# PLAN-consolewatcher-batch.md

## 🎯 Objetivo
Ajustar o layout do `ConsoleWatcher` para que ele funcione como um rodapé integrado (empurrando o conteúdo para cima ao abrir) e criar um script de inicialização (`.bat`) robusto que gerencie todo o ecossistema V4 (Backend + Frontend).

---

## 🛠️ Fase 1: Limpeza e Organização do Repositório
Identificar e marcar arquivos redundantes para arquivamento no `03_ARQUIVO_MORTO`.

- [ ] **Auditoria de Pastas:**
  - `Minha.pasta.projeto.Autorelatorio.V4`: Provável redundância de backup.
  - Arquivos `.md` de diagnóstico na raiz: Verificar se ainda são úteis.
- [ ] **Ação:** Propor ao usuário o movimento desses itens para a pasta de arquivos mortos.

---

## 🎨 Fase 2: Refatoração do ConsoleWatcher (UI/UX)
Transformar o terminal flutuante em um componente de rodapé que interage com o layout.

- [ ] **Mudança de Posicionamento:**
  - Remover `position: fixed` e `bottom: 80`.
  - Integrar o `ConsoleWatcher` na estrutura de grid/flex do `AppShell`.
- [ ] **Microinteração:**
  - Implementar animação `translateY` para a entrada do terminal.
  - Garantir que, ao expandir, ele reduza o espaço do `PhotoGrid` em vez de cobri-lo.
- [ ] **Z-Index e Estilo:**
  - Ajustar bordas e sombras para que pareça uma "gaveta" (drawer) de sistema.

---

## ⚡ Fase 3: Automação de Inicialização (Batch Script)
Criar um fluxo determinístico para subir o app.

- [ ] **Script `start_v4.bat`:**
  - Localizado na raiz do projeto.
  - Ordem: 
    1. Define variáveis de ambiente (PORT=5000 para backend).
    2. Cria/Atualiza `APP/frontend/.env.local` com `NEXT_PUBLIC_API_URL=http://localhost:5000`.
    3. Inicia o Backend FastAPI.
    4. Aguarda o backend responder (health check).
    5. Inicia o Frontend Next.js via Turbopack.
- [ ] **Correção de Portas:**
  - Atualizar `useAppStore.ts` para usar a porta **5000** (padrão do V4).

---

## ✅ Checklist de Validação
- [ ] O backend sobe na porta 5000 sem erros.
- [ ] O frontend identifica o backend via `.env.local`.
- [ ] O seletor de pastas abre sem erro de "Backend offline".
- [ ] O terminal de logs abre empurrando a interface principal para cima.
- [ ] O script `.bat` encerra todos os processos ao ser fechado (usando o `run.py` como motor por baixo).

---

## 📝 Notas Adicionais
O arquivo `run.py` atual já possui lógica de health check e limpeza de portas. O novo `.bat` servirá como um launcher simplificado que garante que as variáveis de ambiente e o ambiente Next.js estejam configurados antes de disparar o `run.py` ou chamando os processos diretamente.
