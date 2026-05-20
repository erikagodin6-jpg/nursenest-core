/**
 * Rasterize canonical NurseNest leaf (`src/assets/brand/leaf-logo-favicon.svg`) into public app icons.
 * Geometry matches nav/header `arctic-frost-leaf.svg` / `SiteBrandLogoMark` — not a separate design.
 *
 * Outputs:
 * - `public/favicon.ico` (16 + 32 PNG frames)
 * - `public/favicon.svg` (vector copy for legacy clients)
 * - `public/apple-touch-icon.png` (180)
 * - `public/icon-192.png`, `public/icon-512.png` (PWA / Android)
 * - `public/mask-icon.svg` (Safari pinned tabs)
 * - `public/brand/leaf-logo.svg`, `public/logos/arctic-frost-leaf.svg` (synced vector marks)
 *
 * Run from package root: `npm run icons:generate`
 */
import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const assetsBrandDir = path.join(pkgRoot, "src/assets/brand");
const faviconSvgPath = path.join(assetsBrandDir, "leaf-logo-favicon.svg");
const leafLogoPath = path.join(assetsBrandDir, "leaf-logo.svg");
const maskSvgPath = path.join(assetsBrandDir, "leaf-logo-mask.svg");
const publicDir = path.join(pkgRoot, "public");
const publicBrandDir = path.join(publicDir, "brand");
const legacyNavLeafPath = path.join(publicDir, "logos/arctic-frost-leaf.svg");

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

async function rasterSquare(size, sourceBuffer) {
  return sharp(sourceBuffer)
    .resize(size, size, {
      fit: "contain",
      position: "centre",
      background: WHITE,
    })
    .png()
    .toBuffer();
}

async function main() {
  if (!existsSync(faviconSvgPath)) {
    throw new Error(`Missing canonical favicon source: ${faviconSvgPath}`);
  }

  const sourceBuffer = await readFile(faviconSvgPath);

  await mkdir(publicBrandDir, { recursive: true });
  await copyFile(leafLogoPath, path.join(publicBrandDir, "leaf-logo.svg"));
  await copyFile(leafLogoPath, legacyNavLeafPath);
  await copyFile(faviconSvgPath, path.join(publicDir, "favicon.svg"));
  await copyFile(maskSvgPath, path.join(publicDir, "mask-icon.svg"));

  const png180 = await rasterSquare(180, sourceBuffer);
  const png192 = await rasterSquare(192, sourceBuffer);
  const png512 = await rasterSquare(512, sourceBuffer);
  const png32 = await rasterSquare(32, sourceBuffer);
  const png16 = await rasterSquare(16, sourceBuffer);

  const ico = await pngToIco([png16, png32]);

  await writeFile(path.join(publicDir, "favicon.ico"), ico);
  await writeFile(path.join(publicDir, "apple-touch-icon.png"), png180);
  await writeFile(path.join(publicDir, "icon-192.png"), png192);
  await writeFile(path.join(publicDir, "icon-512.png"), png512);

  // eslint-disable-next-line no-console
  console.log(
    "Wrote public/favicon.ico, favicon.svg, mask-icon.svg, apple-touch-icon.png, icon-192.png, icon-512.png; synced public/brand/leaf-logo.svg and public/logos/arctic-frost-leaf.svg from src/assets/brand/",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
