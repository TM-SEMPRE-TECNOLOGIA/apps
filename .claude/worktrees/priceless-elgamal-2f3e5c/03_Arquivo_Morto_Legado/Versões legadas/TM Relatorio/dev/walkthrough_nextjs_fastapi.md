# Walkthrough: Modernização para Next.js 15 e FastAPI

Esta atualização representa um salto tecnológico significativo para o **Gerador de Relatórios Fotográficos**.

## 🚀 Principais Mudanças

### 1. Frontend: Next.js 15 (App Router)
- **Glassmorphism Design**: Interface premium com profundidade, transparência e desfoque.
- **Transições Suaves**: Uso de `Framer Motion` para animações fluidas entre estados.
- **Terminal de Logs Interativo**: Acompanhamento em tempo real da execução com estilo console.
- **Icons**: Biblioteca `Lucide React` para um visual moderno e limpo.

### 2. Backend: FastAPI
- **Alta Performance**: Migração completa de Flask para FastAPI.
- **Tipagem Forte**: Uso de Pydantic para validação de dados.
- **Documentação Automática**: Swagger UI disponível para testes (normalmente em `/docs`).

### 3. Integração e Facilidade
- **Script Unificado**: Arquivo `run.bat` na raiz que inicia tanto o backend Python quanto o frontend Next.js.
- **Preservação da Lógica**: Todos os cálculos de layout e processamento Word originais foram mantidos e integrados.

## 🛠️ Como Executar

1. Vá para a pasta raiz do projeto.
2. Execute o arquivo `run.bat`.
3. Acesse `http://localhost:3000` no seu navegador.

---
**TM - Sempre Tecnologia**  
Desenvolvido por: Thiago Nascimento Barbosa  
Março de 2026
