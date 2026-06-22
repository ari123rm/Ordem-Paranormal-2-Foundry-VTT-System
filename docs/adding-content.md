# Adding a new Actor or Item subtype

Worked example: adding an Actor subtype called `npc` alongside the existing `character`. The same steps apply to a new Item subtype.

## 1. Schema — `src/data/npc-data.ts`

```ts
function defineSchema() {
  const fields = foundry.data.fields;
  return {
    threatLevel: new fields.NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 1
    })
  };
}

export class NpcData extends foundry.abstract.TypeDataModel<
  ReturnType<typeof defineSchema>,
  Actor.Implementation
> {
  static defineSchema = defineSchema;
}
```

See [docs/architecture.md](architecture.md#datamodel-classes) for why `defineSchema` is a standalone function rather than an inline class method, and why `nullable: false` matters.

## 2. Type it — `src/types/data-config.d.ts`

```ts
import type { NpcData } from "../data/npc-data";

declare module "fvtt-types/configuration" {
  interface DataModelConfig {
    Actor: { character: typeof CharacterData; npc: typeof NpcData };
    // ...
  }
}
```

## 3. Declare it — `system.json`

```json
"documentTypes": {
  "Actor": { "character": {}, "npc": {} }
}
```

## 4. Sheet — `src/sheets/npc-sheet.ts`

Copy `character-sheet.ts` verbatim, rename the class, point it at a new React component. The `_renderHTML`/`_replaceHTML`/`close` lifecycle is identical for every AppV2 sheet in this boilerplate.

## 5. React component — `src/sheets/components/NpcSheetApp.tsx`

Copy the shape of `CharacterSheetApp.tsx`: accept the typed document as a prop, read `actor.system.*`, write via `actor.update({ system: { ... } })` (nested object — see the architecture doc's gotcha), localize labels via `localize()` from `src/i18n.ts`.

## 6. Register — `src/system.ts`

```ts
CONFIG.Actor.dataModels.npc = NpcData;

foundry.applications.apps.DocumentSheetConfig.registerSheet(
  Actor,
  "fvtt-ts-react-boilerplate",
  NpcSheet,
  {
    types: ["npc"],
    makeDefault: true
  }
);
```

## 7. i18n

Add `BOILERPLATE.Npc.*` keys to `lang/en.json` and `lang/fr.json` — see [docs/localization.md](localization.md).

## Verify

`npm run typecheck && npm run build`, then in Foundry create an Actor and pick the new subtype from the type dropdown.
