import type { CharacterData } from "../data/character-data";
import type { ItemData } from "../data/item-data";
import type { PoiPageData } from "../data/journal-poi-data";

declare module "fvtt-types/configuration" {
  interface DataModelConfig {
    Actor: { character: typeof CharacterData };
    Item: { item: typeof ItemData };
    JournalEntryPage: { poi: typeof PoiPageData };
  }
}