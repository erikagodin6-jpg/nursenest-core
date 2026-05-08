import Link from "next/link";
import type { EcgStudyLinks } from "@/lib/ecg/ecg-study-links";
import { EcgEducationalDisclaimer } from "@/components/ecg/ecg-educational-disclaimer";
import { EcgRhythmStrip } from "@/components/ecg/ecg-rhythm-strip";

export function EcgFlashcardsHub({ studyLinks }: { studyLinks: EcgStudyLinks }) {
  return (
    <div className="space-y-4" data-nn-ecg-flashcards-hub>
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--semantic-brand)]">RN ECG flashcards</p>
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">Deck entry + cardio bank</h1>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          NurseNest flashcards reuse your pathway cardiovascular decks — spaced repetition stays in the main flashcard
          engine.
        </p>
        <EcgEducationalDisclaimer />
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Open flashcards</h2>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
            Jump to your cardio-tagged decks with pathway context preserved.
          </p>
          <Link href={studyLinks.flashcardsHref} className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">
            Go to flashcards
          </Link>
        </div>
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--semantic-surface))] p-4">
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Rhythm recall</h2>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">Pair morphology with naming before flipping cards.</p>
          <div className="mt-3">
            <EcgRhythmStrip rhythmId="pvc" height={120} />
          </div>
        </div>
      </div>
    </div>
  );
}
