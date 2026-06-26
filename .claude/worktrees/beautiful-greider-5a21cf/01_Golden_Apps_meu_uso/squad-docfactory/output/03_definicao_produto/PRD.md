# Documento de Requisitos do Produto (PRD) — Auto Relatório

## 1. Visão do Produto
O **Auto Relatório (NX Relatórios)** é uma ferramenta de uso interno projetada para técnicos de campo e engenheiros de manutenção predial. Seu propósito é unicamente automatizar o processo tedioso de inserção de fotos, categorização e formatação em gabaritos Word (.docx), transformando o que costumava levar horas de copy-paste em um processo que dura segundos.

## 2. Requisitos Core (Épicos)

### 2.1. Ingestão de Dados via Sistema de Arquivos (Folder Scanner)
- **Requisito:** O sistema deve ler pastas organizadas hierarquicamente e mapear nomes de pastas como Títulos de Sessão e os arquivos de imagem como conteúdo.
- **Caso de Uso:** O técnico aponta a pasta raiz "Agencia 01" e o backend retorna o JSON estruturado (`["» Vista ampla", {"imagem": "path/foto.jpg"}]`).
- **Aceitação:** Suportar extensões `.jpg`, `.jpeg`, `.png`. Ignorar e limpar arquivos sistema silenciosamente (`.DS_Store`, `Thumbs.db`).

### 2.2. Geração do Template Dinâmico
- **Requisito:** O sistema deve utilizar a biblioteca `python-docx` nativamente para inserir texto ancorado e escalar imagens proporcionalmente e centradamente em tabelas ou seções de um template real `.docx`.
- **Caso de Uso:** O técnico clica em "Gerar" e o backend grava uma cópia da base (`template.docx`) adicionando o material extraído sem quebrar margens.
- **Modos:** Deve suportar processamento Tradicional (Linear) e SP (Processamento Múltiplo).

### 2.3. Painel de Pré-Visualização Visual (PreviewGrid)
- **Requisito:** O frontend (Next.js) deve renderizar as fotografias identificadas e os títulos para averiguação antes da montagem no `.docx`.
- **Caso de Uso:** Thumbnails (miniaturas) leves de < 200px lado a lado.
- **Benefício UX:** Prevenção de erro e aumento radical na confiança sistêmica por parte do técnico operacional (reduz a "ansiedade de clique" que muitas CRIs em terminal trazem).

### 2.4. Gestão de Logs e Transparência
- **Requisito:** A interface precisa expor o terminal subjacente de orquestração visualmente elegante no rodapé (ConsoleWatcher).
- **Aceitação:** Erros de enconding ou paths grandes devem saltar em vermelho no front end imediatamente.

## 3. Requisitos Excluídos (Out of Scope - V1)
- Base de Dados (Não haverá DB. Configuração persistida via `.env` ou LocalStorage).
- Login / Autenticação (Uso Desktop mono-usuário offline/local).
- Upload para nuvem (Somente paths locais Windows).
