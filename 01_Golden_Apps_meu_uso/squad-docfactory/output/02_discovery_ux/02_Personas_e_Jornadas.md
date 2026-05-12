# Personas e Jornadas do Usuário — Auto Relatório

## 1. Visão Geral
Este artefato mapeia os perfis reais de usuários do Auto Relatório (NX Relatórios) e as jornadas de interação com o sistema. O mapeamento é baseado na análise direta do código-fonte e da arquitetura da aplicação.

## 2. Personas

### Persona 1: O "Técnico de Campo" (Carlos)
- **Perfil:** 32 anos, Técnico de Manutenção Predial (TM Sempre Tecnologia). Trabalha visitando agências bancárias e edifícios corporativos fazendo levantamentos preventivos.
- **Rotina:** Chega na agência, tira fotos organizadas em pastas no notebook (Área Externa, Área Interna, Segundo Piso, etc.). Precisa entregar o relatório fotográfico no mesmo dia.
- **Dores:**
  - Antes do app, gastava **2-4 horas por agência** montando relatórios manualmente no Word.
  - Inserir foto por foto, redimensionar, categorizar e formatar era tedioso e propenso a erros.
  - Precisava escolher entre 4 descrições de serviço padrão e colá-las manualmente no template.
- **Objetivos:** Apontar para a pasta de fotos, apertar um botão, e ter o `.docx` pronto em minutos.
- **Nível técnico:** Básico-intermediário no PC. Sabe organizar pastas e usar browser, mas não é desenvolvedor.
- **Job-to-be-Done:** "Quando eu terminar minha visita técnica e organizar as fotos nas pastas corretas, quero gerar o relatório fotográfico completo sem ter que abrir o Word."

### Persona 2: O "Gestor Operacional" (Marcos)
- **Perfil:** 45 anos, Coordenador da equipe de manutenção. Recebe os relatórios dos técnicos e encaminha para o cliente final.
- **Rotina:** Precisa garantir que todos os relatórios estão padronizados, com o template correto, e sem erros de formatação antes de enviar ao cliente.
- **Dores:**
  - Técnicos entregavam relatórios com formatações diferentes, fontes variadas, imagens desproporcionais.
  - Refazer relatórios mal montados consumia tempo de gestão.
  - Sem padronização, o cliente final reclamava da qualidade visual.
- **Objetivos:** Ter padronização automática e poder confiar que qualquer técnico vai gerar um relatório profissional.
- **Job-to-be-Done:** "Quero que todos os relatórios saiam idênticos em formatação, independente de qual técnico usou o sistema."

## 3. Jornadas do Usuário

### Jornada A: Geração de Relatório (Modo Tradicional)

```
[Técnico Carlos]
    │
    ├─ 1. Organiza fotos em pastas no PC
    │     Ex: AGÊNCIA_CENTRO/
    │         ├── - Vista ampla/
    │         ├── - Área externa/
    │         │     ├── 01.01 Fachada/
    │         │     └── 01.02 Estacionamento/
    │         ├── - Área interna/
    │         │     ├── 01 Recepção/
    │         │     └── 02 Sala técnica/
    │         └── - Segundo piso/
    │
    ├─ 2. Executa `python run.py` (ou clica no `run.bat`)
    │     → Banner TM aparece no terminal
    │     → Backend (FastAPI) sobe na porta 5000
    │     → Frontend (Next.js) sobe na porta 3000
    │     → Navegador abre automaticamente
    │
    ├─ 3. No browser → SidebarWizard (lado esquerdo)
    │     → Escolhe tipo: "Tradicional" ou "SP"
    │     → Clica "Selecionar Pasta" (abre diálogo nativo Windows)
    │     → Aponta para AGÊNCIA_CENTRO/
    │     → Seleciona template .docx
    │     → Escolhe descrição do serviço (Desc 1-4)
    │
    ├─ 4. Clica "Escanear"
    │     → Backend varre subpastas recursivamente
    │     → Ordena: Vista Ampla → Área Externa → Interna → 2º Piso
    │     → Retorna array de conteúdo (títulos + paths de imagens)
    │     → PreviewGrid exibe as imagens em grid responsivo
    │
    ├─ 5. Revisa no PreviewGrid (pode editar se necessário)
    │
    ├─ 6. Clica "Gerar Relatório"
    │     → POST /api/generate
    │     → word_utils.py insere conteúdo no template .docx
    │     → ConsoleWatcher mostra logs em tempo real (verde=ok, vermelho=erro)
    │
    └─ 7. Download do .docx final
          → Clica "Baixar Relatório" ou "Abrir Saída"
          → Sentimento: Alívio total. 5 minutos vs 3 horas.
```

### Jornada B: Upload de Novo Template

```
[Gestor Marcos]
    │
    ├─ 1. Prepara um novo template .docx base no Word
    │     (com placeholders para títulos, imagens e {Desc_here})
    │
    ├─ 2. Usa o endpoint de upload (/api/upload-template)
    │     ou copia manualmente para APP/backend/templates/
    │
    └─ 3. O novo template aparece automaticamente no dropdown
          do SidebarWizard na próxima execução.
```

## 4. Mapa de Sentimentos

| Etapa | Sentimento | Nota |
|-------|-----------|------|
| Organizar pastas de fotos | 😐 Neutro | Trabalho manual necessário, mas já faz parte da rotina |
| Abrir o app (run.py) | 😊 Positivo | Banner premium + health-check automático transmite confiança |
| Selecionar pasta e escanear | 😊 Positivo | Diálogo nativo do Windows é familiar |
| Visualizar preview | 😍 Muito Positivo | Ver as fotos organizadas no grid antes de gerar dá segurança |
| Gerar relatório | 🤩 Encantamento | O que levaria horas sai em segundos |
| Download do .docx | ✅ Missão cumprida | Arquivo pronto para enviar ao cliente |

## 5. Requisitos de UX Derivados
- O `SidebarWizard` deve manter o fluxo step-by-step (não sobrecarregar o técnico com opções).
- O `PreviewGrid` é o "momento mágico" — precisa carregar rápido (thumbnails de 200px são gerados pelo backend via Pillow).
- O `ConsoleWatcher` na parte inferior transmite transparência e confiança no processo.
- O botão de "Gerar" só habilita quando todas as configurações estão preenchidas (prevenção de erro).
