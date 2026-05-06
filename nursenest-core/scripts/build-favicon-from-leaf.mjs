/**
 * Rasterize the canonical clinical-light leaf PNG (`public/icon.png`) into public favicon/PWA icons.
 * App Router file metadata under `src/app/` is intentionally unused so `/public/*` is the single source.
 *
 * Outputs:
 * - `public/favicon.ico` (16 + 32 PNG frames)
 * - `public/favicon-v2.ico` (16 + 32 PNG frames, optional cache-bust filename)
 * - `public/apple-touch-icon.png` (180)
 * - `public/icon-192.png`, `public/icon-512.png` (PWA / Android)
 *
 * Run from package root: `npm run icons:generate`
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const sourcePngPath = path.join(pkgRoot, "public/icon.png");
const publicDir = path.join(pkgRoot, "public");

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

function icoFromPngs(images) {
  const count = images.length;
  const headerSize = 6 + 16 * count;
  const total = headerSize + images.reduce((n, img) => n + img.data.length, 0);
  const out = Buffer.alloc(total);
  out.writeUInt16LE(0, 0);
  out.writeUInt16LE(1, 2);
  out.writeUInt16LE(count, 4);
  let dataOffset = headerSize;
  images.forEach((img, i) => {
    const entry = 6 + i * 16;
    out.writeUInt8(img.size >= 256 ? 0 : img.size, entry);
    out.writeUInt8(img.size >= 256 ? 0 : img.size, entry + 1);
    out.writeUInt8(0, entry + 2);
    out.writeUInt8(0, entry + 3);
    out.writeUInt16LE(1, entry + 4);
    out.writeUInt16LE(32, entry + 6);
    out.writeUInt32LE(img.data.length, entry + 8);
    out.writeUInt32LE(dataOffset, entry + 12);
    img.data.copy(out, dataOffset);
    dataOffset += img.data.length;
  });
  return out;
}

async function rasterSquare(size) {
  return sharp(sourcePngPath)
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

  const ico = icoFromPngs([{ size: 16, data: png16 }, { size: 32, data: png32 }]);

  await writeFile(path.join(publicDir, "favicon.ico"), ico);
  await writeFile(path.join(publicDir, "favicon-v2.ico"), ico);
  await writeFile(path.join(publicDir, "apple-touch-icon.png"), png180);
  await writeFile(path.join(publicDir, "icon-192.png"), png192);
  await writeFile(path.join(publicDir, "icon-512.png"), png512);

  // eslint-disable-next-line no-console
  console.log(
    "Wrote public/favicon.ico, favicon-v2.ico, apple-touch-icon.png, icon-192.png, icon-512.png from public/icon.png",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
