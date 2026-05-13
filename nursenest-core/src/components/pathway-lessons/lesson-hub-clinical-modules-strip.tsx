import "server-only";

import Link from "next/link";
import { resolveMarketingHubEcgModulePublic } from "@/lib/ecg-module/ecg-marketing-hub-surface.server";
import { loadMarketingMessageShardsSync } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { buildLessonHubPremiumModuleStripLinks } from "@/lib/marketing/lesson-hub-premium-module-strip";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

type Props = {
  pathway: ExamPathwayDefinition;
  /** Marketing locale for shard load (matches other marketing pathway surfaces). */
  marketingLocale: string;
  signedIn: boolean;
  /**
   * Compact mode: renders as a slim inline pill row without a card wrapper.
   * Use when embedding inside the sticky study chrome alongside surface chips.
   */
  compact?: boolean;
};

/**
 * Second-row study module links on marketing lesson hubs (labs, OSCE, ECG, etc.)
 *
 * Two visual modes:
 *  - Default: standalone rounded card section with heading (legacy, standalone usage)
 *  - Compact: borderless pill row for embedding in the sticky top-nav chrome
 */
export async function LessonHubClinicalModulesStrip({ pathway, marketingLocale, signedIn, compact = false }: Props) {
  const ecgModulePublic = await resolveMarketingHubEcgModulePublic();
  const messages = loadMarketingMessageShardsSync(marketingLocale, ["components"]);
  const links = buildLessonHubPremiumModuleStripLinks(pathway, {
    ecgModulePublic,
    messages,
    signedIn,
  });
  if (!links.length) return null;

  const heading =
    messages["components.examPathwayHub.premiumModules.studyToolsHeading"]?.trim() || "Clinical study modules";

  if (compact) {
    return (
      <nav
        className="mt-1.5 flex flex-nowrap gap-1.5 overflow-x-auto scrollbar-none"
        aria-label={heading}
        data-testid="lesson-hub-clinical-modules-strip"
      >
        {links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className="inline-flex min-h-8 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_50%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold text-[var(--theme-heading-text)] transition-colors hover:border-[color-mix(in_srgb,var(--semantic-chart-3)_38%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-panel-positive)_45%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_28%,transparent)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <section
      className="mt-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5"
      aria-labelledby="lesson-hub-clinical-modules-heading"
      data-testid="lesson-hub-clinical-modules-strip"
    >
      <h2 id="lesson-hub-clinical-modules-heading" className="nn-marketing-caption font-semibold text-[var(--theme-heading-text)]">
        {heading}
      </h2>
      <nav className="mt-3" aria-labelledby="lesson-hub-clinical-modules-heading">
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {links.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                className="inline-flex min-h-10 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_55%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)] transition-colors hover:border-[color-mix(in_srgb,var(--semantic-chart-3)_38%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-panel-positive)_45%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_28%,transparent)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
