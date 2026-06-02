"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type ClinicalSkillsLearningBlockTone = "neutral" | "info" | "success" | "warning" | "danger" | "brand";

const TONE_VARS: Record<ClinicalSkillsLearningBlockTone, string> = {
  neutral: "var(--semantic-chart-4)",
  info: "var(--semantic-info)",
  success: "var(--semantic-success)",
  warning: "var(--semantic-warning)",
  danger: "var(--semantic-danger)",
  brand: "var(--semantic-brand)",
};

export function ClinicalSkillsLearningBlock({
  title,
  eyebrow,
  tone = "neutral",
  icon: Icon,
  children,
  id,
}: {
  title: string;
  eyebrow?: string;
  tone?: ClinicalSkillsLearningBlockTone;
  icon?: LucideIcon;
  children: ReactNode;
  id?: string;
}) {
  const hue = TONE_VARS[tone];
  return (
    <section
      id={id}
      className="nn-clinical-skills-block"
      style={
        {
          "--nn-clinical-skills-block-hue": hue,
        } as React.CSSProperties
      }
    >
      <header className="nn-clinical-skills-block__head">
        {Icon ? (
          <span className="nn-clinical-skills-block__icon" aria-hidden>
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <div className="min-w-0">
          {eyebrow ? <p className="nn-clinical-skills-block__eyebrow">{eyebrow}</p> : null}
          <h2 className="nn-clinical-skills-block__title">{title}</h2>
        </div>
      </header>
      <div className="nn-clinical-skills-block__body">{children}</div>
    </section>
  );
}

export function ClinicalSkillsChipList({ items, variant = "default" }: { items: string[]; variant?: "default" | "medication" | "escalation" }) {
  return (
    <ul className={`nn-lab-chip-list nn-lab-chip-list--${variant}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
