"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { stripRedundantMcqLetterPrefix } from "@/lib/questions/strip-mcq-option-letter-prefix";
import { ChevronDown, ChevronUp, Gem } from "lucide-react";

type StackLabels = {
  answerHeading?: string;
  whyCorrectHeading?: string;
  whyIncorrectHeading?: string;
  takeawayHeading?: string;
};

/* Derive a 1-2 sentence memory hook from the rationale / answer text. */
function buildMemoryHook(text: string): string | null {
  const clean = String(text ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return null;
  const sentences = clean.match(/[^.!?]+[.!?]+/g) ?? [];
  const hook = sentences.slice(0, 2).join(" ").trim();
  return hook.length > 20 ? hook : null;
}

/* Build an exam-strategy tip from item kind and question stem cues. */
function buildExamTip(exam: ExamMicroQuestionPayload | null | undefined, pathwayLabel: string): string | null {
  if (!exam) return null;
  const kind = (exam.itemKind ?? "").toLowerCase();
  const stem = (exam.questionStem ?? "").toLowerCase();

  if (kind.includes("priority") || stem.includes("priority") || stem.includes("first action")) {
    return `${pathwayLabel} questions that ask "which action is the priority" test your ability to identify the highest-risk clinical cue. Use the ABCs and Maslow's hierarchy as your decision framework.`;
  }
  if (kind.includes("delegation") || stem.includes("delegate") || stem.includes("unlicensed")) {
    return `${pathwayLabel} delegation questions assess scope of practice. Delegate stable, predictable tasks to UAP. Keep assessment, teaching, and unstable patients with the RN.`;
  }
  if (stem.includes("contraindicated") || stem.includes("avoid")) {
    return `${pathwayLabel} "contraindicated" questions often test safety knowledge. Eliminate options that worsen the underlying condition or mask a critical symptom.`;
  }
  if (stem.includes("sata") || exam.answerOptions?.length > 4) {
    return `${pathwayLabel} Select-All-That-Apply items are scored all-or-nothing. Treat each option as a standalone true/false — do not look for patterns.`;
  }
  if (stem.includes("medication") || stem.includes("drug") || stem.includes("administer")) {
    return `${pathwayLabel} pharmacology questions reward knowing mechanism of action, not just drug names. Ask yourself: what system does this drug affect, and what should I monitor?`;
  }
  return null;
}

/* Collapsible section for mobile with smooth expand. */
function CollapsibleSection({
  label,
  colorClass,
  defaultOpen = true,
  children,
}: {
  label: string;
  colorClass: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        className={`flex w-full items-center justify-between gap-2 sm:cursor-default sm:pointer-events-none ${colorClass}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
        <span className="sm:hidden">
          {open
            ? <ChevronUp className="h-3.5 w-3.5" aria-hidden />
            : <ChevronDown className="h-3.5 w-3.5" aria-hidden />}
        </span>
      </button>
      <div className={open ? "block" : "hidden sm:block"}>
        {children}
      </div>
    </div>
  );
}

export function FlashcardStudyRevealPanels({
  exam,
  answer,
  explanation,
  pearl,
  labels,
  examPathwayLabel = "NCLEX",
  onRationaleOpened,
}: {
  exam?: ExamMicroQuestionPayload | null;
  answer: string;
  explanation?: string;
  pearl?: string | null;
  labels?: StackLabels;
  /** "NCLEX" | "REx-PN" | "CNPLE" — drives Exam Tip badge label. */
  examPathwayLabel?: string;
  onRationaleOpened?: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    onRationaleOpened?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const correctOptionText = exam
    ? stripRedundantMcqLetterPrefix(
        exam.answerOptions.find((o) => o.letter === exam.correctLetter)?.text ?? "",
      )
    : "";

  const whyCorrect =
    (explanation && String(explanation).trim()) ||
    (exam?.rationaleCorrect && String(exam.rationaleCorrect).trim()) ||
    "";

  const pearlText = pearl?.trim() || null;
  const memoryHook = buildMemoryHook(whyCorrect || answer);
  const examTip = buildExamTip(exam, examPathwayLabel);

  return (
    <motion.div
      className="nn-flashcard-reveal-stack nn-flashcard-reveal-stack--premium space-y-3"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { type: "spring", stiffness: 280, damping: 28, mass: 0.8 }}
    >
      {/* ── 1. Correct Answer ──────────────────────────────────────────── */}
      <section className="nn-rationale-section nn-rationale-section--answer rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)]">
        <CollapsibleSection
          label={labels?.answerHeading ?? "Correct answer"}
          colorClass="text-[var(--semantic-success)]"
          defaultOpen
        >
          <div className="mt-2 flex items-start gap-2">
            {exam?.correctLetter ? (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--semantic-success)] text-xs font-bold nn-text-on-solid-fill">
                {exam.correctLetter}
              </span>
            ) : null}
            <span className="text-base font-medium leading-relaxed text-[var(--semantic-text-primary)]">
              {correctOptionText || answer}
            </span>
          </div>
        </CollapsibleSection>
      </section>

      {/* ── 2. Clinical Pearl ──────────────────────────────────────────── */}
      {pearlText ? (
        <section className="nn-flashcard-rationale-key-concept" aria-label="Clinical Pearl">
          <span className="nn-clinical-pearl-label">
            <Gem className="h-3.5 w-3.5" aria-hidden />
            Clinical Pearl
          </span>
          <div className="text-sm leading-relaxed text-[var(--semantic-text-primary)] font-semibold">
            <FlashcardRichContent text={pearlText} />
          </div>
        </section>
      ) : null}

      {/* ── 3. Why This Is Correct ────────────────────────────────────── */}
      {whyCorrect ? (
        <section className="nn-rationale-section nn-rationale-section--why-correct rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)]">
          <CollapsibleSection
            label={labels?.whyCorrectHeading ?? "Why This Is Correct"}
            colorClass="text-[var(--semantic-text-secondary)]"
            defaultOpen
          >
            <div className="mt-2 nn-marketing-body-sm leading-relaxed text-[var(--semantic-text-primary)]">
              <FlashcardRichContent text={whyCorrect} />
            </div>
          </CollapsibleSection>
        </section>
      ) : null}

      {/* ── 4. Why Other Options Are Incorrect ───────────────────────── */}
      {exam?.rationaleIncorrect?.length ? (
        <section
          className="nn-rationale-section nn-rationale-section--distractors rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]"
          data-testid="flashcard-wrong-answer-menu"
        >
          <CollapsibleSection
            label={labels?.whyIncorrectHeading ?? "Why the Other Options Are Incorrect"}
            colorClass="text-[var(--semantic-text-secondary)]"
            defaultOpen={false}
          >
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-[var(--semantic-text-primary)]">
              {exam.rationaleIncorrect.map((r) => (
                <div key={r.letter} data-testid={`flashcard-distractor-${r.letter}`}>
                  <strong className="text-[var(--semantic-chart-2)]">{r.letter}</strong>: {r.rationale}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </section>
      ) : null}

      {/* ── 5. Exam Tip ───────────────────────────────────────────────── */}
      {examTip ? (
        <section className="nn-rationale-section nn-rationale-section--exam-tip rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_7%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)]">
          <CollapsibleSection
            label={`${examPathwayLabel} Tip`}
            colorClass="text-[var(--semantic-info)]"
            defaultOpen
          >
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-primary)]">
              {examTip}
            </p>
          </CollapsibleSection>
        </section>
      ) : null}

      {/* ── 6. Memory Hook ────────────────────────────────────────────── */}
      {memoryHook ? (
        <section className="nn-rationale-section nn-rationale-section--memory-hook rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)]">
          <CollapsibleSection
            label="Memory Hook"
            colorClass="text-[var(--semantic-brand)]"
            defaultOpen
          >
            <p className="mt-2 text-sm italic leading-relaxed text-[var(--semantic-text-primary)]">
              &ldquo;{memoryHook}&rdquo;
            </p>
          </CollapsibleSection>
        </section>
      ) : null}
    </motion.div>
  );
}
