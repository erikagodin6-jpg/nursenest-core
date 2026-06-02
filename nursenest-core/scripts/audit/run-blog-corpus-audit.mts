/**
 * Read-only blog corpus audit: inventories sources, slugs, long-tail heuristics, rewrite queue, DB dependency.
 * Does not modify content. Run: cd nursenest-core && npx tsx scripts/audit/run-blog-corpus-audit.mts
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../..");
const OUT = join(REPO_ROOT, "data", "audit");

type SourceRow = {
  path: string;
  sourceType: string;
  usedByProductionRoutes: string;
  slugResolution: string;
  fullBodiesInRepo: "yes" | "no" | "mixed" | "metadata_only";
  notes: string;
};

type SlugRow = {
  slug: string;
  title: string | null;
  sourceType: string;
  likelyLive: "yes" | "no" | "unknown";
  bodyAvailableInRepo: "yes" | "no" | "partial";
  likelyNeedsDBExport: "yes" | "no" | "unknown";
  clusterGuess: string;
  notes: string;
};

function walkFiles(dir: string, pred: (p: string) => boolean): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walkFiles(p, pred));
    else if (pred(p)) out.push(p);
  }
  return out;
}

function extractSlugTitlePairs(content: string): { slug: string; title: string | null }[] {
  const pairs: { slug: string; title: string | null }[] = [];
  const slugRe = /\bslug:\s*["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = slugRe.exec(content)) !== null) {
    const slug = m[1];
    const after = content.slice(m.index, Math.min(content.length, m.index + 1200));
    const tm = /title:\s*["']([^"']{1,300})["']/.exec(after);
    pairs.push({ slug, title: tm ? tm[1] : null });
  }
  return pairs;
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

function classifyIntent(slug: string, title: string | null): string {
  const s = `${slug} ${title ?? ""}`.toLowerCase();
  if (/\b(nclex|nle|rex|exam prep|test day|pnle|cnple)\b/.test(s)) return "exam_strategy";
  if (/\b(vs|versus|compare|which is)\b/.test(s)) return "comparison";
  if (/\b(priorit|triage|first|urgent|airway)\b/.test(s)) return "prioritization";
  if (/\b(international|foreign|visa|migration|cgfns|jurisdiction)\b/.test(s)) return "migration_international_nurse";
  if (/\b(treatment|management|intervention|medication|dosing|care plan)\b/.test(s)) return "management_treatment";
  if (/\b(pathophys|disease|syndrome|signs|symptoms|diagnosis)\b/.test(s)) return "clinical_concept";
  return "clinical_concept";
}

const SOURCE_INVENTORY: SourceRow[] = [
  {
    path: "nursenest-core/src/content/blog-static-posts.ts",
    sourceType: "static_ts_array",
    usedByProductionRoutes:
      "Dev-only when DB empty: `listStaticBlogPostsForIndex` + `getBlogPostMetaBySlug` via `canUseStaticBlogFallback()`. `/blog/[slug]` body uses `getPublishedBlogPostBySlug` → Prisma only — static HTML is NOT merged into the page component.",
    slugResolution: "STATIC_BLOG_POSTS[].slug literals",
    fullBodiesInRepo: "yes",
    notes: "Three curated posts with full bodyHtml; production visibility still requires matching BlogPost rows if DB is populated.",
  },
  {
    path: "nursenest-core/src/lib/blog/static-blog-posts.ts",
    sourceType: "static_wrapper",
    usedByProductionRoutes: "Same as blog-static-posts.ts (helper for static array).",
    slugResolution: "Re-exports STATIC_BLOG_POSTS",
    fullBodiesInRepo: "yes",
    notes: "staticRecordToBlogDisplay maps to display shape; not wired to published page without DB.",
  },
  {
    path: "nursenest-core/src/lib/blog/safe-blog-queries.ts",
    sourceType: "prisma_loader",
    usedByProductionRoutes: "Yes — `/blog`, `/blog/[slug]`, `/blog/tag/*`, sitemap blog URLs (Prisma).",
    slugResolution: "BlogPost.slug unique; optional locale/career/exam scoping in resolveScopedBlogPostBySlug",
    fullBodiesInRepo: "no",
    notes: "Authoritative published content for `/blog/[slug]` when `getPublishedBlogPostBySlug` returns a row. Static fallback does not supply body to page.",
  },
  {
    path: "nursenest-core/src/lib/blog/safe-localized-blog-queries.ts",
    sourceType: "prisma_localized",
    usedByProductionRoutes: "Yes — `/[locale]/[slug]/[examCode]/[exam]/blog/[postSlug]`",
    slugResolution: "LocalizedBlogArticle.localizedSlug + region/profession/exam",
    fullBodiesInRepo: "no",
    notes: "Separate model from BlogPost; full body in DB localizedBody.",
  },
  {
    path: "nursenest-core/prisma/schema.prisma (BlogPost, LocalizedBlogArticle)",
    sourceType: "prisma_schema",
    usedByProductionRoutes: "Yes — canonical blog storage.",
    slugResolution: "ORM models",
    fullBodiesInRepo: "no",
    notes: "BlogPost.body Text; campaign/batch/import pipelines write here.",
  },
  {
    path: "nursenest-core/src/lib/seo/long-form-seo-blog-posts.ts (+ chunk2)",
    sourceType: "generated_regional_longform",
    usedByProductionRoutes:
      "Not imported by `src/app/**/blog/*` directly — used for regional SEO hubs / materialization scripts, not the default `/blog/[slug]` route unless posts are imported to Prisma.",
    slugResolution: "LONG_FORM_BLOG_TOPICS / LONG_FORM_BLOG_POSTS slug fields",
    fullBodiesInRepo: "mixed",
    notes: "Full sections for LONG_FORM_BLOG_POSTS entries; topics-only rows are metadata.",
  },
  {
    path: "nursenest-core/src/lib/seo/blog-topic-clusters.ts",
    sourceType: "topic_cluster_metadata",
    usedByProductionRoutes: "Indirect — planning/topics for generators; not a live route without DB/import.",
    slugResolution: "BlogTopicCluster.slug per market cluster",
    fullBodiesInRepo: "metadata_only",
    notes: "High-intent cluster definitions with linkedLessonSlugs — content must be generated or imported.",
  },
  {
    path: "nursenest-core/src/lib/seo/long-tail-niche-blog-posts.ts",
    sourceType: "long_tail_topics",
    usedByProductionRoutes: "Indirect — seed/generation unless imported.",
    slugResolution: "slug fields in exported arrays",
    fullBodiesInRepo: "mixed",
    notes: "50 niche topics; verify import status in production DB separately.",
  },
  {
    path: "nursenest-core/src/lib/seo/* (french, hindi, spanish, tagalog, market, conversion, np-advanced, global-expansion, etc.)",
    sourceType: "localized_seo_chunks",
    usedByProductionRoutes: "Indirect — regional blog pipelines / hubs.",
    slugResolution: "Per-file slug literals",
    fullBodiesInRepo: "mixed",
    notes: "Multiple language/market chunks; not all wired to main /blog router.",
  },
  {
    path: "nursenest-core/scripts/import-blog.ts",
    sourceType: "legacy_import_cli",
    usedByProductionRoutes: "Writes Prisma BlogPost — affects production when run against prod DB.",
    slugResolution: "Input JSON / manifests",
    fullBodiesInRepo: "imported_from_files",
    notes: "Batch importer for published posts.",
  },
  {
    path: "nursenest-core/scripts/blog/import-legacy-manifest.ts",
    sourceType: "legacy_manifest_import",
    usedByProductionRoutes: "Writes Prisma",
    slugResolution: "Manifest slug column",
    fullBodiesInRepo: "mixed",
    notes: "Maps manifest rows to BlogPost create/update.",
  },
  {
    path: "data/blog-content/**/sample-posts.json",
    sourceType: "sample_manifest_json",
    usedByProductionRoutes: "Import / pilot — not necessarily live.",
    slugResolution: "entries[].slug",
    fullBodiesInRepo: "no",
    notes: "Sample metadata for country pipelines; bodies often elsewhere or generated.",
  },
  {
    path: "data/blog-content/newgrad-prod-batch-*/index.json",
    sourceType: "import_batch_index",
    usedByProductionRoutes: "When imported via publish scripts → Prisma.",
    slugResolution: "slug per row",
    fullBodiesInRepo: "partial",
    notes: "Companion body-NN.html files hold HTML bodies in repo for batch imports.",
  },
  {
    path: "nursenest-core/data/blog-manifest/*.manifest.json",
    sourceType: "regional_manifest",
    usedByProductionRoutes: "Materialization / validation scripts; may be empty placeholders.",
    slugResolution: "entries in manifest",
    fullBodiesInRepo: "metadata_only",
    notes: "Some manifests are placeholders (count: 0) — verify per file.",
  },
  {
    path: "nursenest-core/src/lib/seo/sitemap-blog-xml.ts",
    sourceType: "sitemap_generator",
    usedByProductionRoutes: "Yes — SEO sitemap for blog URLs.",
    slugResolution: "getSitemapPublishedBlogSlugs → Prisma only",
    fullBodiesInRepo: "no",
    notes: "Static slugs not added here — DB-backed URLs only.",
  },
  {
    path: "nursenest-core/src/app/(marketing)/(default)/blog/[slug]/page.tsx",
    sourceType: "next_route",
    usedByProductionRoutes: "Yes — public blog article page.",
    slugResolution: "Dynamic [slug]; loads body via getPublishedBlogPostBySlug(slug) → Prisma BlogPost",
    fullBodiesInRepo: "no",
    notes: "Calls notFound() if no published Prisma row; does not render STATIC_BLOG_POSTS body directly.",
  },
  {
    path: "nursenest-core/src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/[postSlug]/page.tsx",
    sourceType: "next_route_localized",
    usedByProductionRoutes: "Yes — regional localized blog",
    slugResolution: "getPublishedLocalizedBlogBySlug → LocalizedBlogArticle",
    fullBodiesInRepo: "no",
    notes: "Separate URL scheme from /blog/[slug].",
  },
];

function loadSlugsFromGlob(base: string, globSubdir: string, ext: string): Map<string, SlugRow> {
  const map = new Map<string, SlugRow>();
  const dir = join(base, globSubdir);
  const files = walkFiles(dir, (p) => p.endsWith(ext));
  for (const fp of files) {
    const rel = relative(REPO_ROOT, fp).replace(/\\/g, "/");
    let content: string;
    try {
      content = readFileSync(fp, "utf8");
    } catch {
      continue;
    }
    const pairs = extractSlugTitlePairs(content);
    const st =
      ext === ".ts"
        ? "seo_ts_generated"
        : ext === ".json"
          ? "json_manifest"
          : "other";
    for (const { slug, title } of pairs) {
      if (!slug || map.has(slug)) continue;
      map.set(slug, {
        slug,
        title,
        sourceType: st,
        likelyLive: "unknown",
        bodyAvailableInRepo: ext === ".ts" ? "yes" : "partial",
        likelyNeedsDBExport: "yes",
        clusterGuess: classifyIntent(slug, title),
        notes: `Extracted from ${rel}`,
      });
    }
  }
  return map;
}

function loadNewgradIndex(): { slug: string; title: string | null }[] {
  const dir = join(REPO_ROOT, "data", "blog-content");
  const out: { slug: string; title: string | null }[] = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (!name.startsWith("newgrad-prod-batch")) continue;
    const idx = join(dir, name, "index.json");
    if (!existsSync(idx)) continue;
    try {
      const raw = readJson(idx) as { slug?: string; title?: string }[];
      if (!Array.isArray(raw)) continue;
      for (const row of raw) {
        if (row.slug) out.push({ slug: row.slug, title: row.title ?? null });
      }
    } catch {
      /* skip */
    }
  }
  return out;
}

function loadSamplePosts(): SlugRow[] {
  const base = join(REPO_ROOT, "nursenest-core", "data", "blog-content");
  const rows: SlugRow[] = [];
  if (!existsSync(base)) return rows;
  for (const country of readdirSync(base)) {
    const fp = join(base, country, "sample-posts.json");
    if (!existsSync(fp)) continue;
    try {
      const j = readJson(fp) as { entries?: { slug: string; title?: string; status?: string }[] };
      for (const e of j.entries ?? []) {
        rows.push({
          slug: e.slug,
          title: e.title ?? null,
          sourceType: "sample_posts_json",
          likelyLive: "no",
          bodyAvailableInRepo: "no",
          likelyNeedsDBExport: "yes",
          clusterGuess: classifyIntent(e.slug, e.title ?? null),
          notes: `sample status=${e.status ?? "?"} country=${country}`,
        });
      }
    } catch {
      /* skip */
    }
  }
  return rows;
}

function main() {
  mkdirSync(OUT, { recursive: true });
  const generatedAt = new Date().toISOString();

  const slugMap = new Map<string, SlugRow>();

  const staticPath = join(REPO_ROOT, "nursenest-core", "src", "content", "blog-static-posts.ts");
  const staticSlugs: { slug: string; title: string | null }[] = existsSync(staticPath)
    ? extractSlugTitlePairs(readFileSync(staticPath, "utf8"))
    : [];
  for (const s of staticSlugs) {
    slugMap.set(s.slug, {
      slug: s.slug,
      title: s.title,
      sourceType: "static_blog_static_posts",
      likelyLive: "unknown",
      bodyAvailableInRepo: "yes",
      likelyNeedsDBExport: "unknown",
      clusterGuess: classifyIntent(s.slug, s.title),
      notes: "Full bodyHtml in repo; `/blog/[slug]` still requires Prisma PUBLISHED row in typical prod.",
    });
  }

  const seoDir = join(REPO_ROOT, "nursenest-core", "src", "lib", "seo");
  const seoBlogFiles = walkFiles(seoDir, (p) => /blog/i.test(p) && p.endsWith(".ts"));
  for (const fp of seoBlogFiles) {
    const content = readFileSync(fp, "utf8");
    const rel = relative(REPO_ROOT, fp).replace(/\\/g, "/");
    for (const { slug, title } of extractSlugTitlePairs(content)) {
      if (slugMap.has(slug)) continue;
      slugMap.set(slug, {
        slug,
        title,
        sourceType: "seo_lib_ts",
        likelyLive: "unknown",
        bodyAvailableInRepo: "yes",
        likelyNeedsDBExport: "yes",
        clusterGuess: classifyIntent(slug, title),
        notes: `Declared in ${rel}`,
      });
    }
  }

  for (const row of loadSamplePosts()) {
    if (!slugMap.has(row.slug)) slugMap.set(row.slug, row);
  }

  for (const { slug, title } of loadNewgradIndex()) {
    if (slugMap.has(slug)) continue;
    slugMap.set(slug, {
      slug,
      title,
      sourceType: "newgrad_batch_index",
      likelyLive: "unknown",
      bodyAvailableInRepo: "partial",
      likelyNeedsDBExport: "yes",
      clusterGuess: classifyIntent(slug, title),
      notes: "Listed in data/blog-content/newgrad-prod-batch-*/index.json; body-NN.html may exist alongside.",
    });
  }

  const allSlugs = [...slugMap.values()];
  const longtail = {
    generatedAt,
    methodology:
      "Heuristic intent from slug+title keywords (clinical_concept, comparison, prioritization, management_treatment, migration_international_nurse, exam_strategy). Not GSC-backed.",
    byIntent: {} as Record<string, number>,
    thinClusterWarnings: [
      "Many blog-topic-clusters and long-form *topics* are metadata-only until imported to Prisma.",
      "Regional manifests under nursenest-core/data/blog-manifest may be empty placeholders — check each file.",
      "Sitemap lists only DB-published slugs — repo-only definitions are invisible to sitemap XML.",
    ],
    strongLongTailCandidates: allSlugs
      .filter((r) => /nclex|clinical|priorit|pharmacology|lab|newgrad/i.test(`${r.slug} ${r.title ?? ""}`))
      .slice(0, 40)
      .map((r) => ({ slug: r.slug, title: r.title, reason: "High-intent nursing/exam keywords in slug or title" })),
    missingTopicsGuess: [
      "State-specific NCLEX jurisprudence deep-dives (only if not in DB)",
      "Condition-specific medication comparison matrices (verify DB coverage)",
      "Employer-sponsored IEN onboarding checklists (migration cluster)",
    ],
  };
  for (const r of allSlugs) {
    const k = r.clusterGuess;
    longtail.byIntent[k] = (longtail.byIntent[k] ?? 0) + 1;
  }

  const priorityScore = (r: SlugRow) => {
    let s = 0;
    const t = `${r.slug} ${r.title ?? ""}`.toLowerCase();
    if (/nclex|new grad|clinical judgment|pharmacology/i.test(t)) s += 5;
    if (r.bodyAvailableInRepo === "yes") s += 3;
    if (r.sourceType === "static_blog_static_posts") s += 4;
    if (r.likelyLive === "unknown") s += 1;
    return s;
  };

  const top50 = [...allSlugs]
    .sort((a, b) => priorityScore(b) - priorityScore(a))
    .slice(0, 50)
    .map((r, i) => ({
      rank: i + 1,
      slug: r.slug,
      title: r.title,
      sourceType: r.sourceType,
      cluster: r.clusterGuess,
      whyItMatters:
        r.sourceType === "static_blog_static_posts"
          ? "Curated in-repo body; ensure DB parity and internal links for main /blog indexability."
          : "Repo-defined SEO asset; confirm Prisma publish + sitemap inclusion.",
      likelyLongTailKeywords: [
        ...(r.title ? [r.title.slice(0, 80)] : []),
        r.slug.replace(/-/g, " "),
      ].slice(0, 3),
      rewritePriority: (priorityScore(r) >= 8 ? "critical" : priorityScore(r) >= 5 ? "high" : "medium") as
        | "critical"
        | "high"
        | "medium",
      dbExportNeededFirst: r.likelyNeedsDBExport === "yes",
    }));

  const prismaBackedFraction =
    "Majority of live /blog traffic: published URLs come from BlogPost (and localized routes from LocalizedBlogArticle). Repo TS/JSON alone does not power `/blog/[slug]` without import.";

  const dbReport = {
    generatedAt,
    summary: prismaBackedFraction,
    percentRepoOnlySlugsNotEditableWithoutDb: "High — any slug only present in src/lib/seo or data/ without a Prisma row cannot be edited via production CMS-style flow tied to BlogPost id.",
    percentLiveSlugsUnknownWithoutDbQuery:
      "100% of 'is this live in prod' requires DATABASE_URL query or admin export — this audit is repo-only.",
    codePathsIndicatingPrismaBlog: [
      "nursenest-core/src/lib/blog/safe-blog-queries.ts — getPublishedBlogPostBySlug, getPublishedBlogPostsPage",
      "nursenest-core/src/app/(marketing)/(default)/blog/[slug]/page.tsx — getPublishedBlogPostBySlug(slug)",
      "nursenest-core/src/lib/seo/sitemap-blog-xml.ts — getSitemapPublishedBlogSlugs",
      "nursenest-core/src/lib/blog/safe-localized-blog-queries.ts — localized blog route",
    ],
    safestNextStepForSlugExport:
      "Run a read-only Prisma script against staging or production replica: `BlogPost.findMany({ where: { postStatus: 'PUBLISHED' }, select: { slug, title, updatedAt } })` and optionally dump body to files offline. Do not run destructive imports. Use existing admin/library or scripts/import-blog patterns for round-trips.",
    staticFallbackCaveat:
      "canUseStaticBlogFallback() only when NODE_ENV dev AND blogPost.count()===0 — not production behavior.",
  };

  writeFileSync(
    join(OUT, "blog-source-inventory.json"),
    JSON.stringify({ generatedAt, sourceCount: SOURCE_INVENTORY.length, sources: SOURCE_INVENTORY }, null, 2),
  );

  writeFileSync(
    join(OUT, "blog-live-slug-inventory.json"),
    JSON.stringify(
      {
        generatedAt,
        totalSlugs: allSlugs.length,
        caveat:
          "likelyLive is unknown without DB. Static bodies in repo do not guarantee public /blog/[slug] unless BlogPost row exists.",
        slugs: allSlugs.sort((a, b) => a.slug.localeCompare(b.slug)),
      },
      null,
      2,
    ),
  );

  writeFileSync(join(OUT, "blog-longtail-recovery-audit.json"), JSON.stringify(longtail, null, 2));

  writeFileSync(
    join(OUT, "blog-top-50-rewrite-queue.json"),
    JSON.stringify({ generatedAt, queue: top50 }, null, 2),
  );

  writeFileSync(join(OUT, "blog-db-dependency-report.json"), JSON.stringify(dbReport, null, 2));

  const concise = {
    generatedAt,
    sourceInventoryEntries: SOURCE_INVENTORY.length,
    uniqueSlugsEnumerated: allSlugs.length,
    staticVsPrisma: {
      staticFullBodiesInRepoFromBlogStaticPosts: staticSlugs.length,
      note: "Production `/blog/[slug]` reads Prisma BlogPost; static TS is dev empty-DB index/meta fallback and is not merged into the page body by getPublishedBlogPostBySlug.",
    },
    top10RewriteTargets: top50.slice(0, 10).map((x) => ({ slug: x.slug, title: x.title, priority: x.rewritePriority })),
    biggestBlockerToLongtailRecovery:
      "Canonical live URLs and sitemap are DB-driven; large SEO libraries in repo are not indexed until imported/published. Confirm publish pipeline + avoid duplicate URLs across regional and default blog routes.",
  };

  writeFileSync(join(OUT, "blog-corpus-audit-concise-report.json"), JSON.stringify(concise, null, 2));

  console.log(
    JSON.stringify(
      {
        ok: true,
        generatedAt,
        sources: SOURCE_INVENTORY.length,
        slugs: allSlugs.length,
        outDir: relative(REPO_ROOT, OUT),
      },
      null,
      2,
    ),
  );
}

main();
