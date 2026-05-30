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

describe("HESI A2 / ATI TEAS / CASPER admissions products", () => {
  it("declares visible first-class admissions products", () => {
    assert.deepEqual(
      ADMISSIONS_PRODUCT_READINESS.map((product) => product.slug),
      ["hesi-a2", "ati-teas", "casper"],
    );

    for (const product of ADMISSIONS_PRODUCT_READINESS) {
      assert.notEqual(product.canonicalPath, "/pre-nursing");
      assert.match(product.canonicalPath, /^\/pre-nursing\/(hesi-a2|ati-teas|casper)$/);
      assert.equal(product.status, "active");
      assert.ok(getAdmissionsProductCompletionPercent(product) > 0, `${product.slug} needs readiness model coverage`);
      assert.ok(getAdmissionsProductLaunchGaps(product).length >= 3, `${product.slug} needs ongoing quality controls`);
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
    assert.match(clientHeader, /href:\s*"\/pre-nursing\/casper"/);
    assert.match(serverHeader, /href:\s*"\/pre-nursing\/hesi-a2"/);
    assert.match(serverHeader, /href:\s*"\/pre-nursing\/ati-teas"/);
    assert.match(serverHeader, /href:\s*"\/pre-nursing\/casper"/);
  });

  it("readiness pages are explicit product pages, not module redirects", () => {
    const pageSource = readSource("src/app/(marketing)/(default)/pre-nursing/[slug]/page.tsx");

    assert.match(pageSource, /getAdmissionsProductReadinessBySlug/);
    assert.match(pageSource, /getAdmissionExamProductBySlug/);
    assert.match(pageSource, /Exam breakdown/);
    assert.match(pageSource, /Practice modes/);
    assert.doesNotMatch(pageSource, /This page exists to prevent silent routing into a generic pathway/);
  });

  it("CASPER renders the dedicated response-training ecosystem", () => {
    const pageSource = readSource("src/app/(marketing)/(default)/pre-nursing/[slug]/page.tsx");
    const ecosystemSource = readSource("src/components/pre-nursing/casper/casper-premium-ecosystem-page.tsx");

    assert.match(pageSource, /slug === "casper"/);
    assert.match(pageSource, /<CasperPremiumEcosystemPage \/>/);
    assert.match(ecosystemSource, /not a memorization bank/);
    assert.match(ecosystemSource, /CasperResponseTrainerClient/);
    assert.match(ecosystemSource, /product\.practiceModes/);
  });
});
