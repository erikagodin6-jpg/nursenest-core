import type { ReactNode } from "react";

export function ScenarioStudyShell({
  eyebrow,
  title,
  subtitle,
  pathwayId,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  pathwayId: string | null;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <header className="space-y-2 border-b border-[var(--semantic-border-soft)] pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">{eyebrow}</p>
        <h1 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">{title}</h1>
        <p className="text-sm leading-relaxed text-[var(--theme-body-text)]">{subtitle}</p>
        {pathwayId ? (
          <p className="text-xs text-[var(--theme-body-text)]">
            Pathway: <span className="font-mono text-[var(--semantic-text-primary)]">{pathwayId}</span>
          </p>
        ) : (
          <p className="text-xs text-[var(--semantic-warning)]">Add pathwayId to the URL to align categories with your track.</p>
        )}
      </header>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}
