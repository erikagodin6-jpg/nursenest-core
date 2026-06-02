import Link from "next/link";

export type LessonHubSurfaceChip = { label: string; href: string };

type Props = {
  links: LessonHubSurfaceChip[];
};

/**
 * Study-surface quick-links on pathway lesson hubs.
 * Rendered as a quiet secondary nav so it does not compete with the hero CTA group.
 */
export function LessonHubSurfaceChips({ links }: Props) {
  if (!links.length) return null;
  return (
    <nav
      aria-label="Quick study surfaces for this exam pathway"
      data-testid="lesson-hub-surface-chips"
      className="mt-3 border-b border-[var(--semantic-border-soft)] pb-3"
    >
      <ul className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-2 p-0">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`} className="shrink-0">
            <Link
              href={link.href}
              className="text-xs font-semibold text-[var(--theme-muted-text)] underline-offset-4 transition-colors hover:text-[var(--semantic-brand)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_28%,transparent)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
