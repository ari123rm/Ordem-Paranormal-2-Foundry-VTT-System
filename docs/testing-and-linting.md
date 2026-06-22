# Testing and linting

## What's tested, and why so little

`npm run test` (Vitest) only covers **pure game-logic functions** — currently `modifier`/`fmtMod` in `src/sheets/components/CharacterSheetApp.logic.ts`, exercised by `CharacterSheetApp.logic.test.ts`.

Anything that touches `actor`, `ChatMessage`, `game`, `Hooks`, or any other Foundry global needs a running Foundry server with a world loaded — there's no practical way to unit-test `actor.update(...)` or `ChatMessage.create(...)` calls in isolation, and mocking the entire Foundry runtime isn't worth the upkeep for a boilerplate.

**The pattern going forward**: when a component's logic is more than "read a prop, write an update," extract the part that's pure computation (no Foundry globals, no React) into a sibling `*.logic.ts` file, and unit-test _that_. The component itself stays thin glue between Foundry documents and the pure logic, and isn't tested directly.

## Linting

ESLint flat config (`eslint.config.js`): `typescript-eslint` recommended rules + `eslint-plugin-react` (JSX rules, `react-in-jsx-scope` and `prop-types` turned off — not relevant with the modern JSX transform + TypeScript prop typing) + `eslint-config-prettier` (turns off any ESLint formatting rules that would conflict with Prettier).

```sh
npm run lint       # check
npm run lint:fix   # autofix
```

## Formatting

Prettier (`.prettierrc`): double quotes, semicolons, 2-space indent, no trailing commas, 100-char print width — matches the style already used throughout `src/`.

```sh
npm run format        # write
npm run format:check  # check only (used in CI)
```

## CI

`.github/workflows/ci.yml` runs on every push/PR to `main`: `npm ci` → typecheck → lint → format:check → test → build. This only actually executes once the repo has a GitHub remote with Actions enabled — if you've forked this template, push to your own remote and it'll pick up from there.
