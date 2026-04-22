import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  marketingResumeCallbackFromLocation,
  postLoginMarketingHomePath,
  resolveMarketingAuthRedirectTarget,
} from "@/lib/auth/post-login-resume-path";

describe("marketingResumeCallbackFromLocation", () => {
  it("returns marketing home for bare /login (shared site, not learner shell)", () => {
    assert.equal(marketingResumeCallbackFromLocation("/login", "", "en"), "/");
    assert.match(marketingResumeCallbackFromLocation("/login", "", "fr"), /^\/fr\/?$/);
  });

  it("returns marketing home for locale-prefixed login", () => {
    assert.match(marketingResumeCallbackFromLocation("/fr/login", "?x=1", "fr"), /^\/fr\/?/);
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
  it("ignores bare /app callback on login and falls back to marketing home", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/");
  });

  it("ignores deep /app routes as callbacks on auth pages", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/lessons");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/");
  });

  it("honors marketing callback paths", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/pricing");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/pricing");
    sp.delete("callbackUrl");
    sp.set("callbackUrl", "/blog");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/blog");
  });

  it("ignores /api callback and falls back to marketing home", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/api/auth/session");
    assert.equal(resolveMarketingAuthRedirectTarget("/blog", sp, "en"), "/");
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

  it("ignores generic /app callback and falls back to marketing home", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app");
    assert.equal(resolveMarketingAuthRedirectTarget("/us/rn/nclex-rn/lessons", sp, "en"), "/");
  });

  it("ignores /app/lessons callback and falls back to marketing home", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/lessons");
    assert.equal(resolveMarketingAuthRedirectTarget("/question-bank", sp, "en"), "/");
  });

  it("honors tier-scoped /app/questions?pathwayId=… callback after login", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/questions?pathwayId=us-rn-nclex-rn");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/app/questions?pathwayId=us-rn-nclex-rn");
  });

  it("honors tier-scoped /app/practice-tests/start?pathwayId=… callback after login", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/practice-tests/start?pathwayId=us-lpn-nclex-pn");
    assert.equal(
      resolveMarketingAuthRedirectTarget("/login", sp, "en"),
      "/app/practice-tests/start?pathwayId=us-lpn-nclex-pn",
    );
  });

  it("honors tier-scoped /app/flashcards?pathwayId=… callback after login", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/flashcards?pathwayId=ca-rn-nclex-rn");
    assert.equal(
      resolveMarketingAuthRedirectTarget("/login", sp, "en"),
      "/app/flashcards?pathwayId=ca-rn-nclex-rn",
    );
  });

  it("rejects tier-scoped app callback when pathwayId is not a safe slug (no silent substitute)", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/flashcards?pathwayId=../../admin");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/");
    sp.set("callbackUrl", "/app/questions?pathwayId=bad");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/");
  });

  it("honors marketing pathway hub callbacks (country prefix preserved)", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/canada/rn/nclex-rn/questions");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/canada/rn/nclex-rn/questions");
    sp.set("callbackUrl", "/us/pn/nclex-pn/cat");
    assert.equal(resolveMarketingAuthRedirectTarget("/signup", sp, "en"), "/us/pn/nclex-pn/cat");
  });

  it("preserves Canadian marketing lesson hub and does not rewrite to US", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/canada/rn/nclex-rn/lessons");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/canada/rn/nclex-rn/lessons");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en").startsWith("/us/"), false);
  });

  it("preserves locale-prefixed Canadian pathway URLs (tier + country + UI language)", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/fr/canada/pn/rex-pn/questions");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "fr"), "/fr/canada/pn/rex-pn/questions");
  });

  it("honors tier-scoped app callback with Canada pathway id (country encoded in pathwayId)", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/questions?pathwayId=ca-rn-nclex-rn");
    assert.equal(
      resolveMarketingAuthRedirectTarget("/signup", sp, "en"),
      "/app/questions?pathwayId=ca-rn-nclex-rn",
    );
  });

  it("sends blocked auth pages to marketing home when callback is bare /app", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/");
    assert.match(resolveMarketingAuthRedirectTarget("/fr/login", sp, "fr"), /^\/fr\/?$/);
  });
});
