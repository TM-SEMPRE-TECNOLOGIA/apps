# **Engenharia Reversa e Guia de Automação: MVP Low Ticket com IA**

## **1\. Visão 360º e Análise Estratégica do Vídeo**

O vídeo "Ganhe R$10.000 por mês com esses LowTickets criados com Claude Code", do Guilherme Franklim, apresenta uma **mudança de paradigma na criação de infoprodutos**. Em vez de usar a IA apenas para escrever textos (como a maioria faz), ele utiliza ferramentas como o **Claude Code** (uma extensão de programação orientada por IA) para **automatizar a execução técnica e operacional**.

**A Estratégia Central:**

* **Velocidade de Teste (MVP):** O objetivo não é criar o produto perfeito, mas colocar uma oferta no ar em minutos para testar se o mercado quer comprar.  
* **Redução de Custo de Fricção:** Em vez de pagar designers, programadores ou plataformas de hospedagem caras, ele usa um ecossistema de ferramentas 100% gratuitas ou de baixíssimo custo para gerar a página, as imagens e a hospedagem.  
* **Modelagem (Não Invenção):** A estratégia parte de validar algo que *já está vendendo* na Biblioteca de Anúncios do Facebook, melhorando a cópia e expandindo para um público global (ex: vendendo em espanhol para a América Latina ou resto do mundo).

## **2\. Conceitos Básicos e Fundamentos**

* **Low Ticket:** Produtos digitais de baixo valor (geralmente entre R$ 9,90 e R$ 47,00). O foco é volume de vendas por impulso.  
* **MVP (Minimum Viable Product):** O Produto Mínimo Viável. É a versão mais básica de uma oferta que você pode lançar para validar se as pessoas tiram o cartão do bolso.  
* **Order Bump / Upsell:** Estratégias para aumentar o lucro de um produto Low Ticket. Oferecer um produto complementar na página de pagamento (Order Bump) ou logo após a compra (Upsell).  
* **Deploy:** O ato de colocar um site no ar (transferir os arquivos do seu computador para um servidor público).  
* **Copywriting (Copy):** Textos persuasivos focados em conversão e vendas.

## **3\. Ecossistema de Ferramentas Utilizadas**

* [**Biblioteca de Anúncios do Facebook**](https://www.facebook.com/ads/library/)**:** Para espionagem e validação de ofertas.  
* [**Claude (Anthropic)**](https://claude.ai/)**:** O "cérebro". Usado no modelo Opus/Sonnet para resumir páginas concorrentes e criar a nova estrutura da oferta.  
* **Claude Code / VS Code:** Extensão integrada ao editor de código (VS Code) que escreve, edita e envia arquivos diretamente para o servidor.  
* [**Grok (xAI)**](https://x.com/i/grok)**:** Usado pela rapidez e por gerar múltiplas variações de imagens (capas de produto, banners e criativos) de forma gratuita/inclusa no X Premium. *(Nota: Alternativas 100% grátis incluem Leonardo.ai ou Bing Image Creator).*  
* [**Kiwify**](https://kiwify.com.br/)**:** Plataforma de checkout e hospedagem do produto (onde o cliente paga).  
* **Super Design (ou bibliotecas de componentes Tailwind):** Para pegar *prompts* prontos de estrutura visual de páginas de vendas.  
* [**GitHub**](https://github.com/) **\+ [Vercel](https://vercel.com/):** Dupla de ferramentas para hospedagem 100% gratuita da Landing Page.

## **4\. O Guia Passo a Passo (O Fluxo Original)**

1. **Mineração:** Acesse a Biblioteca de Anúncios e pesquise termos como "apenas R$ 10", "acesso imediato". Encontre um anúncio rodando há algum tempo. Copie o link da página de vendas dele.  
2. **Engenharia Reversa da Copy:** Copie todo o texto da página do concorrente. Cole no Claude com o prompt: *"Esta é a minha oferta \[cole o texto\]. Analise e me dê um resumo da precificação, promessa e entregáveis para o mercado Global/Latan."*  
3. **Criação Automática do Produto:** Abra a Kiwify. Usando uma extensão de automação do Claude, cole o resumo gerado e peça para a IA preencher automaticamente os campos de Produto (Nome, Descrição, Preço Global \- ex: R$ 9,90).  
4. **Geração da Landing Page (LP):** \* Vá em um site de templates de prompt (ex: Super Design).  
   * Abra o VS Code com a extensão Claude Code.  
   * Cole o resumo da oferta \+ o prompt do template de LP e mande o Claude criar a página em HTML/Tailwind.  
5. **Geração de Imagens:** Peça ao Claude para gerar *prompts de imagem* baseados na sua página. Cole esses prompts no Grok (ou Bing/Leonardo) para gerar imagens na proporção 16:9 (capas) e 9:16 (checkouts e criativos para o Instagram).  
6. **Substituição e Checkout:** Substitua as imagens genéricas no VS Code pelas imagens geradas. Insira o link de pagamento da Kiwify nos botões da página.  
7. **Deploy Gratuito:** \* Crie um repositório privado no GitHub.  
   * Peça ao Claude Code para subir os arquivos para este repositório (git push).  
   * Entre na Vercel, conecte seu GitHub e clique em "Deploy". Seu site está no ar com link gratuito.

## **5\. Simulação: O Motor Totalmente Autônomo com IA (O "Super Agente")**

Se fôssemos transformar esse fluxo (que ainda tem "copia e cola") em um motor 100% autônomo usando a API do Claude, o sistema funcionaria assim:

**O Fluxo do Agente Autônomo:**

1. **Trigger (Gatilho):** Você dá um comando via terminal: /iniciar\_oferta nicho="emagrecimento"  
2. **Agent 1 (O Espião):** Um script Python faz scraping (varredura) na Biblioteca de Anúncios buscando as 3 ofertas de emagrecimento mais curtidas. Ele extrai os textos dessas páginas.  
3. **Agent 2 (O Estrategista \- Claude API):** Recebe os 3 textos, cruza os dados, melhora a promessa e cria uma "Super Oferta" única. Ele cospe um arquivo JSON com toda a Copy, Preço e prompts de imagem necessários.  
4. **Agent 3 (O Designer \- API de Imagem):** Lê o JSON, dispara requisições para uma API de imagem (DALL-E 3, Midjourney ou Flux) e salva as imagens no projeto.  
5. **Agent 4 (O Desenvolvedor \- Claude API):** Escreve o código fonte da Landing Page (HTML/Tailwind), já inserindo os textos e o caminho das imagens baixadas.  
6. **Agent 5 (O Operador):** Conecta via API na plataforma de pagamento (ex: Stripe/Kiwify), cria o produto, pega o link de checkout, injeta no HTML e faz o Deploy automático na Vercel via linha de comando (vercel \--prod).  
7. **Resultado:** 5 minutos depois, você recebe uma notificação no Telegram: *"Sua oferta está no ar no link X. Produtos criados, imagens geradas."*

## **6\. Exemplos Práticos: Múltiplas Promoções (Low Ticket)**

Aqui estão dois exemplos de como aplicar o fluxo do vídeo para outros nichos:

### **Promoção A: Nicho de Produtividade (Planilhas)**

* **Concorrente:** Planilha de finanças pessoais por R$ 19,90.  
* **Sua Ação:** Fazer um "Pacote Vida Organizada" (Finanças \+ Treinos \+ Refeições) rodando para o mundo todo (EUA, Europa, América Latina) em Inglês ou Espanhol.  
* **Preço:** ![][image1] 25).  
* **Imagens:** Prompts no Grok pedindo "Mockup realista de um dashboard financeiro moderno flutuando em um fundo escuro e elegante, 16:9".

### **Promoção B: Nicho de Hobbies (E-book)**

* **Concorrente:** E-book de receitas de bolo no pote.  
* **Sua Ação:** E-book "100 Receitas Airfryer para Universitários". Foco em um público com dor específica (falta de tempo).  
* **Order Bump:** "Guia de Sobremesas na Airfryer" por \+ R$ 9,90.  
* **Imagens:** Prompts pedindo "Foto ultra-realista 4k de comida suculenta saindo de uma airfryer, luz de estúdio cinematográfica".

## **7\. Variação: Canal Dark no YouTube (Foco Custo Zero e Gestão Manual)**

Você pediu uma variação focada em um canal de vídeos automáticos no YouTube (ex: looping de lareira com som de chuva para relaxamento/estudo), usando ferramentas gratuitas, onde seu trabalho é apenas o de **Gestor do Processo**.

### **O Fluxo Estratégico (Canal Relaxamento/ASMR)**

**1\. Criação do Ativo Visual (Custo Zero)**

* Em vez de gastar horas gerando vídeos com IA, **trabalhe de forma inteligente**.  
* Use o **Leonardo.ai** (gratuito diário) para gerar a imagem base: *"A cozy wooden cabin interior, fireplace burning brightly, dark night outside the window, ultra-realistic, 16:9."*  
* Pegue essa imagem e leve para o **Hailuo AI** ou **Kling AI** (plataformas gratuitas/freemium de vídeo) para animar apenas o fogo e a neve na janela por 5 segundos.

**2\. Criação do Ativo Sonoro (Custo Zero)**

* Vá na **YouTube Audio Library** (grátis e sem direitos autorais). Baixe um áudio de "Fireplace crackling" (estalos de fogo) e um de "Rain on window" (chuva).

**3\. Automação da Edição (Claude Code)**

* Em vez de abrir um editor de vídeo pesado, você usa o Claude Code para escrever um script em **Python \+ FFmpeg** (ferramenta de terminal).  
* O script pega seus 5 segundos de vídeo animado e os 2 áudios, cria um loop perfeito de **3 horas**, mescla o áudio, ajusta as cores e exporta o arquivo .mp4 final automaticamente.

### **Divisão de Tarefas: O que é IA x O que é Manual?**

**O que o Motor IA (Claude Code \+ APIs gratuitas) faz:**

* **Gera os Títulos e SEO:** O Claude analisa tendências do YouTube e gera o Título, Descrição (com tags e hashtags) focados em ranqueamento.  
* **Roteiriza o Script de Edição:** O Claude escreve o código Python que monta o vídeo de 3 horas em loop sem você precisar abrir um editor.  
* **Gera a Imagem da Thumbnail:** Através de geradores gratuitos (Leonardo.ai) a partir de um prompt do Claude.

**O que VOCÊ (Fluxo Manual de Gestão) faz:**

1. **Aprova e Baixa as Mídias:** O IA gera as ideias de imagem e os prompts. Você vai no site (ex: Leonardo.ai), gera, escolhe a melhor imagem e baixa para a pasta local.  
2. **Inicia a "Fábrica":** Você dá o "Enter" no terminal (python renderizar\_video.py) para o seu script FFmpeg processar o loop de 3 horas.  
3. **Upload no YouTube:** Você entra no seu canal, arrasta o arquivo .mp4, cola os Títulos/Descrições gerados pelo Claude, aplica a Thumbnail e clica em **Programar Publicação**.  
4. **Análise de Métricas:** Uma vez por semana, você entra no YouTube Studio para ver qual vídeo reteve mais público (Lareira vs. Chuva na Floresta) para alimentar o Claude com esses dados e gerar os temas da próxima semana.

Neste modelo, o seu "trabalho duro" é reduzido a apertar botões e gerenciar arquivos de pastas, enquanto a IA cuida de toda a criatividade, SEO e junção técnica.

[image1]: <data:image/png;base64,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>