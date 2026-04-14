#!/usr/bin/env npx tsx
/**
 * Publishes the first production batch of new-grad nursing posts from
 * data/blog-content/newgrad-prod-batch-01/ into BlogPost (Prisma).
 *
 * Usage:
 *   npx tsx scripts/publish-newgrad-manifest-batch.ts
 *   npx tsx scripts/publish-newgrad-manifest-batch.ts --dry-run
 *
 * Does not overwrite published posts (skips if slug exists).
 * Processes one post at a time (sequential loop).
 */
import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BlogPostIntent,
  BlogPostStatus,
  BlogWorkflowStatus,
  CountryCode,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { BlogSeoBundle } from "@/lib/blog/blog-seo-automation";
import { buildSchemaSummaryPayload } from "@/lib/blog/blog-seo-automation";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BATCH_DIR = path.join(ROOT, "data/blog-content/newgrad-prod-batch-01");
const INDEX_PATH = path.join(BATCH_DIR, "index.json");

const APA = [
  "American Heart Association. (2020). Highlights of the 2020 American Heart Association guidelines for CPR and emergency cardiovascular care. https://cpr.heart.org/en/",
  "Hinkle, J. L., & Cheever, K. H. (2018). Brunner & Suddarth's textbook of medical-surgical nursing (14th ed.). Wolters Kluwer.",
  "Kleinman, M. E., et al. (2010). Part 8: Pediatric advanced life support. Circulation, 122(18_suppl_3), S876-S908. https://doi.org/10.1161/CIRCULATIONAHA.110.971101",
  "Rhodes, A., et al. (2017). Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock: 2016. Intensive Care Medicine, 43(3), 304-377. https://doi.org/10.1007/s00134-017-4683-6",
  "Wijdicks, E. F. M., et al. (2006). Evidence-based guideline update: Determining brain death in adults. Neurology, 67(12), 2031-2033. https://doi.org/10.1212/01.wnl.0000246744.17149.76",
];

type IndexRow = {
  manifestId: number;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  keywords: string[];
  relatedLessonPaths: string[];
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wordCountLatin(html: string): number {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.split(/\s+/).filter(Boolean).length;
}

function buildSeoBundle(row: IndexRow, slug: string): BlogSeoBundle {
  return {
    version: 1,
    normalizedBreadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: row.title.slice(0, 80), href: `/blog/${slug}` },
    ],
    canonicalPath: null,
    openGraphTitle: row.seoTitle.slice(0, 120),
    openGraphDescription: row.seoDescription.slice(0, 320),
    suggestedExcerpt: row.excerpt.slice(0, 500),
    emitFaqSchema: true,
    focusKeywords: row.keywords.slice(0, 12),
    heroImageAlt: null,
    imageAlts: [],
  };
}

async function pickRelatedBlogSlug(exclude: Set<string>): Promise<{ slug: string; title: string } | null> {
  const hit = await prisma.blogPost.findFirst({
    where: {
      postStatus: BlogPostStatus.PUBLISHED,
      slug: { notIn: [...exclude] },
    },
    select: { slug: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
  return hit;
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  if (!isDatabaseUrlConfigured()) {
    console.error(JSON.stringify({ ok: false, error: "DATABASE_URL not configured" }));
    process.exit(1);
  }

  const rows = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as IndexRow[];
  const created: Array<{ title: string; slug: string }> = [];
  const skipped: Array<{ slug: string; reason: string }> = [];
  const exclude = new Set<string>();
  let prev: { slug: string; title: string } | null = null;

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const bodyPath = path.join(BATCH_DIR, `body-${String(i + 1).padStart(2, "0")}.html`);
    if (!fs.existsSync(bodyPath)) {
      console.error(JSON.stringify({ ok: false, error: "missing_body_file", path: bodyPath }));
      process.exit(1);
    }
    let bodyHtml = fs.readFileSync(bodyPath, "utf8");
    let related: { slug: string; title: string } | null = null;
    if (prev) {
      related = prev;
    } else {
      related = await pickRelatedBlogSlug(exclude);
    }
    const relatedBlock =
      related != null
        ? `<p>Related reading on the NurseNest blog: <a href="/blog/${related.slug}">${escapeHtml(related.title)}</a>.</p>`
        : "<p>More clinical articles are available on the <a href=\"/blog\">NurseNest blog index</a>.</p>";
    bodyHtml = bodyHtml.replace(/\{\{RELATED_BLOG_BLOCK\}\}/g, relatedBlock);
    const wc = wordCountLatin(bodyHtml);
    if (wc < 1200) {
      console.error(JSON.stringify({ ok: false, error: "body_below_1200_words", slug: row.slug, words: wc }));
      process.exit(1);
    }

    const existing = await prisma.blogPost.findUnique({
      where: { slug: row.slug },
      select: { id: true, postStatus: true },
    });
    if (existing) {
      skipped.push({ slug: row.slug, reason: `slug_exists_${existing.postStatus}` });
      prev = { slug: row.slug, title: row.title };
      exclude.add(row.slug);
      continue;
    }

    const seo = buildSeoBundle(row, row.slug);
    const internalLinkPlan = {
      lessons: row.relatedLessonPaths.map((href, idx) => ({
        label: `NCLEX-RN lesson ${idx + 1}`,
        suggestedPath: href,
        linkKind: "lesson" as const,
        rationale: "Manifest-selected study cross-link for new grad nursing topic.",
      })),
      imagePlacements: [] as unknown[],
      imageAttachments: [] as unknown[],
      seo,
    };

    const faqBlock = {
      items: [
        {
          q: `What is the fastest priority for new grads on ${row.title.includes("code") ? "a code" : "this topic"}?`,
          a: "Stabilize the immediate threat within scope, bring objective data to the team, and communicate early when trajectory is worsening.",
        },
        {
          q: "When should I escalate even if I am unsure?",
          a: "Escalate when you see high-risk patterns, persistent abnormal trends, or your gut says the patient is slipping faster than you can safely manage alone.",
        },
      ],
    };

    const now = new Date();
    const data: Prisma.BlogPostCreateInput = {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      body: bodyHtml,
      category: "New grad nursing",
      exam: "NCLEX-RN",
      tags: row.keywords,
      postStatus: BlogPostStatus.PUBLISHED,
      publishAt: now,
      workflowStatus: BlogWorkflowStatus.PUBLISHED,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      metaTitleVariant: row.seoTitle,
      metaDescriptionVariant: row.seoDescription,
      targetKeyword: row.keywords[0] ?? row.title.slice(0, 120),
      keywordPlan: row.keywords,
      countryTarget: CountryCode.US,
      intent: BlogPostIntent.INFORMATIONAL,
      relatedLessonPaths: row.relatedLessonPaths,
      relatedTools: ["lab-values", "med-math"],
      internalLinkPlan: internalLinkPlan as unknown as Prisma.InputJsonValue,
      schemaSummary: buildSchemaSummaryPayload(seo),
      faqBlock: faqBlock as unknown as Prisma.InputJsonValue,
      apaReferences: APA,
      legacySource: "newgrad-prod-batch-01",
      shortSummary: row.seoDescription.slice(0, 220),
    };

    if (dryRun) {
      console.log(JSON.stringify({ dryRun: true, wouldCreate: row.slug, words: wc }));
    } else {
      await prisma.blogPost.create({ data });
      console.log(JSON.stringify({ ok: true, created: row.slug, words: wc }));
    }

    created.push({ title: row.title, slug: row.slug });
    prev = { slug: row.slug, title: row.title };
    exclude.add(row.slug);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun,
        created,
        skipped,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
