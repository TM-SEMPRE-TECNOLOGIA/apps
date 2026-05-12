## Personas e Jornadas do Usuário para o Serviço de Ordens (TM-OS) SaaS

Como um UX Researcher apaixonado por resolver a dor do usuário e desenhar Design Systems impecáveis, mergulhei profundamente no "Plano Mestre 2.0" do Serviço de Ordens (TM-OS) SaaS. Meu objetivo é entender a fundo o usuário, mapear suas jornadas e estabelecer as diretrizes de experiência e design do sistema. A seguir, apresento três personas distintas, suas dores, objetivos e o "Job-to-be-Done" (JTBD) que o TM-OS visa preencher, detalhando suas jornadas de usuário passo a passo.

---

### Persona 1: Lívia, a Gestora de Facilities Eficiente

**"Preciso de controle total e insights acionáveis para garantir excelência operacional e conformidade."**

*   **Nome:** Lívia Santos
*   **Idade:** 38 anos
*   **Cargo:** Gestora de Facilities & Manutenção
*   **Empresa:** Solutions Facilities (empresa de médio porte que presta serviços de manutenção predial avançada para edifícios corporativos)
*   **Tecnologia:** Usa laptop para 80% do tempo, smartphone para comunicação rápida. Aberta a novas tecnologias que comprovem eficiência.
*   **Biografia:** Lívia é responsável por coordenar a equipe de técnicos, gerenciar os contratos de manutenção de diversos clientes e garantir que todas as Ordens de Serviço (OS) sejam cumpridas dentro dos prazos e padrões de qualidade. Ela se orgulha de sua organização, mas sente que os processos atuais (planilhas, e-mails e WhatsApp) a consomem muito tempo em tarefas administrativas e reativas. Busca uma solução que lhe dê visibilidade em tempo real e a ajude a ser mais proativa.
*   **Objetivos:**
    *   Reduzir o tempo gasto na criação e acompanhamento manual de OS.
    *   Ter uma visão clara do status de todas as OS em andamento.
    *   Garantir o cumprimento dos SLAs com os clientes e a conformidade regulatória.
    *   Otimizar a alocação de sua equipe técnica, evitando sobrecarga ou ociosidade.
    *   Gerar relatórios precisos para a diretoria e para auditorias.
*   **Dores & Frustrações:**
    *   Dificuldade em saber o status real das OS, dependendo de contato constante com os técnicos.
    *   Perda de informações e retrabalho devido a comunicações fragmentadas.
    *   Atrasos na emissão de relatórios, que são essenciais para faturamento e compliance.
    *   Alocação de técnicos baseada em intuição, não em dados de carga de trabalho ou proximidade.
    *   Pressão para cumprir SLAs sem ferramentas adequadas para monitoramento.
*   **Job-to-be-Done (JTBD):** Como uma gestora de facilities, preciso de um sistema centralizado e intuitivo que me permita criar, distribuir, acompanhar e analisar Ordens de Serviço de forma eficiente, garantindo que eu tenha total controle e visibilidade sobre a operação, para que eu possa otimizar minha equipe, cumprir os acordos contratuais e apresentar resultados claros, minimizando riscos e custos.
*   **Necessidades Chave:** Dashboards de acompanhamento em tempo real, módulo de emissão de OS com atribuição inteligente, relatórios personalizáveis, gestão de SLAs, histórico de serviços por ativo.

---

#### Jornada do Usuário: Lívia, a Gestora de Facilities Eficiente
**Cenário:** Uma OS de manutenção corretiva para o sistema de climatização de um cliente corporativo foi solicitada.

**Fase 1: Identificação e Criação da Ordem de Serviço (OS)**

1.  **Gatilho:** Lívia recebe uma ligação urgente do cliente relatando falha no sistema de climatização em um andar específico.
    *   **Pensamentos/Sentimentos:** Preocupação, "Mais um problema para resolver", "Preciso agir rápido para não estourar o SLA".
    *   **Como o TM-OS Ajuda:**
        *   Lívia acessa o **Módulo de Clientes e Locais (Web)** do TM-OS.
        *   Pesquisa pelo cliente e local específico (andar, sala).
        *   Rapidamente, abre o **Módulo de Emissão de OS**.
        *   Seleciona o tipo de serviço ("Manutenção Corretiva"), descreve o problema, anexa um print da mensagem de erro enviada pelo cliente.
        *   Define a prioridade como "Urgente" e o prazo limite (SLA) para a resolução.
2.  **Atribuição da OS:**
    *   **Pensamentos/Sentimentos:** "Quem está disponível e tem a especialidade certa para HVAC?"
    *   **Como o TM-OS Ajuda:**
        *   O TM-OS, usando o **Módulo de Técnicos**, sugere técnicos disponíveis com especialização em HVAC e próximos ao local do cliente (futuro: alocação inteligente por geolocalização).
        *   Lívia revisa as sugestões e atribui a OS ao Técnico João.
        *   O sistema envia uma notificação push e por e-mail para João com os detalhes da nova OS.

**Fase 2: Acompanhamento Ativo da Execução**

3.  **Monitoramento em Tempo Real:**
    *   **Pensamentos/Sentimentos:** "Será que João já começou? Está tudo dentro do prazo?"
    *   **Como o TM-OS Ajuda:**
        *   Lívia abre o **Dashboard de Acompanhamento de OS (Web)** no TM-OS.
        *   Vê a OS do climatizador com status "Atribuída".
        *   Após alguns minutos, o status muda para "Em Andamento" (João registrou o início do serviço no app mobile).
        *   Ela pode visualizar o histórico de ações e comentários de João em tempo real.
4.  **Interação e Suporte:**
    *   **Pensamentos/Sentimentos:** "Se João precisar de algo, ele vai conseguir me avisar fácil?"
    *   **Como o TM-OS Ajuda:**
        *   João anexa fotos do problema encontrado e adiciona um comentário pedindo uma peça específica através do **aplicativo mobile do técnico**.
        *   Lívia recebe uma notificação instantânea.
        *   Ela usa o **chat integrado** do TM-OS para responder a João, confirmando a disponibilidade da peça e dando orientações.

**Fase 3: Conclusão e Análise de Resultados**

5.  **Finalização e Aprovação:**
    *   **Pensamentos/Sentimentos:** "OS concluída. Preciso de evidências para o cliente e para o faturamento."
    *   **Como o TM-OS Ajuda:**
        *   João finaliza a OS no app, preenchendo o checklist, anexando fotos do reparo concluído e coletando a assinatura digital do cliente (futuro).
        *   Lívia é notificada que a OS está "Concluída".
        *   Ela revisa os detalhes, o checklist e as fotos da OS no sistema e a marca como "Aprovada".
6.  **Geração de Relatórios e Insights:**
    *   **Pensamentos/Sentimentos:** "Preciso do relatório mensal de SLAs. Quero saber o tempo médio de resolução de OS para climatização neste mês."
    *   **Como o TM-OS Ajuda:**
        *   Lívia acessa o **Módulo de Relatórios Básicos (Web)** do TM-OS.
        *   Gera um relatório customizado por tipo de serviço ("Manutenção Corretiva HVAC") e período.
        *   Analisa o "Tempo Médio de Resolução de OS" e a "% de OS Concluídas no Prazo (SLA)".
        *   Identifica que o SLA para climatização foi 98% no mês, evidenciando o bom desempenho da equipe.
        *   Exporta o relatório em PDF para enviar à diretoria e ao cliente.

**Outcome Desejado:** Lívia consegue gerenciar a manutenção de forma mais eficiente, com menos estresse, maior controle e capacidade de tomar decisões baseadas em dados, melhorando a satisfação do cliente e a reputação da Solutions Facilities.

---

### Persona 2: João, o Técnico de Campo Otimizado

**"Quero fazer meu trabalho com agilidade, ter todas as informações na mão e registrar tudo fácil."**

*   **Nome:** João Pereira
*   **Idade:** 31 anos
*   **Cargo:** Técnico de Manutenção (Especialidade: HVAC e Elétrica)
*   **Empresa:** Solutions Facilities (mesma empresa da Lívia)
*   **Tecnologia:** Usa seu smartphone o tempo todo em campo. Prefere interfaces rápidas e objetivas.
*   **Biografia:** João é um técnico experiente e dedicado. Ele adora a parte prática do seu trabalho, mas se frustra com a burocracia: papelada que se perde, informações do cliente ou do equipamento que não chegam completas, e a dificuldade de se comunicar com o escritório. Gasta muito tempo no final do dia preenchendo formulários e ligando para Lívia. Sonha com um sistema que simplifique seu dia e o ajude a focar no que realmente importa: resolver o problema do cliente.
*   **Objetivos:**
    *   Receber OS de forma clara e rápida em seu dispositivo móvel.
    *   Acessar o histórico do equipamento e do cliente diretamente em campo.
    *   Registrar o início e fim do serviço, usar checklists e anexar fotos facilmente.
    *   Comunicar-se com a equipe do escritório sem complicações.
    *   Ter todas as ferramentas para executar seu trabalho com eficiência e segurança.
*   **Dores & Frustrações:**
    *   Falta de informações cruciais sobre o equipamento ou histórico de manutenção no local.
    *   Perda de formulários de OS em papel ou dificuldade de preenchimento em ambientes adversos.
    *   Dificuldade em anexar evidências visuais (fotos) de forma organizada.
    *   Tempo desperdiçado em deslocamento para pegar papéis ou ligar para o escritório.
    *   Sentimento de que a burocracia o impede de ser mais produtivo.
*   **Job-to-be-Done (JTBD):** Como um técnico de campo, preciso de um aplicativo móvel simples e completo que me entregue a Ordem de Serviço com todos os dados, me permita registrar cada passo da execução (início, fim, checklist, fotos) e comunicar qualquer imprevisto em tempo real, para que eu possa focar em realizar um serviço de qualidade, com agilidade, segurança e rastreabilidade, e fechar meu dia sem papelada.
*   **Necessidades Chave:** App mobile intuitivo (off-line-first, com sincronização), acesso rápido a histórico de ativos, checklists digitais, câmera integrada para fotos, chat/comunicação integrada, assinatura digital do cliente.

---

#### Jornada do Usuário: João, o Técnico de Campo Otimizado
**Cenário:** João recebe e executa a OS de manutenção corretiva para o sistema de climatização em um cliente corporativo.

**Fase 1: Recebimento e Preparação para a OS**

1.  **Notificação da Nova OS:**
    *   **Pensamentos/Sentimentos:** "Mais uma OS! Onde é? O que preciso fazer?"
    *   **Como o TM-OS Ajuda:**
        *   João recebe uma **notificação push em seu smartphone** do TM-OS.
        *   Ele abre o **aplicativo mobile do TM-OS**.
        *   Visualiza a nova OS na sua lista de tarefas, com a prioridade "Urgente".
2.  **Consulta de Informações da OS e Preparação:**
    *   **Pensamentos/Sentimentos:** "Preciso saber detalhes do equipamento e o histórico para ser eficiente."
    *   **Como o TM-OS Ajuda:**
        *   No aplicativo, João clica na OS e acessa todos os detalhes: descrição do problema, local exato (com mapa/endereço), contato do cliente no local, e o prazo de SLA.
        *   Acessa o **histórico de manutenção do equipamento** (sistema de climatização) através da OS, vendo serviços anteriores e soluções aplicadas.
        *   Verifica o checklist pré-definido para aquele tipo de serviço, garantindo que não esquecerá nenhuma etapa ou ferramenta.
        *   Confirma o horário de início da OS no app antes de sair.

**Fase 2: Execução do Serviço em Campo**

3.  **Início do Serviço e Registro:**
    *   **Pensamentos/Sentimentos:** "Cheguei no local, hora de começar. Preciso registrar isso."
    *   **Como o TM-OS Ajuda:**
        *   Ao chegar no local, João marca "Iniciar Serviço" no aplicativo TM-OS.
        *   Tira **fotos do problema inicial** com a câmera integrada do app, que são automaticamente vinculadas à OS.
4.  **Execução e Atualizações em Tempo Real:**
    *   **Pensamentos/Sentimentos:** "Encontrei um problema inesperado. Preciso avisar Lívia e talvez pedir uma peça."
    *   **Como o TM-OS Ajuda:**
        *   João preenche o **checklist digital** conforme avança no serviço, marcando as etapas concluídas.
        *   Encontra uma peça danificada. Tira **fotos da peça danificada** e anexa à OS.
        *   Usa o **chat integrado** no app para comunicar Lívia sobre a necessidade da peça e o tempo estimado para conseguir e instalar.
        *   Recebe a resposta de Lívia rapidamente, confirmando a disponibilidade.

**Fase 3: Conclusão e Documentação**

5.  **Finalização do Serviço e Documentação:**
    *   **Pensamentos/Sentimentos:** "Serviço concluído! Preciso registrar tudo direitinho e obter a aprovação do cliente."
    *   **Como o TM-OS Ajuda:**
        *   Após substituir a peça e testar o sistema, João preenche o restante do checklist.
        *   Tira **fotos do sistema reparado** e anexa à OS como evidência.
        *   Registra as horas trabalhadas, os materiais utilizados (futuro: módulo de inventário).
        *   Gera um resumo da OS no próprio app.
        *   Solicita a **assinatura digital do cliente** diretamente na tela do smartphone para aprovação do serviço.
6.  **Encerramento do Ciclo:**
    *   **Pensamentos/Sentimentos:** "Missão cumprida. Agora é só ir para a próxima, sem pilhas de papel."
    *   **Como o TM-OS Ajuda:**
        *   João marca "Finalizar Serviço" no app.
        *   A OS é automaticamente atualizada para "Concluída" no sistema para Lívia e a equipe do escritório.
        *   O histórico da OS e do equipamento é atualizado, pronto para futuras consultas.

**Outcome Desejado:** João realiza seu trabalho de forma mais organizada, rápida e sem a burocracia da papelada, com informações claras e comunicação eficiente, o que aumenta sua produtividade, segurança e satisfação no trabalho.

---

### Persona 3: Ricardo, o Administrador da Empresa Cliente

**"Preciso garantir que a empresa esteja usando o sistema da melhor forma, com dados seguros e insights para crescimento estratégico."**

*   **Nome:** Ricardo Assunção
*   **Idade:** 45 anos
*   **Cargo:** Diretor de Operações / Administrador do Sistema (Owner da Solutions Facilities)
*   **Empresa:** Solutions Facilities (proprietário da empresa)
*   **Tecnologia:** Usa laptop para 90% do tempo. Busca soluções que otimizem custos e processos, além de fornecer dados para decisões estratégicas.
*   **Biografia:** Ricardo é o fundador da Solutions Facilities e está sempre em busca de inovação para manter sua empresa competitiva. Ele entende a importância da digitalização, mas já teve experiências ruins com softwares complexos e caros que não foram bem adotados pela equipe. Sua principal preocupação é com a segurança dos dados, a escalabilidade da solução e a capacidade de extrair inteligência do sistema para otimizar os custos operacionais e prospectar novos negócios. Ele é quem toma a decisão final sobre a aquisição de novas tecnologias.
*   **Objetivos:**
    *   Garantir um onboarding suave e a adoção do TM-OS por toda a equipe.
    *   Ter controle sobre quem acessa o sistema e quais permissões cada usuário tem.
    *   Monitorar os KPIs gerais da empresa para identificar gargalos e oportunidades.
    *   Assegurar a conformidade do sistema com a LGPD e outras regulamentações.
    *   Avaliar o ROI do investimento no TM-OS e planejar futuras integrações.
*   **Dores & Frustrações:**
    *   Sistemas anteriores com baixa adoção pelos funcionários, gerando retrabalho.
    *   Dificuldade em ter uma visão consolidada do desempenho operacional e financeiro da empresa.
    *   Preocupação com a segurança e privacidade dos dados de seus clientes.
    *   Processos de setup e configuração de sistemas geralmente são longos e complexos.
    *   Falta de dados confiáveis para planejar expansões ou identificar ineficiências em grande escala.
*   **Job-to-be-Done (JTBD):** Como o administrador da minha empresa de manutenção, preciso de uma plataforma SaaS fácil de configurar e gerenciar que garanta a segurança e a integridade dos dados, me ofereça controle granular sobre o acesso dos usuários e, principalmente, me forneça dashboards e relatórios estratégicos, para que eu possa tomar decisões de negócio assertivas, otimizar a operação, garantir a conformidade e impulsionar o crescimento e a rentabilidade da Solutions Facilities.
*   **Necessidades Chave:** Módulo de gestão de usuários e permissões, dashboards de BI e KPIs avançados, funcionalidades de integração via API (futuro), relatórios de conformidade e auditoria, painel de controle administrativo intuitivo.

---

#### Jornada do Usuário: Ricardo, o Administrador da Empresa Cliente
**Cenário:** Ricardo acaba de assinar o TM-OS e precisa configurar o sistema para sua empresa, monitorar a adoção e o desempenho geral.

**Fase 1: Onboarding e Configuração Inicial da Empresa**

1.  **Primeiro Acesso e Configuração da Empresa:**
    *   **Pensamentos/Sentimentos:** "Espero que este seja mais fácil de configurar que o último."
    *   **Como o TM-OS Ajuda:**
        *   Ricardo recebe um link de e-mail para seu primeiro login no TM-OS.
        *   Ele é guiado por um **fluxo de onboarding intuitivo (web)**.
        *   Preenche os dados básicos da Solutions Facilities e configura o perfil da empresa (logotipo, informações de contato, etc.) no **Módulo de Gestão de Usuários (Multi-Tenant)**.
2.  **Cadastro de Usuários e Definição de Permissões:**
    *   **Pensamentos/Sentimentos:** "Preciso que Lívia tenha controle total, mas os técnicos apenas o necessário."
    *   **Como o TM-OS Ajuda:**
        *   Ricardo utiliza o **Módulo de Gestão de Usuários (Web)** para cadastrar Lívia como "Gestora", João e outros técnicos como "Técnicos de Campo".
        *   Atribui papéis e permissões pré-definidos (ou personaliza, dependendo da necessidade), garantindo que cada um tenha acesso apenas às funcionalidades relevantes para seu cargo.
        *   Envia convites automáticos por e-mail para que cada funcionário crie sua senha.
3.  **Configuração de Clientes e Locais:**
    *   **Pensamentos/Sentimentos:** "Meus clientes precisam estar no sistema para começarmos a criar OS."
    *   **Como o TM-OS Ajuda:**
        *   No **Módulo de Clientes e Locais (Web)**, Ricardo ou sua equipe administrativa importa a lista de clientes e seus respectivos locais (prédios, andares, equipamentos) via planilha ou cadastra manualmente.
        *   Configura os parâmetros iniciais, como tipos de serviço e prioridades de OS.

**Fase 2: Monitoramento da Adoção e Performance Operacional**

4.  **Acompanhamento da Adoção da Equipe:**
    *   **Pensamentos/Sentimentos:** "Minha equipe está usando o sistema? Eles estão se adaptando bem?"
    *   **Como o TM-OS Ajuda:**
        *   Ricardo acessa o **Dashboard Administrativo (Web)** do TM-OS.
        *   Visualiza métricas de engajamento, como o número de "Usuários Ativos Diários/Mensais (DAU/MAU)" e "Feature Adoption Rate" para as funcionalidades essenciais.
        *   Identifica se há usuários com baixa atividade e pode intervir com treinamento adicional se necessário.
5.  **Análise de Desempenho Global:**
    *   **Pensamentos/Sentimentos:** "Estamos mais eficientes? Estamos cumprindo os SLAs dos clientes de alto valor?"
    *   **Como o TM-OS Ajuda:**
        *   No **Módulo de Dashboards e BI (Web)**, Ricardo consulta painéis personalizados com KPIs de alto nível.
        *   Analisa o "Tempo Médio de Resolução de OS da Empresa", "% de OS Concluídas no Prazo (SLA)" para todos os clientes, e o "Volume de OS por Cliente/Local".
        *   Compara o desempenho atual com períodos anteriores para identificar tendências de melhoria ou áreas que precisam de atenção.
6.  **Verificação de Conformidade e Segurança:**
    *   **Pensamentos/Sentimentos:** "Meus dados e os dados dos meus clientes estão seguros e em conformidade?"
    *   **Como o TM-OS Ajuda:**
        *   Ricardo consulta um **painel de segurança e compliance (Web)** que exibe o status de conformidade da LGPD e registros de auditoria de acesso.
        *   Confirma que as políticas de segurança do TM-OS estão ativas e monitoradas.

**Fase 3: Planejamento Estratégico e Expansão**

7.  **Extração de Insights Estratégicos:**
    *   **Pensamentos/Sentimentos:** "Onde posso otimizar custos? Qual cliente me traz mais retorno? Quais serviços geram mais problemas recorrentes?"
    *   **Como o TM-OS Ajuda:**
        *   Utilizando relatórios avançados e filtros, Ricardo identifica que um tipo específico de equipamento está gerando muitas OS corretivas, sugerindo uma oportunidade para oferecer manutenção preventiva ou substituição.
        *   Analisa a produtividade média por técnico e a utilização de recursos, planejando futuras contratações ou treinamentos.
8.  **Avaliação de ROI e Planejamento Futuro:**
    *   **Pensamentos/Sentimentos:** "O TM-OS realmente está valendo o investimento? Como podemos ir além?"
    *   **Como o TM-OS Ajuda:**
        *   Ricardo revisa os KPIs de negócio ("Redução de Custos Operacionais do Cliente", "Aumento da Produtividade da Equipe Técnica") e percebe uma economia significativa.
        *   Considera as próximas fases do roadmap do TM-OS (IA para manutenção preditiva, integração IoT) para planejar a expansão de seus próprios serviços e aprofundar o uso da plataforma.

**Outcome Desejado:** Ricardo tem a certeza de que sua empresa está operando de forma eficiente e segura, com uma ferramenta que não apenas resolve as dores do dia a dia, mas também fornece os dados e insights necessários para um crescimento estratégico e sustentável.