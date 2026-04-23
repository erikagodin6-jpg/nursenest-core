"use client";

import { Ban, BookOpen, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { CatStudyFeedbackPayload, CatStudyFeedbackSection } from "@/lib/practice-tests/types";
import {
  PracticeIncorrectOptionRow,
  PracticeRationaleSection,
  PracticeRelatedLessons,
  RationaleFullFrame,
} from "@/components/study/practice-rationale-full-panel";

export type RationalePanelMode =
  | "waiting" // before the user submits their answer
  | "locked" // CAT test mode — rationale hidden until session ends
  | "feedback"; // CAT study mode — rationale available

function normHeading(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function sectionByHeading(sections: CatStudyFeedbackSection[], wanted: string): string {
  const n = normHeading(wanted);
  const hit = sections.find((s) => normHeading(s.heading) === n);
  return hit?.body?.trim() ?? "";
}

/** Parse lines like "A. …" / "B) …" from a combined distractor blob. */
function parseLetteredExplanations(body: string): Map<string, string> {
  const m = new Map<string, string>();
  const t = body.trim();
  if (!t) return m;
  for (const line of t.split(/\n+/)) {
    const mm = line.trim().match(/^([A-H])[\.\)]\s*(.+)$/i);
    if (mm) m.set(mm[1].toUpperCase(), mm[2].trim());
  }
  return m;
}

function WaitingPlaceholder({ mode }: { mode: "waiting" | "locked" }) {
  const { t } = useMarketingI18n();
  if (mode === "locked") {
    return (
      <div className="nn-practice-rationale-locked">
        <p className="nn-practice-rationale-locked__title">{t("learner.session.split.catRationaleLockedTitle")}</p>
        <p className="nn-practice-rationale-locked__body">{t("learner.session.split.rationaleLocked")}</p>
      </div>
    );
  }
  return (
    <div className="nn-practice-rationale-waiting">
      <BookOpen className="h-6 w-6 text-[var(--semantic-text-muted)]" aria-hidden />
      <p className="nn-practice-rationale-waiting__text">{t("learner.session.split.catRationaleWaitingTitle")}</p>
      <p className="nn-practice-rationale-waiting__sub">{t("learner.qbank.split.rationalePlaceholder")}</p>
    </div>
  );
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function RationaleReviewHeader() {
  return (
    <div className="mb-2 flex items-center gap-2 border-b border-[var(--semantic-border-soft)] pb-2.5">
      <BookOpen className="h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
      <h2 className="m-0 text-sm font-semibold text-[var(--semantic-brand)]">Rationale & Review</h2>
    </div>
  );
}

/**
 * RationalePanel — right column in CAT **study** sessions (same scroll frame + sections as linear practice).
 */
export function RationalePanel({
  mode,
  feedback,
  optionKeys,
  optionTexts,
}: {
  mode: RationalePanelMode;
  /** Available in "feedback" mode only — the scored item's study payload */
  feedback?: CatStudyFeedbackPayload | null;
  /** Canonical option keys in order (e.g. ["a","b","c","d"]) */
  optionKeys?: string[];
  /** Display texts in same order as optionKeys */
  optionTexts?: string[];
}) {
  return (
    <RationaleFullFrame>
      {mode !== "feedback" || !feedback ? (
        <WaitingPlaceholder mode={mode === "locked" ? "locked" : "waiting"} />
      ) : (
        <FeedbackContent feedback={feedback} optionKeys={optionKeys ?? []} optionTexts={optionTexts ?? []} />
      )}
    </RationaleFullFrame>
  );
}

function FeedbackContent({
  feedback,
  optionKeys,
  optionTexts,
}: {
  feedback: CatStudyFeedbackPayload;
  optionKeys: string[];
  optionTexts: string[];
}) {
  const correctSet = new Set(feedback.correctKeys);
  const sections = Array.isArray(feedback.sections) ? feedback.sections : [];

  const correctDisplayLines = feedback.correctKeys.map((k) => {
    const idx = optionKeys.indexOf(k);
    const letter = idx >= 0 ? (LETTERS[idx] ?? k.toUpperCase()) : k.toUpperCase();
    const text = idx >= 0 ? (optionTexts[idx] ?? k) : k;
    return { letter, text };
  });

  const incorrectOptions = optionKeys
    .map((k, i) => ({
      key: k,
      letter: LETTERS[i] ?? k.toUpperCase(),
      text: optionTexts[i] ?? k,
      index: i,
    }))
    .filter((o) => !correctSet.has(o.key));

  const whyCorrectFromSections =
    sectionByHeading(sections, "Why this is correct") ||
    sectionByHeading(sections, "Why this is Correct");
  const level1 = feedback.layers?.level1Short?.trim() ?? "";
  const level2 = feedback.layers?.level2Sections ?? [];
  const strategy = feedback.layers?.level3Strategy?.trim() ?? "";
  const level2Supplement = level2
    .filter((s) => {
      const h = normHeading(s.heading ?? "");
      if (!h) return Boolean(s.body?.trim());
      if (h.includes("why the other") || h.includes("incorrect options") || h.includes("distractor")) return false;
      if (h.includes("exam strategy")) return false;
      if (h === normHeading("Why this is correct")) return false;
      return true;
    })
    .map((s) => s.body?.trim())
    .filter(Boolean) as string[];
  const whyCorrectBody =
    whyCorrectFromSections.trim() ||
    [level1, ...level2Supplement].filter((p) => p && p.trim().length > 0).join("\n\n").trim();

  const distractorBlob =
    sectionByHeading(sections, "Why the other options are wrong") ||
    sectionByHeading(sections, "Why the other options are incorrect");
  const letterExplanations = parseLetteredExplanations(distractorBlob);

  const clinicalPearl = sectionByHeading(sections, "Clinical pearl");
  const clinicalTakeaway = sectionByHeading(sections, "Clinical takeaway");
  const keyTakeawayBlock = clinicalTakeaway || strategy;

  const relatedLessons = feedback.layers?.relatedLessons ?? [];

  const correctAnswerBlock: ReactNode =
    correctDisplayLines.length > 0 ? (
      <ul className="m-0 list-none space-y-1.5 p-0">
        {correctDisplayLines.map(({ letter, text }) => (
          <li key={letter} className="flex items-start gap-2 text-[0.9375rem] leading-snug text-[var(--semantic-text-primary)]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-info)]" aria-hidden />
            <span>
              <span className="font-bold text-[var(--semantic-info)]">{letter}.</span> {text}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-[var(--semantic-text-muted)]">Correct answer data is not on file.</p>
    );

  return (
    <>
      <RationaleReviewHeader />

      <PracticeRationaleSection variant="info" label="Correct Answer" icon={<CheckCircle2 className="h-3.5 w-3.5 text-[var(--semantic-info)]" aria-hidden />}>
        {correctAnswerBlock}
      </PracticeRationaleSection>

      {whyCorrectBody ? (
        <PracticeRationaleSection variant="muted" label="Why This Is Correct" icon={<Lightbulb className="h-3.5 w-3.5 text-[var(--semantic-warning)]" aria-hidden />}>
          <p className="m-0 whitespace-pre-wrap leading-relaxed">{whyCorrectBody}</p>
        </PracticeRationaleSection>
      ) : null}

      {incorrectOptions.length > 0 ? (
        <PracticeRationaleSection variant="muted" label="Why Other Options Are Incorrect" icon={<Ban className="h-3.5 w-3.5 text-[var(--semantic-danger)]" aria-hidden />}>
          {letterExplanations.size === 0 && distractorBlob.trim() ? (
            <p className="mb-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)] whitespace-pre-wrap">{distractorBlob}</p>
          ) : null}
          {incorrectOptions.map((o) => (
            <PracticeIncorrectOptionRow
              key={o.key}
              index={o.index}
              optionText={o.text}
              explanation={letterExplanations.get(o.letter) ?? undefined}
              optionTextTone="danger"
            />
          ))}
        </PracticeRationaleSection>
      ) : null}

      {clinicalPearl ? (
        <PracticeRationaleSection variant="pearl" label="Clinical Pearl" icon={<Sparkles className="h-3.5 w-3.5 text-[var(--semantic-warning)]" aria-hidden />}>
          <p className="m-0 leading-relaxed whitespace-pre-wrap">{clinicalPearl}</p>
        </PracticeRationaleSection>
      ) : null}

      {keyTakeawayBlock ? (
        <PracticeRationaleSection variant="takeaway" label="Key Takeaway" icon={<Sparkles className="h-3.5 w-3.5 text-[var(--semantic-brand)]" aria-hidden />}>
          <p className="m-0 leading-relaxed whitespace-pre-wrap">{keyTakeawayBlock}</p>
        </PracticeRationaleSection>
      ) : null}

      {relatedLessons.length > 0 ? <PracticeRelatedLessons lessons={relatedLessons} /> : null}

      {feedback.layers?.examFramingNote ? (
        <p className="text-xs leading-relaxed text-[var(--semantic-text-muted)]">{feedback.layers.examFramingNote}</p>
      ) : null}
    </>
  );
}
