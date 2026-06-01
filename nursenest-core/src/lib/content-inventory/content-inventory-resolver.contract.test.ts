/**
 * Content inventory parity contracts — static source analysis.
 *
 * These tests verify that all six learning surfaces (Flashcards, CAT,
 * Practice Tests, Study Plans, Weak Areas, Readiness) derive their content
 * eligibility filters from the same canonical functions.  No DB access —
 * each test reads the source file and asserts structural invariants.
 *
 * Run with: npx tsx --test src/lib/content-inventory/content-inventory-resolver.contract.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const appRoot = join(process.cwd(), "src");
const read = (rel: string) => readFileSync(join(appRoot, rel), "utf8");

// ─── 1. Canonical WHERE gate composition ──────────────────────────────────────

describe("canonical-exam-question-where: gate composition", () => {
  const src = read("lib/study-question-pool/canonical-exam-question-where.ts");

  it("imports questionAccessWhereWithPathway (pathway exam-key scope)", () => {
    assert.match(src, /questionAccessWhereWithPathway/);
  });

  it("imports NON_ECG_PRACTICE_EXAM_WHERE (ECG exclusion)", () => {
    assert.match(src, /NON_ECG_PRACTICE_EXAM_WHERE/);
  });

  it("imports generalStudyBankModuleSurfaceWhere (module isolation)", () => {
    assert.match(src, /generalStudyBankModuleSurfaceWhere/);
  });

  it("imports rtVentilatorPremiumBankGateWhere (RT premium gate)", () => {
    assert.match(src, /rtVentilatorPremiumBankGateWhere/);
  });

  it("exports getCanonicalExamQuestionWhere (entitlement-only form)", () => {
    assert.match(src, /export function getCanonicalExamQuestionWhere/);
  });

  it("exports getCanonicalExamQuestionWhereForPathway (pathway-scoped form)", () => {
    assert.match(src, /export function getCanonicalExamQuestionWhereForPathway/);
  });
});

// ─── 2. CAT pool uses canonical gates ─────────────────────────────────────────

describe("CAT pool (cat-pool.ts): canonical gate parity", () => {
  const src = read("lib/practice-tests/cat-pool.ts");

  it("builds base WHERE from questionAccessWhereWithPathway or questionAccessWhere", () => {
    assert.match(src, /questionAccessWhereWithPathway/);
    assert.match(src, /questionAccessWhere/);
  });

  it("ANDs NON_ECG_PRACTICE_EXAM_WHERE", () => {
    assert.match(src, /NON_ECG_PRACTICE_EXAM_WHERE/);
  });

  it("ANDs generalStudyBankModuleSurfaceWhere()", () => {
    assert.match(src, /generalStudyBankModuleSurfaceWhere\s*\(\s*\)/);
  });

  it("ANDs rtVentilatorPremiumBankGateWhere(entitlement)", () => {
    assert.match(src, /rtVentilatorPremiumBankGateWhere/);
  });

  it("applies NP scope gate or standard exam-prep scope gate depending on roleTrack", () => {
    assert.match(src, /npProviderQuestionScopeWhere/);
    assert.match(src, /standardExamPrepQuestionScopeWhere/);
  });

  it("queries prisma.examQuestion (not legacy JSON bank)", () => {
    assert.match(src, /prisma\.examQuestion/);
  });
});

// ─── 3. Flashcard exam inventory uses equivalent SQL gates ────────────────────

describe("flashcard exam inventory (flashcard-learner-exam-pool-sql.ts): gate parity", () => {
  const src = read("lib/flashcards/flashcard-learner-exam-pool-sql.ts");

  it("includes NON_ECG_GENERAL_BANK_SQL or equivalent non-ECG SQL fragment", () => {
    // flashcard SQL uses EXAM_QUESTION_NON_ECG_TAG_SQL + EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL
    const hasEcgTag = /EXAM_QUESTION_NON_ECG_TAG_SQL/.test(src);
    const hasEcgFormat = /EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL/.test(src);
    const hasEcgQuality = /flashcardLearnerExamQualityGatesSql/.test(src);
    assert.ok(hasEcgTag || hasEcgFormat || hasEcgQuality, "must exclude ECG questions");
  });

  it("includes GENERAL_STUDY_BANK_MODULE_SCOPE_SQL (module isolation)", () => {
    assert.match(src, /GENERAL_STUDY_BANK_MODULE_SCOPE_SQL/);
  });

  it("scopes by pathway exam keys via discoveryExamContextScopeForFlashcardFallback", () => {
    assert.match(src, /discoveryExamContextScopeForFlashcardFallback/);
  });

  it("scopes by entitlement via examQuestionsDiscoveryWhereSql", () => {
    assert.match(src, /examQuestionsDiscoveryWhereSql/);
  });
});

// ─── 4. Flashcard session builder uses canonical WHERE for exam question pool ──

describe("build-flashcard-custom-session.ts: canonical exam pool path", () => {
  const src = read("lib/flashcards/build-flashcard-custom-session.ts");

  it("imports getCanonicalExamQuestionWhereForPathway (alignment reference)", () => {
    // Either imports directly or via load-flashcards-exam-inventory.server.ts chain
    const direct = /getCanonicalExamQuestionWhereForPathway/.test(src);
    const viaInventory = /loadFlashcardsExamInventoryForPathway/.test(src);
    assert.ok(direct || viaInventory, "session must use canonical pathway WHERE chain");
  });

  it("imports loadExamQuestionRowsForFlashcardPool for exam-backed cards", () => {
    assert.match(src, /loadExamQuestionRowsForFlashcardPool/);
  });

  it("returns structured ok:false result on error (database_error code)", () => {
    // The session builder returns { ok: false, code: "database_error" };
    // the route layer maps empty pool to the empty_flashcard_pool HTTP code.
    assert.match(src, /ok:\s*false/);
    assert.match(src, /database_error/);
  });
});

// ─── 5. Flashcard inventory loader uses canonical Prisma WHERE for comparison ──

describe("load-flashcards-exam-inventory.server.ts: canonical WHERE alignment", () => {
  const src = read("lib/flashcards/load-flashcards-exam-inventory.server.ts");

  it("imports getCanonicalExamQuestionWhereForPathway for Prisma-side comparison count", () => {
    assert.match(src, /getCanonicalExamQuestionWhereForPathway/);
  });

  it("resolves access scope via resolveAccessScopeForPathwayExamQuestionPool", () => {
    assert.match(src, /resolveAccessScopeForPathwayExamQuestionPool/);
  });

  it("emits empty-pool critical signal for diagnostic visibility", () => {
    assert.match(src, /FLASHCARDS_CRITICAL_EMPTY_POOL/);
  });
});

// ─── 6. Study plan uses Prisma-backed learner snapshot (not static JSON) ───────

describe("personalized-weak-area-study-plan.ts: live DB (not static JSON)", () => {
  const src = read("lib/learner/personalized-weak-area-study-plan.ts");

  it("queries prisma for stale practice signals", () => {
    assert.match(src, /prisma\./);
  });

  it("derives weak areas from loadUnifiedTopicPerformance", () => {
    assert.match(src, /loadUnifiedTopicPerformance/);
  });

  it("uses buildLearnerStudySnapshot for entitlement-scoped recommendations", () => {
    assert.match(src, /buildLearnerStudySnapshot/);
  });

  it("does NOT import legacy client data trees", () => {
    assert.ok(!src.includes("client/src/data"), "must not use legacy client JSON banks");
  });
});

// ─── 7. contentInventoryResolver exports the expected contract ─────────────────

describe("content-inventory-resolver.ts: export contract", () => {
  const src = read("lib/content-inventory/content-inventory-resolver.ts");

  it("exports contentInventoryResolver function", () => {
    assert.match(src, /export async function contentInventoryResolver/);
  });

  it("exports contentInventoryResolverGlobal for admin diagnostics", () => {
    assert.match(src, /export async function contentInventoryResolverGlobal/);
  });

  it("imports getCanonicalExamQuestionWhereForPathway as exam pool base", () => {
    assert.match(src, /getCanonicalExamQuestionWhereForPathway/);
  });

  it("imports CAT_DB_COMPLETENESS_WHERE to distinguish CAT vs flashcard pool sizes", () => {
    assert.match(src, /CAT_DB_COMPLETENESS_WHERE/);
  });

  it("computes per-surface pool sizes (catPool, practicePool, flashcardExamPool, flashcardDedicatedPool)", () => {
    assert.match(src, /catPool/);
    assert.match(src, /practicePool/);
    assert.match(src, /flashcardExamPool/);
    assert.match(src, /flashcardDedicatedPool/);
  });

  it("reports parity verdict (examPoolParityOk, examPoolParityDelta)", () => {
    assert.match(src, /examPoolParityOk/);
    assert.match(src, /examPoolParityDelta/);
  });
});

// ─── 8. Pool invariant: CAT pool ⊆ flashcard exam pool ────────────────────────

describe("pool subset invariant (static logic)", () => {
  const resolverSrc = read("lib/content-inventory/content-inventory-resolver.ts");

  it("catPool is set from catEligibleCount (applies CAT_DB_COMPLETENESS_WHERE on top of canonical)", () => {
    assert.match(resolverSrc, /catPool: catEligibleCount/);
  });

  it("flashcardExamPool is set from canonicalCount (canonical WHERE only, no completeness gate)", () => {
    assert.match(resolverSrc, /flashcardExamPool: canonicalCount/);
  });

  it("parity delta = catEligibleCount - canonicalCount (expected >= 0, negative = misconfiguration)", () => {
    assert.match(resolverSrc, /examPoolParityDelta = catEligibleCount - canonicalCount/);
  });

  it("parity is OK when delta >= 0 (CAT is stricter than flashcard, which is expected)", () => {
    assert.match(resolverSrc, /examPoolParityOk = examPoolParityDelta >= 0/);
  });
});

// ─── 9. Study question pool helper uses same canonical gates ──────────────────

describe("get-study-question-pool-for-pathway.ts: canonical gate usage", () => {
  const src = read("lib/study-question-pool/get-study-question-pool-for-pathway.ts");

  it("uses questionAccessWhereWithPathway as pool base", () => {
    assert.match(src, /questionAccessWhereWithPathway/);
  });

  it("ANDs NON_ECG_PRACTICE_EXAM_WHERE", () => {
    assert.match(src, /NON_ECG_PRACTICE_EXAM_WHERE/);
  });

  it("ANDs generalStudyBankModuleSurfaceWhere()", () => {
    assert.match(src, /generalStudyBankModuleSurfaceWhere/);
  });

  it("ANDs rtVentilatorPremiumBankGateWhere", () => {
    assert.match(src, /rtVentilatorPremiumBankGateWhere/);
  });

  it("counts dedicated flashcards separately from derived exam questions", () => {
    assert.match(src, /dedicatedFlashcardCount/);
    assert.match(src, /derivedQuestionCount/);
  });
});
