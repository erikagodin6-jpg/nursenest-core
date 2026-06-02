import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { LearnerStudyPageShell } from "./learner-study-page-shell";

type SharedStudyMode = "flashcards" | "practice-exam" | "cat" | "lesson" | "review";

type SharedStudySetupLayoutProps = {
  children: ReactNode;
  mode: SharedStudyMode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

export function SharedStudySetupLayout({
  children,
  mode,
  className,
  ...rest
}: SharedStudySetupLayoutProps) {
  return (
    <LearnerStudyPageShell
      {...rest}
      className={className}
      data-nn-shared-study-setup-layout
      data-nn-shared-study-mode={mode}
    >
      {children}
    </LearnerStudyPageShell>
  );
}

export function SharedStudySetupSurface({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"section">, "className" | "children">) {
  return (
    <section
      {...rest}
      className={[
        "relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_8%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-nn-shared-study-setup-surface
    >
      {children}
    </section>
  );
}
