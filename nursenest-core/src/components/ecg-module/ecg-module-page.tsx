import Link from "next/link";
import { ECG_ROUTE_CONFIGS, type EcgRouteConfig } from "@/lib/ecg-module/ecg-module-config";
import { EcgQuestionList, EcgWorksheetList } from "@/components/ecg-module/ecg-module-client";
import type { EcgBasicAccessState } from "@/lib/ecg-module/ecg-access-resolution";

const PRIMARY_LINKS = [
  ["/modules/ecg/basic/lessons", "Basic lessons"],
  ["/modules/ecg/basic/quizzes", "Basic quizzes"],
  ["/modules/ecg/basic/worksheets", "Basic worksheets"],
  ["/modules/ecg/advanced/lessons", "Advanced lessons"],
  ["/modules/ecg/advanced/video-drills", "Video drills"],
  ["/modules/ecg/advanced/scenarios", "Scenarios"],
  ["/modules/ecg/advanced/worksheets", "Advanced worksheets"],
] as const;

export function EcgModulePage({
  config,
  accessState,
}: {
  config: EcgRouteConfig;
  accessState?: Exclude<EcgBasicAccessState, "no_access">;
}) {
  const advancedIncludesBasic = accessState === "advanced_includes_basic";
  const basicOnly = accessState === "basic_only";

  return (
    <main
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8"
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="clinical"
      data-nn-premium-platform-module="ecg"
    >
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          ECG mastery / {config.level}
        </p>
        <h1 className="text-3xl font-bold tracking-normal text-[var(--semantic-text-primary)] sm:text-4xl">
          {config.title}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-[var(--semantic-text-secondary)]">{config.subtitle}</p>
      </header>

      {config.level === "basic" && accessState ? (
        <section className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_20%,var(--semantic-surface))] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-warning)]">
            {advancedIncludesBasic ? "Advanced ECG owner" : "Advanced ECG & Telemetry Mastery"}
          </p>
          <h2 className="mt-2 text-base font-semibold text-[var(--semantic-text-primary)]">
            {advancedIncludesBasic ? "Includes Basic ECG Foundations" : basicOnly ? "Basic-only learners can upgrade separately" : "ECG access"}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {advancedIncludesBasic
              ? "Your premium Advanced ECG entitlement unlocks this foundational ECG content without creating a second ownership track."
              : basicOnly
                ? "Advanced ECG & Telemetry Mastery is a separate premium specialty module. It adds telemetry, 12-lead, ACLS, and pacemaker interpretation while keeping your current Basic ECG progress intact."
                : "ECG access is active."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/modules/ecg-advanced"
              className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] px-3 py-2 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-warning)_92%,var(--semantic-text-primary))]"
            >
              {advancedIncludesBasic ? "Open Advanced ECG" : "Preview premium module"}
            </Link>
            <Link
              href="/advanced-ecg"
              className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-xs font-semibold text-[var(--semantic-text-primary)]"
            >
              Learn more
            </Link>
          </div>
        </section>
      ) : null}

      <nav className="flex flex-wrap gap-2" aria-label="ECG module navigation">
        {PRIMARY_LINKS.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`rounded-full border px-3 py-2 text-xs font-semibold ${
              ECG_ROUTE_CONFIGS[href] === config
                ? "border-[var(--semantic-info)] bg-[var(--semantic-panel-cool)] text-[var(--semantic-text-primary)]"
                : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Mode behavior">
        {config.behaviors.map((behavior) => (
          <div key={behavior} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{behavior}</p>
          </div>
        ))}
      </section>

      {config.kind === "worksheets" ? (
        <EcgWorksheetList level={config.level} />
      ) : config.questionMode ? (
        <EcgQuestionList level={config.level} mode={config.questionMode} kind={config.kind} />
      ) : null}
    </main>
  );
}
