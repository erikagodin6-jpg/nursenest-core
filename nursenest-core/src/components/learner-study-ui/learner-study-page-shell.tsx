import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ShellProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

/**
 * Shared max-width + horizontal padding for learner study surfaces (practice, flashcards).
 * Matches lessons hub rhythm: `max-w-6xl`, generous padding, vertical rhythm.
 */
export function LearnerStudyPageShell({ children, className, ...rest }: ShellProps) {
  return (
    <div
      {...rest}
      className={["mx-auto w-full max-w-6xl space-y-8 px-4 sm:px-6", className].filter(Boolean).join(" ")}
      data-nn-learner-study-page-shell
    >
      {children}
    </div>
  );
}
