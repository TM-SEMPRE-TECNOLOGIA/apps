/**
 * Instruções de Integração: FormularioDinamico.tsx
 * 
 * Como adicionar o componente FormularioDinamico à sua aplicação Next.js
 */

// ============================================================================
// OPÇÃO 1: Adicionar à página principal (app/page.tsx)
// ============================================================================

/*
import FormularioDinamico from '@/components/FormularioDinamico';

export default function Home() {
  return (
    <main className="min-h-screen">
      <FormularioDinamico />
    </main>
  );
}
*/

// ============================================================================
// OPÇÃO 2: Criar página dedicada (app/relatorio/page.tsx)
// ============================================================================

/*
import FormularioDinamico from '@/components/FormularioDinamico';

export const metadata = {
  title: 'AutoRelatório v3.2',
  description: 'Sistema automático de preenchimento de relatórios Word'
};

export default function RelatoriPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <FormularioDinamico />
    </main>
  );
}
*/

// ============================================================================
// OPÇÃO 3: Adicionar como componente em página existente
// ============================================================================

/*
'use client';

import { useState } from 'react';
import FormularioDinamico from '@/components/FormularioDinamico';

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState('relatorio');

  return (
    <div>
      <header>
        <h1>Ferramentas</h1>
        <nav>
          <button onClick={() => setActiveTab('relatorio')}>
            AutoRelatório
          </button>
          {/* Outras abas... */}
        </nav>
      </header>

      {activeTab === 'relatorio' && (
        <section>
          <FormularioDinamico />
        </section>
      )}
    </div>
  );
}
*/

// ============================================================================
// VARIÁVEIS DE AMBIENTE NECESSÁRIAS
// ============================================================================

/*
Adicione ao seu .env.local:

# AutoRelatorio v3.2
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_TIMEOUT=30000
*/

// ============================================================================
// VERIFICAÇÃO DE COMPATIBILIDADE
// ============================================================================

const REQUIREMENTS = {
  react: '18+',
  'next.js': '13+',
  'tailwind': '3+',
  'lucide-react': '0.300+',
  typescript: '5+'
};

// ============================================================================
// TESTANDO A INTEGRAÇÃO
// ============================================================================

const INTEGRATION_TESTS = `
1. Verificar se Backend está rodando:
   curl http://localhost:8000/api/templates

2. Abrir aplicação:
   http://localhost:3000/relatorio (ou a rota que você escolheu)

3. Testar formulário:
   - Selecionar template
   - Verificar se campos são carregados
   - Preencher valores
   - Clicar "GERAR RELATÓRIO"
   - Verificar download automático

4. Abrir arquivo gerado no Word:
   - Todos os placeholders devem estar preenchidos ✅
`;

export default INTEGRATION_TESTS;
