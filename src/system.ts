import { CharacterData } from "./data/character-data";
import { HabilidadeData, PerfilData, OcupacaoData } from "./data/item-data";
import { PoiPageData } from "./data/journal-poi-data"; // <-- Faltou importar
import { injectStyles } from "./injectStyles";
import { registerSystemSettings } from "./settings";
import { CharacterSheet } from "./sheets/character-sheet";
import { ItemSheet } from "./sheets/item-sheet";
import { PoiJournalSheet } from "./sheets/poi-journal-sheet"; // <-- Faltou importar

Hooks.once("init", () => {
  registerSystemSettings();
  injectStyles();
  CONFIG.Actor.dataModels.character = CharacterData;
  CONFIG.JournalEntryPage.dataModels.poi = PoiPageData; // <-- Faltou registrar

  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    Actor,
    "fvtt-ts-react-boilerplate",
    CharacterSheet,
    { types: ["character"], makeDefault: true }
  );

  CONFIG.Item.dataModels.habilidade = HabilidadeData;
  CONFIG.Item.dataModels.perfil = PerfilData;
  CONFIG.Item.dataModels.ocupacao = OcupacaoData;
  
  foundry.applications.apps.DocumentSheetConfig.registerSheet(Item, "fvtt-ts-react-boilerplate", ItemSheet, { 
    types: ["habilidade", "perfil", "ocupacao"], 
    makeDefault: true 
  });

  // <-- Faltou registrar a Ficha do Diário

  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    JournalEntryPage,
    "fvtt-ts-react-boilerplate",
    PoiJournalSheet,
    { types: ["poi"], makeDefault: true }
  );
});
Hooks.on("renderChatMessage", (message: any, html: any) => {
  // Leitura segura do nosso tema
  let themeMode = "dark";
  try {
    themeMode = game.settings.get("ordemparanormal-v2", "themeMode") as string;
  } catch (e) {
    themeMode = "dark";
  }

  html.addClass(`op2-theme-${themeMode}`);

  const actorColor = message.actor?.system?.themeColor;
  const userColor = message.author?.color?.css || message.author?.color; 
  const themeColor = actorColor || userColor || "#c52222";
  html.get(0).style.setProperty("--op2-theme", themeColor);

  const isCustomCard = html.find(".op2-chat-card, .op2-item-card").length > 0;
  
  if (isCustomCard) {
    html.css("border", `2px solid ${themeColor}`);
    html.css("border-radius", "6px");
    html.css("overflow", "hidden");
    
    const formulaEl = html.find(".dice-formula");
    if (formulaEl.length > 0) {
      const originalText = formulaEl.text();
      formulaEl.text(originalText.replace(/\[.*?\]/g, ''));
    }
  } else {
    html.addClass("op2-default-message");
  }
});