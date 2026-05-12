# Plano de Testes — Auto Relatório

A natureza do script `Auto Relatório` exige focar **Testes E2E Sensoriais** (já que não há um pipeline remoto automatizado que executa Jest em um container que entenda os caminhos "C:\\"). Aqui estão as diretrizes.

## 1. Testes do Scanner / FileSystem (Backend)
- [ ] **Variáveis Ambientais:** Comprovar varreduras lidando com caminhos com dezenas de caracteres, espaços e hifens soltos: `D:\Serviços de Maio - TM Sempre\Bancos\Agência 01 - Centro São Paulo\`.
- [ ] **Simulação de Falha (Folder Permissions):** Checar se o try/catch do FastAPI intercepta um `Access Denied` para o frontend de forma amigável.
- [ ] **Cenário Zero (Pastas Vazias):** Selecionar uma pasta sem NENHUMA foto, apenas diretórios. Validar se o backend aborta o fluxo de geração limpo.

## 2. Testes da Preview UI (Next.js)
- [ ] **Stress Test de Memória:** O técnico tira em média 50 a 100 fotos. Alimente uma pasta com 300 imagens pesadas locais (8MB) e confirme que o Request do Frontend (no component `<ImageThumbnail>`) não estoura o `localStorage` nem dá OutOfMemory no aba do navegador, graças ao redutor da API.
- [ ] **Telas Reduzidas (Viewport):** Pressionar redimensionamento agressivo. Comprovar que o painel azul se compacta ou as fotos "grudam" no CSS Grid.

## 3. Teste de Output (Word Engine)
- [ ] **Documentos Trancados:** Com o Documento Base modelo gerado (`Relatorio_Agencia.docx`) rodando a segunda vez com ele ABERTO no MSWord de fundo. O `word_utils.py` TEM QUE lançar `PermissionError` para o log Vermelho do console.
- [ ] **Teste de DPI Excessiva:** Imagens corrompidas, super-expostas (HEIF do iPhone sem transcodificação nativa em certos Windows). Se der erro no Pillow, log de erro ou fallback para "skip image".
