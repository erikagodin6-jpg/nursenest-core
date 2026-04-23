import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { runContentBatch, batchToPrismaInputs } from "@/lib/content-pipeline/batch-generator";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { generateSeo, assertRequiredSeoFieldsPresent } from "@/lib/seo/seo-generator";
import { assertSeoSafeToCreatePathwayLesson } from "@/lib/seo/seo-duplicate-guard";
import { mapExamStringToSeoTier, seoDomainForTaxonomyCategory } from "@/lib/seo/seo-taxonomy-align";
import { validatePathwayLessonTaxonomyBeforeWrite } from "@/lib/taxonomy/nursing-taxonomy-validation";
import type { ContentBatchInput } from "@/lib/content-pipeline/types";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

const topicSpecSchema = z.object({
  topicSlug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "topicSlug must be lowercase kebab-case"),
  topicLabel: z.string().min(2).max(200),
  bodySystem: z.string().min(2).max(100),
  tags: z.array(z.string().min(1).max(80)).min(1).max(20),
  difficulty: z.enum(["easy", "medium", "hard"]),
  exam: z.enum(["RN", "RPN", "LPN", "NP", "Allied"]).optional(),
  country: z.enum(["US", "CA"]).optional(),
  questionCount: z.number().int().min(1).max(10).optional(),
});

const batchRequestSchema = z.object({
  pathwayId: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "pathwayId must be lowercase kebab-case"),
  locale: z.string().min(2).max(10).optional().default("en"),
  exam: z.enum(["RN", "RPN", "LPN", "NP", "Allied"]),
  country: z.enum(["US", "CA"]),
  allowDuplicates: z.boolean().optional().default(false),
  /**
   * When true, the route runs the pipeline and immediately inserts into the DB
   * via prisma.createMany (skipDuplicates: true).
   * When false (default), returns the JSON batch for inspection before import.
   */
  importNow: z.boolean().optional().default(false),
  topics: z
    .array(topicSpecSchema)
    .min(1)
    .max(35, "Maximum 35 topics per batch to avoid timeouts"),
});

// ---------------------------------------------------------------------------
// POST /api/admin/content-pipeline/batch
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  const adminCheck = await requireAdmin(req);
  if (!adminCheck.ok) return adminCheck.response;

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = batchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const input: ContentBatchInput = parsed.data;

  let batchOutput;
  try {
    batchOutput = await runContentBatch(input);
  } catch (e) {
    console.error("[content-pipeline/batch] runContentBatch error:", e);
    return NextResponse.json(
      { error: "Pipeline failed", message: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }

  // ── Optional immediate DB import ─────────────────────────────────────────
  if (parsed.data.importNow) {
    const { prisma } = await import("@/lib/db");
    const { lessons: lessonRows, questions } = batchToPrismaInputs(batchOutput);
    let importStats: Record<string, number> = {};

    const taxonomyViolations: { slug: string; violations: string[] }[] = [];
    const seoViolations: { slug: string; message: string }[] = [];
    const lessonsReady: typeof lessonRows = [];
    for (const row of lessonRows) {
      const v = validatePathwayLessonTaxonomyBeforeWrite({
        title: row.title,
        topic: row.topic,
        topicSlug: row.topicSlug,
        bodySystem: row.bodySystem,
        seoDescription: row.seoDescription,
        system: "",
        sections: row.sections as PathwayLessonRecord["sections"],
      });
      if (!v.ok) {
        taxonomyViolations.push({ slug: row.slug, violations: v.violations });
        continue;
      }
      const bodySystem = v.classification.category;
      const tier = mapExamStringToSeoTier(parsed.data.exam);
      const domain = seoDomainForTaxonomyCategory(bodySystem);
      const seo = generateSeo({
        title: row.title,
        category: bodySystem,
        domain,
        tier,
        keywords: [row.topic, row.topicSlug.replace(/-/g, " ")],
      });
      try {
        assertRequiredSeoFieldsPresent({
          slug: row.slug,
          metaTitle: seo.metaTitle,
          metaDescription: seo.metaDescription,
          breadcrumb: seo.breadcrumb,
        });
        await assertSeoSafeToCreatePathwayLesson(prisma, {
          pathwayId: row.pathwayId,
          locale: row.locale,
          slug: row.slug,
          metaTitle: seo.metaTitle,
          h1: seo.h1,
        });
      } catch (e) {
        seoViolations.push({
          slug: row.slug,
          message: e instanceof Error ? e.message : String(e),
        });
        continue;
      }
      lessonsReady.push({
        ...row,
        bodySystem,
        seoTitle: seo.metaTitle.slice(0, 200),
        seoDescription: seo.metaDescription.slice(0, 500),
      });
    }
    if (taxonomyViolations.length > 0 || seoViolations.length > 0) {
      return NextResponse.json(
        {
          error: "Taxonomy or SEO validation failed",
          taxonomyViolations,
          seoViolations,
          stats: batchOutput.stats,
          generatedAt: batchOutput.generatedAt,
        },
        { status: 422 },
      );
    }

    try {
      const [lessonResult, questionResult] = await Promise.all([
        lessonsReady.length > 0
          ? prisma.pathwayLesson.createMany({ data: lessonsReady as never[], skipDuplicates: true })
          : Promise.resolve({ count: 0 }),
        questions.length > 0
          ? prisma.examQuestion.createMany({ data: questions as never[], skipDuplicates: true })
          : Promise.resolve({ count: 0 }),
      ]);
      importStats = {
        lessonsInserted: lessonResult.count,
        questionsInserted: questionResult.count,
      };
    } catch (e) {
      console.error("[content-pipeline/batch] Prisma import error:", e);
      return NextResponse.json(
        {
          error: "Prisma import failed",
          message: e instanceof Error ? e.message : String(e),
          batchOutput,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      imported: true,
      importStats,
      stats: batchOutput.stats,
      errors: batchOutput.errors,
      generatedAt: batchOutput.generatedAt,
    });
  }

  // ── Return JSON batch for inspection / offline import ────────────────────
  return NextResponse.json({
    ok: true,
    imported: false,
    generatedAt: batchOutput.generatedAt,
    input: batchOutput.input,
    stats: batchOutput.stats,
    errors: batchOutput.errors,
    pathwayLessons: batchOutput.pathwayLessons,
    examQuestions: batchOutput.examQuestions,
  });
}
