# Entendendo do Fluxo do TM Relatórios SP

## 1. O Bug do "Detalhes"
A lógica atual do backend (`generator_sp.py`) espera a seguinte estrutura para os detalhes:

```text
📂 [Ambiente]
 ┣ 📂 [Serviço] (ex: 1.1 - Pintura)
 ┃ ┣ 📷 1 - 3,30 x 3,20.jpg
 ┃ ┗ 📂 Detalhes
 ┃   ┗ 📂 Detalhes 1
 ┃     ┣ 📷 img1.jpg
 ┃     ┗ 📷 img2.jpg
```

**Por que a sua pasta falha?**
Na pasta que você enviou (`ESTILO CASTEJON`), a estrutura está assim:
```text
📂 1 - Entrada
 ┗ 📂 1.1 - Pintura acrílica
   ┣ 📷 1 - 3,30 x 3,20.jpg
   ┗ 📂 - Detalhes 1
     ┣ 📷 img1.jpg
     ┗ 📷 img2.jpg
```

Hoje o código tenta fazer isso:
1. Encontra a foto `1 - ...jpg` (num = 1).
2. Vê que existe uma pasta chamada `- Detalhes 1` dentro de `1.1 - Pintura acrílica`.
3. Ele "acha" que essa pasta `- Detalhes 1` é a **pasta pai** de todas as fotos de detalhes.
4. Ele tenta listar as pastas **dentro** de `- Detalhes 1` procurando por subpastas chamadas "detalhes", mas só encontra as imagens, então ele ignora.

Ele espera encontrar uma pasta chamada `Detalhes` e dentro dela uma pasta `Detalhes 1`. Quando estão tudo no mesmo nível, ele "se perde".

## 2. O Bug da "Fachada"
A fachada fica "solta" na raiz da pasta principal. O backend **lê** essa foto na geração do conteúdo (a API `/api/scan` devolve ela como a primeira foto do relatório com uma quebra de página logo após). 

O problema deve estar no **Frontend** (Next.js). Provavelmente, quando o frontend gera a visualização em tela, ele tenta jogar as fotos para dentro de "Títulos/Pastas". Como a Fachada está na raiz e **não tem título atribuído**, o frontend pode estar ignorando-a silenciosamente no preview. Se ela é removida do preview, quando você gera o relatório final, ela já foi removida da requisição.
