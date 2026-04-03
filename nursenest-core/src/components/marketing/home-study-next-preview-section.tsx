import Link from "next/link";
import type { AdaptiveLearnerRecommendations } from "@/lib/learner/adaptive-recommendations";
import { AdaptiveStudyOverview } from "@/components/student/adaptive-study-overview";

type Props = {
  adaptive: AdaptiveLearnerRecommendations;
  /** Defaults for default-locale marketing home; pass prefixed hrefs from `/[locale]` pages. */
  pricingHref?: string;
  signupHref?: string;
};

/**
 * Marketing homepage: illustrates Study Next with the same engine as subscribers, using fixed sample inputs.
 * Not indexed as personalized content — plain section, no structured data for “your” plan.
 */
export function HomeStudyNextPreviewSection({
  adaptive,
  pricingHref = "/pricing",
  signupHref = "/signup",
}: Props) {
  return (
    <section
      className="nn-card space-y-3 p-5 sm:p-6"
      aria-labelledby="home-study-next-preview-title"
      data-testid="home-study-next-preview"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="home-study-next-preview-title" className="text-lg font-bold text-[var(--theme-heading-text)] sm:text-xl">
            See your next study step
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Sample preview — numbers and steps below are illustrative. After you subscribe, this panel reflects your real practice,
            exam date, and weak areas.
          </p>
        </div>
        <Link
          href={pricingHref}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Continue your plan
        </Link>
      </div>
      <AdaptiveStudyOverview adaptive={adaptive} showHeading={false} compact subscriber={false} />
      <p className="text-xs text-muted-foreground">
        <Link href={signupHref} className="font-semibold text-primary underline-offset-2 hover:underline">
          Create a free account
        </Link>{" "}
        to start logging practice; upgrade anytime for full Study Next and the question bank.
      </p>
    </section>
  );
}
