import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type LinkProps = ComponentPropsWithoutRef<typeof Link>;

/**
 * Primary or secondary CTA as a Next.js link — uses learner design system tokens.
 */
export function LearnerCtaLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: LinkProps & {
  variant?: "primary" | "secondary";
  children: ReactNode;
}) {
  const cls = variant === "primary" ? "lv-btn-primary" : "lv-btn-secondary";
  return (
    <Link {...props} className={`${cls} ${className}`.trim()}>
      {children}
    </Link>
  );
}
