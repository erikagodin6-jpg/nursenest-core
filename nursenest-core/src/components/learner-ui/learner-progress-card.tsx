import type { ReactNode } from "react";
import {
  ProgressBarSemantic,
  type ProgressBarSemanticVariant,
} from "@/components/student/product/progress-bar-semantic";

/**
 * Compact progress block using shared semantic track + `nn-ls-progress-card` shell.
 */
export function LearnerProgressCard({
  eyebrow,
  title,
  value,
  max = 100,
  variant = "success",
  footer,
}: {
  eyebrow?: string;
  title?: ReactNode;
  value: number;
  max?: number;
  variant?: ProgressBarSemanticVariant;
  footer?: ReactNode;
}) {
  return (
    <div className="nn-ls-progress-card">
      {eyebrow ? <p className="nn-ls-progress-card__label">{eyebrow}</p> : null}
      {title ? <div className="nn-ls-progress-card__title">{title}</div> : null}
      <div className="mt-3">
        <ProgressBarSemantic value={value} max={max} variant={variant} size="md" />
      </div>
      {footer ? <div className="mt-3 text-xs leading-relaxed text-[var(--semantic-text-muted)]">{footer}</div> : null}
    </div>
  );
}
