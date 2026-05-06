import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ShellProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

/** Max-width shell aligned with lessons / study hubs (`max-w-6xl`). */
export function LearnerAccountShell({ children, className, ...rest }: ShellProps) {
  return (
    <div
      {...rest}
      className={["mx-auto w-full max-w-6xl space-y-8 px-4 sm:px-6", className].filter(Boolean).join(" ")}
      data-nn-learner-account-shell
    >
      {children}
    </div>
  );
}
