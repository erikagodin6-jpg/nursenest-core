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

  it("pathway question snapshot applies non-ECG pool filter", () => {
    const snap = readFileSync(join(appRoot, "lib/exam-pathways/pathway-question-bank-snapshot.server.ts"), "utf8");
    assert.match(snap, /NON_ECG_PRACTICE_EXAM_WHERE/);
    assert.match(snap, /baseNonEcg/);
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
