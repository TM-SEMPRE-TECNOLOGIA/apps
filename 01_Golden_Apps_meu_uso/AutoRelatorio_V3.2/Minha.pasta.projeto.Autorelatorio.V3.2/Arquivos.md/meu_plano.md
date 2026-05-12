# Meu Plano — AutoRelatorio V2

> Versão interativa com visualização visual: `meu_plano.html`

---

## Crítico

Tarefas urgentes — bloqueadores ou impacto imediato no projeto.

- [ ] **Detalhes múltiplos por item (Detalhe 1, 2, 3...)** `Frontend`
  - Permitir que o usuário adicione 3+ detalhes diferentes por foto no editor modal
  - Impacta tanto a UI quanto o backend (api/generate)

- [ ] **Indicador de dificuldade por item (🟢🟡🔴)** `Frontend`
  - Visual no preview grid + seletor no editor
  - Ajuda técnico a priorizar serviços complexos

- [ ] **Regras MAFFENG automáticas (calha, forro, Fiscal Carol)** `Backend`
  - Integrar as regras específicas de São Paulo no generator_sp.py
  - Afeta geração de tabelas Word

---

## Importante

Em fila — implementação planejada para as próximas semanas.

- [ ] **Editor de contexto dinâmico (super prompt)** `Frontend`
  - Campo no SidebarWizard para enviar instrução custom ao llm_generator.py
  - Exemplo: "foco em medidas acima de 2m", "detectar danos estruturais"

- [ ] **Múltiplos serviços por foto com contexto automático** `Backend`
  - Permitir `{servico_1}, {servico_2}, {servico_3}` no template Word
  - Cada serviço recebe contexto diferente

- [ ] **Integrar llm_generator.py ao server.py** `IA / LLM`
  - Conectar ao endpoint `/api/generate`
  - Ativar geração automática de descrições via Claude

- [ ] **Configurar chave de API para geração LLM** `IA / LLM`
  - Variável de ambiente ou arquivo .env
  - Testar com 50+ imagens reais

- [ ] **Atualizar README com estado real da V2** `Documentação`
  - Remover "Funcionalidades planejadas"
  - Adicionar status real de cada componente

---

## Someday

Futuro — quando houver ciclo de desenvolvimento disponível.

- [ ] **Seletor de itens da planilha Itens_Reorganizado** `Frontend`
  - Integrar com dados MAFFENG
  - Checkbox na grid para selecionar apenas itens específicos

- [ ] **Instalador Windows (.exe ou setup script)** `Distribuição`
  - Encapsular run.py em executável
  - Incluir Python + Node.js portáveis

- [ ] **Versão do app para outros técnicos da equipe** `Distribuição`
  - Documentação de uso (não-técnico)
  - Treinamento básico

- [ ] **Documentação de usuário final (não-técnico)** `Documentação`
  - Guia de campo — como usar a câmera, organizar pastas
  - FAQ de troubleshooting

---

## Concluídas

✓ Scaffold V2 criado (19/04/2026)  
✓ Backend core funcional (FastAPI + generators)  
✓ Frontend base estável (Next.js + components)  
✓ Orquestrador (run.py) profissional  
✓ Documentação interna refatorada  
✓ Frontend legado removido  
✓ Atribuição de desenvolvedor adicionada  
