/**
 * FormularioDinamico.tsx
 * 
 * Componente React que gera um formulário dinâmico baseado nos placeholders
 * de um template Word e gera o relatório preenchido.
 * 
 * Features:
 * - Carrega metadados dos templates dinamicamente
 * - Renderiza campos conforme tipo (string, date)
 * - Validação em tempo real
 * - Auto-preenchimento de data_elaboracao
 * - Download automático do relatório gerado
 * - Tratamento de erros completo
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

// ============================================================================
// TIPOS & INTERFACES
// ============================================================================

interface TemplateField {
  label: string;
  type: 'string' | 'date';
  required: boolean;
  example: string;
  category: 'dynamic' | 'fixed';
  auto_fill?: boolean;
}

interface TemplateMetadata {
  name: string;
  code: string;
  agency: string;
  placeholders: string[];
  dynamic_fields: string[];
  fixed_fields: string[];
  fields: {
    [key: string]: TemplateField;
  };
}

interface ValidationError {
  field: string;
  message: string;
}

interface FormValues {
  [key: string]: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function FormularioDinamico() {
  // ──────────────────────────────────────────────────────────────────────
  // STATE
  // ──────────────────────────────────────────────────────────────────────

  const [templates, setTemplates] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [metadata, setMetadata] = useState<TemplateMetadata | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ──────────────────────────────────────────────────────────────────────
  // EFEITOS
  // ──────────────────────────────────────────────────────────────────────

  // Carregar lista de templates ao montar
  useEffect(() => {
    loadTemplates();
  }, []);

  // Carregar metadados quando template for selecionado
  useEffect(() => {
    if (selectedTemplate) {
      loadTemplateMetadata(selectedTemplate);
      setFormValues({});
      setErrors([]);
      setSuccessMessage('');
      setErrorMessage('');
    }
  }, [selectedTemplate]);

  // Auto-preencher data_elaboracao com data de hoje
  useEffect(() => {
    if (metadata) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      setFormValues((prev) => ({
        ...prev,
        data_elaboracao: today,
      }));
    }
  }, [metadata]);

  // ──────────────────────────────────────────────────────────────────────
  // FUNÇÕES DE API
  // ──────────────────────────────────────────────────────────────────────

  async function loadTemplates() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/templates');
      if (!response.ok) throw new Error('Erro ao carregar templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      setErrorMessage(`Erro ao carregar templates: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadTemplateMetadata(templateName: string) {
    try {
      setIsLoading(true);
      const encodedName = encodeURIComponent(templateName);
      const response = await fetch(`/api/template-placeholders/${encodedName}`);

      if (!response.ok) throw new Error('Erro ao carregar metadados do template');

      const data: TemplateMetadata = await response.json();
      setMetadata(data);
    } catch (error) {
      setErrorMessage(`Erro ao carregar template: ${error}`);
      setMetadata(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function validateForm(): Promise<boolean> {
    if (!metadata) return false;

    const newErrors: ValidationError[] = [];

    for (const [fieldName, fieldConfig] of Object.entries(metadata.fields)) {
      if (!fieldConfig.required && fieldConfig.auto_fill) {
        // Campos que são auto-preenchidos não precisam validação
        continue;
      }

      if (fieldConfig.required) {
        const value = formValues[fieldName];

        // Verificar se está vazio
        if (!value || value.trim() === '') {
          newErrors.push({
            field: fieldName,
            message: `${fieldConfig.label} é obrigatório`,
          });
          continue;
        }

        // Validar tipo
        if (fieldConfig.type === 'date') {
          // Validar formato de data (YYYY-MM-DD ou DD/MM/YYYY)
          if (!/^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
            newErrors.push({
              field: fieldName,
              message: `${fieldConfig.label} deve estar no formato DD/MM/YYYY ou YYYY-MM-DD`,
            });
          }
        }
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }

  async function handleGenerateReport(e: React.FormEvent) {
    e.preventDefault();

    // Validar form
    const isValid = await validateForm();
    if (!isValid) {
      setErrorMessage('Por favor, corrija os erros abaixo');
      return;
    }

    if (!metadata) {
      setErrorMessage('Template não selecionado');
      return;
    }

    try {
      setIsGenerating(true);
      setSuccessMessage('');
      setErrorMessage('');

      // Preparar payload
      const payload = {
        template_name: selectedTemplate,
        ...formValues,
      };

      // Fazer requisição para gerar relatório
      const response = await fetch('/api/generate-report-with-fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erro ao gerar relatório');

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(`✅ Relatório gerado com sucesso: ${result.message}`);

        // Fazer download automático
        if (result.document_url) {
          const downloadUrl = result.document_url;
          window.location.href = downloadUrl;
        }

        // Limpar form
        setFormValues({
          data_elaboracao: new Date().toISOString().split('T')[0],
        });
      } else {
        setErrorMessage(`❌ Erro: ${result.message}`);
        if (result.errors && result.errors.length > 0) {
          setErrorMessage(`${result.message}\n${result.errors.join('\n')}`);
        }
      }
    } catch (error) {
      setErrorMessage(`Erro ao gerar relatório: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  }

  // ──────────────────────────────────────────────────────────────────────
  // EVENT HANDLERS
  // ──────────────────────────────────────────────────────────────────────

  function handleInputChange(fieldName: string, value: string) {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Limpar erro deste campo quando usuário começar a digitar
    setErrors((prev) => prev.filter((e) => e.field !== fieldName));
  }

  // ──────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* ──────────────────────────────────────────────────────────────── */
        {/* CABEÇALHO */}
        {/* ──────────────────────────────────────────────────────────────── */}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⚡ AutoRelatório v3.2
          </h1>
          <p className="text-lg text-gray-600">
            Gere relatórios Word preenchidos automaticamente
          </p>
        </div>

        {/* ──────────────────────────────────────────────────────────────── */
        {/* FORMULÁRIO */}
        {/* ──────────────────────────────────────────────────────────────── */}

        <form onSubmit={handleGenerateReport} className="bg-white rounded-lg shadow-xl p-8">
          {/* SELETOR DE TEMPLATE */}
          <div className="mb-6">
            <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Template *
            </label>
            <select
              id="template"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={templates.length === 0}
            >
              <option value="">-- Escolha um template --</option>
              {templates.map((template) => (
                <option key={template} value={template}>
                  {template}
                </option>
              ))}
            </select>
          </div>

          {/* CAMPOS DINÂMICOS */}
          {metadata && !isLoading && (
            <div className="space-y-6">
              {/* Título da agência */}
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h2 className="text-lg font-semibold text-indigo-900 mb-2">
                  📍 {metadata.code} - {metadata.agency}
                </h2>
                <p className="text-sm text-indigo-700">
                  Preencha os campos abaixo para gerar o relatório
                </p>
              </div>

              {/* Renderizar campos dinâmicos */}
              {Object.entries(metadata.fields).map(([fieldName, fieldConfig]) => {
                const error = errors.find((e) => e.field === fieldName);
                const isAutoFill = fieldConfig.auto_fill;
                const isRequired = fieldConfig.required;

                return (
                  <div key={fieldName}>
                    <label
                      htmlFor={fieldName}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {fieldConfig.label}
                      {isRequired && <span className="text-red-500 ml-1">*</span>}
                      {isAutoFill && <span className="text-blue-500 ml-1 text-xs">(auto-preenchido)</span>}
                    </label>

                    {fieldConfig.type === 'date' ? (
                      <input
                        type="date"
                        id={fieldName}
                        value={formValues[fieldName] || ''}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          error ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isAutoFill && fieldName === 'data_elaboracao'}
                        required={isRequired && !isAutoFill}
                      />
                    ) : (
                      <input
                        type="text"
                        id={fieldName}
                        placeholder={fieldConfig.example}
                        value={formValues[fieldName] || ''}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          error ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required={isRequired}
                      />
                    )}

                    {error && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {error.message}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-gray-500">
                      Exemplo: {fieldConfig.example}
                    </p>
                  </div>
                );
              })}

              {/* BOTÃO GERAR */}
              <button
                type="submit"
                disabled={isGenerating || !selectedTemplate}
                className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Gerando relatório...
                  </>
                ) : (
                  <>
                    ✨ GERAR RELATÓRIO
                  </>
                )}
              </button>
            </div>
          )}

          {/* LOADING STATE */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader className="animate-spin text-indigo-600" size={32} />
            </div>
          )}

          {/* MENSAGEM DE SUCESSO */}
          {successMessage && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-green-900">{successMessage}</p>
                <p className="text-sm text-green-700 mt-1">
                  O arquivo será baixado em alguns segundos...
                </p>
              </div>
            </div>
          )}

          {/* MENSAGEM DE ERRO */}
          {errorMessage && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-red-900">Erro ao gerar relatório</p>
                <p className="text-sm text-red-700 mt-1 whitespace-pre-wrap">{errorMessage}</p>
              </div>
            </div>
          )}
        </form>

        {/* ──────────────────────────────────────────────────────────────── */
        {/* RODAPÉ COM INFORMAÇÕES */}
        {/* ──────────────────────────────────────────────────────────────── */}

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            ⏱️ Processamento rápido: ~1 segundo por relatório
          </p>
          <p className="mt-2">
            🔒 Dados protegidos: Nenhuma informação é armazenada
          </p>
        </div>
      </div>
    </div>
  );
}
