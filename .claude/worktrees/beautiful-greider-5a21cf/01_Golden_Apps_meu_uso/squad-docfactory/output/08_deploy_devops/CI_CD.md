# CI/CD (Continuous Integration & Delivery) — Auto Relatório

Como a "Entrega" original foi um executável / script portátil entre técnicos, o paradigma de CI/CD difere de aplicações modernas em nuvem.

## 1. Controle de Código Básico
- A máquina Mestre opera sob Git `(repo: 02_Golden_Apps_Deploy)`.
- **Commits Convencionais** (Semantic Commits) são fundamentados (`feat:`, `fix:`, `refactor:`).
- Se houver `> 10 modificações atômicas`, o Script `/turbo-checkpoint` entra em ação e engessa uma Checkpoint branch.

## 2. CheckIn Visual e Snapshot
Não possuímos integração de Github Actions para Pipeline rodando linting automatizado ainda. O *Human In Loop* (O Dev dono, aka Thiago) confia nos previews que são levantados com `npm run dev` combinados com as verificações da Antigravity (IA Base) testando o output em `.md` Artifacts.

## 3. Entrega do App (V2 Roadmap)
- Se a aplicação seguir o rumo de Distribuição (vender para outras construtoras), ela usaria **PyInstaller** e integraria Nuitka ou Cython pra converter o backend em binário.
- O Frontend passaria por `npm run build` na CI do GitHub Actions pra jogar arquivos flat CSS/HTML em memória pra rodar junto com `.exe` do Windows num zip portátil.

## 4. Nuvem e Vercel (V3)
- O Repositório ganharia o trigger de **Vercel Deploy**. Cada `git push main` constrói a Edge Function na conta corporativa (TM Sempre).
- A proteção anti-commit cego reside em fazer os Builds localmente (`npx build`) pra rodar checagem de TS (TypeScript Warnings) antes de poluir a master.
