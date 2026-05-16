import Link from "next/link";
import { ECG_ROUTE_CONFIGS, type EcgRouteConfig } from "@/lib/ecg-module/ecg-module-config";
import { EcgQuestionList, EcgWorksheetList } from "@/components/ecg-module/ecg-module-client";
import { EcgStructuredLessonList } from "@/components/ecg-module/ecg-structured-lesson-list";

const PRIMARY_LINKS = [
  ["/modules/ecg/basic/lessons", "Basic lessons"],
  ["/modules/ecg/basic/quizzes", "Basic quizzes"],
  ["/modules/ecg/basic/worksheets", "Basic worksheets"],
  ["/modules/ecg/advanced/lessons", "Advanced lessons"],
  ["/modules/ecg/advanced/video-drills", "Video drills"],
  ["/modules/ecg/advanced/scenarios", "Scenarios"],
  ["/modules/ecg/advanced/worksheets", "Advanced worksheets"],
] as const;

export function EcgModulePage({ config }: { config: EcgRouteConfig }) {
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

      {config.kind === "lessons" ? (
        <EcgStructuredLessonList level={config.level} />
      ) : config.kind === "worksheets" ? (
        <EcgWorksheetList level={config.level} />
      ) : config.questionMode ? (
        <EcgQuestionList level={config.level} mode={config.questionMode} kind={config.kind} />
      ) : null}
    </main>
  );
}
