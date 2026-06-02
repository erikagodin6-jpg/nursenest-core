"use client";

import type { ReactNode } from "react";

/**
 * New Grad marketing / work-area hub hero — homepage design system (nn-gradient-safe, semantic tokens,
 * multi-hue wash) with a per–work-area accent from {@link getLessonHubSystemVisual}.
 */
export function NewGradMarketingCommandHero({
  accentVar,
  eyebrow,
  title,
  subtitle,
  tertiary,
  actions,
  "data-testid": dataTestId,
}: {
  accentVar: string;
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  tertiary?: ReactNode;
  actions?: ReactNode;
  "data-testid"?: string;
}) {
  const v = accentVar.startsWith("--") ? accentVar : `--${accentVar}`;

  return (
    <header
      className="nn-gradient-safe nn-new-grad-command-hero relative overflow-hidden rounded-[1.75rem] border px-6 py-10 shadow-[var(--semantic-shadow-soft)] sm:px-10 sm:py-12"
      style={{
        borderColor: `color-mix(in srgb, var(${v}) 22%, var(--semantic-border-soft))`,
        background: `linear-gradient(165deg, color-mix(in srgb, var(${v}) 9%, var(--semantic-surface)) 0%, var(--semantic-surface) 52%, color-mix(in srgb, var(--semantic-panel-cool) 38%, var(--semantic-surface)) 100%)`,
      }}
      data-testid={dataTestId}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full blur-3xl"
        style={{ background: `color-mix(in srgb, var(${v}) 20%, transparent)` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-12 h-44 w-44 rounded-full blur-3xl"
        style={{ background: `color-mix(in srgb, var(--semantic-brand) 12%, transparent)` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/4 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full blur-3xl opacity-70"
        style={{ background: `color-mix(in srgb, var(--semantic-chart-4) 8%, transparent)` }}
        aria-hidden
      />
      <div className="relative">
        {eyebrow}
        {title}
        {subtitle}
        {tertiary}
        {actions}
      </div>
    </header>
  );
}
