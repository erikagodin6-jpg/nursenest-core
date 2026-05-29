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

function sageCssBlock(): string {
  const match = CSS.match(/\[data-theme="sage"\]\s*\{([\s\S]*?)\n\}/);
  assert.ok(match, "Sage must have a first-class CSS identity block");
  return match[0];
}

test("Sage is a first-class professional clinical theme", () => {
  const theme = THEME_OPTIONS.find((option) => option.id === "sage");
  assert.ok(theme, "Sage must exist in the theme registry");
  assert.equal(theme.label, "Sage");
  assert.equal(theme.group, "light");
  assert.equal(theme.named, true);
  assert.equal(theme.color, "#5F8F79");
  assert.equal(theme.swatchSecondary, "#7FA79A");
  assert.equal(theme.swatchAccent, "#3D6B5B");
  assert.ok(PUBLIC_MARKETING_THEME_ALLOWLIST.includes("sage"));

  const meta = getClinicalThemeMeta("sage");
  assert.equal(meta?.label, "Sage");
  assert.equal(meta?.mood, "Professional, clinical, calming");
});

test("Sage CSS uses the approved palette and hero accent tokens", () => {
  const block = sageCssBlock();
  for (const token of [
    "--theme-primary: #5F8F79",
    "--theme-secondary: #7FA79A",
    "--theme-accent: #3D6B5B",
    "--theme-page-bg: #F7F8F6",
    "--theme-card-bg: #FFFFFF",
    "--theme-border: #D7DDD9",
    "--theme-heading-text: #22302B",
    "--theme-muted-text: #64716C",
    "--hero-accent-start: #5F8F79",
    "--hero-accent-middle: #7FA79A",
    "--hero-accent-end: #3D6B5B",
    "--hero-accent-solid-fallback: #3D6B5B",
  ]) {
    assert.match(block, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), token);
  }
});

test("Sage core text and controls meet WCAG AA contrast", () => {
  const pairs = [
    ["#22302B", "#F7F8F6", "body text on page background"],
    ["#22302B", "#FFFFFF", "body text on card surface"],
    ["#64716C", "#FFFFFF", "muted text on card surface"],
    ["#061E1A", "#5F8F79", "primary foreground on sage green"],
    ["#FFFFFF", "#3D6B5B", "accent foreground on evergreen"],
    ["#22302B", "#7FA79A", "secondary foreground on eucalyptus"],
  ] as const;

  for (const [foreground, background, label] of pairs) {
    assert.ok(
      contrastRatio(foreground, background) >= 4.5,
      `${label} must be >= 4.5:1, got ${contrastRatio(foreground, background).toFixed(2)}:1`,
    );
  }
});
