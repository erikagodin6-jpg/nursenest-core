"use client";

import { useMemo, useState } from "react";
import { Activity, CheckCircle2, FileText, Target } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

/**
 * In-product proof block showing the real interaction model:
 * question -> answer selection -> rationale -> readiness feedback.
 */
export function HomePlatformPreviewSection() {
  const { locale } = useMarketingI18n();
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>("B");

  const options = useMemo(
    () =>
      [
        { id: "A", text: "Increase oxygen to 6 L/min and reassess in 20 minutes." },
        { id: "B", text: "Assess respiratory status now and notify the provider of acute decline." },
        { id: "C", text: "Administer the next PRN opioid dose to reduce anxiety-driven tachypnea." },
        { id: "D", text: "Delay reassessment until the next scheduled vital-sign check." },
      ] as const,
    [],
  );
  const correctAnswer = "B";
  const isCorrect = selectedAnswer === correctAnswer;
  const readinessBands = [
    { label: "Readiness", value: 72, toneClass: "nn-progress-fill-semantic-readiness" },
    { label: "Clinical Safety", value: 79, toneClass: "nn-progress-fill-semantic-success" },
    { label: "Priority Decisions", value: 66, toneClass: "nn-progress-fill-semantic-info" },
    { label: "Pharmacology", value: 58, toneClass: "nn-progress-fill-semantic-warning" },
  ] as const;
  const weakAreas = ["Pharmacology", "Cardiac Rhythm", "Delegation"] as const;

  return (
    <section
      id="home-platform-preview"
      className="nn-section-block scroll-mt-20 border-y border-[var(--border-subtle)] bg-[var(--bg-card)]"
      aria-labelledby="home-platform-preview-heading"
      data-testid="section-home-platform-carousel"
    >
      <div className="nn-section-shell">
        <header className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
          <p className="nn-marketing-caption font-medium tracking-wide text-[color-mix(in_srgb,var(--theme-primary)_78%,var(--theme-heading-text))]">
            {formatTitleCase("Product Proof", locale)}
          </p>
          <h2 id="home-platform-preview-heading" className="nn-marketing-h2 mt-2 text-balance">
            {formatTitleCase("Experience The Platform Workflow", locale)}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-2xl text-pretty text-[var(--theme-muted-text)]">
            {formatSentenceCase("Walk through the same interaction loop learners use every day: answer, review rationale, then act on readiness feedback.", locale)}
          </p>
        </header>
        <div className="mx-auto grid w-full max-w-5xl gap-4 md:grid-cols-2">
          <article className="nn-card-system nn-card-system-pad">
            <span className="nn-card-system__icon mb-2">
              <FileText className="nn-icon-md text-[var(--semantic-brand)]" aria-hidden />
            </span>
            <p className="nn-card-system__eyebrow">{formatTitleCase("Real Question Card", locale)}</p>
            <h3 className="nn-card-system__title">{formatTitleCase("Question And Answer Selection", locale)}</h3>
            <p className="nn-card-system__description">
              {formatSentenceCase("Exam-style prompts with pathway-specific decision making and realistic distractors.", locale)}
            </p>
            <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold text-[var(--palette-text)]">
                {formatSentenceCase("A postoperative learner reports new shortness of breath, oxygen saturation of 88%, and increasing restlessness. What is the best immediate nursing action?", locale)}
              </p>
              <ul className="mt-3 space-y-2">
                {options.map((option) => {
                  const active = selectedAnswer === option.id;
                  return (
                    <li key={option.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedAnswer(option.id)}
                        className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                          active
                            ? "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--surface))] text-[var(--palette-text)]"
                            : "border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--palette-text-muted)] hover:border-[var(--semantic-brand)] hover:text-[var(--palette-text)]"
                        }`}
                      >
                        <span className="font-semibold">{option.id}.</span> {option.text}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </article>

          <article className="nn-card-system nn-card-system-pad">
            <span className="nn-card-system__icon mb-2">
              <CheckCircle2 className="nn-icon-md text-[var(--semantic-success)]" aria-hidden />
            </span>
            <p className="nn-card-system__eyebrow">{formatTitleCase("Rationale Block", locale)}</p>
            <h3 className="nn-card-system__title">{formatTitleCase("Full Rationale Explanation", locale)}</h3>
            <p className="nn-card-system__description">
              {formatSentenceCase("Every option receives feedback so learners understand why an answer is safe or unsafe.", locale)}
            </p>
            <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
              <p className={`text-sm font-semibold ${isCorrect ? "text-[var(--semantic-success)]" : "text-[var(--semantic-warning)]"}`}>
                {isCorrect
                  ? formatTitleCase("Correct: Immediate respiratory assessment and escalation.", locale)
                  : formatTitleCase("Recommended: Assess and escalate immediately.", locale)}
              </p>
              <p className="mt-2 text-sm text-[var(--palette-text-muted)]">
                {formatSentenceCase("This client shows acute deterioration (hypoxemia, restlessness, respiratory change). Priority is immediate assessment and provider notification before additional sedatives or delayed checks.", locale)}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--palette-text-muted)]">
                <li>- {formatSentenceCase("Option A delays escalation while the patient is unstable.", locale)}</li>
                <li>- {formatSentenceCase("Option C risks worsening respiratory suppression.", locale)}</li>
                <li>- {formatSentenceCase("Option D postpones action despite high-risk symptoms.", locale)}</li>
              </ul>
            </div>
          </article>

          <article className="nn-card-system nn-card-system-pad md:col-span-2">
            <span className="nn-card-system__icon mb-2">
              <Activity className="nn-icon-md text-[var(--semantic-info)]" aria-hidden />
            </span>
            <p className="nn-card-system__eyebrow">{formatTitleCase("Performance Summary", locale)}</p>
            <h3 className="nn-card-system__title">{formatTitleCase("Readiness, Weak Areas, And Adaptive Feedback", locale)}</h3>
            <p className="nn-card-system__description">
              {formatSentenceCase("After each session, learners get clear readiness metrics, weak-area targeting, and next-step guidance.", locale)}
            </p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                <p className="text-sm font-semibold text-[var(--palette-text)]">{formatTitleCase("Readiness Snapshot", locale)}</p>
                <ul className="mt-3 space-y-3">
                  {readinessBands.map((band) => (
                    <li key={band.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-[var(--palette-text-muted)]">{formatTitleCase(band.label, locale)}</span>
                        <span className="font-semibold text-[var(--palette-text)]">{band.value}%</span>
                      </div>
                      <div className="nn-progress-track-semantic">
                        <span
                          className={`nn-progress-fill ${band.toneClass}`}
                          style={{ width: `${band.value}%` }}
                          aria-hidden
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                <p className="text-sm font-semibold text-[var(--palette-text)]">{formatTitleCase("Weak Areas To Prioritize", locale)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {weakAreas.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-3 py-1 text-xs font-semibold text-[var(--pill-fg)]"
                    >
                      <Target className="mr-1.5 h-3 w-3" aria-hidden />
                      {formatTitleCase(topic, locale)}
                    </span>
                  ))}
                </div>
                <p className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-3 text-sm text-[var(--palette-text-muted)]">
                  {formatSentenceCase("Adaptive recommendation: complete a 15-question focused set on pharmacology, then run a readiness check to validate improvement.", locale)}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
