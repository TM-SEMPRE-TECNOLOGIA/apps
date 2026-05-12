# Edge Cases (Situações Limites) — Auto Relatório

Casos excepcionais mapeados no código `.py` e na tela `.tsx` onde a máquina ou usuário saem do esperado "Caminho Feliz". 

1. **"Pastas Invisíveis" (O problema do .DS_Store / Thumbs.db):**
   - **Gatilho:** Técnicos que copiam pendrives mistos Mac/Windows (trazendo caches binários indesejados).
   - **Resolução Automática:** Função `scan_directory` ignora tudo q não seja string contendo `.png`, `.jpg`, `.jpeg`. O Parser é surdo para Lixo Eletrônico.

2. **Caminhos com Non-UTF8 ou Profundidade Absurda:**
   - **Gatilho:** A limitação do kernel Windows para paths maiores que 256 caracteres combinada com caracteres turcos/chineses importados de celulares.
   - **Resolução (UI):** Tenta ler `pathlib.Path(dir).resolve()` e caso o `os.walk` estoure encode, retorna no Log de Erro UI a palavra "ERRO: Caminho ilegível na pasta X". A página React NÃO quebra o Grid Visual das outras pastas.

3. **Arquivos do MS Word Corrompidos:**
   - **Gatilho:** O `template.docx` base guardado no `/templates` estar em Locked State pré-salvamento ou ter XML Interno quebrado (o docx é um .zip por baixo).
   - **Resolução Automática:** O try/except do pacote `python-docx` captura logo no Início de `generate()`. Se falhar na abertura raiz, a API solta `500 Server Error` explicando "Template Base Danificado" antes de fazer a varredura inútil de fotos pesadas.

4. **Botão de Duplo Clique Múltiplo:**
   - **Gatilho:** Desespero de final de tarde (Técnico clica no "Gerar" 10 vezes em 2 segundos).
   - **Resolução Frontend:** Estado React `isGenerating = true` trava o DOM. O botão recebe `disabled` imediato com classe `cursor-not-allowed` até a Promise responder via Axios.
