#!/usr/bin/env npx tsx
/**
 * Batched, resumable import from an external "nurse nest" folder (USB or local path).
 *
 * Expected layout (all optional; missing dirs are skipped):
 *   nurse nest/
 *     lessons/           — JSON arrays or .ndjson (one object per line)
 *     questions/         — JSON arrays or .ndjson
 *     blogs/             — JSON arrays or .ndjson
 *     activities/        — JSON arrays or .ndjson (lesson quizzes + practice pools)
 *
 * Rules: max 50 rows per DB batch, streaming JSON where possible, checkpoint after each batch,
 * per-row try/catch (never abort whole run), stem/slug dedupe.
 *
 * Run from nursenest-core/:
 *   npx tsx scripts/import-nurse-nest-legacy.ts --source="/media/usb/nurse nest"
 *   npx tsx scripts/import-nurse-nest-legacy.ts --source=... --apply --only=lessons,questions
 */
import "../src/lib/db/env-bootstrap";

import * as fs from "node:fs";
import * as readline from "node:readline";
import * as path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  BlogPostStatus,
  ContentStatus,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { stemHash } from "@/lib/content/stem-hash";
import {
  NN_LESSON_DB_PAYLOAD_V2,
  sanitizeQuizItems,
  unwrapPathwayLessonDbSections,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  inferCountryFromRaw,
  inferTrackFromRaw,
  mapTrackAndCountryToExamFields,
  type ImportCountry,
  type ProductTrack,
} from "@/lib/replit-import/replit-exam-country-map";
import { streamJsonArray } from "./lib/stream-json-array";
import {
  LESSON_IMPORT_REASON_CODES,
  lessonTitleCollisionKey,
  normalizeLessonTitleForCollision,
} from "./lib/legacy-import-lesson-collision";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BATCH_MAX = 50;
const DEFAULT_CHECKPOINT = path.join(__dirname, "../data/import-checkpoints/nurse-nest-legacy.json");
const DB_PUBLISHED = "published" as const;
const PATHWAY_LESSON_LOCALE = "en";

type StreamKind = "lessons" | "questions" | "blogs" | "activities";
const STREAM_KINDS: StreamKind[] = ["lessons", "questions", "blogs", "activities"];
type Checkpoint = {
  version: 1;
  processedKeys: string[];
};

function parseArgs() {
  const argv = process.argv.slice(2);
  const get = (name: string): string | undefined => {
    const pref = `--${name}=`;
    const hit = argv.find((a) => a.startsWith(pref));
    if (hit) return hit.slice(pref.length);
    return undefined;
  };
  const source = get("source")?.trim();
  const onlyRaw = get("only");
  const onlyList = onlyRaw
    ? onlyRaw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : null;
  if (onlyList?.length) {
    const invalid = onlyList.filter((x): x is string => !STREAM_KINDS.includes(x as StreamKind));
    if (invalid.length) {
      console.error(
        JSON.stringify(
          { error: "invalid_only", allowed: STREAM_KINDS, invalid },
          null,
          2,
        ),
      );
      process.exit(1);
    }
  }
  const only = onlyList?.length ? new Set(onlyList as StreamKind[]) : null;
  const batchSizeRaw = get("batch-size");
  const parsed = batchSizeRaw !== undefined ? Number(batchSizeRaw) : BATCH_MAX;
  const batchSizeRequested = Number.isFinite(parsed) && parsed > 0 ? parsed : BATCH_MAX;
  const batchSize = Math.min(BATCH_MAX, Math.max(1, batchSizeRequested));
  const batchSizeCapped = batchSizeRequested > BATCH_MAX;
  return {
    source: source ? path.resolve(source) : "",
    apply: argv.includes("--apply"),
    batchSize,
    batchSizeRequested,
    batchSizeCapped,
    checkpointPath: get("checkpoint") ? path.resolve(get("checkpoint")!) : DEFAULT_CHECKPOINT,
    only,
    quarantineDir: get("quarantine") ? path.resolve(get("quarantine")!) : path.join(__dirname, "../data/import-quarantine/nurse-nest"),
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 110);
}

function titleHashKey(title: string): string {
  return crypto.createHash("sha256").update(title.trim().toLowerCase()).digest("hex").slice(0, 16);
}

function loadCheckpoint(p: string): Checkpoint {
  if (!fs.existsSync(p)) return { version: 1, processedKeys: [] };
  try {
    const raw = JSON.parse(fs.readFileSync(p, "utf8")) as Checkpoint;
    if (raw.version !== 1 || !Array.isArray(raw.processedKeys)) {
      return { version: 1, processedKeys: [] };
    }
    return raw;
  } catch {
    return { version: 1, processedKeys: [] };
  }
}

function saveCheckpoint(p: string, c: Checkpoint): void {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(c, null, 2));
}

function listDataFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") || f.endsWith(".ndjson"))
    .map((f) => path.join(dir, f))
    .sort();
}

async function* iterateFileRecords(file: string): AsyncGenerator<{ idx: number; row: Record<string, unknown> }, void, void> {
  if (file.endsWith(".ndjson")) {
    const rl = readline.createInterface({
      input: fs.createReadStream(file, { encoding: "utf8" }),
      crlfDelay: Infinity,
    });
    let idx = 0;
    for await (const line of rl) {
      const t = line.trim();
      if (!t) continue;
      try {
        const row = JSON.parse(t) as Record<string, unknown>;
        yield { idx, row };
      } catch {
        /* quarantine line */
      }
      idx += 1;
    }
    return;
  }
  let idx = 0;
  for await (const raw of streamJsonArray(file)) {
    if (!raw || typeof raw !== "object") continue;
    yield { idx, row: raw as Record<string, unknown> };
    idx += 1;
  }
}

function pick(row: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) {
        if (k in row) return row[k];
  }
  return undefined;
}

function asStr(v: unknown, fb = ""): string {
  if (typeof v === "string") return v;
  if (v === null || v === undefined) return fb;
  return String(v);
}

function resolvePathwayId(row: Record<string, unknown>): string | null {
  const explicit = asStr(pick(row, "pathwayId", "pathway_id")).trim();
  if (explicit) return explicit;
  const track = inferTrackFromRaw(row, "RN") as ProductTrack;
  const country = inferCountryFromRaw(row, "US") as ImportCountry;
  const map: Record<ProductTrack, { US: string; CA: string }> = {
    RN: { US: "us-rn-nclex-rn", CA: "ca-rn-nclex-rn" },
    PN: { US: "us-lpn-nclex-pn", CA: "ca-rpn-rex-pn" },
    NP: { US: "us-np-fnp", CA: "ca-np-cnple" },
    ALLIED: { US: "us-allied-core", CA: "ca-allied-core" },
  };
  const cc = country === "CA" ? "CA" : "US";
  return map[track]?.[cc] ?? null;
}

function sectionsToDbJson(
  sections: unknown,
  preTestRaw: unknown,
  postTestRaw: unknown,
): Prisma.InputJsonValue {
  const pre = sanitizeQuizItems(preTestRaw);
  const post = sanitizeQuizItems(postTestRaw);
  if (!Array.isArray(sections)) {
    return [] as Prisma.InputJsonValue;
  }
  if (!pre && !post) {
    return sections as Prisma.InputJsonValue;
  }
  return {
    [NN_LESSON_DB_PAYLOAD_V2]: true,
    sections,
    ...(pre ? { preTest: pre } : {}),
    ...(post ? { postTest: post } : {}),
  } as Prisma.InputJsonValue;
}

function difficultyToInt(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 1 && raw <= 5) return Math.round(raw);
  const s = asStr(raw).toLowerCase();
  if (s.includes("found")) return 2;
  if (s.includes("advanc")) return 4;
  if (s.includes("inter")) return 3;
  return 3;
}

function normalizeOptions(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const o of raw) {
    if (typeof o === "string") out.push(o);
    else if (o && typeof o === "object" && "text" in (o as object)) out.push(asStr((o as { text: unknown }).text));
    else if (o && typeof o === "object" && "label" in (o as object)) out.push(asStr((o as { label: unknown }).label));
  }
  return out.filter((s) => s.length > 0);
}

function correctAnswerStrings(options: string[], raw: unknown): string[] {
  if (Array.isArray(raw)) {
    const strs = raw.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
    if (strs.length) return strs;
  }
  if (typeof raw === "number" && Number.isInteger(raw) && options.length > 0) {
    const i = Math.max(0, Math.min(options.length - 1, raw));
    return [options[i]!];
  }
  return options.length ? [options[0]!] : [];
}

type Counts = {
  lessonsInserted: number;
  lessonsUpdated: number;
  lessonsSkipped: number;
  questionsInserted: number;
  questionsSkippedDup: number;
  blogsInserted: number;
  blogsUpdated: number;
  activitiesLessonMerged: number;
  activitiesPoolQuestions: number;
  errors: number;
  lessonSlugDuplicates: number;
  lessonTitleCollisionCandidates: number;
  quarantinedLessons: number;
  quarantinedQuestions: number;
  quarantinedBlogs: number;
  quarantinedActivities: number;
};

type QuarantineBucket = "lesson" | "question" | "blog" | "activity" | "none";

async function flushQuestionBatch(
  prisma: PrismaClient,
  batch: Prisma.ExamQuestionCreateInput[],
  apply: boolean,
  counts: Counts,
): Promise<void> {
  if (batch.length === 0) return;
  const hashes = [...new Set(batch.map((b) => b.stemHash).filter(Boolean) as string[])];
  const existing = await prisma.examQuestion.findMany({
    where: { stemHash: { in: hashes } },
    select: { stemHash: true },
  });
  const have = new Set(existing.map((e) => e.stemHash).filter(Boolean) as string[]);
  for (const row of batch) {
    const h = row.stemHash;
    if (!h || have.has(h)) {
      counts.questionsSkippedDup += 1;
      continue;
    }
    if (!apply) {
      counts.questionsInserted += 1;
      have.add(h);
      continue;
    }
    try {
      await prisma.examQuestion.create({ data: row });
      counts.questionsInserted += 1;
      have.add(h);
    } catch {
      counts.errors += 1;
    }
  }
}

async function main() {
  const { source, apply, batchSize, batchSizeRequested, batchSizeCapped, checkpointPath, only, quarantineDir } =
    parseArgs();
  if (!source || !fs.existsSync(source)) {
    console.error(
      JSON.stringify(
        { error: "missing_or_invalid_source", hint: 'Pass --source="/path/to/nurse nest"', source },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  if (batchSizeCapped) {
    console.error(
      JSON.stringify(
        {
          notice: "batch_size_capped",
          requested: batchSizeRequested,
          applied: batchSize,
          max: BATCH_MAX,
        },
        null,
        2,
      ),
    );
  }

  const dirs = {
    lessons: path.join(source, "lessons"),
    questions: path.join(source, "questions"),
    blogs: path.join(source, "blogs"),
    activities: path.join(source, "activities"),
  };

  fs.mkdirSync(quarantineDir, { recursive: true });
  const quarantineLog = path.join(quarantineDir, `run-${Date.now()}.log`);

  const checkpoint = loadCheckpoint(checkpointPath);
  const processed = new Set(checkpoint.processedKeys);

  const prisma = new PrismaClient();
  const counts: Counts = {
    lessonsInserted: 0,
    lessonsUpdated: 0,
    lessonsSkipped: 0,
    questionsInserted: 0,
    questionsSkippedDup: 0,
    blogsInserted: 0,
    blogsUpdated: 0,
    activitiesLessonMerged: 0,
    activitiesPoolQuestions: 0,
    errors: 0,
    lessonSlugDuplicates: 0,
    lessonTitleCollisionCandidates: 0,
    quarantinedLessons: 0,
    quarantinedQuestions: 0,
    quarantinedBlogs: 0,
    quarantinedActivities: 0,
  };

  const appendQ = (line: string, bucket: QuarantineBucket = "none") => {
    fs.appendFileSync(quarantineLog, line + "\n");
    if (bucket === "lesson") counts.quarantinedLessons += 1;
    else if (bucket === "question") counts.quarantinedQuestions += 1;
    else if (bucket === "blog") counts.quarantinedBlogs += 1;
    else if (bucket === "activity") counts.quarantinedActivities += 1;
  };

  const shouldRun = (k: StreamKind) => !only || only.has(k);

  try {
    const importTitleSlugByPathway = new Map<string, Map<string, string>>();
    const importPathwaySlugFirstKey = new Map<string, string>();
    const dbTitleSlugByPathway = new Map<string, Map<string, string>>();

    async function getDbTitleMapForPathway(pid: string): Promise<Map<string, string>> {
      let m = dbTitleSlugByPathway.get(pid);
      if (m) return m;
      const rows = await prisma.pathwayLesson.findMany({
        where: { pathwayId: pid, locale: PATHWAY_LESSON_LOCALE },
        select: { slug: true, title: true },
      });
      m = new Map<string, string>();
      for (const r of rows) {
        const tk = lessonTitleCollisionKey(normalizeLessonTitleForCollision(asStr(r.title)));
        if (!tk) continue;
        if (!m.has(tk)) m.set(tk, r.slug);
      }
      dbTitleSlugByPathway.set(pid, m);
      return m;
    }

    /* —— Lessons —— */
    if (shouldRun("lessons")) {
      const files = listDataFiles(dirs.lessons);
      let batchNum = 0;
      for (const file of files) {
        const rel = path.relative(source, file);
        let buf: Array<{ key: string; data: Prisma.PathwayLessonCreateInput }> = [];

        for await (const { idx, row } of iterateFileRecords(file)) {
          const key = `lessons:${rel}:${idx}`;
          if (processed.has(key)) continue;

          try {
            const pathwayId = resolvePathwayId(row);
            if (!pathwayId) {
              appendQ(JSON.stringify({ key, reason: "no_pathway", row }), "lesson");
              counts.errors += 1;
              processed.add(key);
              continue;
            }
            const title = asStr(pick(row, "title")).trim() || "Untitled lesson";
            const slugRaw = asStr(pick(row, "slug")).trim();
            const slug = slugRaw ? slugify(slugRaw) : slugify(`${title}-${titleHashKey(title)}`);
            const tNorm = normalizeLessonTitleForCollision(title);
            const tKey = lessonTitleCollisionKey(tNorm);
            const slugPk = `${pathwayId}::${slug}`;
            const firstKeyForSlug = importPathwaySlugFirstKey.get(slugPk);
            if (firstKeyForSlug !== undefined && firstKeyForSlug !== key) {
              counts.lessonSlugDuplicates += 1;
              appendQ(
                JSON.stringify({
                  key,
                  reason: LESSON_IMPORT_REASON_CODES.LESSON_DUPLICATE_SLUG_IMPORT_ROW,
                  pathwayId,
                  slug,
                  firstKey: firstKeyForSlug,
                }),
                "lesson",
              );
              processed.add(key);
              continue;
            }
            importPathwaySlugFirstKey.set(slugPk, key);

            let titleMap = importTitleSlugByPathway.get(pathwayId);
            if (!titleMap) {
              titleMap = new Map<string, string>();
              importTitleSlugByPathway.set(pathwayId, titleMap);
            }
            const dbTitleMap = await getDbTitleMapForPathway(pathwayId);
            const importSlugForTitle = tKey ? titleMap.get(tKey) : undefined;
            const dbSlugForTitle = tKey ? dbTitleMap.get(tKey) : undefined;
            if (
              tKey &&
              importSlugForTitle !== undefined &&
              importSlugForTitle !== slug
            ) {
              counts.lessonTitleCollisionCandidates += 1;
              appendQ(
                JSON.stringify({
                  key,
                  reason: LESSON_IMPORT_REASON_CODES.LESSON_TITLE_SLUG_COLLISION_IMPORT,
                  pathwayId,
                  slug,
                  title,
                  titleKey: tKey,
                  otherSlug: importSlugForTitle,
                }),
                "lesson",
              );
              processed.add(key);
              continue;
            }
            if (
              tKey &&
              importSlugForTitle === undefined &&
              dbSlugForTitle !== undefined &&
              dbSlugForTitle !== slug
            ) {
              counts.lessonTitleCollisionCandidates += 1;
              appendQ(
                JSON.stringify({
                  key,
                  reason: LESSON_IMPORT_REASON_CODES.LESSON_TITLE_SLUG_COLLISION_DB,
                  pathwayId,
                  slug,
                  title,
                  titleKey: tKey,
                  otherSlug: dbSlugForTitle,
                }),
                "lesson",
              );
              processed.add(key);
              continue;
            }
            if (tKey) titleMap.set(tKey, slug);

            const topic = asStr(pick(row, "topic"), "General");
            const topicSlug = slugify(asStr(pick(row, "topicSlug", "topic_slug"), topic));
            const bodySystem = asStr(pick(row, "bodySystem", "body_system"), "General");
            const sections = pick(row, "sections");
            if (!Array.isArray(sections) || sections.length === 0) {
              appendQ(JSON.stringify({ key, reason: "missing_sections", slug }), "lesson");
              counts.errors += 1;
              processed.add(key);
              continue;
            }
            const previewSectionCount = Math.max(
              1,
              Math.min(5, Number(pick(row, "previewSectionCount", "preview_section_count")) || 2),
            );
            const seoTitle = asStr(pick(row, "seoTitle", "seo_title"), `${title} | ${pathwayId}`);
            const seoDescription = asStr(
              pick(row, "seoDescription", "seo_description"),
              `${title}: imported legacy lesson.`,
            );
            const preTest = pick(row, "preTest", "pre_test");
            const postTest = pick(row, "postTest", "post_test");
            const sectionsJson = sectionsToDbJson(sections, preTest, postTest);

            const id = `${pathwayId}::${slug}::${PATHWAY_LESSON_LOCALE}`;
            const data: Prisma.PathwayLessonCreateInput = {
              id,
              pathwayId,
              slug,
              locale: PATHWAY_LESSON_LOCALE,
              title,
              topic,
              topicSlug,
              bodySystem,
              previewSectionCount,
              seoTitle,
              seoDescription,
              sections: sectionsJson,
              status: ContentStatus.PUBLISHED,
              sortOrder: 0,
            };

            buf.push({ key, data });
            if (buf.length >= batchSize) {
              batchNum += 1;
              await processLessonBuffer(prisma, buf, apply, counts);
              for (const b of buf) processed.add(b.key);
              checkpoint.processedKeys = [...processed];
              saveCheckpoint(checkpointPath, checkpoint);
              console.log(
                JSON.stringify({ phase: "lessons", batch: batchNum, file: rel, ...summarizeCounts(counts) }, null, 2),
              );
              buf = [];
            }
          } catch (e) {
            counts.errors += 1;
            appendQ(JSON.stringify({ key, err: e instanceof Error ? e.message : String(e) }), "lesson");
            processed.add(key);
          }
        }
        if (buf.length) {
          batchNum += 1;
          await processLessonBuffer(prisma, buf, apply, counts);
          for (const b of buf) processed.add(b.key);
          checkpoint.processedKeys = [...processed];
          saveCheckpoint(checkpointPath, checkpoint);
          console.log(JSON.stringify({ phase: "lessons", batch: batchNum, file: rel, ...summarizeCounts(counts) }, null, 2));
        }
      }
    }

    /* —— Questions —— */
    if (shouldRun("questions")) {
      const files = listDataFiles(dirs.questions);
      let qBatch: Prisma.ExamQuestionCreateInput[] = [];
      let batchNum = 0;
      for (const file of files) {
        const rel = path.relative(source, file);
        for await (const { idx, row } of iterateFileRecords(file)) {
          const key = `questions:${rel}:${idx}`;
          if (processed.has(key)) continue;
          try {
            const stem = asStr(pick(row, "stem", "question", "prompt")).trim();
            if (stem.length < 8) {
              processed.add(key);
              continue;
            }
            const track = inferTrackFromRaw(row, "RN");
            const country = inferCountryFromRaw(row, "US");
            const mapped = mapTrackAndCountryToExamFields(track, country);
            const options = normalizeOptions(pick(row, "options", "choices"));
            const correct = correctAnswerStrings(options, pick(row, "correctAnswer", "correct_answer", "answer"));
            const hash = stemHash(stem);
            const tags = Array.isArray(pick(row, "tags"))
              ? (pick(row, "tags") as unknown[]).filter((t): t is string => typeof t === "string")
              : [];
            const q: Prisma.ExamQuestionCreateInput = {
              stem,
              stemHash: hash,
              options: options as Prisma.InputJsonValue,
              correctAnswer: correct as Prisma.InputJsonValue,
              questionType: asStr(pick(row, "questionType", "question_type"), "multiple_choice"),
              tier: mapped.tier,
              exam: asStr(pick(row, "exam"), mapped.exam),
              status: DB_PUBLISHED,
              difficulty: difficultyToInt(pick(row, "difficulty", "difficulty_band")),
              rationale: asStr(pick(row, "rationale", "explanation"), "") || undefined,
              regionScope: mapped.regionScope,
              countryCode: mapped.countryCode ?? undefined,
              careerType: mapped.careerType,
              topic: asStr(pick(row, "topic", "category"), "") || undefined,
              tags: [...tags, "nurse-nest-import", path.basename(file)].filter(Boolean),
            };
            qBatch.push(q);
            processed.add(key);
            if (qBatch.length >= batchSize) {
              batchNum += 1;
              await flushQuestionBatch(prisma, qBatch, apply, counts);
              qBatch = [];
              checkpoint.processedKeys = [...processed];
              saveCheckpoint(checkpointPath, checkpoint);
              console.log(JSON.stringify({ phase: "questions", batch: batchNum, file: rel, ...summarizeCounts(counts) }, null, 2));
            }
          } catch (e) {
            counts.errors += 1;
            appendQ(JSON.stringify({ key, err: e instanceof Error ? e.message : String(e) }), "question");
            processed.add(key);
          }
        }
      }
      if (qBatch.length) {
        batchNum += 1;
        await flushQuestionBatch(prisma, qBatch, apply, counts);
        checkpoint.processedKeys = [...processed];
        saveCheckpoint(checkpointPath, checkpoint);
        console.log(JSON.stringify({ phase: "questions", batch: batchNum, final: true, ...summarizeCounts(counts) }, null, 2));
      }
    }

    /* —— Blogs —— */
    if (shouldRun("blogs")) {
      const files = listDataFiles(dirs.blogs);
      let buf: Array<Record<string, unknown>> = [];
      let batchNum = 0;
      for (const file of files) {
        const rel = path.relative(source, file);
        for await (const { idx, row } of iterateFileRecords(file)) {
          const key = `blogs:${rel}:${idx}`;
          if (processed.has(key)) continue;
          buf.push({ ...row, __key: key, __file: rel });
          if (buf.length >= batchSize) {
            batchNum += 1;
            const doneKeys = await processBlogBuffer(prisma, buf, apply, counts);
            for (const k of doneKeys) processed.add(k);
            checkpoint.processedKeys = [...processed];
            saveCheckpoint(checkpointPath, checkpoint);
            console.log(JSON.stringify({ phase: "blogs", batch: batchNum, file: rel, ...summarizeCounts(counts) }, null, 2));
            buf = [];
          }
        }
      }
      if (buf.length) {
        batchNum += 1;
        const doneKeys = await processBlogBuffer(prisma, buf, apply, counts);
        for (const k of doneKeys) processed.add(k);
        checkpoint.processedKeys = [...processed];
        saveCheckpoint(checkpointPath, checkpoint);
        console.log(JSON.stringify({ phase: "blogs", batch: batchNum, final: true, ...summarizeCounts(counts) }, null, 2));
      }
    }

    /* —— Activities: merge into lessons + optional pool questions —— */
    if (shouldRun("activities")) {
      const files = listDataFiles(dirs.activities);
      let batchNum = 0;
      for (const file of files) {
        const rel = path.relative(source, file);
        for await (const { idx, row } of iterateFileRecords(file)) {
          const key = `activities:${rel}:${idx}`;
          if (processed.has(key)) continue;
          try {
            const kind = asStr(pick(row, "kind", "type", "activityType"), "pool").toLowerCase();
            if (kind === "pool" || kind === "practice" || kind === "practice_pool") {
              const stem = asStr(pick(row, "stem", "question")).trim();
              if (stem.length < 8) {
                processed.add(key);
                continue;
              }
              const track = inferTrackFromRaw(row, "RN");
              const country = inferCountryFromRaw(row, "US");
              const mapped = mapTrackAndCountryToExamFields(track, country);
              const options = normalizeOptions(pick(row, "options"));
              const correct = correctAnswerStrings(options, pick(row, "correctAnswer", "correct_answer"));
              const poolStemHash = stemHash(stem);
              const q: Prisma.ExamQuestionCreateInput = {
                stem,
                stemHash: poolStemHash,
                options: options as Prisma.InputJsonValue,
                correctAnswer: correct as Prisma.InputJsonValue,
                questionType: "multiple_choice",
                tier: mapped.tier,
                exam: mapped.exam,
                status: DB_PUBLISHED,
                difficulty: difficultyToInt(pick(row, "difficulty")),
                regionScope: mapped.regionScope,
                countryCode: mapped.countryCode ?? undefined,
                careerType: mapped.careerType,
                tags: ["nurse-nest-activity-pool", path.basename(file)],
              };
              await flushQuestionBatch(prisma, [q], apply, counts);
              counts.activitiesPoolQuestions += 1;
            } else if (kind === "lesson_quiz" || kind === "lesson-quiz" || kind === "lesson") {
              const pathwayId = asStr(pick(row, "pathwayId", "pathway_id")).trim() || resolvePathwayId(row);
              const lessonSlug = slugify(asStr(pick(row, "lessonSlug", "lesson_slug", "slug")));
              const slot = asStr(pick(row, "slot"), "pre").toLowerCase();
              const items = sanitizeQuizItems(pick(row, "items", "questions"));
              if (!pathwayId || !lessonSlug || !items?.length) {
                appendQ(JSON.stringify({ key, reason: "lesson_quiz_incomplete", pathwayId, lessonSlug }), "activity");
                counts.errors += 1;
                processed.add(key);
                continue;
              }
              if (apply) {
                const rowL = await prisma.pathwayLesson.findUnique({
                  where: {
                    pathwayId_slug_locale: { pathwayId, slug: lessonSlug, locale: PATHWAY_LESSON_LOCALE },
                  },
                });
                if (!rowL) {
                  appendQ(JSON.stringify({ key, reason: "lesson_not_found", pathwayId, lessonSlug }), "activity");
                  counts.errors += 1;
                } else {
                  const u = unwrapPathwayLessonDbSections(rowL.sections);
                  const sectionArr = Array.isArray(u.sectionList) ? u.sectionList : [];
                  const basePre = u.preTest ?? [];
                  const basePost = u.postTest ?? [];
                  const nextPre = slot === "post" ? basePre : [...basePre, ...(items ?? [])];
                  const nextPost = slot === "post" ? [...basePost, ...(items ?? [])] : basePost;
                  const nextJson = sectionsToDbJson(
                    sectionArr,
                    nextPre.length ? nextPre : undefined,
                    nextPost.length ? nextPost : undefined,
                  );
                  await prisma.pathwayLesson.update({
                    where: { id: rowL.id },
                    data: { sections: nextJson },
                  });
                  counts.activitiesLessonMerged += 1;
                }
              } else {
                counts.activitiesLessonMerged += 1;
              }
            }
            processed.add(key);
          } catch (e) {
            counts.errors += 1;
            appendQ(JSON.stringify({ key, err: e instanceof Error ? e.message : String(e) }), "activity");
            processed.add(key);
          }
        }
        batchNum += 1;
        checkpoint.processedKeys = [...processed];
        saveCheckpoint(checkpointPath, checkpoint);
        console.log(JSON.stringify({ phase: "activities", batch: batchNum, file: rel, ...summarizeCounts(counts) }, null, 2));
      }
    }

    console.log(
      JSON.stringify(
        {
          phase: "complete",
          apply,
          source,
          checkpointPath,
          quarantineLog,
          batchSize: {
            requested: batchSizeRequested,
            applied: batchSize,
            cappedToMax: batchSizeCapped,
            max: BATCH_MAX,
          },
          counts,
          totals: {
            lessons: counts.lessonsInserted + counts.lessonsUpdated + counts.lessonsSkipped,
            questions: counts.questionsInserted + counts.questionsSkippedDup,
            blogs: counts.blogsInserted + counts.blogsUpdated,
            activities: counts.activitiesLessonMerged + counts.activitiesPoolQuestions,
          },
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function processLessonBuffer(
  prisma: PrismaClient,
  buf: Array<{ key: string; data: Prisma.PathwayLessonCreateInput }>,
  apply: boolean,
  counts: Counts,
): Promise<void> {
  for (const { data } of buf) {
    try {
      const existing = await prisma.pathwayLesson.findUnique({
        where: {
          pathwayId_slug_locale: {
            pathwayId: data.pathwayId as string,
            slug: data.slug as string,
            locale: PATHWAY_LESSON_LOCALE,
          },
        },
        select: { id: true, sections: true },
      });
      if (!existing) {
        if (apply) await prisma.pathwayLesson.create({ data });
        counts.lessonsInserted += 1;
        continue;
      }
      /* Skip duplicate slug: keep existing unless --force (not implemented — safe default). */
      counts.lessonsSkipped += 1;
    } catch {
      counts.errors += 1;
    }
  }
}

async function processBlogBuffer(
  prisma: PrismaClient,
  rows: Array<Record<string, unknown>>,
  apply: boolean,
  counts: Counts,
): Promise<string[]> {
  const doneKeys: string[] = [];
  for (const raw of rows) {
    const rowKey = asStr(raw.__key);
    try {
      const title = asStr(pick(raw, "title")).trim();
      const body = asStr(pick(raw, "body", "content", "content_html", "contentHtml")).trim();
      if (title.length < 2 || body.length < 10) {
        counts.errors += 1;
        continue;
      }
      const slug = slugify(asStr(pick(raw, "slug"), title));
      const excerpt = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
      const targetKeyword = asStr(pick(raw, "targetKeyword", "target_keyword", "primaryKeyword", "primary_keyword"), "") || null;
      const relatedLessonPaths = Array.isArray(pick(raw, "relatedLessonPaths", "related_lesson_paths"))
        ? (pick(raw, "relatedLessonPaths", "related_lesson_paths") as unknown[]).filter((x): x is string => typeof x === "string")
        : [];
      const relatedTools = Array.isArray(pick(raw, "relatedTools", "related_tools"))
        ? (pick(raw, "relatedTools", "related_tools") as unknown[]).filter((x): x is string => typeof x === "string")
        : [];
      const seoTitle = asStr(pick(raw, "seoTitle", "meta_title", "seo_title"), "") || null;
      const seoDescription = asStr(pick(raw, "seoDescription", "meta_description", "seo_description"), "") || null;
      const existing = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
      const payload: Prisma.BlogPostCreateInput = {
        slug,
        title,
        excerpt: excerpt || title.slice(0, 200),
        body,
        postStatus: BlogPostStatus.PUBLISHED,
        seoTitle,
        seoDescription,
        tags: ["nurse-nest-import"],
        legacySource: "nurse-nest-legacy",
        targetKeyword: targetKeyword ?? undefined,
        relatedLessonPaths,
        relatedTools,
      };
      if (existing) {
        if (apply) {
          await prisma.blogPost.update({
            where: { id: existing.id },
            data: {
              title: payload.title,
              excerpt: payload.excerpt,
              body: payload.body,
              seoTitle: payload.seoTitle,
              seoDescription: payload.seoDescription,
              targetKeyword: payload.targetKeyword,
              relatedLessonPaths: payload.relatedLessonPaths,
              relatedTools: payload.relatedTools,
              legacySource: payload.legacySource,
            },
          });
        }
        counts.blogsUpdated += 1;
      } else {
        if (apply) await prisma.blogPost.create({ data: payload });
        counts.blogsInserted += 1;
      }
      if (rowKey) doneKeys.push(rowKey);
    } catch {
      counts.errors += 1;
    }
  }
  return doneKeys;
}

function summarizeCounts(c: Counts): Record<string, number> {
  return {
    lessonsInserted: c.lessonsInserted,
    lessonsUpdated: c.lessonsUpdated,
    lessonsSkipped: c.lessonsSkipped,
    questionsInserted: c.questionsInserted,
    questionsSkippedDup: c.questionsSkippedDup,
    blogsInserted: c.blogsInserted,
    blogsUpdated: c.blogsUpdated,
    activitiesLessonMerged: c.activitiesLessonMerged,
    activitiesPoolQuestions: c.activitiesPoolQuestions,
    errors: c.errors,
    lessonSlugDuplicates: c.lessonSlugDuplicates,
    lessonTitleCollisionCandidates: c.lessonTitleCollisionCandidates,
    quarantinedLessons: c.quarantinedLessons,
    quarantinedQuestions: c.quarantinedQuestions,
    quarantinedBlogs: c.quarantinedBlogs,
    quarantinedActivities: c.quarantinedActivities,
  };
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
