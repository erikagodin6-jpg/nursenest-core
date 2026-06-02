import type { Express } from "express";
import { storage, pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { VALID_BODY_SYSTEMS, TOPICS_BY_SYSTEM, VALID_TIERS, getAllCanonicalTopics } from "./generatorV2/taxonomyRegistry";
import { normalizeTopic } from "./generatorV2/topicNormalizer";

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

export function registerTaxonomyRoutes(app: Express) {
  app.get("/api/admin/taxonomy/registry", requireAdmin, async (_req, res) => {
    try {
      res.json({
        tiers: VALID_TIERS,
        bodySystems: VALID_BODY_SYSTEMS,
        topicsBySystem: TOPICS_BY_SYSTEM,
        totalTopics: getAllCanonicalTopics().length,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/taxonomy/review-queue", requireAdmin, async (req, res) => {
    try {
      const status = (req.query.status as string) || undefined;
      const system = (req.query.system as string) || undefined;
      const entries = await storage.listTaxonomyReviewQueue({ status, system });
      res.json({ entries: entries.map(snakeToCamel) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/taxonomy/review-queue/:id/resolve", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { resolvedTopic, resolvedSystem, resolvedBy } = req.body;
      if (!resolvedTopic || !resolvedSystem) {
        return res.status(400).json({ error: "resolvedTopic and resolvedSystem are required" });
      }
      if (!VALID_BODY_SYSTEMS.includes(resolvedSystem as any)) {
        return res.status(400).json({ error: `Invalid system "${resolvedSystem}". Must be one of: ${VALID_BODY_SYSTEMS.join(", ")}` });
      }
      const systemTopics = TOPICS_BY_SYSTEM[resolvedSystem as keyof typeof TOPICS_BY_SYSTEM];
      if (!systemTopics || !systemTopics.some(t => t.toLowerCase() === resolvedTopic.toLowerCase())) {
        return res.status(400).json({ error: `Invalid topic "${resolvedTopic}" for system "${resolvedSystem}". Must be a canonical topic.` });
      }
      const entry = await storage.resolveTaxonomyReviewEntry(id, {
        resolvedTopic,
        resolvedSystem,
        resolvedBy: resolvedBy || "admin",
      });
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }
      res.json({ entry: snakeToCamel(entry) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/taxonomy/review-queue/:id/dismiss", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `UPDATE taxonomy_review_queue SET status = 'dismissed' WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Entry not found" });
      }
      res.json({ entry: snakeToCamel(result.rows[0]) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/taxonomy/test-normalize", requireAdmin, async (req, res) => {
    try {
      const { topic, system } = req.body;
      const result = normalizeTopic(topic || "", system || "Multi-system");
      res.json({ result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/taxonomy/review-queue/stats", requireAdmin, async (_req, res) => {
    try {
      const result = await pool.query(`
        SELECT status, COUNT(*) as count
        FROM taxonomy_review_queue
        GROUP BY status
      `);
      const stats: Record<string, number> = {};
      for (const row of result.rows) {
        stats[row.status] = parseInt(row.count);
      }
      res.json({ stats });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
