import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ClipboardList, Timer, LineChart } from "lucide-react";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import {
  BROWSE_LESSONS_CTA,
  BROWSE_QUESTIONS_CTA,
  PRIMARY_CTA,
  SECONDARY_CTA,
  TERTIARY_CTA,
} from "@/lib/copy/cta-copy";

type ModeCard = {
  icon: LucideIcon;
  /** Short card title */
  title: string;
  /** 1-2 line description */
  description: string;
  /** CTA button label */
  cta: string;
  href: string;
  /** Colour accent: "success" = green, "brand" = blue, "purple" = CAT/strategy */
  accent: "success" | "brand" | "purple";
};

type Props = {
  /** Section heading */
  heading?: string;
  cards: [ModeCard, ModeCard, ModeCard];
};

const accentStyles = {
  success: {
    iconBg: "bg-[var(--semantic-panel-positive)]",
    icon: "text-[var(--semantic-success)]",
    btn: "bg-[var(--semantic-success)] text-white hover:opacity-90",
    border: "hover:border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))]",
  },
  brand: {
    iconBg: "bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]",
    icon: "text-[var(--semantic-brand)]",
    btn: "bg-[var(--semantic-brand)] text-white hover:opacity-90",
    border: "hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))]",
  },
  purple: {
    iconBg: "bg-[color-mix(in_srgb,var(--semantic-chart-5)_18%,var(--semantic-surface))]",
    icon: "text-[color-mix(in_srgb,var(--semantic-chart-5)_80%,var(--semantic-brand))]",
    btn: "border border-[color-mix(in_srgb,var(--semantic-chart-5)_40%,var(--semantic-border-soft))] text-[color-mix(in_srgb,var(--semantic-chart-5)_80%,var(--semantic-brand))] hover:bg-[color-mix(in_srgb,var(--semantic-chart-5)_8%,var(--semantic-surface))]",
    border: "hover:border-[color-mix(in_srgb,var(--semantic-chart-5)_30%,var(--semantic-border-soft))]",
  },
};

/**
 * Shared 3-card study mode section used on both Lessons and Questions hubs.
 * Cards are: Quick Practice, Full Session, Adaptive CAT — visually consistent across both pages.
 */
export function StudyModeCards({ heading = "Start studying", cards }: Props) {
  return (
    <section aria-labelledby="study-modes-heading" className="py-2">
      <h2
        id="study-modes-heading"
        className="mb-4 text-lg font-semibold text-[var(--theme-heading-text)]"
      >
        {formatTitleCase(heading)}
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => {
          const styles = accentStyles[card.accent];
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`nn-card-system nn-card-system-pad nn-card-system--interactive ${styles.border}`}
            >
              <span
                className={`nn-card-system__icon ${styles.iconBg}`}
                aria-hidden
              >
                <Icon className={`h-5 w-5 ${styles.icon}`} strokeWidth={1.75} />
              </span>
              <p className="nn-card-system__eyebrow">{formatTitleCase("Study Mode")}</p>
              <p className="nn-card-system__title">{formatTitleCase(card.title)}</p>
              <p className="nn-card-system__description">{formatSentenceCase(card.description)}</p>
              <Link
                href={card.href}
                className={`${styles.btn} nn-card-system__cta inline-flex min-h-[40px] justify-center rounded-full px-5 py-2 transition-opacity`}
              >
                {formatTitleCase(card.cta)}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Default card definitions for the questions hub. Override hrefs as needed. */
export function defaultStudyModeCards(opts: {
  quickHref: string;
  fullHref: string;
  catHref: string;
  pathwayShortName: string;
}): [ModeCard, ModeCard, ModeCard] {
  return [
    {
      icon: Timer,
      title: "Quick Practice",
      description: `Short focused sets scoped to ${opts.pathwayShortName}. Pick up where you left off anytime.`,
      cta: PRIMARY_CTA,
      href: opts.quickHref,
      accent: "success",
    },
    {
      icon: ClipboardList,
      title: "Full Session",
      description: "Work through a full timed block of board-style vignettes with rationales after each item.",
      cta: SECONDARY_CTA,
      href: opts.fullHref,
      accent: "brand",
    },
    {
      icon: LineChart,
      title: "Adaptive CAT",
      description: "Computer-adaptive test that adjusts difficulty in real time—closest to exam day conditions.",
      cta: PRIMARY_CTA,
      href: opts.catHref,
      accent: "purple",
    },
  ];
}

/** Default card definitions for the lessons hub (emphasis on reading, then practising). */
export function defaultLessonModeCards(opts: {
  lessonsHref: string;
  questionsHref: string;
  catHref: string;
  pathwayShortName: string;
}): [ModeCard, ModeCard, ModeCard] {
  return [
    {
      icon: ClipboardList,
      title: "Study Lessons",
      description: `Structured clinical lessons scoped to ${opts.pathwayShortName}, grouped by body system.`,
      cta: BROWSE_LESSONS_CTA,
      href: opts.lessonsHref,
      accent: "brand",
    },
    {
      icon: Timer,
      title: "Practice Questions",
      description: "Board-style vignettes and rationales scoped to this exam after each lesson topic.",
      cta: BROWSE_QUESTIONS_CTA,
      href: opts.questionsHref,
      accent: "success",
    },
    {
      icon: LineChart,
      title: "Adaptive CAT",
      description: "Computer-adaptive exam simulation that adjusts difficulty in real time.",
      cta: TERTIARY_CTA,
      href: opts.catHref,
      accent: "purple",
    },
  ];
}
