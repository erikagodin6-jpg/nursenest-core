import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  STUDY_ROUTE_PREFIXES,
  hasSessionIdSegment,
  isLearnerDeepLinkPath,
  isProtectedStudyRoute,
  isStudyRoutePath,
  isValidAuthReturnPath,
  isValidPathwayId,
  normalizeStudyCallback,
} from "@/lib/auth/protected-study-routes";

const RN = "us-rn-nclex-rn";
const PN = "us-lpn-nclex-pn";
const ALLIED = "us-allied-core";

// ─── isStudyRoutePath ─────────────────────────────────────────────────────────

describe("isStudyRoutePath", () => {
  it("matches every registered prefix exactly", () => {
    for (const prefix of STUDY_ROUTE_PREFIXES) {
      assert.ok(isStudyRoutePath(prefix), `expected match for prefix: ${prefix}`);
    }
  });

  it("matches sub-routes of every registered prefix", () => {
    assert.ok(isStudyRoutePath("/app/flashcards/custom"));
    assert.ok(isStudyRoutePath("/app/flashcards/weak-areas"));
    assert.ok(isStudyRoutePath("/app/flashcards/nclex-rn-fundamentals"));
    assert.ok(isStudyRoutePath("/app/practice-tests"));
    assert.ok(isStudyRoutePath("/app/practice-tests/cat-launch"));
    assert.ok(isStudyRoutePath("/app/questions/bank"));
    assert.ok(isStudyRoutePath("/app/questions/session"));
    assert.ok(isStudyRoutePath("/app/exams/attempts/some-id"));
  });

  it("does not match non-study learner routes", () => {
    assert.equal(isStudyRoutePath("/app/lessons"), false);
    assert.equal(isStudyRoutePath("/app/account/analytics"), false);
    assert.equal(isStudyRoutePath("/app/study-plan"), false);
    assert.equal(isStudyRoutePath("/app"), false);
  });

  it("does not falsely match on prefix substrings", () => {
    // /app/flashcards-extra must NOT match /app/flashcards
    assert.equal(isStudyRoutePath("/app/flashcards-extra"), false);
    assert.equal(isStudyRoutePath("/app/practice-testsXYZ"), false);
    assert.equal(isStudyRoutePath("/app/questions2"), false);
  });
});

// ─── hasSessionIdSegment ──────────────────────────────────────────────────────

describe("hasSessionIdSegment", () => {
  it("detects UUID v4 in practice-test session paths", () => {
    assert.ok(hasSessionIdSegment("/app/practice-tests/550e8400-e29b-41d4-a716-446655440000"));
    assert.ok(hasSessionIdSegment("/app/practice-tests/00000000-0000-0000-0000-000000000001"));
  });

  it("detects Prisma CUID segments", () => {
    assert.ok(hasSessionIdSegment("/app/practice-tests/clxyz1234567890abcdefghijk"));
    assert.ok(hasSessionIdSegment("/app/practice-tests/cm1abc123def456ghi78jkl9m"));
  });

  it("detects CUID2-style 20+ char lowercase alphanumeric segments", () => {
    assert.ok(hasSessionIdSegment("/app/practice-tests/abcdefghij0123456789ab"));
  });

  it("does not flag short readable route keywords", () => {
    assert.equal(hasSessionIdSegment("/app/flashcards/custom"), false);
    assert.equal(hasSessionIdSegment("/app/flashcards/weak-areas"), false);
    assert.equal(hasSessionIdSegment("/app/questions/bank"), false);
    assert.equal(hasSessionIdSegment("/app/practice-tests/start"), false);
    assert.equal(hasSessionIdSegment("/app/practice-tests/cat-launch"), false);
    assert.equal(hasSessionIdSegment("/app/practice-tests/cat-insights"), false);
  });

  it("does not flag deck slugs with hyphens", () => {
    assert.equal(hasSessionIdSegment("/app/flashcards/nclex-rn-fundamentals"), false);
    assert.equal(hasSessionIdSegment("/app/flashcards/pharmacology-basics-2026"), false);
    assert.equal(hasSessionIdSegment("/app/flashcards/advanced-maternal-newborn-nursing"), false);
  });

  it("does not flag the route prefix segment itself", () => {
    assert.equal(hasSessionIdSegment("/app/flashcards"), false);
    assert.equal(hasSessionIdSegment("/app/practice-tests"), false);
    assert.equal(hasSessionIdSegment("/app/questions"), false);
  });
});

// ─── isProtectedStudyRoute ────────────────────────────────────────────────────

describe("isProtectedStudyRoute", () => {
  it("accepts hub paths", () => {
    assert.ok(isProtectedStudyRoute("/app/flashcards"));
    assert.ok(isProtectedStudyRoute("/app/practice-tests"));
    assert.ok(isProtectedStudyRoute("/app/questions"));
  });

  it("accepts named keyword sub-routes", () => {
    assert.ok(isProtectedStudyRoute("/app/flashcards/custom"));
    assert.ok(isProtectedStudyRoute("/app/flashcards/weak-areas"));
    assert.ok(isProtectedStudyRoute("/app/questions/bank"));
    assert.ok(isProtectedStudyRoute("/app/practice-tests/start"));
    assert.ok(isProtectedStudyRoute("/app/practice-tests/cat-launch"));
  });

  it("accepts dynamic deckRef paths (slugs)", () => {
    assert.ok(isProtectedStudyRoute("/app/flashcards/nclex-rn-fundamentals"));
    assert.ok(isProtectedStudyRoute("/app/flashcards/pharmacology-basics-2026"));
  });

  it("rejects practice session UUID paths", () => {
    assert.equal(
      isProtectedStudyRoute("/app/practice-tests/550e8400-e29b-41d4-a716-446655440000"),
      false,
    );
    assert.equal(
      isProtectedStudyRoute("/app/practice-tests/clxyz1234567890abcdefghijk"),
      false,
    );
  });

  it("rejects non-study paths", () => {
    assert.equal(isProtectedStudyRoute("/app/lessons"), false);
    assert.equal(isProtectedStudyRoute("/app"), false);
    assert.equal(isProtectedStudyRoute("/login"), false);
  });
});

// ─── isValidPathwayId ─────────────────────────────────────────────────────────

describe("isValidPathwayId", () => {
  it("accepts canonical pathway IDs", () => {
    assert.ok(isValidPathwayId(RN));
    assert.ok(isValidPathwayId(PN));
    assert.ok(isValidPathwayId(ALLIED));
    assert.ok(isValidPathwayId("ca-rn-nclex-rn"));
    assert.ok(isValidPathwayId("ca-rpn-rex-pn"));
  });

  it("rejects short or malformed IDs", () => {
    assert.equal(isValidPathwayId("RN"), false);   // uppercase, too short
    assert.equal(isValidPathwayId("bad"), false);  // too short
    assert.equal(isValidPathwayId(""), false);
    assert.equal(isValidPathwayId(null), false);
    assert.equal(isValidPathwayId(undefined), false);
  });

  it("rejects IDs with disallowed characters", () => {
    assert.equal(isValidPathwayId("us rn nclex"), false); // spaces
    assert.equal(isValidPathwayId("us_rn_nclex_rn"), false); // underscores
  });
});

// ─── isValidAuthReturnPath ────────────────────────────────────────────────────

describe("isValidAuthReturnPath", () => {
  it("accepts learner study paths", () => {
    assert.ok(isValidAuthReturnPath("/app/flashcards"));
    assert.ok(isValidAuthReturnPath(`/app/flashcards?pathwayId=${RN}`));
    assert.ok(isValidAuthReturnPath("/app/flashcards/custom"));
    assert.ok(isValidAuthReturnPath("/app/lessons"));
    assert.ok(isValidAuthReturnPath("/app/account/analytics"));
  });

  it("rejects bare /app shell", () => {
    assert.equal(isValidAuthReturnPath("/app"), false);
    assert.equal(isValidAuthReturnPath("/app/"), false);
  });

  it("rejects API routes", () => {
    assert.equal(isValidAuthReturnPath("/api/flashcards"), false);
    assert.equal(isValidAuthReturnPath("/api/auth/session"), false);
  });

  it("rejects auth pages", () => {
    assert.equal(isValidAuthReturnPath("/login"), false);
    assert.equal(isValidAuthReturnPath("/signup"), false);
    assert.equal(isValidAuthReturnPath("/forgot-password"), false);
    assert.equal(isValidAuthReturnPath("/reset-password/token"), false);
  });

  it("rejects non-path values", () => {
    assert.equal(isValidAuthReturnPath("https://evil.example"), false);
    assert.equal(isValidAuthReturnPath(""), false);
    assert.equal(isValidAuthReturnPath(null), false);
  });
});

// ─── normalizeStudyCallback ───────────────────────────────────────────────────

describe("normalizeStudyCallback — hub routes (require pathwayId)", () => {
  it("allows flashcard hub with pathwayId", () => {
    const u = `/app/flashcards?pathwayId=${RN}`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("allows practice-tests hub with pathwayId and catLaunch", () => {
    const u = `/app/practice-tests?pathwayId=${RN}&catLaunch=1`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("allows practice exam setup callback without pathwayId", () => {
    const u = "/app/practice-tests";
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("allows CAT setup callback without pathwayId", () => {
    const u = "/app/practice-tests?cat=1";
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("allows questions hub with pathwayId", () => {
    const u = `/app/questions?pathwayId=${PN}`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("allows practice-exams hub with pathwayId", () => {
    const u = `/app/practice-exams?pathwayId=${RN}`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("allows cat hub with pathwayId", () => {
    const u = `/app/cat?pathwayId=${RN}`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("rejects flashcard hub without pathwayId", () => {
    assert.equal(normalizeStudyCallback("/app/flashcards"), null);
  });

  it("allows unified practice setup without pathwayId", () => {
    assert.equal(normalizeStudyCallback("/app/practice-tests"), "/app/practice-tests");
  });

  it("rejects questions hub without pathwayId", () => {
    assert.equal(normalizeStudyCallback("/app/questions"), null);
  });

  it("rejects cat hub without pathwayId", () => {
    assert.equal(normalizeStudyCallback("/app/cat"), null);
  });
});

describe("normalizeStudyCallback — named sub-routes (pathwayId optional)", () => {
  it("allows flashcard study session with pathwayId", () => {
    const u = `/app/flashcards/custom?pathwayId=${RN}&cardLimit=20&shuffle=1`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("allows flashcard weak-areas session with pathwayId", () => {
    const u = `/app/flashcards/weak-areas?pathwayId=${RN}`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("allows question bank drill with pathwayId", () => {
    const u = `/app/questions/bank?pathwayId=${RN}`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("allows unified practice setup with pathwayId", () => {
    const u = `/app/practice-tests?pathwayId=${PN}&source=mixed_review&count=20`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("allows CAT launch with pathwayId", () => {
    const u = `/app/practice-tests/cat-launch?pathwayId=${RN}`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("allows CAT launch intent on unified practice setup with pathwayId", () => {
    const u = `/app/practice-tests?pathwayId=${PN}&catLaunch=1`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("allows named sub-routes WITHOUT pathwayId (content-addressed)", () => {
    assert.equal(normalizeStudyCallback("/app/flashcards/custom"), "/app/flashcards/custom");
    assert.equal(normalizeStudyCallback("/app/questions/bank"), "/app/questions/bank");
    assert.equal(normalizeStudyCallback("/app/practice-tests"), "/app/practice-tests");
  });

  it("rejects sub-routes with a malformed pathwayId", () => {
    assert.equal(normalizeStudyCallback("/app/flashcards/custom?pathwayId=bad"), null);
    assert.equal(normalizeStudyCallback("/app/questions/bank?pathwayId=RN"), null);
    assert.equal(normalizeStudyCallback("/app/flashcards?pathwayId=x"), null);
  });
});

describe("normalizeStudyCallback — dynamic deckRef paths", () => {
  it("allows known deckRef slug without pathwayId", () => {
    assert.equal(
      normalizeStudyCallback("/app/flashcards/nclex-rn-fundamentals"),
      "/app/flashcards/nclex-rn-fundamentals",
    );
  });

  it("allows long deckRef slugs", () => {
    assert.equal(
      normalizeStudyCallback("/app/flashcards/advanced-maternal-newborn-nursing-exam-prep"),
      "/app/flashcards/advanced-maternal-newborn-nursing-exam-prep",
    );
  });

  it("allows deckRef with pathwayId when provided", () => {
    const u = `/app/flashcards/nclex-rn-fundamentals?pathwayId=${RN}`;
    assert.equal(normalizeStudyCallback(u), u);
  });
});

describe("normalizeStudyCallback — session UUID paths (must be rejected)", () => {
  it("rejects practice session by UUID v4", () => {
    assert.equal(
      normalizeStudyCallback("/app/practice-tests/550e8400-e29b-41d4-a716-446655440000"),
      null,
    );
  });

  it("rejects practice session by CUID", () => {
    assert.equal(
      normalizeStudyCallback("/app/practice-tests/clxyz1234567890abcdefghijk"),
      null,
    );
  });

  it("rejects practice session results by UUID", () => {
    assert.equal(
      normalizeStudyCallback("/app/practice-tests/550e8400-e29b-41d4-a716-446655440000/results"),
      null,
    );
  });
});

describe("normalizeStudyCallback — security: malicious / malformed inputs", () => {
  it("rejects external URLs (different origin)", () => {
    // URL parser sees host as "evil.example", not "localhost"
    assert.equal(
      normalizeStudyCallback(`https://evil.example/app/flashcards?pathwayId=${RN}`),
      null,
    );
  });

  it("rejects protocol-relative URLs", () => {
    assert.equal(normalizeStudyCallback(`//evil.example/app/flashcards?pathwayId=${RN}`), null);
  });

  it("rejects non-study learner paths", () => {
    assert.equal(normalizeStudyCallback(`/app/lessons?pathwayId=${RN}`), null);
    assert.equal(normalizeStudyCallback("/app/account/analytics"), null);
    assert.equal(normalizeStudyCallback("/app"), null);
  });

  it("rejects auth pages", () => {
    assert.equal(normalizeStudyCallback("/login?callbackUrl=/app/flashcards"), null);
    assert.equal(normalizeStudyCallback("/signup"), null);
  });

  it("rejects null, empty, and whitespace", () => {
    assert.equal(normalizeStudyCallback(null), null);
    assert.equal(normalizeStudyCallback(undefined), null);
    assert.equal(normalizeStudyCallback(""), null);
    assert.equal(normalizeStudyCallback("   "), null);
  });

  it("rejects malformed URL strings", () => {
    assert.equal(normalizeStudyCallback("not-a-url"), null);
  });
});

describe("normalizeStudyCallback — query param and hash preservation", () => {
  it("preserves all query params", () => {
    const u = `/app/flashcards/custom?pathwayId=${RN}&cardLimit=20&shuffle=1&weakOnly=1`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("preserves hash fragment", () => {
    const u = `/app/flashcards/custom?pathwayId=${RN}#section-2`;
    assert.equal(normalizeStudyCallback(u), u);
  });

  it("preserves CAT launch params", () => {
    const u = `/app/practice-tests?pathwayId=${RN}&catLaunch=1&alliedProfession=rn`;
    assert.equal(normalizeStudyCallback(u), u);
  });
});

// ─── isLearnerDeepLinkPath ────────────────────────────────────────────────────

describe("isLearnerDeepLinkPath", () => {
  it("recognizes non-study learner deep links", () => {
    assert.ok(isLearnerDeepLinkPath("/app/lessons"));
    assert.ok(isLearnerDeepLinkPath("/app/lessons/pharmacology-basics"));
    assert.ok(isLearnerDeepLinkPath("/app/account/analytics"));
    assert.ok(isLearnerDeepLinkPath("/app/study-plan"));
    assert.ok(isLearnerDeepLinkPath("/app/exam-plan"));
  });

  it("does not classify study routes as deep links", () => {
    assert.equal(isLearnerDeepLinkPath("/app/flashcards"), false);
    assert.equal(isLearnerDeepLinkPath("/app/practice-tests"), false);
  });
});
