import Link from "next/link";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

function QuestionSilhouette() {
  return (
    <div className="space-y-4 p-4" aria-hidden>
      <div className="h-4 max-w-md rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_70%,var(--semantic-border-soft))] sm:w-[66%]" />
      <div className="h-3 w-full max-w-lg rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-border-soft))]" />
      <div className="h-3 max-w-lg rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-border-soft))] sm:w-[83%]" />
      <div className="mt-6 space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex min-h-[3rem] items-center gap-3 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2"
          >
            <div className="size-8 shrink-0 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-3)_35%,var(--semantic-border-soft))]" />
            <div className="h-3 flex-1 rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_60%,var(--semantic-border-soft))]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonSilhouette() {
  return (
    <div className="space-y-3 p-4" aria-hidden>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4"
        >
          <div className="h-4 w-1/2 rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_65%,var(--semantic-border-soft))]" />
          <div className="mt-3 h-3 w-full rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-border-soft))]" />
          <div className="mt-2 h-3 rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-border-soft))] sm:w-[80%]" />
        </div>
      ))}
    </div>
  );
}

function CatSilhouette() {
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5"
        >
          <div className="h-3 w-1/3 rounded-md bg-[color-mix(in_srgb,var(--semantic-chart-1)_40%,var(--semantic-border-soft))]" />
          <div className="mt-4 h-2 w-full rounded bg-[color-mix(in_srgb,var(--semantic-panel-muted)_45%,var(--semantic-border-soft))]" />
          <div className="mt-2 h-2 rounded bg-[color-mix(in_srgb,var(--semantic-panel-muted)_45%,var(--semantic-border-soft))] sm:w-[83%]" />
        </div>
      ))}
    </div>
  );
}

export async function FreemiumPreviewExhaustedSurface({ kind }: { kind: "questions" | "lessons" | "cat" | "exams" }) {
  const { t } = await getLearnerMarketingBundle();
  const copyKey = kind === "exams" ? "exams" : kind;
  const title = t(`freemium.exhausted.${copyKey}.title`);
  const body = t(`freemium.exhausted.${copyKey}.body`);
  const cta = t("freemium.exhausted.ctaPricing");

  const silhouette =
    kind === "lessons" ? <LessonSilhouette /> : kind === "questions" ? <QuestionSilhouette /> : <CatSilhouette />;

  return (
    <section
      className="relative mt-6 overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)]"
      aria-labelledby={`freemium-exhausted-${kind}-heading`}
    >
      <div className="pointer-events-none max-h-[min(22rem,55vh)] select-none blur-[5px] opacity-[0.42] saturate-[0.65]">
        {silhouette}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-[color-mix(in_srgb,var(--semantic-panel-cool)_82%,transparent)] p-4 backdrop-blur-md sm:p-6">
        <div className="nn-card max-w-md border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-5 text-center shadow-lg">
          <h2 id={`freemium-exhausted-${kind}-heading`} className="text-lg font-semibold text-[var(--semantic-text-primary)]">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{body}</p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex min-h-[2.75rem] items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            {cta}
          </Link>
          <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">{t("freemium.exhausted.footerHint")}</p>
        </div>
      </div>
    </section>
  );
}
