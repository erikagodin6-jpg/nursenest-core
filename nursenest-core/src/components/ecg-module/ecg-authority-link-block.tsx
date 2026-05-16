/**
 * EcgAuthorityLinkBlock — Reusable internal linking component for ECG authority.
 *
 * Renders a compact ECG discovery section with contextual links to:
 *   /ecg-interpretation (primary authority hub)
 *   /advanced-ecg-nursing (Advanced ECG add-on)
 *   /ecg-practice-questions (high-intent practice)
 *   /telemetry-nursing (telemetry-specific)
 *
 * Usage:
 *   - Learner lessons hub (/app/lessons) — after lesson list for RN/NP tiers
 *   - Learner flashcards hub — as related specialty CTA
 *   - Practice tests hub — ECG practice entry point
 *   - Any page where cardiac/ECG content is contextually relevant
 *
 * Anchor text is search-intent aligned:
 *   "ECG interpretation", "rhythm strip analysis",
 *   "telemetry interpretation", "arrhythmia recognition"
 */

import Link from "next/link";
import { Activity, ChevronRight } from "lucide-react";

type EcgAuthorityLinkBlockVariant = "compact" | "full" | "banner";

type EcgAuthorityLinkBlockProps = {
  variant?: EcgAuthorityLinkBlockVariant;
  /** Show the Advanced ECG add-on teaser (for RN/NP tiers only). */
  showAdvanced?: boolean;
  /** CSS className override for the root element. */
  className?: string;
  "data-testid"?: string;
};

const ECG_LINKS = [
  {
    href: "/ecg-interpretation",
    label: "ECG Interpretation",
    description: "Rhythm recognition, strip analysis, telemetry",
    anchor: "ECG interpretation",
  },
  {
    href: "/ecg-practice-questions",
    label: "ECG Practice Questions",
    description: "Strip-based rhythm drills and ACLS scenarios",
    anchor: "ECG practice questions",
  },
  {
    href: "/telemetry-nursing",
    label: "Telemetry Interpretation",
    description: "Bedside monitor reading and arrhythmia recognition",
    anchor: "telemetry interpretation",
  },
] as const;

const ADVANCED_ECG_LINK = {
  href: "/advanced-ecg-nursing",
  label: "Advanced ECG",
  description: "STEMI, ICU telemetry, 12-lead analysis (add-on)",
  anchor: "advanced ECG interpretation",
} as const;

export function EcgAuthorityLinkBlock({
  variant = "compact",
  showAdvanced = true,
  className,
  "data-testid": testId = "ecg-authority-link-block",
}: EcgAuthorityLinkBlockProps) {
  const links = showAdvanced ? [...ECG_LINKS, ADVANCED_ECG_LINK] : [...ECG_LINKS];

  if (variant === "banner") {
    return (
      <aside
        data-testid={testId}
        className={`rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_04%,var(--semantic-surface))] p-4 sm:p-5 ${className ?? ""}`}
        aria-label="ECG interpretation and telemetry training resources"
      >
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-[var(--semantic-info)]" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-info)]">
            ECG Interpretation
          </span>
        </div>
        <p className="mb-3 text-sm text-[var(--semantic-text-secondary)]">
          Master{" "}
          <Link href="/ecg-interpretation" className="font-medium text-[var(--semantic-brand)] hover:underline">
            ECG interpretation
          </Link>
          ,{" "}
          <Link href="/telemetry-nursing" className="font-medium text-[var(--semantic-brand)] hover:underline">
            telemetry interpretation
          </Link>
          , and{" "}
          <Link href="/ecg-practice-questions" className="font-medium text-[var(--semantic-brand)] hover:underline">
            arrhythmia recognition
          </Link>{" "}
          — integrated with your clinical study loop.
        </p>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-medium text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_04%,var(--semantic-surface))]"
            >
              {link.label}
              <ChevronRight className="h-3 w-3" aria-hidden />
            </Link>
          ))}
        </div>
      </aside>
    );
  }

  if (variant === "full") {
    return (
      <section
        data-testid={testId}
        className={`rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 ${className ?? ""}`}
        aria-labelledby="ecg-authority-heading"
      >
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-[var(--semantic-info)]" aria-hidden />
          <h2
            id="ecg-authority-heading"
            className="text-sm font-bold text-[var(--semantic-text-primary)]"
          >
            ECG Interpretation &amp; Telemetry Training
          </h2>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Build{" "}
          <Link href="/ecg-interpretation" className="font-medium text-[var(--semantic-brand)] hover:underline">
            ECG interpretation
          </Link>{" "}
          and{" "}
          <Link href="/telemetry-nursing" className="font-medium text-[var(--semantic-brand)] hover:underline">
            telemetry interpretation
          </Link>{" "}
          skills through{" "}
          <Link href="/ecg-practice-questions" className="font-medium text-[var(--semantic-brand)] hover:underline">
            rhythm strip analysis
          </Link>{" "}
          and{" "}
          <Link href="/advanced-ecg-nursing" className="font-medium text-[var(--semantic-brand)] hover:underline">
            arrhythmia recognition
          </Link>{" "}
          drills.
        </p>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center justify-between rounded-xl border border-[var(--semantic-border-soft)] p-3 text-sm hover:bg-[color-mix(in_srgb,var(--semantic-brand)_03%,var(--semantic-surface))]"
              >
                <div>
                  <span className="font-medium text-[var(--semantic-text-primary)]">{link.label}</span>
                  <span className="ml-2 text-xs text-[var(--semantic-text-muted)]">{link.description}</span>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // compact (default)
  return (
    <div
      data-testid={testId}
      className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}
      aria-label="ECG learning resources"
    >
      <span className="text-xs font-semibold text-[var(--semantic-text-muted)]">ECG:</span>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2.5 py-1 text-xs font-medium text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_04%,var(--semantic-surface))]"
        >
          {link.anchor}
        </Link>
      ))}
    </div>
  );
}
