"use client";

import {
  Activity,
  BarChart3,
  Brain,
  GitBranch,
  LineChart,
  Monitor,
  RefreshCw,
  Stethoscope,
} from "lucide-react";

import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

const CAPABILITIES = [
  {
    key: "ecgTelemetry",
    icon: Activity,
    tone: "info",
    label: "ECG & telemetry",
    desc: "Rhythm strips, waveform literacy, and bedside deterioration cues",
  },
  {
    key: "ngn",
    icon: Brain,
    tone: "brand",
    label: "NGN clinical judgment",
    desc: "Case studies, matrix, bowtie, and extended-response formats",
  },
  {
    key: "simulations",
    icon: GitBranch,
    tone: "accent",
    label: "Branching simulations",
    desc: "Adaptive scenarios with evolving patient states and outcomes",
  },
  {
    key: "physiology",
    icon: Monitor,
    tone: "warning",
    label: "Physiology monitoring",
    desc: "Monitor-style vitals, trends, and live signal interpretation",
  },
  {
    key: "remediation",
    icon: RefreshCw,
    tone: "success",
    label: "Adaptive remediation",
    desc: "Weak-area routing into lessons, drills, and focused review",
  },
  {
    key: "competency",
    icon: LineChart,
    tone: "info",
    label: "Competency progression",
    desc: "Domain mastery bands, readiness signals, and longitudinal tracking",
  },
  {
    key: "reports",
    icon: BarChart3,
    tone: "brand",
    label: "Session report cards",
    desc: "Performance summaries with replay-friendly review paths",
  },
  {
    key: "ncjmm",
    icon: Stethoscope,
    tone: "success",
    label: "NCJMM-aligned reasoning",
    desc: "Clinical judgment framing beyond right-or-wrong scoring",
  },
] as const;

/**
 * Editorial capability band — surfaces platform depth without a feature-grid redesign.
 * Placed after product screenshots, before the ECG section.
 */
export function PremiumPlatformCapabilityStrip() {
  const { t, locale } = useMarketingI18n();
  const tr = (key: string, fallback: string) => safeHomepageMarketingT(t, key, fallback);

  return (
    <section
      className="nn-home-platform-capability-band border-b border-[var(--border-subtle)]"
      aria-labelledby="premium-platform-capability-heading"
      data-testid="section-platform-capability-strip"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">
            {formatTitleCase(
              tr("pages.home.premium.platformCapabilities.eyebrow", "Clinical learning platform"),
              locale,
            )}
          </p>
          <h2
            id="premium-platform-capability-heading"
            className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
          >
            {formatTitleCase(
              tr(
                "pages.home.premium.platformCapabilities.heading",
                "More than flashcards and question banks.",
              ),
              locale,
            )}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            {formatSentenceCase(
              tr(
                "pages.home.premium.platformCapabilities.body",
                "NurseNest connects telemetry education, NGN preparation, branching simulations, adaptive remediation, competency tracking, and session intelligence inside one calm clinical ecosystem.",
              ),
              locale,
            )}
          </p>
        </div>

        <ul
          className="nn-home-capability-grid mx-auto mt-8 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4"
          aria-label={tr("pages.home.premium.platformCapabilities.listLabel", "Platform capabilities")}
        >
          {CAPABILITIES.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.key}
                className="nn-home-capability-chip min-w-0 rounded-2xl border p-4"
                data-capability={item.key}
                style={{ ["--capability-tone" as string]: `var(--semantic-${item.tone})` }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="nn-home-capability-chip__icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--palette-heading)]">
                      {tr(`pages.home.premium.platformCapabilities.items.${item.key}.label`, item.label)}
                    </p>
                    <p className="nn-marketing-body-sm mt-1 text-pretty text-[var(--palette-text-muted)]">
                      {tr(`pages.home.premium.platformCapabilities.items.${item.key}.desc`, item.desc)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
