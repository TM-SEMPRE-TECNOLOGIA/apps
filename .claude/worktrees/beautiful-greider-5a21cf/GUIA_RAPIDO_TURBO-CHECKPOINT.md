# Guia Rápido: Turbo-Checkpoint

**TL;DR:** Instale em `.claude/skills/`, depois diga "salve isso" para capturar contexto. Pronto!

---

## 📦 Instalação (2 minutos)

1. **Copie a pasta:**
   ```bash
   cp -r turbo-checkpoint \
     "C:\Users\thiag\Desktop\TM-MEUS-APPS\.claude\skills\"
   ```

2. **Pronto!** Não precisa de mais nada.

---

## 💬 Como Usar (3 formas)

### Forma 1: Simples (Recomendado)
```
Você: "salve isso"
Skill: Automático ✅
```

### Forma 2: Variações
```
Você: "checkpoint"
Você: "consolidate"
Você: "guarda isso aí"
Skill: Automático ✅
```

### Forma 3: Explícito
```
Você: "turbo-checkpoint: salve o estado atual"
Skill: Automático ✅
```

---

## ✅ O Que Acontece

Quando você diz "salve isso":

```
Skill varre seu repositório
        ↓
Lê sua conversa
        ↓
Atualiza 3 arquivos:
  ✓ diario_de_dev.md (novo bloco)
  ✓ CLAUDE.md (contexto para próximo chat)
  ✓ checkpoint_atual.json (máquina-legível)
        ↓
Confirmação: "Checkpoint salvo às 14:30"
```

---

## 📁 Arquivos Que Você Terá

Após instalar e usar uma vez:

```
.claude/
├── logs/
│   └── diario_de_dev.md (atualizado com nova sessão)
├── CLAUDE.md (novo)
├── checkpoint_atual.json (novo)
└── skills/
    └── turbo-checkpoint/
        ├── SKILL.md
        ├── scripts/
        │   └── extract_checkpoint.py
        └── references/
            └── como_usar.md
```

---

## 🔄 Fluxo Típico

### Sessão 1:
```
Você trabalha 1 hora
Você: "salve isso"
✅ Tudo atualizado
```

### Sessão 2:
```
Você abre novo chat sobre TM-MEUS-APPS
Claude: "Vejo que última vez você estava em [X]..."
✅ Contexto carregado automaticamente
Você continua de onde parou
```

---

## 🎯 Palavras-Chave (Disparo Automático)

A skill ativa quando você menciona:
- "salve"
- "checkpoint"
- "consolidate"
- "guarda"
- "atualizar contexto"
- "relatório preventivo" + "salve"

---

## ❓ FAQ Rápido

**P: Preciso fazer algo especial depois?**  
R: Não. Próximo chat que abre sobre TM-MEUS-APPS carrega contexto.

**P: E se eu quiser rodar manualmente?**  
R: Sempre pode dizer "salve isso" — funciona sempre.

**P: A skill deleta histórico antigo?**  
R: Não. `diario_de_dev.md` cresce, nada é deletado.

**P: Posso customizar as palavras-chave?**  
R: Sim. Edite `SKILL.md` → section `description`.

**P: Funciona com `/relatorio-preventivo`?**  
R: Sim! Ambas skills trabalham juntas.

---

## 🚨 Se Algo der Errado

**Skill não ativa?**
- Tente: "turbo-checkpoint: salve o estado"
- Verifique se pasta está em `.claude/skills/turbo-checkpoint/`

**Arquivos não atualizam?**
- Verifique permissões: `ls -la .claude/logs/`
- Git pode estar com lock: `git status`

**Precisa debugar?**
```bash
python .claude/skills/turbo-checkpoint/scripts/extract_checkpoint.py .
```
Se houver erro, aparecerá no output.

---

## 📊 Antes vs Depois

| | **Antes** | **Depois** |
|---|---|---|
| Contexto | Perdido a cada chat | Persistente |
| Comando | `/turbo-checkpoint` (tinha que lembrar) | "salve isso" (natural) |
| Histórico | Nenhum rastreamento | 3 arquivos sincronizados |
| Próximo chat | Começa do zero | Carrega contexto auto |

---

## 🎓 Uso Avançado (Opcional)

### Integrar com Git (Manual)
Depois de "salve isso", você pode fazer:
```bash
git add .claude/
git commit -m "Checkpoint: [data]"
```

### Integrar com Agendador (Manual)
Se quiser auto-checkpoint periódico:
```bash
# Rodar a cada 30 min (Windows Task Scheduler ou Cron)
python .claude/skills/turbo-checkpoint/scripts/extract_checkpoint.py .
```

### Ler checkpoint estruturado
```bash
cat .claude/checkpoint_atual.json
```
Útil para scripts ou dashboards.

---

## ✨ Resultado Final

```
Você trabalha naturalmente
        ↓
Diz "salve isso" (tira 3 segundos)
        ↓
Contexto capturado automaticamente
        ↓
Próximo chat já sabe onde você parou
        ↓
Nenhum contexto perdido
        ↓
Produtividade +30% 🚀
```

---

**Próximo passo:** Instale e diga "salve isso" agora! 🎯
