/**
 * Rasterize the approved CDN pink favicon into public/ app-icon files.
 * Browsers often request /favicon.ico directly (ignoring metadata); logos use CDN URLs separately.
 *
 * Run from package root: `npm run icons:generate`
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const PINK_FAVICON_URL =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/pinkfavicon.png";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

async function fetchPinkSource() {
  const res = await fetch(PINK_FAVICON_URL);
  if (!res.ok) {
    throw new Error(`Failed to download pink favicon: ${res.status} ${res.statusText}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function rasterSquare(source, size) {
  return sharp(source)
    .resize(size, size, { fit: "contain", position: "centre", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
}

async function main() {
  const source = await fetchPinkSource();
  await mkdir(publicDir, { recursive: true });

  const png16 = await rasterSquare(source, 16);
  const png32 = await rasterSquare(source, 32);
  const png180 = await rasterSquare(source, 180);
  const png192 = await rasterSquare(source, 192);
  const png512 = await rasterSquare(source, 512);

  const ico = await pngToIco([png16, png32]);

  await writeFile(path.join(publicDir, "favicon.ico"), ico);
  await writeFile(path.join(publicDir, "apple-touch-icon.png"), png180);
  await writeFile(path.join(publicDir, "icon-192.png"), png192);
  await writeFile(path.join(publicDir, "icon-512.png"), png512);
  // PNG copy for clients that request /favicon.svg bookmark path — keep a tiny PNG alias via favicon link only
  await writeFile(path.join(publicDir, "favicon.png"), png32);

  console.log(
    "[sync-approved-pink-favicon-public] Wrote favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, favicon.png from CDN pinkfavicon.png",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
