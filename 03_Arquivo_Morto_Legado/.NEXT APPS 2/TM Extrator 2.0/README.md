# TM Extrator 2.0 🚀

Versão avançada do extrator técnico de dados, com suporte a múltiplos formatos de Memorial de Cálculo e interface Web/Python.

## 📂 Estrutura de Pastas

- **`/APP`**: Contém o coração do projeto.
    - Aplicação **Vite/React** (Interface Web).
    - Script **Python** (`extrair_itens_docx.py`) para processamento robusto de documentos Word.
- **`/DEV`**: Logs e ferramentas de desenvolvimento. Contém o `commit.html`.
- **`/DOCUMENTOS`**: Modelos de planilhas (`MODELO LIMPO.xlsx`) e relatórios de teste (`.docx`).

---

## 🚀 Como Executar

### Forma Automática
Utilize o menu interativo na raiz:
1.  Execute o arquivo `rodar.bat`.
2.  Escolha entre:
    - `[1]` Abrir Extrator Web (Vite)
    - `[2]` Abrir Extrator Rápido (Python)

### Execução Manual (Terminal)
1.  **Interface Web**:
    ```bash
    cd APP
    npm install
    npm run dev
    ```
2.  **Script Python**:
    ```bash
    cd APP
    python extrair_itens_docx.py
    ```

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Vite + React + Framer Motion
- **Backend/Scripting**: Python (python-docx + openpyxl)
- **Design System**: TM Premium Design (Syne + DM Sans)

---

**TM — Sempre Tecnologia**
