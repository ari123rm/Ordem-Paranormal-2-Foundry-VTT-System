import { CharacterData } from "./data/character-data";
import { ItemData } from "./data/item-data";
import { PoiPageData } from "./data/journal-poi-data"; // <-- Faltou importar
import { CharacterSheet } from "./sheets/character-sheet";
import { ItemSheet } from "./sheets/item-sheet";
import { PoiJournalSheet } from "./sheets/poi-journal-sheet"; // <-- Faltou importar

Hooks.once("init", () => {
  CONFIG.Actor.dataModels.character = CharacterData;
  CONFIG.Item.dataModels.item = ItemData;
  CONFIG.JournalEntryPage.dataModels.poi = PoiPageData; // <-- Faltou registrar

  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    Actor,
    "fvtt-ts-react-boilerplate",
    CharacterSheet,
    { types: ["character"], makeDefault: true }
  );

  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    Item,
    "fvtt-ts-react-boilerplate",
    ItemSheet,
    { types: ["item"], makeDefault: true }
  );

  // <-- Faltou registrar a Ficha do Diário

  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    JournalEntryPage,
    "fvtt-ts-react-boilerplate",
    PoiJournalSheet,
    { types: ["poi"], makeDefault: true }
  );
});