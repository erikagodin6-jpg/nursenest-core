/**
 * Contract checks (always run) + optional DB-backed smoke when DATABASE_URL is set.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { CountryCode, Prisma, TierCode } from "@prisma/client";
import { coreApiStudyDiagnosticsEnabled } from "@/lib/observability/core-api-diagnostics";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import { NON_ECG_PRACTICE_EXAM_WHERE, isCompleteCatQuestionRow } from "@/lib/practice-tests/cat-pool";
import { loadExamQuestionHubInventoryForPathway } from "@/lib/flashcards/flashcard-exam-bank-hub-inventory";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

const appRoot = join(process.cwd(), "src");

describe("core API learning surfaces", () => {
  it("diagnostics helper is off in production by default", () => {
    const orig = process.env.NODE_ENV;
    const origDiag = process.env.CORE_API_DIAGNOSTICS;
    try {
      process.env.NODE_ENV = "production";
      delete process.env.CORE_API_DIAGNOSTICS;
      assert.equal(coreApiStudyDiagnosticsEnabled(), false);
      process.env.CORE_API_DIAGNOSTICS = "1";
      assert.equal(coreApiStudyDiagnosticsEnabled(), true);
    } finally {
      process.env.NODE_ENV = orig;
      if (origDiag === undefined) delete process.env.CORE_API_DIAGNOSTICS;
      else process.env.CORE_API_DIAGNOSTICS = origDiag;
    }
  });

  it("practice test question route uses CAT- and linear-exam-aware teachingExposure", () => {
    const src = readFileSync(join(appRoot, "app/api/practice-tests/[id]/question/route.ts"), "utf8");
    assert.match(src, /catStripTeaching/);
    assert.match(src, /linearExamHideTeaching/);
    assert.match(src, /teachingExposure/);
    assert.match(src, /mergeQuestionApiPayload\([\s\S]*teachingExposure/s);
  });

  it("practice test question route accepts index and questionId locators", () => {
    const src = readFileSync(join(appRoot, "app/api/practice-tests/[id]/question/route.ts"), "utf8");
    assert.match(src, /searchParams\.get\("index"\)/);
    assert.match(src, /searchParams\.get\("questionId"\)/);
    assert.match(src, /question_locator_required/);
    assert.match(src, /question_not_in_session/);
  });

  it("NCLEX exam runners use the index locator for fallback question hydration", () => {
    const practice = readFileSync(join(appRoot, "components/exam/nclex-practice-runner.tsx"), "utf8");
    const cat = readFileSync(join(appRoot, "components/exam/nclex-cat-runner.tsx"), "utf8");
    assert.match(practice, /\/question\?index=/);
    assert.match(cat, /\/question\?index=/);
    assert.doesNotMatch(practice, /\/question\?questionId=/);
    assert.doesNotMatch(cat, /\/question\?questionId=/);
  });

  it("learner flashcard study clients bound fetches with abort, timeout, and retry states", () => {
    const deck = readFileSync(join(appRoot, "components/flashcards/flashcard-study-client.tsx"), "utf8");
    const custom = readFileSync(join(appRoot, "components/flashcards/flashcard-custom-study-client.tsx"), "utf8");
    const page = readFileSync(join(appRoot, "app/(app)/app/(learner)/flashcards/[deckRef]/page.tsx"), "utf8");
    const helper = readFileSync(join(appRoot, "lib/runtime/learner-activity-fetch.ts"), "utf8");
    assert.match(deck, /new AbortController\(\)/);
    assert.match(deck, /timeoutMs:\s*12_000/);
    assert.match(deck, /setRetryNonce/);
    assert.match(custom, /new AbortController\(\)/);
    assert.match(custom, /timeoutMs:\s*12_000/);
    assert.match(custom, /setRetryNonce/);
    assert.match(page, /loadLearnerActivityBootstrap/);
    assert.match(page, /routeParams/);
    assert.match(helper, /fetchLearnerActivityJson/);
    assert.match(helper, /logDedupedClientDiagnostic/);
    assert.doesNotMatch(deck, /console\./);
    assert.doesNotMatch(custom, /console\./);
  });

  it("learner flashcard analytics and CAT insights use cancellable activity fetches", () => {
    const srs = readFileSync(join(appRoot, "components/flashcards/flashcard-srs-stats-strip.tsx"), "utf8");
    const readiness = readFileSync(join(appRoot, "components/flashcards/flashcards-hub-readiness-strip.tsx"), "utf8");
    const analytics = readFileSync(join(appRoot, "components/flashcards/flashcards-hub-analytics.tsx"), "utf8");
    const catInsights = readFileSync(join(appRoot, "app/(app)/app/(learner)/practice-tests/cat-insights/page.tsx"), "utf8");
    for (const src of [srs, readiness, analytics, catInsights]) {
      assert.match(src, /fetchLearnerActivityJson/);
      assert.match(src, /AbortController/);
      assert.doesNotMatch(src, /console\./);
    }
  });

  it("core learner activity routes use the shared bootstrap lifecycle", () => {
    const lifecycle = readFileSync(join(appRoot, "lib/learner/activity-lifecycle.ts"), "utf8");
    const state = readFileSync(join(appRoot, "components/student/learner-activity-state.tsx"), "utf8");
    const flashDeck = readFileSync(join(appRoot, "app/(app)/app/(learner)/flashcards/[deckRef]/page.tsx"), "utf8");
    const flashDeckDetail = readFileSync(join(appRoot, "app/(app)/app/(learner)/flashcards/decks/[deckId]/page.tsx"), "utf8");
    const flashCustom = readFileSync(join(appRoot, "app/(app)/app/(learner)/flashcards/custom/page.tsx"), "utf8");
    const flashWeak = readFileSync(join(appRoot, "app/(app)/app/(learner)/flashcards/weak-areas/page.tsx"), "utf8");
    const practiceRun = readFileSync(join(appRoot, "app/(app)/app/(learner)/practice-tests/[id]/page.tsx"), "utf8");
    const catStart = readFileSync(join(appRoot, "app/(app)/app/(learner)/practice-tests/start/page.tsx"), "utf8");
    assert.match(lifecycle, /LearnerActivityPhase/);
    assert.match(lifecycle, /auth-resolving/);
    assert.match(lifecycle, /normalizeLearnerActivityRouteParams/);
    assert.match(state, /LearnerActivityState/);
    for (const src of [flashDeck, flashDeckDetail, flashCustom, flashWeak, practiceRun, catStart]) {
      assert.match(src, /loadLearnerActivityBootstrap/);
      assert.match(src, /LearnerActivityState/);
    }
    assert.doesNotMatch(flashDeck, /getProtectedRouteSession/);
    assert.doesNotMatch(flashDeckDetail, /getProtectedRouteSession/);
    assert.doesNotMatch(flashCustom, /getProtectedRouteSession/);
    assert.doesNotMatch(flashWeak, /getProtectedRouteSession/);
    assert.doesNotMatch(practiceRun, /getProtectedRouteSession/);
    assert.doesNotMatch(catStart, /getProtectedRouteSession/);
  });

  it("pathway question snapshot applies non-ECG pool filter", () => {
    const snap = readFileSync(join(appRoot, "lib/exam-pathways/pathway-question-bank-snapshot.server.ts"), "utf8");
    assert.match(snap, /NON_ECG_PRACTICE_EXAM_WHERE/);
    assert.match(snap, /pathwayExamQuestionMarketingHubInventoryWhere/);
    assert.match(snap, /inventoryWhere/);
  });

  it("splitPromptLeadingImage ignores img with empty src", async () => {
    const { splitPromptLeadingImage } = await import("@/components/flashcards/flashcard-study-question-stack");
    const r = splitPromptLeadingImage('<img src="" alt="x">Real stem here');
    assert.equal(r.imageHtml, null);
    assert.ok(r.remainingPrompt.includes("Real stem"));
  });

  it("sitemap route serves XML via NextResponse", () => {
    const route = readFileSync(join(appRoot, "app/sitemap.xml/route.ts"), "utf8");
    assert.match(route, /SITEMAP_XML_HEADERS|application\/xml/);
    assert.match(route, /urlset|sitemap/i);
  });

  it("marketing default homepage route exists", () => {
    const page = readFileSync(join(appRoot, "app/(marketing)/(default)/page.tsx"), "utf8");
    assert.match(page, /export default/);
  });

  it("admin blog generate-ai returns publicUrl on success rows", () => {
    const route = readFileSync(join(appRoot, "app/api/admin/blog/generate-ai/route.ts"), "utf8");
    assert.match(route, /publicUrl:\s*adminBlogPublicUrl/);
    assert.match(route, /adminEditUrl/);
  });
});

const dbUrl = Boolean(process.env.DATABASE_URL?.trim());
const itDb = dbUrl && isDatabaseUrlConfigured() ? it : it.skip;

describe("core API DB smoke (DATABASE_URL)", () => {
  itDb("RN pathway: non-ECG bank + flashcard hub queries (strict when CORE_API_STRICT=1)", async () => {
    const { prisma } = await import("@/lib/db");
    const pathwayId = "us-rn-nclex-rn";
    const pathway = getExamPathwayById(pathwayId);
    assert.ok(pathway);
    const ent: AccessScope = {
      hasAccess: true,
      reason: "active_subscription",
      tier: TierCode.RN,
      country: CountryCode.US,
      alliedCareer: null,
    };
    const baseNonEcg: Prisma.ExamQuestionWhereInput = {
      AND: [pathwayExamQuestionMarketingWhere(pathway!), NON_ECG_PRACTICE_EXAM_WHERE],
    };
    const [n, hub] = await Promise.all([
      prisma.examQuestion.count({ where: baseNonEcg }),
      loadExamQuestionHubInventoryForPathway(ent, pathwayId, buildGlobalExamContext(pathwayId, "en"), null),
    ]);
    assert.equal(typeof n, "number");
    assert.equal(typeof hub.total, "number");
    if (process.env.CORE_API_STRICT === "1") {
      assert.ok(n > 0, "CORE_API_STRICT: expected seeded non-ECG ExamQuestion rows for RN pathway");
      assert.ok(hub.total > 0, "CORE_API_STRICT: flashcard hub inventory should reflect bank");
      const adaptiveSample = await prisma.examQuestion.findMany({
        where: { AND: [baseNonEcg, { isAdaptiveEligible: true }] },
        select: { stem: true, options: true, correctAnswer: true, rationale: true },
        take: 400,
      });
      const complete = adaptiveSample.filter((q) => isCompleteCatQuestionRow(q)).length;
      assert.ok(complete > 0, "CORE_API_STRICT: expected complete adaptive-eligible sample");
    }
  });
});
