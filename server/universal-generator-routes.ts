import type { Express, Request, Response } from "express";
import { requireAdmin } from "./admin-auth";
import {
  getAllTierOptions,
  CONTENT_TYPES,
  QUESTION_FORMATS,
  BLOG_TEMPLATES,
  NURSING_TIERS,
  NP_SPECIALTIES,
  ALLIED_HEALTH_PROFESSIONS,
  CERTIFICATION_PREP_EXAMS,
  GENERATION_DEFAULTS,
} from "./universal-content-registry";
import {
  generateQuestions,
  generateFlashcardsFromContent,
  generateLesson,
  generateBlogArticle,
} from "./universal-generator";
import {
  getRunLogs,
  getDailyCounts,
  enforceBatchSize,
  ensureGovernorTables,
} from "./generation-governor";

const VALID_CONTENT_TYPES = CONTENT_TYPES.map(ct => ct.id);
const VALID_TIER_IDS = new Set(getAllTierOptions().map(t => t.id));
const VALID_REGIONS = new Set(["CA", "US"]);
const VALID_BODY_SYSTEMS = new Set([
  "Multi-system", "Cardiac", "Respiratory", "Neuro", "Renal", "Endocrine",
  "GI", "Hematology", "Immune", "Integumentary", "MSK", "Reproductive",
]);
const VALID_BLOG_TEMPLATES = new Set([
  ...BLOG_TEMPLATES.allied_health.map(t => t.id),
  ...BLOG_TEMPLATES.new_grad.map(t => t.id),
]);

export function registerUniversalGeneratorRoutes(app: Express): void {

  app.get("/api/admin/universal-generator/config", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    res.json({
      tiers: {
        nursing: NURSING_TIERS,
        npSpecialties: NP_SPECIALTIES,
        alliedHealth: ALLIED_HEALTH_PROFESSIONS,
        certificationPrep: CERTIFICATION_PREP_EXAMS,
      },
      contentTypes: CONTENT_TYPES,
      questionFormats: QUESTION_FORMATS,
      blogTemplates: BLOG_TEMPLATES,
      defaults: GENERATION_DEFAULTS,
      allTiers: getAllTierOptions(),
    });
  });

  app.post("/api/admin/universal-generator/generate", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      await ensureGovernorTables();

      const { contentType, tier, topic, batchSize, template, targetKeyword, bodySystem, region, sourceType } = req.body;

      if (!contentType || !tier || !topic) {
        return res.status(400).json({ error: "contentType, tier, and topic are required" });
      }

      if (!VALID_CONTENT_TYPES.includes(contentType)) {
        return res.status(400).json({ error: `Invalid content type. Must be one of: ${VALID_CONTENT_TYPES.join(", ")}` });
      }

      if (!VALID_TIER_IDS.has(tier)) {
        return res.status(400).json({ error: "Invalid tier identifier" });
      }

      if (typeof topic !== "string" || topic.trim().length < 3 || topic.trim().length > 200) {
        return res.status(400).json({ error: "Topic must be 3-200 characters" });
      }

      if (region && !VALID_REGIONS.has(region)) {
        return res.status(400).json({ error: "Region must be CA or US" });
      }

      if (bodySystem && !VALID_BODY_SYSTEMS.has(bodySystem)) {
        return res.status(400).json({ error: "Invalid body system" });
      }

      if (template && !VALID_BLOG_TEMPLATES.has(template)) {
        return res.status(400).json({ error: "Invalid blog template" });
      }

      const enforcedBatch = enforceBatchSize(batchSize || GENERATION_DEFAULTS.batchSize.default);

      switch (contentType) {
        case "questions": {
          const result = await generateQuestions({
            tier,
            topic,
            batchSize: enforcedBatch,
            region,
          });
          return res.json({
            success: result.success,
            contentType: "questions",
            tier,
            topic,
            batchSize: enforcedBatch,
            itemCount: result.items.length,
            items: result.items,
            runLogId: result.runLogId,
            errors: result.errors,
          });
        }

        case "flashcards": {
          const result = await generateFlashcardsFromContent({
            tier,
            topic,
            batchSize: enforcedBatch,
            sourceType: sourceType || "fresh",
          });
          return res.json({
            success: result.success,
            contentType: "flashcards",
            tier,
            topic,
            batchSize: enforcedBatch,
            itemCount: result.items.length,
            items: result.items,
            runLogId: result.runLogId,
            errors: result.errors,
          });
        }

        case "lessons": {
          const result = await generateLesson({
            tier,
            topic,
            bodySystem: bodySystem || "Multi-system",
          });
          return res.json({
            success: result.success,
            contentType: "lessons",
            tier,
            topic,
            lesson: result.lesson,
            runLogId: result.runLogId,
            errors: result.errors,
          });
        }

        case "blog_articles": {
          const result = await generateBlogArticle({
            tier,
            topic,
            template: template || "career_guide",
            targetKeyword,
          });
          return res.json({
            success: result.success,
            contentType: "blog_articles",
            tier,
            topic,
            article: result.article,
            runLogId: result.runLogId,
            errors: result.errors,
          });
        }

        default:
          return res.status(400).json({ error: `Unknown content type: ${contentType}` });
      }
    } catch (err: any) {
      console.error("[UniversalGenerator] Error:", err.message);
      const safeMessage = err.message?.includes("budget")
        ? err.message
        : "Content generation failed. Please try again.";
      res.status(500).json({ error: safeMessage });
    }
  });

  app.get("/api/admin/universal-generator/logs", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      await ensureGovernorTables();
      const { limit = "50" } = req.query;
      const logs = await getRunLogs(parseInt(String(limit)) || 50);
      res.json({ logs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/universal-generator/daily-counts", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      await ensureGovernorTables();
      const counts = await getDailyCounts();
      res.json({ counts, defaults: GENERATION_DEFAULTS });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
