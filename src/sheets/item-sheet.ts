import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { ItemSheetApp } from "./components/ItemSheetApp";

export class ItemSheet extends foundry.applications.sheets.ItemSheetV2 {
  static DEFAULT_OPTIONS = {
    classes: ["fvtt-ts-react-boilerplate", "sheet", "item"],
    position: { width: 480, height: 360 }
  };

  #root: Root | null = null;

  override async _renderHTML(
    ...args: Parameters<foundry.applications.sheets.ItemSheetV2["_renderHTML"]>
  ) {
    return args[0];
  }

  override _replaceHTML(
    ...args: Parameters<foundry.applications.sheets.ItemSheetV2["_replaceHTML"]>
  ) {
    const content = args[1];
    if (!this.#root) this.#root = createRoot(content);
    this.#root.render(React.createElement(ItemSheetApp, { item: this.document }));
  }

  override async close(...args: Parameters<foundry.applications.sheets.ItemSheetV2["close"]>) {
    this.#root?.unmount();
    this.#root = null;
    return super.close(...args);
  }
}
