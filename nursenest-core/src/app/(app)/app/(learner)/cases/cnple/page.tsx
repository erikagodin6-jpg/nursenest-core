import type { Metadata } from "next";
import Link from "next/link";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { listCnpleLoftCases } from "@/content/cases/cnple-case-catalog";
import { ScenarioStudyShell } from "@/components/scenarios/ScenarioStudyShell";

export const metadata: Metadata = {
  title: "CNPLE Clinical Cases | NurseNest",
  description:
    "CNPLE-aligned longitudinal clinical cases for Canadian NP exam preparation. Practice clinical judgment across primary care, prescribing safety, diagnostics, and acute deterioration.",
  robots: { index: false },
};

export default async function CnpleCaseCatalogPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).cases.cnple");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = userId ? await resolveEntitlementForPage(userId) : "error";
  const _premiumUnlocked = entitlement !== "error" && entitlement.hasAccess;

  const cases = listCnpleLoftCases();

  return (
    <ScenarioStudyShell
      eyebrow="CNPLE case studies"
      title="Canadian NP longitudinal clinical cases"
      subtitle="Multi-stage cases presenting evolving patient scenarios across primary care, prescribing safety, diagnostics, and acute deterioration. Built for Canada's single-classification NP model."
      pathwayId="ca-np-cnple"
    >
      <div className="space-y-3" data-nn-cnple-case-catalog="">
        {cases.map((c) => (
          <Link
            key={c.id}
            href={`/app/cases/cnple/${encodeURIComponent(c.id)}`}
            className="block rounded-2xl border px-5 py-4 shadow-[var(--semantic-shadow-soft)] transition-[border-color,box-shadow] hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))]"
            style={{
              borderColor: "color-mix(in srgb, var(--semantic-chart-2) 18%, var(--semantic-border-soft))",
              background: "color-mix(in srgb, var(--semantic-panel-cool) 10%, var(--semantic-surface))",
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
                  {c.tagline ?? c.primaryDomain.replace(/-/g, " ")}
                </p>
                <h2 className="mt-0.5 text-[15px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
                  {c.title}
                </h2>
                <p className="mt-1 text-[13px]" style={{ color: "var(--semantic-text-secondary)" }}>
                  {c.chiefComplaint}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <DifficultyPips difficulty={c.difficulty} />
                <p className="text-[12px]" style={{ color: "var(--semantic-text-muted)" }}>
                  {c.stepCount} steps · ~{c.estimatedMinutes} min
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[c.primaryDomain, ...c.secondaryDomains].slice(0, 4).map((d) => (
                <DomainPill key={d} domain={d} />
              ))}
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-[12px] leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
        CNPLE-aligned practice. Not official CNPLE content. Not affiliated with CCRNR.
      </p>
    </ScenarioStudyShell>
  );
}

function DifficultyPips({ difficulty }: { difficulty: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Difficulty ${difficulty} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full"
          style={{
            background: i <= difficulty ? "var(--semantic-brand)" : "var(--semantic-border-soft)",
          }}
        />
      ))}
    </div>
  );
}

function DomainPill({ domain }: { domain: string }) {
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{
        background: "color-mix(in srgb, var(--semantic-brand) 10%, transparent)",
        color: "var(--semantic-brand)",
      }}
    >
      {domain.replace(/-/g, " ")}
    </span>
  );
}
