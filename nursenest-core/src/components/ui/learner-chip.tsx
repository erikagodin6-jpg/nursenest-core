import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Body-system / filter chip — `data-selected` drives filled state in `learner-ds.css`. */
export function LearnerChip({
  selected = false,
  stack = false,
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  /** Two-line label + meta (flashcard builder). */
  stack?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      data-selected={selected ? "true" : "false"}
      className={`lv-chip ${stack ? "lv-chip--stack" : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
