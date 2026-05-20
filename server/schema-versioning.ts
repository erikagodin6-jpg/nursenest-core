import type { Express, Request, Response } from "express";
import { pool } from "./storage";

export const SCHEMA_VERSIONS = {
  lesson: 2,
  exam_question: 2,
  flashcard: 2,
  clinical_case: 2,
} as const;

type ContentType = keyof typeof SCHEMA_VERSIONS;

interface SchemaVersionInfo {
  contentType: ContentType;
  currentVersion: number;
  latestVersion: number;
  needsMigration: boolean;
}

interface MigrationResult {
  contentType: ContentType;
  totalProcessed: number;
  migrated: number;
  alreadyCurrent: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

const LESSON_DEFAULTS: Record<string, any> = {
  schemaVersion: SCHEMA_VERSIONS.lesson,
  definition: null,
  pathophysiology: null,
  signs_symptoms: "[]",
  diagnostics: "[]",
  treatment: "[]",
  nursing_interventions: "[]",
  complications: "[]",
  clinical_pearls: "[]",
  seo_title: null,
  seo_description: null,
  seo_keywords: "[]",
  related_lesson_slugs: "[]",
};

const EXAM_QUESTION_DEFAULTS: Record<string, any> = {
  schemaVersion: SCHEMA_VERSIONS.exam_question,
  rationale: null,
  distractor_rationales: "{}",
  correct_answer_explanation: null,
  clinical_pearl: null,
  cognitive_level: null,
  tags: "[]",
  difficulty: 3,
  body_system: null,
  topic: null,
};

const FLASHCARD_DEFAULTS: Record<string, any> = {
  schemaVersion: SCHEMA_VERSIONS.flashcard,
  tags: "[]",
};

const CLINICAL_CASE_DEFAULTS: Record<string, any> = {
  schemaVersion: SCHEMA_VERSIONS.clinical_case,
  difficulty: "medium",
  clinical_pearls: "[]",
};

async function ensureSchemaVersionColumns(): Promise<void> {
  try {
    await pool.query(`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1`);
    await pool.query(`ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1`);
    await pool.query(`ALTER TABLE deck_flashcards ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1`);
    await pool.query(`ALTER TABLE flashcard_decks ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1`);

    try {
      const hasTable = await pool.query(`SELECT to_regclass('imaging_case_studies') IS NOT NULL AS exists`);
      if (hasTable.rows[0]?.exists) {
        await pool.query(`ALTER TABLE imaging_case_studies ADD COLUMN IF NOT EXISTS schema_version INTEGER DEFAULT 1`);
      }
    } catch {}
  } catch (err: any) {
    console.error("[SchemaVersioning] Failed to ensure columns:", err.message);
  }
}

export function normalizeLesson(lesson: any): any {
  const version = lesson.schema_version || lesson.schemaVersion || 1;

  if (version >= SCHEMA_VERSIONS.lesson) return lesson;

  const normalized = { ...lesson };

  for (const [field, defaultVal] of Object.entries(LESSON_DEFAULTS)) {
    if (field === "schemaVersion") continue;
    const snakeField = field;
    if (normalized[snakeField] === undefined || normalized[snakeField] === null) {
      if (typeof defaultVal === "string" && (defaultVal.startsWith("[") || defaultVal.startsWith("{"))) {
        try {
          normalized[snakeField] = JSON.parse(defaultVal);
        } catch {
          normalized[snakeField] = defaultVal;
        }
      } else {
        normalized[snakeField] = defaultVal;
      }
    }
  }

  if (typeof normalized.signs_symptoms === "string") {
    try { normalized.signs_symptoms = JSON.parse(normalized.signs_symptoms); } catch {}
  }
  if (typeof normalized.diagnostics === "string") {
    try { normalized.diagnostics = JSON.parse(normalized.diagnostics); } catch {}
  }
  if (typeof normalized.treatment === "string") {
    try { normalized.treatment = JSON.parse(normalized.treatment); } catch {}
  }
  if (typeof normalized.nursing_interventions === "string") {
    try { normalized.nursing_interventions = JSON.parse(normalized.nursing_interventions); } catch {}
  }
  if (typeof normalized.complications === "string") {
    try { normalized.complications = JSON.parse(normalized.complications); } catch {}
  }
  if (typeof normalized.clinical_pearls === "string") {
    try { normalized.clinical_pearls = JSON.parse(normalized.clinical_pearls); } catch {}
  }

  normalized.schema_version = SCHEMA_VERSIONS.lesson;
  return normalized;
}

export function normalizeExamQuestion(question: any): any {
  const version = question.schema_version || question.schemaVersion || 1;

  if (version >= SCHEMA_VERSIONS.exam_question) return question;

  const normalized = { ...question };

  if (!normalized.difficulty && normalized.difficulty !== 0) {
    normalized.difficulty = EXAM_QUESTION_DEFAULTS.difficulty;
  }

  if (!normalized.distractor_rationales) {
    normalized.distractor_rationales = {};
  } else if (typeof normalized.distractor_rationales === "string") {
    try { normalized.distractor_rationales = JSON.parse(normalized.distractor_rationales); } catch {
      normalized.distractor_rationales = {};
    }
  }

  if (!normalized.tags) {
    normalized.tags = [];
  } else if (typeof normalized.tags === "string") {
    try { normalized.tags = JSON.parse(normalized.tags); } catch {
      normalized.tags = [];
    }
  }

  if (!normalized.correct_answer_explanation) {
    normalized.correct_answer_explanation = null;
  }
  if (!normalized.clinical_pearl) {
    normalized.clinical_pearl = null;
  }
  if (!normalized.cognitive_level) {
    normalized.cognitive_level = null;
  }

  normalized.schema_version = SCHEMA_VERSIONS.exam_question;
  return normalized;
}

export function normalizeFlashcard(flashcard: any): any {
  const version = flashcard.schema_version || flashcard.schemaVersion || 1;

  if (version >= SCHEMA_VERSIONS.flashcard) return flashcard;

  const normalized = { ...flashcard };

  if (!normalized.tags) {
    normalized.tags = [];
  } else if (typeof normalized.tags === "string") {
    try { normalized.tags = JSON.parse(normalized.tags); } catch {
      normalized.tags = [];
    }
  }

  normalized.schema_version = SCHEMA_VERSIONS.flashcard;
  return normalized;
}

export function normalizeClinicalCase(clinicalCase: any): any {
  const version = clinicalCase.schema_version || clinicalCase.schemaVersion || 1;

  if (version >= SCHEMA_VERSIONS.clinical_case) return clinicalCase;

  const normalized = { ...clinicalCase };

  if (!normalized.difficulty) {
    normalized.difficulty = CLINICAL_CASE_DEFAULTS.difficulty;
  }
  if (!normalized.clinical_pearls) {
    normalized.clinical_pearls = [];
  } else if (typeof normalized.clinical_pearls === "string") {
    try { normalized.clinical_pearls = JSON.parse(normalized.clinical_pearls); } catch {
      normalized.clinical_pearls = [];
    }
  }

  normalized.schema_version = SCHEMA_VERSIONS.clinical_case;
  return normalized;
}

export function getContentVersion(content: any): number {
  return content?.schema_version || content?.schemaVersion || 1;
}

export function normalizeContent(contentType: ContentType, content: any): any {
  if (!content) return content;
  switch (contentType) {
    case "lesson": return normalizeLesson(content);
    case "exam_question": return normalizeExamQuestion(content);
    case "flashcard": return normalizeFlashcard(content);
    case "clinical_case": return normalizeClinicalCase(content);
    default: return content;
  }
}

export function normalizeContentArray(contentType: ContentType, items: any[]): any[] {
  return items.map(item => normalizeContent(contentType, item));
}

export async function migrateContentToLatest(contentType: ContentType, batchSize: number = 200): Promise<MigrationResult> {
  const result: MigrationResult = {
    contentType,
    totalProcessed: 0,
    migrated: 0,
    alreadyCurrent: 0,
    failed: 0,
    errors: [],
  };

  try {
    switch (contentType) {
      case "lesson":
        return await migrateLessons(batchSize, result);
      case "exam_question":
        return await migrateExamQuestions(batchSize, result);
      case "flashcard":
        return await migrateFlashcards(batchSize, result);
      case "clinical_case":
        return await migrateClinicalCases(batchSize, result);
      default:
        return result;
    }
  } catch (err: any) {
    console.error(`[SchemaVersioning] Migration error for ${contentType}:`, err.message);
    result.errors.push({ id: "system", error: err.message });
    return result;
  }
}

async function migrateLessons(batchSize: number, result: MigrationResult): Promise<MigrationResult> {
  const rows = await pool.query(
    `SELECT id, schema_version FROM lessons WHERE COALESCE(schema_version, 1) < $1 LIMIT $2`,
    [SCHEMA_VERSIONS.lesson, batchSize]
  );

  result.totalProcessed = rows.rows.length;

  for (const row of rows.rows) {
    try {
      await pool.query(
        `UPDATE lessons SET
          schema_version = $1,
          signs_symptoms = COALESCE(signs_symptoms, '[]'::jsonb),
          diagnostics = COALESCE(diagnostics, '[]'::jsonb),
          treatment = COALESCE(treatment, '[]'::jsonb),
          nursing_interventions = COALESCE(nursing_interventions, '[]'::jsonb),
          complications = COALESCE(complications, '[]'::jsonb),
          clinical_pearls = COALESCE(clinical_pearls, '[]'::jsonb),
          seo_keywords = COALESCE(seo_keywords, '{}'::text[]),
          related_lesson_slugs = COALESCE(related_lesson_slugs, '{}'::text[])
        WHERE id = $2`,
        [SCHEMA_VERSIONS.lesson, row.id]
      );
      result.migrated++;
    } catch (err: any) {
      result.failed++;
      result.errors.push({ id: row.id, error: err.message });
    }
  }

  return result;
}

async function migrateExamQuestions(batchSize: number, result: MigrationResult): Promise<MigrationResult> {
  const rows = await pool.query(
    `SELECT id, schema_version FROM exam_questions WHERE COALESCE(schema_version, 1) < $1 LIMIT $2`,
    [SCHEMA_VERSIONS.exam_question, batchSize]
  );

  result.totalProcessed = rows.rows.length;

  for (const row of rows.rows) {
    try {
      await pool.query(
        `UPDATE exam_questions SET
          schema_version = $1,
          difficulty = COALESCE(difficulty, 3),
          distractor_rationales = COALESCE(distractor_rationales, '{}'::jsonb),
          tags = COALESCE(tags, '{}'::text[])
        WHERE id = $2`,
        [SCHEMA_VERSIONS.exam_question, row.id]
      );
      result.migrated++;
    } catch (err: any) {
      result.failed++;
      result.errors.push({ id: String(row.id), error: err.message });
    }
  }

  return result;
}

async function migrateFlashcards(batchSize: number, result: MigrationResult): Promise<MigrationResult> {
  const rows = await pool.query(
    `SELECT id, schema_version FROM deck_flashcards WHERE COALESCE(schema_version, 1) < $1 LIMIT $2`,
    [SCHEMA_VERSIONS.flashcard, batchSize]
  );

  result.totalProcessed = rows.rows.length;

  for (const row of rows.rows) {
    try {
      await pool.query(
        `UPDATE deck_flashcards SET schema_version = $1 WHERE id = $2`,
        [SCHEMA_VERSIONS.flashcard, row.id]
      );
      result.migrated++;
    } catch (err: any) {
      result.failed++;
      result.errors.push({ id: row.id, error: err.message });
    }
  }

  return result;
}

async function migrateClinicalCases(batchSize: number, result: MigrationResult): Promise<MigrationResult> {
  try {
    const hasTable = await pool.query(`SELECT to_regclass('imaging_case_studies') IS NOT NULL AS exists`);
    if (!hasTable.rows[0]?.exists) {
      return result;
    }

    const rows = await pool.query(
      `SELECT id, schema_version FROM imaging_case_studies WHERE COALESCE(schema_version, 1) < $1 LIMIT $2`,
      [SCHEMA_VERSIONS.clinical_case, batchSize]
    );

    result.totalProcessed = rows.rows.length;

    for (const row of rows.rows) {
      try {
        await pool.query(
          `UPDATE imaging_case_studies SET
            schema_version = $1,
            difficulty = COALESCE(difficulty, 'medium')
          WHERE id = $2`,
          [SCHEMA_VERSIONS.clinical_case, row.id]
        );
        result.migrated++;
      } catch (err: any) {
        result.failed++;
        result.errors.push({ id: row.id, error: err.message });
      }
    }
  } catch (err: any) {
    result.errors.push({ id: "system", error: err.message });
  }

  return result;
}

export async function getSchemaVersionStats(): Promise<Array<SchemaVersionInfo & { counts: Record<number, number> }>> {
  const stats: Array<SchemaVersionInfo & { counts: Record<number, number> }> = [];

  try {
    const lessonStats = await pool.query(
      `SELECT COALESCE(schema_version, 1) AS version, COUNT(*)::int AS cnt FROM lessons GROUP BY COALESCE(schema_version, 1)`
    );
    const lessonCounts: Record<number, number> = {};
    for (const row of lessonStats.rows) {
      lessonCounts[row.version] = row.cnt;
    }
    const lessonLatest = !lessonCounts[SCHEMA_VERSIONS.lesson] || Object.keys(lessonCounts).some(v => parseInt(v) < SCHEMA_VERSIONS.lesson && lessonCounts[parseInt(v)] > 0);
    stats.push({
      contentType: "lesson",
      currentVersion: Math.min(...Object.keys(lessonCounts).map(Number)),
      latestVersion: SCHEMA_VERSIONS.lesson,
      needsMigration: lessonLatest,
      counts: lessonCounts,
    });
  } catch {}

  try {
    const qStats = await pool.query(
      `SELECT COALESCE(schema_version, 1) AS version, COUNT(*)::int AS cnt FROM exam_questions GROUP BY COALESCE(schema_version, 1)`
    );
    const qCounts: Record<number, number> = {};
    for (const row of qStats.rows) {
      qCounts[row.version] = row.cnt;
    }
    const qNeedsMigration = Object.keys(qCounts).some(v => parseInt(v) < SCHEMA_VERSIONS.exam_question && qCounts[parseInt(v)] > 0);
    stats.push({
      contentType: "exam_question",
      currentVersion: Math.min(...Object.keys(qCounts).map(Number)),
      latestVersion: SCHEMA_VERSIONS.exam_question,
      needsMigration: qNeedsMigration,
      counts: qCounts,
    });
  } catch {}

  try {
    const fcStats = await pool.query(
      `SELECT COALESCE(schema_version, 1) AS version, COUNT(*)::int AS cnt FROM deck_flashcards GROUP BY COALESCE(schema_version, 1)`
    );
    const fcCounts: Record<number, number> = {};
    for (const row of fcStats.rows) {
      fcCounts[row.version] = row.cnt;
    }
    const fcNeedsMigration = Object.keys(fcCounts).some(v => parseInt(v) < SCHEMA_VERSIONS.flashcard && fcCounts[parseInt(v)] > 0);
    stats.push({
      contentType: "flashcard",
      currentVersion: Math.min(...Object.keys(fcCounts).map(Number)),
      latestVersion: SCHEMA_VERSIONS.flashcard,
      needsMigration: fcNeedsMigration,
      counts: fcCounts,
    });
  } catch {}

  try {
    const ccStats = await pool.query(
      `SELECT COALESCE(schema_version, 1) AS version, COUNT(*)::int AS cnt FROM imaging_case_studies GROUP BY COALESCE(schema_version, 1)`
    );
    const ccCounts: Record<number, number> = {};
    for (const row of ccStats.rows) {
      ccCounts[row.version] = row.cnt;
    }
    const ccNeedsMigration = Object.keys(ccCounts).some(v => parseInt(v) < SCHEMA_VERSIONS.clinical_case && ccCounts[parseInt(v)] > 0);
    stats.push({
      contentType: "clinical_case",
      currentVersion: Object.keys(ccCounts).length > 0 ? Math.min(...Object.keys(ccCounts).map(Number)) : SCHEMA_VERSIONS.clinical_case,
      latestVersion: SCHEMA_VERSIONS.clinical_case,
      needsMigration: ccNeedsMigration,
      counts: ccCounts,
    });
  } catch {}

  return stats;
}

export async function migrateAllContentTypes(batchSize: number = 200): Promise<Record<string, MigrationResult>> {
  await ensureSchemaVersionColumns();

  const results: Record<string, MigrationResult> = {};
  const types: ContentType[] = ["lesson", "exam_question", "flashcard", "clinical_case"];

  for (const type of types) {
    results[type] = await migrateContentToLatest(type, batchSize);
  }

  return results;
}

export function registerSchemaVersioningRoutes(app: Express): void {
  ensureSchemaVersionColumns().catch(err => console.error("[SchemaVersioning] Init error:", err.message));

  app.get("/api/admin/schema-versions", async (req: Request, res: Response) => {
    try {
      const { resolveAuthUser } = await import("./admin-auth");
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      const stats = await getSchemaVersionStats();
      res.json({
        versions: SCHEMA_VERSIONS,
        stats,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/schema-versions/migrate", async (req: Request, res: Response) => {
    try {
      const { resolveAuthUser } = await import("./admin-auth");
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      const { contentType, batchSize } = req.body;
      const size = Math.min(batchSize || 200, 1000);

      if (contentType && contentType in SCHEMA_VERSIONS) {
        const result = await migrateContentToLatest(contentType as ContentType, size);
        return res.json({ success: true, result });
      }

      const results = await migrateAllContentTypes(size);
      try {
        const { trackChange } = require("./incident-correlation");
        trackChange({ type: "schema_change" as const, source: "schema-versioning", description: `Schema migration run for all content types`, entityId: "all", actor: user?.id || null, metadata: { results } });
      } catch {}
      res.json({ success: true, results });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
