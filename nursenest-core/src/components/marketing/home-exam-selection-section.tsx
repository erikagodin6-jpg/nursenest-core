"use client";

import { ArrowRight, Stethoscope, HeartPulse, Award, Dna, GraduationCap } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { publicExamPrepHubDestinations, type MarketingRegionToggle } from "@/lib/navigation/canonical-destinations";
import { publicNewGradStudyDestinations } from "@/lib/navigation/marketing-pathway-nav-destinations";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { getPathwayHubCta } from "@/lib/copy/cta-copy";
import { getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";

function safeT(t: ((k: string) => string) | undefined, key: string, fallback: string) {
  try {
    const v = t?.(key);
    return typeof v === "string" && v.trim() ? v : fallback;
  } catch {
    return fallback;
  }
}

function safeLocale(l?: string) {
  return l || "en";
}

function safeRegion(r?: string) {
  return r || "CA";
}

function safePath(locale: string, path: string) {
  try {
    return withMarketingLocale(locale, path);
  } catch {
    return path;
  }
}

export function HomeExamSelectionSection() {
  let locale = "en";
  let t: ((k: string) => string) | undefined;

  try {
    const ctx = useMarketingI18n();
    locale = safeLocale(ctx.locale);
    t = ctx.t;
  } catch {}

  let region: MarketingRegionToggle = "CA";
  try {
    region = safeRegion(useNursenestRegion().region) as MarketingRegionToggle;
  } catch {}

  let hubs: any = {};
  try {
    hubs = publicExamPrepHubDestinations(region);
  } catch {}

  let newGradHref = "/lessons";
  try {
    newGradHref = publicNewGradStudyDestinations(region, hubs?.rn || "").hubHref;
  } catch {}

  const cards = [
    {
      id: "rn",
      label: "RN",
      href: safePath(locale, hubs?.rn || "/lessons"),
      title: safeT(t, "home.conversion.examCard.rnTitle", "Registered Nurse"),
      desc: safeT(t, "home.conversion.examCard.rnDesc", "Prepare for RN exams"),
    },
    {
      id: "pn",
      label: "PN",
      href: safePath(locale, hubs?.pn || "/lessons"),
      title: safeT(
        t,
        region === "US"
          ? "home.conversion.examCard.pnTitleUS"
          : "home.conversion.examCard.pnTitleCA",
        "Practical Nurse"
      ),
      desc: safeT(
        t,
        region === "US"
          ? "home.conversion.examCard.pnDescUS"
          : "home.conversion.examCard.pnDescCA",
        "Prepare for PN exams"
      ),
    },
    {
      id: "np",
      label: "NP",
      href: safePath(locale, hubs?.np || "/lessons"),
      title: safeT(
        t,
        region === "US"
          ? "home.conversion.examCard.npTitleUS"
          : "home.conversion.examCard.npTitleCA",
        "Nurse Practitioner"
      ),
      desc: safeT(
        t,
        region === "US"
          ? "home.conversion.examCard.npDescUS"
          : "home.conversion.examCard.npDescCA",
        "Advanced practice prep"
      ),
    },
    {
      id: "newgrad",
      label: "New Grad",
      href: safePath(locale, newGradHref),
      title: "New Grad",
      desc: "Transition-to-practice support and study tools",
    },
    {
      id: "allied",
      label: "Allied",
      href: safePath(locale, hubs?.allied || "/lessons"),
      title: safeT(t, "home.conversion.examCard.alliedTitle", "Allied Health"),
      desc: safeT(t, "home.conversion.examCard.alliedDesc", "Prep for allied health exams"),
    },
  ];

  return (
    <section className="border-b border-[var(--border-subtle)] bg-[var(--page-bg)] py-12">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-2xl font-bold">
          {formatTitleCase("Choose Your Exam Hub", locale)}
        </h2>

        <p className="mt-3 text-[var(--theme-muted-text)]">
          {formatSentenceCase(
            safeT(
              t,
              "home.conversion.examSelectionSub",
              "Select your pathway to begin studying"
            ),
            locale
          )}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => (
            <MarketingTrackedLink
              key={c.id}
              href={c.href}
              event={PH.marketingHomePathwayCardPrimary}
              eventProps={{ pathway: c.id, region }}
              className="rounded-xl border p-4 hover:shadow-md transition"
            >
              <div className="font-semibold">{c.title}</div>
              <p className="mt-2 text-sm text-muted">{c.desc}</p>

              <div className="mt-3 flex items-center justify-center gap-1 text-sm font-semibold text-primary">
                {formatTitleCase(getPathwayHubCta(c.label), locale)}
                <ArrowRight className="h-4 w-4" />
              </div>
            </MarketingTrackedLink>
          ))}
        </div>
      </div>
    </section>
  );
}