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
      className="border-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--border))]"
    />
  );
}
