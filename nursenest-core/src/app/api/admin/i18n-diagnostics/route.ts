import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { allowDiagnosticsDiskWrite } from "@/lib/admin/diagnostics-disk-policy";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { getMonorepoRoot } from "@/lib/monorepo-root";
import { buildI18nDiagnosticsReport, type I18nDiagnosticsReport } from "../../../../../../server/i18n-diagnostics-report";

const REPORT_REL = path.join("reports", "i18n-status.json");

function reportPath(root: string): string {
  return path.join(root, REPORT_REL);
}

function writeReportArtifact(root: string, report: I18nDiagnosticsReport): void {
  if (!allowDiagnosticsDiskWrite()) return;
  try {
    const p = reportPath(root);
    mkdirSync(path.dirname(p), { recursive: true });
    writeFileSync(p, JSON.stringify(report, null, 2), "utf-8");
  } catch (e) {
    console.warn("[i18n-diagnostics] could not write reports/i18n-status.json:", e);
  }
}

export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const root = getMonorepoRoot();
  const url = new URL(req.url);
  const useCache = url.searchParams.get("cache") !== "0";
  const cacheFile = reportPath(root);

  try {
    if (useCache && existsSync(cacheFile)) {
      const ageMs = Date.now() - statSync(cacheFile).mtimeMs;
      const maxAge = 5 * 60 * 1000;
      if (ageMs < maxAge) {
        const cached = JSON.parse(readFileSync(cacheFile, "utf-8")) as I18nDiagnosticsReport;
        return NextResponse.json({ ...cached, _source: "reports/i18n-status.json", _cacheAgeMs: ageMs });
      }
    }

    const report = buildI18nDiagnosticsReport(root);
    writeReportArtifact(root, report);
    return NextResponse.json({ ...report, _source: "live", _cacheAgeMs: 0 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[i18n-diagnostics]", e);
    return NextResponse.json({ error: "Failed to build i18n diagnostics", message: msg }, { status: 500 });
  }
}
