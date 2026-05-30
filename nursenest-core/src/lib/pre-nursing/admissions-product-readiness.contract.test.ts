import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import {
  ADMISSIONS_PRODUCT_READINESS,
  getAdmissionsProductCompletionPercent,
  getAdmissionsProductLaunchGaps,
} from "@/lib/pre-nursing/admissions-product-readiness";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "../../..");

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

describe("HESI A2 / ATI TEAS / CASPer readiness recovery", () => {
  it("declares truthful non-launch statuses for every incomplete admissions product", () => {
    assert.deepEqual(
      ADMISSIONS_PRODUCT_READINESS.map((product) => product.slug),
      ["hesi-a2", "ati-teas", "casper"],
    );

    for (const product of ADMISSIONS_PRODUCT_READINESS) {
      assert.notEqual(product.canonicalPath, "/pre-nursing");
      assert.match(product.canonicalPath, /^\/pre-nursing\/(hesi-a2|ati-teas|casper)$/);
      assert.ok(["coming_soon", "beta_in_development"].includes(product.status));
      assert.ok(getAdmissionsProductCompletionPercent(product) < 100, `${product.slug} must not be marked launch-complete`);
      assert.ok(getAdmissionsProductLaunchGaps(product).length >= 3, `${product.slug} needs launch gaps for recovery planning`);
    }
  });

  it("does not locale-prefix readiness status routes that do not have localized route files", () => {
    for (const product of ADMISSIONS_PRODUCT_READINESS) {
      assert.equal(withMarketingLocale("fr", product.canonicalPath), product.canonicalPath);
      assert.equal(withMarketingLocale("es", product.canonicalPath), product.canonicalPath);
    }
  });

  it("header links no longer silently route HESI or TEAS to generic Pre-Nursing", () => {
    const clientHeader = readSource("src/components/layout/site-header.tsx");
    const serverHeader = readSource("src/components/layout/site-header-server.tsx");

    assert.doesNotMatch(clientHeader, /key:\s*"hesi"[\s\S]{0,120}href:\s*"\/pre-nursing"/);
    assert.doesNotMatch(clientHeader, /key:\s*"teas"[\s\S]{0,120}href:\s*"\/pre-nursing"/);
    assert.doesNotMatch(serverHeader, /key:\s*"hesi"[\s\S]{0,160}localizeHref\(locale,\s*"\/pre-nursing"\)/);
    assert.doesNotMatch(serverHeader, /key:\s*"teas"[\s\S]{0,160}localizeHref\(locale,\s*"\/pre-nursing"\)/);

    assert.match(clientHeader, /href:\s*"\/pre-nursing\/hesi-a2"/);
    assert.match(clientHeader, /href:\s*"\/pre-nursing\/ati-teas"/);
    assert.match(serverHeader, /href:\s*"\/pre-nursing\/hesi-a2"/);
    assert.match(serverHeader, /href:\s*"\/pre-nursing\/ati-teas"/);
  });

  it("readiness pages are explicit noindex status pages, not module redirects", () => {
    const pageSource = readSource("src/app/(marketing)/(default)/pre-nursing/[slug]/page.tsx");

    assert.match(pageSource, /getAdmissionsProductReadinessBySlug/);
    assert.match(pageSource, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/);
    assert.match(pageSource, /This page exists to prevent silent routing into a generic pathway/);
  });
});
