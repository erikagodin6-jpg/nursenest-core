"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import type { ProgrammaticPracticeConversionConfig } from "@/lib/seo/programmatic-practice-config";
import { buildPracticeHubContext, buildPracticeTaxonomy } from "@/lib/seo/programmatic-practice-hub";

type Props = {
  slug: string;
  locale: string;
  config: ProgrammaticPracticeConversionConfig;
};

export function ProgrammaticPracticeConversionBlocks({ slug, locale, config }: Props) {
  const { region } = useNursenestRegion();
  const hub = buildPracticeHubContext(slug, region, locale);
  const taxonomy = buildPracticeTaxonomy(hub.examKey);

  return (
    <div className="space-y-14">
      <section aria-labelledby="how-to-use-heading" className="rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/40 p-5 sm:p-6">
        <h2 id="how-to-use-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
          How to use these questions
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-[var(--theme-body-text)]">
          {config.howToUse.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
          {hub.categoryHeading}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Structured the same way for RN, PN, and NP: category first, then system/topic groups with scoped actions.
        </p>
        <nav className="mt-5 grid gap-3 sm:grid-cols-2" aria-label="Category shortcuts">
          {taxonomy.map((c) => (
            <a
              key={c.id}
              href={`#cat-${c.id}`}
              className="flex flex-col rounded-xl border border-[var(--theme-card-border)] bg-card p-4 transition hover:border-primary/40"
            >
              <span className="font-semibold text-[var(--theme-heading-text)]">{c.name}</span>
              <span className="mt-1 text-xs text-muted-foreground">{hub.systemHeading}</span>
              <span className="mt-2 text-sm font-medium text-primary">{c.systems.length} mapped system/topic groups</span>
            </a>
          ))}
        </nav>

        <div className="mt-8 space-y-6">
          {taxonomy.map((c) => (
            <div key={c.id} id={`cat-${c.id}`} className="scroll-mt-24 rounded-xl border border-[var(--theme-card-border)] bg-card p-4 sm:p-5">
              <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {hub.examLabel} · {region === "US" ? "US terminology" : "Canada terminology"}
              </p>
              <p className="mt-2 text-sm text-[var(--theme-body-text)]">
                Drill one system here, review lessons, then apply under timed pressure in the same week.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.systems.map((system) => (
                  <span
                    key={`${c.id}-${system}`}
                    className="rounded-full border border-border/70 bg-muted/20 px-2.5 py-1 text-xs text-[var(--theme-body-text)]"
                  >
                    {system}
                  </span>
                ))}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href={`${hub.ctas.questions}?topic=${encodeURIComponent(c.systems[0] ?? c.name)}`}
                  className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/15"
                >
                  Practice Questions
                </Link>
                <Link
                  href={hub.ctas.lessons}
                  className="rounded-lg border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-3 py-2 text-xs font-semibold text-[var(--theme-body-text)] hover:border-primary/40"
                >
                  Lessons
                </Link>
                <Link
                  href={`${hub.ctas.testBank}?topic=${encodeURIComponent(c.systems[0] ?? c.name)}`}
                  className="rounded-lg border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-3 py-2 text-xs font-semibold text-[var(--theme-body-text)] hover:border-primary/40"
                >
                  Test Bank
                </Link>
                <Link
                  href={hub.ctas.exams}
                  className="rounded-lg border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-3 py-2 text-xs font-semibold text-[var(--theme-body-text)] hover:border-primary/40"
                >
                  Exams (CAT / practice)
                </Link>
              </div>
              <Link href={hub.ctas.questions} className="mt-3 inline-flex items-center text-sm font-semibold text-primary hover:underline">
                Start practice questions
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="rationale-example-heading" className="rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 sm:p-6">
        <h2 id="rationale-example-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
          What a strong rationale looks like
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Sample stem for discussion. Not a scored item from your bank.</p>
        <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--theme-body-text)]">{config.rationale.stem}</p>
        <ul className="mt-4 space-y-2">
          {config.rationale.choices.map((ch, i) => (
            <li
              key={i}
              className={`rounded-lg border px-3 py-2 text-sm ${
                i === config.rationale.correctIndex
                  ? "border-primary/50 bg-primary/10 font-medium text-[var(--theme-heading-text)]"
                  : "border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 text-[var(--theme-body-text)]"
              }`}
            >
              {String.fromCharCode(65 + i)}. {ch}
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-3 text-sm leading-relaxed">
          <p>
            <span className="font-semibold text-[var(--theme-heading-text)]">Correct answer: </span>
            {String.fromCharCode(65 + config.rationale.correctIndex)}. {config.rationale.whyCorrect}
          </p>
          <div>
            <p className="font-semibold text-[var(--theme-heading-text)]">Why the other options fail</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              {config.rationale.choices
                .map((_, idx) => idx)
                .filter((idx) => idx !== config.rationale.correctIndex)
                .map((choiceIdx, i) => (
                  <li key={choiceIdx}>
                    {String.fromCharCode(65 + choiceIdx)}. {config.rationale.whyIncorrect[i]}
                  </li>
                ))}
            </ul>
          </div>
          <p className="rounded-lg bg-muted/40 p-3 text-[var(--theme-body-text)]">
            <span className="font-semibold text-[var(--theme-heading-text)]">Clinical takeaway: </span>
            {config.rationale.takeaway}
          </p>
        </div>
      </section>

      <section aria-labelledby="mistakes-heading">
        <h2 id="mistakes-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
          Common mistakes on this item style
        </h2>
        <ul className="mt-4 space-y-4">
          {config.mistakes.map((m) => (
            <li key={m.title} className="rounded-xl border border-dashed border-[var(--theme-card-border)] p-4">
              <p className="font-semibold text-[var(--theme-heading-text)]">{m.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="weak-preview-heading" className="rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/30 p-5 sm:p-6">
        <h2 id="weak-preview-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
          Weak area preview
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Example layout. Your live session report lists categories you actually miss, not demo data.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category mix (example)</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between border-b border-dashed border-border pb-1">
                <span>Physiological</span>
                <span className="font-medium text-amber-700 dark:text-amber-300">Needs work</span>
              </li>
              <li className="flex justify-between border-b border-dashed border-border pb-1">
                <span>Safety</span>
                <span className="text-muted-foreground">Stable</span>
              </li>
              <li className="flex justify-between pt-0.5">
                <span>Psychosocial</span>
                <span className="font-medium text-primary">Improving</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Trend (example)</p>
            <div className="mt-3 flex h-24 items-end gap-1">
              {[42, 48, 45, 52, 58, 61].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-primary/70" style={{ height: `${h}%` }} title={`${h}%`} />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Rolling accuracy by block, not a guarantee of exam outcome.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Next steps inside NurseNest</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">
          Link questions to lessons, then to timed exams when your category scores stop jumping. Pricing stays separate from your first free passes.
        </p>
        <ul className="mt-4 flex flex-col gap-2 text-sm font-semibold text-primary sm:flex-row sm:flex-wrap">
          <li>
            <Link href={hub.ctas.lessons} className="underline-offset-4 hover:underline">
              Lessons for this pathway
            </Link>
          </li>
          <li>
            <Link href={hub.ctas.questions} className="underline-offset-4 hover:underline">
              Try 5 questions now
            </Link>
          </li>
          <li>
            <Link href={hub.ctas.testBank} className="underline-offset-4 hover:underline">
              Test bank
            </Link>
          </li>
          <li>
            <Link href={hub.ctas.exams} className="underline-offset-4 hover:underline">
              Practice exams (sign in)
            </Link>
          </li>
          <li>
            <Link href={hub.ctas.pricing} className="underline-offset-4 hover:underline">
              Plans and pricing
            </Link>
          </li>
          {hub.ctas.studyPlan ? (
            <li>
              <Link href={hub.ctas.studyPlan} className="underline-offset-4 hover:underline">
                Build study plan
              </Link>
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
