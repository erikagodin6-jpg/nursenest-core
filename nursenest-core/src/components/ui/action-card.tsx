import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type LinkProps = ComponentPropsWithoutRef<typeof Link>;

export type ActionCardVariant = "primary" | "secondary";

/**
 * Hub / next-step tile: icon + title + optional description + trailing CTA slot.
 * Uses `.lv-action-card*` from `styles/learner-ds.css`.
 */
export function ActionCardLink({
  href,
  variant,
  warmth,
  icon: Icon,
  title,
  description,
  cta,
  className = "",
  ...rest
}: Omit<LinkProps, "className" | "children"> & {
  variant: ActionCardVariant;
  /** Secondary tiles only — warm uses secondary pastel band. */
  warmth?: "cool" | "warm";
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  cta?: ReactNode;
  className?: string;
}) {
  const base = [
    "lv-action-card",
    variant === "primary" ? "lv-action-card--primary" : "lv-action-card--secondary",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={href}
      className={base}
      {...(variant === "secondary" && warmth === "warm" ? { "data-warm": "true" as const } : {})}
      {...rest}
    >
      <span className="lv-action-card__icon" aria-hidden>
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <span className="block w-full">{title}</span>
      {description ? <span className="mt-1 block w-full text-xs font-medium text-lv-text-secondary">{description}</span> : null}
      {cta ? <span className="mt-2 block w-full">{cta}</span> : null}
    </Link>
  );
}
