import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { relativeLuminanceFromHex } from "@/lib/color/hex-luminance";
import { PUBLIC_MARKETING_THEME_ALLOWLIST, THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { getClinicalThemeMeta } from "@/lib/ui/themes/clinical-theme-tokens";

const HERE = dirname(fileURLToPath(import.meta.url));
const PALETTES_PATH = join(HERE, "../../app/theme-palettes.css");
const CSS = readFileSync(PALETTES_PATH, "utf-8");

function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminanceFromHex(foreground);
  const b = relativeLuminanceFromHex(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function alpineCssBlock(): string {
  const match = CSS.match(/\[data-theme="alpine"\]\s*\{([\s\S]*?)\n\}/);
  assert.ok(match, "Alpine must have a first-class CSS identity block");
  return match[0];
}

test("Alpine is a first-class modern technical theme", () => {
  const theme = THEME_OPTIONS.find((option) => option.id === "alpine");
  assert.ok(theme, "Alpine must exist in the theme registry");
  assert.equal(theme.label, "Alpine");
  assert.equal(theme.group, "light");
  assert.equal(theme.named, true);
  assert.equal(theme.color, "#2F5E87");
  assert.equal(theme.swatchSecondary, "#5F86A8");
  assert.equal(theme.swatchAccent, "#9CC3E8");
  assert.ok(PUBLIC_MARKETING_THEME_ALLOWLIST.includes("alpine"));

  const meta = getClinicalThemeMeta("alpine");
  assert.equal(meta?.label, "Alpine");
  assert.equal(meta?.mood, "Modern, intelligent, clean");
});

test("Alpine CSS uses the approved palette and hero accent tokens", () => {
  const block = alpineCssBlock();
  for (const token of [
    "--theme-primary: #2F5E87",
    "--theme-secondary: #5F86A8",
    "--theme-accent: #9CC3E8",
    "--theme-page-bg: #F7F9FB",
    "--theme-card-bg: #FFFFFF",
    "--theme-border: #D8E1EA",
    "--theme-heading-text: #1F2933",
    "--theme-muted-text: #61707E",
    "--hero-accent-start: #2F5E87",
    "--hero-accent-middle: #5F86A8",
    "--hero-accent-end: #9CC3E8",
    "--hero-accent-solid-fallback: #2F5E87",
  ]) {
    assert.match(block, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), token);
  }
});

test("Alpine core text and controls meet WCAG AA contrast", () => {
  const pairs = [
    ["#1F2933", "#F7F9FB", "body text on page background"],
    ["#1F2933", "#FFFFFF", "body text on card surface"],
    ["#61707E", "#FFFFFF", "muted text on card surface"],
    ["#FFFFFF", "#2F5E87", "primary foreground on alpine blue"],
    ["#111820", "#5F86A8", "secondary foreground on steel blue"],
    ["#1F2933", "#9CC3E8", "accent foreground on ice blue"],
  ] as const;

  for (const [foreground, background, label] of pairs) {
    assert.ok(
      contrastRatio(foreground, background) >= 4.5,
      `${label} must be >= 4.5:1, got ${contrastRatio(foreground, background).toFixed(2)}:1`,
    );
  }
});
