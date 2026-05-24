import type { ReactNode } from "react";
import Link from "next/link";
import { isStudyToolsPubliclyEnabled } from "@/lib/study-tools/study-tools-feature-flag";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";

const NAV_DEF: { key: keyof typeof STUDY_TOOL_ROUTES; label: string }[] = [
  { key: "hub", label: "Study hub" },
  { key: "flashcardsHub", label: "Flashcards" },
  { key: "decks", label: "Verified decks" },
  { key: "createDeck", label: "New deck" },
  { key: "sharedDecks", label: "Shared with me" },
  { key: "publicDecks", label: "Community" },
  { key: "matching", label: "Matching" },
  { key: "fillInTheBlank", label: "Fill-in-the-blank" },
  { key: "ordering", label: "Ordering" },
  { key: "labDrills", label: "Lab drills" },
  { key: "medicationDrills", label: "Medication drills" },
  { key: "medCalculations", label: "Med calculations" },
];

export function StudyToolsActivityShell({
  title,
  description,
  pathwayId,
  children,
}: {
  title: string;
  description: string;
  pathwayId: string | null;
  children?: ReactNode;
}) {
  const publicOn = isStudyToolsPubliclyEnabled();
  const previewBanner = !publicOn;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      {previewBanner ? (
        <div
          className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-primary)]"
          role="status"
        >
          Staff preview — study tools are not published to learners until{" "}
          <code className="rounded bg-[var(--bg-muted)] px-1 py-0.5 text-xs">NEXT_PUBLIC_ENABLE_STUDY_TOOLS=true</code>.
        </div>
      ) : null}

      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">Study tools</p>
        <h1 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">{title}</h1>
        <p className="text-sm leading-relaxed text-[var(--theme-body-text)]">{description}</p>
        {pathwayId ? (
          <p className="text-xs text-[var(--theme-body-text)]">
            Pathway: <span className="font-mono text-[var(--semantic-text-primary)]">{pathwayId}</span>
          </p>
        ) : (
          <p className="text-xs text-[var(--semantic-warning)]">Optional query: add pathwayId to scope this session.</p>
        )}
      </header>

      <nav aria-label="Study tool activities" className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-chart-3)]">Jump to</p>
        <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {NAV_DEF.map((row) => {
            const href = withStudyToolPathwayQuery(STUDY_TOOL_ROUTES[row.key], pathwayId);
            return (
              <li key={row.key}>
                <Link
                  href={href}
                  className="inline-flex rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--bg-card))] px-3 py-1.5 text-sm font-medium text-[var(--semantic-text-primary)] transition-colors hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] hover:text-[var(--semantic-brand)]"
                >
                  {row.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {children ? (
        <div className="space-y-6">{children}</div>
      ) : (
        <section className="rounded-xl border border-dashed border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_10%,var(--semantic-surface))] p-4 text-sm text-[var(--theme-body-text)]">
          Open a specific study mode from the links above to launch a session.
        </section>
      )}
    </div>
  );
}
