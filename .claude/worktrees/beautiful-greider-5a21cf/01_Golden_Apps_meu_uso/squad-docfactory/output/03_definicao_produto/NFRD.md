# Documento de Requisitos Não Funcionais (NFRD) — Auto Relatório

## 1. Desempenho (Performance)

1. **Latência de Geração:** A montagem final do documento (inserção de texto e scaling de imagens no `python-docx`) não deve exceder 5 minutos no total para diretórios com até 1500 imagens de 5MB.
2. **Latência de Leitura/Preview:** A visualização em grid (`PreviewGrid` Next.js) deve chamar de forma assíncrona `/api/thumbnail` mantendo a fluidez nos primeiros dois segundos, em vez de segurar o Render do DOM aguardando full paths pesados via base64. Limitado em consumo de RAM do Browser para menos de 500MB em relatórios enormes.

## 2. Compatibilidade (Usability/Environment)

3. **OS Dependency Mapped:** O backend e o script de disparo (`run.py` ou `run.bat`) foram delineados primariamente para **Windows**. Dependências críticas como `os.startfile(output_path)` (Visualizar arquivo nativo após conclusão) são engessadas no ecossemsa Win32 API. Portes no futuro demandarão adaptação transversal de subprocess.
4. **Resolução de Tela Frontend:** Mínimo de suporte UI / Tailwind a `1366x768`. Painel lateral fluido para telas maiores. Sidebar centralizando em Desktop App sizes.

## 3. Segurança (Security & Privacy)

5. **Local First Storage / Zero Network Leak:** Este app processa **imagens de terceiros contendo senhas bancárias em post-its ou numerações de cofres.** Logo, a aplicação rodando via FastAPI na `localhost:5000` **NUNCA** deve expor telemetria externa, tampouco fazer uploads para Buckets cloud sem anuência corporativa restrita. A proteção baseia-se em operar no ring isolado sem DNS reverse da máquina.
6. **Inputs Limpos:** Mitigação nativa de Path Traversal no endpoint `/api/scan`.

## 4. Manutenibilidade e Escalabilidade

7. **Arquitetura Desacoplada:** O Frontend roda na `:3000` independentemente do Backend na `:5000`. Isso permite que na "V2.0 SaaS", a Fast API passe a ser ancorada num cluster Vercel (Next.js server actions) ou Cloud Run, sem reescrever o motor de preview.
8. **Logging Visível (ConsoleWatcher):** Mensagens de traceback devem ser passadas de STDERR python para stdout JSON em websocket ou endpoint long-polling, a fim de estarem presentes de fato pro usuário final não-técnico, facilitando debug via screenshot.
