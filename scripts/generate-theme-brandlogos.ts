/**
 * Generate per-theme NurseNest brandlogo PNGs.
 *
 * Reads the base SVG at `public/branding/nursenest-mark.svg`, recolors the
 * leaf strokes and wordmark fills to each theme's specified color, then
 * exports a 2× PNG to `public/logos/{theme}-brandlogo.png`.
 *
 * Usage:  npx tsx scripts/generate-theme-brandlogos.ts
 */

import sharp from "sharp";
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const BASE_SVG_PATH = resolve(ROOT, "public/branding/nursenest-mark.svg");
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

async function main() {
  if (!existsSync(BASE_SVG_PATH)) {
    console.error(`Base SVG not found: ${BASE_SVG_PATH}`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const baseSvg = readFileSync(BASE_SVG_PATH, "utf-8");

  const entries = Object.entries(THEME_COLORS);
  let ok = 0;
  let fail = 0;

  for (const [theme, color] of entries) {
    const recolored = baseSvg
      .replace(/stroke="#6d28d9"/g, `stroke="${color}"`)
      .replace(/fill="#1e293b"/g, `fill="${color}"`)
      .replace(/fill="#6d28d9"/g, `fill="${color}"`);

    const outPath = resolve(OUT_DIR, `${theme}-brandlogo.png`);

    try {
      await sharp(Buffer.from(recolored))
        .resize(520, 104, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(outPath);
      ok++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  FAIL ${theme}: ${msg}`);
      fail++;
    }
  }

  console.log(`\nGenerated ${ok}/${entries.length} logos in ${OUT_DIR}`);
  if (fail > 0) {
    console.error(`${fail} failures`);
    process.exit(1);
  }
}

main();
