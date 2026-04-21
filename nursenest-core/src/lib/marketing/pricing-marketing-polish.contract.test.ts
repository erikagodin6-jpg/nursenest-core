import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { marketingHeaderExposeSecondaryTracksInline } from "@/lib/navigation/marketing-header-pricing-surface";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.join(__dirname, "..", "..", "..");
const PAGES_EN = path.join(pkgRoot, "public", "i18n", "en", "pages.json");
const SITE_HEADER = path.join(pkgRoot, "src", "components", "layout", "site-header.tsx");
const PRICING_HERO = path.join(pkgRoot, "src", "components", "marketing", "pricing-hero.tsx");

describe("pricing marketing polish contracts", () => {
  it("English pricing headings use title case / question marks as agreed", () => {
    const pages = JSON.parse(fs.readFileSync(PAGES_EN, "utf8")) as Record<string, string>;
    assert.equal(pages["pages.pricing.conversionClarity.heading"], "Straight Answers Before You Subscribe");
    assert.equal(pages["pages.pricing.regionFaq.heading"], "Which Country and Exam Is This For?");
    assert.equal(pages["pages.pricing.reliabilityFaq.heading"], "Can I Count on NurseNest While I Study?");
    assert.equal(
      pages["pages.pricing.learnerFaq.heading"],
      "If You Are Worried About Money, Readiness, or Whether This Is for You",
    );
  });

  it("exposes secondary tracks inline on pricing paths", () => {
    assert.equal(marketingHeaderExposeSecondaryTracksInline("/pricing"), true);
    assert.equal(marketingHeaderExposeSecondaryTracksInline("/pricing/compare"), true);
    assert.equal(marketingHeaderExposeSecondaryTracksInline("/"), false);
  });

  it("site header guest CTAs share min height and dedicated guest secondary padding", () => {
    const src = fs.readFileSync(SITE_HEADER, "utf8");
    assert.match(src, /HEADER_GUEST_SECONDARY_ACTION_CLASS/);
    assert.match(src, /className=\{\`\$\{HEADER_GUEST_SECONDARY_ACTION_CLASS\} shrink-0 whitespace-nowrap`\}/);
    assert.match(
      src,
      /href=\{guestMarketingSignupHref\}[\s\S]*?className=\{\`\$\{HEADER_NAV_PRIMARY_CTA\} inline-flex min-h-\[44px\]/,
    );
  });

  it("pricing hero uses tighter top padding and a stable test id", () => {
    const src = fs.readFileSync(PRICING_HERO, "utf8");
    assert.match(src, /data-testid="pricing-marketing-hero"/);
    assert.match(src, /pt-14/);
    assert.ok(!src.includes("py-20"), "expected symmetric hero py-20 to be removed for tighter top rhythm");
  });
});
