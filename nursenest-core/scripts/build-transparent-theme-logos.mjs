/**
 * Downloads legacy CDN rasters, removes light backgrounds to alpha, trims — bootstrap only.
 * **Production wordmarks:** run `npx tsx scripts/generate-theme-logos-from-registry.ts` so colors match
 * `THEME_OPTIONS[].color` in `src/lib/theme/theme-registry.ts`.
 *
 * Run from `nursenest-core/`: `node scripts/build-transparent-theme-logos.mjs`
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "branding", "theme-logos");
const CDN = "https://nursenest-images.tor1.cdn.digitaloceanspaces.com";

/** Output filename => CDN source key (bucket root). */
const SOURCES = {
  "lavenderbrandlogo_transparent.png": "lavenderbrandlogo.png",
  "mintbrandlogo_transparent.png": "mintbrandlogo.png",
  "pinkbrandlogo_transparent.png": "pinkbrandlogo.png",
  "darkgreybrandlogo_transparent.png": "darkgreybrandlogo.png",
  "oceanbrandlogo_transparent.png": "oceanbrandlogo.png",
  "forestbrandlogo_transparent.png": "forestbrandlogo.png",
  "greybrandlogo_transparent.png": "greybrandlogo.png",
  "sagebrandlogo_transparent.png": "sagebrandlogo.png",
  "sandbrandlogo_transparent.png": "sandbrandlogo.png",
  "rosegoldbrandlogo_transparent.png": "rosegoldbrandlogo.png",
  "coralbrandlogo_transparent.png": "coralbrandlogo.png",
  "indigobrandlogo_transparent.png": "indigobrandlogo.png",
  "tealbrandlogo_transparent.png": "tealbrandlogo.png",
  "bluebrandlogo_transparent.png": "bluebrandlogo.png",
};

async function fetchBuffer(key) {
  const url = `${CDN}/${encodeURIComponent(key)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Light pixels → transparent; keeps colored logo pixels.
 * threshold: min channel value treated as "background" when all channels are high.
 */
async function lightBackgroundToAlpha(input, threshold = 238) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .trim()
    .toBuffer();
}

/** Berry theme: tint non-transparent pixels toward #a855f7 (from pink base). */
function applyBerryTint(data) {
  const br = 168 / 255;
  const bg = 85 / 255;
  const bb = 247 / 255;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;
    data[i] = Math.min(255, Math.round(data[i] * br));
    data[i + 1] = Math.min(255, Math.round(data[i + 1] * bg));
    data[i + 2] = Math.min(255, Math.round(data[i + 2] * bb));
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const [outName, srcKey] of Object.entries(SOURCES)) {
    const buf = await fetchBuffer(srcKey);
    let processed = await lightBackgroundToAlpha(buf);
    await fs.writeFile(path.join(OUT_DIR, outName), processed);
    process.stdout.write(`wrote ${outName}\n`);
  }

  // Berry: derived from pink transparent pipeline
  const pinkBuf = await fetchBuffer("pinkbrandlogo.png");
  let berry = await lightBackgroundToAlpha(pinkBuf);
  const { data, info } = await sharp(berry).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  applyBerryTint(data);
  berry = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .trim()
    .toBuffer();
  await fs.writeFile(path.join(OUT_DIR, "berrybrandlogo_transparent.png"), berry);
  process.stdout.write("wrote berrybrandlogo_transparent.png (tinted from pink)\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
