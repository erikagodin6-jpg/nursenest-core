import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  marketingResumeCallbackFromLocation,
  postLoginMarketingHomePath,
  resolveMarketingAuthRedirectTarget,
} from "@/lib/auth/post-login-resume-path";

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

describe("resolveMarketingAuthRedirectTarget", () => {
  it("ignores learner /app callbacks and falls back to marketing resume", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/");
  });

  it("keeps deep learner callbacks such as /app/lessons", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/lessons");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/app/lessons");
  });

  it("honors marketing callback paths", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/pricing");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/pricing");
  });

  it("ignores generic /app callback and resumes current marketing path", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app");
    assert.equal(resolveMarketingAuthRedirectTarget("/us/rn/nclex-rn/lessons", sp, "en"), "/us/rn/nclex-rn/lessons");
  });

  it("sends blocked auth pages to localized home when callback is learner shell", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/");
    assert.match(resolveMarketingAuthRedirectTarget("/fr/login", sp, "fr"), /^\/fr\/?$/);
  });
});
