import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isLocaleRobotsPathDisallowed } from "@/lib/i18n/language-readiness";

/**
 * robots.txt must only Disallow `incomplete` locales — never `partial` (hreflang + noindex).
 */
describe("isLocaleRobotsPathDisallowed (robots.txt vs partial locales)", () => {
  it("never disallows default English", () => {
    assert.equal(isLocaleRobotsPathDisallowed("en"), false);
  });

  it("never disallows full-tier locales", () => {
    assert.equal(isLocaleRobotsPathDisallowed("fr"), false);
    assert.equal(isLocaleRobotsPathDisallowed("es"), false);
  });

  it("never disallows partial-tier locales (Tagalog, Hindi)", () => {
    assert.equal(isLocaleRobotsPathDisallowed("tl"), false);
    assert.equal(isLocaleRobotsPathDisallowed("hi"), false);
  });

  it("disallows incomplete-tier locales", () => {
    assert.equal(isLocaleRobotsPathDisallowed("ta"), true);
    assert.equal(isLocaleRobotsPathDisallowed("de"), true);
    assert.equal(isLocaleRobotsPathDisallowed("zh"), true);
  });
});
