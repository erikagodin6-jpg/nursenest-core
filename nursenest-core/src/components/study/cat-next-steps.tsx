import Link from "next/link";

/**
 * NextStepsCards — 3 equal-weight action cards (spec §8).
 *
 * Order: Review missed questions → Study weak topics → Retest readiness.
 * Card 1 uses a primary button; cards 2–3 use secondary.
 */
export function NextStepsCards({
  testId,
  lessonsHref,
}: {
  testId: string;
  lessonsHref: string;
}) {
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
      title: "Study weak topics",
      desc: "Focus your next study block on the weakest systems or concepts from this CAT.",
      cta: "Go to lessons",
      href: lessonsHref,
      primary: false,
    },
    {
      step: "03",
      title: "Retest your readiness",
      desc: "Take another CAT after review to see if your score and stability improve.",
      cta: "Start another CAT",
      href: "/app/practice-tests",
      primary: false,
    },
  ] as const;

  return (
    <div className="nn-cat-results__section">
      <h2 className="nn-cat-results__section-title">What To Do Next</h2>
      <div className="nn-cat-next-steps-grid">
        {cards.map(({ step, title, desc, cta, href, primary }) => (
          <div key={step} className="nn-cat-next-step-card">
            <p className="nn-cat-next-step-card__num">Step {step}</p>
            <p className="nn-cat-next-step-card__title">{title}</p>
            <p className="nn-cat-next-step-card__desc">{desc}</p>
            <div className="nn-cat-next-step-card__action">
              <Link
                href={href}
                className={`${primary ? "nn-btn-primary" : "nn-btn-secondary"} inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold shadow-none`}
              >
                {cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
