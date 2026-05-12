# TM Design System 🎨

Este sistema de design foi criado para padronizar os registros de desenvolvimento (changelogs) dos aplicativos **TM - Sempre Tecnologia**.

## Estrutura da Pasta

- `/css/tm-timeline.css`: O motor visual da timeline horizontal (layout, cards, animações)
- `/themes/`: Variáveis de cores para diferentes identidades visuais
- `/templates/`: Esqueleto HTML pronto para uso rápido

## Como usar em um novo projeto

1. **Copie** o conteúdo de `/templates/commit-template.html` para seu novo arquivo `commit.html`.
2. **Escolha um tema** em `/themes/` e cole as variáveis CSS dentro do bloco `<style>` do seu arquivo.
3. **Adicione seus conteúdos** nos blocos de `timeline-node` e `detail-card`.

> [!TIP]
> Os arquivos finais gerados são **standalone**. Embora o Design System exista aqui para referência, o CSS é embutido no HTML final para garantir portabilidade total.

---
Desenvolvido por **Thiago Nascimento Barbosa** | **TM - Sempre Tecnologia**
