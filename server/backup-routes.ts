import type { Express, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { requireAdmin } from "./admin-auth";

const ROOT = path.resolve(process.cwd());

/* =========================
   HELPERS
========================= */

async function runAdminTask(
  req: Request,
  res: Response,
  loader: () => Promise<any>,
  executor: (mod: any) => Promise<any>
) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  try {
    const mod = await loader();
    const result = await executor(mod);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error("[Backup] Error:", err.message);
    res.status(500).json({ error: err.message || "Operation failed" });
  }
}

/* =========================
   ROUTES
========================= */

export function registerBackupRoutes(app: Express) {

  app.post("/api/admin/backup/full", (req, res) =>
    runAdminTask(
      req,
      res,
      () => import("../backup-system/backup-full"),
      (m) => m.runFullBackup({
        includeStripe: req.body?.includeStripe === true,
        includeObjectStorage: req.body?.includeObjectStorage === true,
        downloadObjectStorageFiles: req.body?.downloadObjectStorageFiles === true,
      })
    )
  );

  app.post("/api/admin/backup/db", (req, res) =>
    runAdminTask(req, res, () => import("../backup-system/backup-db"), (m) => m.runDbBackup())
  );

  app.post("/api/admin/backup/content", (req, res) =>
    runAdminTask(req, res, () => import("../backup-system/backup-content"), (m) => m.runContentBackup())
  );

  app.post("/api/admin/backup/assets", (req, res) =>
    runAdminTask(req, res, () => import("../backup-system/backup-assets"), (m) => m.runAssetsBackup())
  );

  app.post("/api/admin/backup/stripe", (req, res) =>
    runAdminTask(req, res, () => import("../backup-system/backup-stripe"), (m) => m.runStripeBackup())
  );

  app.post("/api/admin/backup/object-storage", (req, res) =>
    runAdminTask(
      req,
      res,
      () => import("../backup-system/backup-object-storage"),
      (m) => m.runObjectStorageBackup({ downloadFiles: req.body?.downloadFiles === true })
    )
  );

  app.post("/api/admin/backup/env-inventory", (req, res) =>
    runAdminTask(req, res, () => import("../backup-system/backup-env-inventory"), (m) => m.runEnvInventory())
  );

  app.post("/api/admin/backup/render", (req, res) =>
    runAdminTask(req, res, () => import("../backup-system/backup-render"), (m) => m.runRenderBackup())
  );

  app.post("/api/admin/backup/code-archive", (req, res) =>
    runAdminTask(req, res, () => import("../backup-system/backup-code-archive"), (m) => m.runCodeArchive())
  );

  app.post("/api/admin/backup/verify", (req, res) =>
    runAdminTask(
      req,
      res,
      () => import("../backup-system/backup-verify"),
      (m) => m.verifyBackup(req.body?.backupPath)
    )
  );

  app.post("/api/admin/backup/retention", (req, res) =>
    runAdminTask(
      req,
      res,
      () => import("../backup-system/retention"),
      (m) => m.enforceRetention(req.body?.keepCount || 7)
    )
  );

  /* =========================
     DOWNLOAD (ASYNC SAFE)
  ========================= */

  app.get("/api/admin/backup/download", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const backupsDir = path.join(ROOT, "backups");

      const exists = await fs.stat(backupsDir).then(() => true).catch(() => false);
      if (!exists) return res.status(404).json({ error: "No backups directory" });

      const files = await fs.readdir(backupsDir);
      const latest = files.filter(f => f.endsWith(".zip")).sort().reverse()[0];

      if (!latest) return res.status(404).json({ error: "No backup files" });

      const filePath = path.join(backupsDir, latest);

      res.download(filePath);

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  /* =========================
     STATUS (ASYNC SAFE)
  ========================= */

  app.get("/api/admin/backup/status", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const backupsDir = path.join(ROOT, "backups");

      const dirs = ["db", "content", "stripe", "assets", "code"];
      const status: any = {};

      for (const dir of dirs) {
        const dirPath = path.join(backupsDir, dir);

        try {
          const files = await fs.readdir(dirPath);
          status[dir] = {
            exists: true,
            count: files.length,
            latest: files.sort().reverse()[0] || null,
          };
        } catch {
          status[dir] = { exists: false, count: 0 };
        }
      }

      res.json({ components: status });

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

}