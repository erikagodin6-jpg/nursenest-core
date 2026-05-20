#!/usr/bin/env node
/**
 * Rebuild `src/config/education-image-inventory.json` from DigitalOcean Spaces.
 *
 * Lists all objects under `uploads/images/` (and optionally `uploads/lesson-images/`)
 * in the configured Spaces bucket, then writes the inventory JSON used by
 * `src/lib/education-images/inventory.ts` and `src/lib/content/resolve-lesson-image.ts`.
 *
 * USAGE:
 *   node scripts/sync-lesson-image-inventory.mjs
 *
 * REQUIRED ENV:
 *   SPACES_KEY        — DigitalOcean Spaces access key ID
 *   SPACES_SECRET     — DigitalOcean Spaces secret access key
 *
 * OPTIONAL ENV:
 *   SPACES_BUCKET     — bucket name (default: nursenest-images)
 *   SPACES_REGION     — region slug (default: tor1)
 *   SPACES_ENDPOINT   — custom endpoint (default: https://{region}.digitaloceanspaces.com)
 *
 * FALLBACK MODE (no Spaces credentials):
 *   If credentials are absent, the script falls back to rebuilding from
 *   `data/replit-exports/lesson_images.json` — same as the legacy builder.
 *
 * After running, commit the updated `src/config/education-image-inventory.json`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "src/config/education-image-inventory.json");

const BUCKET = process.env.SPACES_BUCKET?.trim() || "nursenest-images";
const REGION = process.env.SPACES_REGION?.trim() || "tor1";
const ENDPOINT =
  process.env.SPACES_ENDPOINT?.trim() ||
  `https://${REGION}.digitaloceanspaces.com`;
const KEY = process.env.SPACES_KEY?.trim();
const SECRET = process.env.SPACES_SECRET?.trim();

/** Object key prefixes to scan for lesson images. */
const SCAN_PREFIXES = ["uploads/images/", "uploads/lesson-images/"];

/** Extensions considered valid lesson images. */
const VALID_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

/** Skip auto-generated or AI-generated files (not editorial content). */
function shouldSkipKey(key) {
  const base = key.split("/").pop() ?? "";
  if (base.startsWith("ai-generated")) return true;
  if (base.startsWith(".")) return true; // hidden files
  const ext = base.match(/\.[^.]+$/)?.[0]?.toLowerCase();
  if (!ext || !VALID_EXTENSIONS.has(ext)) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Spaces listing using @aws-sdk/client-s3 (S3-compatible API)
// ---------------------------------------------------------------------------
async function listSpacesKeys() {
  let S3Client, ListObjectsV2Command;
  try {
    ({ S3Client, ListObjectsV2Command } = await import("@aws-sdk/client-s3"));
  } catch {
    throw new Error(
      "@aws-sdk/client-s3 is not installed. Run: npm install @aws-sdk/client-s3",
    );
  }

  const client = new S3Client({
    region: REGION,
    endpoint: ENDPOINT,
    credentials: { accessKeyId: KEY, secretAccessKey: SECRET },
    forcePathStyle: false,
  });

  const allKeys = [];

  for (const prefix of SCAN_PREFIXES) {
    let continuationToken = undefined;
    for (;;) {
      const cmd = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
      });
      const resp = await client.send(cmd);
      for (const obj of resp.Contents ?? []) {
        if (!obj.Key || shouldSkipKey(obj.Key)) continue;
        allKeys.push(obj.Key);
      }
      if (!resp.IsTruncated) break;
      continuationToken = resp.NextContinuationToken;
    }
  }

  return allKeys.sort();
}

// ---------------------------------------------------------------------------
// Legacy fallback: rebuild from replit-exports JSON
// ---------------------------------------------------------------------------
function buildFromReplitExport() {
  const src = path.join(ROOT, "data/replit-exports/lesson_images.json");
  if (!fs.existsSync(src)) {
    throw new Error(`Neither Spaces credentials nor legacy export found at ${src}`);
  }
  console.log("Using legacy replit export:", src);
  const rows = JSON.parse(fs.readFileSync(src, "utf8"));
  const keys = new Set();
  for (const r of rows) {
    if (typeof r.file_name === "string" && r.file_name && !r.file_name.startsWith("ai-generated")) {
      keys.add(`uploads/images/${r.file_name}`);
      const base = r.file_name.replace(/\.[^.]+$/, "").toLowerCase();
      keys.add(`uploads/images/${base}.webp`);
    }
  }
  return [...keys].sort();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  let keys;
  let source;

  if (KEY && SECRET) {
    console.log(`Listing Spaces bucket: ${BUCKET} (${ENDPOINT})`);
    console.log(`Scanning prefixes: ${SCAN_PREFIXES.join(", ")}`);
    try {
      keys = await listSpacesKeys();
      source = `spaces:${BUCKET}/${SCAN_PREFIXES.join("+")}`;
      console.log(`Found ${keys.length} image keys in Spaces.`);
    } catch (err) {
      console.error("ERROR listing Spaces:", err.message);
      console.log("Falling back to replit export...");
      keys = buildFromReplitExport();
      source = "data/replit-exports/lesson_images.json";
    }
  } else {
    console.log("SPACES_KEY / SPACES_SECRET not set — using legacy replit export.");
    keys = buildFromReplitExport();
    source = "data/replit-exports/lesson_images.json";
  }

  const payload = {
    version: 1,
    generatedFrom: source,
    generatedAt: new Date().toISOString(),
    keys,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${OUT}`);
  console.log(`  keys: ${keys.length}`);

  // Quick summary: show unique basenames for review.
  const basenames = new Set(keys.map((k) => k.split("/").pop()?.replace(/\.[^.]+$/, "") ?? ""));
  console.log(`  unique basenames: ${basenames.size}`);

  if (basenames.size <= 50) {
    console.log("\nBasenames in inventory:");
    for (const b of [...basenames].sort()) {
      console.log(`  ${b}`);
    }
  }
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
