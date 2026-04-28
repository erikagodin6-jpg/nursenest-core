import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketingI18nProvider } from "@/components/i18n/marketing-i18n-provider";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { humanizedMarketingKeyFallback } from "@/lib/marketing-i18n/marketing-message-value-policy";
import { resetMarketingMissingKeyDevWarningsForTests } from "@/lib/marketing-i18n/marketing-missing-key-dev-warn";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";

function MissingCopyProbe({ messageKey }: { messageKey: string }) {
  const { t } = useMarketingI18n();
  return createElement("span", { "data-testid": "probe" }, t(messageKey));
}

describe("MarketingI18nProvider missing-key safeguards", () => {
  const originalEnv = process.env.NODE_ENV;
  const warnings: unknown[] = [];
  let origWarn: typeof console.warn;

  beforeEach(() => {
    resetMarketingMissingKeyDevWarningsForTests();
    warnings.length = 0;
    origWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      warnings.push(args);
    };
  });

  afterEach(() => {
    console.warn = origWarn;
    Object.assign(process.env, { NODE_ENV: originalEnv });
    resetMarketingMissingKeyDevWarningsForTests();
  });

  it("does not render raw dotted keys when copy is missing", () => {
    Object.assign(process.env, { NODE_ENV: "development" });
    const messages: MarketingMessages = {
      "pages.smoke.anchor": "anchor",
    };
    const html = renderToStaticMarkup(
      createElement(
        MarketingI18nProvider,
        { locale: "en", messages, children: createElement(MissingCopyProbe, { messageKey: "pages.smoke.intentionallyMissing" }) },
      ),
    );
    assert.equal(html.includes("pages.smoke.intentionallyMissing"), false);
    assert.match(html, /Intentionally missing/i);
  });

  it("humanized fallback is readable (not a dotted path)", () => {
    const fb = humanizedMarketingKeyFallback("pages.pricing.conversionClarity.heading");
    assert.equal(fb.includes("."), false);
    assert.match(fb, /Heading/i);
  });

  it("logs missing keys once in development when catalog has entries", () => {
    Object.assign(process.env, { NODE_ENV: "development" });
    const messages: MarketingMessages = { "pages.smoke.anchor": "x" };
    renderToStaticMarkup(
      createElement(
        MarketingI18nProvider,
        {
          locale: "en",
          messages,
          children: createElement(MissingCopyProbe, { messageKey: "pages.smoke.duplicateMissing" }),
        },
      ),
    );
    renderToStaticMarkup(
      createElement(
        MarketingI18nProvider,
        {
          locale: "en",
          messages,
          children: createElement(MissingCopyProbe, { messageKey: "pages.smoke.duplicateMissing" }),
        },
      ),
    );
    const missingWarns = warnings.filter(
      (w) => Array.isArray(w) && w[0] === "[i18n] Missing marketing message key",
    );
    assert.equal(missingWarns.length, 1);
  });

  it("does not log missing keys in production", () => {
    Object.assign(process.env, { NODE_ENV: "production" });
    const messages: MarketingMessages = { "pages.smoke.anchor": "x" };
    renderToStaticMarkup(
      createElement(
        MarketingI18nProvider,
        {
          locale: "en",
          messages,
          children: createElement(MissingCopyProbe, { messageKey: "pages.smoke.prodMissing" }),
        },
      ),
    );
    assert.equal(warnings.length, 0);
  });
});
