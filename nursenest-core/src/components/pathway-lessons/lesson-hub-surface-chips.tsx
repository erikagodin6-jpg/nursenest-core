import Link from "next/link";

export type LessonHubSurfaceChip = { label: string; href: string };

type Props = {
  links: LessonHubSurfaceChip[];
};

/**
 * Above-the-fold quick links on pathway lesson hubs (legacy lesson index “study surfaces” strip).
 */
export function LessonHubSurfaceChips({ links }: Props) {
  if (!links.length) return null;
  return (
    <nav
      aria-label="Quick study surfaces for this exam pathway"
      className="mt-4"
      data-testid="lesson-hub-surface-chips"
    >
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            className="inline-flex min-h-10 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_70%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)] transition-colors hover:border-[color-mix(in_srgb,var(--semantic-chart-2)_40%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_65%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_28%,transparent)]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
