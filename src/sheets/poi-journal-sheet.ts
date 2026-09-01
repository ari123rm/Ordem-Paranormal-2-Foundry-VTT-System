import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { PoiJournalApp } from "./components/PoiJournalSheetApp";

export class PoiJournalSheet extends JournalPageSheet {
  #root: Root | null = null;
  #container: HTMLElement | null = null;
  
  // Variável persistente na memória para segurar a posição da tela
  savedScrollTop: number = 0; 

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["fvtt-ts-react-boilerplate", "sheet", "journal-entry-page", "poi"],
      template: "templates/journal/page-text-view.html"
    });
  }

  override getData(options = {}) {
    return super.getData(options);
  }

  override async _renderInner(data: any) {
    return $(`<div class="poi-react-container" style="height: 100%; display: flex; flex-direction: column; overflow-y: hidden;"></div>`);
  }

  override activateListeners(html: JQuery) {
    super.activateListeners(html);
    const container = html.find('.poi-react-container')[0] || html[0];

    if (this.#root && this.#container !== container) {
      this.#root.unmount();
      this.#root = null;
    }

    if (!this.#root) {
      this.#container = container;
      this.#root = createRoot(container);
    }

    // Passamos a "sheetInstance" para o React poder gravar o scroll nela
    this.#root.render(React.createElement(PoiJournalApp, { 
      page: this.document, 
      isEditable: this.isEditable,
      sheetInstance: this 
    }));
  }

  override async close(options: any = {}) {
    this.#root?.unmount();
    this.#root = null;
    return super.close(options);
  }
}