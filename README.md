# Ordem Paranormal 2 (Não Oficial) - Foundry VTT

> **Aviso Legal:** Este é um conteúdo não oficial, publicado sob a Licença da Comunidade de Ordem Paranormal. Contém material gerado por inteligência artificial. Este é um sistema comunitário não oficial para Foundry Virtual Tabletop, criado para acompanhar o desenvolvimento das regras públicas de playtest de Ordem Paranormal 2. O projeto está em estágio inicial. As regras do playtest ainda estão em desenvolvimento e podem mudar antes da versão final do jogo.

## Status

**Release Pública em Desenvolvimento**
O pacote atual foca em modernizar a interface e automatizar as regras fundamentais do playtest utilizando tecnologias web modernas (React + TypeScript).

Instale pelo manifest publicado na última release do GitHub:

```text
https://github.com/ari123rm/Ordem-Paranormal-2-Foundry-VTT-System/releases/latest/download/system.json

```

## Características Atuais do Sistema

* **Agent Sheet (React):** Ficha de personagem moderna utilizando a API `ApplicationV2` do Foundry. Suporte a temas de cores dinâmicos por personagem (refletidos na interface e no chat), gerenciamento de PV, PD, Vida Temporária (TMP) e listagem interativa de Habilidades.
* **Rolagens e Checks:**
* Dialog de rolagem interativo que calcula automaticamente os dados base (Atributo + Perícia) com a opção de testes puros de Atributo.
* Adição de bônus situacionais com dados customizáveis (d4, d6, d8, d10, d12 e d20).
* Trava mecânica de limite: máximo de 4 dados por rolagem, respeitando as regras do playtest.


* **Ponto de Interesse (Journal):** Item do tipo `poi` projetado para Investigações. Permite ao Mestre criar descrições públicas e tabelas de informações ocultas vinculadas a perícias e DTs, separando o contexto do Mestre da visão do Jogador.
* **Habilidades e Itens:** Suporte a habilidades arrastáveis, marcação de favoritos, custos dinâmicos (em PD ou PV) e integração nativa com o editor de texto rico (`prose-mirror`) do Foundry.

## Arquitetura e Desenvolvimento

A implementação segue uma abordagem pragmática focada em reatividade e independência de UI, estruturada em:

* **Foundry V12+ (AppV2):** Transição de Handlebars para React puro nas interfaces principais.
* **Tech Stack:** TypeScript, React, Vite, SCSS Modules e TypeDataModel para dados específicos de *Documents*.

### Requisitos Locais

Requer Node.js (recomendado v24+) e npm.

```bash
# Instala as dependências
npm install

# Inicia o modo de desenvolvimento (watch mode)
npm run dev

# Empacota para distribuição (dist/)
npm run build

```

## Direitos e Atribuição

Este é um projeto comunitário não oficial e não é afiliado, patrocinado ou endossado pelos responsáveis por Ordem Paranormal.
Ordem Paranormal, seus nomes, identidade visual, textos, artes e demais propriedades relacionadas pertencem aos seus respectivos detentores de direitos.
Este repositório não distribui textos, artes, personagens ou outros conteúdos protegidos do jogo além do que seja permitido pela Licença da Comunidade.
