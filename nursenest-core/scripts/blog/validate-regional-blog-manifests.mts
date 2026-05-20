#!/usr/bin/env npx tsx
import "../../src/lib/db/script-env-bootstrap";
/**
 * Validates all regional *-nursing-200.manifest.json files under data/blog-manifest/.
 * Checks: duplicate slug/title, language distribution, required fields.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/blog/validate-regional-blog-manifests.mts
 *   npx tsx scripts/blog/validate-regional-blog-manifests.mts --file data/blog-manifest/germany-nursing-200.manifest.json
 *   npx tsx scripts/blog/validate-regional-blog-manifests.mts --strict
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import {
  validateManifestEntries,
  printIntegrityReport,
  type ManifestEntryLike,
} from "./lib/regional-manifest-integrity";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const MANIFEST_DIR = join(ROOT, "data", "blog-manifest");

function main() {
  const strict = process.argv.includes("--strict");
  const fileIdx = process.argv.indexOf("--file");
  const single = fileIdx !== -1 ? process.argv[fileIdx + 1] : undefined;

  const files = single
    ? [single]
    : readdirSync(MANIFEST_DIR).filter((f) => f.endsWith("-nursing-200.manifest.json"));

  let allOk = true;
  for (const name of files) {
    const path = single
      ? single.includes("/")
        ? join(ROOT, single.replace(/^\//, ""))
        : join(MANIFEST_DIR, single)
      : join(MANIFEST_DIR, name);
    const raw = readFileSync(path, "utf8");
    const parsed = JSON.parse(raw) as { entries?: ManifestEntryLike[] };
    const entries = parsed.entries ?? [];
    const r = validateManifestEntries(entries, path.replace(ROOT + "/", ""));
    const ok = printIntegrityReport(r, strict);
    if (!ok) allOk = false;
  }

  process.exit(allOk ? 0 : 1);
}

main();
