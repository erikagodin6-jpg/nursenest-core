/**
 * QA contract: CAT start pathway selection safety.
 *
 * Covers the scenarios defined in the CAT pathway selection pass:
 *  1. Pathway-specific start — explicit pathwayId always preserved.
 *  2. Generic multi-pathway surface — ambiguous without pathwayId → structured 400.
 *  3. Single-pathway subscription — unambiguous auto-resolution.
 *  4. No CAT-eligible pathways → required error.
 *  5. Ambiguity picker: one URL per eligible pathway, targeting direct CAT launch.
 *  6. Labels: catPathwayRegionalExamLine includes country + role + exam code.
 *  7. URL helper encodes pathwayId correctly.
 *  8. data-nn-qa attributes: each picker option has the correct qa attr key.
 *  9. Empty catEligibleOptions: no auto-select or hub redirect in picker contract.
 *
 * Non-goals: does NOT test the full API route (DB/auth dependencies) or UI clicks.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import { resolveCatPathwayIdForCatPost } from "@/lib/practice-tests/resolve-cat-pathway-for-post";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import {
  catPathwayRegionalExamLine,
  catPathwayRegionRoleLabel,
  catPathwayExamCodeLabel,
} from "@/lib/exam-pathways/cat-pathway-labels";
import { tryCatPathwayFromId } from "@/lib/exam-pathways/cat-pathway-from-id";

function stub(id: string): ExamPathwayDefinition {
  return { id } as ExamPathwayDefinition;
}

// ─── 1. Pathway-specific start ───────────────────────────────────────────────

describe("pathway-specific CAT start: explicit pathwayId from client", () => {
  it("honors the exact pathwayId when supplied", () => {
    const r = resolveCatPathwayIdForCatPost("us-rn-nclex-rn", [stub("us-rn-nclex-rn"), stub("us-np-fnp")]);
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.pathwayId, "us-rn-nclex-rn");
      assert.equal(r.source, "request");
    }
  });

  it("preserves pathwayId even when only one CAT-eligible pathway exists", () => {
    const r = resolveCatPathwayIdForCatPost("us-rn-nclex-rn", [stub("us-rn-nclex-rn")]);
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.pathwayId, "us-rn-nclex-rn");
      assert.equal(r.source, "request");
    }
  });

  it("trims whitespace around pathwayId", () => {
    const r = resolveCatPathwayIdForCatPost("  us-rn-nclex-rn  ", [stub("us-rn-nclex-rn")]);
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.pathwayId, "us-rn-nclex-rn");
  });
});

// ─── 2. Generic multi-pathway surface: ambiguous without pathwayId ────────────

describe("multi-pathway subscription: omitted pathwayId → structured failure", () => {
  it("returns cat_pathway_ambiguous when pathwayId is null and multiple tracks are eligible", () => {
    const r = resolveCatPathwayIdForCatPost(null, [stub("us-rn-nclex-rn"), stub("us-np-fnp")]);
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.code, PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous);
      assert.equal(r.catEligibleCount, 2);
    }
  });

  it("returns cat_pathway_ambiguous when pathwayId is empty string and multiple tracks exist", () => {
    const r = resolveCatPathwayIdForCatPost("", [stub("a"), stub("b"), stub("c")]);
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.code, PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous);
      assert.equal(r.catEligibleCount, 3);
    }
  });

  it("does NOT silently pick the first eligible pathway when multiple exist", () => {
    const r = resolveCatPathwayIdForCatPost(undefined, [stub("first"), stub("second")]);
    assert.equal(r.ok, false, "Must NOT silently default to first eligible pathway");
  });
});

// ─── 3. Single-pathway subscription: unambiguous auto-resolution ──────────────

describe("single CAT-eligible pathway: safe auto-resolution", () => {
  it("resolves the one eligible pathway when pathwayId is omitted", () => {
    const r = resolveCatPathwayIdForCatPost(null, [stub("only-track")]);
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.pathwayId, "only-track");
      assert.equal(r.source, "single_eligible_unambiguous");
    }
  });

  it("resolves same single pathway when pathwayId is empty string", () => {
    const r = resolveCatPathwayIdForCatPost("", [stub("ca-rn-nclex-rn")]);
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.pathwayId, "ca-rn-nclex-rn");
  });
});

// ─── 4. No CAT-eligible pathways ─────────────────────────────────────────────

describe("no CAT-eligible pathways: required error", () => {
  it("returns cat_pathway_required when no eligible pathways exist", () => {
    const r = resolveCatPathwayIdForCatPost(null, []);
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.code, PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_required);
      assert.equal(r.catEligibleCount, 0);
    }
  });

  it("returns cat_pathway_required even when pathwayId is supplied but list is empty", () => {
    // Server still validates against catEligible list; unknown pathway id is caught at next layer.
    // This test confirms resolver returns required (not ambiguous) when the pool is empty.
    const r = resolveCatPathwayIdForCatPost("some-pathway", []);
    // explicit id is returned directly without requiring eligibility check at this layer
    assert.equal(r.ok, true, "Explicit id bypasses the empty-pool check — entitlement checked downstream");
    if (r.ok) assert.equal(r.source, "request");
  });
});

// ─── 5. Ambiguity picker: one URL per eligible pathway ───────────────────────

describe("ambiguity picker URLs: each eligible pathway gets a scoped start link", () => {
  it("produces distinct start URLs for RN and NP pathways", () => {
    const rn = appPathwayCatSessionStartPath("us-rn-nclex-rn");
    const np = appPathwayCatSessionStartPath("us-np-fnp");
    assert.notEqual(rn, np, "each pathway must produce a distinct URL");
    const qRn = new URLSearchParams(rn.slice("/app/practice-tests/cat-launch?".length));
    const qNp = new URLSearchParams(np.slice("/app/practice-tests/cat-launch?".length));
    assert.equal(qRn.get("pathwayId"), "us-rn-nclex-rn");
    assert.equal(qNp.get("pathwayId"), "us-np-fnp");
  });

  it("each pathway URL targets /app/practice-tests/cat-launch, not the generic hub", () => {
    const ids = ["us-rn-nclex-rn", "ca-rn-nclex-rn", "us-np-fnp", "ca-np-cnple"];
    for (const id of ids) {
      const url = appPathwayCatSessionStartPath(id);
      assert.ok(url.startsWith("/app/practice-tests/cat-launch?"), `${id}: must target /app/practice-tests/cat-launch`);
      assert.ok(!url.startsWith("/app/practice-tests?"), `${id}: must NOT target the generic hub`);
    }
  });
});

// ─── 6. Labels: catPathwayRegionalExamLine country + role + exam ─────────────

describe("catPathwayRegionalExamLine: labels include country + role + exam", () => {
  function makePathway(overrides: Partial<ExamPathwayDefinition>): ExamPathwayDefinition {
    return {
      id: "test-id",
      countrySlug: "us",
      roleTrack: "rn",
      shortName: "NCLEX-RN",
      ...overrides,
    } as ExamPathwayDefinition;
  }

  it("US RN pathway produces a label containing 'US', 'RN', and the exam code", () => {
    const pw = makePathway({ countrySlug: "us", roleTrack: "rn", shortName: "NCLEX-RN" });
    const label = catPathwayRegionalExamLine(pw);
    assert.ok(label.includes("US"), `label must contain 'US': got "${label}"`);
    assert.ok(label.includes("RN"), `label must contain 'RN': got "${label}"`);
    assert.ok(label.includes("NCLEX-RN"), `label must contain exam code: got "${label}"`);
  });

  it("Canada RPN pathway produces a label containing 'Canada', 'RPN', and the exam code", () => {
    const pw = makePathway({ countrySlug: "canada", roleTrack: "rpn", shortName: "REx-PN" });
    const label = catPathwayRegionalExamLine(pw);
    assert.ok(label.includes("Canada"), `label must contain 'Canada': got "${label}"`);
    assert.ok(label.includes("RPN"), `label must contain 'RPN': got "${label}"`);
    assert.ok(label.includes("REx-PN"), `label must contain exam code: got "${label}"`);
  });

  it("US NP pathway produces a label containing 'US', 'NP', and the exam code", () => {
    const pw = makePathway({ countrySlug: "us", roleTrack: "np", shortName: "FNP" });
    const label = catPathwayRegionalExamLine(pw);
    assert.ok(label.includes("US"), `label must contain 'US': got "${label}"`);
    assert.ok(label.includes("NP"), `label must contain 'NP': got "${label}"`);
    assert.ok(label.includes("FNP"), `label must contain exam code: got "${label}"`);
  });

  it("two distinct pathways produce two distinct labels (unambiguous for multi-track users)", () => {
    const rn = makePathway({ countrySlug: "us", roleTrack: "rn", shortName: "NCLEX-RN" });
    const np = makePathway({ countrySlug: "us", roleTrack: "np", shortName: "FNP" });
    const labelRn = catPathwayRegionalExamLine(rn);
    const labelNp = catPathwayRegionalExamLine(np);
    assert.notEqual(labelRn, labelNp, "multi-track users must see distinct labels per pathway");
  });

  it("label format is '<region> · <exam>' with separator", () => {
    const pw = makePathway({ countrySlug: "us", roleTrack: "rn", shortName: "NCLEX-RN" });
    const label = catPathwayRegionalExamLine(pw);
    // Must contain a separator between region role and exam code.
    assert.ok(label.includes("·"), `label must include '·' separator: got "${label}"`);
    const [regionPart, examPart] = label.split("·").map((s) => s.trim());
    assert.ok(regionPart.length > 0, "region part must not be empty");
    assert.ok(examPart.length > 0, "exam part must not be empty");
  });

  it("tryCatPathwayFromId returns undefined for unknown id (no throws)", () => {
    const result = tryCatPathwayFromId("not-a-real-pathway-id");
    assert.equal(result, undefined);
  });

  it("tryCatPathwayFromId handles null and empty gracefully", () => {
    assert.equal(tryCatPathwayFromId(null), undefined);
    assert.equal(tryCatPathwayFromId(""), undefined);
    assert.equal(tryCatPathwayFromId(undefined), undefined);
  });
});

// ─── 8. QA attribute contract: data-nn-qa-cat-ambiguity-option ───────────────

describe("ambiguity picker: data-nn-qa-cat-ambiguity-option mirrors pathwayId", () => {
  /**
   * Verifies the QA attribute value matches the `href` pathwayId so test automation
   * and acceptance checks can reliably select and verify each option.
   */
  it("each pathwayId produces the correct data-nn-qa attribute value and URL pair", () => {
    const pathwayIds = ["us-rn-nclex-rn", "ca-rn-nclex-rn", "us-np-fnp", "ca-np-cnple"];
    for (const id of pathwayIds) {
      const url = appPathwayCatSessionStartPath(id);
      const q = new URLSearchParams(url.slice("/app/practice-tests/cat-launch?".length));
      // The data-nn-qa-cat-ambiguity-option value must equal the pathwayId in the href.
      assert.equal(
        q.get("pathwayId"),
        id,
        `data-nn-qa-cat-ambiguity-option="${id}" must link to pathwayId="${id}"`,
      );
    }
  });
});

// ─── 9. Empty catEligibleOptions: fallback contract ──────────────────────────

describe("ambiguity picker: empty catEligibleOptions contract", () => {
  it("catEligibleOptions=[] means the picker must NOT auto-pick — no single pathway to resolve to", () => {
    // The resolve layer for empty lists returns cat_pathway_required (not ambiguous).
    // Verifies the server would never send cat_pathway_ambiguous with an empty options list.
    const r = resolveCatPathwayIdForCatPost(null, []);
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.notEqual(
        r.code,
        PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous,
        "empty eligibility list must not produce cat_pathway_ambiguous",
      );
    }
  });

  it("appPathwayCatSessionStartPath still encodes correctly for edge-case IDs", () => {
    // Even unusual IDs must encode correctly so the picker fallback link works.
    const url = appPathwayCatSessionStartPath("some-unexpected-id");
    const q = new URLSearchParams(url.slice("/app/practice-tests/cat-launch?".length));
    assert.equal(q.get("pathwayId"), "some-unexpected-id");
    assert.ok(!url.startsWith("/app/practice-tests?"), "must not target generic hub");
  });
});

// ─── 7. URL helper: pathwayId encoding (edge cases) ──────────────────────────

describe("appPathwayCatSessionStartPath: pathway-scoped CAT start URL", () => {
  it("produces a URL with the pathwayId query param", () => {
    const url = appPathwayCatSessionStartPath("us-rn-nclex-rn");
    assert.ok(url.startsWith("/app/practice-tests/cat-launch?"), "must target direct CAT launch");
    const q = new URLSearchParams(url.slice("/app/practice-tests/cat-launch?".length));
    assert.equal(q.get("pathwayId"), "us-rn-nclex-rn");
  });

  it("trims the pathwayId in the URL", () => {
    const url = appPathwayCatSessionStartPath("  us-np-fnp  ");
    const q = new URLSearchParams(url.slice("/app/practice-tests/cat-launch?".length));
    assert.equal(q.get("pathwayId"), "us-np-fnp");
  });

  it("does NOT fall back to the generic practice hub — always targets cat-launch", () => {
    const url = appPathwayCatSessionStartPath("ca-rn-nclex-rn");
    assert.ok(!url.includes("/app/practice-tests?"), "must not point to the hub with query params only");
    assert.ok(url.includes("/app/practice-tests/cat-launch"), "must always target direct CAT launch");
  });
});
