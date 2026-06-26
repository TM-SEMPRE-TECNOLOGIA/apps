# O PLANO DE MARKETING TM — Ecossistema Conectado

**TM Sempre Tecnologia · Thiago Nascimento Barbosa · Junho 2026**

---

## 🎯 Visão Estratégica

Transformar TM Sempre Tecnologia de **empresa de serviços invisível** para **marca de software visível** no mercado de engenharia predial e automação. O foco é no **ecossistema de 4 produtos**, não em um único produto.

---

## 📦 Ecossistema de Produtos (Status Junho 2026)

| Produto | Status | Posicionamento | Lead Magnet |
|---------|--------|-----------------|-------------|
| **Gerenciador + AutoRelatório V5** | 🟢 ATIVO | Solução completa para OS/relatórios | Demo ao vivo |
| **Auto Legenda** | 🟢 ATIVO | Automação de descrição de fotos | Teste com 10 fotos |
| **Zap Inspeção** | 🟢 ATIVO | WhatsApp + checklist em campo | Bot demo |
| **Automobile (Dashboard Diretor)** | 🟡 EM DESENVOLVIMENTO | Visão gerencial centralizada | Roadmap público |

---

## 🌐 Landing Page do Ecossistema

### Localização
`C:\Users\thiag\Desktop\APPS\TM Marketing\landing-page\index.html`

### Estrutura de Seções

1. **Header** — Navegação fixa (dark, laranjado TM)
2. **Hero** — "Automação de Ponta a Ponta para Engenharia Predial" + [FOTO: equipe em campo]
3. **Risco/Problema** — O custo manual de relatórios, checklists e gestão
4. **Ecossistema (Cards)** — Grid dos 4 apps com status e ícones
5. **Destaque 1: Gerenciador+AutoRelatório** — Seção completa + [SCREENSHOT: interface]
6. **Destaque 2: Auto Legenda** — Funcionalidade específica
7. **Destaque 3: Zap Inspeção** — WhatsApp integration
8. **Automobile** — "Em desenvolvimento" com inscrição em waitlist
9. **Sobre Thiago** — Fundador + credibilidade + [FOTO: Thiago]
10. **Resultados** — Métricas reais (tempo economizado, contratos BB/CEF)
11. **Planos/CTA** — 3 CTAs diferentes:
    - **Captação:** "Teste gratuitamente por 7 dias"
    - **Institucional:** "Conheça nossa abordagem"
    - **Conversão:** "Solicitar demonstração ao vivo"
12. **FAQ** — Perguntas reais de prospects
13. **Footer** — Links, redes sociais, copyright

### Design System
- **Fundo:** #0A0A0A (black, não puro)
- **Laranjado TM:** #FF6B00 (primário) / #E55D00 (hover)
- **Borders:** dashed `border-white/15` (referência aicoders)
- **Tipografia:** Inter/System (sem custom fonts)
- **Animações:** CSS transitions suaves, sem excesso
- **Responsivo:** Mobile-first (não carrega vazio)

### Mockups de Imagem (Manus Prompts)

Cada mockup tem um **bloco visual** marcado com:
```html
<!-- [IMAGEM MANUS] descrição -->
<div class="img-mockup">
  📷 Inserir: [descrição do prompt]
  <code>PROMPT_MANUS_AQUI</code>
</div>
```

#### 1. Hero — Equipe em Campo (Agência BB)
**Descrição:** Equipe TM numa agência do Banco do Brasil, notebook aberto mostrando AutoRelatório, fachada ao fundo, tom profissional.

```
PROMPT: "professional photo of a 3-person technical team inside a Banco do Brasil agency branch, one person showing a laptop screen (no brand visible on screen), two others reviewing documents, sunlight through windows, modern office setting, realistic, high quality, 4K. Include the TM Sempre Tecnologia logo subtle in background."
```

#### 2. AutoRelatório — Screenshot/Mockup (Interface)
**Descrição:** Interface do Gerenciador mostrando lista de OS, seção de relatórios com fotos thumbnails, timeline de status.

```
PROMPT: "clean, modern software dashboard interface for construction maintenance management, dark theme with orange accents, showing: left sidebar with navigation menu, central panel with list of 'Ordens de Serviço' (work orders), right panel showing photo gallery of inspections, status timeline on bottom, professional UI design, mockup style, 4K. Include subtle TM branding."
```

#### 3. Thiago (Fundador)
**Descrição:** Foto profissional de Thiago, ambiente de trabalho clean (home office ou escritório), tom confiável, acessível.

```
PROMPT: "professional headshot of a male founder, Brazilian, 30s, in a modern home office or tech office, natural lighting, confident smile, wearing casual tech attire (hoodie or shirt), minimalist background, realistic photography, high quality, 4K. The person is sitting at a desk with a laptop visible."
```

#### 4. Resultados — Antes/Depois
**Descrição:** Split visual: lado esquerdo mostra "manual e caótico" (papéis espalhados), lado direito mostra "automatizado e organizado" (dashboard limpo).

```
PROMPT: "split-screen comparison: LEFT SIDE shows a messy desk with scattered papers, files, and construction photos, chaotic desk, morning light. RIGHT SIDE shows the same desk completely organized with laptop displaying a clean software dashboard (dark theme, orange accents), calm organized workspace. Before and after style, realistic, high quality, 4K."
```

#### 5. Zap Inspeção — WhatsApp Integration
**Descrição:** Tela de WhatsApp mostrando bot TM enviando checklist interativo, resposta do inspetor com fotos.

```
PROMPT: "WhatsApp chat interface showing a bot conversation, left side shows bot sending an inspection checklist with bullet points, right side shows user responding with photos attached and checkbox responses, modern WhatsApp UI, realistic, high quality. Include subtle TM logo above chat."
```

---

## 📊 Meta Ads — Integração Claude MCP

### Status
✅ **ATIVO** — `mcp__claude_ai_Meta_Ads_MCP__*` disponível nesta sessão

### Capacidades (já integradas)
- Criar campanhas de anúncio
- Gerenciar audiências customizadas
- A/B testing de criativos
- Relatórios de desempenho e ROI
- Otimização de bid automaticamente

### Como Usar (Direto no Claude Code)
```
/meta-ads-create-campaign \
  --name "AutoRelatório Q2 2026" \
  --budget 5000 \
  --audience "Engenheiros prediais" \
  --creative "landing-page/index.html"
```

### Próximas Ações
1. **Autenticar:** Conectar conta Meta Business no Claude
2. **Primeira Campanha:** AutoRelatório para público B2B (engenheiros)
3. **Segunda Campanha:** Auto Legenda para geradores de conteúdo
4. **Terceira Campanha:** Automobile waitlist (lead magnet)

---

## 🎬 Estratégia de Tráfego Direto

### Canais (Priorização)

| Canal | Prioridade | Investimento | ROI Esperado |
|-------|-----------|--------------|--------------|
| **Meta Ads** (FB + IG) | 🔴 ALTA | $500-1000/mês | 3:1 a 5:1 |
| **Google Ads** (Search) | 🟡 MÉDIA | $300-500/mês | 2:1 a 3:1 |
| **LinkedIn Ads** | 🟡 MÉDIA | $200-300/mês | 1:1 a 2:1 |
| **Conteúdo Orgânico** (Blog + LinkedIn posts) | 🟢 CONTÍNUO | $0 | 0.5:1 a 1:1 (longo prazo) |
| **WhatsApp** | 🟢 CONTÍNUO | $0 | High intent |

### Google Ads — Palavras-Chave Primárias
```
- "relatório fotográfico automático"
- "automação de checklist"
- "software para engenharia predial"
- "app WhatsApp para inspeção"
- "dashboard para manutenção predial"
```

### LinkedIn Ads — Segmentação
```
Targets:
- Engenheiros Prediais
- Gestores de Contratos (BB/CEF)
- Donos de Empresas de Manutenção
- Diretores de Operações
```

### WhatsApp — Canal de Conversão
**Não é pago, é estratégico.** Cada CTA leva a WhatsApp direto do Thiago.
- Meta Ads → WhatsApp (warm lead)
- Blog → WhatsApp (qualified lead)
- LinkedIn post → WhatsApp (interested lead)

---

## 📝 Ponteiros para Arquivos Existentes

A pasta `C:\Users\thiag\Desktop\APPS\TM Marketing\` já tem estrutura. **IMPORTANTE:** Atualizar referencias de "AutoRelatório V2" para "V5" em:

| Arquivo | O que atualizar |
|---------|-----------------|
| `01-estrategia/estrategia-de-marca.md` | Incluir os 4 produtos, não só AutoRelatório |
| `05-meta-ads/copies/copies-meta-ads.md` | Adicionar copies para Auto Legenda, Zap Inspeção, Automobile |
| `06-calendario-editorial/` | Incluir publicações sobre todos os 4 produtos |
| `02-identidade-visual/identidade-visual.md` | Laranjado TM como cor primária |

---

## 🗂️ Arquivos a Criar/Atualizar

```
APPS/TM Marketing/
├── O PLANO DE MARKETING TM.MD          ← ESTE ARQUIVO (master)
│
├── landing-page/                        ← NOVO
│   ├── index.html                      (em construção)
│   ├── MANUS_PROMPTS.md                (todos os prompts em um lugar)
│   └── README.md
│
├── 01-estrategia/
│   ├── estrategia-de-marca.md          (ATUALIZAR — adicionar 4 produtos)
│   └── ecossistema-positioning.md      (NOVO — posicionamento de cada app)
│
├── 05-meta-ads/
│   ├── copies/
│   │   ├── copies-meta-ads.md          (ATUALIZAR — 4 produtos)
│   │   └── copy-automobile-waitlist.md (NOVO)
│   └── campanhas/
│       ├── campanha-autorelatorio.md   (NOVO)
│       ├── campanha-auto-legenda.md    (NOVO)
│       ├── campanha-zap-inspecao.md    (NOVO)
│       └── campanha-automobile.md      (NOVO)
│
└── 06-calendario-editorial/
    └── calendario-junho-2026.md        (ATUALIZAR — incluir 4 produtos)
```

---

## 📊 Métricas de Sucesso (KPIs)

### Curto Prazo (Junho-Julho)
- ✅ Landing page ativa e responsiva
- ✅ Meta Ads primeira campanha rodando
- ✅ 20+ leads qualificados de Meta Ads
- ✅ Taxa de conversão WhatsApp > 30%

### Médio Prazo (Agosto-Setembro)
- 💰 ROI Meta Ads > 3:1
- 📈 Tráfego orgânico blog > 500 sessões/mês
- 👥 Audiência Meta: 15k+ pessoas impactadas/mês
- 📞 10+ conversões para demonstração ao vivo

### Longo Prazo (Outubro em diante)
- 🎯 AutoRelatório: 5 novos clientes trimestrais
- 📱 Auto Legenda: 50 usuários ativos
- 🤖 Zap Inspeção: integrado em 3+ operações
- 🚗 Automobile: beta com 5 gestores

---

## 🚀 Próximos Passos Imediatos

1. **Hoje/Amanhã:**
   - [ ] Criar `landing-page/index.html` com mockups
   - [ ] Documentar todos os prompts Manus em `MANUS_PROMPTS.md`
   - [ ] Gerar as 5 imagens Manus (via skill tm-criativo)

2. **Esta Semana:**
   - [ ] Revisar landing page com Thiago
   - [ ] Autenticar Meta Ads MCP
   - [ ] Escrever copies para primeira campanha

3. **Próximas 2 Semanas:**
   - [ ] Atualizar `estrategia-de-marca.md`
   - [ ] Criar arquivo de posicionamento de cada app
   - [ ] Rodar primeira campanha Meta Ads (AutoRelatório)

4. **Junho (semanas 3-4):**
   - [ ] Iniciar segunda campanha (Auto Legenda)
   - [ ] Publicar blog posts sobre o ecossistema
   - [ ] Análise de performance

---

## 📞 Contatos de Referência

| Item | Contato |
|------|---------|
| **Thiago (Founder)** | thiagonascimento.barbosapro@gmail.com |
| **WhatsApp** | +55 (62) 99604-6458 |
| **Site Pessoal** | thiagonascimentobarbosapro.com |
| **LinkedIn** | linkedin.com/in/thiago-nascimento-barbosa |

---

**Versão:** 1.0 · Junho 2026  
**Status:** Em Implementação  
**Próxima Review:** 20 de Junho
