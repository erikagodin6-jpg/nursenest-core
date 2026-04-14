"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { GLOBAL_REGION_COOKIE, parseGlobalRegionCookie } from "@/lib/region/global-region-cookie";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

type HintConfig = {
  label: string;
  hubHref: string;
  tagHref: string;
};

const REGION_HINTS: Partial<Record<GlobalRegionSlug, HintConfig>> = {
  china: {
    label: "China nursing",
    hubHref: "/exams/china",
    tagHref: "/blog/tag/China%20nursing",
  },
  "south-korea": {
    label: "Korea nursing",
    hubHref: "/exams/korea",
    tagHref: "/blog/tag/Korea%20nursing",
  },
  india: {
    label: "India nursing",
    hubHref: "/exams/india",
    tagHref: "/blog/tag/India%20nursing",
  },
  philippines: {
    label: "Philippines nursing",
    hubHref: "/exams/philippines",
    tagHref: "/blog/tag/philippines-nle",
  },
  uae: {
    label: "Middle East nursing",
    hubHref: "/exams/middle-east",
    tagHref: "/blog/tag/Middle%20East%20nursing",
  },
  "saudi-arabia": {
    label: "Middle East nursing",
    hubHref: "/exams/middle-east",
    tagHref: "/blog/tag/Middle%20East%20nursing",
  },
  aus: {
    label: "Australia nursing",
    hubHref: "/exams/australia",
    tagHref: "/blog/tag/Australia%20nursing",
  },
};

function readGlobalRegionCookie(): GlobalRegionSlug | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${GLOBAL_REGION_COOKIE}=([^;]*)`));
  const raw = m?.[1] ? decodeURIComponent(m[1]) : "";
  return parseGlobalRegionCookie(raw);
}

function hintFromCookie(): HintConfig | null {
  const slug = readGlobalRegionCookie();
  if (!slug) return null;
  return REGION_HINTS[slug] ?? null;
}

/**
 * Cookie-driven regional shortcuts on the blog index (client-only to preserve route ISR).
 * Pathname still surfaces the regional strip in the header via `resolveRegionalMarketingStrip`.
 */
export function RegionalBlogDiscoveryHint() {
  const hint = useSyncExternalStore(
    () => () => {
      /* no subscription — cookie changes require navigation */
    },
    hintFromCookie,
    () => null,
  );

  if (!hint) return null;

  return (
    <div
      className="mb-8 rounded-xl border border-[var(--semantic-border-soft)] p-4"
      style={{ background: "color-mix(in srgb, var(--semantic-panel-cool) 10%, var(--semantic-surface))" }}
      role="region"
      aria-label="Regional shortcuts"
    >
      <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
        Browsing from your saved region ({hint.label})
      </p>
      <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
        Exam hub content is country-specific; NCLEX-style lessons are English-first. These links respect your{" "}
        <code className="rounded bg-[var(--theme-muted)]/15 px-1 text-xs">nn_global_region</code> cookie.
      </p>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
        <Link className="text-primary underline-offset-4 hover:underline" href={hint.hubHref}>
          {hint.label} hub
        </Link>
        <Link className="text-primary underline-offset-4 hover:underline" href={hint.tagHref}>
          {hint.label} blog tag
        </Link>
      </p>
    </div>
  );
}
