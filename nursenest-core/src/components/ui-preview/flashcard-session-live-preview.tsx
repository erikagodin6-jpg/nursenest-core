"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ExamSessionShell } from "@/components/exam/exam-session-shell";
import { ActiveStudySession, type ActiveStudyCard } from "@/components/study/active-study-session";
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS } from "@/lib/theme/theme-registry";

const THEME_IDS = new Set(THEME_OPTIONS.map((o) => o.id));

function resolveThemeParam(raw: string | null): string {
  const t = raw?.trim() ?? "";
  return THEME_IDS.has(t) ? t : NURSENEST_DEFAULT_THEME;
}

const MOCK_CARDS: ActiveStudyCard[] = [
  {
    id: "preview-flash-1",
    prompt:
      "A client post-thyroidectomy reports perioral numbness and carpopedal spasms. Which lab should the nurse correlate first?",
    answer: "Serum calcium — hypocalcemia from transient hypoparathyroidism is the immediate priority.",
    explanation:
      "Hypocalcemia drives neuromuscular irritability after thyroid surgery; treat symptoms while confirming labs.",
    topic: "Endocrine",
    subtopic: "postoperative-complications",
    pathwayId: "nclex-rn",
    topicSlug: "endocrine",
    sourceKey: "clinical_priority",
  },
  {
    id: "preview-flash-2",
    prompt: "Which assessment finding best suggests impaired cardiac output in acute HF?",
    answer: "Cool, clammy extremities with narrowed pulse pressure.",
    explanation: "Low perfusion and compensatory vasoconstriction reflect inadequate stroke volume.",
    topic: "Cardiovascular",
    subtopic: "heart-failure",
    pathwayId: "nclex-rn",
    topicSlug: "cardiovascular",
  },
];

function FlashcardSessionLivePreviewInner() {
  const sp = useSearchParams();
  const theme = useMemo(() => resolveThemeParam(sp.get("theme")), [sp]);

  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", theme);
    return () => {
      if (prev) document.documentElement.setAttribute("data-theme", prev);
      else document.documentElement.removeAttribute("data-theme");
    };
  }, [theme]);

  return (
    <div className="nn-flashcard-session-page mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="mb-4 text-center text-xs font-medium text-[var(--semantic-text-muted)]">
        QA preview · mock cards · theme <span className="tabular-nums">{theme}</span>
      </p>
      <ExamSessionShell
        immersive
        examMode="practice"
        className="nn-premium-flashcard-session-root nn-flashcard-study-premium"
      >
        <ActiveStudySession
          cards={MOCK_CARDS}
          header={{
            sessionTitle: "Clinical judgement · Preview deck",
            modeLabel: "Learn",
            categoriesLabel: "Multisystem · Safety · Labs",
            exitHref: "/preview/flashcard-session-live",
          }}
          layout="split"
        />
      </ExamSessionShell>
    </div>
  );
}

export function FlashcardSessionLivePreview() {
  return (
    <Suspense
      fallback={
        <div className="px-6 py-16 text-center text-sm text-[var(--semantic-text-muted)]">Loading preview…</div>
      }
    >
      <FlashcardSessionLivePreviewInner />
    </Suspense>
  );
}
