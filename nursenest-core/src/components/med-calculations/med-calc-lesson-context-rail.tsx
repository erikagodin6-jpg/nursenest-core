import Link from "next/link";
import type { MedCalcLessonDefinition, MedCalcStudyLinks } from "@/lib/med-calculations/med-calculations-engine";
import type { MedCalcTrack } from "@/lib/med-calculations/med-calculations-engine";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { medCalcProgressStatusLabel, medCalcTrackFocusLabel } from "@/lib/med-calculations/med-calc-display";
import { estimateMedCalcLessonMinutes, medCalcLessonBlockCount } from "@/lib/med-calculations/med-calc-workstation-nav";

export function MedCalcLessonContextRail({
  lesson,
  medTrack,
  studyLinks,
  progressStatus = "not_started",
  questionCount = 0,
}: {
  lesson: MedCalcLessonDefinition;
  medTrack: MedCalcTrack;
  studyLinks: MedCalcStudyLinks;
  progressStatus?: PathwayLessonProgressStatus;
  questionCount?: number;
}) {
  const minutes = estimateMedCalcLessonMinutes(medCalcLessonBlockCount(lesson));
  const safety = lesson.safetyConsiderations.slice(0, 4);
  const mistakes = lesson.commonMistakes.slice(0, 3);

  return (
    <aside className="nn-med-calc-lesson-rail" aria-label="Medication math context">
      <div className="nn-med-calc-lesson-rail__card">
        <h3>Learning state</h3>
        <ul className="mt-2 space-y-1 text-sm text-[var(--semantic-text-secondary)]">
          <li>
            <span className="font-semibold text-[var(--semantic-text-primary)]">Estimated time:</span> {minutes} min
          </li>
          <li>
            <span className="font-semibold text-[var(--semantic-text-primary)]">Track lens:</span> {medCalcTrackFocusLabel(medTrack)}
          </li>
          <li>
            <span className="font-semibold text-[var(--semantic-text-primary)]">Status:</span> {medCalcProgressStatusLabel(progressStatus)}
          </li>
          {questionCount > 0 ? (
            <li>
              <span className="font-semibold text-[var(--semantic-text-primary)]">Drill pool:</span> {questionCount} questions
            </li>
          ) : null}
        </ul>
      </div>

      {safety.length > 0 ? (
        <div className="nn-med-calc-lesson-rail__card">
          <h3>Safety highlights</h3>
          <ul>
            {safety.map((row) => (
              <li key={row}>{row}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {mistakes.length > 0 ? (
        <div className="nn-med-calc-lesson-rail__card">
          <h3>Common traps</h3>
          <ul>
            {mistakes.map((row) => (
              <li key={row}>{row}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="nn-med-calc-lesson-rail__card">
        <h3>Study loops</h3>
        <ul className="space-y-2">
          <li>
            <Link href={studyLinks.flashcardsHref} className="nn-med-calc-study-loop-link">
              Flashcards
            </Link>
          </li>
          <li>
            <Link href={studyLinks.questionsHref} className="nn-med-calc-study-loop-link">
              Practice questions
            </Link>
          </li>
          <li>
            <Link href={studyLinks.catHref} className="nn-med-calc-study-loop-link">
              Practice tests
            </Link>
          </li>
          <li>
            <Link href="/app/med-calculations" className="nn-med-calc-study-loop-link">
              Medication calculations overview
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
