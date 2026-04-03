/**
 * Regenerates `public/branding/theme-logos/{themeId}brandlogo_transparent.png` for every entry in
 * `THEME_OPTIONS` (`src/lib/theme/theme-registry.ts`), using each theme’s exact `color` hex for
 * wordmark + leaf (luminance-preserving multiply on the base raster).
 *
 * Run from `nursenest-core/`: `npx tsx scripts/generate-theme-logos-from-registry.ts`
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { THEME_OPTIONS } from "../src/lib/theme/theme-registry";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "branding", "theme-logos");

/** Base raster: existing lavender transparent logo (same art as CDN lavender mark). */
const BASE_REL = path.join(OUT_DIR, "lavenderbrandlogo_transparent.png");

function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.trim().replace(/^#/, "");
  if (h.length !== 6) throw new Error(`Invalid hex: ${hex}`);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function recolorBuffer(
  data: Buffer,
  width: number,
  height: number,
  tr: number,
  tg: number,
  tb: number,
): Buffer {
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const a = out[i + 3];
    if (a === 0) continue;
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    out[i] = Math.min(255, Math.round((tr * L) / 255));
    out[i + 1] = Math.min(255, Math.round((tg * L) / 255));
    out[i + 2] = Math.min(255, Math.round((tb * L) / 255));
  }
  return out;
}

async function main() {
  const baseBuf = await fs.readFile(BASE_REL);
  const baseImage = sharp(baseBuf).ensureAlpha();
  const { data, info } = await baseImage.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const baseCopy = Buffer.from(data);

  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const opt of THEME_OPTIONS) {
    const { r: tr, g: tg, b: tb } = parseHex(opt.color);
    const raw = recolorBuffer(Buffer.from(baseCopy), width, height, tr, tg, tb);
    const png = await sharp(raw, {
      raw: { width, height, channels: 4 },
    })
      .png()
      .trim()
      .toBuffer();

    const name = `${opt.id}brandlogo_transparent.png`;
    await fs.writeFile(path.join(OUT_DIR, name), png);
    process.stdout.write(`${name} ← ${opt.color} (${opt.id})\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
