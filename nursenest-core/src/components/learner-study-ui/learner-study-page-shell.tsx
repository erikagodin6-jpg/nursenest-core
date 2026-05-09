import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ShellProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

/**
 * Shared max-width + vertical rhythm for learner study surfaces (practice, flashcards).
 * Horizontal inset comes from `(learner)/layout` (`nn-learner-app` padding); avoid doubling px here
 * so hub width matches `/app/lessons`.
 */
export function LearnerStudyPageShell({ children, className, ...rest }: ShellProps) {
  return (
    <div
      {...rest}
      className={["mx-auto w-full max-w-6xl space-y-9 sm:space-y-10", className].filter(Boolean).join(" ")}
      data-nn-learner-study-page-shell
    >
      {children}
    </div>
  );
}
