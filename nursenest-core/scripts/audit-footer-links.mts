/**
 * Validates every href emitted by SiteFooter (static + footerMarketingNav + regional featured).
 * Run: `npx tsx scripts/audit-footer-links.mts`
 */
import { createRouteValidator } from "../../scripts/audit-internal-links.ts";
import { footerMarketingNav } from "../src/lib/navigation/footer-marketing-nav.ts";
import { NAV_BY_COUNTRY } from "../src/lib/marketing/countries/registry.ts";
import type { CountryCode } from "../src/lib/marketing/countries/types.ts";

const { isValidPath } = createRouteValidator();

const STATIC_FOOTER_PATHS = [
  "/about",
  "/careers",
  "/privacy",
  "/terms",
  "/cookie-policy",
  "/disclaimer",
  "/membership-tiers",
  "/for-institutions",
  "/enterprise-solutions",
  "/canada/np/cnple/study-guide",
  "/canada/np/cnple/loft-exam",
  "/canada/pn/rex-pn/cat",
  "/canada/pn/rex-pn/pharmacology",
  "/allied-health/respiratory-therapy/ventilation",
  "/allied-health/respiratory-therapy/oxygen-therapy",
] as const;

function stripQuery(path: string): string {
  return path.split("?")[0] ?? path;
}

const failures: { source: string; path: string }[] = [];

for (const region of ["US", "CA"] as const) {
  const nav = footerMarketingNav(region);
  const groups = [
    ["platform", nav.platform],
    ["resources", nav.resources],
    ["support", nav.support],
    ["exams", nav.exams],
  ] as const;
  for (const [group, record] of groups) {
    for (const [key, href] of Object.entries(record)) {
      const path = stripQuery(href);
      if (!isValidPath(path)) {
        failures.push({ source: `footerMarketingNav(${region}).${group}.${key}`, path });
      }
    }
  }
}

for (const path of STATIC_FOOTER_PATHS) {
  if (!isValidPath(path)) {
    failures.push({ source: "site-footer.tsx static", path });
  }
}

for (const country of Object.keys(NAV_BY_COUNTRY) as CountryCode[]) {
  for (const item of NAV_BY_COUNTRY[country].footerFeatured) {
    const path = stripQuery(item.href);
    if (!isValidPath(path)) {
      failures.push({ source: `footerFeatured(${country}): ${item.label}`, path });
    }
  }
}

if (failures.length === 0) {
  console.log("OK: all footer hrefs resolve to known routes.");
  process.exit(0);
}

console.error("Footer dead-link candidates (route validator):");
for (const f of failures) {
  console.error(`  - ${f.source}: ${f.path}`);
}
process.exit(1);
