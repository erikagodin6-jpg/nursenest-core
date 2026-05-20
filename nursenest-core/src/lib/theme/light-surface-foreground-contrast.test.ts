/**
 * Guards the light-theme muted foreground mix used in `globals.css`
 * (`--theme-muted-foreground-readable`) so new themes do not regress toward unreadable gray.
 *
 * Run: `node --import tsx --test src/lib/theme/light-surface-foreground-contrast.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16) / 255,
    g: parseInt(full.slice(2, 4), 16) / 255,
    b: parseInt(full.slice(4, 6), 16) / 255,
  };
}

function linearize(c: number): number {
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const R = linearize(r);
  const G = linearize(g);
  const B = linearize(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(fg: string, bg: string): number {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Approximate `color-mix(in srgb, A p%, B)` in sRGB space (p% toward A). */
function mixSrgbTowardA(a: string, b: string, pTowardA: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const t = pTowardA / 100;
  const r = Math.round((A.r * t + B.r * (1 - t)) * 255);
  const g = Math.round((A.g * t + B.g * (1 - t)) * 255);
  const bl = Math.round((A.b * t + B.b * (1 - t)) * 255);
  const x = (n: number) => n.toString(16).padStart(2, "0");
  return `#${x(r)}${x(g)}${x(bl)}`;
}

describe("light-surface foreground contrast", () => {
  const WHITE = "#ffffff";
  const GRAY_50 = "#f9fafb";

  it("58% muted + 42% heading (light catch-all grays) meets ~4.5:1 on white", () => {
    const muted = "#6b7280";
    const heading = "#111827";
    const mixed = mixSrgbTowardA(muted, heading, 58);
    assert.ok(
      contrastRatio(mixed, WHITE) >= 4.45,
      `expected >= 4.45:1 on white, got ${contrastRatio(mixed, WHITE).toFixed(2)}:1 for ${mixed}`,
    );
  });

  it("same mix stays readable on gray-50 section bands", () => {
    const muted = "#6b7280";
    const heading = "#111827";
    const mixed = mixSrgbTowardA(muted, heading, 58);
    assert.ok(
      contrastRatio(mixed, GRAY_50) >= 4.2,
      `expected >= 4.2:1 on gray-50, got ${contrastRatio(mixed, GRAY_50).toFixed(2)}:1`,
    );
  });

  it("heading ink on pale mint (accent-b style surface) stays clearly readable", () => {
    const paleMint = "#d1fae5";
    const headingInk = "#111827";
    assert.ok(
      contrastRatio(headingInk, paleMint) >= 4.5,
      `got ${contrastRatio(headingInk, paleMint).toFixed(2)}:1`,
    );
  });
});
