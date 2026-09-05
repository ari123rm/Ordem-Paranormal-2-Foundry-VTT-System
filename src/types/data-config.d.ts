import type { CharacterData } from "../data/character-data";
import type { HabilidadeData, PerfilData, OcupacaoData } from "../data/item-data";
import type { PoiPageData } from "../data/journal-poi-data";

declare module "fvtt-types/configuration" {
  interface DataModelConfig {
    Actor: { character: typeof CharacterData };
    Item: { 
      item: typeof HabilidadeData; // <-- Legado
      habilidade: typeof HabilidadeData;
      perfil: typeof PerfilData;
      ocupacao: typeof OcupacaoData;
    };
    JournalEntryPage: { poi: typeof PoiPageData };
  }
}