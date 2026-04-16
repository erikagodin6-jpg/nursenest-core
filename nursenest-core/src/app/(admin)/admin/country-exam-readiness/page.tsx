import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadCountryExamReadinessDashboard } from "@/lib/admin/load-country-exam-readiness-dashboard";
import {
  MIN_PATHWAY_QUESTIONS_PUBLISH,
  PATHWAY_IDS_REQUIRED_FOR_COUNTRY_PUBLISH,
  PATHWAY_LAUNCH_APPROVED,
  type LaunchReadinessStatus,
} from "@/lib/navigation/country-exam-launch-readiness";
import { MIN_PATHWAY_LESSONS_SCALE_TARGET } from "@/lib/lessons/pathway-lesson-scale";

export const dynamic = "force-dynamic";

function statusBadge(status: LaunchReadinessStatus): string {
  switch (status) {
    case "published":
      return "bg-[color-mix(in_srgb,var(--semantic-success)_18%,transparent)] text-[var(--semantic-success)] border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))]";
    case "ready_for_review":
      return "bg-[color-mix(in_srgb,var(--semantic-info)_18%,transparent)] text-[var(--semantic-info)] border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))]";
    case "needs_content":
      return "bg-[color-mix(in_srgb,var(--semantic-warning)_18%,transparent)] text-[var(--semantic-warning)] border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))]";
    default:
      return "bg-[color-mix(in_srgb,var(--semantic-danger)_14%,transparent)] text-[var(--semantic-danger)] border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))]";
  }
}

export default async function AdminCountryExamReadinessPage() {
  await requireAdmin();

  let data: Awaited<ReturnType<typeof loadCountryExamReadinessDashboard>> | null = null;
  try {
    data = await loadCountryExamReadinessDashboard();
  } catch (e) {
    console.error("[country-exam-readiness]", e);
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Launch</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Country / exam readiness</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Public dropdowns and hubs use the <strong>committed snapshot</strong> plus registry checks — no per-request DB reads.
            Live inventory below shows drift vs production. Update{" "}
            <code className="rounded bg-muted px-1">src/config/pathway-readiness-snapshot.json</code> via{" "}
            <code className="rounded bg-muted px-1">npm run readiness:emit-snapshot</code> after major content changes.
            Editorial sign-off: <code className="rounded bg-muted px-1">PATHWAY_LAUNCH_APPROVED</code> (
            {PATHWAY_LAUNCH_APPROVED.size} pathway ids).
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Required for US/CA public country: US → {PATHWAY_IDS_REQUIRED_FOR_COUNTRY_PUBLISH.us.join(", ")} · CA →{" "}
            {PATHWAY_IDS_REQUIRED_FOR_COUNTRY_PUBLISH.canada.join(", ")}. Thresholds: ≥{MIN_PATHWAY_LESSONS_SCALE_TARGET}{" "}
            lessons, ≥{MIN_PATHWAY_QUESTIONS_PUBLISH} questions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/pathway-launch-workflow" className="rounded-lg border border-border px-3 py-2 font-medium hover:bg-muted">
            Launch workflow
          </Link>
          <Link href="/admin/product-availability" className="rounded-lg border border-border px-3 py-2 font-medium hover:bg-muted">
            Product availability
          </Link>
          <Link href="/admin/inventory" className="rounded-lg border border-border px-3 py-2 font-medium hover:bg-muted">
            Inventory
          </Link>
        </div>
      </div>

      {!data ? (
        <p className="mt-8 text-sm text-destructive" role="alert">
          Could not load readiness data. Check database connectivity and try again.
        </p>
      ) : (
        <>
          {data.inventoryDegraded && (
            <p className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
              Inventory queries partially failed — live counts may be incomplete. See{" "}
              <Link href="/admin/system-status" className="font-semibold underline">
                system status
              </Link>
              .
            </p>
          )}

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">US &amp; Canada rollups</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Worst status across required pathways determines whether the country can appear on the live site.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {data.countryRollups.map((c) => (
                <div
                  key={c.region}
                  className="rounded-xl border border-[var(--border)] bg-card p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold capitalize">{c.region}</span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusBadge(c.status)}`}
                    >
                      {c.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{c.summary}</p>
                  {c.pathwayEvaluations && c.pathwayEvaluations.length > 0 && (
                    <ul className="mt-3 space-y-2 text-xs">
                      {c.pathwayEvaluations.map((p) => (
                        <li key={p.pathwayId} className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2">
                          <span className="font-mono text-[11px]">{p.pathwayId}</span>
                          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${statusBadge(p.status)}`}>
                            {p.status.replace(/_/g, " ")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Pathways — live inventory vs snapshot</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="border-b border-border bg-muted/30 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Pathway</th>
                    <th className="px-3 py-2">Live status</th>
                    <th className="px-3 py-2">Snapshot status</th>
                    <th className="px-3 py-2">Failed checks (live)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pathwayRowsLive.map((live, i) => {
                    const snap = data.pathwayRowsSnapshot[i]!;
                    const failed = live.checks.filter((c) => !c.pass);
                    return (
                      <tr key={live.pathwayId} className="border-b border-border/50">
                        <td className="px-3 py-2 align-top">
                          <div className="font-medium">{live.displayName}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">{live.pathwayId}</div>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${statusBadge(live.status)}`}>
                            {live.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${statusBadge(snap.status)}`}>
                            {snap.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="max-w-md px-3 py-2 align-top text-xs text-muted-foreground">
                          {failed.length === 0 ? (
                            <span className="text-[var(--semantic-success)]">All checks pass</span>
                          ) : (
                            <ul className="list-inside list-disc space-y-0.5">
                              {failed.map((c) => (
                                <li key={c.code}>
                                  <span className="font-semibold text-[var(--theme-heading-text)]">{c.label}</span>
                                  {c.detail ? ` — ${c.detail}` : null}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
