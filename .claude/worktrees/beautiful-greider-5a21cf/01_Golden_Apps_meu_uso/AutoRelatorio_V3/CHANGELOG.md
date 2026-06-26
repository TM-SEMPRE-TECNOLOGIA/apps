# AutoRelatorio — Changelog

## V3 (em desenvolvimento)

### Objetivo
Eliminar o uso do Windows File Explorer para organização de fotos.
A organização passa a acontecer inteiramente dentro do app, enquanto o usuário consulta o WhatsApp.

### O que muda no fluxo

**Antes (V2):**
```
WhatsApp → File Explorer (criar pastas + mover fotos) → TM Pastas → AutoRelatorio V2
```

**Depois (V3):**
```
WhatsApp → AutoRelatorio V3 (scan de pasta plana + atribuição de grupos interna)
```

### Novas Features

#### Sprint 1 — AmbienteSelector + Aba Localização no Modal
- Novo componente `AmbienteSelector.tsx`: árvore interativa com 4 níveis (Área > Ambiente > Serviço > Detalhe)
- Sugestões pré-carregadas do TM Pastas (`AREAS_SUGERIDAS`, `AMBIENTES_SUGERIDOS`, etc.)
- Usuário pode criar novos itens em qualquer nível durante o uso
- Modal (`ImageEditorModal.tsx`) ganha 2 abas no painel direito: **[Localização]** e **[Serviços]**
- Aba Localização = `AmbienteSelector` para atribuir o grupo daquela foto

#### Sprint 2 — Multi-seleção no Grid e Avisos
- Checkbox em cada card da foto ao passar o mouse
- Barra flutuante de ações: "X fotos selecionadas → Atribuir grupo"
- Atribuição em lote: seleciona N fotos → escolhe o grupo → todas recebem o badge
- Fotos sem grupo: badge vermelho no card
- Botão "Gerar Relatório" exibe alerta se há fotos sem grupo atribuído

#### Sprint 3 — Backend Python Adaptado
- Endpoint `/api/generate` passa a aceitar `ambiente_data: dict[str, list[str]]`
  - Formato: `{ "caminho/foto.jpg": ["Área interna", "SAA", "Pintura"] }`
- `generator.py` monta `conteudo` agrupando fotos pelo caminho de atribuição
- Fallback: se `ambiente_data` vazio, usa comportamento V2 (scan de pastas do disco)

#### Sprint 4 — Reordenação de Seções
- Drag-and-drop para reordenar grupos/seções antes de gerar o relatório
- Botões ↑↓ como alternativa ao drag

### Estado Global Adicionado (`page.tsx`)
```ts
ambienteData: Record<string, string[]>
// imagePath → ['Área interna', 'SAA', 'Pintura']
```

### Arquivos Modificados
| Arquivo | Tipo de mudança |
|---|---|
| `APP/frontend/components/AmbienteSelector.tsx` | NOVO |
| `APP/frontend/components/ImageEditorModal.tsx` | Modificado (2 abas) |
| `APP/frontend/components/PreviewGrid.tsx` | Modificado (multi-seleção + badges) |
| `APP/frontend/app/page.tsx` | Modificado (novo state) |
| `APP/backend/server.py` | Modificado (aceita ambiente_data) |
| `APP/backend/generator.py` | Modificado (monta conteudo por grupo) |

---

## V2 (estável)

### Funcionalidades
- Scan de pasta organizada em hierarquia de subpastas
- Modal com editor de imagem (Fabric.js): setas, círculos, texto, cotas
- Seleção de itens MAFFENG com cálculo de área (m², m) e unidades
- Geração de relatório `.docx` a partir de 9 templates (por cidade/contrato)
- Dois modos de relatório: Tradicional e SP
- Console watcher para acompanhar logs de geração

### Stack
- Frontend: Next.js 16 + React 19 + Tailwind 4 + Fabric.js 7.3.1
- Backend: FastAPI + Uvicorn (porta 5000)
- Geração Word: python-docx + Pillow
- Launcher: run.py + run.bat
