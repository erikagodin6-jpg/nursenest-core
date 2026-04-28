import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketingI18nProvider } from "@/components/i18n/marketing-i18n-provider";
import { PricingConversionClarity } from "@/components/marketing/pricing-conversion-clarity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.join(__dirname, "..", "..", "..");
const PAGES_EN = path.join(pkgRoot, "public", "i18n", "en", "pages.json");

describe("PricingConversionClarity smoke (en pages.json)", () => {
  it("renders real English strings and no raw i18n key paths", () => {
    const raw = fs.readFileSync(PAGES_EN, "utf8");
    const pages = JSON.parse(raw) as Record<string, string>;

    const html = renderToStaticMarkup(
      createElement(MarketingI18nProvider, {
        locale: "en",
        messages: pages,
        children: createElement(PricingConversionClarity),
      }),
    );

    const lower = html.toLowerCase();
    assert.equal(lower.includes("pages.pricing."), false);
    assert.equal(lower.includes("conversionclarity"), false);

    assert.match(html, /Know exactly what you're getting/);
    assert.match(html, /What's included in every paid plan/);
    assert.match(html, /Not included/);
    assert.match(html, /Cancel anytime/);
    assert.match(html, /Secure checkout/);
  });
});
