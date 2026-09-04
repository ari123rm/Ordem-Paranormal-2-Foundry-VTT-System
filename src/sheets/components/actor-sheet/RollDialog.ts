import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { RollModalApp } from "./RollModalApp";

export class RollDialog extends foundry.applications.api.ApplicationV2 {
  #root: Root | null = null;
  #resolve: (value: any) => void;
  #dialogData: any;

  constructor(options: any, dialogData: any, resolve: (value: any) => void) {
    super(options);
    this.#dialogData = dialogData;
    this.#resolve = resolve;
  }

  static DEFAULT_OPTIONS = {
    classes: ["fvtt-ts-react-boilerplate", "roll-dialog"],
    window: { title: "Realizar check", resizable: false },
    position: { width: 450, height: "auto" }
  };

  // Método estático utilitário para invocar o dialog como uma Promise
  static async prompt(dialogData: any): Promise<any> {
    return new Promise((resolve) => {
      new RollDialog({}, dialogData, resolve).render(true);
    });
  }

  override async _renderHTML(...args: any[]) { return args[0]; }

  override _replaceHTML(result: any, content: HTMLElement) {
    if (!this.#root) this.#root = createRoot(content);
    
    this.#root.render(
      React.createElement(RollModalApp, {
        ...this.#dialogData,
        onConfirm: (data: any) => {
          this.#resolve(data);
          this.close();
        },
        onCancel: () => {
          this.#resolve(null); // Retorna null se o usuário cancelar
          this.close();
        }
      })
    );
  }

  override async close(options = {}) {
    this.#root?.unmount();
    this.#root = null;
    return super.close(options);
  }
}