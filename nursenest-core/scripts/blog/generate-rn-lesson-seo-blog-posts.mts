#!/usr/bin/env npx tsx
import { BlogPostStatus, BlogWorkflowStatus, ContentStatus, PrismaClient } from "@prisma/client";
import { loadBlogAuditEnv } from "../../src/lib/db/blog-audit-env-load";
import {
  RN_LESSON_BLOG_PATHWAY_IDS,
  buildRnLessonSeoDraft,
  buildRnLessonSeoVariants,
  keywordClusterFromDuplicateHash,
  lessonHasHighQualityBody,
} from "../../src/lib/blog/rn-lesson-seo-blog-generator";
import { adminBlogPublicUrl } from "../../src/lib/blog/admin-blog-generation-service";

type CliArgs = {
  apply: boolean;
  limit: number;
  minLessonWords: number;
};

function parseArgs(argv: string[]): CliArgs {
  let apply = false;
  let limit = 12;
  let minLessonWords = 700;
  for (const arg of argv) {
    if (arg === "--apply") apply = true;
    if (arg.startsWith("--limit=")) {
      const n = Number(arg.slice("--limit=".length));
      if (Number.isFinite(n) && n > 0) limit = Math.floor(n);
    }
    if (arg.startsWith("--min-lesson-words=")) {
      const n = Number(arg.slice("--min-lesson-words=".length));
      if (Number.isFinite(n) && n > 0) minLessonWords = Math.floor(n);
    }
  }
  return { apply, limit, minLessonWords };
}

function toIsoDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const env = await loadBlogAuditEnv({
    appRoot: process.cwd(),
    repoRoot: process.cwd(),
    whenMissingDatabaseUrlLog:
      "[rn-lesson-seo] DATABASE_URL missing; run with configured DB to read lessons and write blog posts.",
  });
  if (!env.databaseUrlSet) {
    console.error("[rn-lesson-seo] DATABASE_URL is required.");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const now = new Date();
  try {
    const lessons = await prisma.pathwayLesson.findMany({
      where: {
        pathwayId: { in: [...RN_LESSON_BLOG_PATHWAY_IDS] },
        status: ContentStatus.PUBLISHED,
        structuralPublicComplete: true,
        locale: "en",
      },
      orderBy: [{ updatedAt: "desc" }],
      select: {
        pathwayId: true,
        slug: true,
        title: true,
        topic: true,
        topicSlug: true,
        bodySystem: true,
        sections: true,
      },
      take: Math.max(args.limit * 5, 60),
    });

    const highQuality = lessons.filter((lesson) => lessonHasHighQualityBody(lesson.sections, args.minLessonWords));
    const plannedRows: Array<Record<string, string>> = [];
    let created = 0;
    let skipped = 0;

    for (const lesson of highQuality) {
      const variants = buildRnLessonSeoVariants(lesson.topic || lesson.title);
      for (const variant of variants) {
        if (created >= args.limit) break;
        const draft = buildRnLessonSeoDraft({ lesson, variant });
        const keywordCluster = keywordClusterFromDuplicateHash(draft.hash);

        const existing = await prisma.blogPost.findFirst({
          where: {
            OR: [
              { keywordCluster },
              { slug: draft.slug },
            ],
          },
          select: { id: true, slug: true, title: true },
        });

        if (existing) {
          skipped += 1;
          plannedRows.push({
            status: "skipped_duplicate",
            topicSlug: lesson.topicSlug,
            title: draft.title,
            slug: existing.slug,
            lesson: lesson.slug,
            url: adminBlogPublicUrl(existing.slug),
          });
          continue;
        }

        const row = {
          slug: draft.slug,
          title: draft.title,
          excerpt: draft.excerpt,
          body: draft.body,
          tags: ["rn", "nclex-rn", lesson.topicSlug, "practice-questions"],
          category: `RN ${lesson.bodySystem}`,
          postStatus: BlogPostStatus.PUBLISHED,
          workflowStatus: BlogWorkflowStatus.PUBLISHED,
          publishAt: now,
          exam: "RN",
          seoTitle: `${draft.title} | NurseNest`,
          seoDescription: draft.excerpt,
          postTemplate: null,
          relatedLessonPaths: [draft.lessonPath],
          relatedQuestionIds: [],
          relatedTools: [],
          adminPublishLog: [],
          targetKeyword: draft.topicLabel,
          keywordCluster,
          intent: "PRACTICE_QUESTIONS" as const,
          funnelStage: "CONVERSION" as const,
          ctaType: "free_trial",
          ctaText: "Start free trial",
          ctaHref: "/pricing",
          legacySource: "rn-lesson-seo-auto-v1",
          careerSlug: "rn",
          locale: "en",
          sourceLocale: "en",
        };

        if (args.apply) {
          await prisma.blogPost.create({ data: row });
        }
        created += 1;
        plannedRows.push({
          status: args.apply ? "published" : "dry_run",
          topicSlug: lesson.topicSlug,
          title: draft.title,
          slug: draft.slug,
          lesson: lesson.slug,
          url: `/blog/rn/${draft.slug}`,
        });
      }
      if (created >= args.limit) break;
    }

    console.log(
      JSON.stringify(
        {
          mode: args.apply ? "apply" : "dry_run",
          generatedAt: now.toISOString(),
          publishDate: toIsoDateOnly(now),
          pathways: RN_LESSON_BLOG_PATHWAY_IDS,
          lessonCandidates: lessons.length,
          highQualityLessons: highQuality.length,
          created,
          skipped,
          rows: plannedRows,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("[rn-lesson-seo] failed", error);
  process.exit(1);
});

