import type { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { requireAdmin } from "./admin-auth";
import { buildI18nDiagnosticsReport, type I18nDiagnosticsReport } from "./i18n-diagnostics-report";

const REPORT_PATH = path.resolve(process.cwd(), "reports/i18n-status.json");

function writeReportArtifact(report: I18nDiagnosticsReport): void {
  try {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  } catch (e) {
    console.warn("[i18n-diagnostics] could not write reports/i18n-status.json:", e);
  }
}

export function registerI18nDiagnosticsRoutes(app: Express) {
  app.get("/api/admin/i18n-diagnostics", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const useCache = String(req.query.cache ?? "1") !== "0";
      if (useCache && fs.existsSync(REPORT_PATH)) {
        const ageMs = Date.now() - fs.statSync(REPORT_PATH).mtimeMs;
        const maxAge = 5 * 60 * 1000;
        if (ageMs < maxAge) {
          const cached = JSON.parse(fs.readFileSync(REPORT_PATH, "utf-8")) as I18nDiagnosticsReport;
          return res.json({ ...cached, _source: "reports/i18n-status.json", _cacheAgeMs: ageMs });
        }
      }

      const report = buildI18nDiagnosticsReport();
      writeReportArtifact(report);
      res.json({ ...report, _source: "live", _cacheAgeMs: 0 });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[i18n-diagnostics]", e);
      res.status(500).json({ error: "Failed to build i18n diagnostics", message: msg });
    }
  });

  app.post("/api/admin/i18n-diagnostics/refresh", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const report = buildI18nDiagnosticsReport();
      writeReportArtifact(report);
      res.json({ ok: true, report, writtenTo: REPORT_PATH });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      res.status(500).json({ error: msg });
    }
  });
}
