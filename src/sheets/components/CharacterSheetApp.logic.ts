// Pure game-logic helpers, deliberately kept free of any Foundry global.
// Code that touches `actor`/`ChatMessage`/etc. needs a running Foundry instance
// and isn't realistically unit-testable — this is the boundary to keep that out.
export const modifier = (score: number) => Math.floor((score - 10) / 2);

export const fmtMod = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);
