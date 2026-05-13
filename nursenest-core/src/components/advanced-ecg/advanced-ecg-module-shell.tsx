import type { ReactNode } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";

/**
 * Premium shell for the Advanced ECG add-on module.
 * Replaces the generic PremiumEducationalModuleShell with telemetry identity:
 * - Activity icon + specialty wordmark in header
 * - Telemetry-accented nav bar (chart-1 underline)
 * - Wider max-width for strip + side-panel layouts
 * - Fully theme-aware via semantic tokens
 */
export function AdvancedEcgModuleShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="nn-learner-ds-ambient min-h-screen bg-[var(--semantic-bg-base)] text-[var(--semantic-text-primary)]"
      data-nn-premium-module-shell=""
      data-nn-advanced-ecg-shell=""
      data-nn-premium-full-platform-convergence=""
    >
      {/* ── SPECIALTY HEADER ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,transparent)] px-4 py-2.5 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          {/* brand + specialty */}
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/app"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)]"
              aria-label="NurseNest learner home"
            >
              <SiteBrandLogoMark variant="learner" />
              <span className="hidden sm:inline">NurseNest</span>
            </Link>
            <span className="hidden text-[var(--semantic-border-soft)] sm:inline" aria-hidden>/</span>
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[color-mix(in_srgb,var(--semantic-chart-1)_12%,var(--semantic-surface))]">
                <Activity className="h-3.5 w-3.5 text-[var(--semantic-chart-1)]" aria-hidden />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--semantic-chart-1)]">
                Advanced ECG
              </span>
            </div>
          </div>

          {/* nav */}
          <nav className="flex items-center gap-1" aria-label="ECG module navigation">
            {[
              { href: "/modules/ecg-advanced", label: "Hub" },
              { href: "/modules/ecg/advanced/lessons", label: "Lessons" },
              { href: "/modules/ecg/advanced/video-drills", label: "Drills" },
              { href: "/modules/ecg/advanced/scenarios", label: "Scenarios" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="hidden rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-secondary)] transition hover:bg-[var(--semantic-surface-alt)] hover:text-[var(--semantic-text-primary)] sm:inline-flex"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/app"
              className="ml-2 inline-flex min-h-8 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-bg-base)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)] transition hover:bg-[var(--semantic-surface-alt)]"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* ── CONTENT ────────────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
