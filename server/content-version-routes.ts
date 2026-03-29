import type { Express } from "express";
import { requireAdmin, resolveAuthUser } from "./admin-auth";
import {
  getVerifiedContent,
  getVersionHistory,
  getVersion,
  restoreVersion,
  listAllVersions,
  ensureContentVersionsTable,
} from "./content-version-service";

let tableReady: Promise<void> | null = null;

export function registerContentVersionRoutes(app: Express): void {
  tableReady = ensureContentVersionsTable();

  app.get("/api/admin/content-versions", async (req, res) => {
    try {
      if (tableReady) await tableReady;
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { contentType, validationStatus, limit, offset } = req.query;
      const result = await listAllVersions({
        contentType: contentType as string | undefined,
        validationStatus: validationStatus as string | undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/content-versions/history/:contentType/:contentId", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { contentId, contentType } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const result = await getVersionHistory(contentId, contentType, limit, offset);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/content-versions/verified/:contentType/:contentId", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { contentId, contentType } = req.params;
      const result = await getVerifiedContent(contentId, contentType);
      if (!result) return res.status(404).json({ error: "No verified version found" });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/content-versions/by-id/:versionId", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const version = await getVersion(req.params.versionId);
      if (!version) return res.status(404).json({ error: "Version not found" });
      res.json(version);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/content-versions/:versionId/restore", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const restored = await restoreVersion(req.params.versionId, (admin as any).id || (admin as any).username);
      res.json(restored);
    } catch (e: any) {
      if (e.message === "Version not found") return res.status(404).json({ error: e.message });
      if (e.message === "Cannot restore a non-verified version") return res.status(400).json({ error: e.message });
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/content/verified/:contentType/:contentId", async (req, res) => {
    try {
      const { contentId, contentType } = req.params;

      const PREMIUM_TYPES = ["exam_question", "flashcard", "digital_product", "lesson", "exam_config", "exam_blueprint", "flashcard_deck"];
      if (PREMIUM_TYPES.includes(contentType)) {
        const user = await resolveAuthUser(req as any);
        if (!user) {
          return res.status(401).json({ error: "Authentication required" });
        }
      }

      const result = await getVerifiedContent(contentId, contentType);
      if (!result) return res.status(404).json({ error: "No verified content available" });
      res.json({
        payload: result.version.payload,
        versionNumber: result.version.versionNumber,
        publishedAt: result.version.publishedAt,
        failoverUsed: result.failoverUsed,
        contentType: result.version.contentType,
        contentId: result.version.contentId,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}