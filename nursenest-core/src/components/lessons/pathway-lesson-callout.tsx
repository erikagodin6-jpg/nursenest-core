"use client";

import type { ReactNode } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

export function PathwayLessonCallout({ kind, children }: { kind: "exam" | "clinical"; children: ReactNode }) {
  const { t } = useMarketingI18n();
  const label = kind === "exam" ? t("learner.lesson.callout.examTip") : t("learner.lesson.callout.clinicalInsight");

  return (
    <aside className={`nn-lesson-callout nn-lesson-callout--${kind}`} aria-label={label}>
      <p className="nn-lesson-callout__label">{label}</p>
      <div className="nn-lesson-callout__body">{children}</div>
    </aside>
  );
}
