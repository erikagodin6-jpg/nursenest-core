import type { ReactNode } from "react";
import type { LearnerSurfaceTone } from "@/components/learner-ui/learner-surface-tone";

const PAD: Record<"none" | "sm" | "md" | "lg", string> = {
  none: "",
  sm: "nn-ls-surface--pad-sm",
  md: "nn-ls-surface--pad-md",
  lg: "nn-ls-surface--pad-lg",
};

/**
 * Token-based learner surface — cards, insets, and tinted sections.
 * Tones map to `learner-surface-primitives.css` (`data-nn-ls-tone`).
 */
export function LearnerSurface({
  tone = "secondary",
  padding = "md",
  radius = "xl",
  accentTop = false,
  shadow = true,
  className = "",
  children,
}: {
  tone?: LearnerSurfaceTone;
  padding?: keyof typeof PAD;
  /** `xl` = default study radius; `lg` = compact inset */
  radius?: "xl" | "lg";
  accentTop?: boolean;
  shadow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const padClass = PAD[padding];
  const radiusClass = radius === "lg" ? "nn-ls-surface--radius-lg" : "";
  const topClass = accentTop ? "nn-ls-surface--accent-top" : "";
  const shadowClass = shadow ? "" : "nn-ls-surface--shadow-none";
  return (
    <div
      data-nn-ls-tone={tone}
      className={`nn-ls-surface ${padClass} ${radiusClass} ${topClass} ${shadowClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
