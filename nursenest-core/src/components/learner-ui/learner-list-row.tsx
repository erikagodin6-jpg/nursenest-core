import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type LinkProps = ComponentPropsWithoutRef<typeof Link>;

/**
 * Compact list row: icon + label (+ optional meta). Prefer over dense paragraphs.
 */
export function LearnerListRowLink({
  icon,
  label,
  meta,
  className = "",
  ...props
}: LinkProps & {
  icon: ReactNode;
  label: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <Link {...props} className={`lv-list-row ${className}`.trim()}>
      <span className="lv-list-row__icon" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="lv-list-row__label">{label}</span>
        {meta ? <div className="lv-list-row__meta">{meta}</div> : null}
      </span>
    </Link>
  );
}
