/**
 * Rasterize `public/logos/arctic-frost-leaf.svg` into App Router metadata icons under `src/app/`
 * (`favicon.ico`, `apple-icon.png`). SVG tab icon is `src/app/icon.svg` (kept in sync by hand;
 * this script uses the same source leaf for rasters).
 *
 * Run from package root: `npm run generate:favicon` (see package.json).
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const svgPath = path.join(pkgRoot, "public/logos/arctic-frost-leaf.svg");
const appDir = path.join(pkgRoot, "src/app");

async function main() {
  const svg = await readFile(svgPath);
  const png180 = await sharp(svg).resize(180, 180).png().toBuffer();
  const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
  const png16 = await sharp(svg).resize(16, 16).png().toBuffer();

  const ico = await pngToIco([png32, png16]);
  await writeFile(path.join(appDir, "apple-icon.png"), png180);
  await writeFile(path.join(appDir, "favicon.ico"), ico);
  // eslint-disable-next-line no-console
  console.log("Wrote src/app/favicon.ico, src/app/apple-icon.png from public/logos/arctic-frost-leaf.svg");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
