import Link from "next/link";
import type { LabLessonDefinition, LabsStudyLinks } from "@/lib/labs/labs-engine";
import { estimateLabLessonMinutes, labProgressStatusLabel, labTrackFocusLabel } from "@/lib/labs/labs-display";
import type { LabTrack } from "@/lib/labs/labs-engine";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export function LabLessonContextRail({
  lesson,
  labTrack,
  studyLinks,
  progressStatus = "not_started",
  flashcardCount = 0,
}: {
  lesson: LabLessonDefinition;
  labTrack: LabTrack;
  studyLinks: LabsStudyLinks;
  progressStatus?: PathwayLessonProgressStatus;
  flashcardCount?: number;
}) {
  const minutes = estimateLabLessonMinutes(
    lesson.physiology.length +
      lesson.priorityThresholds.length +
      lesson.patternRecognition.length +
      lesson.microScenarios.length,
  );

  const relatedLabs = lesson.labConditionRelationships.slice(0, 5);
  const escalation = lesson.priorityThresholds.slice(0, 3);
  const trends = lesson.trendInterpretation.slice(0, 4);
  const ecgHint =
    lesson.category === "electrolytes" || lesson.category === "cardiac"
      ? "Pair with ECG rhythm review when potassium, calcium, or cardiac markers shift."
      : lesson.category === "abgs"
        ? "Use ABG trends with ventilation and perfusion cues from the telemetry hub."
        : null;

  return (
    <aside className="nn-labs-lesson-rail" aria-label="Related clinical context">
      <div className="nn-labs-lesson-rail__card">
        <h3>Learning state</h3>
        <ul className="mt-2 space-y-1 text-sm text-[var(--semantic-text-secondary)]">
          <li>
            <span className="font-semibold text-[var(--semantic-text-primary)]">Estimated time:</span> {minutes} min
          </li>
          <li>
            <span className="font-semibold text-[var(--semantic-text-primary)]">Track lens:</span>{" "}
            {labTrackFocusLabel(labTrack)}
          </li>
          <li>
            <span className="font-semibold text-[var(--semantic-text-primary)]">Status:</span>{" "}
            {labProgressStatusLabel(progressStatus)}
          </li>
          {flashcardCount > 0 ? (
            <li>
              <span className="font-semibold text-[var(--semantic-text-primary)]">Flashcards:</span> {flashcardCount}{" "}
              generated from this lesson
            </li>
          ) : null}
        </ul>
      </div>

      {escalation.length > 0 ? (
        <div className="nn-labs-lesson-rail__card">
          <h3>Escalation cues</h3>
          <ul>
            {escalation.map((row) => (
              <li key={row.label}>
                <strong className="text-[var(--semantic-text-primary)]">{row.label}</strong> — {row.threshold}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {relatedLabs.length > 0 ? (
        <div className="nn-labs-lesson-rail__card">
          <h3>Related labs</h3>
          <ul>
            {relatedLabs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {trends.length > 0 ? (
        <div className="nn-labs-lesson-rail__card">
          <h3>Trend interpretation</h3>
          <ul>
            {trends.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {ecgHint ? (
        <div className="nn-labs-lesson-rail__card">
          <h3>ECG association</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{ecgHint}</p>
          <Link href="/app/ecg" className="mt-3 inline-flex text-sm font-semibold text-[var(--semantic-brand)] hover:underline">
            Open ECG hub →
          </Link>
        </div>
      ) : null}

      <div className="nn-labs-lesson-rail__card">
        <h3>Study loops</h3>
        <ul className="space-y-2">
          <li>
            <Link href={studyLinks.flashcardsHref} className="text-sm font-semibold text-[var(--semantic-brand)] hover:underline">
              Flashcards
            </Link>
          </li>
          <li>
            <Link href={studyLinks.questionBankHref} className="text-sm font-semibold text-[var(--semantic-brand)] hover:underline">
              Practice questions
            </Link>
          </li>
          <li>
            <Link href={studyLinks.labDrillsHref} className="text-sm font-semibold text-[var(--semantic-brand)] hover:underline">
              Lab drills
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
