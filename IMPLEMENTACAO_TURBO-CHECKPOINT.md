# Implementação: Skill Turbo-Checkpoint

**Data:** 29/04/2026  
**Objetivo:** Automatizar captura e persistência de contexto do repositório TM-MEUS-APPS  
**Status:** Pronto para instalação

---

## 📦 O Que Você Recebe

```
turbo-checkpoint/
├── SKILL.md (instruções completas da skill)
├── scripts/
│   └── extract_checkpoint.py (Python: analisa repo e conversa)
└── references/
    └── como_usar.md (guia rápido)
```

---

## 🚀 Instalação Rápida

### Passo 1: Copiar Pasta para o Lugar Certo
```bash
# Seu repositório TM-MEUS-APPS já tem:
# C:\Users\thiag\Desktop\TM-MEUS-APPS\.claude\skills\

# Você precisa copiar a pasta turbo-checkpoint para lá:
cp -r turbo-checkpoint \
  "C:\Users\thiag\Desktop\TM-MEUS-APPS\.claude\skills\"
```

### Passo 2: Permissões no Script Python
```bash
chmod +x "C:\Users\thiag\Desktop\TM-MEUS-APPS\.claude\skills\turbo-checkpoint\scripts\extract_checkpoint.py"
```

### Passo 3: Testar
Abra um chat sobre seu repositório e diga:
```
"salve isso"
```

A skill deve ativar automaticamente.

---

## 💡 Como Funciona

### Fluxo Básico

```
Você trabalha no repo
        ↓
Você diz "salve isso" (ou similar)
        ↓
Skill dispara automaticamente
        ↓
Script Python varre repo + analisa conversa
        ↓
3 arquivos atualizam:
  1. diario_de_dev.md (nova sessão)
  2. CLAUDE.md (contexto fresco)
  3. checkpoint_atual.json (estruturado)
        ↓
Próximo chat carrega contexto automaticamente
```

### Arquivos que Serão Atualizados

#### 1. `.claude/logs/diario_de_dev.md`
- Novo bloco é **adicionado** ao final
- Formato: `## 🗓️ Sessão: [DATA]`
- Nunca deleta histórico antigo
- Você **reconhecerá o formato** — é o que você já escreve

#### 2. `.claude/CLAUDE.md` (novo arquivo)
```yaml
# Contexto Persistente — TM-MEUS-APPS

**Última atualização:** 2026-04-29T14:30:00Z
**Próxima sessão deve:**
- [ ] Ação prioritária
- [ ] Ação 2

**Módulos em foco:** [lista]
**Estado geral:** Verde/Amarelo/Vermelho
```

#### 3. `.claude/checkpoint_atual.json` (novo arquivo)
Estrutura JSON com:
- Timestamp
- Objetivos completados
- Decisões tomadas
- Próximas ações
- Arquivos modificados

---

## 🎯 Casos de Uso

### Caso 1: Você Trabalha e Salva
```
Session de trabalho:
- Edita relatório preventivo
- Cria memorial
- Identifica divergências

Você: "Salve isso"

Resultado:
✅ diario_de_dev.md atualizado
✅ CLAUDE.md criado/atualizado
✅ checkpoint_atual.json salvo
```

### Caso 2: Próximo Chat Começa Informado
```
Você abre novo chat sobre TM-MEUS-APPS

Claude:
- Lê CLAUDE.md
- Lê últimas 3 sessões de diario_de_dev.md
- Injeta contexto silenciosamente

Você não faz nada especial — contexto já está lá!
```

### Caso 3: Continuação Natural
```
Claude: "Vejo que última sessão você estava 
         trabalhando com [X]. Deixou pendente [Y].
         Quer continuar daqui?"

Você: "Sim, quero resolver [Y]"

[Trabalho continua naturalmente, com contexto completo]
```

---

## 🔧 Configuração (Opcional)

### Integração com `.vscode/settings.json`
Se você usa VS Code, você pode adicionar um atalho:

```json
{
  "terminal.integrated.sendKeybindingToShell": true,
  "keybindings": [
    {
      "key": "ctrl+shift+s",
      "command": "workbench.action.terminal.sendSequence",
      "args": {
        "text": "python .claude/skills/turbo-checkpoint/scripts/extract_checkpoint.py .\n"
      }
    }
  ]
}
```

Assim, você pode apertar `Ctrl+Shift+S` para rodar manualmente (opcional).

### Customização de Triggers
Se você quer adicionar mais trigger words, edite o `description` em SKILL.md:

```yaml
description: |
  ...contexto de disparo...
  - "salve isso"
  - "checkpoint"
  - "consolidate"
  - "AQUI VOCÊ ADICIONA MAIS PALAVRAS"
```

---

## 📊 O Que Muda na Prática

### Antes (sem turbo-checkpoint)
```
❌ Você trabalha
❌ Esquece de rodar /turbo-checkpoint
❌ Próximo chat começa do zero
❌ Contexto perdido
```

### Depois (com turbo-checkpoint)
```
✅ Você trabalha naturalmente
✅ Diz "salve isso" — automático
✅ 3 arquivos sincronizados
✅ Próximo chat sabe exatamente onde você parou
```

---

## 🐛 Troubleshooting

### A Skill Não Ativa
**Verificar:**
1. Skill instalada em `.claude/skills/turbo-checkpoint/`?
2. Arquivo `SKILL.md` está lá?
3. Você mencionou uma palavra-chave? ("salve", "checkpoint", "consolidate")

**Solução:**
Diga explicitamente: "turbo-checkpoint: salve o estado atual"

### Os Arquivos Não Atualizam
**Verificar:**
1. Permissões de escrita em `.claude/logs/`?
2. Git não está com lock (ver `git status`)?
3. Antivírus não está bloqueando?

**Solução:**
Tente rodar manualmente:
```bash
python .claude/skills/turbo-checkpoint/scripts/extract_checkpoint.py .
```

### Formato do diario_de_dev.md Está Estranho
**Esperado:**
- Mantém formato atual (você reconhece)
- Apenas adiciona novos blocos
- Nunca deleta histórico

**Se estiver diferente:**
- A skill respeitou o formato? Verifique `description` em SKILL.md
- Compare com última sessão escrita por você manualmente

---

## 🎓 Aprendizados para Próximas Skills

Se você quiser criar outras skills similares (ex: relatório-automático, auditoria-contínua), padrão turbo-checkpoint:

1. **SKILL.md** — Explicações claras de quando usar
2. **scripts/** — Código Python que faz o trabalho pesado
3. **Múltiplos arquivos de output** — Humano-legível + machine-readable
4. **Triggers simples** — "salve isso", não requer formatação especial
5. **Auto-carregamento** — Próximo chat lê contextualmente

---

## 📝 Próximos Passos

1. **Instalar** — Copie pasta `turbo-checkpoint/` para `.claude/skills/`
2. **Testar** — Faça algum trabalho, diga "salve isso"
3. **Validar** — Verifique que `diario_de_dev.md` foi atualizado
4. **Usar naturalmente** — A partir de então, "salve isso" = checkpoint automático

---

## 🤝 Sugestões de Melhoria Futura

Depois que estiver usando por um tempo, você pode querer:

- [ ] Integração com Git — detectar automaticamente commits
- [ ] Notificações — aviso quando contexto está desatualizado
- [ ] Backups automáticos — manter versões antigas de checkpoints
- [ ] Relatório visual — dashboard mostrando progresso geral
- [ ] Integração com calendário — alertar para sessões perdidas

---

## ✅ Checklist de Instalação

- [ ] Pasta `turbo-checkpoint` copiada para `.claude/skills/`
- [ ] Arquivo `SKILL.md` existe em `.claude/skills/turbo-checkpoint/`
- [ ] Script Python tem permissão de execução
- [ ] Testou dizendo "salve isso"
- [ ] `diario_de_dev.md` foi atualizado
- [ ] `CLAUDE.md` foi criado

Pronto! Você agora tem contexto persistente automático.

---

**Dúvidas ou problemas?**  
Teste manualmente rodando o script e vendo se há erros:
```bash
cd /sua/repo/path
python .claude/skills/turbo-checkpoint/scripts/extract_checkpoint.py .
```

Qualquer erro aparecerá no output JSON.
