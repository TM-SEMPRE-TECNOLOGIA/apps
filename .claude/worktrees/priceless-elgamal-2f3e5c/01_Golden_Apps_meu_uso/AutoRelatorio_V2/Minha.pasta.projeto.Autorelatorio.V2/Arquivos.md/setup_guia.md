# Guia de Instalação — AutoRelatorio V2

> PC novo ou formatado. Versão interativa com checklist: `setup_guia.html`

---

## 1. Requisitos do sistema

- **Python 3.10+** — marcar **"Add Python to PATH"** no instalador
- **Node.js 20+ LTS** — o `npm` já vem junto

Confirmar instalações:
```powershell
python --version
node --version
npm --version
```

---

## 2. Obter o código

Copie ou clone a pasta do projeto em qualquer local do computador.

```powershell
git clone <repositório> C:\AutoRelatorio_V2
```

---

## 3. Backend (Python)

```powershell
cd C:\AutoRelatorio_V2\APP\backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

> O terminal mostra `(.venv)` quando o ambiente virtual está ativo.

---

## 4. Frontend (Node.js)

```powershell
cd C:\AutoRelatorio_V2\APP\frontend
npm install
```

> Aguarde — baixa milhares de arquivos (node_modules). Normal demorar 2–5 min.

---

## 5. Rodar o aplicativo

**Uso diário — um único comando:**

```powershell
cd C:\AutoRelatorio_V2
python run.py
```

Ou simplesmente **duplo clique no `run.bat`** na raiz do projeto.

O orquestrador cuida de tudo: limpa portas 3000/5000, sobe backend e frontend, e avisa quando estiver pronto.

Interface: `http://localhost:3000`

Para encerrar: `Ctrl+C` no terminal.
