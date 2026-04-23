#!/usr/bin/env npx tsx
/**
 * Bounded audit: naive `pathway_lessons` marketing-shaped rows vs {@link evaluatePublicMarketingLessonCrossLinkIntegrity}
 * (same contract as the lessons hub). Reports included vs excluded counts and reason histogram; fails if any slug
 * that passes the Prisma list gate still fails integrity (expected 0 after hub alignment — surfaces gaps early).
 *
 * Usage:
 *   cd nursenest-core && npx tsx scripts/audit/marketing-public-lesson-cross-links.mts
 *
 * Env:
 *   AUDIT_MARKETING_CROSS_LINK_PATHWAY — optional pathway id (default: first public pathway)
 *   AUDIT_MARKETING_CROSS_LINK_LIMIT — max rows per pathway (default 40, max 200)
 */
import { ContentStatus } from "@prisma/client";
import { listPublicExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import { prisma } from "@/lib/db";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { evaluatePublicMarketingLessonCrossLinkIntegrity } from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import { PATHWAY_LESSON_CANONICAL_DB_LOCALE } from "@/lib/lessons/pathway-lesson-locale";

const limit = Math.min(200, Math.max(5, Number(process.env.AUDIT_MARKETING_CROSS_LINK_LIMIT ?? "40") || 40));

async function main() {
  const pathways = listPublicExamPathways();
  const targetId = process.env.AUDIT_MARKETING_CROSS_LINK_PATHWAY?.trim();
  const pathway = targetId ? pathways.find((p) => p.id === targetId) ?? pathways[0] : pathways[0];
  if (!pathway) {
    console.error("No public pathway");
    process.exit(1);
  }
  const lessonContentLocale = await getMarketingLocaleForDefaultRoute();
  const rows = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId: pathway.id,
      status: ContentStatus.PUBLISHED,
      structuralPublicComplete: true,
      locale: PATHWAY_LESSON_CANONICAL_DB_LOCALE,
    },
    select: { slug: true },
    take: limit,
    orderBy: { updatedAt: "desc" },
  });

  const reasons: Record<string, number> = {};
  let kept = 0;
  let dropped = 0;
  const unsafe: { slug: string; reason: string }[] = [];

  for (const r of rows) {
    const ev = await evaluatePublicMarketingLessonCrossLinkIntegrity(pathway, r.slug, lessonContentLocale);
    if (ev.ok) {
      kept++;
      const second = await evaluatePublicMarketingLessonCrossLinkIntegrity(pathway, r.slug, lessonContentLocale);
      if (!second.ok) {
        unsafe.push({ slug: r.slug, reason: `re_eval_mismatch:${second.reason}` });
      }
    } else {
      dropped++;
      reasons[ev.reason] = (reasons[ev.reason] ?? 0) + 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        pathwayId: pathway.id,
        lessonContentLocale,
        scanned: rows.length,
        integrityKept: kept,
        integrityDropped: dropped,
        dropReasonHistogram: reasons,
        reEvalUnsafe: unsafe.length,
      },
      null,
      2,
    ),
  );

  if (unsafe.length > 0) {
    console.error("marketing-public-lesson-cross-links: re-eval mismatch", unsafe.slice(0, 10));
    process.exit(1);
  }

  console.log("marketing-public-lesson-cross-links: OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
