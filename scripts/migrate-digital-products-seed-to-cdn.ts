/**
 * Rewrite `server/seed-data/digital-products.json` Replit object paths to
 * public nursenest-images CDN URLs (see `shared/replit-object-storage-cdn.ts`).
 *
 * Usage (repo root): npx tsx scripts/migrate-digital-products-seed-to-cdn.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { replitLegacyStorageUrlToCdnUrl } from "../shared/replit-object-storage-cdn";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const target = path.join(repoRoot, "server/seed-data/digital-products.json");

function toCdn(raw: string | null | undefined): string | null | undefined {
  if (raw == null || typeof raw !== "string") return raw;
  const out = replitLegacyStorageUrlToCdnUrl(raw);
  return out ?? raw;
}

function main() {
  const raw = fs.readFileSync(target, "utf8");
  const rows = JSON.parse(raw) as Record<string, unknown>[];
  if (!Array.isArray(rows)) {
    console.error("Expected digital-products.json to be a JSON array");
    process.exit(1);
  }
  let n = 0;
  for (const row of rows) {
    const fileUrl = row.file_url;
    const previewUrl = row.preview_url;
    const cover = row.cover_image_url;
    if (typeof fileUrl === "string") {
      const u = toCdn(fileUrl);
      if (u !== fileUrl) {
        row.file_url = u;
        n++;
      }
    }
    if (typeof previewUrl === "string") {
      const u = toCdn(previewUrl);
      if (u !== previewUrl) {
        row.preview_url = u;
        n++;
      }
    }
    if (typeof cover === "string") {
      const u = toCdn(cover);
      if (u !== cover) {
        row.cover_image_url = u;
        n++;
      }
    }
  }
  fs.writeFileSync(target, JSON.stringify(rows, null, 2) + "\n", "utf8");
  console.log(`Updated ${n} URL field(s) in ${path.relative(repoRoot, target)}`);
}

main();
