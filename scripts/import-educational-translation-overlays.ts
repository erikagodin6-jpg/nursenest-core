#!/usr/bin/env npx tsx
/**
 * Idempotent import of educational translation overlays (DB only — never touches canonical English rows).
 * At serve time, `src/lib/i18n/educational-translation-quality.ts` gates overlays; failed strings fall back to English.
 *
 * Usage:
 *   npx tsx scripts/import-educational-translation-overlays.ts --file tools/i18n/content-import/samples/sample.manifest.json --dry-run
 *   npm run i18n:import:content -- --file tools/i18n/content-import/samples/sample.manifest.json
 */
import "../src/lib/db/env-bootstrap";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  EducationalTranslationSourceKind as SK,
  EducationalTranslationStatus as ST,
  ContentStatus,
  PrismaClientKnownRequestError,
} from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { parseManifestJson } from "@/lib/i18n/educational-content-import/parse-manifest";
import { parseOverlayCsv } from "@/lib/i18n/educational-content-import/parse-csv";
import {
  validateAndSanitizeRow,
  optionsLengthMatchesCanonical,
} from "@/lib/i18n/educational-content-import/validate";
import type { EducationalOverlayImportRow } from "@/lib/i18n/educational-content-import/types";
import type { ImportSummary } from "@/lib/i18n/educational-content-import/types";
import { loadCatalogLessonKeys, parsePathwayLessonSourceId } from "./lib/catalog-lesson-source-ids";

const cwd = process.cwd();

function stableStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  const o = obj as Record<string, unknown>;
  const keys = Object.keys(o).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(o[k])}`).join(",")}}`;
}

function countCanonicalOptions(raw: unknown): number {
  if (!Array.isArray(raw)) return 0;
  return raw.length;
}

type Cli = {
  dryRun: boolean;
  forcePublished: boolean;
  locale?: string;
  file?: string;
  dir?: string;
};

function parseCli(argv: string[]): Cli {
  const out: Cli = { dryRun: false, forcePublished: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--force-published") out.forcePublished = true;
    else if (a.startsWith("--locale=")) out.locale = a.slice("--locale=".length).trim();
    else if (a === "--locale" && argv[i + 1]) {
      out.locale = argv[++i]!.trim();
    } else if (a.startsWith("--file=")) out.file = a.slice("--file=".length).trim();
    else if (a === "--file" && argv[i + 1]) {
      out.file = argv[++i]!.trim();
    } else if (a.startsWith("--dir=")) out.dir = a.slice("--dir=".length).trim();
    else if (a === "--dir" && argv[i + 1]) {
      out.dir = argv[++i]!.trim();
    }
  }
  return out;
}

function loadFiles(cli: Cli): { path: string; body: string }[] {
  if (cli.file) {
    const fp = path.isAbsolute(cli.file) ? cli.file : path.join(cwd, cli.file);
    return [{ path: fp, body: readFileSync(fp, "utf8") }];
  }
  if (cli.dir) {
    const d = path.isAbsolute(cli.dir) ? cli.dir : path.join(cwd, cli.dir);
    const names = readdirSync(d);
    const out: { path: string; body: string }[] = [];
    for (const n of names) {
      if (!/\.(json|csv)$/i.test(n)) continue;
      if (n.startsWith(".")) continue;
      const fp = path.join(d, n);
      out.push({ path: fp, body: readFileSync(fp, "utf8") });
    }
    if (out.length === 0) throw new Error(`No .json or .csv files in ${d}`);
    return out;
  }
  throw new Error("Provide --file=path or --dir=path (see tools/i18n/content-import/README.md)");
}

function parseFile(fp: string, body: string): EducationalOverlayImportRow[] {
  const lower = fp.toLowerCase();
  if (lower.endsWith(".csv")) {
    const r = parseOverlayCsv(body, fp);
    if (!r.ok) throw new Error(r.error);
    return r.rows;
  }
  let raw: unknown;
  try {
    raw = JSON.parse(body) as unknown;
  } catch (e) {
    throw new Error(`${fp}: invalid JSON — ${e instanceof Error ? e.message : String(e)}`);
  }
  const m = parseManifestJson(raw, fp);
  if (!m.ok) throw new Error(m.error);
  return m.rows;
}

async function buildPrismaLessonKeys(lessonSourceIds: string[]): Promise<Set<string>> {
  const set = new Set<string>();
  if (lessonSourceIds.length === 0) return set;

  const pairs: { pathwayId: string; slug: string }[] = [];
  const slugOnly: string[] = [];
  for (const sid of lessonSourceIds) {
    const p = parsePathwayLessonSourceId(sid);
    if (p) pairs.push(p);
    else slugOnly.push(sid);
  }

  const seen = new Set<string>();
  const uniqPairs = pairs.filter((p) => {
    const k = `${p.pathwayId}:${p.slug}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const chunk = 40;
  for (let i = 0; i < uniqPairs.length; i += chunk) {
    const part = uniqPairs.slice(i, i + chunk);
    const rows = await prisma.pathwayLesson.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        OR: part.map((p) => ({ pathwayId: p.pathwayId, slug: p.slug })),
      },
      select: { pathwayId: true, slug: true },
    });
    for (const r of rows) set.add(`${r.pathwayId}:${r.slug}`);
  }

  const slugList = [...new Set(slugOnly)];
  if (slugList.length > 0) {
    const rows = await prisma.pathwayLesson.findMany({
      where: { status: ContentStatus.PUBLISHED, slug: { in: slugList } },
      select: { pathwayId: true, slug: true },
    });
    for (const r of rows) set.add(`${r.pathwayId}:${r.slug}`);
  }

  return set;
}

async function slugOnlyLessonOk(slug: string, catalog: ReturnType<typeof loadCatalogLessonKeys>): Promise<boolean> {
  if ((catalog.slugPathwayCount.get(slug) ?? 0) === 1) return true;
  const distinct = await prisma.pathwayLesson.findMany({
    where: { slug, status: ContentStatus.PUBLISHED },
    select: { pathwayId: true },
    distinct: ["pathwayId"],
  });
  return distinct.length === 1;
}

async function validateLessonSource(
  sourceId: string,
  catalog: ReturnType<typeof loadCatalogLessonKeys>,
  prismaKeys: Set<string>,
): Promise<boolean> {
  const parsed = parsePathwayLessonSourceId(sourceId);
  if (parsed) {
    const k = `${parsed.pathwayId}:${parsed.slug}`;
    return catalog.compoundKeys.has(k) || prismaKeys.has(k);
  }
  const compound = catalog.uniqueSlugToCompound.get(sourceId);
  if (compound && (catalog.compoundKeys.has(compound) || prismaKeys.has(compound))) return true;
  return slugOnlyLessonOk(sourceId, catalog);
}

async function buildExistenceContext(rows: EducationalOverlayImportRow[]) {
  const catalog = loadCatalogLessonKeys(cwd);

  const questionIds = [...new Set(rows.filter((r) => r.sourceKind === SK.EXAM_QUESTION).map((r) => r.sourceId))];
  const qRows =
    questionIds.length === 0
      ? []
      : await prisma.examQuestion.findMany({
          where: { id: { in: questionIds } },
          select: { id: true, options: true },
        });
  const questionOptionsById = new Map(qRows.map((r) => [r.id, countCanonicalOptions(r.options)]));

  const lessonIds = [...new Set(rows.filter((r) => r.sourceKind === SK.PATHWAY_LESSON).map((r) => r.sourceId))];
  const prismaLessonKeys = await buildPrismaLessonKeys(lessonIds);

  const deckIds = [...new Set(rows.filter((r) => r.sourceKind === SK.FLASHCARD_DECK).map((r) => r.sourceId))];
  const cardIds = [...new Set(rows.filter((r) => r.sourceKind === SK.FLASHCARD).map((r) => r.sourceId))];
  const tagIds = [...new Set(rows.filter((r) => r.sourceKind === SK.FLASHCARD_TAG).map((r) => r.sourceId))];

  const [decks, cards, tags] = await Promise.all([
    deckIds.length
      ? prisma.flashcardDeck.findMany({ where: { id: { in: deckIds } }, select: { id: true } })
      : [],
    cardIds.length ? prisma.flashcard.findMany({ where: { id: { in: cardIds } }, select: { id: true } }) : [],
    tagIds.length ? prisma.flashcardTag.findMany({ where: { id: { in: tagIds } }, select: { id: true } }) : [],
  ]);

  return {
    catalog,
    questionOptionsById,
    prismaLessonKeys,
    deckIds: new Set(decks.map((d) => d.id)),
    cardIds: new Set(cards.map((c) => c.id)),
    tagIds: new Set(tags.map((t) => t.id)),
  };
}

async function rowIsValidSource(
  row: EducationalOverlayImportRow,
  ctx: Awaited<ReturnType<typeof buildExistenceContext>>,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (row.sourceKind === SK.EXAM_QUESTION) {
    if (!ctx.questionOptionsById.has(row.sourceId)) return { ok: false, reason: "exam_question not found" };
    const n = ctx.questionOptionsById.get(row.sourceId) ?? 0;
    const opt = optionsLengthMatchesCanonical(row.sourceKind, row.payload, n);
    if (!opt.ok) return { ok: false, reason: opt.reason };
    return { ok: true };
  }
  if (row.sourceKind === SK.PATHWAY_LESSON) {
    const ok = await validateLessonSource(row.sourceId, ctx.catalog, ctx.prismaLessonKeys);
    if (!ok) return { ok: false, reason: "pathway lesson not found in catalog or DB (use pathwayId:slug if ambiguous)" };
    return { ok: true };
  }
  if (row.sourceKind === SK.FLASHCARD_DECK) {
    if (!ctx.deckIds.has(row.sourceId)) return { ok: false, reason: "flashcard_deck not found" };
    return { ok: true };
  }
  if (row.sourceKind === SK.FLASHCARD) {
    if (!ctx.cardIds.has(row.sourceId)) return { ok: false, reason: "flashcard not found" };
    return { ok: true };
  }
  if (row.sourceKind === SK.FLASHCARD_TAG) {
    if (!ctx.tagIds.has(row.sourceId)) return { ok: false, reason: "flashcard_tag not found" };
    return { ok: true };
  }
  return { ok: false, reason: "unknown kind" };
}

async function runImport(cli: Cli): Promise<ImportSummary> {
  const files = loadFiles(cli);
  let allRows: EducationalOverlayImportRow[] = [];
  for (const f of files) {
    allRows = allRows.concat(parseFile(f.path, f.body));
  }

  if (cli.locale) {
    allRows = allRows.filter((r) => r.locale === cli.locale);
  }

  const deduped = new Map<string, EducationalOverlayImportRow>();
  for (const row of allRows) {
    deduped.set(`${row.sourceKind}:${row.sourceId}:${row.locale}`, row);
  }
  allRows = [...deduped.values()];

  if (allRows.length === 0) {
    console.log("No rows to import (empty file or locale filter excluded everything).");
    return {
      locale: cli.locale ?? "(none)",
      dryRun: cli.dryRun,
      processed: 0,
      wouldCreate: 0,
      wouldUpdate: 0,
      unchanged: 0,
      skippedPublishedProtected: 0,
      invalid: 0,
      missingSourceIds: [],
      outcomes: [],
    };
  }

  const outcomes: ImportSummary["outcomes"] = [];
  const missingSourceIds: string[] = [];
  let wouldCreate = 0;
  let wouldUpdate = 0;
  let unchanged = 0;
  let skippedPublishedProtected = 0;
  let invalid = 0;

  const ctx = await buildExistenceContext(allRows);

  const existing = await prisma.educationalTranslationOverlay.findMany({
    where: {
      OR: allRows.map((r) => ({
        sourceKind: r.sourceKind,
        sourceId: r.sourceId,
        locale: r.locale,
      })),
    },
  });
  const existingMap = new Map(
    existing.map((e) => [`${e.sourceKind}:${e.sourceId}:${e.locale}`, e] as const),
  );

  for (const row of allRows) {
    const key = `${row.sourceKind}:${row.sourceId}:${row.locale}`;

    const v0 = validateAndSanitizeRow(row);
    if (!v0.ok) {
      invalid++;
      outcomes.push({ action: "invalid", sourceKind: row.sourceKind, sourceId: row.sourceId, locale: row.locale, reason: v0.reason });
      continue;
    }
    const sanitized = v0.row;

    const src = await rowIsValidSource(sanitized, ctx);
    if (!src.ok) {
      invalid++;
      missingSourceIds.push(`${row.sourceKind}:${row.sourceId}`);
      outcomes.push({
        action: "invalid",
        sourceKind: row.sourceKind,
        sourceId: row.sourceId,
        locale: row.locale,
        reason: src.reason,
      });
      continue;
    }

    const cur = existingMap.get(key);
    const nextPayload = sanitized.payload as Prisma.InputJsonValue;
    const nextStatus = sanitized.status;
    const nextReviewedAt = sanitized.reviewedAt ? new Date(sanitized.reviewedAt) : null;

    if (cur) {
      const samePayload = stableStringify(cur.payload) === stableStringify(sanitized.payload);
      const sameStatus = cur.status === nextStatus;
      if (samePayload && sameStatus) {
        unchanged++;
        outcomes.push({ action: "unchanged", sourceKind: row.sourceKind, sourceId: row.sourceId, locale: row.locale });
        continue;
      }
      if (cur.status === ST.PUBLISHED && !cli.forcePublished) {
        skippedPublishedProtected++;
        outcomes.push({
          action: "skipped_published_protected",
          sourceKind: row.sourceKind,
          sourceId: row.sourceId,
          locale: row.locale,
          reason: "existing PUBLISHED row; use --force-published to overwrite",
        });
        continue;
      }
    }

    if (cli.dryRun) {
      if (cur) {
        wouldUpdate++;
        outcomes.push({ action: "would_update", sourceKind: row.sourceKind, sourceId: row.sourceId, locale: row.locale });
      } else {
        wouldCreate++;
        outcomes.push({ action: "would_create", sourceKind: row.sourceKind, sourceId: row.sourceId, locale: row.locale });
      }
      continue;
    }

    const publishedAt = nextStatus === ST.PUBLISHED ? (cur?.publishedAt ?? new Date()) : null;

    await prisma.educationalTranslationOverlay.upsert({
      where: {
        sourceKind_sourceId_locale: {
          sourceKind: sanitized.sourceKind,
          sourceId: sanitized.sourceId,
          locale: sanitized.locale,
        },
      },
      create: {
        sourceKind: sanitized.sourceKind,
        sourceId: sanitized.sourceId,
        locale: sanitized.locale,
        status: nextStatus,
        payload: nextPayload,
        reviewedAt: nextReviewedAt,
        publishedAt: nextStatus === ST.PUBLISHED ? new Date() : null,
      },
      update: {
        status: nextStatus,
        payload: nextPayload,
        reviewedAt: nextReviewedAt,
        publishedAt: nextStatus === ST.PUBLISHED ? publishedAt : null,
      },
    });

    if (cur) {
      wouldUpdate++;
      outcomes.push({ action: "would_update", sourceKind: row.sourceKind, sourceId: row.sourceId, locale: row.locale });
    } else {
      wouldCreate++;
      outcomes.push({ action: "would_create", sourceKind: row.sourceKind, sourceId: row.sourceId, locale: row.locale });
    }
  }

  const localeLabel = cli.locale ?? ([...new Set(allRows.map((r) => r.locale))].join(", ") || "(none)");

  return {
    locale: localeLabel,
    dryRun: cli.dryRun,
    processed: allRows.length,
    wouldCreate,
    wouldUpdate,
    unchanged,
    skippedPublishedProtected,
    invalid,
    missingSourceIds: [...new Set(missingSourceIds)],
    outcomes,
  };
}

function printSummary(s: ImportSummary) {
  console.log("");
  console.log("=== Educational translation overlay import ===");
  console.log(`Locale filter: ${s.locale}`);
  console.log(`Mode: ${s.dryRun ? "DRY RUN (no DB writes)" : "APPLY"}`);
  console.log(`Items processed: ${s.processed}`);
  console.log(`  created: ${s.wouldCreate}`);
  console.log(`  updated: ${s.wouldUpdate}`);
  console.log(`  unchanged (idempotent): ${s.unchanged}`);
  console.log(`  skipped (published protected): ${s.skippedPublishedProtected}`);
  console.log(`  invalid: ${s.invalid}`);
  if (s.missingSourceIds.length > 0) {
    console.log(`  missing source ids (sample): ${s.missingSourceIds.slice(0, 12).join("; ")}${s.missingSourceIds.length > 12 ? " …" : ""}`);
  }
  console.log("");
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(`
Educational overlay import (DB upsert by sourceKind + sourceId + locale).

Options:
  --file=PATH       JSON manifest or CSV (see tools/i18n/content-import/README.md)
  --dir=PATH        Import all .json and .csv files in directory
  --locale=CODE     Only rows matching this locale (e.g. fr)
  --dry-run         Report actions without writing
  --force-published Allow updating or replacing existing PUBLISHED overlays
  --help            This help

Examples:
  npm run i18n:import:content -- --file tools/i18n/content-import/samples/sample.manifest.json --dry-run
  npm run i18n:import:content -- --dir tools/i18n/content-import/inbox --locale fr
`);
    process.exit(0);
  }

  const cli = parseCli(argv);
  if (!cli.file && !cli.dir) {
    console.error("Error: pass --file=... or --dir=... (use --help)");
    process.exit(1);
  }

  const summary = await runImport(cli);
  printSummary(summary);
  if (summary.invalid > 0) process.exit(2);
}

main().catch((e) => {
  if (e instanceof PrismaClientKnownRequestError && e.code === "P2021") {
    console.error(
      "Database table missing. Apply migrations (e.g. `npx prisma migrate deploy`) so `educational_translation_overlays` exists.",
    );
    process.exit(1);
  }
  console.error(e);
  process.exit(1);
});
