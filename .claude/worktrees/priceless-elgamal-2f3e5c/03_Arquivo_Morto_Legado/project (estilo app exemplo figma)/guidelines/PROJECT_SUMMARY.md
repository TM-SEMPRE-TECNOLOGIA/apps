                  # Gerenciador de estado e navegação
├── styles/
│   └── globals.css                  # Sistema de design e tipografia
├── components/
│   ├── LoginScreen.tsx              # Tela 1: Autenticação
│   ├── HomeScreen.tsx               # Tela 2: Menu principal
│   ├── DashboardScreen.tsx          # Tela 3: Lista de OS
│   ├── SentSurveysScreen.tsx        # Levantamentos enviados
│   ├── SettingsScreen.tsx           # Configurações e preferências
│   ├── OSDetailsScreen.tsx          # Tela 4: Detalhes e dados da OS
│   ├── EnvironmentSelectionScreen.tsx # Tela 5: Seleção de ambientes
│   ├── CaptureScreen.tsx            # Tela 6: Captura por ambiente
│   ├── ServiceCaptureScreen.tsx     # Captura de fotos de serviços
│   ├── ReviewScreen.tsx             # Tela 7: Revisão final
│   ├── SuccessScreen.tsx            # Tela 8: Confirmação de envio
│   └── ui/                          # Componentes ShadCN UI
└── guidelines/
    ├── Guidelines.md                # Diretrizes de desenvolvimento
    └── PROJECT_SUMMARY.md           # Este documento
```

### Fluxo de Navegação

```
Login → Home → [3 opções]
         ├─→ Meus Levantamentos (Dashboard)
         │    └─→ OS Details
         │         └─→ Environment Selection
         │              └─→ Capture (por ambiente)
         │                   └─→ Service Capture (por serviço)
         │                        └─→ Review
         │                             └─→ Success → Home
         ├─→ Levantamentos Enviados (histórico)
         └─→ Configurações (tema, foto, preferências)
```

### Tipos de Dados Principais

#### WorkOrder (Ordem de Serviço)

```typescript
interface WorkOrder {
  id: string;
  number: string; // Ex: "OS-2025-001"
  location: string; // Ex: "Agência Centro"
  agency: string; // Ex: "AG-001"
  manager: string; // Nome do gestor
  status: "Pendente" | "Em Andamento" | "Concluído";
  progress: number; // 0-100
}
```

#### LevantamentoData (Dados do Levantamento)

```typescript
interface LevantamentoData {
  localName: string;
  agencyCode: string;
  managerName: string;
  technicianId: string;
  selectedEnvironments: string[];
  customEnvironments: string[];
  environmentData: {
    [key: string]: {
      widePhotos: string[];
      services: ServiceData[];
      completed?: boolean;
    };
  };
}
```

#### ServiceData (Dados do Serviço)

```typescript
interface ServiceData {
  name: string;
  photos: Array<{
    photo: string;
    observations: string;
    measurements: string;
  }>;
  detailPhotos: string[];
  completed?: boolean;
}
```

---

## 🎯 Padrões de Interface

### Cards Interativos

#### Estado Normal

```css
background-color: rgba(17, 34, 64, 0.5)
border: 1px solid rgba(100, 255, 218, 0.1)
```

#### Estado Hover

```css
border-color: #64ffda (ou cor específica)
box-shadow: 0 0 20px {color}33 (cor com 20% opacidade)
transform: translateY(-2px)
transition: all 200ms
```

### Inputs e Campos

#### Estado Normal

```css
background-color: #0a192f
border: 2px solid #1a365d
color: #e6f1ff
height: 56px (h-14)
```

#### Estado Focus

```css
border-color: #64ffda
box-shadow: 0 0 0 3px rgba(100, 255, 218, 0.1)
```

### Botões Primários

#### Estilo Base

```css
background-color: #64ffda
color: #0a192f
height: 56px (h-14)
border-radius: 12px (rounded-xl)
font-weight: 500
```

#### Estado Hover

```css
box-shadow: 0 0 20px rgba(100, 255, 218, 0.5)
transform: translateY(-2px)
transition: all 200ms
```

#### Estado Disabled

```css
opacity: 0.5
cursor: not-allowed
```

### Badges de Status

#### Pendente

```css
background: rgba(0, 212, 255, 0.1)
border: 1px solid #00d4ff
color: #00d4ff
```

#### Em Andamento

```css
background: rgba(100, 255, 218, 0.1)
border: 1px solid #64ffda
color: #64ffda
```

#### Concluído

```css
background: rgba(100, 255, 218, 0.1)
border: 1px solid #64ffda
color: #64ffda
```

---

## 📱 Componentes Específicos

### Header de Tela (Padrão)

```tsx
<div
  className="px-6 py-6 sticky top-0 z-10"
  style={{
    backgroundColor: "#112240",
    borderBottom: "1px solid rgba(100, 255, 218, 0.1)",
  }}
>
  <button
    onClick={onBack}
    className="flex items-center gap-2 mb-4"
  >
    <ArrowLeft size={20} style={{ color: "#8892b0" }} />
    <span style={{ color: "#8892b0" }}>Voltar</span>
  </button>
  <h1
    className="text-2xl mb-1 font-heading"
    style={{ color: "#e6f1ff" }}
  >
    Título da Tela
  </h1>
  <p className="font-body" style={{ color: "#8892b0" }}>
    Descrição da tela
  </p>
</div>
```

**Medidas:**

- Sticky top (sempre visível)
- Padding: 24px (px-6 py-6)
- Background: #112240
- Border inferior: 1px rgba(100, 255, 218, 0.1)
- z-index: 10

### Botão de Ação Flutuante (Bottom)

```tsx
<div
  className="fixed bottom-0 left-0 right-0 p-6"
  style={{
    background:
      "linear-gradient(180deg, transparent 0%, #0a192f 30%)",
  }}
>
  <Button
    onClick={handleAction}
    disabled={!isValid}
    className="w-full h-16"
    style={{
      backgroundColor: isValid
        ? "#64ffda"
        : "rgba(100, 255, 218, 0.3)",
      color: "#0a192f",
    }}
  >
    Texto do Botão
  </Button>
</div>
```

**Medidas:**

- Fixed bottom
- Padding: 24px (p-6)
- Altura do botão: 64px (h-16)
- Gradiente de fundo para destacar

### Progress Bar

```tsx
<Progress
  value={progress}
  className="h-2"
  style={{
    backgroundColor: "rgba(100, 255, 218, 0.1)",
    borderRadius: "4px",
  }}
/>
```

**Medidas:**

- Altura: 8px (h-2)
- Background: rgba(100, 255, 218, 0.1)
- Fill: #64ffda

### Avatar de Usuário

```tsx
<Avatar
  className="w-32 h-32 border-4"
  style={{
    borderColor: "#64ffda",
    boxShadow: "0 0 30px rgba(100, 255, 218, 0.3)",
  }}
>
  <AvatarImage src={userPhoto} alt={userName} />
  <AvatarFallback
    style={{
      backgroundColor: "#1a365d",
      color: "#64ffda",
      fontSize: "2rem",
    }}
  >
    <User size={48} />
  </AvatarFallback>
</Avatar>
```

**Medidas:**

- Tamanho: 128x128px (w-32 h-32)
- Border: 4px solid #64ffda
- Box shadow: glow neon
- Ícone fallback: 48px

---

## 🔄 Estados e Interações

### Estados de Captura de Foto

1. **Lista de fotos** (view inicial)
2. **Capturando foto** (showPhotoCapture = true)
3. **Foto capturada com formulário** (preenchimento de dados)
4. **Confirmação** (salvamento)

### Validações de Formulário

#### OS Details Screen

- ✅ Todos os campos obrigatórios preenchidos
- localName, agencyCode, managerName, technicianId

#### Environment Selection

- ✅ Pelo menos 1 ambiente selecionado
- ✅ Todos ambientes marcados como completos (para finalizar)

#### Service Capture

- ✅ Pelo menos 1 foto de detalhe capturada
- Fotos de serviço são opcionais mas recomendadas

#### Review Screen

- ✅ Dados principais preenchidos
- ✅ Todos ambientes completos

### Feedback Visual

#### Loading States

- Skeleton loaders para listas
- Spinner para ações assíncronas

#### Success States

- CheckCircle2 icon (#64ffda)
- Toast notification (se implementado)

#### Error States

- Borders vermelhos
- Mensagens de erro em #ff6b6b
- AlertCircle icon

---

## 🌐 Recursos Externos

### Ícones

- **Biblioteca:** lucide-react
- **Tamanhos padrão:** 16, 20, 24, 28, 48px

### Componentes UI

- **Biblioteca:** ShadCN UI
- **Localização:** /components/ui/
- **Componentes em uso:**
  - Avatar
  - Badge
  - Button
  - Input
  - Label
  - Progress
  - Textarea
  - (outros disponíveis mas não implementados ainda)

### Fontes

- **Source:** Google Fonts
- **Famílias:**
  - Exo 2 (weights: 400, 600, 700)
  - Inter (weights: 400, 500, 600)
  - Roboto Mono (weights: 400, 500)

---

## 📝 Convenções de Nomenclatura

### Arquivos

- **Componentes:** PascalCase.tsx (ex: `HomeScreen.tsx`)
- **Tipos:** Definidos no App.tsx ou em arquivos de componente
- **Estilos:** kebab-case (ex: `globals.css`)

### Classes CSS

- **Tailwind:** Uso de classes utilitárias
- **Custom:** Prefixo `tms-` para classes personalizadas
  - `.tms-code`
  - `.tms-title`
  - `.tms-subtitle`

### Variáveis de Estado

- **camelCase:** `currentScreen`, `levantamentoData`
- **Booleanos:** Prefixo `is`, `has`, `show`
  - `isValid`, `hasPhotos`, `showPhotoCapture`

### Funções/Handlers

- **Eventos:** Prefixo `handle`
  - `handleLogin`, `handleCapture`, `handleSubmit`
- **Navegação:** Prefixo `navigateTo` ou `onNavigateTo`
  - `navigateTo("home")`, `onNavigateToSettings`
- **Callbacks:** Prefixo `on`
  - `onBack`, `onComplete`, `onUpdateData`

---

## 🎭 Experiência de Usuário

### Princípios de Design

1. **Alto Contraste:** Design dark mode com cores vibrantes para uso externo
2. **Botões Grandes:** Mínimo 56px de altura para facilitar toque
3. **Feedback Imediato:** Hover states e transições de 200ms
4. **Hierarquia Visual Clara:** Uso de cores, tamanhos e espaçamentos
5. **Minimalismo Tech:** Interface limpa, foco na tarefa
6. **Mobile-First:** Otimizado para dispositivos móveis

### Acessibilidade

- **Touch Targets:** Mínimo 44x44px (iOS) / 48x48px (Android)
- **Contraste de Cores:** Alto contraste para legibilidade externa
- **Labels:** Todos os inputs têm labels associados
- **Feedback Visual:** Estados claros (normal, hover, focus, disabled)

### Performance

- **Navegação:** Client-side routing (state management)
- **Imagens:** Placeholder strings (simulação de fotos)
- **Lazy Loading:** Componentes carregados sob demanda
- **Smooth Transitions:** 200ms para hover/focus states

---

## 🔧 Tecnologias

- **Framework:** React 18+ com TypeScript
- **Estilização:** Tailwind CSS v4.0
- **Componentes:** ShadCN UI
- **Ícones:** Lucide React
- **Build:** Vite (presumido)
- **Deploy:** PWA-ready (Progressive Web App)

---

## 📊 Métricas e Estatísticas

### Telas Totais: 11

1. Login
2. Home
3. Dashboard (Meus Levantamentos)
4. Sent Surveys (Levantamentos Enviados)
5. Settings (Configurações)
6. OS Details
7. Environment Selection
8. Capture (por ambiente)
9. Service Capture (por serviço)
10. Review
11. Success

### Componentes Principais: 11

### Componentes UI (ShadCN): 40+

### Linhas de Código: ~2000+ (aproximado)

---

## 📅 Informações de Versão

**Última Atualização:** 30 de outubro de 2025  
**Versão do Documento:** 1.0  
**Mantido por:** Sistema MAFFENG - TMS

---

_Documento gerado automaticamente com base no estado atual do projeto TMS Levantamentos._