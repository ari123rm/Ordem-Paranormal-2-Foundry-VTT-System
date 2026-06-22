import { CharacterData } from "./data/character-data";
import { ItemData } from "./data/item-data";
import { CharacterSheet } from "./sheets/character-sheet";
import { ItemSheet } from "./sheets/item-sheet";

Hooks.once("init", () => {
  CONFIG.Actor.dataModels.character = CharacterData;
  CONFIG.Item.dataModels.item = ItemData;

  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    Actor,
    "fvtt-ts-react-boilerplate",
    CharacterSheet,
    {
      types: ["character"],
      makeDefault: true
    }
  );
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    Item,
    "fvtt-ts-react-boilerplate",
    ItemSheet,
    {
      types: ["item"],
      makeDefault: true
    }
  );
});
