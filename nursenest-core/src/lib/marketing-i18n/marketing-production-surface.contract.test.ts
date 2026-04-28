/**
 * Contract: `scripts/validate-marketing-production-surface.mjs` + canonical `en/pages.json`
 * homepage/pricing keys stay flat strings (no missing keys, no nested objects, no leaked paths).
 *
 * Run: `npx tsx --test src/lib/marketing-i18n/marketing-production-surface.contract.test.ts`
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { scanFlatMarketingMessagesForForbiddenValues } from "@/lib/marketing-i18n/marketing-message-value-policy";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, "..", "..", "..");
const PAGES_EN = join(PKG_ROOT, "public", "i18n", "en", "pages.json");
const VALIDATE_SCRIPT = join(PKG_ROOT, "scripts", "validate-marketing-production-surface.mjs");

/** Must stay aligned with `scripts/validate-marketing-production-surface.mjs` REQUIRED_PAGE_KEYS. */
const REQUIRED_MARKETING_SURFACE_PAGE_KEYS = [
  "pages.home.hero.headline",
  "pages.home.hero.subheading",
  "pages.home.hero.subheading2",
  "pages.home.hero.eyebrowBrand",
  "pages.home.hero.scanItem1",
  "pages.home.hero.scanItem2",
  "pages.home.hero.scanItem3",
  "pages.home.hero.scanItem4",
  "pages.home.carouselHandoff.kicker",
  "pages.home.carouselHandoff.lead",
  "pages.home.howItWorks.kicker",
  "pages.home.howItWorks.title",
  "pages.home.howItWorks.subtitle",
  "pages.home.globalRegions.title",
  "pages.home.globalRegions.subtitle",
  "pages.home.globalRegions.expansionFootnote",
  "pages.home.metaTitleCA",
  "pages.home.metaDescriptionCA",
  "pages.pricing.rowPlansLoading",
  "pages.pricing.plan.durationNotOffered",
  "pages.pricing.error.pricingTemporarilyUnavailable",
  "pages.pricing.error.trackTemporarilyUnavailable",
  "pages.pricing.checkout.unavailableBody",
  "pages.pricing.plan.rowDataIncomplete",
  "pages.pricing.globalContext.northAmericaStripeScope",
  "pages.pricing.globalContext.northAmericaStripeScopeAria",
  "pages.pricing.globalContext.ackNorthAmericaBillingLabel",
  "pages.pricing.globalContext.mustAckBeforeCheckout",
  "pages.pricing.checkout.ctaJoinNorthAmericaPathways",
  "pages.pricing.checkout.northAmericaBillingSubcopy",
  "pages.pricing.checkout.continueToSecureCheckout",
  "pages.pricing.checkout.continueToNorthAmericaCheckout",
  "pages.pricing.conversion.ctaSubscribe",
  "pages.pricing.checkout.recurringShort",
  "pages.pricing.narrative.rn.subhead",
  "pages.pricing.narrative.rpn.subhead",
  "pages.pricing.narrative.lvn_lpn.subhead",
] as const;

function looksLikeLeakedFlatI18nKeyPath(v: string): boolean {
  const t = v.trim();
  if (!/^[a-z][a-z0-9_.]*$/i.test(t)) return false;
  return (
    t.startsWith("pages.") ||
    t.startsWith("nav.") ||
    t.startsWith("footer.") ||
    t.startsWith("components.") ||
    t.startsWith("brand.")
  );
}

describe("marketing production surface (en/pages + validate script)", () => {
  it("validate-marketing-production-surface.mjs exits 0 on the repo workspace", () => {
    execFileSync(process.execPath, [VALIDATE_SCRIPT], { cwd: PKG_ROOT, stdio: "inherit" });
  });

  it("required homepage + pricing keys are non-empty strings and not leaked i18n paths", () => {
    const pages = JSON.parse(readFileSync(PAGES_EN, "utf8")) as Record<string, unknown>;
    for (const key of REQUIRED_MARKETING_SURFACE_PAGE_KEYS) {
      const v = pages[key];
      assert.equal(typeof v, "string", `expected string for ${key}`);
      assert.ok((v as string).trim().length > 0, `expected non-empty ${key}`);
      assert.equal(
        looksLikeLeakedFlatI18nKeyPath(v as string),
        false,
        `value for ${key} must not look like a raw i18n path`,
      );
    }
  });

  it("en/pages.json passes strict placeholder scan (flat strings only)", () => {
    const pages = JSON.parse(readFileSync(PAGES_EN, "utf8")) as Record<string, unknown>;
    const hits = scanFlatMarketingMessagesForForbiddenValues("en/pages.json", pages);
    assert.deepEqual(hits, []);
  });
});
