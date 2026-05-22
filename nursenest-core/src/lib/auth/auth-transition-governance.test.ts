import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  authLeafOpacityForPlacement,
  inferAuthPathwaySegment,
  resolveAuthWhatsNextSteps,
  resolveEmailVerifiedPresentation,
  resolveSessionExpiredPresentation,
  resolveSignInSuccessPresentation,
  resolveAuthLoadingPresentation,
  resolveAuthenticationErrorPresentation,
} from "./auth-transition-governance";

describe("auth-transition-governance", () => {
  it("infers RN segment from NCLEX-RN pathway id", () => {
    assert.equal(inferAuthPathwaySegment("us-rn-nclex-rn"), "rn");
    assert.equal(inferAuthPathwaySegment("ca-rn-nclex-rn"), "rn");
  });

  it("infers RPN segment from PN pathway ids", () => {
    assert.equal(inferAuthPathwaySegment("us-lpn-nclex-pn"), "rpn");
    assert.equal(inferAuthPathwaySegment("ca-pn-rex-pn"), "rpn");
  });

  it("infers NP segment from NP pathway ids", () => {
    assert.equal(inferAuthPathwaySegment("us-np-fnp"), "np");
    assert.equal(inferAuthPathwaySegment("ca-np-cnple"), "np");
  });

  it("returns RN whats-next steps with pathway query", () => {
    const steps = resolveAuthWhatsNextSteps("rn", "us-rn-nclex-rn");
    assert.equal(steps.length, 3);
    assert.match(steps[0]!.href, /pathwayId=us-rn-nclex-rn/);
    assert.match(steps[0]!.title, /flashcard/i);
  });

  it("email verified copy is motivational not utility", () => {
    const copy = resolveEmailVerifiedPresentation("us-rn-nclex-rn");
    assert.match(copy.title, /adaptive study/i);
    assert.doesNotMatch(copy.title, /Your email is verified/i);
  });

  it("session expired uses calm recovery language", () => {
    const copy = resolveSessionExpiredPresentation(null);
    assert.match(copy.title, /paused while you were away/i);
    assert.match(copy.message, /saved/i);
  });

  it("sign-in success uses Resume for CAT callback", () => {
    const pres = resolveSignInSuccessPresentation("/app/practice-tests/cat-launch?pathwayId=us-rn-nclex-rn");
    assert.equal(pres.ctaLabel, "Resume");
    assert.match(pres.loading.headline, /CAT/i);
  });

  it("sign-in success uses Continue for flashcards", () => {
    const pres = resolveSignInSuccessPresentation("/app/flashcards?pathwayId=ca-rn-nclex-rn");
    assert.equal(pres.ctaLabel, "Continue");
    assert.match(pres.loading.headline, /flashcard/i);
  });

  it("loading presentation for oauth continuation", () => {
    const loading = resolveAuthLoadingPresentation("oauth-continuation");
    assert.match(loading.headline, /Restoring/i);
  });

  it("watermark hero opacity within spec band", () => {
    const o = authLeafOpacityForPlacement("panel-hero");
    assert.ok(o >= 0.06 && o <= 0.1);
  });

  it("maps OAuthAccountNotLinked without throwing", () => {
    const err = resolveAuthenticationErrorPresentation("OAuthAccountNotLinked");
    assert.ok(err);
    assert.match(err!.title, /sign-in method/i);
  });
});
