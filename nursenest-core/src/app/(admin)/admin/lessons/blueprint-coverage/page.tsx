import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { buildLessonBlueprintCoverageDashboard } from "@/lib/content-blueprint/lesson-blueprint-coverage-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminLessonBlueprintCoveragePage() {
  await requireAdmin();
  const catalog = require("@/content/pathway-lessons/catalog.json");
  const dashboard = buildLessonBlueprintCoverageDashboard(catalog);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Pathway lessons</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">Lesson blueprint coverage</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Static inventory from catalog.json — domain mix vs planning weights, lesson-type split, and progress toward
            editorial floor ({dashboard.pathways[0]?.progress.minFloor ?? 150}) and stretch ({dashboard.pathways[0]?.progress.stretchGoal ?? 500}) goals. Regenerate JSON with{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">npm run ops:lesson-blueprint-coverage</code>.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Generated {new Date(dashboard.generatedAt).toLocaleString()} · {dashboard.dataSource}
          </p>
        </div>
        <Link
          href="/admin/lessons"
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          ← Lessons
        </Link>
      </div>

      <div className="mt-8 space-y-10">
        {dashboard.pathways.map((p) => (
          <section
            key={p.pathwayId}
            className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{p.displayName}</h2>
              <span className="font-mono text-xs text-muted-foreground">{p.pathwayId}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{p.totalLessons}</span> lessons · min floor{" "}
              {p.progress.pctOfMinFloor}% · stretch {p.progress.pctOfStretchGoal}%
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">Short of min ({p.progress.minFloor})</p>
                <p className="mt-1 text-xl font-bold tabular-nums">{p.progress.lessonsShortOfMin}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">Short of stretch ({p.progress.stretchGoal})</p>
                <p className="mt-1 text-xl font-bold tabular-nums">{p.progress.lessonsShortOfStretch}</p>
              </div>
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.06] p-3 sm:col-span-2">
                <p className="text-xs font-medium text-amber-900 dark:text-amber-100">Weakest domains (weight-adjusted)</p>
                <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                  {p.weakDomains.length === 0 ? (
                    <li>No underweight domains vs profile (or pathway has no profile).</li>
                  ) : (
                    p.weakDomains.map((w) => (
                      <li key={w.domain}>
                        <span className="text-foreground">{w.label}</span> — {w.count} lessons (expected ~{w.expectedApprox})
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">By NCLEX domain (blueprint)</h3>
                <div className="mt-2 max-h-56 overflow-auto rounded border border-border/50">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-muted/80">
                      <tr>
                        <th className="px-2 py-1.5 font-medium">Domain</th>
                        <th className="px-2 py-1.5 font-medium">n</th>
                        <th className="px-2 py-1.5 font-medium">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.byDomain
                        .filter((r) => r.count > 0)
                        .sort((a, b) => b.count - a.count)
                        .map((r) => (
                          <tr key={r.domain} className="border-t border-border/40">
                            <td className="px-2 py-1 text-muted-foreground">{r.label}</td>
                            <td className="px-2 py-1 tabular-nums">{r.count}</td>
                            <td className="px-2 py-1 tabular-nums">{r.pctOfPathway}%</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">By lesson type</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {p.byLessonType.map((t) => (
                    <li key={t.type}>
                      <span className="text-foreground">{t.label}</span>: {t.count} ({t.pctOfPathway}%)
                    </li>
                  ))}
                </ul>
                <h3 className="mt-4 text-sm font-semibold text-foreground">Thin clinical systems (lowest counts)</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {p.weakSystems.map((s) => (
                    <li key={s.system}>
                      {s.label}: <span className="tabular-nums text-foreground">{s.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">Planning notes (major gaps)</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {p.majorGaps.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
