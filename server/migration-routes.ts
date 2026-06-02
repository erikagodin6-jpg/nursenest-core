import type { Express } from "express";
import { requireAdmin, resolveAuthUser } from "./admin-auth";
import {
  getMigrationStatus,
  getMigrationAuditLog,
  getPendingMigrations,
  dryRunMigration,
  executeMigration,
  rollbackMigration,
  getRegisteredMigrations,
} from "./migration-framework";
import {
  getCleanupReports,
  cleanOrphanedContent,
  detectBrokenReferences,
  flagStaleBackups,
  purgeInvalidCache,
  runFullCleanup,
  startScheduledCleanup,
} from "./auto-cleanup-service";
import { getSchemaVersionStats } from "./schema-compatibility";

export function registerMigrationRoutes(app: Express): void {
  app.get("/api/admin/migrations/status", requireAdmin, async (_req, res) => {
    try {
      const status = await getMigrationStatus();
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/migrations/audit-log", requireAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const log = await getMigrationAuditLog(limit);
      res.json(log);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/migrations/pending", requireAdmin, async (_req, res) => {
    try {
      const pending = await getPendingMigrations();
      res.json(pending.map(m => ({
        version: m.version,
        name: m.name,
        description: m.description,
        breakingChange: m.breakingChange || false,
        affectedTables: m.affectedTables || [],
      })));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/migrations/dry-run", requireAdmin, async (req, res) => {
    try {
      const { version, direction } = req.body;
      if (!version) return res.status(400).json({ error: "Version is required" });
      const result = await dryRunMigration(version, direction || "up");
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/migrations/execute", requireAdmin, async (req, res) => {
    try {
      const { version } = req.body;
      if (!version) return res.status(400).json({ error: "Version is required" });
      const authUser = await resolveAuthUser(req as any);
      const adminId = authUser?.username || authUser?.id || "system";
      const result = await executeMigration(version, adminId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/migrations/rollback", requireAdmin, async (req, res) => {
    try {
      const { version } = req.body;
      if (!version) return res.status(400).json({ error: "Version is required" });
      const authUser = await resolveAuthUser(req as any);
      const adminId = authUser?.username || authUser?.id || "system";
      const result = await rollbackMigration(version, adminId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/migrations/schema-versions", requireAdmin, async (_req, res) => {
    try {
      const stats = await getSchemaVersionStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/cleanup/reports", requireAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const reports = await getCleanupReports(limit);
      res.json(reports);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/cleanup/run", requireAdmin, async (req, res) => {
    try {
      const { type } = req.body;
      const authUser = await resolveAuthUser(req as any);
      const adminId = authUser?.username || authUser?.id || "admin";
      let result;

      switch (type) {
        case "orphaned":
          result = await cleanOrphanedContent(adminId);
          break;
        case "broken_refs":
          result = await detectBrokenReferences(adminId);
          break;
        case "stale_backups":
          result = await flagStaleBackups(adminId);
          break;
        case "cache_purge":
          result = await purgeInvalidCache(adminId);
          break;
        case "full":
        default:
          const results = await runFullCleanup(adminId);
          return res.json({ results });
      }

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/cleanup/schedule", requireAdmin, async (req, res) => {
    try {
      const { intervalHours } = req.body;
      startScheduledCleanup(intervalHours || 24);
      res.json({ success: true, intervalHours: intervalHours || 24 });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
