import type { Express } from "express";
import { pool } from "./storage";
import { findSubstitute, getSubstitutionRules, getSubstitutionEvents, seedSubstitutionRules } from "./substitute-content-engine";
import { requireAdmin } from "./admin-auth";

export function registerSubstituteContentRoutes(app: Express) {
  app.get("/api/content-substitute/:contentId", async (req, res) => {
    try {
      const { contentId } = req.params;
      const contentType = (req.query.contentType as string) || null;
      const userId = (req as any).authUser?.id || null;

      const context = {
        userId,
        tier: (req as any).authUser?.tier || (req.query.tier as string) || null,
        profession: (req as any).authUser?.careerType || (req.query.profession as string) || null,
        examType: (req.query.examType as string) || null,
        domain: (req.query.domain as string) || null,
        category: (req.query.category as string) || null,
        region: (req as any).authUser?.region || (req.query.region as string) || null,
        language: (req.query.language as string) || null,
        requestPath: req.originalUrl,
      };

      const result = await findSubstitute(contentId, contentType, context);

      if (!result) {
        return res.status(404).json({
          error: "No substitute content available",
          message: "We could not find an equivalent resource at this time.",
        });
      }

      res.json({
        substitute: {
          id: result.substituteId,
          type: result.substituteType,
          data: result.substituteData,
          matchScore: result.matchScore,
          matchingCriteria: result.matchingCriteria,
          wasLanguageFallback: result.wasLanguageFallback,
          message: result.message,
        },
      });
    } catch (err: any) {
      console.error("[SubstituteContent] Error:", err?.message);
      res.status(500).json({ error: "Failed to find substitute content" });
    }
  });

  app.get("/api/admin/substitution-rules", requireAdmin, async (_req, res) => {
    try {
      const rules = await getSubstitutionRules();
      res.json({ rules });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch substitution rules" });
    }
  });

  app.get("/api/admin/substitution-events", requireAdmin, async (req, res) => {
    try {
      const userId = (req.query.userId as string) || undefined;
      const contentType = (req.query.contentType as string) || undefined;
      const limit = parseInt(req.query.limit as string) || 50;

      const events = await getSubstitutionEvents({ userId, contentType, limit });
      res.json({ events });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch substitution events" });
    }
  });

  app.post("/api/admin/substitution-rules/seed", requireAdmin, async (_req, res) => {
    try {
      await seedSubstitutionRules();
      const rules = await getSubstitutionRules();
      res.json({ success: true, rules });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to seed substitution rules" });
    }
  });
}
