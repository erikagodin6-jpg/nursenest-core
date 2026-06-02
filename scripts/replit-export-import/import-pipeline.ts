import type pg from "pg";
import * as fs from "fs";
import * as path from "path";
import {
  bool,
  bumpSkip,
  contentHash,
  createStats,
  jsonb,
  listJsonFiles,
  loadJsonRows,
  num,
  optStr,
  parseTimestamp,
  rowVal,
  safeJsonForPg,
  str,
  type ImportStats,
} from "./helpers";
import { ensureResilienceTables } from "../../server/backend-resilience";
import { CATALOG_BY_FILE, type ExportFileInfo } from "./catalog";
import {
  normalizeAiCacheOutputJson,
  iterateAiCacheOutputItems,
  parseAiCacheNursingExamItem,
  buildNursingParseContext,
} from "../replit-import/nursing-ai-cache-extract";
import { buildNursingUnresolvedReviewEntry } from "../replit-import/nursing-review-artifact-shared";

function asStringArray(v: unknown): string[] | null {
  if (v === undefined || v === null) return null;
  if (Array.isArray(v)) return v.map((x) => String(x));
  if (typeof v === "string") {
    try {
      const p = JSON.parse(v);
      if (Array.isArray(p)) return p.map((x) => String(x));
    } catch {
      return [v];
    }
  }
  return null;
}

function normalizeJsonb(v: unknown, fallback: unknown): unknown {
  if (v === undefined || v === null) return fallback;
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  }
  return v;
}

export type ImportOptions = {
  apply: boolean;
  extractAiCache: boolean;
  applyKillSwitchState: boolean;
  deckOwnerFallback: string | null;
  /** When set, cap successful exam_questions inserts from ai_cache extract (default: unlimited). */
  maxExamInserts?: number;
  /** Directory containing staged JSON (used for nursing tier/exam enrichment). */
  exportDirAbs?: string;
  /** Repo root for config/nursing-export-metadata-mapping.json */
  repoRoot?: string;
  /**
   * When set, inconclusive nursing exam rows are written here (default: `<exportDirAbs>/review/nursing-import-sent-to-review.json`).
   * Pass `null` to disable writing.
   */
  nursingReviewQueueOutPath?: string | null;
  /**
   * Skip operational / audit tables from the SQL pipeline: ai_cache (raw rows), generation_jobs, generation_events.
   * ai_cache.output_json extraction to exam_questions / flashcard_bank still runs when the file exists and extractAiCache is true.
   */
  skipOperationalPipeline?: boolean;
};

async function rowExists(pool: pg.Pool, table: string, whereSql: string, params: unknown[]): Promise<boolean> {
  const r = await pool.query(`SELECT 1 FROM ${table} WHERE ${whereSql} LIMIT 1`, params);
  return r.rows.length > 0;
}

export async function importAiCache(
  pool: pg.Pool,
  rows: Record<string, unknown>[],
  opts: ImportOptions,
): Promise<ImportStats> {
  const stats = createStats("ai_cache.json", "ai_cache");
  for (const row of rows) {
    const cacheKey = str(row, "cache_key");
    const outputJson = jsonb(row, "output_json");
    if (!cacheKey || outputJson === undefined || outputJson === null) {
      bumpSkip(stats, "missing_cache_key_or_output");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      const created = parseTimestamp(rowVal(row, "created_at"));
      await pool.query(
        `INSERT INTO ai_cache (cache_key, output_json, created_at)
         VALUES ($1, $2::jsonb, COALESCE($3::timestamptz, now()))
         ON CONFLICT (cache_key) DO UPDATE SET
           output_json = EXCLUDED.output_json,
           created_at = COALESCE(EXCLUDED.created_at, ai_cache.created_at)`,
        [cacheKey, safeJsonForPg(outputJson), created],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`cache_key=${cacheKey}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return stats;
}

export async function extractFromAiCacheOutputs(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("ai_cache.json", "flashcard_bank+exam_questions");
  if (!opts.apply || !opts.extractAiCache) return stats;

  let examInsertCount = 0;
  const exportDirAbs = opts.exportDirAbs ?? process.cwd();
  const repoRoot = opts.repoRoot ?? process.cwd();
  const reviewQueue: ReturnType<typeof buildNursingUnresolvedReviewEntry>[] = [];
  const unresolvedKeys = new Set<string>();
  let rowIndex = -1;
  outer: for (const row of rows) {
    rowIndex += 1;
    const rawOut = jsonb(row, "output_json");
    const outputJson = normalizeAiCacheOutputJson(rawOut);
    if (outputJson === null || outputJson === undefined) {
      bumpSkip(stats, "missing_or_invalid_output_json");
      continue;
    }

    let outputItemIndex = -1;
    for (const item of iterateAiCacheOutputItems(outputJson)) {
      outputItemIndex += 1;
      const ctx = buildNursingParseContext(row as Record<string, unknown>, {
        exportDirAbs,
        sourceFileName: "ai_cache.json",
        rowIndex,
        outputItemIndex,
        repoRoot,
      });
      const parsed = parseAiCacheNursingExamItem(item as Record<string, unknown>, ctx);

      if (parsed.kind === "flashcard") {
        const o = item;
        const front = optStr(o, "front") ?? (typeof o.front === "string" ? o.front : null);
        const back = optStr(o, "back") ?? (typeof o.back === "string" ? o.back : null);
        if (front && back && front.length > 2 && back.length > 2) {
          const hash = contentHash(`${front}|${back}`);
          try {
            const ins = await pool.query(
              `INSERT INTO flashcard_bank (
            tier, topic_tag, career_type, front, back, tags_json, status, content_hash,
            source_type, flashcard_enabled, difficulty, region_scope, source_version
          ) VALUES (
            $1, $2, $3, $4, $5, $6::jsonb, $7, $8,
            $9, $10, $11, $12, $13
          )
          ON CONFLICT (content_hash) DO NOTHING`,
              [
                str(o, "tier", "free"),
                optStr(o, "topic_tag") ?? optStr(o, "topicTag"),
                str(o, "career_type", "nursing"),
                front,
                back,
                safeJsonForPg(normalizeJsonb(o.tags_json ?? o.tagsJson, [])),
                str(o, "status", "draft"),
                hash,
                "ai_cache_import",
                true,
                num(o, "difficulty", 3) ?? 3,
                str(o, "region_scope", "BOTH"),
                num(o, "source_version", 1) ?? 1,
              ],
            );
            if (ins.rowCount) stats.inserted += 1;
            else bumpSkip(stats, "flashcard_duplicate_content_hash");
          } catch (e) {
            bumpSkip(stats, "flashcard_insert_error");
            stats.errors.push(String(e instanceof Error ? e.message : e));
          }
        }
        continue;
      }

      if (parsed.kind === "inconclusive") {
        bumpSkip(stats, parsed.mapErrors.join(";") || "unrecognized_ai_output_shape");
        const rec = buildNursingUnresolvedReviewEntry(
          item as Record<string, unknown>,
          ctx,
          parsed.mapErrors,
          parsed.enrichment ?? null,
          "ai_cache.json",
        );
        reviewQueue.push(rec);
        unresolvedKeys.add(ctx.cacheKey ?? "__null_cache_key__");
        continue;
      }

      const v = parsed.value;
      const ex = await rowExists(pool, "exam_questions", "stem_hash = $1", [v.stemHash]);
      if (ex) {
        bumpSkip(stats, "exam_duplicate_stem_hash");
        continue;
      }
      if (opts.maxExamInserts != null && examInsertCount >= opts.maxExamInserts) {
        bumpSkip(stats, "max_exam_inserts_reached");
        break outer;
      }
      try {
        await pool.query(
          `INSERT INTO exam_questions (
            tier, exam, question_type, status, stem, options, correct_answer, rationale,
            difficulty, body_system, topic, career_type, region_scope, stem_hash, source_version
          ) VALUES (
            $1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8,
            $9, $10, $11, $12, $13, $14, $15
          )`,
          [
            v.tier,
            v.exam,
            v.questionType,
            v.status,
            v.stem,
            safeJsonForPg(v.options),
            safeJsonForPg(v.correctAnswer),
            v.rationale,
            v.difficulty,
            v.bodySystem,
            v.topic,
            v.careerType,
            v.regionScope,
            v.stemHash,
            v.sourceVersion,
          ],
        );
        examInsertCount += 1;
        stats.inserted += 1;
      } catch (e) {
        bumpSkip(stats, "exam_insert_error");
        stats.errors.push(String(e instanceof Error ? e.message : e));
      }
    }
  }

  let reviewQueuePath: string | null = null;
  const defaultReviewPath = path.join(exportDirAbs, "review", "nursing-import-sent-to-review.json");
  const outOpt = opts.nursingReviewQueueOutPath;
  const targetPath = outOpt === null ? null : outOpt ?? defaultReviewPath;
  if (targetPath && reviewQueue.length) {
    reviewQueuePath = path.resolve(targetPath);
    fs.mkdirSync(path.dirname(reviewQueuePath), { recursive: true });
    fs.writeFileSync(
      reviewQueuePath,
      JSON.stringify(
        {
          version: 1,
          kind: "nursing_import_sent_to_review_queue",
          generatedAt: new Date().toISOString(),
          exportDirAbs,
          counts: {
            sentToReview: reviewQueue.length,
            unresolvedUniqueCacheKeys: unresolvedKeys.size,
          },
          entries: reviewQueue,
        },
        null,
        2,
      ),
      "utf8",
    );
  } else if (targetPath && reviewQueue.length === 0) {
    reviewQueuePath = null;
  }

  stats.nursingAiCacheExtract = {
    examQuestionsInserted: examInsertCount,
    skippedInvalid: reviewQueue.length,
    sentToReview: reviewQueue.length,
    unresolvedUniqueCacheKeys: unresolvedKeys.size,
    reviewQueuePath: reviewQueue.length ? reviewQueuePath : null,
  };

  return stats;
}

export async function importAlliedBlueprints(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("allied_blueprints.json", "allied_blueprints");
  for (const row of rows) {
    const id = optStr(row, "id");
    if (!id) {
      bumpSkip(stats, "missing_id");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO allied_blueprints (
          id, career_type, version, domains, difficulty_distribution, cognitive_distribution,
          allowed_question_types, is_active, created_at
        ) VALUES (
          $1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb, $8, COALESCE($9::timestamptz, now())
        )
        ON CONFLICT (id) DO UPDATE SET
          career_type = EXCLUDED.career_type,
          version = EXCLUDED.version,
          domains = EXCLUDED.domains,
          difficulty_distribution = EXCLUDED.difficulty_distribution,
          cognitive_distribution = EXCLUDED.cognitive_distribution,
          allowed_question_types = EXCLUDED.allowed_question_types,
          is_active = EXCLUDED.is_active`,
        [
          id,
          str(row, "career_type"),
          num(row, "version", 1) ?? 1,
          safeJsonForPg(jsonb(row, "domains")),
          safeJsonForPg(jsonb(row, "difficulty_distribution")),
          safeJsonForPg(jsonb(row, "cognitive_distribution")),
          safeJsonForPg(jsonb(row, "allowed_question_types")),
          bool(row, "is_active", true),
          parseTimestamp(rowVal(row, "created_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importEncyclopediaEntries(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("encyclopedia_entries.json", "encyclopedia_entries");
  for (const row of rows) {
    const profession = str(row, "profession");
    const slug = str(row, "slug");
    const title = str(row, "title");
    const category = str(row, "category");
    const overview = str(row, "overview");
    if (!profession || !slug || !title || !category || !overview) {
      bumpSkip(stats, "missing_required_field");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    const id = optStr(row, "id");
    const clinicalPearls = normalizeJsonb(jsonb(row, "clinical_pearls"), []);
    const examPitfalls = normalizeJsonb(jsonb(row, "exam_pitfalls"), []);
    const faqJson = normalizeJsonb(jsonb(row, "faq_json"), []);
    try {
      await pool.query(
        `INSERT INTO encyclopedia_entries (
          id, topic_id, profession, slug, title, category,
          seo_title, seo_description, seo_keywords,
          overview, mechanism_physiology, clinical_relevance, signs_symptoms, assessment, management, complications,
          clinical_pearls, exam_pitfalls, faq_json,
          related_lesson_ids, related_question_ids, related_flashcard_ids,
          cross_profession_links, image_placeholders,
          status, published_at, created_at, updated_at
        ) VALUES (
          COALESCE($1::varchar, gen_random_uuid()::varchar), $2, $3, $4, $5, $6,
          $7, $8, $9::text[],
          $10, $11, $12, $13, $14, $15, $16,
          $17::jsonb, $18::jsonb, $19::jsonb,
          $20::text[], $21::text[], $22::text[],
          $23::jsonb, $24::jsonb,
          $25, $26::timestamptz, COALESCE($27::timestamptz, now()), COALESCE($28::timestamptz, now())
        )
        ON CONFLICT (profession, slug) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description,
          seo_keywords = EXCLUDED.seo_keywords,
          overview = EXCLUDED.overview,
          mechanism_physiology = EXCLUDED.mechanism_physiology,
          clinical_relevance = EXCLUDED.clinical_relevance,
          signs_symptoms = EXCLUDED.signs_symptoms,
          assessment = EXCLUDED.assessment,
          management = EXCLUDED.management,
          complications = EXCLUDED.complications,
          clinical_pearls = EXCLUDED.clinical_pearls,
          exam_pitfalls = EXCLUDED.exam_pitfalls,
          faq_json = EXCLUDED.faq_json,
          related_lesson_ids = EXCLUDED.related_lesson_ids,
          related_question_ids = EXCLUDED.related_question_ids,
          related_flashcard_ids = EXCLUDED.related_flashcard_ids,
          cross_profession_links = EXCLUDED.cross_profession_links,
          image_placeholders = EXCLUDED.image_placeholders,
          status = EXCLUDED.status,
          published_at = COALESCE(EXCLUDED.published_at, encyclopedia_entries.published_at),
          updated_at = now()`,
        [
          id,
          optStr(row, "topic_id"),
          profession,
          slug,
          title,
          category,
          optStr(row, "seo_title"),
          optStr(row, "seo_description"),
          asStringArray(jsonb(row, "seo_keywords")) ?? [],
          overview,
          optStr(row, "mechanism_physiology"),
          optStr(row, "clinical_relevance"),
          optStr(row, "signs_symptoms"),
          optStr(row, "assessment"),
          optStr(row, "management"),
          optStr(row, "complications"),
          safeJsonForPg(clinicalPearls),
          safeJsonForPg(examPitfalls),
          safeJsonForPg(faqJson),
          asStringArray(jsonb(row, "related_lesson_ids")) ?? [],
          asStringArray(jsonb(row, "related_question_ids")) ?? [],
          asStringArray(jsonb(row, "related_flashcard_ids")) ?? [],
          safeJsonForPg(normalizeJsonb(jsonb(row, "cross_profession_links"), [])),
          safeJsonForPg(normalizeJsonb(jsonb(row, "image_placeholders"), [])),
          str(row, "status", "published"),
          parseTimestamp(rowVal(row, "published_at")),
          parseTimestamp(rowVal(row, "created_at")),
          parseTimestamp(rowVal(row, "updated_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("there is no unique or exclusion constraint")) {
        stats.errors.push(
          "ON CONFLICT (profession, slug) failed: create unique index with: CREATE UNIQUE INDEX IF NOT EXISTS encyclopedia_entries_profession_slug ON encyclopedia_entries (profession, slug);",
        );
        bumpSkip(stats, "missing_unique_constraint");
        break;
      }
      stats.errors.push(`slug=${slug}: ${msg}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importFlashcardPreviewConfig(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("flashcard_preview_config.json", "flashcard_preview_config");
  for (const row of rows) {
    const contentType = str(row, "content_type", "flashcards");
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO flashcard_preview_config (
          id, content_type, session_limit, daily_limit, allowed_topics, allowed_tiers,
          upgrade_headline, upgrade_body, updated_at
        ) VALUES (
          COALESCE($1::varchar, gen_random_uuid()::varchar), $2, $3, $4, $5::text[], $6::text[],
          $7, $8, COALESCE($9::timestamptz, now())
        )
        ON CONFLICT (content_type) DO UPDATE SET
          session_limit = EXCLUDED.session_limit,
          daily_limit = EXCLUDED.daily_limit,
          allowed_topics = EXCLUDED.allowed_topics,
          allowed_tiers = EXCLUDED.allowed_tiers,
          upgrade_headline = EXCLUDED.upgrade_headline,
          upgrade_body = EXCLUDED.upgrade_body,
          updated_at = now()`,
        [
          optStr(row, "id"),
          contentType,
          num(row, "session_limit", 5) ?? 5,
          num(row, "daily_limit", 10) ?? 10,
          asStringArray(jsonb(row, "allowed_topics")) ?? [],
          asStringArray(jsonb(row, "allowed_tiers")) ?? [],
          str(row, "upgrade_headline", "Unlock the Full Flashcard Library"),
          str(
            row,
            "upgrade_body",
            "Get unlimited flashcards, adaptive review, weak areas mode, and saved progress with a premium plan.",
          ),
          parseTimestamp(rowVal(row, "updated_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(String(e instanceof Error ? e.message : e));
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importGenerationJobs(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("generation_jobs.json", "generation_jobs");
  for (const row of rows) {
    const id = optStr(row, "id");
    if (!id) {
      bumpSkip(stats, "missing_id");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO generation_jobs (
          id, run_date, content_type, tier, target_count, generated_count, mode,
          topic_plan_json, status, cost_estimate_json, created_at, completed_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10::jsonb,
          COALESCE($11::timestamptz, now()), $12::timestamptz
        )
        ON CONFLICT (id) DO UPDATE SET
          run_date = EXCLUDED.run_date,
          content_type = EXCLUDED.content_type,
          tier = EXCLUDED.tier,
          target_count = EXCLUDED.target_count,
          generated_count = EXCLUDED.generated_count,
          mode = EXCLUDED.mode,
          topic_plan_json = EXCLUDED.topic_plan_json,
          status = EXCLUDED.status,
          cost_estimate_json = EXCLUDED.cost_estimate_json,
          completed_at = EXCLUDED.completed_at`,
        [
          id,
          str(row, "run_date"),
          str(row, "content_type"),
          str(row, "tier"),
          num(row, "target_count", 0) ?? 0,
          num(row, "generated_count", 0) ?? 0,
          str(row, "mode"),
          safeJsonForPg(jsonb(row, "topic_plan_json") ?? []),
          str(row, "status", "queued"),
          jsonb(row, "cost_estimate_json") === undefined ? null : safeJsonForPg(jsonb(row, "cost_estimate_json")),
          parseTimestamp(rowVal(row, "created_at")),
          parseTimestamp(rowVal(row, "completed_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importGenerationEvents(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("generation_events.json", "generation_events");
  for (const row of rows) {
    const id = optStr(row, "id");
    if (!id) {
      bumpSkip(stats, "missing_id");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO generation_events (id, generation_id, event_type, payload, created_at)
         VALUES ($1, $2, $3, $4::jsonb, COALESCE($5::timestamptz, now()))
         ON CONFLICT (id) DO UPDATE SET
           generation_id = EXCLUDED.generation_id,
           event_type = EXCLUDED.event_type,
           payload = EXCLUDED.payload`,
        [
          id,
          str(row, "generation_id"),
          str(row, "event_type"),
          jsonb(row, "payload") === undefined ? null : safeJsonForPg(jsonb(row, "payload")),
          parseTimestamp(rowVal(row, "created_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importFlashcardDecks(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("flashcard_decks.json", "flashcard_decks");
  for (const row of rows) {
    let ownerId = optStr(row, "owner_id");
    if (!ownerId && opts.deckOwnerFallback) ownerId = opts.deckOwnerFallback;
    if (!ownerId) {
      bumpSkip(stats, "missing_owner_id");
      continue;
    }
    const id = optStr(row, "id");
    if (!id) {
      bumpSkip(stats, "missing_id");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO flashcard_decks (
          id, owner_id, title, description, tags, tier, visibility, slug, career_type,
          is_upgraded, upgraded_at, upgraded_limit, stripe_payment_intent_id,
          card_count, view_count, save_count, created_at, updated_at, source_version
        ) VALUES (
          $1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9,
          $10, $11::timestamptz, $12, $13,
          $14, $15, $16, COALESCE($17::timestamptz, now()), COALESCE($18::timestamptz, now()), $19
        )
        ON CONFLICT (id) DO UPDATE SET
          owner_id = EXCLUDED.owner_id,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          tags = EXCLUDED.tags,
          tier = EXCLUDED.tier,
          visibility = EXCLUDED.visibility,
          slug = EXCLUDED.slug,
          career_type = EXCLUDED.career_type,
          is_upgraded = EXCLUDED.is_upgraded,
          upgraded_at = EXCLUDED.upgraded_at,
          upgraded_limit = EXCLUDED.upgraded_limit,
          stripe_payment_intent_id = EXCLUDED.stripe_payment_intent_id,
          card_count = EXCLUDED.card_count,
          view_count = EXCLUDED.view_count,
          save_count = EXCLUDED.save_count,
          updated_at = now(),
          source_version = EXCLUDED.source_version`,
        [
          id,
          ownerId,
          str(row, "title", "Untitled deck"),
          str(row, "description", ""),
          jsonb(row, "tags") === undefined ? "[]" : safeJsonForPg(jsonb(row, "tags")),
          str(row, "tier", "free"),
          str(row, "visibility", "private"),
          optStr(row, "slug"),
          str(row, "career_type", "nursing"),
          bool(row, "is_upgraded", false),
          parseTimestamp(rowVal(row, "upgraded_at")),
          num(row, "upgraded_limit", 300),
          optStr(row, "stripe_payment_intent_id"),
          num(row, "card_count", 0) ?? 0,
          num(row, "view_count", 0) ?? 0,
          num(row, "save_count", 0) ?? 0,
          parseTimestamp(rowVal(row, "created_at")),
          parseTimestamp(rowVal(row, "updated_at")),
          num(row, "source_version", 1) ?? 1,
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importDeckFlashcards(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("deck_flashcards.json", "deck_flashcards");
  for (const row of rows) {
    const id = optStr(row, "id");
    const deckId = str(row, "deck_id");
    const front = str(row, "front");
    const back = str(row, "back");
    if (!id || !deckId || !front || !back) {
      bumpSkip(stats, "missing_required");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO deck_flashcards (
          id, deck_id, front, back, rationale, clinical_pearl, tags, difficulty,
          ai_check_status, ai_check_summary, ai_check_confidence, user_override, sort_order,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7::jsonb, $8,
          $9, $10, $11, $12, $13,
          COALESCE($14::timestamptz, now()), COALESCE($15::timestamptz, now())
        )
        ON CONFLICT (id) DO UPDATE SET
          deck_id = EXCLUDED.deck_id,
          front = EXCLUDED.front,
          back = EXCLUDED.back,
          rationale = EXCLUDED.rationale,
          clinical_pearl = EXCLUDED.clinical_pearl,
          tags = EXCLUDED.tags,
          difficulty = EXCLUDED.difficulty,
          sort_order = EXCLUDED.sort_order,
          updated_at = now()`,
        [
          id,
          deckId,
          front,
          back,
          optStr(row, "rationale"),
          optStr(row, "clinical_pearl"),
          jsonb(row, "tags") === undefined ? "[]" : safeJsonForPg(jsonb(row, "tags")),
          str(row, "difficulty", "medium"),
          str(row, "ai_check_status", "unknown"),
          optStr(row, "ai_check_summary"),
          num(row, "ai_check_confidence", null),
          bool(row, "user_override", false),
          num(row, "sort_order", 0) ?? 0,
          parseTimestamp(rowVal(row, "created_at")),
          parseTimestamp(rowVal(row, "updated_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importImagingQuestions(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("imaging_questions.json", "imaging_questions");
  for (const row of rows) {
    const id = optStr(row, "id");
    const question = str(row, "question");
    if (!id || !question) {
      bumpSkip(stats, "missing_id_or_question");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO imaging_questions (
          id, question, option_a, option_b, option_c, option_d, correct_answer, rationale,
          modality, body_part, category, difficulty, exam, country, topic, status,
          exam_domain, mastery_category, clinical_pearls, imaging_practice_notes,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20,
          COALESCE($21::timestamptz, now()), COALESCE($22::timestamptz, now())
        )
        ON CONFLICT (id) DO UPDATE SET
          question = EXCLUDED.question,
          option_a = EXCLUDED.option_a,
          option_b = EXCLUDED.option_b,
          option_c = EXCLUDED.option_c,
          option_d = EXCLUDED.option_d,
          correct_answer = EXCLUDED.correct_answer,
          rationale = EXCLUDED.rationale,
          modality = EXCLUDED.modality,
          body_part = EXCLUDED.body_part,
          category = EXCLUDED.category,
          difficulty = EXCLUDED.difficulty,
          exam = EXCLUDED.exam,
          country = EXCLUDED.country,
          topic = EXCLUDED.topic,
          status = EXCLUDED.status,
          exam_domain = EXCLUDED.exam_domain,
          mastery_category = EXCLUDED.mastery_category,
          clinical_pearls = EXCLUDED.clinical_pearls,
          imaging_practice_notes = EXCLUDED.imaging_practice_notes,
          updated_at = now()`,
        [
          id,
          question,
          str(row, "option_a"),
          str(row, "option_b"),
          str(row, "option_c"),
          str(row, "option_d"),
          str(row, "correct_answer", "A").slice(0, 1),
          str(row, "rationale", ""),
          optStr(row, "modality"),
          optStr(row, "body_part"),
          optStr(row, "category"),
          num(row, "difficulty", 2) ?? 2,
          optStr(row, "exam"),
          optStr(row, "country"),
          optStr(row, "topic"),
          str(row, "status", "draft"),
          optStr(row, "exam_domain"),
          optStr(row, "mastery_category"),
          optStr(row, "clinical_pearls"),
          optStr(row, "imaging_practice_notes"),
          parseTimestamp(rowVal(row, "created_at")),
          parseTimestamp(rowVal(row, "updated_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importImagingFlashcards(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("imaging_flashcards.json", "imaging_flashcards");
  for (const row of rows) {
    const id = optStr(row, "id");
    const front = str(row, "front");
    const back = str(row, "back");
    if (!id || !front || !back) {
      bumpSkip(stats, "missing_required");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO imaging_flashcards (
          id, front, back, modality, body_part, category, country, exam_type, topic,
          difficulty, image_url, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
          COALESCE($13::timestamptz, now()), COALESCE($14::timestamptz, now())
        )
        ON CONFLICT (id) DO UPDATE SET
          front = EXCLUDED.front,
          back = EXCLUDED.back,
          modality = EXCLUDED.modality,
          body_part = EXCLUDED.body_part,
          category = EXCLUDED.category,
          country = EXCLUDED.country,
          exam_type = EXCLUDED.exam_type,
          topic = EXCLUDED.topic,
          difficulty = EXCLUDED.difficulty,
          image_url = EXCLUDED.image_url,
          status = EXCLUDED.status,
          updated_at = now()`,
        [
          id,
          front,
          back,
          optStr(row, "modality"),
          optStr(row, "body_part"),
          optStr(row, "category"),
          str(row, "country", "both"),
          optStr(row, "exam_type"),
          optStr(row, "topic"),
          num(row, "difficulty", 2) ?? 2,
          optStr(row, "image_url"),
          str(row, "status", "draft"),
          parseTimestamp(rowVal(row, "created_at")),
          parseTimestamp(rowVal(row, "updated_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importImagingPositioning(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("imaging_positioning_entries.json", "imaging_positioning_entries");
  for (const row of rows) {
    const id = optStr(row, "id");
    if (!id) {
      bumpSkip(stats, "missing_id");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO imaging_positioning_entries (
          id, slug, projection_name, body_part, body_region, country, exam_relevance,
          patient_position, body_part_position, central_ray, central_ray_direction,
          film_size, sid, detector_placement, collimation_guidance, breathing_instructions,
          technical_factors, anatomy_demonstrated, common_errors, evaluation_criteria,
          clinical_notes, tips, exam_tips, image_url, teaching_image_url, exam_image_url,
          positioning_diagram_url, incorrect_image_url, positioning_errors, quiz_questions,
          label_overlays, learning_steps, seo_title, seo_description, status,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14, $15, $16,
          $17, $18, $19::jsonb, $20,
          $21, $22, $23, $24, $25, $26,
          $27, $28, $29::jsonb, $30::jsonb,
          $31::jsonb, $32::jsonb, $33, $34, $35,
          COALESCE($36::timestamptz, now()), COALESCE($37::timestamptz, now())
        )
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          projection_name = EXCLUDED.projection_name,
          body_part = EXCLUDED.body_part,
          body_region = EXCLUDED.body_region,
          country = EXCLUDED.country,
          exam_relevance = EXCLUDED.exam_relevance,
          patient_position = EXCLUDED.patient_position,
          body_part_position = EXCLUDED.body_part_position,
          central_ray = EXCLUDED.central_ray,
          central_ray_direction = EXCLUDED.central_ray_direction,
          film_size = EXCLUDED.film_size,
          sid = EXCLUDED.sid,
          detector_placement = EXCLUDED.detector_placement,
          collimation_guidance = EXCLUDED.collimation_guidance,
          breathing_instructions = EXCLUDED.breathing_instructions,
          technical_factors = EXCLUDED.technical_factors,
          anatomy_demonstrated = EXCLUDED.anatomy_demonstrated,
          common_errors = EXCLUDED.common_errors,
          evaluation_criteria = EXCLUDED.evaluation_criteria,
          clinical_notes = EXCLUDED.clinical_notes,
          tips = EXCLUDED.tips,
          exam_tips = EXCLUDED.exam_tips,
          image_url = EXCLUDED.image_url,
          teaching_image_url = EXCLUDED.teaching_image_url,
          exam_image_url = EXCLUDED.exam_image_url,
          positioning_diagram_url = EXCLUDED.positioning_diagram_url,
          incorrect_image_url = EXCLUDED.incorrect_image_url,
          positioning_errors = EXCLUDED.positioning_errors,
          quiz_questions = EXCLUDED.quiz_questions,
          label_overlays = EXCLUDED.label_overlays,
          learning_steps = EXCLUDED.learning_steps,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description,
          status = EXCLUDED.status,
          updated_at = now()`,
        [
          id,
          str(row, "slug", ""),
          str(row, "projection_name"),
          str(row, "body_part"),
          str(row, "body_region", ""),
          str(row, "country", "canada"),
          str(row, "exam_relevance", "medium"),
          str(row, "patient_position"),
          optStr(row, "body_part_position"),
          str(row, "central_ray"),
          optStr(row, "central_ray_direction"),
          optStr(row, "film_size"),
          optStr(row, "sid"),
          optStr(row, "detector_placement"),
          optStr(row, "collimation_guidance"),
          optStr(row, "breathing_instructions"),
          optStr(row, "technical_factors"),
          optStr(row, "anatomy_demonstrated"),
          safeJsonForPg(normalizeJsonb(jsonb(row, "common_errors"), [])),
          optStr(row, "evaluation_criteria"),
          optStr(row, "clinical_notes"),
          optStr(row, "tips"),
          optStr(row, "exam_tips"),
          optStr(row, "image_url"),
          optStr(row, "teaching_image_url"),
          optStr(row, "exam_image_url"),
          optStr(row, "positioning_diagram_url"),
          optStr(row, "incorrect_image_url"),
          safeJsonForPg(normalizeJsonb(jsonb(row, "positioning_errors"), [])),
          safeJsonForPg(normalizeJsonb(jsonb(row, "quiz_questions"), [])),
          safeJsonForPg(normalizeJsonb(jsonb(row, "label_overlays"), [])),
          safeJsonForPg(normalizeJsonb(jsonb(row, "learning_steps"), [])),
          optStr(row, "seo_title"),
          optStr(row, "seo_description"),
          str(row, "status", "draft"),
          parseTimestamp(rowVal(row, "created_at")),
          parseTimestamp(rowVal(row, "updated_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importImagingPhysicsTopics(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("imaging_physics_topics.json", "imaging_physics_topics");
  for (const row of rows) {
    const id = optStr(row, "id");
    const title = str(row, "title");
    const content = str(row, "content");
    if (!id || !title || !content) {
      bumpSkip(stats, "missing_required");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO imaging_physics_topics (
          id, title, slug, content, explanation, category, modality, country, exam_type,
          key_concepts, formulas, exam_traps, memory_aid, clinical_relevance,
          factor_relationships, diagram_config, quiz_items, difficulty, sort_order, status,
          seo_title, seo_description, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10::text[], $11::jsonb, $12::jsonb, $13, $14,
          $15::jsonb, $16::jsonb, $17::jsonb, $18, $19, $20,
          $21, $22, COALESCE($23::timestamptz, now()), COALESCE($24::timestamptz, now())
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          content = EXCLUDED.content,
          explanation = EXCLUDED.explanation,
          category = EXCLUDED.category,
          modality = EXCLUDED.modality,
          country = EXCLUDED.country,
          exam_type = EXCLUDED.exam_type,
          key_concepts = EXCLUDED.key_concepts,
          formulas = EXCLUDED.formulas,
          exam_traps = EXCLUDED.exam_traps,
          memory_aid = EXCLUDED.memory_aid,
          clinical_relevance = EXCLUDED.clinical_relevance,
          factor_relationships = EXCLUDED.factor_relationships,
          diagram_config = EXCLUDED.diagram_config,
          quiz_items = EXCLUDED.quiz_items,
          difficulty = EXCLUDED.difficulty,
          sort_order = EXCLUDED.sort_order,
          status = EXCLUDED.status,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description,
          updated_at = now()`,
        [
          id,
          title,
          str(row, "slug", ""),
          content,
          optStr(row, "explanation"),
          optStr(row, "category"),
          optStr(row, "modality"),
          str(row, "country", "both"),
          optStr(row, "exam_type"),
          asStringArray(jsonb(row, "key_concepts")) ?? [],
          safeJsonForPg(normalizeJsonb(jsonb(row, "formulas"), [])),
          safeJsonForPg(normalizeJsonb(jsonb(row, "exam_traps"), [])),
          optStr(row, "memory_aid"),
          optStr(row, "clinical_relevance"),
          safeJsonForPg(normalizeJsonb(jsonb(row, "factor_relationships"), [])),
          safeJsonForPg(normalizeJsonb(jsonb(row, "diagram_config"), {})),
          safeJsonForPg(normalizeJsonb(jsonb(row, "quiz_items"), [])),
          num(row, "difficulty", 2) ?? 2,
          num(row, "sort_order", 0) ?? 0,
          str(row, "status", "draft"),
          optStr(row, "seo_title"),
          optStr(row, "seo_description"),
          parseTimestamp(rowVal(row, "created_at")),
          parseTimestamp(rowVal(row, "updated_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importImagingBlogArticles(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("imaging_blog_articles.json", "imaging_blog_articles");
  for (const row of rows) {
    const slug = str(row, "slug");
    const country = str(row, "country");
    const articleType = str(row, "article_type");
    const title = str(row, "title");
    if (!slug || !country || !articleType || !title) {
      bumpSkip(stats, "missing_required");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO imaging_blog_articles (
          id, slug, country, article_type, category, title, meta_title, meta_description, summary, content_html,
          tags, primary_keyword, secondary_keywords, related_seo_page_slugs, related_article_slugs,
          schema_markup_json, read_time_minutes, status, published_at, updated_at, last_reviewed_at, next_review_at,
          created_at
        ) VALUES (
          COALESCE($1::varchar, gen_random_uuid()::varchar), $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11::text[], $12, $13::text[], $14::text[], $15::text[],
          $16::jsonb, $17, $18, $19::timestamptz, COALESCE($20::timestamptz, now()), $21::timestamptz, $22::timestamptz,
          COALESCE($23::timestamptz, now())
        )
        ON CONFLICT (slug) DO UPDATE SET
          country = EXCLUDED.country,
          article_type = EXCLUDED.article_type,
          category = EXCLUDED.category,
          title = EXCLUDED.title,
          meta_title = EXCLUDED.meta_title,
          meta_description = EXCLUDED.meta_description,
          summary = EXCLUDED.summary,
          content_html = EXCLUDED.content_html,
          tags = EXCLUDED.tags,
          primary_keyword = EXCLUDED.primary_keyword,
          secondary_keywords = EXCLUDED.secondary_keywords,
          related_seo_page_slugs = EXCLUDED.related_seo_page_slugs,
          related_article_slugs = EXCLUDED.related_article_slugs,
          schema_markup_json = EXCLUDED.schema_markup_json,
          read_time_minutes = EXCLUDED.read_time_minutes,
          status = EXCLUDED.status,
          published_at = EXCLUDED.published_at,
          last_reviewed_at = EXCLUDED.last_reviewed_at,
          next_review_at = EXCLUDED.next_review_at,
          updated_at = now()`,
        [
          optStr(row, "id"),
          slug,
          country,
          articleType,
          optStr(row, "category"),
          title,
          optStr(row, "meta_title"),
          optStr(row, "meta_description"),
          optStr(row, "summary"),
          optStr(row, "content_html"),
          asStringArray(jsonb(row, "tags")) ?? [],
          optStr(row, "primary_keyword"),
          asStringArray(jsonb(row, "secondary_keywords")) ?? [],
          asStringArray(jsonb(row, "related_seo_page_slugs")) ?? [],
          asStringArray(jsonb(row, "related_article_slugs")) ?? [],
          jsonb(row, "schema_markup_json") === undefined ? null : safeJsonForPg(jsonb(row, "schema_markup_json")),
          num(row, "read_time_minutes", 5) ?? 5,
          str(row, "status", "draft"),
          parseTimestamp(rowVal(row, "published_at")),
          parseTimestamp(rowVal(row, "updated_at")),
          parseTimestamp(rowVal(row, "last_reviewed_at")),
          parseTimestamp(rowVal(row, "next_review_at")),
          parseTimestamp(rowVal(row, "created_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`slug=${slug}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importImagingSeoPages(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("imaging_seo_pages.json", "imaging_seo_pages");
  for (const row of rows) {
    const slug = str(row, "slug");
    const country = str(row, "country");
    const pageType = str(row, "page_type");
    const title = str(row, "title");
    if (!slug || !country || !pageType || !title) {
      bumpSkip(stats, "missing_required");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO imaging_seo_pages (
          id, slug, country, page_type, topic, subtopic, exam_type, title,
          meta_title, meta_description, intro_html, content_html, faq_json, internal_links_json,
          cta_json, sample_questions_json, tags, primary_keyword, secondary_keywords, schema_markup_json,
          status, published_at, updated_at, last_reviewed_at, next_review_at, created_at
        ) VALUES (
          COALESCE($1::varchar, gen_random_uuid()::varchar), $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13::jsonb, $14::jsonb,
          $15::jsonb, $16::jsonb, $17::text[], $18, $19::text[], $20::jsonb,
          $21, $22::timestamptz, COALESCE($23::timestamptz, now()), $24::timestamptz, $25::timestamptz, COALESCE($26::timestamptz, now())
        )
        ON CONFLICT (slug) DO UPDATE SET
          country = EXCLUDED.country,
          page_type = EXCLUDED.page_type,
          topic = EXCLUDED.topic,
          subtopic = EXCLUDED.subtopic,
          exam_type = EXCLUDED.exam_type,
          title = EXCLUDED.title,
          meta_title = EXCLUDED.meta_title,
          meta_description = EXCLUDED.meta_description,
          intro_html = EXCLUDED.intro_html,
          content_html = EXCLUDED.content_html,
          faq_json = EXCLUDED.faq_json,
          internal_links_json = EXCLUDED.internal_links_json,
          cta_json = EXCLUDED.cta_json,
          sample_questions_json = EXCLUDED.sample_questions_json,
          tags = EXCLUDED.tags,
          primary_keyword = EXCLUDED.primary_keyword,
          secondary_keywords = EXCLUDED.secondary_keywords,
          schema_markup_json = EXCLUDED.schema_markup_json,
          status = EXCLUDED.status,
          published_at = EXCLUDED.published_at,
          last_reviewed_at = EXCLUDED.last_reviewed_at,
          next_review_at = EXCLUDED.next_review_at,
          updated_at = now()`,
        [
          optStr(row, "id"),
          slug,
          country,
          pageType,
          optStr(row, "topic"),
          optStr(row, "subtopic"),
          optStr(row, "exam_type"),
          title,
          optStr(row, "meta_title"),
          optStr(row, "meta_description"),
          optStr(row, "intro_html"),
          optStr(row, "content_html"),
          safeJsonForPg(normalizeJsonb(jsonb(row, "faq_json"), [])),
          safeJsonForPg(normalizeJsonb(jsonb(row, "internal_links_json"), [])),
          safeJsonForPg(normalizeJsonb(jsonb(row, "cta_json"), {})),
          safeJsonForPg(normalizeJsonb(jsonb(row, "sample_questions_json"), [])),
          asStringArray(jsonb(row, "tags")) ?? [],
          optStr(row, "primary_keyword"),
          asStringArray(jsonb(row, "secondary_keywords")) ?? [],
          jsonb(row, "schema_markup_json") === undefined ? null : safeJsonForPg(jsonb(row, "schema_markup_json")),
          str(row, "status", "draft"),
          parseTimestamp(rowVal(row, "published_at")),
          parseTimestamp(rowVal(row, "updated_at")),
          parseTimestamp(rowVal(row, "last_reviewed_at")),
          parseTimestamp(rowVal(row, "next_review_at")),
          parseTimestamp(rowVal(row, "created_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`slug=${slug}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importLessonImages(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("lesson_images.json", "lesson_images");
  for (const row of rows) {
    const lessonId = str(row, "lesson_id");
    const objectPath = str(row, "object_path");
    const fileName = str(row, "file_name");
    if (!lessonId || !objectPath || !fileName) {
      bumpSkip(stats, "missing_required");
      continue;
    }
    const id = optStr(row, "id");
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      if (id) {
        await pool.query(
          `INSERT INTO lesson_images (
            id, lesson_id, object_path, file_name, section, caption, position, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, COALESCE($8::timestamptz, now())
          )
          ON CONFLICT (id) DO UPDATE SET
            lesson_id = EXCLUDED.lesson_id,
            object_path = EXCLUDED.object_path,
            file_name = EXCLUDED.file_name,
            section = EXCLUDED.section,
            caption = EXCLUDED.caption,
            position = EXCLUDED.position`,
          [
            id,
            lessonId,
            objectPath,
            fileName,
            str(row, "section", "general"),
            optStr(row, "caption"),
            num(row, "position", 0) ?? 0,
            parseTimestamp(rowVal(row, "created_at")),
          ],
        );
      } else {
        await pool.query(
          `INSERT INTO lesson_images (
            lesson_id, object_path, file_name, section, caption, position, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, COALESCE($7::timestamptz, now())
          )`,
          [
            lessonId,
            objectPath,
            fileName,
            str(row, "section", "general"),
            optStr(row, "caption"),
            num(row, "position", 0) ?? 0,
            parseTimestamp(rowVal(row, "created_at")),
          ],
        );
      }
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`${lessonId}/${fileName}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importLessonOverrides(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("lesson_overrides.json", "lesson_overrides");
  for (const row of rows) {
    const lessonId = str(row, "lesson_id");
    if (!lessonId) {
      bumpSkip(stats, "missing_lesson_id");
      continue;
    }
    const overrides = jsonb(row, "overrides");
    if (overrides === undefined || overrides === null) {
      bumpSkip(stats, "missing_overrides");
      continue;
    }
    if (!opts.apply) {
      stats.inserted += 1;
      continue;
    }
    try {
      await pool.query(
        `INSERT INTO lesson_overrides (lesson_id, overrides, updated_at)
         VALUES ($1, $2::jsonb, COALESCE($3::timestamptz, now()))
         ON CONFLICT (lesson_id) DO UPDATE SET
           overrides = EXCLUDED.overrides,
           updated_at = now()`,
        [lessonId, safeJsonForPg(overrides), parseTimestamp(rowVal(row, "updated_at"))],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`lesson_id=${lessonId}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export async function importKillSwitches(pool: pg.Pool, rows: Record<string, unknown>[], opts: ImportOptions): Promise<ImportStats> {
  const stats = createStats("kill_switches.json", "kill_switches");
  if (!opts.apply) {
    for (const row of rows) {
      const featureKey = str(row, "feature_key");
      if (!featureKey) {
        bumpSkip(stats, "missing_feature_key");
        continue;
      }
      stats.inserted += 1;
    }
    return stats;
  }

  await ensureResilienceTables();
  for (const row of rows) {
    const featureKey = str(row, "feature_key");
    if (!featureKey) {
      bumpSkip(stats, "missing_feature_key");
      continue;
    }
    const exportedEnabled = bool(row, "enabled", false);
    const enabled = opts.applyKillSwitchState ? exportedEnabled : false;
    try {
      await pool.query(
        `INSERT INTO kill_switches (
          id, feature_key, enabled, scope, affected_ids, affected_locales,
          reason, activated_by, activated_by_username, activated_at, deactivated_at, created_at, updated_at
        ) VALUES (
          COALESCE($1::varchar, gen_random_uuid()::varchar), $2, $3, $4, $5::text[], $6::text[],
          $7, $8, $9, $10::timestamptz, $11::timestamptz, COALESCE($12::timestamptz, now()), now()
        )
        ON CONFLICT (feature_key) DO UPDATE SET
          enabled = EXCLUDED.enabled,
          scope = EXCLUDED.scope,
          affected_ids = EXCLUDED.affected_ids,
          affected_locales = EXCLUDED.affected_locales,
          reason = EXCLUDED.reason,
          activated_by = EXCLUDED.activated_by,
          activated_by_username = EXCLUDED.activated_by_username,
          activated_at = EXCLUDED.activated_at,
          deactivated_at = EXCLUDED.deactivated_at,
          updated_at = now()`,
        [
          optStr(row, "id"),
          featureKey,
          enabled,
          str(row, "scope", "global"),
          asStringArray(jsonb(row, "affected_ids")) ?? [],
          asStringArray(jsonb(row, "affected_locales")) ?? [],
          optStr(row, "reason"),
          optStr(row, "activated_by"),
          optStr(row, "activated_by_username"),
          parseTimestamp(rowVal(row, "activated_at")),
          parseTimestamp(rowVal(row, "deactivated_at")),
          parseTimestamp(rowVal(row, "created_at")),
        ],
      );
      stats.updated += 1;
    } catch (e) {
      stats.errors.push(`feature_key=${featureKey}: ${e instanceof Error ? e.message : String(e)}`);
      bumpSkip(stats, "insert_error");
    }
  }
  return stats;
}

export type PipelineResult = {
  inventory: { dir: string; files: { name: string; rows: number; catalog?: ExportFileInfo }[] };
  stats: ImportStats[];
  options: ImportOptions;
};

export async function runImportPipeline(
  pool: pg.Pool,
  dir: string,
  opts: ImportOptions,
): Promise<PipelineResult> {
  const files = listJsonFiles(dir);
  const inventory = {
    dir,
    files: files.map((fp) => {
      const name = path.basename(fp);
      const rows = fs.existsSync(fp) ? loadJsonRows(fp).length : 0;
      return { name, rows, catalog: CATALOG_BY_FILE.get(name) };
    }),
  };

  const stats: ImportStats[] = [];
  const read = (fn: string) => {
    const p = path.join(dir, fn);
    if (!fs.existsSync(p)) return [] as Record<string, unknown>[];
    return loadJsonRows(p);
  };

  const allSteps: [string, () => Promise<ImportStats>][] = [
    ["allied_blueprints.json", () => importAlliedBlueprints(pool, read("allied_blueprints.json"), opts)],
    ["ai_cache.json", () => importAiCache(pool, read("ai_cache.json"), opts)],
    ["generation_jobs.json", () => importGenerationJobs(pool, read("generation_jobs.json"), opts)],
    ["generation_events.json", () => importGenerationEvents(pool, read("generation_events.json"), opts)],
    ["flashcard_preview_config.json", () => importFlashcardPreviewConfig(pool, read("flashcard_preview_config.json"), opts)],
    ["encyclopedia_entries.json", () => importEncyclopediaEntries(pool, read("encyclopedia_entries.json"), opts)],
    ["imaging_questions.json", () => importImagingQuestions(pool, read("imaging_questions.json"), opts)],
    ["imaging_flashcards.json", () => importImagingFlashcards(pool, read("imaging_flashcards.json"), opts)],
    ["imaging_positioning_entries.json", () => importImagingPositioning(pool, read("imaging_positioning_entries.json"), opts)],
    ["imaging_physics_topics.json", () => importImagingPhysicsTopics(pool, read("imaging_physics_topics.json"), opts)],
    ["imaging_blog_articles.json", () => importImagingBlogArticles(pool, read("imaging_blog_articles.json"), opts)],
    ["imaging_seo_pages.json", () => importImagingSeoPages(pool, read("imaging_seo_pages.json"), opts)],
    ["lesson_overrides.json", () => importLessonOverrides(pool, read("lesson_overrides.json"), opts)],
    ["lesson_images.json", () => importLessonImages(pool, read("lesson_images.json"), opts)],
    ["flashcard_decks.json", () => importFlashcardDecks(pool, read("flashcard_decks.json"), opts)],
    ["deck_flashcards.json", () => importDeckFlashcards(pool, read("deck_flashcards.json"), opts)],
    ["kill_switches.json", () => importKillSwitches(pool, read("kill_switches.json"), opts)],
  ];

  const skipOps = Boolean(opts.skipOperationalPipeline);
  const operationalFiles = new Set(["ai_cache.json", "generation_jobs.json", "generation_events.json"]);
  const order = allSteps.filter(([name]) => !skipOps || !operationalFiles.has(name));

  for (const [, fn] of order) {
    stats.push(await fn());
  }

  if (read("ai_cache.json").length && opts.extractAiCache) {
    stats.push(
      await extractFromAiCacheOutputs(pool, read("ai_cache.json"), {
        ...opts,
        exportDirAbs: dir,
        repoRoot: process.cwd(),
      }),
    );
  }

  return { inventory, stats, options: opts };
}
