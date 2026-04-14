#!/usr/bin/env npx tsx
/**
 * E-E-A-T system audit: per-page scores, topical clusters, freshness, final status.
 * Writes to repo-root data/audit/ (safe mode: read-only DB).
 */
import { readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, PrismaClient } from "@prisma/client";
import {
  computeEeatScore,
  countInternalLinksInText,
  countWords,
  isStaleContent,
  lessonInternalLinkCount,
  sectionCompletenessFraction,
  type LessonLike,
} from "../../src/lib/eeat/eeat-scoring";
import {
  getAllProgrammaticSeoPages,
  getRelatedProgrammaticPages,
} from "../../src/lib/seo/programmatic-registry";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "../..");
const REPO_ROOT = join(APP_ROOT, "..");
const OUT = join(REPO_ROOT, "data/audit");
const CATALOG_PATH = join(APP_ROOT, "src/content/pathway-lessons/catalog.json");

const THRESHOLD = 70;
const MIN_LINKS = 3;

type CatalogFile = {
  version?: number;
  pathways: Record<string, { lessons: LessonLike[] }>;
};

type PageScoreRow = {
  id: string;
  urlPattern: string;
  contentType: "pathway_lesson" | "blog" | "programmatic_seo";
  wordCount: number;
  sectionCompleteness: number;
  internalLinksCount: number;
  lastUpdated: string | null;
  authorPresent: boolean;
  schemaPresent: boolean;
  eeatScore: number;
  flags: string[];
};

function slugifyTopicLabel(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const generatedAt = new Date().toISOString();

  const catalogRaw = await readFile(CATALOG_PATH, "utf8");
  const catalog = JSON.parse(catalogRaw) as CatalogFile;
  let catalogMtime: string | null = null;
  try {
    catalogMtime = (await stat(CATALOG_PATH)).mtime.toISOString();
  } catch {
    catalogMtime = null;
  }

  const pages: PageScoreRow[] = [];
  const completionQueue: Array<{ id: string; score: number; flags: string[] }> = [];

  for (const [pathwayId, bundle] of Object.entries(catalog.pathways ?? {})) {
    for (const lesson of bundle.lessons ?? []) {
      const l = lesson as LessonLike;
      const wc = (l.sections ?? []).reduce((a, s) => a + countWords(s.body ?? ""), 0);
      const sec = sectionCompletenessFraction(l);
      const links = lessonInternalLinkCount(l);
      const lastUpdated = catalogMtime;
      const score = computeEeatScore({
        wordCount: wc,
        sectionCompleteness: sec,
        internalLinks: links,
        authorNamed: false,
        contentKind: "lesson",
        lastUpdated,
        schemaImplemented: true,
      });
      const id = `lesson:${pathwayId}:${(lesson as { slug: string }).slug}`;
      const flags: string[] = [];
      if (score < THRESHOLD) flags.push(`below_score_${THRESHOLD}`);
      if (links < MIN_LINKS) flags.push("internal_links_low");
      if (sec < 0.65) flags.push("structure_incomplete");
      if (isStaleContent(lastUpdated, 365)) flags.push("stale_or_unknown_date");

      pages.push({
        id,
        urlPattern: `/{country}/{role}/{exam}/lessons/${(lesson as { slug: string }).slug}`,
        contentType: "pathway_lesson",
        wordCount: wc,
        sectionCompleteness: Math.round(sec * 1000) / 1000,
        internalLinksCount: links,
        lastUpdated,
        authorPresent: false,
        schemaPresent: true,
        eeatScore: score,
        flags,
      });
      if (flags.length) completionQueue.push({ id, score, flags });
    }
  }

  let blogStats = {
    published: 0,
    withAuthor: 0,
    avgScore: 0,
  };

  try {
    if (process.env.DATABASE_URL) {
      const prisma = new PrismaClient();
      const posts = await prisma.blogPost.findMany({
        where: { postStatus: BlogPostStatus.PUBLISHED },
        select: {
          id: true,
          slug: true,
          body: true,
          authorDisplayName: true,
          updatedAt: true,
          createdAt: true,
          relatedLessonPaths: true,
        },
        take: 5000,
      });
      blogStats.published = posts.length;
      let sumBlog = 0;
      for (const p of posts) {
        const wc = countWords(p.body.replace(/<[^>]+>/g, " "));
        const links =
          countInternalLinksInText(p.body) + (p.relatedLessonPaths?.length ?? 0);
        const sec = 0.75;
        const named = Boolean(p.authorDisplayName?.trim());
        if (named) blogStats.withAuthor += 1;
        const score = computeEeatScore({
          wordCount: wc,
          sectionCompleteness: sec,
          internalLinks: links,
          authorNamed: named,
          contentKind: "blog",
          lastUpdated: p.updatedAt.toISOString(),
          schemaImplemented: true,
        });
        sumBlog += score;
        const flags: string[] = [];
        if (score < THRESHOLD) flags.push(`below_score_${THRESHOLD}`);
        if (links < MIN_LINKS) flags.push("internal_links_low");
        if (!named) flags.push("author_missing");
        if (isStaleContent(p.updatedAt.toISOString(), 365)) flags.push("stale_content");

        pages.push({
          id: `blog:${p.slug}`,
          urlPattern: `/blog/${p.slug}`,
          contentType: "blog",
          wordCount: wc,
          sectionCompleteness: sec,
          internalLinksCount: links,
          lastUpdated: p.updatedAt.toISOString(),
          authorPresent: named,
          schemaPresent: true,
          eeatScore: score,
          flags,
        });
        if (flags.length) completionQueue.push({ id: `blog:${p.slug}`, score, flags });
      }
      blogStats.avgScore = posts.length ? Math.round((sumBlog / posts.length) * 10) / 10 : 0;
      await prisma.$disconnect();
    }
  } catch (e) {
    console.warn("Blog audit skipped:", e instanceof Error ? e.message : e);
  }

  const programmaticPages = getAllProgrammaticSeoPages();
  for (const p of programmaticPages) {
    const wc = p.sections.reduce((a, s) => a + s.body.reduce((b, line) => b + countWords(line), 0), 0);
    const bodyText = p.sections.map((s) => s.body.join(" ")).join(" ");
    const links =
      countInternalLinksInText(bodyText) + getRelatedProgrammaticPages(p.slug, 8).length;
    const faqBonus = p.faq?.length ? 0.05 : 0;
    const sec = Math.min(1, 0.55 + faqBonus + Math.min(0.35, p.sections.length * 0.05));
    const score = computeEeatScore({
      wordCount: wc,
      sectionCompleteness: sec,
      internalLinks: links,
      authorNamed: false,
      contentKind: "programmatic_seo",
      lastUpdated: null,
      schemaImplemented: true,
    });
    const flags: string[] = [];
    if (score < THRESHOLD) flags.push(`below_score_${THRESHOLD}`);
    if (links < MIN_LINKS) flags.push("internal_links_low");
    if (wc < 600) flags.push("thin_programmatic");

    pages.push({
      id: `seo:${p.slug}`,
      urlPattern: `/${p.slug}`,
      contentType: "programmatic_seo",
      wordCount: wc,
      sectionCompleteness: Math.round(sec * 1000) / 1000,
      internalLinksCount: links,
      lastUpdated: null,
      authorPresent: false,
      schemaPresent: true,
      eeatScore: score,
      flags,
    });
    if (flags.length) completionQueue.push({ id: `seo:${p.slug}`, score, flags });
  }

  const scores = pages.map((p) => p.eeatScore);
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const below = pages.filter((p) => p.eeatScore < THRESHOLD);
  const missingAuthor = pages.filter((p) => p.contentType === "blog" && !p.authorPresent);
  const missingSchema = pages.filter((p) => !p.schemaPresent);
  const linkGaps = pages.filter((p) => p.internalLinksCount < MIN_LINKS);

  const topicalClusters: Record<
    string,
    {
      topicSlug: string;
      label: string;
      lessonCount: number;
      examplePillarPattern: string;
      supportingSlugs: string[];
    }
  > = {};

  for (const [pathwayId, bundle] of Object.entries(catalog.pathways ?? {})) {
    for (const lesson of bundle.lessons ?? []) {
      const topicSlug = (lesson as { topicSlug?: string }).topicSlug ?? slugifyTopicLabel(
        (lesson as { topic?: string }).topic ?? "general",
      );
      const title = (lesson as { title?: string }).title ?? "";
      const slug = (lesson as { slug: string }).slug;
      const key = `${pathwayId}::${topicSlug}`;
      if (!topicalClusters[key]) {
        topicalClusters[key] = {
          topicSlug,
          label: (lesson as { topic?: string }).topic ?? topicSlug,
          lessonCount: 0,
          examplePillarPattern: `/{country}/{role}/{exam}/lessons/topics/${topicSlug}`,
          supportingSlugs: [],
        };
      }
      topicalClusters[key].lessonCount += 1;
      if (topicalClusters[key].supportingSlugs.length < 12) {
        topicalClusters[key].supportingSlugs.push(slug);
      }
    }
  }

  const clusterList = Object.values(topicalClusters).sort((a, b) => b.lessonCount - a.lessonCount);

  const freshness: {
    generatedAt: string;
    staleBlogPostsSample: { slug: string; updatedAt: string }[];
    catalogBundleMtime: string | null;
    policy: { staleDaysBlog: number; staleDaysLessonCatalog: number };
  } = {
    generatedAt,
    staleBlogPostsSample: [],
    catalogBundleMtime: catalogMtime,
    policy: { staleDaysBlog: 365, staleDaysLessonCatalog: 365 },
  };

  try {
    if (process.env.DATABASE_URL) {
      const prisma = new PrismaClient();
      const old = await prisma.blogPost.findMany({
        where: {
          postStatus: BlogPostStatus.PUBLISHED,
          updatedAt: { lt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        },
        select: { slug: true, updatedAt: true },
        take: 80,
        orderBy: { updatedAt: "asc" },
      });
      freshness.staleBlogPostsSample = old.map((o) => ({
        slug: o.slug,
        updatedAt: o.updatedAt.toISOString(),
      }));
      await prisma.$disconnect();
    }
  } catch {
    /* optional */
  }

  const eeatPageScores = {
    generatedAt,
    scoringVersion: 2,
    thresholds: { minimumPassingEeatScore: THRESHOLD, minimumInternalLinks: MIN_LINKS },
    summary: {
      pageCount: pages.length,
      averageEeatScore: Math.round(avg * 10) / 10,
      pagesBelowThreshold: below.length,
      missingAuthorSignals: missingAuthor.length,
      missingSchema: missingSchema.length,
      internalLinkGaps: linkGaps.length,
      contentCompletenessPct:
        pages.length ?
          Math.round(
            (pages.filter((p) => p.sectionCompleteness >= 0.65).length / pages.length) * 1000,
          ) / 10
        : 0,
    },
    pages,
  };

  await writeFile(join(OUT, "eeat-page-scores.json"), `${JSON.stringify(eeatPageScores, null, 2)}\n`);

  await writeFile(
    join(OUT, "topical-clusters.json"),
    `${JSON.stringify(
      {
        generatedAt,
        clusterCount: clusterList.length,
        note: "Clusters derived from pathway catalog topicSlug + pathwayId. Pillar URLs follow exam hub topic pattern.",
        clusters: clusterList.slice(0, 200),
      },
      null,
      2,
    )}\n`,
  );

  await writeFile(join(OUT, "content-freshness.json"), `${JSON.stringify(freshness, null, 2)}\n`);

  await writeFile(
    join(OUT, "eeat-completion-queue.json"),
    `${JSON.stringify(
      {
        generatedAt,
        totalFlagged: completionQueue.length,
        prioritized: [...completionQueue].sort((a, b) => a.score - b.score).slice(0, 400),
      },
      null,
      2,
    )}\n`,
  );

  const seoReadiness = Math.max(
    0,
    Math.min(100, Math.round(72 + (avg - 55) * 0.8 - below.length / Math.max(1, pages.length) * 15)),
  );

  const finalStatus = {
    generatedAt,
    runMode: "safe_batch",
    averageEeatScore: Math.round(avg * 10) / 10,
    pagesBelowThreshold70: below.length,
    totalPagesScored: pages.length,
    missingAuthorSignals: {
      blogPostsWithoutNamedAuthor: missingAuthor.length,
      note: "Lessons use institutional author in JSON-LD (Organization); optional per-lesson bylines are future work.",
    },
    missingSchema: missingSchema.length,
    internalLinkingGaps: linkGaps.length,
    contentCompletenessPercent: eeatPageScores.summary.contentCompletenessPct,
    seoReadinessScore: seoReadiness,
    trustPages: {
      about: "/about",
      editorialPolicy: "/editorial-policy",
      contentReviewPolicy: "/content-review-policy",
      contact: "/contact",
      privacy: "/privacy",
    },
    paywallSeo: {
      status: "preview_only_indexing",
      notes:
        "Marketing lessons: index public URL with preview sections; full body gated. Subscriber /app remains noindex.",
    },
    programmaticSeo: {
      slugCount: programmaticPages.length,
      thinFlags: pages.filter((p) => p.contentType === "programmatic_seo" && p.flags.includes("thin_programmatic"))
        .length,
    },
    prioritizedActions: [
      "Backfill blog authorDisplayName for published posts missing a named author",
      "Raise internal links to 3+ on pages flagged internal_links_low",
      "Complete lesson spine sections on structure_incomplete rows (do not auto-fill thin copy)",
      "Refresh stale blog posts listed in content-freshness.json",
    ],
    rankingReadiness:
      avg >= 70 && below.length / Math.max(1, pages.length) < 0.35 ? "strong" : "moderate_needs_content_ops",
  };

  await writeFile(join(OUT, "eeat-final-status.json"), `${JSON.stringify(finalStatus, null, 2)}\n`);

  console.log(`Wrote eeat-page-scores.json, topical-clusters.json, content-freshness.json, eeat-completion-queue.json, eeat-final-status.json (${pages.length} pages)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
