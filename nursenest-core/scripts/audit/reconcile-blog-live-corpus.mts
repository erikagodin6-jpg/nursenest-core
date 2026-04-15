/**
 * Reconciles Prisma read-only exports with repo blog audit JSONs. No DB writes.
 * Run after: npx tsx scripts/audit/run-blog-prisma-readonly-export.mts
 *
 * npx tsx scripts/audit/reconcile-blog-live-corpus.mts
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../..");
const OUT = join(REPO_ROOT, "data", "audit");

type RepoSlug = { slug: string; title: string | null; sourceType: string };
type BlogPostExport = {
  slug: string;
  title: string;
  sourceModel?: string;
  locale: string;
  bodyLengthEstimate: number;
};
type LocExport = {
  slug: string;
  title: string;
  sourceModel?: string;
  locale: string;
  region: string;
  profession: string | null;
  exam: string | null;
  bodyLengthEstimate: number;
};

function readJson<T>(p: string): T | null {
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf8")) as T;
}

function classifyCluster(slug: string, title: string): string {
  const s = `${slug} ${title}`.toLowerCase();
  if (/\b(nclex|nle|exam|pnle)\b/.test(s)) return "exam_strategy";
  if (/\b(international|foreign|visa|migration|indian nurse|filipino|nigerian|kenyan)\b/.test(s))
    return "migration_international_nurse";
  if (/\b(vs|versus|compare)\b/.test(s)) return "comparison";
  if (/\b(priorit|first|triage)\b/.test(s)) return "prioritization";
  if (/\b(treatment|management|medication)\b/.test(s)) return "management_treatment";
  return "clinical_concept";
}

function main() {
  mkdirSync(OUT, { recursive: true });
  const generatedAt = new Date().toISOString();

  const pub = readJson<{
    databaseAvailable?: boolean;
    databaseUrlConfigured?: boolean;
    queryFailed?: boolean;
    posts?: BlogPostExport[];
    counts?: { blogPost?: number };
  }>(join(OUT, "blog-published-export.json"));

  const loc = readJson<{
    databaseAvailable?: boolean;
    queryFailed?: boolean;
    articles?: LocExport[];
    counts?: { localizedBlogArticle?: number };
  }>(join(OUT, "blog-localized-export.json"));

  const liveInventory = readJson<{ slugs?: RepoSlug[]; rows?: RepoSlug[] }>(join(OUT, "blog-live-slug-inventory.json"));
  const sourceInv = readJson<{ sources?: unknown[] }>(join(OUT, "blog-source-inventory.json"));
  const longtail = readJson<unknown>(join(OUT, "blog-longtail-recovery-audit.json"));
  const top50Repo = readJson<{ queue?: { slug: string; title: string | null; rewritePriority: string }[] }>(
    join(OUT, "blog-top-50-rewrite-queue.json"),
  );

  const dbBlogSlugs = new Map<string, BlogPostExport>();
  for (const p of pub?.posts ?? []) {
    dbBlogSlugs.set(p.slug, p);
  }

  const localizedByComposite = new Map<string, LocExport>();
  const slugOccurrences = new Map<string, number>();
  for (const a of loc?.articles ?? []) {
    const key = `${a.region}|${a.locale}|${a.profession ?? ""}|${a.exam ?? ""}|${a.slug}`;
    localizedByComposite.set(key, a);
    slugOccurrences.set(a.slug, (slugOccurrences.get(a.slug) ?? 0) + 1);
  }

  const repoSlugs = new Map<string, RepoSlug>();
  const invList = liveInventory?.slugs ?? liveInventory?.rows ?? [];
  for (const r of invList) {
    if (!repoSlugs.has(r.slug)) repoSlugs.set(r.slug, r);
  }

  const allKeys = new Set<string>([...dbBlogSlugs.keys(), ...repoSlugs.keys(), ...slugOccurrences.keys()]);
  for (const a of loc?.articles ?? []) allKeys.add(a.slug);

  const reconciled: Record<string, unknown>[] = [];
  for (const slug of [...allKeys].sort()) {
    const dbp = dbBlogSlugs.get(slug);
    const repo = repoSlugs.get(slug);
    const locCount = slugOccurrences.get(slug) ?? 0;

    const confirmedLive = Boolean(dbp) || (loc?.articles ?? []).some((x) => x.slug === slug);

    let sourceOfTruth: "Prisma" | "static" | "generated" | "localized" | "import" | "unknown" = "unknown";
    if (dbp) sourceOfTruth = "Prisma";
    else if ((loc?.articles ?? []).some((x) => x.slug === slug)) sourceOfTruth = "localized";
    else if (repo?.sourceType?.includes("static")) sourceOfTruth = "static";
    else if (repo?.sourceType?.includes("seo")) sourceOfTruth = "generated";

    const duplicateAcrossSources =
      (dbp ? 1 : 0) + (repo ? 1 : 0) + (locCount > 0 ? 1 : 0) > 1 ||
      locCount > 1 ||
      Boolean(dbp && repo);

    reconciled.push({
      slug,
      confirmedLive,
      sourceOfTruth,
      repoBodyAvailable: repo ? repo.sourceType !== "metadata_only" : false,
      dbBodyAvailable: Boolean(dbp?.bodyLengthEstimate || (loc?.articles ?? []).find((x) => x.slug === slug)),
      duplicateAcrossSources,
      recommendedEditingPath: confirmedLive
        ? dbp
          ? "Admin/blog studio or Prisma-backed editor targeting BlogPost.id"
          : "LocalizedBlogArticle via canonicalArticleId + locale/region"
        : "Import or draft new BlogPost then publish — repo-only slug is not live",
      rewritePriority: confirmedLive ? "high" : "medium",
      evidence: {
        inBlogPostExport: Boolean(dbp),
        inLocalizedExportCount: locCount,
        inRepoInventory: Boolean(repo),
      },
    });
  }

  const overlapRepoAndDb = [...repoSlugs.keys()].filter((s) => dbBlogSlugs.has(s)).length;
  const dbOnlyLive = [...dbBlogSlugs.keys()].filter((s) => !repoSlugs.has(s)).length;

  writeFileSync(
    join(OUT, "blog-live-corpus-reconciled.json"),
    JSON.stringify(
      {
        generatedAt,
        metadata: {
          databaseAvailable: Boolean(pub?.databaseAvailable ?? pub?.databaseUrlConfigured),
          queryFailed: pub?.queryFailed ?? false,
          publishedBlogPostCount: pub?.posts?.length ?? 0,
          localizedArticleCount: loc?.articles?.length ?? 0,
          repoInventorySlugCount: repoSlugs.size,
          overlapRepoSlugsWithBlogPost: overlapRepoAndDb,
          blogPostSlugsNotInRepoInventory: dbOnlyLive,
          duplicateSlugAcrossLocalizedRows:
            [...slugOccurrences.entries()].filter(([, c]) => c > 1).length,
        },
        longtailAuditPresent: longtail != null,
        sourceInventoryPresent: sourceInv != null,
        reconciled,
      },
      null,
      2,
    ),
  );

  const confirmedPosts: { slug: string; title: string; locale: string; sourceModel: string; bodyLen: number }[] = [];
  for (const p of pub?.posts ?? []) {
    confirmedPosts.push({
      slug: p.slug,
      title: p.title,
      locale: p.locale,
      sourceModel: "BlogPost",
      bodyLen: p.bodyLengthEstimate,
    });
  }

  type QueueRow = {
    slug: string;
    title: string;
    locale: string;
    region?: string;
    sourceModel: "BlogPost" | "LocalizedBlogArticle";
    confirmedLive: true;
    cluster: string;
    whyItMatters: string;
    likelyLongTailKeywords: string[];
    rewritePriority: "high" | "medium";
    recommendedEditingPath: string;
    bodyLengthEstimate: number;
  };

  const fromBlog: QueueRow[] = confirmedPosts.map((p) => {
    const cluster = classifyCluster(p.slug, p.title);
    const weak = p.bodyLen < 2500;
    return {
      slug: p.slug,
      title: p.title,
      locale: p.locale,
      sourceModel: "BlogPost",
      confirmedLive: true,
      cluster,
      whyItMatters:
        cluster === "migration_international_nurse"
          ? "International nurse NCLEX path — high commercial intent"
          : cluster === "exam_strategy"
            ? "Core NCLEX demand — list/conversion funnel"
            : "Clinical/educational long-tail; supports topical authority",
      likelyLongTailKeywords: [p.title.slice(0, 60), p.slug.replace(/-/g, " ")],
      rewritePriority: weak ? "high" : "medium",
      recommendedEditingPath: "Edit via production admin / studio linked to BlogPost row; avoid slug changes",
      bodyLengthEstimate: p.bodyLen,
    };
  });

  const fromLocalized: QueueRow[] = (loc?.articles ?? []).map((a) => {
    const cluster = classifyCluster(a.slug, a.title);
    const weak = a.bodyLengthEstimate < 2500;
    return {
      slug: a.slug,
      title: a.title,
      locale: a.locale,
      region: a.region,
      sourceModel: "LocalizedBlogArticle",
      confirmedLive: true,
      cluster,
      whyItMatters: "Localized SEO route — edit via LocalizedBlogArticle + canonical linkage",
      likelyLongTailKeywords: [a.title.slice(0, 60), a.slug.replace(/-/g, " ")],
      rewritePriority: weak ? "high" : "medium",
      recommendedEditingPath: "Admin localized blog editor; preserve locale/region/exam scope",
      bodyLengthEstimate: a.bodyLengthEstimate,
    };
  });

  const scored = [...fromBlog, ...fromLocalized].sort((a, b) => {
    const score = (x: QueueRow) =>
      (x.rewritePriority === "high" ? 2 : 1) +
      (x.cluster === "exam_strategy" || x.cluster === "migration_international_nurse" ? 1 : 0);
    return score(b) - score(a);
  });

  const top50Confirmed = scored.slice(0, 50);

  const backlogRepoOnly =
    (top50Repo?.queue ?? [])
      .filter((row) => !dbBlogSlugs.has(row.slug))
      .slice(0, 25)
      .map((row) => ({
        slug: row.slug,
        title: row.title ?? row.slug,
        confirmedLive: false as const,
        note: "Repo generator or static only — not in DB export; not confirmed live",
      })) ?? [];

  writeFileSync(
    join(OUT, "blog-top-50-rewrite-queue-confirmed-live.json"),
    JSON.stringify(
      {
        generatedAt,
        note: "Only includes rows with DB evidence (BlogPost or LocalizedBlogArticle export). No repo-only posts marked confirmed live.",
        queue: top50Confirmed,
        backlogRepoOnlyNotInDb: backlogRepoOnly,
      },
      null,
      2,
    ),
  );

  const md: string[] = [];
  md.push(`# Blog live corpus summary`);
  md.push(``);
  md.push(`Generated: ${generatedAt}`);
  md.push(``);
  md.push(`## Prisma export status`);
  md.push(
    `- Database available for export: **${pub?.databaseAvailable || pub?.databaseUrlConfigured ? "yes" : "no"}**`,
  );
  md.push(`- Query failed: **${pub?.queryFailed ? "yes" : "no"}**`);
  md.push(`- Published \`BlogPost\` rows exported (live visibility): **${pub?.posts?.length ?? 0}**`);
  md.push(`- \`LocalizedBlogArticle\` rows exported (live visibility): **${loc?.articles?.length ?? 0}**`);
  md.push(``);
  md.push(`## Reconciliation`);
  md.push(`- Repo inventory slugs overlapping DB \`BlogPost\` slugs: **${overlapRepoAndDb}**`);
  md.push(`- \`BlogPost\` slugs not present in repo slug inventory (DB-only from export): **${dbOnlyLive}**`);
  md.push(
    `- Localized slugs appearing more than once (different region/locale): **${[...slugOccurrences.entries()].filter(([, c]) => c > 1).length}** distinct slugs`,
  );
  md.push(``);
  md.push(`## Confirmed live definition`);
  md.push(
    `- A slug is **confirmed live** only if it appears in \`blog-published-export.json\` posts[] or \`blog-localized-export.json\` articles[] (DB evidence).`,
  );
  md.push(``);
  md.push(`## Top 10 rewrite targets (confirmed \`BlogPost\` live)`);
  for (const p of confirmedPosts.slice(0, 10)) {
    md.push(`- **${p.slug}** — ${p.title.slice(0, 80)}${p.title.length > 80 ? "…" : ""} (body ~${p.bodyLen} chars)`);
  }
  if (confirmedPosts.length === 0) {
    md.push(`- *(No BlogPost rows in export — run export with DATABASE_URL or check query errors.)*`);
  }
  md.push(``);
  md.push(`## Safest editing workflow`);
  md.push(`- Use existing admin/blog studio flows that update \`BlogPost\` by id; avoid raw production SQL.`);
  md.push(`- Do not change \`slug\` without redirects — prefer body/SEO field upgrades.`);
  md.push(`- Localized variants: edit \`LocalizedBlogArticle\` linked by \`canonicalArticleId\`.`);
  md.push(``);
  md.push(`## Limitations`);
  md.push(`- Export is point-in-time; scheduled posts depend on \`blogLiveWhere\` at export time.`);
  md.push(`- Repo inventory is heuristic extraction — not identical to sitemap.xml.`);
  md.push(`- Full-repo TypeScript errors unrelated to these scripts may still exist.`);
  md.push(``);

  writeFileSync(join(OUT, "blog-live-corpus-summary.md"), md.join("\n"));

  console.log(
    JSON.stringify(
      {
        ok: true,
        blogPostRows: pub?.posts?.length ?? 0,
        localizedRows: loc?.articles?.length ?? 0,
        reconciledRows: reconciled.length,
        top50: Math.min(50, top50Confirmed.length),
      },
      null,
      2,
    ),
  );
}

main();
