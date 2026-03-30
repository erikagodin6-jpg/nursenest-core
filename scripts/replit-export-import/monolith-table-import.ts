/**
 * Replit JSON exports → legacy Drizzle / monolith Postgres tables (exam_questions, flashcard_bank,
 * content_translations, digital_products, pricing_plans, generated_questions). Idempotent upserts; no truncates.
 */
import type pg from "pg";
import * as path from "path";
import {
  bumpSkip,
  createStats,
  jsonb,
  loadJsonRows,
  optStr,
  parseTimestamp,
  rowVal,
  safeJsonForPg,
  str,
  type ImportStats,
} from "./helpers";

function numOrNull(row: Record<string, unknown>, key: string): number | null {
  const v = rowVal(row, key);
  if (v === undefined || v === null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function boolOr(row: Record<string, unknown>, key: string, fallback: boolean): boolean {
  const v = rowVal(row, key);
  if (v === undefined || v === null) return fallback;
  if (typeof v === "boolean") return v;
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return fallback;
}

/** Upsert content_translations on natural key (content_type, content_id, field_name, language_code). */
export async function importContentTranslations(
  pool: pg.Pool,
  filePath: string,
  apply: boolean,
): Promise<ImportStats> {
  const stats = createStats(path.basename(filePath), "content_translations");
  const rows = loadJsonRows(filePath);
  if (!apply) {
    stats.inserted = rows.length;
    return stats;
  }
  for (const row of rows) {
    const contentType = str(row, "content_type");
    const contentId = str(row, "content_id");
    const languageCode = str(row, "language_code");
    const fieldName = str(row, "field_name");
    const translatedText = str(row, "translated_text");
    if (!contentType || !contentId || !languageCode || !fieldName || !translatedText) {
      bumpSkip(stats, "missing_required_field");
      continue;
    }
    const id = optStr(row, "id");
    const translationStatus = str(row, "translation_status", "auto");
    const sourceHash = optStr(row, "source_hash");
    const sourceRef = parseTimestamp(rowVal(row, "source_last_updated_reference"));
    const lastUpdated = parseTimestamp(rowVal(row, "last_updated"));
    try {
      await pool.query(
        `INSERT INTO content_translations (
          id, content_type, content_id, language_code, field_name, translated_text,
          translation_status, source_hash, source_last_updated_reference, last_updated
        ) VALUES (
          COALESCE($1::varchar, gen_random_uuid()::varchar), $2, $3, $4, $5, $6,
          $7, $8, $9::timestamptz, COALESCE($10::timestamptz, now())
        )
        ON CONFLICT (content_type, content_id, field_name, language_code) DO UPDATE SET
          translated_text = EXCLUDED.translated_text,
          translation_status = EXCLUDED.translation_status,
          source_hash = EXCLUDED.source_hash,
          source_last_updated_reference = EXCLUDED.source_last_updated_reference,
          last_updated = EXCLUDED.last_updated`,
        [
          id,
          contentType,
          contentId,
          languageCode,
          fieldName,
          translatedText,
          translationStatus,
          sourceHash,
          sourceRef,
          lastUpdated,
        ],
      );
      stats.inserted += 1;
    } catch (e) {
      bumpSkip(stats, "upsert_error");
      stats.errors.push(String(e instanceof Error ? e.message : e));
    }
  }
  return stats;
}

/**
 * Idempotent upsert exam_questions rows from Replit export (full row shape, PK = id).
 */
export async function importExamQuestionsMonolith(
  pool: pg.Pool,
  filePath: string,
  apply: boolean,
): Promise<ImportStats> {
  const stats = createStats(path.basename(filePath), "exam_questions");
  const rows = loadJsonRows(filePath);
  const valid: Record<string, unknown>[] = [];
  for (const row of rows) {
    const id = row.id !== undefined && row.id !== null ? String(row.id).trim() : "";
    const stem = str(row, "stem").trim();
    if (!id || !stem) {
      bumpSkip(stats, "missing_id_or_stem");
      continue;
    }
    valid.push(row);
  }

  if (!apply) {
    stats.inserted = valid.length;
    return stats;
  }

  const chunkSize = 200;
  for (let i = 0; i < valid.length; i += chunkSize) {
    const batch = valid.slice(i, i + chunkSize);
    const ids = batch.map((r) => String(r.id));
    let existing = new Set<string>();
    try {
      const ex = await pool.query(`SELECT id::text AS id FROM exam_questions WHERE id = ANY($1::varchar[])`, [ids]);
      existing = new Set(ex.rows.map((r: { id: string }) => r.id));
    } catch {
      existing = new Set();
    }

    for (const row of batch) {
      const id = String(row.id);
      const stem = str(row, "stem").trim();
      const wasThere = existing.has(id);
      try {
        await pool.query(
          `INSERT INTO exam_questions (
            id, tier, exam, question_type, status, publish_at, stem, options, correct_answer, rationale,
            difficulty, tags, body_system, topic, subtopic, case_id, exhibit_data, region_scope, stem_hash,
            career_type, scenario, clinical_pearl, exam_strategy, memory_hook, framework_used, clinical_trap,
            distractor_rationales, quality_scores, quality_feedback, quality_score, country_code, region_code,
            licensing_body, language_code, cognitive_level, question_format, is_scenario, is_mock_exam_eligible,
            is_adaptive_eligible, is_flashcard_source, is_study_guide_linked, is_tutor_ready,
            correct_answer_explanation, incorrect_answer_rationale, clinical_reasoning, key_takeaway, mnemonic,
            reference_source, lab_unit_variant, medication_naming_variant, case_context, vitals, labs, images,
            scenario_id, blueprint_weight, created_at, updated_at, published_at, source_version
          ) VALUES (
            $1, $2, $3, $4, $5, $6::timestamptz, $7, $8::jsonb, $9::jsonb, $10,
            $11, $12, $13, $14, $15, $16, $17::jsonb, $18, $19,
            $20, $21, $22, $23, $24, $25, $26, $27::jsonb, $28::jsonb, $29::jsonb, $30, $31, $32,
            $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43,
            $44, $45::jsonb, $46, $47, $48, $49, $50, $51, $52, $53::jsonb, $54::jsonb, $55::jsonb,
            $56, $57, $58::timestamptz, $59::timestamptz, $60::timestamptz, $61
          )
          ON CONFLICT (id) DO UPDATE SET
            tier = EXCLUDED.tier, exam = EXCLUDED.exam, question_type = EXCLUDED.question_type,
            status = EXCLUDED.status, publish_at = EXCLUDED.publish_at, stem = EXCLUDED.stem,
            options = EXCLUDED.options, correct_answer = EXCLUDED.correct_answer, rationale = EXCLUDED.rationale,
            difficulty = EXCLUDED.difficulty, tags = EXCLUDED.tags, body_system = EXCLUDED.body_system,
            topic = EXCLUDED.topic, subtopic = EXCLUDED.subtopic, case_id = EXCLUDED.case_id,
            exhibit_data = EXCLUDED.exhibit_data, region_scope = EXCLUDED.region_scope, stem_hash = EXCLUDED.stem_hash,
            career_type = EXCLUDED.career_type, scenario = EXCLUDED.scenario, clinical_pearl = EXCLUDED.clinical_pearl,
            exam_strategy = EXCLUDED.exam_strategy, memory_hook = EXCLUDED.memory_hook,
            framework_used = EXCLUDED.framework_used, clinical_trap = EXCLUDED.clinical_trap,
            distractor_rationales = EXCLUDED.distractor_rationales, quality_scores = EXCLUDED.quality_scores,
            quality_feedback = EXCLUDED.quality_feedback, quality_score = EXCLUDED.quality_score,
            country_code = EXCLUDED.country_code, region_code = EXCLUDED.region_code,
            licensing_body = EXCLUDED.licensing_body, language_code = EXCLUDED.language_code,
            cognitive_level = EXCLUDED.cognitive_level, question_format = EXCLUDED.question_format,
            is_scenario = EXCLUDED.is_scenario, is_mock_exam_eligible = EXCLUDED.is_mock_exam_eligible,
            is_adaptive_eligible = EXCLUDED.is_adaptive_eligible, is_flashcard_source = EXCLUDED.is_flashcard_source,
            is_study_guide_linked = EXCLUDED.is_study_guide_linked, is_tutor_ready = EXCLUDED.is_tutor_ready,
            correct_answer_explanation = EXCLUDED.correct_answer_explanation,
            incorrect_answer_rationale = EXCLUDED.incorrect_answer_rationale,
            clinical_reasoning = EXCLUDED.clinical_reasoning, key_takeaway = EXCLUDED.key_takeaway,
            mnemonic = EXCLUDED.mnemonic, reference_source = EXCLUDED.reference_source,
            lab_unit_variant = EXCLUDED.lab_unit_variant, medication_naming_variant = EXCLUDED.medication_naming_variant,
            case_context = EXCLUDED.case_context, vitals = EXCLUDED.vitals, labs = EXCLUDED.labs, images = EXCLUDED.images,
            scenario_id = EXCLUDED.scenario_id, blueprint_weight = EXCLUDED.blueprint_weight,
            updated_at = EXCLUDED.updated_at, published_at = EXCLUDED.published_at,
            source_version = EXCLUDED.source_version`,
          [
            id,
            str(row, "tier"),
            str(row, "exam"),
            str(row, "question_type"),
            str(row, "status", "draft"),
            parseTimestamp(rowVal(row, "publish_at")),
            stem,
            safeJsonForPg(jsonb(row, "options") ?? []),
            safeJsonForPg(jsonb(row, "correct_answer") ?? []),
            optStr(row, "rationale"),
            numOrNull(row, "difficulty") ?? 3,
            (() => {
              const t = jsonb(row, "tags");
              if (Array.isArray(t)) return t.map((x) => String(x));
              return [] as string[];
            })(),
            optStr(row, "body_system"),
            optStr(row, "topic"),
            optStr(row, "subtopic"),
            optStr(row, "case_id"),
            safeJsonForPg(jsonb(row, "exhibit_data")),
            str(row, "region_scope", "BOTH"),
            optStr(row, "stem_hash"),
            str(row, "career_type", "nursing"),
            optStr(row, "scenario"),
            optStr(row, "clinical_pearl"),
            optStr(row, "exam_strategy"),
            optStr(row, "memory_hook"),
            optStr(row, "framework_used"),
            optStr(row, "clinical_trap"),
            safeJsonForPg(jsonb(row, "distractor_rationales")),
            safeJsonForPg(jsonb(row, "quality_scores")),
            safeJsonForPg(jsonb(row, "quality_feedback")),
            numOrNull(row, "quality_score"),
            optStr(row, "country_code"),
            optStr(row, "region_code"),
            optStr(row, "licensing_body"),
            str(row, "language_code", "en"),
            optStr(row, "cognitive_level"),
            optStr(row, "question_format"),
            boolOr(row, "is_scenario", false),
            boolOr(row, "is_mock_exam_eligible", true),
            boolOr(row, "is_adaptive_eligible", true),
            boolOr(row, "is_flashcard_source", false),
            boolOr(row, "is_study_guide_linked", false),
            boolOr(row, "is_tutor_ready", false),
            optStr(row, "correct_answer_explanation"),
            safeJsonForPg(jsonb(row, "incorrect_answer_rationale")),
            optStr(row, "clinical_reasoning"),
            optStr(row, "key_takeaway"),
            optStr(row, "mnemonic"),
            optStr(row, "reference_source"),
            optStr(row, "lab_unit_variant"),
            optStr(row, "medication_naming_variant"),
            optStr(row, "case_context"),
            safeJsonForPg(jsonb(row, "vitals")),
            safeJsonForPg(jsonb(row, "labs")),
            safeJsonForPg(jsonb(row, "images")),
            optStr(row, "scenario_id"),
            numOrNull(row, "blueprint_weight"),
            parseTimestamp(rowVal(row, "created_at")) ?? new Date().toISOString(),
            parseTimestamp(rowVal(row, "updated_at")) ?? new Date().toISOString(),
            parseTimestamp(rowVal(row, "published_at")),
            numOrNull(row, "source_version") ?? 1,
          ],
        );
        if (wasThere) stats.updated += 1;
        else {
          stats.inserted += 1;
          existing.add(id);
        }
      } catch (e) {
        bumpSkip(stats, "upsert_error");
        stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }
  return stats;
}

export async function importFlashcardBank(
  pool: pg.Pool,
  filePath: string,
  apply: boolean,
): Promise<ImportStats> {
  const stats = createStats(path.basename(filePath), "flashcard_bank");
  const rows = loadJsonRows(filePath);
  const valid: Record<string, unknown>[] = [];
  for (const row of rows) {
    const id = row.id !== undefined && row.id !== null ? String(row.id).trim() : "";
    const front = str(row, "front").trim();
    const back = str(row, "back").trim();
    if (!id || !front || !back) {
      bumpSkip(stats, "missing_id_front_or_back");
      continue;
    }
    valid.push(row);
  }
  if (!apply) {
    stats.inserted = valid.length;
    return stats;
  }

  for (const row of valid) {
    const id = String(row.id);
    let wasThere = false;
    try {
      const ex = await pool.query(`SELECT 1 FROM flashcard_bank WHERE id = $1::varchar LIMIT 1`, [id]);
      wasThere = ex.rows.length > 0;
    } catch {
      /* ignore */
    }
    try {
      await pool.query(
        `INSERT INTO flashcard_bank (
          id, tier, topic_tag, career_type, front, back, tags_json, references_json, status, content_hash,
          created_at, source_type, source_question_id, question_type, options, correct_answer, rationale_correct,
          distractor_rationales, clinical_takeaway, exam_pearl, rationale_media, lesson_links, difficulty,
          body_system, topic, subtopic, region_scope, flashcard_enabled, category, blueprint_category,
          updated_at, high_yield, is_foundational, quality_scores, quality_feedback, quality_score, source_version
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10,
          COALESCE($11::timestamptz, now()), $12, $13, $14, $15::jsonb, $16::jsonb, $17, $18::jsonb, $19, $20,
          $21::jsonb, $22::jsonb, $23, $24, $25, $26, $27, $28, $29, $30,
          COALESCE($31::timestamptz, now()), $32, $33, $34::jsonb, $35::jsonb, $36, $37
        )
        ON CONFLICT (id) DO UPDATE SET
          tier = EXCLUDED.tier, topic_tag = EXCLUDED.topic_tag, career_type = EXCLUDED.career_type,
          front = EXCLUDED.front, back = EXCLUDED.back, tags_json = EXCLUDED.tags_json,
          references_json = EXCLUDED.references_json, status = EXCLUDED.status, content_hash = EXCLUDED.content_hash,
          source_type = EXCLUDED.source_type, source_question_id = EXCLUDED.source_question_id,
          question_type = EXCLUDED.question_type, options = EXCLUDED.options, correct_answer = EXCLUDED.correct_answer,
          rationale_correct = EXCLUDED.rationale_correct, distractor_rationales = EXCLUDED.distractor_rationales,
          clinical_takeaway = EXCLUDED.clinical_takeaway, exam_pearl = EXCLUDED.exam_pearl,
          rationale_media = EXCLUDED.rationale_media, lesson_links = EXCLUDED.lesson_links,
          difficulty = EXCLUDED.difficulty, body_system = EXCLUDED.body_system, topic = EXCLUDED.topic,
          subtopic = EXCLUDED.subtopic, region_scope = EXCLUDED.region_scope, flashcard_enabled = EXCLUDED.flashcard_enabled,
          category = EXCLUDED.category, blueprint_category = EXCLUDED.blueprint_category,
          updated_at = EXCLUDED.updated_at, high_yield = EXCLUDED.high_yield, is_foundational = EXCLUDED.is_foundational,
          quality_scores = EXCLUDED.quality_scores, quality_feedback = EXCLUDED.quality_feedback,
          quality_score = EXCLUDED.quality_score, source_version = EXCLUDED.source_version`,
        [
          id,
          str(row, "tier"),
          optStr(row, "topic_tag"),
          str(row, "career_type", "nursing"),
          str(row, "front"),
          str(row, "back"),
          safeJsonForPg(jsonb(row, "tags_json") ?? []),
          safeJsonForPg(jsonb(row, "references_json") ?? []),
          str(row, "status", "draft"),
          optStr(row, "content_hash"),
          parseTimestamp(rowVal(row, "created_at")),
          str(row, "source_type", "manual"),
          optStr(row, "source_question_id"),
          optStr(row, "question_type"),
          safeJsonForPg(jsonb(row, "options") ?? []),
          safeJsonForPg(jsonb(row, "correct_answer")),
          optStr(row, "rationale_correct"),
          safeJsonForPg(jsonb(row, "distractor_rationales")),
          optStr(row, "clinical_takeaway"),
          optStr(row, "exam_pearl"),
          safeJsonForPg(jsonb(row, "rationale_media") ?? []),
          safeJsonForPg(jsonb(row, "lesson_links") ?? []),
          numOrNull(row, "difficulty"),
          optStr(row, "body_system"),
          optStr(row, "topic"),
          optStr(row, "subtopic"),
          str(row, "region_scope", "BOTH"),
          boolOr(row, "flashcard_enabled", false),
          optStr(row, "category"),
          optStr(row, "blueprint_category"),
          parseTimestamp(rowVal(row, "updated_at")),
          boolOr(row, "high_yield", false),
          boolOr(row, "is_foundational", false),
          safeJsonForPg(jsonb(row, "quality_scores")),
          safeJsonForPg(jsonb(row, "quality_feedback")),
          numOrNull(row, "quality_score"),
          numOrNull(row, "source_version") ?? 1,
        ],
      );
      if (wasThere) stats.updated += 1;
      else stats.inserted += 1;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/flashcard_bank_content_hash_unique|content_hash/i.test(msg)) {
        bumpSkip(stats, "content_hash_conflict");
      } else {
        bumpSkip(stats, "upsert_error");
        stats.errors.push(`id=${id}: ${msg}`);
      }
    }
  }
  return stats;
}

export async function importDigitalProducts(
  pool: pg.Pool,
  filePath: string,
  apply: boolean,
): Promise<ImportStats> {
  const stats = createStats(path.basename(filePath), "digital_products");
  const rows = loadJsonRows(filePath);
  const valid: Record<string, unknown>[] = [];
  for (const row of rows) {
    const id = row.id !== undefined && row.id !== null ? String(row.id).trim() : "";
    const slug = str(row, "slug").trim();
    const title = str(row, "title").trim();
    if (!id || !slug || !title) {
      bumpSkip(stats, "missing_id_slug_or_title");
      continue;
    }
    valid.push(row);
  }
  if (!apply) {
    stats.inserted = valid.length;
    return stats;
  }

  for (const row of valid) {
    const id = String(row.id);
    const title = str(row, "title").trim();
    let wasThere = false;
    try {
      const ex = await pool.query(`SELECT 1 FROM digital_products WHERE id = $1::varchar LIMIT 1`, [id]);
      wasThere = ex.rows.length > 0;
    } catch {
      /* ignore */
    }
    const seoKw = jsonb(row, "seo_keywords");
    const seoStr =
      typeof seoKw === "string"
        ? seoKw
        : Array.isArray(seoKw)
          ? seoKw.join(", ")
          : seoKw != null
            ? JSON.stringify(seoKw)
            : null;
    try {
      await pool.query(
        `INSERT INTO digital_products (
          id, slug, title, description, short_description, price, compare_at_price, file_url, cover_image_url,
          preview_url, preview_page_count, category, tier_target, exam_target, featured, is_active,
          question_count, seo_title, seo_description, seo_keywords, theme_id, career_type,
          sale_price, sale_starts_at, sale_ends_at, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22,
          $23, $24::timestamptz, $25::timestamptz, COALESCE($26::timestamptz, now()), COALESCE($27::timestamptz, now())
        )
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug, title = EXCLUDED.title, description = EXCLUDED.description,
          short_description = EXCLUDED.short_description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price,
          file_url = EXCLUDED.file_url, cover_image_url = EXCLUDED.cover_image_url, preview_url = EXCLUDED.preview_url,
          preview_page_count = EXCLUDED.preview_page_count, category = EXCLUDED.category, tier_target = EXCLUDED.tier_target,
          exam_target = EXCLUDED.exam_target, featured = EXCLUDED.featured, is_active = EXCLUDED.is_active,
          question_count = EXCLUDED.question_count, seo_title = EXCLUDED.seo_title, seo_description = EXCLUDED.seo_description,
          seo_keywords = EXCLUDED.seo_keywords, theme_id = EXCLUDED.theme_id, career_type = EXCLUDED.career_type,
          sale_price = EXCLUDED.sale_price, sale_starts_at = EXCLUDED.sale_starts_at, sale_ends_at = EXCLUDED.sale_ends_at,
          updated_at = EXCLUDED.updated_at`,
        [
          id,
          str(row, "slug"),
          title,
          str(row, "description", ""),
          optStr(row, "short_description"),
          numOrNull(row, "price") ?? 0,
          numOrNull(row, "compare_at_price"),
          optStr(row, "file_url"),
          optStr(row, "cover_image_url"),
          optStr(row, "preview_url"),
          numOrNull(row, "preview_page_count") ?? 3,
          str(row, "category", "general"),
          str(row, "tier_target", "all"),
          optStr(row, "exam_target"),
          boolOr(row, "featured", false),
          boolOr(row, "is_active", true),
          numOrNull(row, "question_count") ?? 0,
          optStr(row, "seo_title"),
          optStr(row, "seo_description"),
          seoStr,
          optStr(row, "theme_id"),
          str(row, "career_type", "nursing"),
          numOrNull(row, "sale_price"),
          parseTimestamp(rowVal(row, "sale_starts_at")),
          parseTimestamp(rowVal(row, "sale_ends_at")),
          parseTimestamp(rowVal(row, "created_at")),
          parseTimestamp(rowVal(row, "updated_at")),
        ],
      );
      if (wasThere) stats.updated += 1;
      else stats.inserted += 1;
    } catch (e) {
      bumpSkip(stats, "upsert_error");
      stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return stats;
}

export async function importPricingPlans(
  pool: pg.Pool,
  filePath: string,
  apply: boolean,
): Promise<ImportStats> {
  const stats = createStats(path.basename(filePath), "pricing_plans");
  const rows = loadJsonRows(filePath);
  const valid: Record<string, unknown>[] = [];
  for (const row of rows) {
    const id = row.id !== undefined && row.id !== null ? String(row.id).trim() : "";
    const tier = str(row, "tier").trim();
    const duration = str(row, "duration").trim();
    if (!id || !tier || !duration) {
      bumpSkip(stats, "missing_id_tier_or_duration");
      continue;
    }
    valid.push(row);
  }
  if (!apply) {
    stats.inserted = valid.length;
    return stats;
  }

  for (const row of valid) {
    const id = String(row.id);
    const tier = str(row, "tier").trim();
    const duration = str(row, "duration").trim();
    let wasThere = false;
    try {
      const ex = await pool.query(`SELECT 1 FROM pricing_plans WHERE id = $1::varchar LIMIT 1`, [id]);
      wasThere = ex.rows.length > 0;
    } catch {
      /* ignore */
    }
    const features = jsonb(row, "features");
    const featureList = jsonb(row, "feature_list");
    const flJson = featureList ?? features ?? [];
    const planName = optStr(row, "label") ?? optStr(row, "plan_name");
    try {
      await pool.query(
        `INSERT INTO pricing_plans (
          id, tier, duration, plan_name, description, is_lifetime, price_cad, price_usd,
          stripe_price_id_usd, stripe_price_id_cad, is_enabled, is_popular, is_featured, is_founding_price,
          feature_list, display_order, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15::jsonb, $16,
          COALESCE($17::timestamptz, now()), COALESCE($18::timestamptz, now())
        )
        ON CONFLICT (id) DO UPDATE SET
          tier = EXCLUDED.tier, duration = EXCLUDED.duration, plan_name = EXCLUDED.plan_name,
          description = EXCLUDED.description, is_lifetime = EXCLUDED.is_lifetime,
          price_cad = EXCLUDED.price_cad, price_usd = EXCLUDED.price_usd,
          stripe_price_id_usd = EXCLUDED.stripe_price_id_usd, stripe_price_id_cad = EXCLUDED.stripe_price_id_cad,
          is_enabled = EXCLUDED.is_enabled, is_popular = EXCLUDED.is_popular, is_featured = EXCLUDED.is_featured,
          is_founding_price = EXCLUDED.is_founding_price, feature_list = EXCLUDED.feature_list,
          display_order = EXCLUDED.display_order, updated_at = EXCLUDED.updated_at`,
        [
          id,
          tier,
          duration,
          planName,
          optStr(row, "description"),
          boolOr(row, "is_lifetime", false),
          numOrNull(row, "price_cad") ?? 0,
          numOrNull(row, "price_usd") ?? 0,
          optStr(row, "stripe_price_id_usd"),
          optStr(row, "stripe_price_id_cad"),
          boolOr(row, "is_enabled", true),
          boolOr(row, "is_popular", false),
          boolOr(row, "is_featured", false) || Boolean(str(row, "badge", "").trim()),
          boolOr(row, "is_founding_price", false),
          safeJsonForPg(Array.isArray(flJson) ? flJson : []),
          numOrNull(row, "display_order") ?? 0,
          parseTimestamp(rowVal(row, "created_at")),
          parseTimestamp(rowVal(row, "updated_at")),
        ],
      );
      if (wasThere) stats.updated += 1;
      else stats.inserted += 1;
    } catch (e) {
      bumpSkip(stats, "upsert_error");
      stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return stats;
}

function jsonbOrEmptyArray(row: Record<string, unknown>, key: string): unknown {
  const v = jsonb(row, key);
  if (v === undefined || v === null) return [];
  return v;
}

/**
 * Legacy AI batch output rows → `generated_questions` (not the same as production `exam_questions`).
 * Optional migration: use `--include-generated-questions` and optional `--max-generated-questions=N` cap.
 */
export async function importGeneratedQuestionsMonolith(
  pool: pg.Pool,
  filePath: string,
  apply: boolean,
  maxRows: number | null = null,
): Promise<ImportStats> {
  const stats = createStats(path.basename(filePath), "generated_questions");
  let rows = loadJsonRows(filePath);
  if (maxRows != null && maxRows >= 0 && rows.length > maxRows) {
    rows = rows.slice(0, maxRows);
    stats.errors.push(`capped_to_${maxRows}_rows`);
  }

  const valid: Record<string, unknown>[] = [];
  for (const row of rows) {
    const id = row.id !== undefined && row.id !== null ? String(row.id).trim() : "";
    const generationId = str(row, "generation_id").trim();
    const stem = str(row, "stem").trim();
    const choices = jsonbOrEmptyArray(row, "choices");
    const correctAnswers = jsonbOrEmptyArray(row, "correct_answers");
    if (!id || !generationId || !stem) {
      bumpSkip(stats, "missing_id_generation_or_stem");
      continue;
    }
    if (!Array.isArray(choices) || choices.length === 0) {
      bumpSkip(stats, "missing_or_empty_choices");
      continue;
    }
    if (!Array.isArray(correctAnswers)) {
      bumpSkip(stats, "invalid_correct_answers");
      continue;
    }
    valid.push(row);
  }

  if (!apply) {
    stats.inserted = valid.length;
    return stats;
  }

  for (const row of valid) {
    const id = String(row.id);
    let wasThere = false;
    try {
      const ex = await pool.query(`SELECT 1 FROM generated_questions WHERE id = $1::varchar LIMIT 1`, [id]);
      wasThere = ex.rows.length > 0;
    } catch {
      /* ignore */
    }
    const rationaleRaw = jsonb(row, "rationale");
    const rationaleJson =
      rationaleRaw === undefined || rationaleRaw === null ? null : safeJsonForPg(rationaleRaw);
    try {
      await pool.query(
        `INSERT INTO generated_questions (
          id, generation_id, idx, type, difficulty, system, category, stem, scenario,
          choices, correct_answers, rationale, exam_pearl, hash, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12::jsonb, $13, $14,
          COALESCE($15::timestamptz, now())
        )
        ON CONFLICT (id) DO UPDATE SET
          generation_id = EXCLUDED.generation_id, idx = EXCLUDED.idx, type = EXCLUDED.type,
          difficulty = EXCLUDED.difficulty, system = EXCLUDED.system, category = EXCLUDED.category,
          stem = EXCLUDED.stem, scenario = EXCLUDED.scenario, choices = EXCLUDED.choices,
          correct_answers = EXCLUDED.correct_answers, rationale = EXCLUDED.rationale,
          exam_pearl = EXCLUDED.exam_pearl, hash = EXCLUDED.hash`,
        [
          id,
          str(row, "generation_id"),
          numOrNull(row, "idx") ?? 0,
          str(row, "type", "mcq"),
          optStr(row, "difficulty"),
          optStr(row, "system"),
          optStr(row, "category"),
          str(row, "stem"),
          optStr(row, "scenario"),
          safeJsonForPg(jsonbOrEmptyArray(row, "choices")),
          safeJsonForPg(jsonbOrEmptyArray(row, "correct_answers")),
          rationaleJson,
          optStr(row, "exam_pearl"),
          optStr(row, "hash"),
          parseTimestamp(rowVal(row, "created_at")),
        ],
      );
      if (wasThere) stats.updated += 1;
      else stats.inserted += 1;
    } catch (e) {
      bumpSkip(stats, "upsert_error");
      stats.errors.push(`id=${id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return stats;
}
