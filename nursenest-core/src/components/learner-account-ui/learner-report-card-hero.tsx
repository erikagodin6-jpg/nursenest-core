import type { ReactNode } from "react";
import { LearnerAccountPageHero } from "./learner-account-page-hero";

export function LearnerReportCardHero({
  title,
  intro,
  children,
}: {
  title: ReactNode;
  intro: ReactNode;
  children?: ReactNode;
}) {
  return (
    <LearnerAccountPageHero
      title={title}
      description={intro}
      actions={children}
      className="border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_96%,var(--semantic-panel-muted))] shadow-[var(--semantic-shadow-soft)]"
    />
  );
}
