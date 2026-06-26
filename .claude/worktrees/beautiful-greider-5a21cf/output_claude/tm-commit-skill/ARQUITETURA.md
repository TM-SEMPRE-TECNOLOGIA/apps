# 🏗️ Arquitetura do Skill `/tm-commit`

---

## 🎯 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    SESSÃO DE CHAT                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │   INÍCIO DA SESSÃO             │
        │ 🔄 /tm-commit auto-loaded      │
        └────────────┬───────────────────┘
                     │
                     ↓
        ┌────────────────────────────────┐
        │ Ler Regras                     │
        │ .agent/rules/TM-COMMIT-RULES   │
        │ ✓ Pastas monitoradas          │
        │ ✓ Padrão de commits           │
        │ ✓ Regras de segurança         │
        └────────────┬───────────────────┘
                     │
                     ↓
        ┌────────────────────────────────┐
        │ Monitorar Pastas               │
        │ ✓ 01_Golden_Apps_meu_uso      │
        │ ✓ 03_Arquivo_Morto_Legado     │
        │ ✓ output_claude/              │
        │ ✓ Obisidian/                  │
        │ ✓ ... outras pastas           │
        └────────────┬───────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ↓                     ↓
   ┌────────────┐      ┌────────────┐
   │ Mudanças   │      │ Sem        │
   │ Detectadas?│      │ Mudanças   │
   └────┬───────┘      └────────────┘
        │                    │
        │ SIM                │ NÃO
        │                    ↓
        ↓            ┌──────────────────┐
   ┌─────────────────┤ Aguardar mudança │
   │                 └──────────────────┘
   │
   ↓
┌────────────────────────┐
│ VALIDAR SEGURANÇA      │
│ ❌ Verifica:           │
│   - Credenciais        │
│   - Secrets            │
│   - API Keys           │
│   - .env               │
│ ✓ Permite:            │
│   - Código             │
│   - Docs               │
│   - Configs públicos   │
└────────┬───────────────┘
         │
    ┌────┴─────┐
    │           │
    ↓ SEGURO    ↓ INSEGURO
  ┌────┐   ┌──────────┐
  │    │   │ ⚠️ ALERTA │
  │OK  │   │ Bloqueado │
  └─┬──┘   └──────────┘
    │
    ↓
┌────────────────────────┐
│ GIT STATUS             │
│ git status --porcelain │
└────────┬───────────────┘
         │
         ↓
┌────────────────────────┐
│ STAGING                │
│ git add <pastas>       │
│ (por pasta para evitar │
│  timeout com arquivos  │
│  grandes)              │
└────────┬───────────────┘
         │
         ↓
┌────────────────────────┐
│ CRIAR COMMIT           │
│ git commit -m          │
│ "tipo(escopo): msg"    │
│                        │
│ ✓ Conventional Commits │
└────────┬───────────────┘
         │
         ↓
┌────────────────────────┐
│ FAZER PUSH             │
│ git push origin main   │
│                        │
│ Se falhar:            │
│ → git pull            │
│ → Resolver conflicts  │
│ → git push novamente  │
└────────┬───────────────┘
         │
         ↓
    ┌────────────────────┐
    │ ✅ SINCRONIZADO    │
    │ GitHub atualizado  │
    └────────────────────┘
         │
         ↓
    ┌────────────────────┐
    │ 📊 RELATÓRIO       │
    │ - Commit hash      │
    │ - Arquivo alterado │
    │ - Tamanho          │
    │ - URL GitHub       │
    └────────────────────┘
         │
         ↓
    ┌────────────────────────┐
    │ PRÓXIMO CHECKPOINT     │
    │ (a cada 10 chats)      │
    │ ou fim da sessão       │
    └────────────────────────┘
```

---

## 🏛️ Arquitetura de Componentes

```
┌──────────────────────────────────────────────────────────────┐
│                    TM-COMMIT SKILL                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           🎮 USER INTERFACE LAYER                       │ │
│  │  /tm-commit status  /tm-commit push  /tm-commit sync   │ │
│  │  /tm-commit log     /tm-commit clean /tm-commit help   │ │
│  └────────┬─────────────────────────────────────┬─────────┘ │
│           │                                     │            │
│  ┌────────▼─────────────────────────────────────▼─────────┐ │
│  │      💼 ORCHESTRATION LAYER                             │ │
│  │  - Interpretar comandos                                │ │
│  │  - Direcionar para handlers corretos                   │ │
│  │  - Gerenciar fluxo de execução                         │ │
│  │  - Relatórios e status                                 │ │
│  └────────┬─────────────────────────────────────────────┬─┘ │
│           │                                             │    │
│  ┌────────▼──────────┬──────────────┬──────────┬────────▼──┐ │
│  │ 🔍 MONITOR        │ ✓ VALIDATOR  │ 🔒 GUARD │ 📝 LOGGER │ │
│  │                   │              │          │           │ │
│  │ Detecta mudanças  │ Valida       │ Security │ Logs de   │ │
│  │ em pastas         │ padrão       │ checks   │ execução  │ │
│  │ Monitoradas       │ commits      │          │           │ │
│  │                   │ Verifica     │ Credenc. │ Audit     │ │
│  │                   │ sintaxe      │ Bloqueia │ trail     │ │
│  │                   │              │ force    │           │ │
│  └────┬──────────────┴──────────────┴──────────┴────┬──────┘ │
│       │                                             │        │
│  ┌────▼─────────────────────────────────────────────▼─────┐  │
│  │         ⚙️ GIT OPERATIONS LAYER                         │  │
│  │                                                         │  │
│  │  git add       →  Staging files                        │  │
│  │  git status    →  Check repo state                     │  │
│  │  git commit    →  Create commits                       │  │
│  │  git push      →  Sync with GitHub                     │  │
│  │  git pull      →  Get remote changes                   │  │
│  │  git branch    →  Manage branches                      │  │
│  │  git log       →  View history                         │  │
│  │                                                         │  │
│  └────┬──────────────────────────────────────────────┬────┘  │
│       │                                              │       │
│  ┌────▼──────────────────────────────────────────────▼────┐  │
│  │         📁 REPOSITORY LAYER                            │  │
│  │                                                         │  │
│  │  TM-MEUS-APPS (Repositório Git Local)                 │  │
│  │  ├── .git/              (Git config)                  │  │
│  │  ├── .gitignore         (Exclusões)                   │  │
│  │  ├── .agent/rules/      (Regras do skill)             │  │
│  │  ├── 01_Golden_Apps/    (Monitored ✅)               │  │
│  │  ├── output_claude/     (Monitored ✅)               │  │
│  │  └── ... (outras pastas)                              │  │
│  │                                                         │  │
│  └────┬──────────────────────────────────────────────┬────┘  │
│       │                                              │       │
│  ┌────▼──────────────────────────────────────────────▼────┐  │
│  │         🌐 GITHUB API LAYER                            │  │
│  │                                                         │  │
│  │  GitHub Repository                                     │  │
│  │  https://github.com/TM-SEMPRE-TECNOLOGIA/TM-MEUS-APPS │  │
│  │  ├── main branch        (Destino principal)            │  │
│  │  ├── test branch        (Teste)                       │  │
│  │  ├── Histórico commits  (Versionamento)                │  │
│  │  └── Actions/Workflows  (CI/CD opcional)               │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Fluxo de Dados

```
ENTRADA
  │
  ├─→ Comando do usuário (/tm-commit ...)
  ├─→ Detecção automática de mudanças
  └─→ Regras de configuração (.agent/rules/...)
        │
        ↓
   ┌─────────────────┐
   │  PROCESSAMENTO  │
   ├─────────────────┤
   │ - Parse comando │
   │ - Validar rules │
   │ - Check security│
   │ - Stage files   │
   │ - Format commit │
   │ - Execute git   │
   └─────────────────┘
        │
        ↓
    SAÍDA
      │
      ├─→ Status/relatório (stdout)
      ├─→ Logs de execução (.claude/logs)
      ├─→ Mudanças no GitHub (push)
      └─→ Feedback do usuário
```

---

## 🔄 Estados do Skill

```
┌─────────────────┐
│   INITIALIZED   │  ← Skill carregado
│  (0.1 segundos) │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ MONITORING      │  ← Aguardando mudanças
│ (contínuo)      │  ← Lendo regras
└────────┬────────┘
         │
    ┌────┴────┐
    │          │
    ↓ mudança ↓ comando
┌───────────┐ ┌──────────┐
│ DETECTING │ │ EXECUTING│
└────┬──────┘ └────┬─────┘
     │             │
     └──────┬──────┘
            │
            ↓
       ┌─────────────┐
       │ VALIDATING  │
       │ SECURING    │
       │ STAGING     │
       │ COMMITTING  │
       │ PUSHING     │
       └──────┬──────┘
              │
              ↓
         ┌─────────────┐
         │ REPORTING   │
         └──────┬──────┘
                │
                ↓
         ┌─────────────┐
         │ MONITORING  │  ← Volta ao estado inicial
         └─────────────┘
```

---

## 🔐 Camada de Segurança

```
┌──────────────────────────────────────────────────────┐
│           SECURITY VALIDATION LAYER                   │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ENTRADA                                             │
│  ├─→ git status (arquivos a commitar)               │
│  ├─→ .gitignore (padrões de exclusão)               │
│  └─→ Mensagem de commit (do usuário)                │
│       │                                             │
│       ↓                                             │
│  ┌──────────────────────────────────────┐           │
│  │ CHECK 1: CREDENCIAIS                 │           │
│  │ ❌ Bloqueia: .env, secrets.json,    │           │
│  │            *.key, config.prod.json   │           │
│  │ ✅ Permite: .js, .md, .html, etc    │           │
│  └────────┬─────────────────────────────┘           │
│           │                                         │
│           ↓                                         │
│  ┌──────────────────────────────────────┐           │
│  │ CHECK 2: TAMANHO DE ARQUIVO          │           │
│  │ ❌ Bloqueia: > 100 MB               │           │
│  │ ⚠️  Alerta: > 50 MB (Git warning)   │           │
│  │ ✅ Permite: < 50 MB                 │           │
│  └────────┬─────────────────────────────┘           │
│           │                                         │
│           ↓                                         │
│  ┌──────────────────────────────────────┐           │
│  │ CHECK 3: PADRÃO DE COMMIT            │           │
│  │ ✓ Valida Conventional Commits       │           │
│  │ ✓ Verifica tipo (feat, fix, etc)   │           │
│  │ ✓ Verifica escopo (se requerido)   │           │
│  │ ✓ Verifica mensagem descritiva      │           │
│  └────────┬─────────────────────────────┘           │
│           │                                         │
│           ↓                                         │
│  ┌──────────────────────────────────────┐           │
│  │ CHECK 4: GITIGNORE COMPLIANCE        │           │
│  │ ✓ Respeita .gitignore               │           │
│  │ ✓ Não commita .venv, .env, etc      │           │
│  │ ✓ Não commita node_modules          │           │
│  └────────┬─────────────────────────────┘           │
│           │                                         │
│           ↓                                         │
│       ┌───────────┐                                 │
│  ┌────│ RESULTADO │────┐                           │
│  │    └───────────┘    │                           │
│  ↓                     ↓                           │
│ ✅ SEGURO            ❌ BLOQUEADO                 │
│ (Continua)           (Alerta + rollback)          │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## 📈 Métricas e Observabilidade

```
┌────────────────────────────────────────┐
│     SKILL METRICS & TELEMETRY          │
├────────────────────────────────────────┤
│                                        │
│ 📊 Sessão Atual                        │
│  ├─ Commits criados: 3                 │
│  ├─ Arquivos alterados: 15             │
│  ├─ Linhas adicionadas: 250            │
│  ├─ Linhas removidas: 30               │
│  ├─ Tempo decorrido: 45 min            │
│  └─ Status: ✅ Ativo                   │
│                                        │
│ 📈 Histórico (últimos 30 dias)        │
│  ├─ Total commits: 47                  │
│  ├─ Média/dia: 1.5 commits             │
│  ├─ Maior sessão: 8 commits            │
│  ├─ Erros de segurança bloqueados: 2   │
│  └─ Taxa de sucesso: 98.5%             │
│                                        │
│ 🔍 Diagnóstico                         │
│  ├─ Última execução: 5 min atrás       │
│  ├─ Próximo checkpoint: 10 chats       │
│  ├─ Conexão GitHub: ✅ Online          │
│  ├─ Branch sincronizada: ✅ Sim        │
│  └─ Espaço em disco: 690 MB            │
│                                        │
└────────────────────────────────────────┘
```

---

## 🎯 Integração com Ecossistema

```
                    TM-MEUS-APPS ECOSYSTEM

    ┌────────────────────────────────────────┐
    │      Claude (Main Session)             │
    │  - Cria arquivos em output_claude/    │
    │  - Invoca outros agentes              │
    │  - Solicita pushes                    │
    └────────┬─────────────────────────────┘
             │
             ↓
    ┌────────────────────────────────────────┐
    │   /tm-commit (GIT AUTOMATION)          │
    │  ✓ Detecta mudanças                    │
    │  ✓ Cria commits                        │
    │  ✓ Faz push para GitHub                │
    └────────┬─────────────────────────────┘
             │
        ┌────┴────┬──────────┬──────────┐
        │          │          │          │
        ↓          ↓          ↓          ↓
    ┌────────┐ ┌─────────┐ ┌──────┐ ┌──────┐
    │ /tm-   │ │/tm-     │ │/tm-  │ │Outros│
    │relat. │ │designer │ │skills│ │agentes
    │       │ │         │ │      │ │      │
    │Gera   │ │Cria     │ │Cria  │ │      │
    │rellats│ │páginas  │ │skills│ │...   │
    └────────┘ └─────────┘ └──────┘ └──────┘
        │          │          │          │
        └────┬─────┴──────────┴──────┬──┘
             │                      │
             ↓                      ↓
       ┌──────────────────────────────────┐
       │   Git Repository (Local)         │
       │   C:\Users\...\TM-MEUS-APPS      │
       └──────────┬───────────────────────┘
                  │
                  ↓
       ┌──────────────────────────────────┐
       │   GitHub (Remote)                │
       │   TM-SEMPRE-TECNOLOGIA/          │
       │   TM-MEUS-APPS                   │
       └──────────────────────────────────┘
```

---

**Arquitetura versão 1.0 - 2026-05-12**
