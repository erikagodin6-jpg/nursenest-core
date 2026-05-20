/**
 * Writes `public/logos/{themeId}-brandlogo.svg` for every `THEME_OPTIONS` id.
 *
 * Hex per theme: product-spec overrides (leaf + wordmark), else `getThemePaletteTokens(id).logoPrimary`.
 * Leaf vein is always `#FFFFFF`. Template `_template-brandlogo.svg` uses `currentColor` for tintable use.
 *
 * Run from `nursenest-core/`: `npx tsx scripts/generate-theme-brandlogo-svgs.ts`
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getThemePaletteTokens } from "../src/lib/theme/theme-palette-tokens";
import { THEME_OPTIONS } from "../src/lib/theme/theme-registry";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "logos");

/** Exact marketing/product hex map (leaf + wordmark); vein stays white. */
const BRAND_LOGO_HEX_OVERRIDES: Partial<Record<string, string>> = {
  mint: "#111827",
  blush: "#111827",
  slate: "#111827",
  midnight: "#111827",
  ocean: "#111827",
  forest: "#111827",
  "clinical-light": "#111827",
  "dark-clinical": "#FFFFFF",
  "pastel-blush": "#111827",
  "pastel-lavender": "#111827",
  "pastel-mint": "#111827",
  "neutral-sand": "#111827",
  "neutral-slate": "#111827",
  "dark-academia": "#FFFFFF",
  "rose-gold": "#111827",
  coral: "#111827",
  indigo: "#111827",
  teal: "#111827",
  berry: "#111827",
  "pastel-lilac": "#111827",
  "soft-sage": "#111827",
  "dark-mode": "#FFFFFF",
  strawberry: "#111827",
  "multi-pastel": "#111827",
  "deep-twilight": "#FFFFFF",
  "midnight-indigo": "#FFFFFF",
  lavender: "#111827",
  "lavender-dream": "#3E2F5B",
  "blueberry-sherbet": "#1F2A44",
  "strawberry-cream": "#5A2A2A",
  "ocean-mist": "#0F2E3A",
  "mint-breeze": "#1A3A34",
  "rose-quartz": "#4A2230",
  "golden-hour": "#3D2E0A",
  "sage-garden": "#2A3C28",
  "coral-sunset": "#4A1E14",
  "arctic-frost": "#1A2E40",
  "plum-velvet": "#30183A",
  "honey-cream": "#3A2A10",
  "dusty-rose": "#3E1E24",
};

function fillForTheme(themeId: string): string {
  const o = BRAND_LOGO_HEX_OVERRIDES[themeId];
  if (o) return o;
  const p = getThemePaletteTokens(themeId);
  return p?.logoPrimary ?? "#111827";
}

function buildSvg(fill: string, wordmarkD: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 52" role="img" aria-label="NurseNest">
  <title>NurseNest</title>
  <g id="logo-root">
    <g id="leaf-shape">
      <path id="leaf-outer" d="M6 40 C6 29 14.5 21 25 21 S44 29 44 40 Z" fill="${fill}"/>
      <path id="leaf-vein" d="M11 40 C11 32.5 17 27 25 27 S39 32.5 39 40 Z" fill="#FFFFFF"/>
    </g>
    <path id="wordmark" d="${wordmarkD}" fill="${fill}"/>
  </g>
</svg>
`;
}

const TEMPLATE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 52" role="img" aria-label="NurseNest">
  <title>NurseNest</title>
  <g id="logo-root">
    <g id="leaf-shape">
      <path id="leaf-outer" d="M6 40 C6 29 14.5 21 25 21 S44 29 44 40 Z" fill="currentColor"/>
      <path id="leaf-vein" d="M11 40 C11 32.5 17 27 25 27 S39 32.5 39 40 Z" fill="#FFFFFF"/>
    </g>
    <path id="wordmark" d="WORDMARK_PLACEHOLDER" fill="currentColor"/>
  </g>
</svg>
`;

async function main() {
  const samplePath = path.join(OUT_DIR, "mint-brandlogo.svg");
  const sample = await fs.readFile(samplePath, "utf8");
  const wm = sample.match(/id="wordmark" d="([^"]+)"/);
  if (!wm) throw new Error(`Could not read wordmark path from ${samplePath}`);
  const wordmarkD = wm[1];

  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const t of THEME_OPTIONS) {
    const fill = fillForTheme(t.id);
    const body = buildSvg(fill, wordmarkD);
    await fs.writeFile(path.join(OUT_DIR, `${t.id}-brandlogo.svg`), body, "utf8");
  }

  const templateBody = TEMPLATE_SVG.replace("WORDMARK_PLACEHOLDER", wordmarkD);
  await fs.writeFile(path.join(OUT_DIR, "_template-brandlogo.svg"), templateBody, "utf8");

  // eslint-disable-next-line no-console -- generator CLI
  console.log(`Wrote ${THEME_OPTIONS.length} theme SVGs + _template-brandlogo.svg → ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
