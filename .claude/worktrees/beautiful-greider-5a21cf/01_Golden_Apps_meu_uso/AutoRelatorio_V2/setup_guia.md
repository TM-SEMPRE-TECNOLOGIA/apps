# 🚀 Guia de Implementação (Instalação Virgem)

Este guia prático ensina o usuário final ou o desenvolvedor a replicar o ambiente perfeitamente limpo do Auto Relatório (FastAPI + Next.js) num PC formatado ou "cru".

## 1. Instalação Completa dos Requisitos do Sistema
Para a execução do framework duplo, o computador Windows deve possuir duas tecnologias estruturais instaladas de forma global (com `PATH` configurado caso aplicável):

- **Python 3.10 ou superior:** 
  É absolutamente necessário marcar a caixinha **"Add Python to PATH"** logo na primeira tela do instalador Python do [python.org](https://www.python.org/).
- **Node.js (versão 20+ recomendada):**
  Efetue o download do LTS no [nodejs.org](https://nodejs.org/). O gerenciador de pacotes `NPM` será instalado junto nativamente.

---

## 2. Passo a Passo do Setup do Projeto

> **OBS:** Você também precisará do código em si, devidamente extraído numa pasta. Vamos assumir que essa pasta é `C:\AutoRelatorioV1_Dev`.

### A. Preparando o Ambiente Python (Backend API)
Crie o ambiente virtual (venv) para que as bibliotecas Python (ex: Fastapi, python-docx) não se percam pelo Windows.

1. Navegue até a pasta do backend abrindo seu **Prompt de Comando** (cmd) ou **PowerShell**:
   ```powershell
   cd C:\AutoRelatorioV1_Dev\APP\backend
   ```
2. Crie e ative o ambiente virtual:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   ```
   *(Sua linha de comando exibirá o texto `(.venv)` antes do input)*
3. Instale os requerimentos fixados:
   ```powershell
   pip install -r requirements.txt
   ```

### B. Preparando o Ambiente Node/React (Frontend UX)
Nós agora baixaremos os binários das UIs (React Hooks, Tailwind, Framer-motion).

1. Mova-se ao diretório do frontend:
   ```powershell
   cd C:\AutoRelatorioV1_Dev\APP\frontend
   ```
2. Dispare a instalação pelo NPM:
   ```powershell
   npm install
   ```
*(Aguarde, esse processo de mapeamento do Node-Modules costuma buscar milhares de sub-arquivos)*

---

## 3. Rodando Definitivamente o Aplicativo

Após essas execuções de primeira vez, os "motores" já estão alimentados.

Para o uso diário, **tudo está unificado em 1 lugar só.**

1. Volte ao diretório raiz primário:
   ```powershell
   cd C:\AutoRelatorioV1_Dev
   ```
2. Execute o orquestrador:
   ```powershell
   python run.py
   ```
   *Eles se encarregam de limpar processos ociosos (portas 3000/5000) e fará as barras de carregamento de ambos os sistemas e em seguida levantará visualmente que a plataforma abriu perfeitamente. Nenhuma outra janela precisa ser aberta pelo usuário.*
