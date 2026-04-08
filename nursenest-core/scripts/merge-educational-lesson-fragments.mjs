/**
 * Merges `public/i18n/educational-overlays/<locale>/fragments/*.json` into
 * `public/i18n/educational-overlays/<locale>/lessons.json` (single object).
 * Run from repo root: node nursenest-core/scripts/merge-educational-lesson-fragments.mjs
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const base = join(root, "public", "i18n", "educational-overlays");

const locales = ["fr", "es", "tl"];

for (const loc of locales) {
  const fragDir = join(base, loc, "fragments");
  let merged = {};
  if (!existsSync(fragDir)) {
    console.warn(`skip ${loc}: no fragments dir`);
    continue;
  }
  const files = readdirSync(fragDir)
    .filter((x) => x.endsWith(".json"))
    .sort();
  for (const f of files) {
    const part = JSON.parse(readFileSync(join(fragDir, f), "utf8"));
    if (part && typeof part === "object" && !Array.isArray(part)) {
      merged = { ...merged, ...part };
    }
  }
  const out = join(base, loc, "lessons.json");
  writeFileSync(out, JSON.stringify(merged, null, 2), "utf8");
  console.log(`${loc}: ${Object.keys(merged).length} keys → ${out.replace(root + "/", "")}`);
}
