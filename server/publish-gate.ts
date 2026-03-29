import type { Express, Request, Response } from "express";
import crypto from "crypto";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import {
  validateForPublish,
  autoRepairContent,
  type ValidationResult,
  type ValidationError,
  type AutoRepairAction,
} from "./content-integrity-validation";

/**
 * ------------------------------
 * CONSTANTS
 * ------------------------------
 */

const SUPPORTED_TYPES = new Set([
  "question", "questions", "exam_question",
  "flashcard", "flashcards",
  "lesson", "lessons",
  "blog", "blog-post", "article",
]);

/**
 * ------------------------------
 * HELPERS
 * ------------------------------
 */

function normalizeType(type: string): string {
  if (["questions", "exam_question"].includes(type)) return "question";
  if (["flashcards"].includes(type)) return "flashcard";
  if (["lessons"].includes(type)) return "lesson";
  if (["blog-post", "article"].includes(type)) return "blog";
  return type;
}

function getTable(type: string): string | null {
  switch (normalizeType(type)) {
    case "question": return "exam_questions";
    case "flashcard": return "flashcard_bank";
    case "lesson": return "lessons";
    case "blog": return "content_items";
    default: return null;
  }
}

function checksum(data: any) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

/**
 * ------------------------------
 * CORE VALIDATION LOGIC
 * ------------------------------
 */

function validateCore(data: any, type: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const t = normalizeType(type);

  if (t === "question") {
    if (!data.stem || data.stem.trim().length < 10) {
      errors.push({ field: "stem", message: "Question stem too short", severity: "error" });
    }

    const opts = Array.isArray(data.options) ? data.options : [];
    if (opts.length < 2) {
      errors.push({ field: "options", message: "At least 2 options required", severity: "error" });
    }

    if (data.correct_answer === undefined || data.correct_answer === null) {
      errors.push({ field: "correct_answer", message: "Missing correct answer", severity: "error" });
    }
  }

  if (t === "lesson" || t === "blog") {
    if (!data.slug || data.slug.length < 2) {
      errors.push({ field: "slug", message: "Invalid slug", severity: "error" });
    }
  }

  return errors;
}

/**
 * ------------------------------
 * ARTIFACTS
 * ------------------------------
 */

async function storeArtifact(contentId: string, type: string, payload: any) {
  const id = crypto.randomUUID();
  const cs = checksum(payload);

  await pool.query(
    `INSERT INTO backup_artifacts 
     (id, content_id, content_type, artifact_type, checksum, metadata)
     VALUES ($1,$2,$3,'json',$4,$5)`,
    [id, contentId, normalizeType(type), cs, JSON.stringify(payload)]
  );

  return { artifactId: id, checksum: cs };
}

/**
 * ------------------------------
 * MAIN GATE
 * ------------------------------
 */

export async function runPublishGate(
  contentType: string,
  contentId: string,
  data: any,
  actorId?: string
) {
  const type = normalizeType(contentType);
  const timestamp = new Date().toISOString();

  if (!SUPPORTED_TYPES.has(contentType)) {
    return {
      allowed: false,
      contentId,
      contentType: type,
      validation: { valid: false, errors: [{ field: "type", message: "Unsupported type", severity: "error" }], warnings: [] },
      repairReport: null,
      artifactsGenerated: [],
      previousVersionPreserved: false,
      previousVersionId: null,
      timestamp,
    };
  }

  const { repairedData, repairs } = autoRepairContent(contentType, data);

  const validation = validateForPublish(contentType, repairedData);
  const coreErrors = validateCore(repairedData, contentType);

  validation.errors.push(...coreErrors);
  if (coreErrors.length > 0) validation.valid = false;

  let artifacts: any[] = [];

  if (validation.valid) {
    artifacts.push(await storeArtifact(contentId, contentType, repairedData));
  }

  await pool.query(
    `INSERT INTO publish_validation_logs
     (content_id, content_type, passed, errors, warnings, actor_id)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [
      contentId,
      type,
      validation.valid,
      JSON.stringify(validation.errors),
      JSON.stringify(validation.warnings),
      actorId || null,
    ]
  );

  return {
    allowed: validation.valid,
    contentId,
    contentType: type,
    validation,
    repairReport: validation.valid ? null : { errors: validation.errors },
    artifactsGenerated: artifacts,
    previousVersionPreserved: false,
    previousVersionId: null,
    timestamp,
  };
}

/**
 * ------------------------------
 * ROUTES
 * ------------------------------
 */

export function registerPublishGateRoutes(app: Express) {

  app.post("/api/admin/publish-gate/validate", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { contentType, contentId, data } = req.body;
      const result = await runPublishGate(contentType, contentId, data, (admin as any).id);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/publish-gate/publish", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { contentType, contentId, data } = req.body;

      const result = await runPublishGate(contentType, contentId, data, (admin as any).id);

      if (!result.allowed) {
        return res.status(422).json({ error: "Blocked", result });
      }

      const table = getTable(contentType);
      if (!table) return res.status(400).json({ error: "Invalid table" });

      await pool.query(`UPDATE ${table} SET status='published', published_at=NOW() WHERE id=$1`, [contentId]);

      res.json({ success: true, result });

    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

}