import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { CharacterSheetApp } from "./components/CharacterSheetApp";

export class CharacterSheet extends foundry.applications.sheets.ActorSheetV2 {
  static DEFAULT_OPTIONS = {
    classes: ["fvtt-ts-react-boilerplate", "sheet", "actor"],
    // O Foundry V12 (AppV2) usa esse bloco para definir o tamanho inicial
    window: {
      resizable: true, // Garante que o jogador pode arrastar as bordas
    },
    position: { 
      width: 950, 
      height: 750 
    }
  };

  #root: Root | null = null;

  override async _renderHTML(
    ...args: Parameters<foundry.applications.sheets.ActorSheetV2["_renderHTML"]>
  ) {
    return args[0];
  }

  override _replaceHTML(
    ...args: Parameters<foundry.applications.sheets.ActorSheetV2["_replaceHTML"]>
  ) {
    const content = args[1];
    if (!this.#root) this.#root = createRoot(content);
    this.#root.render(React.createElement(CharacterSheetApp, { actor: this.document }));
  }

  override async close(...args: Parameters<foundry.applications.sheets.ActorSheetV2["close"]>) {
    this.#root?.unmount();
    this.#root = null;
    return super.close(...args);
  }
}
