/* global React */
/* Three chat compositions — Início, Em andamento, Concluído */

function ScreenInicio() {
  const { ChatShell, DateSep, SystemMsg, Bubble, Text, Photo, Voice, LocationPin, BotCard } = window;
  return (
    <ChatShell typing="Sup. Marcos">
      <DateSep>QUI · 15 ABR · 07:42</DateSep>
      <SystemMsg>Eng. Thiago entrou no grupo</SystemMsg>

      <Bubble from="thiago" time="07:43" read>
        <LocationPin address="Av. Paulista, 1578 — Bela Vista, São Paulo" />
        <Text>Cheguei no Bloco A. Começando pela fachada leste.</Text>
      </Bubble>

      <Bubble from="marcos" time="07:44">
        <Text>Bom dia. Atenção redobrada no rufo da cobertura — chuva forte ontem.</Text>
      </Bubble>

      <Bubble from="bot" time="07:45">
        <BotCard
          badge="INSPEÇÃO INICIADA"
          title="MF-2024/038 · Bloco A · 14 itens no checklist"
          body="Contrato vinculado. Estimativa: 45 min para inspeção visual completa."
          actions={['Ver checklist', 'Pular']}
        />
      </Bubble>

      <Bubble from="thiago" time="07:51" read>
        <Voice duration="0:34" />
      </Bubble>

      <Bubble from="thiago" time="07:52" read>
        <Photo tone="#475569" num="2401" caption="Vista geral da fachada leste — Bloco A" />
      </Bubble>

      <SystemMsg>Cliente Daniel entrou no grupo</SystemMsg>
    </ChatShell>
  );
}

function ScreenAndamento() {
  const { ChatShell, DateSep, Bubble, Text, Quote, Photo, BotCard, Poll, Voice } = window;
  return (
    <ChatShell>
      <DateSep>HOJE · 09:18</DateSep>

      <Bubble from="thiago" time="09:18" read>
        <Photo tone="#334155" num="2405" anomaly="MÉDIO" caption="Trinca de retração na junta de dilatação — fachada L, 3º pav." />
      </Bubble>

      <Bubble from="bot" time="09:18">
        <BotCard
          badge="CLASSIFICAÇÃO AUTOMÁTICA"
          title="Trinca de retração · grau MÉDIO"
          body="Conforme NBR 5674. Prazo sugerido de intervenção corretiva: 90 dias."
          actions={['Confirmar', 'Editar']}
        />
      </Bubble>

      <Bubble from="marcos" time="09:21">
        <Quote author="thiago" text="Trinca de retração na junta de dilatação — fachada L..." />
        <Text>Documenta o detalhe do rufo também. Foco no encontro com a platibanda.</Text>
      </Bubble>

      <Bubble from="thiago" time="09:27" read>
        <Photo tone="#3a3a1e" num="2408" anomaly="ALTO" caption="Infiltração ativa no rufo da cobertura" />
      </Bubble>

      <Bubble from="daniel" time="09:31">
        <Text>Quanto tempo até ter um relatório preliminar pra apresentar amanhã?</Text>
      </Bubble>

      <Bubble from="bot" time="09:32">
        <Poll
          question="Prazo de execução para o item 02 (infiltração)?"
          options={[
            { label: '30 dias',  votes: 1 },
            { label: '60 dias',  votes: 0 },
            { label: '90 dias',  votes: 0 },
          ]}
        />
      </Bubble>

      <Bubble from="marcos" time="09:34">
        <Voice duration="0:22" />
      </Bubble>
    </ChatShell>
  );
}

function ScreenConcluido() {
  const { ChatShell, DateSep, Bubble, Text, FileCard, BotCard, SystemMsg } = window;
  return (
    <ChatShell>
      <DateSep>HOJE · 11:53</DateSep>

      <Bubble from="thiago" time="11:53" read>
        <Text>Finalizado. 12 fotos, 3 anomalias, todas classificadas.</Text>
      </Bubble>

      <Bubble from="bot" time="11:54">
        <BotCard
          badge="DOCUMENTO PRONTO"
          title="Relatório 2026·04·BLA·018"
          body="14 páginas, formato MAFFENG. Gerado em 04:42."
        />
        <FileCard
          name="BLOCO-A_2026-04.docx"
          meta="1.8 MB · 14 pags · 11:54"
          actions={['Baixar', 'Compartilhar']}
        />
      </Bubble>

      <Bubble from="daniel" time="11:58">
        <Text>Perfeito, recebi. Vou apresentar ao síndico amanhã na reunião.</Text>
      </Bubble>

      <Bubble from="marcos" time="12:01">
        <Text>Aprovado. Bom trabalho, Thiago.</Text>
      </Bubble>

      <Bubble from="thiago" time="12:02" read>
        <Text>Valeu equipe. Já marquei a revisão para 15·04·2027.</Text>
      </Bubble>

      <Bubble from="bot" time="12:02">
        <BotCard
          badge="ARQUIVAMENTO"
          title="Inspeção arquivada · MF-2024/038"
          body="Próxima revisão técnica: 15·04·2027 · Lembrete agendado."
        />
      </Bubble>

      <SystemMsg>Mensagens criptografadas ponta a ponta · 4 membros</SystemMsg>
    </ChatShell>
  );
}

Object.assign(window, { ScreenInicio, ScreenAndamento, ScreenConcluido });
