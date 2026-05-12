# Blog — Estratégia e Estrutura

**TM Sempre Tecnologia · Maio 2026**

---

## Papel do Blog

O blog é o **hub central de conteúdo** da TM. Tudo parte daqui:

```
Artigo de blog
    ├── Resumo → LinkedIn (post longo)
    ├── Insight isolado → Instagram (carrossel)
    ├── Dado/resultado → Twitter/X (thread)
    └── Aprofundamento → YouTube (vídeo)
```

Um artigo bem escrito alimenta 4–6 posts em outros canais. Isso é eficiência de conteúdo.

---

## Categorias do Blog

### 1. Automação de Processos
Artigos sobre como automatizar tarefas manuais no ambiente corporativo. Foco em exemplos práticos do segmento de engenharia/manutenção.

*Exemplos:*
- "Como automatizamos a geração de relatórios de vistoria em 15 minutos"
- "Python para automação de documentos Word: guia prático"
- "Quando vale a pena automatizar um processo?"

### 2. Desenvolvimento Web & Mobile
Tutoriais e opiniões técnicas sobre desenvolvimento. Não é blog de curso — é a perspectiva de quem está em produção.

*Exemplos:*
- "Por que escolhemos Next.js para o AutoRelatório"
- "React Native vs Flutter: o que usamos e por quê"
- "Estrutura de projeto que funciona para times pequenos"

### 3. Gestão de Projetos de Software
Como a TM conduz projetos, o que o cliente pode esperar, como tomamos decisões. Gera confiança no processo.

*Exemplos:*
- "Como recebo um projeto e o que entrego na primeira semana"
- "Por que escopo fechado é melhor para a maioria dos clientes"
- "Como apresentar progresso sem reuniões infinitas"

### 4. AutoRelatório (produto)
Artigos focados no produto — tutoriais, updates, casos de uso, comparativos.

*Exemplos:*
- "AutoRelatório V2: o que mudou na nova versão"
- "Como configurar o AutoRelatório para contratos BB"
- "Case: empresa X reduziu 3h de trabalho diário"

### 5. Ferramentas e Setup
Setup técnico, ferramentas que usamos, comparativos honestos.

*Exemplos:*
- "Meu setup de desenvolvimento em 2026"
- "As ferramentas que uso para entregar projetos sozinho"
- "VS Code vs Cursor: minha experiência real"

---

## Estrutura de Cada Artigo

```
1. Headline (H1)          — promessa clara do artigo
2. Lead (2–3 linhas)      — problema que resolve
3. Contexto               — por que isso importa
4. Conteúdo principal     — H2s com exemplos reais
5. Dados/código/screenshot — prova do que está sendo dito
6. Conclusão prática      — o que o leitor faz agora
7. CTA                    — próximo passo (produto, contato, artigo relacionado)
```

---

## SEO Básico

### Para cada artigo:
- **Título:** inclui palavra-chave principal + promessa ("Como [fazer X] com [ferramenta/contexto]")
- **Meta description:** 150–160 caracteres, inclui benefício
- **H2s:** variações da palavra-chave principal
- **Imagem OG:** 1200×630px com título visível
- **URL:** slug curto em português (`/automacao-relatorio-vistoria`)
- **Link interno:** pelo menos 2 links para outros artigos do blog
- **Link externo:** pelo menos 1 link para fonte confiável

### Palavras-chave alvo (fase 1)
- automação de relatórios fotográficos
- geração automática de relatório Word
- desenvolvimento de software Goiânia
- automação de processos manuais
- AutoRelatório vistoria

---

## Template de Post

Ver `template-post.md` nesta mesma pasta.

---

## Cadência

| Fase | Frequência | Volume mensal |
|---|---|---|
| Fase 1 (meses 1–2) | 2x/semana | 8 artigos |
| Fase 2 (meses 3–4) | 3x/semana | 12 artigos |
| Fase 3 (meses 5+) | 4x/semana | 16 artigos |

**Regra de qualidade:** Melhor 1 artigo excelente por semana do que 4 artigos mediocres. Cada post deve ter pelo menos 800 palavras com exemplo real.

---

## Gestão do Blog

### Fluxo de publicação
1. Ideia registrada em `06-calendario-editorial/`
2. Rascunho escrito (pode ser aqui mesmo, em markdown)
3. Revisão: checklist de SEO + voz da marca
4. Publicação no site
5. Distribuição nos canais (LinkedIn, Instagram, etc.)

### Ferramentas recomendadas
- Escrita: VSCode / Obsidian (markdown)
- CMS: depende da stack do site (recomendado: Contentlayer + Next.js)
- SEO: Google Search Console + Ahrefs (versão free no início)
- Analytics: Umami (privacy-first) ou GA4
