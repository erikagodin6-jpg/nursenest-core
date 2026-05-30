import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  buildNavigationAuditReport,
  type RouteAuditEntry,
} from "@/lib/nav-governance/navigation-audit";
import {
  APPROVED_MODULE_EXCEPTIONS,
  NAVIGATION_CONTRACT_VERSION,
  CANONICAL_LEARNER_SHELL_PATH,
  CANONICAL_NAV_COMPONENT_PATH,
} from "@/lib/nav-governance/navigation-contract";

export const metadata: Metadata = {
  title: "Navigation Compliance · Admin",
};

export const dynamic = "force-dynamic";

// ─── Subcomponents ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: RouteAuditEntry["status"] }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    compliant:          { label: "Compliant",          cls: "bg-green-50 text-green-700 border-green-200" },
    "approved-exception": { label: "Approved Exception", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    violation:          { label: "VIOLATION",           cls: "bg-red-50 text-red-700 border-red-200 font-bold" },
    unknown:            { label: "Unknown",             cls: "bg-slate-50 text-slate-600 border-slate-200" },
  };
  const { label, cls } = cfg[status] ?? cfg.unknown!;
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

function ComplianceMeter({ rate }: { rate: number }) {
  const color = rate === 100 ? "bg-green-500" : rate >= 90 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${rate}%` }} />
      </div>
      <span className="text-sm font-bold tabular-nums w-12 text-right">{rate}%</span>
    </div>
  );
}

function RouteRow({ route }: { route: RouteAuditEntry }) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="px-4 py-3">
        <StatusBadge status={route.status} />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-slate-700">{route.routePath}</td>
      <td className="px-4 py-3 font-mono text-xs text-slate-500 max-w-xs truncate" title={route.filePath}>
        {route.filePath}
      </td>
      <td className="px-4 py-3 text-xs text-slate-600 max-w-sm">{route.detail}</td>
      {route.importsFound.length > 0 && (
        <td className="px-4 py-3">
          {route.importsFound.map((c) => (
            <span key={c} className="mr-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">
              {c}
            </span>
          ))}
        </td>
      )}
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function NavigationCompliancePage() {
  // Admin-only — use a dummy request object; requireAdmin reads from cookies/session
  const gate = await requireAdmin(new Request("http://localhost"));
  if (!gate.ok) redirect("/admin");

  let report: Awaited<ReturnType<typeof buildNavigationAuditReport>> | null = null;
  let auditError: string | null = null;

  try {
    report = buildNavigationAuditReport(process.cwd());
  } catch (e) {
    auditError = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400">Platform Governance</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-mono text-slate-500">
            v{NAVIGATION_CONTRACT_VERSION}
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">Navigation Compliance</h1>
        <p className="mt-1 text-sm text-slate-500">
          Every learner route must render through the canonical learner shell. This dashboard audits compliance.
        </p>
      </div>

      {auditError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Audit failed:</strong> {auditError}
        </div>
      ) : report ? (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {[
              { label: "Total Routes", value: report.totalRoutes, color: "text-slate-900" },
              { label: "Compliant", value: report.compliantCount, color: "text-green-700" },
              { label: "Approved Exceptions", value: report.approvedExceptionCount, color: "text-amber-700" },
              { label: "VIOLATIONS", value: report.violationCount, color: report.violationCount > 0 ? "text-red-700 font-black" : "text-slate-400" },
              { label: "Compliance Rate", value: `${report.complianceRate}%`, color: report.complianceRate === 100 ? "text-green-700" : "text-amber-700" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Compliance meter */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-700">Overall Compliance</h2>
              <span className="text-xs text-slate-400">Target: 100%</span>
            </div>
            <ComplianceMeter rate={report.complianceRate} />
            <p className="mt-3 text-xs text-slate-500">{report.summary}</p>
          </div>

          {/* Violations — shown prominently if any */}
          {report.violations.length > 0 && (
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
              <h2 className="text-sm font-black text-red-800 mb-1">⚠️ {report.violations.length} Violation{report.violations.length > 1 ? "s" : ""} Detected</h2>
              <p className="text-xs text-red-600 mb-4">
                These routes bypass the canonical learner shell without approval. They must be either migrated or registered as approved exceptions.
              </p>
              <div className="space-y-3">
                {report.violations.map((v) => (
                  <div key={v.filePath} className="rounded-xl bg-white border border-red-200 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <code className="text-xs font-mono text-red-700 font-bold">{v.routePath}</code>
                      <StatusBadge status="violation" />
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{v.detail}</p>
                    <p className="mt-1 text-[10px] font-mono text-slate-400">{v.filePath}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved exceptions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 mb-1">
              Approved Module Exceptions ({APPROVED_MODULE_EXCEPTIONS.length})
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              These routes bypass the canonical shell with written justification. Each is pending migration to the learner shell.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Route</th>
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Label</th>
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Shell Component</th>
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Migration</th>
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Justification</th>
                  </tr>
                </thead>
                <tbody>
                  {APPROVED_MODULE_EXCEPTIONS.map((ex) => (
                    <tr key={ex.routePrefix} className="border-b border-slate-50">
                      <td className="px-3 py-2 font-mono text-xs text-slate-700">{ex.routePrefix}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{ex.label}</td>
                      <td className="px-3 py-2 font-mono text-xs text-slate-500">{ex.shellComponent}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] border ${
                          ex.migrationStatus === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          ex.migrationStatus === "in-progress" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>
                          {ex.migrationStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-500 max-w-sm">{ex.justification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* All routes table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-700">All Routes ({report.totalRoutes})</h2>
              <p className="text-xs text-slate-500 mt-0.5">Every layout.tsx scanned for navigation compliance.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">Status</th>
                    <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">Route</th>
                    <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">File</th>
                    <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {report.routes
                    .sort((a, b) => {
                      const order = { violation: 0, unknown: 1, "approved-exception": 2, compliant: 3 };
                      return (order[a.status] ?? 4) - (order[b.status] ?? 4);
                    })
                    .map((route) => (
                      <RouteRow key={route.filePath} route={route} />
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contract info */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 space-y-1">
            <p><strong>Contract version:</strong> {report.contractVersion}</p>
            <p><strong>Canonical shell:</strong> <code className="font-mono">{CANONICAL_LEARNER_SHELL_PATH}</code></p>
            <p><strong>Canonical nav:</strong> <code className="font-mono">{CANONICAL_NAV_COMPONENT_PATH}</code></p>
            <p><strong>Audited at:</strong> {report.auditedAt}</p>
            <p className="mt-2 text-[10px]">
              Contract enforced by: <code>tests/contracts/learner-shell-navigation.contract.test.ts</code>
            </p>
          </div>
        </>
      ) : null}

    </div>
  );
}
