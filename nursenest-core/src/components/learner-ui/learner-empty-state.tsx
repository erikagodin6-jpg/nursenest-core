import { PremiumEmptyState, type PremiumEmptyStateProps } from "@/components/ui/premium-empty-state";

export type LearnerEmptyStateProps = PremiumEmptyStateProps & {
  /** When true, wraps in dashed `nn-ls-empty` inset (nested empty regions). */
  inset?: boolean;
  /** Optional wrapper class around the inset */
  wrapperClassName?: string;
};

/**
 * Learner-facing empty state — same behavior as {@link PremiumEmptyState}, optional inset shell.
 */
export function LearnerEmptyState({ inset, wrapperClassName, ...props }: LearnerEmptyStateProps) {
  const inner = <PremiumEmptyState {...props} />;
  if (!inset) return inner;
  return <div className={["nn-ls-empty", wrapperClassName].filter(Boolean).join(" ")}>{inner}</div>;
}
