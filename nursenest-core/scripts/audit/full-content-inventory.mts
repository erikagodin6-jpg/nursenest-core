#!/usr/bin/env npx tsx
/**
 * Read-only forensic inventory for article-like NurseNest content across:
 * - database/CMS tables
 * - generated/import manifests
 * - static Markdown/MDX/JSON records
 * - SEO/static article source modules
 *
 * The report is intentionally location-oriented; duplicate slugs across DB/static
 * artifacts are counted in each source location so recovery work can find every
 * generated copy.
 */
import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

type StatusCounts = Record<string, number>;

type InventoryRow = {
  location: string;
  sourceType: "database" | "json" | "markdown" | "mdx" | "typescript" | "pipeline" | "unknown";
  recordCount: number;
  statusBreakdown: StatusCounts;
  publicHidden: string;
  indexableNoindex: string;
  lastModified: string | null;
  evidence: string;
};

const appRoot = process.cwd();
const repoRoot = path.resolve(appRoot, "..");
const now = new Date();

const FILE_SCAN_ROOTS = [
  "content",
  "data/blog-manifest",
  "data/blog-content",
  "data/seo",
  "output",
  "scripts/blog",
  "scripts/seo",
  "scripts/audit",
  "src/lib/seo",
  "src/lib/blog",
  "src/app/(marketing)",
  "src/app/(admin)/admin/blog",
  "src/app/api/admin/blog",
  "src/app/api/blog",
  "src/app/api/cron",
  "reports",
  "docs",
].filter((p) => existsSync(path.join(appRoot, p)));

const ARTICLE_HINT = /(blog|article|post|seo|longtail|long-tail|content|manifest|markdown|mdx|draft|hidden|schedule|import|generated|legacy)/i;
const SOURCE_EXT = /\.(json|jsonl|md|mdx|ts|tsx|mts)$/i;
const CODE_RECORD_HINT = /(?:slug|title|excerpt|body|html|metaDescription|seoTitle|canonicalSlug|localizedSlug)\s*:/g;

function bump(map: StatusCounts, key: string | null | undefined, count = 1): void {
  const normalized = key?.trim() || "(unspecified)";
  map[normalized] = (map[normalized] ?? 0) + count;
}

function mergeStatusCounts(items: StatusCounts[]): StatusCounts {
  const out: StatusCounts = {};
  for (const item of items) {
    for (const [key, value] of Object.entries(item)) bump(out, key, value);
  }
  return out;
}

function statusFromRecord(record: unknown): string {
  if (!record || typeof record !== "object") return "(record)";
  const r = record as Record<string, unknown>;
  for (const key of [
    "postStatus",
    "contentStatus",
    "status",
    "publishStatus",
    "workflowStatus",
    "reviewStatus",
    "stage",
  ]) {
    const value = r[key];
    if (typeof value === "string" && value.trim()) return `${key}:${value.trim()}`;
  }
  return "(record)";
}

function inferVisibility(statuses: StatusCounts, location: string, text?: string): string {
  const haystack = `${location}\n${Object.keys(statuses).join(" ")}\n${text ?? ""}`.toLowerCase();
  const publicSignals = /(published|approved|live|public|indexable|visible)/i.test(haystack);
  const hiddenSignals = /(draft|hidden|archived|unpublished|sample|failed|needs_review|pending|admin-only|internal|noindex)/i.test(haystack);
  if (publicSignals && hiddenSignals) return "mixed";
  if (publicSignals) return "public";
  if (hiddenSignals) return "hidden/internal";
  return "unknown";
}

function inferIndexability(location: string, text?: string): string {
  const haystack = `${location}\n${text ?? ""}`.toLowerCase();
  const noindex = /noindex|robots:\s*\{\s*index:\s*false|index:\s*false|hidden from navigation|admin-only|internal-only/.test(haystack);
  const indexable = /sitemap|canonical|indexable|robots:\s*\{\s*index:\s*true|poststatus:published|published/i.test(haystack);
  if (noindex && indexable) return "mixed";
  if (noindex) return "noindex/hidden";
  if (indexable) return "indexable/public-surface";
  return "unknown";
}

function countJsonRecords(value: unknown): { count: number; statuses: StatusCounts; evidence: string } {
  const statuses: StatusCounts = {};
  if (Array.isArray(value)) {
    for (const item of value) bump(statuses, statusFromRecord(item));
    return { count: value.length, statuses, evidence: "top-level array" };
  }
  if (!value || typeof value !== "object") return { count: 1, statuses: { scalar: 1 }, evidence: "scalar json" };
  const obj = value as Record<string, unknown>;
  const arrays: Array<{ key: string; value: unknown[] }> = [];
  for (const [key, v] of Object.entries(obj)) {
    if (!Array.isArray(v)) continue;
    if (/(posts|articles|items|records|content|pages|lessons|questions|topics|manifest|batch|entries|slugs)/i.test(key)) {
      arrays.push({ key, value: v });
    }
  }
  if (arrays.length > 0) {
    let count = 0;
    for (const arr of arrays) {
      count += arr.value.length;
      for (const item of arr.value) bump(statuses, statusFromRecord(item));
    }
    return { count, statuses, evidence: `arrays: ${arrays.map((a) => a.key).join(", ")}` };
  }
  bump(statuses, statusFromRecord(obj));
  return { count: 1, statuses, evidence: "top-level object" };
}

async function walkFiles(root: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(abs: string): Promise<void> {
    const entries = await fs.readdir(abs, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const full = path.join(abs, entry.name);
      if (entry.isDirectory()) {
        if (/node_modules|\.next|test-results|playwright-report|\.git/.test(full)) continue;
        await walk(full);
      } else if (SOURCE_EXT.test(entry.name) && ARTICLE_HINT.test(full)) {
        out.push(full);
      }
    }
  }
  await walk(path.join(appRoot, root));
  return out;
}

async function inventoryFiles(): Promise<InventoryRow[]> {
  const files = (await Promise.all(FILE_SCAN_ROOTS.map(walkFiles))).flat();
  const unique = [...new Set(files)].sort();
  const rows: InventoryRow[] = [];
  for (const abs of unique) {
    const rel = path.relative(appRoot, abs);
    if (rel === "docs/forensic-content-inventory.md") continue;
    const stat = await fs.stat(abs);
    const text = await fs.readFile(abs, "utf8").catch(() => "");
    if (abs.endsWith(".json")) {
      try {
        const parsed = JSON.parse(text);
        const counted = countJsonRecords(parsed);
        rows.push({
          location: rel,
          sourceType: "json",
          recordCount: counted.count,
          statusBreakdown: counted.statuses,
          publicHidden: inferVisibility(counted.statuses, rel, text.slice(0, 4000)),
          indexableNoindex: inferIndexability(rel, text.slice(0, 4000)),
          lastModified: stat.mtime.toISOString(),
          evidence: counted.evidence,
        });
      } catch {
        rows.push({
          location: rel,
          sourceType: "json",
          recordCount: 0,
          statusBreakdown: { parse_error: 1 },
          publicHidden: inferVisibility({ parse_error: 1 }, rel, text.slice(0, 4000)),
          indexableNoindex: inferIndexability(rel, text.slice(0, 4000)),
          lastModified: stat.mtime.toISOString(),
          evidence: "json parse error",
        });
      }
      continue;
    }
    if (abs.endsWith(".jsonl")) {
      const lines = text.split(/\r?\n/).filter((line) => line.trim());
      const statuses: StatusCounts = {};
      for (const line of lines) {
        try {
          bump(statuses, statusFromRecord(JSON.parse(line)));
        } catch {
          bump(statuses, "parse_error");
        }
      }
      rows.push({
        location: rel,
        sourceType: "json",
        recordCount: lines.length,
        statusBreakdown: statuses,
        publicHidden: inferVisibility(statuses, rel, text.slice(0, 4000)),
        indexableNoindex: inferIndexability(rel, text.slice(0, 4000)),
        lastModified: stat.mtime.toISOString(),
        evidence: "jsonl lines",
      });
      continue;
    }
    if (abs.endsWith(".md") || abs.endsWith(".mdx")) {
      const status = /noindex|hidden|draft|internal/i.test(text) ? "file:hidden_or_internal" : "file";
      rows.push({
        location: rel,
        sourceType: abs.endsWith(".mdx") ? "mdx" : "markdown",
        recordCount: 1,
        statusBreakdown: { [status]: 1 },
        publicHidden: inferVisibility({ [status]: 1 }, rel, text.slice(0, 4000)),
        indexableNoindex: inferIndexability(rel, text.slice(0, 4000)),
        lastModified: stat.mtime.toISOString(),
        evidence: "markdown/mdx file",
      });
      continue;
    }
    const matches = text.match(CODE_RECORD_HINT) ?? [];
    if (matches.length === 0) continue;
    const estimatedRecordCount = Math.max(
      (text.match(/\bslug\s*:/g) ?? []).length,
      Math.floor(matches.length / 3),
      1,
    );
    const statuses: StatusCounts = {};
    for (const match of text.matchAll(/\b(?:status|postStatus|contentStatus|publishStatus|stage)\s*:\s*["'`]([^"'`]+)["'`]/g)) {
      bump(statuses, match[1]);
    }
    if (Object.keys(statuses).length === 0) bump(statuses, "source_records");
    rows.push({
      location: rel,
      sourceType: "typescript",
      recordCount: estimatedRecordCount,
      statusBreakdown: statuses,
      publicHidden: inferVisibility(statuses, rel, text.slice(0, 4000)),
      indexableNoindex: inferIndexability(rel, text.slice(0, 4000)),
      lastModified: stat.mtime.toISOString(),
      evidence: `source scan: slug keys=${(text.match(/\bslug\s*:/g) ?? []).length}, record hints=${matches.length}`,
    });
  }
  return rows;
}

async function dbRow(
  prisma: PrismaClient,
  modelName: string,
  location: string,
  statusField?: string,
  extra?: { where?: Record<string, unknown>; evidence?: string },
): Promise<InventoryRow> {
  const delegate = (prisma as unknown as Record<string, { count: Function; groupBy?: Function; aggregate?: Function }>)[modelName];
  if (!delegate) {
    return {
      location,
      sourceType: "database",
      recordCount: 0,
      statusBreakdown: { model_missing: 1 },
      publicHidden: "unknown",
      indexableNoindex: "unknown",
      lastModified: null,
      evidence: "Prisma delegate missing",
    };
  }
  const where = extra?.where ?? {};
  const recordCount = await delegate.count({ where });
  let statuses: StatusCounts = { "(all)": recordCount };
  if (statusField && delegate.groupBy) {
    try {
      const grouped = await delegate.groupBy({ by: [statusField], where, _count: { _all: true } });
      statuses = {};
      for (const row of grouped) bump(statuses, `${statusField}:${String(row[statusField] ?? "(null)")}`, row._count._all);
    } catch {
      statuses = { "(status_group_failed)": recordCount };
    }
  }
  let lastModified: string | null = null;
  if (delegate.aggregate) {
    for (const field of ["updatedAt", "createdAt", "publishedAt"]) {
      try {
        const agg = await delegate.aggregate({ where, _max: { [field]: true } });
        const value = agg?._max?.[field];
        if (value instanceof Date) {
          lastModified = value.toISOString();
          break;
        }
      } catch {
        // Field not present on this model.
      }
    }
  }
  return {
    location,
    sourceType: "database",
    recordCount,
    statusBreakdown: statuses,
    publicHidden: inferVisibility(statuses, location),
    indexableNoindex: inferIndexability(location, JSON.stringify(statuses)),
    lastModified,
    evidence: extra?.evidence ?? `Prisma ${modelName}.count/groupBy`,
  };
}

async function inventoryDatabase(): Promise<{ rows: InventoryRow[]; dbAvailable: boolean; dbSource: string }> {
  let dbSource = process.env.DATABASE_URL?.trim() ? "process" : "missing";
  if (dbSource === "missing") {
    for (const [label, file] of [
      ["app .env.local", path.join(appRoot, ".env.local")],
      ["repo .env.local", path.join(repoRoot, ".env.local")],
      ["app .env", path.join(appRoot, ".env")],
      ["repo .env", path.join(repoRoot, ".env")],
    ] as const) {
      if (!existsSync(file)) continue;
      config({ path: file, override: false, quiet: true });
      if (process.env.DATABASE_URL?.trim()) {
        dbSource = label;
        break;
      }
    }
  }
  console.log(`[full-content-inventory] DATABASE_URL=${process.env.DATABASE_URL?.trim() ? "set" : "missing"} source=${dbSource}`);
  if (!process.env.DATABASE_URL?.trim()) return { rows: [], dbAvailable: false, dbSource };

  const prisma = new PrismaClient();
  try {
    try {
      const rows = await Promise.all([
        dbRow(prisma, "blogPost", "db:BlogPost", "postStatus", { evidence: "canonical public SEO blog/article table" }),
        dbRow(prisma, "localizedBlogArticle", "db:LocalizedBlogArticle", "contentStatus", { evidence: "localized generated/adapted blog article variants" }),
        dbRow(prisma, "contentItem", "db:ContentItem(all)", "status", { evidence: "legacy CMS/content_items all types" }),
        dbRow(prisma, "contentItem", "db:ContentItem(type=article/blog/post)", "status", {
          where: { type: { in: ["article", "blog", "blog_post", "post", "seo_page"] } },
          evidence: "legacy CMS content_items article-like types",
        }),
        dbRow(prisma, "blogCampaign", "db:BlogCampaign", "status"),
        dbRow(prisma, "blogCampaignItem", "db:BlogCampaignItem", "status"),
        dbRow(prisma, "blogBatchSchedule", "db:BlogBatchSchedule", "status"),
        dbRow(prisma, "blogBatchScheduleItem", "db:BlogBatchScheduleItem", "status"),
        dbRow(prisma, "blogDraftGenerationBatch", "db:BlogDraftGenerationBatch", "status"),
        dbRow(prisma, "blogDraftGenerationBatchItem", "db:BlogDraftGenerationBatchItem", "status"),
        dbRow(prisma, "blogArticleGenerationJob", "db:BlogArticleGenerationJob", "stage"),
        dbRow(prisma, "contentAutomationLog", "db:ContentAutomationLog", "status"),
        dbRow(prisma, "marketingPublicContentOverride", "db:MarketingPublicContentOverride", undefined),
        dbRow(prisma, "educationalTranslationOverlay", "db:EducationalTranslationOverlay", "status"),
      ]);
      return { rows, dbAvailable: true, dbSource };
    } catch (error) {
      const message = error instanceof Error ? error.message.split("\n")[0] : String(error);
      return {
        rows: [
          {
            location: "db:*",
            sourceType: "database",
            recordCount: 0,
            statusBreakdown: { database_unreachable: 1 },
            publicHidden: "unknown",
            indexableNoindex: "unknown",
            lastModified: null,
            evidence: `Database/CMS inventory failed: ${message.slice(0, 220)}`,
          },
        ],
        dbAvailable: false,
        dbSource,
      };
    }
  } finally {
    await prisma.$disconnect();
  }
}

function markdownTable(rows: InventoryRow[]): string {
  const escape = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
  const head = "| Location | Record Count | Status Breakdown | Public/Hidden | Indexable/Noindex | Last Modified | Evidence |\n|---|---:|---|---|---|---|---|";
  const body = rows
    .sort((a, b) => b.recordCount - a.recordCount || a.location.localeCompare(b.location))
    .map((row) => {
      const statuses = Object.entries(row.statusBreakdown)
        .map(([k, v]) => `${k}:${v}`)
        .join(", ");
      return `| ${escape(row.location)} | ${row.recordCount} | ${escape(statuses)} | ${escape(row.publicHidden)} | ${escape(row.indexableNoindex)} | ${row.lastModified ?? "n/a"} | ${escape(row.evidence)} |`;
    })
    .join("\n");
  return `${head}\n${body}`;
}

async function main(): Promise<void> {
  const [db, fileRows] = await Promise.all([inventoryDatabase(), inventoryFiles()]);
  const allRows = [...db.rows, ...fileRows].filter((row) => row.recordCount > 0 || row.sourceType === "database");
  const totalRecords = allRows.reduce((sum, row) => sum + row.recordCount, 0);
  const dbTotal = db.rows.reduce((sum, row) => sum + row.recordCount, 0);
  const fileTotal = fileRows.reduce((sum, row) => sum + row.recordCount, 0);
  const bySource = allRows.reduce<Record<string, number>>((acc, row) => {
    acc[row.sourceType] = (acc[row.sourceType] ?? 0) + row.recordCount;
    return acc;
  }, {});
  const statusTotal = mergeStatusCounts(allRows.map((row) => row.statusBreakdown));

  const report = `# NurseNest Forensic Content Inventory

Generated: ${now.toISOString()}

## Executive Totals

- Total inventory records/artifacts counted by location: **${totalRecords}**
- Database/CMS records counted: **${dbTotal}**
- File/static/generated records counted: **${fileTotal}**
- Database available: **${db.dbAvailable ? "yes" : "no"}** (source: ${db.dbSource})
- Locations scanned: **${allRows.length}**

Important counting note: this is a forensic location inventory, not a deduplicated canonical-slug corpus. If one article exists in a generator manifest, import JSON, and BlogPost, it is counted in each location so recovery can find every copy.

${db.dbAvailable ? "" : "Database/CMS blocking gap: the configured DATABASE_URL was present but unreachable from this workspace during the run, so BlogPost, LocalizedBlogArticle, ContentItem, schedule, generation-job, and automation-log counts are not included in the numeric total. Re-run this script in the production/runtime shell with a reachable DATABASE_URL for the exact database total."}

## Source Breakdown

${Object.entries(bySource).map(([source, count]) => `- ${source}: ${count}`).join("\n")}

## Status Breakdown Across All Locations

${Object.entries(statusTotal).sort((a, b) => b[1] - a[1]).map(([status, count]) => `- ${status}: ${count}`).join("\n")}

## Inventory Table

${markdownTable(allRows)}
`;

  const reportPath = path.join(appRoot, "docs", "forensic-content-inventory.md");
  await fs.writeFile(reportPath, report, "utf8");
  console.log(JSON.stringify({ reportPath: path.relative(appRoot, reportPath), totalRecords, dbTotal, fileTotal, locations: allRows.length, dbAvailable: db.dbAvailable, dbSource: db.dbSource }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
