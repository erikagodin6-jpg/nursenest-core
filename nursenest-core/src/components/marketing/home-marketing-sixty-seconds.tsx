"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";
import { HUB, NP, PN, RN, loginWithCallback, rnQuestions } from "@/lib/marketing/marketing-entry-routes";

type Props = { region: NursenestMarketingRegion };

/**
 * Second hero layer: fast entry, no login required for first passes, immediate CTAs.
 */
export function HomeMarketingSixtySeconds({ region }: Props) {
  const { locale } = useMarketingI18n();
  const loc = (h: string) => withMarketingLocale(locale, h);

  const quickTestHref =
    region === "US" ? rnQuestions(region) : region === "CA" ? rnQuestions(region) : rnQuestions(region);

  return (
    <div
      className="mt-8 rounded-2xl border border-dashed border-primary/25 bg-gradient-to-br from-primary/[0.06] to-transparent p-4 sm:p-6"
      data-testid="hero-sixty-seconds"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Clock className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--theme-heading-text)] sm:text-lg">Start in under 60 seconds</h2>
            <p className="mt-1 max-w-prose text-sm text-[var(--theme-muted-text)]">
              Try a short question run first. No account required for the opening pass on most banks. If you want timed mocks later, you can sign in when prompted.
            </p>
          </div>
        </div>
        <Link
          href={loc(quickTestHref)}
          className="inline-flex shrink-0 items-center justify-center self-stretch rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 sm:self-center"
        >
          Try 5 questions now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <ul className="mt-4 grid gap-2 border-t border-[var(--theme-card-border)] pt-4 text-sm sm:grid-cols-3">
        <li>
          <Link href={loc(RN.practiceProgrammatic)} className="font-medium text-primary hover:underline">
            See your weak areas (RN overview)
          </Link>
          <p className="mt-0.5 text-xs text-[var(--theme-muted-text)]">Topic pages show where scores usually drop.</p>
        </li>
        <li>
          <Link href={loc(region === "US" ? PN.usLessons : PN.caHub)} className="font-medium text-primary hover:underline">
            {region === "US" ? "Test PN lessons" : "Open REx-PN hub"}
          </Link>
          <p className="mt-0.5 text-xs text-[var(--theme-muted-text)]">Most students miss a few safety stems at first.</p>
        </li>
        <li>
          <Link href={loc(loginWithCallback(RN.appExams))} className="font-medium text-primary hover:underline">
            Timed practice exams
          </Link>
          <p className="mt-0.5 text-xs text-[var(--theme-muted-text)]">Sign in to save a mock when you are ready.</p>
        </li>
      </ul>

      <p className="mt-3 text-xs text-[var(--theme-muted-text)]">
        NP quick path:{" "}
        <Link href={loc(NP.practiceProgrammatic)} className="font-medium text-primary hover:underline">
          NP exam prep
        </Link>{" "}
        ·{" "}
        <Link href={loc(HUB.examLessons)} className="font-medium text-primary hover:underline">
          Lesson index
        </Link>
      </p>
    </div>
  );
}
