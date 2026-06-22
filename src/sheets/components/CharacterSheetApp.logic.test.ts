import { describe, expect, it } from "vitest";
import { fmtMod, modifier } from "./CharacterSheetApp.logic";

describe("modifier", () => {
  it("matches the d20-style table around the 10 baseline", () => {
    expect(modifier(10)).toBe(0);
    expect(modifier(11)).toBe(0);
    expect(modifier(12)).toBe(1);
    expect(modifier(9)).toBe(-1);
    expect(modifier(20)).toBe(5);
  });
});

describe("fmtMod", () => {
  it("prefixes non-negative values with +", () => {
    expect(fmtMod(0)).toBe("+0");
    expect(fmtMod(3)).toBe("+3");
  });

  it("leaves negative values as-is", () => {
    expect(fmtMod(-2)).toBe("-2");
  });
});
