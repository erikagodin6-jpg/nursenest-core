/**
 * Rasterize `public/logos/arctic-frost-leaf.svg` into favicon.ico, icon.png, and apple-touch-icon.png.
 * Run from repo root: `npm run generate:favicon` (see package.json).
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const svgPath = path.join(pkgRoot, "public/logos/arctic-frost-leaf.svg");

async function main() {
  const svg = await readFile(svgPath);
  const png512 = await sharp(svg).resize(512, 512).png().toBuffer();
  const png180 = await sharp(svg).resize(180, 180).png().toBuffer();
  const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
  const png16 = await sharp(svg).resize(16, 16).png().toBuffer();

  await writeFile(path.join(pkgRoot, "public/icon.png"), png512);
  await writeFile(path.join(pkgRoot, "public/apple-touch-icon.png"), png180);
  const ico = await pngToIco([png32, png16]);
  await writeFile(path.join(pkgRoot, "public/favicon.ico"), ico);
  // eslint-disable-next-line no-console
  console.log("Wrote public/favicon.ico, public/icon.png, public/apple-touch-icon.png from arctic-frost-leaf.svg");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
