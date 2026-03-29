import type { Express, Request, Response } from "express";
import { requireAdmin } from "./admin-auth";
import {
  generateImagingFlashcards,
  generateRrtFlashcards,
  resolveNeedsReviewQueue,
  getContentGapAnalytics,
  runFullContentGapRepair,
  getActiveJobStatus,
} from "./content-gap-repair";

export function registerContentGapRepairRoutes(app: Express): void {
  app.get("/api/admin/content-gap/analytics", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const analytics = await getContentGapAnalytics();
      res.json(analytics);
    } catch (err: any) {
      console.error("[ContentGapRepair] Analytics error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-gap/generate-imaging-flashcards", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      res.json({ message: "Imaging flashcard generation started", status: "running" });
      generateImagingFlashcards().catch(err => {
        console.error("[ContentGapRepair] Imaging flashcard generation failed:", err.message);
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-gap/generate-rrt-flashcards", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      res.json({ message: "RRT flashcard generation started", status: "running" });
      generateRrtFlashcards().catch(err => {
        console.error("[ContentGapRepair] RRT flashcard generation failed:", err.message);
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-gap/resolve-review-queue", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const useAI = req.body?.useAI !== false;
      res.json({ message: "Review queue resolution started", status: "running", useAI });
      resolveNeedsReviewQueue(useAI).catch(err => {
        console.error("[ContentGapRepair] Review queue resolution failed:", err.message);
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/content-gap/run-full-repair", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const useAI = req.body?.useAI !== false;
      const jobId = await runFullContentGapRepair(useAI);
      res.json({ jobId, message: "Full content gap repair started", status: "running" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/content-gap/job-status", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const job = getActiveJobStatus();
    if (!job) {
      return res.json({ status: "idle", message: "No active content gap repair job" });
    }
    res.json(job);
  });
}
