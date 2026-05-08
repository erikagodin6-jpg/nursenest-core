import Link from "next/link";
import type { EcgCatalogEntry } from "@/lib/ecg/ecg-catalog";
import type { EcgUrlSegment } from "@/lib/ecg/ecg-types";
import { ecgModuleUnlocked } from "@/lib/ecg/ecg-access";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { EcgEducationalDisclaimer } from "@/components/ecg/ecg-educational-disclaimer";
import { EcgRhythmStrip } from "@/components/ecg/ecg-rhythm-strip";

export type EcgLessonPageProps = {
  segment: EcgUrlSegment;
  entry: EcgCatalogEntry;
  lessonAccess: AccessScope | "error";
};

function base(segment: EcgUrlSegment) {
  return `/app/${segment}/ecg`;
}

export function EcgLessonPage({ segment, entry, lessonAccess }: EcgLessonPageProps) {
  const unlocked = ecgModuleUnlocked(entry, lessonAccess);
  return (
    <article className="space-y-6" data-nn-ecg-lesson>
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--semantic-brand)]">ECG lesson</p>
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">{entry.title}</h1>
        <EcgEducationalDisclaimer />
      </header>

      <EcgRhythmStrip rhythmId={entry.rhythmId} />

      {!unlocked ? (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_12%,var(--semantic-surface))] p-4">
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Premium module</p>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
            Included with Premium — unlock the full lesson narrative, drills, and case hooks inside NurseNest.
          </p>
          <Link href="/pricing" className="mt-3 inline-flex text-sm font-semibold text-[var(--semantic-brand)] hover:underline">
            View plans
          </Link>
        </div>
      ) : (
        <div className="prose prose-sm max-w-prose text-[var(--semantic-text-secondary)]">
          <p>
            This stub lesson anchors the rhythm you will see on exams and telemetry boards. Pair it with the{" "}
            <Link href={`${base(segment)}/practice`} className="font-semibold text-primary">
              timed practice
            </Link>{" "}
            surface and your cardiovascular question bank for interleaved retrieval.
          </p>
          <ul>
            {entry.clinicalBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p className="text-xs text-[var(--semantic-text-muted)]">
            Content is for exam preparation only; verify strips and clinical decisions with licensed protocols and
            mentors in real practice.
          </p>
        </div>
      )}
    </article>
  );
}
