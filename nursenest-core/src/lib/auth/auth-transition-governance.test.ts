import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  authLeafOpacityForPlacement,
  inferAuthPathwaySegment,
  resolveAuthTransitionContext,
} from "./auth-transition-governance-core";
import { createAuthTransitionTestTranslator } from "./auth-transition-en-fixtures";
import { resolveAuthTransitionPresentation } from "./auth-transition-presentation";

const t = createAuthTransitionTestTranslator();

describe("auth-transition-governance-core", () => {
  it("infers pathway segments", () => {
    assert.equal(inferAuthPathwaySegment("us-rn-nclex-rn"), "rn");
    assert.equal(inferAuthPathwaySegment("us-lpn-nclex-pn"), "rpn");
    assert.equal(inferAuthPathwaySegment("us-np-fnp"), "np");
  });

  it("watermark hero opacity within spec band", () => {
    const o = authLeafOpacityForPlacement("panel-hero");
    assert.ok(o >= 0.06 && o <= 0.1);
  });

  it("resolveAuthTransitionContext preserves study hints", () => {
    const ctx = resolveAuthTransitionContext("/app/flashcards?pathwayId=us-rn-nclex-rn");
    assert.equal(ctx.segment, "rn");
    assert.ok(ctx.studyHint);
  });
});

describe("auth-transition composition API", () => {
  it("resolveAuthTransitionPresentation maps OAuth errors", () => {
    const p = resolveAuthTransitionPresentation(
      { kind: "authentication-error", error: "OAuthAccountNotLinked" },
      t,
    );
    assert.ok(p.title.length > 0);
    assert.equal(p.tone, "info");
  });
});
