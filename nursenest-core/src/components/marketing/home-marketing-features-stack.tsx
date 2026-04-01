"use client";

import Link from "next/link";
import { BarChart3, BookOpen, ClipboardCheck, LineChart, Stethoscope } from "lucide-react";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";
import { HUB, NP, RN, alliedHub, loginWithCallback, pnLessons, rnQuestions } from "@/lib/marketing/marketing-entry-routes";

type Props = { region: NursenestMarketingRegion };

export function HomeMarketingFeaturesStack({ region }: Props) {
  const { locale } = useMarketingI18n();
  const loc = (h: string) => withMarketingLocale(locale, h);

  return (
    <section
      className="border-t border-[var(--theme-card-border)] bg-[var(--theme-page-bg)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-marketing-features-stack"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-xl font-bold text-[var(--theme-heading-text)] sm:text-2xl">How the pieces connect</h2>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            Bank reps update topic stats; lessons shore up systems you miss; flashcards resurface facts on a schedule; planner and readiness sit on
            the dashboard; timed mocks and exam mode come last when scores stop swinging session to session.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--theme-card-border)] bg-gradient-to-br from-primary/[0.07] via-card to-card p-6 shadow-[var(--shadow-card)] sm:p-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Stethoscope className="h-3.5 w-3.5" aria-hidden />
              Featured
            </div>
            <h3 className="mt-3 text-lg font-bold text-[var(--theme-heading-text)] sm:text-xl">Practice with category tagging</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">
              <strong className="text-[var(--theme-heading-text)]">What it does:</strong> pulls items that match your pathway and labels the topic so the report can show weak areas.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">
              <strong className="text-[var(--theme-heading-text)]">When to use it:</strong> early in the week when you still have time to fix gaps, not the night before the exam.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">
              <strong className="text-[var(--theme-heading-text)]">Result:</strong> you see which categories to drill next instead of guessing from one overall percent.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={loc(rnQuestions(region))}
                className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:brightness-110"
              >
                Start practice questions
              </Link>
              <Link
                href={loc(HUB.pricing)}
                className="inline-flex items-center rounded-full border border-[var(--theme-card-border)] bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-primary/35"
              >
                Compare plans
              </Link>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-center gap-3 border-t border-[var(--theme-card-border)] pt-6 lg:col-span-5 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--theme-heading-text)]">
              <LineChart className="h-4 w-4 text-primary" aria-hidden />
              Progression
            </div>
            <ol className="space-y-2 text-sm text-[var(--theme-body-text)]">
              <li>
                <span className="font-semibold text-primary">1.</span> Practice a short set
              </li>
              <li>
                <span className="font-semibold text-primary">2.</span> Read rationale on misses
              </li>
              <li>
                <span className="font-semibold text-primary">3.</span> Re-run the weak category
              </li>
              <li>
                <span className="font-semibold text-primary">4.</span> Sit a timed mock when scores stabilize
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm">
            <ClipboardCheck className="h-5 w-5 text-primary" aria-hidden />
            <h3 className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">Lessons when you need context</h3>
            <p className="mt-2 flex-1 text-sm text-[var(--theme-body-text)]">
              <strong className="text-[var(--theme-heading-text)]">What:</strong> pathway lessons that line up with the same tags as the bank.
              <br />
              <strong className="text-[var(--theme-heading-text)]">When:</strong> after you miss a cluster, not before you have seen the stem style.
              <br />
              <strong className="text-[var(--theme-heading-text)]">Result:</strong> you fix the concept with the exam framing already in mind.
            </p>
            <Link href={loc(pnLessons(region))} className="mt-4 text-sm font-semibold text-primary hover:underline">
              Test this lesson path →
            </Link>
          </div>

          <div className="flex flex-col rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/60 p-5 shadow-sm">
            <BarChart3 className="h-5 w-5 text-primary" aria-hidden />
            <h3 className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">Timed exams and review mode</h3>
            <p className="mt-2 flex-1 text-sm text-[var(--theme-body-text)]">
              <strong className="text-[var(--theme-heading-text)]">What:</strong> full-length or section timers with the same score breakdown.
              <br />
              <strong className="text-[var(--theme-heading-text)]">When:</strong> after category scores stop jumping wildly session to session.
              <br />
              <strong className="text-[var(--theme-heading-text)]">Result:</strong> you walk in knowing pace, not just isolated items.
            </p>
            <Link href={loc(loginWithCallback(RN.appExams))} className="mt-4 text-sm font-semibold text-primary hover:underline">
              Open practice exams →
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--theme-heading-text)]">
              <BookOpen className="h-4 w-4 text-primary" aria-hidden />
              Cross-links
            </div>
            <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
              NP cases, allied hubs, and the lesson index use the same routing table as the header so you do not hit dead ends.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
            <Link href={loc(NP.practiceProgrammatic)} className="rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] hover:border-primary/35">
              Try a clinical case
            </Link>
            <Link href={loc(alliedHub(region))} className="rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] hover:border-primary/35">
              Allied exam hub
            </Link>
            <Link href={loc(HUB.examLessons)} className="rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] hover:border-primary/35">
              Exam lesson hubs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
