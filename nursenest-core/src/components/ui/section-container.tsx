import type { ReactNode } from "react";

export type SectionTone = "neutral" | "primary" | "secondary" | "accent";

/**
 * One tone per section — maps to `.lv-section` + `data-tone` in `styles/learner-ds.css`.
 */
export function SectionContainer({
  as: Tag = "section",
  tone,
  id,
  "aria-labelledby": ariaLabelledBy,
  className = "",
  children,
}: {
  as?: "section" | "div" | "article";
  tone?: SectionTone;
  id?: string;
  "aria-labelledby"?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`lv-section ${className}`.trim()}
      {...(tone ? { "data-tone": tone } : {})}
    >
      {children}
    </Tag>
  );
}
