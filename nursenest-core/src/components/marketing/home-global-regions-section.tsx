"use client";

import { ArrowRight, Globe2 } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";

const DEFAULT_CARDS = [
  { id: "ca", title: "Canada", body: "NCLEX-RN, REx-PN, and Canadian prep", path: "/canada" },
  { id: "us", title: "United States", body: "NCLEX-RN and NCLEX-PN prep", path: "/us" },
  { id: "ph", title: "Philippines", body: "NLE exam preparation", path: "/philippines" },
  { id: "me", title: "Middle East", body: "Prometric and regional exams", path: "/middle-east" },
];

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

function safePath(locale: string, path: string) {
  try {
    return withMarketingLocale(locale, path);
  } catch {
    return path;
  }
}

export function HomeGlobalRegionsSection({
  visibleCardIds,
}: {
  visibleCardIds: readonly string[];
}) {
  let locale = "en";
  let t: ((k: string) => string) | undefined;

  try {
    const ctx = useMarketingI18n();
    locale = safeLocale(ctx.locale);
    t = ctx.t;
  } catch {}

  const cards = DEFAULT_CARDS.filter(
    (c) => visibleCardIds?.length ? visibleCardIds.includes(c.id) : true
  );

  if (!cards.length) return null;

  return (
    <section className="border-b border-[var(--border-subtle)] bg-[var(--page-bg)] py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-primary flex justify-center items-center gap-2">
            <Globe2 className="h-4 w-4" />
            {safeT(t, "pages.home.globalRegions.eyebrow", "Global coverage")}
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {safeT(
              t,
              "pages.home.globalRegions.title",
              "Prepare for exams worldwide"
            )}
          </h2>

          <p className="mt-2 text-muted">
            {safeT(
              t,
              "pages.home.globalRegions.subtitle",
              "Explore exam prep across major regions"
            )}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <MarketingTrackedLink
              key={c.id}
              href={safePath(locale, c.path)}
              event={PH.marketingHomeExploreHubClick}
              eventProps={{ region_card: c.id }}
              className="rounded-xl border p-4 hover:shadow-md transition"
            >
              <div className="font-semibold">{c.title}</div>
              <p className="mt-2 text-sm text-muted">{c.body}</p>

              <div className="mt-3 flex items-center gap-1 text-primary text-sm font-semibold">
                {safeT(t, "pages.home.globalRegions.cta", "Explore")}
                <ArrowRight className="h-4 w-4" />
              </div>
            </MarketingTrackedLink>
          ))}
        </div>
      </div>
    </section>
  );
}