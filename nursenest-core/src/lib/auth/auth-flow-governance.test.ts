import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildSessionExpiredLoginHref,
  resolveAuthReturnDestination,
  resolveAuthJsRedirectUrl,
  resolveLearnerStudyCallbackPath,
  resolveMarketingAuthRedirectTarget,
  resolveSessionExpiredCallbackPath,
  shouldSkipSessionExpiredRedirect,
  wrapWithOnboardingIfNeeded,
} from "@/lib/auth/auth-flow-governance";

describe("resolveLearnerStudyCallbackPath", () => {
  it("allows flashcards and analytics with query preserved", () => {
    const raw = "/app/flashcards?pathwayId=ca-rn-nclex-rn&cardLimit=25";
    assert.equal(resolveLearnerStudyCallbackPath(raw), raw);
    assert.equal(
      resolveLearnerStudyCallbackPath("/app/account/analytics"),
      "/app/account/analytics",
    );
  });

  it("rejects bare /app shell", () => {
    assert.equal(resolveLearnerStudyCallbackPath("/app"), null);
    assert.equal(resolveLearnerStudyCallbackPath("/app/"), null);
  });
});

describe("resolveAuthReturnDestination", () => {
  it("prefers learner study URLs over marketing home fallback", () => {
    assert.equal(
      resolveAuthReturnDestination("/app/practice-tests/cat-launch?pathwayId=us-rn-nclex-rn"),
      "/app/practice-tests/cat-launch?pathwayId=us-rn-nclex-rn",
    );
  });

  it("wraps onboarding when requested", () => {
    const wrapped = resolveAuthReturnDestination(
      "/app/flashcards?pathwayId=ca-rn-nclex-rn",
      { needsPathwayOnboarding: true },
    );
    assert.match(wrapped ?? "", /^\/app\/onboarding\?/);
    assert.match(wrapped ?? "", /callbackUrl=%2Fapp%2Fflashcards/);
  });
});

describe("resolveMarketingAuthRedirectTarget", () => {
  it("honors learner analytics deep link after login", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/account/analytics");
    assert.equal(resolveMarketingAuthRedirectTarget("/login", sp, "en"), "/app/account/analytics");
  });

  it("falls back to /app (not marketing home) when callback was a UUID session path", () => {
    // A practice session UUID cannot be restored — the session is gone after logout.
    // The user should land on the learner dashboard, not the marketing homepage.
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/practice-tests/550e8400-e29b-41d4-a716-446655440000");
    const result = resolveMarketingAuthRedirectTarget("/login", sp, "en");
    assert.equal(result, "/app");
  });

  it("still falls back to marketing home for non-app callbacks that can't be resolved", () => {
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "https://evil.example/phish");
    const result = resolveMarketingAuthRedirectTarget("/login", sp, "en");
    assert.match(result, /^\//);
    assert.ok(!result.includes("evil.example"));
  });
});

describe("resolveAuthJsRedirectUrl", () => {
  it("blocks external open redirects", () => {
    assert.equal(
      resolveAuthJsRedirectUrl("https://evil.example/phish", "https://www.nursenest.ca"),
      "https://www.nursenest.ca/login",
    );
  });

  it("allows same-origin learner destinations", () => {
    assert.equal(
      resolveAuthJsRedirectUrl("/app/questions?pathwayId=us-rn-nclex-rn", "https://www.nursenest.ca"),
      "/app/questions?pathwayId=us-rn-nclex-rn",
    );
  });

  it("falls back to learner home for malformed study callbacks", () => {
    assert.equal(
      resolveAuthJsRedirectUrl("/app/flashcards", "https://www.nursenest.ca"),
      "/app",
    );
    assert.equal(
      resolveAuthJsRedirectUrl("https://www.nursenest.ca/app/flashcards", "https://www.nursenest.ca"),
      "https://www.nursenest.ca/app",
    );
  });

  it("preserves direct deck launch callbacks after sign-in", () => {
    assert.equal(
      resolveAuthJsRedirectUrl("/app/flashcards/cardiac-rhythm-basics?start=1&shuffle=1", "https://www.nursenest.ca"),
      "/app/flashcards/cardiac-rhythm-basics?start=1&shuffle=1",
    );
  });
});

describe("wrapWithOnboardingIfNeeded", () => {
  it("embeds callbackUrl for post-onboarding resume", () => {
    const out = wrapWithOnboardingIfNeeded("/app/cat?pathwayId=us-rn-nclex-rn", true);
    assert.match(out, /callbackUrl=/);
  });
});

describe("session expired recovery hrefs", () => {
  it("preserves learner CAT path with session=expired", () => {
    const href = buildSessionExpiredLoginHref(
      "/app/cat?pathwayId=us-rn-nclex-rn#section",
      "en",
    );
    assert.match(href, /session=expired/);
    assert.match(href, /callbackUrl=/);
    assert.match(href, /cat/);
  });

  it("resolves flashcards callback for expiry redirect", () => {
    const path = resolveSessionExpiredCallbackPath("/app/flashcards?pathwayId=ca-rn-nclex-rn");
    assert.match(path, /flashcards/);
  });

  it("skips loop when login already has session=expired", () => {
    assert.equal(shouldSkipSessionExpiredRedirect("/login", "session=expired"), true);
    assert.equal(shouldSkipSessionExpiredRedirect("/app/cat", ""), false);
  });
});
