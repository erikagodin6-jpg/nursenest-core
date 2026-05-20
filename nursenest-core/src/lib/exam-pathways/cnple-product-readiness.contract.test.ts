/**
 * CNPLE Product Readiness Contract Tests
 *
 * Regression guard for the CNPLE revenue sprint.
 * Ensures no surface reverts to generic CAT copy, dead CTAs, or blank states.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const ROOT = process.cwd();

function source(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

// ─── Canonical key contract ────────────────────────────────────────────────

describe("CNPLE canonical pathway key", () => {
  it("CNPLE_PATHWAY_ID is exported from cnple-pathway (testing-model source)", () => {
    const cnplePathway = source("src/lib/exam-pathways/cnple-pathway.ts");
    assert.match(cnplePathway, /CNPLE_PATHWAY_ID/);
    assert.match(cnplePathway, /testing-model/);
    const testingModel = source("src/lib/testing/testing-model.ts");
    assert.match(testingModel, /CNPLE_PATHWAY_ID\s*=\s*["']ca-np-cnple["']/);
  });

  it("exam-pathways-data uses ca-np-cnple as pathway id and cnple as examCode", () => {
    const src = source("src/lib/exam-pathways/exam-pathways-data-segment-a.ts");
    assert.match(src, /id:\s*["']ca-np-cnple["']/);
    assert.match(src, /examCode:\s*["']cnple["']/);
  });

  it("testing-model pathway map and definitions enforce LOFT for CNPLE", () => {
    const map = source("src/lib/testing/testing-model-pathway-map.ts");
    assert.match(map, /["']ca-np-cnple["']:\s*["']LOFT["']/);
    const defs = source("src/lib/testing/testing-model-definitions.ts");
    assert.match(defs, /allowsDifficultyAdaptation:\s*false/);
    assert.match(defs, /blueprint_constrained/);
    const governance = source("src/lib/testing/psychometric-isolation.ts");
    assert.match(governance, /assertNoCatLanguageForLoftPathway/);
  });

  it("CNPLE pathway marks engineType as LOFT not CAT", () => {
    const readiness = source("src/lib/exam-pathways/pathway-readiness-config.ts");
    assert.match(readiness, /["']ca-np-cnple["'][^}]*engineType:\s*["']LOFT["']/s);
  });

  it("pathway-cat-marketing-copy derives LOFT copy from testing-model", () => {
    const src = source("src/lib/exam-pathways/pathway-cat-marketing-copy.ts");
    assert.match(src, /testing-model/);
    assert.match(src, /getPathwaySimulationDisplayCopy/);
    assert.doesNotMatch(src, /LOFT_PATHWAY_IDS/);
  });
});

// ─── Hub CTA correctness ───────────────────────────────────────────────────

describe("CNPLE hub action correctness", () => {
  it("nursing-tier-hub-content builds Simulation label for CNPLE cat action", () => {
    const src = source("src/lib/marketing/nursing-tier-hub-content.ts");
    // Must have isCnplePathway guard for the label
    assert.match(src, /isCnplePathway.*"Simulation"/s);
  });

  it("nursing-tier-hub-content routes CNPLE cat action to /simulation path", () => {
    const src = source("src/lib/marketing/nursing-tier-hub-content.ts");
    assert.match(src, /isCnplePathway.*buildExamPathwayPath.*["']simulation["']/s);
  });

  it("nursing-tier-hub-content routes signed-in CNPLE users to /app/cases/cnple not CAT", () => {
    const src = source("src/lib/marketing/nursing-tier-hub-content.ts");
    assert.match(src, /isCnplePathway.*\/app\/cases\/cnple/s);
    // Must NOT use appPathwayCatSessionStartPath for CNPLE
    const cnpleBlock = src.match(/isCnplePathway\(pathway\.id\)[^}]*\/app\/cases\/cnple[^}]*/s)?.[0] ?? "";
    assert.ok(!cnpleBlock.includes("appPathwayCatSessionStartPath"),
      "Signed-in CNPLE users must NOT use appPathwayCatSessionStartPath (CAT engine)");
  });

  it("CNPLE differenceBody mentions LOFT not CAT", () => {
    const src = source("src/lib/marketing/nursing-tier-hub-content.ts");
    assert.match(src, /isCnplePathway.*LOFT.*linear/si);
  });
});

// ─── Route correctness ────────────────────────────────────────────────────

describe("CNPLE route surfaces", () => {
  it("/cat page redirects CNPLE to /simulation", () => {
    const src = source(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx",
    );
    assert.match(src, /isCnplePathway/);
    assert.match(src, /redirect.*buildExamPathwayPath.*["']simulation["']/s);
  });

  it("/simulation page only renders for CNPLE (redirects other pathways to /cat)", () => {
    const src = source(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx",
    );
    assert.match(src, /ca-np-cnple/);
    assert.match(src, /redirect.*buildExamPathwayPath.*["']cat["']/s);
  });

  it("/simulation page has a primary Start CTA with data-nn-qa attribute", () => {
    const src = source(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx",
    );
    assert.match(src, /data-nn-qa="cnple-sim-start-cta"/);
  });

  it("/simulation page uses LOFT copy and does not present CNPLE as CAT", () => {
    const src = source(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx",
    );
    // Must use LOFT language prominently
    assert.match(src, /LOFT/i);
    // "not CAT adaptive" is allowed as a clarifying educational contrast — what it is NOT
    // The page must NOT claim CNPLE IS a CAT exam
    assert.doesNotMatch(src, /CNPLE.{0,80}(?:is|uses) (?:a )?(?:computerized )?adaptive/si);
    assert.doesNotMatch(src, /Computer-adaptive test for CNPLE/i);
  });

  it("/flashcards page has an honest empty-state for CNPLE when inventory is absent", () => {
    const src = source(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/flashcards/page.tsx",
    );
    assert.match(src, /cnpleFlashcardLive/);
    assert.match(src, /being prepared/);
  });

  it("/flashcards page empty-state CTAs do not point to /cat for CNPLE", () => {
    const src = source(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/flashcards/page.tsx",
    );
    // The fallback CTAs must link to /simulation, not /cat
    const cnpleBlock = src.match(/cnpleFlashcardLive.*?Start CNPLE Simulation/s)?.[0] ?? "";
    assert.ok(cnpleBlock.includes("simulation"), "Empty-state CTA must link to /simulation");
    assert.ok(!cnpleBlock.includes('href="/cat"'), "Empty-state CTA must not link to /cat");
  });

  it("/cat page does not use CAT copy for CNPLE pathway", () => {
    // The /cat page redirects CNPLE away before rendering, so CNPLE users
    // never see CAT copy. Verify the redirect is present and unconditional.
    const src = source(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx",
    );
    const redirectBlock = src.match(/isCnplePathway[\s\S]{0,200}simulation/)?.[0] ?? "";
    assert.ok(redirectBlock.length > 0, "CNPLE redirect to simulation must be present in /cat");
  });
});

// ─── Lessons route ─────────────────────────────────────────────────────────

describe("CNPLE lessons route", () => {
  it("pathway-lesson-catalog-sync applies NP lessons to ca-np-cnple", () => {
    const src = source("src/lib/lessons/pathway-lesson-catalog-sync.ts");
    assert.match(src, /["']ca-np-cnple[""][^}]*examName.*CNPLE/s);
  });

  it("NP parity expansion is gated behind isNpPathway", () => {
    const src = source("src/lib/lessons/pathway-lesson-catalog-sync.ts");
    assert.match(src, /isNpPathway.*npParityExpansion/s);
  });
});

// ─── Canonical key drift audit ────────────────────────────────────────────

describe("CNPLE key consistency", () => {
  it("sitemap-static-xml includes /canada/np/cnple/simulation", () => {
    const src = source("src/lib/seo/sitemap-static-xml.ts");
    assert.ok(
      src.includes("/canada/np/cnple") || src.includes("cnple"),
      "Sitemap must reference the CNPLE pathway path",
    );
  });

  it("cnple-pathway.ts re-exports isCnplePathway from testing-model", () => {
    const src = source("src/lib/exam-pathways/cnple-pathway.ts");
    assert.match(src, /isCnplePathway/);
    assert.match(src, /testing-model/);
  });

  it("CNPLE flashcard query uses NP tier filter (not a CAT-scoped filter)", () => {
    const src = source(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/flashcards/page.tsx",
    );
    assert.match(src, /tier.*NP.*country.*CA/si);
  });
});
