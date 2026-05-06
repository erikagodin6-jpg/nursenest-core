import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectMarketingDomPlaceholderViolations,
  normalizeMarketingDomText,
} from "@/lib/validation/forbidden-production-text";

describe("forbidden-marketing-placeholders (unit)", () => {
  it("flags standalone placeholder lines and shouty tokens", () => {
    const body = ["Real headline", "Title", "More copy", "KICKER", "Body", "Link"].join("\n");
    const v = collectMarketingDomPlaceholderViolations(body);
    const kinds = new Set(v.map((x) => x.kind));
    assert.equal(kinds.has("standalone_line"), true);
    assert.equal(kinds.has("shouty_token"), true);
    assert.ok(v.some((x) => x.kind === "standalone_line" && x.line === "Body"));
    assert.ok(v.some((x) => x.kind === "standalone_line" && x.line === "Link"));
  });

  it("flags leaked flat i18n key as its own line", () => {
    const body = "Welcome\npages.home.hero.missingKey\nFooter";
    const v = collectMarketingDomPlaceholderViolations(body);
    assert.ok(v.some((x) => x.kind === "leaked_key_line"));
  });

  it("allows normal prose without false positives on single forbidden substrings", () => {
    const body = "Pass your NCLEX with structured lessons and practice questions.";
    assert.deepEqual(collectMarketingDomPlaceholderViolations(body), []);
  });

  it("normalizeMarketingDomText collapses horizontal space and caps blank runs", () => {
    assert.equal(normalizeMarketingDomText("  a \n\n\n  b  "), "a \n\n b");
  });
});
