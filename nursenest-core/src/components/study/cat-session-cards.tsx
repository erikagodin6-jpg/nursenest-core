import { Activity, Stethoscope, Target } from "lucide-react";
import { StudyCard } from "@/components/ui/study-card";
import type { CardVariant } from "@/components/ui/study-card";
import type { LucideIcon } from "lucide-react";

type SessionCardDef = {
  key: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  variant: CardVariant;
  ctaVariant: "primary" | "secondary";
  extraClass?: string;
};

const SESSION_CARDS: SessionCardDef[] = [
  {
    key: "diagnostic",
    icon: Activity,
    title: "Diagnostic CAT",
    description:
      "Identifies your baseline ability across all topic areas — ideal for your first session.",
    cta: "Start diagnostic",
    variant: "default",
    ctaVariant: "secondary",
    extraClass: "nn-exam-hub-study-card--cat",
  },
  {
    key: "simulation",
    icon: Stethoscope,
    title: "Exam Simulation CAT",
    description:
      "Closest to the real NCLEX experience — adaptive difficulty, full session length.",
    cta: "Start exam simulation",
    variant: "featured",
    ctaVariant: "primary",
  },
  {
    key: "weak-areas",
    icon: Target,
    title: "Weak Areas CAT",
    description:
      "Focuses on your lowest-performing topics to close gaps before exam day.",
    cta: "Target weak areas",
    variant: "default",
    ctaVariant: "secondary",
    extraClass: "nn-exam-hub-study-card--cat",
  },
];

type Props = {
  /** href used for all session card CTAs — resolved from auth/entitlement state by the page. */
  ctaHref: string;
};

export function CatSessionCards({ ctaHref }: Props) {
  return (
    <section className="mt-8" aria-labelledby="cat-sessions-heading">
      <span className="nn-marketing-label">Start a session</span>
      <h2
        id="cat-sessions-heading"
        className="nn-marketing-h2 mt-2 text-[var(--theme-heading-text)]"
      >
        Choose your session type
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-2xl text-[var(--theme-muted-text)]">
        Select a session that matches your study goal. Each type uses the same adaptive engine.
      </p>

      <ul className="mt-6 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3 md:gap-6">
        {SESSION_CARDS.map((card) => (
          <li key={card.key}>
            <StudyCard
              surface="hub"
              variant={card.variant}
              href={ctaHref}
              icon={card.icon}
              title={card.title}
              description={card.description}
              cta={card.cta}
              ctaVariant={card.ctaVariant}
              className={card.extraClass}
              ariaLabel={card.title}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
