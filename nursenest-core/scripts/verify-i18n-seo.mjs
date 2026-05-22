#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REPORT_DIR = path.join(APP_ROOT, "reports");
const FR_AUDIT = path.join(REPORT_DIR, "french-completeness-audit.json");
const ES_AUDIT = path.join(REPORT_DIR, "spanish-completeness-audit.json");

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

const fr = readJson(FR_AUDIT);
if (!fr) {
  console.error("[i18n:seo] Missing reports/french-completeness-audit.json. Run npm run i18n:audit:fr first.");
  process.exit(1);
}
const es = readJson(ES_AUDIT);
if (!es) {
  console.error("[i18n:seo] Missing reports/spanish-completeness-audit.json. Run npm run i18n:audit:es first.");
  process.exit(1);
}

const indexedIncomplete = fr.results.filter((r) => r.indexable && r.completionScore < fr.minIndexableScore);
const hreflangBroken = fr.results.filter((r) => r.indexable && r.shouldNoindex);
const missingSeo = fr.results.filter((r) => r.indexable && (r.seoIssues?.length ?? 0) > 0);
const missingJsonLd = fr.results.filter((r) => r.indexable && (r.jsonLdIssues?.length ?? 0) > 0);
const esSurfaces = Array.isArray(es.surfaces) ? es.surfaces : [];
const esIndexedIncomplete = esSurfaces.filter((r) => r.indexable && r.completionScore < 100);
const esBlockedIndexable = esSurfaces.filter((r) => r.shouldNoindex);
const esMissingSeo = esSurfaces.filter((r) => r.indexable && (r.seoIssues?.length ?? 0) > 0);
const esLeakIssues = es.summary?.englishLeakSuspicions ?? 0;

const lines = [
  "# I18n SEO Verification",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `- French indexed while incomplete: ${indexedIncomplete.length}`,
  `- French hreflang candidates blocked by noindex: ${hreflangBroken.length}`,
  `- Localized SEO issues on indexable pages: ${missingSeo.length}`,
  `- Localized JSON-LD issues on indexable pages: ${missingJsonLd.length}`,
  `- Spanish indexed while incomplete: ${esIndexedIncomplete.length}`,
  `- Spanish indexable surfaces blocked by noindex: ${esBlockedIndexable.length}`,
  `- Spanish localized SEO issues on indexable pages: ${esMissingSeo.length}`,
  `- Spanish English-leak suspicions: ${esLeakIssues}`,
  "",
  "Required hreflang tags for completed English/French pairs: `en-CA`, `fr-CA`, and `x-default`.",
  "Required hreflang tags for completed Spanish shared marketing pages include `es` and `x-default`.",
  "Incomplete French or Spanish surfaces must stay out of sitemap and completed-alternate hreflang clusters.",
  "",
];
fs.writeFileSync(path.join(REPORT_DIR, "i18n-seo-verification.md"), lines.join("\n"));

const failures =
  indexedIncomplete.length +
  missingSeo.length +
  missingJsonLd.length +
  esIndexedIncomplete.length +
  esBlockedIndexable.length +
  // Keep English-leak suspicions visible in the report while Spanish translation
  // coverage is still being completed; the SEO gate only blocks indexable issues.
  esMissingSeo.length;
if (failures > 0) {
  console.error(`[i18n:seo] failed with ${failures} SEO readiness findings.`);
  process.exit(1);
}
console.log("[i18n:seo] passed static SEO readiness guard.");
