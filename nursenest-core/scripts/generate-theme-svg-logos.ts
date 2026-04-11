/**
 * Generate per-theme NurseNest brandlogo SVGs.
 *
 * 1. Loads DM Sans ExtraBold (the app's heading font at weight 800)
 * 2. Converts "NurseNest" to outlined <path> data via opentype.js
 * 3. Builds a clean SVG template with `CURRENT_COLOR` placeholder
 * 4. For each theme, replaces the placeholder and writes an SVG file
 *
 * SVG structure:
 *   <g id="logo-root">
 *     <g id="leaf-shape">         ← two filled arch shapes
 *       <path id="leaf-outer" />  ← outer arch (theme color)
 *       <path id="leaf-vein" />   ← inner arch cutout (white)
 *     </g>
 *     <path id="wordmark" />      ← outlined "NurseNest" text
 *   </g>
 *
 * Usage:  npx tsx scripts/generate-theme-svg-logos.ts
 */

import opentype from "opentype.js";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const FONT_PATH = "/tmp/fonts/DMSans-ExtraBold.ttf";
const OUT_DIR = resolve(ROOT, "public/logos");

const THEME_COLORS: Record<string, string> = {
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

/**
 * Convert the two stroked arcs into filled compound paths.
 *
 * Original arcs (stroke-width 2.5, round caps):
 *   Outer: M6 40 c0,-11 8.5,-19 19,-19 s19,8 19,19
 *   Inner: M11 40 c0,-7.5 6,-13 14,-13 s14,5.5 14,13
 *
 * Strategy: close each arc with a bottom line segment to form a filled arch,
 * then use the inner arch as a white cutout (like a compound path).
 * This produces a filled leaf/nest shape with a white vein.
 */
function buildLeafPaths(): { outer: string; vein: string } {
  // Outer arch: closed filled shape
  const outer =
    "M6 40 C6 29 14.5 21 25 21 S44 29 44 40 Z";
  // Inner arch: white cutout (vein)
  const vein =
    "M11 40 C11 32.5 17 27 25 27 S39 32.5 39 40 Z";
  return { outer, vein };
}

function buildTemplate(wordmarkPath: string): string {
  const leaf = buildLeafPaths();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 52" role="img" aria-label="NurseNest">
  <title>NurseNest</title>
  <g id="logo-root">
    <g id="leaf-shape">
      <path id="leaf-outer" d="${leaf.outer}" fill="CURRENT_COLOR"/>
      <path id="leaf-vein" d="${leaf.vein}" fill="#FFFFFF"/>
    </g>
    <path id="wordmark" d="${wordmarkPath}" fill="CURRENT_COLOR"/>
  </g>
</svg>`;
}

function generateVariant(template: string, color: string): string {
  return template.replace(/CURRENT_COLOR/g, color);
}

async function main() {
  if (!existsSync(FONT_PATH)) {
    console.error(`Font not found at ${FONT_PATH}`);
    console.error("Download DM Sans ExtraBold first (see generate-theme-brandlogos.ts)");
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const font = opentype.loadSync(FONT_PATH);

  // Convert "NurseNest" to outlined path at x=52 y=35 size=24
  // (matching the original SVG layout: <text x="52" y="35" font-size="24">)
  const textPath = font.getPath("NurseNest", 52, 35, 24);
  const wordmarkD = textPath.toPathData(2);

  const template = buildTemplate(wordmarkD);

  // Write the recolorable template as well
  writeFileSync(resolve(OUT_DIR, "_template-brandlogo.svg"), template, "utf-8");
  console.log("Wrote template: _template-brandlogo.svg");

  const entries = Object.entries(THEME_COLORS);
  let ok = 0;

  for (const [theme, color] of entries) {
    const svg = generateVariant(template, color);
    const outPath = resolve(OUT_DIR, `${theme}-brandlogo.svg`);
    writeFileSync(outPath, svg, "utf-8");
    ok++;
  }

  console.log(`Generated ${ok}/${entries.length} SVG logos in ${OUT_DIR}`);
}

main();
