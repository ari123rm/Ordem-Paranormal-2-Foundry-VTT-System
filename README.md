# fvtt-ts-react-boilerplate

A TypeScript + React + Vite boilerplate for building Foundry VTT (V14) game systems on top of **ApplicationV2**, with full type safety via [`fvtt-types`](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

This is a starting point, not a ruleset: one `character` Actor type and one `item` Item type, each with a React-rendered sheet, just enough to prove the pipeline end-to-end (build → load in Foundry → render → write back to the document).

## Prerequisites

- Node.js 22+
- Foundry VTT V14
- This repo cloned/copied directly into your Foundry `Data/systems/<your-system-id>` folder (development is done live in place — there's no separate dev server)

## Quickstart

```sh
npm install
npm run dev      # vite build --watch — rebuilds dist/ on every save
```

Then in Foundry: enable the system for a world (or create one), reload the world after each rebuild to see changes (`F5` in the Foundry window — AppV2/React state isn't hot-reloaded, only full document/sheet remounts pick up new JS).

## Scripts

| Script                 | What it does                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Vite build in watch mode                                                                             |
| `npm run build`        | One-shot production build to `dist/`                                                                 |
| `npm run typecheck`    | `tsc --noEmit`                                                                                       |
| `npm run lint`         | ESLint over the repo                                                                                 |
| `npm run lint:fix`     | ESLint with autofix                                                                                  |
| `npm run format`       | Prettier write                                                                                       |
| `npm run format:check` | Prettier check (used in CI)                                                                          |
| `npm run test`         | Vitest (pure-logic unit tests only — see [docs/testing-and-linting.md](docs/testing-and-linting.md)) |

## Project structure

```
system.json              Foundry manifest — documentTypes, esmodules, languages
LICENSE.txt
lang/en.json, fr.json    i18n strings, BOILERPLATE.* namespace
src/
  system.ts              Entry point — registers DataModels + sheets on "init"
  i18n.ts                 localize() helper
  data/
    character-data.ts     CharacterData DataModel (schema for Actor type "character")
    item-data.ts           ItemData DataModel (schema for Item type "item")
  sheets/
    character-sheet.ts     ActorSheetV2 subclass, mounts React
    item-sheet.ts           ItemSheetV2 subclass, mounts React
    components/
      CharacterSheetApp.tsx        React sheet UI
      CharacterSheetApp.logic.ts   pure helpers (unit-tested)
      CharacterSheetApp.module.scss
      ItemSheetApp.tsx
      ItemSheetApp.module.scss
  types/
    data-config.d.ts       DataModelConfig augmentation (types actor.system/item.system)
    foundry.d.ts            *.module.scss ambient module declaration
dist/                     build output (gitignored) — esmodules/styles in system.json point here
```

## Documentation

- [docs/architecture.md](docs/architecture.md) — how `documentTypes`, `DataModel`, AppV2, React mounting, and `fvtt-types` fit together
- [docs/adding-content.md](docs/adding-content.md) — step-by-step: add a new Actor/Item subtype
- [docs/styling.md](docs/styling.md) — SCSS module conventions
- [docs/localization.md](docs/localization.md) — `lang/*.json` + `game.i18n` usage
- [docs/testing-and-linting.md](docs/testing-and-linting.md) — what's tested, what isn't, and why
- [docs/renaming-the-system.md](docs/renaming-the-system.md) — checklist for forking this template under a new name

## License

MIT — see [LICENSE.txt](LICENSE.txt).
