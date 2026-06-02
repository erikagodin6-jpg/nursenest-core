import type { Metadata } from "next";
import Link from "next/link";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import {
  buildLearnerCompetencyPassport,
  listCompetenciesForProfession,
  listEarnedBadges,
  listAvailableReadinessCertificates,
  type CompetencyProfession,
} from "@/lib/competencies/competency-registry";

export const metadata: Metadata = {
  title: "Competency Passport | NurseNest",
  robots: { index: false, follow: false },
};

const professionOptions: readonly CompetencyProfession[] = [
  "RN",
  "PN",
  "NP",
  "NEW_GRAD",
  "RESPIRATORY_THERAPY",
  "PARAMEDICINE",
  "MLT",
  "PT",
  "OT",
  "SOCIAL_WORK",
  "PSYCHOTHERAPY",
  "PSW",
];

function parseProfession(value: string | undefined): CompetencyProfession {
  return professionOptions.includes(value as CompetencyProfession)
    ? (value as CompetencyProfession)
    : "RN";
}

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

export default async function CompetencyPassportPage({
  searchParams,
}: {
  searchParams?: Promise<{ profession?: string }>;
}) {
  await getProtectedRouteSession("(student).app.(learner).account.competency-passport");
  const sp = (await searchParams) ?? {};
  const profession = parseProfession(sp.profession);
  const passport = buildLearnerCompetencyPassport({
    profession,
    evidence: [],
  });
  const badges = listEarnedBadges(passport);
  const certificates = listAvailableReadinessCertificates(passport);
  const competencyCount = listCompetenciesForProfession(profession).length;

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail kind="account-hub" pathname="/app/account" />

      <section className="nn-learner-page-hero">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">My Study Notebook · Competency</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--semantic-text-primary)]">Learner Competency Passport</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--semantic-text-secondary)]">
          Track measurable competency growth across knowledge, reasoning, simulations, clinical skills,
          documentation, and communication. Readiness certificates are internal NurseNest indicators only.
        </p>
      </section>

      <section className="nn-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
              Viewing {formatProfession(profession)}
            </p>
            <p className="text-xs text-[var(--semantic-text-secondary)]">
              {competencyCount} mapped competencies in this passport.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {professionOptions.slice(0, 6).map((option) => (
              <Link
                key={option}
                href={`/app/account/competency-passport?profession=${option}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  option === profession
                    ? "border-[color-mix(in_srgb,var(--semantic-brand)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,transparent)] text-[var(--semantic-brand)]"
                    : "border-border text-[var(--semantic-text-secondary)] hover:bg-muted"
                }`}
              >
                {formatProfession(option)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--semantic-text-secondary)]">Overall Readiness</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
            {Math.round(passport.overallReadiness * 100)}%
          </p>
        </div>
        <div className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--semantic-text-secondary)]">Earned</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
            {passport.competenciesEarned.length}
          </p>
        </div>
        <div className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--semantic-text-secondary)]">In Progress</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
            {passport.competenciesInProgress.length}
          </p>
        </div>
        <div className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--semantic-text-secondary)]">Needs Attention</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
            {passport.competenciesRequiringAttention.length}
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="nn-card p-5">
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Competencies Requiring Attention</h2>
          <div className="mt-4 space-y-3">
            {passport.competenciesRequiringAttention.map((item) => (
              <div key={item.competency.id} className="rounded-lg border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-[var(--semantic-text-primary)]">{item.competency.name}</p>
                  <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] px-2 py-0.5 text-xs font-semibold text-[var(--semantic-warning)]">
                    Needs Evidence
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
                  Required evidence: {item.missingMethods.join(", ")}.
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="nn-card p-5">
            <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Digital Badges</h2>
            <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
              {badges.length === 0
                ? "Badges appear after competency evidence meets the required mastery threshold."
                : `${badges.length} badge(s) earned.`}
            </p>
          </div>
          <div className="nn-card p-5">
            <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Readiness Certificates</h2>
            <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
              {certificates.length === 0
                ? "Certificates require earned competencies plus the minimum readiness threshold."
                : `${certificates.length} internal readiness certificate(s) available.`}
            </p>
            <p className="mt-3 text-xs text-[var(--semantic-text-secondary)]">
              Internal readiness indicators do not imply licensure, certification, legal scope, or employer credentialing.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
