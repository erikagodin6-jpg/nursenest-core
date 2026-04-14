#!/usr/bin/env npx tsx
/**
 * Import legacy `content_items.json` → Prisma `ContentItem` / `content_items`.
 *
 * Expected: top-level JSON array of objects (camelCase or snake_case keys, Drizzle-aligned).
 *
 * Default: dry-run (reads DB for duplicate counts only). `--apply` runs upsert.
 *
 * Run from nursenest-core/:
 *   npx tsx scripts/import-content-items-json.ts --file=../data/import/content_items.json
 *   npx tsx scripts/import-content-items-json.ts --file=... --apply
 */
import "../src/lib/db/env-bootstrap";
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function monorepoRoot(): string {
  return path.resolve(__dirname, "../..");
}

function parseArgs() {
  const argv = process.argv.slice(2);
  const get = (name: string): string | undefined => {
    const pref = `--${name}=`;
    const hit = argv.find((a) => a.startsWith(pref));
    if (hit) return hit.slice(pref.length);
    const idx = argv.indexOf(`--${name}`);
    if (idx >= 0 && argv[idx + 1] && !argv[idx + 1]!.startsWith("--")) return argv[idx + 1];
    return undefined;
  };
  const file =
    get("file") ??
    path.join(monorepoRoot(), "data", "import", "content_items.json");
  const apply = argv.includes("--apply");
  return { file: path.resolve(file), apply };
}

function pick<T = unknown>(row: Record<string, unknown>, camel: string, snake: string): T | undefined {
  if (camel in row) return row[camel] as T;
  if (snake in row) return row[snake] as T;
  return undefined;
}

function asString(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "string") return v;
  return String(v);
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x).trim()).filter(Boolean);
}

function contentHashForDedupe(slug: string, title: string, content: unknown): string {
  const payload = JSON.stringify({ slug, title, content });
  return createHash("sha256").update(payload).digest("hex").slice(0, 32);
}

/** Normalize JSON `content` to a Prisma-compatible JSON array (blocks or wrap unknown). */
function normalizeContent(raw: unknown): Prisma.InputJsonValue {
  if (raw === null || raw === undefined) return [];
  if (Array.isArray(raw)) return raw as Prisma.InputJsonValue;
  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return [];
    try {
      const p = JSON.parse(t) as unknown;
      if (Array.isArray(p)) return p as Prisma.InputJsonValue;
      return [{ type: "paragraph", content: t }] as unknown as Prisma.InputJsonValue;
    } catch {
      return [{ type: "paragraph", content: t }] as unknown as Prisma.InputJsonValue;
    }
  }
  if (typeof raw === "object") {
    return [raw] as Prisma.InputJsonValue;
  }
  return [];
}

/**
 * Preserve quarantined / odd statuses for admin visibility; learner routes use `published` only.
 * See `lessonPublishedWhere` in content-access-scope.ts.
 */
function normalizeStatus(raw: unknown): string {
  const s = asString(raw, "draft").trim().toLowerCase();
  if (!s) return "draft";
  if (s === "quarantined" || s === "quarantine") return "quarantined";
  if (s === "published" || s === "active") return "published";
  if (s === "scheduled") return "scheduled";
  if (s === "archived" || s === "merged") return "archived";
  if (s === "in_review" || s === "in review") return "in_review";
  if (s === "pending" || s === "draft") return "draft";
  return "draft";
}

function mapRow(
  row: Record<string, unknown>,
): { ok: true; data: Prisma.ContentItemCreateInput; dedupeHash: string } | { ok: false; reason: string } {
  const title = asString(pick(row, "title", "title"), "").trim();
  const slug = asString(pick(row, "slug", "slug"), "").trim().replace(/^\/+|\/+$/g, "");
  if (!slug) return { ok: false, reason: "empty_slug" };
  if (!title) return { ok: false, reason: "empty_title" };

  const type = asString(pick(row, "type", "type"), "lesson").trim().toLowerCase() || "lesson";
  const content = normalizeContent(pick(row, "content", "content"));
  const contentStr = JSON.stringify(content);
  if (contentStr.length < 5 && !asString(pick(row, "summary", "summary"), "").trim()) {
    return { ok: false, reason: "empty_content_and_summary" };
  }

  const idRaw = asString(pick(row, "id", "id"), "").trim();
  const id = /^[0-9a-f-]{36}$/i.test(idRaw) ? idRaw : undefined;

  const data: Prisma.ContentItemCreateInput = {
    title,
    slug,
    type,
    category: asString(pick(row, "category", "category"), "").trim() || undefined,
    bodySystem: asString(pick(row, "bodySystem", "body_system"), "").trim() || undefined,
    tier: asString(pick(row, "tier", "tier"), "").trim() || undefined,
    status: normalizeStatus(pick(row, "status", "status")),
    tags: asStringArray(pick(row, "tags", "tags")),
    summary: asString(pick(row, "summary", "summary"), "").trim() || undefined,
    content,
    seoTitle: asString(pick(row, "seoTitle", "seo_title"), "").trim() || undefined,
    seoDescription: asString(pick(row, "seoDescription", "seo_description"), "").trim() || undefined,
    seoKeywords: asStringArray(pick(row, "seoKeywords", "seo_keywords")),
    primaryKeyword: asString(pick(row, "primaryKeyword", "primary_keyword"), "").trim() || undefined,
    secondaryKeywords: asStringArray(pick(row, "secondaryKeywords", "secondary_keywords")),
    clinicalSafetyReview: Boolean(pick(row, "clinicalSafetyReview", "clinical_safety_review")),
    autoPublish: Boolean(pick(row, "autoPublish", "auto_publish")),
    authorId: asString(pick(row, "authorId", "author_id"), "").trim() || undefined,
    authorName: asString(pick(row, "authorName", "author_name"), "").trim() || undefined,
    regionScope: asString(pick(row, "regionScope", "region_scope"), "BOTH").trim() || "BOTH",
    versionKey: asString(pick(row, "versionKey", "version_key"), "").trim() || undefined,
    updatedByAi: Boolean(pick(row, "updatedByAi", "updated_by_ai")),
    protectedFields: asStringArray(pick(row, "protectedFields", "protected_fields")),
    sourceVersion:
      typeof pick(row, "sourceVersion", "source_version") === "number"
        ? (pick(row, "sourceVersion", "source_version") as number)
        : parseInt(asString(pick(row, "sourceVersion", "source_version"), "1"), 10) || 1,
  };

  const sched = pick(row, "scheduledAt", "scheduled_at");
  if (sched) {
    const d = new Date(asString(sched));
    if (!Number.isNaN(d.getTime())) data.scheduledAt = d;
  }
  const pub = pick(row, "publishedAt", "published_at");
  if (pub) {
    const d = new Date(asString(pub));
    if (!Number.isNaN(d.getTime())) data.publishedAt = d;
  }
  const cr = pick(row, "createdAt", "created_at");
  if (cr) {
    const d = new Date(asString(cr));
    if (!Number.isNaN(d.getTime())) (data as { createdAt?: Date }).createdAt = d;
  }

  if (id) (data as { id?: string }).id = id;

  return {
    ok: true,
    data,
    dedupeHash: contentHashForDedupe(slug, title, content),
  };
}

async function main() {
  const { file, apply } = parseArgs();

  if (!fs.existsSync(file)) {
    console.log(
      JSON.stringify(
        {
          phase: "error",
          error: "file_not_found",
          file,
          hint: "Place content_items.json and pass --file= or use data/import/content_items.json",
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
  if (!Array.isArray(raw)) {
    console.log(JSON.stringify({ phase: "error", error: "expected_top_level_array", file }, null, 2));
    process.exit(1);
  }

  const totalRows = raw.length;
  const byType: Record<string, number> = {};
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const t = asString(pick(r, "type", "type"), "lesson").trim().toLowerCase() || "lesson";
    byType[t] = (byType[t] ?? 0) + 1;
  }

  let invalid = 0;
  const invalidReasons: Record<string, number> = {};
  const mapped: { data: Prisma.ContentItemCreateInput; dedupeHash: string }[] = [];
  const seenSlug = new Set<string>();
  const seenContentHash = new Set<string>();
  let skippedInFileSlug = 0;
  let skippedInFileContentHash = 0;

  for (const row of raw) {
    if (!row || typeof row !== "object") {
      invalid++;
      invalidReasons.non_object = (invalidReasons.non_object ?? 0) + 1;
      continue;
    }

    const m = mapRow(row as Record<string, unknown>);
    if (!m.ok) {
      invalid++;
      invalidReasons[m.reason] = (invalidReasons[m.reason] ?? 0) + 1;
      continue;
    }
    const slug = m.data.slug!;
    if (seenSlug.has(slug)) {
      skippedInFileSlug++;
      continue;
    }
    if (seenContentHash.has(m.dedupeHash)) {
      skippedInFileContentHash++;
      continue;
    }
    seenSlug.add(slug);
    seenContentHash.add(m.dedupeHash);
    mapped.push({ data: m.data, dedupeHash: m.dedupeHash });
  }

  const uniqueAfterFileDedupe = mapped.length;
  const prisma = new PrismaClient();
  let existingById = 0;
  let existingBySlug = 0;
  try {
    const ids = mapped.map((m) => (m.data as { id?: string }).id).filter(Boolean) as string[];
    const slugs = mapped.map((m) => m.data.slug!);
    const chunk = 300;
    for (let i = 0; i < ids.length; i += chunk) {
      const n = await prisma.contentItem.count({ where: { id: { in: ids.slice(i, i + chunk) } } });
      existingById += n;
    }
    for (let i = 0; i < slugs.length; i += chunk) {
      const n = await prisma.contentItem.count({ where: { slug: { in: slugs.slice(i, i + chunk) } } });
      existingBySlug += n;
    }
  } finally {
    await prisma.$disconnect();
  }

  /** Upper bound: rows that need upsert touch (slug is unique — id match implies same row). */
  const wouldUpsert = uniqueAfterFileDedupe;
  const skippedDbApprox = Math.min(existingBySlug, wouldUpsert);

  const report = {
    phase: apply ? "apply" : "dry_run",
    file,
    totalRows,
    contentTypesInFile: byType,
    validationPassed: totalRows - invalid,
    invalid,
    invalidReasons,
    skippedInFileDuplicateSlug: skippedInFileSlug,
    skippedInFileDuplicateContentHash: skippedInFileContentHash,
    uniqueRowsAfterInFileDedupe: uniqueAfterFileDedupe,
    dbExistingSlugOverlapCount: existingBySlug,
    dbExistingIdOverlapCount: existingById,
    note: "Upsert uses slug as key; existing rows are updated, not double-inserted. skippedDbApprox counts rows whose slug already exists.",
    message: apply ? undefined : "No writes. Pass --apply to upsert.",
  };

  if (!apply) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const p2 = new PrismaClient();
  let upserted = 0;
  let failed = 0;
  try {
    for (const { data } of mapped) {
      const slug = data.slug!;
      try {
        await p2.contentItem.upsert({
          where: { slug },
          create: data,
          update: {
            title: data.title,
            type: data.type,
            category: data.category,
            bodySystem: data.bodySystem,
            tier: data.tier,
            status: data.status,
            tags: data.tags,
            summary: data.summary,
            content: data.content,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
            seoKeywords: data.seoKeywords,
            primaryKeyword: data.primaryKeyword,
            secondaryKeywords: data.secondaryKeywords,
            scheduledAt: data.scheduledAt,
            clinicalSafetyReview: data.clinicalSafetyReview,
            autoPublish: data.autoPublish,
            publishedAt: data.publishedAt,
            authorId: data.authorId,
            authorName: data.authorName,
            regionScope: data.regionScope,
            versionKey: data.versionKey,
            updatedByAi: data.updatedByAi,
            protectedFields: data.protectedFields,
            sourceVersion: data.sourceVersion,
          },
        });
        upserted++;
      } catch (e) {
        failed++;
        console.error(JSON.stringify({ err: "upsert_failed", slug, message: e instanceof Error ? e.message : String(e) }));
      }
    }
    console.log(JSON.stringify({ ...report, upserted, failed }, null, 2));
  } finally {
    await p2.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
