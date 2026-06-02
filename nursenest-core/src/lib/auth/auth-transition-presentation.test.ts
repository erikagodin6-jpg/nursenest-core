import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createAuthTransitionTestTranslator } from "./auth-transition-en-fixtures";
import {
  inferLearnerIntentFromCallback,
  resolveAuthTransitionPresentation,
  resolveAuthWhatsNextSteps,
} from "./auth-transition-presentation";
import { inferAuthPathwaySegment } from "./auth-transition-governance-core";

const t = createAuthTransitionTestTranslator();

describe("resolveAuthTransitionPresentation", () => {
  it("composes email-verified full presentation with pathway steps", () => {
    const p = resolveAuthTransitionPresentation(
      {
        kind: "email-verified",
        layout: "full-page",
        pathwayId: "us-rn-nclex-rn",
        primaryActionHref: "/login?callbackUrl=%2Fapp%2Fflashcards",
      },
      t,
    );
    assert.match(p.title, /adaptive study/i);
    assert.equal(p.nextSteps.length, 3);
    assert.equal(p.watermarkStyle.hero, "panel-hero");
    assert.equal(p.motionPreset, "celebration");
    assert.ok(p.accessibilityAnnouncement.length > 10);
  });

  it("session-expired uses calm copy", () => {
    const p = resolveAuthTransitionPresentation({ kind: "session-expired" }, t);
    assert.match(p.title, /paused while you were away/i);
    assert.equal(p.tone, "info");
    assert.equal(p.motionPreset, "calm-recovery");
  });

  it("sign-in-success restores flashcard loading intent", () => {
    const p = resolveAuthTransitionPresentation(
      {
        kind: "sign-in-success",
        callbackUrl: "/app/flashcards?pathwayId=us-rn-nclex-rn",
      },
      t,
    );
    assert.match(p.loadingCopy.headline, /flashcard/i);
    assert.equal(p.motionPreset, "loading-strip");
  });

  it("sign-up-completion uses RN pathway loading headline", () => {
    const p = resolveAuthTransitionPresentation(
      {
        kind: "sign-up-completion",
        signupTier: "RN",
      },
      t,
    );
    assert.match(p.loadingCopy.headline, /NCLEX-RN/i);
  });

  it("magic-link expired variant", () => {
    const p = resolveAuthTransitionPresentation(
      {
        kind: "magic-link-confirmation",
        magicLinkVariant: "expired",
      },
      t,
    );
    assert.match(p.title, /expired/i);
  });

  it("inferLearnerIntentFromCallback detects CAT", () => {
    assert.equal(
      inferLearnerIntentFromCallback("/app/practice-tests/cat-launch?pathwayId=us-rn-nclex-rn"),
      "cat",
    );
  });
});

describe("resolveAuthWhatsNextSteps", () => {
  it("localizes RN step titles", () => {
    const steps = resolveAuthWhatsNextSteps("rn", "us-rn-nclex-rn", t);
    assert.match(steps[0]!.title, /flashcard/i);
    assert.match(steps[0]!.href, /pathwayId=/);
  });
});

describe("inferAuthPathwaySegment", () => {
  it("still resolves NP pathways", () => {
    assert.equal(inferAuthPathwaySegment("us-np-fnp"), "np");
  });
});
