"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ecgQuestionTeachingVisible,
  parseEcgVideoExhibit,
  type EcgVideoQuestionMode,
  type EcgVideoQuestionPhase,
} from "@/lib/ecg-video-quiz/ecg-video-question";

export function EcgVideoQuestionMedia({
  exhibitData,
  images,
  mode,
  phase,
  className = "",
}: {
  exhibitData?: unknown;
  images?: unknown;
  mode: EcgVideoQuestionMode;
  phase: EcgVideoQuestionPhase;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const exhibit = useMemo(() => parseEcgVideoExhibit(exhibitData, images), [exhibitData, images]);
  if (!exhibit) return null;

  const showTeaching = ecgQuestionTeachingVisible(mode, phase);
  const source = exhibit.asset.url;

  return (
    <section
      data-testid="ecg-video-question-media"
      className={`mb-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] p-3 sm:p-4 ${className}`}
      aria-label="ECG rhythm clip"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-info)]">
          ECG rhythm clip
        </p>
        <p className="m-0 text-xs font-semibold text-[var(--semantic-text-muted)]">{exhibit.rhythmCategory}</p>
      </div>

      {source && !failed ? (
        <video
          className="mt-3 aspect-video w-full rounded-lg border border-[var(--semantic-border-soft)] bg-black object-contain"
          controls
          preload="metadata"
          poster={exhibit.asset.thumbnailUrl}
          aria-label={exhibit.asset.alt ?? exhibit.asset.caption ?? "ECG rhythm video clip"}
          onError={() => setFailed(true)}
        >
          <source src={source} type={exhibit.asset.mimeType} />
          {exhibit.asset.caption ?? exhibit.safeFallbackText}
        </video>
      ) : (
        <div
          data-testid="ecg-video-fallback"
          role="status"
          className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] px-4 py-3 text-sm text-[var(--semantic-text-primary)]"
        >
          {exhibit.safeFallbackText}
        </div>
      )}

      {exhibit.asset.caption ? (
        <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{exhibit.asset.caption}</p>
      ) : null}

      {showTeaching && exhibit.recognitionClues?.length ? (
        <div data-testid="ecg-recognition-clues" className="mt-4 rounded-lg bg-[var(--semantic-surface)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Key ECG recognition clues
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[var(--semantic-text-primary)]">
            {exhibit.recognitionClues.map((clue) => (
              <li key={clue}>{clue}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {showTeaching && exhibit.linkedLesson?.href ? (
        <Link
          href={exhibit.linkedLesson.href}
          data-testid="ecg-linked-lesson"
          className="mt-3 inline-flex min-h-10 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
        >
          {exhibit.linkedLesson.title ?? "Review linked ECG lesson"}
        </Link>
      ) : null}
    </section>
  );
}
