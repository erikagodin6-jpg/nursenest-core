import type { Express } from "express";
import { requireAdmin } from "./admin-auth";
import { runSonographyQuestionGeneration, ensureSonographyColumns } from "./sonography-question-generator";
import type { SonoGenerationProgress } from "./sonography-question-generator";
import { pool } from "./storage";

let sonoGenerationInProgress = false;
let sonoCurrentProgress: { status: string } & Partial<SonoGenerationProgress> & Record<string, unknown> | null = null;

ensureSonographyColumns().catch((err: unknown) => {
  console.error("[SonoGen] Failed to ensure columns:", (err as Error).message);
});

export function registerSonographyQuestionGeneratorRoutes(app: Express): void {
  app.post("/api/admin/sonography/generate-questions", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      if (sonoGenerationInProgress) {
        return res.status(409).json({
          error: "Sonography generation already in progress",
          progress: sonoCurrentProgress,
        });
      }

      const { targetCount = 1500, batchSize = 100 } = req.body;

      const countResult = await pool.query(
        `SELECT COUNT(*)::int as total FROM imaging_questions WHERE status = 'published' AND modality = 'ultrasound'`
      );
      const existingCount = countResult.rows[0]?.total || 0;

      console.log(`[SonoGen] Starting generation. Existing published sonography questions: ${existingCount}`);
      console.log(`[SonoGen] Target: ${targetCount} new questions in batches of ${batchSize}`);

      sonoGenerationInProgress = true;
      sonoCurrentProgress = { status: "starting", existingCount };

      res.json({
        status: "started",
        message: `Generation of ${targetCount} sonography questions started. Processing in batches of ${batchSize}.`,
        existingCount,
        targetCount,
      });

      runSonographyQuestionGeneration(targetCount, batchSize, (progress) => {
        sonoCurrentProgress = { status: "running", ...progress };
      })
        .then((finalProgress) => {
          sonoCurrentProgress = { status: "complete", ...finalProgress };
          sonoGenerationInProgress = false;
          console.log(`[SonoGen] Generation complete:`, JSON.stringify({
            totalGenerated: finalProgress.totalGenerated,
            totalFlashcards: finalProgress.totalFlashcards,
            totalDuplicatesSkipped: finalProgress.totalDuplicatesSkipped,
            countryCounts: finalProgress.countryCounts,
          }));
        })
        .catch((err: unknown) => {
          sonoCurrentProgress = { status: "failed", error: (err as Error).message };
          sonoGenerationInProgress = false;
          console.error(`[SonoGen] Generation failed:`, err);
        });
    } catch (e: unknown) {
      sonoGenerationInProgress = false;
      console.error("Generate sonography questions error:", e);
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.get("/api/admin/sonography/generation-progress", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      if (!sonoCurrentProgress) {
        return res.json({ status: "idle", message: "No sonography generation in progress or completed" });
      }

      res.json(sonoCurrentProgress);
    } catch (e: unknown) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.get("/api/admin/sonography/question-stats", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const [totalQ, byDomain, byDifficulty, byCountry, byExam] = await Promise.all([
        pool.query(`SELECT COUNT(*)::int as total FROM imaging_questions WHERE status = 'published' AND modality = 'ultrasound'`),
        pool.query(`SELECT exam_domain, COUNT(*)::int as count FROM imaging_questions WHERE status = 'published' AND modality = 'ultrasound' AND exam_domain IS NOT NULL GROUP BY exam_domain ORDER BY count DESC`),
        pool.query(`SELECT difficulty, COUNT(*)::int as count FROM imaging_questions WHERE status = 'published' AND modality = 'ultrasound' GROUP BY difficulty ORDER BY difficulty`),
        pool.query(`SELECT country, COUNT(*)::int as count FROM imaging_questions WHERE status = 'published' AND modality = 'ultrasound' GROUP BY country ORDER BY count DESC`),
        pool.query(`SELECT exam, COUNT(*)::int as count FROM imaging_questions WHERE status = 'published' AND modality = 'ultrasound' GROUP BY exam ORDER BY count DESC`),
      ]);

      res.json({
        totalQuestions: totalQ.rows[0]?.total || 0,
        byDomain: byDomain.rows,
        byDifficulty: byDifficulty.rows,
        byCountry: byCountry.rows,
        byExam: byExam.rows,
        generationInProgress: sonoGenerationInProgress,
      });
    } catch (e: unknown) {
      res.status(500).json({ error: (e as Error).message });
    }
  });
}
