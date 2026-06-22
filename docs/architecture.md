# Architecture

## Why no `template.json`

Pre-V11 Foundry systems describe Actor/Item data shapes in `template.json`. This boilerplate uses the V11+ alternative instead: `system.json`'s `documentTypes` field declares which subtypes exist, and a `DataModel` class (registered at runtime) defines the actual schema. Two sources of truth (template.json + ad-hoc JS) collapses into one (the `DataModel` class), and you get real validation/casting for free.

```json
// system.json
"documentTypes": {
  "Actor": { "character": {} },
  "Item": { "item": {} }
}
```

```ts
// src/system.ts
Hooks.once("init", () => {
  CONFIG.Actor.dataModels.character = CharacterData;
  CONFIG.Item.dataModels.item = ItemData;
});
```

## DataModel classes

`src/data/character-data.ts`:

```ts
function defineSchema() {
  const fields = foundry.data.fields;
  return {
    biography: new fields.HTMLField({ initial: "" }),
    attributes: new fields.SchemaField({
      strength: new fields.NumberField({
        required: true,
        nullable: false,
        integer: true,
        initial: 10
      })
      // ...
    })
  };
}

export class CharacterData extends foundry.abstract.TypeDataModel<
  ReturnType<typeof defineSchema>,
  Actor.Implementation
> {
  static defineSchema = defineSchema;
}
```

The `defineSchema` function is declared standalone, then assigned as a static — not written inline as a class method. This is required so `ReturnType<typeof defineSchema>` can be used as the `TypeDataModel` generic's `Schema` argument; a class can't reference its own static method's return type in its own `extends` clause.

**`nullable: false` matters.** Without it, `NumberField`'s inferred type is `number | null` (Foundry fields are nullable by default), which then leaks into every place that reads `attrs.strength` as if it could be `null`. Set it explicitly wherever you don't actually want `null` to be a valid value.

## fvtt-types + DataModelConfig

[`fvtt-types`](https://github.com/League-of-Foundry-Developers/foundry-vtt-types) (installed as the `fvtt-types` npm package) supplies ambient types for `Hooks`, `CONFIG`, `game`, `foundry.*`, `Actor`, `Item`, etc. Wired in via `tsconfig.json`:

```json
{ "compilerOptions": { "types": ["fvtt-types"] } }
```

By default, `actor.system` is untyped without telling the types package which `DataModel` class backs each subtype. `src/types/data-config.d.ts` does that via module augmentation:

```ts
declare module "fvtt-types/configuration" {
  interface DataModelConfig {
    Actor: { character: typeof CharacterData };
    Item: { item: typeof ItemData };
  }
}
```

After this, `actor.system.attributes.strength` resolves to `number`, not `any`.

**Gotcha**: with real types in place, `actor.update({ "system.attributes.strength": 5 })` (dotted-path key) no longer type-checks — `update()`'s type wants a nested object. Foundry's runtime supports both forms (it expands dotted paths internally), but only the nested form satisfies the types:

```ts
actor.update({ system: { attributes: { strength: 5 } } });
```

**Version mismatch risk**: `fvtt-types`'s published versions track Foundry V13 builds (no V14-specific release exists at the time this was written). The AppV2/DataModel surface is stable since V13 so this mostly just works, but if you hit a type error that looks wrong for an API you know exists in V14, it may be a types-package gap rather than a real bug — check `tsc` output carefully before assuming the type is right.

## AppV2 sheets with React (no Handlebars)

`src/sheets/character-sheet.ts` extends `ActorSheetV2` directly — no `HandlebarsApplicationMixin`. Three lifecycle methods matter:

```ts
export class CharacterSheet extends foundry.applications.sheets.ActorSheetV2 {
  #root: Root | null = null;

  override async _renderHTML(...args) {
    return args[0]; // pass-through: no HTML string/template needed
  }

  override _replaceHTML(...args) {
    const content = args[1]; // the sheet's content HTMLElement
    if (!this.#root) this.#root = createRoot(content);
    this.#root.render(React.createElement(CharacterSheetApp, { actor: this.document }));
  }

  override async close(...args) {
    this.#root?.unmount();
    this.#root = null;
    return super.close(...args);
  }
}
```

- `_renderHTML` would normally render a Handlebars template to a string; here it's a no-op pass-through since React owns the DOM.
- `_replaceHTML` is where the React root gets created (once) and (re-)rendered on every Foundry-triggered re-render (e.g. after `actor.update()`, on any client watching the same actor). React reconciles internally — no manual diffing needed on our side.
- `close()` must unmount the React root, or you leak it (and React will warn about it).

Method signatures use `Parameters<foundry.applications.sheets.ActorSheetV2["_renderHTML"]>` rather than hand-typed parameters — this way if the base class signature changes in a newer `fvtt-types` release, `tsc` will flag the mismatch instead of silently drifting.

## Build (Vite)

`vite.config.ts` builds `src/system.ts` in **library mode** to a single ESM file (`dist/system.mjs`) — Foundry loads this directly as an `esmodule`, it can't resolve `node_modules` imports at runtime, so React/ReactDOM are bundled in, not externalized.

Two non-obvious settings:

- `define: { "process.env.NODE_ENV": JSON.stringify("production") }` — Vite's lib mode doesn't auto-replace `process.env.NODE_ENV` the way app mode does. Without this, React throws `Uncaught ReferenceError: process is not defined` at runtime in Foundry (there's no Node `process` global in a browser). Setting it also lets Rollup dead-code-eliminate React's dev-only warning paths, shrinking the bundle.
- `css.preprocessorOptions.scss.api: "modern-compiler"` — silences a Sass legacy-JS-API deprecation warning on build; functionally inert otherwise.

CSS Modules (`*.module.scss`) are handled by Vite natively — `sass` is a dev dependency for SCSS compilation, no extra plugin needed.
