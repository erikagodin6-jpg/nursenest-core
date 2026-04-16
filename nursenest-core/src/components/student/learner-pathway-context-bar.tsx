import Link from "next/link";

/**
 * Slim pathway awareness strip — tier · country · exam (from shell metadata).
 * Links to the marketing pathway hub when `hubHref` is set.
 */
export function LearnerPathwayContextBar({ label, hubHref }: { label: string; hubHref: string }) {
  return (
    <div className="border-t border-[var(--semantic-border-soft)] px-2 py-1.5 sm:px-3">
      <Link
        href={hubHref}
        className="block w-full truncate text-center text-[11px] font-semibold leading-snug tracking-wide text-[var(--theme-body-text)] transition-colors hover:text-primary sm:text-xs"
        title={label}
      >
        {label}
      </Link>
    </div>
  );
}
