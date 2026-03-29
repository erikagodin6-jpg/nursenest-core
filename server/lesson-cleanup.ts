import { getPool } from "./db";

const TIER_PATTERNS = [
  /\s+Rpn$/i,
  /\s+Rn$/i,
  /\s+Np$/i,
  /\s*\(RPN\/LVN\)/i,
  /\s+for Practical Nurses?$/i,
  /\s+for RPN$/i,
  /\s*\(RPN\)$/i,
  /\s*\(RN\)$/i,
  /\s*\(NP\)$/i,
];

const CATEGORY_CORRECTIONS: Record<string, { bodySystem: string; category: string }> = {
  "wound-irrigation-rpn": { bodySystem: "wound-care", category: "Wound Care" },
  "wound-irrigation-rn": { bodySystem: "dermatology", category: "Dermatology & Wound Care" },
  "wound-irrigation-np": { bodySystem: "dermatology", category: "Dermatology" },
  "malignant-hyperthermia-rpn": { bodySystem: "critical-care", category: "Critical Care" },
  "malignant-hyperthermia-rn": { bodySystem: "shock-emergency", category: "Shock & Emergency" },
  "malignant-hyperthermia-np": { bodySystem: "critical-care-advanced", category: "Critical Care Advanced" },
  "fetal-oxygenation-during-second-stage-pushing-rpn": { bodySystem: "maternity", category: "Maternity" },
  "population-screening-programs-for-practical-nurses-rpn": { bodySystem: "community-health", category: "Community Health" },
  "wilms-tumor-nephroblastoma-for-practical-nurses-rpn": { bodySystem: "pediatrics", category: "Pediatrics" },
  "siadh-syndrome-of-inappropriate-adh-rpn": { bodySystem: "endocrine", category: "Endocrine & Fluids" },
  "addison-disease-primary-adrenal-insufficiency-rpn": { bodySystem: "endocrine", category: "Endocrine & Fluids" },
  "amniotic-fluid-imbalances-for-practical-nurses-rpn": { bodySystem: "maternity", category: "Maternity" },
  "amniotic-fluid-embolism-dic-pathway-np": { bodySystem: "maternity", category: "Maternity & Obstetrics" },
  "tardive-dyskinesia-2-rpn": { bodySystem: "neurological", category: "Neurological" },
};

type CleanupStats = {
  totalLessons: number;
  lessonsUpdated: number;
  titlesCleaned: number;
  bodySystemsCorrected: number;
  categoriesCorrected: number;
  draftsSet: number;
  skipped: number;
};

function cleanTitle(title: unknown): string {
  if (typeof title !== "string") return "";

  let cleaned = title;
  for (const pattern of TIER_PATTERNS) {
    cleaned = cleaned.replace(pattern, "");
  }

  return cleaned.replace(/\s{2,}/g, " ").trim();
}

function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return "__INVALID_JSON__";
  }
}

function isEmptyContent(content: unknown): boolean {
  if (content === null || content === undefined) return true;
  if (content === "") return true;
  if (content === "null") return true;
  if (content === "[]") return true;
  if (content === "{}") return true;
  if (content === '""') return true;

  if (Array.isArray(content)) {
    return content.length === 0;
  }

  if (typeof content === "object") {
    return Object.keys(content as Record<string, unknown>).length === 0;
  }

  if (typeof content === "string") {
    const trimmed = content.trim();
    if (!trimmed) return true;
    if (trimmed === "null" || trimmed === "[]" || trimmed === "{}" || trimmed === '""') return true;

    try {
      const parsed = JSON.parse(trimmed);

      if (parsed === null) return true;
      if (Array.isArray(parsed)) return parsed.length === 0;
      if (typeof parsed === "object") return Object.keys(parsed).length === 0;

      return false;
    } catch {
      return trimmed.length === 0;
    }
  }

  return false;
}

function getDryRunEnabled(): boolean {
  return String(process.env.LESSON_CLEANUP_DRY_RUN || "").toLowerCase() === "true";
}

export async function runLessonCleanup(options?: { dryRun?: boolean }) {
  const pool = getPool();
  const client = await pool.connect();
  const dryRun = options?.dryRun ?? getDryRunEnabled();

  const stats: CleanupStats = {
    totalLessons: 0,
    lessonsUpdated: 0,
    titlesCleaned: 0,
    bodySystemsCorrected: 0,
    categoriesCorrected: 0,
    draftsSet: 0,
    skipped: 0,
  };

  try {
    await client.query("BEGIN");

    const { rows: allLessons } = await client.query(
      `
      SELECT id, title, slug, body_system, category, status, content
      FROM content_items
      WHERE type = 'lesson'
      `
    );

    stats.totalLessons = allLessons.length;

    for (const lesson of allLessons) {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIdx = 1;

      const originalTitle = typeof lesson.title === "string" ? lesson.title : "";
      const cleanedTitle = cleanTitle(originalTitle);

      if (cleanedTitle && cleanedTitle !== originalTitle) {
        updates.push(`title = $${paramIdx++}`);
        values.push(cleanedTitle);
        stats.titlesCleaned++;
      }

      const correction = CATEGORY_CORRECTIONS[String(lesson.slug || "")];
      if (correction) {
        if (lesson.body_system !== correction.bodySystem) {
          updates.push(`body_system = $${paramIdx++}`);
          values.push(correction.bodySystem);
          stats.bodySystemsCorrected++;
        }

        if (lesson.category !== correction.category) {
          updates.push(`category = $${paramIdx++}`);
          values.push(correction.category);
          stats.categoriesCorrected++;
        }
      }

      const emptyContent = isEmptyContent(lesson.content);
      if (emptyContent && lesson.status === "published") {
        updates.push(`status = $${paramIdx++}`);
        values.push("draft");
        stats.draftsSet++;
      }

      if (updates.length === 0) {
        stats.skipped++;
        continue;
      }

      updates.push(`updated_at = NOW()`);
      values.push(lesson.id);

      if (!dryRun) {
        await client.query(
          `UPDATE content_items SET ${updates.join(", ")} WHERE id = $${paramIdx}`,
          values
        );
      }

      stats.lessonsUpdated++;
    }

    if (dryRun) {
      await client.query("ROLLBACK");
      console.log("[lesson-cleanup] DRY RUN enabled. No database changes were committed.");
    } else {
      await client.query("COMMIT");
    }

    console.log(`[lesson-cleanup] Total lessons processed: ${stats.totalLessons}`);
    console.log(`[lesson-cleanup] Lessons updated: ${stats.lessonsUpdated}`);
    console.log(`[lesson-cleanup] Titles cleaned: ${stats.titlesCleaned}`);
    console.log(`[lesson-cleanup] Body systems corrected: ${stats.bodySystemsCorrected}`);
    console.log(`[lesson-cleanup] Categories corrected: ${stats.categoriesCorrected}`);
    console.log(`[lesson-cleanup] Empty content set to draft: ${stats.draftsSet}`);
    console.log(`[lesson-cleanup] Skipped (no changes needed): ${stats.skipped}`);

    return stats;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[lesson-cleanup] Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  runLessonCleanup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}