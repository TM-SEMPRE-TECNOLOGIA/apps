# AutoRelatorio V2

> Scaffold criado em 19/04/2026 com base no AutoRelatorioV1_Dev.
> Co-pilotado por Claude Sonnet 4.6.

## O que é

Sistema de geração automática de relatórios fotográficos de manutenção predial — versão 2.0.

A v2 evolui o fluxo "um por um" do v1 para um workflow de **cliques sequenciais**, onde o técnico seleciona itens, adiciona contexto e o app gera o relatório completo.

## Estrutura

```
AutoRelatorio_V2/
├── APP/
│   ├── backend/        ← Python: geração de Word, templates, server
│   └── frontend/       ← Next.js: interface do usuário
├── DOCUMENTOS/         ← Documentação técnica
├── dev/                ← Notas e rascunhos de desenvolvimento
├── run.py              ← Ponto de entrada principal
└── run.bat             ← Launcher Windows
```

## Funcionalidades planejadas (v2)

- [ ] Detalhes múltiplos por item (Detalhe 1, 2, 3...)
- [ ] Seletor de itens da planilha `Itens_Reorganizado`
- [ ] Editor de contexto dinâmico (super prompt)
- [ ] Múltiplos serviços por foto
- [ ] Editor de imagem (modal tela cheia: seta, caixa de texto, círculo)
- [ ] Indicador de dificuldade por item (🟢🟡🔴)
- [ ] Regras MAFFENG automáticas (calha, forro, Fiscal Carol, SP 0908)
- [ ] Tela de progresso durante geração do documento

## Como rodar (igual ao v1 por enquanto)

```bash
# Backend
cd APP/backend
pip install -r requirements.txt
python server.py

# Frontend (novo terminal)
cd APP/frontend
npm install
npm run dev
```

## PRD completo

Ver `brain_obisidian/00 - Jarvis Brain/Knowledge/AutoRelatorio_v2_PRD.md`
