import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { marketingResumeCallbackFromLocation, postLoginMarketingHomePath } from "@/lib/auth/post-login-resume-path";

describe("marketingResumeCallbackFromLocation", () => {
  it("returns localized home for bare /login", () => {
    assert.equal(marketingResumeCallbackFromLocation("/login", "", "en"), "/");
    assert.equal(marketingResumeCallbackFromLocation("/login", "", "fr"), "/fr");
  });

  it("returns localized home for locale-prefixed login", () => {
    assert.equal(marketingResumeCallbackFromLocation("/fr/login", "?x=1", "fr"), "/fr");
  });

  it("preserves marketing pricing path + query", () => {
    assert.equal(marketingResumeCallbackFromLocation("/pricing", "?plan=pro", "en"), "/pricing?plan=pro");
    assert.equal(marketingResumeCallbackFromLocation("/fr/pricing", "", "fr"), "/fr/pricing");
  });

  it("blocks API paths", () => {
    assert.equal(marketingResumeCallbackFromLocation("/api/healthz", "", "en"), "/");
  });
});

describe("postLoginMarketingHomePath", () => {
  it("matches withMarketingLocale contract", () => {
    assert.equal(postLoginMarketingHomePath("en"), "/");
    assert.match(postLoginMarketingHomePath("fr"), /^\/fr\/?$/);
  });
});
