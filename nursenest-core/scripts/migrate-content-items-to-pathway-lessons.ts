/**
 * Match `content_items` (type lesson) to `pathway_lessons` and optionally copy safer body/title into pathway rows.
 *
 * Defaults: dry-run (no writes). Use `--apply=true` to persist (still requires explicit review in ops).
 *
 * @example
 * npx tsx scripts/migrate-content-items-to-pathway-lessons.ts --dryRun=true --limit=20 --pathwayId=ca-rn-nclex-rn
 */
import { ContentStatus } from "@prisma/client";
import { bodyStringFromContentJson } from "@/lib/prisma/content-item-body";
import { prisma } from "@/lib/db";
import { parseMigrationCliArgs } from "@/lib/admin/migrate-content-items-to-pathway-cli-args";
import { pathwayLessonIdFromContentItemTags } from "@/lib/lessons/pathway-lesson-cms-link-tags";
import { computeStructuralPublicCompleteFromDbRow } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { pathwaySectionsFromPlainBody } from "@/lib/lessons/pathway-lesson-plain-body-sections";

function pathwaySyncIdsFromTags(tags: string[]): string[] {
  const out: string[] = [];
  for (const t of tags) {
    const s = t.trim();
    if (!s.toLowerCase().startsWith("pathway-sync:")) continue;
    out.push(s.slice("pathway-sync:".length).trim());
  }
  return [...new Set(out)].filter(Boolean);
}

async function main() {
  const { dryRun, limit, pathwayId, apply } = parseMigrationCliArgs(process.argv.slice(2));

  const whereCi = {
    type: "lesson" as const,
    ...(pathwayId ? { tags: { has: `pathway-sync:${pathwayId}` } } : {}),
  };

  const contentItems = await prisma.contentItem.findMany({
    where: whereCi,
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      seoTitle: true,
      content: true,
      tags: true,
      status: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });

  const matched: string[] = [];
  const unmatched: string[] = [];
  let wouldWrite = 0;

  for (const ci of contentItems) {
    const explicitId = pathwayLessonIdFromContentItemTags(ci.tags);
    const hints = pathwaySyncIdsFromTags(ci.tags ?? []);

    let pl =
      explicitId != null
        ? await prisma.pathwayLesson.findFirst({
            where: { id: explicitId, locale: "en" },
          })
        : null;

    if (!pl && hints.length === 1 && ci.slug) {
      pl = await prisma.pathwayLesson.findFirst({
        where: { pathwayId: hints[0]!, slug: ci.slug, locale: "en" },
      });
    }

    if (!pl && ci.slug && pathwayId) {
      pl = await prisma.pathwayLesson.findFirst({
        where: { pathwayId, slug: ci.slug, locale: "en" },
      });
    }

    if (!pl && ci.slug) {
      const list = await prisma.pathwayLesson.findMany({
        where: { slug: ci.slug, locale: "en" },
        take: 5,
      });
      if (list.length === 1) pl = list[0]!;
    }

    if (!pl) {
      unmatched.push(`${ci.id} slug=${ci.slug}`);
      continue;
    }

    matched.push(`${ci.id} -> ${pl.id} (${pl.pathwayId}/${pl.slug})`);

    const ciBody = bodyStringFromContentJson(ci.content);
    const plBody = typeof pl.sections === "object" ? JSON.stringify(pl.sections) : "";
    const ciRicher = ciBody.trim().length > plBody.trim().length + 80;
    const safeCopy =
      ci.status?.toLowerCase() === "published" &&
      ciRicher &&
      (explicitId != null || hints.length === 1 || (pathwayId != null && pl.pathwayId === pathwayId));

    if (safeCopy) {
      wouldWrite += 1;
      if (apply) {
        const mergedTitle = ci.title.trim() || pl.title;
        const sections = pathwaySectionsFromPlainBody(ciBody, mergedTitle) as unknown as typeof pl.sections;
        const merged = {
          ...pl,
          title: mergedTitle,
          seoTitle: ci.seoTitle?.trim() || mergedTitle,
          seoDescription: (ci.summary ?? pl.seoDescription).trim() || pl.seoDescription,
          sections,
          status: ContentStatus.PUBLISHED,
          published_at: new Date(),
        };
        const structuralPublicComplete = computeStructuralPublicCompleteFromDbRow({
          ...merged,
          pathwayId: pl.pathwayId,
        });
        await prisma.pathwayLesson.update({
          where: { id: pl.id },
          data: {
            title: merged.title,
            seoTitle: merged.seoTitle,
            seoDescription: merged.seoDescription,
            sections: merged.sections,
            status: merged.status,
            structuralPublicComplete,
            published_at: merged.published_at,
          },
        });
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        dryRun,
        apply,
        limit,
        pathwayId,
        contentItemsScanned: contentItems.length,
        matchedCount: matched.length,
        unmatchedCount: unmatched.length,
        wouldWritePathwayRows: wouldWrite,
        matched: matched.slice(0, 200),
        unmatched: unmatched.slice(0, 200),
      },
      null,
      2,
    ),
  );

  if (dryRun && !apply) {
    // eslint-disable-next-line no-console
    console.log("Dry run: no database writes performed.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
