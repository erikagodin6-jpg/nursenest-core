import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  marketingResumeCallbackFromLocation,
  postLoginMarketingHomePath,
  resolveMarketingAuthRedirectTarget,
} from "@/lib/auth/post-login-resume-path";

describe("marketingResumeCallbackFromLocation", () => {
  it("returns /app for bare /login (never marketing /)", () => {
    assert.equal(marketingResumeCallbackFromLocation("/login", "", "en"), "/app");
    assert.equal(marketingResumeCallbackFromLocation("/login", "", "fr"), "/app");
  });

  it("returns /app for locale-prefixed login", () => {
    assert.equal(marketingResumeCallbackFromLocation("/fr/login", "?x=1", "fr"), "/app");
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
  it("ignores bare /app callback on login and falls back to /app", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/app");
  });

  it("ignores deep /app routes as callbacks on auth pages", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/lessons");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/app");
  });

  it("honors marketing callback paths", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/pricing");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/pricing");
    sp.delete("callbackUrl");
    sp.set("callbackUrl", "/blog");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/blog");
  });

  it("ignores /api callback and resumes current marketing path", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/api/auth/session");
    assert.equal(resolveMarketingAuthRedirectTarget("/blog", sp, "en"), "/blog");
  });

  it("honors marketing callback with query on path", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/login?foo=bar");
    assert.equal(resolveMarketingAuthRedirectTarget("/signup", sp, "en"), "/login?foo=bar");
  });

  it("honors locale-prefixed marketing paths as callback", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/fr/pricing");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/fr/pricing");
  });

  it("ignores generic /app callback and resumes current marketing path", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app");
    assert.equal(resolveMarketingAuthRedirectTarget("/us/rn/nclex-rn/lessons", sp, "en"), "/us/rn/nclex-rn/lessons");
  });

  it("ignores /app/lessons callback and resumes marketing path when on marketing", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/lessons");
    assert.equal(resolveMarketingAuthRedirectTarget("/question-bank", sp, "en"), "/question-bank");
  });

  it("sends blocked auth pages to /app when callback is bare /app", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/app");
    assert.equal(resolveMarketingAuthRedirectTarget("/fr/login", sp, "fr"), "/app");
  });
});
