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
    prompt: "Which hormone stimulates uterine contractions during labor?",
    answer: "Oxytocin",
    explanation: "Oxytocin stimulates rhythmic contraction of the uterine smooth muscle by binding to oxytocin receptors, increasing intracellular calcium and enhancing myometrial contractility. It plays a key role in cervical dilation and fetal descent during labor.",
    topic: "Reproductive Obstetrics",
    subtopic: "hormones",
    pathwayId: "ca-rpn-rex-pn",
    topicSlug: "reproductive-obstetrics",
    lessonHref: "/app/lessons/reproductive-obstetrics-lesson-3-2",
    lessonTitle: "Reproductive Obstetrics Lesson 3.2",
    examMicroQuestion: {
      itemKind: "STANDARD" as import("@prisma/client").FlashcardItemKind,
      questionStem: "Which hormone stimulates uterine contractions during labor?",
      answerOptions: [
        { letter: "A", text: "Progesterone" },
        { letter: "B", text: "Oxytocin" },
        { letter: "C", text: "Estrogen" },
        { letter: "D", text: "Prolactin" },
      ],
      correctLetter: "B",
      rationaleCorrect: "Oxytocin causes uterine smooth muscle contraction during labor and is used therapeutically for induction of labor and for the management of postpartum hemorrhage. Oxytocin stimulates rhythmic contraction of the uterine smooth muscle by binding to oxytocin receptors, increasing intracellular calcium and enhancing myometrial contractility. It plays a key role in cervical dilation and fetal descent during labor.",
      rationaleIncorrect: [
        { letter: "A", rationale: "Progesterone maintains pregnancy by inhibiting uterine contractions. During most of pregnancy, progesterone keeps the uterus relaxed." },
        { letter: "C", rationale: "Estrogen promotes uterine growth but does not directly stimulate contractions. It does increase oxytocin receptor sensitivity near term." },
        { letter: "D", rationale: "Prolactin stimulates milk production after delivery, not uterine contractions. It is released from the anterior pituitary." },
      ],
    },
  },
  {
    id: "preview-flash-2",
    prompt: "A nurse is caring for a client with acute decompensated heart failure. Which finding indicates the client is experiencing decreased cardiac output?",
    answer: "Cool, clammy extremities with narrowed pulse pressure",
    explanation: "Low perfusion and compensatory vasoconstriction reflect inadequate stroke volume. Diuretics and positioning optimize oxygenation and reduce preload.",
    topic: "Cardiovascular",
    subtopic: "heart-failure",
    pathwayId: "ca-rpn-rex-pn",
    topicSlug: "cardiovascular",
    lessonHref: "/app/lessons/cardiovascular-lesson-4-6",
    lessonTitle: "Cardiovascular Lesson 4.6",
    examMicroQuestion: {
      itemKind: "PRIORITY" as import("@prisma/client").FlashcardItemKind,
      questionStem: "A nurse is caring for a client with acute decompensated heart failure. Which finding indicates the client is experiencing decreased cardiac output?",
      answerOptions: [
        { letter: "A", text: "Bounding peripheral pulses" },
        { letter: "B", text: "Cool, clammy extremities with narrowed pulse pressure" },
        { letter: "C", text: "Elevated urine output greater than 30 mL/hr" },
        { letter: "D", text: "Blood pressure 140/90 mmHg" },
      ],
      correctLetter: "B",
      rationaleCorrect: "Cool, clammy extremities with narrowed pulse pressure indicate decreased cardiac output. In acute decompensated heart failure, avoid increasing fluid volume. Diuretics and positioning optimize oxygenation and reduce preload. Oxygen, elevating the head of the bed, and sodium restriction help improve oxygenation and reduce workload.",
      rationaleIncorrect: [
        { letter: "A", rationale: "Bounding pulses suggest adequate or increased cardiac output, not decreased. This would be inconsistent with acute heart failure presentation." },
        { letter: "C", rationale: "Elevated urine output greater than 30 mL/hr indicates good renal perfusion and adequate cardiac output, not reduced output." },
        { letter: "D", rationale: "Blood pressure 140/90 mmHg may reflect compensatory mechanisms but alone does not confirm decreased cardiac output. Pulse pressure and peripheral perfusion are more specific indicators." },
      ],
    },
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
