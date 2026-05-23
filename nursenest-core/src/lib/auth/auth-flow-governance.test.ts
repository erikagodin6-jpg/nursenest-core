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

  it("falls back to /app (not marketing home) when callback was a stripped /app/* path", () => {
    // e.g. /app/practice-tests/abc123 is a session-specific URL with no pathwayId — blocked
    // but the user should land on the learner dashboard, not the marketing homepage
    const sp = new URLSearchParams();
    sp.set("callbackUrl", "/app/practice-tests/abc-session-uuid");
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
