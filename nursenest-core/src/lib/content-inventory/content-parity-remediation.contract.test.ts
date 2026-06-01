/**
 * Content parity remediation contract tests.
 *
 * Verifies — via static source analysis — that all five invariants required by
 * the parity remediation are upheld across every tier/country combination:
 *
 *   RN · RPN · NP · RT/ALLIED · Free (no tier) · Paid (any tier)
 *   Canada · US
 *
 * No database access.  Each test reads the relevant source file and asserts
 * structural invariants that encode the fix.
 *
 * Run: npx tsx --test src/lib/content-inventory/content-parity-remediation.contract.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = join(process.cwd(), "src");
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

// ─── Phase 1: Scope resolution diagnostics ───────────────────────────────────

describe("Phase 1 — resolveAccessScopeForPathwayExamQuestionPool: denial diagnostics", () => {
  const src = read("lib/flashcards/load-flashcards-exam-inventory.server.ts");

  it("exports ScopeResolutionDenialCode with all expected codes", () => {
    assert.match(src, /subscription_no_access/);
    assert.match(src, /missing_tier_after_coalesce/);
    assert.match(src, /missing_country_after_coalesce/);
    assert.match(src, /country_mismatch/);
    assert.match(src, /tier_ladder_mismatch/);
    assert.match(src, /pathway_hidden/);
  });

  it("ResolvedFlashcardPoolAccess type carries denialCode and denialDetail", () => {
    assert.match(src, /denialCode\?:/);
    assert.match(src, /denialDetail\?:/);
  });

  it("denied() helper assigns denialCode and builds denialDetail string", () => {
    assert.match(src, /denialCode: code/);
    assert.match(src, /denialDetail,/);
    assert.match(src, /buildDenialDetail/);
  });

  it("specific denial paths set named codes instead of silent null", () => {
    // Multi-line calls: regex allows optional whitespace/newline between denied( and the code string.
    assert.match(src, /denied\(\s*"subscription_no_access"/s);
    assert.match(src, /denied\(\s*"country_mismatch"/s);
    assert.match(src, /denied\(\s*"tier_ladder_mismatch"/s);
    assert.match(src, /denied\(\s*"pathway_hidden"/s);
    assert.match(src, /denied\(\s*"missing_tier_after_coalesce"/s);
    assert.match(src, /denied\(\s*"missing_country_after_coalesce"/s);
  });

  it("log event exam_inventory_access_denied emits denialCode and denialDetail", () => {
    assert.match(src, /denialCode: accessResolved\.denialCode/);
    assert.match(src, /denialDetail: accessResolved\.denialDetail/);
  });

  it("imports prismaTierCodesForProfileTier to check tier ladder before calling subscriptionCoversPathwayBase", () => {
    assert.match(src, /prismaTierCodesForProfileTier/);
  });
});

// ─── Phase 2: RT gate in flashcard SQL paths ─────────────────────────────────

describe("Phase 2 — RT ventilator gate in flashcard exam SQL (flashcard-exam-bank-hub-inventory.ts)", () => {
  const src = read("lib/flashcards/flashcard-exam-bank-hub-inventory.ts");

  it("imports RT gate helpers (isRtVentilatorLearnerModuleEnabled, canAccessRtVentilatorModuleForTierAndProfession)", () => {
    assert.match(src, /isRtVentilatorLearnerModuleEnabled/);
    assert.match(src, /canAccessRtVentilatorModuleForTierAndProfession/);
  });

  it("imports RT_VENTILATOR_BANK_TAG constant", () => {
    assert.match(src, /RT_VENTILATOR_BANK_TAG/);
  });

  it("defines rtVentilatorGateSql() function that excludes the bank tag for non-RT entitlements", () => {
    assert.match(src, /function rtVentilatorGateSql/);
    assert.match(src, /AND NOT.*ANY\(tags\)/);
  });

  it("defines buildFlashcardUsabilitySql() using rtVentilatorGateSql(entitlement)", () => {
    assert.match(src, /function buildFlashcardUsabilitySql/);
    assert.match(src, /rtVentilatorGateSql\(entitlement\)/);
  });

  it("no longer uses a static FLASHCARD_USABILITY_SQL constant without entitlement", () => {
    assert.ok(
      !src.includes("const FLASHCARD_USABILITY_SQL"),
      "FLASHCARD_USABILITY_SQL must be a function, not a static constant",
    );
  });

  it("runHubInventoryQuery accepts usabilitySql parameter (not static constant)", () => {
    assert.match(src, /usabilitySql: Prisma\.Sql/);
  });

  it("loadExamQuestionRowsForFlashcardPool uses buildFlashcardUsabilitySql(poolScope)", () => {
    assert.match(src, /buildFlashcardUsabilitySql\(poolScope\)/);
  });
});

describe("Phase 2 — RT gate in flashcard-learner-exam-pool-sql.ts (hub inventory SQL path)", () => {
  const src = read("lib/flashcards/flashcard-learner-exam-pool-sql.ts");

  it("imports RT gate helpers", () => {
    assert.match(src, /isRtVentilatorLearnerModuleEnabled/);
    assert.match(src, /canAccessRtVentilatorModuleForTierAndProfession/);
    assert.match(src, /RT_VENTILATOR_BANK_TAG/);
  });

  it("defines rtVentilatorGateSqlForPool() that excludes the bank tag", () => {
    assert.match(src, /function rtVentilatorGateSqlForPool/);
  });

  it("flashcardLearnerExamPoolWhereSql appends rtGate", () => {
    assert.match(src, /rtGate = rtVentilatorGateSqlForPool\(poolScope\)/);
    assert.match(src, /\$\{rtGate\}/);
  });
});

// ─── Phase 2: NP scope gate ──────────────────────────────────────────────────

describe("Phase 2 — NP scope gate in difficulty-scope-filter.ts", () => {
  const src = read("lib/questions/difficulty-scope-filter.ts");

  it("exports npProviderQuestionScopeSql() function", () => {
    assert.match(src, /export function npProviderQuestionScopeSql/);
  });

  it("npProviderQuestionScopeSql uses SPECIALTY_SCOPE_TAGS (not ADVANCED_SCOPE_TAGS)", () => {
    const fnStart = src.indexOf("export function npProviderQuestionScopeSql");
    const fnEnd = src.indexOf("\n}", fnStart);
    const fn = src.slice(fnStart, fnEnd);
    assert.match(fn, /SPECIALTY_SCOPE_TAGS/);
    assert.ok(!fn.includes("ADVANCED_SCOPE_TAGS"), "must not use ADVANCED_SCOPE_TAGS — NP allows provider-level");
  });
});

describe("Phase 2 — NP scope gate applied in flashcard-exam-bank-hub-inventory.ts", () => {
  const src = read("lib/flashcards/flashcard-exam-bank-hub-inventory.ts");

  it("imports npProviderQuestionScopeSql", () => {
    assert.match(src, /npProviderQuestionScopeSql/);
  });

  it("defines scopeGateSql() that branches on NP tier", () => {
    assert.match(src, /function scopeGateSql/);
    assert.match(src, /tier === "NP"/);
    assert.match(src, /npProviderQuestionScopeSql\(\)/);
    assert.match(src, /standardExamPrepQuestionScopeSql\(\)/);
  });

  it("buildFlashcardUsabilitySql applies scopeGateSql(entitlement)", () => {
    assert.match(src, /scopeGateSql\(entitlement\)/);
  });
});

describe("Phase 2 — NP scope gate applied in flashcard-learner-exam-pool-sql.ts", () => {
  const src = read("lib/flashcards/flashcard-learner-exam-pool-sql.ts");

  it("imports npProviderQuestionScopeSql", () => {
    assert.match(src, /npProviderQuestionScopeSql/);
  });

  it("defines scopeGateSqlForPool() that branches on NP tier", () => {
    assert.match(src, /function scopeGateSqlForPool/);
    assert.match(src, /tier === "NP"/);
  });

  it("flashcardLearnerExamPoolWhereSql appends scopeGate", () => {
    assert.match(src, /scopeGate = scopeGateSqlForPool\(poolScope\)/);
    assert.match(src, /\$\{scopeGate\}/);
  });
});

// ─── Phase 3: validateEligiblePool ──────────────────────────────────────────

describe("Phase 3 — validateEligiblePool shared validator", () => {
  const src = read("lib/content-inventory/validate-eligible-pool.ts");

  it("exports validateEligiblePool async function", () => {
    assert.match(src, /export async function validateEligiblePool/);
  });

  it("returns EligiblePoolResult with poolCount, eligibilityCode, eligibilityReason, entitlementResult, canStudy", () => {
    assert.match(src, /poolCount:/);
    assert.match(src, /eligibilityCode:/);
    assert.match(src, /eligibilityReason:/);
    assert.match(src, /entitlementResult:/);
    assert.match(src, /canStudy:/);
  });

  it("defines all six PoolEligibilityCode variants", () => {
    assert.match(src, /eligible/);
    assert.match(src, /empty_exam_pool/);
    assert.match(src, /empty_flashcard_pool/);
    assert.match(src, /empty_all_pools/);
    assert.match(src, /access_denied/);
    assert.match(src, /pathway_not_found/);
  });

  it("routes through contentInventoryResolver for counts", () => {
    assert.match(src, /contentInventoryResolver/);
  });

  it("returns canStudy=false for empty pools", () => {
    assert.match(src, /canStudy = code === "eligible"/);
  });

  it("logs validate_eligible_pool_empty when pool is empty", () => {
    assert.match(src, /validate_eligible_pool_empty/);
  });

  it("handles all six ContentInventorySurface values in surfacePoolCount", () => {
    assert.match(src, /case "cat":/);
    assert.match(src, /case "practice":/);
    assert.match(src, /case "flashcards":/);
    assert.match(src, /case "study_plan":/);
    assert.match(src, /case "weak_areas":/);
    assert.match(src, /case "readiness":/);
  });
});

// ─── Phase 4: Study plan pool guard ─────────────────────────────────────────

describe("Phase 4 — Study plan suppresses empty-pool recommendations", () => {
  const src = read("lib/learner/personalized-weak-area-study-plan.ts");

  it("imports validateEligiblePool", () => {
    assert.match(src, /validateEligiblePool/);
  });

  it("defines filterRecsWithEmptyPool() async guard function", () => {
    assert.match(src, /async function filterRecsWithEmptyPool/);
  });

  it("filterRecsWithEmptyPool calls validateEligiblePool for flashcard surface", () => {
    const fnStart = src.indexOf("async function filterRecsWithEmptyPool");
    const fnEnd = src.indexOf("\n}", fnStart + 50);
    const fn = src.slice(fnStart, fnEnd + 2);
    assert.match(fn, /surface: "flashcards"/);
    assert.match(fn, /surface: "practice"/);
  });

  it("logs recommendation_suppressed_empty_pool when a rec is suppressed", () => {
    assert.match(src, /recommendation_suppressed_empty_pool/);
  });

  it("chains filterRecsWithEmptyPool before building the public plan output", () => {
    assert.match(src, /filterRecsWithEmptyPool\(rawRecs/);
    assert.match(src, /const recs = await filterRecsWithEmptyPool/);
  });

  it("does not suppress recs when pathwayId is null (graceful no-op)", () => {
    const fnStart = src.indexOf("async function filterRecsWithEmptyPool");
    const fnEnd = src.indexOf("\n}", fnStart + 50);
    const fn = src.slice(fnStart, fnEnd + 2);
    assert.match(fn, /if.*!pathwayId.*return recs/);
  });
});

// ─── Tier × Country invariant matrix ─────────────────────────────────────────

describe("Tier/country parity invariant: all tiers use the same canonical gate chain", () => {
  const canonicalSrc = read("lib/study-question-pool/canonical-exam-question-where.ts");
  const catSrc = read("lib/practice-tests/cat-pool.ts");
  const flashcardHubSrc = read("lib/flashcards/flashcard-exam-bank-hub-inventory.ts");
  const flashcardPoolSrc = read("lib/flashcards/flashcard-learner-exam-pool-sql.ts");

  it("RN/RPN/NP/ALLIED: CAT applies tier-aware scope gate (np vs standard)", () => {
    assert.match(catSrc, /npProviderQuestionScopeWhere/);
    assert.match(catSrc, /standardExamPrepQuestionScopeWhere/);
    assert.match(catSrc, /roleTrack.*===.*"np"/);
  });

  it("RN/RPN/NP/ALLIED: Flashcard hub SQL applies tier-aware scope gate (np vs standard)", () => {
    assert.match(flashcardHubSrc, /tier === "NP"/);
    assert.match(flashcardHubSrc, /npProviderQuestionScopeSql/);
    assert.match(flashcardHubSrc, /standardExamPrepQuestionScopeSql/);
  });

  it("RN/RPN/NP/ALLIED: Flashcard learner pool SQL applies tier-aware scope gate", () => {
    assert.match(flashcardPoolSrc, /tier === "NP"/);
    assert.match(flashcardPoolSrc, /npProviderQuestionScopeSql/);
    assert.match(flashcardPoolSrc, /standardExamPrepQuestionScopeSql/);
  });

  it("RT (ALLIED): CAT applies RT ventilator gate", () => {
    assert.match(catSrc, /rtVentilatorPremiumBankGateWhere/);
  });

  it("RT (ALLIED): Flashcard hub SQL applies RT ventilator gate", () => {
    assert.match(flashcardHubSrc, /rtVentilatorGateSql/);
  });

  it("RT (ALLIED): Flashcard learner pool SQL applies RT ventilator gate", () => {
    assert.match(flashcardPoolSrc, /rtVentilatorGateSqlForPool/);
  });

  it("CA/US: CAT applies region scope via questionAccessWhereWithPathway (alignAccessScopeToPathwayForExamQuestionPool)", () => {
    const pathwayScopeSrc = read("lib/exam-pathways/pathway-content-scope.ts");
    assert.match(pathwayScopeSrc, /alignAccessScopeToPathwayForExamQuestionPool/);
    assert.match(pathwayScopeSrc, /country: pathway\.countryCode/);
  });

  it("CA/US: Flashcard learner pool SQL scopes region via examQuestionsDiscoveryWhereSql", () => {
    assert.match(flashcardPoolSrc, /examQuestionsDiscoveryWhereSql/);
  });

  it("Free users: CAT gates on hasAccess=false return empty pool", () => {
    assert.match(catSrc, /subscriptionCoversPathwayBase/);
  });

  it("Free users: Flashcard scope resolution gates on hasAccess=false return scope:null with subscription_no_access code", () => {
    const invSrc = read("lib/flashcards/load-flashcards-exam-inventory.server.ts");
    assert.match(invSrc, /subscription_no_access/);
    assert.match(invSrc, /!entitlement\.hasAccess/);
  });

  it("canonical WHERE encodes non-ECG + module + RT + scope gates — all four tiers share same chain", () => {
    assert.match(canonicalSrc, /NON_ECG_PRACTICE_EXAM_WHERE/);
    assert.match(canonicalSrc, /generalStudyBankModuleSurfaceWhere/);
    assert.match(canonicalSrc, /rtVentilatorPremiumBankGateWhere/);
    assert.match(canonicalSrc, /npProviderQuestionScopeWhere.*standardExamPrepQuestionScopeWhere|standardExamPrepQuestionScopeWhere.*npProviderQuestionScopeWhere/s);
  });
});
