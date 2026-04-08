/**
 * Writes wave-1 lesson overlay fragments (01-copd.json, 02-priority.json) and merged lessons.json for fr, es, tl.
 * Run from repo root: node nursenest-core/scripts/emit-wave1-educational-fragments.mjs
 */
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { COPD_FR } from "./wave1-copd-locales.mjs";
import { COPD_ES } from "./wave1-copd-es.mjs";
import { COPD_TL } from "./wave1-copd-tl.mjs";
import { PRIORITY_FR, PRIORITY_ES, PRIORITY_TL } from "./wave1-priority-locales.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const base = join(__dirname, "..", "public", "i18n", "educational-overlays");

const bundles = [
  ["fr", COPD_FR, PRIORITY_FR],
  ["es", COPD_ES, PRIORITY_ES],
  ["tl", COPD_TL, PRIORITY_TL],
];

for (const [loc, copd, priority] of bundles) {
  const fragDir = join(base, loc, "fragments");
  mkdirSync(fragDir, { recursive: true });
  writeFileSync(join(fragDir, "01-copd.json"), JSON.stringify(copd, null, 2), "utf8");
  writeFileSync(join(fragDir, "02-priority.json"), JSON.stringify(priority, null, 2), "utf8");
  const merged = { ...copd, ...priority };
  writeFileSync(join(base, loc, "lessons.json"), JSON.stringify(merged, null, 2), "utf8");
  console.log(
    `${loc}: ${Object.keys(merged).length} keys (COPD ${Object.keys(copd).length} + priority ${Object.keys(priority).length}) → public/i18n/educational-overlays/${loc}/lessons.json`,
  );
}
