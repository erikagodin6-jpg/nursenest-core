/**
 * generate-leaf-logos.mjs
 *
 * Generates leaf-only (icon-only) transparent PNG logos for every NurseNest theme by:
 *   1. Downloading the full logo from the Spaces CDN (Logos/ prefix)
 *   2. Cropping to the leaf region using the SVG layout ratio (leaf ends at x ≈ 52/260 of width)
 *   3. Trimming outer transparent pixels to a tight bounding box
 *   4. Uploading the result to nursenest-images/Logos/leaf-only/ in Spaces
 *
 * SVG reference (public/branding/nursenest-mark.svg):
 *   viewBox="0 0 260 52" — leaf paths occupy x: 0 to ~50; text "NurseNest" starts at x=52.
 *   The leaf therefore occupies the leftmost (52/260) ≈ 20% of the image width.
 *
 * Requires:
 *   SPACES_KEY     — DigitalOcean Spaces access key
 *   SPACES_SECRET  — DigitalOcean Spaces secret key
 *
 * Run from nursenest-core/:
 *   SPACES_KEY=… SPACES_SECRET=… node scripts/generate-leaf-logos.mjs
 *
 * Dry-run (downloads + crops, no upload):
 *   DRY_RUN=1 node scripts/generate-leaf-logos.mjs
 *
 * Single theme (for testing):
 *   THEME=mint DRY_RUN=1 node scripts/generate-leaf-logos.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CDN        = "https://nursenest-images.tor1.cdn.digitaloceanspaces.com";
const BUCKET     = "nursenest-images";
const ENDPOINT   = "https://tor1.digitaloceanspaces.com";
const REGION     = "tor1";
const LEAF_DIR   = "Logos/leaf-only";
const LOCAL_DIR  = path.join(__dirname, "..", "public", "logos", "leaf-only");
const DRY_RUN    = process.env.DRY_RUN === "1";
const ONLY_THEME = process.env.THEME || null;

// ---------------------------------------------------------------------------
// Theme → full logo Spaces key mapping (mirrors theme-logo-map.ts exactly).
// ---------------------------------------------------------------------------
const THEME_FULL_KEYS = {
  ocean:              "Logos/ocean-transparent.png",
  "clinical-light":   "Logos/clinicallight-transparent.png",
  "blueberry-sherbet":"Logos/blueberrysherbet-transparent.png",
  "strawberry-cream": "Logos/strawberrycream-transparent.png",
  "ocean-mist":       "Logos/oceanmist-transparent.png",
  "lavender-dream":   "Logos/lavenderdream-transparent.png",
  "mint-breeze":      "Logos/mintbreeze-transparent.png",
  "rose-quartz":      "Logos/rosequartz-transparent.png",
  "golden-hour":      "Logos/goldenhour-transparent.png",
  "sage-garden":      "Logos/sagegarden-transparent.png",
  "coral-sunset":     "Logos/coralsunset-transparent.png",
  "arctic-frost":     "Logos/arcticfrost-transparent.png",
  "plum-velvet":      "Logos/plumvelvet-transparent.png",
  "honey-cream":      "Logos/honeycream-transparent.png",
  "dusty-rose":       "Logos/dustyrose-transparent.png",
  "midnight-indigo":  "Logos/midnightindigo-transparent.png",
  "deep-twilight":    "Logos/deeptwilight-transparent.png",
  blush:              "Logos/blush-transparent.png",
  "pastel-blush":     "Logos/pastelblush-transparent.png",
  strawberry:         "Logos/strawberry-transparent.png",
  "rose-gold":        "Logos/rosegold-transparent.png",
  coral:              "Logos/coral-transparent.png",
  mint:               "Logos/mint-transparent.png",
  "pastel-mint":      "Logos/pastelmint-transparent.png",
  teal:               "Logos/teal-transparent.png",
  forest:             "Logos/forest-transparent.png",
  "soft-sage":        "Logos/softsage-transparent.png",
  "multi-pastel":     "Logos/multipastel-transparent.png",
  lavender:           "Logos/lavender-transparent.png",
  "pastel-lavender":  "Logos/pastellavender-transparent.png",
  "pastel-lilac":     "Logos/pastellilac-transparent.png",
  berry:              "Logos/berry-transparent.png",
  indigo:             "Logos/indigo-transparent.png",
  slate:              "Logos/slate-transparent.png",
  midnight:           "Logos/midnight-transparent.png",
  "neutral-sand":     "Logos/neutralsand-transparent.png",
  "neutral-slate":    "Logos/neutralslate-transparent.png",
  "dark-mode":        "Logos/darkmode-transparent.png",
  "dark-clinical":    "Logos/darkclinical-transparent.png",
  "dark-academia":    "Logos/darkacademia-transparent.png",
};

/**
 * Leaf output key in Spaces for a given theme id.
 * Matches the pattern defined in theme-logo-map.ts.
 */
function leafKey(themeId) {
  return `${LEAF_DIR}/${themeId}-leaf_transparent.png`;
}

// ---------------------------------------------------------------------------
// Leaf extraction
// ---------------------------------------------------------------------------

/**
 * Crop `imageBuffer` to the leaf region.
 *
 * Strategy: the NurseNest SVG viewBox is 260×52.  The leaf paths end at x≈50;
 * the wordmark "NurseNest" starts at x=52. So the leaf occupies the first
 * (52/260) ≈ 20% of the image width.  We crop there then trim alpha.
 *
 * Additionally we scan columns to find the first major gap (≥4 transparent cols
 * in a row) after 8% of the image width as a secondary check — whichever boundary
 * is narrower wins, protecting against slight size variations.
 */
async function extractLeaf(imageBuffer) {
  const img     = sharp(imageBuffer).ensureAlpha();
  const meta    = await img.metadata();
  const { width, height } = meta;

  // Primary boundary from SVG proportions (52 out of 260 units = 20 %)
  const svgBoundary = Math.round(width * (52 / 260));

  // Secondary boundary: scan columns for first gap ≥ 4 px after 8% of width.
  const { data } = await sharp(imageBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ALPHA_THRESHOLD = 8;
  const MIN_GAP         = 4;
  let gapStart      = -1;
  let consecutiveEmpty = 0;
  const scanFrom = Math.round(width * 0.08);

  for (let x = scanFrom; x < svgBoundary + 20; x++) {
    let hasOpaque = false;
    for (let y = 0; y < height; y++) {
      if (data[(y * width + x) * 4 + 3] > ALPHA_THRESHOLD) {
        hasOpaque = true;
        break;
      }
    }
    if (!hasOpaque) {
      consecutiveEmpty++;
      if (consecutiveEmpty === MIN_GAP && gapStart === -1) {
        gapStart = x - MIN_GAP + 1;
        break;
      }
    } else {
      consecutiveEmpty = 0;
    }
  }

  // Use whichever boundary is narrower (more conservative crop).
  const cropWidth = Math.min(
    svgBoundary,
    gapStart > 0 ? gapStart : svgBoundary,
  );

  return sharp(imageBuffer)
    .ensureAlpha()
    .extract({ left: 0, top: 0, width: Math.max(cropWidth, 1), height })
    .trim({ threshold: ALPHA_THRESHOLD })
    .png({ compressionLevel: 9, quality: 100 })
    .toBuffer();
}

// ---------------------------------------------------------------------------
// S3 / Spaces helpers
// ---------------------------------------------------------------------------

function makeS3() {
  const key    = process.env.SPACES_KEY;
  const secret = process.env.SPACES_SECRET;
  if (!key || !secret) {
    throw new Error("SPACES_KEY and SPACES_SECRET env vars are required (or set DRY_RUN=1)");
  }
  return new S3Client({
    endpoint:         ENDPOINT,
    region:           REGION,
    credentials:      { accessKeyId: key, secretAccessKey: secret },
    forcePathStyle:   false,
  });
}

async function objectExists(s3, key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadToSpaces(s3, key, buffer) {
  await s3.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        buffer,
    ContentType: "image/png",
    ACL:         "public-read",
    CacheControl: "public, max-age=31536000, immutable",
  }));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function fetchBuffer(cdnKey) {
  const url = `${CDN}/${cdnKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function run() {
  await fs.mkdir(LOCAL_DIR, { recursive: true });

  const s3 = DRY_RUN ? null : makeS3();

  const themes = ONLY_THEME
    ? [ONLY_THEME]
    : Object.keys(THEME_FULL_KEYS);

  let ok = 0, skipped = 0, failed = 0;

  for (const themeId of themes) {
    const fullCdnKey = THEME_FULL_KEYS[themeId];
    if (!fullCdnKey) {
      console.warn(`⚠  Unknown theme id: ${themeId}`);
      continue;
    }

    const outKey      = leafKey(themeId);
    const localPath   = path.join(LOCAL_DIR, path.basename(outKey));

    process.stdout.write(`  ${themeId.padEnd(22)}`);

    try {
      // Check Spaces first (skip if already present and not re-generating).
      if (!DRY_RUN && s3) {
        const exists = await objectExists(s3, outKey);
        if (exists && process.env.FORCE !== "1") {
          console.log("→ already exists (skip; set FORCE=1 to overwrite)");
          skipped++;
          continue;
        }
      }

      // Download full logo.
      const fullBuf = await fetchBuffer(fullCdnKey);

      // Extract leaf.
      const leafBuf = await extractLeaf(fullBuf);

      // Save locally for inspection.
      await fs.writeFile(localPath, leafBuf);

      if (DRY_RUN) {
        console.log(`→ saved locally (dry run)  ${localPath}`);
      } else {
        await uploadToSpaces(s3, outKey, leafBuf);
        console.log(`→ uploaded  ${outKey}`);
      }
      ok++;
    } catch (err) {
      console.error(`\n  ✗ ${themeId}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone — ${ok} generated, ${skipped} skipped, ${failed} failed`);
  if (failed > 0) process.exitCode = 1;
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
