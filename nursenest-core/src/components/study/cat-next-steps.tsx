import Link from "next/link";

/**
 * NextStepsCards — 3 action cards (spec §8) after a CAT session.
 *
 * Order: Review missed questions → Study weak topics → Retest readiness.
 * The "Study weak topics" card is content-aware: it points to questions
 * when lesson content is not yet ready, and to lessons when it is.
 */
export function NextStepsCards({
  testId,
  lessonsHref,
  readinessTier,
  lessonPrimaryReady,
}: {
  testId: string;
  lessonsHref: string;
  /** Derived from the CAT session score. Controls recommended study priority. */
  readinessTier?: "at_risk" | "borderline" | "likely_pass" | "unknown" | null;
  /** When true, lesson content is rich enough to recommend as a primary resource. */
  lessonPrimaryReady?: boolean | null;
}) {
  const isAtRisk = readinessTier === "at_risk";
  const isLikelyPass = readinessTier === "likely_pass";
  const showLessons = lessonPrimaryReady === true;

  // Card 2 content depends on content quality and readiness tier
  const topicCard = showLessons
    ? {
        title: "Review lessons for weak topics",
        desc: isAtRisk
          ? "Go deep on the topics where you struggled — lesson content is ready to help you build the clinical foundation."
          : "Structured lesson content can close remaining gaps before your next CAT.",
        cta: "Go to lessons",
        href: lessonsHref,
      }
    : {
        title: "Practice questions on weak topics",
        desc: isAtRisk
          ? "Targeted question drills are the highest-yield activity when lessons are still being expanded. Focus on your weakest categories."
          : "Drill weak areas with targeted questions — the fastest way to reinforce exam-ready thinking.",
        cta: "Practice questions",
        href: "/app/questions?preset=topic_drill",
        note: "Lesson content is being expanded and will be recommended as it becomes complete.",
      };

  const retestLabel = isLikelyPass
    ? "Confirm your readiness"
    : isAtRisk
      ? "Retest after focused study"
      : "Retest your readiness";

  const retestDesc = isLikelyPass
    ? "Run another CAT to confirm consistency — multiple sessions give the most reliable readiness signal."
    : isAtRisk
      ? "After a focused question and flashcard session, rerun the CAT to measure real progress."
      : "Take another CAT after review to see if your score and stability improve.";

  const cards = [
    {
      step: "01",
      title: "Review missed questions",
      desc: "Go through the questions that lowered your score and read the explanations carefully.",
      cta: "Review questions",
      href: `/app/practice-tests/${testId}/results`,
      primary: true,
    },
    {
      step: "02",
      title: topicCard.title,
      desc: topicCard.desc,
      note: "note" in topicCard ? topicCard.note : undefined,
      cta: topicCard.cta,
      href: topicCard.href,
      primary: false,
    },
    {
      step: "03",
      title: retestLabel,
      desc: retestDesc,
      cta: "Start another CAT",
      href: "/app/practice-tests",
      primary: false,
    },
  ] as const;

  return (
    <div className="nn-cat-results__section">
      <h2 className="nn-cat-results__section-title">What To Do Next</h2>
      {!showLessons && (
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Practice questions are your primary resource right now — lesson content is being expanded and will
          automatically become the recommended path as depth increases.
        </p>
      )}
      <div className="nn-cat-next-steps-grid">
        {cards.map(({ step, title, desc, cta, href, primary, ...rest }) => {
          const note = "note" in rest ? rest.note : undefined;
          return (
            <div key={step} className="nn-cat-next-step-card">
              <p className="nn-cat-next-step-card__num">Step {step}</p>
              <p className="nn-cat-next-step-card__title">{title}</p>
              <p className="nn-cat-next-step-card__desc">{desc}</p>
              {note && (
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground/80">{note}</p>
              )}
              <div className="nn-cat-next-step-card__action">
                <Link
                  href={href}
                  className={`${primary ? "nn-btn-primary" : "nn-btn-secondary"} inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold shadow-none`}
                >
                  {cta}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
