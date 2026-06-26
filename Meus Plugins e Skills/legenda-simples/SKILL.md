---
name: legenda-simples
description: >
  Skill dedicada a numerar fotos em relatórios de forma simples ("Foto N"), sem negrito
  e sem descrições automáticas. Ignora imagens de cabeçalho, iniciando a contagem apenas
  após o termo "Dados da Dependência".
---

# Skill: Legenda Simples

Processa relatórios fotográficos `.docx` inserindo a legenda no formato simples `Foto N`
abaixo de cada imagem encontrada.

Esta skill resolve necessidades de formatação que diferem do padrão SP2:
1. **Sem Negrito**: As legendas são inseridas em fonte normal.
2. **Sem preenchimento de descrições**: A skill não preenche descrições e não adiciona travessão (–).
3. **Pula o cabeçalho**: Ignora automaticamente as imagens contidas no início do relatório,
   começando a contagem apenas após identificar o texto "Dados da Dependência".
4. **Precisão nas colunas**: Localiza e legenda corretamente múltiplas imagens que estejam no
   mesmo parágrafo, não pulando fotos lado a lado.

## Quando usar
Sempre que o usuário pedir: "legenda simples", "apenas Foto 1 em diante", "não quero o modelo sp2",
"sem negrito", "ignorar imagens de cabeçalho" etc.

## Passos de execução

### 1. Copiar o arquivo
Copie o documento .docx de entrada para uma localização temporária ou pasta de saída
com um nome novo, ex: `..._SIMPLES.docx`.

### 2. Rodar o script
Execute o script em Python forçando a codificação UTF-8 para evitar problemas:
```powershell
$env:PYTHONIOENCODING="utf-8"
python "<skill_dir>\scripts\inserir_legendas.py" "<input.docx>" "<output.docx>"
```

*Não execute nenhuma rotina de preenchimento de descrições para este modelo.*
