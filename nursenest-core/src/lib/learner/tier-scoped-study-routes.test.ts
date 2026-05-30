import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  hrefForResolvedQuestionBankEntry,
  resolveSubscribedQuestionBankPathways,
} from "@/lib/learner/tier-scoped-study-routes";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { pathwayHubAppFlashcardsHref, pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { buildLearnerPrimaryNavItems } from "@/lib/navigation/learner-primary-nav";

const RN = "us-rn-nclex-rn";
const PN = "us-lpn-nclex-pn";
const ALLIED = "us-allied-core";
const UNKNOWN_TRACK = "zz-unknown-pathway-id";

describe("resolveSubscribedQuestionBankPathways", () => {
  const multi = [
    { id: RN, shortName: "NCLEX-RN" },
    { id: PN, shortName: "NCLEX-PN" },
  ];

  it("locks to RN when URL requests RN (multi-entitlement)", () => {
    const r = resolveSubscribedQuestionBankPathways({
      requestedPathwayId: RN,
      compatible: multi,
      learnerPath: PN,
    });
    assert.equal(r.state, "scoped");
    if (r.state === "scoped") {
      assert.equal(r.defaultPathwayId, RN);
      assert.deepEqual(
        r.pathwayOptions.map((p) => p.id),
        [RN],
      );
    }
  });

  it("locks to PN when URL requests PN", () => {
    const r = resolveSubscribedQuestionBankPathways({
      requestedPathwayId: PN,
      compatible: multi,
      learnerPath: RN,
    });
    assert.equal(r.state, "scoped");
    if (r.state === "scoped") assert.equal(r.defaultPathwayId, PN);
  });

  it("locks to learnerPath when no URL param", () => {
    const r = resolveSubscribedQuestionBankPathways({
      requestedPathwayId: null,
      compatible: multi,
      learnerPath: RN,
    });
    assert.equal(r.state, "scoped");
    if (r.state === "scoped") assert.equal(r.defaultPathwayId, RN);
  });

  it("locks to sole compatible pathway when no URL and no learnerPath", () => {
    const r = resolveSubscribedQuestionBankPathways({
      requestedPathwayId: null,
      compatible: [{ id: ALLIED, shortName: "Allied" }],
      learnerPath: null,
    });
    assert.equal(r.state, "scoped");
    if (r.state === "scoped") assert.equal(r.defaultPathwayId, ALLIED);
  });

  it("returns invalid_requested when URL pathway is not entitled", () => {
    const r = resolveSubscribedQuestionBankPathways({
      requestedPathwayId: UNKNOWN_TRACK,
      compatible: [{ id: RN, shortName: "NCLEX-RN" }],
      learnerPath: RN,
    });
    assert.equal(r.state, "invalid_requested");
  });

  it("returns no_pathway_context when multiple entitled and no URL or learnerPath", () => {
    const r = resolveSubscribedQuestionBankPathways({
      requestedPathwayId: null,
      compatible: multi,
      learnerPath: null,
    });
    assert.equal(r.state, "no_pathway_context");
  });

  it("returns no_pathway_context when explicit pathway selection is required and URL is missing", () => {
    const r = resolveSubscribedQuestionBankPathways({
      requestedPathwayId: null,
      compatible: [{ id: ALLIED, shortName: "Allied" }],
      learnerPath: ALLIED,
      requireExplicitRequestedPathwayId: true,
    });
    assert.equal(r.state, "no_pathway_context");
  });

  it("still scopes requested pathway when explicit selection is required", () => {
    const r = resolveSubscribedQuestionBankPathways({
      requestedPathwayId: RN,
      compatible: multi,
      learnerPath: PN,
      requireExplicitRequestedPathwayId: true,
    });
    assert.equal(r.state, "scoped");
    if (r.state === "scoped") assert.equal(r.defaultPathwayId, RN);
  });
});

describe("hrefForResolvedQuestionBankEntry", () => {
  it("never returns bare /app/questions for ambiguous multi-pathway access", () => {
    const r = resolveSubscribedQuestionBankPathways({
      requestedPathwayId: null,
      compatible: [
        { id: RN, shortName: "NCLEX-RN" },
        { id: PN, shortName: "NCLEX-PN" },
      ],
      learnerPath: null,
    });
    assert.equal(r.state, "no_pathway_context");
    assert.equal(hrefForResolvedQuestionBankEntry(r), "/app/account/study-preferences");
  });

  it("returns scoped /app/questions?pathwayId=… when locked to one track", () => {
    const r = resolveSubscribedQuestionBankPathways({
      requestedPathwayId: PN,
      compatible: [
        { id: RN, shortName: "NCLEX-RN" },
        { id: PN, shortName: "NCLEX-PN" },
      ],
      learnerPath: RN,
    });
    assert.equal(r.state, "scoped");
    assert.equal(hrefForResolvedQuestionBankEntry(r), `/app/questions?pathwayId=${encodeURIComponent(PN)}`);
  });
});

// parseTierScopedAppStudyCallbackPath has been removed.
// Callback URL validation for study routes is now in:
//   src/lib/auth/protected-study-routes.ts  →  normalizeStudyCallback()
// See src/lib/auth/protected-study-routes.test.ts for the full test suite.

describe("tier-scoped app hrefs", () => {
  it("RN hub practice href carries pathwayId only", () => {
    assert.match(pathwayHubAppQuestionsHref(RN), /^\/app\/questions\?pathwayId=us-rn-nclex-rn$/);
  });

  it("RN hub flashcards href carries pathwayId only", () => {
    assert.match(pathwayHubAppFlashcardsHref(RN), /^\/app\/flashcards\?pathwayId=us-rn-nclex-rn$/);
  });

  it("RN hub CAT start href carries pathwayId only", () => {
    assert.match(
      appPathwayCatSessionStartPath(RN),
      /^\/app\/practice-tests\?pathwayId=us-rn-nclex-rn$/,
    );
  });

  it("learner nav practice-tests + CAT stay on same pathwayId when shell provides it", () => {
    const items = buildLearnerPrimaryNavItems(RN, { examsLabel: "CAT Exams" });
    const practice = items.find((i) => i.key === "practice");
    const cat = items.find((i) => i.key === "cat");
    assert.ok(practice?.href.includes("pathwayId=us-rn-nclex-rn"));
    assert.ok(cat?.href.includes("pathwayId=us-rn-nclex-rn"));
  });

  it("without shell pathwayId, practice nav href is the shared practice-tests launcher", () => {
    const items = buildLearnerPrimaryNavItems(null, { examsLabel: "CAT Exams" });
    const practice = items.find((i) => i.key === "practice");
    assert.equal(practice?.href, "/app/practice-tests");
  });
});
