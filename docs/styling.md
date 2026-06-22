# Styling

Each sheet component has its own SCSS module, colocated and named after the component: `CharacterSheetApp.tsx` ↔ `CharacterSheetApp.module.scss`.

```tsx
import styles from "./CharacterSheetApp.module.scss";

<div className={styles.sheet}> ... </div>;
```

Vite compiles `*.module.scss` to locally-scoped, hashed class names automatically — no global CSS collisions between sheets, no need for a `newsystem`-prefixed BEM-style convention like older Foundry systems use.

Nest sub-element styles under their parent class using Sass nesting, e.g. in `CharacterSheetApp.module.scss`:

```scss
.attributeLabel {
  display: flex;
  flex-direction: column;

  .modifier {
    font-weight: bold;
  }
}
```

All compiled CSS (across every component) gets concatenated by Vite into the single `dist/style.css` that `system.json`'s `styles` array points at — you don't need to import each module's CSS manually anywhere except inside the component that uses it (Vite's CSS-in-JS-import handles collection).

There's no global stylesheet in this boilerplate by design — if you need truly global rules (e.g. a CSS variable reset), add a plain (non-module) `.scss` file and import it once from `src/system.ts`.
