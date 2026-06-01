import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import pg from "pg";

type AssetType = "Articles" | "Lesson Pages" | "SEO Pages" | "Study Guides" | "Disease Pages";

type AssetSummary = {
  assetType: AssetType;
  source: string;
  generated: number;
  published: number;
  hidden: number;
  archived: number;
  orphaned: number;
  basis: string;
  discrepancyExplanation?: string;
};

type Frontmatter = Record<string, string>;

const ROOT = process.cwd();
const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 3,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 5_000,
});

function sqlIdent(name: string): string {
  return `"${name.replaceAll('"', '""')}"`;
}

async function tableExists(name: string): Promise<boolean> {
  const result = await pool.query<{ exists: boolean }>(
    `select exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = $1
    )`,
    [name],
  );
  return Boolean(result.rows[0]?.exists);
}

async function one<T extends Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T> {
  const result = await pool.query<T>(sql, params);
  return result.rows[0] ?? ({} as T);
}

async function rows<T extends Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const result = await pool.query<T>(sql, params);
  return result.rows;
}

function toInt(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") return Number(value);
  return 0;
}

function parseFrontmatter(text: string): Frontmatter {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---", 3);
  if (end < 0) return {};
  const block = text.slice(3, end).trim();
  const fm: Frontmatter = {};
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    fm[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return fm;
}

async function walk(dir: string, predicate: (file: string) => boolean): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(abs, predicate)));
    } else if (entry.isFile() && predicate(abs)) {
      files.push(abs);
    }
  }
  return files;
}

function isStudyGuide(fm: Frontmatter, file: string): boolean {
  const haystack = `${fm.title ?? ""} ${fm.category ?? ""} ${fm.tags ?? ""} ${file}`.toLowerCase();
  return /(study|guide|exam guide|how to pass|strategy|tips|schedule|plan)/.test(haystack);
}

function isDiseasePage(fm: Frontmatter, file: string): boolean {
  const haystack = `${fm.title ?? ""} ${fm.category ?? ""} ${fm.tags ?? ""} ${fm.seoDescription ?? ""} ${file}`.toLowerCase();
  return /(disease|pathophys|pathophysiology|diagnosis|management|clinical guide|medication|pharmacology|sepsis|copd|heart failure|diabetes|asthma|stroke|pneumonia|hypertension|afib|anaphylaxis|osteoporosis|delirium)/.test(haystack);
}

function hasSeo(fm: Frontmatter): boolean {
  return Boolean(fm.seoTitle || fm.seoDescription || fm.canonicalUrl);
}

function staticStatus(fm: Frontmatter): "published" | "hidden" | "archived" {
  const raw = (fm.status ?? "").toLowerCase();
  if (raw === "archived") return "archived";
  if (raw === "draft" || raw === "hidden" || raw === "noindex" || fm.noindex === "true") return "hidden";
  return "published";
}

function addDiscrepancy(summary: AssetSummary): AssetSummary {
  if (summary.generated <= 0) return summary;
  const nonPublic = summary.hidden + summary.archived + summary.orphaned;
  const ratio = nonPublic / summary.generated;
  if (ratio <= 0.05) return summary;

  let reason = `${Math.round(ratio * 100)}% of generated assets are not currently public.`;
  if (summary.hidden > summary.archived && summary.hidden > summary.orphaned) {
    reason += " The main driver is hidden/draft/review/scheduled inventory.";
  } else if (summary.orphaned >= summary.hidden && summary.orphaned > 0) {
    reason += " The main driver is orphaned generation output without a promoted/public asset link.";
  } else if (summary.archived > 0) {
    reason += " The main driver is archived/rejected inventory.";
  }
  return { ...summary, discrepancyExplanation: reason };
}

async function dbArticleSummaries(): Promise<AssetSummary[]> {
  const summaries: AssetSummary[] = [];

  if (await tableExists("BlogPost")) {
    const blog = await one<{
      generated: string;
      published: string;
      hidden: string;
      archived: string;
      seo_pages: string;
      study_guides: string;
      disease_pages: string;
      orphaned: string;
    }>(`
      select
        count(*)::text as generated,
        count(*) filter (where "postStatus" = 'PUBLISHED' and ("publishAt" is null or "publishAt" <= now()))::text as published,
        count(*) filter (where not ("postStatus" = 'PUBLISHED' and ("publishAt" is null or "publishAt" <= now())) and "postStatus" <> 'FAILED')::text as hidden,
        count(*) filter (where "postStatus" = 'FAILED')::text as archived,
        count(*) filter (where coalesce("seoTitle", '') <> '' or coalesce("seoDescription", '') <> '')::text as seo_pages,
        count(*) filter (
          where "postTemplate" in ('HOW_TO_PASS', 'STUDY_PLAN', 'EXAM_GUIDE')
             or lower(coalesce(category, '') || ' ' || title || ' ' || coalesce("targetKeyword", '')) ~ '(study|guide|strategy|how to pass|schedule|plan)'
        )::text as study_guides,
        count(*) filter (
          where "postTemplate" = 'DISEASE_PROCESS_EXPLAINER'
             or lower(coalesce(category, '') || ' ' || title || ' ' || coalesce("targetKeyword", '') || ' ' || coalesce("keywordCluster", '')) ~ '(disease|pathophys|pathophysiology|diagnosis|management|clinical guide|pharmacology|medication)'
        )::text as disease_pages,
        count(*) filter (where coalesce(slug, '') = '' or coalesce(title, '') = '' or coalesce(body, '') = '')::text as orphaned
      from "BlogPost"
    `);

    summaries.push(
      addDiscrepancy({
        assetType: "Articles",
        source: "DB BlogPost",
        generated: toInt(blog.generated),
        published: toInt(blog.published),
        hidden: toInt(blog.hidden),
        archived: toInt(blog.archived),
        orphaned: toInt(blog.orphaned),
        basis: "All BlogPost rows; public means PUBLISHED and publishAt is due.",
      }),
      addDiscrepancy({
        assetType: "SEO Pages",
        source: "DB BlogPost SEO metadata",
        generated: toInt(blog.seo_pages),
        published: toInt(blog.seo_pages) === 0 ? 0 : toInt(blog.published),
        hidden: Math.max(0, toInt(blog.seo_pages) - toInt(blog.published)),
        archived: 0,
        orphaned: toInt(blog.orphaned),
        basis: "BlogPost rows with seoTitle or seoDescription.",
      }),
      addDiscrepancy({
        assetType: "Study Guides",
        source: "DB BlogPost templates/categories",
        generated: toInt(blog.study_guides),
        published: 0,
        hidden: 0,
        archived: 0,
        orphaned: 0,
        basis: "Template/category/title keyword classification; detailed status breakdown is in article source rows.",
      }),
      addDiscrepancy({
        assetType: "Disease Pages",
        source: "DB BlogPost disease templates/keywords",
        generated: toInt(blog.disease_pages),
        published: 0,
        hidden: 0,
        archived: 0,
        orphaned: 0,
        basis: "DISEASE_PROCESS_EXPLAINER template plus disease/pathophysiology/clinical-guide keyword classification.",
      }),
    );
  }

  if (await tableExists("LocalizedBlogArticle")) {
    const localized = await one<{ generated: string; published: string; hidden: string; archived: string; orphaned: string }>(`
      select
        count(*)::text as generated,
        count(*) filter (where "contentStatus" = 'PUBLISHED' and ("publishedAt" is null or "publishedAt" <= now()))::text as published,
        count(*) filter (where "contentStatus" not in ('PUBLISHED', 'REJECTED'))::text as hidden,
        count(*) filter (where "contentStatus" = 'REJECTED')::text as archived,
        count(*) filter (where coalesce("localizedSlug", '') = '' or coalesce("localizedTitle", '') = '' or coalesce("localizedBody", '') = '')::text as orphaned
      from "LocalizedBlogArticle"
    `);

    summaries.push(
      addDiscrepancy({
        assetType: "Articles",
        source: "DB LocalizedBlogArticle",
        generated: toInt(localized.generated),
        published: toInt(localized.published),
        hidden: toInt(localized.hidden),
        archived: toInt(localized.archived),
        orphaned: toInt(localized.orphaned),
        basis: "Localized article variants; public means contentStatus=PUBLISHED.",
      }),
      addDiscrepancy({
        assetType: "SEO Pages",
        source: "DB LocalizedBlogArticle SEO metadata",
        generated: toInt(localized.generated),
        published: toInt(localized.published),
        hidden: toInt(localized.hidden),
        archived: toInt(localized.archived),
        orphaned: toInt(localized.orphaned),
        basis: "Localized article variants include localized SEO metadata and hreflang/canonical fields.",
      }),
    );
  }

  if (await tableExists("blog_article_generation_jobs")) {
    const jobs = await one<{ generated: string; published: string; hidden: string; archived: string; orphaned: string }>(`
      select
        count(*)::text as generated,
        count(*) filter (where stage = 'published')::text as published,
        count(*) filter (where stage not in ('published', 'failed'))::text as hidden,
        count(*) filter (where stage = 'failed')::text as archived,
        count(*) filter (where stage = 'published' and "blogPostId" is null)::text as orphaned
      from blog_article_generation_jobs
    `);
    summaries.push(
      addDiscrepancy({
        assetType: "Articles",
        source: "DB blog_article_generation_jobs",
        generated: toInt(jobs.generated),
        published: toInt(jobs.published),
        hidden: toInt(jobs.hidden),
        archived: toInt(jobs.archived),
        orphaned: toInt(jobs.orphaned),
        basis: "Async admin generation jobs; orphaned means published stage without BlogPost linkage.",
      }),
    );
  }

  return summaries;
}

async function dbLessonSummaries(): Promise<AssetSummary[]> {
  const summaries: AssetSummary[] = [];

  if (await tableExists("pathway_lessons")) {
    const pathway = await one<{ generated: string; published: string; hidden: string; archived: string; orphaned: string; seo_pages: string; disease_pages: string }>(`
      select
        count(*)::text as generated,
        count(*) filter (where status = 'PUBLISHED' and "deprecatedAt" is null)::text as published,
        count(*) filter (where status in ('DRAFT', 'IN_REVIEW'))::text as hidden,
        count(*) filter (where status = 'ARCHIVED' or "deprecatedAt" is not null)::text as archived,
        count(*) filter (where status = 'PUBLISHED' and "structuralPublicComplete" is not true)::text as orphaned,
        count(*) filter (where coalesce("seoTitle", '') <> '' or coalesce("seoDescription", '') <> '')::text as seo_pages,
        count(*) filter (where lower(title || ' ' || topic || ' ' || "bodySystem") ~ '(disease|pathophys|copd|heart failure|diabetes|asthma|stroke|pneumonia|hypertension|sepsis)')::text as disease_pages
      from pathway_lessons
    `);
    summaries.push(
      addDiscrepancy({
        assetType: "Lesson Pages",
        source: "DB pathway_lessons",
        generated: toInt(pathway.generated),
        published: toInt(pathway.published),
        hidden: toInt(pathway.hidden),
        archived: toInt(pathway.archived),
        orphaned: toInt(pathway.orphaned),
        basis: "Generated/imported pathway lesson rows; orphaned means published but failing structuralPublicComplete.",
      }),
      addDiscrepancy({
        assetType: "SEO Pages",
        source: "DB pathway_lessons SEO metadata",
        generated: toInt(pathway.seo_pages),
        published: toInt(pathway.published),
        hidden: Math.max(0, toInt(pathway.seo_pages) - toInt(pathway.published)),
        archived: toInt(pathway.archived),
        orphaned: toInt(pathway.orphaned),
        basis: "Pathway lessons with SEO title/description.",
      }),
      addDiscrepancy({
        assetType: "Disease Pages",
        source: "DB pathway_lessons disease-like topics",
        generated: toInt(pathway.disease_pages),
        published: 0,
        hidden: 0,
        archived: 0,
        orphaned: 0,
        basis: "Disease-like topic/title/body-system keyword classification; lifecycle breakdown is in Lesson Pages.",
      }),
    );
  }

  if (await tableExists("content_items")) {
    const contentItems = await one<{ generated: string; published: string; hidden: string; archived: string; orphaned: string; seo_pages: string }>(`
      select
        count(*) filter (where type = 'lesson' and updated_by_ai is true)::text as generated,
        count(*) filter (where type = 'lesson' and updated_by_ai is true and status = 'published')::text as published,
        count(*) filter (where type = 'lesson' and updated_by_ai is true and coalesce(status, 'draft') not in ('published', 'archived'))::text as hidden,
        count(*) filter (where type = 'lesson' and updated_by_ai is true and status = 'archived')::text as archived,
        count(*) filter (where type = 'lesson' and updated_by_ai is true and (coalesce(slug, '') = '' or coalesce(title, '') = ''))::text as orphaned,
        count(*) filter (where updated_by_ai is true and (coalesce(seo_title, '') <> '' or coalesce(seo_description, '') <> ''))::text as seo_pages
      from content_items
    `);
    summaries.push(
      addDiscrepancy({
        assetType: "Lesson Pages",
        source: "DB content_items updated_by_ai",
        generated: toInt(contentItems.generated),
        published: toInt(contentItems.published),
        hidden: toInt(contentItems.hidden),
        archived: toInt(contentItems.archived),
        orphaned: toInt(contentItems.orphaned),
        basis: "Legacy content_items lesson rows where updated_by_ai=true.",
      }),
      addDiscrepancy({
        assetType: "SEO Pages",
        source: "DB content_items updated_by_ai SEO",
        generated: toInt(contentItems.seo_pages),
        published: toInt(contentItems.published),
        hidden: Math.max(0, toInt(contentItems.seo_pages) - toInt(contentItems.published)),
        archived: toInt(contentItems.archived),
        orphaned: toInt(contentItems.orphaned),
        basis: "AI-updated content_items with SEO metadata.",
      }),
    );
  }

  if (await tableExists("GeneratedLessonDraft")) {
    const drafts = await one<{ generated: string; published: string; hidden: string; archived: string; orphaned: string }>(`
      select
        count(*)::text as generated,
        count(*) filter (where "reviewStatus" = 'PROMOTED')::text as published,
        count(*) filter (where "reviewStatus" in ('PENDING_REVIEW', 'APPROVED'))::text as hidden,
        count(*) filter (where "reviewStatus" = 'REJECTED')::text as archived,
        count(*) filter (where "reviewStatus" = 'PROMOTED' and "promotedEntityId" is null)::text as orphaned
      from "GeneratedLessonDraft"
    `);
    summaries.push(
      addDiscrepancy({
        assetType: "Lesson Pages",
        source: "DB GeneratedLessonDraft",
        generated: toInt(drafts.generated),
        published: toInt(drafts.published),
        hidden: toInt(drafts.hidden),
        archived: toInt(drafts.archived),
        orphaned: toInt(drafts.orphaned),
        basis: "AI lesson draft review workflow; public equivalent is PROMOTED.",
      }),
    );
  }

  return summaries;
}

async function staticContentSummaries(): Promise<AssetSummary[]> {
  const summaries: AssetSummary[] = [];

  const markdownFiles = await walk(path.join(ROOT, "src/content"), (file) => file.endsWith(".md") || file.endsWith(".mdx"));
  let published = 0;
  let hidden = 0;
  let archived = 0;
  let orphaned = 0;
  let seoPages = 0;
  let studyGuides = 0;
  let diseasePages = 0;

  for (const file of markdownFiles) {
    const text = await readFile(file, "utf8");
    const fm = parseFrontmatter(text);
    const status = staticStatus(fm);
    if (status === "published") published += 1;
    if (status === "hidden") hidden += 1;
    if (status === "archived") archived += 1;
    if (!fm.slug && !fm.canonicalUrl) orphaned += 1;
    if (hasSeo(fm)) seoPages += 1;
    if (isStudyGuide(fm, file)) studyGuides += 1;
    if (isDiseasePage(fm, file)) diseasePages += 1;
  }

  summaries.push(
    addDiscrepancy({
      assetType: "Articles",
      source: "Filesystem src/content markdown/mdx",
      generated: markdownFiles.length,
      published,
      hidden,
      archived,
      orphaned,
      basis: "Static content markdown; public unless frontmatter status/noindex marks hidden/archived. Orphaned means no slug or canonicalUrl.",
    }),
    addDiscrepancy({
      assetType: "SEO Pages",
      source: "Filesystem src/content markdown SEO frontmatter",
      generated: seoPages,
      published: seoPages,
      hidden: 0,
      archived: 0,
      orphaned: 0,
      basis: "Static markdown files with seoTitle, seoDescription, or canonicalUrl.",
    }),
    addDiscrepancy({
      assetType: "Study Guides",
      source: "Filesystem src/content markdown study-guide classifier",
      generated: studyGuides,
      published: studyGuides,
      hidden: 0,
      archived: 0,
      orphaned: 0,
      basis: "Static markdown title/category/tag/file keyword classification.",
    }),
    addDiscrepancy({
      assetType: "Disease Pages",
      source: "Filesystem src/content markdown disease classifier",
      generated: diseasePages,
      published: diseasePages,
      hidden: 0,
      archived: 0,
      orphaned: 0,
      basis: "Static markdown title/category/tag/file keyword classification.",
    }),
  );

  const catalogFiles = await walk(path.join(ROOT, "src/content/pathway-lessons"), (file) => file.endsWith(".json"));
  let catalogLessons = 0;
  let malformedCatalogs = 0;
  for (const file of catalogFiles) {
    try {
      const json = JSON.parse(await readFile(file, "utf8"));
      const pathways = json.pathways && typeof json.pathways === "object" ? json.pathways : null;
      if (pathways) {
        for (const value of Object.values(pathways)) {
          if (Array.isArray(value)) catalogLessons += value.length;
        }
      } else if (Array.isArray(json.lessons)) {
        catalogLessons += json.lessons.length;
      } else if (Array.isArray(json)) {
        catalogLessons += json.length;
      }
    } catch {
      malformedCatalogs += 1;
    }
  }
  summaries.push(
    addDiscrepancy({
      assetType: "Lesson Pages",
      source: "Filesystem src/content/pathway-lessons catalogs",
      generated: catalogLessons,
      published: 0,
      hidden: catalogLessons,
      archived: 0,
      orphaned: malformedCatalogs,
      basis: "Generated catalog entries. These are source manifests until imported/materialized into DB pathway_lessons.",
    }),
  );

  return summaries;
}

async function queueOrphanSummaries(): Promise<AssetSummary[]> {
  const summaries: AssetSummary[] = [];

  if (await tableExists("BlogDraftGenerationBatchItem")) {
    const draftItems = await one<{ generated: string; published: string; hidden: string; archived: string; orphaned: string }>(`
      select
        count(*)::text as generated,
        count(*) filter (where status = 'COMPLETED' and "blogPostId" is not null)::text as published,
        count(*) filter (where status in ('PENDING', 'GENERATING'))::text as hidden,
        count(*) filter (where status in ('FAILED', 'SKIPPED'))::text as archived,
        count(*) filter (where status = 'COMPLETED' and "blogPostId" is null)::text as orphaned
      from "BlogDraftGenerationBatchItem"
    `);
    summaries.push(
      addDiscrepancy({
        assetType: "Articles",
        source: "DB BlogDraftGenerationBatchItem",
        generated: toInt(draftItems.generated),
        published: toInt(draftItems.published),
        hidden: toInt(draftItems.hidden),
        archived: toInt(draftItems.archived),
        orphaned: toInt(draftItems.orphaned),
        basis: "Paste-many draft batch items; orphaned means completed without BlogPost linkage.",
      }),
    );
  }

  if (await tableExists("BlogBatchScheduleItem")) {
    const scheduleItems = await one<{ generated: string; published: string; hidden: string; archived: string; orphaned: string }>(`
      select
        count(*)::text as generated,
        count(*) filter (where status = 'PUBLISHED' and "blogPostId" is not null)::text as published,
        count(*) filter (where status in ('PENDING', 'GENERATING'))::text as hidden,
        count(*) filter (where status in ('FAILED', 'SKIPPED'))::text as archived,
        count(*) filter (where status = 'PUBLISHED' and "blogPostId" is null)::text as orphaned
      from "BlogBatchScheduleItem"
    `);
    summaries.push(
      addDiscrepancy({
        assetType: "Articles",
        source: "DB BlogBatchScheduleItem",
        generated: toInt(scheduleItems.generated),
        published: toInt(scheduleItems.published),
        hidden: toInt(scheduleItems.hidden),
        archived: toInt(scheduleItems.archived),
        orphaned: toInt(scheduleItems.orphaned),
        basis: "Scheduled generation items; orphaned means PUBLISHED state without BlogPost linkage.",
      }),
    );
  }

  return summaries;
}

function tableMarkdown(summaries: AssetSummary[]): string {
  const header = "| Asset Type | Source | Generated | Published | Hidden | Archived | Orphaned | Basis |";
  const divider = "|---|---|---:|---:|---:|---:|---:|---|";
  const body = summaries
    .map((summary) =>
      [
        summary.assetType,
        summary.source,
        summary.generated,
        summary.published,
        summary.hidden,
        summary.archived,
        summary.orphaned,
        summary.basis,
      ]
        .map((cell) => String(cell).replaceAll("|", "\\|"))
        .join(" | "),
    )
    .map((line) => `| ${line} |`)
    .join("\n");
  return `${header}\n${divider}\n${body}`;
}

function aggregateByType(summaries: AssetSummary[]): AssetSummary[] {
  const byType = new Map<AssetType, AssetSummary>();
  for (const summary of summaries) {
    const current =
      byType.get(summary.assetType) ??
      ({
        assetType: summary.assetType,
        source: "All discovered systems",
        generated: 0,
        published: 0,
        hidden: 0,
        archived: 0,
        orphaned: 0,
        basis: "Aggregate across DB-backed, localized, draft, queue, and filesystem generation systems.",
      } satisfies AssetSummary);
    current.generated += summary.generated;
    current.published += summary.published;
    current.hidden += summary.hidden;
    current.archived += summary.archived;
    current.orphaned += summary.orphaned;
    byType.set(summary.assetType, current);
  }
  return [...byType.values()].map(addDiscrepancy);
}

function discrepancySection(summaries: AssetSummary[]): string {
  const flagged = summaries.filter((summary) => summary.discrepancyExplanation);
  if (flagged.length === 0) return "No discrepancy above 5% detected.";
  return flagged
    .map((summary) => `- **${summary.assetType} / ${summary.source}:** ${summary.discrepancyExplanation}`)
    .join("\n");
}

function csv(summaries: AssetSummary[]): string {
  const header = ["assetType", "source", "generated", "published", "hidden", "archived", "orphaned", "basis", "discrepancyExplanation"];
  const lines = summaries.map((summary) =>
    [
      summary.assetType,
      summary.source,
      summary.generated,
      summary.published,
      summary.hidden,
      summary.archived,
      summary.orphaned,
      summary.basis,
      summary.discrepancyExplanation ?? "",
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

async function main(): Promise<void> {
  const summaries = [
    ...(await dbArticleSummaries()),
    ...(await dbLessonSummaries()),
    ...(await staticContentSummaries()),
    ...(await queueOrphanSummaries()),
  ];
  const aggregates = aggregateByType(summaries);

  const generatedAt = new Date().toISOString();
  const report = `# AI-Generated Content Systems Audit

Generated: ${generatedAt}

## Definitions

- **Generated:** An asset or generation-system record exists in a production table or source manifest.
- **Published:** The asset is in a public/published lifecycle state, or a static file is routeable by slug/canonical frontmatter.
- **Hidden:** Draft, review, scheduled, queued, pending, or source-manifest inventory that is not itself public.
- **Archived:** Failed, rejected, skipped, archived, or deprecated inventory.
- **Orphaned:** A generated item has no promoted/public asset link, no route slug/canonical, or a published lesson fails the structural-public completeness gate.

## Aggregate By Asset Type

${tableMarkdown(aggregates)}

## Source-Level Inventory

${tableMarkdown(summaries)}

## Discrepancies Greater Than 5%

${discrepancySection([...aggregates, ...summaries])}

## Notes

- Article totals include canonical \`BlogPost\`, localized article variants, admin generation jobs, batch queue items, and static markdown content.
- Lesson totals include \`pathway_lessons\`, AI-updated legacy \`content_items\`, AI lesson drafts, and generated pathway lesson catalog manifests.
- SEO pages are counted when SEO metadata exists or when the source system is explicitly localized/SEO-addressable.
- Study guide and disease page totals use template/category/title/keyword classification because not every legacy or static source has a dedicated asset-type enum.
`;

  await mkdir(path.join(ROOT, "docs/reports"), { recursive: true });
  await mkdir(path.join(ROOT, "reports"), { recursive: true });
  await writeFile(path.join(ROOT, "docs/reports/ai-generated-content-systems-audit.md"), report);
  await writeFile(path.join(ROOT, "reports/ai-generated-content-systems-audit.csv"), csv([...aggregates, ...summaries]));

  console.log(`Generated ${summaries.length} source-level rows.`);
  console.log(`Wrote docs/reports/ai-generated-content-systems-audit.md`);
  console.log(`Wrote reports/ai-generated-content-systems-audit.csv`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

