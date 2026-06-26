# Detalhes e Diferenças: NX Relatorios vs TM Relatorio SP

Este documento detalha o estado atual dos dois repositórios principais e o plano para a criação do **AutoRelatorioV1**.

## 1. NX Relatorios (O "Frontend")
- **Status:** Visualmente completo, mas funcionalidade de lógica de geração incompleta ou básica.
- **Destaque:** UI Sóbria e bonita, estrutura modular (Component-based).
- **Estrutura:**
  - `frontend/components/`: Contém `SidebarWizard`, `PreviewGrid`, `ConsoleWatcher`.
  - `frontend/app/page.tsx`: Limpo, importa os componentes modulares.
  - Estilo: Palette White/Slate com acentos Teal. Next.js 16.1.6 + Tailwind 4.

## 2. TM Relatorio SP (O "Funcional")
- **Status:** 100% funcional (Frontend + Backend), mas UI monolítica e visualmente diferente (Dark Mode).
- **Destaque:** Lógica de "Organizado SP" refinada, injeção de detalhes por pasta, tabelas de medição automáticas.
- **Estrutura:**
  - `frontend/app/page.tsx`: Monolítico (606 linhas), contém toda a inteligência de estado e UI.
  - `backend/generator_sp.py`: Versão mais atualizada da lógica de processamento de imagens e pastas.
  - Estilo: Dark Theme (#010409) com animações de fundo (Mesh).

## 3. Comparação Técnica

| Recurso | NX Relatorios | TM Relatorio SP | Decisão AutoRelatorioV1 |
| :--- | :--- | :--- | :--- |
| **Arquitetura UI** | Modular (Best Practice) | Monolítica | **Modular (NX)** |
| **Logic/State** | Básico | Completo (SP/Tradicional) | **Completo (TM SP)** |
| **Backend** | v2.1.0-STABLE | v2.1.0-STABLE (Atualizado) | **TM SP Backend** |
| **Design System** | Clean/Premium | Dark/Cyber | **Clean/Premium (NX)** |
| **Vercel Ready** | Estrutura Standard | Estrutura Standard | **Otimizar p/ Vercel** |

## 4. Plano de Fusão (AutoRelatorioV1)
1. **Frontend:** Adotar a estrutura modular do `NX Relatorios`.
2. **Integração:** Migrar as funções `handleScan`, `handleGenerate`, e a gestão de estado complexa de `TM Relatorio SP` para os componentes modulares.
3. **Backend:** Utilizar o código do `TM Relatorio SP` como motor principal.
4. **Deploy:** Configurar `vercel.json` para suportar o frontend Next.js e, se necessário, o backend Python (ou documentar a separação).

---
*Documento gerado por Antigravity (Turbo Dev Mode).*
