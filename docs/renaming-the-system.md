# Renaming this template for a new system

If you're forking this boilerplate to start an actual system, every literal occurrence of `fvtt-ts-react-boilerplate` needs to change, plus the `character`/`item` placeholder type names if you're not keeping them. Checklist:

| Location                                                    | What to change                                                                                                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Folder name                                                 | Rename the folder itself (`Data/systems/fvtt-ts-react-boilerplate` → `Data/systems/<your-id>`)                                                    |
| `system.json`                                               | `"id"`, `"title"`, `"description"`, `"authors"`                                                                                                   |
| `package.json`                                              | `"name"`                                                                                                                                          |
| `src/system.ts`                                             | The namespace string passed to `DocumentSheetConfig.registerSheet(..., "fvtt-ts-react-boilerplate", ...)` (two call sites)                        |
| `src/sheets/character-sheet.ts`, `src/sheets/item-sheet.ts` | `DEFAULT_OPTIONS.classes` array — the `"fvtt-ts-react-boilerplate"` CSS class entry                                                               |
| `lang/en.json`, `lang/fr.json`                              | The `BOILERPLATE` root key — pick a namespace that won't collide with other systems/modules (convention: uppercase, short, unique to your system) |
| `LICENSE.txt`                                               | Copyright holder name, if different from the original author                                                                                      |

If you're also renaming the placeholder `character`/`item` subtypes to your own (e.g. `hero`/`weapon`), that's a separate, larger change — follow [docs/adding-content.md](adding-content.md) to add the new subtype(s) first, then remove `character`/`item` (schema file, `DataModelConfig` entry, `documentTypes` entry, sheet, component, registration in `system.ts`) once nothing references them.

After renaming, run `npm run typecheck && npm run lint && npm run build` and reload Foundry — the system should appear under the new id in the system selection list (you may need to restart the Foundry server for it to notice the folder rename).
