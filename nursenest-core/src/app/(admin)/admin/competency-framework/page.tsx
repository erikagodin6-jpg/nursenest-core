import { requireAdmin } from "@/lib/auth/guards";
import {
  buildCompetencyFrameworkDashboard,
  COMPETENCY_REGISTRY,
  DIGITAL_BADGES,
  READINESS_CERTIFICATES,
  type CompetencyProfession,
} from "@/lib/competencies/competency-registry";

export const dynamic = "force-dynamic";

function formatProfession(profession: CompetencyProfession): string {
  return profession
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace("Rn", "RN")
    .replace("Pn", "PN")
    .replace("Np", "NP")
    .replace("Mlt", "MLT")
    .replace("Psw", "PSW")
    .replace("Pt", "PT")
    .replace("Ot", "OT");
}

export default async function AdminCompetencyFrameworkPage() {
  await requireAdmin();
  const dashboard = buildCompetencyFrameworkDashboard();
  const topCompetencies = [...COMPETENCY_REGISTRY]
    .sort((a, b) => b.readinessWeight - a.readinessWeight)
    .slice(0, 12);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Competency Framework</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Competency Framework</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Registry coverage for professional competencies, evidence-based badges, internal readiness certificates,
            institutional reporting, and launch-readiness coverage. Certificates are internal NurseNest readiness
            indicators only and do not imply licensure or external certification.
          </p>
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Competencies</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">
            {dashboard.competencyCoverage.totalCompetencies}
          </p>
        </div>
        <div className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Professions Covered</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">
            {dashboard.competencyCoverage.professionsCovered}
          </p>
        </div>
        <div className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Evidence-Based Badges</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">
            {dashboard.badgeCoverage.evidenceBasedBadges}
          </p>
        </div>
        <div className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Content Mappings</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">
            {dashboard.competencyCoverage.mappedContentSlots}
          </p>
        </div>
      </section>

      <section className="mt-10 nn-card overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">Profession Readiness</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Shows whether each profession has competency, badge, certificate, and institutional reporting coverage.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Profession</th>
                <th className="px-4 py-2 text-right">Competencies</th>
                <th className="px-4 py-2 text-right">Badges</th>
                <th className="px-4 py-2 text-right">Certificates</th>
                <th className="px-4 py-2">Institutional Reporting</th>
                <th className="px-4 py-2">Launch Coverage</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.professionReadiness.map((row) => (
                <tr key={row.profession} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium text-[var(--theme-heading-text)]">
                    {formatProfession(row.profession)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{row.competencyCount}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{row.badgeCount}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{row.certificateCount}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${row.institutionalReady ? "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] text-[var(--semantic-success)]" : "border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] text-[var(--semantic-warning)]"}`}>
                      {row.institutionalReady ? "Ready" : "Needs Badge Coverage"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${row.launchReady ? "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] text-[var(--semantic-success)]" : "border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] text-[var(--semantic-warning)]"}`}>
                      {row.launchReady ? "Mapped" : "Incomplete"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="nn-card p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Badge Coverage</h2>
          <div className="mt-4 space-y-3">
            {DIGITAL_BADGES.map((badge) => (
              <div key={badge.id} className="rounded-lg border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-[var(--theme-heading-text)]">{badge.name}</p>
                  <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] px-2 py-0.5 text-xs font-semibold text-[var(--semantic-info)]">
                    Evidence-Based
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Methods: {badge.requiredMethods.join(", ")} · Minimum mastery: {Math.round(badge.minimumMasteryScore * 100)}%
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="nn-card p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Internal Readiness Certificates</h2>
          <div className="mt-4 space-y-3">
            {READINESS_CERTIFICATES.map((certificate) => (
              <div key={certificate.id} className="rounded-lg border border-border p-3">
                <p className="font-semibold text-[var(--theme-heading-text)]">{certificate.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatProfession(certificate.profession)} · Minimum readiness {Math.round(certificate.minimumOverallReadiness * 100)}%
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{certificate.disclaimer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10 nn-card overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">Highest Weighted Competencies</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Competency</th>
                <th className="px-4 py-2">Profession</th>
                <th className="px-4 py-2">Domain</th>
                <th className="px-4 py-2 text-right">Weight</th>
                <th className="px-4 py-2">Assessment Methods</th>
              </tr>
            </thead>
            <tbody>
              {topCompetencies.map((competency) => (
                <tr key={competency.id} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium text-[var(--theme-heading-text)]">{competency.name}</td>
                  <td className="px-4 py-3">{formatProfession(competency.profession)}</td>
                  <td className="px-4 py-3">{competency.domain.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{Math.round(competency.readinessWeight * 100)}%</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{competency.assessmentMethods.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
