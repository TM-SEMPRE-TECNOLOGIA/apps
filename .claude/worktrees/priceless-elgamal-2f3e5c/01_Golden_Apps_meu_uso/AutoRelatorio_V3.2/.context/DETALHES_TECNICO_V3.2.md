# 🔧 Detalhes Técnico: AutoRelatorio v3.2

**Documento Complementar** — Especificações de Implementação por Módulo

---

## 1️⃣ Backend: Funções Auxiliares

### 1.1 `extract_placeholders(docx_path: str) → List[str]`

**Arquivo:** `APP/backend/word_utils.py` (adicionar nova função)

**Pseudocódigo:**
```python
from docx import Document
import re

def extract_placeholders(docx_path: str) -> List[str]:
    """
    Extrai todos os placeholders {{campo}} de um documento Word.
    
    Retorna: Lista única de placeholders (ex: ['nr_os', 'agencia_codigo'])
    """
    doc = Document(docx_path)
    placeholders = set()
    
    # Regex para encontrar {{campo}}
    pattern = r'\{\{([a-z_]+)\}\}'
    
    # Iterar por parágrafos
    for paragraph in doc.paragraphs:
        matches = re.findall(pattern, paragraph.text)
        placeholders.update(matches)
    
    # Iterar por tabelas
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                matches = re.findall(pattern, cell.text)
                placeholders.update(matches)
    
    return sorted(list(placeholders))
```

**Testabilidade:**
- Input: Caminho para `.docx` com `{{teste}}`, `{{agencia_codigo}}`
- Output: `['agencia_codigo', 'teste']` (ordenado)
- Edge cases:
  - Documento vazio → `[]`
  - Sem placeholders → `[]`
  - Placeholders duplicados → Retornar lista única
  - Placeholders em tabelas → Capturar também

---

### 1.2 `substitute_placeholders(docx_path: str, meta_fields: Dict[str, str]) → bytes`

**Arquivo:** `APP/backend/word_utils.py` (adicionar nova função)

**Pseudocódigo:**
```python
from docx import Document
from copy import deepcopy

def substitute_placeholders(docx_path: str, meta_fields: Dict[str, str]) -> bytes:
    """
    Substitui placeholders {{campo}} pelos valores em meta_fields.
    
    Args:
        docx_path: Caminho para template .docx
        meta_fields: Dict com valores para substituição
                    Ex: {'nr_os': '1753', 'agencia_codigo': '3575'}
    
    Retorna: Bytes do documento modificado
    """
    doc = Document(docx_path)
    
    # Iterar parágrafos
    for paragraph in doc.paragraphs:
        for run in paragraph.runs:
            for field_name, field_value in meta_fields.items():
                placeholder = f'{{{{{field_name}}}}}'
                if placeholder in run.text:
                    run.text = run.text.replace(placeholder, str(field_value))
    
    # Iterar tabelas
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    for run in paragraph.runs:
                        for field_name, field_value in meta_fields.items():
                            placeholder = f'{{{{{field_name}}}}}'
                            if placeholder in run.text:
                                run.text = run.text.replace(
                                    placeholder, 
                                    str(field_value)
                                )
    
    # Retornar como bytes (para envio via HTTP)
    output = BytesIO()
    doc.save(output)
    output.seek(0)
    return output.getvalue()
```

**Notas Importantes:**
- ⚠️ `run.text` é **read-only** em python-docx
- ✅ Solução: Modificar `run._element` diretamente ou usar `run.clear()` + `run.add_text()`

**Versão Corrigida:**
```python
def substitute_placeholders(docx_path: str, meta_fields: Dict[str, str]) -> bytes:
    """Versão que funciona com python-docx 0.8.x+"""
    doc = Document(docx_path)
    
    for paragraph in doc.paragraphs:
        for run in paragraph.runs:
            for field_name, field_value in meta_fields.items():
                placeholder = f'{{{{{field_name}}}}}'
                if placeholder in run.text:
                    # Abordagem funcional: recrear o texto
                    run.clear()
                    run.add_text(run.text.replace(placeholder, str(field_value)))
    
    # ... resto igual ...
```

---

## 2️⃣ Backend: Endpoints FastAPI

### 2.1 GET `/api/template-placeholders`

**Arquivo:** `APP/backend/server.py` (adicionar novo endpoint)

**Especificação:**
```python
@app.get("/api/template-placeholders")
async def get_template_placeholders(template: str = Query(...)):
    """
    Extrai placeholders de um template específico.
    
    Query Parameters:
    - template (required): Nome do arquivo template
                          Ex: "MODELO - 3575 - TANGARA DA SERRA.docx"
    
    Response (200 OK):
    {
        "template": "MODELO - 3575 - TANGARA DA SERRA.docx",
        "placeholders": [
            {
                "key": "agencia_codigo",
                "type": "string",
                "required": true,
                "description": "Código da agência"
            },
            {
                "key": "nr_os",
                "type": "string",
                "required": true,
                "description": "Número da Ordem de Serviço"
            },
            ...
        ],
        "meta": {
            "fixed_fields": 6,
            "dynamic_fields": 7
        }
    }
    
    Errors:
    - 404: Template não encontrado
    - 500: Erro ao ler documento
    """
    try:
        template_path = os.path.join(TEMPLATES_DIR, template)
        
        if not os.path.exists(template_path):
            raise HTTPException(status_code=404, detail="Template não encontrado")
        
        # Extrair placeholders
        from word_utils import extract_placeholders
        placeholders = extract_placeholders(template_path)
        
        # Mapear para metadados
        PLACEHOLDER_METADATA = {
            "nr_os": {
                "type": "string",
                "required": True,
                "description": "Número da Ordem de Serviço"
            },
            "data_elaboracao": {
                "type": "date",
                "required": False,  # Auto-gerada
                "description": "Data de elaboração (auto-preenchida com hoje)"
            },
            "data_atendimento": {
                "type": "date",
                "required": True,
                "description": "Data do primeiro atendimento"
            },
            "agencia_codigo": {
                "type": "string",
                "required": True,
                "description": "Código/Prefixo da agência"
            },
            "agencia_nome": {
                "type": "string",
                "required": True,
                "description": "Nome da agência"
            },
            "endereco": {
                "type": "string",
                "required": True,
                "description": "Endereço completo da dependência"
            },
            "responsavel_dependencia": {
                "type": "string",
                "required": True,
                "description": "Matrícula + Nome do responsável"
            }
        }
        
        # Montar resposta
        placeholders_info = [
            {
                "key": p,
                **PLACEHOLDER_METADATA.get(p, {"type": "unknown", "required": True})
            }
            for p in placeholders
        ]
        
        return {
            "template": template,
            "placeholders": placeholders_info,
            "meta": {
                "total_placeholders": len(placeholders),
                "required_fields": sum(1 for p in placeholders_info if p.get("required", True))
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

### 2.2 POST `/api/generate-report-with-fields`

**Arquivo:** `APP/backend/server.py` (modificar endpoint existente ou criar novo)

**Request Model:**
```python
class GenerateRequestWithFields(BaseModel):
    pasta_raiz: str
    modelo: str
    pasta_saida: str
    conteudo: list
    tipo_relatorio: str = "tradicional"
    # 🆕 Novo campo
    meta_fields: Dict[str, str] = {
        "nr_os": "1753",
        "data_elaboracao": "2026-05-01",
        "data_atendimento": "2026-04-28",
        "agencia_codigo": "3575",
        "agencia_nome": "TANGARA DA SERRA",
        "endereco": "Av. Principal, 123",
        "responsavel_dependencia": "2024 - JOÃO SILVA"
    }
```

**Especificação do Endpoint:**
```python
@app.post("/api/generate-report-with-fields")
async def generate_report_with_fields(request: GenerateRequestWithFields):
    """
    Gera relatório com substituição automática de placeholders.
    
    Body:
    {
        "pasta_raiz": "/caminho/fotos",
        "modelo": "MODELO - 3575.docx",
        "pasta_saida": "/output",
        "conteudo": [...],
        "meta_fields": {
            "nr_os": "1753",
            ...
        }
    }
    
    Response (200 OK):
    {
        "success": true,
        "output_docx": "RELATÓRIO_1753_2026-05-01.docx",
        "url": "/download/RELATÓRIO_1753_2026-05-01.docx",
        "log_process": "...",
        "meta_applied": {
            "nr_os": "1753",
            ...
        }
    }
    """
    try:
        # 1. Gerar relatório normalmente (usando gerador existente)
        result = generate_report(
            pasta_raiz=request.pasta_raiz,
            pasta_saida=request.pasta_saida,
            modelo=request.modelo,
            conteudo=request.conteudo,
            tipo_relatorio=request.tipo_relatorio
        )
        
        # 2. Aplicar substituição de placeholders
        from word_utils import substitute_placeholders
        
        # Auto-preencher data_elaboracao com hoje (se não foi fornecida)
        if "data_elaboracao" not in request.meta_fields:
            from datetime import date
            request.meta_fields["data_elaboracao"] = str(date.today())
        
        # Ler arquivo gerado
        output_path = result.output_docx
        
        # Substituir placeholders
        docx_bytes = substitute_placeholders(
            output_path,
            request.meta_fields
        )
        
        # 3. Salvar resultado
        # Opção A: Sobrescrever arquivo original
        with open(output_path, 'wb') as f:
            f.write(docx_bytes)
        
        # 4. Retornar resposta
        return {
            "success": True,
            "output_docx": os.path.basename(output_path),
            "url": f"/download/{os.path.basename(output_path)}",
            "log_process": result.log_process,
            "meta_applied": request.meta_fields
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar relatório: {str(e)}"
        )
```

---

## 3️⃣ Frontend: Componente `FormularioDinamico.tsx`

**Arquivo:** `APP/frontend/components/FormularioDinamico.tsx` (novo arquivo)

**Especificação:**
```typescript
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";

interface PlaceholderInfo {
  key: string;
  type: string;
  required: boolean;
  description: string;
}

interface FormularioDinamicoProps {
  template: string;
  onSubmit: (fields: Record<string, string>) => Promise<void>;
}

export default function FormularioDinamico({ 
  template, 
  onSubmit 
}: FormularioDinamicoProps) {
  
  const [placeholders, setPlaceholders] = useState<PlaceholderInfo[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Carregar placeholders do template
  useEffect(() => {
    const loadPlaceholders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/template-placeholders?template=${encodeURIComponent(template)}`
        );
        
        if (!response.ok) throw new Error("Erro ao carregar placeholders");
        
        const data = await response.json();
        setPlaceholders(data.placeholders || []);
        
        // Auto-preencher data_elaboracao (hoje)
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({
          ...prev,
          data_elaboracao: today
        }));
        
      } catch (err) {
        setError(`Erro: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadPlaceholders();
  }, [template]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    const missingFields = placeholders
      .filter(p => p.required && !formData[p.key])
      .map(p => p.key);
    
    if (missingFields.length > 0) {
      setError(`Campos obrigatórios: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
      setError(null);
    } catch (err) {
      setError(`Erro ao gerar relatório: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando formulário...</div>;
  }

  if (placeholders.length === 0) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        Este template não possui placeholders dinâmicos.
      </div>
    );
  }

  // Filtrar placeholders: mostrar apenas os required (exceto data_elaboracao que é auto)
  const displayFields = placeholders.filter(p => p.required);

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-bold">Preencher Informações do Relatório</h2>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {displayFields.map(placeholder => (
          <div key={placeholder.key} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {placeholder.description}
              {placeholder.required && <span className="text-red-500">*</span>}
            </label>
            
            {placeholder.type === "date" ? (
              <input
                type="date"
                name={placeholder.key}
                value={formData[placeholder.key] || ""}
                onChange={(e) => handleChange(placeholder.key, e.target.value)}
                disabled={placeholder.key === "data_elaboracao"}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            ) : (
              <Input
                type="text"
                name={placeholder.key}
                value={formData[placeholder.key] || ""}
                onChange={(e) => handleChange(placeholder.key, e.target.value)}
                placeholder={`Informe o ${placeholder.description}`}
                disabled={submitting}
              />
            )}
          </div>
        ))}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {submitting ? "Gerando relatório..." : "Gerar Relatório"}
        </Button>
      </form>

      {/* Debug info */}
      <details className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
        <summary>Detalhes técnicos</summary>
        <pre>{JSON.stringify({ placeholders, formData }, null, 2)}</pre>
      </details>
    </Card>
  );
}
```

---

## 4️⃣ Integração no Flow Existente

### 4.1 Como usar no componente principal

```typescript
// app/page.tsx ou similar

import FormularioDinamico from "@/components/FormularioDinamico";

export default function RelatorioPrincipal() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const handleGenerateWithFields = async (meta_fields: Record<string, string>) => {
    const response = await fetch("/api/generate-report-with-fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pasta_raiz: "/caminho/fotos",
        modelo: selectedTemplate,
        pasta_saida: "/output",
        conteudo: [], // Do scanner
        meta_fields
      })
    });

    if (response.ok) {
      const data = await response.json();
      // Fazer download ou mostrar sucesso
      window.open(`/download/${data.output_docx}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Seletor de template */}
      <TemplateSelector onSelect={setSelectedTemplate} />

      {/* Formulário dinâmico */}
      {selectedTemplate && (
        <FormularioDinamico
          template={selectedTemplate}
          onSubmit={handleGenerateWithFields}
        />
      )}
    </div>
  );
}
```

---

## 5️⃣ Modificações em Templates (Word)

### 5.1 Exemplo: Onde inserir placeholders

**Template:** `MODELO - 3575 - TANGARA DA SERRA.docx`

**Seção: Capa/Cabeçalho**
```
┌────────────────────────────────────┐
│    RELATÓRIO FOTOGRÁFICO           │
│    LEVANTAMENTO PREVENTIVO         │
│                                    │
│ Contrato: 2025.7421.3575          │  ← Fixo
│ Elaboração: Ygor Augusto Fernandes │  ← Fixo
│                                    │
│ Agência: {{agencia_codigo}}         │  ← Dinâmico
│ {{agencia_nome}}                    │  ← Dinâmico
│                                    │
│ Endereço: {{endereco}}              │  ← Dinâmico
│                                    │
│ UF: MT                             │  ← Fixo
│ OS: {{nr_os}}                       │  ← Dinâmico
│ Data: {{data_elaboracao}}           │  ← Dinâmico
│ Atendimento: {{data_atendimento}}   │  ← Dinâmico
└────────────────────────────────────┘
```

**Seção: Assinatura/Responsáveis**
```
Responsável da Dependência: {{responsavel_dependencia}}
Responsável Técnico: Alexandre Marcos        ← Fixo
Empresa: Ygor Augusto Fernandes Ferrugem...  ← Fixo
```

---

## 6️⃣ Segurança e Validação

### 6.1 Validações no Backend

```python
@app.post("/api/generate-report-with-fields")
async def generate_report_with_fields(request: GenerateRequestWithFields):
    # ✅ Validação 1: Arquivo existe
    template_path = os.path.join(TEMPLATES_DIR, request.modelo)
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template não existe")
    
    # ✅ Validação 2: meta_fields não contém chaves suspeitas
    ALLOWED_KEYS = {
        "nr_os", "data_elaboracao", "data_atendimento",
        "agencia_codigo", "agencia_nome", "endereco",
        "responsavel_dependencia"
    }
    for key in request.meta_fields.keys():
        if key not in ALLOWED_KEYS:
            raise HTTPException(
                status_code=400,
                detail=f"Campo inválido: {key}"
            )
    
    # ✅ Validação 3: Valores não são muito longos (XSS prevention)
    MAX_LENGTH = 500
    for key, value in request.meta_fields.items():
        if len(str(value)) > MAX_LENGTH:
            raise HTTPException(
                status_code=400,
                detail=f"Campo {key} excede tamanho máximo"
            )
    
    # ... resto do processamento ...
```

---

## 7️⃣ Performance e Otimizações

### 7.1 Cache de Placeholders

```python
from functools import lru_cache

@lru_cache(maxsize=32)
def extract_placeholders_cached(docx_path: str) -> tuple:
    """Cache da extração de placeholders (até 32 templates)"""
    return tuple(extract_placeholders(docx_path))
```

### 7.2 Processamento Assíncrono

Para relatórios grandes (muitas imagens), considerar background job:

```python
from celery import Celery

celery_app = Celery("relatorio-tasks")

@celery_app.task
def generate_report_async(request_data: dict):
    """Gerar relatório em background"""
    # ... processamento ...
    return {"status": "concluído", "url": "..."}
```

---

## 8️⃣ Checklist de Testes Unitários

```python
# tests/test_word_utils.py

def test_extract_placeholders_basic():
    """Extrai placeholders simples"""
    placeholders = extract_placeholders("template_test.docx")
    assert "nr_os" in placeholders
    assert "agencia_codigo" in placeholders

def test_extract_placeholders_empty():
    """Documento sem placeholders retorna lista vazia"""
    placeholders = extract_placeholders("template_empty.docx")
    assert placeholders == []

def test_substitute_placeholders():
    """Substitui placeholders corretamente"""
    meta = {"nr_os": "1753", "agencia_codigo": "3575"}
    result_bytes = substitute_placeholders("template.docx", meta)
    
    # Verificar se resultado é válido
    from docx import Document
    from io import BytesIO
    doc = Document(BytesIO(result_bytes))
    assert "1753" in doc.paragraphs[0].text
    assert "3575" in doc.paragraphs[1].text
```

---

## 9️⃣ Troubleshooting Comum

| Problema | Causa | Solução |
|----------|-------|--------|
| `{{campo}}` não é substituído | Placeholder em run diferente | Unir runs ou iterar melhor |
| `extract_placeholders` retorna vazio | Placeholders em shapes/textboxes | Estender função para caçar em shapes |
| Formulário não aparece | Template sem placeholders | Lógica correta — não renderizar |
| Date format errado | Locale diferente | Força padrão ISO: `YYYY-MM-DD` |

---

## 🔟 Próximas Expansões (Futuro)

- [ ] Suporte a nested placeholders: `{{secao.campo}}`
- [ ] Placeholders com formatação: `{{campo | uppercase}}`
- [ ] Template inheritance: um template herda placeholders de outro
- [ ] Validation rules por placeholder (ex: `{{nr_os | digits_only}}`)

---

**Versão:** 3.2 | **Data:** 2026-05-01 | **Status:** Detalhamento Técnico ✅
