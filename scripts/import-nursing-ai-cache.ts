#!/usr/bin/env npx tsx
/**
 * Nursing-only, idempotent import from Replit ai_cache JSON into Prisma `exam_questions` + `flashcards`.
 * Reuses /scripts/replit-import classification and metadata enrichment (deterministic).
 *
 * Run from nursenest-core/:
 *   npx tsx scripts/import-nursing-ai-cache.ts --file=../data/replit-exports/ai_cache.json
 *   npx tsx scripts/import-nursing-ai-cache.ts --file=... --apply
 *
 * Default is dry-run (no DB writes). Use --apply to insert. Requires DATABASE_URL.
 */
import "../src/lib/db/env-bootstrap";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ContentStatus,
  CountryCode,
  ExamFamily,
  Prisma,
  TierCode,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { loadJsonRows } from "../../scripts/replit-import/json-load";
import { resolveMonorepoRoot, scanNursingFromRows } from "./lib/scan-nursing-ai-cache";

/** Must match `content-access-scope` DB_PUBLISHED for learner-visible rows. */
const DB_PUBLISHED = "published" as const;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  const file = get("file") ?? path.join(resolveMonorepoRoot(), "data", "replit-exports", "ai_cache.json");
  const apply = argv.includes("--apply");
  const batchSize = Math.min(200, Math.max(10, parseInt(get("batch") ?? "50", 10) || 50));
  const quarantinePath =
    get("quarantine-out") ??
    path.join(path.resolve(__dirname, ".."), "nursing-import-quarantine.jsonl");
  const flashcardCountry = (get("flashcard-country")?.toUpperCase() as CountryCode | undefined) ?? CountryCode.US;
  return { file: path.resolve(file), apply, batchSize, quarantinePath, flashcardCountry };
}

function slugifyTopic(s: string): string {
  const t = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
  return t || "general";
}

function examTierStringToTierCode(tier: string): TierCode | null {
  const t = tier.trim().toLowerCase();
  if (t === "rn") return TierCode.RN;
  if (t === "rpn") return TierCode.RPN;
  if (t === "np") return TierCode.NP;
  if (t === "lvn" || t === "lvn_lpn") return TierCode.LVN_LPN;
  if (t === "allied") return null;
  return null;
}

function examStringToExamFamily(ex: string): ExamFamily {
  const e = ex.trim();
  if (/NCLEX_RN/i.test(e)) return ExamFamily.NCLEX_RN;
  if (/NCLEX_PN/i.test(e)) return ExamFamily.NCLEX_PN;
  if (/REx-PN|REX_PN|rex[-_]?pn/i.test(e)) return ExamFamily.REX_PN;
  if (/\b(AANP|ANCC)\b/i.test(e) || /^NP$/i.test(e)) return ExamFamily.NP;
  return ExamFamily.GENERIC;
}

async function ensureFlashcardCategory(
  prisma: PrismaClient,
  topicTag: string | null,
): Promise<{ id: string; slug: string }> {
  const label = (topicTag && topicTag.trim()) || "Nursing import";
  const slug = `replit-nursing-${slugifyTopic(label)}`;
  const row = await prisma.category.upsert({
    where: { slug },
    create: { name: label.slice(0, 200), slug, topicCode: slugifyTopic(label) },
    update: {},
    select: { id: true, slug: true },
  });
  return row;
}

async function main() {
  const { file, apply, batchSize, quarantinePath, flashcardCountry } = parseArgs();
  const repoRoot = resolveMonorepoRoot();
  const exportDirAbs = path.dirname(file);

  if (!fs.existsSync(file)) {
    console.error(JSON.stringify({ error: "file_not_found", file }, null, 2));
    process.exit(1);
  }

  const rows = loadJsonRows(file);
  const scanned = scanNursingFromRows(rows, {
    repoRoot,
    exportDirAbs,
    sourceFileName: path.basename(file),
  });

  const summary = {
    file,
    repoRoot,
    apply,
    topLevelRows: rows.length,
    mcq_nursing: 0,
    flashcard_nursing: 0,
    quarantine: 0,
    skipped_allied: 0,
    skipped_non_nursing_career: 0,
  };

  const mcqs = scanned.filter((s): s is Extract<typeof s, { kind: "mcq_nursing" }> => s.kind === "mcq_nursing");
  const cards = scanned.filter(
    (s): s is Extract<typeof s, { kind: "flashcard_nursing" }> => s.kind === "flashcard_nursing",
  );
  const quarantine = scanned.filter((s) => s.kind === "quarantine");
  summary.mcq_nursing = mcqs.length;
  summary.flashcard_nursing = cards.length;
  summary.quarantine = quarantine.length;
  summary.skipped_allied = scanned.filter((s) => s.kind === "skipped_allied").length;
  summary.skipped_non_nursing_career = scanned.filter((s) => s.kind === "skipped_non_nursing_career").length;

  fs.mkdirSync(path.dirname(quarantinePath), { recursive: true });
  fs.writeFileSync(
    quarantinePath,
    quarantine.length ? quarantine.map((q) => JSON.stringify(q)).join("\n") + "\n" : "",
  );

  console.log(JSON.stringify({ phase: "scan", summary, quarantineFile: quarantinePath }, null, 2));

  if (!apply) {
    console.log(JSON.stringify({ message: "Dry run only. Pass --apply to write to DATABASE_URL." }, null, 2));
    process.exit(0);
  }

  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error(JSON.stringify({ error: "DATABASE_URL missing" }, null, 2));
    process.exit(1);
  }

  const prisma = new PrismaClient();
  let importedMcq = 0;
  let skippedMcqDup = 0;
  let importedFc = 0;
  let skippedFcDup = 0;
  let errors = 0;

  try {
    for (let i = 0; i < mcqs.length; i += batchSize) {
      const chunk = mcqs.slice(i, i + batchSize);
      const hashes = [...new Set(chunk.map((c) => c.value.stemHash))];
      const existing = await prisma.examQuestion.findMany({
        where: { stemHash: { in: hashes } },
        select: { stemHash: true },
      });
      const have = new Set(existing.map((e) => e.stemHash).filter(Boolean) as string[]);

      await prisma.$transaction(async (tx) => {
        for (const row of chunk) {
          const v = row.value;
          if (have.has(v.stemHash)) {
            skippedMcqDup += 1;
            continue;
          }
          const cacheTag = row.cacheKey ? row.cacheKey.slice(0, 120) : "";
          const tags = ["replit-nursing-import", cacheTag].filter(Boolean);
          try {
            await tx.examQuestion.create({
              data: {
                tier: v.tier,
                exam: v.exam,
                questionType: v.questionType,
                status: DB_PUBLISHED,
                stem: v.stem,
                options: v.options as Prisma.InputJsonValue,
                correctAnswer: v.correctAnswer as Prisma.InputJsonValue,
                rationale: v.rationale,
                difficulty: v.difficulty,
                bodySystem: v.bodySystem,
                topic: v.topic,
                careerType: "nursing",
                regionScope: "BOTH",
                stemHash: v.stemHash,
                sourceVersion: v.sourceVersion,
                tags,
              },
            });
            have.add(v.stemHash);
            importedMcq += 1;
          } catch (e) {
            errors += 1;
            console.error(JSON.stringify({ err: "mcq_create_failed", stemHash: v.stemHash, message: String(e) }));
          }
        }
      });
    }

    const categoryCache = new Map<string, { id: string; slug: string }>();
    for (const c of cards) {
      const label = c.topicTag ?? "Nursing import";
      let cat = categoryCache.get(label);
      if (!cat) {
        cat = await ensureFlashcardCategory(prisma, c.topicTag);
        categoryCache.set(label, cat);
      }

      const tierStr =
        typeof c.merged.tier === "string" ? c.merged.tier : (c.audit.mergedTier ?? "");
      const examStr =
        typeof c.merged.exam === "string" ? c.merged.exam : (c.audit.mergedExam ?? "");
      const tierCode = examTierStringToTierCode(tierStr);
      if (!tierCode) {
        fs.appendFileSync(
          quarantinePath,
          `${JSON.stringify({ ...c, reason: "flashcard_tier_unmapped" })}\n`,
        );
        continue;
      }

      const dup = await prisma.flashcard.findFirst({
        where: {
          categoryId: cat.id,
          tier: tierCode,
          country: flashcardCountry,
          front: c.front,
          back: c.back,
        },
        select: { id: true },
      });
      if (dup) {
        skippedFcDup += 1;
        continue;
      }

      try {
        await prisma.flashcard.create({
          data: {
            front: c.front,
            back: c.back,
            country: flashcardCountry,
            tier: tierCode,
            status: ContentStatus.PUBLISHED,
            examFamily: examStringToExamFamily(examStr),
            categoryId: cat.id,
          },
        });
        importedFc += 1;
      } catch (e) {
        errors += 1;
        console.error(JSON.stringify({ err: "flashcard_create_failed", message: String(e) }));
      }
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log(
    JSON.stringify(
      {
        phase: "import_done",
        importedMcq,
        skippedMcqDup,
        importedFlashcards: importedFc,
        skippedFlashcardDup: skippedFcDup,
        errors,
        tables: ["exam_questions", "categories", "flashcards"],
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
