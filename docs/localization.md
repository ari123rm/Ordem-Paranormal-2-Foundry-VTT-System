# Localization

`system.json` registers two languages:

```json
"languages": [
  { "lang": "en", "name": "English", "path": "lang/en.json", "flags": {} },
  { "lang": "fr", "name": "Français", "path": "lang/fr.json", "flags": {} }
]
```

All keys live under a single `BOILERPLATE` root namespace to avoid colliding with Foundry core or other systems/modules:

```json
{
  "BOILERPLATE": {
    "Attributes": { "strength": "Strength", "agility": "Agility", "spirit": "Spirit" },
    "Sheet": { "Biography": "Biography", "SendToChat": "Send to chat", "...": "..." },
    "Item": { "Quantity": "Quantity", "Description": "Description" }
  }
}
```

In React components, use the `localize()` helper from `src/i18n.ts` rather than calling `game.i18n.localize()` directly:

```ts
export const localize = (key: string) => game.i18n!.localize(key);
```

```tsx
import { localize } from "../../i18n";

<label>{localize("BOILERPLATE.Sheet.Biography")}</label>;
```

**Why the helper instead of inline `game.i18n.localize()`**: `fvtt-types` types `game` (and `game.i18n`) as possibly `undefined`, since `game` genuinely isn't populated until Foundry's `"ready"` hook fires. Sheets only ever render after that point, so a single non-null assertion in one shared helper is safe and keeps every call site from repeating `game.i18n!.localize(...)`.

When adding a new string: add the key to **both** `lang/en.json` and `lang/fr.json`. Foundry does not fall back to English for a missing key in the active non-English language — `localize()` just returns the raw key string (e.g. `"BOILERPLATE.Sheet.Foo"`) if it's missing from the active language file.
