import type { ReactNode } from "react";
import { PathwayHero } from "@/components/study/pathway-hero";

type CtaButton = {
  label: string;
  href: string;
  variant: "primary" | "outline" | "ghost";
};

type Props = {
  title: string;
  subtitle: string;
  toolbar?: ReactNode;
  /** Optional CTA group rendered in the hero (e.g. Start / Browse / Sign up). */
  ctas?: CtaButton[];
  /** Optional back link shown above the title. */
  backLink?: { label: string; href: string };
  children: ReactNode;
};

/**
 * Page shell for lessons hub pages.
 * Delegates to the shared PathwayHero so the lessons and questions hubs stay visually unified.
 *
 * Uses a `<div>` (not `<main>`): marketing layouts already expose a single document `<main>`;
 * learner `(learner)/layout` uses `#nn-learner-main` — nested `<main>` breaks landmark audits and E2E.
 */
export function LessonsPageShell({ title, subtitle, toolbar, ctas, backLink, children }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <PathwayHero
        title={title}
        subtitle={subtitle}
        toolbar={toolbar}
        ctas={ctas}
        backLink={backLink}
      />
      <div className="mt-3">{children}</div>
    </div>
  );
}
