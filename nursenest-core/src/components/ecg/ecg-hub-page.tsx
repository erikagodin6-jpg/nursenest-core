import Link from "next/link";
import type { EcgCatalogEntry } from "@/lib/ecg/ecg-catalog";
import type { EcgUrlSegment } from "@/lib/ecg/ecg-types";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { ecgModuleUnlocked } from "@/lib/ecg/ecg-access";
import type { EcgStudyLinks } from "@/lib/ecg/ecg-study-links";
import { EcgEducationalDisclaimer } from "@/components/ecg/ecg-educational-disclaimer";
import { EcgRhythmStrip } from "@/components/ecg/ecg-rhythm-strip";

export type EcgHubPageProps = {
  segment: EcgUrlSegment;
  entries: EcgCatalogEntry[];
  lessonAccess: AccessScope | "error";
  studyLinks: EcgStudyLinks;
};

function ecgBase(segment: EcgUrlSegment) {
  return `/app/${segment}/ecg`;
}

export function EcgHubPage({ segment, entries, lessonAccess, studyLinks }: EcgHubPageProps) {
  const base = ecgBase(segment);
  const accessError = lessonAccess === "error";
  const showRnLabs = segment === "rn";

  return (
    <div className="space-y-6" data-nn-ecg-hub>
      <header className="nn-learner-page-hero space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--semantic-brand)]">ECG suite</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.75rem]">
          Rhythm interpretation & telemetry practice
        </h1>
        <p className="max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Premium-included ECG curriculum: structured lessons, drills, and pathway-scoped depth. Strips are teaching
          schematics only.
        </p>
        <EcgEducationalDisclaimer />
        {accessError ? (
          <p className="text-sm text-[var(--semantic-warning)]">
            We could not verify your subscription right now. Free previews stay open; retry shortly for full modules.
          </p>
        ) : null}
      </header>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href={`${base}/practice`}
          className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 font-medium text-[var(--semantic-text-primary)] hover:border-[var(--semantic-brand)]"
        >
          Timed practice
        </Link>
        {showRnLabs ? (
          <>
            <Link
              href={`${base}/flashcards`}
              className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 font-medium text-[var(--semantic-text-primary)] hover:border-[var(--semantic-brand)]"
            >
              ECG flashcards hub
            </Link>
            <Link
              href={`${base}/telemetry-simulator`}
              className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 font-medium text-[var(--semantic-text-primary)] hover:border-[var(--semantic-brand)]"
            >
              Telemetry simulator
            </Link>
          </>
        ) : null}
        <Link
          href={studyLinks.questionBankHref}
          className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--semantic-surface))] px-3 py-1.5 font-medium text-[var(--semantic-text-primary)] hover:border-[var(--semantic-info)]"
        >
          Cardiovascular question bank
        </Link>
        <Link
          href="/app/account/report-card"
          className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] px-3 py-1.5 font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]"
        >
          Report card & progress
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Curriculum</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {entries.map((entry) => {
            const unlocked = ecgModuleUnlocked(entry, lessonAccess);
            return (
              <li key={entry.slug}>
                <article
                  className={`flex h-full flex-col rounded-xl border p-4 ${
                    unlocked
                      ? "border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{entry.title}</h3>
                      <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">
                        {entry.previewFree ? "Free preview" : unlocked ? "Premium" : "Premium — upgrade to unlock"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${
                        unlocked
                          ? "bg-[color-mix(in_srgb,var(--semantic-success)_16%,var(--semantic-surface-muted))] text-[var(--semantic-text-secondary)]"
                          : "bg-[color-mix(in_srgb,var(--semantic-warning)_18%,var(--semantic-surface-muted))] text-[var(--semantic-text-secondary)]"
                      }`}
                    >
                      {unlocked ? "Open" : "Locked"}
                    </span>
                  </div>
                  <div className="mt-3">
                    <EcgRhythmStrip rhythmId={entry.rhythmId} height={110} />
                  </div>
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-[var(--semantic-text-secondary)]">
                    {entry.clinicalBullets.slice(0, 3).map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {unlocked ? (
                      <Link href={`${base}/lessons/${entry.slug}`} className="text-sm font-semibold text-primary hover:underline">
                        Open lesson
                      </Link>
                    ) : (
                      <Link href="/pricing" className="text-sm font-semibold text-[var(--semantic-brand)] hover:underline">
                        View plans
                      </Link>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
