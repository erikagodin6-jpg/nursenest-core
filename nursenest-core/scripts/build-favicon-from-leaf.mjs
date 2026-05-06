/**
 * Rasterize `public/logos/nursenest-leaf-icon-source.svg` into **public** icons (App Router file
 * metadata under `src/app/` is intentionally unused so `/public/*` is the single source).
 *
 * Outputs:
 * - `public/favicon-v2.ico` (16 + 32 PNG frames, cache-bust filename)
 * - `public/apple-touch-icon.png` (180)
 * - `public/icon-192.png`, `public/icon-512.png` (PWA / Android)
 *
 * Run from package root: `npm run icons:generate`
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const svgPath = path.join(pkgRoot, "public/logos/nursenest-leaf-icon-source.svg");
const publicDir = path.join(pkgRoot, "public");

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

async function rasterSquare(size) {
  const svg = await readFile(svgPath);
  return sharp(svg)
    .resize(size, size, {
      fit: "contain",
      position: "centre",
      background: WHITE,
    })
    .png()
    .toBuffer();
}

async function main() {
  const png180 = await rasterSquare(180);
  const png192 = await rasterSquare(192);
  const png512 = await rasterSquare(512);
  const png32 = await rasterSquare(32);
  const png16 = await rasterSquare(16);

  const ico = await pngToIco([png16, png32]);

  await writeFile(path.join(publicDir, "favicon-v2.ico"), ico);
  await writeFile(path.join(publicDir, "apple-touch-icon.png"), png180);
  await writeFile(path.join(publicDir, "icon-192.png"), png192);
  await writeFile(path.join(publicDir, "icon-512.png"), png512);

  // eslint-disable-next-line no-console
  console.log(
    "Wrote public/favicon-v2.ico, apple-touch-icon.png, icon-192.png, icon-512.png from nursenest-leaf-icon-source.svg",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
