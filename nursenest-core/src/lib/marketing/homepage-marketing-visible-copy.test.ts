import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isUntranslatedHomepageMarketingCopy,
  safeHomepageMarketingT,
} from "@/lib/marketing/homepage-marketing-visible-copy";

describe("homepage-marketing-visible-copy", () => {
  it("treats raw placeholders and homepage key paths as unsafe", () => {
    for (const value of ["KICKER", "Lead", "Title", "Body", "Link", "pages.home.hero.missing"]) {
      assert.equal(
        isUntranslatedHomepageMarketingCopy(value, "pages.home.hero.headline"),
        true,
        value,
      );
    }
  });

  it("renders caller-provided human fallback when the i18n provider returns placeholder tails", () => {
    const t = (key: string) => (key.endsWith(".title") ? "Title" : key);
    assert.equal(
      safeHomepageMarketingT(t, "pages.home.stablePlaceholder.study.title", "Study tools that stay exam-scoped"),
      "Study tools that stay exam-scoped",
    );
  });
});
