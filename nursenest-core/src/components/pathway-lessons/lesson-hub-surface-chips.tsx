import Link from "next/link";

export type LessonHubSurfaceChip = { label: string; href: string };

type Props = {
  links: LessonHubSurfaceChip[];
};

/**
 * Study-surface quick-links on pathway lesson hubs.
 * Rendered inside the sticky top-nav chrome — slim pill row, no card wrapper.
 */
export function LessonHubSurfaceChips({ links }: Props) {
  if (!links.length) return null;
  return (
    <nav
      aria-label="Quick study surfaces for this exam pathway"
      data-testid="lesson-hub-surface-chips"
    >
      <ul className="m-0 flex list-none flex-wrap gap-x-1.5 gap-y-1.5 p-0">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`} className="shrink-0">
            <Link
              href={link.href}
              className="inline-flex min-h-8 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_70%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold text-[var(--theme-heading-text)] transition-colors hover:border-[color-mix(in_srgb,var(--semantic-chart-2)_40%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_65%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_28%,transparent)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
