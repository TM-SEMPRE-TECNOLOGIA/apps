---
name: organizar-relatorio
description: >
  Organiza automaticamente a formatação XML de relatórios fotográficos (.docx) gerados pelo AutoRelatório 3.2.
  Use SEMPRE que o usuário mencionar: "organizar relatório", "formatar relatório", "arrumar relatório", "corrigir relatório docx",
  "organizar o docx", "formatar o docx gerado", "relatório desorganizado", "imagens juntas", "sem quebra de página",
  "AutoRelatório gerou errado", "arrumar formatação", "organizar parágrafos do relatório", "quebras de página faltando",
  "imagens sem separação", ou qualquer variação indicando que o DOCX precisa ser reestruturado para o padrão correto.
  Este skill aplica 5 correções estruturais no XML do Word sem depender de bibliotecas pesadas:
  (1) alinhamento de subtítulos → both, (2) inserção de separadores entre imagens adjacentes,
  (3) alinhamento de parágrafos vazios próximos a imagens → center,
  (4) alinhamento de vazios após títulos principais → center,
  (5) remoção e reinserção de quebras de página (1 por par de imagens).
---

# Skill: Organizar Relatório Fotográfico

Você é um especialista em estruturação de documentos Word para relatórios fotográficos de vistoria preventiva
(contratos Banco do Brasil / Caixa Econômica Federal), gerados pelo AutoRelatório 3.2.

O AutoRelatório gera o DOCX com a estrutura correta de **conteúdo** mas com formatação **desordenada**:
imagens adjacentes sem separadores, alinhamentos errados, quebras de página ausentes.
Este skill corrige esses problemas de forma autônoma e determinística via manipulação XML direta.

---

## Fluxo de trabalho

```
1. Identificar o arquivo DOCX de entrada (gerado pelo AutoRelatório)
2. Ler references/regras-formatacao.md para relembrar as 9 regras
3. Rodar scripts/organizar_docx.py no arquivo
4. Validar o resultado com scripts/validar_docx.py
5. Salvar o arquivo corrigido em TM-MEUS-APPS/ e fornecer link computer://
```

---

## Regras invioláveis

1. **Nunca use python-docx** — manipulação direta via `zipfile` + `xml.etree.ElementTree`.
2. **Nunca sobrescreva o arquivo original** — sempre salvar com sufixo `_organizado.docx`.
3. **Preservar todo o conteúdo** — apenas formatação é alterada, nunca texto ou imagens.
4. **Subtítulos** identificados por texto iniciando com `- Vista ampla`, `- Detalhes`, `- Croqui`, `- Vista geral` → `jc = both`.
5. **Separadores** entre imagens adjacentes = parágrafo vazio com `jc = center`.
6. **Quebras de página**: 1 por par de imagens (a cada 2 imagens), inserida no parágrafo separador entre elas.
7. **Buffer após PB**: o parágrafo imediatamente após cada quebra de página deve ter `jc = center` e estar vazio.
8. **Padrão alvo por intervalo** entre quebras: `PB → E(center) → IMG → E(center) → IMG → PB`.
9. **Arquivo de saída** sempre em `C:\Users\thiag\Desktop\TM-MEUS-APPS\`.

---

## Como executar

```bash
# Executar a correção
python scripts/organizar_docx.py \
  --input "/caminho/para/relatorio_gerado.docx" \
  --output "C:/Users/thiag/Desktop/TM-MEUS-APPS/relatorio_organizado.docx"

# Validar o resultado
python scripts/validar_docx.py \
  --file "C:/Users/thiag/Desktop/TM-MEUS-APPS/relatorio_organizado.docx"
```

Após rodar, leia a saída de `validar_docx.py` e confirme:
- `adj_img_pairs: 0` (nenhum par de imagens adjacentes)
- `page_breaks == ceil(total_images / 2)` (1 PB por 2 imagens)
- `subtitulos_both: N` onde N > 0

---

## Referências

- `references/regras-formatacao.md` — Descrição detalhada das 9 regras com exemplos XML
- `scripts/organizar_docx.py` — Script de correção principal
- `scripts/validar_docx.py` — Script de validação pós-correção
