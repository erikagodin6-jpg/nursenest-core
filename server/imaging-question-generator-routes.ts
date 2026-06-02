import type { Express } from "express";
import { requireAdmin } from "./admin-auth";
import { runImagingQuestionGeneration, ensureImagingQuestionColumns } from "./imaging-question-generator";
import type { GenerationProgress } from "./imaging-question-generator";
import { pool } from "./storage";

let generationInProgress = false;
let currentProgress: { status: string } & Partial<GenerationProgress> & Record<string, unknown> | null = null;

ensureImagingQuestionColumns().catch((err: unknown) => {
  console.error("[ImagingGen] Failed to ensure columns:", (err as Error).message);
});

export function registerImagingQuestionGeneratorRoutes(app: Express): void {
  app.post("/api/admin/imaging/generate-questions", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      if (generationInProgress) {
        return res.status(409).json({
          error: "Generation already in progress",
          progress: currentProgress,
        });
      }

      const { targetCount = 1400, batchSize = 50 } = req.body;

      const countResult = await pool.query(
        `SELECT COUNT(*)::int as total FROM imaging_questions WHERE status = 'published'`
      );
      const existingCount = countResult.rows[0]?.total || 0;

      console.log(`[ImagingGen] Starting generation. Existing published questions: ${existingCount}`);
      console.log(`[ImagingGen] Target: ${targetCount} new questions in batches of ${batchSize}`);

      generationInProgress = true;
      currentProgress = { status: "starting", existingCount };

      res.json({
        status: "started",
        message: `Generation of ${targetCount} imaging questions started. Processing in batches of ${batchSize}.`,
        existingCount,
        targetCount,
      });

      runImagingQuestionGeneration(targetCount, batchSize, (progress) => {
        currentProgress = { status: "running", ...progress };
      })
        .then((finalProgress) => {
          currentProgress = { status: "complete", ...finalProgress };
          generationInProgress = false;
          console.log(`[ImagingGen] Generation complete:`, JSON.stringify({
            totalGenerated: finalProgress.totalGenerated,
            totalFlashcards: finalProgress.totalFlashcards,
            totalDuplicatesSkipped: finalProgress.totalDuplicatesSkipped,
          }));
        })
        .catch((err: unknown) => {
          currentProgress = { status: "failed", error: (err as Error).message };
          generationInProgress = false;
          console.error(`[ImagingGen] Generation failed:`, err);
        });
    } catch (e: unknown) {
      generationInProgress = false;
      console.error("Generate imaging questions error:", e);
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.get("/api/admin/imaging/generation-progress", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      if (!currentProgress) {
        return res.json({ status: "idle", message: "No generation in progress or completed" });
      }

      res.json(currentProgress);
    } catch (e: unknown) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.get("/api/admin/imaging/question-stats", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const [totalQ, totalFC, byDomain, byDifficulty] = await Promise.all([
        pool.query(`SELECT COUNT(*)::int as total FROM imaging_questions WHERE status = 'published'`),
        pool.query(`SELECT COUNT(*)::int as total FROM imaging_flashcards WHERE status = 'published'`),
        pool.query(`SELECT exam_domain, COUNT(*)::int as count FROM imaging_questions WHERE status = 'published' AND exam_domain IS NOT NULL GROUP BY exam_domain ORDER BY count DESC`),
        pool.query(`SELECT difficulty, COUNT(*)::int as count FROM imaging_questions WHERE status = 'published' GROUP BY difficulty ORDER BY difficulty`),
      ]);

      res.json({
        totalQuestions: totalQ.rows[0]?.total || 0,
        totalFlashcards: totalFC.rows[0]?.total || 0,
        byDomain: byDomain.rows,
        byDifficulty: byDifficulty.rows,
        generationInProgress,
      });
    } catch (e: unknown) {
      res.status(500).json({ error: (e as Error).message });
    }
  });
}
