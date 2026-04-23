import type { ButtonHTMLAttributes, ReactNode } from "react";

export type LearnerDsButtonVariant = "primary" | "secondary" | "ghost";

const BTN: Record<LearnerDsButtonVariant, string> = {
  primary: "lv-btn-primary",
  secondary: "lv-btn-secondary",
  ghost: "lv-btn-ghost",
};

/** Pastel learner CTA — `.lv-btn-*` from `styles/learner-ds.css`. */
export function LearnerDsButton({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: LearnerDsButtonVariant;
  children: ReactNode;
}) {
  return (
    <button type={type} className={`${BTN[variant]} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
