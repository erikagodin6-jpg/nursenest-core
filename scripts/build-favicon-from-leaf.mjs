/**
 * Builds centered, padded leaf favicon assets from CDN `leaflogo2_transparent.png` (cleaner at small sizes).
 * Tints the leaf to **default theme** primary (`NURSENEST_DEFAULT_THEME` / `lavender` → `THEME_OPTIONS` hex).
 * Wordmark theme PNGs are separate per-theme files; favicon stays a single global mark aligned to default lavender.
 * Outputs: public/favicon.ico, public/icon.png (512), public/apple-touch-icon.png (180).
 *
 * Run: `node scripts/build-favicon-from-leaf.mjs`
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "png-to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const CDN_LEAF =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com/leaflogo2_transparent.png";

/** Must match `THEME_OPTIONS` entry for `NURSENEST_DEFAULT_THEME` (`lavender`). */
const DEFAULT_THEME_PRIMARY_HEX = "#9d82dd";

function recolorLeafRgba(data, tr, tg, tb) {
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue;
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
  const res = await fetch(CDN_LEAF);
  if (!res.ok) throw new Error(`Leaf fetch ${res.status}`);
  const rawFetch = Buffer.from(await res.arrayBuffer());
  const hex = DEFAULT_THEME_PRIMARY_HEX.replace(/^#/, "");
  const tr = parseInt(hex.slice(0, 2), 16);
  const tg = parseInt(hex.slice(2, 4), 16);
  const tb = parseInt(hex.slice(4, 6), 16);
  const { data, info } = await sharp(rawFetch).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const tinted = recolorLeafRgba(data, tr, tg, tb);
  const leafBuf = await sharp(tinted, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  /** Square canvas, leaf scaled to ~62% with transparent padding (readable in tab). */
  async function renderPng(size) {
    const meta = await sharp(leafBuf).metadata();
    const w = meta.width ?? 512;
    const h = meta.height ?? 512;
    const maxInner = Math.max(1, size - 4);
    const inner = Math.min(Math.round(Math.min(w, h) * 0.62), maxInner);
    const resized = await sharp(leafBuf)
      .resize(inner, inner, { fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: resized, gravity: "centre" }])
      .png()
      .toBuffer();
  }

  const icon512 = await renderPng(512);
  const icon32 = await renderPng(32);
  const icon180 = await renderPng(180);

  await fs.writeFile(path.join(PUBLIC, "icon.png"), icon512);
  await fs.writeFile(path.join(PUBLIC, "apple-touch-icon.png"), icon180);

  const icoBuf = await toIco([icon32]);
  await fs.writeFile(path.join(PUBLIC, "favicon.ico"), icoBuf);

  process.stdout.write("wrote public/icon.png, public/apple-touch-icon.png, public/favicon.ico\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
